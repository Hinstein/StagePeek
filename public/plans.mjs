import {safeReturn} from './auth-contract.mjs';
import {venueName} from './translations/venue-labels.mjs';
import {copy,getLocale,localizedPath} from './locales.mjs';
const $=id=>document.getElementById(id),locale=getLocale();
const next=safeReturn(new URLSearchParams(location.search).get('next'));
const destination=next==='/'?localizedPath(locale,'/explore'):next;
$('plan-return').href=destination;
async function api(path,body){
 const response=await fetch(path,{method:body?'POST':'GET',credentials:'same-origin',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined});
 const result=await response.json();if(!response.ok)throw new Error(copy('暂时无法完成，请稍后重试。'));return result;
}
try{
 const [me,catalog]=await Promise.all([api('/api/me'),api('/api/venues')]);
 const venue=catalog.venues.find(v=>v.id===new URL(destination,location.origin).searchParams.get('venue'));
 $('plan-context').textContent=venue?copy('正在查看：{0}。开通 Pro 后可返回这个场馆。',[venueName(venue,locale)]):copy('选择计划，或返回免费场馆继续探索。');
 if(!me.providers.billing){$('plan-checkout').textContent=copy('订阅暂未开放');$('plan-feedback').textContent=copy('当前可免费体验精选场馆。');}
 if(me.providers.billing){
  const result=await api('/api/billing/price');
  const labels={monthly:copy('每月'),semiannual:copy('每 6 个月'),annual:copy('每年')};
  for(const [index,plan]of result.prices.entries()){
   const label=document.createElement('label'),input=document.createElement('input');input.type='radio';input.name='plan';input.value=plan.plan;input.checked=sessionStorage.getItem('stagepeek-billing-plan')===plan.plan||!result.prices.some(p=>p.plan===sessionStorage.getItem('stagepeek-billing-plan'))&&index===0;
   label.append(input,document.createTextNode(' '+new Intl.NumberFormat(locale,{style:'currency',currency:plan.currency}).format(plan.amount/100)+' / '+labels[plan.plan]));
   label.style.cssText='display:block;padding:12px 0';$('plan-options').append(label);
  }
  $('plan-checkout').disabled=!result.prices.length;
  $('plan-checkout').textContent=me.access.plan==='pro'?copy('管理我的订阅'):me.user?copy('开始订阅'):copy('登录后选择订阅');
  if(me.providers.localBilling)$('plan-feedback').textContent=copy('本地模拟流程：不会扣款；正式环境需要 Stripe。');
  $('plan-checkout').onclick=async()=>{
   sessionStorage.setItem('stagepeek-billing-plan',document.querySelector('input[name=plan]:checked').value);
   if(!me.user||me.consent?.required){const back=new URL(destination,location.origin);back.searchParams.set('account','billing');location.assign(localizedPath(locale,me.user?'/account':'/auth/login')+'?next='+encodeURIComponent(back.pathname+back.search));return;}
   $('plan-checkout').disabled=true;
   try{
    sessionStorage.setItem('stagepeek-billing-return',destination);
    const result=await api(me.access.plan==='pro'?'/api/billing/portal':'/api/billing/checkout',me.access.plan==='pro'?{}:{plan:document.querySelector('input[name=plan]:checked').value});
    location.assign(result.url);
   }catch(error){$('plan-feedback').textContent=error.message;$('plan-checkout').disabled=false;}
  };
 }
}catch(error){$('plan-feedback').textContent=error.message;$('plan-checkout').textContent=copy('暂时无法完成，请稍后重试。');}
