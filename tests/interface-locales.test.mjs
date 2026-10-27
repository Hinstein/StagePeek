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
