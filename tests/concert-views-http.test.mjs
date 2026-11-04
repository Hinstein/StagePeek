import test from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {openStore} from '../server/store.mjs';
import {createApplication} from '../server/app.mjs';
import {loadVenues} from '../server/venues.mjs';
import {loadConcertViews} from '../server/concert-views/index.mjs';

const views=loadConcertViews();

test('local concert workspace serves retained views without replacing main auth or catalog',async t=>{
 const db=openStore(':memory:');
 const config={appUrl:'http://127.0.0.1',allowedOrigins:[],authMode:'local',devMailbox:true,devPreviewAllVenues:true,production:false};
 const app=createApplication({db,config,venues:loadVenues(),concertViews:views});
 app.server.listen(0,'127.0.0.1');await once(app.server,'listening');
 config.appUrl=`http://127.0.0.1:${app.server.address().port}`;
 t.after(async()=>{await new Promise(resolve=>app.server.close(resolve));await db.close();});
 const get=path=>fetch(config.appUrl+path,{redirect:'manual'});
 const page=await get('/concert-views');
 assert.equal(page.status,200);assert.match(page.headers.get('x-robots-tag'),/noindex/);
 const html=await page.text();assert.match(html,/concert-views\/app.mjs/);assert.doesNotMatch(html,/id="auth-dialog"/);
 assert.doesNotMatch(await(await get('/explore')).text(),/concert-views\/entry-link.mjs/);
 assert.match(html,/id="venue-country"/);assert.match(html,/class="explorer-steps"/);
 assert.match(html,/href="\/style.css\?v=9e528dd"/);assert.doesNotMatch(html,/concert-views\/style.css/);
 assert.equal((await get('/zh-CN/concert-views')).status,200);
 for(const path of ['/concert-views/index.html','/concert-views/style.css'])assert.equal((await get(path)).status,404,path);
 assert.match(await(await get('/auth/login')).text(),/auth-page.mjs/);
 assert.equal((await(await get('/api/me')).json()).providers.auth,'local');
 const mainCatalog=await(await get('/api/venues')).json();
 assert.ok(mainCatalog.venues.length>2);
 assert.equal((await get('/api/concert-views/venues/not-curated')).status,404);
 assert.equal((await(await get('/api/concert-views/venues/twcv-the-o2-arena-london/events')).json()).researchConcerts.length,2);
 const resolved=await fetch(config.appUrl+'/api/concert-views/venues/twcv-the-o2-arena-london/resolve',{
  method:'POST',headers:{Origin:config.appUrl,'Content-Type':'application/json'},body:JSON.stringify({layout:'o2a',section:'110',row:'18',seat:'319'})
 });
 assert.equal(resolved.status,200);assert.equal((await resolved.json()).status,'matched');
 const image=await get('/api/concert-views/hydro/ovo-hydro/image');
 assert.equal(image.status,200);assert.equal(image.headers.get('content-type'),'image/png');
 assert.equal(createHash('sha256').update(Buffer.from(await image.arrayBuffer())).digest('hex'),views.hydro.venueDraft.map.sourceSha256);
 const head=await fetch(config.appUrl+'/api/concert-views/hydro/ovo-hydro/image',{method:'HEAD'});
 assert.equal(head.status,200);assert.equal((await head.arrayBuffer()).byteLength,0);
 config.devPreviewAllVenues=false;
 for(const path of ['/venue-view/venue-view-controls.mjs','/venue-view/venue-camera-policy.mjs','/venue-view/venue-palette.mjs','/venue-view/venue-view.css','/venue-preview.mjs'])assert.equal((await get(path)).status,200,path);
 for(const path of ['/concert-views','/concert-views/app.mjs','/api/concert-views/hydro'])assert.equal((await get(path)).status,404,path);
});

test('main business files retain baseline bytes and reviewed consumer copy retains its scoped snapshot',()=>{
 const boundary=JSON.parse(readFileSync(new URL('../docs/projects/concert-views/main-boundary.json',import.meta.url)));
 // Consumer copy was explicitly revised after the original main integration.
 // Keep both snapshots: this must not rebaseline account, billing or source data.
 const consumerFiles=boundary.consumerPresentationReview.files;
 assert.deepEqual(Object.keys(consumerFiles).sort(),[
  'public/index.html','public/locales.mjs','public/translations/en.mjs','public/translations/interface.mjs',
  'public/translations/ja.mjs','public/translations/ko.mjs','public/translations/zh-CN.mjs',
  'public/translations/zh-TW.mjs','server/public-content.mjs','server/public-pages.mjs'
 ].sort());
 assert.equal(boundary.mainUpdate.commit,'ab7c4e99100099b51b49b27438bb67b108509ebd');
 for(const [path,hash] of Object.entries(boundary.mainUpdate.files))assert.equal(createHash('sha256').update(readFileSync(new URL('../'+path,import.meta.url))).digest('hex'),hash,path);
 const sharedViewFiles=new Set(['public/app.mjs']);
 for(const [path,hash] of Object.entries(boundary.protectedFiles)){
  if(sharedViewFiles.has(path))continue;
  assert.equal(createHash('sha256').update(readFileSync(new URL('../'+path,import.meta.url))).digest('hex'),consumerFiles[path]||boundary.mainUpdate.files[path]||hash,path);
 }
});
