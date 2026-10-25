import test from 'node:test';
import assert from 'node:assert/strict';

const sample={id:'0A0064C8E971D777',name:'JAŸ-Z 30',url:'https://www.ticketmaster.com/event/0A0064C8E971D777',dates:{start:{localDate:'2026-10-24',localTime:'20:00:00'},timezone:'America/Los_Angeles',status:{code:'onsale'}},seatmap:{staticUrl:'https://mapsapi.tmol.io/maps/geometry/3/event/0A0064C8E971D777/staticImage?type=png&systemId=HOST'},_embedded:{venues:[{name:'SoFi Stadium',city:{name:'Inglewood'},country:{countryCode:'US'}}]},classifications:[{segment:{name:'Music'}}]};

test('Ticketmaster adapter stays server-side and normalizes public event metadata',async()=>{
  const {TicketmasterProvider}=await import('../server/ticketing.mjs');let requested;
  const provider=new TicketmasterProvider({apiKey:'test_key_12345678',fetch:async url=>{requested=new URL(url);return new Response(JSON.stringify(sample),{status:200,headers:{'content-type':'application/json'}});}});
  const event=await provider.event(sample.id);
  assert.equal(event.provider,'ticketmaster');assert.equal(event.providerEventId,sample.id);assert.equal(event.venue.countryCode,'US');assert.equal(event.seatmap.staticUrl,sample.seatmap.staticUrl);assert.equal(requested.searchParams.get('apikey'),'test_key_12345678');
});

test('Ticketmaster adapter does not make network requests without a key',async()=>{
  const {TicketmasterProvider}=await import('../server/ticketing.mjs');let called=false;
  const provider=new TicketmasterProvider({fetch:async()=>{called=true;}});
  await assert.rejects(()=>provider.search({city:'Inglewood'}),error=>error.code==='TICKETMASTER_NOT_CONFIGURED');assert.equal(called,false);
});

test('Ticketmaster search bounds size and returns normalized events',async()=>{
  const {TicketmasterProvider}=await import('../server/ticketing.mjs');let requested;
  const provider=new TicketmasterProvider({apiKey:'test_key_12345678',fetch:async url=>{requested=new URL(url);return new Response(JSON.stringify({_embedded:{events:[sample]},page:{size:50,totalElements:1}}),{status:200});}});
  const result=await provider.search({city:' Inglewood ',countryCode:'us',size:1000});
  assert.equal(requested.searchParams.get('size'),'50');assert.equal(requested.searchParams.get('countryCode'),'US');assert.equal(result.events[0].name,'JAŸ-Z 30');
});

test('Ticketmaster venue search exposes only normalized public venue metadata',async()=>{
  const {TicketmasterProvider}=await import('../server/ticketing.mjs');let requested;
  const provider=new TicketmasterProvider({apiKey:'test-key-123',fetch:async url=>{requested=new URL(url);return new Response(JSON.stringify({_embedded:{venues:[{id:'KSPODOME',name:'KSPO DOME',city:{name:'Seoul'},country:{countryCode:'KR'},url:'https://www.ticketmaster.com/venue/KSPODOME'}]},page:{size:1}}),{status:200});}});
  const result=await provider.searchVenues({keyword:' KSPO DOME ',countryCode:'kr',size:1000});
  assert.equal(requested.pathname,'/discovery/v2/venues.json');assert.equal(requested.searchParams.get('size'),'50');assert.equal(result.venues[0].providerId,'KSPODOME');assert.equal(result.venues[0].countryCode,'KR');
});
