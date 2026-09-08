#!/usr/bin/env python3
"""Read-only PM2 diagnostic. Never forward raw remote output or environment."""
import argparse
import inspect
import json
import re
import subprocess
import sys


def safe_fields(name, status, cwd, pid, has_openai_key):
    """Only finite labels, numeric PID and known deployment paths may be printed."""
    if name != 'mestrefabio' or type(has_openai_key) is not bool:
        raise ValueError('Invalid diagnostic')
    statuses = {'online', 'stopped', 'stopping', 'launching', 'errored',
                'one-launch-status', 'waiting restart', 'unknown'}
    valid_cwd = isinstance(cwd, str) and (
        cwd in {'/home/fabio/projetos/mestrefabio-portfolio',
                '/home/fabio/apps/mestrefabio/current'}
        or re.fullmatch(r'/home/fabio/apps/mestrefabio/releases/[a-f0-9]{40}-[a-f0-9]{12}', cwd)
    )
    return {'name': 'mestrefabio',
            'status': status if isinstance(status, str) and status in statuses else 'unknown',
            'cwd': cwd if valid_cwd else None,
            'pid': pid if type(pid) is int and 0 <= pid <= 4194304 else None,
            'has_openai_key': has_openai_key}


def summarize(processes):
    if not isinstance(processes, list):
        raise ValueError('Invalid process list')
    matches = [item for item in processes
               if isinstance(item, dict) and item.get('name') == 'mestrefabio']
    if len(matches) != 1 or not isinstance(matches[0].get('pm2_env'), dict):
        raise ValueError('Expected one process')
    process = matches[0]
    env = process['pm2_env']
    nested = env.get('env')
    has_key = bool(env.get('OPENAI_API_KEY')) or (
        isinstance(nested, dict) and bool(nested.get('OPENAI_API_KEY')))
    return safe_fields(process['name'], env.get('status'), env.get('pm_cwd'),
                       process.get('pid'), has_key)


def remote_script():
    """Run the same allowlist on the remote side, before SSH receives any data."""
    return ('import json, re, subprocess, sys\n'
            + inspect.getsource(safe_fields) + '\n' + inspect.getsource(summarize)
            + '\ntry:\n'
              '    result = subprocess.run(["pm2", "jlist"], capture_output=True, text=True, timeout=20)\n'
              '    if result.returncode: raise ValueError("Unavailable")\n'
              '    print(json.dumps(summarize(json.loads(result.stdout))))\n'
              'except Exception:\n'
              '    sys.exit(1)\n')


class SafeArgumentParser(argparse.ArgumentParser):
    def error(self, message):
        raise ValueError('Invalid arguments')


def main(argv=None):
    try:
        parser = SafeArgumentParser(description=__doc__)
        parser.add_argument('--host', default='two', help='SSH host alias (default: two)')
        args = parser.parse_args(argv)
        if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9_.@-]{0,252}', args.host):
            raise ValueError('Invalid host')
        result = subprocess.run(
            ['ssh', '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=10',
             args.host, 'python3 -'], input=remote_script(), capture_output=True,
            text=True, timeout=35)
        if result.returncode:
            raise ValueError('Unavailable')
        data = json.loads(result.stdout)
        if not isinstance(data, dict):
            raise ValueError('Invalid diagnostic')
        safe = safe_fields(data.get('name'), data.get('status'), data.get('cwd'),
                           data.get('pid'), data.get('has_openai_key'))
        print(json.dumps(safe, ensure_ascii=True))
        return 0
    except Exception:
        print('Diagnóstico indisponível; saída remota omitida por segurança.', file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
