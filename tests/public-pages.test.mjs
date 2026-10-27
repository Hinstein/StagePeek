import test from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {openStore} from '../server/store.mjs';
import {loadVenues} from '../server/venues.mjs';
import {createApplication} from '../server/app.mjs';

const ids=['kai-tak-stadium','hong-kong-coliseum','taipei-arena'];
async function setup(t){
  const db=openStore(':memory:'),venues=loadVenues();
  const config={production:false,devMailbox:true,appUrl:'http://127.0.0.1',freeVenueIds:ids};
  const app=createApplication({db,venues,config});
  app.server.listen(0,'127.0.0.1');await once(app.server,'listening');
  const origin=`http://127.0.0.1:${app.server.address().port}`;
  config.appUrl='https://stagepeek.live';config.allowedOrigins=[origin];config.production=true;
  t.after(async()=>{await new Promise(resolve=>app.server.close(resolve));await db.close();});
  return {config,venues,billing:app.billing,call:(path,method='GET')=>fetch(origin+path,{method,redirect:'manual'})};
}

test('selected homepage is the public entry and existing ticket links still open the tool',async t=>{
  const {call}=await setup(t);
  const response=await call('/'),home=await response.text();
  assert.equal(response.status,200);
  assert.equal(response.headers.get('X-Robots-Tag'),null);
  assert.match(home,/Before the show/);
  assert.match(home,/data-live-preview/);
  assert.match(home,/aria-label="Interactive Kai Tak stand model/);
  assert.doesNotMatch(home,/aria-label="[^"]*[\p{Script=Han}][^"]*"/u);
  assert.doesNotMatch(home,/birds-nest|鸟巢/);
  const demo=home.match(/href="(\/explore\?[^"]+)"[^>]*data-tool-entry/);
  assert.ok(demo,'free homepage example');
  const example=new URL(demo[1].replaceAll('&amp;','&'),'https://stagepeek.live');
  const venue=example.searchParams.get('venue');
  assert.equal(venue,'kai-tak-stadium');
  const listing=await(await call('/api/venues')).json();
  assert.equal(listing.venues.find(item=>item.id===venue).locked,false);
  assert.equal((await call('/api/venues/'+venue)).status,200);
  assert.equal((await import('../server/venues.mjs')).loadVenues().resolve(venue,Object.fromEntries(example.searchParams)).status,'matched');
  assert.match(home,/class="live-fallback"[^>]+alt="[^"]+illustration/);
  assert.match(home,/data-peek-zoom="5"/);
  assert.match(home,/href="\/explore"[^>]*data-tool-entry/);
  assert.match(home,/href="\/auth\/login"/);
  assert.doesNotMatch(home,/首页设计预览|prototype-bar|data-variant|id="ticket-form"/);
  assert.equal((home.match(/<h1[ >]/g)||[]).length,1);
  for(const path of ['/explore','/?venue=taipei-arena&section=101&row=A&seat=1','/?panel=plans','/?account=billing','/?billing=success','/?login=email']){
    const tool=await call(path);
    assert.equal(tool.status,200,path);
    assert.match(tool.headers.get('X-Robots-Tag'),/noindex/,path);
    assert.match(await tool.text(),/id="ticket-form"/,path);
  }
  assert.match(await(await call('/?utm_source=launch')).text(),/Before the show/);
  for(const path of ['/home.css','/home.mjs','/home-venue-preview.mjs','/home-assets/audience.svg','/home-assets/arena-3d.svg'])assert.equal((await call(path)).status,200,path);
  const head=await call('/','HEAD');assert.equal(head.status,200);assert.equal(await head.text(),'');
});

