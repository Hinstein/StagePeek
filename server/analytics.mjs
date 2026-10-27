// Use the existing platform tracker. The website ID is public; no API key is exposed.
import {VENUE_GUIDES} from './public-content.mjs';
export const ANALYTICS_ORIGIN='https://analytics.auturance.com';
const publicPaths=new Set(['/','/explore','/venues/','/about','/methodology','/plans','/contact',...VENUE_GUIDES.map(g=>'/venues/'+g.id)]);
export function analyticsMarkup(config,{path,search,user}) {
  const id=config.umamiWebsiteId||'';
  if(!config.production||config.appUrl!=='https://stagepeek.live'||!publicPaths.has(path)||search||user||!isWebsiteId(id))return '';
  return `<script type="module" src="/analytics.mjs" data-website-id="${id}" data-public-path="${path}"></script>`;
}
export function isWebsiteId(value){return /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(value);}
