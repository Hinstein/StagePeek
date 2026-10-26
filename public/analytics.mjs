// The server supplies a fixed, approved public path. Never use raw URLs,
// document titles, referrers, ticket labels or account fields in payloads.
const tracking=document.querySelector('script[src="/analytics.mjs"]');
const id=tracking?.dataset.websiteId,page=tracking?.dataset.publicPath||'/';
if(location.hostname==='stagepeek.live'&&location.pathname===page&&!location.search&&!location.hash&&navigator.doNotTrack!=='1'&&!navigator.globalPrivacyControl&&/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(id||'')){
  const script=document.createElement('script');
  script.src='https://analytics.auturance.com/script.js';
  script.dataset.websiteId=id;script.dataset.autoTrack='false';script.dataset.autoPageview='false';
  script.dataset.excludeSearch='true';script.referrerPolicy='no-referrer';
  const events=new Set(['tool_open','seat_located','view_3d','login_started','plan_open']);
  const sent=new Set();
  const eligible=()=>!window.stagepeekSignedIn&&location.pathname===page&&!location.search&&!location.hash&&navigator.doNotTrack!=='1'&&!navigator.globalPrivacyControl;
  const payload={website:id,hostname:'stagepeek.live',url:page,title:'StagePeek'};
  // Object payloads avoid Umami's automatic URL/referrer properties for events.
  window.stagepeekTrack=name=>{
    if(!eligible()||!events.has(name)||sent.has(name)||!window.umami)return;
    sent.add(name);window.umami.track({...payload,name});
  };
  document.addEventListener?.('click',event=>{if(event.target.closest?.('a[data-tool-entry]'))window.stagepeekTrack('tool_open');});
  script.onload=()=>{if(eligible())window.umami?.track(payload);};
  document.head.append(script);
}
