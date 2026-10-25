import {DatabaseSync} from 'node:sqlite';
import {mkdirSync, chmodSync} from 'node:fs';
import {dirname} from 'node:path';

export function openStore(path) {
  if(path!==':memory:') mkdirSync(dirname(path),{recursive:true,mode:0o700});
  const db=new DatabaseSync(path);
  if(path!==':memory:') chmodSync(path,0o600);
  db.exec(`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, google_id TEXT UNIQUE,
      created_at INTEGER NOT NULL
    ) STRICT;
    CREATE TABLE IF NOT EXISTS login_tokens (
      token_hash TEXT PRIMARY KEY, email TEXT NOT NULL, expires_at INTEGER NOT NULL,
      browser_hash TEXT, consumed_at INTEGER
    ) STRICT;
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id),
      expires_at INTEGER NOT NULL
    ) STRICT;
    CREATE TABLE IF NOT EXISTS oauth_attempts (
      state_hash TEXT PRIMARY KEY, browser_hash TEXT NOT NULL, verifier TEXT NOT NULL,
      user_id TEXT REFERENCES users(id), expires_at INTEGER NOT NULL
    ) STRICT;
    CREATE TABLE IF NOT EXISTS billing_customers (
      user_id TEXT PRIMARY KEY REFERENCES users(id), customer_id TEXT NOT NULL UNIQUE
    ) STRICT;
    CREATE TABLE IF NOT EXISTS checkout_attempts (
      user_id TEXT PRIMARY KEY REFERENCES users(id), request_key TEXT NOT NULL,
      session_id TEXT, price_id TEXT NOT NULL, created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL
    ) STRICT;
    CREATE TABLE IF NOT EXISTS local_billing_tokens (
      token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id),
      expires_at INTEGER NOT NULL, consumed_at INTEGER
    ) STRICT;
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id),
      status TEXT NOT NULL, period_end INTEGER NOT NULL, cancel_at_period_end INTEGER NOT NULL,
      price_id TEXT NOT NULL, updated_at INTEGER NOT NULL DEFAULT 0
    ) STRICT;
    CREATE TABLE IF NOT EXISTS webhook_events (
      id TEXT PRIMARY KEY, received_at INTEGER NOT NULL, processed_at INTEGER
    ) STRICT;
    CREATE TABLE IF NOT EXISTS saved_positions (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), venue_id TEXT NOT NULL,
      section TEXT NOT NULL, row_token TEXT NOT NULL, seat_token TEXT NOT NULL,
      event_id TEXT, label TEXT NOT NULL, created_at INTEGER NOT NULL
    ) STRICT;
    CREATE TABLE IF NOT EXISTS rate_limits (
      key TEXT PRIMARY KEY, count INTEGER NOT NULL, reset_at INTEGER NOT NULL
    ) STRICT;
  `);
  if(!db.prepare('PRAGMA table_info(saved_positions)').all().some(column=>column.name==='layout'))db.exec('ALTER TABLE saved_positions ADD COLUMN layout TEXT');
  return db;
}

export function transaction(db,fn) {
  db.exec('BEGIN IMMEDIATE');
  try {const result=fn();db.exec('COMMIT');return result;}
  catch(error){db.exec('ROLLBACK');throw error;}
}

export function fault(status,code,message) {
  return Object.assign(new Error(message),{status,code});
}

export function limit(db,key,max,windowMs,now=Date.now()) {
  transaction(db,()=>{
    const item=db.prepare('SELECT count,reset_at FROM rate_limits WHERE key=?').get(key);
    if(!item||item.reset_at<=now){db.prepare('INSERT OR REPLACE INTO rate_limits VALUES(?,?,?)').run(key,1,now+windowMs);return;}
    if(item.count>=max)throw fault(429,'RATE_LIMITED','Too many requests; try again later');
    db.prepare('UPDATE rate_limits SET count=count+1 WHERE key=?').run(key);
  });
}
