import {createServer} from 'node:http';
import {readFile,realpath,stat} from 'node:fs/promises';
import {packSourceSeats} from '../public/seating.mjs';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
import {AuthService,hash,normalizeEmail,randomToken} from './auth.mjs';
import {sharedAuthRoutes,consentStatus} from './shared-auth-routes.mjs';
import {SupabaseAuth} from './supabase-auth.mjs';
import {fault,limit,transaction} from './store.mjs';
import {entitlements,freeVenueIds,saveFreeVenueIds,DEFAULT_FREE_VENUE_IDS} from './access.mjs';
import {BillingService} from './billing.mjs';
import {EmailProvider,GoogleProvider} from './providers.mjs';
import {TicketmasterProvider,ticketingStatus} from './ticketing.mjs';
import {analyticsMarkup,ANALYTICS_ORIGIN} from './analytics.mjs';
import {birdsNestPreview} from './venue-preview.mjs';
import {createPublicSite,homeMetadata,homeSchema,localizeHomeHtml,localizeInterfaceHtml,publicNavigation,publicFooter,publicHeader} from './public-pages.mjs';
import {DEFAULT_LOCALE,localizedPath,parseLocalizedPath} from './locales.mjs';

const publicRoot=resolve(fileURLToPath(new URL('../public/',import.meta.url)));
const MIME={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8'};
function cookies(req){return Object.fromEntries(String(req.headers.cookie||'').split(';').map(x=>x.trim().split(/=(.*)/s).slice(0,2)).filter(x=>x.length===2));}
function loopback(address){return ['127.0.0.1','::1','::ffff:127.0.0.1'].includes(address);}
async function body(req,max=16_384,asJson=true) {
  if(Number(req.headers['content-length']||0)>max)throw fault(413,'BODY_TOO_LARGE','Request too large');
  if(asJson&&!String(req.headers['content-type']||'').toLowerCase().startsWith('application/json'))throw fault(415,'JSON_REQUIRED','JSON body required');
  let length=0;const buffers=[];
  for await(const chunk of req){length+=chunk.length;if(length>max)throw fault(413,'BODY_TOO_LARGE','Request too large');buffers.push(chunk);}
  const raw=Buffer.concat(buffers);if(!asJson)return raw;
  try{const value=JSON.parse(raw.toString('utf8'));if(!value||Array.isArray(value)||typeof value!=='object')throw 0;return value;}catch{throw fault(400,'INVALID_JSON','Invalid JSON body');}
}

export function createApplication({db,config,venues,events=null,ticketing=null,ticketingEvents=null,candidateEvents=null,publishedEvents=null,fetch:fetcher=fetch,clock=Date.now,logger=()=>{}}) {
  const publicSite=createPublicSite(venues);
  const shared=(config.production||config.authMode==='supabase')?new SupabaseAuth(db,config,{fetch:fetcher,clock}):null;
  const auth=shared||new AuthService(db,{clock}),email=new EmailProvider(config,{fetch:fetcher}),google=new GoogleProvider(config,{fetch:fetcher}),billing=new BillingService(db,config,{fetch:fetcher,clock});
  const ticketmaster=ticketing||new TicketmasterProvider({apiKey:config.ticketmasterApiKey,fetch:fetcher,clock});
  const prefix=config.production?'__Host-ss_':'ss_';
  const cookieName=prefix+(shared?'supabase':'session');
  const localMode=()=>!!(!shared&&config.devMailbox&&!config.production);
  function cookie(res,name,value,maxAge){const existing=res.getHeader('Set-Cookie')||[];res.setHeader('Set-Cookie',[...existing,`${prefix}${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${config.production?'; Secure':''}`]);}
  function json(res,status,value){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(value));}
  const handleShared=shared?sharedAuthRoutes({auth:shared,db,config,cookie,json,body,cookies,prefix,clock}):null;
  async function requireUser(req){const user=req.stagepeekUser;if(!user)throw fault(401,'LOGIN_REQUIRED','Sign in first');return user;}
  async function access(user){
    const available=venues.ids?venues.ids():venues.catalog().map(item=>item.id);
    const result=(await entitlements(db,user,clock(),available,(await freeVenueIds(db,available,config.freeVenueIds||['tottenham']))));
    // Local preview is for inspecting imported venue geometry. It never applies
    // in production and does not change the subscription state or save limits.
    return config.devPreviewAllVenues&&localMode()?{...result,venueIds:venues.ids?venues.ids():result.venueIds}:result;
  }
  async function requireVenue(req,id){const user=req.stagepeekUser;if(!venues.get(id))throw fault(404,'VENUE_NOT_FOUND','Venue not found');if(!(await access(user)).venueIds.includes(id))throw fault(403,'SUBSCRIPTION_REQUIRED','This venue requires a monthly subscription');return user;}
  async function requireAdmin(req){const current=(await requireUser(req)),admins=config.adminEmails||[];if(shared?!['admin','owner'].includes(current.role):!admins.includes(current.email.toLowerCase()))throw fault(403,'ADMIN_REQUIRED','Administrator access required');return current;}
  async function startSession(req,res,user){(await auth.revokeSession(cookies(req)[cookieName]));cookie(res,'session',(await auth.createSession(user.id)),30*86400);}
  const server=createServer(async(req,res)=>{
    res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
    res.setHeader('Cache-Control','no-store');res.setHeader('X-Frame-Options','DENY');
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; font-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
    if(config.production)res.setHeader('Strict-Transport-Security','max-age=31536000; includeSubDomains');
    try {
      const allowed=[new URL(config.appUrl).origin,...(config.allowedOrigins||[])];
      if(!allowed.some(x=>new URL(x).host===req.headers.host))throw fault(403,'INVALID_HOST','Unrecognized request host');
      const url=new URL(req.url,config.appUrl),path=url.pathname,method=req.method,localized=publicSite.parse(path),basePath=localized.path,locale=localized.locale;
      // Only registered editorial pages and approved public media are indexable.
      // Tool state, auth/account utilities, drafts and staging fail closed.
      if(!config.production||config.appUrl!=='https://stagepeek.live'||url.search||!publicSite.isIndexable(path))res.setHeader('X-Robots-Tag','noindex, nofollow');
      if(!req.url.startsWith('/')||req.url.startsWith('//'))throw fault(400,'INVALID_PATH','Invalid path');
      const webhook=path==='/api/billing/webhook'&&method==='POST';
      if(!['GET','HEAD'].includes(method)&&!webhook&&!allowed.includes(req.headers.origin))throw fault(403,'ORIGIN_REQUIRED','Same-origin request required');
      const resolved=shared?await shared.resolve(cookies(req)[cookieName]):{user:await auth.readSession(cookies(req)[cookieName])};
      if(resolved.cookie)cookie(res,'supabase',resolved.cookie,30*86400);
      if(resolved.clear)cookie(res,'supabase','',0);
      req.stagepeekUser=resolved.user;
      const user=resolved.user;
      const handle=async()=>{
      if(path.startsWith('/api/')&&!webhook)(await limit(db,'http:'+hash(req.socket.remoteAddress||''),240,60_000,clock()));
      if(handleShared&&await handleShared(req,res,url,user))return;
      if(shared&&user&&!['GET','HEAD'].includes(method)&&!webhook&&!/^\/api\/venues\/[a-z0-9-]+\/resolve$/.test(path)&&(await consentStatus(db,user)).required)throw fault(403,'CONSENT_REQUIRED','请先确认服务条款与隐私政策');
      if((path==='/api/health'||path==='/healthz')&&method==='GET')return json(res,200,{ok:true,service:'stagepeek'});
      if(path==='/api/me'&&method==='GET')return json(res,200,{user,consent:shared?await consentStatus(db,user):null,access:(await access(user)),providers:{auth:shared?'supabase':'local',emailOtp:!!shared,email:shared?shared.ready:email.ready,password:!!shared,emailRegistration:!!shared&&shared.ready,recovery:!!shared&&!!config.authRecoveryEnabled,google:shared?!!config.authGoogleEnabled:(google.ready||localMode()),billing:billing.ready||localMode(),localEmail:localMode(),localGoogle:localMode()&&!google.ready,localBilling:localMode()&&!billing.ready,localInbox:localMode()&&loopback(req.socket.remoteAddress),ticketing:ticketingStatus(config)},subscription:user?(await db.prepare('SELECT status,period_end,cancel_at_period_end FROM subscriptions WHERE user_id=? ORDER BY period_end DESC LIMIT 1').get(user.id))||null:null});
      if(path==='/api/auth/email'&&method==='POST'){
        if(!email.ready)throw fault(503,'EMAIL_NOT_CONFIGURED','Email delivery is not configured');
        const input=await body(req),address=normalizeEmail(input.email);
        (await limit(db,'email:'+hash(address),3,15*60_000,clock()));(await limit(db,'email-ip:'+hash(req.socket.remoteAddress),12,60*60_000,clock()));
        const browserToken=randomToken(),attempt=(await auth.issueEmail(address,browserToken));
        try{await email.sendLogin(attempt,{origin:req.headers.origin});}catch(error){(await auth.discardEmail(attempt.token));throw error;}
        cookie(res,'email',browserToken,15*60);return json(res,200,{sent:true,expiresIn:900,local:!!config.devMailbox});
      }
      if(path==='/api/auth/email/verify'&&method==='POST'){
        const {token}=await body(req);const verified=(await auth.consumeEmail(token,cookies(req)[prefix+'email']));
        (await startSession(req,res,verified));cookie(res,'email','',0);return json(res,200,{user:verified});
      }
      if(path==='/api/auth/logout'&&method==='POST'){await body(req);(await auth.revokeSession(cookies(req)[cookieName]));cookie(res,'session','',0);return json(res,200,{ok:true});}
      if(path==='/api/auth/google/start'&&method==='POST'){
        await body(req);if(!google.ready&&!localMode())throw fault(503,'GOOGLE_NOT_CONFIGURED','Google sign-in is not configured');
        const attempt=(await auth.startOAuth(user?.id||null));cookie(res,'oauth',attempt.browserToken,600);
        if(!google.ready)return json(res,200,{url:new URL('/api/auth/google/dev-callback?state='+encodeURIComponent(attempt.state),config.appUrl).href,local:true});
        return json(res,200,{url:google.authorizationUrl(attempt)});
      }
      if(path==='/api/auth/google/dev-callback'&&method==='GET'){
        if(!localMode()||!loopback(req.socket.remoteAddress))throw fault(404,'NOT_FOUND','Not found');
        const attempt=(await auth.consumeOAuth(url.searchParams.get('state'),cookies(req)[prefix+'oauth']));cookie(res,'oauth','',0);
        const verified=(await auth.googleUser({sub:'local-google-seatpeep',email:'google@seatpeep.test',email_verified:true},attempt.userId));
        (await startSession(req,res,verified));res.writeHead(303,{Location:'/?auth=success'});return res.end();
      }
      if(path==='/api/auth/google/callback'&&method==='GET'){
        const attempt=(await auth.consumeOAuth(url.searchParams.get('state'),cookies(req)[prefix+'oauth']));cookie(res,'oauth','',0);
        if(url.searchParams.has('error')){res.writeHead(303,{Location:'/?auth_error=GOOGLE_CANCELED'});return res.end();}
        if(attempt.userId&&user?.id!==attempt.userId)throw fault(400,'LINK_SESSION_CHANGED','Sign in again before linking Google');
        const code=url.searchParams.get('code');if(!code||code.length>4096)throw fault(400,'GOOGLE_FAILED','Invalid Google callback');
        const verified=(await auth.googleUser(await google.profile(code,attempt.verifier),attempt.userId));
        (await startSession(req,res,verified));res.writeHead(303,{Location:'/?auth=success'});return res.end();
      }
      if(path==='/api/dev/mailbox'&&method==='GET'){
        if(!localMode()||!loopback(req.socket.remoteAddress))throw fault(404,'NOT_FOUND','Not found');
        const browser=cookies(req)[prefix+'email'];
        const messages=[];
        if(browser)for(const item of email.outbox){
          const token=new URLSearchParams(new URL(item.url).hash.slice(1)).get('token');
          const valid=await db.prepare('SELECT 1 FROM login_tokens WHERE token_hash=? AND browser_hash=? AND consumed_at IS NULL AND expires_at>?').get(hash(token),hash(browser),clock());
          if(valid)messages.push(item);
        }
        return json(res,200,{messages});
      }
      if(path==='/api/billing/price'&&method==='GET'){
        if(!billing.ready&&localMode()){
          const price={id:'local-dev-monthly',plan:'monthly',amount:999,currency:'usd',interval:'month',intervalCount:1,label:'每月',local:true};
          return json(res,200,{price,prices:[price]});
        }
        const prices=await billing.prices();return json(res,200,{price:prices.find(item=>item.plan==='monthly')||prices[0],prices});
      }
      if(path==='/api/billing/checkout'&&method==='POST'){
        const current=(await requireUser(req)),input=await body(req);
        if(!billing.ready&&localMode()){
          const token=randomToken(),expiresAt=clock()+15*60_000;
          (await db.prepare('INSERT INTO local_billing_tokens(token_hash,user_id,expires_at,consumed_at) VALUES(?,?,?,NULL)').run(hash(token),current.id,expiresAt));
          return json(res,200,{url:new URL('/api/billing/dev-checkout?token='+encodeURIComponent(token),config.appUrl).href,local:true,expiresIn:900});
        }
        return json(res,200,await billing.checkout(current,input.plan));
      }
      if(path==='/api/billing/dev-checkout'&&method==='GET'){
        if(!localMode()||!loopback(req.socket.remoteAddress))throw fault(404,'NOT_FOUND','Not found');
        const current=(await requireUser(req)),token=url.searchParams.get('token');
        if(typeof token!=='string'||!/^[\w-]{43}$/.test(token))throw fault(400,'CHECKOUT_TOKEN','Invalid local checkout');
        (await transaction(db,async ()=>{
          const row=(await db.prepare('SELECT * FROM local_billing_tokens WHERE token_hash=?').get(hash(token)));
          if(!row||row.user_id!==current.id||row.consumed_at!==null||row.expires_at<=clock())throw fault(400,'CHECKOUT_TOKEN','Invalid or expired local checkout');
          (await db.prepare('UPDATE local_billing_tokens SET consumed_at=? WHERE token_hash=?').run(clock(),hash(token)));
          (await db.prepare(`INSERT INTO subscriptions(id,user_id,status,period_end,cancel_at_period_end,price_id,updated_at)
            VALUES(?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET status='active',period_end=excluded.period_end,
            cancel_at_period_end=0,price_id=excluded.price_id,updated_at=excluded.updated_at`)
            .run('local_dev_'+current.id,current.id,'active',clock()+30*86400_000,0,'local-dev-monthly',clock()));
        }));
        res.writeHead(303,{Location:'/?billing=success'});return res.end();
      }
      if(path==='/api/billing/portal'&&method==='POST'){const current=(await requireUser(req));await body(req);return json(res,200,await billing.portal(current));}
      if(webhook){const raw=await body(req,262_144,false);return json(res,200,await billing.webhook(raw,req.headers['stripe-signature']));}
      if(path==='/api/admin/venues/validate'&&method==='POST'){
        (await requireAdmin(req));const manifest=await body(req,512_000);const report=venues.validate(manifest);return json(res,report.valid?200:422,{report});
      }
      if(path==='/api/admin/venues/publish'&&method==='POST'){
        (await requireAdmin(req));const manifest=await body(req,512_000);const report=venues.validate(manifest);if(!report.valid)throw fault(422,'INVALID_VENUE_MANIFEST',report.errors.join('; '));
        const venue=venues.publish(manifest);return json(res,201,{published:true,venue:{id:venue.id,name:venue.name,sectionCount:venue.sections.length,ticketLabelCount:venue.ticketLabelCount},warnings:report.warnings});
      }
      if(path==='/api/admin/event-candidates'&&method==='GET'){
        (await requireAdmin(req));return json(res,200,{...(candidateEvents?.list()||{status:'empty',sets:[],events:[],venues:[]}),ticketing:ticketingEvents?.data||null});
      }
      if(path==='/api/admin/access'&&method==='GET'){
        const admin=(await requireAdmin(req)),available=venues.ids?venues.ids():venues.catalog().map(item=>item.id),free=(await freeVenueIds(db,available,config.freeVenueIds||['tottenham']));
        return json(res,200,{freeVenueIds:free,freeVenues:venues.catalog().filter(item=>free.includes(item.id)),availableVenues:venues.catalog(),paidVenueCount:Math.max(0,available.length-free.length),updatedAt:(await db.prepare('SELECT updated_at,updated_by FROM access_settings WHERE key=?').get('free_venue_ids'))||null,availableVenueCount:available.length,exactlyTen:free.length===10,updatedBy:admin.email});
      }
      if(path==='/api/admin/access'&&method==='PUT'){
        const admin=(await requireAdmin(req)),input=await body(req),available=venues.ids?venues.ids():venues.catalog().map(item=>item.id);
        const selected=(await saveFreeVenueIds(db,input.freeVenueIds,available,admin.email,clock()));
        return json(res,200,{saved:true,freeVenueIds:selected,paidVenueCount:Math.max(0,available.length-selected.length)});
      }
      const ticketEvent=path.match(/^\/api\/admin\/ticketing\/ticketmaster\/events\/([A-Za-z0-9_-]{4,80})$/);
      if(ticketEvent&&method==='GET'){(await requireAdmin(req));return json(res,200,{event:await ticketmaster.event(ticketEvent[1])});}
      if(path==='/api/admin/ticketing/ticketmaster/search'&&method==='POST'){
        (await requireAdmin(req));return json(res,200,await ticketmaster.search(await body(req)));
      }
      if(path==='/api/admin/ticketing/ticketmaster/venues/search'&&method==='POST'){
        (await requireAdmin(req));return json(res,200,await ticketmaster.searchVenues(await body(req)));
      }
      if(path==='/api/venues'&&method==='GET'){
        const currentAccess=(await access(user));return json(res,200,{venues:venues.catalog().map(v=>({...v,locked:!currentAccess.venueIds.includes(v.id)}))});
      }
      if(path==='/api/demo/birds-nest'&&method==='GET'){
        const venue=birdsNestPreview(venues);
        if(!venue)throw fault(404,'PREVIEW_UNAVAILABLE','Venue preview is unavailable');
        return json(res,200,{venue});
      }
      // Venue ids are lowercase kebab-case but many imported public venues
      // include a numeric hall or level suffix (for example `...-hall-10`).
      // The previous letters-only route silently made those catalog entries
      // impossible to open from the selector.
      const venueMatch=path.match(/^\/api\/venues\/([a-z0-9-]+)(?:\/(resolve|events))?$/);
      if(venueMatch){
        const [,id,operation]=venueMatch;(await requireVenue(req,id));
        if(!operation&&method==='GET'){const venue=venues.get(id,url.searchParams.get('layout')||undefined);if(!venue)throw fault(422,'UNKNOWN_LAYOUT','This source layout is unavailable');return json(res,200,{venue:venue.sourceSeats?{...venue,sourceSeats:undefined,seatTuples:packSourceSeats(venue.sourceSeats)}:venue});}
        if(operation==='resolve'&&method==='POST')return json(res,200,venues.resolve(id,await body(req)));
        if(operation==='events'&&method==='GET'){
          const official=events?events.list(id):{events:[],refreshedAt:null,status:'not-fetched'};
          const provider=ticketingEvents?.list(id)||{events:[],refreshedAt:null,status:'not-fetched'};
          const providerKey=value=>{const match=String(value||'').match(/\/event\/([A-Za-z0-9_-]+)/i);return match?.[1]||null;};
          const eventKey=item=>`${String(item.name||'').toLowerCase().replace(/[^a-z0-9]+/g,'')}|${item.localDate||item.date||''}`;
          const seen=new Set(official.events.flatMap(item=>[item.id,item.source,item.layout?.source,providerKey(item.source),providerKey(item.layout?.source),eventKey(item)].filter(Boolean)));
          const imported=provider.events.filter(item=>!seen.has(item.id)&&!seen.has(item.url)&&!seen.has(item.source)&&!seen.has(item.providerEventId)&&!seen.has(providerKey(item.url))&&!seen.has(eventKey(item))).map(item=>({...item,source:item.url||item.source||null,layout:item.layout||{status:'unconfirmed',source:item.url||null,image:item.seatmap?.staticUrl||null,model:null,eventVerification:'ticketing-api',mapVerification:item.seatmap?'reference':'unavailable',stageVerification:'unverified'},ticketingProvider:item.provider||'ticketmaster'}));
          const published=publishedEvents?.list(id)||[];
          const publishedIds=new Set(published.map(event=>event.id));
          const metadata=(official.status==='candidate-import'?[]:official.events).filter(event=>!publishedIds.has(event.id)&&event.status!=='candidate'&&event.verificationStatus!=='candidate').map(event=>({...event,layout:{...event.layout,model:null,stageVerification:'unverified'}}));
          return json(res,200,{...official,events:[...metadata,...published].sort((a,b)=>String(a.localDate||'').localeCompare(String(b.localDate||''))),ticketing:{...provider,events:undefined,candidates:imported.length}});
        }
      }
      if(path==='/api/positions'&&method==='GET'){
        const current=(await requireUser(req));const rows=(await db.prepare('SELECT * FROM saved_positions WHERE user_id=? ORDER BY created_at DESC').all(current.id));
        return json(res,200,{positions:rows});
      }
      if(path==='/api/positions'&&method==='POST'){
        const current=(await requireUser(req)),input=await body(req);(await requireVenue(req,input.venueId));
        const currentAccess=(await access(current));

        const found=venues.resolve(input.venueId,input);
        if(found.status!=='matched')throw fault(422,'SEAT_UNVERIFIED','Only a verified seat label can be saved');
        const label=typeof input.label==='string'?input.label.trim().slice(0,80):'';
        const id=randomUUID();await transaction(db,async()=>{
          if((await db.prepare('SELECT count(*) n FROM saved_positions WHERE user_id=?').get(current.id)).n>=currentAccess.maxSaved)throw fault(409,'SAVE_LIMIT','Saved location limit reached');
          (await db.prepare('INSERT INTO saved_positions (id,user_id,venue_id,section,row_token,seat_token,event_id,label,created_at,layout) VALUES(?,?,?,?,?,?,?,?,?,?)').run(id,current.id,input.venueId,found.section,found.row,found.seat,typeof input.eventId==='string'?input.eventId.slice(0,100):null,label,clock(),found.layout||null));
        });
        return json(res,201,{id});
      }
      const deleteMatch=path.match(/^\/api\/positions\/([\w-]+)$/);
      if(deleteMatch&&method==='DELETE'){const current=(await requireUser(req));await body(req);const result=(await db.prepare('DELETE FROM saved_positions WHERE id=? AND user_id=?').run(deleteMatch[1],current.id));if(!result.changes)throw fault(404,'NOT_FOUND','Not found');return json(res,200,{ok:true});}
      if(!['GET','HEAD'].includes(method))throw fault(405,'METHOD_NOT_ALLOWED','Method not allowed');
      if(path.startsWith('/api/'))throw fault(404,'NOT_FOUND','Not found');
      if(path==='/index.html'){res.writeHead(308,{Location:'/'+url.search});return res.end();}
      const publicRedirect=publicSite.redirect(path);
      if(publicRedirect){res.writeHead(308,{Location:publicRedirect+url.search});return res.end();}
      const tracking=analyticsMarkup(config,{path,search:url.search,user,publicPage:!!publicSite.get(basePath)?.indexable});
      if(tracking)res.setHeader('Content-Security-Policy',String(res.getHeader('Content-Security-Policy')).replace("script-src 'self'",`script-src 'self' ${ANALYTICS_ORIGIN}`).replace("connect-src 'self'",`connect-src 'self' ${ANALYTICS_ORIGIN}`));
      if(path==='/sitemap.xml'){
        res.writeHead(200,{'Content-Type':MIME['.xml']});return res.end(method==='HEAD'?null:publicSite.sitemap());
      }
      if(basePath!=='/'&&publicSite.get(basePath)){
        const context={};
        if((basePath==='/plans'||basePath==='/venues/')&&method!=='HEAD'){
          context.access=await access(null);context.billingReady=billing.ready;
          if(basePath==='/plans'&&billing.ready)try{context.prices=await billing.prices();context.price=context.prices.find(item=>item.plan==='monthly')||context.prices[0];}catch{/* Fail closed: never invent a price. */}
        }
        const html=method==='HEAD'?null:publicSite.render(path,{...context,locale,user}).replace('</head>',tracking+'</head>');
        res.writeHead(200,{'Content-Type':MIME['.html']});return res.end(html);
      }
      let decoded;try{decoded=decodeURIComponent(basePath);}catch{throw fault(404,'NOT_FOUND','Not found');}
      // Keep previously shared ticket links and provider returns in the tool.
      const toolPage=basePath==='/explore'||basePath==='/'&&['venue','event','layout','section','row','seat','mode','zoom','depth','lateral','standing','date','account','panel','data','billing','auth','auth_error','login','token','session_id'].some(key=>url.searchParams.has(key));
      const file=resolve(publicRoot,toolPage?'index.html':decoded==='/'?'home.html':['/auth/login','/auth/register','/auth/verify','/auth/callback','/auth/reset','/auth/password','/auth/continue','/account'].includes(decoded)?'auth.html':'.'+decoded);
      if(!file.startsWith(publicRoot+sep)||!MIME[extname(file)]||decoded.split('/').some(x=>x.startsWith('.')||x==='server'||x==='data'))throw fault(404,'NOT_FOUND','Not found');
      let actual,info;try{actual=await realpath(file);info=await stat(actual);}catch{throw fault(404,'NOT_FOUND','Not found');}
      if(!actual.startsWith(publicRoot+sep)||!info.isFile())throw fault(404,'NOT_FOUND','Not found');
      let content=method==='HEAD'?null:await readFile(actual);
      if(basePath.startsWith('/previews/')&&basePath.endsWith('.svg')&&content){
        content=Buffer.from(localizeInterfaceHtml(content.toString('utf8'),locale,basePath));
      }else if(basePath==='/'&&!toolPage&&content){
        const html=localizeHomeHtml(content.toString('utf8').replace('<!--PUBLIC-SCHEMA-->',homeSchema(locale)).replace('<!--PUBLIC-NAVIGATION-->',publicNavigation(locale)).replace('<!--VENUE-GUIDES-->',publicSite.homeEnhancements(locale)).replace('<html lang="zh-CN">',`<html lang="${locale}">`),locale).replace('<!--SITE-HEADER-->',publicHeader(locale,basePath,{user})).replace('<!--SITE-FOOTER-->',publicFooter(locale));
        content=Buffer.from(html.replace('</head>',`<meta name="stagepeek-locale" content="${locale}"></head>`));
      }else if(content&&(toolPage||['/auth/login','/auth/register','/auth/verify','/auth/callback','/auth/reset','/auth/password','/auth/continue','/account'].includes(basePath))){
        const html=localizeInterfaceHtml(content.toString('utf8'),locale,basePath).replace('<!--SITE-HEADER-->',publicHeader(locale,basePath,{user,explorer:toolPage,auth:!toolPage})).replace('<!--SITE-FOOTER-->',publicFooter(locale)).replace('</head>',`<meta name="stagepeek-locale" content="${locale}"></head>`);
        content=Buffer.from(html);
      }
      if(tracking){
        if(content)content=Buffer.from(content.toString('utf8').replace('</head>',tracking+'</head>'));
        res.setHeader('Content-Security-Policy',String(res.getHeader('Content-Security-Policy')).replace("script-src 'self'",`script-src 'self' ${ANALYTICS_ORIGIN}`).replace("connect-src 'self'",`connect-src 'self' ${ANALYTICS_ORIGIN}`));
      }
      res.writeHead(200,{'Content-Type':MIME[extname(actual)],'Cache-Control':actual.includes(sep+'vendor'+sep)?'public, max-age=86400':'no-cache'});res.end(content);
      };
      return await (shared&&!webhook&&db.withIdentity?db.withIdentity(user?.id||null,handle):handle());
    }catch(error){
      if(!res.headersSent)res.setHeader('X-Robots-Tag','noindex, nofollow');
      const status=Number.isInteger(error.status)?error.status:500;
      logger({status,code:error.code||'INTERNAL_ERROR',message:status>=500?'Server/provider request failed':error.message});
      if(!res.headersSent)json(res,status,{error:{code:error.code||'INTERNAL_ERROR',message:status===500?'Unexpected server error':error.message}});else res.end();
    }
  });
  server.requestTimeout=30_000;server.headersTimeout=15_000;server.maxHeadersCount=100;
  return {server,auth,email,google,billing,db,config};
}
