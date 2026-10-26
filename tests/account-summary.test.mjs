import test from 'node:test';
import assert from 'node:assert/strict';
import {accountSummary} from '../public/account-summary.mjs';
const now=Date.UTC(2026,9,26),end=now+86400000;
const account=(plan='free',subscription=null)=>({access:{plan,venueIds:Array.from({length:plan==='pro'?201:10},(_,i)=>String(i)),maxSaved:plan==='pro'?100:8},subscription});
test('account shows actual free entitlements and no invented subscription',()=>{
 const summary=accountSummary(account(),'zh-CN',now);
 assert.equal(summary.plan,'StagePeek Free');assert.equal(summary.pro,false);
 assert.match(summary.description,/10/);assert.match(summary.period,/没有付费订阅/);
 assert.equal(accountSummary(account(),'en',now).status,'Free membership');
});
test('active, trial and cancelled-renewal Pro memberships explain their period',()=>{
 const active=accountSummary(account('pro',{status:'active',period_end:end}),'en',now);
 assert.equal(active.status,'Active membership');assert.match(active.period,/Current period ends/);
 const trial=accountSummary(account('pro',{status:'trialing',period_end:end}),'zh-CN',now);
 assert.equal(trial.status,'试用中');assert.match(trial.period,/试用结束/);
 const cancel=accountSummary(account('pro',{status:'active',period_end:end,cancel_at_period_end:1}),'zh-CN',now);
 assert.equal(cancel.plan,'StagePeek Pro');assert.equal(cancel.status,'已取消续费');assert.match(cancel.period,/权益保留至/);
});
test('historical or delinquent subscriptions never grant or display Pro membership',()=>{
 const expired=accountSummary(account('free',{status:'active',period_end:now-1}),'en',now);
 assert.equal(expired.plan,'StagePeek Free');assert.match(expired.period,/previous subscription ended/);
 const delinquent=accountSummary(account('free',{status:'past_due',period_end:end}),'zh-CN',now);
 assert.equal(delinquent.status,'付款待处理');assert.match(delinquent.period,/未获得 Pro/);
 const cancelled=accountSummary(account('free',{status:'canceled',period_end:now-1}),'en',now);
 assert.equal(cancelled.status,'Subscription ended');
});
test('missing or invalid billing period never becomes a fake renewal date',()=>{
 const summary=accountSummary(account('pro',{status:'active',period_end:'invalid'}),'en',now);
 assert.match(summary.period,/unavailable/);assert.doesNotMatch(summary.period,/Invalid Date|1970/);
});
