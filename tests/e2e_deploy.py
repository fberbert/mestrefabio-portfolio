#!/usr/bin/env python3
"""Opt-in real npm/PM2/HTTP deployment exercise in a disposable HOME.
Run with Node 22.21.0 and pm2 on PATH: python3 tests/e2e_deploy.py
"""
import hashlib
import json
import os
from pathlib import Path
import shutil
import socket
import subprocess
import tempfile
import time
import urllib.request

REPO = Path(__file__).resolve().parents[1]
SERVER = """
const http = require('node:http');
const fs = require('node:fs');
const port = Number(process.argv[process.argv.indexOf('-p') + 1]);
http.createServer((req, res) => {
  if (req.url === '/deploy-version.json') {
    res.setHeader('content-type', 'application/json');
    res.end(fs.readFileSync('public/deploy-version.json'));
  } else if (req.url === '/env-check') {
    res.end(process.env.DEPLOY_TEST_SECRET ? 'leaked' : 'clean');
  } else { res.end('healthy fixture'); }
}).listen(port, '127.0.0.1');
"""


def fixture(root, digit, broken_build=False, bad_health=False):
    release_id = digit * 40 + '-' + digit * 12
    release = root / 'releases' / release_id
    release.mkdir(parents=True)
    package = {'name': 'deploy-fixture', 'version': '1.0.0', 'scripts': {'build': 'node build.cjs'}}
    (release / 'package.json').write_text(json.dumps(package))
    lock = {'name': 'deploy-fixture', 'version': '1.0.0', 'lockfileVersion': 3,
            'requires': True, 'packages': {'': {'name': 'deploy-fixture', 'version': '1.0.0'}}}
    (release / 'package-lock.json').write_text(json.dumps(lock))
    (release / '.node-version').write_text('22.21.0\n')
    build = "const fs = require('node:fs');\n"
    build += "fs.mkdirSync('node_modules/next/dist/bin', {recursive:true});\n"
    build += 'fs.writeFileSync("node_modules/next/dist/bin/next", ' + json.dumps(SERVER) + ');\n'
    build += "fs.mkdirSync('.next', {recursive:true});fs.writeFileSync('.next/BUILD_ID','fixture');\n"
    if bad_health:
        build += "fs.writeFileSync('public/deploy-version.json', JSON.stringify({commit:'wrong'}));\n"
    (release / 'build.cjs').write_text('process.exit(1);' if broken_build else build)
    shutil.copy2(REPO / 'ecosystem.config.cjs', release / 'ecosystem.config.cjs')
    manifest = {'commit': digit * 40, 'node_version': '22.21.0',
                'lock_sha256': hashlib.sha256((release / 'package-lock.json').read_bytes()).hexdigest()}
    (release / 'deploy-manifest.json').write_text(json.dumps(manifest))
    return release


