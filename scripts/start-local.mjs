import {networkInterfaces} from 'node:os';
import {seedLocal} from './seed-local.mjs';

process.env.AUTH_MODE='local';
if(process.env.NODE_ENV==='production')throw new Error('Local test mode cannot run in production');
const db=await seedLocal();
const ip=Object.values(networkInterfaces()).flat().find(x=>x.family==='IPv4'&&!x.internal&&/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(x.address))?.address;
const port=process.env.PORT||'4180';
delete process.env.DATABASE_URL;
process.env.NODE_ENV='development';process.env.DEV_MAILBOX='true';process.env.DB_PATH=db;
process.env.DEV_PREVIEW_ALL_VENUES='true';
process.env.HOST=process.env.HOST||'0.0.0.0';
process.env.APP_URL=process.env.APP_URL||`http://${ip||'127.0.0.1'}:${port}`;
process.env.ALLOWED_ORIGINS=[process.env.ALLOWED_ORIGINS,`http://127.0.0.1:${port}`,`http://localhost:${port}`,ip?`http://${ip}:${port}`:''].filter(Boolean).join(',');
process.env.ADMIN_EMAILS=process.env.ADMIN_EMAILS||'admin@seatpeep.test';
// Local fixtures never initiate real OAuth, email delivery or payment requests.
for(const key of ['GOOGLE_CLIENT_ID','GOOGLE_CLIENT_SECRET','BREVO_API_KEY','RESEND_API_KEY','EMAIL_FROM','STRIPE_SECRET_KEY','STRIPE_PRICE_ID','STRIPE_WEBHOOK_SECRET'])process.env[key]='';
console.log('LOCAL TEST MODE · no real email or payment');
console.log('Desktop:',`http://127.0.0.1:${port}`);
if(ip)console.log('Same Wi-Fi:',`http://${ip}:${port}`);
console.log('Sign in using free@seatpeep.test / pro@seatpeep.test / expired@seatpeep.test / admin@seatpeep.test and the local inbox.');
await import('../server/main.mjs');
