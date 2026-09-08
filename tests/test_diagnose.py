"""Diagnostics must never print PM2 environment or unsanitized remote output."""
import contextlib
import importlib.util
import io
import json
from pathlib import Path
import subprocess
import unittest
from unittest.mock import patch

MODULE = Path(__file__).resolve().parents[1] / 'scripts/diagnose.py'
PRIVATE_MARKER = 'diagnostic-fixture-must-not-be-printed'
CWD = '/home/fabio/apps/mestrefabio/releases/' + 'a' * 40 + '-' + 'b' * 12


class DiagnosticTests(unittest.TestCase):
    def setUp(self):
        self.assertTrue(MODULE.exists(), 'safe diagnostic helper missing')
        spec = importlib.util.spec_from_file_location('diagnose', MODULE)
        self.module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(self.module)

    def process(self, **updates):
        return {'name': 'mestrefabio', 'pid': 123,
                'pm2_env': {'status': 'online', 'pm_cwd': CWD,
                            'OPENAI_API_KEY': PRIVATE_MARKER, 'RESEND_API_KEY': PRIVATE_MARKER}, **updates}

    def test_allowlist_and_key_presence(self):
        safe = self.module.summarize([self.process()])
        self.assertEqual(safe, {'name': 'mestrefabio', 'status': 'online',
                               'cwd': CWD, 'pid': 123, 'has_openai_key': True})
        self.assertNotIn(PRIVATE_MARKER, json.dumps(safe))

    def test_malicious_operational_fields_and_other_processes(self):
        process = self.process(pid=PRIVATE_MARKER, pm2_env={'status': PRIVATE_MARKER,
                  'pm_cwd': '/home/fabio/apps/mestrefabio/' + PRIVATE_MARKER})
        safe = self.module.summarize([{'name': PRIVATE_MARKER}, process])
        self.assertEqual(safe['status'], 'unknown')
        self.assertIsNone(safe['cwd'])
        self.assertIsNone(safe['pid'])
        self.assertFalse(safe['has_openai_key'])
        self.assertNotIn(PRIVATE_MARKER, json.dumps(safe))

    def test_nested_key_and_known_legacy_paths(self):
        for cwd in ['/home/fabio/projetos/mestrefabio-portfolio',
                    '/home/fabio/apps/mestrefabio/current', CWD]:
            safe = self.module.summarize([self.process(pm2_env={
                'pm_cwd': cwd, 'status': 'stopped', 'env': {'OPENAI_API_KEY': PRIVATE_MARKER}})])
            self.assertEqual(safe['cwd'], cwd)
            self.assertTrue(safe['has_openai_key'])
            self.assertNotIn(PRIVATE_MARKER, json.dumps(safe))

    def test_local_boundary_filters_extra_fields_and_malicious_values(self):
        payload = {'name': 'mestrefabio', 'status': PRIVATE_MARKER, 'cwd': PRIVATE_MARKER,
                   'pid': PRIVATE_MARKER, 'has_openai_key': False, 'environment': PRIVATE_MARKER}
        result = subprocess.CompletedProcess([], 0, json.dumps(payload), PRIVATE_MARKER)
        out = io.StringIO()
        with patch.object(self.module.subprocess, 'run', return_value=result), contextlib.redirect_stdout(out):
            self.assertEqual(self.module.main([]), 0)
        self.assertNotIn(PRIVATE_MARKER, out.getvalue())
        self.assertNotIn('environment', out.getvalue())

    def test_missing_duplicate_or_malformed_process_fails(self):
        for value in [None, {}, [], [None], [self.process(), self.process()],
                      [self.process(pm2_env=PRIVATE_MARKER)]]:
            with self.subTest(value=type(value)), self.assertRaises(ValueError):
                self.module.summarize(value)

    def test_cli_success_captures_both_streams(self):
        result = subprocess.CompletedProcess([], 0, json.dumps(self.module.summarize([self.process()])), PRIVATE_MARKER)
        with patch.object(self.module.subprocess, 'run', return_value=result) as run:
            output = io.StringIO()
            with contextlib.redirect_stdout(output):
                self.assertEqual(self.module.main([]), 0)
        self.assertNotIn(PRIVATE_MARKER, output.getvalue())
        self.assertIn('mestrefabio', output.getvalue())
        self.assertEqual(run.call_args.args[0][-2:], ['two', 'python3 -'])
        self.assertTrue(run.call_args.kwargs['capture_output'])
        self.assertIn('pm2', run.call_args.kwargs['input'])

    def test_cli_errors_and_untrusted_stdout_are_generic(self):
        results = [subprocess.CompletedProcess([], 1, PRIVATE_MARKER, PRIVATE_MARKER),
                   subprocess.CompletedProcess([], 0, PRIVATE_MARKER, PRIVATE_MARKER),
                   subprocess.CompletedProcess([], 0, json.dumps({'name': PRIVATE_MARKER}), PRIVATE_MARKER),
                   subprocess.TimeoutExpired('ssh', 1, output=PRIVATE_MARKER, stderr=PRIVATE_MARKER),
                   OSError(PRIVATE_MARKER)]
        for result in results:
            kwargs = {'side_effect': result} if isinstance(result, Exception) else {'return_value': result}
            with self.subTest(result=type(result)), patch.object(self.module.subprocess, 'run', **kwargs):
                out, err = io.StringIO(), io.StringIO()
                with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
                    self.assertEqual(self.module.main([]), 1)
                self.assertNotIn(PRIVATE_MARKER, out.getvalue() + err.getvalue())
                self.assertIn('Diagnóstico indisponível', err.getvalue())

    def test_invalid_host_never_executes(self):
        for host in ['-oProxyCommand=bad', 'two;bad', 'two\n' + PRIVATE_MARKER, '']:
            with patch.object(self.module.subprocess, 'run') as run:
                out, err = io.StringIO(), io.StringIO()
                with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
                    self.assertEqual(self.module.main(['--host', host]), 1)
                run.assert_not_called()
                self.assertNotIn(PRIVATE_MARKER, out.getvalue() + err.getvalue())

    def test_remote_script_never_emits_pm2_secret_or_exception(self):
        for result in [subprocess.CompletedProcess([], 0, json.dumps([self.process()]), PRIVATE_MARKER),
                       subprocess.CompletedProcess([], 1, PRIVATE_MARKER, PRIVATE_MARKER), OSError(PRIVATE_MARKER)]:
            kwargs = {'side_effect': result} if isinstance(result, Exception) else {'return_value': result}
            out, err = io.StringIO(), io.StringIO()
            with patch('subprocess.run', **kwargs), contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
                with contextlib.suppress(SystemExit):
                    exec(self.module.remote_script(), {'__name__': '__main__'})
            self.assertNotIn(PRIVATE_MARKER, out.getvalue() + err.getvalue())


if __name__ == '__main__':
    unittest.main()
