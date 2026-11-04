import {localeViewKey,readLocaleView} from './locale-view.mjs';
import {venueViewCopy} from '../venue-view/venue-view-copy.mjs';
import {mountVenueLayers} from '../venue-view/venue-view-layers.mjs';
import {renderVenueLocation,venueEventCard,selectVenueEvent} from '../venue-view/venue-page-presenter.mjs';
import {mountVenueView,VENUE_MAP_POLICY} from '../venue-view/venue-view-controls.mjs';
import {venuePalette} from '../venue-view/venue-palette.mjs';
import {unpackSourceSeats,sourceMapPolygons,sourceStandGeometry,sourceSectionGuides,sourceAisleSteps} from './seating.mjs';
import {audienceSightline,displaySectionLabel,sectionPoint,sectionRenderHalfAngle,stageRects,proposedStageRects} from './geometry.mjs';
import {venueReturn} from './auth-contract.mjs';
import {resolveInitialRoute} from './route.mjs';
import {venueCountry} from '../catalog.mjs';
import {renderCountryVenuePicker} from '../venue-picker.mjs';
import {getLocale,localizedPath,t,copy,translations} from '../locales.mjs';
import '../language-switcher.mjs';
import {createMapTransform,zoomMap,rotateMap,resetMap,panMap} from './explorer-state.mjs';
import {o2DisplayModel,o2RowLabelAnchors,o2EventDisplayDraft} from './o2-display.mjs';
import {sourceBowlDisplay,sourceRowLabelAnchors} from './source-bowl-display.mjs';
import {eventChairFootprint} from './source-event-display.mjs';
import {referenceRowLabel,sourceTicketInput} from './seat-numbering.mjs';
const $=id=>document.getElementById(id);
const locale=getLocale(),route=path=>localizedPath(locale,path);
const state={me:null,catalog:[],venueId:'twcv-the-o2-arena-london',venue:null,sectionId:'122',result:null,layout:'end',mode:'2d',event:null,previewDraft:null,mapTransform:null,phoneFrame:false,roofVisible:false,zoom:1,billingPlans:[],billingPlan:'monthly',eventOverlayVisible:false,officialOverlayVisible:false};
let localResearch=null;
let viewer=null,viewerCameraMode='overview',viewerViewMode='overview',viewerDraft=null,viewerVenue=null,loadVersion=0,resolveVersion=0,loginToken=null,toastTimer=null;
// Capture before the shared language menu builds its destination URL.
document.addEventListener('click',event=>{
 if(localResearch?.active||!viewer||!event.target.closest('[data-language-switcher] [data-locale]'))return;
 const url=new URL(location.href);
 url.searchParams.set('sourceView',JSON.stringify({key:localeViewKey(url.searchParams),view:viewer.getView()}));
 history.replaceState(null,'',url.pathname+url.search+url.hash);
},{capture:true});
$('row').required=false;$('seat').required=false;
$('row').value='';$('seat').value='';
$('ticket-form').onsubmit=e=>{e.preventDefault();locate({intentional:true});};
const viewShell=mountVenueView($('viewer'),{canvas:$('scene'),map:$('map'),selection:$('selection-row'),slots:[$('map-levels'),$('map-layers')],translate:text=>venueViewCopy(text,getLocale(),copy),overlays:[$('view-error'),$('viewer-location')],legacyIds:true,onAction:handleViewAction});
const layerControls=mountVenueLayers({levels:$('map-levels'),layers:$('map-layers'),eventButton:$('map-event-toggle'),officialButton:$('map-official-toggle'),status:$('map-layer-status'),translate:copy,onChange(action,value){
 if(action==='level'){if(state.venue.sourceSeats)state.mapLevel=value;else state.mapTier=value;renderMap();return;}
 const key=action==='event'?'eventOverlayVisible':'officialOverlayVisible';state[key]=!state[key];render();
}});
function syncLayoutRoute(layout){
  if(typeof location==='undefined'||typeof history==='undefined')return;
  const params=new URLSearchParams(location.search);params.set('venue',state.venueId);
  if(layout)params.set('layout',layout);else params.delete('layout');
  if(state.event)params.set('event',state.event.id);else params.delete('event');
  history.replaceState(null,'',`${location.pathname}?${params.toString()}${location.hash}`);
}
const messages={SUBSCRIPTION_REQUIRED:copy('这个场馆需要 Pro 订阅，请先选择订阅周期。'),LOGIN_REQUIRED:copy('请先登录。'),INVALID_EMAIL:copy('请输入有效的邮箱地址。'),INVALID_LINK:copy('登录链接已失效，或与申请时的浏览器不一致，请重新申请。'),RATE_LIMITED:copy('操作有些频繁，请稍后再试。'),GOOGLE_NOT_CONFIGURED:copy('Google 登录暂未开放。'),EMAIL_NOT_CONFIGURED:copy('邮件登录暂未开放。'),BILLING_NOT_CONFIGURED:copy('订阅暂未开放。'),LINK_REQUIRED:copy('这个邮箱已有账号。请先用邮箱登录，再在我的账号中关联 Google。'),SAVE_LIMIT:copy('已达到当前套餐的位置保存上限。'),ALREADY_SUBSCRIBED:copy('你已订阅，可在账单中心管理。'),NO_SUBSCRIPTION:copy('当前没有可管理的账单账号。'),SEAT_UNVERIFIED:copy('暂不支持保存这个位置，请选择其他座位。'),GOOGLE_CANCELED:copy('已取消 Google 登录。')};
function message(error){return {INVALID_OTP:copy('验证码错误或已过期，请重新获取。'),OTP_EXPIRED:copy('验证已过期，请重新发送验证码。'),AUTH_UNAVAILABLE:copy('登录服务暂不可用，请稍后重试。'),MEMBERSHIP_REQUIRED:copy('该账号暂时无法访问 StagePeek，请重新登录。'),CHECKOUT_PENDING:copy('已有付款流程待确认，请稍后刷新或使用账单中心，避免重复付款。'),BILLING_REVIEW_REQUIRED:copy('该账单账号需要核查，请先通过账单中心管理订阅。')}[error.code]||messages[error.code]||copy('暂时无法完成，请稍后重试。');}
async function api(path,{method='GET',body}={}){
  if(path.startsWith('/api/venues'))path=path.replace('/api/venues','/api/concert-views/venues');
  if(path.startsWith('/api/admin/ticket-map-previews'))path=path.replace('/api/admin/ticket-map-previews','/api/concert-views/ticket-map-previews');
  if(path==='/api/admin/global-sources')path='/api/concert-views/hydro';
  const response=await fetch(path,{method,credentials:'same-origin',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined});
  const data=await response.json();if(!response.ok)throw Object.assign(new Error(data.error?.message||'Request failed'),{code:data.error?.code,status:response.status});return data;
}
function updateExplorerSteps(){
 const hasVenue=$('venue').value===(localResearch?.active?'ovo-hydro':state.venueId)&&Boolean(localResearch?.ready||state.venue),hasTicket=Boolean($('section').value&&$('row').value&&$('seat').value);
 const current=!hasVenue?'venue':(localResearch?.active?localResearch.ready:state.result)?'view':'ticket';
 for(const step of document.querySelectorAll('[data-explorer-step]')){const active=step.dataset.explorerStep===current;step.classList.toggle('is-current',active);step.classList.toggle('is-complete',step.dataset.explorerStep==='venue'&&hasVenue||step.dataset.explorerStep==='ticket'&&hasTicket);if(active)step.setAttribute('aria-current','step');else step.removeAttribute('aria-current');}
}
function setStatus(id,value,kind=''){const node=$(id);node.textContent=value||'';node.classList.remove('is-loading','is-error','is-success');if(kind)node.classList.add(`is-${kind}`);}
function toast(text){$('toast').textContent=copy(text);$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,5000);}
function open(id){location.assign(route(id==='login-dialog'?'/auth/login':id==='plan-dialog'?'/plans':'/account'));}
function element(tag,text,className){const el=document.createElement(tag);if(text!==undefined)el.textContent=copy(text);if(className)el.className=className;return el;}
function link(text,url){const a=element('a',text);if(/^https:\/\//.test(url)){a.href=url;a.target='_blank';a.rel='noopener noreferrer';}return a;}
function selectedSection(){return state.venue?.sections.find(s=>s.id===state.sectionId)||state.venue?.sections[0];}
function selectedPosition(){
  const display=state.venue&&o2DisplayModel(state.venue),source=state.result?.position;
  if(state.result?.status==='illustrative-view')return source;
  return Array.isArray(source)?display?.position(source)||source:display?.sectionCenters.get(state.sectionId)||selectedSection()?.center;
}
function renderStageOptions(){
  const select=$('stage-layout');select.replaceChildren();
  if(state.event){
    if(state.previewDraft){
      const option=element('option',copy('本场布局'));option.value='none';select.append(option);
    }else if(state.event.layout?.model){
      const option=element('option',state.event.layout.model.label||copy('本场演出 · 公开座位图舞台'));option.value='event';select.append(option);
    }else{
      const option=element('option',copy('暂无本场舞台图'));option.value='none';option.disabled=true;select.append(option);
    }
    select.value=state.layout;return;
  }
  for(const item of state.venue?.seatLayouts||(state.venue?.geometry?.referenceLayout?[{id:'end',label:state.venue.geometry.referenceLayout.label}]:[{id:'end',label:copy('端头舞台（通用）')},{id:'runway',label:copy('端头舞台 + 延伸台（通用）')},{id:'center',label:copy('中央舞台（通用）')}])){
    const option=element('option',item.label);option.value=item.id;select.append(option);
  }
  select.value=state.layout;
}
async function selectTicketMapPreview(event){
  const draftId=event.ticketMapDraft?.id;if(!draftId)return false;
  const expected=++loadVersion,id=state.venueId;resolveVersion++;
  try{
    const response=await api('/api/admin/ticket-map-previews/'+encodeURIComponent(draftId));
    if(expected!==loadVersion||response.draft.venueId!==id||state.venueId!==id)return false;
    const draft=response.draft;
    if(draft.version!==event.ticketMapDraft.version||draft.id!==draftId||draft.seatLayoutId!==event.ticketMapDraft.seatLayoutId){toast(copy('本场布局版本已更新，请刷新演出列表。'));return false;}
    if(draft.seatLayoutId!==state.venue.seatLayout?.id||state.venue.eventLayout){
      const loaded=await loadVenue(id,draft.seatLayoutId);
      if(!loaded||loadVersion!==expected+1||state.venueId!==id)return false;
    }
    if(state.venue.seatLayout?.assetSha256!==draft.fixedSeats.assetSha256)return false;
    state.previewDraft=draft;state.event=event;state.layout='none';state.eventOverlayVisible=true;state.result=null;state.sectionId=state.venue.sections[0]?.id;
    $('section').value=state.sectionId||'';$('row').value='';$('seat').value='';
    syncLayoutRoute(draft.seatLayoutId);renderStageOptions();render();
    return true;
  }catch(error){toast(message(error));return false;}
}
function updateGestureHint(){
  renderViewControls();
}
function renderMap(){
  const v=state.venue;if(!v)return;const svg=$('map'),ns='http://www.w3.org/2000/svg';svg.replaceChildren();
  const layer=document.createElementNS(ns,'g');layer.id='map-content';svg.append(layer);
  const add=(tag,props,text,parent=layer)=>{const e=document.createElementNS(ns,tag);for(const [k,value]of Object.entries(props))e.setAttribute(k,value);if(text)e.textContent=copy(text);parent.append(e);return e;};
  // These are the source's screen projections, not the estimated metre frame used by 3D.
  // Draw each original hit area separately to retain aisles, cutouts and irregular edges.
  const sourceProjection=v.sections.some(s=>s.polygonStatus==='source'),sameFrame=!sourceProjection;
  const sourceLevels=v.sourceLevels||[],selectedLevels=selectedSection()?.sourceLevels||[];
  const activeLevel=sourceLevels.some(l=>l.id===state.mapLevel)?state.mapLevel:selectedLevels[0]??sourceLevels[0]?.id;
  const sourceDisplay=sourceBowlDisplay(v);
  const display=o2DisplayModel(v),displaySeats=display?[...display.seats,...display.referenceRecords.map(s=>({...s,position:s.p}))]:v.sourceSeats;
  const renderedPolygons=display?new Map(v.sections.map(s=>[s.id,display.renderRecords.flatMap((r,i)=>r.level===activeLevel&&r.section===s.id?[{points:display.footprints[i].map(([x,,z])=>[x,z]),illustrative:Boolean(r.visualOnly),reference:Boolean(r.referenceSeat)}]:[])])):sourceDisplay?new Map(v.sections.map(s=>[s.id,sourceDisplay.records.flatMap((r,i)=>r.level===activeLevel&&r.section===s.id?[{points:sourceDisplay.footprints[i].map(([x,,z])=>[x,z])}]:[])])):v.sourceSeats?sourceMapPolygons(v.sourceSeats,activeLevel,v.researchRenderBatch?.layout):new Map(v.sections.map(s=>{
    if(!sameFrame)return [s.id,s.sourcePolygons||[]];
    if(s.block?.polygon)return [s.id,[{viewId:`reference:${s.id}`,points:s.block.polygon}]];
    const half=sectionRenderHalfAngle(v,s),boundary=[];
    for(let i=0;i<=12;i++)boundary.push(sectionPoint(v,s,0,-1+i/6,half));
    for(let i=12;i>=0;i--)boundary.push(sectionPoint(v,s,1,-1+i/6,half));
    return [s.id,[{viewId:`estimated:${s.id}`,points:boundary.map(p=>[p[0],p[2]])}]];
  }));
  const stand=display?{treads:display.treads,treadLevels:[...display.rows,...display.referenceRows].flatMap(row=>row.treads.map(()=>row.level))}:sourceDisplay?{treads:sourceDisplay.treads,treadLevels:sourceDisplay.treadLevels}:v.researchRenderBatch?.standGeometry?sourceStandGeometry(v.sourceSeats,'o2a',v.researchRenderBatch.standGeometry):null;
  const polygons=[...renderedPolygons.values()].flat(),points=stand?polygons.flatMap(p=>p.points):v.sourceSeats?v.sourceSeats.map(s=>[s.position[0],s.position[2]]):polygons.flatMap(p=>p.points);
  // Fit the visible level, including its supporting surface, rather than
  // shrinking L1 to make room for the hidden upper stand.
  if(stand)for(const [i,q]of stand.treads.entries())if(stand.treadLevels[i]===activeLevel)for(const [x,,z]of q)points.push([x,z]);
  const researchLayout=state.layout==='none'&&!state.event&&v.researchRenderBatch?.layout==='o2a'?'event':state.layout;
  const stageShapes=researchLayout!=='none'?(sameFrame?stageRects(researchLayout,v):proposedStageRects(researchLayout,v)):[];
  const rotation=r=>({transform:`rotate(${-(r.angle||0)*180/Math.PI} ${r.x} ${r.z})`});
  for(const r of stageShapes)for(const a of [-1,1])for(const b of [-1,1]){const x=a*r.w/2,z=b*r.d/2,c=Math.cos(r.angle||0),s=Math.sin(r.angle||0);points.push([r.x+x*c+z*s,r.z-x*s+z*c]);}
  const displayDraft=o2EventDisplayDraft(v,state.previewDraft);
  const previewShapes=state.eventOverlayVisible?(displayDraft?[...displayDraft.stage,...displayDraft.zones,...displayDraft.equipment]:state.event?.researchOverlay?.shapes||[]):[];
  for(const shape of previewShapes)for(const point of shape.polygon)points.push(point);
  if(!points.length){add('text',{x:0,y:0},'暂未取得该馆二维分区轮廓');svg.setAttribute('viewBox','-100 -30 200 60');return;}
  const minX=points.reduce((min,p)=>Math.min(min,p[0]),Infinity),minY=points.reduce((min,p)=>Math.min(min,p[1]),Infinity),maxX=points.reduce((max,p)=>Math.max(max,p[0]),-Infinity),maxY=points.reduce((max,p)=>Math.max(max,p[1]),-Infinity);
  const mapScale=Math.max(maxX-minX,maxY-minY),labelSize=Math.max(.6,mapScale*((display||sourceDisplay)? .025:.017)),margin=mapScale*.12;
  const baseViewBox=[minX-margin,minY-margin,maxX-minX+2*margin,maxY-minY+2*margin];
  if(!state.mapTransform||state.mapTransform.base.some((value,index)=>Math.abs(value-baseViewBox[index])>.001))state.mapTransform=createMapTransform(baseViewBox);
  updateMapViewport();
  const center=points=>[points.reduce((n,p)=>n+p[0],0)/points.length,points.reduce((n,p)=>n+p[1],0)/points.length];
  const area=points=>Math.abs(points.reduce((n,p,i)=>{const q=points[(i+1)%points.length];return n+p[0]*q[1]-q[0]*p[1];},0))/2;
  const largest=polygons=>[...polygons].sort((a,b)=>area(b.points)-area(a.points))[0];
  const tiers=[...new Set(v.sections.map(s=>s.tier))].sort((a,b)=>a-b),activeTier=Number.isInteger(state.mapTier)&&tiers.includes(state.mapTier)?state.mapTier:selectedSection()?.tier??tiers[0];
  const options=v.sourceSeats?sourceLevels:tiers.map(tier=>({id:tier,label:v.geometry?.tiers?.[tier]?.name||copy('层级 {0}',[tier+1])}));
  const eventLayerAvailable=Boolean(state.previewDraft||state.event?.researchOverlay?.shapes?.length||v.sourceZones?.length),officialLayerAvailable=v.sections.some(s=>s.officialSectionPolygons?.length);
  if(!eventLayerAvailable)state.eventOverlayVisible=false;if(!officialLayerAvailable)state.officialOverlayVisible=false;
  layerControls.update({mode:state.mode,options,active:v.sourceSeats?activeLevel:activeTier,eventAvailable:eventLayerAvailable,eventVisible:state.eventOverlayVisible,officialAvailable:officialLayerAvailable,officialVisible:state.officialOverlayVisible,note:display&&state.eventOverlayVisible?(displayDraft?.floorChairs?.length?'内场椅为示意，无票号':displayDraft?.displayFrame?'本场票图估算对齐':'叠加图按原始位置对照'):''});
  if(stand){
    const ground=add('g',{'data-source-stand':'true',...(display||sourceDisplay)?{'data-map-detail':'true'}:{},'pointer-events':'none',fill:display||sourceDisplay?venuePalette.tread:document.body.classList.contains('theme-arena')?'#33434a':'#d1d8c8'});
    const rows=new Map();
    for(const [i,q]of stand.treads.entries())if(stand.treadLevels[i]===activeLevel){
      const y=q[0][1],points=q.map(([x,,z])=>[x,z]);
      if(points.reduce((sum,p,i)=>{const next=points[(i+1)%points.length];return sum+p[0]*next[1]-next[0]*p[1];},0)<0)points.reverse();
      if(!rows.has(y))rows.set(y,[]);
      rows.get(y).push('M'+points.map(p=>p.map(v=>v.toFixed(4)).join(',')).join('L')+'Z');
    }
    for(const [y,paths]of rows)add('path',{d:paths.join(''),'data-source-row-height':y},null,ground);
  }
  if(stand){
    const guides=(display?.guides||sourceDisplay?.guides||sourceSectionGuides(v.sourceSeats,'o2a')).filter(g=>g.level===activeLevel);
    const guideLayer=add('g',{'data-section-guides':activeLevel,...(display||sourceDisplay)?{'data-map-detail':'true'}:{},'pointer-events':'none'});
    const stairs=(display?.aisleSteps||sourceDisplay?.aisleSteps||sourceAisleSteps(v.sourceSeats,'o2a')).filter(s=>s.level===activeLevel);
    add('path',{d:stairs.map(s=>'M'+s.tread.map(([x,,z])=>[x,z].join(',')).join('L')+'Z').join(''),fill:display?venuePalette.stairs:'#a7b79d','fill-opacity':.55,'data-aisle-steps':activeLevel},null,guideLayer);
    for(const guide of guides){
      const selected=guide.section===state.sectionId;
      if(selected)add('path',{d:'M'+guide.polygon.map(([x,,z])=>[x,z].join(',')).join('L')+'Z',fill:'#d6bd7c','fill-opacity':.16,'data-section-wash':guide.section},null,guideLayer);
      for(const edge of guide.edges)add('path',{d:'M'+edge.map(([x,,z])=>[x,z].join(',')).join('L'),fill:'none',stroke:selected?'#d3aa60':display?venuePalette.deck:'#889b7d','stroke-opacity':selected?1:.45,'stroke-width':selected?.12:.055,'stroke-linejoin':'round','data-section-border':guide.section},null,guideLayer);
    }
  }
  const labels=[];
  for(const s of v.sections){if(v.sourceSeats?!s.sourceLevels?.includes(activeLevel):s.tier!==activeTier)continue;const label=displaySectionLabel(s),g=add('g',{'data-section':s.id,'data-selected':String(s.id===state.sectionId),tabindex:0,role:'button','aria-label':s.block?.polygon?s.levelName:copy('分区 {0}',[label]),...s.block?.color?{style:'--section-fill:'+s.block.color}:{}});
    const shapes=renderedPolygons.get(s.id)||[],fill=display||sourceDisplay?(s.id===state.sectionId?venuePalette.selected:venuePalette.seat):s.id===state.sectionId?'#dc7a43':s.block?.color||['#628867','#4a7452','#3a6449','#31553c','#264935'][s.tier%5];
    if(stand)g.setAttribute('style',`--source-seat-fill:${display||sourceDisplay?(s.id===state.sectionId?venuePalette.selected:venuePalette.seat):s.id===state.sectionId?'#8eae78':'#628867'}`);
    if(sourceDisplay){
      const outlines=sourceDisplay.banks.filter(b=>b.section===s.id&&b.level===activeLevel).map(b=>b.outline);
      add('path',{d:outlines.map(points=>'M'+points.map(([x,,z])=>[x,z].join(',')).join('L')+'Z').join(''),fill,'data-section-mass':s.id,'stroke-linejoin':'round'},null,g);
    }
    if(display){
      const banks=display.guides.filter(guide=>guide.section===s.id&&guide.level===activeLevel);
      // Outline the bank from its inner/outer edges and row ends. Flattening
      // every tread leaves stripes even when individual chairs are hidden.
      const outlines=[];
      for(const reference of [false,true]){
        const rows=new Map();
        for(const guide of banks.filter(g=>Boolean(g.referenceRow)===reference)){
          if(!rows.has(guide.y))rows.set(guide.y,[]);rows.get(guide.y).push(guide);
        }
        const centre=display.sectionCenters.get(s.id),angle=Math.atan2(centre[0],centre[2]);
        const order=p=>reference?p[0]:Math.atan2(Math.sin(Math.atan2(p[0],p[2])-angle),Math.cos(Math.atan2(p[0],p[2])-angle));
        const ribbons=[...rows].sort((a,b)=>a[0]-b[0]).map(([,guides])=>({front:guides.flatMap(g=>g.front).sort((a,b)=>order(a)-order(b)),back:guides.flatMap(g=>g.back).sort((a,b)=>order(a)-order(b))}));
        if(!ribbons.length)continue;
        outlines.push([...ribbons[0].front,...ribbons.flatMap(r=>[r.front.at(-1),r.back.at(-1)]),...ribbons.at(-1).back.toReversed(),...ribbons.toReversed().flatMap(r=>[r.back[0],r.front[0]])]);
      }
      add('path',{d:outlines.map(points=>'M'+points.map(([x,,z])=>[x,z].join(',')).join('L')+'Z').join(''),fill:s.id===state.sectionId?venuePalette.selected:venuePalette.seat,'data-section-mass':s.id,'stroke-linejoin':'round'},null,g);
    }
    if(v.sourceSeats){
      // Illustrative completion can select its section, but never receives a
      // ticket hit target or a fabricated row/seat label.
      for(const shape of shapes){
        const path=add('path',{d:'M'+shape.points.map(point=>point.join(',')).join('L')+'Z',fill,...(display||sourceDisplay)?{'data-map-detail':'true'}:{},'data-source-level':activeLevel,[shape.illustrative?'data-illustrative-seat':shape.reference?'data-reference-seat':'data-source-seat']:'true'},null,g);
        if(shape.illustrative){add('title',{},'示意座位',path);path.onclick=e=>{e.stopPropagation();chooseSection(s.id,true,{previewOnly:true});};}
      }
    }
    else for(const p of shapes)add('polygon',{points:p.points.map(p=>p.join(',')).join(' '),fill,stroke:'#f6f7ef','stroke-width':mapScale*.0018},null,g);
    for(const outline of state.officialOverlayVisible?s.officialSectionPolygons||[]:[]){
      const path=add('path',{d:'M'+outline.points.map(point=>point.join(',')).join('L')+'Z',fill:'none',stroke:'#f4cf67','stroke-width':mapScale*.006,'stroke-dasharray':`${mapScale*.018} ${mapScale*.012}`,'pointer-events':'none','data-official-section':s.id});
      add('title',{},copy('{0} · 官方票区轮廓 · 估算对齐',[label]),path);
    }
    if(s.block?.polygon)add('title',{},s.levelName,g);
    const largestPolygon=largest(shapes);if(largestPolygon)labels.push({id:sourceDisplay?s.id:label,p:v.sourceSeats?center(shapes.flatMap(p=>p.points)):center(largestPolygon.points)});
    g.onclick=()=>chooseSection(s.id);g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();chooseSection(s.id);}};
  }
  // Labels above all shapes remain readable without masking polygon click targets.
  const textLayer=add('g',{'pointer-events':'none','aria-hidden':'true'});
  for(const label of labels)add('text',{x:label.p[0],y:label.p[1],'text-anchor':'middle','dominant-baseline':'central',fill:'white','font-size':labelSize,'paint-order':'stroke',stroke:display||sourceDisplay?venuePalette.labelOutline:'#31553c','stroke-width':labelSize*.13,...display||sourceDisplay?{'data-section-label':label.id,'data-base-size':labelSize}:{}},label.id,textLayer);
  for(const shape of previewShapes){
    const path=[shape.polygon,...shape.holes||[]].map(points=>'M'+points.map(point=>point.join(',')).join('L')+'Z').join('');
    const fill=shape.color||'#536b61';
    const drawn=add('path',{d:path,'fill-rule':'evenodd',fill,'fill-opacity':shape.kind==='stage'?.85:.35,stroke:fill,'stroke-width':mapScale*.002,'pointer-events':'none','data-draft-shape':shape.id});add('title',{},copy('{0} · 本场布局示意',[shape.label]),drawn);
    const floorChairs=displayDraft?.floorChairs?.filter(chair=>chair.zoneId===shape.id)||[];
    if(floorChairs.length){
      const seats=add('path',{d:floorChairs.map(chair=>'M'+eventChairFootprint(chair).map(p=>p.join(',')).join('L')+'Z').join(''),fill:venuePalette.seat,'fill-opacity':.8,'pointer-events':'none','data-event-floor-chairs':shape.id,'data-count':floorChairs.length});
      add('title',{},copy('{0} · 内场示意座椅，无排号、座号',[shape.label]),seats);
      for(const chair of floorChairs){
        const hit=add('circle',{cx:chair.p[0],cy:chair.p[2],r:.3,fill:'transparent',tabindex:0,role:'button','data-event-floor-view':shape.id,'aria-label':copy('{0} · 内场示意视角，无票号',[shape.label])});
        hit.onclick=e=>{e.stopPropagation();chooseFloorView(chair);};hit.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();chooseFloorView(chair);}};
      }
    }
    const centre=shape.labelPosition||center(shape.polygon);add('text',{x:centre[0],y:centre[1],'text-anchor':'middle','dominant-baseline':'central',fill:'#fff','font-size':labelSize*.7,'pointer-events':'none','data-draft-label':shape.id},shape.label);
  }
  const section=selectedSection(),sampleLayer=add('g',{});
  for(const sample of section?.samples||[]){
    const polygon=largest((section.sourcePolygons||[]).filter(p=>p.viewId===sample.viewId));if(!polygon)continue;
    const p=center(polygon.points),matched=state.result?.status==='matched'&&state.result.viewId===sample.viewId;
    const c=add('circle',{cx:p[0],cy:p[1],r:matched?3.8:2.4,fill:matched?'#e98742':'#d6ba65','data-selected':String(matched),stroke:'#fff','stroke-width':.7,tabindex:0,role:'button','aria-label':copy('{0} 排 · {1} 座 · 示意视角',[sample.row,sample.seat])},null,sampleLayer);
    add('title',{},'点击查看示意视角',c);c.onclick=e=>{e.stopPropagation();chooseSample(sample);};c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();chooseSample(sample);}};
  }
  if(v.sourceSeats){
    const numbering=sourceDisplay||display&&v.researchRenderBatch.seatNumbering;
    const rowNumbers=add('g',{id:'map-row-numbers','pointer-events':'none','aria-hidden':'true',display:'none',style:'letter-spacing:0'});
    const seatNumbers=add('g',{id:'map-seat-numbers','pointer-events':'none','aria-hidden':'true',display:'none',style:'letter-spacing:0;font-variant-numeric:tabular-nums'});
    const numberedRows=new Map();
    for(const seat of displaySeats.filter(item=>item.section===state.sectionId&&item.level===activeLevel)){
      const matched=['matched','reference'].includes(state.result?.status)&&seat.row===state.result.row&&seat.seat===state.result.seat;
      const rowLabel=sourceDisplay?seat.row:referenceRowLabel(v,seat);
      const c=add('circle',{cx:seat.position[0],cy:seat.position[2],r:matched ? .7 : .23,fill:matched?'#f29a4e':'transparent',[seat.referenceSeat?'data-reference-seat-hit':'data-source-seat-hit']:'true','data-selected':String(matched),...(display||sourceDisplay)&&!matched?{'data-map-detail':'true'}:{},tabindex:0,role:'button','aria-label':copy('{0} 区 · {1} 排 · {2} 座',[seat.section,rowLabel||seat.row,seat.seat])+(seat.referenceSeat?' · '+copy('参考位置，模型估算'):'')});
      add('title',{},copy('{0} 区 · {1} 排 · {2} 座',[seat.section,rowLabel||seat.row,seat.seat]),c);
      if(numbering&&rowLabel){
        numberedRows.set(seat.row,rowLabel);
        add('text',{x:seat.position[0],y:seat.position[2],'text-anchor':'middle','dominant-baseline':'central','font-size':.25,'font-weight':600,fill:'#f3f8ed','paint-order':'stroke',stroke:'#29422f','stroke-width':.025,'data-seat-number':seat.seat,...(seat.referenceSeat?{'data-reference-row':seat.row}:{'data-source-row':seat.row})},seat.seat,seatNumbers);
      }
      c.onclick=e=>{e.stopPropagation();chooseSample(seat);};c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();chooseSample(seat);}};
    }
    for(const anchor of sourceDisplay?sourceRowLabelAnchors(v,state.sectionId):numbering?o2RowLabelAnchors(v,state.sectionId):[]){
      if(!numberedRows.has(anchor.row))continue;
      add('text',{x:anchor.p[0],y:anchor.p[2],'text-anchor':'middle','dominant-baseline':'central','font-size':.48,'font-weight':700,fill:'#f6e4aa','paint-order':'stroke',stroke:'#243831','stroke-width':.09,'data-row-number':anchor.label},anchor.label,rowNumbers);
    }
    // Reappend above the transparent hit targets and the selected-seat marker.
    layer.append(rowNumbers);layer.append(seatNumbers);updateMapViewport();
    for(const z of state.eventOverlayVisible&&state.layout===v.seatLayout.id?v.sourceZones||[]:[]){const polygon=add('polygon',{points:z.polygon.map(p=>p.join(',')).join(' '),fill:'#b7c39d','fill-opacity':.4,stroke:'#849376','stroke-width':.3,'pointer-events':'none','data-reference-zone':z.id});add('title',{},copy('{0} · 场馆常规布局',[z.label||z.id]),polygon);}
    for(const stage of stageShapes){add('rect',{x:stage.x-stage.w/2,y:stage.z-stage.d/2,width:stage.w,height:stage.d,fill:'#b18f4c',stroke:'#e0bd63','stroke-width':mapScale*.002,'data-stage':'true',...rotation(stage)});add('text',{x:stage.x,y:stage.z,'text-anchor':'middle','dominant-baseline':'central',fill:'#fff','font-size':labelSize},'示意舞台');}
    add('text',{x:(minX+maxX)/2,y:maxY+margin*.55,'text-anchor':'middle',fill:'#6f8173','font-size':labelSize*.8},'位置与视角为示意，仅供参考');return;
  }
  const cx=(minX+maxX)/2,cy=(minY+maxY)/2,mapW=maxX-minX,mapH=maxY-minY;
  if(sameFrame){
    for(const r of stageShapes){add('rect',{x:r.x-r.w/2,y:r.z-r.d/2,width:r.w,height:r.d,fill:r.kind==='screen'?'#5e9b98':r.kind==='structure'?'#59616c':'#445f53',stroke:'#304d40','stroke-width':mapScale*.002,...rotation(r)});if(r.label)add('text',{x:r.x,y:r.z,'text-anchor':'middle',fill:'#fff','font-size':labelSize*.6},r.label);}
    const r=stageShapes[0];if(r)add('text',{x:r.x,y:r.z,'text-anchor':'middle','dominant-baseline':'central',fill:'#fff','font-size':labelSize},'示意舞台');
  }
  add('text',{x:cx,y:maxY+margin*.55,'text-anchor':'middle',fill:'#6f8173','font-size':labelSize*.75},'位置与视角为示意，仅供参考');
}
function updateMapViewport(){
  const t=state.mapTransform;if(!t)return;
  $('map').setAttribute('viewBox',t.viewBox.join(' '));
  const [x,y,w,h]=t.base;$('map-content')?.setAttribute('transform',`rotate(${t.rotation} ${x+w/2} ${y+h/2})`);
  $('map-zoom-value').textContent=`${Math.round(t.zoom*100)}%`;
  $('map-zoom-out').disabled=t.zoom<=.75;$('map-zoom-in').disabled=t.zoom>=8;
  for(const node of $('map').querySelectorAll('[data-map-detail]'))node.setAttribute('display',t.zoom>=2?'inline':'none');
  for(const node of $('map').querySelectorAll('[data-section-mass]'))node.setAttribute('display',t.zoom<2?'inline':'none');
  $('map-row-numbers')?.setAttribute('display',t.zoom>=2?'inline':'none');
  $('map-seat-numbers')?.setAttribute('display',t.zoom>=5?'inline':'none');
  if(state.venue?.researchRenderBatch?.seatNumbering||sourceBowlDisplay(state.venue)){
    // Section names and the marker must leave room for individual numbers
    // when the map is close enough to read tickets.
    for(const label of $('map').querySelectorAll('[data-section-label]')){
      const size=Number(label.getAttribute('data-base-size'))/Math.max(1,t.zoom/1.6);
      label.setAttribute('font-size',size);label.setAttribute('stroke-width',size*.13);
    }
    $('map').querySelector('[data-source-seat-hit][data-selected="true"]')?.setAttribute('r',t.zoom>=5?.24:.7);
    $('map').querySelector('[data-reference-seat-hit][data-selected="true"]')?.setAttribute('r',t.zoom>=5?.24:.7);
  }
}
function renderViewControls(){
  viewShell.update({mode:state.mode,cameraMode:viewerViewMode,phone:state.phoneFrame,roof:state.roofVisible,canAudience:!$('seat-view').disabled,canStage:!!state.eventOverlayVisible&&!!o2EventDisplayDraft(state.venue,state.previewDraft)?.stage?.length,zoom:state.zoom,mapZoom:state.mapTransform?.zoom||1});
}

