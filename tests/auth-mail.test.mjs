import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {verifySignature,resolveMail,deliverMail} from '../infrastructure/auth-mail/router.mjs';
const registry={projects:[
 {slug:'seatpeep',displayName:'StagePeek',origin:'https://stagepeek.live',brand:{emailLogoUrl:'https://supabase.openp7m.com/auth-assets/stagepeek.png',logoAlt:'StagePeek',primaryColor:'#B984FF'},sender:{name:'StagePeek',email:'noreply@mail.stagepeek.live',verification:'verified',brevoSenderId:3},locales:['zh-CN','en'],defaultLocale:'zh-CN',auth:{routes:{confirmation:'https://stagepeek.live/auth/callback','magic-link':'https://stagepeek.live/auth/callback'},enabledFlows:['confirmation','magic-link']}},
 {slug:'openp7m',displayName:'OpenP7M',origin:'https://openp7m.com',brand:{emailLogoUrl:'https://supabase.openp7m.com/auth-assets/openp7m.png',logoAlt:'OpenP7M',primaryColor:'#655BD6'},sender:{name:'OpenP7M',email:'noreply@mail.openp7m.com',verification:'verified',brevoSenderId:2},locales:['it','en'],defaultLocale:'it',auth:{routes:{confirmation:'https://openp7m.com/auth/callback',recovery:'https://openp7m.com/auth/reset'},enabledFlows:['confirmation','recovery']}}
]};
const payload=(redirect='https://stagepeek.live/auth/callback',action='magiclink')=>({user:{email:'test@example.invalid',user_metadata:{brand:'Fake',role:'admin'}},email_data:{redirect_to:redirect,email_action_type:action,token:'123456'}});
test('hook signatures require trusted key, bounded timestamp and unmodified raw body',()=>{
 const key=Buffer.alloc(32,42),secret='v1,whsec_'+key.toString('base64'),raw=JSON.stringify(payload()),ts='1793000000',id='test-webhook';
 const sig=createHmac('sha256',key).update(id+'.'+ts+'.'+raw).digest('base64');
 const headers={'webhook-id':id,'webhook-timestamp':ts,'webhook-signature':'v1,'+sig};
 verifySignature(raw,headers,secret,Number(ts)*1000);
 assert.throws(()=>verifySignature(raw+' ',headers,secret,Number(ts)*1000),{code:'INVALID_SIGNATURE'});
 assert.throws(()=>verifySignature(raw,headers,secret,Number(ts)*1000+301000),{code:'INVALID_SIGNATURE'});
});
test('exact project registry chooses sender and OTP language without links or metadata authority',()=>{
 const m=resolveMail(registry,payload());assert.equal(m.message.sender.name,'StagePeek');assert.match(m.message.subject,/StagePeek/);assert.match(m.message.textContent,/123456/);assert.doesNotMatch(m.message.htmlContent,/<a\b|token_hash|ConfirmationURL|Fake/);
 const p=resolveMail(registry,payload('https://openp7m.com/auth/reset?lang=en&next=%2Fen%2Faccount%2F','recovery'));
 assert.equal(p.project.slug,'openp7m');assert.equal(p.message.sender.email,'noreply@mail.openp7m.com');assert.match(p.message.subject,/Reset/);
 assert.equal(resolveMail(registry,payload('https://openp7m.com/auth/callback?lang=it','signup')).locale,'it');
 for(const url of ['https://stagepeek.live.evil.invalid/auth/callback','https://stagepeek.live/auth/callback/','https://stagepeek.live/auth/callback?brand=foo','https://stagepeek.live/auth/callback?lang=en&lang=en','https://stagepeek.live/auth/callback?next=%2F','https://openp7m.com/auth/reset?next=%2F%2Fevil.invalid'])assert.throws(()=>resolveMail(registry,payload(url)));
 for(const action of ['invite','email_change','reauthentication','recovery'])assert.throws(()=>resolveMail(registry,payload(undefined,action)));
});
test('persistent ledger deduplicates concurrent delivery and restarts; uncertain delivery cannot resend',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'stagepeek-mail-test-'));try{
  const mail=resolveMail(registry,payload());let count=0;
  await deliverMail(mail,{ledgerDir:dir,send:async()=>{count++;}});
  await deliverMail(mail,{ledgerDir:dir,send:async()=>{count++;}});assert.equal(count,1);
  const uncertain={...mail,fingerprint:'a'.repeat(64)};
  await assert.rejects(deliverMail(uncertain,{ledgerDir:dir,send:async()=>{throw new Error('timeout');}}),{code:'DELIVERY_UNCERTAIN'});
  await assert.rejects(deliverMail(uncertain,{ledgerDir:dir,send:async()=>{count++;}}),{code:'DELIVERY_PENDING'});assert.equal(count,1);
  const rejected={...mail,fingerprint:'b'.repeat(64)};
  await assert.rejects(deliverMail(rejected,{ledgerDir:dir,send:async()=>{throw Object.assign(new Error('rejected'),{responseCode:550});}}),{code:'DELIVERY_FAILED'});
  await deliverMail(rejected,{ledgerDir:dir,send:async()=>{count++;}});assert.equal(count,2);
 }finally{await rm(dir,{recursive:true,force:true});}
});
