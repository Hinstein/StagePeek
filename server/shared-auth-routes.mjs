import {normalizeLocale} from './locales.mjs';
import {hash,normalizeEmail} from './auth.mjs';
import {fault,limit} from './store.mjs';
import {safeReturn,TERMS_VERSION} from '../public/auth-contract.mjs';
export async function consentStatus(db,user){
 if(!user)return {required:false,version:TERMS_VERSION};
 const row=await db.prepare('SELECT version FROM auth_consents WHERE user_id=?').get(user.id);
 return {required:row?.version!==TERMS_VERSION,version:TERMS_VERSION};
}
export function sharedAuthRoutes({auth,db,config,cookie,json,body,cookies,prefix,clock}){
 const runAs=(user,fn)=>db.withIdentity?db.withIdentity(user.id,fn):fn();
 async function accept(user){await runAs(user,()=>db.prepare('INSERT INTO auth_consents(user_id,version,accepted_at) VALUES(?,?,?) ON CONFLICT(user_id) DO UPDATE SET version=excluded.version,accepted_at=excluded.accepted_at').run(user.id,TERMS_VERSION,clock()));}
 async function throttle(req,email,kind){
  await limit(db,'auth-ip:'+kind+':'+hash(req.socket.remoteAddress||''),kind==='verify'?20:12,3600000,clock());
  if(email)await limit(db,'auth-email:'+kind+':'+hash(email),kind==='verify'?8:3,900000,clock());
 }
 async function begin(req,res,input,kind,invoke){
  const email=normalizeEmail(input.email);await throttle(req,email,'send');
  await invoke(email);
  const flow=await auth.flows.put(kind,{email,returnTo:safeReturn(input.returnTo),consent:input.consent===true,lang:normalizeLocale(input.lang),expectedUser:input.expectedUser||null});
  cookie(res,'flow',flow,900);return json(res,200,{sent:true,resendAfter:60});
 }
 async function consume(req,kind,action){
  const handle=cookies(req)[prefix+'flow'],flow=await auth.flows.take(handle,kind);
  try{return await action(flow);}catch(error){
   if(['INVALID_OTP','RATE_LIMITED','AUTH_UNAVAILABLE'].includes(error.code))await auth.flows.restore(handle,kind,flow);
   throw error;
  }
 }
 async function login(req,res,result,returnTo,agreed=false){
  for(const name of ['flow','recovery','oauth']){await auth.flows.discard(cookies(req)[prefix+name]);cookie(res,name,'',0);}
  if(agreed)await accept(result.user);
  cookie(res,'supabase',result.cookie,30*86400);cookie(res,'flow','',0);cookie(res,'otp','',0);
  json(res,200,{user:result.user,returnTo:safeReturn(returnTo),consent:await runAs(result.user,()=>consentStatus(db,result.user))});
 }
 return async(req,res,url,user)=>{
  const path=url.pathname,method=req.method;
  if(path==='/auth/google/callback'&&method==='GET'){
   const flow=cookies(req)[prefix+'oauth'];cookie(res,'oauth','',0);
   try{
    if(url.searchParams.has('error')){await auth.flows.take(flow,'google');throw fault(400,'GOOGLE_CANCELED','Google 登录已取消');}
    const result=await auth.finishGoogle(flow,url.searchParams.get('code'));
    for(const name of ['flow','recovery']){await auth.flows.discard(cookies(req)[prefix+name]);cookie(res,name,'',0);}
    cookie(res,'supabase',result.cookie,30*86400);
    // The account page enforces consent before a new member can write data.
    res.writeHead(303,{Location:'/auth/continue?next='+encodeURIComponent(result.returnTo)});res.end();
   }catch(error){const code=error.code==='GOOGLE_CANCELED'?'GOOGLE_CANCELED':'GOOGLE_FAILED';res.writeHead(303,{Location:'/auth/login?error='+code});res.end();}
   return true;
  }
  if(!path.startsWith('/api/auth/'))return false;
  if(path==='/api/auth/status'&&method==='GET'){
   const pending=await auth.flows.peek(cookies(req)[prefix+'flow']);
   const grant=await auth.flows.peek(cookies(req)[prefix+'recovery']);
   json(res,200,{flow:grant?.kind==='recovery'?{kind:'new-password',returnTo:grant.returnTo}:pending?{kind:pending.kind,email:pending.email,returnTo:pending.returnTo,expectedUser:!!pending.expectedUser,retryAt:pending.createdAt+60000}:null});return true;
  }
  if(method!=='POST')throw fault(405,'METHOD_NOT_ALLOWED','Method not allowed');
  if(path==='/api/auth/cancel'){
   await body(req);for(const name of ['flow','recovery','oauth']){await auth.flows.discard(cookies(req)[prefix+name]);cookie(res,name,'',0);}json(res,200,{ok:true});return true;
  }
  if(path==='/api/auth/register'){
   const input=await body(req);if(input.consent!==true)throw fault(400,'CONSENT_REQUIRED','请阅读并同意条款与隐私政策');
   const email=normalizeEmail(input.email);await throttle(req,email,'send');const result=await auth.register(email,input.password,input.lang);
   if(result.existing)throw fault(409,'ACCOUNT_EXISTS','该邮箱已经注册，请返回登录并使用邮箱验证码登录');
   const flow=await auth.flows.put('signup',{email:result.email,returnTo:safeReturn(input.returnTo),consent:true,lang:normalizeLocale(input.lang),expectedUser:input.expectedUser||null});
   cookie(res,'flow',flow,900);return json(res,200,{sent:true,resendAfter:60});
  }
  if(path==='/api/auth/login'){
   const input=await body(req),email=normalizeEmail(input.email);await throttle(req,email,'login');
   await login(req,res,await auth.loginPassword(email,input.password),input.returnTo);return true;
  }
  if(path==='/api/auth/email'){
   const input=await body(req);await begin(req,res,input,'magiclink',email=>auth.sendOtp(email,input.lang));return true;
  }
  if(path==='/api/auth/register/resend'){
   await body(req);await consume(req,'signup',flow=>begin(req,res,flow,'signup',email=>auth.resendSignup(email,flow.lang)));return true;
  }
  if(path==='/api/auth/register/verify'||path==='/api/auth/email/verify'){
   const input=await body(req),kind=path.includes('/register/')?'signup':'magiclink';
   if(typeof input.code!=='string'||!/^\d{6,10}$/.test(input.code))throw fault(400,'INVALID_OTP','请输入验证码');
   await consume(req,kind,async flow=>{await throttle(req,flow.email,'verify');await login(req,res,await auth.verifyOtp(flow.email,input.code,kind),flow.returnTo,flow.consent);});
   return true;
  }
  if(path==='/api/auth/recovery'){
   const input=await body(req);if(user){input.email=user.email;input.expectedUser=user.id;}
   await begin(req,res,input,'recover-pending',email=>auth.sendRecovery(email,input.lang));return true;
  }
  if(path==='/api/auth/recovery/verify'){
   const input=await body(req);await consume(req,'recover-pending',async flow=>{await throttle(req,flow.email,'verify');const grant=await auth.verifyRecovery(flow.email,input.code,flow.returnTo,flow.expectedUser);cookie(res,'recovery',grant,600);cookie(res,'flow','',0);json(res,200,{verified:true});});
   return true;
  }
  if(path==='/api/auth/recovery/complete'){
   const input=await body(req);const result=await auth.completePassword(cookies(req)[prefix+'recovery'],input.password);
   cookie(res,'recovery','',0);cookie(res,'supabase','',0);cookie(res,'flow','',0);json(res,200,result);return true;
  }
  if(path==='/api/auth/consent'){
   if(!user)throw fault(401,'LOGIN_REQUIRED','请先登录');const input=await body(req);
   if(input.version!==TERMS_VERSION||input.accepted!==true)throw fault(400,'CONSENT_REQUIRED','请确认当前条款');
   await accept(user);json(res,200,{ok:true});return true;
  }
  if(path==='/api/auth/google/start'){
   const input=await body(req);await throttle(req,null,'google');
   const start=await auth.startGoogle(input.returnTo);cookie(res,'oauth',start.flow,600);json(res,200,{url:start.url});return true;
  }
  if(path==='/api/auth/logout'){
   await body(req);await auth.logout(cookies(req)[prefix+'supabase']);
   for(const name of ['flow','oauth','recovery'])await auth.flows.discard(cookies(req)[prefix+name]);
   for(const name of ['supabase','flow','oauth','otp','recovery','session'])cookie(res,name,'',0);
   json(res,200,{ok:true});return true;
  }
  throw fault(404,'NOT_FOUND','Not found');
 };
}
