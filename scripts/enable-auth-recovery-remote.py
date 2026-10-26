"""Run on VPS1 after StagePeek recovery consumer is deployed. No mail sent."""
import datetime,json,pathlib,shutil,subprocess,sys
path=pathlib.Path('/opt/platform-auth-mail/mail-projects.preflight.json');registry=json.loads(path.read_text())
project=next(p for p in registry['projects'] if p['slug']=='seatpeep')
assert project['origin']=='https://stagepeek.live' and project['sender']['verification']=='verified'
project['auth']['routes']['recovery']='https://stagepeek.live/auth/reset'
project['auth']['enabledFlows']=list(dict.fromkeys(project['auth']['enabledFlows']+['recovery']))
if '--apply' not in sys.argv:
 print(json.dumps({'mode':'plan','project':'seatpeep','recoveryRoute':project['auth']['routes']['recovery'],'enabledFlows':project['auth']['enabledFlows']}));raise SystemExit()
backup=pathlib.Path('/root/supabase-backups/stagepeek-recovery-'+datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ'));backup.mkdir(mode=0o700)
shutil.copy2(path,backup/path.name)
try:
 path.write_text(json.dumps(registry,ensure_ascii=False,indent=2)+'\n')
 # Resolve each branded recovery template without invoking delivery.
 test="""import {readFileSync} from 'node:fs';import {resolveMail} from '/opt/platform-auth-mail/router.mjs';const r=JSON.parse(readFileSync('/opt/platform-auth-mail/mail-projects.preflight.json'));for(const lang of ['zh-CN','en']){const m=resolveMail(r,{user:{email:'fixture@example.invalid'},email_data:{email_action_type:'recovery',redirect_to:'https://stagepeek.live/auth/reset?lang='+lang,token:'123456'}});if(m.project.slug!=='seatpeep'||m.locale!==lang||m.message.textContent.includes('https://'))throw Error('Recovery template failed');}console.log('Brand recovery templates resolved without delivery');"""
 subprocess.run(['node','--input-type=module','-e',test],check=True)
 subprocess.run(['systemctl','restart','platform-auth-mail'],check=True)
 subprocess.run(['systemctl','is-active','--quiet','platform-auth-mail'],check=True)
except Exception:
 shutil.copy2(backup/path.name,path);subprocess.run(['systemctl','restart','platform-auth-mail']);raise
print(json.dumps({'backup':str(backup),'project':'seatpeep','recoveryConfigured':True,'otherProjectsPreserved':True,'sendsEmail':False}))