function render(){
  updateExplorerSteps();
  if(localResearch?.active)return;
  const v=state.venue;if(!v)return;clearFloorView();renderEventLayout();const s=selectedSection(),r=state.result,display=o2DisplayModel(v);
  $('venue-name').textContent=v.name;$('venue-city').textContent=v.city.split(' · ').map(part=>copy(part)).join(' · ')+(state.previewDraft?' · '+state.previewDraft.event.name+' · '+state.previewDraft.event.dates.join(' / '):v.geometry?.referenceLayout?' · '+copy(v.geometry.referenceLayout.label):'');
  $('accuracy-short').textContent=copy('位置仅供参考');
  $('coverage-count').textContent=copy('座位、舞台与人物均为示意');
  $('capability-badges').replaceChildren();
  $('coverage-note').textContent=copy('可输入区、排、座，或点击地图查看大致视角。');
  $('source-link').href=v.source;$('source-link').textContent=copy('场馆官网 ↗');
  $('research-v0-notice').hidden=true;
  if(v.researchRenderBatch&&!state.event){
    $('layout-state').textContent=copy('场馆布局');
    $('event-layout-note').textContent=copy('选择演唱会，查看对应的舞台与内场。');
    $('layout-source-note').textContent=copy('座位和舞台位置为示意，仅供参考。');
  }
  let locationSection,locationRow,locationStatus,locationDescription,locationDistance;
  const matched=r?.status==='matched',located=['matched','estimated','reference','illustrative-view'].includes(r?.status)&&Array.isArray(r?.position),estimated=r?.status==='estimated',sourceCoordinate=matched&&r?.positionStatus==='source-coordinate';
  const floorView=r?.status==='illustrative-view',referenceRow=referenceRowLabel(v,r),rowLabel=referenceRow||r?.row;
  locationSection=s?.block?.polygon?copy('{0} 档',[displaySectionLabel(s)]):located?(s?.sourceLabel||r.section):(s?displaySectionLabel(s):'—');locationRow=r?.row&&r?.seat?copy('{0} 排 · {1} 座',[rowLabel,r.seat]):'分区预览';
  $('row-list').replaceChildren();for(const group of Object.values(v.researchRenderBatch?.seatNumbering?.rows[state.sectionId]||{})){const option=element('option');option.value=group.label;$('row-list').append(option);}
  for(const row of display?.referenceRows||[]){if(!display.referenceRecords.some(s=>s.section===state.sectionId&&s.row===row.row))continue;const option=element('option');option.value=row.row;$('row-list').append(option);}
  const unavailable=!!(r?.row||r?.seat)&&!located;
  locationStatus=matched?'已找到座位 · 示意位置':estimated?'示意座位':r?.status==='unknown-layout'?'暂无此布局':r?.status==='unknown-section'?'未找到这个分区':unavailable?'未找到这个排座 · 分区预览':'分区预览';
  locationDescription=located?'位置与视角为示意，仅供参考。':r?.status==='unknown-section'?'请按门票输入区号，或从地图选择分区。':unavailable?'可检查区、排、座，或点击地图探索其他位置。':'输入排座，或点击地图查看大致视角。';
  if(r?.status==='reference'){locationStatus='参考编号 · 示意位置';}
  if(floorView){locationSection=r.zoneLabel;locationRow='内场示意视点';locationStatus='内场视角';locationDescription='仅供查看舞台视角，不对应真实座位。';}
  const sightline=located&&!floorView&&!state.previewDraft?audienceSightline(v,state.layout==='none'&&display&&!state.event?'event':state.layout,selectedPosition()):null;
  locationDistance=state.previewDraft?'舞台位置为示意':sightline?copy('约 {0} m · 仅供参考',[Math.round(sightline.distance)]):located?'暂无距离参考':'—';
  $('seat-view').disabled=!located;$('phone-toggle').disabled=!located;
  if(!located){state.phoneFrame=false;viewer?.togglePhoneFrame(false);}
  $('selection-tag').textContent=floorView?copy('{0} · 内场示意视点',[r.zoneLabel]):(s?.block?.polygon?s.levelName.replace('（方位示意，非票面区号）',''):copy('{0} 区',[s?displaySectionLabel(s):'']))+' · '+(located?copy('{0} 排 / {1} 座 · 示意位置',[rowLabel,r.seat]):copy('分区预览'));
  $('viewer-location').textContent='';
  renderVenueLocation(document,{section:locationSection,row:locationRow,status:locationStatus,description:locationDescription,distance:locationDistance,matched},copy);
  const samples=$('samples-list');samples.replaceChildren();
  for(const sample of floorView?[]:s?.samples||[]){const button=element('button',copy('{0} 排 · {1} 座',[referenceRowLabel(v,sample)||sample.row,sample.seat]));button.type='button';button.onclick=()=>chooseSample(sample);samples.append(button);}
  if(floorView)samples.append(element('p','内场示意椅仅提供视角，不提供真实票号。'));
  if(!floorView&&!s?.samples.length)samples.append(element('p','可在地图中选择其他位置。'));
  $('scene').hidden=state.mode!=='3d';$('map').toggleAttribute('hidden',state.mode!=='2d');renderViewControls();
  updateGestureHint();
  $('mode-2d').classList.toggle('active',state.mode==='2d');$('mode-3d').classList.toggle('active',state.mode==='3d');
  renderMap();viewer?.setData(v,state.sectionId,selectedPosition(),state.layout,located,Boolean(state.event),floorView);
  const activeOverlay=state.eventOverlayVisible?(o2EventDisplayDraft(v,state.previewDraft)||state.event?.researchOverlay&&{...state.event.researchOverlay,status:'shell-event-preview',venueId:v.id,shapes:state.event.researchOverlay.shapes||[]}):null;
  viewer?.toggleReferenceZones(state.eventOverlayVisible&&!activeOverlay);
  if(viewer&&(viewerDraft!==activeOverlay||viewerVenue!==v)){viewer.setResearchOverlay(activeOverlay);viewerDraft=activeOverlay;viewerVenue=v;}
  viewer?.toggleRoof(state.roofVisible);viewer?.togglePhoneFrame(state.phoneFrame);
}
async function refreshAccount(){state.me=await api('/api/me');$('plan-label').textContent={guest:copy('免费体验'),free:copy('免费账号'),pro:copy('Pro 月订阅')}[state.me.access.plan];}
function renderVenuePicker(country,selectedId=''){
 renderCountryVenuePicker({catalog:state.catalog,countrySelect:$('venue-country'),select:$('venue'),country,selectedId,locale,placeholderText:t('explorer.pickVenue')});
}
async function loadCatalog(){
 setStatus('venue-status',copy('正在读取场馆目录…'),'loading');setStatus('explorer-status',copy('正在准备场馆目录…'),'loading');
 const [regular,hydro]=await Promise.all([api('/api/venues'),api('/api/admin/global-sources')]);
 state.catalog=[...regular.venues,...hydro.venues.map(v=>({...v,country:'英国'}))];
 renderVenuePicker(venueCountry(state.catalog.find(v=>v.id===new URLSearchParams(location.search).get('venue'))||state.catalog[0]),new URLSearchParams(location.search).get('venue')||state.venueId);
 setStatus('venue-status',copy('场馆目录已准备好'),'success');setStatus('explorer-status','');$('venue-retry').hidden=true;
 return hydro.venues;
}
async function loadVenue(id,layout,preserveEvent=null){
  const version=++loadVersion;resolveVersion++;$('locate').disabled=true;setStatus('venue-status',copy('正在加载场馆…'),'loading');
  try{const {venue}=await api('/api/venues/'+id+(layout?'?layout='+encodeURIComponent(layout):''));if(version!==loadVersion)return;
    if(venue.seatTuples){venue.sourceSeats=unpackSourceSeats(venue.seatTuples);delete venue.seatTuples;}
    resolveVersion++;state.venueId=id;state.venue=venue;state.mapTier=null;state.mapLevel=null;state.mapTransform=null;state.event=null;state.previewDraft=null;state.eventOverlayVisible=false;state.officialOverlayVisible=false;state.layout=venue.seatLayout?.id||'end';state.phoneFrame=false;state.roofVisible=false;
    if(typeof renderStageOptions==='function')renderStageOptions();else{for(const item of venue.seatLayouts||[{id:'end',label:'端头舞台（通用）'},{id:'runway',label:'端头舞台 + 延伸台（通用）'},{id:'center',label:'中央舞台（通用）'}]){const option=element('option',item.label);option.value=item.id;$('stage-layout').append(option);}$('stage-layout').value=state.layout;}
    state.sectionId=venue.sections.some(x=>x.id==='122')?'122':venue.sections[0].id;state.result=null;
    $('section-list').replaceChildren();for(const section of venue.sections)for(const label of section.ticketLabels){const option=element('option');option.value=label;$('section-list').append(option);}
    setStatus('venue-status',copy('场馆已准备好'),'success');setStatus('explorer-status','');renderVenuePicker(venueCountry(venue),id);chooseSection(state.sectionId,false);render();syncLayoutRoute(state.layout);if(preserveEvent){const params=new URLSearchParams(location.search);params.set('event',preserveEvent);history.replaceState(null,'',`${location.pathname}?${params.toString()}${location.hash}`);}await loadEvents(id,version);return true;
  }catch(error){toast(message(error));if(error.code==='SUBSCRIPTION_REQUIRED')open('plan-dialog');
    if(!state.venue){$('venue-name').textContent=state.catalog.find(v=>v.id===id)?.name||copy('暂时无法载入场馆');$('location-status').textContent=copy(error.code==='SUBSCRIPTION_REQUIRED'?'此场馆当前需要订阅，尚未加载座位。':'场馆暂未加载，请稍后重试。');}
    setStatus('venue-status',copy('场馆暂时无法载入，请重试。'),'error');$('venue-retry').hidden=false;$('venue').value=state.venue?state.venueId:id;$('stage-layout').value=state.layout;return false;}
  finally{if(version===loadVersion){$('locate').disabled=false;$('locate').textContent=copy('找到我的座位');updateExplorerSteps();}}
}
function applyRequestedSection(section){
  if(!section||!state.venue)return;
  const target=state.venue.sections.find(item=>item.id===section||item.ticketLabels.includes(section));
  if(target){state.sectionId=target.id;state.mapTier=target.tier;state.mapLevel=target.sourceLevels?.[0];}
  $('section').value=section;$('row').value='';$('seat').value='';
  state.result={status:target?'unverified':'unknown-section',section,row:'',seat:''};render();
}
async function applyRequestedLayout(layout){
  if(!state.venue)return false;
  if(state.venue.geometry?.referenceLayout){state.layout='end';renderStageOptions();render();return layout==='end';}
  if(state.venue.seatLayouts){
    if(!state.venue.seatLayouts.some(item=>item.id===layout)){toast('暂无这个布局，请选择其他布局。');return false;}
    if(state.layout!==layout)await loadVenue(state.venueId,layout);return state.layout===layout;
  }
  if(!['end','runway','center'].includes(layout))return false;
  state.layout=layout;$('stage-layout').value=layout;render();return true;
}
function chooseSection(id,focus=true,{previewOnly=false}={}){
  resolveVersion++;$('locate').disabled=false;
  const section=state.venue?.sections.find(s=>s.id===id);if(!section)return;state.sectionId=id;state.mapTier=section.tier;
  const sample=previewOnly?null:state.venue.sourceSeats?(section.samples.find(s=>s.level===state.mapLevel)||section.samples[0]):section.samples.find(x=>x.row==='14'&&x.seat==='679')||section.samples[0];
  state.mapLevel=state.venue?.sourceSeats&&section.sourceLevels?.includes(state.mapLevel)?state.mapLevel:sample?.level??section.sourceLevels?.[0];
  $('section').value=section.ticketLabels[0]||sample?.section||id;$('row').value=referenceRowLabel(state.venue,sample)||sample?.row||'';$('seat').value=sample?.seat||'';
  state.result=sample?{status:'matched',...sample,sectionId:id}:{status:'unverified',section:id,row:'',seat:''};render();
  if(focus)viewer?.near();
}
function chooseEstimatedSeat(record){
  if(record.sourceSeat||record.referenceSeat){chooseSample(record);return;}
  resolveVersion++;$('locate').disabled=false;
  const section=state.venue?.sections.find(item=>item.id===record.section);if(!section)return;
  const ticketSection=section.ticketLabels[0]||section.id;
  $('section').value=ticketSection;$('row').value='';$('seat').value='';
  state.sectionId=section.id;state.mapTier=section.tier;state.result={status:'estimated',section:ticketSection,row:record.row,seat:record.seat,sectionId:section.id,position:record.p,positionStatus:'estimated-seat-grid'};
  render();viewer?.seatView();
}
function chooseFloorView(chair){
  if(!state.eventOverlayVisible)return;
  const overlay=o2EventDisplayDraft(state.venue,state.previewDraft);
  if(!overlay?.floorChairs.includes(chair))return;
  resolveVersion++;$('locate').disabled=false;
  $('section').value='';$('row').value='';$('seat').value='';
  state.phoneFrame=false;
  state.result={status:'illustrative-view',zoneId:chair.zoneId,zoneLabel:chair.label,position:[...chair.p],positionStatus:'illustrative-event-view',eventId:state.event.id};
  render();viewer?.seatView();
}
function clearFloorView(){
  if(state.result?.status!=='illustrative-view')return;
  if(state.eventOverlayVisible&&state.result.eventId===state.event?.id)return;
  resolveVersion++;state.result=null;state.phoneFrame=false;
  $('section').value='';$('row').value='';$('seat').value='';
  viewer?.overview();
}
async function chooseSample(sample){$('section').value=sample.section;$('row').value=referenceRowLabel(state.venue,sample)||sample.row;$('seat').value=sample.seat;await locate({intentional:true});}
async function locate({intentional=false}={}){const version=++resolveVersion,id=state.venueId,requestedVenue=state.venue;$('locate').disabled=true;
  try{const ticket=sourceTicketInput(state.venue,{section:$('section').value,row:$('row').value,seat:$('seat').value});
    const reference=o2DisplayModel(state.venue)?.referenceRecords.find(s=>s.section===ticket.section.trim()&&s.row===ticket.row.trim().toUpperCase()&&s.seat===ticket.seat.trim());
    const found=reference?{status:'reference',section:reference.section,sectionId:reference.section,row:reference.row,seat:reference.seat,referenceSeat:true,referenceId:reference.referenceId,position:reference.p,positionStatus:'reference-camera-estimate',level:reference.level}:await api(`/api/venues/${id}/resolve`,{method:'POST',body:{layout:state.venue?.seatLayout?.id,...ticket}});
    if(version!==resolveVersion||id!==state.venueId||state.venue!==requestedVenue)return;state.result=found;if(found.sectionId){state.sectionId=found.sectionId;state.mapTier=state.venue.sections.find(s=>s.id===found.sectionId)?.tier;if(found.level!==undefined)state.mapLevel=found.level;}render();
    if(['matched','reference'].includes(found.status)&&Array.isArray(found.position)){viewer?.seatView();if(intentional&&found.status==='matched')window.stagepeekTrack?.('seat_located');}
    else{viewer?.near();toast(found.status==='matched'?'已找到编号，暂不能显示此座位视角。':found.status==='ambiguous'?'此编号有多个匹配，请确认分区和排座。':found.status==='unknown-section'?'尚未找到这个分区。':'暂不能显示此座位视角，可先查看分区。');}
  }catch(error){toast(message(error));}finally{if(version===resolveVersion)$('locate').disabled=false;}}
