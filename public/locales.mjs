import en from './translations/en.mjs';
import zhCN from './translations/zh-CN.mjs';
import zhTW from './translations/zh-TW.mjs';
import ja from './translations/ja.mjs';
import ko from './translations/ko.mjs';
import {interfaceCopy} from './translations/interface.mjs';

export function copy(source,values=[]){return interfaceCopy(source,values,getLocale());}

export const DEFAULT_LOCALE='en';
export const SUPPORTED_LOCALES=['en','zh-CN','zh-TW','ja','ko'];
const resources=Object.freeze({en,'zh-CN':zhCN,'zh-TW':zhTW,ja,ko});
const prefixes=new Map(SUPPORTED_LOCALES.filter(locale=>locale!=='en').map(locale=>[locale.toLowerCase(),locale]));
const explorerParams=new Set(['venue','event','layout','section','row','seat','mode','zoom','depth','lateral','standing','date','panel','data']);

export function parseLocalizedPath(path){
  const match=path.match(/^\/([^/]+)(\/.*)?$/);
  const locale=match&&prefixes.get(match[1].toLowerCase());
  return {locale:locale||DEFAULT_LOCALE,path:locale?match[2]||'/':path};
}

export function localizedPath(locale,path){
  const clean=parseLocalizedPath(path.startsWith('/')?path:'/'+path).path;
  return locale==='en'?clean:`/${locale}${clean}`;
}

export function getLocale(){
  const configured=globalThis.stagepeekLocale||document.documentElement.lang;
  if(SUPPORTED_LOCALES.includes(configured))return configured;
  const match=location.pathname.match(/^\/([^/]+)/),locale=match&&prefixes.get(match[1].toLowerCase());
  return locale||DEFAULT_LOCALE;
}

export function setDocumentLocale(locale){
  const value=SUPPORTED_LOCALES.includes(locale)?locale:DEFAULT_LOCALE;
  document.documentElement.lang=value;
  return value;
}

export function t(key,values={}){
  const value=resources[getLocale()]?.[key]??resources[DEFAULT_LOCALE]?.[key]??key;
  return String(value).replace(/\{(\w+)\}/g,(_,name)=>String(values[name]??`{${name}}`));
}

export function setLocaleUrl(locale){
  const input=new URL(location.href),match=input.pathname.match(/^\/([^/]+)(\/.*)?$/),current=match&&prefixes.get(match[1].toLowerCase());
  const path=current?match[2]||'/':input.pathname;
  const target=localizedPath(locale,path);
  const next=new URL(target,input.origin);
  for(const [key,value] of input.searchParams){if(explorerParams.has(key))next.searchParams.append(key,value);}
  if(input.searchParams.has('next')&&(path.startsWith('/auth/')||path==='/account'))next.searchParams.set('next',input.searchParams.get('next'));
  location.assign(next.pathname+(next.search||''));
}

export function translations(locale=getLocale()){return resources[locale]||resources[DEFAULT_LOCALE];}
