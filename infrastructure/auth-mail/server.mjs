import nodemailer from 'nodemailer';
import {createServer} from 'node:http';
import {readFile,readdir,stat,unlink} from 'node:fs/promises';
import {join} from 'node:path';
import {verifySignature,resolveMail,deliverMail} from './router.mjs';

const registry=JSON.parse(await readFile(process.env.MAIL_PROJECTS_FILE,'utf8'));
if(!process.env.AUTH_HOOK_SECRET||!process.env.SMTP_USER||!process.env.SMTP_PASS)throw new Error('Shared Auth mail secrets are required');
if(process.env.SMTP_HOST!=='smtp-relay.brevo.com')throw new Error('Use the shared Brevo SMTP provider');
const transport=nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:false,requireTLS:true,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS},connectionTimeout:5000,greetingTimeout:5000,socketTimeout:8000,disableFileAccess:true,disableUrlAccess:true,logger:false,debug:false});
const send=async(message,fingerprint,slug)=>transport.sendMail({from:{name:message.sender.name,address:message.sender.email},to:message.to.map(x=>({address:x.email})),subject:message.subject,text:message.textContent,html:message.htmlContent,messageId:'<'+fingerprint+'@auth.openp7m.com>',headers:{'X-Mailin-Tag':'platform-auth|'+slug},disableFileAccess:true,disableUrlAccess:true});
const ledgerDir=process.env.MAIL_LEDGER_DIR||'/var/lib/platform-auth-mail';
const server=createServer(async(req,res)=>{
 const reply=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
 if(req.url==='/healthz'&&req.method==='GET')return reply(200,{ok:true,service:'platform-auth-mail'});
 if(req.url!=='/send-email'||req.method!=='POST')return reply(404,{});
 try{
  if(!String(req.headers['content-type']||'').startsWith('application/json'))return reply(415,{});
  const chunks=[];let size=0;
  for await(const chunk of req){size+=chunk.length;if(size>65536)throw Object.assign(new Error('BODY_TOO_LARGE'),{status:413});chunks.push(chunk);}
  const raw=Buffer.concat(chunks).toString('utf8');verifySignature(raw,req.headers,process.env.AUTH_HOOK_SECRET);
  const mail=resolveMail(registry,JSON.parse(raw));
  await deliverMail(mail,{ledgerDir,send});
  reply(200,{});
 }catch(error){
  const code=error.code||'HOOK_FAILED',status=error.status||500;
  console.error(JSON.stringify({service:'platform-auth-mail',code,status}));
  // Never return or log recipients, OTPs, provider bodies or shared credentials.
  reply(status,{error:{http_code:status,message:code}});
 }
});
server.requestTimeout=15000;server.headersTimeout=10000;server.maxHeadersCount=40;
server.listen(Number(process.env.MAIL_PORT||14680),process.env.MAIL_HOST||'127.0.0.1');
// The token lifetime is managed by Auth. The ledger only retains hashes/status.
const cleanup=setInterval(async()=>{try{for(const name of await readdir(ledgerDir)){if(!/^[a-f0-9]{64}\.json$/.test(name))continue;const file=join(ledgerDir,name);if(Date.now()-(await stat(file)).mtimeMs>86400_000)await unlink(file);}}catch{console.error('Mail ledger cleanup failed');}},3600_000);cleanup.unref();
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(()=>process.exit(0)));
