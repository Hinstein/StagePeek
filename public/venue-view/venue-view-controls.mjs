import {VENUE_CAMERA_POLICY} from './venue-camera-policy.mjs';
import {venuePalette} from './venue-palette.mjs';

export const VENUE_MAP_POLICY=Object.freeze({minZoom:.75,maxZoom:8,zoomIn:1.25,zoomOut:.8,wheelSpeed:.002});

export const VENUE_VIEW_CONTROLS=Object.freeze({
 overview:{label:'场馆总览',o2Id:'overview'},
 audience:{label:'观众视角',o2Id:'seat-view'},
 near:{label:'靠近分区',o2Id:'near'},
 reset:{label:'重置',o2Id:'reset'},
 roof:{label:'屋顶示意',o2Id:'roof-toggle'},
 phone:{label:'手机取景',o2Id:'phone-toggle'},
 stage:{label:'查看舞台',o2Id:'stage-focus'}
});

// Venue adapters own geometry and lookup. This component owns the controls,
// their availability, phone framing, and fullscreen lifecycle for every venue.
export function mountVenueView(root,{canvas,map,selection,slots=[],overlays=[],legacyIds=false,translate=text=>text,onAction}){
 const doc=root.ownerDocument,controls={},bar=element('div',null,'venue-view-bar'),modes=element('div',null,'venue-view-modes'),tools=element('div',null,'venue-view-actions'),cameraTools=element('label',null,'venue-view-zooms'),mapTools=element('div',null,'venue-view-map-tools'),extra=element('div',null,'venue-view-slots'),stage=element('div',null,'venue-view-stage');
 root.classList.add('venue-view-shell');root.dataset.component='venue-view-v1';
 for(const [key,color]of Object.entries(venuePalette))root.style.setProperty('--venue-'+key,color);
 function element(tag,text,className){const node=doc.createElement(tag);if(text!=null)node.textContent=translate(text);if(className)node.className=className;return node;}
 function button(action,label,id,value){const node=element('button',label);node.type='button';node.dataset.viewAction=action;if(legacyIds&&id)node.id=id;node.onclick=()=>onAction(action,value);controls[action]=node;return node;}
 modes.append(button('2d','2D 座位图','mode-2d'),button('3d','3D 视角','mode-3d'));
 for(const [action,spec]of Object.entries(VENUE_VIEW_CONTROLS))tools.append(button(action,spec.label,spec.o2Id));
 tools.append(button('viewOut','−'),button('viewIn','＋'));controls.viewOut.setAttribute('aria-label',translate('缩小视图'));controls.viewIn.setAttribute('aria-label',translate('放大视图'));
 const zoomSlider=element('input'),zoomValue=element('output','1×'),zoomTitle=element('span','取景变焦');
 zoomTitle.className='venue-view-zoom-title';zoomSlider.type='range';zoomSlider.min=String(VENUE_CAMERA_POLICY.minZoom);zoomSlider.max=String(VENUE_CAMERA_POLICY.maxZoom);zoomSlider.step=String(VENUE_CAMERA_POLICY.zoomStep);zoomSlider.value='1';zoomSlider.setAttribute('aria-label',translate('取景变焦'));
 zoomSlider.oninput=()=>{const value=Number(zoomSlider.value);zoomValue.textContent=Number(value.toFixed(1))+'×';onAction('zoom',value);};
 cameraTools.append(zoomTitle,zoomValue,element('b','1×'),zoomSlider,element('b','10×'));
 const mapZoom=element('output','100%');mapZoom.setAttribute('aria-label',translate('地图缩放'));if(legacyIds)mapZoom.id='map-zoom-value';
 mapTools.append(mapZoom,button('mapOut','−','map-zoom-out'),button('mapIn','＋','map-zoom-in'),button('mapRotate','↻','map-rotate'),button('mapReset','重置','map-reset'));
 controls.mapOut.setAttribute('aria-label',translate('缩小地图'));controls.mapIn.setAttribute('aria-label',translate('放大地图'));controls.mapRotate.setAttribute('aria-label',translate('旋转地图'));
 const full=element('button','⛶');full.type='button';full.dataset.viewAction='fullscreen';if(legacyIds)full.id='fullscreen';full.className='venue-view-fullscreen';
 const reticle=element('div',null,'camera-reticle'),roofNote=element('span','屋顶结构示意 · 非实测建筑模型','roof-note'),hint=element('span',null,'venue-view-hint');
 reticle.setAttribute('aria-label',translate('手机取景框'));reticle.append(element('i'),element('span','4:3 手机取景 · 视角模拟','venue-view-frame-caption'),cameraTools);
 if(legacyIds){reticle.id='camera-reticle';roofNote.id='roof-note';hint.id='gesture-hint';tools.id='view-tools';cameraTools.id='camera-tools';mapTools.id='map-tools';}
 extra.append(...slots);bar.append(modes,tools,mapTools,full,extra);stage.append(canvas,map,reticle,roofNote,...overlays);selection.classList.add('venue-view-selection');root.append(bar,selection,stage,hint);
 function pressed(node,value){node.classList.toggle('active',value);node.setAttribute('aria-pressed',String(value));}
 function fullscreenChanged(){const expanded=doc.fullscreenElement===root||root.classList.contains('is-expanded');pressed(full,expanded);full.setAttribute('aria-label',translate(expanded?'退出全屏':'全屏查看'));}
 function expand(value){root.classList.toggle('is-expanded',value);doc.body.classList.toggle('explorer-expanded',value);fullscreenChanged();}
 async function fullscreen(){
  if(doc.fullscreenElement===root){await doc.exitFullscreen();return;}
  if(root.classList.contains('is-expanded')){expand(false);return;}
  // CSS fullscreen keeps the same controls on browsers without the native API.
  if(!root.requestFullscreen){expand(true);return;}
  await root.requestFullscreen().catch(()=>expand(true));fullscreenChanged();
 }
 function escape(event){if(event.key==='Escape'&&root.classList.contains('is-expanded'))expand(false);}
 full.onclick=fullscreen;doc.addEventListener('fullscreenchange',fullscreenChanged);doc.addEventListener('keydown',escape);fullscreenChanged();
 function update({mode='3d',cameraMode='overview',phone=false,roof=false,canAudience=false,canStage=false,zoom=1,mapZoom:mapScale=1}={}){
  const three=mode==='3d',seated=cameraMode==='audience'||cameraMode==='seat';
  canvas.hidden=!three;map.toggleAttribute('hidden',three);map.style.display=three?'none':'block';tools.hidden=!three;mapTools.hidden=three;cameraTools.hidden=!three||!seated||!phone;
  root.dataset.mode=mode;root.dataset.cameraMode=seated?'audience':cameraMode;root.classList.toggle('phone-framing',three&&seated&&phone);
  controls.audience.disabled=!canAudience;controls.phone.disabled=!canAudience;controls.stage.disabled=!canStage;
  pressed(controls['2d'],!three);pressed(controls['3d'],three);
  for(const action of ['overview','near','audience','stage'])pressed(controls[action],action==='audience'?seated:cameraMode===action);
  pressed(controls.phone,phone);pressed(controls.roof,roof);zoomSlider.value=String(Math.max(VENUE_CAMERA_POLICY.minZoom,Math.min(VENUE_CAMERA_POLICY.maxZoom,zoom)));zoomValue.textContent=Number(zoom.toFixed(1))+'×';zoomSlider.setAttribute('aria-valuetext',zoomValue.textContent);
  mapZoom.textContent=Math.round(mapScale*100)+'%';reticle.hidden=!three||!seated||!phone;roofNote.hidden=!three||!roof;
  hint.textContent=translate(!three?'拖动平移 · 滚轮 / 双指缩放 · 点击分区或座位':seated?'固定座位视角 · 拖动只转头 · 滚轮 / 双指变焦':'拖动旋转 · 滚轮 / 双指缩放 · 点击座位入座');
 }
 update();
 return {controls,stage,selection,update,dispose(){doc.removeEventListener('fullscreenchange',fullscreenChanged);doc.removeEventListener('keydown',escape);if(root.classList.contains('is-expanded'))expand(false);if(doc.fullscreenElement===root)void doc.exitFullscreen();}};
}

export function mountVenueTicketForm(form,{section,row,seat,before=[],after=[],fieldLabels=[],translate=text=>text,submit,ids={},onSubmit}){
 const doc=form.ownerDocument;form.classList.add('venue-ticket-form');form.dataset.component='venue-ticket-v1';
 for(const [index,[name,control]]of [['分区',section],['排号',row],['座号',seat]].entries()){
  const label=fieldLabels[index]||doc.createElement('label');if(!fieldLabels[index]){label.textContent=translate(name);label.append(control);}form.append(label);
 }
 form.prepend(...before);submit.type='submit';if(ids.submit)submit.id=ids.submit;form.append(submit,...after);
 row.autocomplete=seat.autocomplete='off';seat.inputMode='numeric';
 form.onsubmit=event=>{event.preventDefault();row.value=row.value.trim().toUpperCase();seat.value=seat.value.trim();onSubmit();};
 return {dispose(){form.onsubmit=null;}};
}
