#!/usr/bin/env python3
"""Real isolated nginx checks. Requires nginx; never contacts the application.

Run from the repo root, or pass --snippets DIR for copied configuration files.
--without-guard demonstrates that the assertions detect missing protection.
"""
import argparse
import http.client
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import shutil
import socket
import subprocess
import tempfile
import threading
import time


class Upstream(BaseHTTPRequestHandler):
    requests = 0

    def respond(self):
        self.rfile.read(int(self.headers.get('Content-Length', '0')))
        type(self).requests += 1
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b'isolated fixture')

    do_GET = respond
    do_POST = respond

    def log_message(self, *_args):
        pass


def request(port, method='GET', body=None, headers=None):
    connection = http.client.HTTPConnection('127.0.0.1', port, timeout=3)
    try:
        connection.request(method, '/', body=body, headers=headers or {})
        response = connection.getresponse()
        response.read()
        return response.status
    finally:
        connection.close()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--snippets', type=Path,
                        default=Path(__file__).resolve().parents[1] / 'ops/nginx')
    parser.add_argument('--without-guard', action='store_true')
    args = parser.parse_args()
    nginx = shutil.which('nginx') or '/usr/sbin/nginx'
    upstream = ThreadingHTTPServer(('127.0.0.1', 0), Upstream)
    thread = threading.Thread(target=upstream.serve_forever, daemon=True)
    thread.start()
    try:
        with tempfile.TemporaryDirectory(prefix='mestrefabio-nginx-e2e-') as directory:
            root = Path(directory)
            with socket.socket() as reservation:
                reservation.bind(('127.0.0.1', 0))
                port = reservation.getsockname()[1]
            http_guard = '' if args.without_guard else (args.snippets / 'mestrefabio-contact-http.conf').read_text()
            location_guard = '' if args.without_guard else (args.snippets / 'mestrefabio-contact-location.conf').read_text()
            (root / 'nginx.conf').write_text(f'''
worker_processes 1;
pid {root}/nginx.pid;
error_log {root}/error.log warn;
events {{ worker_connections 64; }}
http {{
    access_log off;
    client_body_temp_path {root}/body;
    proxy_temp_path {root}/proxy;
    {http_guard}
    server {{
        listen 127.0.0.1:{port};
        location / {{
            {location_guard}
            proxy_pass http://127.0.0.1:{upstream.server_port};
        }}
    }}
}}
''')
            process = subprocess.Popen([nginx, '-p', str(root), '-c', str(root / 'nginx.conf'), '-g', 'daemon off;'],
                                       stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
            try:
                for _ in range(100):
                    if process.poll() is not None:
                        raise RuntimeError(process.stderr.read().decode())
                    try:
                        if request(port) == 200:
                            break
                    except OSError:
                        time.sleep(0.03)
                else:
                    raise RuntimeError('Isolated nginx did not become ready')
                assert all(request(port) == 200 for _ in range(12)), 'GET must remain unthrottled'
                before = Upstream.requests
                assert request(port, 'POST', b'x' * (64 * 1024 + 1)) == 413, 'Oversized body must be rejected'
                assert Upstream.requests == before, 'Oversized body reached upstream'
                assert request(port, 'POST', b'x' * (64 * 1024)) == 200, 'Body at limit must pass'
                assert [request(port, 'POST', b'ok') for _ in range(3)] == [200] * 3, 'Initial request plus burst must pass'
                before = Upstream.requests
                assert request(port, 'POST', b'ok') == 429, 'Excess POST must be rate limited'
                for forwarded in ('198.51.100.1', '203.0.113.42', '1.2.3.4, 127.0.0.1'):
                    assert request(port, 'POST', b'ok', {'X-Forwarded-For': forwarded}) == 429, 'Spoofed XFF bypassed limiter'
                assert Upstream.requests == before, 'Blocked POST reached upstream'
                assert all(request(port) == 200 for _ in range(12)), 'POST exhaustion must not throttle GET'
                print('PASS: GET exempt; POST burst/429; XFF spoof blocked; 64 KiB boundary; rejected requests never reach upstream')
            finally:
                process.terminate()
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait(timeout=5)
                process.stderr.close()
    finally:
        upstream.shutdown()
        upstream.server_close()
        thread.join(timeout=3)


if __name__ == '__main__':
    main()
