import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source=readFileSync(new URL('../public/concert-views/app.mjs',import.meta.url),'utf8');
const entry=source.slice(source.indexOf('async function chooseFloorView('),source.indexOf('function clearFloorView('));

test('seated and standing floor entries await the shared 3D switch before entering their viewpoint',async()=>{
 for(const kind of ['floorChairs','floorViews']){
  const chair={zoneId:'floor',label:'Floor',p:[3,0,7]},overlay={floorChairs:[],floorViews:[],[kind]:[chair]};
  const state={mode:'2d',eventOverlayVisible:true,event:{id:'show'},phoneFrame:true},nodes=Object.fromEntries(['locate','section','row','seat'].map(id=>[id,{value:'old',disabled:true}]));
  let ready,calls=0;
  const switched=new Promise(resolve=>ready=resolve);
  const choose=new Function('state','$','o2EventDisplayDraft','copy','handleViewAction','viewer',`let resolveVersion=0;${entry};return chooseFloorView;`)(state,id=>nodes[id],()=>overlay,s=>s,async action=>{assert.equal(action,'3d');await switched;state.mode='3d';},{seatView(){assert.equal(state.mode,'3d');calls++;}});
  const selecting=choose(chair);
  assert.equal(calls,0);assert.deepEqual(state.result.position,chair.p);
  assert.equal(state.result.status,'illustrative-view');assert.equal(state.phoneFrame,false);
  for(const id of ['section','row','seat'])assert.equal(nodes[id].value,'');
  ready();await selecting;assert.equal(calls,1);
  await choose({...chair});assert.equal(calls,1,'unrelated objects cannot create a floor viewpoint');
  state.eventOverlayVisible=false;await choose(chair);assert.equal(calls,1);
 }
});
