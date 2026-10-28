import {safeReturn,TERMS_VERSION,needsConsentPage,venueReturn} from './auth-contract.mjs';
import {accountSummary} from './account-summary.mjs';
import {copy,getLocale,localizedPath,parseLocalizedPath,SUPPORTED_LOCALES,translations} from './locales.mjs';
import './language-switcher.mjs';
const $=id=>document.getElementById(id),query=new URLSearchParams(location.search);
let lang=getLocale(),next=safeReturn(query.get('next')),me=null,busy=false,resendAt=0;
history.replaceState(null,'',location.pathname+'?'+new URLSearchParams({next,lang}));
let savedPositions=null;
const basePath=parseLocalizedPath(location.pathname).path;
let mode=({'/auth/register':'register','/auth/reset':'reset','/auth/password':'setup','/account':'account','/auth/continue':'continue'})[basePath]||'login',source=mode;
const en=()=>lang==='en';
const errors={AUTH_PASSWORD_RESULT_UNKNOWN:["密码可能已更新，请尝试使用新密码登录，或重新验证邮箱。",'Your password may have changed. Try signing in with your new password, or verify your email again.'],INVALID_OTP:["验证码错误或已过期，请重新获取。",'The code is incorrect or expired. Request another.'],AUTH_FLOW_EXPIRED:["验证已失效，请重新开始。",'This verification has expired. Start again.'],INVALID_CREDENTIALS:["邮箱或密码不正确。",'Email or password is incorrect.'],WEAK_PASSWORD:["密码需至少 12 字符，最多 256 字节。",'Use at least 12 characters, up to 256 bytes.'],RATE_LIMITED:["请求过于频繁，请稍后再试。",'Too many attempts. Please try later.'],AUTH_UNAVAILABLE:["登录服务暂不可用，请稍后重试。",'Sign-in is temporarily unavailable.'],AUTH_REJECTED:["暂时无法完成，请重试或使用登录/找回密码。",'Unable to continue. Retry, sign in, or recover your password.'],GOOGLE_FAILED:["Google 登录未完成，请重新发起。",'Google sign-in failed. Please retry.'],GOOGLE_CANCELED:["已取消 Google 登录，可用邮箱继续。",'Google sign-in was cancelled. Continue with email.'],LOGIN_REQUIRED:["请先登录。",'Please sign in first.'],CONSENT_REQUIRED:["请先同意条款与隐私政策。",'Please accept the terms and privacy policy.']};
function feedback(value){$('auth-feedback').textContent=value;}
async function api(path,body,method=body?'POST':'GET'){let response;try{response=await fetch(path,{method,credentials:'same-origin',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(15000)});}catch{throw new Error(copy("网络连接失败，请重试。"));}const data=await response.json();if(!response.ok)throw Object.assign(new Error((en()?errors[data.error?.code]?.[1]:errors[data.error?.code]?copy(errors[data.error.code][0]):null)||copy("暂时无法完成，请稍后重试。")),{code:data.error?.code});return data;}
function route(path){const url=new URL(path,location.origin);url.searchParams.set('next',next);url.searchParams.set('lang',lang);return localizedPath(lang,url.pathname)+url.search;}
function link(text,path){const a=document.createElement('a');a.textContent=text;a.href=route(path);$('auth-links').append(a);}
function show(id,visible){$(id).hidden=!visible;}
function clearSecret(){for(const id of ['auth-password','auth-confirm','auth-code'])$(id).value='';}
function render(){
 document.documentElement.lang=lang;
 document.querySelector('.auth-header a').href=localizedPath(lang,'/');
 document.body.classList.toggle('account-page',mode==='account');
 const code=mode==='code',recover=['reset','setup','recover-code','new-password'].includes(mode),password=['login','register','new-password'].includes(mode),account=mode==='account',consent=mode==='consent';
 const titles={login:copy("登录 StagePeek"),register:copy("创建 StagePeek 账号"),otp:copy("邮箱验证码登录"),reset:copy("找回密码"),setup:copy("设置或更改统一账号密码"),code:source==='register'?copy("验证邮箱，完成注册"):copy("输入登录验证码"),'recover-code':copy("验证邮箱 · 第 2 / 3 步"),'new-password':copy("设置新密码 · 第 3 / 3 步"),account:copy("我的账号"),consent:copy("欢迎来到 StagePeek")};
 $('auth-title').textContent=titles[mode]||titles.login;document.title=$('auth-title').textContent+' · StagePeek';document.documentElement.lang=lang;
 $('auth-description').textContent=account?copy("管理你的账号与订阅。"):code||mode==='recover-code'?copy("请在刚才的邮箱中查看验证码，回到这里输入。"):recover?copy("验证邮箱后修改统一账号密码。"):mode==='register'?copy("先填写邮箱和密码，再通过邮箱验证码完成注册。"):copy("继续探索你的现场位置。");
 show('auth-security',!!me?.user&&!account);$('security-account').href=route('/account');$('security-account').textContent=copy("账号安全");$('security-logout').textContent=copy("退出登录");
 show('account-consent',account&&!!me?.consent?.required);$('account-consent').href=route('/auth/continue');$('account-consent').textContent=copy("请确认服务条款以保存位置或管理订阅");
 show('auth-account',account&&!!me?.user);show('auth-form',!account);show('auth-email-field',['login','register','otp','reset','setup'].includes(mode));
 $('auth-email').required=['login','register','otp','reset','setup'].includes(mode);$('auth-email').readOnly=mode==='setup';
 if(mode==='setup'&&me?.user)$('auth-email').value=me.user.email;
 show('auth-password-field',password);$('auth-password').required=password;$('auth-password').autocomplete=mode==='login'?'current-password':'new-password';$('auth-password').minLength=mode==='login'?1:12;
 show('auth-confirm-field',mode==='new-password');$('auth-confirm').required=mode==='new-password';
 show('auth-password-rule',password&&mode!=='login');$('auth-password-rule').textContent=copy("至少 12 字符，最多 256 字节；可使用密码管理器。");
 show('auth-target',code||mode==='recover-code');const address=$('auth-email').value,parts=address.split('@');$('auth-target').textContent=parts.length===2?parts[0].slice(0,1)+'***@'+parts[1]:'';
 show('auth-code-field',code||mode==='recover-code');$('auth-code').required=code||mode==='recover-code';
 show('auth-consent-field',mode==='register'||consent);$('auth-consent').required=mode==='register'||consent;
 show('auth-shared-warning',recover);$('auth-shared-warning').textContent=copy("你修改的是统一账号密码，同一账号在其他平台产品也会使用新密码。完成后其他设备及产品可能需要重新登录。此操作不会更改你的 Google 密码。");
 const submit={login:copy("登录"),register:copy("注册并发送验证码"),otp:copy("发送登录验证码"),reset:copy("发送恢复验证码"),setup:copy("验证邮箱以继续"),code:source==='register'?copy("验证并完成注册"):copy("验证并登录"),'recover-code':copy("验证并继续"),'new-password':copy("确认更新密码"),consent:copy("同意并继续")};
 $('auth-submit').textContent=submit[mode]||submit.login;
 const google=!!me?.providers.google&&['login','register','otp'].includes(mode);show('auth-google',google);show('auth-or',google);
 show('auth-code-actions',code||mode==='recover-code');show('auth-change',mode!=='recover-code'||source!=='setup');
 $('auth-links').replaceChildren();if(mode==='login'){if(me?.providers.recovery)link(copy("忘记密码？"),'/auth/reset');link(copy("使用邮箱验证码"),'/auth/login?method=otp');link(copy("还没有账号？注册"),'/auth/register');}
 else if(!account)link(copy("已有账号？返回登录"),'/auth/login');
 // Keep method switching in-page, avoiding a second password-only reload.
 const otpLink=$('auth-links').querySelector('a[href*="method=otp"]');if(otpLink)otpLink.onclick=e=>{e.preventDefault();clearSecret();mode='otp';feedback('');render();};
 $('auth-back').href=next;$('auth-back').textContent=copy("返回场馆预览");
 $('email-label').textContent=copy("邮箱地址");$('password-label').textContent=copy("密码");$('confirm-label').textContent=copy("确认新密码");$('code-label').textContent=copy("邮箱验证码");$('auth-google').textContent=copy("使用 Google 登录");$('auth-or').textContent=copy("或");$('auth-reveal').textContent=$('auth-password').type==='password'?copy("显示"):copy("隐藏");$('help-title').textContent=copy("收不到验证码？");$('help-copy').textContent=copy("检查邮箱拼写和垃圾邮件，等待后重发。请使用发起验证的浏览器。");
 $('consent-copy').replaceChildren(document.createTextNode(copy("我已阅读并同意 ")));for(const [name,path]of [[copy("服务条款"),'/terms.html'],[copy("隐私政策"),'/privacy.html']]){const a=document.createElement('a');a.textContent=name;a.href=localizedPath(lang,path.replace('.html',''));a.target='_blank';a.rel='noopener';$('consent-copy').append(a,document.createTextNode(' '));}
 const legal=document.querySelectorAll('.auth-footer a');for(const a of legal)a.href=localizedPath(lang,new URL(a.href).pathname.replace('.html',''));legal[0].textContent=copy("服务条款");legal[1].textContent=copy("隐私政策");
 const languageButton=$('auth-language').querySelector('button'),languageMenu=$('auth-language').querySelector('[role="menu"]');languageButton.setAttribute('aria-label',translations(lang)['language.label']);languageButton.querySelector('.language-current').textContent=translations(lang)['language.current'];languageMenu.replaceChildren(...SUPPORTED_LOCALES.map(item=>{const a=document.createElement('a');a.href=localizedPath(item,basePath);a.textContent=translations(lang)[`language.${item}`]||item;a.dataset.locale=item;a.setAttribute('role','menuitem');if(item===lang)a.setAttribute('aria-current','true');a.onclick=event=>{event.preventDefault();lang=item;next=localizedPath(lang,next);history.replaceState(null,'',localizedPath(lang,basePath)+'?'+new URLSearchParams({next,lang}));render();};return a;}));
 $('auth-change').textContent=copy("换一个邮箱 / 返回");updateResend();
 if(account&&me?.user)renderAccount();
}
function renderAccount(){
 const summary=accountSummary(me,lang);
 $('account-address').textContent=me.user.email;
 $('account-name').textContent=me.user.email.split('@')[0];
 $('account-avatar').textContent=me.user.email.slice(0,2).toUpperCase();
 $('account-profile-tier').textContent=summary.plan;
 $('account-profile-label').textContent=copy("你的 StagePeek 账号");
 $('account-tier').textContent=summary.plan;
 $('account-plan-status').textContent=summary.status;
 $('account-plan-status').classList.toggle('is-pro',summary.pro);
 $('account-plan-label').textContent=copy("当前套餐");
 $('account-plan-description').textContent=summary.description;
 $('account-venues-count').textContent=String(me.access.venueIds.length);
 $('account-venues-label').textContent=summary.pro?copy("全部可用场馆"):copy("精选免费场馆");
 $('account-saved-limit').textContent=String(me.access.maxSaved);
 $('account-saved-limit-label').textContent=copy("位置收藏额度");
 $('account-preview-label').textContent=copy("座位视角预览");
 $('account-subscription').textContent=summary.period;
 $('account-billing').href=next+(next.includes('?')?'&':'?')+'account=billing';
 $('account-billing').textContent=summary.pro?copy("管理订阅与账单 ↗"):copy("探索 Pro 权益 ↗");
 show('account-billing',me.providers.billing);
 show('account-billing-note',!me.providers.billing);
 $('account-billing-note').textContent=summary.pro?copy("在线账单管理暂未开放"):copy("Pro 订阅即将开放");
 for(const item of document.querySelectorAll('.account-nav a'))item.onclick=()=>{for(const other of document.querySelectorAll('.account-nav a'))other.classList.toggle('is-current',other===item);};
 $('account-nav-overview').textContent=copy("套餐与权益");
 $('account-nav-saved').textContent=copy("我的收藏");
 $('account-nav-security').textContent=copy("账号安全");
 $('account-explore').textContent=copy("继续探索场馆 ↗");$('account-explore').href=next;
 $('positions-title').textContent=copy("我的收藏");
 $('account-security-title').textContent=copy("账号与安全");
 $('account-verified').textContent=copy("邮箱已验证");
 $('account-email-title').textContent=copy("邮箱地址");
 $('account-security-email').textContent=me.user.email;
 $('account-email-status').textContent=copy("已验证");
 $('account-google-title').textContent=copy("Google 账号");
 $('account-identities').textContent=me.user.googleConnected?copy("可使用 Google 快速登录此账号。"):copy("当前账号未关联 Google。");
 $('account-google-status').textContent=me.user.googleConnected?copy("已连接"):copy("未连接");
 $('account-google-status').classList.toggle('is-muted',!me.user.googleConnected);
 $('account-password-title').textContent=copy("登录密码");
 $('account-password-description').textContent=copy("通过邮箱验证，安全设置或修改密码。");
 $('account-password').href=route('/auth/password');$('account-password').textContent=copy("管理密码 ↗");
 show('account-password-row',me.providers.recovery);
 $('account-session-title').textContent=copy("当前登录");
 $('account-session-description').textContent=copy("在这台设备上退出 StagePeek。");
 $('auth-logout').textContent=copy("退出登录");
 if(savedPositions)renderPositions();else void positions();
}
function renderPositions(){
 const list=$('account-positions');list.replaceChildren();
 $('account-positions-count').textContent=savedPositions.rows.length+' / '+me.access.maxSaved;
 if(!savedPositions.rows.length){
  const empty=document.createElement('div'),icon=document.createElement('span'),heading=document.createElement('h3'),copy=document.createElement('p'),visit=document.createElement('a');
  empty.className='account-empty';icon.className='account-empty-icon';icon.setAttribute('aria-hidden','true');
  icon.innerHTML='<svg viewBox="0 0 48 48" fill="none"><path d="M13 23V12a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3v11M10 21v12h28V21M14 33v6m20-6v6M10 27h28" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  heading.textContent=copy("好位置，值得留住");copy.textContent=copy("在场馆里找到你的位置，保存后就能随时回来查看。");
  visit.className='account-button';visit.href=next;visit.textContent=copy("去找我的位置 ↗");
  empty.append(icon,heading,copy,visit);list.append(empty);return;
 }
 for(const item of savedPositions.rows){
  const article=document.createElement('article'),icon=document.createElement('span'),details=document.createElement('div'),label=document.createElement('h3'),seat=document.createElement('p'),actions=document.createElement('div'),visit=document.createElement('a'),remove=document.createElement('button');
  icon.className='account-seat-icon';icon.textContent='▱';icon.setAttribute('aria-hidden','true');
  label.textContent=savedPositions.catalog.venues.find(v=>v.id===item.venue_id)?.name||item.venue_id;
  seat.textContent=copy("{0} 区 · {1} 排 · {2} 座", [item.section, item.row_token, item.seat_token]);details.append(label,seat);
  visit.className='account-button';visit.textContent=copy("查看视角 ↗");visit.href=venueReturn({venueId:item.venue_id,sectionId:item.section,result:{section:item.section,row:item.row_token,seat:item.seat_token},layout:item.layout||'end',mode:'3d',event:item.event_id?{id:item.event_id}:null});
  remove.type='button';remove.className='auth-text';remove.textContent=copy("移除");remove.setAttribute('aria-label',copy("移除 {0} {1}", [label.textContent, seat.textContent]));
  remove.onclick=async()=>{if(me.consent?.required){location.assign(route('/auth/continue'));return;}remove.disabled=true;try{await api('/api/positions/'+encodeURIComponent(item.id),{},'DELETE');await positions();}catch(error){remove.disabled=false;feedback(error.message);}};
  actions.className='account-seat-actions';actions.append(visit,remove);article.append(icon,details,actions);list.append(article);
 }
}
async function positions(){
 const list=$('account-positions');list.textContent=copy("正在读取…");
 try{const [{positions:rows},catalog]=await Promise.all([api('/api/positions'),api('/api/venues')]);savedPositions={rows,catalog};renderPositions();}
 catch(error){$('account-positions-count').textContent='—';list.textContent=error.message;const retry=document.createElement('button');retry.type='button';retry.className='auth-text';retry.textContent=copy("重试");retry.onclick=()=>void positions();list.append(retry);}
}
function updateResend(){const seconds=Math.max(0,Math.ceil((resendAt-Date.now())/1000));$('auth-resend').disabled=busy||seconds>0;$('auth-resend').textContent=seconds?copy("{0} 秒后可重发", [seconds]):copy("重新发送验证码");}
async function finish(result){next=safeReturn(result.returnTo||next);me=await api('/api/me');clearSecret();if(me.consent?.required){mode='consent';render();return;}location.replace(next);}
$('auth-form').onsubmit=async event=>{
 event.preventDefault();if(busy)return;busy=true;$('auth-submit').disabled=true;$('auth-submit').textContent=copy("正在处理…");feedback('');const email=$('auth-email').value,code=$('auth-code').value,password=$('auth-password').value;
 try{
  if(mode==='consent'){await api('/api/auth/consent',{version:TERMS_VERSION,accepted:true});location.replace(next);return;}
  if(mode==='login'){await finish(await api('/api/auth/login',{email,password,returnTo:next}));return;}
  if(['register','otp','reset','setup'].includes(mode)){
   source=mode;const recovery=mode==='reset'||mode==='setup';const endpoint=mode==='register'?'/api/auth/register':recovery?'/api/auth/recovery':'/api/auth/email';
   const result=await api(endpoint,{email,password:mode==='register'?password:undefined,consent:mode==='register'&&$('auth-consent').checked,returnTo:next,lang});
   clearSecret();history.replaceState(null,'',route(recovery?'/auth/reset':'/auth/verify'));resendAt=Date.now()+(result.resendAfter||60)*1000;mode=recovery?'recover-code':'code';render();feedback(recovery?copy("如果该邮箱可恢复账号，你会收到验证码。"):copy("请求已提交，请检查邮箱中的验证码。"));$('auth-code').focus();return;
  }
  if(mode==='code'){await finish(await api(source==='register'?'/api/auth/register/verify':'/api/auth/email/verify',{code}));return;}
  if(mode==='recover-code'){await api('/api/auth/recovery/verify',{code});clearSecret();mode='new-password';render();$('auth-password').focus();return;}
  if(mode==='new-password'){
   if(password!==$('auth-confirm').value)throw new Error(copy("两次输入的密码不一致。"));
   const result=await api('/api/auth/recovery/complete',{password});clearSecret();mode='login';render();feedback(result.sessionsRevoked===false?copy("密码已更新，请用新密码登录；其他会话的退出尚未确认。"):copy("密码已更新，请用新密码登录。"));next=safeReturn(result.returnTo||next);
  }
 }catch(error){feedback(error.message);if(error.code==='AUTH_PASSWORD_RESULT_UNKNOWN'){clearSecret();mode='login';render();}if(error.code==='AUTH_FLOW_EXPIRED'){clearSecret();mode=['reset','setup'].includes(source)?source:source==='register'?'register':'otp';render();}}finally{busy=false;$('auth-submit').disabled=false;render();updateResend();}
};
$('auth-resend').onclick=async()=>{if(busy||Date.now()<resendAt)return;busy=true;updateResend();try{const endpoint=source==='register'?'/api/auth/register/resend':['reset','setup'].includes(source)?'/api/auth/recovery':'/api/auth/email';const result=await api(endpoint,{email:$('auth-email').value,returnTo:next,lang});resendAt=Date.now()+(result.resendAfter||60)*1000;feedback(copy("请求已提交，请查看最新验证码。"));}catch(error){feedback(error.message);}finally{busy=false;updateResend();}};
$('auth-change').onclick=async()=>{try{await api('/api/auth/cancel',{});clearSecret();mode=source;history.replaceState(null,'',route(mode==='register'?'/auth/register':mode==='reset'?'/auth/reset':mode==='setup'?'/auth/password':'/auth/login'));feedback('');render();}catch(error){feedback(error.message);}};
$('auth-reveal').onclick=()=>{$('auth-password').type=$('auth-password').type==='password'?'text':'password';$('auth-reveal').setAttribute('aria-pressed',String($('auth-password').type==='text'));render();};
$('auth-google').onclick=async()=>{if(busy)return;busy=true;$('auth-google').disabled=true;try{const result=await api('/api/auth/google/start',{returnTo:next});location.assign(result.url);}catch(error){feedback(error.message);busy=false;$('auth-google').disabled=false;}};
$('security-logout').onclick=$('auth-logout').onclick=async()=>{try{await api('/api/auth/logout',{});location.replace(next);}catch(error){feedback(error.message);}};
const timer=setInterval(updateResend,1000);addEventListener('pagehide',()=>{clearInterval(timer);clearSecret();},{once:true});
try{
 me=await api('/api/me');
 if(me.providers.auth!=='supabase'){mode='login';render();show('auth-form',false);feedback(copy("当前为本地预览。完整账号流程使用统一 Supabase Auth，返回场馆页可使用本地测试入口。"));}
 else if(['account','setup','continue'].includes(mode)&&!me.user){location.replace(route('/auth/login'));}
 else if(needsConsentPage(mode,me)){mode='consent';render();}
 else if(mode==='continue'){location.replace(next);}
 else{
  if(['/auth/verify','/auth/callback','/auth/reset','/auth/password'].includes(parseLocalizedPath(location.pathname).path)){
   const status=await api('/api/auth/status');if(status.flow){const f=status.flow;resendAt=f.retryAt||0;next=safeReturn(f.returnTo||next);if(f.email)$('auth-email').value=f.email;
    if(f.kind==='new-password'){mode='new-password';source='reset';}
    else if(f.kind==='recover-pending'){mode='recover-code';source=f.expectedUser?'setup':'reset';}
    else if(['signup','magiclink'].includes(f.kind)){mode='code';source=f.kind==='signup'?'register':'otp';}
   }
  }
  if(['reset','setup'].includes(mode)&&!me.providers.recovery){mode='login';feedback(copy("密码恢复暂未开放，请使用邮箱验证码登录。"));}if(query.get('method')==='otp')mode='otp';render();}
 if(query.get('error'))feedback((en()?errors[query.get('error')]?.[1]:errors[query.get('error')]?copy(errors[query.get('error')][0]):null)||copy("登录未完成，请重试。"));
}catch(error){render();show('auth-form',false);feedback(error.message);}