async function loadEvents(id,version){$('events-list').replaceChildren(element('p','正在读取官方演出信息…','muted'));
  try{const result=await api(`/api/venues/${id}/events`);if(version!==loadVersion)return;
    $('events-list').replaceChildren();$('event-count').textContent=copy('{0} 场演出',[result.events.length+(result.researchConcerts?.length||0)]);
    for(const event of result.events){
      const mapState=copy(event.layout?.model?'查看本场布局':event.layout?.mapVerification==='reference'?'查看座位图':event.layout?.mapVerification==='unavailable'?'座位图待票务平台发布':'暂无本场座位图');
      $('events-list').append(venueEventCard(document,{id:event.id,title:event.name,lines:[event.localDate+(event.endLocalDate!==event.localDate?' — '+event.endLocalDate:''),event.status==='canceled'?copy('已取消'):event.status==='postponed'?copy('已延期'):mapState],links:[{label:copy('官方详情 ↗'),url:event.source},...(event.layout?.mapVerification==='reference'?[{label:copy('场次座位图参考 ↗'),url:event.layout.source||event.layout.image}]:[])],onSelect:()=>selectEvent(event)}));
    }
    if(result.researchConcerts?.length){

      for(const event of result.researchConcerts){
        const date=event.dates?.join(' / ')||event.localDate||event.date||copy('日期待核实');const detail=copy(event.ticketMapDraft||event.researchOverlay?'查看本场布局':'暂无本场座位图');
        const onSelect=async()=>{
          if(event.ticketMapDraft){await selectTicketMapPreview(event);return;}
          if(event.researchOverlay){selectEvent({...event,layout:{status:'research-overlay',source:event.source,mapVerification:'reference',model:null,eventVerification:'research-overlay'},researchOverlay:event.researchOverlay});return;}
          // A page-listed reference event belongs to the current source-seat
          // venue. Keep the fixed venue base in place and show the event's
          // unresolved state here; sending it to the western research route
          // loses the TWCV seat asset and made the button appear inert.
          selectEvent({...event,layout:{status:'unavailable',source:event.source,mapVerification:'unavailable',model:null,eventVerification:'page-listed-name',stageVerification:'unverified'}});
        };
        $('events-list').append(venueEventCard(document,{id:event.id,title:event.name,lines:[`${date} · ${detail}`],links:[{label:copy('演出详情 ↗'),url:event.source}],research:true,onSelect}));
      }
    }
    if(!result.events.length&&!result.researchConcerts?.length)$('events-list').append(element('p',result.status==='unavailable'?copy('暂时无法取得官方活动列表。'):copy('暂未取得可展示的近期演出。'),'muted'));
    $('events-status').textContent='';renderEventLayout();
  }catch(error){if(version===loadVersion)$('events-list').replaceChildren(element('p',copy('演出列表暂时不可用，请稍后重试。'),'muted'));}}
