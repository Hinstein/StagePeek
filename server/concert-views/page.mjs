import {interfaceCopy} from '../../public/translations/interface.mjs';
import {readFileSync} from 'node:fs';
import {localizeInterfaceHtml,publicHeader,publicFooter} from '../public-pages.mjs';

const template=readFileSync(new URL('../../public/index.html',import.meta.url),'utf8');
const scene=`<div id="viewer" class="viewer"><canvas id="scene" aria-label="可拖拽的三维场馆"></canvas><svg id="map" viewBox="-190 -145 380 290" role="group" tabindex="0" aria-label="可选择分区的二维场馆图" hidden></svg>
 <div id="map-levels" class="map-levels" role="group" aria-label="二维看台层级" hidden></div>
 <div id="map-layers" class="map-layers" role="group" aria-label="二维叠加图层"><button id="map-event-toggle" type="button" aria-pressed="false" hidden>内场</button><button id="map-official-toggle" type="button" aria-pressed="false" hidden>官方区界</button><span id="map-layer-status" class="map-layer-status" hidden></span></div>
 <div id="selection-row" class="selection-row"><span id="selection-tag" class="selection-tag"></span></div><span id="viewer-location" class="viewer-location"></span><div id="view-error" class="view-error" hidden></div>
 </div>`;

export function concertViewsPage(locale,user){
 const html=template
  .replace('aria-label="Find a ticket seat"','aria-label="查找座位"')
  .replace('src="/app.mjs"','src="/concert-views/app.mjs"')
  .replace('</head>','<link rel="stylesheet" href="/venue-view/venue-view.css"><link rel="stylesheet" href="/concert-views/scene.css"><meta name="robots" content="noindex,nofollow"></head>')
  .replace(/<div class="switch" aria-label="地图模式">[\s\S]*?<\/div>/,'')
  .replace(/<div id="viewer"[\s\S]*?(?=<div class="map-footer">)/,scene)
  .replace('<input id="row"','<datalist id="row-list"></datalist><input list="row-list" id="row"')
  .replace('<details class="sources">','<div id="capability-badges" class="capability-badges"></div><details class="sources">')
  .replace('<span id="coverage-count">','<span id="conflict-legend" hidden>本场布局相交待核对</span><span id="coverage-count">')
  .replace('<label class="small"><span data-i18n="explorer.layoutPicker">','<section id="research-v0-notice" class="research-v0-notice" hidden></section><label class="small"><span data-i18n="explorer.layoutPicker">')
  .replace('</p></section>\n      </aside>','</p><div id="ticket-map-conflicts" hidden></div><button id="return-venue-layout" class="wide" hidden>返回场馆常规布局</button><img id="ticket-map-preview-image" alt="本场来源票图" hidden></section>\n      </aside>');
 const localized=localizeInterfaceHtml(html,locale,'/explore');
 const copy=source=>interfaceCopy(source,[],locale);
 return localized
  .replace(/<details class="sources">[\s\S]*?<\/details>/,`<details class="sources"><summary>${copy('座位与视角说明')} <span id="accuracy-short"></span></summary><p id="coverage-note"></p><p>${copy('座位、舞台与人物为示意，仅供视角参考。')}</p><a id="source-link" target="_blank" rel="noopener noreferrer">${copy('场馆官网 ↗')}</a></details>`)
  .replace(/<section class="product-guide"[\s\S]*?<\/section>/,`<section class="product-guide" aria-labelledby="guide-title"><h2 id="guide-title">${copy('如何查看座位视角？')}</h2><p>${copy('选择地区、场馆和演唱会，输入区、排、座，或直接点击地图。切换 2D / 3D，进入观众视角；手机取景可调节 1–10 倍画面。')}</p><p>${copy('模型与编号仅供大致参考，不保证对应门票位置；画面不是现场照片。')}</p></section>`)
  .replace(/data-i18n="explorer.legendSource">[^<]*/g,`>${copy('参考位置')}`)
  .replace(/data-i18n="explorer.samples">[^<]*/g,`>${copy('看看其他位置')}`)
  .replace(/data-i18n="explorer.ticketHint">[^<]*/g,`>${copy('示例：101 区 · A 排 · 78 座。')}`)
  .replace(/data-i18n="explorer.distance">[^<]*/g,`>${copy('至示意舞台 · 仅供参考')}`)
  .replace('<!--SITE-HEADER-->',publicHeader(locale,'/concert-views',{user,explorer:true}))
  .replace('<!--SITE-FOOTER-->',publicFooter(locale))
  .replace('</head>',`<meta name="stagepeek-locale" content="${locale}"></head>`);
}
