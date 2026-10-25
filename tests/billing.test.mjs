import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {openStore} from '../server/store.mjs';
import {AuthService} from '../server/auth.mjs';
import {entitlements} from '../server/access.mjs';

const response=value=>new Response(JSON.stringify(value),{headers:{'content-type':'application/json'}});
async function setup(t) {
  const {BillingService}=await import('../server/billing.mjs');
  const db=openStore(':memory:');t.after(()=>db.close());const now=1_800_000_000_000;let clock=now;
  const auth=new AuthService(db,{clock:()=>now});const user=auth.consumeEmail(auth.issueEmail('viewer@example.com').token);
  const calls=[];
  const current={id:'sub_1',customer:'cus_1',status:'active',current_period_end:now/1000+86400,cancel_at_period_end:false,items:{data:[{price:{id:'price_monthly'}}]}};
  let interval='month',sessionCount=0;const pending={id:'cs_1',url:'https://checkout.stripe.com/c/pay/cs_1',status:'open',customer:'cus_1',expires_at:now/1000+3600};const liveSubscriptions=[];
  const service=new BillingService(db,{appUrl:'http://localhost:4180',stripeSecretKey:'sk_test_placeholder',stripePriceId:'price_monthly',stripeWebhookSecret:'whsec_local_test'}, {
    clock:()=>clock,
    fetch:async(url,options={})=>{
      calls.push({url:String(url),options});
      if(String(url).includes('/prices/'))return response({id:'price_monthly',active:true,type:'recurring',unit_amount:900,currency:'usd',recurring:{interval,interval_count:1}});
      if(String(url).endsWith('/customers'))return response({id:'cus_1'});
      if(String(url).endsWith('/checkout/sessions')){sessionCount++;return response({...pending,id:'cs_'+sessionCount,url:'https://checkout.stripe.com/c/pay/cs_'+sessionCount});}
      if(String(url).includes('/checkout/sessions/cs_'))return response(pending);
      if(String(url).includes('/subscriptions?'))return response({data:liveSubscriptions,has_more:false});
      if(String(url).endsWith('/billing_portal/sessions'))return response({url:'https://billing.stripe.com/p/session/test'});
      if(String(url).endsWith('/subscriptions/sub_1'))return response(current);
      throw new Error('Unexpected provider request '+url);
    }
  });
  function signed(event,timestamp=now/1000) {
    const raw=Buffer.from(JSON.stringify(event));
    return {raw,signature:`t=${timestamp},v1=${createHmac('sha256','whsec_local_test').update(`${timestamp}.`).update(raw).digest('hex')}`};
  }
  const event=(id='evt_1')=>({id,type:'customer.subscription.updated',data:{object:{id:'sub_1'}}});
  return {db,user,service,current,calls,now,signed,event,pending,liveSubscriptions,advance:ms=>{clock+=ms;},setInterval:value=>{interval=value;}};
}

test('checkout uses server monthly price and stored customer; redirects never grant access',async t=>{
  const {service,user,db,calls,now}=await setup(t);
  const result=await service.checkout(user);
  assert.match(result.url,/^https:\/\/checkout.stripe.com\//);
  assert.equal(entitlements(db,user,now).plan,'free');
  const request=calls.find(x=>x.url.endsWith('/checkout/sessions'));
  const form=new URLSearchParams(request.options.body);
  assert.equal(form.get('mode'),'subscription');
  assert.equal(form.get('line_items[0][price]'),'price_monthly');
  assert.equal(form.get('customer'),'cus_1');
  await service.portal(user);
  assert.equal(new URLSearchParams(calls.at(-1).options.body).get('customer'),'cus_1');
});

test('annual prices cannot be sold as monthly subscriptions',async t=>{
  const {service,user,setInterval,calls}=await setup(t);setInterval('year');
  await assert.rejects(()=>service.checkout(user),/monthly/i);
  assert.equal(calls.some(x=>x.url.endsWith('/checkout/sessions')),false);
});

test('pending checkout is reused across concurrent clicks, ten-minute windows and service restart',async t=>{
  const {BillingService}=await import('../server/billing.mjs');
  const {service,user,calls,db,advance}=await setup(t);
  const first=await Promise.all([service.checkout(user),service.checkout(user)]);
  assert.equal(first[0].url,first[1].url);advance(11*60_000);
  const reopened=new BillingService(db,service.config,{fetch:service.fetch,clock:service.clock});
  assert.equal((await reopened.checkout(user)).url,first[0].url);
  assert.equal(calls.filter(x=>x.url.endsWith('/checkout/sessions')&&x.options.method==='POST').length,1);
});

test('live provider subscription blocks a new checkout while its webhook has not arrived',async t=>{
  const {service,user,liveSubscriptions,db,now,calls}=await setup(t);
  liveSubscriptions.push({id:'sub_1',customer:'cus_1',status:'active',items:{data:[{price:{id:'price_monthly'}}]}});
  assert.equal(entitlements(db,user,now).plan,'free');
  await assert.rejects(()=>service.checkout(user),error=>error.code==='ALREADY_SUBSCRIBED');
  assert.equal(calls.filter(x=>x.url.endsWith('/checkout/sessions')).length,0);
});

test('webhook verifies signature and time before touching account',async t=>{
  const {service,db,event,signed,now}=await setup(t);
  const req=signed(event());
  await assert.rejects(()=>service.webhook(req.raw,'t=1800000000,v1=00'),/signature/i);
  const stale=signed(event(),now/1000-301);
  await assert.rejects(()=>service.webhook(stale.raw,stale.signature),/signature/i);
  assert.equal(db.prepare('SELECT count(*) n FROM subscriptions').get().n,0);
});

test('replayed and delayed webhooks use provider current state and cannot resurrect canceled access',async t=>{
  const {service,user,db,current,signed,event,now}=await setup(t);await service.checkout(user);
  let req=signed(event());await service.webhook(req.raw,req.signature);
  assert.equal(entitlements(db,user,now).plan,'pro');
  assert.equal((await service.webhook(req.raw,req.signature)).duplicate,true);
  current.status='canceled';req=signed(event('evt_2'));await service.webhook(req.raw,req.signature);
  assert.equal(entitlements(db,user,now).plan,'free');
  const delayed={...event('evt_old'),data:{object:{...current,status:'active'}}};
  req=signed(delayed);await service.webhook(req.raw,req.signature);
  assert.equal(entitlements(db,user,now).plan,'free');
});

test('wrong price or unknown customer does not grant premium access',async t=>{
  const {service,user,db,current,signed,event,now}=await setup(t);await service.checkout(user);
  current.items.data[0].price.id='price_other';let req=signed(event());await service.webhook(req.raw,req.signature);
  assert.equal(entitlements(db,user,now).plan,'free');
  current.items.data[0].price.id='price_monthly';current.customer='cus_stranger';
  req=signed(event('evt_2'));await service.webhook(req.raw,req.signature);
  assert.equal(entitlements(db,user,now).plan,'free');
});
