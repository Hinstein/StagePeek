import {networkInterfaces} from 'node:os';
import {openDatabase,transaction} from '../server/store.mjs';
import {randomUUID} from 'node:crypto';

process.env.AUTH_MODE='local';
if(process.env.NODE_ENV==='production')throw new Error('Local mode cannot run in production');
if(!process.env.DATABASE_URL||process.env.DATABASE_SCHEMA!=='site_stagepeek_dev')throw new Error('Local PostgreSQL requires the dedicated site_stagepeek_dev connection');
const db=await openDatabase({databaseUrl:process.env.DATABASE_URL,databaseSchema:process.env.DATABASE_SCHEMA});
try{
  await transaction(db,async()=>{
    const now=Date.now();
    for(const [name,expiry] of [['free',null],['pro',now+30*86400_000],['expired',now-86400_000],['admin',null]]){
      const email=name+'@seatpeep.test';
      await db.prepare('INSERT INTO users(id,email,created_at) VALUES(?,?,?) ON CONFLICT DO NOTHING').run(randomUUID(),email,now);
      const user=await db.prepare('SELECT id FROM users WHERE email=?').get(email);
      if(expiry!==null)await db.prepare(`INSERT INTO subscriptions VALUES(?,?,?,?,?,?,?) ON CONFLICT(id)
        DO UPDATE SET period_end=excluded.period_end,status=excluded.status`).run('local_'+name,user.id,'active',expiry,0,'local_fixture_monthly',now);
    }
  });
}finally{await db.close();}
const ip=Object.values(networkInterfaces()).flat().find(x=>x.family==='IPv4'&&!x.internal&&/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(x.address))?.address;
const port=process.env.PORT||'4181';
Object.assign(process.env,{NODE_ENV:'development',DEV_MAILBOX:'true',DEV_PREVIEW_ALL_VENUES:'true',
  HOST:process.env.HOST||'0.0.0.0',PORT:port,APP_URL:process.env.APP_URL||`http://${ip||'127.0.0.1'}:${port}`,
  ALLOWED_ORIGINS:[`http://127.0.0.1:${port}`,`http://localhost:${port}`,ip?`http://${ip}:${port}`:''].filter(Boolean).join(','),
  ADMIN_EMAILS:process.env.ADMIN_EMAILS||'admin@seatpeep.test'});
for(const key of ['GOOGLE_CLIENT_ID','GOOGLE_CLIENT_SECRET','BREVO_API_KEY','RESEND_API_KEY','EMAIL_FROM','STRIPE_SECRET_KEY','STRIPE_PRICE_ID','STRIPE_WEBHOOK_SECRET'])process.env[key]='';
console.log('LOCAL POSTGRESQL MODE · independent development schema · no real email/payment');
await import('../server/main.mjs');
