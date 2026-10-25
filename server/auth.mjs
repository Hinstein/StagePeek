import {randomBytes,randomUUID,createHash} from 'node:crypto';
import {transaction,fault} from './store.mjs';

const DAY=24*60*60_000;
export const randomToken=()=>randomBytes(32).toString('base64url');
export const hash=value=>createHash('sha256').update(String(value)).digest('hex');
const tokenValid=value=>typeof value==='string'&&/^[\w-]{43}$/.test(value);
export function normalizeEmail(value) {
  if(typeof value!=='string') throw fault(400,'INVALID_EMAIL','Invalid email');
  const email=value.trim().toLowerCase();
  if(email.length>254||!/^\S+@[^\s@]+\.[^\s@]+$/.test(email)||/[\x00-\x20\x7f<>]/.test(email))
    throw fault(400,'INVALID_EMAIL','Invalid email');
  return email;
}
const userView=row=>row?{id:row.id,email:row.email,googleConnected:!!row.google_id,createdAt:row.created_at}:null;

export class AuthService {
  constructor(db,{clock=Date.now}={}){this.db=db;this.clock=clock;}
  async user(id){return userView((await this.db.prepare('SELECT * FROM users WHERE id=?').get(id)));}
  async issueEmail(value,browserToken=null) {
    const email=normalizeEmail(value),token=randomToken(),expiresAt=this.clock()+15*60_000;
    (await this.db.prepare('INSERT INTO login_tokens(token_hash,email,expires_at,browser_hash) VALUES(?,?,?,?)')
      .run(hash(token),email,expiresAt,browserToken?hash(browserToken):null));
    return {token,email,expiresAt};
  }
  async discardEmail(token){(await this.db.prepare('DELETE FROM login_tokens WHERE token_hash=?').run(hash(token)));}
  async consumeEmail(token,browserToken=null) {
    if(!tokenValid(token))throw fault(400,'INVALID_LINK','Invalid or expired login link');
    return (await transaction(this.db,async ()=>{
      const row=(await this.db.prepare('SELECT * FROM login_tokens WHERE token_hash=?').get(hash(token)));
      if(!row||row.consumed_at!==null||row.expires_at<=this.clock()||(row.browser_hash&&row.browser_hash!==hash(browserToken)))
        throw fault(400,'INVALID_LINK','Invalid or expired login link');
      (await this.db.prepare('UPDATE login_tokens SET consumed_at=? WHERE token_hash=?').run(this.clock(),hash(token)));
      let user=(await this.db.prepare('SELECT * FROM users WHERE email=?').get(row.email));
      if(!user){const id=randomUUID();(await this.db.prepare('INSERT INTO users(id,email,created_at) VALUES(?,?,?)').run(id,row.email,this.clock()));user=(await this.db.prepare('SELECT * FROM users WHERE id=?').get(id));}
      return userView(user);
    }));
  }
  async createSession(userId) {
    const token=randomToken();
    (await this.db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(hash(token),userId,this.clock()+30*DAY));
    return token;
  }
  async readSession(token) {
    if(!tokenValid(token))return null;
    return userView((await this.db.prepare(`SELECT u.* FROM sessions s JOIN users u ON s.user_id=u.id
      WHERE s.token_hash=? AND s.expires_at>?`).get(hash(token),this.clock())));
  }
  async revokeSession(token){if(token)(await this.db.prepare('DELETE FROM sessions WHERE token_hash=?').run(hash(token)));}
  async startOAuth(userId=null) {
    const state=randomToken(),browserToken=randomToken(),verifier=randomToken();
    const challenge=createHash('sha256').update(verifier).digest('base64url');
    (await this.db.prepare('INSERT INTO oauth_attempts VALUES(?,?,?,?,?)')
      .run(hash(state),hash(browserToken),verifier,userId,this.clock()+10*60_000));
    return {state,browserToken,challenge};
  }
  async consumeOAuth(state,browserToken) {
    if(!tokenValid(state)||!tokenValid(browserToken))throw fault(400,'OAUTH_STATE','Invalid OAuth state');
    return (await transaction(this.db,async ()=>{
      const row=(await this.db.prepare('SELECT * FROM oauth_attempts WHERE state_hash=?').get(hash(state)));
      if(!row||row.expires_at<=this.clock()||row.browser_hash!==hash(browserToken))throw fault(400,'OAUTH_STATE','Invalid OAuth state');
      (await this.db.prepare('DELETE FROM oauth_attempts WHERE state_hash=?').run(hash(state)));
      return {verifier:row.verifier,userId:row.user_id};
    }));
  }
  async googleUser(profile,linkUserId=null) {
    if(!profile||typeof profile.sub!=='string'||!profile.sub||profile.sub.length>255||profile.email_verified!==true)
      throw fault(400,'GOOGLE_UNVERIFIED','Google email must be verified');
    const email=normalizeEmail(profile.email);
    return (await transaction(this.db,async ()=>{
      const bySubject=(await this.db.prepare('SELECT * FROM users WHERE google_id=?').get(profile.sub));
      if(bySubject){if(linkUserId&&bySubject.id!==linkUserId)throw fault(409,'GOOGLE_LINKED','Google identity already linked');return userView(bySubject);}
      const byEmail=(await this.db.prepare('SELECT * FROM users WHERE email=?').get(email));
      if(linkUserId){
        const current=(await this.db.prepare('SELECT * FROM users WHERE id=?').get(linkUserId));
        if(!current||current.email!==email||current.google_id||(byEmail&&byEmail.id!==current.id))throw fault(409,'GOOGLE_LINKED','Account already linked or email does not match');
        (await this.db.prepare('UPDATE users SET google_id=? WHERE id=?').run(profile.sub,current.id));
        return this.user(current.id);
      }
      if(byEmail)throw fault(409,'LINK_REQUIRED','Sign in with email first to link Google');
      const id=randomUUID();(await this.db.prepare('INSERT INTO users(id,email,google_id,created_at) VALUES(?,?,?,?)').run(id,email,profile.sub,this.clock()));
      return this.user(id);
    }));
  }
}
