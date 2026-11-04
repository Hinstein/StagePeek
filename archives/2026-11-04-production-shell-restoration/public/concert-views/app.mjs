import {mountVenueLayers} from '../venue-view/venue-view-layers.mjs';
import {renderVenueLocation,venueEventCard,selectVenueEvent} from '../venue-view/venue-page-presenter.mjs';
import {mountVenueView,mountVenueTicketForm,VENUE_MAP_POLICY} from '../venue-view/venue-view-controls.mjs';
import {venuePalette} from '../venue-view/venue-palette.mjs';
import {unpackSourceSeats,sourceMapPolygons,sourceStandGeometry,sourceSectionGuides,sourceAisleSteps} from './seating.mjs';
import {audienceSightline,displaySectionLabel,sectionPoint,sectionRenderHalfAngle,stageRects,proposedStageRects} from './geometry.mjs';
import {venueReturn} from './auth-contract.mjs';
import {resolveInitialRoute} from './route.mjs';
import {groupVenuesByCountry} from './catalog.mjs';
import {createMapTransform,zoomMap,rotateMap,resetMap,panMap} from './explorer-state.mjs';
import {ticketSeatKey,ticketMapConflictIndex,ticketConflictColor} from './ticket-map-conflicts.mjs';
import {o2DisplayModel,o2RowLabelAnchors,o2EventDisplayDraft} from './o2-display.mjs';
import {sourceBowlDisplay,sourceRowLabelAnchors} from './source-bowl-display.mjs';
import {eventChairFootprint} from './source-event-display.mjs';
import {referenceRowLabel,sourceTicketInput} from './seat-numbering.mjs';
const $=id=>document.getElementById(id);
const state={me:null,catalog:[],venueId:'twcv-the-o2-arena-london',venue:null,sectionId:'122',result:null,layout:'end',mode:'2d',event:null,previewDraft:null,mapTransform:null,phoneFrame:false,roofVisible:false,zoom:1,billingPlans:[],billingPlan:'monthly',eventOverlayVisible:false,officialOverlayVisible:false};
let localResearch=null;
let viewer=null,viewerCameraMode='overview',viewerViewMode='overview',viewerDraft=null,viewerVenue=null,loadVersion=0,resolveVersion=0,loginToken=null,toastTimer=null;
const seatInputs=['section','row','seat'].map(id=>{const input=document.createElement('input');input.id=id;input.maxLength=40;return input;});
seatInputs[0].setAttribute('list','section-list');seatInputs[1].setAttribute('list','row-list');
const locateButton=element('button','定位 / 查看视角','primary');
mountVenueTicketForm($('ticket-form'),{section:seatInputs[0],row:seatInputs[1],seat:seatInputs[2],submit:locateButton,ids:{submit:'locate'},onSubmit:()=>locate({intentional:true})});
const viewShell=mountVenueView($('viewer'),{canvas:$('scene'),map:$('map'),selection:$('selection-row'),slots:[$('map-levels'),$('map-layers')],overlays:[$('view-error'),$('viewer-location')],legacyIds:true,onAction:handleViewAction});
const layerControls=mountVenueLayers({levels:$('map-levels'),layers:$('map-layers'),eventButton:$('map-event-toggle'),officialButton:$('map-official-toggle'),status:$('map-layer-status'),onChange(action,value){
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
const messages={SUBSCRIPTION_REQUIRED:'这个场馆需要 Pro 订阅，请先选择订阅周期。',LOGIN_REQUIRED:'请先登录。',INVALID_EMAIL:'请输入有效的邮箱地址。',INVALID_LINK:'登录链接已失效，或与申请时的浏览器不一致，请重新申请。',RATE_LIMITED:'操作有些频繁，请稍后再试。',GOOGLE_NOT_CONFIGURED:'Google 登录暂未开放。',EMAIL_NOT_CONFIGURED:'邮件登录暂未开放。',BILLING_NOT_CONFIGURED:'订阅暂未开放。',LINK_REQUIRED:'这个邮箱已有账号。请先用邮箱登录，再在我的账号中关联 Google。',SAVE_LIMIT:'已达到当前套餐的位置保存上限。',ALREADY_SUBSCRIBED:'你已订阅，可在账单中心管理。',NO_SUBSCRIPTION:'当前没有可管理的账单账号。',SEAT_UNVERIFIED:'该排座尚无核实记录，请先选择已有的采样位置。',GOOGLE_CANCELED:'已取消 Google 登录。'};
function message(error){return {INVALID_OTP:'验证码错误或已过期，请重新获取。',OTP_EXPIRED:'验证已过期，请重新发送验证码。',AUTH_UNAVAILABLE:'登录服务暂不可用，请稍后重试。',MEMBERSHIP_REQUIRED:'该账号暂时无法访问 StagePeek，请重新登录。',CHECKOUT_PENDING:'已有付款流程待确认，请稍后刷新或使用账单中心，避免重复付款。',BILLING_REVIEW_REQUIRED:'该账单账号需要核查，请先通过账单中心管理订阅。'}[error.code]||messages[error.code]||'暂时无法完成，请稍后重试。';}
async function api(path,{method='GET',body}={}){
  if(path.startsWith('/api/venues'))path=path.replace('/api/venues','/api/concert-views/venues');
  if(path.startsWith('/api/admin/ticket-map-previews'))path=path.replace('/api/admin/ticket-map-previews','/api/concert-views/ticket-map-previews');
  if(path==='/api/admin/global-sources')path='/api/concert-views/hydro';
  const response=await fetch(path,{method,credentials:'same-origin',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined});
  const data=await response.json();if(!response.ok)throw Object.assign(new Error(data.error?.message||'Request failed'),{code:data.error?.code,status:response.status});return data;
}
function toast(text){$('toast').textContent=text;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,5000);}
function open(id){location.assign(id==='login-dialog'?'/auth/login':id==='plan-dialog'?'/explore?panel=plans':'/account');}
function element(tag,text,className){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el;}
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
      const option=element('option','本场票图 · 估算配准');option.value='none';select.append(option);
    }else if(state.event.layout?.model){
      const option=element('option',state.event.layout.model.label||'本场演出 · 公开座位图舞台');option.value='event';select.append(option);
    }else{
      const option=element('option','本场舞台待核实');option.value='none';option.disabled=true;select.append(option);
    }
    select.value=state.layout;return;
  }
  for(const item of state.venue?.seatLayouts||(state.venue?.geometry?.referenceLayout?[{id:'end',label:state.venue.geometry.referenceLayout.label}]:[{id:'end',label:'端头舞台（通用）'},{id:'runway',label:'端头舞台 + 延伸台（通用）'},{id:'center',label:'中央舞台（通用）'}])){
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
    if(draft.version!==event.ticketMapDraft.version||draft.id!==draftId||draft.seatLayoutId!==event.ticketMapDraft.seatLayoutId){toast('本场布局版本已更新，请刷新演出列表。');return false;}
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
  const add=(tag,props,text,parent=layer)=>{const e=document.createElementNS(ns,tag);for(const [k,value]of Object.entries(props))e.setAttribute(k,value);if(text)e.textContent=text;parent.append(e);return e;};
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
  const options=v.sourceSeats?sourceLevels:tiers.map(tier=>({id:tier,label:v.geometry?.tiers?.[tier]?.name||`层级 ${tier+1}`}));
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
  for(const s of v.sections){if(v.sourceSeats?!s.sourceLevels?.includes(activeLevel):s.tier!==activeTier)continue;const label=displaySectionLabel(s),g=add('g',{'data-section':s.id,'data-selected':String(s.id===state.sectionId),tabindex:0,role:'button','aria-label':s.block?.polygon?s.levelName:'分区 '+label,...s.block?.color?{style:'--section-fill:'+s.block.color}:{}});
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
        if(shape.illustrative){add('title',{},'示意补全座位 · 无票号',path);path.onclick=e=>{e.stopPropagation();chooseSection(s.id,true,{previewOnly:true});};}
      }
    }
    else for(const p of shapes)add('polygon',{points:p.points.map(p=>p.join(',')).join(' '),fill,stroke:'#f6f7ef','stroke-width':mapScale*.0018},null,g);
    for(const outline of state.officialOverlayVisible?s.officialSectionPolygons||[]:[]){
      const path=add('path',{d:'M'+outline.points.map(point=>point.join(',')).join('L')+'Z',fill:'none',stroke:'#f4cf67','stroke-width':mapScale*.006,'stroke-dasharray':`${mapScale*.018} ${mapScale*.012}`,'pointer-events':'none','data-official-section':s.id});
      add('title',{},`${label} · 官方场馆票区轮廓 · 估算配准`,path);
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
    const drawn=add('path',{d:path,'fill-rule':'evenodd',fill,'fill-opacity':shape.kind==='stage'?.85:.35,stroke:fill,'stroke-width':mapScale*.002,'pointer-events':'none','data-draft-shape':shape.id});add('title',{},shape.label+' · 本场票图估算配准',drawn);
    const floorChairs=displayDraft?.floorChairs?.filter(chair=>chair.zoneId===shape.id)||[];
    if(floorChairs.length){
      const seats=add('path',{d:floorChairs.map(chair=>'M'+eventChairFootprint(chair).map(p=>p.join(',')).join('L')+'Z').join(''),fill:venuePalette.seat,'fill-opacity':.8,'pointer-events':'none','data-event-floor-chairs':shape.id,'data-count':floorChairs.length});
      add('title',{},shape.label+' · 内场示意座椅，无排号、座号',seats);
      for(const chair of floorChairs){
        const hit=add('circle',{cx:chair.p[0],cy:chair.p[2],r:.3,fill:'transparent',tabindex:0,role:'button','data-event-floor-view':shape.id,'aria-label':shape.label+' 内场示意视角，无票号'});
        hit.onclick=e=>{e.stopPropagation();chooseFloorView(chair);};hit.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();chooseFloorView(chair);}};
      }
    }
    const centre=shape.labelPosition||center(shape.polygon);add('text',{x:centre[0],y:centre[1],'text-anchor':'middle','dominant-baseline':'central',fill:'#fff','font-size':labelSize*.7,'pointer-events':'none','data-draft-label':shape.id},shape.label);
  }
  const conflicts=ticketMapConflictIndex(state.previewDraft);
  const section=selectedSection(),sampleLayer=add('g',{});
  for(const sample of section?.samples||[]){
    const polygon=largest((section.sourcePolygons||[]).filter(p=>p.viewId===sample.viewId));if(!polygon)continue;
    const p=center(polygon.points),matched=state.result?.status==='matched'&&state.result.viewId===sample.viewId;
    const c=add('circle',{cx:p[0],cy:p[1],r:matched?3.8:2.4,fill:matched?'#e98742':'#d6ba65','data-selected':String(matched),stroke:'#fff','stroke-width':.7,tabindex:0,role:'button','aria-label':sample.row+' 排 '+sample.seat+' 座 来源视点热区'},null,sampleLayer);
    add('title',{},'来源视点热区；不是逐座平面坐标',c);c.onclick=e=>{e.stopPropagation();chooseSample(sample);};c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();chooseSample(sample);}};
  }
  if(v.sourceSeats){
    const numbering=sourceDisplay||display&&v.researchRenderBatch.seatNumbering;
    const rowNumbers=add('g',{id:'map-row-numbers','pointer-events':'none','aria-hidden':'true',display:'none',style:'letter-spacing:0'});
    const seatNumbers=add('g',{id:'map-seat-numbers','pointer-events':'none','aria-hidden':'true',display:'none',style:'letter-spacing:0;font-variant-numeric:tabular-nums'});
    const numberedRows=new Map();
    for(const seat of displaySeats.filter(item=>item.section===state.sectionId&&item.level===activeLevel)){
      const matched=['matched','reference'].includes(state.result?.status)&&seat.row===state.result.row&&seat.seat===state.result.seat;
      const conflict=conflicts.has(ticketSeatKey(seat));
      const rowLabel=sourceDisplay?seat.row:referenceRowLabel(v,seat);
      const c=add('circle',{cx:seat.position[0],cy:seat.position[2],r:matched ? .7 : conflict ? .4 : .23,fill:conflict?ticketConflictColor:matched?'#f29a4e':'transparent',[seat.referenceSeat?'data-reference-seat-hit':'data-source-seat-hit']:'true','data-selected':String(matched),...(display||sourceDisplay)&&!matched?{'data-map-detail':'true'}:{},'data-layout-conflict':String(conflict),tabindex:0,role:'button','aria-label':`${seat.section} 区 ${rowLabel||seat.row} 排 ${seat.seat} 座${seat.referenceSeat?' · 参考模型估算位置':''}${conflict?' · 本场布局相交待核对':''}`});
      add('title',{},`${seat.section} 区 · ${rowLabel?rowLabel+' 排':'来源排 '+seat.row} · ${seat.seat} 座${rowLabel?(sourceDisplay?' · 来源编号':' · O2 端台参考编号'):''}`,c);
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
    // Show every affected seat on this source level, including unselected sections.
    for(const seat of displaySeats.filter(item=>item.section!==state.sectionId&&item.level===activeLevel&&conflicts.has(ticketSeatKey(item)))){
      const c=add('circle',{cx:seat.position[0],cy:seat.position[2],r:.4,fill:ticketConflictColor,'data-layout-conflict':'true',tabindex:0,role:'button','aria-label':`${seat.section} 区 ${seat.row} 排 ${seat.seat} 座 · 本场布局相交待核对`});
      c.onclick=e=>{e.stopPropagation();chooseSample(seat);};c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();chooseSample(seat);}};
    }
    for(const z of state.eventOverlayVisible&&state.layout===v.seatLayout.id?v.sourceZones||[]:[]){const polygon=add('polygon',{points:z.polygon.map(p=>p.join(',')).join(' '),fill:'#b7c39d','fill-opacity':.4,stroke:'#849376','stroke-width':.3,'pointer-events':'none','data-reference-zone':z.id});add('title',{},(z.label||z.id)+' · 来源常规布局，非本场票图',polygon);}
    for(const stage of stageShapes){add('rect',{x:stage.x-stage.w/2,y:stage.z-stage.d/2,width:stage.w,height:stage.d,fill:'#b18f4c',stroke:'#e0bd63','stroke-width':mapScale*.002,'data-stage':'true',...rotation(stage)});add('text',{x:stage.x,y:stage.z,'text-anchor':'middle','dominant-baseline':'central',fill:'#fff','font-size':labelSize},'示意舞台');}
    add('text',{x:(minX+maxX)/2,y:maxY+margin*.55,'text-anchor':'middle',fill:'#6f8173','font-size':labelSize*.8},display?'排座含示意补全 · 补全座位无票号 · 与三维一致':'来源逐座坐标 · 与三维同坐标 · 未独立实测校准');return;
  }
  const cx=(minX+maxX)/2,cy=(minY+maxY)/2,mapW=maxX-minX,mapH=maxY-minY;
  if(sameFrame){
    for(const r of stageShapes){add('rect',{x:r.x-r.w/2,y:r.z-r.d/2,width:r.w,height:r.d,fill:r.kind==='screen'?'#5e9b98':r.kind==='structure'?'#59616c':'#445f53',stroke:'#304d40','stroke-width':mapScale*.002,...rotation(r)});if(r.label)add('text',{x:r.x,y:r.z,'text-anchor':'middle',fill:'#fff','font-size':labelSize*.6},r.label);}
    const r=stageShapes[0];if(r)add('text',{x:r.x,y:r.z,'text-anchor':'middle','dominant-baseline':'central',fill:'#fff','font-size':labelSize},'示意舞台');
  }
  add('text',{x:cx,y:maxY+margin*.55,'text-anchor':'middle',fill:'#6f8173','font-size':labelSize*.75},sourceProjection?'来源分区投影 · 舞台平面坐标待核实':'与三维一致的示意布局 · 排座未实测');
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
  if(localResearch?.active)return;
  const v=state.venue;if(!v)return;clearFloorView();renderEventLayout();const s=selectedSection(),r=state.result,display=o2DisplayModel(v);
  $('venue-name').textContent=v.name;$('venue-city').textContent=v.city+(state.previewDraft?' · '+state.previewDraft.event.name+' · '+state.previewDraft.event.dates.join(' / '):v.geometry?.referenceLayout?' · '+v.geometry.referenceLayout.label:'');
  const catalogStatus=v.accuracy?.catalogStatus;
  const referenceCount=display?.referenceRecords.length||0,supplementCount=display?.supplements.length||0;
  $('accuracy-short').textContent=display?`含 ${referenceCount} 个参考排座 · 示意补全非实测 · 补全座位无票号`:v.geometry?.referenceLayout?'场次图示参考 · 非官方区号 / 排座':v.sourceSeats?'来源逐座坐标 · 未实测校准':catalogStatus==='source-geometry-and-sections'?'有来源分区 · 几何未校准':catalogStatus==='source-geometry-only'?'有几何参考 · 分区待核验':catalogStatus==='catalog-only'?'目录级示意 · 待补来源':'几何尚未校准';
  $('coverage-count').textContent=v.sourceSeats?`${v.sections.length} 个来源分区 · ${v.sourceSeats.length.toLocaleString()} 条逐座坐标${referenceCount?' · '+referenceCount+' 个参考排座':''}${supplementCount?' · '+supplementCount+' 个示意补全':''}`:`${v.sections.length} 个基础分区 · ${v.sections.reduce((n,s)=>n+s.samples.length,0)} 条排座采样`;
  const capabilities=$('capability-badges');capabilities.replaceChildren();for(const label of v.capabilities?.labels||[])capabilities.append(element('span',label,'capability-badge'));
  $('coverage-note').textContent=v.accuracy.coverage;$('source-link').href=v.source;$('source-link').textContent=v.sourceTitle+' ↗';
  const researchNotice=$('research-v0-notice');
  researchNotice.hidden=!v.researchRenderBatch;
  if(v.researchRenderBatch)researchNotice.replaceChildren(...v.researchRenderBatch.annotations.map(text=>element('span',text)));
  if(v.researchRenderBatch&&!state.event){
    $('layout-state').textContent='来源布局预览';
    $('event-layout-note').textContent='端台布局不售舞台后方座位；当前只表达分区、层级和相对距离，不代表某场演出的完整库存。';
    $('layout-source-note').textContent=display?`保留 ${v.sourceSeats.length.toLocaleString()} 条来源坐标；${referenceCount} 个前排编号来自公开参考表，位置按全景视点估算；${supplementCount} 个示意补全无票号。画面用于大致方位参考，不代表实测位置或完整库存。`:'座位坐标保留来源记录；看台面与座椅朝向为推导示意，未独立实测校准。';
  }
  let locationSection,locationRow,locationStatus,locationDescription,locationDistance;
  const matched=r?.status==='matched',located=['matched','estimated','reference','illustrative-view'].includes(r?.status)&&Array.isArray(r?.position),estimated=r?.status==='estimated',sourceCoordinate=matched&&r?.positionStatus==='source-coordinate';
  const floorView=r?.status==='illustrative-view',referenceRow=referenceRowLabel(v,r),rowLabel=referenceRow||r?.row;
  locationSection=s?.block?.polygon?displaySectionLabel(s)+' 档':located?(s?.sourceLabel||r.section):(s?displaySectionLabel(s):'—');locationRow=r?.row&&r?.seat?`${display&&!referenceRow?'来源排':'Row'} ${rowLabel} · Seat ${r.seat}`:'分区预览';
  $('row').placeholder=v.researchRenderBatch?.seatNumbering?'如 T 或来源序号 18':'';
  $('row-list').replaceChildren();for(const group of Object.values(v.researchRenderBatch?.seatNumbering?.rows[state.sectionId]||{})){const option=element('option');option.value=group.label;$('row-list').append(option);}
  for(const row of display?.referenceRows||[]){if(!display.referenceRecords.some(s=>s.section===state.sectionId&&s.row===row.row))continue;const option=element('option');option.value=row.row;$('row-list').append(option);}
  const unavailable=!!(r?.row||r?.seat)&&!located;
  locationStatus=matched?(sourceCoordinate?'来源座位已匹配 · 未实测校准':'票号采样已匹配 · 缺少座位坐标'):estimated?'模拟排座预览 · 票面位置未核实':r?.status==='unknown-layout'?'该布局尚无来源坐标':r?.status==='unknown-section'?'尚未找到这个分区':unavailable?'该排座缺少可用坐标 · 分区预览':'排座尚未输入 · 当前为分区预览';
  locationDescription=matched?(sourceCoordinate?'票号与当前来源布局的座位坐标一致。当前布局不代表特定演出，距离和人物大小仍需现场校准。':'找到票号来源记录，但来源未提供座位 XYZ；不会据此生成座位视角或距离。'):estimated?'按示意排座网格生成视角，编号不代表场馆真实排座；不能用于确认门票位置。':r?.status==='unknown-section'?'请按门票原样输入区号，或从地图选择已有分区。':unavailable?'没有可用的该排座坐标，未将票号映射到其他座位；可选择来源采样，或点击三维座位探索。':'可输入排座，或从三维座位点击一个估算位置。';
  const conflict=sourceCoordinate&&ticketMapConflictIndex(state.previewDraft).has(ticketSeatKey(r));
  if(conflict){locationStatus='来源座位已匹配 · 本场布局相交待核对';locationDescription='这个座位与当前估算的舞台或设备范围相交。本场配准或看台配置仍待核对；不表示该座位已封闭，当前演出视角请结合原票图判断。';}
  if(display&&sourceCoordinate&&!conflict){locationStatus=referenceRow?'参考区排座已核对 · 位置为示意':'来源票号已匹配 · 位置为示意';locationDescription=referenceRow?`区、${referenceRow} 排和 ${r.seat} 座与 O2 端台参考表对应（原来源排序号 ${r.row}）；画面位置为示意，不代表该场次可售。`:'区、排、座号来自保留记录；画面位置按平顺看台整理，供大致方位与舞台距离参考。';}
  if(r?.status==='reference'){locationStatus='参考排座已找到 · 位置为模型估算';locationDescription='编号来自 O2 端台参考表，位置由参考全景视点和排座关系估算；未实测，不代表某场演出的可售座位。';}
  if(floorView){locationSection=r.zoneLabel;locationRow='内场示意视点 · 无排座号';locationStatus='内场视角预览 · 非真实座位';locationDescription='点击示意椅查看大致舞台视角；不对应真实排座、门票或可售库存，不能保存为门票位置。';}
  const sightline=located&&!floorView&&!state.previewDraft?audienceSightline(v,state.layout==='none'&&display&&!state.event?'event':state.layout,selectedPosition()):null;
  locationDistance=state.previewDraft?'舞台位置估算 · 距离待校准':sightline?`相对距离约 ${Math.round(sightline.distance)} m（模型值，非实测）`:located?'未取得舞台坐标':'—';
  $('seat-view').disabled=!located;$('phone-toggle').disabled=!located;
  if(!located){state.phoneFrame=false;viewer?.togglePhoneFrame(false);}
  $('selection-tag').textContent=floorView?`${r.zoneLabel} · 内场示意视点 · 无票号`:`${s?.block?.polygon?s.levelName.replace('（方位示意，非票面区号）',''):((s?displaySectionLabel(s):'')+' 区')} · ${located?`${display&&!referenceRow?'来源排 ':''}${rowLabel} 排 / ${r.seat} 座 · ${display?'示意位置':estimated?'模拟位置':'来源坐标'}`:'分区预览'}`;
  $('viewer-location').textContent=floorView?'内场示意视点 · 仅供取景 · 非真实座位':located?`${display?'示意位置':estimated?'模拟位置':'来源位置'} · 相对距离 ${sightline?Math.round(sightline.distance)+' m（模型值）':'待补'} · 未实测校准`:'分区预览 · 选择座位后查看距离与视角';
  renderVenueLocation(document,{section:locationSection,row:locationRow,status:locationStatus,description:locationDescription,distance:locationDistance,matched,conflict});
  const samples=$('samples-list');samples.replaceChildren();
  for(const sample of floorView?[]:s?.samples||[]){const button=element('button',`${referenceRowLabel(v,sample)||sample.row}排 · ${sample.seat}座`);button.type='button';button.onclick=()=>chooseSample(sample);samples.append(button);}
  if(floorView)samples.append(element('p','内场示意椅仅提供视角，不提供真实票号。'));
  if(!floorView&&!s?.samples.length)samples.append(element('p','本区尚无可核对的排座采样。'));
  $('scene').hidden=state.mode!=='3d';$('map').toggleAttribute('hidden',state.mode!=='2d');renderViewControls();
  updateGestureHint();
  $('mode-2d').classList.toggle('active',state.mode==='2d');$('mode-3d').classList.toggle('active',state.mode==='3d');
  renderMap();viewer?.setData(v,state.sectionId,selectedPosition(),state.layout,located,Boolean(state.event),floorView);
  const activeOverlay=state.eventOverlayVisible?(o2EventDisplayDraft(v,state.previewDraft)||state.event?.researchOverlay&&{...state.event.researchOverlay,status:'shell-event-preview',venueId:v.id,shapes:state.event.researchOverlay.shapes||[]}):null;
  viewer?.toggleReferenceZones(state.eventOverlayVisible&&!activeOverlay);
  if(viewer&&(viewerDraft!==activeOverlay||viewerVenue!==v)){viewer.setResearchOverlay(activeOverlay);viewerDraft=activeOverlay;viewerVenue=v;}
  viewer?.toggleRoof(state.roofVisible);viewer?.togglePhoneFrame(state.phoneFrame);
}
async function refreshAccount(){state.me=await api('/api/me');$('plan-label').textContent='本地研究 · 演唱会视角';}
async function loadCatalog(){const {venues}=await api('/api/venues');state.catalog=venues;const select=$('venue');select.replaceChildren();for(const group of groupVenuesByCountry(venues)){const optgroup=document.createElement('optgroup');optgroup.label=`${group.country}（${group.venues.length}）`;for(const venue of group.venues){const option=element('option',venue.name+(venue.locked?' · Pro':''));option.value=venue.id;optgroup.append(option);}select.append(optgroup);}select.value=state.venueId;localResearch?.appendOptions(venues);}
async function loadVenue(id,layout,preserveEvent=null){
  const version=++loadVersion;resolveVersion++;$('locate').disabled=true;
  try{const {venue}=await api('/api/venues/'+id+(layout?'?layout='+encodeURIComponent(layout):''));if(version!==loadVersion)return;
    if(venue.seatTuples){venue.sourceSeats=unpackSourceSeats(venue.seatTuples);delete venue.seatTuples;}
    resolveVersion++;state.venueId=id;state.venue=venue;state.mapTier=null;state.mapLevel=null;state.mapTransform=null;state.event=null;state.previewDraft=null;state.eventOverlayVisible=false;state.officialOverlayVisible=false;state.layout=venue.seatLayout?.id||'end';state.phoneFrame=false;state.roofVisible=false;
    if(typeof renderStageOptions==='function')renderStageOptions();else{for(const item of venue.seatLayouts||[{id:'end',label:'端头舞台（通用）'},{id:'runway',label:'端头舞台 + 延伸台（通用）'},{id:'center',label:'中央舞台（通用）'}]){const option=element('option',item.label);option.value=item.id;$('stage-layout').append(option);}$('stage-layout').value=state.layout;}
    state.sectionId=venue.sections.some(x=>x.id==='122')?'122':venue.sections[0].id;state.result=null;
    $('section-list').replaceChildren();for(const section of venue.sections)for(const label of section.ticketLabels){const option=element('option');option.value=label;$('section-list').append(option);}
    $('venue').value=id;chooseSection(state.sectionId,false);render();syncLayoutRoute(state.layout);if(preserveEvent){const params=new URLSearchParams(location.search);params.set('event',preserveEvent);history.replaceState(null,'',`${location.pathname}?${params.toString()}${location.hash}`);}await loadEvents(id,version);return true;
  }catch(error){toast(message(error));if(error.code==='SUBSCRIPTION_REQUIRED')open('plan-dialog');
    if(!state.venue){$('venue-name').textContent=state.catalog.find(v=>v.id===id)?.name||'暂时无法载入场馆';$('location-status').textContent=error.code==='SUBSCRIPTION_REQUIRED'?'此场馆当前需要订阅，尚未加载座位。':'场馆暂未加载，请稍后重试。';}
    $('venue').value=state.venue?state.venueId:id;$('stage-layout').value=state.layout;return false;}
  finally{if(version===loadVersion)$('locate').disabled=false;}
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
    if(!state.venue.seatLayouts.some(item=>item.id===layout)){toast('该来源没有这个布局，未按其他布局定位。');return false;}
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
    else{viewer?.near();toast(found.status==='matched'?'票号存在，但缺少座位坐标；当前仅显示分区。':found.status==='ambiguous'?'来源含重复票号，未自动选择任何座位。':found.status==='unknown-section'?'尚未找到这个分区。':'这组排座尚无公开坐标，先显示分区预览。');}
  }catch(error){toast(message(error));}finally{if(version===resolveVersion)$('locate').disabled=false;}}
