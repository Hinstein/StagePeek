import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const source=readFileSync(new URL('../public/auth-page.mjs',import.meta.url),'utf8');
const render=source.slice(source.indexOf('function renderPositions()'),source.indexOf('async function positions()'));

test('a new account renders its empty favorites and return action',()=>{
 const element=()=>({children:[],setAttribute(){},append(...nodes){this.children.push(...nodes);},replaceChildren(){this.children=[];}});
 const list=element(),count=element();
 runInNewContext(render+';renderPositions();',{
  $:id=>id==='account-positions'?list:count,
  document:{createElement:element},
  savedPositions:{rows:[]},me:{access:{maxSaved:3}},next:'/explore?venue=kai-tak-stadium',
  copy:text=>'translated: '+text
 });
 assert.equal(count.textContent,'0 / 3');
 assert.equal(list.children[0].className,'account-empty');
 assert.equal(list.children[0].children[1].textContent,'translated: 好位置，值得留住');
 assert.equal(list.children[0].children[2].textContent,'translated: 在场馆里找到你的位置，保存后就能随时回来查看。');
 assert.equal(list.children[0].children[3].href,'/explore?venue=kai-tak-stadium');
});
