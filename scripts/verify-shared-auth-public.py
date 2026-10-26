"""Non-delivery production checks. Never requests an OTP or creates an account."""
import argparse
import datetime
import json
import pathlib
import subprocess
import tempfile

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--release', required=True, help='Explicit deployed full Git SHA from Coolify')
args = parser.parse_args()
BASE = 'https://stagepeek.live'
checks = []

def request(path, expected=200, method='GET', payload=None, origin=None):
    with tempfile.TemporaryDirectory() as directory:
        headers = pathlib.Path(directory) / 'headers'
        body = pathlib.Path(directory) / 'body'
        command = ['curl', '--silent', '--show-error', '--max-time', '30',
                   '--proto', '=https', '-D', str(headers), '-o', str(body),
                   '-w', '%{http_code}', '-X', method, BASE + path]
        if payload is not None:
            command += ['-H', 'Content-Type: application/json', '--data', json.dumps(payload)]
        if origin:
            command += ['-H', 'Origin: ' + origin]
        status = int(subprocess.check_output(command, text=True))
        text = body.read_text()
        result = {'path': path, 'method': method, 'expected': expected,
                  'actual': status, 'ok': status == expected}
        if path.startswith('/auth/'):
            result['noindex'] = 'x-robots-tag: noindex' in headers.read_text().lower()
            result['darkTheme'] = 'class="theme-arena' in text
            result['ok'] &= result['noindex'] and result['darkTheme']
        checks.append(result)
        return json.loads(text) if text.startswith('{') else text

request('/')
request('/healthz')
me = request('/api/me')
checks.append({'name': 'shared-auth-enabled-no-dev-providers', 'ok':
    me['user'] is None and me['providers']['auth'] == 'supabase'
    and me['providers']['email'] and me['providers']['emailOtp']
    and not any(me['providers'][key] for key in ['localEmail', 'localGoogle', 'localBilling', 'localInbox'])})
checks.append({'name': 'ten-free-venues', 'ok': len(me['access']['venueIds']) == 10})
catalog = request('/api/venues')['venues']
free = next(venue['id'] for venue in catalog if not venue['locked'])
locked = next(venue['id'] for venue in catalog if venue['locked'])
request('/api/venues/' + free)
request('/api/venues/' + locked, 403)
for path in ['/auth/login', '/auth/register', '/auth/verify', '/auth/callback', '/auth/reset', '/auth/password', '/account']:
    request(path)
for path in ['/api/admin/access', '/api/positions']:
    request(path, 401)
for path in ['/api/dev/mailbox', '/.env', '/server/config.mjs']:
    request(path, 404)
request('/api/auth/google/start', 503, 'POST', {}, BASE)
request('/api/auth/google/dev-callback', 404, 'POST', {}, BASE)
request('/api/auth/recovery/verify', 400, 'POST', {'code': '000000'}, BASE)
request('/api/auth/register', 400, 'POST', {'consent': False}, BASE)
# This request is rejected at the origin boundary, before requesting any email.
request('/api/auth/email', 403, 'POST', {}, 'https://untrusted.invalid')
# No pending browser cookie: rejected before contacting GoTrue /verify.
request('/api/auth/email/verify', 400, 'POST', {'code': '000000'}, BASE)
report = {'checkedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
          'domain': BASE, 'release': args.release,
          'sendsEmail': False, 'createsUsers': False, 'checks': checks,
          'passed': sum(bool(check['ok']) for check in checks), 'total': len(checks)}
print(json.dumps(report, ensure_ascii=False, indent=2))
raise SystemExit(0 if report['passed'] == report['total'] else 1)
