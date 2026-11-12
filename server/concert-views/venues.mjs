import {readFileSync,writeFileSync,renameSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
import {sourceSeatStore} from './source-seats.mjs';
import {normalizeVenueManifest,validateVenueManifest,writeVenueManifest} from '../venue-import.mjs';
import {venueCountry} from '../venue-country.mjs';

export function loadVenues(path=new URL('../../data/concert-views/o2/venues.json',import.meta.url),options={}) {
  const file=path instanceof URL?fileURLToPath(path):path;
  const sourceSeats=sourceSeatStore(join(dirname(file),'source-seats'));
  const drafts=options.localDrafts===true?readLocalDrafts():null;
  const seatStore=id=>drafts?.venues[id]?drafts.store(id):sourceSeats;
  const includeResearch=options.includeResearch===true;
  const readData=()=>({...Object.fromEntries(Object.entries(JSON.parse(readFileSync(file,'utf8')).venues).filter(([,venue])=>includeResearch||!venue.researchOnly)),...drafts?.venues});
  let data=readData();
  const reload=()=>{sourceSeats.clear();drafts?.clear();data=readData();return data;};
  const publish=manifest=>{
    const venue=normalizeVenueManifest(manifest),all=JSON.parse(readFileSync(file,'utf8'));
    if(all.venues[venue.id])throw Object.assign(new Error('Venue already exists'),{code:'VENUE_EXISTS',status:409});
    all.venues[venue.id]=venue;all.builtAt=new Date().toISOString();
    mkdirSync(dirname(file),{recursive:true});const tmp=file+'.tmp';writeFileSync(tmp,JSON.stringify(all,null,2)+'\n',{mode:0o600});renameSync(tmp,file);
    writeVenueManifest(join(dirname(file),'manual-venues'),manifest);reload();return venue;
  };
  return {
    catalog:()=>Object.values(data).map(({id,name,city,accuracy,ticketLabelCount,sections})=>{const metadata=seatStore(id).metadata(id),layout=metadata?.layouts.find(x=>x.id===metadata.defaultLayout);return {id,name,city,country:venueCountry(city),ticketLabelCount:layout?.sectionCount??ticketLabelCount,sectionCount:layout?.sectionCount??sections.length,sourceSeatCount:layout?.count??0,accuracy:layout?{...accuracy,sectionLabels:'source-layout-reference',seatDataStatus:'full-retained-asset',sourceLayout:layout.id,metricCalibrated:false,completeSeatInventory:false,coverage:`默认来源布局 ${layout.id}：${layout.count} 条座位记录。未独立实测校准。`}:accuracy};}),
    ids:()=>Object.keys(data),
    get:(id,layout)=>data[id]?seatStore(id).enhance(data[id],layout):null,
    reload,
    validate:validateVenueManifest,
    publish,
    resolve(id,input) {
      const base=data[id];if(!base)return {status:'unknown-venue'};
      const store=seatStore(id),v=store.enhance(base,input.layout);if(!v)return {status:'unknown-layout'};
      const section=String(input.section??'').trim(),row=String(input.row??'').trim(),seat=String(input.seat??'').trim();
      if([section,row,seat].some(x=>x.length>40))return {status:'invalid-input'};
      const s=v.sections.find(x=>x.ticketLabels.includes(section));
      if(!s)return {status:'unknown-section',section,row,seat};
      if(v.sourceSeats){
        const matches=store.find(v,s.id,row,seat);
        if(matches.length>1)return {status:'ambiguous',section,row,seat,sectionId:s.id,position:null,positionStatus:'ambiguous-source-identity'};
        if(matches.length===1)return {status:'matched',...matches[0],sectionId:s.id};
        return {status:'unverified',section,row,seat,sectionId:s.id,position:null,positionStatus:'unavailable'};
      }
      const sample=s.samples.find(x=>x.section===section&&x.row===row&&x.seat===seat);
      if(!sample)return {status:'unverified',section,row,seat,sectionId:s.id,sectionCenter:s.center,availableSamples:s.samples,positionStatus:'section-only'};
      return {status:'matched',...sample,sectionId:s.id};
    }
  };
}

function readLocalDrafts(){
  const root=fileURLToPath(new URL('../../',import.meta.url));
  const config=JSON.parse(readFileSync(join(root,'data/concert-views/regional-drafts.json'),'utf8'));
  const extraDirectory=join(root,'data/concert-views/regional-sources');
  const extra=JSON.parse(readFileSync(join(extraDirectory,'venues.json'),'utf8'));
  if(config.schemaVersion!==1||!Array.isArray(config.venueIds)||new Set(config.venueIds).size!==config.venueIds.length||config.venueIds.some(id=>!['taipei-arena','taipei-dome','asiaworld-arena','asiaworld-hall-10','asiaworld-runway-11','asiaworld-summit-hall-2','asiaworld-viva','hkcec-hall-5bc','hong-kong-axa-dreamland','hong-kong-coliseum','hong-kong-macpherson-stadium','kai-tak-arena','kai-tak-stadium','taipei-music-center','ntu-sports-center','ticc-taipei',...Object.keys(extra.venues)].includes(id)))throw Error('Invalid regional draft scope');
  const manifest=JSON.parse(readFileSync(join(root,'data/venues.json'),'utf8'));
  const sourceSeats=sourceSeatStore(join(root,'data/source-seats')),regionalSeats=sourceSeatStore(extraDirectory);
  const store=id=>regionalSeats.metadata(id)?regionalSeats:sourceSeats;
  const venues=Object.fromEntries(config.venueIds.map(id=>{
    const venue=extra.venues[id]||manifest.venues[id];
    if(!venue)throw Error('Regional venue unavailable');
    const geometry={...venue.geometry,...(store(id).metadata(id)?{displayBasis:'source-row-ribbons'}:{})};
    if(id==='kai-tak-stadium')delete geometry.stage;
    if(id==='hong-kong-coliseum')geometry.closedBowl=true;
    return [id,{...venue,researchOnly:true,publicationStatus:'not-published',rightsDecision:'undecided',geometry,accuracy:{...venue.accuracy,metricCalibrated:false,completeSeatInventory:false}}];
  }));
  return {venues,store,clear(){sourceSeats.clear();regionalSeats.clear();}};
}
