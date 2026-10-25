#!/usr/bin/env python3
"""Run on VPS1 as root with a staged, secret-free mail bundle. No sends."""
import pathlib,subprocess,json,secrets,shutil,datetime,os
base=pathlib.Path('/opt/platform-auth-mail'); stamp=datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ')
backup=pathlib.Path('/root/supabase-backups/mail-hook-'+stamp);backup.mkdir(mode=0o700,parents=True)
for p in ['/etc/caddy/sites/supabase.openp7m.com.caddy','/opt/supabase/docker-compose.auth-templates.yml','/opt/supabase/.env']:
 shutil.copy2(p,backup/pathlib.Path(p).name)
if base.exists():shutil.copytree(base,backup/'platform-auth-mail',ignore=shutil.ignore_patterns('node_modules'))
subprocess.run(['useradd','--system','--no-create-home','--shell','/usr/sbin/nologin','platform-auth-mail'],capture_output=True)
base.mkdir(exist_ok=True);shutil.copytree('/tmp/stagepeek-auth-mail-bundle',base,dirs_exist_ok=True)
subprocess.run(['npm','ci','--omit=dev','--ignore-scripts','--no-audit','--no-fund'],cwd=base,check=True,stdout=subprocess.DEVNULL)
assets=pathlib.Path('/var/www/platform-auth-assets');assets.mkdir(parents=True,exist_ok=True)
for n in ['openp7m.png','stagepeek.png']:shutil.copy2(base/n,assets/n);(assets/n).chmod(0o644)
e=dict(v.split('=',1) for v in json.loads(subprocess.check_output(['docker','inspect','supabase-auth']))[0]['Config']['Env'] if '=' in v)
conf=pathlib.Path('/etc/platform-auth-mail');conf.mkdir(mode=0o700,exist_ok=True)
secret='v1,whsec_'+__import__('base64').b64encode(secrets.token_bytes(32)).decode()
values={'MAIL_PROJECTS_FILE':str(base/'mail-projects.preflight.json'),'MAIL_HOST':'172.21.0.1','MAIL_PORT':'14680','AUTH_HOOK_SECRET':secret,'SMTP_HOST':e['GOTRUE_SMTP_HOST'],'SMTP_USER':e['GOTRUE_SMTP_USER'],'SMTP_PASS':e['GOTRUE_SMTP_PASS'],'SMTP_PORT':e['GOTRUE_SMTP_PORT']}
# systemd EnvironmentFile double quoted values; never print secrets
(conf/'mail.env').write_text(''.join(k+'='+json.dumps(v)+'\n' for k,v in values.items()));(conf/'mail.env').chmod(0o600)
shutil.copy2(base/'platform-auth-mail.service','/etc/systemd/system/platform-auth-mail.service')
subprocess.run(['systemctl','daemon-reload'],check=True);subprocess.run(['systemctl','enable','--now','platform-auth-mail'],check=True)
p=pathlib.Path('/etc/caddy/sites/supabase.openp7m.com.caddy');s=p.read_text()
block='''    @authAssets path /auth-assets/openp7m.png /auth-assets/stagepeek.png
    handle @authAssets {
        uri strip_prefix /auth-assets
        root * /var/www/platform-auth-assets
        file_server
    }

'''
if '@authAssets' not in s:p.write_text(s.replace('    @supabase_api',block+'    @supabase_api',1))
r=subprocess.run(['caddy','validate','--config','/etc/caddy/Caddyfile'],capture_output=True)
if r.returncode:
 shutil.copy2(backup/p.name,p);raise SystemExit('Caddy validation failed; restored file')
subprocess.run(['systemctl','reload','caddy'],check=True)
print(json.dumps({'backup':str(backup),'hook':'installed-not-enabled','authUnchanged':True}))
