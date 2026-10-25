import {createCipheriv,createDecipheriv,randomBytes} from 'node:crypto';
import {normalizeEmail} from './auth.mjs';
import {fault} from './store.mjs';

const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const invalid=()=>fault(400,'INVALID_OTP','验证码错误或已过期，请重新申请');

// This is transport for Supabase credentials, not a separate identity/session store.
// The shared Auth /user endpoint validates the identity on every request.
export class SupabaseAuth {
  constructor(db,config,{fetch:fetcher=fetch,clock=Date.now}={}){
    this.db=db;this.config=config;this.fetch=fetcher;this.clock=clock;
    this.pendingRefresh=new Map();
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
    });}catch{throw fault(503,'AUTH_UNAVAILABLE','登录服务暂不可用，请稍后重试');}
    const result=await response.json().catch(()=>({}));
    if(!response.ok){
      if(response.status===429)throw fault(429,'RATE_LIMITED','请稍后再试');
      if(response.status>=500)throw fault(503,'AUTH_UNAVAILABLE','登录服务暂不可用');
      throw fault(401,'AUTH_REJECTED','Authentication rejected');
    }
    return result;
  }
  async sendOtp(value){
    if(!this.ready)throw fault(503,'EMAIL_NOT_CONFIGURED','邮箱登录尚未开放');
    const email=normalizeEmail(value);
    await this.request('otp?redirect_to='+encodeURIComponent(this.config.appUrl+'/auth/callback'),{
      method:'POST',body:{email,create_user:true}
    });
    return {email};
  }
  async verifyOtp(email,token){
    if(!this.ready)throw fault(503,'EMAIL_NOT_CONFIGURED','邮箱登录尚未开放');
    email=normalizeEmail(email);
    if(typeof token!=='string'||!/^\d{6,10}$/.test(token))throw invalid();
    let result;
    try{result=await this.request('verify',{method:'POST',body:{email,token,type:'email'}});}
    catch(error){if(error.code==='AUTH_REJECTED')throw invalid();throw error;}
    const identity=await this.identity(result.access_token);
    if(identity.email!==email)throw invalid();
    const user=await this.member(identity,true);
    return {user,cookie:this.seal(this.credentials(result))};
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
    return {id:identity.id,email:normalizeEmail(identity.email)};
  }
  async member(identity,join=false){
    const row=await this.db.prepare(`SELECT * FROM ${join?'join_shared_member':'read_shared_member'}(?)`).get(identity.id);
    if(!row||row.site_id!==this.config.siteId||row.auth_user_id!==identity.id||!['member','admin','owner'].includes(row.member_role))
      throw fault(403,'MEMBERSHIP_REQUIRED','StagePeek membership is required');
    return {id:row.id,email:identity.email,createdAt:row.created_at,googleConnected:false,role:row.member_role};
  }
  async resolve(token){
    const session=this.unseal(token);if(!session)return {user:null};
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
