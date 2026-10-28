// Use the existing platform tracker. The website ID is public; no API key is exposed.
import {SUPPORTED_LOCALES,localizedPath} from './locales.mjs';
import {VENUE_GUIDES} from './public-content.mjs';
export const ANALYTICS_ORIGIN='https://analytics.auturance.com';
const publicPaths=new Set(SUPPORTED_LOCALES.flatMap(locale=>['/','/explore','/venues/','/about','/methodology','/plans','/contact',...VENUE_GUIDES.map(g=>'/venues/'+g.id)].map(path=>localizedPath(locale,path))));
const explorerPaths=new Set(SUPPORTED_LOCALES.map(locale=>localizedPath(locale,'/explore')));
export function analyticsMarkup(config,{path,search,user}) {
  const id=config.umamiWebsiteId||'';
  const isExplorer=explorerPaths.has(path);
  const isQueryTool=isRootPath(path)&&search&&hasToolQuery(search);
  if(!config.production||config.appUrl!=='https://stagepeek.live'||(!publicPaths.has(path)&&!isExplorer&&!isQueryTool)||(!isExplorer&&!isQueryTool&&(search||user))||!isWebsiteId(id))return '';
  const publicPath=path;
  const analyticsPath=isExplorer||isQueryTool?localizedExplorerPath(path):path;
  return `<script type="module" src="/analytics.mjs" data-website-id="${id}" data-public-path="${publicPath}" data-analytics-path="${analyticsPath}" data-tool-page="${isExplorer||isQueryTool}"></script>`;
}
export function isWebsiteId(value){return /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(value);}

function hasToolQuery(search){
  const keys=new Set(['venue','event','layout','section','row','seat','mode','zoom','depth','lateral','standing','date','panel','data','billing','auth','auth_error','login','token','session_id']);
  return [...new URLSearchParams(search).keys()].some(key=>keys.has(key));
}

function localizedExplorerPath(path){
  const locale=SUPPORTED_LOCALES.find(value=>path.toLowerCase()===`/${value.toLowerCase()}/explore`);
  if(locale)return `/${locale}/explore`;
  const rootLocale=SUPPORTED_LOCALES.find(value=>path.toLowerCase()===`/${value.toLowerCase()}`||path.toLowerCase()===`/${value.toLowerCase()}/`);
  if(rootLocale)return rootLocale==='en'?'/':`/${rootLocale}/explore`;
  return '/explore';
}

function isRootPath(path){return path==='/'||SUPPORTED_LOCALES.some(locale=>path.toLowerCase()===`/${locale.toLowerCase()}`||path.toLowerCase()===`/${locale.toLowerCase()}/`);}
