import {venueName,venueRegion,countryName} from './translations/venue-labels.mjs';
import {unpackSourceSeats} from './seating.mjs';
import {audienceSightline,displaySectionLabel,sectionPoint,sectionRenderHalfAngle,stageRects,proposedStageRects} from './geometry.mjs';
import {venueReturn} from './auth-contract.mjs';
import {resolveInitialRoute} from './route.mjs';
import {groupVenuesByCountry} from './catalog.mjs';
import {groupEventsByDate} from './event-groups.mjs';
import {createMapTransform,zoomMap,rotateMap,resetMap,panMap} from './explorer-state.mjs';
import {copy,getLocale,t,setLocaleUrl,localizedPath,parseLocalizedPath,SUPPORTED_LOCALES,translations} from './locales.mjs';
import './language-switcher.mjs';
const $=id=>document.getElementById(id);
const locale=getLocale(),route=path=>localizedPath(locale,path),text=(key,values)=>t(key,values);
const state={me:null,catalog:[],venueId:'tottenham',venue:null,sectionId:'122',result:null,layout:'end',mode:'2d',event:null,mapTransform:null,phoneFrame:false,roofVisible:false,zoom:1};
let viewer=null,viewerCameraMode='overview',loadVersion=0,resolveVersion=0,loginToken=null,toastTimer=null;
const messages={SUBSCRIPTION_REQUIRED:copy("这个场馆需要月订阅，请先升级 Pro。"),LOGIN_REQUIRED:copy("请先登录。"),INVALID_EMAIL:copy("请输入有效的邮箱地址。"),INVALID_LINK:copy("登录链接已失效，或与申请时的浏览器不一致，请重新申请。"),RATE_LIMITED:copy("操作有些频繁，请稍后再试。"),GOOGLE_NOT_CONFIGURED:copy("Google 登录暂未开放。"),EMAIL_NOT_CONFIGURED:copy("邮件登录暂未开放。"),BILLING_NOT_CONFIGURED:copy("月订阅暂未开放。"),LINK_REQUIRED:copy("这个邮箱已有账号。请先用邮箱登录，再在我的账号中关联 Google。"),SAVE_LIMIT:copy("已达到当前套餐的位置保存上限。"),ALREADY_SUBSCRIBED:copy("你已订阅，可在账单中心管理。"),NO_SUBSCRIPTION:copy("当前没有可管理的账单账号。"),SEAT_UNVERIFIED:copy("该排座尚无核实记录，请先选择已有的采样位置。"),GOOGLE_CANCELED:copy("已取消 Google 登录。")};
function message(error){return {INVALID_OTP:copy("验证码错误或已过期，请重新获取。"),OTP_EXPIRED:copy("验证已过期，请重新发送验证码。"),AUTH_UNAVAILABLE:copy("登录服务暂不可用，请稍后重试。"),MEMBERSHIP_REQUIRED:copy("该账号暂时无法访问 StagePeek，请重新登录。"),CHECKOUT_PENDING:copy("已有付款流程待确认，请稍后刷新或使用账单中心，避免重复付款。"),BILLING_REVIEW_REQUIRED:copy("该账单账号需要核查，请先通过账单中心管理订阅。")}[error.code]||messages[error.code]||copy("暂时无法完成，请稍后重试。");}
async function api(path,{method='GET',body}={}){
  const response=await fetch(path,{method,credentials:'same-origin',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined});
  const data=await response.json();if(!response.ok)throw Object.assign(new Error(data.error?.message||'Request failed'),{code:data.error?.code,status:response.status});return data;
}
function toast(text){$('toast').textContent=text;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,5000);}
function open(id){if(id==='login-dialog')window.stagepeekTrack?.('login_started');if(id==='plan-dialog')window.stagepeekTrack?.('plan_open');if(state.me?.providers.auth==='supabase'&&(['login-dialog','account-dialog'].includes(id)||state.me?.consent?.required)){const next=venueReturn(state,{section:$('section').value,row:$('row').value,seat:$('seat').value});location.assign(route(id==='account-dialog'||state.me?.consent?.required?'/account':'/auth/login')+'?next='+encodeURIComponent(localizedPath(locale,next)));return;}for(const d of document.querySelectorAll('dialog[open]'))d.close();$(id).showModal();}
function element(tag,text,className){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el;}
function localizeShell(){
 document.documentElement.lang=locale;
 const menu=$('locale-switcher').querySelector('[role="menu"]');
 const queryZoom=Number(new URLSearchParams(location.search).get('zoom'));
 menu.replaceChildren(...SUPPORTED_LOCALES.map(item=>{const a=document.createElement('a');a.href=localizedPath(item,parseLocalizedPath(location.pathname).path)+location.search;a.textContent=translations(locale)[`language.${item}`];a.dataset.locale=item;a.setAttribute('role','menuitem');a.onclick=event=>{event.preventDefault();setLocaleUrl(item,{venue:state.venueId,event:state.event?.id,layout:state.layout,section:$('section').value,row:$('row').value,seat:$('seat').value,mode:state.mode,zoom:queryZoom||state.zoom});};if(item===locale)a.setAttribute('aria-current','true');return a;}));
 const button=$('locale-switcher').querySelector('button');button.setAttribute('aria-label',text('language.label'));button.querySelector('.language-current').textContent=text('language.current');
 const loginDescription=document.querySelector('#login-dialog .muted');if(loginDescription)loginDescription.textContent=copy("用邮箱验证码登录，首次验证会自动完成账号设置。");
 document.querySelector('header nav>a').href=route('/venues/');
 document.querySelector('header nav>a').textContent=text('nav.venues');
 document.querySelector('.brand').href=route('/');
}
function link(text,url){const a=element('a',text);if(/^https:\/\//.test(url)){a.href=url;a.target='_blank';a.rel='noopener noreferrer';}return a;}
function selectedSection(){return state.venue?.sections.find(s=>s.id===state.sectionId)||state.venue?.sections[0];}
function selectedPosition(){return Array.isArray(state.result?.position)?state.result.position:selectedSection()?.center;}
function renderStageOptions(){
  const select=$('stage-layout');select.replaceChildren();
  if(state.event){
    if(state.event.layout?.model){
      const option=element('option',state.event.layout.model.label||copy("本场演出 · 公开座位图舞台"));option.value='event';select.append(option);
    }else{
      const option=element('option',copy("本场舞台待核实"));option.value='none';option.disabled=true;select.append(option);
    }
    select.value=state.layout;return;
  }
  for(const item of state.venue?.seatLayouts||(state.venue?.geometry?.referenceLayout?[{id:'end',label:state.venue.geometry.referenceLayout.label}]:[{id:'end',label:copy("端头舞台（通用）")},{id:'runway',label:copy("端头舞台 + 延伸台（通用）")},{id:'center',label:copy("中央舞台（通用）")}])){
    const option=element('option',copy(item.label));option.value=item.id;select.append(option);
  }
  select.value=state.layout;
}
function updateGestureHint(){
  $('gesture-hint').textContent=state.mode==='2d'
    ?copy("拖动平移 · 双指或滚轮缩放 · 点击分区 / 座位")
    :viewerCameraMode==='seat'?copy("拖动环顾 · 双指或滚轮变焦 · 1×–8×放大"):copy("拖动旋转 · 双指缩放 / 平移 · 点击座位入座");
}
function renderMap(){
  const v=state.venue;if(!v)return;const svg=$('map'),ns='http://www.w3.org/2000/svg';svg.replaceChildren();
  const layer=document.createElementNS(ns,'g');layer.id='map-content';svg.append(layer);
  const add=(tag,props,text,parent=layer)=>{const e=document.createElementNS(ns,tag);for(const [k,value]of Object.entries(props))e.setAttribute(k,value);if(text)e.textContent=text;parent.append(e);return e;};
  // These are the source's screen projections, not the estimated metre frame used by 3D.
  // Draw each original hit area separately to retain aisles, cutouts and irregular edges.
  const sourceProjection=v.sections.some(s=>s.polygonStatus==='source'),sameFrame=!sourceProjection;
  const renderedPolygons=new Map(v.sections.map(s=>{
    if(!sameFrame||v.sourceSeats)return [s.id,s.sourcePolygons||[]];
    if(s.block?.polygon)return [s.id,[{viewId:`reference:${s.id}`,points:s.block.polygon}]];
    const half=sectionRenderHalfAngle(v,s),boundary=[];
    for(let i=0;i<=12;i++)boundary.push(sectionPoint(v,s,0,-1+i/6,half));
    for(let i=12;i>=0;i--)boundary.push(sectionPoint(v,s,1,-1+i/6,half));
    return [s.id,[{viewId:`estimated:${s.id}`,points:boundary.map(p=>[p[0],p[2]])}]];
  }));
  const polygons=[...renderedPolygons.values()].flat(),points=polygons.flatMap(p=>p.points);
  const stageShapes=sameFrame&&state.layout!=='none'?stageRects(state.layout,v):[];
  const rotation=r=>({transform:`rotate(${-(r.angle||0)*180/Math.PI} ${r.x} ${r.z})`});
  for(const r of stageShapes)points.push([r.x-r.w/2,r.z-r.d/2],[r.x+r.w/2,r.z+r.d/2]);
  if(!points.length){add('text',{x:0,y:0},copy("暂未取得该馆二维分区轮廓"));svg.setAttribute('viewBox','-100 -30 200 60');return;}
  const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),minX=Math.min(...xs),minY=Math.min(...ys),maxX=Math.max(...xs),maxY=Math.max(...ys);
  const mapScale=Math.max(maxX-minX,maxY-minY),labelSize=Math.max(.6,mapScale*.017),margin=mapScale*.12;
  const baseViewBox=[minX-margin,minY-margin,maxX-minX+2*margin,maxY-minY+2*margin];
  if(!state.mapTransform||state.mapTransform.base.some((value,index)=>Math.abs(value-baseViewBox[index])>.001))state.mapTransform=createMapTransform(baseViewBox);
  updateMapViewport();
  const center=points=>[points.reduce((n,p)=>n+p[0],0)/points.length,points.reduce((n,p)=>n+p[1],0)/points.length];
  const area=points=>Math.abs(points.reduce((n,p,i)=>{const q=points[(i+1)%points.length];return n+p[0]*q[1]-q[0]*p[1];},0))/2;
  const largest=polygons=>[...polygons].sort((a,b)=>area(b.points)-area(a.points))[0];
  const tiers=[...new Set(v.sections.map(s=>s.tier))].sort((a,b)=>a-b),activeTier=Number.isInteger(state.mapTier)&&tiers.includes(state.mapTier)?state.mapTier:selectedSection()?.tier??tiers[0];
  const levels=$('map-levels');levels.replaceChildren();levels.hidden=state.mode!=='2d'||tiers.length<2;
  for(const tier of tiers){const button=element('button',(v.geometry?.tiers?.[tier]?.name&&!/[\p{Script=Han}]/u.test(copy(v.geometry.tiers[tier].name))?copy(v.geometry.tiers[tier].name):copy("层级 {0}", [tier+1])));button.type='button';button.classList.toggle('active',tier===activeTier);button.setAttribute('aria-pressed',String(tier===activeTier));button.onclick=()=>{state.mapTier=tier;renderMap();};levels.append(button);}
  const labels=[];
  for(const s of v.sections){if(s.tier!==activeTier)continue;const label=displaySectionLabel(s),g=add('g',{'data-section':s.id,'data-selected':String(s.id===state.sectionId),tabindex:0,role:'button','aria-label':s.block?.polygon?s.levelName:copy("分区 ")+label,...s.block?.color?{style:'--section-fill:'+s.block.color}:{}});
    for(const p of renderedPolygons.get(s.id)||[])add('polygon',{points:p.points.map(p=>p.join(',')).join(' '),fill:s.id===state.sectionId?'#dc7a43':s.block?.color||['#628867','#4a7452','#3a6449','#31553c','#264935'][s.tier%5],stroke:'#f6f7ef','stroke-width':mapScale*.0018},null,g);
    if(s.block?.polygon)add('title',{},s.levelName,g);
    const largestPolygon=largest(renderedPolygons.get(s.id)||[]);if(largestPolygon)labels.push({id:label,p:center(largestPolygon.points)});
    g.onclick=()=>chooseSection(s.id);g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();chooseSection(s.id);}};
  }
  // Labels above all shapes remain readable without masking polygon click targets.
  const textLayer=add('g',{'pointer-events':'none','aria-hidden':'true'});
  for(const label of labels)add('text',{x:label.p[0],y:label.p[1],'text-anchor':'middle','dominant-baseline':'central',fill:'white','font-size':labelSize,'paint-order':'stroke',stroke:'#31553c','stroke-width':labelSize*.13},label.id,textLayer);
  const section=selectedSection(),sampleLayer=add('g',{});
  for(const sample of section?.samples||[]){
    const polygon=largest((section.sourcePolygons||[]).filter(p=>p.viewId===sample.viewId));if(!polygon)continue;
    const p=center(polygon.points),matched=state.result?.status==='matched'&&state.result.viewId===sample.viewId;
    const c=add('circle',{cx:p[0],cy:p[1],r:matched?3.8:2.4,fill:matched?'#e98742':'#d6ba65','data-selected':String(matched),stroke:'#fff','stroke-width':.7,tabindex:0,role:'button','aria-label':sample.row+copy(" 排 ")+sample.seat+copy(" 座 来源视点热区")},null,sampleLayer);
    add('title',{},copy("来源视点热区；不是逐座平面坐标"),c);c.onclick=e=>{e.stopPropagation();chooseSample(sample);};c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();chooseSample(sample);}};
  }
  if(v.sourceSeats){
    for(const seat of v.sourceSeats.filter(item=>item.section===state.sectionId&&selectedSection()?.tier===activeTier)){
      const matched=state.result?.status==='matched'&&seat.row===state.result.row&&seat.seat===state.result.seat;
      const c=add('circle',{cx:seat.position[0],cy:seat.position[2],r:matched ? .7 : .23,fill:matched?'#f29a4e':'#e3eddb','data-selected':String(matched),tabindex:0,role:'button','aria-label':copy("{0} 区 {1} 排 {2} 座", [seat.section, seat.row, seat.seat])});
      c.onclick=e=>{e.stopPropagation();chooseSample(seat);};c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();chooseSample(seat);}};
    }
    for(const z of v.sourceZones||[])add('polygon',{points:z.polygon.map(p=>p.join(',')).join(' '),fill:'#b7c39d',stroke:'#849376','stroke-width':.3});
    for(const stage of stageShapes)add('rect',{x:stage.x-stage.w/2,y:stage.z-stage.d/2,width:stage.w,height:stage.d,fill:'#465640',...rotation(stage)});
    add('text',{x:(minX+maxX)/2,y:maxY+margin*.55,'text-anchor':'middle',fill:'#6f8173','font-size':labelSize*.8},copy("来源逐座坐标 · 与三维同坐标 · 未独立实测校准"));return;
  }
  const cx=(minX+maxX)/2,cy=(minY+maxY)/2,mapW=maxX-minX,mapH=maxY-minY;
  if(sameFrame){
    for(const r of stageShapes){add('rect',{x:r.x-r.w/2,y:r.z-r.d/2,width:r.w,height:r.d,fill:r.kind==='screen'?'#5e9b98':r.kind==='structure'?'#59616c':'#445f53',stroke:'#304d40','stroke-width':mapScale*.002,...rotation(r)});if(r.label)add('text',{x:r.x,y:r.z,'text-anchor':'middle',fill:'#fff','font-size':labelSize*.6},r.label);}
    const r=stageShapes[0];if(r)add('text',{x:r.x,y:r.z,'text-anchor':'middle','dominant-baseline':'central',fill:'#fff','font-size':labelSize},copy("示意舞台"));
  }
  add('text',{x:cx,y:maxY+margin*.55,'text-anchor':'middle',fill:'#6f8173','font-size':labelSize*.75},sourceProjection?copy("来源分区投影 · 舞台平面坐标待核实"):copy("与三维一致的示意布局 · 排座未实测"));

}
function updateMapViewport(){
  const t=state.mapTransform;if(!t)return;
  $('map').setAttribute('viewBox',t.viewBox.join(' '));
  const [x,y,w,h]=t.base;$('map-content')?.setAttribute('transform',`rotate(${t.rotation} ${x+w/2} ${y+h/2})`);
  $('map-zoom-value').textContent=`${Math.round(t.zoom*100)}%`;
  $('map-zoom-out').disabled=t.zoom<=.75;$('map-zoom-in').disabled=t.zoom>=8;
}
function renderViewControls(){
  const is3d=state.mode==='3d',isSeat=viewerCameraMode==='seat';
  $('view-tools').hidden=!is3d;$('map-tools').hidden=is3d;
  $('camera-tools').hidden=!is3d||!isSeat;
  $('camera-reticle').hidden=!is3d||!isSeat||!state.phoneFrame;
  $('viewer').classList.toggle('phone-framing',is3d&&isSeat&&state.phoneFrame);
  for(const [id,value]of [['roof-toggle',state.roofVisible],['phone-toggle',state.phoneFrame]]){$(id).classList.toggle('active',value);$(id).setAttribute('aria-pressed',String(value));}
  $('roof-note').hidden=!is3d||!state.roofVisible;
  $('mode-2d').setAttribute('aria-pressed',String(!is3d));$('mode-3d').setAttribute('aria-pressed',String(is3d));
  $('overview').classList.toggle('active',!isSeat);$('seat-view').classList.toggle('active',isSeat);
}

