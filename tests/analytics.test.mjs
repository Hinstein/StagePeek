import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {analyticsMarkup} from '../server/analytics.mjs';
import {loadConfig} from '../server/config.mjs';

const id='01234567-89ab-cdef-0123-456789abcdef';
const config={production:true,appUrl:'https://stagepeek.live',umamiWebsiteId:id};
test('analytics is optional and restricted to a configured anonymous production landing',()=>{
  const request={path:'/',search:'',user:null};
  assert.match(analyticsMarkup(config,request),/src="\/analytics.mjs"/);
  for(const patch of [{production:false},{appUrl:'https://staging.example'},{umamiWebsiteId:''},{umamiWebsiteId:'"><script>'}])assert.equal(analyticsMarkup({...config,...patch},request),'');
  for(const patch of [{path:'/admin.html'},{path:'/api/me'},{search:'?seat=78'},{user:{id:'private-id'}}])assert.equal(analyticsMarkup(config,{...request,...patch}),'');
  assert.equal(loadConfig({UMAMI_WEBSITE_ID:id}).umamiWebsiteId,id);
  assert.throws(()=>loadConfig({UMAMI_WEBSITE_ID:'invalid'}),/UUID/);
});

test('tracker respects privacy controls and sends only the fixed public page payload',async()=>{
  const source=await readFile(new URL('../public/analytics.mjs',import.meta.url),'utf8');
  function run({search='',hash='',hostname='stagepeek.live',doNotTrack='0',globalPrivacyControl=false}={}){
    const appended=[],sent=[];
    const document={querySelector:()=>({dataset:{websiteId:id}}),createElement:()=>({dataset:{}}),head:{append:s=>appended.push(s)}};
    runInNewContext(source,{document,location:{hostname,pathname:'/',search,hash},navigator:{doNotTrack,globalPrivacyControl},window:{umami:{track:value=>sent.push(JSON.parse(JSON.stringify(value)))}}});
    for(const script of appended){assert.equal(script.dataset.autoTrack,'false');assert.equal(script.referrerPolicy,'no-referrer');script.onload();}
    return {appended,sent};
  }
  assert.deepEqual(run().sent,[{website:id,hostname:'stagepeek.live',url:'/',title:'StagePeek'}]);
  for(const input of [{search:'?token=secret'},{search:'?row=A&seat=78'},{hash:'#token=secret'},{hostname:'localhost'},{doNotTrack:'1'},{globalPrivacyControl:true}])assert.equal(run(input).appended.length,0);
});

test('anonymous public guide analytics uses only approved page paths',()=>{
  for(const path of ['/explore','/venues/','/venues/taipei-arena','/methodology','/plans','/contact'])assert.match(analyticsMarkup(config,{path,search:'',user:null}),/src="\/analytics.mjs"/);
  for(const path of ['/venues/not-reviewed','/privacy','/terms','/api/venues','/venues/taipei-arena/'])assert.equal(analyticsMarkup(config,{path,search:'',user:null}),'');
});

test('events are bounded, omit private values and stop after sign-in or URL changes',async()=>{
 const source=await readFile(new URL('../public/analytics.mjs',import.meta.url),'utf8');
 const sent=[],scripts=[],listeners={};
 const page='/venues/taipei-arena';
 const location={hostname:'stagepeek.live',pathname:page,search:'',hash:''};
 const window={umami:{track:value=>sent.push(JSON.parse(JSON.stringify(value)))}};
 const document={querySelector:()=>({dataset:{websiteId:id,publicPath:page}}),createElement:()=>({dataset:{}}),head:{append:script=>scripts.push(script)},addEventListener:(name,handler)=>listeners[name]=handler};
 runInNewContext(source,{document,location,navigator:{},window});scripts[0].onload();
 window.stagepeekTrack('seat_located',{email:'private@example.com',seat:'private-seat'});
 window.stagepeekTrack('seat_located');window.stagepeekTrack('private-event');
 listeners.click({target:{closest:()=>({href:'/?token=secret&seat=1'})}});
 window.stagepeekSignedIn=true;window.stagepeekTrack('view_3d');
 window.stagepeekSignedIn=false;location.hash='#token=secret';window.stagepeekTrack('plan_open');
 assert.deepEqual(sent.map(value=>value.name||'pageview'),['pageview','seat_located','tool_open']);
 for(const value of sent){assert.equal(value.url,page);assert.deepEqual(Object.keys(value).sort(),(value.name?['website','hostname','url','title','name']:['website','hostname','url','title']).sort());}
 assert.doesNotMatch(JSON.stringify(sent),/private|secret|token=|seat=/);
});

test('localized analytics accepts only fixed public routes and still excludes ticket and auth pages',()=>{
 for(const path of ['/ja/','/ko/explore','/zh-TW/venues/kai-tak-stadium','/zh-CN/plans']){
  assert.ok(analyticsMarkup(config,{path,search:'',user:null}).includes(`data-public-path="${path}"`));
  assert.equal(analyticsMarkup(config,{path,search:'?row=A&seat=78',user:null}),'');
 }
 for(const path of ['/ja/auth/login','/ko/account','/zh-TW/venues/private','/ja/privacy','/xx/plans'])assert.equal(analyticsMarkup(config,{path,search:'',user:null}),'');
});
