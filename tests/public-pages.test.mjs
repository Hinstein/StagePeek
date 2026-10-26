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

test('directory and three reviewed venue pages deliver useful initial HTML with resolvable CTAs',async t=>{
  const {call,venues}=await setup(t);
  const directory=await call('/venues/');assert.equal(directory.status,200);
  const hub=await directory.text();assert.match(hub,/<h1>场馆目录/);
  for(const id of ids){
    const path='/venues/'+id,response=await call(path),html=await response.text();
    assert.equal(response.status,200,path);assert.equal(response.headers.get('X-Robots-Tag'),null,path);
    assert.match(hub,new RegExp('href="'+path+'"'));
    assert.ok(html.includes(`rel="canonical" href="https://stagepeek.live${path}"`));
    assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
    for(const text of ['布局','来源','核验','未独立实测校准','纠错'])assert.ok(html.includes(text),text);
    const cta=html.match(/href="(\/\?[^\"]+)"[^>]*data-tool-entry/);assert.ok(cta,'crawlable tool CTA');
    const url=new URL(cta[1].replaceAll('&amp;','&'),'https://stagepeek.live');
    assert.equal(url.pathname,'/');assert.equal(url.searchParams.get('venue'),id);
    assert.equal(venues.resolve(id,Object.fromEntries(url.searchParams)).status,'matched');
    const image=html.match(/<img[^>]+src="(\/previews\/[^"?]+)"/);assert.ok(image,'static preview');
    const media=await call(image[1]);assert.equal(media.status,200);assert.equal(media.headers.get('X-Robots-Tag'),null);
    assert.match(await media.text(),/非按比例|非实景/);
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
  assert.equal((await call('/brand/stagepeek-social.png')).headers.get('X-Robots-Tag'),null);
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
  const plans=await(await call('/plans')).text();assert.match(plans,/暂未开放|暂时无法|每月/);assert.doesNotMatch(plans,/\$9\.99/);
});

test('public plans uses the same validated monthly price as checkout and hides failed prices',async t=>{
  const {call,config,billing}=await setup(t);
  Object.assign(config,{stripeSecretKey:'test-only',stripePriceId:'price_test',stripeWebhookSecret:'test-only'});
  billing.price=async()=>({id:'price_test',amount:1599,currency:'usd',interval:'month'});
  assert.match(await(await call('/plans')).text(),/15\.99/);
  assert.equal((await(await call('/api/billing/price')).json()).price.amount,1599);
  billing.price=async()=>{throw new Error('provider unavailable');};
  const response=await call('/plans');assert.equal(response.status,200);
  const html=await response.text();assert.match(html,/暂时无法读取正式价格/);assert.doesNotMatch(html,/15\.99/);
});
