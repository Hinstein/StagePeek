const PREFIX_COUNTRIES=new Map([
  ['纽约都市圈','美国'],['洛杉矶地区','美国'],['伦敦','英国'],
  ['中国内地','中国大陆'],['中国大陆','中国大陆'],['中国香港','中国香港'],
  ['中国澳门','中国澳门'],['中国台湾','中国台湾']
]);

const COUNTRY_REGIONS=new Map([
  ['中国大陆','asia'],['中国香港','asia'],['中国澳门','asia'],['中国台湾','asia'],
  ['日本','asia'],['韩国','asia'],['泰国','asia'],['马来西亚','asia'],['印度尼西亚','asia'],['新加坡','asia'],
  ['荷兰','europe'],['英国','europe'],['德国','europe'],['法国','europe'],['意大利','europe'],['西班牙','europe'],
  ['美国','north-america'],['加拿大','north-america'],['墨西哥','north-america'],
  ['澳大利亚','oceania'],['新西兰','oceania']
]);

export function venueCountry(venue){
  if(venue?.country)return venue.country;
  const prefix=String(venue?.city||'').split('·',1)[0].trim();
  return PREFIX_COUNTRIES.get(prefix)||prefix||'其他';
}

export function venueRegion(venue){return COUNTRY_REGIONS.get(venueCountry(venue))||'other';}

export function groupVenuesByCountry(venues=[]){
  const groups=new Map();
  for(const venue of venues){
    const country=venueCountry(venue);
    if(!groups.has(country))groups.set(country,[]);
    groups.get(country).push(venue);
  }
  return [...groups.entries()]
    .sort(([a],[b])=>a.localeCompare(b,'zh-CN'))
    .map(([country,items])=>({country,venues:[...items].sort((a,b)=>a.name.localeCompare(b.name,'zh-CN'))}));
}

export function groupVenuesByRegion(venues=[]){
  const groups=new Map();
  for(const venue of venues){const region=venueRegion(venue);if(!groups.has(region))groups.set(region,[]);groups.get(region).push(venue);}
  return [...groups.entries()].map(([region,items])=>({region,venues:groupVenuesByCountry(items)}));
}
