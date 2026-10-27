import test from 'node:test';
import assert from 'node:assert/strict';
import {groupEventsByDate} from '../public/event-groups.mjs';

test('events group by local calendar date and preserve event order',()=>{
  const groups=groupEventsByDate([
    {id:'b',localDate:'2026-11-02',name:'Evening'},
    {id:'a',localDate:'2026-11-01',name:'Matinee'},
    {id:'c',localDate:'2026-11-02',name:'Late show'},
    {id:'d',localDate:'',name:'Date pending'}
  ]);
  assert.deepEqual(groups.map(group=>group.date),['2026-11-01','2026-11-02','unknown']);
  assert.deepEqual(groups[1].events.map(event=>event.id),['b','c']);
});

test('empty event response creates no groups',()=>{
  assert.deepEqual(groupEventsByDate([]),[]);
});
