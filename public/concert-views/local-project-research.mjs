import {copy,getLocale} from '../locales.mjs';
import {renderVenueLocation,venueEventCard,selectVenueEvent} from '../venue-view/venue-page-presenter.mjs';
import {appendHydroPanel} from './hydro-panel.mjs';

// All venues use the existing page DOM. Hydro replaces only the scene adapter;
// it does not own a second query form, workspace, heading or sidebar.
export function mountLocalResearch(venues,regularCatalog=[],onEnter=()=>{},onUpdate=()=>{}){
 const drafts=venues.filter(v=>v.id==='ovo-hydro'&&v.venueDraft);
 const countryNames=new Intl.DisplayNames([getLocale()],{type:'region'});
 const select=document.getElementById('venue'),regularChange=select.onchange;
 const viewer=document.getElementById('viewer'),sources=document.querySelector('.map-card > .sources');
 const query={form:document.getElementById('ticket-form'),section:document.getElementById('section'),row:document.getElementById('row'),seat:document.getElementById('seat')};
 const stageSelect=document.getElementById('stage-layout'),stageField=stageSelect.parentElement,back=document.getElementById('return-venue-layout');
 const regularBack=back.onclick;
 let active=null,panel=null,content=null;
 const css=node('link');css.rel='stylesheet';css.href='/concert-views/local-project-research.css';document.head.append(css);
 const $=id=>document.getElementById(id);

 function hide(){
  active=null;panel?.dispose();panel=null;content?.remove();content=null;document.querySelector('.hydro-sources')?.remove();viewer.hidden=false;sources.hidden=false;stageField.hidden=false;back.onclick=regularBack;back.hidden=true;
  const url=new URL(location.href);url.searchParams.set('venue',select.value);
  for(const key of ['data','event','sectionMap','section','row','seat','preview','hydroCamera','hydroPhone','hydroRoof','hydroFloor','hydroTier','hydroMapRotation'])url.searchParams.delete(key);
  history.replaceState(null,'',url);
 }
 function selection(venue,{model,selected,found,row,seat,description}){
  $('venue-name').textContent=venue.name;
  $('venue-city').textContent=`${venue.city} · ${countryNames.of(venue.country)}`+(model.event?` · ${model.event.artist} · ${model.event.date}`:'');
  renderVenueLocation(document,{section:selected.label,row:row?(seat?copy('{0} 排 · {1} 座',[row,seat]):copy('{0} 排',[row])):copy('分区预览'),status:found.status==='reference'?copy('参考编号 · 位置仅供参考'):found.status==='inferred'?copy('示意编号 · 位置仅供参考'):seat?copy('编号超出模型范围 · 未定位'):copy('排座尚未输入 · 当前为分区预览'),description,distance:model.event?copy('舞台位置为示意'):'—'},copy);
  $('samples-list').replaceChildren();
  for(const item of model.references.filter(r=>r.reference.section===selected.label).slice(0,6)){
   const button=node('button',copy('{0} 排 · {1} 座',[item.reference.row,item.reference.seat]));button.type='button';
   button.onclick=()=>{query.row.value=item.reference.row;query.seat.value=item.reference.seat;query.form.requestSubmit();};$('samples-list').append(button);
  }
  if(!$('samples-list').children.length)$('samples-list').append(node('p',copy('可在地图中选择其他位置。')));
  $('row-list').replaceChildren();for(const row of selected.rows){const option=node('option');option.value=row;$('row-list').append(option);}
  $('coverage-count').textContent=copy('座位、舞台与人物均为示意');
  $('capability-badges').replaceChildren();
  $('event-count').textContent=copy('{0} 场演出',[venue.eventPlans.length]);
  $('events-status').textContent='';
  selectVenueEvent($('events-list'),model.event?.id);
  $('layout-state').textContent=model.event?copy('本场布局'):copy('场馆常规布局');
  $('event-layout-note').textContent=model.event?`${model.event.artist} · ${model.event.date} · `+copy('舞台、内场及人物为示意。'):copy('当前无演出舞台；选择演唱会后显示本场内场布局。');
  $('layout-source-note').textContent=copy('参考编号与示意编号均用于大致视角，不保证对应门票位置。');
  $('research-v0-notice').hidden=true;stageField.hidden=true;
  $('ticket-map-conflicts').hidden=true;$('ticket-map-preview-image').hidden=true;
  back.hidden=!model.event;back.onclick=()=>panel?.selectEvent('');onUpdate();
 }
 function show(venue){
  if(!venue)return;
  onEnter();panel?.dispose();panel=null;content?.remove();active=venue;select.value=venue.id;
  viewer.hidden=true;sources.hidden=true;content=node('div',null,'hydro-page-adapter');viewer.after(content);
  const mount=content;
  $('venue-name').textContent=venue.name;$('venue-city').textContent=`${venue.city} · ${countryNames.of(venue.country)}`;
  $('locate').disabled=true;$('location-section').textContent='—';$('location-row').textContent='';$('location-status').textContent=copy('正在载入场馆…');
  const url=new URL(location.href);
  if(url.searchParams.get('venue')!==venue.id)for(const key of ['event','section','row','seat','preview','hydroCamera'])url.searchParams.delete(key);
  url.searchParams.set('venue',venue.id);url.searchParams.set('data','source');url.searchParams.delete('layout');history.replaceState(null,'',url);
  $('events-list').replaceChildren();
  for(const event of venue.eventPlans)$('events-list').append(venueEventCard(document,{id:event.id,title:event.artist,lines:[`${event.date} · `+copy('查看本场布局')],links:[{label:copy('演出详情 ↗'),url:event.sourceUrl}],onSelect:()=>panel?.selectEvent(event.id)}));
  fetch('/api/concert-views/hydro/'+encodeURIComponent(venue.id),{credentials:'same-origin'}).then(response=>{
   if(!response.ok)throw Error('Venue detail unavailable');return response.json();
  }).then(data=>{
   if(!mount.isConnected)return;
   $('section-list').replaceChildren();for(const section of data.venue.venueDraft.map.sections){const option=node('option');option.value=section.ticketLabel;$('section-list').append(option);}
   panel=appendHydroPanel(mount,data.venue,{query,sourcesHost:sources.parentElement,onSelection:value=>selection(data.venue,value)});$('locate').disabled=false;$('locate').textContent=copy('找到我的座位');$('venue-status').textContent=copy('场馆已准备好');$('venue-status').classList.remove('is-loading','is-error');$('venue-status').classList.add('is-success');onUpdate();
  }).catch(()=>{if(!mount.isConnected)return;mount.textContent=copy('场馆资料载入失败，请刷新重试。');$('location-status').textContent=copy('场馆未载入');});
 }
 select.onchange=()=>{
  const draft=drafts.find(v=>v.id===select.value||'research-'+v.id===select.value);
  if(draft){show(draft);return;}
  hide();regularChange();
 };
 show(drafts.find(v=>v.id===new URLSearchParams(location.search).get('venue')));
 return {get active(){return !!active;},get ready(){return !!panel;}};
}

function node(tag,text,className){const n=document.createElement(tag);if(text!=null)n.textContent=copy(text);if(className)n.className=className;return n;}
