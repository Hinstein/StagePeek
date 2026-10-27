import en from '../public/translations/en.mjs';
import zhCN from '../public/translations/zh-CN.mjs';
import zhTW from '../public/translations/zh-TW.mjs';
import ja from '../public/translations/ja.mjs';
import ko from '../public/translations/ko.mjs';

export const DEFAULT_LOCALE='en';
export const SUPPORTED_LOCALES=['en','zh-CN','zh-TW','ja','ko'];
const resources=Object.freeze({en, 'zh-CN':zhCN, 'zh-TW':zhTW, ja, ko});
const localePrefixes=new Map(SUPPORTED_LOCALES.filter(locale=>locale!=='en').map(locale=>[locale.toLowerCase(),locale]));
const explorerParams=new Set(['venue','event','layout','section','row','seat','mode','zoom','depth','lateral','standing','date','panel','data']);
const safeNext=value=>{
  if(typeof value!=='string'||value.length>2048||!value.startsWith('/')||value.startsWith('//')||/[\\\x00-\x20]/.test(value))return null;
  try{
    const url=new URL(value,'https://stagepeek.live'),parsed=parseLocalizedPath(url.pathname);
    if(!['/','/explore','/account'].includes(parsed.path))return null;
    const query=routeQuery(url,false);
    return localizedPath(parsed.locale,parsed.path)+(query.size?'?'+query.toString():'');
  }catch{return null;}
};
const routeQuery=(url,includeNext=false)=>{
  const params=new URLSearchParams();
  for(const [key,value] of url.searchParams){
    if(explorerParams.has(key))params.append(key,value.slice(0,256));
    if(includeNext&&key==='next'){
      const next=safeNext(value);
      if(next)params.set('next',next);
    }
  }
  return params;
};

export function normalizeLocale(value){
  const input=String(value||'').trim().toLowerCase();
  if(input==='en'||input.startsWith('en-'))return 'en';
  if(input==='zh-tw'||input==='zh-hant'||input.startsWith('zh-hant-'))return 'zh-TW';
  if(input==='zh-cn'||input==='zh-hans'||input.startsWith('zh-hans-'))return 'zh-CN';
  if(input==='ja'||input.startsWith('ja-'))return 'ja';
  if(input==='ko'||input.startsWith('ko-'))return 'ko';
  return DEFAULT_LOCALE;
}

export function parseLocalizedPath(path){
  const value=String(path||'/').startsWith('/')?String(path||'/'):'/'+path;
  const match=value.match(/^\/([^/]+)(\/.*)?$/);
  const locale=match&&localePrefixes.get(match[1].toLowerCase());
  if(!locale)return {locale:DEFAULT_LOCALE,path:value||'/'};
  return {locale,path:match[2]||'/'};
}

export function localizedPath(locale,path){
  const normalized=normalizeLocale(locale),clean=String(path||'/').startsWith('/')?String(path||'/'):'/'+path;
  if(normalized===DEFAULT_LOCALE)return clean||'/';
  return `/${normalized}${clean==='/'?' /'.trim():clean}`;
}

export function localizedQuery(locale,input){
  const url=input instanceof URL?input:new URL(String(input), 'https://stagepeek.live');
  const parsed=parseLocalizedPath(url.pathname),target=localizedPath(locale,parsed.path),includeNext=parsed.path.startsWith('/auth/')||parsed.path==='/account';
  const query=routeQuery(url,includeNext);
  return target+(query.size?'?'+query.toString():'');
}

export function translationKeys(locale){return Object.keys(resources[normalizeLocale(locale)]).sort();}

export function translations(locale){return resources[normalizeLocale(locale)];}

export function assertCompleteTranslations(){
  const expected=translationKeys(DEFAULT_LOCALE).join('\u0000');
  for(const locale of SUPPORTED_LOCALES){
    const actual=translationKeys(locale).join('\u0000');
    if(actual!==expected)throw new Error(`Incomplete translation resource: ${locale}`);
  }
  return true;
}

assertCompleteTranslations();
