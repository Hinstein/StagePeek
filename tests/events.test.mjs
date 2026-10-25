import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

test('official structured event data extracts dates and cancellation without inventing stage layout',async()=>{
  const {parseEvents}=await import('../server/events.mjs');
  const html=`<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"MusicEvent","name":"Artist A","startDate":"2027-05-14T19:00:00-04:00","eventStatus":"https://schema.org/EventCancelled","url":"https://www.metlifestadium.com/events/detail/artist-a"}]}</script>`;
  const events=parseEvents(html,'https://www.metlifestadium.com/events/detail/artist-a','metlife');
  assert.equal(events.length,1);assert.equal(events[0].name,'Artist A');assert.equal(events[0].status,'canceled');
  assert.equal(events[0].layout.status,'unconfirmed');assert.equal(events[0].localDate,'2027-05-14');
});

test('exact public ticketing seat-map references include a traceable stage model',async()=>{
  const {EventRepository}=await import('../server/events.mjs');
  const file='/tmp/seatpeep-layout-reference-events.json';
  const repo=new EventRepository({file,fetch:async()=>new Response('<html></html>'),clock:()=>Date.parse('2026-10-24T00:00:00Z')});
  repo.data={schemaVersion:1,venues:{sofi:{events:[{id:'x',venueId:'sofi',name:'JAŸ-Z 30',startDate:'2026-10-24',endDate:null,localDate:'2026-10-24',endLocalDate:'2026-10-24',source:'https://www.sofistadium.com/events/detail/jay-z-october-24-2026'}],status:'current',refreshedAt:null}}};
  const event=repo.list('sofi').events[0];
  assert.equal(event.layout.status,'reference-only');
  assert.match(event.layout.source,/ticketmaster\.com/);
  assert.match(event.layout.image,/mapsapi\.tmol\.io/);
  assert.equal(event.layout.model.id,'event:sofi:jay-z-30');
  assert.equal(event.layout.stageVerification,'operator-traced');
});

test('Tottenham event reference is surfaced from a cached official event URL',async()=>{
  const {EventRepository}=await import('../server/events.mjs');
  const file='/tmp/seatpeep-tottenham-layout-reference-events.json';
  const repo=new EventRepository({file,fetch:async()=>new Response('<html></html>'),clock:()=>Date.parse('2026-10-24T00:00:00Z')});
  repo.data={schemaVersion:1,venues:{tottenham:{events:[{id:'x',venueId:'tottenham',name:'Karol G',startDate:'2027-07-06',endDate:null,localDate:'2027-07-06',endLocalDate:'2027-07-06',source:'https://www.tottenhamhotspurstadium.com/events/1021367/karol-g'}],status:'current',refreshedAt:null}}};
  const event=repo.list('tottenham').events[0];
  assert.equal(event.layout.status,'reference-only');
  assert.match(event.layout.source,/ticketmaster\.co\.uk/);
  assert.match(event.layout.image,/32451s\.gif/);
  assert.equal(event.layout.model.id,'event:tottenham:karol-g');
});

test('SoFi R&B Tour event reference carries its stage model',async()=>{
  const {EventRepository}=await import('../server/events.mjs');
  const file='/tmp/seatpeep-sofi-rnb-layout-reference-events.json';
  const repo=new EventRepository({file,fetch:async()=>new Response('<html></html>'),clock:()=>Date.parse('2026-10-24T00:00:00Z')});
  repo.data={schemaVersion:1,venues:{sofi:{events:[{id:'x',venueId:'sofi',name:'The R&B Tour - Starring Usher Raymond & Chris Brown',startDate:'2026-11-15',endDate:null,localDate:'2026-11-15',endLocalDate:'2026-11-15',source:'https://www.sofistadium.com/events/detail/chris-brown-usher-november-15'}],status:'current',refreshedAt:null}}};
  const event=repo.list('sofi').events[0];
  assert.equal(event.layout.status,'reference-only');
  assert.match(event.layout.source,/0A006494C5CE878D/);
  assert.match(event.layout.image,/0A006494C5CE878D/);
  assert.equal(event.layout.model.id,'event:sofi:rnb-tour');
});

test('MetLife event references are matched by official event URL',async()=>{
  const {EventRepository}=await import('../server/events.mjs');
  const file='/tmp/seatpeep-metlife-layout-reference-events.json';
  const repo=new EventRepository({file,fetch:async()=>new Response('<html></html>'),clock:()=>Date.parse('2026-10-24T00:00:00Z')});
  repo.data={schemaVersion:1,venues:{metlife:{events:[
    {id:'z',venueId:'metlife',name:'Zach Bryan',startDate:'2027-05-14',endDate:null,localDate:'2027-05-14',endLocalDate:'2027-05-14',source:'https://www.metlifestadium.com/events/detail/zach-bryan'},
    {id:'b',venueId:'metlife',name:'Bon Jovi',startDate:'2027-07-15',endDate:null,localDate:'2027-07-15',endLocalDate:'2027-07-15',source:'https://www.metlifestadium.com/events/detail/bon-jovi'}
  ],status:'current',refreshedAt:null}}};
  const events=repo.list('metlife').events;
  assert.equal(events.length,2);
  assert.equal(events[0].layout.status,'reference-only');assert.equal(events[0].layout.mapVerification,'reference');assert.match(events[0].layout.source,/ticketmaster\.com/);assert.match(events[0].layout.image,/mapsapi\.tmol\.io/);assert.equal(events[0].layout.model.id,'event:metlife:zach-bryan');
  assert.equal(events[1].layout.status,'unconfirmed');assert.equal(events[1].layout.mapVerification,'unavailable');assert.equal(events[1].layout.source,null);assert.equal(events[1].layout.image,null);assert.equal(events[1].layout.stageVerification,'unverified');
});

