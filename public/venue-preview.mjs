import {mountVenueView,VENUE_MAP_POLICY} from './venue-view/venue-view-controls.mjs';
import {venuePalette} from './venue-view/venue-palette.mjs';
import {copy,getLocale} from './locales.mjs';
import {venueViewCopy} from './venue-view/venue-view-copy.mjs';
import {sectionPoint,sectionRenderHalfAngle} from './geometry.mjs';

// Homepage and prototype previews are adapters of the same venue UI as /explore.
export function mountVenuePreview(root,{url,overviewLabel}){
 const canvas=root.querySelector('canvas'),screen=root.querySelector('.live-screen'),fallback=root.querySelector('.live-fallback'),status=root.querySelector('[data-live-status]'),label=root.querySelector('[data-live-section]');
 let viewer=null,venue=null,shell=null,selected='',picked=null,visible=true,intersecting=false,started=false,disposed=false,mode='3d',cameraMode='overview',phone=false,roof=false,zoom=1,mapZoom=1,mapRotation=0;
 const map=document.createElementNS('http://www.w3.org/2000/svg','svg'),selection=document.createElement('span');
 map.setAttribute('role','group');map.setAttribute('aria-label',copy('2D 座位图'));
 const sync=()=>shell?.update({mode,cameraMode,phone,roof,zoom,mapZoom,canAudience:!!picked,canStage:false});
 const setMode=()=>viewer?.setMode(visible&&intersecting?mode:'paused');
 function choose(id,chair=null){
  if(!venue?.sections.some(section=>section.id===id))return;
  selected=id;picked=chair;label.textContent=id;selection.textContent=id+' · '+copy('模拟位置');
  viewer.setData(venue,selected,chair?.p||null,'none',!!chair);drawMap();
  if(chair)viewer.seatView();else viewer.near();sync();
 }
 function drawMap(){
  map.replaceChildren();const points=[];
  for(const section of venue.sections){
   const half=sectionRenderHalfAngle(venue,section),boundary=[];
   for(let i=0;i<=12;i++)boundary.push(sectionPoint(venue,section,0,-1+i/6,half));
   for(let i=12;i>=0;i--)boundary.push(sectionPoint(venue,section,1,-1+i/6,half));
   const polygons=section.sourcePolygons?.length?section.sourcePolygons.map(p=>p.points):[boundary.map(p=>[p[0],p[2]])];
   for(const polygon of polygons){
    const node=document.createElementNS(map.namespaceURI,'polygon');points.push(...polygon);node.setAttribute('points',polygon.map(p=>p.join(',')).join(' '));node.setAttribute('fill',section.id===selected?venuePalette.selected:venuePalette.seat);node.setAttribute('stroke',venuePalette.labelOutline);node.setAttribute('tabindex','0');node.setAttribute('role','button');node.setAttribute('aria-label',section.id);node.onclick=()=>choose(section.id);node.onkeydown=e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();choose(section.id);}};map.append(node);
   }
  }
  if(!points.length)return;
  const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),x=Math.min(...xs),y=Math.min(...ys),w=Math.max(...xs)-x,h=Math.max(...ys)-y;
  for(const node of map.children)node.setAttribute('transform',`rotate(${mapRotation} ${x+w/2} ${y+h/2})`);
  const width=(mapRotation%180?h:w)/mapZoom+6,height=(mapRotation%180?w:h)/mapZoom+6;
  map.setAttribute('viewBox',[x+w/2-width/2,y+h/2-height/2,width,height].join(' '));
 }
 const reset=()=>{selected='';picked=null;label.textContent=overviewLabel;selection.textContent=overviewLabel;viewer.setData(venue,'',null,'none',false);viewer.overview(true);drawMap();sync();};
 const showFallback=message=>{canvas.hidden=true;if(fallback)fallback.hidden=false;status.hidden=false;status.textContent=message;screen.classList.remove('is-loading');screen.classList.add('is-fallback');};
 async function start(){
  if(started||disposed)return;started=true;
  try{
   const [module,seating,response]=await Promise.all([import('./viewer.mjs'),import('./seating.mjs'),fetch(url,{credentials:'omit'})]);
   if(!response.ok)throw new Error('Preview unavailable');
   ({venue}=await response.json());if(disposed)return;
   if(venue.seatTuples){venue.sourceSeats=seating.unpackSourceSeats(venue.seatTuples);delete venue.seatTuples;}
   screen.querySelector('.demo-toolbar')?.remove();screen.querySelector('.live-hint')?.remove();
   const container=document.createElement('div');screen.classList.add('venue-preview-host');screen.append(container);
   shell=mountVenueView(container,{canvas,map,selection,translate:source=>venueViewCopy(source,getLocale(),copy),onAction(action,value){
    if(action==='2d'||action==='3d'){mode=action;setMode();}
    if(action==='overview'||action==='reset')reset();
    if(action==='near')viewer.near();
    if(action==='audience')viewer.seatView();
    if(action==='roof'){roof=!roof;viewer.toggleRoof(roof);}
    if(action==='phone'){phone=!phone;viewer.togglePhoneFrame(phone);if(phone&&cameraMode!=='audience')viewer.seatView();}
    if(action==='zoom')viewer.setZoom(value);
    if(action==='viewIn'||action==='viewOut')viewer.zoom(action==='viewIn'?1.25:.8);
    if(action==='mapIn'||action==='mapOut'){mapZoom=Math.max(VENUE_MAP_POLICY.minZoom,Math.min(VENUE_MAP_POLICY.maxZoom,mapZoom*(action==='mapIn'?VENUE_MAP_POLICY.zoomIn:VENUE_MAP_POLICY.zoomOut)));drawMap();}
    if(action==='mapRotate'){mapRotation=(mapRotation+90)%360;drawMap();}
    if(action==='mapReset'){mapZoom=1;mapRotation=0;drawMap();}
    sync();
   }});
   viewer=module.createViewer(canvas,{onSection:choose,onSample:()=>{},onSeat:chair=>choose(chair.section,chair),onMode(value,detail){cameraMode=detail?.viewMode||value;zoom=detail?.zoom||zoom;sync();},onFailure:()=>showFallback(copy('3D 暂不可用 · 当前显示布局阅读示意'))});
   viewer.setData(venue,'',null,'none',false);canvas.dataset.venueId=venue.id;drawMap();selection.textContent=overviewLabel;if(fallback)fallback.hidden=true;status.hidden=true;screen.classList.remove('is-loading','is-fallback');sync();setMode();
  }catch{showFallback(copy('3D 暂不可用 · 当前显示布局阅读示意'));}
 }
 function keydown(event){
  if(!venue||!['ArrowLeft','ArrowRight','Home'].includes(event.key))return;
  event.preventDefault();event.stopPropagation();if(event.key==='Home'){reset();return;}
  const index=venue.sections.findIndex(section=>section.id===selected),direction=event.key==='ArrowRight'?1:-1;
  choose(venue.sections[(Math.max(index,0)+direction+venue.sections.length)%venue.sections.length].id);
 }
 canvas.addEventListener('keydown',keydown);
 const observer=new IntersectionObserver(entries=>{intersecting=entries[0].isIntersecting;if(intersecting&&visible)void start();setMode();},{rootMargin:'120px'});observer.observe(root);
 return {setVisible(value){visible=value;if(visible&&intersecting)void start();setMode();},dispose(){disposed=true;observer.disconnect();canvas.removeEventListener('keydown',keydown);shell?.dispose();viewer?.dispose();}};
}
