export function groupEventsByDate(events=[]){
  const groups=new Map();
  for(const event of events){
    const date=String(event.localDate||'').slice(0,10)||'unknown';
    if(!groups.has(date))groups.set(date,[]);
    groups.get(date).push(event);
  }
  return [...groups.entries()].sort(([a],[b])=>a.localeCompare(b)).map(([date,items])=>({date,events:items}));
}