test('cached legacy reference status is recalculated from the event identity',async()=>{
  const {EventRepository}=await import('../server/events.mjs');
  const repo=new EventRepository({file:'/tmp/seatpeep-legacy-layout-events.json',fetch:async()=>new Response('<html></html>'),clock:()=>Date.parse('2026-10-24T00:00:00Z')});
  repo.data={schemaVersion:1,venues:{metlife:{events:[{id:'b',venueId:'metlife',name:'Bon Jovi',startDate:'2027-07-15',endDate:null,localDate:'2027-07-15',endLocalDate:'2027-07-15',source:'https://www.metlifestadium.com/events/detail/bon-jovi',layout:{status:'reference-only',source:'https://ticketmaster.com/old',image:'old'}}],status:'current',refreshedAt:null}}};
  const event=repo.list('metlife').events[0];
  assert.equal(event.layout.mapVerification,'unavailable');assert.equal(event.layout.status,'unconfirmed');assert.equal(event.layout.source,null);assert.equal(event.layout.image,null);
});

test('official feeds use the current public event indexes and canonicalize duplicate detail URLs',async()=>{
  const {FEEDS,parseEvents}=await import('../server/events.mjs');
  assert.deepEqual(FEEDS.metlife.urls.slice(0,2),[
    'https://www.metlifestadium.com/events',
    'https://www.metlifestadium.com/'
  ]);
  assert.equal(FEEDS.sofi.urls[0],'https://www.sofistadium.com/events');
  const html=`<script type="application/ld+json">[
    {"@type":"MusicEvent","name":"A","startDate":"2027-05-14","url":"https://www.metlifestadium.com/events/detail/a/"},
    {"@type":"MusicEvent","name":"A","startDate":"2027-05-14","url":"https://www.metlifestadium.com/events/detail/a"}
  ]</script>`;
  const events=parseEvents(html,'https://www.metlifestadium.com/events','metlife');
  assert.equal(events.length,1);
  assert.equal(events[0].source,'https://www.metlifestadium.com/events/detail/a');
});

test('partial refresh merges newly found events with cached official events',async t=>{
  const {EventRepository}=await import('../server/events.mjs');const dir=mkdtempSync(join(tmpdir(),'seatpeep-events-'));t.after(()=>rmSync(dir,{recursive:true}));
  let round=0;
  const repo=new EventRepository({file:join(dir,'events.json'),clock:()=>Date.parse('2026-10-24T00:00:00Z'),fetch:async url=>{
    if(round===0)return new Response(`<script type="application/ld+json">[{"@type":"MusicEvent","name":"Old","startDate":"2027-02-01","url":"https://www.metlifestadium.com/events/detail/old"}]</script>`);
    if(url.endsWith('/events')) return new Response(`<script type="application/ld+json">[{"@type":"MusicEvent","name":"New","startDate":"2027-01-01","url":"https://www.metlifestadium.com/events/detail/new"}]</script>`);
    throw new Error('detail unavailable');
  }});
  await repo.refresh('metlife',['https://www.metlifestadium.com/events']);
  round=1;
  await repo.refresh('metlife',['https://www.metlifestadium.com/events','https://www.metlifestadium.com/events/detail/old']);
  assert.deepEqual(repo.list('metlife').events.map(x=>x.name),['New','Old']);
  assert.equal(repo.list('metlife').status,'partial');
});

test('Tottenham first-party embedded configuration supplies event date when JSON-LD is only WebPage',async()=>{
  const {parseEvents}=await import('../server/events.mjs');
  const html=`<meta property="og:title" content="Karol G"><div data-config="{&quot;EventStartDate&quot;:&quot;2027-07-06T18:00:00.000Z&quot;,&quot;EventEndDate&quot;:&quot;2027-07-06T22:00:00.000Z&quot;}"></div>`;
  const events=parseEvents(html,'https://www.tottenhamhotspurstadium.com/events/1021367/karol-g','tottenham');
  assert.equal(events[0].localDate,'2027-07-06');assert.equal(events[0].name,'Karol G');
});

