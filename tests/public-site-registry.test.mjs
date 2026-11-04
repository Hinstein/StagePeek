import test from 'node:test';
import assert from 'node:assert/strict';
import {createPublicSite} from '../server/public-pages.mjs';
import {loadVenues} from '../server/venues.mjs';

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
