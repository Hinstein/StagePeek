import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../public/app.mjs',import.meta.url),'utf8');
function harness(requestFullscreen){
 const classes=new Set(),attributes={};
 const scene={classList:{toggle:(key,on)=>on?classes.add(key):classes.delete(key),contains:key=>classes.has(key)},requestFullscreen};
 const button={setAttribute:(key,value)=>attributes[key]=value};
 const doc={body:{classList:{toggle:(key,on)=>on?classes.add('body:'+key):classes.delete('body:'+key)}},fullscreenElement:null,exitFullscreen:async()=>{doc.fullscreenElement=null;}};
 const code=source.slice(source.indexOf('function setExpandedView('),source.indexOf("$('fullscreen').onclick="));
 assert.ok(code.includes('async function toggleFullscreen('),'fullscreen behavior must have a testable controller');
 const toggle=new Function('$','document',code+';return toggleFullscreen;')(id=>id==='viewer'?scene:button,doc);
 return {toggle,classes,attributes,doc};
}
test('unsupported fullscreen falls back to an expanded view that can be closed',async()=>{
 const h=harness(undefined);await h.toggle();assert.ok(h.classes.has('is-expanded'));assert.equal(h.attributes['aria-pressed'],'true');
 await h.toggle();assert.equal(h.classes.has('is-expanded'),false);assert.equal(h.classes.has('body:explorer-expanded'),false);assert.equal(h.attributes['aria-pressed'],'false');
});
test('a rejected native fullscreen request opens the same usable fallback',async()=>{
 const h=harness(async()=>{throw new Error('NotAllowedError');});await h.toggle();assert.ok(h.classes.has('is-expanded'));await h.toggle();assert.equal(h.classes.size,0);
});