async function selectEvent(event){
  loadVersion++;resolveVersion++;state.previewDraft=null;
  const id=state.venueId,model=event.layout?.model;
  if(state.event||(model?.seatLayoutId&&model.seatLayoutId!==state.venue.seatLayout?.id)){
    const expected=loadVersion+1;
    await loadVenue(id,model?.seatLayoutId||state.venue.seatLayout?.id);
    if(loadVersion!==expected||state.venueId!==id)return;
  }
  if(model?.seatLayoutId&&state.venue.seatLayout?.id!==model.seatLayoutId)return;
  if(state.venue.geometry?.referenceLayout){toast(copy('当前为指定历史场次参考，尚未取得这场演出的临时座席布局。'));return;}
  const closed=new Set(model?.closedSections||[]);
  state.event=event;state.eventOverlayVisible=false;state.venue={...state.venue,eventLayout:model||null,
    sections:state.venue.sections.filter(s=>!closed.has(s.id)),
    ...(state.venue.sourceSeats?{sourceSeats:state.venue.sourceSeats.filter(s=>!closed.has(s.section))}:{})};
  state.result=null;state.sectionId=state.venue.sections[0]?.id;state.layout=model?'event':'none';
  $('section').value=state.sectionId||'';$('row').value='';$('seat').value='';
  $('section-list').replaceChildren();
  for(const section of state.venue.sections)for(const label of section.ticketLabels){const option=element('option');option.value=label;$('section-list').append(option);}
  renderStageOptions();render();syncLayoutRoute(state.layout);
}
function renderEventLayout(){
  selectVenueEvent($('events-list'),state.event?.id);
  $('return-venue-layout').hidden=!state.event;
  $('ticket-map-conflicts').hidden=true;$('ticket-map-conflicts').replaceChildren();$('conflict-legend').hidden=true;
  if(state.previewDraft){
    $('layout-state').textContent=copy('本场布局');
    $('layout-source-note').textContent=`${state.previewDraft.event.name} · ${state.previewDraft.event.dates.join(' / ')}`;
    $('event-layout-note').textContent=copy('舞台、内场与人物为示意，仅供视角参考。')+(state.previewDraft.zones.some(zone=>zone.kind==='standing')?copy(' GENERAL ADMISSION 为站区，无座号。'):'');
    const image=$('ticket-map-preview-image'),path='/api/concert-views/ticket-map-previews/'+encodeURIComponent(state.previewDraft.id)+'/image';
    if(image.getAttribute('src')!==path)image.src=path;image.hidden=false;return;
  }
  if(state.event?.researchOverlay){
    $('layout-state').textContent=copy('本场布局');
    $('layout-source-note').textContent=`${state.event.name}`;
    $('event-layout-note').textContent=copy('舞台与内场为示意，仅供视角参考。');
    $('ticket-map-preview-image')?.setAttribute('hidden','');
    $('ticket-map-preview-image')?.removeAttribute('src');
    return;
  }
  const previewImage=$('ticket-map-preview-image');
  previewImage?.setAttribute('hidden','');
  previewImage?.removeAttribute('src');
  const event=state.event,model=event?.layout?.model;
  $('layout-source-note').textContent=copy('座位和舞台位置为示意，仅供参考。');
  $('layout-state').textContent=event?(model?copy('本场布局'):copy('暂无本场布局')):copy('场馆布局');
  $('event-layout-note').textContent=event?(model?copy('演出布局可能调整，请以主办方信息为准。'):copy('可查看场馆分区；本场舞台与内场暂不可用。')):copy('选择演唱会，查看对应的舞台与内场。');
}