function render(){
  const v=state.venue;if(!v)return;renderEventLayout();const s=selectedSection(),r=state.result;
  $('venue-name').textContent=venueName(v,locale);$('venue-city').textContent=venueRegion(v,locale)+(v.geometry?.referenceLayout?' · '+copy("历史场次参考"):'');
  const catalogStatus=v.accuracy?.catalogStatus;
  $('accuracy-short').textContent=v.geometry?.referenceLayout?copy("场次图示参考 · 非官方区号 / 排座"):v.sourceSeats?copy("来源逐座坐标 · 未实测校准"):catalogStatus==='source-geometry-and-sections'?copy("有来源分区 · 几何未校准"):catalogStatus==='source-geometry-only'?copy("有几何参考 · 分区待核验"):catalogStatus==='catalog-only'?copy("目录级示意 · 待补来源"):copy("几何尚未校准");
  $('coverage-count').textContent=v.sourceSeats?copy("{0} 个来源分区 · {1} 条逐座坐标", [v.sections.length, v.sourceSeats.length.toLocaleString(locale)]):copy("{0} 个基础分区 · {1} 条排座采样", [v.sections.length, v.sections.reduce((n,s)=>n+s.samples.length,0)]);
  $('coverage-note').textContent=locale==='zh-CN'?v.accuracy.coverage:v.sourceSeats?copy("{0} 个来源分区 · {1} 条逐座坐标。当前版本未独立实测校准，不代表当前演出的完整库存。",[v.sections.length.toLocaleString(locale),v.sourceSeats.length.toLocaleString(locale)]):copy("当前仅提供参考模型与已有采样，真实分区、排座和演出布局仍需核实。");$('source-link').href=v.source;$('source-link').textContent=copy("公开来源与布局说明 ↗");
  const matched=r?.status==='matched',located=['matched','estimated'].includes(r?.status)&&Array.isArray(r?.position),estimated=r?.status==='estimated',sourceCoordinate=matched&&r?.positionStatus==='source-coordinate';
  $('location-section').textContent=s?.block?.polygon?displaySectionLabel(s)+copy(" 档"):located?r.section:(s?displaySectionLabel(s):'—');$('location-row').textContent=r?.row&&r?.seat?copy("{0}排 · {1}座",[r.row,r.seat]):copy("分区预览");
  $('location-status').classList.toggle('matched',matched);
  const unavailable=!!(r?.row||r?.seat)&&!located;
  $('location-status').textContent=matched?(sourceCoordinate?copy("来源座位已匹配 · 未实测校准"):copy("票号采样已匹配 · 缺少座位坐标")):estimated?copy("模拟排座预览 · 票面位置未核实"):r?.status==='unknown-layout'?copy("该布局尚无来源坐标"):r?.status==='unknown-section'?copy("尚未找到这个分区"):unavailable?copy("该排座缺少可用坐标 · 分区预览"):copy("排座尚未输入 · 当前为分区预览");
  $('location-description').textContent=matched?(sourceCoordinate?copy("票号与当前来源布局的座位坐标一致。当前布局不代表特定演出，距离和人物大小仍需现场校准。"):copy("找到票号来源记录，但来源未提供座位 XYZ；不会据此生成座位视角或距离。")):estimated?copy("按示意排座网格生成视角，编号不代表场馆真实排座；不能用于确认门票位置。"):r?.status==='unknown-section'?copy("请按门票原样输入区号，或从地图选择已有分区。"):unavailable?copy("没有可用的该排座坐标，未将票号映射到其他座位；可选择来源采样，或点击三维座位探索。"):copy("可输入排座，或从三维座位点击一个估算位置。");
  const sightline=located?audienceSightline(v,state.layout,r.position):null;
  $('distance').textContent=sightline?copy("模型约 {0} m · 非实测", [Math.round(sightline.distance)]):located?copy("未取得舞台坐标"):'—';
  $('save-position').disabled=!matched;$('seat-view').disabled=!located;$('phone-toggle').disabled=!located;
  if(!located){state.phoneFrame=false;viewer?.togglePhoneFrame(false);}
  $('selection-tag').textContent=`${s?.block?.polygon?s.levelName.replace('（方位示意，非票面区号）',''):copy("分区 {0}",[s?displaySectionLabel(s):''])} · ${located?copy("{0} 排 / {1} 座 · {2}", [r.row, r.seat, estimated?copy("模拟位置"):copy("来源坐标")]):copy("分区预览")}`;
  $('viewer-location').textContent=located?copy("{0} · 模型约 {1} · 未实测校准", [estimated?copy("模拟位置"):copy("来源位置"), sightline?Math.round(sightline.distance)+' m':copy("距离待补")]):copy("分区预览 · 选择座位后查看距离与视角");
  const samples=$('samples-list');samples.replaceChildren();
  for(const sample of s?.samples||[]){const button=element('button',copy("{0}排 · {1}座", [sample.row, sample.seat]));button.type='button';button.onclick=()=>chooseSample(sample);samples.append(button);}
  if(!s?.samples.length)samples.append(element('p',copy("本区尚无可核对的排座采样。")));
  $('scene').hidden=state.mode!=='3d';$('map').toggleAttribute('hidden',state.mode!=='2d');renderViewControls();
  updateGestureHint();
  $('mode-2d').classList.toggle('active',state.mode==='2d');$('mode-3d').classList.toggle('active',state.mode==='3d');
  renderMap();viewer?.setData(v,state.sectionId,selectedPosition(),state.layout,located);viewer?.toggleRoof(state.roofVisible);viewer?.togglePhoneFrame(state.phoneFrame);
}
async function refreshAccount(){
  state.me=await api('/api/me');const {user,access,providers}=state.me;
  window.stagepeekSignedIn=!!user;
  $('account-button').textContent=user?copy("我的账号"):copy("登录");$('plan-label').textContent={guest:copy("免费体验"),free:copy("免费账号"),pro:copy("Pro 月订阅")}[access.plan];
  $('account-email').textContent=user?.email||'';
  $('account-plan').textContent=access.plan==='pro'?(state.me.subscription?.cancel_at_period_end?copy("已取消续订，当前周期结束前仍可使用。"):copy("Pro 月订阅生效中。")):copy("免费账号 · 可保存 8 个位置");
  const freeCount=access.freeVenueIds?.length||10;$('free-venue-summary').innerHTML=copy("精选 {0} 个场馆<br>2D / 3D 分区与采样位置<br>注册后可保存 8 个位置", [freeCount]);
  $('google-login').hidden=!providers.google;$('google-login').disabled=!providers.google;$('google-login').textContent=providers.localGoogle?copy("本地模拟 Google 登录"):copy("使用 Google 登录");$('connect-google').hidden=!providers.google||!!user?.googleConnected;
  $('email-submit').textContent=providers.emailOtp?copy("发送验证码"):copy("发送本地测试链接");$('email-submit').disabled=!providers.email;$('provider-note').textContent=providers.localGoogle?copy("本地模式：Google 登录为仅回环地址可用的模拟流程，不会连接 Google。"):providers.localEmail?(providers.localInbox?copy("本地测试邮箱：free@seatpeep.test / pro@seatpeep.test / expired@seatpeep.test。发送后可直接打开测试链接，不会发送真实邮件。"):copy("当前为本地测试。请在运行服务的电脑通过 127.0.0.1 打开测试收件箱；手机可先体验访客选座。")):!providers.email&&!providers.google?copy("登录服务暂未开放。"):'';
  $('billing-portal').hidden=providers.localBilling||!user||!state.me.subscription;$('checkout').hidden=access.plan==='pro';
  $('checkout').disabled=!providers.billing;$('checkout').textContent=providers.localBilling?copy("本地模拟升级 Pro"):copy("按月订阅");$('billing-feedback').textContent=providers.localBilling?copy("本地模拟流程：不会扣款；正式环境需要 Stripe。"):providers.billing?'':copy("月订阅暂未开放，当前可免费体验精选场馆。");
  if(providers.billing)try{const {price}=await api('/api/billing/price');$('monthly-price').textContent=new Intl.NumberFormat('en-US',{style:'currency',currency:price.currency}).format(price.amount/100)+copy(" / 月");}catch(error){$('billing-feedback').textContent=message(error);$('checkout').disabled=true;}
}
async function loadCatalog(){const {venues}=await api('/api/venues');state.catalog=venues;const select=$('venue');select.replaceChildren();for(const group of groupVenuesByCountry(venues)){const optgroup=document.createElement('optgroup');optgroup.label=`${countryName(group.country,locale)} (${group.venues.length})`;for(const venue of group.venues){const option=element('option',venueName(venue,locale)+(venue.locked?' · Pro':''));option.value=venue.id;optgroup.append(option);}select.append(optgroup);}select.value=state.venueId;}
async function loadVenue(id,layout){
  const version=++loadVersion;resolveVersion++;$('locate').disabled=true;
  try{const {venue}=await api('/api/venues/'+id+(layout?'?layout='+encodeURIComponent(layout):''));if(version!==loadVersion)return;
    if(venue.seatTuples){venue.sourceSeats=unpackSourceSeats(venue.seatTuples);delete venue.seatTuples;}
    resolveVersion++;state.venueId=id;state.venue=venue;state.mapTier=null;state.mapTransform=null;state.event=null;state.layout=venue.seatLayout?.id||'end';state.phoneFrame=false;state.roofVisible=false;
    if(typeof renderStageOptions==='function')renderStageOptions();else{for(const item of venue.seatLayouts||[{id:'end',label:copy("端头舞台（通用）")},{id:'runway',label:copy("端头舞台 + 延伸台（通用）")},{id:'center',label:copy("中央舞台（通用）")}]){const option=element('option',copy(item.label));option.value=item.id;$('stage-layout').append(option);}$('stage-layout').value=state.layout;}
    state.sectionId=venue.sections.some(x=>x.id==='122')?'122':venue.sections[0].id;state.result=null;
    $('section-list').replaceChildren();for(const section of venue.sections)for(const label of section.ticketLabels){const option=element('option');option.value=label;$('section-list').append(option);}
    $('venue').value=id;chooseSection(state.sectionId,false);render();await loadEvents(id,version);return true;
  }catch(error){toast(message(error));if(error.code==='SUBSCRIPTION_REQUIRED')open('plan-dialog');
    if(!state.venue){$('venue-name').textContent=state.catalog.find(v=>v.id===id)?.name||copy("暂时无法载入场馆");$('location-status').textContent=error.code==='SUBSCRIPTION_REQUIRED'?copy("此场馆当前需要订阅，尚未加载座位。"):copy("场馆暂未加载，请稍后重试。");}
    $('venue').value=state.venue?state.venueId:id;$('stage-layout').value=state.layout;return false;}
  finally{if(version===loadVersion)$('locate').disabled=false;}
}
function applyRequestedSection(section){
  if(!section||!state.venue)return;
  const target=state.venue.sections.find(item=>item.id===section||item.ticketLabels.includes(section));
  if(target){state.sectionId=target.id;state.mapTier=target.tier;}
  $('section').value=section;$('row').value='';$('seat').value='';
  state.result={status:target?'unverified':'unknown-section',section,row:'',seat:''};render();
}
async function applyRequestedLayout(layout){
  if(!state.venue)return false;
  if(state.venue.geometry?.referenceLayout){state.layout='end';renderStageOptions();render();return layout==='end';}
  if(state.venue.seatLayouts){
    if(!state.venue.seatLayouts.some(item=>item.id===layout)){toast(copy("该来源没有这个布局，未按其他布局定位。"));return false;}
    if(state.layout!==layout)await loadVenue(state.venueId,layout);return state.layout===layout;
  }
  if(!['end','runway','center'].includes(layout))return false;
  state.layout=layout;$('stage-layout').value=layout;render();return true;
}
function chooseSection(id,focus=true){
  resolveVersion++;$('locate').disabled=false;
  const section=state.venue?.sections.find(s=>s.id===id);if(!section)return;state.sectionId=id;state.mapTier=section.tier;
  const sample=section.samples.find(x=>x.row==='14'&&x.seat==='679')||section.samples[0];
  $('section').value=sample?.section||id;$('row').value=sample?.row||'';$('seat').value=sample?.seat||'';
  state.result=sample?{status:'matched',...sample,sectionId:id}:{status:'unverified',section:id,row:'',seat:''};render();
  if(focus)viewer?.near();
}
function chooseEstimatedSeat(record){
  if(record.sourceSeat){chooseSample(record);return;}
  resolveVersion++;$('locate').disabled=false;
  const section=state.venue?.sections.find(item=>item.id===record.section);if(!section)return;
  const ticketSection=section.ticketLabels[0]||section.id;
  $('section').value=ticketSection;$('row').value='';$('seat').value='';
  state.sectionId=section.id;state.mapTier=section.tier;state.result={status:'estimated',section:ticketSection,row:record.row,seat:record.seat,sectionId:section.id,position:record.p,positionStatus:'estimated-seat-grid'};
  render();viewer?.seatView();
}
async function chooseSample(sample){$('section').value=sample.section;$('row').value=sample.row;$('seat').value=sample.seat;await locate({intentional:true});}
async function locate({intentional=false}={}){const version=++resolveVersion,id=state.venueId,requestedVenue=state.venue;$('locate').disabled=true;
  try{const found=await api(`/api/venues/${id}/resolve`,{method:'POST',body:{layout:state.venue?.seatLayout?.id,section:$('section').value,row:$('row').value,seat:$('seat').value}});
    if(version!==resolveVersion||id!==state.venueId||state.venue!==requestedVenue)return;state.result=found;if(found.sectionId){state.sectionId=found.sectionId;state.mapTier=state.venue.sections.find(s=>s.id===found.sectionId)?.tier;}render();
    if(found.status==='matched'&&Array.isArray(found.position)){viewer?.seatView();if(intentional)window.stagepeekTrack?.('seat_located');}
    else{viewer?.near();toast(found.status==='matched'?copy("票号存在，但缺少座位坐标；当前仅显示分区。"):found.status==='ambiguous'?copy("来源含重复票号，未自动选择任何座位。"):found.status==='unknown-section'?copy("尚未找到这个分区。"):copy("这组排座尚无公开坐标，先显示分区预览。"));}
  }catch(error){toast(message(error));}finally{if(version===resolveVersion)$('locate').disabled=false;}}
