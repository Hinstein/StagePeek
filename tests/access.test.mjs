import test from 'node:test';
import assert from 'node:assert/strict';

test('guest, free, paid, cancel-at-period-end and expired access is enforced from stored subscription',async t=>{
  const {openStore}=await import('../server/store.mjs');
  const {AuthService}=await import('../server/auth.mjs');
  const {entitlements}=await import('../server/access.mjs');
  const db=openStore(':memory:');t.after(()=>db.close());
  const auth=new AuthService(db);const user=auth.consumeEmail(auth.issueEmail('viewer@example.com').token);
  const now=Date.now();
  assert.deepEqual(entitlements(db,null,now).venueIds,['tottenham']);
  assert.equal(entitlements(db,null,now).canSave,false);
  assert.equal(entitlements(db,user,now).plan,'free');
  assert.equal(entitlements(db,user,now).canSave,true);
  db.prepare(`INSERT INTO subscriptions(id,user_id,status,period_end,cancel_at_period_end,price_id) VALUES(?,?,?,?,?,?)`).run('sub_a',user.id,'active',now+1000,1,'price_monthly');
  assert.equal(entitlements(db,user,now).plan,'pro');
  assert.deepEqual(entitlements(db,user,now).venueIds,['tottenham','metlife','sofi']);
  assert.equal(entitlements(db,user,now+1001).plan,'free');
  db.prepare('UPDATE subscriptions SET status=?,period_end=?').run('past_due',now+10000);
  assert.equal(entitlements(db,user,now).plan,'free');
  db.prepare('UPDATE subscriptions SET status=?').run('canceled');
  assert.equal(entitlements(db,user,now).plan,'free');
});
