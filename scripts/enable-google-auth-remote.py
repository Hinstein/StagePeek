"""Run on VPS1; credentials arrive on stdin, never in arguments or output."""
import datetime,json,os,pathlib,re,shutil,subprocess,sys,time,urllib.request
import yaml

credentials=json.load(sys.stdin)
assert re.fullmatch(r'[0-9]+-[a-z0-9]+\.apps\.googleusercontent\.com',credentials['clientId'])
assert re.fullmatch(r'GOCSPX-[A-Za-z0-9_-]+',credentials['clientSecret'])
root=pathlib.Path('/opt/supabase')
env_path=root/'.env'
override=root/'docker-compose.auth-templates.yml'
current=json.loads(subprocess.check_output(['docker','inspect','supabase-auth']))[0]
runtime=dict(item.split('=',1) for item in current['Config']['Env'])
assert runtime.get('GOTRUE_EXTERNAL_GOOGLE_ENABLED','false')!='true', 'Google already enabled; review before replacing'
assert runtime.get('GOTRUE_HOOK_SEND_EMAIL_ENABLED')=='true'
files=current['Config']['Labels']['com.docker.compose.project.config_files'].split(',')
assert files==[str(root/'docker-compose.yml'),str(override)]
allow=list(dict.fromkeys(runtime['GOTRUE_URI_ALLOW_LIST'].split(',')+['https://stagepeek.live/auth/google/callback']))
config=yaml.safe_load(override.read_text())
auth=config['services']['auth']['environment']
auth.update({'GOTRUE_URI_ALLOW_LIST':','.join(allow),
 'GOTRUE_EXTERNAL_GOOGLE_ENABLED':'${GOOGLE_ENABLED}',
 'GOTRUE_EXTERNAL_GOOGLE_CLIENT_ID':'${GOOGLE_CLIENT_ID}',
 'GOTRUE_EXTERNAL_GOOGLE_SECRET':'${GOOGLE_SECRET}',
 'GOTRUE_EXTERNAL_GOOGLE_REDIRECT_URI':'${API_EXTERNAL_URL}/callback'})
backup=pathlib.Path('/root/supabase-backups/stagepeek-google-'+datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ'))
backup.mkdir(mode=0o700)
for path in [env_path,override]:
 shutil.copy2(path,backup/path.name);os.chmod(backup/path.name,0o600)
compose=['docker','compose']
for path in files: compose+=['-f',path]
values={'GOOGLE_ENABLED':'true','GOOGLE_CLIENT_ID':credentials['clientId'],'GOOGLE_SECRET':credentials['clientSecret']}
lines=env_path.read_text().splitlines()
lines=[line for line in lines if not any(re.match(r'^\s*#?\s*'+key+r'=',line) for key in values)]
try:
 env_path.write_text('\n'.join(lines)+'\n'+'\n'.join(key+'='+value for key,value in values.items())+'\n');os.chmod(env_path,0o600)
 override.write_text(yaml.safe_dump(config,sort_keys=False));os.chmod(override,0o600)
 subprocess.run(compose+['config','--quiet'],cwd=root,check=True,capture_output=True)
 subprocess.run(compose+['up','-d','--no-deps','auth'],cwd=root,check=True,capture_output=True)
 for attempt in range(30):
  state=json.loads(subprocess.check_output(['docker','inspect','supabase-auth']))[0]['State']
  if state.get('Health',{}).get('Status')=='healthy': break
  time.sleep(2)
 assert state.get('Health',{}).get('Status')=='healthy','Auth health failed'
 updated=dict(item.split('=',1) for item in json.loads(subprocess.check_output(['docker','inspect','supabase-auth']))[0]['Config']['Env'])
 assert updated['GOTRUE_EXTERNAL_GOOGLE_ENABLED']=='true'
 assert updated['GOTRUE_HOOK_SEND_EMAIL_ENABLED']==runtime['GOTRUE_HOOK_SEND_EMAIL_ENABLED']
 env={line.split('=',1)[0]:line.split('=',1)[1].strip('"\'') for line in env_path.read_text().splitlines() if '=' in line and not line.lstrip().startswith('#')}
 req=urllib.request.Request('https://supabase.openp7m.com/auth/v1/settings',headers={'apikey':env['ANON_KEY']})
 settings=json.load(urllib.request.urlopen(req,timeout=20))
 assert settings['external']['google'] is True
except Exception as error:
 for path in [env_path,override]: shutil.copy2(backup/path.name,path)
 subprocess.run(compose+['up','-d','--no-deps','auth'],cwd=root,capture_output=True)
 print(json.dumps({'ok':False,'rolledBack':True,'backup':str(backup),'errorType':type(error).__name__}));raise SystemExit(1)
print(json.dumps({'ok':True,'backup':str(backup),'googleEnabled':True,'authHealthy':True,'mailHookPreserved':True,'callback':'https://stagepeek.live/auth/google/callback','otherRedirectsPreserved':set(runtime['GOTRUE_URI_ALLOW_LIST'].split(',')).issubset(allow)}))
