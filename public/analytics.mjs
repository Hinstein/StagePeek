// Umami receives a deliberately small, anonymous funnel. Never send raw URLs,
// query strings, ticket labels, account fields, payment identifiers or referrers.
const tracking=document.querySelector('script[src="/analytics.mjs"]');
const id=tracking?.dataset.websiteId;
const page=tracking?.dataset.publicPath||'/';
const analyticsPage=tracking?.dataset.analyticsPath||page;
const toolPage=tracking?.dataset.toolPage==='true';
const validId=/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(id||'');
const privacyBlocked=()=>navigator.doNotTrack==='1'||navigator.globalPrivacyControl;
const eligible=()=>location.hostname==='stagepeek.live'&&location.pathname===page&&(!location.search||toolPage)&&!location.hash&&!privacyBlocked();
const events=new Set(['tool_open','venue_selected','ticket_search','ticket_match','ticket_miss','seat_located','view_2d','view_3d','save_prompt','save_position','login_started','login_completed','plan_open','checkout_blocked','checkout_started','checkout_failed','billing_return','subscription_active']);
const enumValues={venue_access:new Set(['free','pro']),result:new Set(['matched','estimated','ambiguous','not_found','unavailable']),auth:new Set(['guest','signed_in']),reason:new Set(['login_required','consent_required','billing_unavailable','network','provider_error','unknown']),provider:new Set(['stripe','local'])};
const schemas={venue_selected:['venue_access'],ticket_search:['venue_access'],ticket_match:['result'],ticket_miss:['result'],save_prompt:['reason'],save_position:['venue_access'],checkout_blocked:['reason'],checkout_started:['provider'],checkout_failed:['reason']};
const sent=new Set(),queued=[];
const payload={website:id,hostname:'stagepeek.live',url:analyticsPage,title:'StagePeek'};
const cleanData=(name,data)=>{const allowed=new Set(schemas[name]||[]),output={};if(!data||typeof data!=='object')return output;for(const key of allowed){const value=data[key];if(typeof value==='string'&&enumValues[key]?.has(value))output[key]=value;}return output;};
const deliver=(name,data)=>{if(!eligible()||!events.has(name)||sent.has(name)||!window.umami)return;sent.add(name);const safe=cleanData(name,data);window.umami.track({...payload,name,...(Object.keys(safe).length?{data:safe}:{})});};
window.stagepeekTrack=(name,data)=>{if(!eligible()||!events.has(name)||sent.has(name))return;if(window.umami)deliver(name,data);else queued.push([name,data]);};
if(validId&&eligible()){
  const script=document.createElement('script');script.src='https://analytics.auturance.com/script.js';
  script.dataset.websiteId=id;script.dataset.autoTrack='false';script.dataset.autoPageview='false';script.dataset.excludeSearch='true';script.referrerPolicy='no-referrer';
  document.addEventListener?.('click',event=>{if(event.target.closest?.('a[data-tool-entry]'))window.stagepeekTrack('tool_open');});
  script.onload=()=>{if(!eligible())return;window.umami?.track(payload);while(queued.length){const [name,data]=queued.shift();deliver(name,data);}};
  document.head.append(script);
}
