import importlib.util
import json
import hashlib
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('remote', Path(__file__).parents[1] / 'scripts/deploy_remote.py')
r = importlib.util.module_from_spec(spec)
spec.loader.exec_module(r)

class RemoteTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name) / 'app'
        self.release_id = 'a' * 40 + '-' + 'b' * 12
        self.release = self.root / 'releases' / self.release_id
        self.release.mkdir(parents=True)
        (self.root / 'legacy').mkdir()
        (self.root / 'legacy' / '.env.local').write_text('RESEND_API_KEY=re_test')
        (self.release / 'package-lock.json').write_text('{}')
        (self.release / '.node-version').write_text('22.21.0\n')
        (self.release / 'deploy-manifest.json').write_text(json.dumps({'commit': 'a'*40, 'node_version': '22.21.0', 'lock_sha256': hashlib.sha256(b'{}').hexdigest()}))
    def test_manifest(self):
        self.assertEqual(r.validate_release(self.root, self.release_id, '22.21.0'), self.release)
    def test_bad_id(self):
        with self.assertRaises(r.DeployError): r.validate_release(self.root, '../bad', '22.21.0')
    def test_hash(self):
        (self.release / 'package-lock.json').write_text('changed')
        with self.assertRaises(r.DeployError): r.validate_release(self.root, self.release_id, '22.21.0')
    def test_node(self):
        with self.assertRaises(r.DeployError): r.validate_release(self.root, self.release_id, '22.22.0')
    def test_activated(self):
        (self.release / '.activated').touch()
        with self.assertRaises(r.DeployError): r.validate_release(self.root, self.release_id, '22.21.0')
    def test_symlink(self):
        self.release.rename(self.root / 'outside')
        self.release.symlink_to(self.root / 'outside')
        with self.assertRaises(r.DeployError): r.validate_release(self.root, self.release_id, '22.21.0')
    def test_pm2_first_start_banner_is_not_json(self):
        payload = json.dumps([{'name': 'test', 'pm2_env': {'status': 'online', 'pm_cwd': '/release', 'SECRET': 'hidden'}}])
        with patch.object(r, 'run', return_value='[PM2] Daemon started\n' + payload):
            self.assertEqual(r.process_info('test'), {'status': 'online', 'cwd': '/release'})

    def test_environment(self):
        with patch.dict('os.environ', {'SECRET': 'hidden', 'NODE_OPTIONS': 'bad'}):
            self.assertNotIn('SECRET', r.clean_env())
            self.assertNotIn('NODE_OPTIONS', r.clean_env())
    def test_atomic(self):
        r.atomic_link(self.root / 'current', self.release)
        self.assertEqual((self.root / 'current').resolve(), self.release)
    def test_pm2_inspection_has_a_timeout(self):
        import subprocess
        with patch.object(r.subprocess, 'run', return_value=subprocess.CompletedProcess([], 0, '[]', '')) as command:
            r.run(['pm2', 'jlist'])
        self.assertEqual(command.call_args.kwargs.get('timeout'), 30)

    def test_subprocess_failure_redacted(self):
        import subprocess
        with patch.object(r.subprocess, 'run', return_value=subprocess.CompletedProcess([], 1, 'secret', 'secret')):
            with self.assertRaisesRegex(r.DeployError, 'command failed') as caught: r.run(['npm', 'ci'], self.release)
            self.assertNotIn('secret', str(caught.exception))

    def test_prepare_success(self):
        legacy = self.root / 'legacy'
        legacy.mkdir(exist_ok=True)
        (legacy / '.env.local').write_text('SECRET=never-print')
        def command(args, cwd):
            if args == ['npm', 'run', 'build']:
                (cwd / '.next').mkdir()
                (cwd / '.next' / 'BUILD_ID').write_text('build')
        with patch.object(r, 'run', side_effect=command): r.prepare(self.release, legacy)
        self.assertEqual((self.release / '.env.local').stat().st_mode & 0o777, 0o600)
        self.assertTrue((self.release / '.prepared').is_file())
    def test_build_failure_does_not_prepare(self):
        with patch.object(r, 'run', side_effect=r.DeployError('command failed')):
            with self.assertRaises(r.DeployError): r.prepare(self.release, self.root / 'legacy')
        self.assertFalse((self.release / '.prepared').exists())
        self.assertFalse((self.root / 'current').exists())
    def test_missing_build_id(self):
        with patch.object(r, 'run', return_value=''):
            with self.assertRaisesRegex(r.DeployError, 'BUILD_ID'): r.prepare(self.release, self.root / 'legacy')
    def original_snapshot(self):
        return {'name': 'test', 'cwd': str(self.root / 'legacy'), 'script': '/legacy/server.js', 'interpreter': '/old/node', 'env': {'DUMMY': 'dummy'}}
    def test_activation_and_rollback(self):
        previous = self.root / 'legacy'
        previous.mkdir(exist_ok=True)
        for failure in ['health', 'start', 'save', 'interrupt']:
            with self.subTest(failure=failure):
                info = {'status': 'online', 'cwd': str(previous)}
                def command(args):
                    if failure == 'save' and args == ['pm2', 'save']: raise r.DeployError('save failed')
                start_errors = [r.DeployError('start failed'), None] if failure == 'start' else [None, None]
                health_errors = [r.DeployError('health failed'), None] if failure == 'health' else [None, None]
                if failure == 'interrupt': health_errors = [KeyboardInterrupt(), None]
                with patch.object(r, 'snapshot_process', return_value=self.original_snapshot()), patch.object(r, 'process_info', return_value=info), patch.object(r, 'start_process', side_effect=start_errors) as start, patch.object(r, 'health', side_effect=health_errors), patch.object(r, 'run', side_effect=command):
                    with self.assertRaisesRegex(r.DeployError, 'previous state restored'):
                        r.activate(self.root, self.release, previous, 'test', 3100, Path('/usr/bin/node'))
                self.assertFalse((self.root / 'current').is_symlink())
                self.assertFalse((self.root / '.activation-journal.json').exists())
                self.assertEqual(start.call_args.args[1], self.release)
    def test_success(self):
        previous = self.root / 'legacy'
        previous.mkdir(exist_ok=True)
        with patch.object(r, 'snapshot_process', return_value=self.original_snapshot()), patch.object(r, 'process_info', return_value={'status': 'online', 'cwd': str(previous)}), patch.object(r, 'start_process'), patch.object(r, 'health') as health, patch.object(r, 'run'):
            r.activate(self.root, self.release, previous, 'test', 3100, Path('/usr/bin/node'))
        self.assertEqual((self.root / 'current').resolve(), self.release)
        self.assertFalse((self.root / '.activation-journal.json').exists())
        self.assertEqual(health.call_args.args[3], 'a'*40)
    def test_wrong_process(self):
        with patch.object(r, 'process_info', return_value={'status': 'online', 'cwd': '/other'}):
            with self.assertRaises(r.DeployError): r.activate(self.root, self.release, self.root / 'legacy', 'test', 3100, Path('/usr/bin/node'))
        self.assertFalse((self.root / 'current').exists())
    def test_rollback_failure_preserves_journal(self):
        previous = self.root / 'legacy'
        previous.mkdir(exist_ok=True)
        with patch.object(r, 'snapshot_process', return_value=self.original_snapshot()), patch.object(r, 'process_info', return_value={'status': 'online', 'cwd': str(previous)}), patch.object(r, 'start_process', side_effect=r.DeployError('start failed')), patch.object(r, 'run', side_effect=r.DeployError('restore failed')):
            with self.assertRaisesRegex(r.DeployError, 'rollback verification also failed'):
                r.activate(self.root, self.release, previous, 'test', 3100, Path('/usr/bin/node'))
        self.assertTrue((self.root / '.activation-journal.json').exists())

    def test_process_info_allowlist(self):
        payload = [{'name': 'test', 'pm2_env': {'status': 'online', 'pm_cwd': '/x', 'SECRET': 'hidden'}}]
        with patch.object(r, 'run', return_value=json.dumps(payload)):
            self.assertEqual(r.process_info('test'), {'status': 'online', 'cwd': '/x'})
            self.assertIsNone(r.process_info('missing'))
        with patch.object(r, 'run', return_value=json.dumps(payload * 2)):
            with self.assertRaises(r.DeployError): r.process_info('test')
    def test_start_uses_baseline_and_pinned_interpreter(self):
        calls = []
        def command(args, cwd=None):
            calls.append(args)
            if args[0] == '/node': return json.dumps({'apps': [{'script': 'node_modules/next/dist/bin/next'}]})
            if args[1] == 'start':
                self.assertIn('"interpreter": "/node"', Path(args[2]).read_text())
                self.assertIn(str(self.release), Path(args[2]).read_text())
                config = json.loads(Path(args[2]).read_text().removeprefix('module.exports = ').removesuffix(';\n'))
                self.assertEqual(config['apps'][0]['args'], ['start', '-p', '3100', '--hostname', '127.0.0.1'])
            return ''
        with patch.object(r, 'run', side_effect=command), patch.object(r, 'process_info', return_value={'status': 'online'}):
            r.start_process(self.root, self.release, 'test', 3100, Path('/node'))
        self.assertIn(['pm2', 'delete', 'test'], calls)
        self.assertFalse((self.root / '.activation.config.cjs').exists())
    def test_health_identity(self):
        import io
        class Response(io.StringIO):
            status = 200
        with patch.object(r, 'process_info', return_value={'status': 'online', 'cwd': str(self.release)}), patch.object(r.urllib.request, 'urlopen', side_effect=[Response('ok'), Response(json.dumps({'commit': 'a'*40}))]):
            r.health('test', 3100, self.release, 'a'*40, attempts=1)
        with patch.object(r, 'process_info', return_value={'status': 'online', 'cwd': '/wrong'}), patch.object(r.time, 'sleep'):
            with self.assertRaises(r.DeployError): r.health('test', 3100, self.release, attempts=1)
        with patch.object(r, 'process_info', return_value={'status': 'online', 'cwd': str(self.release)}), patch.object(r.urllib.request, 'urlopen', side_effect=[Response('ok'), Response('{"commit":"wrong"}')]), patch.object(r.time, 'sleep'):
            with self.assertRaises(r.DeployError): r.health('test', 3100, self.release, 'a'*40, attempts=1)
    def test_main_prepared_activation(self):
        (self.release / '.prepared').write_text(hashlib.sha256((self.release / 'deploy-manifest.json').read_bytes()).hexdigest())
        (self.release / '.next').mkdir()
        (self.release / '.next' / 'BUILD_ID').write_text('build')
        args = ['remote', '--root', str(self.root), '--release', self.release_id, '--legacy-dir', str(self.root / 'legacy'), '--node-version', '22.21.0', '--activate-only']
        with patch.object(r.sys, 'argv', args), patch.object(r, 'run', return_value='v22.21.0'), patch.object(r.shutil, 'which', return_value='/usr/bin/node'), patch.object(r, 'preflight'), patch.object(r, 'activate') as activate:
            r.main()
        activate.assert_called_once()
        (self.root / '.activation-journal.json').write_text('{}')
        with patch.object(r.sys, 'argv', args):
            with self.assertRaisesRegex(r.DeployError, 'unfinished activation'): r.main()
    def test_main_node_mismatch(self):
        args = ['remote', '--root', str(self.root), '--release', self.release_id, '--legacy-dir', str(self.root / 'legacy'), '--node-version', '22.21.0']
        with patch.object(r.sys, 'argv', args), patch.object(r, 'run', return_value='v25.0.0'), patch.object(r.shutil, 'which', return_value='/usr/bin/node'):
            with self.assertRaisesRegex(r.DeployError, 'remote Node version mismatch'): r.main()

    def test_launch_snapshot_preserves_original(self):
        original = {'pm_exec_path': '/legacy/server.js', 'pm_cwd': '/legacy', 'exec_interpreter': '/old/node', 'args': ['--port', '3010'], 'node_args': ['--max-old-space-size=512'], 'env': {'DUMMY_KEY': 'dummy-secret'}, 'exec_mode': 'fork_mode', 'status': 'online'}
        with patch.object(r, 'process_record', return_value=original):
            spec = r.snapshot_process('test')
        self.assertEqual(spec['script'], '/legacy/server.js')
        self.assertEqual(spec['interpreter'], '/old/node')
        self.assertEqual(spec['env'], {'DUMMY_KEY': 'dummy-secret'})
        self.assertEqual(spec['args'], original['args'])
        self.assertEqual(spec['node_args'], original['node_args'])
    def test_snapshot_rejects_unsupported(self):
        for unsupported in [{'exec_mode': 'cluster_mode'}, {'watch': True}, {'cron_restart': '* * * * *'}]:
            with patch.object(r, 'process_record', return_value=unsupported):
                with self.assertRaises(r.DeployError): r.snapshot_process('test')
    def test_recover_from_journal(self):
        previous = self.root / 'legacy'
        snapshot = {'apps': [{'name': 'test', 'cwd': str(previous), 'script': '/legacy/server.js', 'interpreter': '/old/node', 'env': {'DUMMY': 'secret'}}]}
        r.write_private(self.root / '.rollback.config.json', snapshot)
        r.write_private(self.root / '.activation-journal.json', {'root': str(self.root), 'name': 'test', 'port': 3100, 'previous': str(previous), 'had_link': False, 'had_process': True})
        r.atomic_link(self.root / 'current', self.release)
        with patch.object(r, 'process_info', return_value={'status': 'online'}), patch.object(r, 'run') as run, patch.object(r, 'health'):
            r.recover(self.root, previous, 'test', 3100)
        self.assertIn(['pm2', 'start', str(self.root / '.rollback.config.json'), '--only', 'test'], [call.args[0] for call in run.call_args_list])
        self.assertFalse((self.root / 'current').is_symlink())
        self.assertFalse((self.root / '.rollback.config.json').exists())
        self.assertFalse((self.root / '.activation-journal.json').exists())
    def test_recover_rejects_public_snapshot(self):
        previous = self.root / 'legacy'
        r.write_private(self.root / '.activation-journal.json', {'root': str(self.root), 'name': 'test', 'port': 3100, 'previous': str(previous), 'had_link': False, 'had_process': True})
        (self.root / '.rollback.config.json').write_text('{}')
        (self.root / '.rollback.config.json').chmod(0o644)
        with self.assertRaises(r.DeployError): r.recover(self.root, previous, 'test', 3100)

    def test_optional_node_version_uses_release_manifest(self):
        r.write_private(self.root / '.rollback.config.json', {'apps': []})
        args = ['remote', '--root', str(self.root), '--release', self.release_id, '--legacy-dir', str(self.root / 'legacy'), '--prepare-only']
        with patch.object(r.sys, 'argv', args), patch.object(r, 'run', return_value='v22.21.0'), patch.object(r.shutil, 'which', return_value='/usr/bin/node'), patch.object(r, 'preflight'), patch.object(r, 'prepare') as prepare:
            r.main()
        prepare.assert_called_once_with(self.release, self.root / 'legacy')
        self.assertFalse((self.root / '.rollback.config.json').exists())
    def test_cli_recover_does_not_require_current_node(self):
        args = ['remote', '--root', str(self.root), '--release', self.release_id, '--legacy-dir', str(self.root / 'legacy'), '--recover']
        with patch.object(r.sys, 'argv', args), patch.object(r, 'recover') as recover, patch.object(r.shutil, 'which', side_effect=AssertionError('must not inspect new Node')):
            r.main()
        recover.assert_called_once_with(self.root, self.root / 'legacy', 'mestrefabio', 3010, self.release_id)
    def test_snapshot_script_under_spaced_directory_stays_executable(self):
        record = {'exec_mode': 'fork_mode', 'pm_exec_path': '/deploy root/release/node_modules/next/dist/bin/next',
                  'pm_cwd': '/deploy root/release', 'exec_interpreter': '/usr/bin/node', 'args': ['start']}
        with patch.object(r, 'process_record', return_value=record):
            snapshot = r.snapshot_process('test')
        self.assertEqual(snapshot['script'], 'node_modules/next/dist/bin/next')
        self.assertEqual(snapshot['args'], ['start'])

    def test_snapshot_mode_and_symlink_rejection(self):
        path = self.root / '.snapshot'
        r.write_private(path, {'private': 'dummy'})
        self.assertEqual(path.stat().st_mode & 0o777, 0o600)
        link = self.root / '.link'
        link.symlink_to(path)
        with self.assertRaises(OSError): r.read_private(link)

    def test_recover_rejects_wrong_release(self):
        previous = self.root / 'legacy'
        r.write_private(self.root / '.activation-journal.json', {'root': str(self.root), 'name': 'test', 'port': 3100, 'release': str(self.release), 'previous': str(previous), 'had_link': False, 'had_process': True})
        with self.assertRaisesRegex(r.DeployError, 'release does not match'):
            r.recover(self.root, previous, 'test', 3100, 'f'*40 + '-' + 'b'*12)

if __name__ == '__main__': unittest.main()
