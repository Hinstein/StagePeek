const $=id=>document.getElementById(id);
const api=async(path,init={})=>{
  const response=await fetch(path,{...init,headers:{'Content-Type':'application/json',...init.headers}});
  const data=await response.json();
  if(!response.ok)throw Object.assign(new Error(data.error?.message||'请求失败'),{status:response.status});
  return data;
};
let page=1,pages=1,query='',busy=false,authorized=false,accessLoaded=false;
const time=new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',dateStyle:'medium',timeStyle:'short'});
function message(text,error=false){$('status').className='alert '+(error?'alert-danger':'alert-info');$('status').textContent=text;}
function controls(){
  $('refresh').disabled=busy;$('search-form').querySelector('button').disabled=busy;$('page-size').disabled=busy;
  $('previous').disabled=busy||page<=1;$('next').disabled=busy||page>=pages;
}
function showError(error){
  $('users').replaceChildren();$('dashboard').hidden=true;authorized=false;accessLoaded=false;
  $('total-users').textContent='—';$('today-users').textContent='—';$('week-users').textContent='—';
  $('venues').replaceChildren();$('save').disabled=true;
  $('login').hidden=error.status!==401;
  message(error.status===401?'请先登录管理员账号。':error.status===403?'当前账号没有 StagePeek 管理权限，请切换管理员账号。':error.message+'；请点击“刷新数据”重试。',true);
}
async function loadUsers(){
  busy=true;controls();$('users-panel').setAttribute('aria-busy','true');message('正在读取用户…');
  try{
    const data=await api('/api/admin/users?'+new URLSearchParams({page,pageSize:$('page-size').value,q:query}));
    page=data.page;pages=data.pages;authorized=true;$('dashboard').hidden=false;$('login').hidden=true;
    $('total-users').textContent=data.summary.total.toLocaleString();$('today-users').textContent=data.summary.today.toLocaleString();$('week-users').textContent=data.summary.last7Days.toLocaleString();
    $('users').replaceChildren();
    for(const user of data.users){
      const tr=document.createElement('tr'),identity=document.createElement('td'),email=document.createElement('div'),id=document.createElement('div'),role=document.createElement('td'),joined=document.createElement('td');
      email.className='user-email fw-medium';email.textContent=user.email;id.className='user-id';id.textContent=user.id;identity.append(email,id);
      const badge=document.createElement('span');badge.className='badge '+(user.role==='member'?'bg-secondary-lt':'bg-purple-lt');badge.textContent=({member:'用户',admin:'管理员',owner:'所有者'})[user.role]||user.role;role.append(badge);
      joined.textContent=time.format(new Date(user.createdAt));joined.className='text-nowrap';tr.append(identity,role,joined);$('users').append(tr);
    }
    $('empty').hidden=data.users.length>0;
    $('page-info').textContent=data.total?`共 ${data.total} 位用户 · 第 ${page} / ${pages} 页`:'共 0 位用户';
    message('');await showTab();
  }catch(error){showError(error);}
  finally{busy=false;controls();$('users-panel').removeAttribute('aria-busy');}
}
function updateCount(){const checked=$('venues').querySelectorAll('input:checked').length;$('count').textContent=`${checked} / 10`;$('save').disabled=checked!==10;}
async function showTab(){
  const access=location.hash==='#access';$('users-panel').hidden=access;$('access-panel').hidden=!access;
  for(const [id,active] of [['users-tab',!access],['access-tab',access]]){$(id).classList.toggle('active',active);if(active)$(id).setAttribute('aria-current','page');else $(id).removeAttribute('aria-current');}
  if(!access||!authorized||accessLoaded)return;
  $('access-status').textContent='正在读取免费场馆…';
  const data=await api('/api/admin/access');$('venues').replaceChildren();
  for(const venue of data.availableVenues){
    const label=document.createElement('label'),input=document.createElement('input'),text=document.createElement('span'),name=document.createElement('strong'),detail=document.createElement('small');
    label.className='venue-option';input.className='form-check-input';input.type='checkbox';input.value=venue.id;input.checked=data.freeVenueIds.includes(venue.id);input.addEventListener('change',updateCount);
    name.textContent=venue.name;detail.textContent=[venue.country,venue.city].filter(Boolean).join(' · ');text.append(name,detail);label.append(input,text);$('venues').append(label);
  }
  accessLoaded=true;updateCount();$('access-status').textContent=`当前 ${data.availableVenueCount} 个场馆，${data.paidVenueCount} 个需要 Pro。`;
}
$('save').onclick=async()=>{
  $('save').disabled=true;$('access-status').textContent='正在保存…';
  try{await api('/api/admin/access',{method:'PUT',body:JSON.stringify({freeVenueIds:[...$('venues').querySelectorAll('input:checked')].map(input=>input.value)})});$('access-status').textContent='已保存，新的权限立即生效。';}
  catch(error){if([401,403].includes(error.status))showError(error);else $('access-status').textContent=error.message;}
  finally{if(authorized)updateCount();}
};
$('search-form').onsubmit=event=>{event.preventDefault();if(busy)return;query=$('search').value.trim();page=1;loadUsers();};
$('page-size').onchange=()=>{page=1;loadUsers();};
$('previous').onclick=()=>{page--;loadUsers();};$('next').onclick=()=>{page++;loadUsers();};
$('refresh').onclick=()=>{accessLoaded=false;loadUsers();};
window.addEventListener('hashchange',()=>showTab().catch(showError));
await loadUsers();