async function loadEvents(id,version){$('events-list').replaceChildren(element('p','正在读取官方演出信息…','muted'));
  try{const result=await api(`/api/venues/${id}/events`);if(version!==loadVersion)return;
    $('events-list').replaceChildren();$('event-count').textContent=`${result.events.length} 场演出${result.researchConcerts?.length?' · '+result.researchConcerts.length+' 个参考':''}`;
    for(const event of result.events){
      const mapState=event.layout?.model?'有公开座位图 + 舞台布局':event.layout?.mapVerification==='reference'?'有公开场次座位图参考':event.layout?.mapVerification==='unavailable'?'座位图待票务平台发布':'场次布局待核实';
      $('events-list').append(venueEventCard(document,{id:event.id,title:event.name,lines:[event.localDate+(event.endLocalDate!==event.localDate?' — '+event.endLocalDate:''),event.status==='canceled'?'已取消':event.status==='postponed'?'已延期':mapState],links:[{label:'官方详情 ↗',url:event.source},...(event.layout?.mapVerification==='reference'?[{label:'场次座位图参考 ↗',url:event.layout.source||event.layout.image}]:[])],onSelect:()=>selectEvent(event)}));
    }
    if(result.researchConcerts?.length){
      $('events-list').append(element('h3','演出参考与本地票图预览','research-event-heading'));
      for(const event of result.researchConcerts){
        const date=event.dates?.join(' / ')||event.localDate||event.date||'日期待核实';const detail=event.ticketMapDraft||event.researchOverlay?'本场票图可预览 · 舞台 / 内场叠加':event.overlayAvailable?'已有研究布局 · 本场对齐待核实':event.mapStatus==='event-map-retained'||event.mapSha256?'本场票图已留存 · 布局待补':'已发现演出名称 · 本场票图待补';
        const onSelect=async()=>{
          if(event.ticketMapDraft){await selectTicketMapPreview(event);return;}
          if(event.researchOverlay){selectEvent({...event,layout:{status:'research-overlay',source:event.source,mapVerification:'reference',model:null,eventVerification:'research-overlay'},researchOverlay:event.researchOverlay});return;}
          // A page-listed reference event belongs to the current source-seat
          // venue. Keep the fixed venue base in place and show the event's
          // unresolved state here; sending it to the western research route
          // loses the TWCV seat asset and made the button appear inert.
          selectEvent({...event,layout:{status:'unavailable',source:event.source,mapVerification:'unavailable',model:null,eventVerification:'page-listed-name',stageVerification:'unverified'}});
        };
        $('events-list').append(venueEventCard(document,{id:event.id,title:event.name,lines:[`${date} · ${detail}`],links:[{label:'演出来源 ↗',url:event.source}],research:true,onSelect}));
      }
    }
    if(!result.events.length)$('events-list').append(element('p',result.status==='unavailable'?'暂时无法取得官方活动列表。':'暂未取得可展示的近期演出。','muted'));
    $('events-status').textContent=(result.refreshedAt?(result.acquisition==='manual-official-page-verification'?'人工核验缓存 ':'最近成功更新 ')+new Date(result.refreshedAt).toLocaleString():'尚无成功更新记录')+(['partial','stale'].includes(result.status)?' · 部分来源暂不可用':'');renderEventLayout();
  }catch(error){if(version===loadVersion)$('events-list').replaceChildren(element('p','演出列表暂时不可用，请稍后重试。','muted'));}}
