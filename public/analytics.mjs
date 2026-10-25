// Track only anonymous visits to the clean public homepage. Never send ticket,
// account, query, hash, referrer or event data to the analytics service.
const id=document.querySelector('script[src="/analytics.mjs"]')?.dataset.websiteId;
if(location.hostname==='stagepeek.live'&&location.pathname==='/'&&!location.search&&!location.hash&&navigator.doNotTrack!=='1'&&!navigator.globalPrivacyControl&&/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(id||'')){
  const script=document.createElement('script');
  script.src='https://analytics.auturance.com/script.js';
  script.dataset.websiteId=id;script.dataset.autoTrack='false';
  script.dataset.excludeSearch='true';script.referrerPolicy='no-referrer';
  script.onload=()=>window.umami?.track({website:id,hostname:'stagepeek.live',url:'/',title:'StagePeek'});
  document.head.append(script);
}
