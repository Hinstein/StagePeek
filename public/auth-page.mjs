const $=id=>document.getElementById(id);
let resend=0;
const errors={INVALID_OTP:'验证码错误或已过期。',OTP_EXPIRED:'请重新获取验证码。',RATE_LIMITED:'请求过于频繁，请稍后再试。',EMAIL_NOT_CONFIGURED:'邮箱登录尚未开放，请稍后再来。'};
async function call(path,body){const response=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const data=await response.json();if(!response.ok)throw new Error(errors[data.error?.code]||'暂时无法验证，请稍后重试。');return data;}
// Authentication links and URL tokens are intentionally not consumed.
history.replaceState(null,'',location.pathname);
if(location.pathname==='/auth/reset'){
 $('auth-title').textContent='无需重置密码';$('auth-description').textContent='StagePeek 使用邮箱验证码登录，没有单独的登录密码。请返回首页获取验证码。';$('auth-form').hidden=true;
}
$('auth-form').onsubmit=async event=>{
 event.preventDefault();if(Date.now()<resend)return;$('auth-send').disabled=true;
 try{await call('/api/auth/email',{email:$('auth-email').value});resend=Date.now()+60000;$('auth-email').readOnly=true;$('auth-code-field').hidden=false;$('auth-code').value='';$('auth-code').focus();$('auth-feedback').textContent='已发送，请输入邮箱中的验证码。';}
 catch(error){$('auth-feedback').textContent=error.message;}
 finally{$('auth-send').disabled=Date.now()<resend;}
};
const timer=setInterval(()=>{const left=Math.ceil((resend-Date.now())/1000);$('auth-send').disabled=left>0;$('auth-send').textContent=left>0?`${left} 秒后可重发`:'发送验证码';},1000);
addEventListener('pagehide',()=>clearInterval(timer),{once:true});
$('auth-change').onclick=()=>{$('auth-email').readOnly=false;$('auth-code-field').hidden=true;$('auth-code').value='';$('auth-email').focus();};
$('auth-verify').onclick=async()=>{
 if(!/^\d{6,10}$/.test($('auth-code').value)){$('auth-feedback').textContent='请输入邮箱中的验证码。';return;}
 $('auth-verify').disabled=true;
 try{await call('/api/auth/email/verify',{code:$('auth-code').value});location.replace('/?auth=success');}
 catch(error){$('auth-feedback').textContent=error.message;}
 finally{$('auth-code').value='';$('auth-verify').disabled=false;}
};
$('auth-code').onkeydown=event=>{if(event.key==='Enter'){event.preventDefault();$('auth-verify').click();}};