async function selectEvent(event){
  loadVersion++;resolveVersion++;state.previewDraft=null;
  const id=state.venueId,model=event.layout?.model;
  if(state.event||(model?.seatLayoutId&&model.seatLayoutId!==state.venue.seatLayout?.id)){
    const expected=loadVersion+1;
    await loadVenue(id,model?.seatLayoutId||state.venue.seatLayout?.id);
    if(loadVersion!==expected||state.venueId!==id)return;
  }
  if(model?.seatLayoutId&&state.venue.seatLayout?.id!==model.seatLayoutId)return;
  if(state.venue.geometry?.referenceLayout){toast('当前为指定历史场次参考，尚未取得这场演出的临时座席布局。');return;}
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
  const conflicts=ticketMapConflictIndex(state.previewDraft),panel=$('ticket-map-conflicts');
  panel.hidden=!conflicts.size;panel.replaceChildren();$('conflict-legend').hidden=!conflicts.size;
  if(conflicts.size){
    panel.append(element('strong',`${conflicts.size} 个座位与本场图形相交`),element('p','红色为本场估算布局待核对的位置，不代表实际封区。'));
    const sections=new Map();
    for(const seat of conflicts.values()){const group=sections.get(seat.section)||[];group.push(seat);sections.set(seat.section,group);}
    for(const [section,seats]of sections){const button=element('button',`${section} 区 · ${seats.length} 座待核对`);button.type='button';button.onclick=()=>chooseSample(seats[0]);panel.append(button);}
  }
  if(state.previewDraft){
    $('layout-state').textContent='本地票图预览';
    $('layout-source-note').textContent=`${state.previewDraft.event.name} · ${state.previewDraft.event.dates.join(' / ')} · 本地研究，未发布`;
    $('event-layout-note').textContent=`${state.eventOverlayVisible?'本场票图已显示':'本场票图已隐藏'}；舞台、内场和设备按来源图估算描摹，不计算精确距离。${state.previewDraft.registration.displayFrame==='o2-continuous-bowl'?'舞台人物用于比例与取景示意。':''}${state.previewDraft.zones.some(zone=>zone.kind==='standing')?' GENERAL ADMISSION 为内场站区，无逐座编号。':''}本场封区和完整可售座位尚未确认。`;
    const image=$('ticket-map-preview-image'),path='/api/concert-views/ticket-map-previews/'+encodeURIComponent(state.previewDraft.id)+'/image';
    if(image.getAttribute('src')!==path)image.src=path;image.hidden=false;return;
  }
  if(state.event?.researchOverlay){
    $('layout-state').textContent='本地研究预览';
    $('layout-source-note').textContent=`${state.event.name} · 票图描摹配准，未发布`;
    $('event-layout-note').textContent='本场官方票图已叠加到固定场馆底库；舞台、内场和设备是来源图的估算描摹，不计算精确距离，也不生成临时座号。';
    $('ticket-map-preview-image')?.setAttribute('hidden','');
    $('ticket-map-preview-image')?.removeAttribute('src');
    return;
  }
  const previewImage=$('ticket-map-preview-image');
  previewImage?.setAttribute('hidden','');
  previewImage?.removeAttribute('src');
  if(state.venue&&proposedStageRects(state.layout,state.venue).length&&!stageRects(state.layout,state.venue).length){$('layout-source-note').textContent='舞台超出当前模型范围，已暂停显示；原始来源坐标保持不变。';$('layout-state').textContent='舞台边界待核实';$('event-layout-note').textContent='当前模型范围可能仅来自座位分布，不能据此确认建筑边界；复核前不显示舞台或计算舞台距离。';return;}const reference=state.venue?.geometry?.referenceLayout;if(reference){$('layout-source-note').textContent=reference.label+' · '+reference.note;$('layout-state').textContent='历史场次参考';$('event-layout-note').textContent='当前显示 '+reference.label+'。临时坐席、舞台与控制台只对应这份布局，不适用于其他演出。';return;}const event=state.event;const map=event?.layout?.mapVerification;const referenced=map==='reference';const unavailable=map==='unavailable';const model=event?.layout?.model;const source=state.venue?.seatLayout?(state.venue.sourceStage?'座位与舞台来自同一来源布局；未独立实测，也不代表本场演出。':'来源仅包含固定看台，未取得场次舞台坐标。'):'当前场次没有事件级舞台坐标。';$('layout-source-note').textContent=model?`${model.label} · 来源：${model.provider||'公开票务座位图'} · ${model.confidence==='operator-traced'?'人工描摹，待现场独立校准':'来源校准'}`:source;$('layout-state').textContent=event?(model?'本场布局已接入':referenced?'有公开参考':unavailable?'座位图待发布':'布局待核实'):state.venue?.seatLayout?'来源布局预览':'通用预览';$('event-layout-note').textContent=event?(model?`${event.name}：已将公开座位图中可辨认的舞台位置接入 2D/3D、座位避让和距离计算。当前为人工描摹，演出制作方可能临时调整，仍需现场或官方图纸校准。`:referenced?`${event.name}：已找到公开座位图参考，但没有事件级舞台坐标；当前不渲染舞台。`:unavailable?`${event.name}：${event.layout?.eventVerification==='page-listed-name'?'参考页面仅列出演出名称，日期、票务事件与本场票图待核实':'演出已在官方场馆页面确认，但没有可用的事件级座位图'}；当前不渲染舞台。`:`${event.name}：尚未取得可校准的场次舞台图，当前不渲染舞台。`):'可选择近期演出，查看场次与布局来源状态。';}
