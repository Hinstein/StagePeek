import {createHmac,createHash,timingSafeEqual} from 'node:crypto';
import {readFile,mkdir,open,writeFile,unlink} from 'node:fs/promises';
import {join} from 'node:path';

const fail=(status,code)=>Object.assign(new Error(code),{status,code});
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const actionFlow={signup:'confirmation',magiclink:'magic-link',recovery:'recovery'};
const words={
 'zh-CN':{confirmation:['验证你的 {brand} 邮箱','回到刚才的注册页面，输入以下验证码。'], 'magic-link':['登录 {brand}','回到刚才的登录页面，输入以下验证码。'],recovery:['重置你的 {brand} 密码','回到密码重置页面，输入以下验证码。'],ignore:'如果不是你本人操作，请忽略本邮件。请勿向任何人透露验证码。'},
 en:{confirmation:['Verify your {brand} email','Return to your sign-up page and enter this verification code.'],'magic-link':['Sign in to {brand}','Return to your sign-in page and enter this verification code.'],recovery:['Reset your {brand} password','Return to your password reset page and enter this verification code.'],ignore:'If you did not request this, ignore this email. Never share your code.'},
 it:{confirmation:['Verifica la tua email {brand}','Torna alla pagina di registrazione e inserisci questo codice.'],'magic-link':['Accedi a {brand}','Torna alla pagina di accesso e inserisci questo codice.'],recovery:['Reimposta la password {brand}','Torna alla pagina di recupero e inserisci questo codice.'],ignore:'Se non hai richiesto questa operazione, ignora questa email. Non condividere il codice.'}
};

export function verifySignature(raw,headers,secrets,now=Date.now()){
 const id=headers['webhook-id'],ts=headers['webhook-timestamp'],signature=headers['webhook-signature'];
 if(!id||id.length>200||!/^\d{10}$/.test(ts||'')||Math.abs(now/1000-Number(ts))>300||typeof signature!=='string'||signature.length>2048)throw fail(401,'INVALID_SIGNATURE');
 const signed=id+'.'+ts+'.'+raw;
 const candidates=signature.split(' ').filter(s=>s.startsWith('v1,')).map(s=>Buffer.from(s.slice(3),'base64'));
 const valid=secrets.split('|').some(secret=>{
  const key=Buffer.from(secret.replace(/^v1,whsec_|^whsec_/,''),'base64');
  if(key.length<32)throw fail(503,'INVALID_SIGNING_CONFIGURATION');
  const expected=createHmac('sha256',key).update(signed).digest();
  return candidates.some(given=>given.length===expected.length&&timingSafeEqual(given,expected));
 });
 if(!valid)throw fail(401,'INVALID_SIGNATURE');
}

export function resolveMail(registry,payload){
 const data=payload.email_data||{},flow=actionFlow[data.email_action_type];
 if(!flow)throw fail(422,'UNSUPPORTED_AUTH_ACTION');
 let url;try{url=new URL(data.redirect_to);}catch{throw fail(422,'UNKNOWN_PROJECT');}
 if(url.username||url.password||url.hash)throw fail(422,'UNKNOWN_PROJECT');
 const project=registry.projects.find(p=>p.origin===url.origin&&Object.entries(p.auth.routes).some(([kind,address])=>kind===flow&&new URL(address).origin===url.origin&&new URL(address).pathname===url.pathname));
 if(!project||!project.auth.enabledFlows.includes(flow)||project.sender.verification!=='verified'||!project.sender.brevoSenderId)throw fail(422,'PROJECT_NOT_READY');
 // Explicit compatibility parameter contract for the existing OpenP7M app.
 // Route origin/path are registered exactly. Metadata never selects a project.
 const params=[...url.searchParams.keys()];
 if(params.some(k=>!['lang','next'].includes(k))||new Set(params).size!==params.length)throw fail(422,'UNKNOWN_ROUTE_PARAMETERS');
 const locale=url.searchParams.get('lang')||project.defaultLocale;
 if(!project.locales.includes(locale))throw fail(422,'UNKNOWN_LANGUAGE');
 const next=url.searchParams.get('next');
 if(next&&(!next.startsWith('/')||next.startsWith('//')||/[\\\x00-\x20]/.test(next)||next.length>2048))throw fail(422,'UNSAFE_RETURN');
 if(project.slug!=='openp7m'&&next)throw fail(422,'UNKNOWN_ROUTE_PARAMETERS');
 if(!/^https:\/\/supabase\.openp7m\.com\/auth-assets\/(?:stagepeek|openp7m)\.png$/.test(project.brand.emailLogoUrl||''))throw fail(422,'INVALID_BRAND_ASSET');
 const email=payload.user?.email,token=data.token;
 if(typeof email!=='string'||email.length>254||!/^\S+@[^\s@]+\.[^\s@]+$/.test(email)||/[<>\x00-\x20\x7f]/.test(email)||!/^\d{6,10}$/.test(token||''))throw fail(422,'INVALID_EMAIL_PAYLOAD');
 const copy=words[locale],brand=project.displayName,[subject,intro]=copy[flow].map(s=>s.replace('{brand}',brand));
 const fingerprint=createHash('sha256').update(JSON.stringify([project.slug,flow,email,token])).digest('hex');
 return {project,flow,locale,fingerprint,message:{sender:{name:project.sender.name,email:project.sender.email},to:[{email}],subject,
  textContent:`${brand}\n\n${intro}\n\n${token}\n\n${copy.ignore}`,
  htmlContent:`<!doctype html><html lang="${esc(locale)}"><body style="margin:0;background:#0b1218;color:#eef5f1;font-family:Arial,sans-serif"><table role="presentation" style="max-width:520px;margin:32px auto;padding:32px;background:#111e27;border-radius:18px"><tr><td><img src="${esc(project.brand.emailLogoUrl)}" width="80" height="80" alt="${esc(project.brand.logoAlt)}"><h1 style="font-size:24px">${esc(brand)}</h1><p>${esc(intro)}</p><p style="font-size:36px;letter-spacing:8px;color:${esc(project.brand.primaryColor)}">${token}</p><p style="color:#a7b4bd;font-size:13px">${esc(copy.ignore)}</p></td></tr></table></body></html>`}};
}

// Persistent no-PII ledger. An ambiguous provider timeout remains pending and
// cannot trigger another send of the same OTP after restart. Request a new OTP.
export async function deliverMail(mail,{ledgerDir,send}){
 await mkdir(ledgerDir,{recursive:true,mode:0o700});
 const filename=join(ledgerDir,mail.fingerprint+'.json');let file;
 try{file=await open(filename,'wx',0o600);await file.writeFile(JSON.stringify({state:'pending',createdAt:Date.now()}));await file.close();}
 catch(error){
  if(error.code!=='EEXIST')throw fail(503,'LEDGER_UNAVAILABLE');
  const stored=JSON.parse(await readFile(filename,'utf8'));
  if(stored.state==='sent')return;
  throw fail(503,'DELIVERY_PENDING');
 }
 try{await send(mail.message,mail.fingerprint,mail.project.slug);}
 catch(error){
  // Only an explicit SMTP 4xx/5xx rejection is safe to retry. Network errors
  // may have happened after DATA acceptance, so keep the pending ledger.
  if(Number(error.responseCode)>=400&&Number(error.responseCode)<600)await unlink(filename);
  throw fail(503,Number(error.responseCode)>=400?'DELIVERY_FAILED':'DELIVERY_UNCERTAIN');
 }
 await writeFile(filename,JSON.stringify({state:'sent',createdAt:Date.now()}),{mode:0o600});
}
