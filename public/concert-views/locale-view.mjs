// A locale navigation reloads the page; bind its view to the exact model/ticket.
export function localeViewKey(params){
 return ['venue','event','layout','section','row','seat'].map(key=>params.get(key)||'').join('~');
}

export function readLocaleView(value,key){
 if(!value)return null;
 let saved;
 try{saved=JSON.parse(value);}catch{return null;}
 if(saved?.key!==key||!saved.view)return null;
 const view=saved.view;
 if(!['overview','near','stage','seat'].includes(view.mode)||
  ![view.position,view.target].every(point=>Array.isArray(point)&&point.length===3&&point.every(n=>Number.isFinite(n)&&Math.abs(n)<1400))||
  !Number.isFinite(view.fov)||view.fov<3||view.fov>90||typeof view.phone!=='boolean'||typeof view.roof!=='boolean'||
  Math.hypot(...view.position.map((n,i)=>n-view.target[i]))<.01)return null;
 return view;
}