test('invalid pre-start end timestamps cannot hide a future concert and football is not a concert',async()=>{
  const {parseEvents}=await import('../server/events.mjs');
  const html=`<script type="application/ld+json">[
    {"@type":"Event","name":"Bon Jovi","description":"The band brings its concert tour.","startDate":"2027-07-15T19:00:00-04:00","endDate":"1969-12-31T19:00:00-05:00"},
    {"@type":"Event","name":"NJSIAA High School Football Championships","startDate":"2026-11-28"},
    {"@type":"Event","name":"USBands Championships - II O","startDate":"2026-11-07"}
  ]</script>`;
  const events=parseEvents(html,'https://www.metlifestadium.com/events/detail/bon-jovi','metlife');
  assert.equal(events.length,1);assert.equal(events[0].endDate,null);assert.equal(events[0].endLocalDate,'2027-07-15');assert.equal(events[0].category,'music');
});

test('offset-free official timestamps retain their venue local day regardless of server timezone',async()=>{
  const {parseEvents}=await import('../server/events.mjs');
  const events=parseEvents(`<script type="application/ld+json">{"@type":"MusicEvent","name":"Local midnight","startDate":"2027-05-14T00:30:00","endDate":"2027-05-15T00:20:00"}</script>`,'https://www.metlifestadium.com/events/detail/local','metlife');
  assert.equal(events[0].localDate,'2027-05-14');assert.equal(events[0].endLocalDate,'2027-05-15');assert.equal(events[0].datePrecision,'venue-local-time');
});

test('HTTP success with damaged cached detail data retains the event as partial rather than deleting it',async t=>{
  const {EventRepository}=await import('../server/events.mjs');const dir=mkdtempSync(join(tmpdir(),'seatpeep-events-'));t.after(()=>rmSync(dir,{recursive:true}));
  let broken=false;
  const repo=new EventRepository({file:join(dir,'events.json'),clock:()=>Date.parse('2026-10-24T00:00:00Z'),fetch:async url=>{
    if(broken&&url.endsWith('/old'))return new Response('<script type="application/ld+json">{broken</script>');
    const name=url.endsWith('/old')?'Old':'New';return new Response(`<script type="application/ld+json">{"@type":"MusicEvent","name":"${name}","startDate":"2027-05-14","url":"${url}"}</script>`);
  }});
  await repo.refresh('metlife',['https://www.metlifestadium.com/events/detail/old']);broken=true;
  await repo.refresh('metlife',['https://www.metlifestadium.com/events/detail/old','https://www.metlifestadium.com/events/detail/new']);
  assert.deepEqual(repo.list('metlife').events.map(x=>x.name).sort(),['New','Old']);assert.equal(repo.list('metlife').status,'partial');
});

test('failed refresh preserves previously obtained events with stale status and filters past dates',async t=>{
  const {EventRepository}=await import('../server/events.mjs');const dir=mkdtempSync(join(tmpdir(),'seatpeep-events-'));t.after(()=>rmSync(dir,{recursive:true}));
  let failing=false;
  const repo=new EventRepository({file:join(dir,'events.json'),clock:()=>Date.parse('2026-10-24T00:00:00Z'),fetch:async()=>{
    if(failing)throw new Error('network unavailable');
    return new Response(`<script type="application/ld+json">[{"@type":"MusicEvent","name":"Upcoming","startDate":"2027-01-01","url":"https://www.metlifestadium.com/events/detail/new"},{"@type":"MusicEvent","name":"Past","startDate":"2025-01-01","url":"https://www.metlifestadium.com/events/detail/old"}]</script>`);
  }});
  await repo.refresh('metlife',['https://www.metlifestadium.com/events-tickets/event-calendar']);
  assert.equal(repo.list('metlife').events.length,1);assert.equal(repo.list('metlife').events[0].name,'Upcoming');
  failing=true;await repo.refresh('metlife',['https://www.metlifestadium.com/events-tickets/event-calendar']);
  assert.equal(repo.list('metlife').events.length,1);assert.equal(repo.list('metlife').status,'stale');
});

test('candidate artist imports keep historical dates browsable',async()=>{
  const {EventRepository}=await import('../server/events.mjs');
  const repo=new EventRepository({file:'/tmp/seatpeep-candidate-history.json',clock:()=>Date.parse('2026-10-25T00:00:00Z')});
  repo.data={schemaVersion:1,venues:{metlife:{status:'candidate-import',events:[
    {id:'past',venueId:'metlife',name:'Past show',localDate:'2026-06-01',endLocalDate:'2026-06-01',source:'https://www.metlifestadium.com/events/detail/past'},
    {id:'future',venueId:'metlife',name:'Future show',localDate:'2026-11-01',endLocalDate:'2026-11-01',source:'https://www.metlifestadium.com/events/detail/future'}
  ]}}};
  const result=repo.list('metlife');
  assert.deepEqual(result.events.map(x=>x.name),['Past show','Future show']);
  assert.equal(result.archiveCount,1);
});

test('event crawler refuses non-official hosts and does not accept arbitrary redirect destinations',async()=>{
  const {fetchOfficial}=await import('../server/events.mjs');
  await assert.rejects(()=>fetchOfficial('https://attacker.example/events','metlife'),/official/i);
  await assert.rejects(()=>fetchOfficial('https://www.metlifestadium.com/events','metlife',async()=>new Response(null,{status:302,headers:{Location:'http://127.0.0.1/private'}})),/official/i);
});
