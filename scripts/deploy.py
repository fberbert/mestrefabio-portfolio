#!/usr/bin/env python3
"""Publish an immutable Git snapshot. Build and runtime share the remote Node."""
import argparse
import hashlib
import io
import json
import os
from pathlib import Path, PurePosixPath
import re
import secrets
import shlex
import subprocess
import sys
import tarfile
import tempfile

REPO = Path(__file__).resolve().parents[1]
DEFAULT_ROOT = '/home/fabio/apps/mestrefabio'
DEFAULT_LEGACY = '/home/fabio/projetos/mestrefabio-portfolio'
RELEASE_PATTERN = r'[0-9a-f]{40}-[0-9a-f]{12}'


def git(repo, *args):
    return subprocess.run(['git', '-C', str(repo), *args], check=True,
                          capture_output=True).stdout


def snapshot(repo, destination):
    """Export committed files only; refuse secrets and archive links."""
    if git(repo, 'status', '--porcelain', '--untracked-files=all').strip():
        raise ValueError('O checkout deve estar limpo (clean), incluindo arquivos novos.')
    commit = git(repo, 'rev-parse', 'HEAD').decode().strip()
    archive = git(repo, 'archive', '--format=tar', commit)
    with tarfile.open(fileobj=io.BytesIO(archive)) as tar:
        for member in tar.getmembers():
            path = PurePosixPath(member.name)
            if path.is_absolute() or '..' in path.parts or not (member.isfile() or member.isdir()):
                raise ValueError('Arquivo Git contém link ou caminho não permitido.')
            if any(part == '.env' or (part.startswith('.env.') and part not in
                   {'.env.example', '.env.sample'}) for part in path.parts):
                raise ValueError('Arquivo env potencialmente secreto está versionado.')
        destination.mkdir(parents=True, exist_ok=False)
        tar.extractall(destination, filter='data')
    version = (destination / '.node-version').read_text().strip()
    if not re.fullmatch(r'\d+\.\d+\.\d+', version):
        raise ValueError('.node-version deve fixar uma versão exata.')
    manifest = {
        'commit': commit,
        'node_version': version,
        'lock_sha256': hashlib.sha256((destination / 'package-lock.json').read_bytes()).hexdigest(),
    }
    (destination / 'deploy-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    return destination, manifest


def validate_target(host, root):
    if not re.fullmatch(r'[A-Za-z0-9_][A-Za-z0-9_.@-]*', host):
        raise ValueError('Host SSH inválido.')
    path = PurePosixPath(root)
    if (not path.is_absolute() or len(path.parts) < 4 or '..' in path.parts
            or str(path) != root or any(ord(char) < 32 for char in root)):
        raise ValueError('Use uma raiz absoluta dedicada a releases, sem caminhos relativos.')


def ssh_args(host, args):
    return ['ssh', '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=10',
            '-o', 'ServerAliveInterval=15', '-o', 'ServerAliveCountMax=3',
            host, shlex.join([str(arg) for arg in args])]


def rsync_args(stage, destination):
    return ['rsync', '-az', '--delete', '--safe-links', '--protect-args',
            '-e', 'ssh -o BatchMode=yes -o ConnectTimeout=10 -o ServerAliveInterval=15 -o ServerAliveCountMax=3',
            '--', str(stage) + '/', destination]


# Executed via python3 on the remote host, with arguments separately shell-quoted.
# Never use --delete on the legacy checkout or an existing/active release.
CREATE_RELEASE = '''
from pathlib import Path
import re, sys
root = Path(sys.argv[1])
release = sys.argv[2]
if not root.is_absolute() or len(root.parts) < 4 or root.resolve() != root:
    raise SystemExit('Invalid release root or symlink')
if not re.fullmatch(r'[0-9a-f]{40}-[0-9a-f]{12}', release):
    raise SystemExit('Invalid release ID')
releases = root / 'releases'
if releases.is_symlink():
    raise SystemExit('Symlink releases directory refused')
releases.mkdir(parents=True, exist_ok=True)
(root / 'releases' / release).mkdir(mode=0o700)
'''


def activate(host, root, release, legacy, node_version, prepare_only=False, activate_only=False, recover=False):
    if not re.fullmatch(RELEASE_PATTERN, release):
        raise ValueError('Identificador de release inválido.')
    helper = f'{root}/releases/{release}/scripts/deploy_remote.py'
    args = ['python3', helper, '--root', root, '--release', release,
            '--legacy-dir', legacy]
    if node_version:
        args.extend(['--node-version', node_version])
    if recover:
        args.append('--recover')
    if prepare_only:
        args.append('--prepare-only')
    if activate_only:
        args.append('--activate-only')
    subprocess.run(ssh_args(host, args), check=True)


def publish(stage, manifest, host, root, legacy, prepare_only):
    validate_target(host, root)
    validate_target(host, legacy)
    release = manifest['commit'] + '-' + secrets.token_hex(6)
    print(f'Preparando release {release}', flush=True)
    subprocess.run(ssh_args(host, ['python3', '-c', CREATE_RELEASE, root, release]), check=True)
    subprocess.run(rsync_args(stage, f'{host}:{root}/releases/{release}/'), check=True)
    activate(host, root, release, legacy, manifest['node_version'], prepare_only)
    print(f'{"Preparação" if prepare_only else "Deploy"} concluído: {release}', flush=True)
    return release


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--host', default='two')
    parser.add_argument('--root', default=DEFAULT_ROOT)
    parser.add_argument('--legacy-dir', default=DEFAULT_LEGACY)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument('--prepare-only', action='store_true', help='Compila sem ativar a versão.')
    mode.add_argument('--activate', metavar='RELEASE', help='Ativa uma release já preparada; também permite rollback.')
    mode.add_argument('--recover', metavar='RELEASE', help='Recupera a ativação interrompida registrada no servidor.')
    mode.add_argument('--check', action='store_true', help='Valida/exporta localmente, sem conexão remota.')
    args = parser.parse_args(argv)
    try:
        validate_target(args.host, args.root)
        validate_target(args.host, args.legacy_dir)
        if args.activate or args.recover:
            activate(args.host, args.root, args.activate or args.recover, args.legacy_dir,
                     None, activate_only=bool(args.activate), recover=bool(args.recover))
        else:
            cache = Path(os.environ.get('TMPDIR', str(Path.home() / '.cache' / 'mestrefabio-deploy')))
            cache.mkdir(parents=True, exist_ok=True)
            with tempfile.TemporaryDirectory(prefix='release-', dir=cache) as temporary:
                stage, manifest = snapshot(REPO, Path(temporary) / 'source')
                if args.check:
                    print(json.dumps(manifest, indent=2))
                else:
                    publish(stage, manifest, args.host, args.root, args.legacy_dir, args.prepare_only)
    except (OSError, ValueError, subprocess.CalledProcessError) as error:
        # Never echo captured command outputs or the environment on failure.
        print(f'Deploy interrompido: {type(error).__name__}. '
              'Confira pré-condições, checkout limpo e a etapa indicada acima.', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
