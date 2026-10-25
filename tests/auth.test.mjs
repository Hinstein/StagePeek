import test from 'node:test';
import assert from 'node:assert/strict';

async function setup() {
  const {openStore} = await import('../server/store.mjs');
  const {AuthService} = await import('../server/auth.mjs');
  const store = openStore(':memory:');
  let now = 1_800_000_000_000;
  const auth = new AuthService(store, {clock: () => now});
  return {store, auth, advance: ms => {now += ms;}};
}

test('email verification creates one account and tokens are stored hashed and consumed once', async t => {
  const {store,auth} = await setup(); t.after(() => store.close());
  const {token} = auth.issueEmail(' Viewer@Example.com ');
  assert.equal(store.prepare('SELECT token_hash FROM login_tokens').get().token_hash.includes(token),false);
  const user=auth.consumeEmail(token);
  assert.equal(user.email,'viewer@example.com');
  assert.throws(() => auth.consumeEmail(token), /invalid|expired/i);
  const again=auth.consumeEmail(auth.issueEmail('viewer@example.com').token);
  assert.equal(again.id,user.id);
});

test('expired and malformed email links cannot register or log in', async t => {
  const {store,auth,advance}=await setup();t.after(()=>store.close());
  assert.throws(()=>auth.issueEmail('bad\n@example.com'), /email/i);
  const {token}=auth.issueEmail('viewer@example.com');advance(16*60_000);
  assert.throws(()=>auth.consumeEmail(token), /invalid|expired/i);
  assert.throws(()=>auth.consumeEmail('made-up'), /invalid|expired/i);
  assert.equal(store.prepare('SELECT count(*) n FROM users').get().n,0);
});

test('sessions survive independent reads, expire, and logout revokes them',async t=>{
  const {store,auth,advance}=await setup();t.after(()=>store.close());
  const user=auth.consumeEmail(auth.issueEmail('viewer@example.com').token);
  const session=auth.createSession(user.id);
  assert.equal(auth.readSession(session).id,user.id);
  assert.equal(auth.readSession('invented'),null);
  auth.revokeSession(session);assert.equal(auth.readSession(session),null);
  const other=auth.createSession(user.id);advance(31*24*60*60_000);
  assert.equal(auth.readSession(other),null);
});

test('Google requires verified email and stable subject; existing email requires authenticated linking',async t=>{
  const {store,auth}=await setup();t.after(()=>store.close());
  assert.throws(()=>auth.googleUser({sub:'google-1',email:'a@example.com',email_verified:false}),/verified/i);
  const emailUser=auth.consumeEmail(auth.issueEmail('a@example.com').token);
  assert.throws(()=>auth.googleUser({sub:'google-1',email:'a@example.com',email_verified:true}),/link/i);
  const linked=auth.googleUser({sub:'google-1',email:'a@example.com',email_verified:true},emailUser.id);
  assert.equal(linked.id,emailUser.id);
  assert.equal(auth.googleUser({sub:'google-1',email:'changed@example.com',email_verified:true}).id,emailUser.id);
  assert.throws(()=>auth.googleUser({sub:'google-2',email:'a@example.com',email_verified:true},emailUser.id),/linked/i);
});

test('OAuth attempt binds state to browser, expires, and PKCE verifier is unique',async t=>{
  const {store,auth,advance}=await setup();t.after(()=>store.close());
  const attempt=auth.startOAuth();
  assert.equal(attempt.challenge.length,43);
  assert.throws(()=>auth.consumeOAuth(attempt.state,'different-browser'),/state/i);
  const result=auth.consumeOAuth(attempt.state,attempt.browserToken);
  assert.equal(result.verifier.length>=43,true);
  assert.throws(()=>auth.consumeOAuth(attempt.state,attempt.browserToken),/state/i);
  const expired=auth.startOAuth();advance(11*60_000);
  assert.throws(()=>auth.consumeOAuth(expired.state,expired.browserToken),/state/i);
});