$('venue-country').onchange=()=>{renderVenuePicker($('venue-country').value);$('locate').disabled=true;setStatus('venue-status',t('explorer.pickVenue'),'loading');updateExplorerSteps();};
for(const input of document.querySelectorAll('#ticket-form input,#ticket-form select'))for(const event of ['input','change'])input.addEventListener(event,updateExplorerSteps);
$('venue-retry').onclick=async()=>{try{if(!state.catalog.length)await loadCatalog();await loadVenue($('venue').value||state.venueId);}catch{setStatus('venue-status',copy('场馆暂时无法载入，请重试。'),'error');}};
$('venue').onchange=()=>{if(!$('venue').value)return;const venue=state.catalog.find(x=>x.id===$('venue').value);if(venue?.locked){$('venue').value=state.venueId;open('plan-dialog');}else loadVenue($('venue').value);};
$('return-venue-layout').onclick=()=>loadVenue(state.venueId,state.venue.seatLayout?.id);
 $('stage-layout').onchange=()=>{if(state.event){renderStageOptions();return;}const value=$('stage-layout').value;if(value==='event'&&state.event?.layout?.model){state.layout='event';}else if(state.venue?.seatLayouts)loadVenue(state.venueId,value);else{state.layout=value;state.venue={...state.venue,eventLayout:null};renderEventLayout();render();}};
