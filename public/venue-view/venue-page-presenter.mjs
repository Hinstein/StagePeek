// Venue-specific evidence becomes data here, never a separate sidebar or card.
export function renderVenueLocation(doc,{section,row,status,description,distance,matched=false,conflict=false},translate=text=>text){
 for(const [id,value]of Object.entries({'location-section':section,'location-row':row,'location-status':status,'location-description':description,distance}))doc.getElementById(id).textContent=id==='location-section'?value:translate(value);
 const badge=doc.getElementById('location-status');badge.classList.toggle('matched',matched);badge.classList.toggle('layout-conflict',conflict);
 const save=doc.getElementById('save-position');save.disabled=true;save.title=translate('示意视角暂不支持保存');
}

export function venueEventCard(doc,{id,title,lines,links=[],research=false,onSelect}){
 const wrap=doc.createElement('div'),button=doc.createElement('button');
 wrap.className=research?'event research-event':'event-card';button.className='event';button.type='button';button.dataset.event=id;
 for(const [index,text]of [title,...lines].entries()){const node=doc.createElement(index?'span':'strong');node.textContent=text;button.append(node);}
 button.onclick=onSelect;wrap.append(button);
 for(const item of links){if(!item.url)continue;const a=doc.createElement('a');a.textContent=item.label;a.href=item.url;a.target='_blank';a.rel='noopener noreferrer';a.className='event-source';wrap.append(a);}
 return wrap;
}

export function selectVenueEvent(root,id){
 for(const button of root.querySelectorAll('button[data-event]')){const active=button.dataset.event===id;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));}
}