def main():
    assert subprocess.check_output(['node', '--version'], text=True).strip() == 'v22.21.0'
    assert shutil.which('pm2'), 'pm2 must be installed for E2E'
    with tempfile.TemporaryDirectory(prefix='mestrefabio-e2e-') as temporary:
        base = Path(temporary)
        home = base / 'home'
        home.mkdir()
        root = base / 'deploy root'
        legacy = base / 'legacy'
        legacy.mkdir()
        (legacy / '.env.local').write_text('RESEND_API_KEY=re_dummy_e2e_only\n')
        with socket.socket() as available:
            available.bind(('127.0.0.1', 0))
            port = available.getsockname()[1]
        env = {**os.environ, 'HOME': str(home), 'DEPLOY_TEST_SECRET': 'must-not-reach-app'}
        env.pop('PM2_HOME', None)
        def deploy(release, *flags, success=True):
            result = subprocess.run(['python3', str(REPO / 'scripts/deploy_remote.py'),
                                     '--root', str(root), '--release', release.name,
                                     '--node-version', '22.21.0', '--legacy-dir', str(legacy),
                                     '--name', 'mestrefabio-e2e', '--port', str(port),
                                     '--allow-new-process', *flags], env=env, capture_output=True, text=True)
            if (result.returncode == 0) != success:
                raise AssertionError(result.stdout + result.stderr)
            return result
        def current_commit():
            with urllib.request.urlopen(f'http://127.0.0.1:{port}/deploy-version.json', timeout=3) as response:
                return json.load(response)['commit']
        try:
            # Model the legacy PM2 command, including a different entry point/env.
            (legacy / 'server.cjs').write_text(SERVER)
            legacy_config = base / 'legacy.config.json'
            legacy_config.write_text(json.dumps({'apps': [{'name': 'mestrefabio-e2e',
                'cwd': str(legacy), 'script': str(legacy / 'server.cjs'),
                'args': ['-p', str(port)], 'interpreter': shutil.which('node'),
                'env': {'LEGACY_TEST_SETTING': 'preserved'}}]}))
            subprocess.run(['pm2', 'start', str(legacy_config)], env=env, capture_output=True, check=True)
            legacy_failure = fixture(root, 'f', bad_health=True)
            deploy(legacy_failure, success=False)
            records = json.loads(subprocess.check_output(['pm2', 'jlist'], env=env, text=True).splitlines()[-1])
            previous = next(item['pm2_env'] for item in records if item['name'] == 'mestrefabio-e2e')
            assert previous['pm_exec_path'] == str(legacy / 'server.cjs')
            assert previous['env']['LEGACY_TEST_SETTING'] == 'preserved'
            assert not (root / 'current').exists()
            a = fixture(root, 'a')
            deploy(a, '--prepare-only')
            assert not (root / 'current').exists()
            deploy(a, '--activate-only')
            assert current_commit() == 'a' * 40
            with urllib.request.urlopen(f'http://127.0.0.1:{port}/env-check') as response:
                assert response.read() == b'clean'
            b = fixture(root, 'b')
            deploy(b)
            assert current_commit() == 'b' * 40
            assert (a / '.next/BUILD_ID').read_text() == 'fixture'
            failed_build = fixture(root, 'c', broken_build=True)
            deploy(failed_build, success=False)
            assert current_commit() == 'b' * 40
            assert (root / 'current').resolve() == b
            failed_health = fixture(root, 'd', bad_health=True)
            result = deploy(failed_health, success=False)
            assert 'previous state restored' in result.stderr, result.stdout + result.stderr
            assert current_commit() == 'b' * 40
            assert (root / 'current').resolve() == b
            assert not (root / '.activation-journal.json').exists()
            interrupted = fixture(root, 'e', bad_health=True)
            deploy(interrupted, '--prepare-only')
            command = ['python3', str(REPO / 'scripts/deploy_remote.py'), '--root', str(root),
                       '--release', interrupted.name, '--legacy-dir', str(legacy),
                       '--name', 'mestrefabio-e2e', '--port', str(port), '--activate-only']
            process = subprocess.Popen(command, env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            try:
                deadline = time.monotonic() + 15
                while time.monotonic() < deadline:
                    if ((root / '.activation-journal.json').exists()
                            and (root / 'current').resolve() == interrupted):
                        try:
                            if current_commit() == 'wrong':
                                break
                        except OSError:
                            pass
                    if process.poll() is not None:
                        raise AssertionError(process.communicate())
                    time.sleep(0.05)
                else:
                    raise AssertionError('activation did not reach journal checkpoint')
                process.kill()
                process.communicate(timeout=10)
            finally:
                if process.poll() is None:
                    process.kill()
                    process.communicate(timeout=10)
            deploy(interrupted, '--recover')
            assert current_commit() == 'b' * 40
            assert not (root / '.rollback.config.json').exists()
            deploy(a, '--activate-only')
            assert current_commit() == 'a' * 40
            print('PASS: real npm ci/build, prepare, PM2, HTTP identity, isolated env, build failure, automatic/manual rollback, exact legacy restore, SIGKILL recovery')
        except BaseException:
            # Allowlisted diagnostics only: never print the PM2 environment.
            records = json.loads(subprocess.check_output(['pm2', 'jlist'], env=env, text=True).splitlines()[-1])
            for record in records:
                state = record['pm2_env']
                print({key: state.get(key) for key in ('name', 'status', 'pm_cwd', 'pm_exec_path', 'exec_interpreter', 'args')})
            raise
        finally:
            subprocess.run(['pm2', 'kill'], env=env, capture_output=True, timeout=20)


if __name__ == '__main__':
    main()