async function loadEvents(id,version){$('events-list').replaceChildren(element('p',copy("正在读取官方演出信息…"),'muted'));
  try{const result=await api(`/api/venues/${id}/events`);if(version!==loadVersion)return;
    $('events-list').replaceChildren();$('event-count').textContent=copy("{0} 项", [result.events.length]);
    for(const group of groupEventsByDate(result.events)){const section=element('section',undefined,'event-date-group'),heading=element('div',undefined,'event-date-heading'),title=element('h3',group.date==='unknown'?copy("日期待定"):group.date),count=element('span',copy("{0} 项",[group.events.length]));heading.append(title,count);const grid=element('div',undefined,'event-grid');group.events.forEach((event,index)=>{const card=element('article',undefined,'event-card'),button=element('button',undefined,'event');const mapState=event.layout?.model?copy("有公开座位图 + 舞台布局"):event.layout?.mapVerification==='reference'?copy("有公开场次座位图参考"):event.layout?.mapVerification==='unavailable'?copy("座位图待票务平台发布"):copy("场次布局待核实");button.append(element('strong',event.name),element('span',event.localDate+(event.endLocalDate!==event.localDate?' — '+event.endLocalDate:'')),element('span',event.status==='canceled'?copy("已取消"):event.status==='postponed'?copy("已延期"):mapState));button.setAttribute('aria-pressed',String(state.event?.id===event.id));button.classList.toggle('active',state.event?.id===event.id);button.onclick=()=>{for(const item of $('events-list').querySelectorAll('.event')){item.classList.remove('active');item.setAttribute('aria-pressed','false');}button.classList.add('active');button.setAttribute('aria-pressed','true');selectEvent(event);};card.append(button,link(copy("官方详情 ↗"),event.source));card.lastChild.className='event-source';if(event.layout?.mapVerification==='reference'){const mapLink=link(copy("场次座位图参考 ↗"),event.layout.source||event.layout.image);mapLink.className='event-source';card.append(mapLink);}if(index>=6)card.hidden=true;grid.append(card);});section.append(heading,grid);if(group.events.length>6){const more=element('button',copy("显示更多场次"),'event-more');more.type='button';more.onclick=()=>{const expanded=more.dataset.expanded==='true';grid.querySelectorAll('.event-card').forEach((card,index)=>{if(index>=6)card.hidden=expanded;});more.dataset.expanded=String(!expanded);more.textContent=copy(expanded?"显示更多场次":"收起场次");};section.append(more);}$('events-list').append(section);}
    if(!result.events.length)$('events-list').append(element('p',result.status==='unavailable'?copy("暂时无法取得官方活动列表。"):copy("暂未取得可展示的近期演出。"),'muted'));
    $('events-status').textContent=(result.refreshedAt?(result.acquisition==='manual-official-page-verification'?copy("人工核验缓存 "):copy("最近成功更新 "))+new Date(result.refreshedAt).toLocaleString(locale):copy("尚无成功更新记录"))+(['partial','stale'].includes(result.status)?copy(" · 部分来源暂不可用"):'');renderEventLayout();
  }catch(error){if(version===loadVersion)$('events-list').replaceChildren(element('p',copy("演出列表暂时不可用，请稍后重试。"),'muted'));}}
