import test from 'node:test';
import assert from 'node:assert/strict';

test('guest, free, paid, cancel-at-period-end and expired access is enforced from stored subscription',async t=>{
  const {openStore}=await import('../server/store.mjs');
  const {AuthService}=await import('../server/auth.mjs');
  const {entitlements}=await import('../server/access.mjs');
  const db=openStore(':memory:');t.after(()=>db.close());
  const auth=new AuthService(db);const user=(await auth.consumeEmail((await auth.issueEmail('viewer@example.com')).token));
  const now=Date.now();
  assert.deepEqual((await entitlements(db,null,now)).venueIds,['tottenham']);
  assert.equal((await entitlements(db,null,now)).canSave,false);
  assert.equal((await entitlements(db,user,now)).plan,'free');
  assert.equal((await entitlements(db,user,now)).canSave,true);
  (await db.prepare(`INSERT INTO subscriptions(id,user_id,status,period_end,cancel_at_period_end,price_id) VALUES(?,?,?,?,?,?)`).run('sub_a',user.id,'active',now+1000,1,'price_monthly'));
  assert.equal((await entitlements(db,user,now)).plan,'pro');
  assert.deepEqual((await entitlements(db,user,now)).venueIds,['tottenham','metlife','sofi']);
  assert.equal((await entitlements(db,user,now+1001)).plan,'free');
  (await db.prepare('UPDATE subscriptions SET status=?,period_end=?').run('past_due',now+10000));
  assert.equal((await entitlements(db,user,now)).plan,'free');
  (await db.prepare('UPDATE subscriptions SET status=?').run('canceled'));
  assert.equal((await entitlements(db,user,now)).plan,'free');
});

test('free venue policy is persisted and admin changes require exactly ten existing ids',async t=>{
  const {openStore}=await import('../server/store.mjs');
  const {freeVenueIds,saveFreeVenueIds,DEFAULT_FREE_VENUE_IDS}=await import('../server/access.mjs');
  const db=openStore(':memory:');t.after(()=>db.close());
  const available=[...DEFAULT_FREE_VENUE_IDS,'extra-venue'];
  assert.deepEqual((await freeVenueIds(db,available,DEFAULT_FREE_VENUE_IDS)),DEFAULT_FREE_VENUE_IDS);
  const selected=DEFAULT_FREE_VENUE_IDS.slice().reverse();
  assert.deepEqual((await saveFreeVenueIds(db,selected,available,'admin@example.com',123)),selected);
  assert.deepEqual((await freeVenueIds(db,available,DEFAULT_FREE_VENUE_IDS)),selected);
  await assert.rejects(async ()=>(await saveFreeVenueIds(db,['extra-venue'],available,'admin@example.com')),error=>error.code==='INVALID_FREE_VENUES');
});
