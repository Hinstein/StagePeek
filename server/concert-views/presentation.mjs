const venues=new Map([
 ['taipei-music-center',['台北流行音乐中心','台湾']],
 ['ntu-sports-center',['台大综合体育馆','台湾']],
 ['ticc-taipei',['台北国际会议中心 TICC','台湾']],
 ['taipei-dome',['台北大巨蛋','台湾']],
 ['taipei-arena',['台北小巨蛋','台湾']],
 ['twcv-the-o2-arena-london',['The O2 Arena','英国']],
 ['twcv-accor-arena-paris',['Accor Arena','法国']],
 ['twcv-ziggo-dome-amsterdam',['Ziggo Dome','荷兰']],
 ['twcv-uber-arena-berlin',['Uber Arena','德国']],
 ['twcv-kia-forum-los-angeles',['Kia Forum','美国']],
 ['twcv-united-center-chicago',['United Center','美国']],
 ['twcv-ubs-arena-new-york',['UBS Arena','美国']],
 ['twcv-prudential-center-newark',['Prudential Center','美国']],
 ['twcv-state-farm-arena-atlanta',['State Farm Arena','美国']]
]);

export function presentConcertVenue(venue){
 const [name,country]=venues.get(venue.id)||[venue.name,venue.country||(venue.id==='taipei-dome'?'台湾':'香港')];
 return {...venue,name,country};
}