async function selectEvent(event){
  const id=state.venueId,model=event.layout?.model;
  if(state.event||(model?.seatLayoutId&&model.seatLayoutId!==state.venue.seatLayout?.id)){
    const expected=loadVersion+1;
    await loadVenue(id,model?.seatLayoutId||state.venue.seatLayout?.id);
    if(loadVersion!==expected||state.venueId!==id)return;
  }
  if(model?.seatLayoutId&&state.venue.seatLayout?.id!==model.seatLayoutId)return;
  if(state.venue.geometry?.referenceLayout){toast(copy("当前为指定历史场次参考，尚未取得这场演出的临时座席布局。"));return;}
  const closed=new Set(model?.closedSections||[]);
  state.event=event;state.venue={...state.venue,eventLayout:model||null,
    sections:state.venue.sections.filter(s=>!closed.has(s.id)),
    ...(state.venue.sourceSeats?{sourceSeats:state.venue.sourceSeats.filter(s=>!closed.has(s.section))}:{})};
  state.result=null;state.sectionId=state.venue.sections[0]?.id;state.layout=model?'event':'none';
  $('section-list').replaceChildren();
  for(const section of state.venue.sections)for(const label of section.ticketLabels){const option=element('option');option.value=label;$('section-list').append(option);}
  renderStageOptions();render();
}
function renderEventLayout(){if(state.venue&&proposedStageRects(state.layout,state.venue).length&&!stageRects(state.layout,state.venue).length){$('layout-source-note').textContent=copy("舞台超出当前模型范围，已暂停显示；原始来源坐标保持不变。");$('layout-state').textContent=copy("舞台边界待核实");$('event-layout-note').textContent=copy("当前模型范围可能仅来自座位分布，不能据此确认建筑边界；复核前不显示舞台或计算舞台距离。");return;}const reference=state.venue?.geometry?.referenceLayout;if(reference){$('layout-source-note').textContent=copy("历史布局参考，不代表当前演出。");$('layout-state').textContent=copy("历史场次参考");$('event-layout-note').textContent=copy("历史布局参考，不代表当前演出。")+copy("。临时坐席、舞台与控制台只对应这份布局，不适用于其他演出。");return;}const event=state.event;const map=event?.layout?.mapVerification;const referenced=map==='reference';const unavailable=map==='unavailable';const model=event?.layout?.model;const source=state.venue?.seatLayout?(state.venue.sourceStage?copy("座位与舞台来自同一来源布局；未独立实测，也不代表本场演出。"):copy("来源仅包含固定看台，未取得场次舞台坐标。")):copy("当前场次没有事件级舞台坐标。");$('layout-source-note').textContent=model?copy("{0} · 来源：{1} · {2}", [model.label, model.provider||copy("公开票务座位图"), model.confidence==='operator-traced'?copy("人工描摹，待现场独立校准"):copy("来源校准")]):source;$('layout-state').textContent=event?(model?copy("本场布局已接入"):referenced?copy("有公开参考"):unavailable?copy("座位图待发布"):copy("布局待核实")):state.venue?.seatLayout?copy("来源布局预览"):copy("通用预览");$('event-layout-note').textContent=event?(model?copy("{0}：已将公开座位图中可辨认的舞台位置接入 2D/3D、座位避让和距离计算。当前为人工描摹，演出制作方可能临时调整，仍需现场或官方图纸校准。", [event.name]):referenced?copy("{0}：已找到公开座位图参考，但没有事件级舞台坐标；当前不渲染舞台。", [event.name]):unavailable?copy("{0}：演出已在官方场馆页面确认，但没有可用的事件级座位图；当前不渲染舞台。", [event.name]):copy("{0}：尚未取得可校准的场次舞台图，当前不渲染舞台。", [event.name])):copy("可选择近期演出，查看场次与布局来源状态。");}
async function saved(){if(!state.me?.user){open('login-dialog');return;}open('saved-dialog');$('saved-list').replaceChildren(element('p',copy("正在加载…")));
  try{const {positions}=await api('/api/positions');$('saved-list').replaceChildren();if(!positions.length)$('saved-list').append(element('p',copy("还没有保存位置。先在地图中选择已有记录的排座。"),'muted'));
    for(const item of positions){const wrap=element('article',undefined,'saved-item');wrap.append(element('strong',state.catalog.find(v=>v.id===item.venue_id)?.name||item.venue_id),element('p',copy("{0} 区 · {1} 排 · {2} 座", [item.section, item.row_token, item.seat_token])));
      const visit=element('button',copy("查看位置"));visit.onclick=async()=>{$('saved-dialog').close();await loadVenue(item.venue_id,item.layout||undefined);if(state.venueId!==item.venue_id)return;$('section').value=item.section;$('row').value=item.row_token;$('seat').value=item.seat_token;await locate();};
      const remove=element('button',copy("删除"));remove.onclick=async()=>{try{await api('/api/positions/'+item.id,{method:'DELETE',body:{}});await saved();}catch(error){toast(message(error));}};wrap.append(visit,remove);$('saved-list').append(wrap);}
  }catch(error){$('saved-list').replaceChildren(element('p',message(error)));}}

