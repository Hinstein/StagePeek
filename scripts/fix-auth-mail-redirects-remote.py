"""Run on VPS1. Register exact English mail redirects; preserve other Auth settings."""
import datetime,json,os,pathlib,shutil,subprocess,sys,time
import yaml

root=pathlib.Path('/opt/supabase')
override=root/'docker-compose.auth-templates.yml'
current=json.loads(subprocess.check_output(['docker','inspect','supabase-auth']))[0]
runtime=dict(line.split('=',1) for line in current['Config']['Env'] if '=' in line)
files=current['Config']['Labels']['com.docker.compose.project.config_files'].split(',')
assert files==[str(root/'docker-compose.yml'),str(override)]
required=['https://stagepeek.live/auth/callback?lang=en','https://stagepeek.live/auth/reset?lang=en']
allow=list(dict.fromkeys(runtime['GOTRUE_URI_ALLOW_LIST'].split(',')+required))
print(json.dumps({'required':required,'missing':[url for url in required if url not in runtime['GOTRUE_URI_ALLOW_LIST'].split(',')],'apply':'--apply' in sys.argv}))
if '--apply' not in sys.argv:raise SystemExit()

backup=pathlib.Path('/root/supabase-backups/stagepeek-mail-redirects-'+datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ'))
backup.mkdir(mode=0o700)
shutil.copy2(override,backup/override.name)
os.chmod(backup/override.name,0o600)
compose=['docker','compose']
for path in files:compose+=['-f',path]
try:
 config=yaml.safe_load(override.read_text())
 config['services']['auth']['environment']['GOTRUE_URI_ALLOW_LIST']=','.join(allow)
 override.write_text(yaml.safe_dump(config,sort_keys=False));os.chmod(override,0o600)
 rendered=json.loads(subprocess.check_output(compose+['config','--format','json'],cwd=root,stderr=subprocess.DEVNULL))['services']['auth']['environment']
 changes=[key for key,value in rendered.items() if key!='GOTRUE_URI_ALLOW_LIST' and str(value)!=runtime.get(key)]
 assert not changes,'Unexpected Auth configuration differences: '+','.join(changes)
 subprocess.run(compose+['up','-d','--no-deps','auth'],cwd=root,check=True,capture_output=True)
 for attempt in range(30):
  updated=json.loads(subprocess.check_output(['docker','inspect','supabase-auth']))[0]
  if updated['State'].get('Health',{}).get('Status')=='healthy':break
  time.sleep(1)
 assert updated['State'].get('Health',{}).get('Status')=='healthy'
 actual=dict(line.split('=',1) for line in updated['Config']['Env'] if '=' in line)
 assert actual['GOTRUE_URI_ALLOW_LIST']==','.join(allow)
 assert all(actual.get(key)==value for key,value in runtime.items() if key!='GOTRUE_URI_ALLOW_LIST')
except Exception as error:
 shutil.copy2(backup/override.name,override)
 subprocess.run(compose+['up','-d','--no-deps','auth'],cwd=root,capture_output=True)
 print(json.dumps({'ok':False,'rolledBack':True,'backup':str(backup),'errorType':type(error).__name__}))
 raise
print(json.dumps({'ok':True,'backup':str(backup),'authHealthy':True,'otherSettingsPreserved':True,'sendsEmail':False}))
