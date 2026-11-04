import {existsSync,readFileSync,realpathSync} from 'node:fs';
import {resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {digest,seatDigest,validPolygon} from './ticket-map-draft.mjs';

// Immutable local previews remain separate from published event layouts.
export function loadTicketMapPreviews({venues,root=fileURLToPath(new URL('../../',import.meta.url))}){
  const base=realpathSync(root),directory='data/research-events/ticket-map-pipeline/';
  const file=path=>{
    if(typeof path!=='string')return null;
    const target=resolve(base,path);
    if(!target.startsWith(base+sep)||!existsSync(target))return null;
    const real=realpathSync(target);return real.startsWith(base+sep)?real:null;
  };
  const readJson=path=>{
    const target=file(path);if(!target)return null;
    const bytes=readFileSync(target);
    try{return {value:JSON.parse(bytes.toString('utf8')),sha256:digest(bytes)};}catch{return null;}
  };
  const entries=readJson(directory+'index.json')?.value.layouts||[];
  const sourceBytes=source=>{
    const target=file(source?.path);if(!target)return null;
    const bytes=readFileSync(target);return digest(bytes)===source.sha256?bytes:null;
  };
  const get=id=>{
    if(!/^[a-z0-9-]+$/.test(id||''))return null;
    const entry=entries.find(item=>item.id===id);if(!entry||!/^[a-f0-9]{64}$/.test(entry.sha256))return null;
    const document=readJson(directory+entry.sha256+'.json');if(!document||document.sha256!==entry.sha256)return null;
    const draft=document.value;
    if(draft.id!==id||draft.venueId!==entry.venueId||draft.seatLayoutId!==entry.seatLayoutId||draft.status!=='research-preview'||draft.publicationStatus!=='not-published')return null;
    if(draft.registration?.allowDistances!==false||draft.registration?.allowPublication!==false)return null;
    if(![draft.stage,draft.zones,draft.equipment].every(items=>Array.isArray(items)&&items.every(shape=>validPolygon(shape.polygon)&&(shape.holes||[]).every(validPolygon))))return null;
    const venue=venues.get(entry.venueId,entry.seatLayoutId);
    if(!venue?.sourceSeats||venue.seatLayout.id!==entry.seatLayoutId||venue.seatLayout.assetSha256!==draft.fixedSeats?.assetSha256||venue.sourceSeats.length!==draft.fixedSeats.count||seatDigest(venue.sourceSeats)!==draft.fixedSeats.identityPositionSha256)return null;
    if(!sourceBytes(draft.source)||!sourceBytes(draft.eventSource))return null;
    return {...draft,version:entry.sha256};
  };
  return {
    get,
    list:venueId=>entries.filter(entry=>entry.venueId===venueId).flatMap(entry=>{
      const draft=get(entry.id);return draft?[{id:draft.id,venueId,seatLayoutId:draft.seatLayoutId,label:entry.label,dates:draft.event.dates,source:draft.eventSource.url,version:draft.version}]:[];
    }),
    artifact(id){
      const draft=get(id);if(!draft)return null;
      const bytes=sourceBytes(draft.source);if(!bytes)return null;
      const contentType=bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))?'image/png':bytes[0]===255&&bytes[1]===216&&bytes[2]===255?'image/jpeg':null;
      return contentType?{bytes,contentType}:null;
    }
  };
}
