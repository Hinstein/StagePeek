import {renderVenueLocation,venueEventCard,selectVenueEvent} from '../public/venue-view/venue-page-presenter.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadConcertViews} from '../server/concert-views/index.mjs';
import {groupVenuesByCountry} from '../public/concert-views/catalog.mjs';

class Node {
 constructor(tag='div'){this.tagName=tag;this.children=[];this.dataset={};this.className='';this.value='';this.hidden=false;this.isConnected=true;this.classList={remove(){},add(){},toggle(){}};}
 append(...nodes){for(const node of nodes){node.parentElement=this;this.children.push(node);}}
 replaceChildren(...nodes){this.children=[];this.append(...nodes);}
 after(node){const parent=this.parentElement;node.parentElement=parent;parent.children.splice(parent.children.indexOf(this)+1,0,node);}
 remove(){this.isConnected=false;if(this.parentElement)this.parentElement.children=this.parentElement.children.filter(node=>node!==this);}
 setAttribute(key,value){this[key]=value;}
 querySelectorAll(selector){return this.children.flatMap(node=>[...(selector==='button[data-event]'&&node.tagName==='button'&&node.dataset.event?[node]:[]),...node.querySelectorAll(selector)]);}
}

function fixture(){
 const ids=['venue','viewer','ticket-form','section','row','seat','stage-layout','return-venue-layout','venue-name','venue-city','locate','location-section','location-row','location-status','location-description','distance','save-position','samples-list','row-list','section-list','coverage-count','capability-badges','event-count','events-status','events-list','layout-state','event-layout-note','layout-source-note','research-v0-notice','ticket-map-conflicts','ticket-map-preview-image','venue-status'];
 const nodes=Object.fromEntries(ids.map(id=>[id,new Node()])),map=new Node(),sources=new Node('details'),workspace=new Node(),form=nodes['ticket-form'];
 sources.className='sources';map.append(nodes.viewer,new Node(),new Node(),sources);workspace.append(form,map);new Node('label').append(nodes['stage-layout']);
 const regularHandlers={submit:()=>{},section:()=>{},input:()=>{}},changes=[],panels=[],pending=[];
 form.onsubmit=regularHandlers.submit;nodes.section.onchange=regularHandlers.section;nodes.section.oninput=regularHandlers.input;
 nodes.venue.value='twcv-the-o2-arena-london';nodes.venue.onchange=()=>changes.push(nodes.venue.value);
 const location={href:'http://localhost/concert-views?venue=twcv-the-o2-arena-london&section=101&row=3&seat=20',get search(){return new URL(this.href).search;}},history={replaceState(a,b,url){location.href=String(url);}};
 const document={head:new Node(),getElementById:id=>nodes[id],createElement:tag=>new Node(tag),querySelector:selector=>selector==='.map-card > .sources'?sources:map.children.find(n=>n.className.includes('hydro-sources'))};
 const venue=loadConcertViews().hydro;
 const appendHydroPanel=(parent,data,options)=>{
  assert.equal(options.query.form,form);assert.equal(options.sourcesHost,map);
  assert.equal(options.query.section,nodes.section);assert.equal(options.query.row,nodes.row);assert.equal(options.query.seat,nodes.seat);
  const board=new Node();board.className='venue-view-shell';parent.append(board);
  options.query.form.onsubmit=()=>{};
  const panel={disposed:false,selectEvent(id){this.event=id;},dispose(){this.disposed=true;form.onsubmit=regularHandlers.submit;nodes.section.onchange=regularHandlers.section;nodes.section.oninput=regularHandlers.input;}};panels.push(panel);return panel;
 };
 const source=readFileSync(new URL('../public/concert-views/local-project-research.mjs',import.meta.url),'utf8');
 const mount=new Function('appendHydroPanel','groupVenuesByCountry','renderVenueLocation','venueEventCard','selectVenueEvent','document','location','history','fetch','copy','getLocale',source.replace(/^import .*;\n/gm,'').replace('export function','function')+';return mountLocalResearch;')(appendHydroPanel,groupVenuesByCountry,renderVenueLocation,venueEventCard,selectVenueEvent,document,location,history,()=>new Promise(resolve=>pending.push(resolve)),text=>text,()=>'zh-CN');
 const adapter=mount([venue],[{id:'twcv-the-o2-arena-london',name:'O2',country:'英国'},{id:'twcv-ziggo-dome-amsterdam',name:'Ziggo',country:'荷兰'}]);
 const choose=id=>{nodes.venue.value=id;nodes.venue.onchange();};
 const respond=async index=>{pending[index]({ok:true,json:async()=>({venue})});await new Promise(resolve=>setImmediate(resolve));};
 return {nodes,map,workspace,form,sources,regularHandlers,changes,panels,choose,respond,adapter};
}

test('Hydro reuses the existing page form, workspace, sidebar and source slot across venue switches',async()=>{
 const h=fixture(),children=[...h.workspace.children];
 h.choose('ovo-hydro');assert.equal(h.adapter.active,true);assert.equal(h.nodes.viewer.hidden,true);
 await h.respond(0);
 assert.deepEqual(h.workspace.children,children,'no replacement workspace or query form');
 assert.equal(h.map.children.filter(node=>node.className==='hydro-page-adapter').length,1);
 assert.equal(h.nodes['section-list'].children.length,50);
 assert.deepEqual(h.nodes['section-list'].children.slice(0,3).map(o=>o.value),['052','056','201']);
 assert.equal(h.nodes.locate.disabled,false);
 h.choose('twcv-ziggo-dome-amsterdam');
 assert.equal(h.adapter.active,false);assert.equal(h.panels[0].disposed,true);
 assert.equal(h.nodes.viewer.hidden,false);assert.equal(h.sources.hidden,false);
 assert.equal(h.form.onsubmit,h.regularHandlers.submit);assert.equal(h.nodes.section.oninput,h.regularHandlers.input);
 assert.deepEqual(h.changes,['twcv-ziggo-dome-amsterdam']);
 assert.equal(h.map.children.filter(node=>node.className==='hydro-page-adapter').length,0);
 h.choose('ovo-hydro');await h.respond(1);assert.equal(h.panels.length,2);
 assert.equal(h.map.children.filter(node=>node.className==='hydro-page-adapter').length,1);
});

test('an obsolete Hydro response cannot remount a second page after switching venues',async()=>{
 const h=fixture();h.choose('ovo-hydro');h.choose('twcv-the-o2-arena-london');await h.respond(0);
 assert.equal(h.panels.length,0);assert.equal(h.adapter.active,false);assert.equal(h.nodes.viewer.hidden,false);
 assert.equal(h.form.onsubmit,h.regularHandlers.submit);
});