for(const button of document.querySelectorAll('[data-close]'))button.onclick=()=>button.closest('dialog').close();
for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
$('ticket-form').onsubmit=e=>{e.preventDefault();locate({intentional:true});};$('venue').onchange=()=>{const venue=state.catalog.find(x=>x.id===$('venue').value);if(venue?.locked){$('venue').value=state.venueId;open('plan-dialog');}else loadVenue($('venue').value);};
 $('stage-layout').onchange=()=>{if(state.event){renderStageOptions();return;}const value=$('stage-layout').value;if(value==='event'&&state.event?.layout?.model){state.layout='event';}else if(state.venue?.seatLayouts)loadVenue(state.venueId,value);else{state.layout=value;state.venue={...state.venue,eventLayout:null};renderEventLayout();render();}};
for(const mode of ['2d','3d'])$('mode-'+mode).onclick=async()=>{state.mode=mode;render();if(mode==='3d'){await ensureViewer();if(state.mode==='3d')window.stagepeekTrack?.('view_3d');}render();viewer?.setMode(state.mode);};
$('overview').onclick=()=>viewer?.overview();$('reset').onclick=()=>viewer?.overview(true);$('near').onclick=()=>viewer?.near();$('seat-view').onclick=()=>viewer?.seatView();
for(const [id,action]of [['map-zoom-out',t=>zoomMap(t,.8)],['map-zoom-in',t=>zoomMap(t,1.25)],['map-rotate',t=>rotateMap(t,90)],['map-reset',resetMap]])$(id).onclick=()=>{if(!state.mapTransform)return;state.mapTransform=action(state.mapTransform);updateMapViewport();};
for(const button of document.querySelectorAll('[data-zoom]'))button.onclick=()=>{state.zoom=Number(button.dataset.zoom);viewer?.setZoom(state.zoom);for(const other of document.querySelectorAll('[data-zoom]'))other.classList.toggle('active',other===button);};
$('roof-toggle').onclick=()=>{state.roofVisible=!state.roofVisible;viewer?.toggleRoof(state.roofVisible);render();};
$('phone-toggle').onclick=()=>{state.phoneFrame=!state.phoneFrame;viewer?.togglePhoneFrame(state.phoneFrame);if(state.phoneFrame&&viewerCameraMode!=='seat')viewer?.seatView();renderViewControls();};
function setExpandedView(value){
  $('viewer').classList.toggle('is-expanded',value);document.body.classList.toggle('explorer-expanded',value);syncFullscreenButton();
}
function syncFullscreenButton(){
  const expanded=!!document.fullscreenElement||$('viewer').classList.contains('is-expanded');
  $('fullscreen').setAttribute('aria-pressed',String(expanded));$('fullscreen').setAttribute('aria-label',expanded?copy("退出全屏"):copy("全屏查看"));
}
async function toggleFullscreen(){
  if(document.fullscreenElement){await document.exitFullscreen();syncFullscreenButton();return;}
  if($('viewer').classList.contains('is-expanded')){setExpandedView(false);return;}
  try{if(typeof $('viewer').requestFullscreen!=='function')throw new Error('unsupported');await $('viewer').requestFullscreen();syncFullscreenButton();}
  catch{setExpandedView(true);}
}
$('fullscreen').onclick=toggleFullscreen;
document.addEventListener('fullscreenchange',syncFullscreenButton);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('viewer').classList.contains('is-expanded'))setExpandedView(false);});
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
 svg.addEventListener('wheel',e=>{if(!state.mapTransform)return;e.preventDefault();state.mapTransform=zoomMap(state.mapTransform,Math.exp(-e.deltaY*.002));updateMapViewport();},{passive:false});
 svg.addEventListener('keydown',e=>{if(!state.mapTransform||e.target!==svg)return;const actions={'+':t=>zoomMap(t,1.25),'=':t=>zoomMap(t,1.25),'-':t=>zoomMap(t,.8),'0':resetMap};if(actions[e.key]){e.preventDefault();state.mapTransform=actions[e.key](state.mapTransform);updateMapViewport();}});
}
localizeShell();
$('account-button').onclick=()=>state.me?.user?location.assign(route('/account')):open('login-dialog');
$('manage-plan').onclick=()=>open('plan-dialog');
let resendUntil=0,resendTimer=null;
function updateResend(){const remaining=Math.ceil((resendUntil-Date.now())/1000);$('email-submit').disabled=!state.me?.providers.email||remaining>0;$('email-submit').textContent=remaining>0?copy("{0} 秒后可重发", [remaining]):state.me?.providers.emailOtp?($('otp-field').hidden?copy("发送验证码"):copy("重新发送验证码")):copy("发送本地测试链接");if(remaining<=0)clearInterval(resendTimer);}
$('email-form').onsubmit=async e=>{
 e.preventDefault();if(Date.now()<resendUntil)return;
 $('email-submit').disabled=true;$('local-login').hidden=true;$('local-login').removeAttribute('href');$('email-feedback').textContent=copy("正在发送…");
 try{
  const result=await api('/api/auth/email',{method:'POST',body:{email:$('email').value}});
  if(result.method==='email-otp'){
   $('otp-field').hidden=false;$('otp-submit').hidden=false;$('otp-change-email').hidden=false;$('email').readOnly=true;
   $('email-feedback').textContent=copy("验证码已发送，请在此处输入。首次验证将创建账号。");$('email-code').value='';$('email-code').focus();
   resendUntil=Date.now()+(result.resendAfter||60)*1000;clearInterval(resendTimer);resendTimer=setInterval(updateResend,1000);
  }else{
   $('email-feedback').textContent=copy("本地测试链接已写入测试收件箱。");
   if(result.local&&state.me.providers.localInbox){const {messages}=await api('/api/dev/mailbox');if(messages[0]){const url=new URL(messages[0].url);if(url.origin===location.origin){$('local-login').href=url.href;$('local-login').hidden=false;}}}
  }
 }catch(error){$('email-feedback').textContent=message(error);}finally{updateResend();}
};
$('otp-change-email').onclick=()=>{$('email').readOnly=false;$('email').focus();for(const id of ['otp-field','otp-submit','otp-change-email'])$(id).hidden=true;$('email-code').value='';$('email-feedback').textContent='';updateResend();};
$('otp-submit').onclick=async()=>{
 if(!$('email-code').reportValidity()||!/^\d{6,10}$/.test($('email-code').value)){$('email-feedback').textContent=copy("请输入邮箱中的验证码。");return;}
 $('otp-submit').disabled=true;
 try{await api('/api/auth/email/verify',{method:'POST',body:{code:$('email-code').value}});$('email-code').value='';$('login-dialog').close();for(const id of ['otp-field','otp-submit','otp-change-email'])$(id).hidden=true;$('email').readOnly=false;await refreshAccount();await loadCatalog();toast(copy("登录成功。"));}
 catch(error){$('email-feedback').textContent=message(error);}finally{$('otp-submit').disabled=false;}
};
$('email-code').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();$('otp-submit').click();}};
async function google(){try{const result=await api('/api/auth/google/start',{method:'POST',body:{}});location.assign(result.url);}catch(error){toast(message(error));}}
$('google-login').onclick=google;$('connect-google').onclick=google;
$('confirm-login').onclick=async()=>{$('confirm-login').disabled=true;try{await api('/api/auth/email/verify',{method:'POST',body:{token:loginToken}});loginToken=null;history.replaceState(null,'',location.pathname);$('confirm-dialog').close();await refreshAccount();await loadCatalog();toast(copy("登录成功。"));}catch(error){$('confirm-feedback').textContent=message(error);}finally{$('confirm-login').disabled=false;}};
$('logout').onclick=async()=>{try{await api('/api/auth/logout',{method:'POST',body:{}});$('account-dialog').close();await refreshAccount();await loadCatalog();if(!state.me.access.venueIds.includes(state.venueId))await loadVenue('tottenham');toast(copy("已退出登录。"));}catch(error){toast(message(error));}};
for(const [button,path]of [['checkout','checkout'],['billing-portal','portal']])$(button).onclick=async()=>{if(state.me?.consent?.required){open('account-dialog');return;}if(!state.me?.user){open('login-dialog');return;}$(button).disabled=true;try{const result=await api('/api/billing/'+path,{method:'POST',body:{}});location.assign(result.url);}catch(error){$('billing-feedback').textContent=message(error);}finally{$(button).disabled=false;}};
$('save-position').onclick=async()=>{if(state.me?.consent?.required){open('account-dialog');return;}if(!state.me?.user){open('login-dialog');return;}const r=state.result;if(r?.status!=='matched')return;try{await api('/api/positions',{method:'POST',body:{venueId:state.venueId,layout:state.venue?.seatLayout?.id,section:r.section,row:r.row,seat:r.seat,eventId:state.event?.id}});toast(copy("位置已保存。"));}catch(error){toast(message(error));}};
let viewerLoading=null;
async function ensureViewer(){
  if(viewer)return;
  if(viewerLoading)return viewerLoading;
  $('mode-3d').disabled=true;$('mode-3d').textContent=copy("正在加载 3D…");
  viewerLoading=(async()=>{
    try{
      const {createViewer}=await import('./viewer.mjs');
      viewer=createViewer($('scene'),{onSection:chooseSection,onSample:chooseSample,onSeat:chooseEstimatedSeat,onMode:(mode,detail)=>{viewerCameraMode=mode;updateGestureHint();renderViewControls();if(detail?.zoom){state.zoom=detail.zoom;for(const button of document.querySelectorAll('[data-zoom]'))button.classList.toggle('active',Math.abs(Number(button.dataset.zoom)-detail.zoom)<.01);}},onFailure:text=>{state.mode='2d';$('mode-3d').disabled=true;toast(text+copy(" · 已切换到二维地图。"));render();viewer?.setMode('2d');}});
      $('mode-3d').disabled=false;render();viewer.setMode(state.mode);viewer.setZoom(state.zoom);
    }catch{state.mode='2d';$('mode-3d').disabled=true;render();toast(copy("此设备暂不能显示三维场景，已切换到二维地图。"));}
    finally{$('mode-3d').textContent=copy("3D 视角");}
  })();
  return viewerLoading;
}
try{
  const params=new URLSearchParams(location.search);loginToken=new URLSearchParams(location.hash.slice(1)).get('token');
  await Promise.all([refreshAccount(),loadCatalog()]);
  const initial=resolveInitialRoute(params,state.catalog);
  if(await loadVenue(initial.venueId)){
  if(params.get('event')){try{const {events}=await api(`/api/venues/${state.venueId}/events`);const requested=events.find(e=>e.id===params.get('event'));if(requested)await selectEvent(requested);else toast(copy("原演出暂不可用，已显示场馆。"));}catch{toast(copy("原演出暂不可用，已显示场馆。"));}}const layoutReady=state.event?true:!params.has('layout')||await applyRequestedLayout(initial.layout);applyRequestedSection(initial.section);viewer?.setMode(state.mode);
  if(initial.row&&initial.seat){$('row').value=initial.row;$('seat').value=initial.seat;if(layoutReady)await locate();else{state.result={status:'unknown-layout',section:$('section').value,row:initial.row,seat:initial.seat};render();}}
  }
  if(params.get('panel')==='plans')open('plan-dialog');
  if(loginToken&&state.me.providers.auth==='local'){history.replaceState(null,'',location.pathname+'?login=email');open('confirm-dialog');}
  if(params.has('zoom')){state.zoom=Math.max(1,Math.min(8,Number(params.get('zoom'))||1));viewer?.setZoom(state.zoom);}
  if(params.get('mode')==='3d'){state.mode='3d';await ensureViewer();render();}else{state.mode='2d';render();}
  if(params.get('account')==='billing')open('plan-dialog');
  if(params.has('auth_error'))toast(messages[params.get('auth_error')]||copy("登录未完成，请重试。"));
  if(params.get('billing')==='success'){toast(copy("支付已返回，订阅状态将在付款确认后更新。"));let count=0;const timer=setInterval(async()=>{try{await refreshAccount();if(state.me.access.plan==='pro'){clearInterval(timer);await loadCatalog();toast(copy("月订阅已生效。"));}}catch{}if(++count>=10)clearInterval(timer);},2000);}
}catch(error){$('venue-name').textContent=copy("暂时无法载入场馆");toast(copy("服务暂不可用，请检查连接并刷新。"));}
