import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadVenues} from '../server/venues.mjs';
import * as transform from '../public/explorer-state.mjs';
import {displaySectionLabel,sectionPoint,sectionRenderHalfAngle,stageRects} from '../public/geometry.mjs';
const app=readFileSync(new URL('../public/app.mjs',import.meta.url),'utf8');
const mapCode=app.slice(app.indexOf('function renderMap('),app.indexOf('function renderViewControls('));
const venues=loadVenues();
function harness(id){
 const nodes=new Map();
 class Node{
  children=[];attributes={};classList={toggle(){}};style={};
  set id(value){this._id=value;nodes.set(value,this);}get id(){return this._id;}
  replaceChildren(){this.children=[];}append(child){this.children.push(child);}
  setAttribute(key,value){this.attributes[key]=value;}
 }
 const $=id=>{if(!nodes.has(id)){const el=new Node();el.id=id;}return nodes.get(id);};
 const document={createElementNS:()=>new Node()};
 const state={venue:venues.get(id,'end'),sectionId:'',mapTier:null,mapTransform:null,layout:'end',mode:'2d'};
 state.sectionId=state.venue.sections[0].id;
 const selectedSection=()=>state.venue.sections.find(s=>s.id===state.sectionId);
 let render;
 const chooseSection=id=>{state.sectionId=id;state.mapTier=selectedSection().tier;render();};
 const element=(tag,text)=>{const el=new Node();el.textContent=text;return el;};
 const fn=new Function('state','$','document','selectedSection','chooseSection','chooseSample','element','displaySectionLabel','sectionPoint','sectionRenderHalfAngle','stageRects','createMapTransform',mapCode+';return renderMap;');
 render=fn(state,$,document,selectedSection,chooseSection,()=>{},element,displaySectionLabel,sectionPoint,sectionRenderHalfAngle,stageRects,transform.createMapTransform);
 return {state,$,render};
}
test('2D rerender preserves rotated/zoomed view and tier browsing never changes selected ticket',()=>{
 const h=harness('tokyo-garden-theater');h.render();
 const original=h.state.mapTransform;
 h.state.mapTransform=transform.rotateMap(transform.zoomMap(original,2),90);
 const transformed=h.state.mapTransform,selected=h.state.sectionId;
 const levels=h.$('map-levels').children;assert.ok(levels.length>1);levels[1].onclick();
 assert.equal(h.state.sectionId,selected);assert.equal(h.state.mapTransform,transformed);
 assert.equal(h.$('map').attributes.viewBox,transformed.viewBox.join(' '));
 assert.match(h.$('map-content').attributes.transform,/rotate\(90 /);
 const section=h.$('map-content').children.find(n=>n.attributes['data-section']);
 assert.ok(section);const id=section.attributes['data-section'];section.onclick();
 assert.equal(h.state.sectionId,id);assert.equal(h.state.mapTransform,transformed);
 assert.deepEqual(transform.resetMap(h.state.mapTransform),original);
});
test('2D transform never edits source polygons or source seat XYZ',()=>{
 const h=harness('asiaworld-viva');const before=JSON.stringify(h.state.venue);h.render();
 h.state.mapTransform=transform.panMap(transform.rotateMap(transform.zoomMap(h.state.mapTransform,3),90),4,-3);h.render();
 assert.equal(JSON.stringify(h.state.venue),before);
});
