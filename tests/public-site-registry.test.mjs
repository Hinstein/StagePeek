import test from 'node:test';
import assert from 'node:assert/strict';
import {createPublicSite} from '../server/public-pages.mjs';
import {loadVenues} from '../server/venues.mjs';

test('directory merges region aliases and summarizes the default layout without duplicating geography',()=>{
 const repo=loadVenues(),catalog=repo.catalog();
 const items=[
  {...catalog.find(v=>v.id==='taipei-arena'),country:'台湾'},
  {...catalog.find(v=>v.id==='taipei-dome'),country:'中国台湾'},
  {...catalog.find(v=>v.id==='kai-tak-stadium'),country:'香港'},
  {...catalog.find(v=>v.id==='hong-kong-coliseum'),country:'中国香港'}
 ];
 const site=createPublicSite({...repo,catalog:()=>items}),html=site.render('/zh-CN/venues/',{access:{venueIds:['taipei-arena']}});
 assert.equal((html.match(/data-country-group=/g)||[]).length,2);
 assert.equal((html.match(/data-venue-card /g)||[]).length,4);
 assert.match(html,/data-country-group="中国台湾"/);
 assert.match(html,/data-country-group="中国香港"/);
 assert.match(html,/<span data-country-count>2<\/span>/);
 assert.match(html,/<span>台北<\/span>/);
 assert.match(html,/<span>香港<\/span>/);
 assert.doesNotMatch(html,/<span>中国台湾 · 台北<\/span>|data-region-group=/);
 assert.ok(html.includes(`默认布局 · ${items[0].sectionCount} 分区`));
 assert.match(html,/不代表楼层数或座位总数/);
 assert.match(html,/<details class="directory-explainer"><summary>/);
 assert.doesNotMatch(html,/<details class="directory-explainer" open/);
 assert.match(html,/href="\/zh-CN\/explore\?venue=taipei-arena"/);
 assert.match(html,/href="\/zh-CN\/venues\/taipei-arena"/);
 const freeCard=html.match(/<article[^>]*data-search="[^"]*taipei-arena[^"]*"[\s\S]*?<\/article>/)?.[0];
 assert.match(freeCard,/status-pill is-free/);
 assert.match(site.render('/venues/'),/>Kai Tak Stadium<\/a>/);
});

test('a reviewed guide is withdrawn when its source version changes or coordinates disappear',()=>{
 const repo=loadVenues(),original=repo.get('taipei-arena');
 const siteFor=venue=>createPublicSite({...repo,get:id=>id==='taipei-arena'?venue:repo.get(id)});
 assert.ok(siteFor(original).get('/venues/taipei-arena'));
 for(const venue of [{...original,sourceSeats:[]},{...original,seatLayout:{...original.seatLayout,assetSha256:'unreviewed-version'}}]){
  const site=siteFor(venue);
  assert.equal(site.get('/venues/taipei-arena'),undefined);
  assert.equal(site.isIndexable('/previews/taipei-arena.svg'),false);
  assert.ok(!site.sitemap().includes('/venues/taipei-arena'));
 }
});

test('an unavailable or malformed venue asset withdraws only that guide, never the site',()=>{
 const repo=loadVenues();
 const site=createPublicSite({...repo,get:id=>{if(id==='taipei-arena')throw new Error('malformed source JSON');return repo.get(id);}});
 assert.equal(site.get('/venues/taipei-arena'),undefined);
 assert.equal(site.isIndexable('/about'),true);assert.equal(site.isIndexable('/api/health'),false);
 assert.ok(site.get('/venues/kai-tak-stadium'));
 assert.doesNotMatch(site.sitemap(),/venues\/taipei-arena/);
});


test('public guides retain internal provenance while rendering only user information',()=>{
 const repo=loadVenues(),site=createPublicSite(repo);
 for(const id of ['kai-tak-stadium','hong-kong-coliseum','taipei-arena']){
  const guide=site.get('/venues/'+id),venue=repo.get(id);
  assert.equal(guide.reviewedAssetSha256,venue.seatLayout.assetSha256);
  assert.equal(guide.sourceDate,venue.accuracy.sourceDate);
  assert.equal(guide.seatCount,venue.sourceSeats.length);
  for(const layout of guide.layouts){
   const asset=repo.get(id,layout.id).seatLayout;
   assert.equal(layout.source,asset.source);
   assert.equal(layout.version,asset.assetSha256.slice(0,12));
  }
  const html=site.render('/venues/'+id);
  assert.ok(!html.includes(guide.reviewedAssetSha256));
  for(const layout of guide.layouts)assert.ok(!html.includes(layout.source));
  for(const [,url] of guide.sources)assert.ok(html.includes(url.replaceAll('&','&amp;')));
 }
});
