// Uses the product renderer and a fixed, read-only public venue preview.
// No fake seat match, subscription change, or event stage is introduced here.
export async function mountBirdsNestPreview(root){
 const canvas=root.querySelector('canvas'),status=root.querySelector('[data-live-status]'),near=root.querySelector('[data-live-near]'),label=root.querySelector('[data-live-section]');
 let viewer=null,venue=null,selected='',visible=true,intersecting=false,started=false,disposed=false;
 const setMode=()=>viewer?.setMode(visible&&intersecting?'3d':'paused');
 const choose=id=>{
   if(!venue?.sections.some(section=>section.id===id))return;
   selected=id;label.textContent=`看台 ${id} · 示意分区`;near.disabled=false;
   viewer.setData(venue,selected,null,'none',false);viewer.near();
 };
 async function start(){
   if(started||disposed)return;started=true;
   try{
     const [module,response]=await Promise.all([import('../viewer.mjs'),fetch('/api/demo/birds-nest',{credentials:'omit'})]);
     if(!response.ok)throw new Error('Preview unavailable');
     ({venue}=await response.json());if(disposed)return;
     // The existing renderer picks its palette from the page theme.
     document.body.classList.add('theme-arena');
     viewer=module.createViewer(canvas,{onSection:choose,onSample:()=>{},onSeat:seat=>choose(seat.section),onFailure:()=>{status.hidden=false;status.textContent='3D 画面暂时不可用，请刷新或打开完整场馆。';}});
     viewer.setData(venue,'',null,'none',false);canvas.dataset.venueId=venue.id;status.hidden=true;setMode();
   }catch{status.hidden=false;status.textContent='暂时无法加载 3D，请刷新或打开完整场馆。';}
 }
 const observer=new IntersectionObserver(entries=>{intersecting=entries[0].isIntersecting;if(intersecting&&visible)void start();setMode();},{rootMargin:'120px'});
 observer.observe(canvas);
 root.querySelector('[data-live-reset]').addEventListener('click',()=>{if(!viewer)return;selected='';label.textContent='鸟巢 · 看台总览';near.disabled=true;viewer.setData(venue,'',null,'none',false);viewer.overview(true);});
 near.addEventListener('click',()=>viewer?.near());
 // Keyboard users can inspect the same model without a pointer.
 canvas.addEventListener('keydown',event=>{
   if(!venue||!['ArrowLeft','ArrowRight','Home'].includes(event.key))return;
   event.preventDefault();event.stopPropagation();
   if(event.key==='Home'){root.querySelector('[data-live-reset]').click();return;}
   const index=venue.sections.findIndex(section=>section.id===selected),direction=event.key==='ArrowRight'?1:-1;
   choose(venue.sections[(Math.max(index,0)+direction+venue.sections.length)%venue.sections.length].id);
 });
 return {setVisible(value){visible=value;if(visible&&intersecting)void start();setMode();},dispose(){disposed=true;observer.disconnect();viewer?.dispose();}};
}
