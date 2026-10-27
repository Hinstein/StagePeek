// Shared non-secret contract. Never accept external redirects or auth loops.
export const TERMS_VERSION='2026-10-26';
export function safeReturn(value){
 if(typeof value!=='string'||value.length>2048||!value.startsWith('/')||value.startsWith('//')||/[\\\x00-\x20]/.test(value))return '/';
 try{const url=new URL(value,'https://stagepeek.live');const base=url.pathname.replace(/^\/(?:zh-CN|zh-TW|ja|ko)(?=\/)/,'');if(url.origin!=='https://stagepeek.live'||!['/','/index.html','/explore'].includes(base))return '/';
  for(const key of [...url.searchParams.keys()])if(!['venue','event','layout','section','row','seat','mode','zoom','depth','lateral','standing','date','lang','account'].includes(key))url.searchParams.delete(key);
  return url.pathname+url.search;
 }catch{return '/';}
}

export function venueReturn(state,input={}){
 const r=state.result;
 const params=new URLSearchParams({venue:state.venueId,section:r?.section||input.section||state.sectionId,layout:state.layout,mode:state.mode});
 if(state.event?.id)params.set('event',state.event.id);
 for(const key of ['row','seat']){const value=r?.[key]??input[key];if(value!==undefined&&value!==null&&value!=='')params.set(key,value);}
 if(Number.isFinite(Number(state.zoom)))params.set('zoom',String(Math.max(1,Math.min(8,Number(state.zoom)))));
 return safeReturn('/?'+params);
}
export function needsConsentPage(mode,me){return !!me?.user&&!!me.consent?.required&&!['account','setup','reset','recover-code','new-password'].includes(mode);}
