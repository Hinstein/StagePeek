const root=document.querySelector('[data-venue-directory]');
if(root){
  const cards=[...root.querySelectorAll('[data-venue-card]')],groups=[...root.querySelectorAll('[data-region-group],[data-country-group]')],search=root.querySelector('[data-venue-search]'),result=root.querySelector('[data-venue-results]'),empty=root.querySelector('[data-venue-empty]');
  const countText=(count,total)=>`${count} / ${total}`;
  const apply=(region='all')=>{
    const query=search.value.trim().toLocaleLowerCase();let visible=0;
    for(const card of cards){const matchesRegion=region==='all'||card.dataset.region===region;const matchesSearch=!query||card.dataset.search.includes(query);const visibleCard=matchesRegion&&matchesSearch;card.hidden=!visibleCard;if(visibleCard)visible+=1;}
    for(const group of groups)group.hidden=!group.querySelector('[data-venue-card]:not([hidden])');
    for(const button of root.querySelectorAll('[data-region-filter]')){const active=button.dataset.regionFilter===region;button.setAttribute('aria-pressed',String(active));}
    result.textContent=countText(visible,cards.length);empty.hidden=visible>0;
  };
  root.querySelectorAll('[data-region-filter]').forEach(button=>button.addEventListener('click',()=>apply(button.dataset.regionFilter)));
  search.addEventListener('input',()=>{const active=root.querySelector('[data-region-filter][aria-pressed="true"]');apply(active?.dataset.regionFilter||'all');});
  apply();
}
