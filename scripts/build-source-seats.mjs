import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
const source=new URL('../../shijiao-evidence/data-sources/',import.meta.url),out=new URL('../data/source-seats/',import.meta.url);
mkdirSync(out,{recursive:true});
const index={schemaVersion:1,venues:{}};
for(const entry of JSON.parse(readFileSync(new URL('seat-assets-manifest.json',source)))){
 const bytes=readFileSync(new URL(`seat-assets/${entry.venue}.json`,source));
 if(createHash('sha256').update(bytes).digest('hex')!==entry.sha256)throw new Error(`Source hash mismatch: ${entry.venue}`);
 const data=JSON.parse(bytes),kai=Array.isArray(data),variants=kai?{bowl:{label:'固定看台（无场次舞台）',seats:data}}:data.variants;
 const metadata={source:entry.url,upstreamSource:kai?null:data.source,assetSha256:entry.sha256,schema:kai?'kai-cad-14':'reference-xyz-14',defaultLayout:kai?'bowl':data.defaultLayout,
  layouts:Object.entries(variants).map(([id,v])=>({id,label:v.label||id,count:v.seats.length,sectionCount:new Set(v.seats.map(seat=>String(seat[0]))).size}))};
 writeFileSync(new URL(entry.venue+'.json',out),JSON.stringify({metadata,variants})+'\n');index.venues[entry.venue]=metadata;
}
writeFileSync(new URL('index.json',out),JSON.stringify(index,null,2)+'\n');
console.log('Built source seat assets:',Object.keys(index.venues).length);
