import {groupVenuesByCountry} from './catalog.mjs';
import {countryName,venueName} from './translations/venue-labels.mjs';

export function renderCountryVenuePicker({catalog,countrySelect,select,country,selectedId='',locale='en',placeholderText}){
  const groups=groupVenuesByCountry(catalog).sort((a,b)=>countryName(a.country,locale).localeCompare(countryName(b.country,locale),locale));
  countrySelect.replaceChildren();
  for(const group of groups){const option=element('option',`${countryName(group.country,locale)} (${group.venues.length})`);option.value=group.country;countrySelect.append(option);}
  countrySelect.value=country;countrySelect.disabled=false;
  const placeholder=element('option',placeholderText);placeholder.value='';placeholder.disabled=true;select.replaceChildren(placeholder);
  const venues=groups.find(group=>group.country===country)?.venues||[];
  for(const venue of [...venues].sort((a,b)=>Number(a.locked)-Number(b.locked)||venueName(a,locale).localeCompare(venueName(b,locale),locale))){const option=element('option',venueName(venue,locale)+(venue.locked?' · Pro':''));option.value=venue.id;select.append(option);}
  select.value=selectedId;select.disabled=!venues.length;
}

function element(tag,text){const node=document.createElement(tag);node.textContent=text;return node;}
