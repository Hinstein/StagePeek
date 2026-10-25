import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {DEFAULT_FREE_VENUE_IDS} from './access.mjs';
import {isWebsiteId} from './analytics.mjs';

export function loadConfig(env=process.env) {
  const production=env.NODE_ENV==='production',app=new URL(env.APP_URL||'http://127.0.0.1:4180');
  const umamiWebsiteId=String(env.UMAMI_WEBSITE_ID||'').trim();
  if(umamiWebsiteId&&!isWebsiteId(umamiWebsiteId))throw new Error('UMAMI_WEBSITE_ID must be a website UUID');
  if(!['http:','https:'].includes(app.protocol)||app.pathname!=='/'||app.search||app.hash||app.username||app.password)throw new Error('APP_URL must be a plain HTTP(S) origin');
  if(production&&app.protocol!=='https:')throw new Error('Production APP_URL must use HTTPS');
  const devMailbox=env.DEV_MAILBOX==='true';
  if(production&&devMailbox)throw new Error('DEV_MAILBOX is forbidden in production');
  const local=/^(?:localhost|127\.\d+\.\d+\.\d+|\[::1\]|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+)$/.test(app.hostname);
  if(devMailbox&&!local)throw new Error('DEV_MAILBOX requires a local/private APP_URL');
  const port=Number(env.PORT||4180);if(!Number.isInteger(port)||port<1||port>65535)throw new Error('Invalid PORT');
  const allowedOrigins=String(env.ALLOWED_ORIGINS||'').split(',').map(x=>x.trim()).filter(Boolean).map(value=>{
    const u=new URL(value);if(u.origin!==value||!['http:','https:'].includes(u.protocol))throw new Error('ALLOWED_ORIGINS requires exact HTTP(S) origins');return u.origin;
  });
  const devPreviewAllVenues=env.DEV_PREVIEW_ALL_VENUES==='true';
  if(production&&devPreviewAllVenues)throw new Error('DEV_PREVIEW_ALL_VENUES is forbidden in production');
  if(production&&!env.DATABASE_URL)throw new Error('Production requires DATABASE_URL (PostgreSQL)');
  const databaseSchema=env.DATABASE_SCHEMA||'site_stagepeek';
  if(!/^site_stagepeek(?:_[a-z0-9_]+)?$/.test(databaseSchema))throw new Error('Invalid StagePeek DATABASE_SCHEMA');
  const databasePoolMax=Number(env.DATABASE_POOL_MAX||5);
  if(!Number.isInteger(databasePoolMax)||databasePoolMax<1||databasePoolMax>20)throw new Error('DATABASE_POOL_MAX must be 1–20');
  const freeVenueIds=String(env.FREE_VENUE_IDS||DEFAULT_FREE_VENUE_IDS.join(',')).split(',').map(x=>x.trim()).filter(Boolean);
  return {databaseUrl:env.DATABASE_URL||'',databaseSchema,databasePoolMax,production,appUrl:app.origin,host:env.HOST||'127.0.0.1',port,allowedOrigins,devMailbox,devPreviewAllVenues,freeVenueIds,umamiWebsiteId,
    adminEmails:String(env.ADMIN_EMAILS||'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean),
    dbPath:resolve(env.DB_PATH||fileURLToPath(new URL('../var/seatpeep.sqlite',import.meta.url))),
    googleClientId:env.GOOGLE_CLIENT_ID||'',googleClientSecret:env.GOOGLE_CLIENT_SECRET||'',ticketmasterApiKey:env.TICKETMASTER_API_KEY||'',
    brevoApiKey:env.BREVO_API_KEY||'',resendApiKey:env.RESEND_API_KEY||'',emailFrom:env.EMAIL_FROM||'',stripeSecretKey:env.STRIPE_SECRET_KEY||'',stripePriceId:env.STRIPE_PRICE_ID||'',stripeWebhookSecret:env.STRIPE_WEBHOOK_SECRET||''};
}