test('directory and three reviewed venue pages deliver useful initial HTML with resolvable CTAs',async t=>{
  const {call,venues}=await setup(t);
  const directory=await call('/venues/');assert.equal(directory.status,200);
  const hub=await directory.text();assert.match(hub,/<h1>Venue directory<\/h1>/);
  for(const id of ids){
    const path='/venues/'+id,response=await call(path),html=await response.text();
    assert.equal(response.status,200,path);assert.equal(response.headers.get('X-Robots-Tag'),null,path);
    assert.match(hub,new RegExp('href="'+path+'"'));
    assert.ok(html.includes(`rel="canonical" href="https://stagepeek.live${path}"`));
    assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
    for(const text of ['layout','Source','review','Not independently calibrated'])assert.ok(html.toLowerCase().includes(text.toLowerCase()),text);
    const cta=html.match(/href="(\/explore\?[^\"]+)"[^>]*data-tool-entry/);assert.ok(cta,'crawlable tool CTA');
    const url=new URL(cta[1].replaceAll('&amp;','&'),'https://stagepeek.live');
    assert.equal(url.pathname,'/explore');assert.equal(url.searchParams.get('venue'),id);
    assert.equal(venues.resolve(id,Object.fromEntries(url.searchParams)).status,'matched');
    const image=html.match(/<img[^>]+src="(\/previews\/[^"?]+)"/);assert.ok(image,'static preview');
    const media=await call(image[1]);assert.equal(media.status,200);assert.equal(media.headers.get('X-Robots-Tag'),null);
    const illustration=await media.text();assert.match(illustration,/Not to scale/);assert.match(illustration,/Not a photograph/);
    const schemas=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
    const breadcrumb=schemas.flatMap(s=>s['@graph']||[s]).find(s=>s['@type']==='BreadcrumbList');
    assert.ok(breadcrumb);assert.equal(breadcrumb.itemListElement.at(-1).item,'https://stagepeek.live'+path);
    const head=await call(path,'HEAD');assert.equal(head.status,200);assert.equal(await head.text(),'');
  }
});

test('sitemap, redirects and role-based indexing agree, including staging and sensitive parameters',async t=>{
  const {call,config}=await setup(t);
  const xml=await(await call('/sitemap.xml')).text(),paths=[...xml.matchAll(/<loc>https:\/\/stagepeek.live([^<]*)<\/loc>/g)].map(m=>m[1]);
  for(const path of ['/','/venues/',...ids.map(id=>'/venues/'+id),'/about','/methodology','/plans','/contact'])assert.ok(paths.includes(path),path);
  for(const path of paths){const response=await call(path);assert.equal(response.status,200,path);assert.equal(response.headers.get('X-Robots-Tag'),null,path);}
  for(const path of ['/privacy','/terms','/admin.html','/auth/callback','/api/venues','/mockups/home-prototype.html','/?venue=kai-tak-stadium','/venues/?token=secret','/venues/taipei-arena?login=email','/previews/taipei-arena.svg?token=secret'])assert.match((await call(path)).headers.get('X-Robots-Tag'),/noindex/,path);
  for(const path of ['/venues/unknown','/venues/tottenham','/venues/%74aipei-arena'])assert.equal((await call(path)).status,404,path);
  const hub=await call('/venues');assert.equal(hub.status,308);assert.equal(hub.headers.get('Location'),'/venues/');
  const duplicate=await call('/venues/taipei-arena/');assert.equal(duplicate.status,308);assert.equal(duplicate.headers.get('Location'),'/venues/taipei-arena');
  for(const path of ['/brand/stagepeek-social.png','/home-assets/audience.svg','/home-assets/arena-3d.svg'])assert.equal((await call(path)).headers.get('X-Robots-Tag'),null);
  assert.match((await call('/home-assets/not-approved.svg')).headers.get('X-Robots-Tag'),/noindex/);
  config.production=false;for(const path of ['/venues/','/venues/taipei-arena','/previews/taipei-arena.svg'])assert.match((await call(path)).headers.get('X-Robots-Tag'),/noindex/);
});

test('service pages, home schema and public navigation remain usable without scripts',async t=>{
  const {call}=await setup(t),home=await(await call('/')).text();
  for(const path of ['/venues/','/about','/methodology','/plans','/contact','/privacy','/terms']){
    assert.ok(home.includes(`href="${path}"`),path);const response=await call(path);assert.equal(response.status,200,path);
    assert.match(await response.text(),/<h1[ >]/);
  }
  const graph=[...home.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1])['@graph']||[]);
  assert.ok(graph.some(s=>s['@type']==='WebSite'&&s.url==='https://stagepeek.live/'));
  assert.ok(graph.some(s=>s['@type']==='Organization'&&s.name==='StagePeek'));
  const plans=await(await call('/plans')).text();assert.match(plans,/Subscriptions are not on sale/);assert.doesNotMatch(plans,/\$9\.99/);
});

