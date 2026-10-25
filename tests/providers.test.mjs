import test from 'node:test';
import assert from 'node:assert/strict';

test('Google code exchange sends PKCE verifier and obtains profile with server-only access token',async()=>{
  const {GoogleProvider}=await import('../server/providers.mjs');const calls=[];
  const google=new GoogleProvider({appUrl:'http://localhost:4180',googleClientId:'client',googleClientSecret:'secret'},{fetch:async(url,init)=>{
    calls.push({url,init});return new Response(JSON.stringify(calls.length===1?{access_token:'private-token'}:{sub:'123',email:'a@example.com',email_verified:true}));
  }});
  const url=new URL(google.authorizationUrl({state:'s',challenge:'challenge'}));
  assert.equal(url.searchParams.get('code_challenge_method'),'S256');
  assert.equal(url.searchParams.get('state'),'s');
  assert.equal(url.searchParams.get('redirect_uri'),'http://localhost:4180/api/auth/google/callback');
  const profile=await google.profile('code','pkce-verifier');
  assert.equal(new URLSearchParams(calls[0].init.body).get('code_verifier'),'pkce-verifier');
  assert.equal(calls[1].init.headers.Authorization,'Bearer private-token');
  assert.equal(profile.email,'a@example.com');
});

test('Google provider refuses token endpoint errors instead of signing user in',async()=>{
  const {GoogleProvider}=await import('../server/providers.mjs');
  const google=new GoogleProvider({appUrl:'http://localhost:4180',googleClientId:'client',googleClientSecret:'secret'},{fetch:async()=>new Response('{}',{status:400})});
  await assert.rejects(()=>google.profile('bad','verifier'),/Google/i);
});

test('local email aliases require an explicit allowed origin and never affect delivered production email',async()=>{
  const {EmailProvider}=await import('../server/providers.mjs');
  const config={appUrl:'http://192.168.0.2:4180',devMailbox:true,production:false,allowedOrigins:['http://127.0.0.1:4180']};
  const email=new EmailProvider(config);
  const attempt={email:'viewer@example.com',token:'sample-token',expiresAt:Date.now()+900000};
  await email.sendLogin(attempt,{origin:'http://127.0.0.1:4180'});
  assert.equal(new URL(email.outbox[0].url).origin,'http://127.0.0.1:4180');
  await email.sendLogin(attempt,{origin:'https://attacker.example'});
  assert.equal(new URL(email.outbox[0].url).origin,config.appUrl);
  let message;
  const production=new EmailProvider({appUrl:'https://seatpeep.example',production:true,resendApiKey:'test-key',emailFrom:'login@seatpeep.example',allowedOrigins:['https://alias.example']},{fetch:async(_url,init)=>{
    message=JSON.parse(init.body);return new Response('{}');
  }});
  await production.sendLogin(attempt,{origin:'https://alias.example'});
  assert.match(message.text,/https:\/\/seatpeep\.example\/\?login=email/);
  assert.doesNotMatch(message.text,/alias\.example/);
});
