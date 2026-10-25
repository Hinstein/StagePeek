import {readdirSync,readFileSync} from 'node:fs';
import {join} from 'node:path';

export class CandidateEventRepository {
  constructor(directory){this.directory=directory;}
  list(){
    const sets=[],events=[],venues=[];
    let files=[];try{files=readdirSync(this.directory).filter(file=>file.endsWith('.json')&&file!=='index.json').sort();}catch{return {status:'empty',sets,events,venues};}
    for(const file of files){
      try{
        const data=JSON.parse(readFileSync(join(this.directory,file),'utf8'));
        if(data.status!=='candidate'||!Array.isArray(data.events)||!Array.isArray(data.venues))continue;
        sets.push({file,status:data.status,artist:data.artist,tour:data.tour,events:data.events.length,venues:data.venues.length,generatedAt:data.generatedAt});
        events.push(...data.events);venues.push(...data.venues);
      }catch{/* An invalid candidate cannot enter the public catalog. */}
    }
    return {status:sets.length?'candidate':'empty',sets,events,venues};
  }
}