test('localized public routes expose translated metadata and reciprocal language links',async t=>{
  const {call}=await setup(t);
  const routes=[['en','/'],['zh-CN','/zh-CN/'],['zh-TW','/zh-TW/'],['ja','/ja/'],['ko','/ko/']];
  for(const [locale,path] of routes){
    const response=await call(path),html=await response.text();
    assert.equal(response.status,200,path);
    assert.match(html,new RegExp(`<html lang="${locale}">`),path);
    assert.match(html,new RegExp(`rel="canonical" href="https://stagepeek.live${path}"`),path);
    for(const target of routes)assert.match(html,new RegExp(`hreflang="${target[0]}" href="https://stagepeek.live${target[1]}"`),`${path} -> ${target[0]}`);
    assert.match(html,/hreflang="x-default" href="https:\/\/stagepeek\.live\/"/);
    assert.match(html,/class="language-switcher"/);
  }
  for(const locale of ['zh-CN','zh-TW','ja','ko']){
    const page=await call(`/${locale}/venues/`),html=await page.text();
    assert.equal(page.status,200);
    assert.match(html,/<h1[^>]*>/);
    assert.match(html,new RegExp(`<html lang="${locale}">`));
    assert.doesNotMatch(html.replace(/<a href="\/venues\/"[^>]*data-locale="en"[^>]*>English<\/a>/g,''),/href="\/venues\//);
  }
  const xml=await(await call('/sitemap.xml')).text();
  for(const path of ['/','/zh-CN/','/zh-TW/','/ja/','/ko/','/ja/venues/','/ko/methodology'])assert.match(xml,new RegExp(`<loc>https://stagepeek\.live${path.replaceAll('/','\\/')}<\\/loc>`),path);
});

test('public plans uses the same validated monthly price as checkout and hides failed prices',async t=>{
  const {call,config,billing}=await setup(t);
  Object.assign(config,{stripeSecretKey:'test-only',stripePriceId:'price_test',stripeWebhookSecret:'test-only'});
  billing.price=async()=>({id:'price_test',amount:1599,currency:'usd',interval:'month'});
  assert.match(await(await call('/plans')).text(),/15\.99/);
  assert.equal((await(await call('/api/billing/price')).json()).price.amount,1599);
  billing.price=async()=>{throw new Error('provider unavailable');};
  const response=await call('/plans');assert.equal(response.status,200);
  const html=await response.text();assert.match(html,/The current price is unavailable/);assert.doesNotMatch(html,/15\.99/);
});

test('every localized public page has a real title and each guide preserves source provenance',async t=>{
 const {call}=await setup(t);
 for(const locale of ['en','zh-CN','zh-TW','ja','ko']){
  const prefix=locale==='en'?'':'/'+locale;
  for(const path of ['/venues/','/venues/kai-tak-stadium','/venues/hong-kong-coliseum','/venues/taipei-arena','/about','/methodology','/plans','/contact','/privacy','/terms']){
   const response=await call(prefix+path),html=await response.text();
   assert.equal(response.status,200,prefix+path);
   assert.ok(html.includes(`<html lang="${locale}">`));assert.doesNotMatch(html,/<(?:title|h1)[^>]*>[^<]*undefined/);
   if(ids.some(id=>path==='/venues/'+id)){
    assert.match(html,/2026-10-24/);assert.match(html,/oss-cn-beijing/);assert.match(html,/[a-f0-9]{12}/);
   }
  }
  const svg=await(await call(prefix+'/previews/kai-tak-stadium.svg')).text();
  if(locale==='en')assert.match(svg,/Kai Tak Stadium/);
  if(locale==='ja')assert.match(svg,/啓徳スタジアム/);
  if(locale==='ko')assert.match(svg,/카이탁 스타디움/);
 }
});
