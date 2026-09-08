#!/usr/bin/env python3
"""Prepare immutable Next.js releases and activate with verified rollback."""
import argparse
import fcntl
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import signal
import stat
import subprocess
import sys
import time
import urllib.request


class DeployError(RuntimeError):
    pass


def clean_env():
    return {key: value for key, value in os.environ.items()
            if key in {'PATH', 'HOME', 'USER', 'LOGNAME', 'LANG', 'LC_ALL', 'TMPDIR'}}


def run(command, cwd=None):
    result = subprocess.run(command, cwd=cwd, env=clean_env(), text=True,
                            stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                            timeout=1800 if Path(command[0]).name == 'npm' else 30)
    if result.returncode:
        raise DeployError('command failed: ' + Path(command[0]).name)
    return result.stdout.strip()


def validate_release(root, release_id, version, allow_activated=False):
    if not re.fullmatch(r'[0-9a-f]{40}-[0-9a-f]{12}', release_id):
        raise DeployError('invalid release identifier')
    release = root / 'releases' / release_id
    if release.is_symlink() or release.resolve() != release or not release.is_dir():
        raise DeployError('release path is not a real directory under root')
    if (release / '.activated').exists() and not allow_activated:
        raise DeployError('an activated release cannot be rebuilt')
    manifest = json.loads((release / 'deploy-manifest.json').read_text())
    if manifest.get('commit') != release_id[:40]:
        raise DeployError('manifest commit mismatch')
    if manifest.get('node_version') != version or (release / '.node-version').read_text().strip() != version:
        raise DeployError('manifest Node version mismatch')
    actual_hash = hashlib.sha256((release / 'package-lock.json').read_bytes()).hexdigest()
    if manifest.get('lock_sha256') != actual_hash:
        raise DeployError('lockfile hash mismatch')
    return release


def atomic_link(link, target):
    temp = link.with_name(link.name + '.tmp-' + str(os.getpid()))
    try:
        temp.symlink_to(target)
        os.replace(temp, link)
    finally:
        temp.unlink(missing_ok=True)


def process_record(name):
    # A fresh PM2 daemon prints a banner before its one-line JSON payload.
    processes = json.loads(run(['pm2', 'jlist']).splitlines()[-1])
    matches = [item for item in processes if item.get('name') == name]
    if len(matches) > 1:
        raise DeployError('multiple matching PM2 processes')
    if not matches:
        return None
    return matches[0].get('pm2_env', {})


def process_info(name):
    env = process_record(name)
    return None if env is None else {'status': env.get('status'), 'cwd': env.get('pm_cwd')}


def health(name, port, cwd, commit=None, attempts=30):
    for _ in range(attempts):
        try:
            info = process_info(name)
            if info != {'status': 'online', 'cwd': str(cwd)}:
                raise DeployError('PM2 process identity mismatch')
            base = 'http://127.0.0.1:' + str(port)
            with urllib.request.urlopen(base + '/', timeout=3) as response:
                if response.status != 200:
                    raise DeployError('HTTP health failed')
            if commit:
                with urllib.request.urlopen(base + '/deploy-version.json', timeout=3) as response:
                    if json.load(response).get('commit') != commit:
                        raise DeployError('HTTP release identity mismatch')
            return
        except (OSError, ValueError, DeployError):
            time.sleep(1)
    raise DeployError('health verification failed')


def start_process(root, cwd, name, port, node):
    config = root / '.activation.config.cjs'
    baseline = Path(__file__).resolve().parents[1] / 'ecosystem.config.cjs'
    specification = json.loads(run([str(node), '-e', 'process.stdout.write(JSON.stringify(require(process.argv[1])))', str(baseline)]))
    app = {**specification['apps'][0], 'name': name, 'cwd': str(cwd),
           'args': ['start', '-p', str(port), '--hostname', '127.0.0.1'], 'interpreter': str(node),
           'env': {'NODE_ENV': 'production', 'PORT': str(port)}}
    config.write_text('module.exports = ' + json.dumps({'apps': [app]}) + ';\n')
    config.chmod(0o600)
    try:
        if process_info(name):
            run(['pm2', 'delete', name])
        run(['pm2', 'start', str(config), '--only', name])
    finally:
        config.unlink(missing_ok=True)


