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
