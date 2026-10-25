const PREFIX_COUNTRIES=new Map([
  ['纽约都市圈','美国'],['洛杉矶地区','美国'],['伦敦','英国'],
  ['中国内地','中国大陆'],['中国大陆','中国大陆'],['中国香港','中国香港'],
  ['中国澳门','中国澳门'],['中国台湾','中国台湾']
]);

/** Return the country/region label used to group the venue picker. */
export function venueCountry(city=''){
  const prefix=String(city).split('·',1)[0].trim();
  return PREFIX_COUNTRIES.get(prefix)||prefix||'其他';
}
