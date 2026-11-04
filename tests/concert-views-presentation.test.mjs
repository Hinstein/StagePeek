import test from 'node:test';
import assert from 'node:assert/strict';
import {interfaceCopy} from '../public/translations/interface.mjs';
import {mountVenueLayers} from '../public/venue-view/venue-view-layers.mjs';
import {renderVenueLocation,venueEventCard,selectVenueEvent} from '../public/venue-view/venue-page-presenter.mjs';

class Node{
 constructor(doc,tag){this.ownerDocument=doc;this.tagName=tag;this.children=[];this.dataset={};this.attributes={};this.classes=new Set();this.classList={toggle:(name,on)=>on?this.classes.add(name):this.classes.delete(name)};}
 append(...nodes){for(const node of nodes){this.children=this.children.filter(n=>n!==node);this.children.push(node);}}
 replaceChildren(...nodes){this.children=[];this.append(...nodes);}
 setAttribute(key,value){this.attributes[key]=String(value);}
 querySelectorAll(){return this.children.flatMap(node=>[...(node.tagName==='button'&&node.dataset.event?[node]:[]),...node.querySelectorAll()]);}
}
function fixture(){const doc={createElement:tag=>new Node(doc,tag)},nodes={};doc.getElementById=id=>nodes[id]??=doc.createElement('div');return {doc,nodes};}

test('both data adapters use the same layer buttons, status, visibility and callbacks',()=>{
 for(const options of [[{id:'L1',label:'L1'},{id:'L4',label:'L4'}],[{id:'',label:'全部楼层'},{id:'1',label:'第 1 层'},{id:'2',label:'第 2 层'}]]){
  const {doc}=fixture(),levels=doc.createElement('div'),layers=doc.createElement('div'),actions=[];
  const shell=mountVenueLayers({levels,layers,onChange:(...args)=>actions.push(args)});
  shell.update({mode:'2d',options,active:options[0].id,eventAvailable:true,eventVisible:true});
  assert.equal(levels.hidden,false);assert.equal(levels.children.length,options.length);
  assert.equal(levels.children[0].attributes['aria-pressed'],'true');
  levels.children[1].onclick();assert.deepEqual(actions.at(-1),['level',options[1].id]);
  const event=layers.children.find(n=>n.dataset.layerAction==='event'),official=layers.children.find(n=>n.dataset.layerAction==='official');
  assert.equal(event.attributes['aria-pressed'],'true');assert.equal(official.hidden,true);
  event.onclick();assert.deepEqual(actions.at(-1),['event']);
  shell.update({mode:'3d',options,active:options[1].id,eventAvailable:false,officialAvailable:true});
  assert.equal(levels.hidden,true);assert.equal(event.hidden,true);assert.equal(official.hidden,true);
  assert.equal(event.textContent,'内场');
  assert.equal(layers.children.some(n=>n.tagName==='details'),false);
  assert.equal(layers.children.some(n=>/图层说明|待核对/.test(n.textContent||'')),false);
  assert.doesNotMatch(levels.children[0].textContent,/来源/);
 }
});

test('common location presenter clears stale source/conflict state when changing adapters',()=>{
 const {doc}=fixture();
 renderVenueLocation(doc,{section:'101',row:'T · 319',status:'来源',description:'source',distance:'23',matched:true,conflict:true});
 assert.ok(doc.getElementById('location-status').classes.has('matched'));
 renderVenueLocation(doc,{section:'208',row:'C · 121',status:'推演',description:'estimated',distance:'待校准'});
 assert.equal(doc.getElementById('location-section').textContent,'208');
 assert.equal(doc.getElementById('location-status').classes.size,0);
 assert.equal(doc.getElementById('save-position').disabled,true);
});

