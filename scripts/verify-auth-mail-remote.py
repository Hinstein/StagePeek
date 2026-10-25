import pathlib,json,subprocess,hmac,hashlib,base64,time,urllib.request,urllib.error
p=pathlib.Path('/etc/platform-auth-mail/mail.env');e={k:json.loads(v) for k,v in (line.split('=',1) for line in p.read_text().splitlines())}
url='http://172.21.0.1:14680/send-email'
def post(payload,signed):
 raw=json.dumps(payload,separators=(',',':')).encode();ts=str(int(time.time()));wid='stagepeek-preflight-no-send'
 headers={'Content-Type':'application/json'}
 if signed:
  secret=base64.b64decode(e['AUTH_HOOK_SECRET'].removeprefix('v1,whsec_'))
  sig=base64.b64encode(hmac.new(secret,wid.encode()+b'.'+ts.encode()+b'.'+raw,hashlib.sha256).digest()).decode()
  headers.update({'webhook-id':wid,'webhook-timestamp':ts,'webhook-signature':'v1,'+sig})
 try:r=urllib.request.urlopen(urllib.request.Request(url,raw,headers));return r.status
 except urllib.error.HTTPError as x:return x.code
assert post({},False)==401
assert post({'user':{'email':'no-send@example.invalid'},'email_data':{'redirect_to':'https://invalid.example/auth/callback','email_action_type':'magiclink','token':'000000'}},True)==422
assert post({'email_data':{'email_action_type':'invite'}},True)==422
print('Live hook: unsigned 401, unknown project 422, unsupported flow 422; zero delivery attempts')
