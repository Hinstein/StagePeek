// Data adapters supply levels and available overlays; this component owns their UI.
export function mountVenueLayers({levels,layers,eventButton,officialButton,status,translate=text=>text,onChange}){
 const doc=levels.ownerDocument;
 function button(label,key){const node=doc.createElement('button');node.type='button';node.textContent=translate(label);node.dataset.layerAction=key;layers.append(node);return node;}
 levels.className='map-levels';layers.className='map-layers';
 levels.setAttribute('role','group');levels.setAttribute('aria-label',translate('二维看台层级'));
 layers.setAttribute('role','group');layers.setAttribute('aria-label',translate('叠加图层'));
 eventButton??=button('内场','event');officialButton??=button('官方区界','official');eventButton.textContent=translate('内场');officialButton.textContent=translate('官方区界');
 status??=doc.createElement('span');status.className='map-layer-status';
 status.hidden=true;officialButton.hidden=true;
 eventButton.onclick=()=>onChange('event');officialButton.onclick=()=>onChange('official');
 function pressed(node,value){node.classList.toggle('active',value);node.setAttribute('aria-pressed',String(value));}
 return {update({mode,options,active,eventAvailable=false,eventVisible=false,officialAvailable=false,officialVisible=false}){
  levels.replaceChildren();levels.hidden=mode!=='2d'||options.length<2;
  for(const item of options){const node=doc.createElement('button');node.type='button';const label=item.label.replace(/来源层级\s*/,'');node.textContent=/^[LU]\d+$/.test(label)?translate('{0} 看台',[label]):translate(label);node.dataset.layerLevel=String(item.id);pressed(node,item.id===active);node.onclick=()=>onChange('level',item.id);levels.append(node);}
  eventButton.hidden=!eventAvailable;officialButton.hidden=true;
  pressed(eventButton,eventAvailable&&eventVisible);pressed(officialButton,officialAvailable&&officialVisible);
  status.textContent='';

 }};
}
