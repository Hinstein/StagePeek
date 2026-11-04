import {renderVenueLocation,venueEventCard,selectVenueEvent} from '../venue-view/venue-page-presenter.mjs';
import {appendHydroPanel} from './hydro-panel.mjs';
import {groupVenuesByCountry} from './catalog.mjs';

// All venues use the existing page DOM. Hydro replaces only the scene adapter;
// it does not own a second query form, workspace, heading or sidebar.
export function mountLocalResearch(venues,regularCatalog=[],onEnter=()=>{}){
 const drafts=venues.filter(v=>v.id==='ovo-hydro'&&v.venueDraft);
 const countryNames=new Intl.DisplayNames(['zh-CN'],{type:'region'});
 const select=document.getElementById('venue'),regularChange=select.onchange;
 const viewer=document.getElementById('viewer'),sources=document.querySelector('.map-card > .sources');
 const query={form:document.getElementById('ticket-form'),section:document.getElementById('section'),row:document.getElementById('row'),seat:document.getElementById('seat')};
 const stageSelect=document.getElementById('stage-layout'),stageField=stageSelect.parentElement,back=document.getElementById('return-venue-layout');
 const regularBack=back.onclick;
 let regularValue=select.value,active=null,panel=null,content=null;
 const css=node('link');css.rel='stylesheet';css.href='/concert-views/local-project-research.css';document.head.append(css);
 const $=id=>document.getElementById(id);

 function appendOptions(catalog=regularCatalog){
  regularCatalog=catalog;select.replaceChildren();
  const ids=new Set(drafts.map(v=>v.id));
  const combined=[...regularCatalog.filter(v=>!ids.has(v.id)),...drafts.map(v=>({...v,country:countryNames.of(v.country)}))];
  for(const group of groupVenuesByCountry(combined)){
   const optgroup=node('optgroup');optgroup.label=`${group.country}（${group.venues.length}）`;
   for(const v of group.venues){const option=node('option',v.name+(v.locked?' · Pro':''));option.value=v.id;optgroup.append(option);}select.append(optgroup);
  }
  select.value=active?active.id:regularValue;
 }
 function hide(){
  active=null;panel?.dispose();panel=null;content?.remove();content=null;document.querySelector('.hydro-sources')?.remove();viewer.hidden=false;sources.hidden=false;stageField.hidden=false;back.onclick=regularBack;back.hidden=true;
  const url=new URL(location.href);url.searchParams.set('venue',select.value);
  for(const key of ['data','event','sectionMap','section','row','seat','preview','hydroCamera','hydroPhone','hydroRoof','hydroFloor','hydroTier','hydroMapRotation'])url.searchParams.delete(key);
  history.replaceState(null,'',url);
 }
 function selection(venue,{model,selected,found,row,seat,description}){
  $('venue-name').textContent=venue.name;
  $('venue-city').textContent=`${venue.city} · ${countryNames.of(venue.country)}`+(model.event?` · ${model.event.artist} · ${model.event.date}`:'');
  renderVenueLocation(document,{section:selected.label,row:row?`${row} 排${seat?' · '+seat+' 座':''}`:'分区预览',status:found.status==='reference'?'参考编号 · 位置估算':found.status==='inferred'?'推演编号 · 位置估算':seat?'编号超出模型范围 · 未定位':'排座尚未输入 · 当前为分区预览',description,distance:model.event?'舞台位置估算 · 距离待校准':'—'});
  $('samples-list').replaceChildren();
  for(const item of model.references.filter(r=>r.reference.section===selected.label).slice(0,6)){
   const button=node('button',`${item.reference.row} 排 · ${item.reference.seat} 座`);button.type='button';
   button.onclick=()=>{query.row.value=item.reference.row;query.seat.value=item.reference.seat;query.form.requestSubmit();};$('samples-list').append(button);
  }
  if(!$('samples-list').children.length)$('samples-list').append(node('p','本区暂无独立核对的编号示例；可查询本地推演编号。'));
  $('row-list').replaceChildren();for(const row of selected.rows){const option=node('option');option.value=row;$('row-list').append(option);}
  $('coverage-count').textContent=`${model.sections.length} 个来源分区 · ${model.references.length} 个参考编号 · ${model.inferredReferences.length.toLocaleString()} 个推演编号`;
  $('capability-badges').replaceChildren(...['示意座位表','位置未实测','本地未发布'].map(t=>node('span',t,'capability-badge')));
  $('event-count').textContent=`${venue.eventPlans.length} 个演出参考`;
  $('events-status').textContent='本地研究布局 · 非可售库存';
  selectVenueEvent($('events-list'),model.event?.id);
  $('layout-state').textContent=model.event?'本地票图预览':'场馆常规布局';
  $('event-layout-note').textContent=model.event?`${model.event.artist} · ${model.event.date} · 舞台、内场及人物为示意。`:'当前无演出舞台；选择演唱会后显示本场内场布局。';
  $('layout-source-note').textContent='区、排、座号区分参考与推演；位置仅用于大致视角，不代表官方票号、可售库存或实测距离。';
  $('research-v0-notice').hidden=true;stageField.hidden=true;
  $('ticket-map-conflicts').hidden=true;$('ticket-map-preview-image').hidden=true;
  back.hidden=!model.event;back.onclick=()=>panel?.selectEvent('');
 }
 function show(venue){
  if(!venue)return;
  onEnter();panel?.dispose();panel=null;content?.remove();active=venue;select.value=venue.id;
  viewer.hidden=true;sources.hidden=true;content=node('div',null,'hydro-page-adapter');viewer.after(content);
  const mount=content;
  $('venue-name').textContent=venue.name;$('venue-city').textContent=`${venue.city} · ${countryNames.of(venue.country)}`;
  $('locate').disabled=true;$('location-section').textContent='—';$('location-row').textContent='';$('location-status').textContent='正在载入场馆…';
  const url=new URL(location.href);
  if(url.searchParams.get('venue')!==venue.id)for(const key of ['event','section','row','seat','preview','hydroCamera'])url.searchParams.delete(key);
  url.searchParams.set('venue',venue.id);url.searchParams.set('data','source');url.searchParams.delete('layout');history.replaceState(null,'',url);
  $('events-list').replaceChildren();
  for(const event of venue.eventPlans)$('events-list').append(venueEventCard(document,{id:event.id,title:event.artist,lines:[`${event.date} · 本场票图可预览`],links:[{label:'演出来源 ↗',url:event.sourceUrl}],onSelect:()=>panel?.selectEvent(event.id)}));
  fetch('/api/concert-views/hydro/'+encodeURIComponent(venue.id),{credentials:'same-origin'}).then(response=>{
   if(!response.ok)throw Error('Venue detail unavailable');return response.json();
  }).then(data=>{
   if(!mount.isConnected)return;
   $('section-list').replaceChildren();for(const section of data.venue.venueDraft.map.sections){const option=node('option');option.value=section.ticketLabel;$('section-list').append(option);}
   panel=appendHydroPanel(mount,data.venue,{query,sourcesHost:sources.parentElement,onSelection:value=>selection(data.venue,value)});$('locate').disabled=false;
  }).catch(()=>{if(!mount.isConnected)return;mount.textContent='场馆资料载入失败，请刷新重试。';$('location-status').textContent='场馆未载入';});
 }
 select.onchange=()=>{
  const draft=drafts.find(v=>v.id===select.value||'research-'+v.id===select.value);
  if(draft){show(draft);return;}
  regularValue=select.value;hide();regularChange();
 };
 appendOptions();
 show(drafts.find(v=>v.id===new URLSearchParams(location.search).get('venue')));
 return {appendOptions,get active(){return !!active;}};
}

function node(tag,text,className){const n=document.createElement(tag);if(text!=null)n.textContent=text;if(className)n.className=className;return n;}
