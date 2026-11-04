const venues=new Map([
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
 const [name,country]=venues.get(venue.id);
 return {...venue,name,country};
}
