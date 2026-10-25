from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime,timezone
import json,subprocess,hashlib,gzip
root=Path('/Users/lilinhai/Projects/rea/shijiao-evidence/data-sources');out=root/'seat-assets';out.mkdir(exist_ok=True)
items=json.loads((root/'seat-asset-urls.json').read_text())
def fetch(item):
 p=out/(item['venue']+'.json')
 try:
  subprocess.run(['curl','--compressed','--fail','--silent','--show-error','--location','--max-time','60','--max-filesize','67108864','--output',str(p),item['url']],check=True,capture_output=True)
  raw=p.read_bytes(); compressed=raw.startswith(b'\x1f\x8b')
  if compressed:raw=gzip.decompress(raw);p.write_bytes(raw)
  data=json.loads(raw)
  meta={**item,'path':str(p),'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest(),'retrieved_at':datetime.now(timezone.utc).isoformat(),'transport':'public HTTPS GET via curl, no credentials','format':type(data).__name__}
  if isinstance(data,dict):
   meta['metadata']={k:v for k,v in data.items() if k!='variants'}
   meta['variants']={k:{'seats':len(v.get('seats',[])),'sections':len(v.get('sections',[])),'seat_example':v.get('seats',[])[:1],'keys':list(v)} for k,v in data.get('variants',{}).items()}
  elif isinstance(data,list):meta['records']=len(data);meta['record_example']=data[:1]
  return meta
 except Exception as e:return {**item,'error':str(e)}
with ThreadPoolExecutor(max_workers=3)as ex:result=list(ex.map(fetch,items))
(root/'seat-assets-manifest.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
for r in result:print(json.dumps(r,ensure_ascii=False)[:3500])
