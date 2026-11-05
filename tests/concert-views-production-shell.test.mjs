import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {interfaceCopy} from '../public/translations/interface.mjs';
import {concertViewsPage} from '../server/concert-views/page.mjs';
import {publicHeader,publicFooter,localizeInterfaceHtml} from '../server/public-pages.mjs';
import {loadConcertViews} from '../server/concert-views/index.mjs';
import {presentConcertVenue} from '../server/concert-views/presentation.mjs';
import {groupVenuesByCountry} from '../public/catalog.mjs';

const template=readFileSync(new URL('../public/index.html',import.meta.url),'utf8');
test('public and concert explorers own the same compact B layout before JavaScript runs',()=>{
 for(const html of [template,concertViewsPage('en',null)]){
  assert.match(html,/<body[^>]+data-ui-layout="B"/);
  assert.match(html,/<link rel="stylesheet" href="\/explorer-layout.css">/);
  assert.match(html,/<details class="preview-help"><summary>[^<]+<\/summary><ol class="explorer-steps"/);
  assert.doesNotMatch(html,/<details class="preview-help"[^>]*\bopen\b|layout-prototype/);
  assert.equal((html.match(/id="ticket-form"/g)||[]).length,1);
  for(const id of ['venue-country','venue','section','row','seat','locate'])assert.match(html,new RegExp(`id="${id}"`));
 }
});
test('concert page composes the production header, form, guide and footer with only a scene adapter',()=>{
 for(const locale of ['en','zh-CN']){
  const page=concertViewsPage(locale,null),production=localizeInterfaceHtml(template.replace('aria-label="Find a ticket seat"','aria-label="查找座位"'),locale,'/explore');
  assert.ok(page.includes(publicHeader(locale,'/concert-views',{user:null,explorer:true})));
  assert.ok(page.includes(publicFooter(locale)));
  for(const selector of ['intro','explorer-steps','input-panel']){
   const pattern=new RegExp(`<${selector==='explorer-steps'?'ol':'section'} class="${selector}"[\\s\\S]*?</${selector==='explorer-steps'?'ol':'section'}>`);
   const expected=production.match(pattern)?.[0];assert.ok(expected,selector);
   const normalize=value=>value.replace('<datalist id="row-list"></datalist>','').replace('list="row-list" ','').replace(/<p[^>]*id="ticket-format"[^>]*>[\s\S]*?<\/p>/,'');
   assert.equal(normalize(page.match(pattern)?.[0]),normalize(expected),selector);
  }
  const guide=page.match(/<section class="product-guide"[\s\S]*?<\/section>/)[0];
  assert.match(guide,/1–10/);
  assert.doesNotMatch(guide,/审核|配准|未发布|权利|研究|容量先验/);
  assert.match(page,locale==='en'?/Example: Section 101/:/示例：101 区/);
  const ids=[...page.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,'no parallel query form or scene controls');
  assert.doesNotMatch(page,/concert-views\/(?:index.html|style.css)|entry-link.mjs/);
  assert.match(page,/concert-views\/app.mjs/);
 }
});

test('ten-venue catalog presents names and countries independently of raw model metadata',()=>{
 const views=loadConcertViews(),raw=views.venues.catalog(),before=JSON.stringify(raw);
 const catalog=[...raw.map(presentConcertVenue),{...views.hydro,country:'英国'}];
 assert.equal(catalog.length,10);
 assert.deepEqual(Object.fromEntries(groupVenuesByCountry(catalog).map(g=>[g.country,g.venues.length])),{'美国':5,'英国':2,'荷兰':1,'法国':1,'德国':1});
 for(const venue of catalog)assert.doesNotMatch(venue.name,/[（(]/,venue.name);
 assert.equal(JSON.stringify(raw),before,'raw names and source model retained');
});


test('scene accessibility and customer guidance are translated in every supported locale',()=>{
 for(const locale of ['en','zh-CN','zh-TW','ja','ko']){
  const html=concertViewsPage(locale,null),copy=text=>interfaceCopy(text,[],locale);
  for(const label of ['查找座位','可拖拽的三维场馆','可选择分区的二维场馆图','二维看台层级','二维叠加图层'])assert.ok(html.includes(`aria-label="${copy(label)}"`),`${locale}: ${label}`);
  assert.ok(html.includes(`alt="${copy('本场来源票图')}"`));
  assert.ok(html.includes(copy('如何查看座位视角？')));
  assert.ok(html.includes(copy('选择地区、场馆和演唱会，输入区、排、座，或直接点击地图。切换 2D / 3D，进入观众视角；手机取景可调节 1–10 倍画面。')));
 }
});
