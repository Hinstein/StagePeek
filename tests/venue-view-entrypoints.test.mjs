import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {resolve,dirname,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {venueViewCopy} from '../public/venue-view/venue-view-copy.mjs';
const root=fileURLToPath(new URL('../public/',import.meta.url));
function modules(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?entry.name==='vendor'?[]:modules(resolve(dir,entry.name)):entry.name.endsWith('.mjs')?[resolve(dir,entry.name)]:[]);}
const sources=new Map(modules(root).map(path=>[path,readFileSync(path,'utf8')]));
function dependsOn(path,target,visited=new Set()){
 if(path===resolve(root,target))return true;
 if(visited.has(path))return false;visited.add(path);
 const source=sources.get(path)||'';
 return [...source.matchAll(/(?:from\s*|import\s*\(?\s*)['"]([^'"]+)['"]/g)].some(match=>match[1].startsWith('.')&&dependsOn(resolve(dirname(path),match[1]),target,visited));
}
test('all custom concert 3D engines share the approved palette and seated camera policy',()=>{
 const engines=[...sources].filter(([path,source])=>path.includes('/concert-views/')&&/new THREE\.WebGLRenderer\(/.test(source));assert.ok(engines.length>=2);
 for(const [path]of engines){
  assert.ok(dependsOn(path,'venue-view/venue-palette.mjs'),relative(root,path)+' palette');
  assert.ok(dependsOn(path,'venue-view/venue-camera-policy.mjs'),relative(root,path)+' camera');
 }
});
test('every custom concert entry delegates controls to the shared scene component',()=>{
 const entries=[...sources].filter(([path,source])=>path.includes('/concert-views/')&&/\bcreate(?:Hydro)?Viewer\(/.test(source)&&!/export function create(?:Hydro)?Viewer\(/.test(source));assert.ok(entries.length>=2);
 for(const [path]of entries)assert.ok(dependsOn(path,'venue-view/venue-view-controls.mjs'),relative(root,path));
 for(const path of ['concert-views/app.mjs','concert-views/hydro-panel.mjs'])assert.ok(dependsOn(resolve(root,path),'venue-view/venue-view-controls.mjs'),path);
 assert.match(readFileSync(new URL('../server/concert-views/page.mjs',import.meta.url),'utf8'),/venue-view\/venue-view.css/);
});
test('concert adapters share layer and page presentation instead of owning parallel interfaces',()=>{
 for(const path of ['concert-views/app.mjs','concert-views/hydro-panel.mjs'])assert.ok(dependsOn(resolve(root,path),'venue-view/venue-view-layers.mjs'),path+' layers');
 for(const path of ['concert-views/app.mjs','concert-views/local-project-research.mjs'])assert.ok(dependsOn(resolve(root,path),'venue-view/venue-page-presenter.mjs'),path+' page');
 assert.ok(dependsOn(resolve(root,'concert-views/explorer-state.mjs'),'explorer-state.mjs'),'concert map state delegates to the public implementation');
 for(const path of ['concert-views/app.mjs','concert-views/hydro-panel.mjs','concert-views/hydro-map-gestures.mjs'])assert.match(sources.get(resolve(root,path)),/import\s*\{[^}]*\bVENUE_MAP_POLICY\b[^}]*\}\s*from/,path+' shared map policy');
});
test('shared view localization translates new messages without taking ownership of account or billing text',()=>{
 for(const locale of ['en','zh-TW','ja','ko']){
  assert.notEqual(venueViewCopy('固定座位视角 · 拖动只转头 · 滚轮 / 双指变焦',locale,x=>x),'固定座位视角 · 拖动只转头 · 滚轮 / 双指变焦');
  assert.equal(venueViewCopy('billing',locale,x=>'site:'+x),'site:billing');
 }
 assert.equal(venueViewCopy('查看舞台','en',x=>x),'View stage');
});
