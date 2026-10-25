import {DatabaseSync} from 'node:sqlite';
import {mkdirSync, chmodSync} from 'node:fs';
import {dirname} from 'node:path';
import {AsyncLocalStorage} from 'node:async_hooks';

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
    CREATE TABLE IF NOT EXISTS access_settings (
      key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at INTEGER NOT NULL,
      updated_by TEXT NOT NULL DEFAULT ''
    ) STRICT;
  `);
  if(!db.prepare('PRAGMA table_info(saved_positions)').all().some(column=>column.name==='layout'))db.exec('ALTER TABLE saved_positions ADD COLUMN layout TEXT');
  return sqliteAdapter(db);
}

export async function transaction(db,fn) {
  if(db.transaction)return db.transaction(fn);
  throw new Error('Store does not support transactions');
}

export function fault(status,code,message) {
  return Object.assign(new Error(message),{status,code});
}

export async function limit(db,key,max,windowMs,now=Date.now()) {
  await transaction(db,async()=>{
    const item=await db.prepare('SELECT count,reset_at FROM rate_limits WHERE key=?').get(key);
    if(!item||item.reset_at<=now){
      await db.prepare(`INSERT INTO rate_limits VALUES(?,?,?) ON CONFLICT(key)
        DO UPDATE SET count=excluded.count,reset_at=excluded.reset_at`).run(key,1,now+windowMs);return;
    }
    if(item.count>=max)throw fault(429,'RATE_LIMITED','Too many requests; try again later');
    await db.prepare('UPDATE rate_limits SET count=count+1 WHERE key=?').run(key);
  });
}

// One SQLite connection is for development/tests only. All operations join the
// same asynchronous queue, so an await cannot let another request enter a tx.
function sqliteAdapter(raw) {
  const context=new AsyncLocalStorage();let tail=Promise.resolve();
  const exclusive=fn=>{
    if(context.getStore())return Promise.resolve().then(fn);
    const work=tail.then(()=>context.run(true,fn));tail=work.catch(()=>{});return work;
  };
  return {
    dialect:'sqlite',
    prepare(sql){return Object.fromEntries(['get','all','run'].map(method=>[method,(...values)=>exclusive(()=>raw.prepare(sql)[method](...values))]));},
    exec(sql){return exclusive(()=>raw.exec(sql));},
    transaction(fn){return exclusive(async()=>{
      raw.exec('BEGIN IMMEDIATE');
      try{const result=await fn();raw.exec('COMMIT');return result;}
      catch(error){raw.exec('ROLLBACK');throw error;}
    });},
    close(){return exclusive(()=>raw.close());}
  };
}

export async function openDatabase(config) {
  if(config.databaseUrl){
    const {openPostgres}=await import('./postgres-store.mjs');
    return openPostgres(config);
  }
  if(config.production)throw new Error('Production requires DATABASE_URL (PostgreSQL)');
  return openStore(config.dbPath);
}