async function handleViewAction(action,value){
  if(action==='2d'||action==='3d'){
    state.mode=action;render();if(action==='3d')await ensureViewer();
    render();viewer?.setMode(state.mode);const params=new URLSearchParams(location.search);params.set('mode',state.mode);history.replaceState(null,'',`${location.pathname}?${params.toString()}${location.hash}`);return;
  }
  const cameraActions={overview:()=>viewer?.overview(),reset:()=>viewerCameraMode==='seat'?viewer?.seatView():viewer?.overview(true),near:()=>viewer?.near(),audience:()=>viewer?.seatView(),stage:()=>viewer?.stageView()};
  if(cameraActions[action]){cameraActions[action]();return;}
  const mapActions={mapOut:t=>zoomMap(t,VENUE_MAP_POLICY.zoomOut),mapIn:t=>zoomMap(t,VENUE_MAP_POLICY.zoomIn),mapRotate:t=>rotateMap(t,90),mapReset:resetMap};
  if(mapActions[action]){if(state.mapTransform){state.mapTransform=mapActions[action](state.mapTransform);updateMapViewport();}return;}
  if(action==='viewIn'||action==='viewOut')viewer?.zoom(action==='viewIn'?1.25:.8);
  if(action==='zoom'){state.zoom=value;viewer?.setZoom(value);}
  if(action==='roof'){state.roofVisible=!state.roofVisible;viewer?.toggleRoof(state.roofVisible);}
  if(action==='phone'){state.phoneFrame=!state.phoneFrame;viewer?.togglePhoneFrame(state.phoneFrame);if(state.phoneFrame&&viewerCameraMode!=='seat')viewer?.seatView();}
  renderViewControls();
}

