// Use the existing platform tracker. The website ID is public; no API key is exposed.
export const ANALYTICS_ORIGIN='https://analytics.auturance.com';
export function analyticsMarkup(config,{path,search,user}) {
  const id=config.umamiWebsiteId||'';
  if(!config.production||config.appUrl!=='https://stagepeek.live'||path!=='/'||search||user||!isWebsiteId(id))return '';
  return `<script type="module" src="/analytics.mjs" data-website-id="${id}"></script>`;
}
export function isWebsiteId(value){return /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(value);}
