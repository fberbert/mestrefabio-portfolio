"""Launcher CPU boundary tests; no remote operations."""
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

LAUNCHER = Path(__file__).resolve().parents[1] / 'scripts/build-mestrefabio'


class CpuLimitTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='cpu-launcher-')
        self.addCleanup(self.temp.cleanup)
        base = Path(self.temp.name)
        self.repo = base / 'repository with spaces'
        (self.repo / 'scripts').mkdir(parents=True)
        (self.repo / 'scripts/deploy.py').write_text('print("unlimited execution")\n')
        binary = base / 'bin'
        binary.mkdir()
        shim = binary / 'systemd-run'
        shim.write_text('#!/usr/bin/python3\nimport os,json,sys\nfrom pathlib import Path\n'
                        'Path(os.environ["TEST_CALL"]).write_text(json.dumps(sys.argv[1:]))\n'
                        'sys.exit(int(os.environ.get("TEST_EXIT", "0")))\n')
        shim.chmod(0o755)
        self.call = base / 'call.json'
        self.env = {**os.environ, 'PATH': str(binary) + ':/usr/bin:/bin',
                    'MESTREFABIO_REPO': str(self.repo), 'TEST_CALL': str(self.call)}
        self.env.pop('MESTREFABIO_CPU_QUOTA', None)

    def launch(self, *args, **env):
        return subprocess.run([str(LAUNCHER), *args], env={**self.env, **env},
                              capture_output=True, text=True)

    def test_default_limit_wraps_complete_client(self):
        result = self.launch('--check')
        self.assertEqual(result.returncode, 0)
        self.assertTrue(self.call.exists(), 'client must run inside systemd CPU quota')
        args = json.loads(self.call.read_text())
        for value in ['--user', '--scope', 'CPUQuota=50%', 'CPUWeight=10']:
            self.assertIn(value, args)
        self.assertEqual(args[args.index('--') + 1:],
                         ['nice', '-n', '10', 'python3', str(self.repo / 'scripts/deploy.py'), '--check'])

    def test_custom_quota_and_literal_arguments(self):
        result = self.launch('--root', '/tmp/path with spaces/$HOME', MESTREFABIO_CPU_QUOTA='25')
        self.assertEqual(result.returncode, 0)
        self.assertTrue(self.call.exists(), 'quota wrapper must be invoked')
        args = json.loads(self.call.read_text())
        self.assertIn('CPUQuota=25%', args)
        self.assertIn('--expand-environment=no', args)
        self.assertEqual(args[-1], '/tmp/path with spaces/$HOME')

    def test_invalid_quota_never_executes_client(self):
        for quota in ['', '0', '-1', '101', '01', '50%', '1.5', '50\n', '$(true)']:
            with self.subTest(quota=quota):
                result = self.launch('--check', MESTREFABIO_CPU_QUOTA=quota)
                self.assertNotEqual(result.returncode, 0)
                self.assertFalse(self.call.exists())
                self.assertNotIn('unlimited execution', result.stdout)

    def test_backend_failure_does_not_fall_back_to_unlimited(self):
        result = self.launch('--check', TEST_EXIT='77')
        self.assertEqual(result.returncode, 77)
        self.assertNotIn('unlimited execution', result.stdout)


if __name__ == '__main__':
    unittest.main()
