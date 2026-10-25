from pathlib import Path
from datetime import datetime,timezone
import json,csv,math,hashlib,shutil
root=Path('/Users/lilinhai/Projects/rea/shijiao-evidence/data-sources')
venues=json.loads((root/'venues.json').read_text());geom=json.loads((root/'venue-geometry-profiles.json').read_text());sections=json.loads((root/'section-layout-references.json').read_text());assets=json.loads((root/'seat-assets-manifest.json').read_text());assetmap={x['venue']:x for x in assets}
rows=[]
for v in venues:
 id=v['id'];g=geom.get(id,{});s=sections.get(id,{});a=assetmap.get(id,{})
 rows.append({'id':id,'name':v['name'],'city':v['city'],'region':v['region'],'venue_reference_url':v.get('url'),'map_reference_url':v.get('mapUrl'),'geometry_evidence_label':g.get('evidence'),'geometry_sources':g.get('sources',[]),'section_source':s.get('source'),'section_note':s.get('note'),'static_seat_asset_url':a.get('url'),'static_seat_asset_local_path':a.get('path'),'static_seat_asset_sha256':a.get('sha256'),'note':'Missing asset URL does not establish absence of generated seat geometry.'})
(root/'venue-source-inventory.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
with (root/'venue-source-inventory.csv').open('w',encoding='utf-8-sig',newline='')as f:
 fields=['id','name','city','region','venue_reference_url','map_reference_url','geometry_evidence_label','geometry_sources','section_source','section_note','static_seat_asset_url']
 w=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore');w.writeheader()
 for row in rows:w.writerow({**row,'geometry_sources':json.dumps(row['geometry_sources'],ensure_ascii=False)})
normalized=[]
for a in assets:
 data=json.loads(Path(a['path']).read_text())
 if isinstance(data,list):
  t,n,r,i,z,level,depth,fx,fz,src,idx,y,tx,tz=data[0]
  normalized.append({'venue':a['venue'],'layout':None,'record_count':len(data),'source_file':a['path'],'decoded_first_seat':{'section':t,'rowLabel':n,'number':r,'position':[-i,y,-z],'yaw':math.atan2(fx,fz),'treadYaw':math.atan2(tx,tz),'source':src,'cadIndex':idx,'level':level,'depth':depth}})
 else:
  for layout,variant in data['variants'].items():
   if not variant['seats']:continue
   t=variant['seats'][0]
   normalized.append({'venue':a['venue'],'layout':layout,'record_count':len(variant['seats']),'source_file':a['path'],'upstream_reference':data.get('source'),'decoded_first_seat':{'section':t[0],'rowLabel':t[1],'number':t[2],'position':t[3:6],'yaw':math.atan2(-t[6],-t[7]),'treadYaw':math.atan2(-t[12],-t[13]),'level':str(t[8]),'depth':t[9],'chairWidth':t[10],'rowDepth':t[11],'source':'reference-model'}})
(root/'decoded-seat-examples.json').write_text(json.dumps({'method':'Analyst translation of captured data decoder rf/Wd; target scripts not executed.','examples':normalized},ensure_ascii=False,indent=2))
angles=[-72,-86,-100,-114,-138,-152,-166,-180,-194,-208,-222,-246,-260,-274,-288,-318,-332,-346,-360,-374,-388,-402]
ks=[{'id':str(i+1),'label':f'{i+1} 区','level':'lower','angle':a*math.pi/180,'span':14*math.pi/180}for i,a in enumerate(angles)]
ks += [{'id':str(i),'label':f'{i} 区','level':'middle','angle':(-54-(i-23)*12)*math.pi/180,'span':12*math.pi/180}for i in range(23,53)]
ks += [{'id':'floor-'+c.lower(),'label':c+' 侧站区','level':'floor','x':x,'z':z}for c,x,z in [('A',0,18),('B',-18,0),('C',0,-18),('D',18,0)]]
(root/'kspo-sections-derived.json').write_text(json.dumps({'method':'Analyst reproduction of the literal $f construction formula in data-CI2ywFAf.js; geometric reference, not official measured coordinates.','sections':ks},ensure_ascii=False,indent=2))
up=root/'upstream-observations';up.mkdir(exist_ok=True);meta=[]
for src,dst,url in [('/private/tmp/rea-flytix-viewer.html','flytix-viewer.html','https://venue.flytix.live/viewer?venue=hkc'),('/private/tmp/rea-flytix-viewer.js','viewer-DTZmpK2K.js','https://venue.flytix.live/assets/viewer-DTZmpK2K.js'),('/private/tmp/rea-flytix-hkc.js','hkc-0MKmUkEr.js','https://venue.flytix.live/assets/hkc-0MKmUkEr.js'),('/private/tmp/rea-flytix-kts.js','kts-D3A_eNdl.js','https://venue.flytix.live/assets/kts-D3A_eNdl.js')]:
 p=Path(src);shutil.copyfile(p,up/dst);b=p.read_bytes();meta.append({'url':url,'path':str(up/dst),'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'method':'public HTTPS GET, no credentials; not a REA retained browser capture'})
(up/'manifest.json').write_text(json.dumps({'retrieved_date':'2026-10-23','files':meta,'unavailable_reference':{'url':'https://venue.flytix.live/tools/kai-tak/README.md','status':404,'note':'Development path is mentioned by the shipped script; public access was not available.'}},ensure_ascii=False,indent=2))
print({'venues':len(rows),'geometry_profiles':len(geom),'section_profiles':len(sections),'seat_assets':len(assets),'seat_json_bytes':sum(x['bytes']for x in assets),'decoded_examples':len(normalized),'kspo_derived_sections':len(ks)})
