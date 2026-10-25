"""PROTOTYPE: normalize manually checked section labels; all geometry remains estimated."""
import json, math, fitz, pathlib, hashlib
root=pathlib.Path(__file__).parent

def anchor(label, px, py, cx,cy,sx,sy):
 return {'id':str(label),'angle':round(math.atan2((py-cy)/sy,(px-cx)/sx),5),'sourceAnchor':[round(px,2),round(py,2)],'tier':0}
# Manually transcribed label centers in the 1780 x 1376 displayed official diagram.
met100=[('101',914,690),('103',915,658),('104',919,622),('106',937,586),('108',973,577),('109',1004,570),('110',1035,565),('112',1092,562),('113',1126,560),('114',1157,562),('116',1214,566),('117',1246,571),('118',1280,578),('121',1313,588),('123',1328,622),('124',1337,657),('126',1343,690),('128',1339,725),('129',1330,758),('131',1314,789),('133',1281,803),('134',1247,811),('135',1214,816),('137',1166,821),('139',1126,822),('140',1084,822),('142',1044,817),('143',1004,811),('144',972,805),('146',936,786),('148',921,759),('149',916,726)]
met300=[('301',620,690),('302',614,635),('303',624,571),('304',645,507),('305',668,448),('306',702,390),('307',744,339),('308',797,321),('309',850,309),('310',912,297),('311',974,286),('312',1036,281),('313',1095,280),('314',1155,280),('315',1214,285),('316',1276,292),('317',1337,300),('318',1397,310),('319',1449,321),('320',1504,340),('321',1547,391),('322',1583,447),('323',1605,508),('324',1626,570),('325',1637,635),('326',1632,690),('327',1638,746),('328',1624,806),('329',1604,869),('330',1582,929),('331',1549,985),('332',1505,1043),('333',1448,1062),('334',1397,1077),('335',1335,1090),('336',1276,1100),('337',1214,1107),('338',1155,1110),('339',1094,1110),('340',1035,1107),('341',973,1101),('342',912,1092),('343',851,1079),('344',798,1062),('345',745,1044),('346',702,988),('347',667,932),('348',647,871),('349',626,809),('350',620,747)]
met=[anchor(*a,1125,692,500,420) for a in met100+met300]
for s in met:s['tier']=0 if int(s['id'])<200 else 2
# SoFi Level 2 (official page links a map dated 2021-11-16). Lower bowl only.
sofiRaw=[('100',796,550),('101',754,535),('102',710,531),('103',663,532),('104',621,537),('105',577,549),('C106',537,575),('C107',516,611),('C108',501,654),('C109',491,704),('C110',486,757),('VIP111',486,806),('VIP112',486,855),('C113',487,906),('C114',489,947),('C115',499,992),('C116',516,1044),('C117',537,1086),('C118',562,1114),('119',583,1115),('120',620,1132),('121',660,1134),('122',711,1135),('123',756,1128),('124',793,1114),('C125',825,1120),('C126',837,1078),('C127',855,1042),('C128',870,992),('C129',879,947),('C130',878,905),('VIP131',880,856),('VIP132',880,806),('C133',877,757),('C134',877,711),('C135',872,665),('C136',857,616),('C137',841,575)]
# Map's long axis is vertical. Rotate normalized anchors to a common horizontal long axis.
sofi=[]
for label,x,y in sofiRaw:
 s=anchor(label,y,-x,833,-686,300,195);s['sourceAnchor']=[x,y];sofi.append(s)
# Tottenham text anchors are taken directly from the official vector PDF.
p=fitz.open(root.parent/'western-market-research/tottenham/THFC-2627-Category-B-map.pdf')[0]
tot=[]
for b in p.get_text('dict')['blocks']:
 for l in b.get('lines',[]):
  for t in l['spans']:
   label=t['text'].strip();box=t['bbox'];x=(box[0]+box[2])/2;y=(box[1]+box[3])/2
   if label.isdigit() and 100<=int(label)<=599 and x<680 and 180<y<680:
    s=anchor(label,x,y,363,434,265,205)
    s['tier']=0 if int(label)<200 else (1 if int(label)<300 else (2 if int(label)<500 else 3))
    tot.append(s)
# Tier radii, elevations and row patterns are ORIGINAL ESTIMATES, not extracted measurements.
venues={
 'metlife':{'name':'MetLife Stadium','city':'纽约都市圈 · East Rutherford','artist':'Kendrick Lamar & SZA · 2025','capacity':'82,500（体育用途）','sections':met,'tiers':[[99,66,3,22,12],[125,88,17,18,10],[156,115,31,27,18]],'source':'https://www.metlifestadium.com/events-tickets/seating-charts','sourceTitle':'官方完整座位图（2026）','coverage':'100／300 层已核对的普通分区样本；不含 200 层、包厢及小型后缀区'},
 'sofi':{'name':'SoFi Stadium','city':'洛杉矶地区 · Inglewood','artist':'The Weeknd / Kendrick & SZA · 2025','capacity':'约 70,000（常规）','sections':sofi,'tiers':[[91,63,3,21,12]],'source':'https://www.therams.com/game-day/navigating','sourceTitle':'Rams 官方 Level 2 地图','coverage':'只演示 Level 2 下层看台；官方当前页面所链接的图纸标注为 2021 年'},
 'tottenham':{'name':'Tottenham Hotspur Stadium','city':'伦敦 · Tottenham','artist':'Kendrick & SZA · 2025 / Travis Scott · 2024','capacity':'62,850（体育用途）','sections':tot,'tiers':[[81,55,3,18,10],[106,75,15,20,12],[127,91,27,20,12],[148,110,36,22,15]],'source':'https://resources.thfc.pulselive.com/thfc/document/2026/08/13/dcd3483a-2f97-41cb-8ea6-198c65a8c634/THFC-2627-Official-Category-B-Pricing-Map-94-.pdf','sourceTitle':'官方 2026/27 分区 PDF','coverage':'官方票价图可提取的分区样本；South Stand 在粗模型中按层级简化'}
}
for v in venues.values():
 v['sections'].sort(key=lambda s:(s['tier'],s['angle']))
 for s in v['sections']:
  same=[x for x in v['sections'] if x['tier']==s['tier'] and x is not s]
  delta=min((abs(math.atan2(math.sin(x['angle']-s['angle']),math.cos(x['angle']-s['angle']))) for x in same),default=.15)
  s['halfAngle']=round(min(.13,max(.012,delta*.43)),5)
 v['sectionCount']=len(v['sections'])
out={'kind':'THROWAWAY_PROTOTYPE','coordinateStatus':'ESTIMATED_NOT_SURVEYED','rowSeatStatus':'SYNTHETIC_30_ROWS_24_SEATS_NOT_TICKET_VERIFIED','stageStatus':'GENERIC_NOT_ARTIST_SPECIFIC','generated':'2026-10-23','venues':venues}
(root/'venue-data.json').write_text(json.dumps(out,ensure_ascii=False,indent=2))
print({k:len(v['sections']) for k,v in venues.items()})
