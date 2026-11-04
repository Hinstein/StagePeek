import {copy,getLocale} from '../locales.mjs';
import {venueViewCopy} from '../venue-view/venue-view-copy.mjs';
import {mountVenueLayers} from '../venue-view/venue-view-layers.mjs';
import {buildHydroDisplay,locateHydroReference} from './hydro-display.mjs';
import {lookupDraftTicket} from './source-preview-model.mjs';
import {encodeHydroView,decodeHydroView} from './hydro-camera.mjs';
import {createHydroMapGestures} from './hydro-map-gestures.mjs';
import {mountVenueView,VENUE_MAP_POLICY} from '../venue-view/venue-view-controls.mjs';
import {venuePalette} from '../venue-view/venue-palette.mjs';
import {venueFovToZoom} from '../venue-view/venue-camera-policy.mjs';

export function appendHydroPanel(parent,venue,{query,sourcesHost,onSelection}){
 const area=node('section',null,'hydro-panel'),params=new URLSearchParams(location.search);
 const events=venue.eventPlans,requested=params.get('event'),eventSelect=node('select'),sectionSelect=node('select'),row=query.row,seat=query.seat;
 eventSelect.setAttribute('aria-label',copy('Hydro 演出'));sectionSelect.setAttribute('aria-label',copy('Hydro 分区'));
 for(const [id,text]of [['',copy('常规场馆 · 无舞台')],...events.map(e=>[e.id,`${e.date} · ${e.artist}`])]){const option=node('option',text);option.value=id;eventSelect.append(option);}
 eventSelect.value=requested&&events.some(e=>e.id===requested)?requested:'';
 let model=buildHydroDisplay(venue,eventSelect.value||null),viewer=null,disposed=false,mode=(params.get('mode')==='2d'||params.get('preview')==='fixed')?'2d':'3d',selected=null,zoom=1,pan=[0,0];
 let phoneFraming=params.get('hydroPhone')==='1',roofVisible=params.get('hydroRoof')==='1',eventFloorVisible=params.get('hydroFloor')!=='0';
 let mapRotation=Number(params.get('hydroMapRotation'))||0;
 let mapTier=['1','2','3'].includes(params.get('hydroTier'))?params.get('hydroTier'):'';
 for(const s of model.sections){const option=node('option',copy('{0} 区',[s.label]));option.value=s.id;sectionSelect.append(option);}
 sectionSelect.value=model.sections.find(s=>s.label===params.get('section'))?.id||'section-209';row.value=params.get('row')||'';seat.value=params.get('seat')||'';
 const previousQuery={submit:query.form.onsubmit,section:query.section.onchange,sectionInput:query.section.oninput,row:row.oninput,seat:seat.oninput};
 query.form.onsubmit=e=>{e.preventDefault();row.value=row.value.trim().toUpperCase();seat.value=seat.value.trim();const section=model.sections.find(s=>s.label===query.section.value.trim()||s.id===query.section.value);if(!section){query.section.setCustomValidity(copy('请选择已有分区'));query.section.reportValidity();return;}sectionSelect.value=section.id;locate();};
 query.section.oninput=()=>query.section.setCustomValidity('');
 query.section.onchange=()=>{const section=model.sections.find(s=>s.label===query.section.value.trim()||s.id===query.section.value);if(!section)return;sectionSelect.value=section.id;row.value='';seat.value='';select(section.id);};
 const board=node('div',null,'hydro-board'),status=node('p',null,'hydro-status'),selectionInfo=node('p',null,'hydro-selection');selectionInfo.setAttribute('role','status');
 const canvas=node('canvas');canvas.setAttribute('aria-label',copy('Hydro 3D 场馆'));canvas.dataset.hydro='true';
 const svg=svgNode('svg');svg.setAttribute('viewBox','-80 -82 160 128');svg.setAttribute('aria-label',copy('Hydro 2D 分区'));
 const world=svgNode('g');svg.append(world);
 const levels=node('div'),layers=node('div');
 const layerControls=mountVenueLayers({levels,layers,translate:copy,onChange(action,value){
  if(action==='level'){mapTier=value;zoom=1;pan=[0,0];}
  if(action==='event'){eventFloorVisible=!eventFloorVisible;viewer?.toggleEventFloor(eventFloorVisible);}
  draw();updateUrl();
 }});
 const shell=mountVenueView(board,{canvas,map:svg,selection:selectionInfo,slots:[levels,layers],translate:text=>venueViewCopy(text,getLocale(),copy),onAction(action,value){
  if(action==='2d'||action==='3d'){show(action);return;}
  if(action==='overview'||action==='near'||action==='stage'){show('3d');viewer?.[action]();return;}
  if(action==='audience'){const match=select(sectionSelect.value);if(!['reference','inferred','row','section'].includes(match.status))return;show('3d');viewer?.audience(match.chair,row.value.trim().toUpperCase());return;}
  if(action==='mapIn'||action==='mapOut'){changeZoom(action==='mapIn'?VENUE_MAP_POLICY.zoomIn:VENUE_MAP_POLICY.zoomOut);return;}
  if(action==='mapRotate'){mapRotation=(mapRotation+90)%360;draw();updateUrl();return;}
  if(action==='mapReset'){zoom=1;pan=[0,0];mapRotation=0;draw();updateUrl();return;}
  if(action==='reset'){const match=locateHydroReference(model,{section:selected?.id,row:row.value,seat:seat.value});if(viewer?.getView().mode==='audience')viewer.audience(match.chair,row.value);else viewer?.overview();return;}
  if(action==='viewIn'||action==='viewOut')viewer?.zoom(action==='viewIn'?1.25:.8);
  if(action==='zoom')viewer?.setZoom(value);
  if(action==='roof'){roofVisible=!roofVisible;viewer?.toggleRoof(roofVisible);}
  if(action==='phone'){phoneFraming=!phoneFraming;if(phoneFraming&&viewer?.getView().mode!=='audience'){const match=locateHydroReference(model,{section:selected.id,row:row.value,seat:seat.value});viewer?.audience(match.chair,row.value);}viewer?.togglePhoneFrame(phoneFraming);}
  updateUrl();
 }});
 const audience=shell.controls.audience,stage=shell.controls.stage,b3=shell.controls['3d'];
 const note=node('p',copy('座位、舞台与人物为示意，仅供视角参考。示意编号不保证对应门票位置。'),'muted');
 const details=node('details',null,'sources hydro-sources'),summary=node('summary',copy('座位与视角说明'));details.append(summary,note);
 const image=node('img');image.alt=copy('Hydro 演出座位图');image.loading='lazy';image.src='/api/concert-views/hydro/ovo-hydro/image';details.append(image);
 const official=node('a',copy('官方演出 ↗'));official.href=events[0].sourceUrl;official.target='_blank';official.rel='noopener noreferrer';details.append(official);
 const reference=node('a',copy('座位参考 ↗'));reference.href='https://eihl.analysis.hockey/hydro.html#seat-level-comparisons';reference.target='_blank';reference.rel='noopener noreferrer';details.append(reference);
 const chart=node('a',copy('场馆座位图 ↗'));chart.href=venue.numberingReference.numberedChart.url;chart.target='_blank';chart.rel='noopener noreferrer';details.append(chart);
 area.append(board);parent.append(area);sourcesHost.append(details);
 function cameraKey(){return [sectionSelect.value,row.value.trim().toUpperCase(),seat.value.trim()].join('/');}
 function updateUrl(){
  const url=new URL(location.href);url.searchParams.set('preview',mode==='2d'?'fixed':'3d');url.searchParams.set('mode',mode);
  for(const [key,value]of [['event',eventSelect.value],['section',selected?.label],['row',row.value],['seat',seat.value]]){if(value)url.searchParams.set(key,value);else url.searchParams.delete(key);}
  for(const [key,value]of [['hydroPhone',phoneFraming?'1':''],['hydroRoof',roofVisible?'1':''],['hydroFloor',eventFloorVisible?'':'0'],['hydroTier',mapTier],['hydroMapRotation',mapRotation?String(mapRotation):'']]){if(value)url.searchParams.set(key,value);else url.searchParams.delete(key);}
  layerControls.update({mode,options:[{id:'',label:copy('全部楼层')},...['1','2','3'].map(id=>({id,label:copy('第 {0} 层',[id])}))],active:mapTier,eventAvailable:!!model.event,eventVisible:eventFloorVisible});
  const view=viewer?.getView();
  shell.update({mode,cameraMode:view?.mode,phone:phoneFraming,roof:roofVisible,canAudience:!audience.disabled,canStage:!!model.performer,zoom:view?venueFovToZoom(view.fov):1,mapZoom:zoom});
  if(view)url.searchParams.set('hydroCamera',encodeHydroView(view,cameraKey()));
  history.replaceState(null,'',url);
 }
 function select(id,chair=null){
  const previousView=viewer?.getView(),previousSeat=canvas.dataset.seatPosition,previousSection=selected?.id;
  selected=model.sections.find(s=>s.id===id)||model.sections[0];sectionSelect.value=selected.id;viewer?.selectSection(selected.id);
  if(mapTier&&previousSection&&previousSection!==selected.id){mapTier=String(selected.tier);}
  const ticket=chair?.referenceTicket||chair?.inferredTicket;
  if(ticket){row.value=ticket.row;seat.value=ticket.seat;}
  if(chair&&!ticket){row.value='';seat.value='';status.textContent=copy('{0} 区 · 示意视角',[selected.label]);}
  const found=locateHydroReference(model,{section:selected.id,row:row.value,seat:seat.value});
  if(!chair||ticket){
   status.textContent=(seat.value?copy('{0} 区 · {1} 排 · {2} 座',[selected.label,row.value,seat.value]):row.value?copy('{0} 区 · {1} 排',[selected.label,row.value]):copy('{0} 区',[selected.label]))+' · '+(found.status==='reference'?copy('参考编号，位置仅供参考。'):found.status==='inferred'?copy('示意编号，不保证对应门票位置。'):seat.value?copy('未找到这个排座，可检查输入或点击地图探索。'):found.status==='unknown-row'?copy('未找到这个排号，当前为分区预览。'):copy('点击座位查看大致视角。'));
  }
  selectionInfo.textContent=found.status==='reference'?copy('{0} 区 · {1} 排 / {2} 座 · 参考编号 · 示意位置',[selected.label,row.value,seat.value]):found.status==='inferred'?copy('{0} 区 · {1} 排 / {2} 座 · 示意编号 · 位置仅供参考',[selected.label,row.value,seat.value]):seat.value?copy('{0} 区 · 未找到这个排座，未定位',[selected.label]):found.status==='unknown-row'?copy('{0} 区 · 未找到这个排号 · 分区预览',[selected.label]):(row.value?copy('{0} 区 · {1} 排',[selected.label,row.value]):copy('{0} 区',[selected.label]))+' · '+copy('示意视角，无座号');
  audience.disabled=!['reference','inferred','row','section'].includes(found.status);viewer?.selectReference(found.chair);
  if(previousView?.mode==='audience'){
   if(found.chair&&previousSeat!==JSON.stringify(found.chair.p))viewer.audience(found.chair);
   if(!found.chair&&previousSection!==selected.id)viewer.near();
  }
  selectionInfo.dataset.lookup=found.status;status.dataset.lookup=found.status;query.section.value=selected.label;
  onSelection?.({model,selected,found,row:row.value,seat:seat.value,description:status.textContent});draw();updateUrl();return found;
 }
 function show(next){const previous=mode;mode=next;if(mode==='2d'&&previous==='3d'){const match=locateHydroReference(model,{section:selected?.id,row:row.value,seat:seat.value});if(match.chair)focusMap(match.chair);}updateUrl();viewer?.render();}

 function focusMap(chair){const angle=mapRotation*Math.PI/180,x=chair.p[0]*Math.cos(angle)-(chair.p[2]+18)*Math.sin(angle),y=chair.p[0]*Math.sin(angle)+(chair.p[2]+18)*Math.cos(angle)-18;zoom=6;pan=[-zoom*x,-18-zoom*y];draw();}
 function changeZoom(factor){if(mode==='3d'){viewer?.zoom(factor);return;}const next=Math.max(VENUE_MAP_POLICY.minZoom,Math.min(VENUE_MAP_POLICY.maxZoom,zoom*factor)),ratio=next/zoom;pan=[pan[0]*ratio,-18+(pan[1]+18)*ratio];zoom=next;draw();updateUrl();}
 function draw(){
  svg.setAttribute('viewBox',mapRotation%180?'-64 -98 128 160':'-80 -82 160 128');
  world.replaceChildren();world.setAttribute('transform',`translate(${pan.join(' ')}) scale(${zoom}) rotate(${mapRotation} 0 -18)`);
  for(const s of model.sections){
   if(mapTier&&String(s.tier)!==mapTier)continue;
   const g=svgNode('g'),p=svgNode('path');p.setAttribute('d',path(s.polygon));p.setAttribute('fill',s.id===selected?.id?venuePalette.selected:venuePalette.seat);p.setAttribute('stroke',venuePalette.labelOutline);p.setAttribute('stroke-width','.4');p.dataset.hydroSection=s.id;p.setAttribute('role','button');p.setAttribute('tabindex','0');p.setAttribute('aria-label',copy('{0} 区',[s.label]));
   const pick=()=>{row.value='';seat.value='';select(s.id);};p.onclick=pick;p.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick();}};g.append(p);
   if(zoom>=1.8){
    const glyphs=svgNode('path');glyphs.setAttribute('fill',s.id===selected?.id?venuePalette.selectedGlyph:venuePalette.seatGlyph);glyphs.setAttribute('pointer-events','none');glyphs.setAttribute('d',s.chairs.map(c=>{
     const a=Math.cos(c.angle),b=Math.sin(c.angle),corners=[[-.23,-.23],[.23,-.23],[.23,.23],[-.23,.23]].map(([x,z])=>[c.p[0]+x*a+z*b,0,c.p[2]-x*b+z*a]);return path(corners);
    }).join(' '));g.append(glyphs);
    if(s.id===selected?.id&&zoom>=2)for(const chair of s.chairs){
     const hit=svgNode('circle');hit.setAttribute('cx',chair.p[0]);hit.setAttribute('cy',chair.p[2]);hit.setAttribute('r','.27');hit.setAttribute('fill','transparent');hit.dataset.hydroChair='true';
     hit.onclick=e=>{e.stopPropagation();select(s.id,chair);show('3d');viewer?.audience(chair);};g.append(hit);
    }
   }
   if(!(s.id===selected?.id&&zoom>=2&&seat.value)){const t=svgNode('text');t.setAttribute('x',s.labelPoint[0]);t.setAttribute('y',s.labelPoint[2]);t.setAttribute('font-size',String(2.4/Math.max(1,zoom/1.5)));t.textContent=s.label;g.append(t);}world.append(g);
   if(zoom>=2&&s.id===selected?.id)for(const a of s.rowAnchors){const t=svgNode('text');t.setAttribute('x',a.p[0]);t.setAttribute('y',a.p[2]);t.setAttribute('font-size',String(1.5/Math.max(1,zoom/2)));t.textContent=a.label;world.append(t);}
   if(s.id===selected?.id)for(const r of [...model.references,...model.inferredReferences].filter(r=>r.chair.section===s.id)){
    const inferred=!!r.chair.inferredTicket;
    const active=row.value===r.reference.row&&seat.value===r.reference.seat;
    if(zoom<4&&!active)continue;
    const c=svgNode('circle');c.setAttribute('cx',r.chair.p[0]);c.setAttribute('cy',r.chair.p[2]);c.setAttribute('r','.24');c.setAttribute('fill',active?venuePalette.reference:'transparent');c.dataset[inferred?'hydroInferred':'hydroReference']=[r.reference.section,r.reference.row,r.reference.seat].join('/');c.setAttribute('role','button');c.setAttribute('tabindex','0');c.setAttribute('aria-label',copy('{0} 区 · {1} 排 · {2} 座',[r.reference.section,r.reference.row,r.reference.seat])+' · '+copy(inferred?'示意编号，位置估算':'参考编号，位置估算'));
    const pick=()=>select(s.id,r.chair);c.onclick=e=>{e.stopPropagation();pick();};c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick();}};world.append(c);
    const t=svgNode('text');t.setAttribute('x',r.chair.p[0]);t.setAttribute('y',r.chair.p[2]-.34);t.setAttribute('font-size','.32');t.setAttribute('class','hydro-seat-number');t.setAttribute('pointer-events','none');t.style.fill=inferred?venuePalette.label:venuePalette.reference;t.textContent=r.reference.seat;world.append(t);
   }
  }
  for(const shape of model.shapes){
   if(!eventFloorVisible&&shape.kind!=='stage')continue;
   const p=svgNode('path');p.setAttribute('d',path(shape.points));p.setAttribute('fill',shape.kind==='stage'?venuePalette.stage:shape.kind==='equipment'?venuePalette.equipment:shape.kind==='standing'?venuePalette.standing:venuePalette.eventFloor);p.setAttribute('stroke',venuePalette.zoneOutline);p.setAttribute('stroke-width','.3');p.dataset.hydroZone=shape.id;world.append(p);
   if(shape.kind==='stage'&&shape.id!=='stage-main')continue;
   const xs=shape.points.map(p=>p[0]),zs=shape.points.map(p=>p[2]),t=svgNode('text');t.setAttribute('x',(Math.min(...xs)+Math.max(...xs))/2);t.setAttribute('y',(Math.min(...zs)+Math.max(...zs))/2);t.setAttribute('font-size',shape.id==='front-porch'?'1.25':'2');t.textContent=shape.id==='stage-main'?copy('STAGE · 示意'):copy(shape.label);world.append(t);
  }
 }
 function locate(){
  row.value=row.value.trim().toUpperCase();seat.value=seat.value.trim();
  const previous=viewer?.getView(),previousSeat=canvas.dataset.seatPosition;
  const match=select(sectionSelect.value);
  if(mode==='3d'){if(match.chair){if(previous?.mode==='audience'&&previousSeat===JSON.stringify(match.chair.p))viewer.restoreView(previous);else viewer?.audience(match.chair);}else viewer?.near();}
  if(mode==='2d'&&match.chair)focusMap(match.chair);
 }
 sectionSelect.onchange=()=>{row.value='';seat.value='';select(sectionSelect.value);};
 row.oninput=seat.oninput=()=>{const match=locateHydroReference(model,{section:sectionSelect.value,row:row.value,seat:seat.value});audience.disabled=!['reference','inferred','row','section'].includes(match.status);};
 function setEvent(id){
  if(id&&!events.some(e=>e.id===id))return;
  eventSelect.value=id;model=buildHydroDisplay(venue,id||null);stage.disabled=!model.performer;viewer?.setModel(model);select(sectionSelect.value);show(mode);
 }
 eventSelect.onchange=()=>setEvent(eventSelect.value);
 const mapGestures=createHydroMapGestures(svg,()=>({zoom,pan}), (view,commit)=>{zoom=view.zoom;pan=view.pan;if(commit){draw();return;}world.setAttribute('transform',`translate(${pan.join(' ')}) scale(${zoom}) rotate(${mapRotation} 0 -18)`);});
 const initial=select(sectionSelect.value);stage.disabled=!model.performer;show(mode);if(mode==='2d'&&initial.chair)focusMap(initial.chair);
 import('./hydro-viewer.mjs').then(({createHydroViewer})=>{
  if(disposed)return;viewer=createHydroViewer(canvas,(id,chair)=>select(id,chair),updateUrl);viewer.setModel(model);viewer.togglePhoneFrame(phoneFraming);viewer.toggleRoof(roofVisible);viewer.toggleEventFloor(eventFloorVisible);const match=select(selected.id);show(mode);const saved=decodeHydroView(params.get('hydroCamera'),cameraKey());if(saved)viewer.restoreView(saved);else if(mode==='3d'&&match.chair)viewer.audience(match.chair);
 }).catch(()=>{if(disposed)return;b3.disabled=true;mode='2d';show(mode);selectionInfo.textContent=status.textContent=copy('3D 暂不可用，已保留 2D 分区预览。');});
 return {selectEvent:setEvent,dispose(){disposed=true;mapGestures.dispose();shell.dispose();query.form.onsubmit=previousQuery.submit;query.section.onchange=previousQuery.section;query.section.oninput=previousQuery.sectionInput;query.section.setCustomValidity('');row.oninput=previousQuery.row;seat.oninput=previousQuery.seat;viewer?.dispose();details.remove();area.remove();}};
}

function path(points){return points.map((p,i)=>(i?'L':'M')+p[0].toFixed(3)+' '+p[2].toFixed(3)).join(' ')+' Z';}
function svgNode(tag){return document.createElementNS('http://www.w3.org/2000/svg',tag);}
function node(tag,text,className){const n=document.createElement(tag);if(text!=null)n.textContent=copy(text);if(className)n.className=className;return n;}
function field(text,control){const label=node('label',text);label.append(control);return label;}
function button(text,action){const b=node('button',text);b.type='button';b.onclick=action;return b;}
