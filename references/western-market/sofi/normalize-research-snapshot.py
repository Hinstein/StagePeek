import json,re,collections,hashlib,shutil,csv
from pathlib import Path
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parent
def save(n,v): (ROOT/n).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
class Areas(HTMLParser):
 def __init__(self):super().__init__();self.items=[]
 def handle_starttag(self,t,a):
  if t=='area':self.items.append(dict(a))
manifest=[];summaries={}
for host in ['rams','chargers']:
 source=f'https://{host}.io-media.com/web/confignew.json'
 for suffix,target,remote in [('venue-index.html','index.html',f'https://{host}.io-media.com/web/index.html'),('clientConfig.js','clientConfig.js',f'https://{host}.io-media.com/web/clientConfig.js'),('confignew.json','public-config.json',source)]:
  f=ROOT/f'{host}-{target}'
  assert f.exists(), f
  manifest.append({'file':f.name,'url':remote,'bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()})
 config=json.loads((ROOT/f'{host}-public-config.json').read_text())['cmdData'];grouped={};views=[]
 for e in config['elements']:
  if e['elementType']!='section':continue
  m=re.fullmatch(r'Sub_Section_(.+)_([^_]+)_([^_]+)',e['elementDaeModelName']);assert m,e
  s,r,t=m.groups();data=json.loads(e['data'] or '{}')
  v={'elementId':e['elementId'],'viewId':e['elementDaeModelName'],'section':s,'rowToken':r,'seatToken':t,'levelName':data.get('levelName',''),'numericRowAndSeatTokens':r.isdigit() and t.isdigit(),'interiorView':r=='Interior','cameraAngleTiltX':e['cameraAngleTiltX'],'cameraAngleTiltY':e['cameraAngleTiltY'],'source':source}
  views.append(v);grouped.setdefault(s,[]).append(v)
 sections=[{'id':s,'baseId':s.removesuffix('WC'),'accessibleSuffix':s.endswith('WC'),'levelNames':sorted({v['levelName'] for v in vs}),'sampledRowTokens':sorted({v['rowToken'] for v in vs}),'sampledSeatTokens':sorted({v['seatToken'] for v in vs}),'sampleViewCount':len(vs),'views':vs} for s,vs in sorted(grouped.items())]
 save(f'{host}-sections-normalized.json',{'source':source,'retrieved':'2026-10-24','status':'SAMPLED_VIEW_METADATA_NOT_EXHAUSTIVE_SEAT_INVENTORY','coordinates':'NO_METRIC_XYZ_IN_THIS_DATASET','currency':'Officially linked current endpoint; pricing and metadata currency not established','reuse':'No open commercial asset reuse license established','sections':sections})
 polygons=[];layercounts=[];index={e['elementDaeModelName']:e for e in config['elements']}
 for layer in config['venueLayers']:
  stem=Path(layer['areaMapFileName']).stem;f=ROOT/f'{host}-{stem}-map.json';assert f.exists(),f
  manifest.append({'file':f.name,'url':f'https://{host}.io-media.com/media/{layer["areaMapFileName"]}','bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()})
  start=len(polygons)
  for camera,value in json.loads(f.read_text()).items():
   parser=Areas();parser.feed(value['areas'])
   for a in parser.items:
    assert a['alt'] in index,a['alt'];assert a['shape']=='poly'
    coords=[int(x) for x in a['coords'].split(',')];assert len(coords)%2==0
    polygons.append({'layer':stem,'camera':camera,'viewId':a['alt'],'elementType':index[a['alt']]['elementType'],'points':[coords[i:i+2] for i in range(0,len(coords),2)]})
  layercounts.append({'layer':stem,'polygonCount':len(polygons)-start})
 save(f'{host}-map-polygons-normalized.json',{'coordinateSystem':'2D_SCREEN_IMAGE_PIXELS_NOT_METRES_OR_3D','warning':'Counts across cameras/layers are not seat counts','polygons':polygons})
 summaries[host]={'elementTypes':dict(collections.Counter(e['elementType'] for e in config['elements'])),'sectionIdentifiers':len(sections),'baseIdentifiers':len({s['baseId'] for s in sections}),'sampledViews':len(views),'numericRowAndSeatTokenViews':sum(v['numericRowAndSeatTokens'] for v in views),'interiorViews':sum(v['interiorView'] for v in views),'uniqueViewIds':len({v['viewId'] for v in views}),'layers':layercounts,'polygonsAcrossCamerasAndLayers':len(polygons),'sectionViewsMissingMapPolygon':sorted({v['viewId'] for v in views}-{p['viewId'] for p in polygons})}
 with (ROOT/f'{host}-sampled-views.csv').open('w') as out:
  w=csv.DictWriter(out,fieldnames=views[0]);w.writeheader();w.writerows(views)
ram=json.loads((ROOT/'rams-sections-normalized.json').read_text())['sections'];cha=json.loads((ROOT/'chargers-sections-normalized.json').read_text())['sections']
r={s['id'] for s in ram};c={s['id'] for s in cha}
summaries['comparison']={'ramsOnly':sorted(r-c),'chargersOnly':sorted(c-r),'sharedIdentifiers':len(r&c),'sharedSampleViewIds':len({v['viewId'] for s in ram for v in s['views']}&{v['viewId'] for s in cha for v in s['views']})}
save('coverage-summary.json',summaries)
assert (ROOT/'iomedia-v220-script.min.js').exists()
f=ROOT/'iomedia-v220-script.min.js';manifest.append({'file':f.name,'url':'https://d32ikx2sw2easi.cloudfront.net/v220/web/js/com/iomedia/vv/script.min.js','bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()})
save('source-manifest.json',{'retrieved':'2026-10-24','successfulDownloads':manifest,'pathResolution':'v220 script sets VIEW_MEDIA_PATH=../ for day view and MEDIA_PATH=media/; areaMapFileName therefore resolves to /media/venueview/models/*.json, not /web/venueview/models/*.json. Wrong-base request returned HTTP403.','license':'Public research copies only; no open commercial asset reuse license established; no imagery downloaded.'})
print(json.dumps(summaries,indent=2))
