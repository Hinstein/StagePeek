const PREFIX_COUNTRIES=new Map([
  ['纽约都市圈','美国'],['洛杉矶地区','美国'],['伦敦','英国'],
  ['中国内地','中国大陆'],['中国大陆','中国大陆'],['中国香港','中国香港'],
  ['中国澳门','中国澳门'],['中国台湾','中国台湾']
]);

export function venueCountry(venue){
  if(venue?.country)return venue.country;
  const prefix=String(venue?.city||'').split('·',1)[0].trim();
  return PREFIX_COUNTRIES.get(prefix)||prefix||'其他';
}

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
