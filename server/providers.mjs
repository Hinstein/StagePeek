import {fault} from './store.mjs';

export class GoogleProvider {
  constructor(config,{fetch:fetcher=fetch}={}){this.config=config;this.fetch=fetcher;}
  get ready(){return !!(this.config.googleClientId&&this.config.googleClientSecret);}
  authorizationUrl({state,challenge}) {
    if(!this.ready)throw fault(503,'GOOGLE_NOT_CONFIGURED','Google sign-in is not configured');
    const url=new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.search=new URLSearchParams({client_id:this.config.googleClientId,
      redirect_uri:this.config.appUrl+'/api/auth/google/callback',response_type:'code',
      scope:'openid email',state,code_challenge:challenge,code_challenge_method:'S256',prompt:'select_account'});
    return url.href;
  }
  async profile(code,verifier) {
    if(!this.ready)throw fault(503,'GOOGLE_NOT_CONFIGURED','Google sign-in is not configured');
    const result=await this.fetch('https://oauth2.googleapis.com/token',{
      method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},signal:AbortSignal.timeout(15_000),
      body:new URLSearchParams({client_id:this.config.googleClientId,client_secret:this.config.googleClientSecret,
        redirect_uri:this.config.appUrl+'/api/auth/google/callback',grant_type:'authorization_code',code,code_verifier:verifier}).toString()
    });
    if(!result.ok)throw fault(502,'GOOGLE_FAILED','Google sign-in failed');
    const tokens=await result.json();
    if(typeof tokens.access_token!=='string'||!tokens.access_token)throw fault(502,'GOOGLE_FAILED','Google sign-in failed');
    const profile=await this.fetch('https://openidconnect.googleapis.com/v1/userinfo',{
      headers:{Authorization:'Bearer '+tokens.access_token},signal:AbortSignal.timeout(15_000)
    });
    if(!profile.ok)throw fault(502,'GOOGLE_FAILED','Google profile request failed');
    return profile.json();
  }
}

export class EmailProvider {
  constructor(config,{fetch:fetcher=fetch}={}){this.config=config;this.fetch=fetcher;this.outbox=[];}
  get ready(){return !!((this.config.brevoApiKey||this.config.resendApiKey)&&this.config.emailFrom)||this.config.devMailbox;}
  async sendLogin({email,token,expiresAt},{origin=this.config.appUrl}={}) {
    const allowed=[this.config.appUrl,...(this.config.allowedOrigins||[])];
    const base=this.config.devMailbox&&!this.config.production&&allowed.includes(origin)?origin:this.config.appUrl;
    const url=base+'/?login=email#token='+encodeURIComponent(token);
    if(this.config.devMailbox){
      this.outbox.unshift({email,url,expiresAt,createdAt:Date.now()});this.outbox.length=Math.min(this.outbox.length,20);return;
    }
    if(!this.ready)throw fault(503,'EMAIL_NOT_CONFIGURED','Email delivery is not configured');
    const text=`Sign in to SeatPeep:\n\n${url}\n\nThis link expires in 15 minutes. Open it in the browser where you requested it. If you did not request it, ignore this email.`;
    const brevo=!!this.config.brevoApiKey;
    const response=await this.fetch(brevo?'https://api.brevo.com/v3/smtp/email':'https://api.resend.com/emails',{
      method:'POST',headers:{[brevo?'api-key':'Authorization']:brevo?this.config.brevoApiKey:'Bearer '+this.config.resendApiKey,'Content-Type':'application/json'},
      signal:AbortSignal.timeout(15_000),body:JSON.stringify(brevo?{sender:{email:this.config.emailFrom},to:[{email}],subject:'Sign in to SeatPeep',textContent:text}:{from:this.config.emailFrom,to:[email],subject:'Sign in to SeatPeep',text})
    });
    if(!response.ok)throw fault(502,'EMAIL_FAILED','Could not send login email');
  }
}
