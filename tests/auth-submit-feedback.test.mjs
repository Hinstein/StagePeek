import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const source=readFileSync(new URL('../public/auth-page.mjs',import.meta.url),'utf8');
const feedback=source.slice(source.indexOf('function feedback('),source.indexOf('async function api('));
const submit=source.slice(source.indexOf("$('auth-form').onsubmit="),source.indexOf("$('auth-resend').onclick="));

function page(mode,api){
  const nodes=Object.fromEntries(['auth-form','auth-submit','auth-feedback','auth-email','auth-code','auth-password','auth-consent'].map(id=>[id,{value:'',textContent:'',disabled:false,focus(){context.active=id;}}]));
  nodes['auth-feedback'].getBoundingClientRect=()=>({top:context.visible?120:-195,bottom:context.visible?170:-146});
  nodes['auth-feedback'].scrollIntoView=()=>{context.visible=true;context.scrolls++;};
  nodes['auth-email'].value='stagepeek-ui-check@example.invalid';
  nodes['auth-password'].value='dummy-not-an-account-password';
  const context={mode,source:mode,lang:'zh-CN',busy:false,resendAt:0,next:'/explore',innerHeight:520,visible:false,scrolls:0,active:null,
    $:id=>nodes[id],api,copy:text=>text,render(){},updateResend(){},clearSecret(){},route:path=>path,
    history:{replaceState(){}},finish:async()=>{},Date};
  runInNewContext(feedback+submit,context);
  return {nodes,context,submit:()=>nodes['auth-form'].onsubmit({preventDefault(){}})};
}

for(const mode of ['login','otp'])test(`${mode} submit makes an offscreen API error visible and allows retry`,async()=>{
  const calls=[];
  const fixture=page(mode,async path=>{calls.push(path);throw new Error('Test rejection');});
  await fixture.submit();
  assert.equal(fixture.nodes['auth-feedback'].textContent,'Test rejection');
  assert.deepEqual(calls,[mode==='login'?'/api/auth/login':'/api/auth/email']);
  assert.equal(fixture.context.visible,true,'feedback must be visible after submitting from the bottom of the page');
  assert.equal(fixture.context.active,'auth-feedback');
  assert.equal(fixture.nodes['auth-submit'].disabled,false);
  assert.equal(fixture.context.busy,false);
});

test('OTP success keeps the response visible and puts typing focus in the code field',async()=>{
  const fixture=page('otp',async()=>({resendAfter:60}));
  await fixture.submit();
  assert.equal(fixture.context.mode,'code');
  assert.equal(fixture.context.visible,true);
  assert.equal(fixture.context.active,'auth-code');
  assert.equal(fixture.nodes['auth-submit'].disabled,false);
});

test('clearing feedback does not move focus or scroll; visible messages do not jump the page',()=>{
  const fixture=page('login',async()=>({}));
  fixture.context.active='auth-password';
  runInNewContext("feedback('');",fixture.context);
  assert.equal(fixture.context.active,'auth-password');
  assert.equal(fixture.context.scrolls,0);
  fixture.context.visible=true;
  runInNewContext("feedback('Test rejection');",fixture.context);
  assert.equal(fixture.context.active,'auth-feedback');
  assert.equal(fixture.context.scrolls,0);
});
