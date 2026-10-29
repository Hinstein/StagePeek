import {createHmac,timingSafeEqual,randomUUID} from 'node:crypto';
import {fault,transaction} from './store.mjs';
import {entitlements} from './access.mjs';

const HANDLED=new Set(['customer.subscription.created','customer.subscription.updated','customer.subscription.deleted','checkout.session.completed','checkout.session.async_payment_succeeded']);
const idOf=x=>typeof x==='string'?x:x?.id;
const PLANS=[
  {id:'monthly',label:'每月',interval:'month',intervalCount:1,amount:999},
  {id:'semiannual',label:'每 6 个月',interval:'month',intervalCount:6,amount:4999},
  {id:'annual',label:'每年',interval:'year',intervalCount:1,amount:8999}
];
const planById=new Map(PLANS.map(plan=>[plan.id,plan]));

export class BillingService {
  constructor(db,config,{fetch:fetcher=fetch,clock=Date.now}={}) {
    this.db=db;this.config=config;this.fetch=fetcher;this.clock=clock;this.queues=new Map();
  }
  get ready(){return !!(this.config.stripeSecretKey&&this.config.stripeWebhookSecret&&Object.values(this.priceIds()).some(Boolean));}
  async request(path,{method='GET',form=null,idempotencyKey=null}={}) {
    if(!this.ready)throw fault(503,'BILLING_NOT_CONFIGURED','Billing is not configured');
    const headers={Authorization:'Bearer '+this.config.stripeSecretKey};
    if(form)headers['Content-Type']='application/x-www-form-urlencoded';
    if(idempotencyKey)headers['Idempotency-Key']=idempotencyKey;
    const response=await this.fetch('https://api.stripe.com/v1'+path,{method,headers,
      ...(form?{body:new URLSearchParams(form).toString()}:{}),signal:AbortSignal.timeout(15_000)});
    if(!response.ok)throw fault(502,'BILLING_PROVIDER_FAILED','Billing provider request failed');
    return response.json();
  }
  priceIds(){const configured=this.config.stripePriceIds||{};return {monthly:this.config.stripePriceId||configured.monthly||'',semiannual:configured.semiannual||'',annual:configured.annual||''};}
  configuredPlans(){const priceIds=this.priceIds();return PLANS.filter(plan=>priceIds[plan.id]);}
  plan(planId='monthly'){
    const plan=planById.get(planId);
    if(!plan)throw fault(400,'INVALID_BILLING_PLAN','Unknown billing plan');
    const priceId=this.priceIds()[plan.id];
    if(!priceId)throw fault(503,'BILLING_PLAN_NOT_CONFIGURED','This billing plan is not configured');
    return {...plan,priceId};
  }
  planForPrice(priceId){const priceIds=this.priceIds();return this.configuredPlans().find(plan=>priceIds[plan.id]===priceId);}
  async price(planId='monthly') {
    const plan=this.plan(planId),p=await this.request('/prices/'+encodeURIComponent(plan.priceId));
    const valid=p.id===plan.priceId&&p.active&&p.type==='recurring'&&p.currency==='usd'&&p.recurring?.interval===plan.interval&&p.recurring?.interval_count===plan.intervalCount&&p.unit_amount===plan.amount;
    if(!valid)throw fault(503,plan.id==='monthly'?'INVALID_MONTHLY_PRICE':'INVALID_BILLING_PRICE',`A positive ${plan.id} recurring price is required`);
    return {id:p.id,plan:plan.id,amount:p.unit_amount,currency:p.currency,interval:plan.interval,intervalCount:plan.intervalCount,label:plan.label};
  }
  async prices(){
    const prices=[];
    for(const plan of this.configuredPlans())prices.push(await this.price(plan.id));
    return prices;
  }
  async customer(user) {
    const existing=(await this.db.prepare('SELECT customer_id FROM billing_customers WHERE user_id=?').get(user.id));
    if(existing)return existing.customer_id;
    const customer=await this.request('/customers',{method:'POST',form:{email:user.email,'metadata[seat_scope_user]':user.id},idempotencyKey:'seatpeep-customer-'+user.id});
    if(typeof customer.id!=='string'||!customer.id.startsWith('cus_'))throw fault(502,'BILLING_PROVIDER_FAILED','Invalid billing customer');
    (await this.db.prepare('INSERT INTO billing_customers VALUES(?,?) ON CONFLICT DO NOTHING').run(user.id,customer.id));
    return (await this.db.prepare('SELECT customer_id FROM billing_customers WHERE user_id=?').get(user.id)).customer_id;
  }
  async checkout(user,plan='monthly') {
    if(!user)throw fault(401,'LOGIN_REQUIRED','Sign in first');
    return this.serial('checkout:'+user.id,()=>this.createCheckout(user,plan));
  }
  async createCheckout(user,plan='monthly') {
    if((await entitlements(this.db,user,this.clock())).plan==='pro')throw fault(409,'ALREADY_SUBSCRIBED','Use manage subscription for your current plan');
    const selected=await this.price(plan),configuredPriceIds=new Set(Object.values(this.priceIds()).filter(Boolean));
    const customer=await this.customer(user);
    // Check Stripe directly as webhook delivery can lag behind a completed payment.
    const live=await this.request('/subscriptions?'+new URLSearchParams({customer,status:'all',limit:'100'}));
    if(!Array.isArray(live.data)||live.has_more)throw fault(503,'BILLING_REVIEW_REQUIRED','Review this billing account before starting another subscription');
    if(live.data.some(s=>['active','trialing','past_due','unpaid','incomplete','paused'].includes(s.status)&&s.items?.data?.some(i=>configuredPriceIds.has(idOf(i.price)))))
      throw fault(409,'ALREADY_SUBSCRIBED','Use manage subscription for your current plan');
    let attempt=(await this.db.prepare('SELECT * FROM checkout_attempts WHERE user_id=?').get(user.id));
    if(attempt?.session_id){
      const pending=await this.request('/checkout/sessions/'+encodeURIComponent(attempt.session_id));
      if(pending.id!==attempt.session_id||idOf(pending.customer)!==customer)throw fault(502,'BILLING_PROVIDER_FAILED','Checkout owner mismatch');
      if(pending.status==='open'&&pending.expires_at*1000>this.clock())return this.checkoutUrl(pending);
      if(pending.status==='complete'){
        const sub=idOf(pending.subscription);
        if(!sub)throw fault(409,'CHECKOUT_PENDING','Payment confirmation is pending');
        const current=await this.request('/subscriptions/'+encodeURIComponent(sub));
        if(current.id!==sub||idOf(current.customer)!==customer||!['canceled','incomplete_expired'].includes(current.status))throw fault(409,'CHECKOUT_PENDING','Payment confirmation or subscription management is pending');
      }else if(pending.status!=='expired')throw fault(409,'CHECKOUT_PENDING','Existing checkout requires confirmation');
      (await this.db.prepare('DELETE FROM checkout_attempts WHERE user_id=?').run(user.id));attempt=null;
    }
    if(!attempt){
      const now=this.clock();
      (await this.db.prepare('INSERT INTO checkout_attempts VALUES(?,?,NULL,?,?,?) ON CONFLICT DO NOTHING').run(user.id,'seatpeep-checkout-'+randomUUID(),selected.id,now,Math.floor(now/1000)+3600));
      attempt=(await this.db.prepare('SELECT * FROM checkout_attempts WHERE user_id=?').get(user.id));
    }
    // Retain the idempotency key before the network request, including after a timeout/restart.
    if(this.clock()-attempt.created_at>23*3600_000||attempt.price_id!==selected.id)throw fault(409,'CHECKOUT_PENDING','Previous checkout must be reviewed before another payment');
    const session=await this.request('/checkout/sessions',{method:'POST',idempotencyKey:attempt.request_key,form:{
      mode:'subscription',customer,client_reference_id:user.id,expires_at:String(attempt.expires_at),'line_items[0][price]':attempt.price_id,'line_items[0][quantity]':'1','subscription_data[metadata][stagepeek_plan]':selected.plan,
      success_url:this.config.appUrl+'/?billing=success',cancel_url:this.config.appUrl+'/?billing=canceled',
      'subscription_data[metadata][seat_scope_user]':user.id
    }});
    if(typeof session.id!=='string'||!/^cs_[\w]+$/.test(session.id))throw fault(502,'BILLING_PROVIDER_FAILED','Invalid checkout session');
    const result=this.checkoutUrl(session);
    (await this.db.prepare('UPDATE checkout_attempts SET session_id=? WHERE user_id=?').run(session.id,user.id));return result;
  }
  checkoutUrl(session){
    let url;try{url=new URL(session.url);}catch{throw fault(502,'BILLING_PROVIDER_FAILED','Invalid checkout URL');}
    if(url.origin!=='https://checkout.stripe.com'||url.username||url.password)throw fault(502,'BILLING_PROVIDER_FAILED','Invalid checkout URL');
    return {url:url.href};
  }
  async portal(user) {
    if(!user)throw fault(401,'LOGIN_REQUIRED','Sign in first');
    const row=(await this.db.prepare('SELECT customer_id FROM billing_customers WHERE user_id=?').get(user.id));
    if(!row)throw fault(409,'NO_SUBSCRIPTION','No billing account found');
    const session=await this.request('/billing_portal/sessions',{method:'POST',form:{customer:row.customer_id,return_url:this.config.appUrl+'/'}});
    if(typeof session.url!=='string'||new URL(session.url).origin!=='https://billing.stripe.com')throw fault(502,'BILLING_PROVIDER_FAILED','Invalid billing portal URL');
    return {url:session.url};
  }
  verifySignature(raw,header) {
    if(!this.ready)throw fault(503,'BILLING_NOT_CONFIGURED','Billing is not configured');
    const parts=String(header||'').split(',');
    const timestamps=parts.filter(x=>x.startsWith('t='));
    const stamp=timestamps.length===1?timestamps[0].slice(2):'';
    if(!/^\d{10,12}$/.test(stamp)||Math.abs(this.clock()/1000-Number(stamp))>300)throw fault(400,'WEBHOOK_SIGNATURE','Invalid webhook signature');
    const expected=createHmac('sha256',this.config.stripeWebhookSecret).update(stamp+'.').update(raw).digest();
    const valid=parts.some(part=>{
      if(!/^v1=[a-fA-F0-9]{64}$/.test(part))return false;
      return timingSafeEqual(Buffer.from(part.slice(3),'hex'),expected);
    });
    if(!valid)throw fault(400,'WEBHOOK_SIGNATURE','Invalid webhook signature');
  }
  async serial(id,operation) {
    const previous=this.queues.get(id)||Promise.resolve();
    const current=previous.catch(()=>{}).then(operation);this.queues.set(id,current);
    try{return await current;}finally{if(this.queues.get(id)===current)this.queues.delete(id);}
  }
  async webhook(raw,signature) {
    this.verifySignature(raw,signature);
    let event;try{event=JSON.parse(raw.toString('utf8'));}catch{throw fault(400,'INVALID_WEBHOOK','Invalid webhook JSON');}
    if(typeof event.id!=='string'||!/^evt_[\w]+$/.test(event.id))throw fault(400,'INVALID_WEBHOOK','Invalid webhook event');
    if(!HANDLED.has(event.type))return {received:true,ignored:true};
    const claimed=(await transaction(this.db,async ()=>{
      const row=(await this.db.prepare('SELECT * FROM webhook_events WHERE id=?').get(event.id));
      if(row?.processed_at!==undefined&&row?.processed_at!==null)return false;
      if(row&&row.received_at>this.clock()-60_000)throw fault(503,'WEBHOOK_BUSY','Webhook processing; retry later');
      (await this.db.prepare(`INSERT INTO webhook_events(id,received_at,processed_at) VALUES(?,?,NULL) ON CONFLICT(id) DO UPDATE SET received_at=excluded.received_at,processed_at=NULL`).run(event.id,this.clock()));return true;
    }));
    if(!claimed)return {received:true,duplicate:true};
    try {
      const object=event.data?.object;
      const subscriptionId=event.type.startsWith('customer.subscription.')?object?.id:idOf(object?.subscription);
      if(typeof subscriptionId!=='string'||!/^sub_[\w]+$/.test(subscriptionId))throw fault(400,'INVALID_WEBHOOK','Invalid subscription reference');
      await this.serial(subscriptionId,async()=>{
        // Fetch live state inside the subscription queue; delayed events cannot restore old access.
        const current=await this.request('/subscriptions/'+encodeURIComponent(subscriptionId));
        if(current.id!==subscriptionId)throw fault(502,'BILLING_PROVIDER_FAILED','Subscription mismatch');
        const owner=(await this.db.prepare('SELECT user_id FROM billing_customers WHERE customer_id=?').get(idOf(current.customer)||''));
        if(!owner)return;
        const known=(await this.db.prepare('SELECT user_id FROM subscriptions WHERE id=?').get(subscriptionId));
        if(known&&known.user_id!==owner.user_id)throw fault(409,'SUBSCRIPTION_OWNER','Subscription owner mismatch');
        const item=current.items?.data?.find(x=>this.planForPrice(idOf(x.price)));
        if(item)await this.price(this.planForPrice(idOf(item.price)).id);
        const end=Number(item?.current_period_end??current.current_period_end);
        const valid=item&&Number.isFinite(end)&&end>0;
        (await this.db.prepare(`INSERT INTO subscriptions(id,user_id,status,period_end,cancel_at_period_end,price_id,updated_at)
          VALUES(?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET status=excluded.status,period_end=excluded.period_end,
          cancel_at_period_end=excluded.cancel_at_period_end,price_id=excluded.price_id,updated_at=excluded.updated_at`)
          .run(subscriptionId,owner.user_id,valid?String(current.status):'ineligible',valid?Math.floor(end*1000):0,current.cancel_at_period_end?1:0,item?idOf(item.price):'',this.clock()));
      });
      (await this.db.prepare('UPDATE webhook_events SET processed_at=? WHERE id=?').run(this.clock(),event.id));
      return {received:true};
    }catch(error){(await this.db.prepare('DELETE FROM webhook_events WHERE id=? AND processed_at IS NULL').run(event.id));throw error;}
  }
}
