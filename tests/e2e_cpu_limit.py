#!/usr/bin/env python3
"""Verify actual cgroup CPU quota and child inheritance; no network or deploy."""
import json
import os
from pathlib import Path
import subprocess
import tempfile

LAUNCHER = Path(__file__).resolve().parents[1] / 'scripts/build-mestrefabio'
PROBE = '''
import json, multiprocessing, os, sys, time
from pathlib import Path

def membership():
    return Path('/proc/self/cgroup').read_text().strip().split(':', 2)[2]

def usage(group):
    return int(dict(line.split() for line in (group / 'cpu.stat').read_text().splitlines())['usage_usec'])

def worker(queue, deadline):
    queue.put(membership())
    while time.monotonic() < deadline:
        pass

if __name__ == '__main__':
    own = membership()
    group = Path('/sys/fs/cgroup') / own.lstrip('/')
    quota, period = (group / 'cpu.max').read_text().split()
    queue = multiprocessing.Queue()
    before = usage(group)
    started = time.monotonic()
    children = [multiprocessing.Process(target=worker, args=(queue, started + 4)) for _ in range(2)]
    for child in children:
        child.start()
    memberships = [queue.get(timeout=15) for _ in children]
    for child in children:
        child.join(15)
        assert child.exitcode == 0
    elapsed = time.monotonic() - started
    consumed = (usage(group) - before) / 1_000_000
    print(json.dumps({'quota': quota, 'period': period, 'weight': (group / 'cpu.weight').read_text().strip(),
                      'same_group': all(value == own for value in memberships),
                      'nice': os.getpriority(os.PRIO_PROCESS, 0), 'cpu_seconds': consumed,
                      'wall_seconds': elapsed, 'argv': sys.argv[1:], 'tag': os.environ['CPU_TEST_TAG']}))
'''


def main():
    with tempfile.TemporaryDirectory(prefix='cpu-limit-') as temporary:
        root = Path(temporary) / 'repo with spaces $literal'
        (root / 'scripts').mkdir(parents=True)
        probe = root / 'scripts/deploy.py'
        probe.write_text(PROBE)
        env = {**os.environ, 'MESTREFABIO_REPO': str(root), 'CPU_TEST_TAG': 'preserved'}
        env.pop('MESTREFABIO_CPU_QUOTA', None)
        result = subprocess.run([str(LAUNCHER), '$LITERAL', 'two words'],
                                env=env, capture_output=True, text=True, timeout=30)
        assert result.returncode == 0, result.stderr
        measured = json.loads(result.stdout)
        assert int(measured['quota']) / int(measured['period']) == 0.5
        assert measured['same_group'] and measured['nice'] >= 10
        assert measured['weight'] == '10'
        assert measured['argv'] == ['$LITERAL', 'two words']
        assert measured['tag'] == 'preserved'
        assert measured['cpu_seconds'] / measured['wall_seconds'] <= 0.65, measured
        print('PASS:', json.dumps(measured))
        probe.write_text('raise SystemExit(37)\n')
        result = subprocess.run([str(LAUNCHER)], env=env, capture_output=True, text=True, timeout=15)
        assert result.returncode == 37, result
        print('PASS: child exit code preserved')


if __name__ == '__main__':
    main()