def prepare(release, legacy):
    env_source = legacy / '.env.local'
    env_target = release / '.env.local'
    if env_target.exists() or env_target.is_symlink():
        raise DeployError('uploaded release must not contain .env.local')
    if not env_source.is_file():
        raise DeployError('legacy .env.local is required')
    if env_source.exists():
        if env_source.is_symlink() or not env_source.is_file():
            raise DeployError('legacy environment must be a regular file')
        descriptor = os.open(env_target, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        with os.fdopen(descriptor, 'wb') as target:
            target.write(env_source.read_bytes())
    (release / 'public').mkdir(exist_ok=True)
    (release / 'public' / 'deploy-version.json').write_text(json.dumps({'commit': release.name[:40]}))
    print('Installing release dependencies', flush=True)
    run(['npm', 'ci', '--no-audit', '--no-fund'], release)
    print('Building release', flush=True)
    run(['npm', 'run', 'build'], release)
    if not (release / '.next' / 'BUILD_ID').is_file():
        raise DeployError('build did not produce BUILD_ID')
    (release / '.prepared').write_text(hashlib.sha256((release / 'deploy-manifest.json').read_bytes()).hexdigest())


def preflight(root, legacy, name, allow_new=False):
    current = root / 'current'
    if current.exists() and not current.is_symlink():
        raise DeployError('current must be a symlink')
    previous = current.resolve() if current.is_symlink() else legacy
    if previous != legacy and (previous.parent != root / 'releases' or not previous.is_dir()):
        raise DeployError('current points outside release storage')
    old_info = process_info(name)
    if old_info is None and not allow_new:
        raise DeployError('existing PM2 process is required')
    if old_info and old_info != {'status': 'online', 'cwd': str(previous)}:
        raise DeployError('existing PM2 process does not match expected active directory')
    return previous, old_info


def snapshot_process(name):
    record = process_record(name)
    if record is None:
        raise DeployError('original process disappeared before snapshot')
    if record.get('exec_mode', 'fork_mode') != 'fork_mode' or record.get('watch') or record.get('cron_restart'):
        raise DeployError('rollback supports only single fork processes without watch or cron')
    mapping = {'pm_exec_path': 'script', 'pm_cwd': 'cwd', 'exec_interpreter': 'interpreter',
               'args': 'args', 'node_args': 'node_args', 'env': 'env',
               'autorestart': 'autorestart', 'max_restarts': 'max_restarts',
               'min_uptime': 'min_uptime', 'restart_delay': 'restart_delay',
               'exp_backoff_restart_delay': 'exp_backoff_restart_delay',
               'max_memory_restart': 'max_memory_restart', 'kill_timeout': 'kill_timeout',
               'listen_timeout': 'listen_timeout', 'wait_ready': 'wait_ready',
               'pm_out_log_path': 'out_file', 'pm_err_log_path': 'error_file',
               'merge_logs': 'merge_logs', 'log_date_format': 'log_date_format'}
    specification = {target: record[source] for source, target in mapping.items() if source in record}
    if not all(specification.get(key) for key in ('script', 'cwd', 'interpreter')):
        raise DeployError('original PM2 launch specification is incomplete')
    # PM2 treats a script containing spaces as a shell command, even in JSON.
    # Keep the same resolved executable but express it relative to the saved cwd.
    script = specification['script']
    if ' ' in script:
        script = os.path.relpath(script, specification['cwd'])
        if ' ' in script:
            raise DeployError('original script cannot be represented safely in PM2')
    return {**specification, 'script': script, 'name': name, 'exec_mode': 'fork', 'instances': 1}


def write_private(path, payload):
    descriptor = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW, 0o600)
    with os.fdopen(descriptor, 'w') as output:
        json.dump(payload, output)
        output.flush()
        os.fsync(output.fileno())


def read_private(path):
    descriptor = os.open(path, os.O_RDONLY | os.O_NOFOLLOW)
    with os.fdopen(descriptor) as source:
        metadata = os.fstat(source.fileno())
        if not stat.S_ISREG(metadata.st_mode) or stat.S_IMODE(metadata.st_mode) != 0o600 or metadata.st_uid != os.getuid():
            raise DeployError('recovery state must be an owned regular file with mode 0600')
        return json.load(source)


def restore_snapshot(root, journal, name, port):
    previous = Path(journal['previous'])
    snapshot = root / '.rollback.config.json'
    specification = read_private(snapshot)
    expected = specification.get('apps')
    if journal['had_process']:
        if not isinstance(expected, list) or len(expected) != 1 or expected[0].get('name') != name or expected[0].get('cwd') != str(previous):
            raise DeployError('rollback snapshot does not match journal')
    elif expected != []:
        raise DeployError('rollback snapshot must record no previous process')
    if journal['had_link']:
        atomic_link(root / 'current', previous)
    else:
        (root / 'current').unlink(missing_ok=True)
    if process_info(name):
        run(['pm2', 'delete', name])
    if journal['had_process']:
        run(['pm2', 'start', str(snapshot), '--only', name])
        commit = previous.name[:40] if previous.parent == root / 'releases' else None
        health(name, port, previous, commit)
    run(['pm2', 'save', '--force'])
    (root / '.activation-journal.json').unlink()
    snapshot.unlink()


def recover(root, legacy, name, port, release_id=None):
    journal = read_private(root / '.activation-journal.json')
    previous = Path(journal['previous'])
    if release_id is not None and journal.get('release') != str(root / 'releases' / release_id):
        raise DeployError('recovery release does not match journal')
    if journal.get('root') != str(root) or journal.get('name') != name or journal.get('port') != port:
        raise DeployError('recovery root, name or port does not match journal')
    if not isinstance(journal.get('had_link'), bool) or not isinstance(journal.get('had_process'), bool):
        raise DeployError('invalid recovery journal flags')
    if previous != previous.resolve() or not previous.is_dir():
        raise DeployError('recovery previous directory is not canonical')
    if previous != legacy and (previous.parent != root / 'releases' or not re.fullmatch(r'[0-9a-f]{40}-[0-9a-f]{12}', previous.name)):
        raise DeployError('recovery previous directory is outside release storage')
    restore_snapshot(root, journal, name, port)


