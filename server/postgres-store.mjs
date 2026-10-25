import pg from 'pg';
import {AsyncLocalStorage} from 'node:async_hooks';

export const postgresSchema=value=>{
  if(!/^site_stagepeek(?:_[a-z0-9_]+)?$/.test(value||''))throw new Error('DATABASE_SCHEMA must be a StagePeek project schema');
  return value;
};
// Application SQL is static and parameterized. Skip quoted SQL literals when
// converting the shared repository placeholders to PostgreSQL positional ones.
export function postgresSql(sql){
  let n=0;
  return sql.replace(/'(?:''|[^'])*'|"(?:""|[^"])*"|\?/g,part=>part==='?'?'$'+(++n):part);
}
const types= new pg.TypeOverrides();
for(const oid of [20,23])types.setTypeParser(oid,value=>{
  const n=Number(value);if(!Number.isSafeInteger(n))throw new Error('Database integer exceeds JavaScript safe range');return n;
});

export async function openPostgres({databaseUrl,databaseSchema='site_stagepeek',databasePoolMax=5}) {
  const schema=postgresSchema(databaseSchema),context=new AsyncLocalStorage();
  const pool=new pg.Pool({connectionString:databaseUrl,max:databasePoolMax,types,
    connectionTimeoutMillis:5000,idleTimeoutMillis:30000,
    options:`-c search_path=${schema},pg_catalog -c statement_timeout=15000 -c idle_in_transaction_session_timeout=15000`,
    application_name:'stagepeek'});
  // Pool errors contain connection details; report a fixed string only.
  pool.on('error',()=>console.error('PostgreSQL idle connection failed'));
  try{
    const result=await pool.query(`SELECT version FROM ${schema}.schema_migrations WHERE version=1`);
    if(result.rows[0]?.version!==1)throw new Error('PostgreSQL schema migration 1 is required');
  }catch(error){await pool.end();throw new Error('PostgreSQL connection or schema check failed',{cause:error});}
  const query=(sql,args=[]) => (context.getStore()||pool).query(postgresSql(sql),args);
  return {
    dialect:'postgres',schema,
    prepare(sql){return {
      async get(...args){return (await query(sql,args)).rows[0];},
      async all(...args){return (await query(sql,args)).rows;},
      async run(...args){const r=await query(sql,args);return {changes:r.rowCount};}
    };},
    exec(sql){return query(sql);},
    async transaction(fn){
      if(context.getStore())throw new Error('Nested transactions are unsupported');
      const client=await pool.connect();
      try{
        await client.query('BEGIN');
        // Short auth, token, limit and claim transactions share a schema-scoped
        // lock across every application process. Never hold it across HTTP I/O.
        await client.query('SELECT pg_advisory_xact_lock(hashtext($1))',[schema]);
        const result=await context.run(client,fn);await client.query('COMMIT');return result;
      }catch(error){await client.query('ROLLBACK');throw error;}
      finally{client.release();}
    },
    close(){return pool.end();}
  };
}
