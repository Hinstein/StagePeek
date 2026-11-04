import {fault} from './store.mjs';

export async function adminUsers(db,params,{shared=false,adminEmails=[],now=Date.now()}={}){
  const requestedPage=Number(params.get('page')??1),pageSize=Number(params.get('pageSize')??25),query=(params.get('q')||'').trim();
  if(!/^\d+$/.test(params.get('page')??'1')||!Number.isSafeInteger(requestedPage)||requestedPage<1
    ||!/^\d+$/.test(params.get('pageSize')??'25')||!Number.isSafeInteger(pageSize)||pageSize<1||pageSize>100||query.length>200)
    throw fault(400,'INVALID_DIRECTORY_QUERY','页码需为正整数，每页 1–100 条，搜索最多 200 字符');
  // Shared mode never reads the protected users table directly. The database
  // function independently checks the caller's trusted StagePeek membership.
  const source=shared?'admin_user_directory()':"(SELECT id,email,created_at,'member' AS role FROM users)",
    pattern='%'+query.toLowerCase().replace(/[!%_]/g,'!$&')+'%',
    filter="WHERE lower(email) LIKE ? ESCAPE '!' OR lower(id) LIKE ? ESCAPE '!'";
  const today=Math.floor((now+8*3600_000)/86400_000)*86400_000-8*3600_000;
  const summary=await db.prepare(`SELECT count(*) AS total,
    COALESCE(SUM(CASE WHEN created_at>=? THEN 1 ELSE 0 END),0) AS today,
    COALESCE(SUM(CASE WHEN created_at>=? THEN 1 ELSE 0 END),0) AS last7days FROM ${source} AS directory`).get(today,now-7*86400_000);
  const total=(await db.prepare(`SELECT count(*) AS total FROM ${source} AS directory ${filter}`).get(pattern,pattern)).total;
  const pages=Math.max(1,Math.ceil(total/pageSize)),page=Math.min(requestedPage,pages);
  const rows=await db.prepare(`SELECT id,email,created_at,role FROM ${source} AS directory ${filter}
    ORDER BY created_at DESC,id ASC LIMIT ? OFFSET ?`).all(pattern,pattern,pageSize,(page-1)*pageSize);
  return {summary:{total:summary.total,today:summary.today,last7Days:summary.last7days},total,page,pages,pageSize,
    users:rows.map(row=>({id:row.id,email:row.email,createdAt:row.created_at,
      role:!shared&&adminEmails.includes(row.email.toLowerCase())?'admin':row.role}))};
}
