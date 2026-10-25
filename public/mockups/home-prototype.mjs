// Throwaway homepage prototype: no API writes, billing or account mutations.
const keys=['A','B','C','D','E'];
const names={A:'沉浸舞台',B:'快速查座',C:'门票故事',D:'场馆探索',E:'极简视角'};
let current='A';
let livePreview=null,livePreviewPromise=null;
async function syncLivePreview(){
 if(current!=='A'){livePreview?.setVisible(false);return;}
 if(!livePreviewPromise)livePreviewPromise=import('./home-venue-preview.mjs').then(module=>module.mountBirdsNestPreview(document.querySelector('[data-live-preview]')));
 try{livePreview=await livePreviewPromise;livePreview?.setVisible(current==='A');}catch{document.querySelector('[data-live-status]').textContent='暂时无法加载 3D，请刷新重试。';}
}
function show(key,{push=false}={}){
 current=keys.includes(key)?key:'A';
 document.querySelectorAll('[data-variant]').forEach(el=>{el.hidden=el.dataset.variant!==current;});
 document.querySelectorAll('[data-variant-link]').forEach(el=>{if(el.dataset.variantLink===current)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
 document.title=`StagePeek · ${current} ${names[current]} · 首页设计预览`;
 if(push){const url=new URL(location.href);url.searchParams.set('variant',current);url.hash='';history.pushState(null,'',url);window.scrollTo({top:0,behavior:'instant'});}
 console.info('StagePeek homepage prototype',{variant:current,name:names[current],demoOnly:true});
 void syncLivePreview();
}
show(new URL(location.href).searchParams.get('variant'));
document.querySelectorAll('[data-variant-link]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();show(a.dataset.variantLink,{push:true});}));
function cycle(direction){show(keys[(keys.indexOf(current)+direction+keys.length)%keys.length],{push:true});}
document.querySelector('#variant-prev').addEventListener('click',()=>cycle(-1));
document.querySelector('#variant-next').addEventListener('click',()=>cycle(1));
window.addEventListener('popstate',()=>show(new URL(location.href).searchParams.get('variant')));
window.addEventListener('keydown',e=>{if(e.target.closest('input,textarea,select,[contenteditable="true"]'))return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();cycle(e.key==='ArrowLeft'?-1:1);}});
document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{
 const panel=button.closest('[data-demo]');
 panel.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 const image=panel.querySelector('[data-demo-image]');image.src=`home-assets/arena-${button.dataset.mode}.svg`;
 image.alt=button.dataset.mode==='2d'?'二维场馆分区使用示意':'三维场馆座位使用示意';
}));
document.querySelector('#finder-demo').addEventListener('submit',e=>{
 e.preventDefault();const data=new FormData(e.currentTarget),section=data.get('section').trim(),row=data.get('row').trim(),seat=data.get('seat').trim();
 const scope=e.currentTarget.closest('[data-variant]');
 scope.querySelector('[data-demo-section]').textContent=`${section} 区`;
 scope.querySelector('[data-demo-row]').textContent=`${row} 排 · ${seat} 座`;
 scope.querySelector('[data-demo-ticket]').textContent=`${section} / ${row} / ${seat}`;
 document.querySelector('#finder-status').textContent=`演示票面已更新为 ${section} 区 ${row} 排 ${seat} 座。模型为固定示意，并非真实座位匹配。`;
 scope.querySelector('.demo-bottom .chip').textContent='固定示意 · 非真实匹配';
 scope.querySelector('[data-demo]').scrollIntoView({behavior:'smooth',block:'center'});
});
let activeCountry='all';
function filterVenues(){const query=document.querySelector('#venue-query').value.trim().toLowerCase();let count=0;document.querySelectorAll('[data-country]').forEach(card=>{card.hidden=!(activeCountry==='all'||card.dataset.country===activeCountry)||!card.dataset.venueName.toLowerCase().includes(query);if(!card.hidden)count++;});document.querySelector('#venue-empty').hidden=count!==0;}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{activeCountry=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));filterVenues();}));
document.querySelector('#venue-search').addEventListener('submit',e=>{e.preventDefault();filterVenues();});
document.querySelector('#venue-query').addEventListener('input',filterVenues);
document.querySelectorAll('[data-phone-zoom]').forEach(button=>button.addEventListener('click',()=>{const zoom=Number(button.dataset.phoneZoom);document.querySelector('[data-phone-scene]').style.transform=`scale(${zoom})`;document.querySelector('[data-phone-scene]').style.transformOrigin='50% 57%';document.querySelectorAll('[data-phone-zoom]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));
document.querySelectorAll('[data-peek-zoom]').forEach(button=>button.addEventListener('click',()=>{const zoom=Number(button.dataset.peekZoom),wrap=button.closest('.view-peek');wrap.querySelector('[data-peek-scene]').style.transform=`scale(${zoom})`;wrap.querySelector('[data-peek-scene]').style.transformOrigin='50% 57%';wrap.querySelectorAll('[data-peek-zoom]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));
// These prototypes live on a separate noindex route and are not linked from production navigation.
// Hide the review switcher on external hosts; it is a local design review tool.
if(!['localhost','127.0.0.1','::1',''].includes(location.hostname)&&!/^192\.168\.|^10\.|^172\.(1[6-9]|2\d|3[01])\./.test(location.hostname))document.querySelector('.prototype-bar').hidden=true;
