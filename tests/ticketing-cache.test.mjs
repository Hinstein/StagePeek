import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

test('ticketing cache preserves provider events without inventing a stage model',async()=>{
  const root=await mkdtemp(join(tmpdir(),'seatpeep-ticketing-'));const file=join(root,'events.json');
  await writeFile(file,JSON.stringify({schemaVersion:1,provider:'ticketmaster',venues:{sofi:{events:[{id:'tm-1',localDate:'2999-01-01',name:'Future Show',seatmap:{staticUrl:'https://example.test/map.png'}}],status:'candidate'}}}));
  const {TicketingEventCache}=await import('../server/ticketing-cache.mjs');const cache=new TicketingEventCache({file,clock:()=>Date.parse('2026-10-25T00:00:00Z')});
  const result=cache.list('sofi');assert.equal(result.events.length,1);assert.equal(result.events[0].seatmap.staticUrl,'https://example.test/map.png');assert.equal(result.status,'candidate');
});
