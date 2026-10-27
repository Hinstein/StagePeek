import test from 'node:test';
import assert from 'node:assert/strict';
import * as browser from '../public/locales.mjs';
import {interfaceRows,interfaceCopy} from '../public/translations/interface.mjs';
import {safeReturn} from '../public/auth-contract.mjs';
import {localizeInterfaceHtml} from '../server/public-pages.mjs';

test('browser entrypoint route exports support all five locales',()=>{
 for(const locale of browser.SUPPORTED_LOCALES){
  const path=browser.localizedPath(locale,'/explore');
  assert.deepEqual(browser.parseLocalizedPath(path),{locale,path:'/explore'});
  assert.equal(browser.localizedPath(locale,'/ja/explore'),path);
 }
});

test('dynamic interface messages keep the route language when document language changes',t=>{
 const originalDocument=globalThis.document,originalLocation=globalThis.location;
 t.after(()=>{if(originalDocument===undefined)delete globalThis.document;else globalThis.document=originalDocument;if(originalLocation===undefined)delete globalThis.location;else globalThis.location=originalLocation;});
 globalThis.document={documentElement:{lang:'zh-CN'}};
 globalThis.location={pathname:'/ja/explore'};
 assert.equal(browser.getLocale(),'ja');
 assert.equal(browser.copy('场馆已准备好'),'会場の準備ができました');
 globalThis.location.pathname='/explore';
 assert.equal(browser.getLocale(),'en');
 globalThis.location.pathname='/zh-CN/explore';
 assert.equal(browser.copy('找到我的座位'),'找到我的座位');
 assert.equal(browser.copy('已找到座位，请查看下方视角。'),'已找到座位，请查看下方视角。');
});
test('reviewed interface phrases have five nonempty variants with identical placeholders',()=>{
 const seen=new Set();
 for(const row of interfaceRows){
  assert.equal(row.length,5,row[0]);assert.ok(!seen.has(row[0]),row[0]);seen.add(row[0]);
  const placeholders=value=>[...value.matchAll(/\{\d+\}/g)].map(match=>match[0]).sort();
  for(const value of row){assert.ok(value.trim(),row[0]);assert.deepEqual(placeholders(value),placeholders(row[0]),row[0]);}
 }
 assert.match(interfaceCopy('{0}排 · {1}座',['A','78'],'en'),/A.*78/);
});
test('localized explorer auth return keeps ticket identity and strips secrets',()=>{
 assert.equal(safeReturn('/ja/explore?venue=kai-tak-stadium&section=101&row=A&seat=78&token=secret'),'/ja/explore?venue=kai-tak-stadium&section=101&row=A&seat=78');
 for(const path of ['/ja/auth/login','/ko/../auth/login','//evil.test','/ja/\\evil.test'])assert.equal(safeReturn(path),'/');
});
test('interface HTML translates whole labels without corrupting escaping',()=>{
 const html=localizeInterfaceHtml('<html lang="en"><button aria-label="定位我的座位">定位我的座位</button><p>A &amp; B</p></html>','ja');
 assert.match(html,/lang="ja"/);assert.ok(!html.includes('定位我的座位'));assert.match(html,/A &amp; B/);assert.ok(!html.includes('&amp;amp;'));
});

test('mail fallback uses English for locales the existing shared hook does not support',async()=>{
 const {SupabaseAuth}=await import('../server/supabase-auth.mjs');
 const callback=SupabaseAuth.prototype.callback;
 for(const locale of ['en','ja','ko','zh-TW',undefined])assert.equal(callback.call({config:{appUrl:'https://stagepeek.live'}},'/auth/callback',locale),'https://stagepeek.live/auth/callback?lang=en');
 assert.equal(callback.call({config:{appUrl:'https://stagepeek.live'}},'/auth/reset','zh-CN'),'https://stagepeek.live/auth/reset?lang=zh-CN');
});

test('language switching keeps the current explorer selection rather than stale link parameters',t=>{
 const previous=globalThis.location,assigned=[];
 t.after(()=>{if(previous===undefined)delete globalThis.location;else globalThis.location=previous;});
 globalThis.location={href:'https://stagepeek.live/ja/explore?venue=old&event=stale&section=1&token=secret',assign:value=>assigned.push(value)};
 browser.setLocaleUrl('ko',{venue:'kai-tak-stadium',event:null,layout:'bowl',section:'101',row:'A',seat:'78',mode:'3d',zoom:2,token:'private'});
 const target=new URL(assigned[0],'https://stagepeek.live');
 assert.equal(target.pathname,'/ko/explore');
 assert.deepEqual(Object.fromEntries(target.searchParams),{venue:'kai-tak-stadium',section:'101',layout:'bowl',row:'A',seat:'78',mode:'3d',zoom:'2'});
 globalThis.location.href='https://stagepeek.live/';browser.setLocaleUrl('ja');assert.equal(assigned[1],'/ja/');
});