$('venue').onchange=()=>{const venue=state.catalog.find(x=>x.id===$('venue').value);if(venue?.locked){$('venue').value=state.venueId;open('plan-dialog');}else loadVenue($('venue').value);};
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
  $('mode-3d').disabled=true;$('mode-3d').textContent='正在加载 3D…';
  viewerLoading=(async()=>{
    try{
      const {createViewer}=await import('./viewer.mjs');
      viewer=createViewer($('scene'),{onSection:chooseSection,onSample:chooseSample,onSeat:chooseEstimatedSeat,onFloorView:chooseFloorView,onResearchShape:shape=>{if(shape)toast(shape.label+(shape.kind==='stage'?' · 舞台与人物为示意':shape.kind==='equipment'?' · 设备区示意':' · 内场示意，无票号'));},onMode:(mode,detail)=>{viewerCameraMode=mode;if(detail?.viewMode)viewerViewMode=detail.viewMode;updateGestureHint();renderViewControls();if(detail?.zoom){state.zoom=detail.zoom;renderViewControls();}},onFailure:text=>{state.mode='2d';$('mode-3d').disabled=true;toast(text+' · 已切换到二维地图。');render();viewer?.setMode('2d');}});
      $('mode-3d').disabled=false;render();viewer.setMode(state.mode);viewer.setZoom(state.zoom);
    }catch{state.mode='2d';$('mode-3d').disabled=true;render();toast('此设备暂不能显示三维场景，已切换到二维地图。');}
    finally{$('mode-3d').textContent='3D 视角';}
  })();
  return viewerLoading;
}
try{
  const params=new URLSearchParams(location.search);loginToken=new URLSearchParams(location.hash.slice(1)).get('token');
  await Promise.all([refreshAccount(),loadCatalog()]);
  // Select the local source capability before resolving tickets against the
  // original catalog; a new venue must never query a fallback venue's seats.
  if(state.me.providers.localInbox){
   try{const [{mountLocalResearch},data]=await Promise.all([import('./local-project-research.mjs'),api('/api/admin/global-sources')]);localResearch=mountLocalResearch(data.venues,state.catalog,()=>{loadVersion++;resolveVersion++;viewer?.setMode('2d');});}
   catch{toast('本地来源场馆暂未载入，原有座位查询仍可使用。');}
  }
  const initial=resolveInitialRoute(params,state.catalog);
  if(!localResearch?.active&&await loadVenue(initial.venueId,undefined,params.get('event'))){
  if(params.get('event')){try{const result=await api(`/api/venues/${state.venueId}/events`);const requested=result.events.find(e=>e.id===params.get('event'))||result.researchConcerts?.find(e=>e.id===params.get('event'));if(requested){if(requested.ticketMapDraft)await selectTicketMapPreview(requested);else await selectEvent(requested);}else toast('原演出暂不可用，已显示场馆。');}catch{toast('原演出暂不可用，已显示场馆。');}}const layoutReady=state.event?true:!params.has('layout')||await applyRequestedLayout(initial.layout);applyRequestedSection(initial.section);viewer?.setMode(state.mode);
  if(initial.row&&initial.seat){$('row').value=initial.row;$('seat').value=initial.seat;if(layoutReady)await locate();else{state.result={status:'unknown-layout',section:$('section').value,row:initial.row,seat:initial.seat};render();}}
  }
  if(!localResearch?.active){if(params.get('mode')==='3d'){state.mode='3d';await ensureViewer();render();}else{state.mode='2d';render();}}
}catch(error){$('venue-name').textContent='暂时无法载入场馆';toast('服务暂不可用，请检查连接并刷新。');}
