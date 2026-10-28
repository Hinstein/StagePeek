import {createCipheriv,createDecipheriv,randomBytes,createHash} from 'node:crypto';
import {AuthFlowStore} from './auth-flow-store.mjs';
import {safeReturn} from '../public/auth-contract.mjs';
import {normalizeEmail} from './auth.mjs';
import {fault} from './store.mjs';

const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const invalid=()=>fault(400,'INVALID_OTP','验证码错误或已过期，请重新申请');

// This is transport for Supabase credentials, not a separate identity/session store.
// The shared Auth /user endpoint validates the identity on every request.
export class SupabaseAuth {
  constructor(db,config,{fetch:fetcher=fetch,clock=Date.now}={}){
    this.db=db;this.config=config;this.fetch=fetcher;this.clock=clock;
    this.pendingRefresh=new Map();this.flows=new AuthFlowStore(db,this);
    this.key=Buffer.from(config.authCookieKey||'','base64');
    if(this.key.length!==32)throw new Error('AUTH_COOKIE_KEY must encode 32 random bytes');
    if(config.supabaseUrl!=='https://supabase.openp7m.com')throw new Error('Use the shared Supabase Auth origin');
    if(!config.supabaseAnonKey||!UUID.test(config.siteId||''))throw new Error('Shared Auth requires SUPABASE_ANON_KEY and SITE_ID');
  }
  get ready(){return !!this.config.authEmailEnabled;}
  seal(value){
    const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',this.key,iv);
    cipher.setAAD(Buffer.from('stagepeek-supabase-v1'));
    const encrypted=Buffer.concat([cipher.update(JSON.stringify(value)),cipher.final()]);
    const token=Buffer.concat([iv,cipher.getAuthTag(),encrypted]).toString('base64url');
    if(token.length>3800)throw fault(502,'AUTH_SESSION_SIZE','Authentication response exceeds cookie limit');
    return token;
  }
  unseal(token){
    try{
      if(typeof token!=='string'||token.length>3800||!/^[\w-]+$/.test(token))return null;
      const value=Buffer.from(token,'base64url'),decipher=createDecipheriv('aes-256-gcm',this.key,value.subarray(0,12));
      decipher.setAAD(Buffer.from('stagepeek-supabase-v1'));decipher.setAuthTag(value.subarray(12,28));
      const data=JSON.parse(Buffer.concat([decipher.update(value.subarray(28)),decipher.final()]));
      return data.until>this.clock()?data:null;
    }catch{return null;}
  }
  async request(path,{method='GET',body,token}={}){
    let response;
    try{response=await this.fetch(this.config.supabaseUrl+'/auth/v1/'+path,{
      method,headers:{apikey:this.config.supabaseAnonKey,...token?{Authorization:'Bearer '+token}:{},...body?{'Content-Type':'application/json'}:{}},
      body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(10000),redirect:'error'
    });}catch{throw Object.assign(fault(503,'AUTH_UNAVAILABLE','登录服务暂不可用，请稍后重试'),{outcomeUnknown:method==='PUT'});}
    const result=await response.json().catch(()=>({}));
    if(!response.ok){
      if(response.status===429)throw fault(429,'RATE_LIMITED','请稍后再试');
      if(response.status>=500)throw fault(503,'AUTH_UNAVAILABLE','登录服务暂不可用');
      throw fault(401,'AUTH_REJECTED','Authentication rejected');
    }
    return result;
  }
  async sendOtp(value,lang){
    if(!this.ready)throw fault(503,'EMAIL_NOT_CONFIGURED','邮箱登录尚未开放');
    const email=normalizeEmail(value);
    await this.request('otp?redirect_to='+encodeURIComponent(this.callback('/auth/callback',lang)),{
      method:'POST',body:{email,create_user:false}
    });
    return {email};
  }
  async verifyOtp(email,token,type='magiclink'){
    if(!this.ready)throw fault(503,'EMAIL_NOT_CONFIGURED','邮箱登录尚未开放');
    email=normalizeEmail(email);
    if(!['magiclink','signup'].includes(type))throw invalid();
    if(typeof token!=='string'||!/^\d{6,10}$/.test(token))throw invalid();
    let result;
    try{result=await this.request('verify',{method:'POST',body:{email,token,type}});}
    catch(error){if(error.code==='AUTH_REJECTED')throw invalid();throw error;}
    const identity=await this.identity(result.access_token);
    if(identity.email!==email)throw invalid();
    const user=await this.member(identity,true);
    return {user,cookie:this.seal(this.credentials(result))};
  }
  password(value){
    if(typeof value!=='string'||value.length<12||Buffer.byteLength(value)>256)throw fault(400,'WEAK_PASSWORD','密码需至少 12 字符，最多 256 字节');
    return value;
  }
  // Authentication emails use English; the browser flow retains its own locale.
  callback(path){return this.config.appUrl+path+'?lang=en';}
  async register(value,password,lang){
    if(!this.ready)throw fault(503,'EMAIL_NOT_CONFIGURED','邮箱注册尚未开放');
    const email=normalizeEmail(value);
    await this.request('signup?redirect_to='+encodeURIComponent(this.callback('/auth/callback',lang)),{method:'POST',body:{email,password:this.password(password)}});
    return {email};
  }
  async resendSignup(email,lang){
    await this.request('resend?redirect_to='+encodeURIComponent(this.callback('/auth/callback',lang)),{method:'POST',body:{type:'signup',email:normalizeEmail(email)}});
  }
  async loginPassword(value,password){
    const email=normalizeEmail(value);
    if(typeof password!=='string'||!password||Buffer.byteLength(password)>256)throw fault(401,'INVALID_CREDENTIALS','邮箱或密码不正确');
    let result;try{result=await this.request('token?grant_type=password',{method:'POST',body:{email,password}});}
    catch(error){if(error.code==='AUTH_REJECTED')throw fault(401,'INVALID_CREDENTIALS','邮箱或密码不正确');throw error;}
    const identity=await this.identity(result.access_token);
    return {user:await this.member(identity,true),cookie:this.seal(this.credentials(result))};
  }
  async sendRecovery(value,lang){
    if(!this.config.authRecoveryEnabled)throw fault(503,'RECOVERY_NOT_CONFIGURED','密码恢复尚未开放');
    const email=normalizeEmail(value);
    await this.request('recover?redirect_to='+encodeURIComponent(this.callback('/auth/reset',lang)),{method:'POST',body:{email}});
    return {email};
  }
  async verifyRecovery(value,token,returnTo,expectedUser=null){
    if(!this.config.authRecoveryEnabled)throw fault(503,'RECOVERY_NOT_CONFIGURED','密码恢复尚未开放');
    const email=normalizeEmail(value);
    if(typeof token!=='string'||!/^\d{6,10}$/.test(token))throw invalid();
    let result;try{result=await this.request('verify',{method:'POST',body:{email,token,type:'recovery'}});}
    catch(error){if(error.code==='AUTH_REJECTED')throw invalid();throw error;}
    const identity=await this.identity(result.access_token);
    if(identity.email!==email||(expectedUser&&identity.id!==expectedUser))throw invalid();
    // No project membership or normal login cookie is issued for recovery.
    return this.flows.put('recovery',{purpose:'recovery',userId:identity.id,...this.credentials(result),returnTo:safeReturn(returnTo)},600000);
  }
  async completePassword(handle,password,kind='recovery'){
    if(kind!=='recovery')throw invalid();
    password=this.password(password);
    const grant=await this.flows.take(handle,'recovery');
    try{
      const identity=await this.identity(grant.access);
      if(identity.id!==grant.userId)throw invalid();
      await this.request('user',{method:'PUT',token:grant.access,body:{password}});
    }catch(error){
      // Only the original browser handle is restored, with its original expiry.
      // No successful update is made reusable; an ambiguous timeout is reported.
      if(error.outcomeUnknown)throw fault(503,'AUTH_PASSWORD_RESULT_UNKNOWN','密码更新结果尚未确认，请尝试使用新密码登录，或重新验证邮箱');
      if(error.status>=500||error.status===429)await this.flows.restore(handle,'recovery',grant);
      throw error;
    }
    // Revoke shared refresh sessions; already issued JWTs retain their own TTL.
    let sessionsRevoked=true;
    try{await this.request('logout?scope=global',{method:'POST',token:grant.access});}catch{sessionsRevoked=false;}
    return {returnTo:grant.returnTo,sessionsRevoked};
  }
  async startGoogle(returnTo){
    if(!this.config.authGoogleEnabled)throw fault(503,'GOOGLE_NOT_CONFIGURED','Google 登录尚未配置');
    const verifier=randomBytes(48).toString('base64url');
    const flow=await this.flows.put('google',{purpose:'google',verifier,returnTo:safeReturn(returnTo)},600000);
    const url=new URL(this.config.supabaseUrl+'/auth/v1/authorize');
    url.search=new URLSearchParams({provider:'google',redirect_to:this.config.appUrl+'/auth/google/callback',code_challenge:createHash('sha256').update(verifier).digest('base64url'),code_challenge_method:'s256'}).toString();
    return {flow,url:url.href};
  }
  async finishGoogle(handle,code){
    const flow=await this.flows.take(handle,'google');
    if(typeof code!=='string'||!code||code.length>4096)throw fault(400,'GOOGLE_FAILED','Google 登录未完成，请重试');
    const result=await this.request('token?grant_type=pkce',{method:'POST',body:{auth_code:code,code_verifier:flow.verifier}});
    const identity=await this.identity(result.access_token);
    if(!identity.googleConnected)throw fault(401,'GOOGLE_FAILED','未取得可信 Google 身份');
    return {user:await this.member(identity,true),cookie:this.seal(this.credentials(result)),returnTo:flow.returnTo};
  }
  credentials(result){
    if(typeof result.access_token!=='string'||typeof result.refresh_token!=='string'||!Number.isFinite(result.expires_in)||result.expires_in<=0)
      throw fault(502,'AUTH_INVALID_RESPONSE','Invalid authentication response');
    return {access:result.access_token,refresh:result.refresh_token,expires:this.clock()+result.expires_in*1000,
      until:this.clock()+30*86400_000};
  }
  async identity(token){
    const identity=await this.request('user',{token});
    if(!UUID.test(identity.id||'')||!identity.email_confirmed_at||identity.is_anonymous)
      throw fault(401,'LOGIN_REQUIRED','请先验证邮箱');
    return {id:identity.id,email:normalizeEmail(identity.email),googleConnected:identity.identities?.some(i=>i.provider==='google')||false};
  }
  async member(identity,join=false){
    const row=await this.db.prepare(`SELECT * FROM ${join?'join_shared_member':'read_shared_member'}(?)`).get(identity.id);
    if(!row||row.site_id!==this.config.siteId||row.auth_user_id!==identity.id||!['member','admin','owner'].includes(row.member_role))
      throw fault(403,'MEMBERSHIP_REQUIRED','StagePeek membership is required');
    return {id:row.id,email:identity.email,createdAt:row.created_at,googleConnected:!!identity.googleConnected,role:row.member_role};
  }
  async resolve(token){
    const session=this.unseal(token);if(!session||session.purpose||!session.access||!session.refresh)return {user:null};
    try{
      let fresh=session,rotated=false;
      if(session.expires<=this.clock()+30_000){
        // Deduplicate parallel requests using the same rotating refresh credential.
        let pending=this.pendingRefresh.get(session.refresh);
        if(!pending){
          pending=this.request('token?grant_type=refresh_token',{method:'POST',body:{refresh_token:session.refresh}})
            .then(data=>this.credentials(data));
          this.pendingRefresh.set(session.refresh,pending);
          const timer=setTimeout(()=>this.pendingRefresh.delete(session.refresh),15000);timer.unref?.();
        }
        fresh=await pending;rotated=true;
      }
      const identity=await this.identity(fresh.access),user=await this.member(identity);
      return {user,...rotated?{cookie:this.seal(fresh)}:{}};
    }catch(error){
      // An outage must not destroy a valid session or be represented as logout.
      if(error.status>=500||error.status===429)throw error;
      return {user:null,clear:true};
    }
  }
  async logout(token){
    const session=this.unseal(token);if(!session)return;
    try{await this.request('logout?scope=local',{method:'POST',token:session.access});}
    catch(error){if(error.code!=='AUTH_REJECTED')throw error;}
  }
}
