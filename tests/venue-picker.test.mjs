import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderCountryVenuePicker} from '../public/venue-picker.mjs';

const source=readFileSync(new URL('../public/app.mjs',import.meta.url),'utf8');
const pickerSource=source.slice(source.indexOf('function renderVenuePicker('),source.indexOf('async function loadCatalog('));
function harness(){
  const state={catalog:[{id:'hk-pro',name:'Paid Hong Kong',city:'中国香港 · 香港',locked:true},{id:'hk-free',name:'Free Hong Kong',city:'中国香港 · 香港',locked:false},{id:'jp-free',name:'Tokyo',city:'日本 · 东京',locked:false}]};
  const nodes=new Map(['venue-country','venue'].map(id=>[id,{value:'',disabled:true,options:[],replaceChildren(...items){this.options=items;},append(option){this.options.push(option);}}]));
  globalThis.document={createElement:tag=>({tagName:tag,textContent:'',value:''})};
  const create=new Function('renderCountryVenuePicker','state','$','locale','text','updateLocateAvailability','updateExplorerSteps',`${pickerSource};return renderVenuePicker;`);
  return {nodes,render:create(renderCountryVenuePicker,state,id=>nodes.get(id),'en',key=>key,()=>{},()=>{})};
}

test('country-first picker limits venue options to the selected country and puts free venues first',()=>{
  const h=harness();h.render('中国香港','hk-free');
  assert.deepEqual(h.nodes.get('venue').options.map(option=>option.value),['','hk-free','hk-pro']);
  assert.equal(h.nodes.get('venue').value,'hk-free');
  assert.equal(h.nodes.get('venue-country').value,'中国香港');
  assert.equal(h.nodes.get('venue-country').disabled,false);
});

test('changing country clears the old choice and deep-link selection restores the correct country',()=>{
  const h=harness();h.render('中国香港','hk-free');h.render('日本');
  assert.deepEqual(h.nodes.get('venue').options.map(option=>option.value),['','jp-free']);
  assert.equal(h.nodes.get('venue').value,'');
  h.render('中国香港','hk-free');
  assert.equal(h.nodes.get('venue-country').value,'中国香港');
  assert.equal(h.nodes.get('venue').value,'hk-free');
});
