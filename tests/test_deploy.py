"""Client integration: real Git/rsync, mocked network boundary only."""
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

MODULE = Path(__file__).resolve().parents[1] / 'scripts/deploy.py'


class DeployTests(unittest.TestCase):
    def setUp(self):
        self.assertTrue(MODULE.exists(), 'versioned deployment client is missing')
        spec = importlib.util.spec_from_file_location('deploy', MODULE)
        self.client = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(self.client)
        self.temp = tempfile.TemporaryDirectory(prefix='deploy space ')
        self.addCleanup(self.temp.cleanup)
        self.repo = Path(self.temp.name) / 'repository with spaces'
        self.repo.mkdir()
        for args in [('init', '-q'), ('config', 'user.email', 'test@example.invalid'),
                     ('config', 'user.name', 'Test')]:
            subprocess.run(['git', '-C', str(self.repo), *args], check=True)
        (self.repo / 'package-lock.json').write_text('{"lockfileVersion":3}\n')
        (self.repo / '.node-version').write_text('22.21.0\n')
        (self.repo / '.hidden').write_text('include me')
        (self.repo / '.gitignore').write_text('.env.local\n')
        (self.repo / '.env.local').write_text('TEST_SECRET=never-upload\n')
        self.commit()

    def commit(self):
        subprocess.run(['git', '-C', str(self.repo), 'add', '.'], check=True)
        subprocess.run(['git', '-C', str(self.repo), 'commit', '-qm', 'fixture'], check=True)

    def snapshot(self):
        return self.client.snapshot(self.repo, Path(self.temp.name) / 'snapshot')

    def test_archive_matches_commit_and_excludes_local_env(self):
        stage, manifest = self.snapshot()
        self.assertEqual((stage / '.hidden').read_text(), 'include me')
        self.assertFalse((stage / '.env.local').exists())
        self.assertFalse((stage / '.git').exists())
        self.assertEqual(manifest['node_version'], '22.21.0')
        self.assertEqual(len(manifest['commit']), 40)
        self.assertEqual(len(manifest['lock_sha256']), 64)
        self.assertEqual(json.loads((stage / 'deploy-manifest.json').read_text()), manifest)

    def test_dirty_tracked_or_untracked_files_block_publication(self):
        for name in ['package-lock.json', 'untracked']:
            with self.subTest(name=name):
                path = self.repo / name
                old = path.read_text() if path.exists() else None
                path.write_text('changed')
                with self.assertRaisesRegex(ValueError, 'limpo|clean'):
                    self.snapshot()
                if old is None:
                    path.unlink()
                else:
                    path.write_text(old)

    def test_tracked_secret_file_is_rejected(self):
        subprocess.run(['git', '-C', str(self.repo), 'add', '-f', '.env.local'], check=True)
        subprocess.run(['git', '-C', str(self.repo), 'commit', '-qm', 'bad fixture'], check=True)
        with self.assertRaisesRegex(ValueError, 'env|secret'):
            self.snapshot()

    def test_git_symlink_cannot_escape_snapshot(self):
        (self.repo / 'escape').symlink_to('/tmp')
        self.commit()
        with self.assertRaisesRegex(ValueError, 'link'):
            self.snapshot()

    def test_invalid_remote_paths_and_hosts_rejected(self):
        for root in ['/', '/home', 'relative', '/tmp/a/../b', '/tmp/a\nb']:
            with self.subTest(root=root), self.assertRaises(ValueError):
                self.client.validate_target('two', root)
        for host in ['-oProxyCommand=evil', 'two;false', 'a b']:
            with self.subTest(host=host), self.assertRaises(ValueError):
                self.client.validate_target(host, '/home/fabio/apps/mestrefabio')

    def test_rsync_real_directory_mirror_includes_hidden_and_deletes_root_stale(self):
        stage, _ = self.snapshot()
        target = Path(self.temp.name) / 'release destination'
        target.mkdir()
        (target / 'obsolete').write_text('old')
        sentinel = target.parent / 'outside'
        sentinel.write_text('keep')
        subprocess.run(self.client.rsync_args(stage, str(target) + '/'), check=True,
                       capture_output=True)
        self.assertTrue((target / '.hidden').exists())
        self.assertFalse((target / 'obsolete').exists())
        self.assertEqual(sentinel.read_text(), 'keep')

    def test_ssh_quotes_each_argument(self):
        import shlex
        args = self.client.ssh_args('two', ['python3', '/path with spaces/helper.py', "it's fine"])
        self.assertEqual(shlex.split(args[-1]), ['python3', '/path with spaces/helper.py', "it's fine"])
        self.assertIn('BatchMode=yes', args)

    def test_transfer_failure_never_activates(self):
        stage, manifest = self.snapshot()
        calls = []
        def run(args, **kwargs):
            calls.append(args)
            if args[0] == 'rsync':
                raise subprocess.CalledProcessError(23, args)
            return subprocess.CompletedProcess(args, 0)
        with patch.object(self.client.subprocess, 'run', side_effect=run):
            with self.assertRaises(subprocess.CalledProcessError):
                self.client.publish(stage, manifest, 'two', '/home/fabio/apps/mestrefabio',
                                    '/home/fabio/projetos/mestrefabio-portfolio', False)
        self.assertEqual(len(calls), 2)
        self.assertEqual(calls[-1][0], 'rsync')

    def test_ssh_failure_never_transfers(self):
        stage, manifest = self.snapshot()
        with patch.object(self.client.subprocess, 'run', side_effect=subprocess.CalledProcessError(255, 'ssh')) as run:
            with self.assertRaises(subprocess.CalledProcessError):
                self.client.publish(stage, manifest, 'two', '/home/fabio/apps/mestrefabio',
                                    '/home/fabio/projetos/mestrefabio-portfolio', False)
        self.assertEqual(run.call_count, 1)

    def test_prepare_only_forwarded_and_activate_failure_not_swallowed(self):
        stage, manifest = self.snapshot()
        calls = []
        def run(args, **kwargs):
            calls.append(args)
            if len(calls) == 3:
                raise subprocess.CalledProcessError(1, args)
            return subprocess.CompletedProcess(args, 0)
        with patch.object(self.client.subprocess, 'run', side_effect=run):
            with self.assertRaises(subprocess.CalledProcessError):
                self.client.publish(stage, manifest, 'two', '/home/fabio/apps/mestrefabio',
                                    '/home/fabio/projetos/mestrefabio-portfolio', True)
        self.assertIn('--prepare-only', calls[-1][-1])

    def test_main_check_is_local_and_prints_manifest(self):
        with patch.object(self.client, 'REPO', self.repo), patch.object(self.client, 'publish') as publish:
            self.assertEqual(self.client.main(['--check']), 0)
        publish.assert_not_called()

    def test_main_fails_for_dirty_checkout(self):
        (self.repo / 'pending').write_text('unfinished')
        with patch.object(self.client, 'REPO', self.repo), patch.object(self.client, 'publish') as publish:
            self.assertEqual(self.client.main(['--check']), 1)
        publish.assert_not_called()

    def test_main_activate_forwards_exact_release(self):
        release = 'a' * 40 + '-' + 'b' * 12
        with patch.object(self.client, 'REPO', self.repo), patch.object(self.client, 'activate') as activate:
            self.assertEqual(self.client.main(['--activate', release]), 0)
        self.assertEqual(activate.call_args.args[2], release)
        self.assertTrue(activate.call_args.kwargs['activate_only'])

    def test_main_publish_and_success(self):
        with patch.object(self.client, 'REPO', self.repo), patch.object(self.client, 'publish') as publish:
            self.assertEqual(self.client.main([]), 0)
        publish.assert_called_once()

    def test_activate_uses_release_node_not_local_version(self):
        release = 'a' * 40 + '-' + 'b' * 12
        with patch.object(self.client, 'REPO', self.repo), patch.object(self.client, 'activate') as activate:
            self.assertEqual(self.client.main(['--activate', release]), 0)
        self.assertIsNone(activate.call_args.args[4])

    def test_recover_passes_explicit_mode(self):
        release = 'a' * 40 + '-' + 'b' * 12
        with patch.object(self.client, 'REPO', self.repo), patch.object(self.client.subprocess, 'run') as run:
            self.assertEqual(self.client.main(['--recover', release]), 0)
        self.assertIn('--recover', run.call_args.args[0][-1])
        self.assertNotIn('--node-version', run.call_args.args[0][-1])

    def test_version_must_be_exact(self):
        (self.repo / '.node-version').write_text('22.x')
        self.commit()
        with self.assertRaisesRegex(ValueError, 'exata'):
            self.snapshot()

    def test_publish_success_and_existing_release_activation(self):
        stage, manifest = self.snapshot()
        with patch.object(self.client.subprocess, 'run', return_value=subprocess.CompletedProcess([], 0)) as run:
            release = self.client.publish(stage, manifest, 'two', '/home/fabio/apps/mestrefabio',
                                          '/home/fabio/projetos/mestrefabio-portfolio', False)
        self.assertTrue(release.startswith(manifest['commit'] + '-'))
        self.assertEqual(run.call_count, 3)
        with patch.object(self.client.subprocess, 'run') as run:
            self.client.activate('two', '/home/fabio/apps/mestrefabio', release, '/legacy', '22.21.0', activate_only=True)
        self.assertIn('--activate-only', run.call_args.args[0][-1])
        with self.assertRaises(ValueError):
            self.client.activate('two', '/home/fabio/apps/mestrefabio', '../bad', '/legacy', '22.21.0')


if __name__ == '__main__':
    unittest.main()