def activate(root, release, legacy, name, port, node, allow_new=False):
    current = root / 'current'
    previous, old_info = preflight(root, legacy, name, allow_new)
    journal = {'root': str(root), 'previous': str(previous), 'release': str(release),
               'had_link': current.is_symlink(), 'had_process': old_info is not None,
               'name': name, 'port': port}
    original = snapshot_process(name) if old_info else None
    if original and original['cwd'] != str(previous):
        raise DeployError('original PM2 process changed before snapshot')
    write_private(root / '.rollback.config.json', {'apps': [original] if original else []})
    write_private(root / '.activation-journal.json', journal)
    (release / '.activated').touch()
    try:
        atomic_link(current, release)
        start_process(root, release, name, port, node)
        health(name, port, release, release.name[:40])
        run(['pm2', 'save'])
        (root / '.activation-journal.json').unlink()
        (root / '.rollback.config.json').unlink()
    except BaseException as error:
        try:
            restore_snapshot(root, journal, name, port)
        except BaseException as rollback_error:
            raise DeployError('activation failed; rollback verification also failed; use --recover') from rollback_error
        raise DeployError('activation failed; previous state restored') from error


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', required=True)
    parser.add_argument('--release', required=True)
    parser.add_argument('--node-version')
    parser.add_argument('--legacy-dir', required=True)
    modes = parser.add_mutually_exclusive_group()
    modes.add_argument('--prepare-only', action='store_true')
    modes.add_argument('--activate-only', action='store_true')
    modes.add_argument('--recover', action='store_true')
    parser.add_argument('--allow-new-process', action='store_true')
    parser.add_argument('--name', default='mestrefabio')
    parser.add_argument('--port', default=3010, type=int)
    args = parser.parse_args()
    if not re.fullmatch(r'[a-zA-Z0-9_-]+', args.name) or not 1024 <= args.port <= 65535:
        raise DeployError('invalid PM2 name or port')
    if args.allow_new_process and (args.name == 'mestrefabio' or args.port == 3010):
        raise DeployError('new process allowed only for isolated tests')
    root, legacy = Path(args.root), Path(args.legacy_dir)
    if not root.is_absolute() or root.resolve() != root or not legacy.is_absolute() or legacy.resolve() != legacy:
        raise DeployError('root and legacy must be canonical absolute paths')
    root.mkdir(parents=True, exist_ok=True)
    with (root / '.deploy.lock').open('a') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError as error:
            raise DeployError('another deployment holds the lock') from error
        if args.recover:
            recover(root, legacy, args.name, args.port, args.release)
            print('Recovered previous process', flush=True)
            return
        if (root / '.activation-journal.json').exists():
            raise DeployError('unfinished activation journal: use --recover with the same root, name and port')
        orphan = root / '.rollback.config.json'
        if orphan.exists() or orphan.is_symlink():
            read_private(orphan)
            orphan.unlink()
        if not re.fullmatch(r'[0-9a-f]{40}-[0-9a-f]{12}', args.release):
            raise DeployError('invalid release identifier')
        version = args.node_version or json.loads((root / 'releases' / args.release / 'deploy-manifest.json').read_text())['node_version']
        release = validate_release(root, args.release, version, args.activate_only)
        node_path = shutil.which('node')
        if not node_path or run([node_path, '--version']) != 'v' + version:
            raise DeployError('remote Node version mismatch')
        node = Path(node_path).resolve()
        os.environ['PATH'] = str(node.parent) + os.pathsep + os.environ.get('PATH', '')
        preflight(root, legacy, args.name, args.allow_new_process)
        if args.activate_only:
            marker = release / '.prepared'
            expected = hashlib.sha256((release / 'deploy-manifest.json').read_bytes()).hexdigest()
            if not marker.is_file() or marker.read_text() != expected or not (release / '.next' / 'BUILD_ID').is_file():
                raise DeployError('release has no verified preparation marker')
        else:
            prepare(release, legacy)
        if not args.prepare_only:
            activate(root, release, legacy, args.name, args.port, node, args.allow_new_process)
        print(('Prepared ' if args.prepare_only else 'Activated ') + args.release)


def interrupted(_signum, _frame):
    raise KeyboardInterrupt('deployment interrupted')


if __name__ == '__main__':
    signal.signal(signal.SIGTERM, interrupted)
    try:
        main()
    except Exception as error:
        # Arbitrary command errors can include environment values; never print them.
        print('Deploy error: ' + (str(error) if isinstance(error, DeployError) else type(error).__name__), file=sys.stderr)
        sys.exit(1)
