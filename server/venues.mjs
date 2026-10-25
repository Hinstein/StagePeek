import {readFileSync,writeFileSync,renameSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
import {sourceSeatStore} from './source-seats.mjs';
import {normalizeVenueManifest,validateVenueManifest,writeVenueManifest} from './venue-import.mjs';
import {venueCountry} from './venue-country.mjs';

export function loadVenues(path=new URL('../data/venues.json',import.meta.url)) {
  const file=path instanceof URL?fileURLToPath(path):path;
  const sourceSeats=sourceSeatStore(join(dirname(file),'source-seats'));
  let data=JSON.parse(readFileSync(file,'utf8')).venues;
  const reload=()=>{sourceSeats.clear();data=JSON.parse(readFileSync(file,'utf8')).venues;return data;};
  const publish=manifest=>{
    const venue=normalizeVenueManifest(manifest),all=JSON.parse(readFileSync(file,'utf8'));
    if(all.venues[venue.id])throw Object.assign(new Error('Venue already exists'),{code:'VENUE_EXISTS',status:409});
    all.venues[venue.id]=venue;all.builtAt=new Date().toISOString();
    mkdirSync(dirname(file),{recursive:true});const tmp=file+'.tmp';writeFileSync(tmp,JSON.stringify(all,null,2)+'\n',{mode:0o600});renameSync(tmp,file);
    writeVenueManifest(join(dirname(file),'manual-venues'),manifest);reload();return venue;
  };
  return {
    catalog:()=>Object.values(data).map(({id,name,city,accuracy,ticketLabelCount,sections})=>{const metadata=sourceSeats.metadata(id),layout=metadata?.layouts.find(x=>x.id===metadata.defaultLayout);return {id,name,city,country:venueCountry(city),ticketLabelCount:layout?.sectionCount??ticketLabelCount,sectionCount:layout?.sectionCount??sections.length,sourceSeatCount:layout?.count??0,accuracy:layout?{...accuracy,seatDataStatus:'full-retained-asset',sourceLayout:layout.id,coverage:`默认来源布局 ${layout.id}：${layout.count} 条座位记录。未独立实测校准。`}:accuracy};}),
    ids:()=>Object.keys(data),
    get:(id,layout)=>data[id]?sourceSeats.enhance(data[id],layout):null,
    reload,
    validate:validateVenueManifest,
    publish,
    resolve(id,input) {
      const base=data[id];if(!base)return {status:'unknown-venue'};
      const v=sourceSeats.enhance(base,input.layout);if(!v)return {status:'unknown-layout'};
      const section=String(input.section??'').trim(),row=String(input.row??'').trim(),seat=String(input.seat??'').trim();
      if([section,row,seat].some(x=>x.length>40))return {status:'invalid-input'};
      const s=v.sections.find(x=>x.ticketLabels.includes(section));
      if(!s)return {status:'unknown-section',section,row,seat};
      if(v.sourceSeats){
        const matches=sourceSeats.find(v,section,row,seat);
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