test('event cards share selection styling and dispatch while preserving source links',()=>{
 const {doc}=fixture(),root=doc.createElement('div'),selected=[];
 for(const id of ['source','hydro'])root.append(venueEventCard(doc,{id,title:id,lines:['date','layout'],links:[{label:'来源',url:'https://example.com/'+id}],onSelect:()=>selected.push(id)}));
 selectVenueEvent(root,'hydro');
 const buttons=root.querySelectorAll();assert.equal(buttons[0].attributes['aria-pressed'],'false');assert.equal(buttons[1].attributes['aria-pressed'],'true');
 assert.ok(buttons[1].classes.has('active'));buttons[1].onclick();assert.deepEqual(selected,['hydro']);
 assert.equal(root.children[1].children[1].rel,'noopener noreferrer');
 selectVenueEvent(root,null);assert.equal(buttons[1].attributes['aria-pressed'],'false');
});


test('shared location and layer UI localizes all five languages without translating ticket identities',()=>{
 for(const locale of ['en','zh-CN','zh-TW','ja','ko']){
  const translate=(text,values=[])=>interfaceCopy(text,values,locale),{doc}=fixture();
  renderVenueLocation(doc,{section:'A1 / 101',row:'T · 319',status:'示意座位预览',description:'示意编号和位置仅供参考。',distance:'约 23 m · 仅供参考'},translate);
  assert.equal(doc.getElementById('location-section').textContent,'A1 / 101');
  assert.equal(doc.getElementById('location-row').textContent,'T · 319');
  assert.equal(doc.getElementById('location-status').textContent,translate('示意座位预览'));
  assert.equal(doc.getElementById('location-description').textContent,translate('示意编号和位置仅供参考。'));
  assert.equal(doc.getElementById('distance').textContent,translate('约 23 m · 仅供参考'));
  const levels=doc.createElement('div'),layers=doc.createElement('div');
  const shell=mountVenueLayers({levels,layers,translate,onChange:()=>{}});
  shell.update({mode:'2d',options:[{id:'L1',label:'来源层级 L1'},{id:'L4',label:'L4'}],active:'L1',eventAvailable:true});
  assert.equal(levels.children[0].textContent,translate('{0} 看台',['L1']));
  assert.equal(layers.children.find(n=>n.dataset.layerAction==='event').textContent,translate('内场'));
  assert.equal(levels.attributes['aria-label'],translate('二维看台层级'));
  if(locale==='en')assert.doesNotMatch([doc.getElementById('location-status').textContent,levels.children[0].textContent,layers.attributes['aria-label']].join(' '),/[\u4e00-\u9fff]/);
 }
});

test('source city and stage metadata have labels in every supported locale',()=>{
 const labels=['伦敦','巴黎','阿姆斯特丹','柏林','洛杉矶地区','芝加哥','纽约都市圈','美国','端舞台'];
 for(const locale of ['en','zh-CN','zh-TW','ja','ko']){
  for(const label of labels){
   const translated=interfaceCopy(label,[],locale);
   assert.ok(translated.trim(),`${locale}: ${label}`);
   if(locale==='en'||locale==='ko')assert.doesNotMatch(translated,/[\u4e00-\u9fff]/,`${locale}: ${label}`);
  }
 }
 assert.equal(interfaceCopy('端舞台',[],'en'),'End stage');
 assert.equal(interfaceCopy('伦敦',[],'ja'),'ロンドン');
});

test('event diagram semantics translate while zone and ticket identities stay intact',()=>{
 for(const locale of ['en','zh-CN','zh-TW','ja','ko']){
  for(const [alias,key] of [['STAGE','舞台'],['STAGE · 示意','舞台 · 示意'],['FLOOR','内场'],['MIX','控台'],['GENERAL ADMISSION','站区'],['FRONT PORCH','前沿区']]){
   assert.equal(interfaceCopy(alias,[],locale),interfaceCopy(key,[],locale));
   if(locale!=='en')assert.notEqual(interfaceCopy(alias,[],locale),alias);
  }
  for(const id of ['A1','A2','110','T / 319'])assert.equal(interfaceCopy(id,[],locale),id);
 }
});
