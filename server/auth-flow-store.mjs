import {randomBytes,createHash} from 'node:crypto';
import {fault} from './store.mjs';
const digest=value=>createHash('sha256').update(value).digest('hex');
export class AuthFlowStore {
 constructor(db,auth){this.db=db;this.auth=auth;}
 async put(kind,payload,ttl=900000){
  const handle=randomBytes(32).toString('base64url'),until=this.auth.clock()+ttl;
  await this.db.prepare('INSERT INTO auth_flows(id,kind,payload,expires_at) VALUES(?,?,?,?)').run(digest(handle),kind,this.auth.seal({...payload,createdAt:this.auth.clock(),until}),until);
  return handle;
 }
 async restore(handle,kind,value){
  if(value.until<=this.auth.clock())return;
  await this.db.prepare('INSERT INTO auth_flows(id,kind,payload,expires_at) VALUES(?,?,?,?) ON CONFLICT(id) DO NOTHING').run(digest(handle),kind,this.auth.seal(value),value.until);
 }
 async discard(handle){
  if(typeof handle==='string'&&/^[-\w]{43}$/.test(handle))await this.db.prepare('DELETE FROM auth_flows WHERE id=?').run(digest(handle));
 }
 async peek(handle){
  if(typeof handle!=='string'||!/^[-\w]{43}$/.test(handle))return null;
  const row=await this.db.prepare('SELECT kind,payload FROM auth_flows WHERE id=? AND expires_at>?').get(digest(handle),this.auth.clock());
  const value=row&&this.auth.unseal(row.payload);return value?{...value,kind:row.kind}:null;
 }
 async take(handle,kind){
  if(typeof handle!=='string'||!/^[\w-]{43}$/.test(handle))throw fault(400,'AUTH_FLOW_EXPIRED','请重新开始验证');
  const row=await this.db.prepare('DELETE FROM auth_flows WHERE id=? AND kind=? AND expires_at>? RETURNING payload').get(digest(handle),kind,this.auth.clock());
  const value=row&&this.auth.unseal(row.payload);
  if(!value)throw fault(400,'AUTH_FLOW_EXPIRED','验证已过期或已使用，请重新开始');
  return value;
 }
}