// Keep pointer gestures on the viewport, so panning never changes source XYZ.
{
 const svg=$('map'),pointers=new Map();let moved=false,pinch=0,origin=null;
 const point=e=>({x:e.clientX,y:e.clientY});
 svg.addEventListener('pointerdown',e=>{if(!state.mapTransform)return;pointers.set(e.pointerId,point(e));origin=point(e);if(pointers.size===1)moved=false;else moved=true;pinch=0;});
 svg.addEventListener('pointermove',e=>{
  const previous=pointers.get(e.pointerId);if(!previous||!state.mapTransform)return;
  pointers.set(e.pointerId,point(e));
  if(pointers.size===1&&!moved&&Math.hypot(e.clientX-origin.x,e.clientY-origin.y)<5)return;
  moved=true;if(!svg.hasPointerCapture(e.pointerId))svg.setPointerCapture(e.pointerId);
  if(pointers.size===2){const [a,b]=[...pointers.values()],distance=Math.hypot(a.x-b.x,a.y-b.y);if(pinch)state.mapTransform=zoomMap(state.mapTransform,distance/pinch);pinch=distance;}
  else if(pointers.size===1){const matrix=svg.getScreenCTM();if(matrix){const a=new DOMPoint(previous.x,previous.y).matrixTransform(matrix.inverse()),b=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());state.mapTransform=panMap(state.mapTransform,a.x-b.x,a.y-b.y);}}
  updateMapViewport();
 });
 for(const name of ['pointerup','pointercancel','lostpointercapture'])svg.addEventListener(name,e=>{pointers.delete(e.pointerId);pinch=0;});
 svg.addEventListener('click',e=>{if(moved&&e.detail!==0){e.preventDefault();e.stopImmediatePropagation();}},{capture:true});
 svg.addEventListener('wheel',e=>{if(!state.mapTransform)return;e.preventDefault();state.mapTransform=zoomMap(state.mapTransform,Math.exp(-e.deltaY*VENUE_MAP_POLICY.wheelSpeed));updateMapViewport();},{passive:false});
 svg.addEventListener('keydown',e=>{if(!state.mapTransform||e.target!==svg)return;const actions={'+':t=>zoomMap(t,VENUE_MAP_POLICY.zoomIn),'=':t=>zoomMap(t,VENUE_MAP_POLICY.zoomIn),'-':t=>zoomMap(t,VENUE_MAP_POLICY.zoomOut),'0':resetMap};if(actions[e.key]){e.preventDefault();state.mapTransform=actions[e.key](state.mapTransform);updateMapViewport();}});
}
$('save-position').onclick=()=>open('account-dialog');
let viewerLoading=null;
async function ensureViewer(){
  if(viewer)return;
  if(viewerLoading)return viewerLoading;
  $('mode-3d').disabled=true;$('mode-3d').textContent=copy('正在加载 3D…');
  viewerLoading=(async()=>{
    try{
      const {createViewer}=await import('./viewer.mjs');
      viewer=createViewer($('scene'),{onSection:chooseSection,onSample:chooseSample,onSeat:chooseEstimatedSeat,onFloorView:chooseFloorView,onResearchShape:shape=>{if(shape)toast(copy(shape.label)+' · '+copy(shape.kind==='stage'?'舞台与人物为示意':shape.kind==='equipment'?'设备区示意':'内场示意，无票号'));},onMode:(mode,detail)=>{viewerCameraMode=mode;if(detail?.viewMode)viewerViewMode=detail.viewMode;updateGestureHint();renderViewControls();if(detail?.zoom){state.zoom=detail.zoom;renderViewControls();}},onFailure:text=>{state.mode='2d';$('mode-3d').disabled=true;toast(text+' · '+copy('已切换到二维地图。'));render();viewer?.setMode('2d');}});
      $('mode-3d').disabled=false;render();viewer.setMode(state.mode);viewer.setZoom(state.zoom);
    }catch{state.mode='2d';$('mode-3d').disabled=true;render();toast(copy('此设备暂不能显示三维场景，已切换到二维地图。'));}
    finally{$('mode-3d').textContent=copy('3D 视角');}
  })();
  return viewerLoading;
}
document.querySelectorAll('[data-i18n]').forEach(node=>{const value=translations(locale)[node.dataset.i18n];if(value)node.textContent=value;});
try{
  const params=new URLSearchParams(location.search);loginToken=new URLSearchParams(location.hash.slice(1)).get('token');
  const [,hydroVenues]=await Promise.all([refreshAccount(),loadCatalog()]);
  // Select the local source capability before resolving tickets against the
  // original catalog; a new venue must never query a fallback venue's seats.
  if(state.me.providers.localInbox){
   try{const {mountLocalResearch}=await import('./local-project-research.mjs');localResearch=mountLocalResearch(hydroVenues,state.catalog,()=>{loadVersion++;resolveVersion++;viewer?.setMode('2d');},updateExplorerSteps);}
   catch{toast('部分场馆暂未载入，请稍后重试。');}
  }
  const initial=resolveInitialRoute(params,state.catalog);
  if(!localResearch?.active&&await loadVenue(initial.venueId,undefined,params.get('event'))){
  if(params.get('event')){try{const result=await api(`/api/venues/${state.venueId}/events`);const requested=result.events.find(e=>e.id===params.get('event'))||result.researchConcerts?.find(e=>e.id===params.get('event'));if(requested){if(requested.ticketMapDraft)await selectTicketMapPreview(requested);else await selectEvent(requested);}else toast('原演出暂不可用，已显示场馆。');}catch{toast('原演出暂不可用，已显示场馆。');}}const layoutReady=state.event?true:!params.has('layout')||await applyRequestedLayout(initial.layout);applyRequestedSection(initial.section);viewer?.setMode(state.mode);
  if(initial.row&&initial.seat){$('row').value=initial.row;$('seat').value=initial.seat;if(layoutReady)await locate();else{state.result={status:'unknown-layout',section:$('section').value,row:initial.row,seat:initial.seat};render();}}
  }
  if(!localResearch?.active){if(params.get('mode')==='3d'){state.mode='3d';await ensureViewer();render();}else{state.mode='2d';render();}}
  if(!localResearch?.active&&viewer){
   const saved=readLocaleView(params.get('sourceView'),localeViewKey(new URLSearchParams(location.search)));
   if(saved){state.phoneFrame=saved.phone;state.roofVisible=saved.roof;viewer.restoreView(saved);renderViewControls();}
  }
}catch(error){setStatus('venue-status',copy('场馆目录暂时无法载入，请重试。'),'error');$('venue-retry').hidden=false;$('venue-name').textContent=copy('暂时无法载入场馆');toast('服务暂不可用，请检查连接并刷新。');}
