"""Run as root on VPS1. Uses admin-generated .invalid OTPs; sends no mail.
Only creates/deletes its unique temporary identity. Never prints credentials.
This verifies shared Auth protocol, not inbox delivery or StagePeek browser flow.
"""
import json,pathlib,secrets,urllib.request,urllib.error,urllib.parse,uuid
BASE='https://supabase.openp7m.com/auth/v1/'
env=dict(line.split('=',1) for line in pathlib.Path('/opt/supabase/.env').read_text().splitlines() if '=' in line and not line.startswith('#'))
keys={k:env[k].strip().strip('\"').strip("'") for k in ['SERVICE_ROLE_KEY','ANON_KEY']}
email='stagepeek-flow-check-'+uuid.uuid4().hex+'@example.invalid';password=secrets.token_urlsafe(32);new_password=secrets.token_urlsafe(32)
uid=None;checks=[];step='start'
def call(path,body=None,token=None,admin=False,method=None):
 key=keys['SERVICE_ROLE_KEY' if admin else 'ANON_KEY'];headers={'apikey':key,'Content-Type':'application/json'}
 if token or admin:headers['Authorization']='Bearer '+(token or key)
 req=urllib.request.Request(BASE+path,data=json.dumps(body).encode() if body is not None else None,headers=headers,method=method or ('POST' if body is not None else 'GET'))
 try:
  with urllib.request.urlopen(req,timeout=20) as r:
   raw=r.read();return r.status,json.loads(raw) if raw else {}
 except urllib.error.HTTPError as e:return e.code,{}
def expect(name,condition):
 global step
 step=name;checks.append({'name':name,'ok':bool(condition)})
 if not condition:raise RuntimeError(name)
try:
 step='admin signup generate without delivery'
 status,signup=call('admin/generate_link',{'type':'signup','email':email,'password':password,'redirect_to':'https://stagepeek.live/auth/callback?lang=en'},admin=True)
 uid=signup.get('user',{}).get('id') or signup.get('id');otp=signup.get('email_otp')
 expect(step,status==200 and bool(uid) and bool(otp))
 expect('signup redirect preserves StagePeek English mail route',urllib.parse.parse_qs(urllib.parse.urlparse(signup.get('action_link','')).query).get('redirect_to')==['https://stagepeek.live/auth/callback?lang=en'])
 status,_=call('token?grant_type=password',{'email':email,'password':password});expect('unconfirmed password rejected',status==400)
 status,verified=call('verify',{'type':'signup','email':email,'token':otp});expect('signup OTP verified',status==200 and bool(verified.get('access_token')))
 identity=verified.get('user',{});expect('signup identity consistent',identity.get('id')==uid and bool(identity.get('email_confirmed_at')))
 status,_=call('verify',{'type':'signup','email':email,'token':otp});expect('signup OTP replay rejected',status in [400,403])
 status,session=call('token?grant_type=password',{'email':email,'password':password});expect('password login succeeds',status==200 and session.get('user',{}).get('id')==uid)
 status,_=call('token?grant_type=password',{'email':email,'password':new_password});expect('wrong password rejected',status==400)
 status,link=call('admin/generate_link',{'type':'recovery','email':email,'redirect_to':'https://stagepeek.live/auth/reset?lang=en'},admin=True);expect('recovery generated without delivery',status==200 and bool(link.get('email_otp')))
 expect('recovery redirect preserves StagePeek English mail route',urllib.parse.parse_qs(urllib.parse.urlparse(link.get('action_link','')).query).get('redirect_to')==['https://stagepeek.live/auth/reset?lang=en'])
 status,recovery=call('verify',{'type':'recovery','email':email,'token':link['email_otp']});expect('recovery verified for same identity',status==200 and recovery.get('user',{}).get('id')==uid)
 status,_=call('user',{'password':new_password},token=recovery['access_token'],method='PUT');expect('verified password update succeeds',status==200)
 status,_=call('logout?scope=global',{},token=recovery['access_token']);expect('shared logout accepted',status in [200,204])
 status,_=call('token?grant_type=password',{'email':email,'password':password});expect('old password rejected after update',status==400)
 status,session=call('token?grant_type=password',{'email':email,'password':new_password});expect('new password preserves identity',status==200 and session.get('user',{}).get('id')==uid)
except Exception:
 checks.append({'name':'protocol check interrupted at '+step,'ok':False})
finally:
 if uid:
  # Verify the exact disposable identity before deletion; never touch real users.
  status,identity=call('admin/users/'+uid,admin=True)
  own=status==200 and identity.get('email')==email and email.endswith('@example.invalid')
  if own:
   status,_=call('admin/users/'+uid,admin=True,method='DELETE');checks.append({'name':'temporary identity deleted','ok':status in [200,204]})
  else:checks.append({'name':'cleanup identity boundary','ok':False})
 print(json.dumps({'sendsEmail':False,'productionProtocolOnly':True,'checks':checks,'passed':sum(bool(c['ok']) for c in checks),'total':len(checks)}))
 if not checks or any(not c['ok'] for c in checks):raise SystemExit(1)
