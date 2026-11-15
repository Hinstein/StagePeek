import {interfaceCopy} from '../../public/translations/interface.mjs';
import {readFileSync} from 'node:fs';
import {localizeInterfaceHtml,publicHeader,publicFooter} from '../public-pages.mjs';

const template=readFileSync(new URL('../../public/index.html',import.meta.url),'utf8');
const scene=`<div id="viewer" class="viewer"><canvas id="scene" aria-label="可拖拽的三维场馆"></canvas><svg id="map" viewBox="-190 -145 380 290" role="group" tabindex="0" aria-label="可选择分区的二维场馆图" hidden></svg>
 <div id="map-levels" class="map-levels" role="group" aria-label="二维看台层级" hidden></div>
 <div id="map-layers" class="map-layers" role="group" aria-label="二维叠加图层"><button id="map-event-toggle" type="button" aria-pressed="false" hidden>内场</button><button id="map-official-toggle" type="button" aria-pressed="false" hidden>官方区界</button><span id="map-layer-status" class="map-layer-status" hidden></span></div>
 <div id="selection-row" class="selection-row"><span id="selection-tag" class="selection-tag"></span></div><span id="viewer-location" class="viewer-location"></span><div id="view-error" class="view-error" hidden></div>
 </div>`;

export function concertViewsPage(locale,user,{publicMode=false}={}){
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
  .replace('</p></section>\n      </aside>','</p><div id="ticket-map-conflicts" hidden></div><button id="return-venue-layout" class="wide" hidden>返回场馆常规布局</button><a id="ticket-map-preview-link" target="_blank" rel="noopener noreferrer"><img id="ticket-map-preview-image" alt="本场来源票图" hidden></a></section>\n      </aside>');
 const localized=localizeInterfaceHtml(html,locale,'/explore');
 const copy=source=>interfaceCopy(source,[],locale);
 const page=localized
  .replace(/<details class="sources">[\s\S]*?<\/details>/,`<details class="sources"><summary>${copy('座位与视角说明')} <span id="accuracy-short"></span></summary><p id="coverage-note"></p><p>${copy('座位、舞台与人物为示意，仅供视角参考。')}</p><a id="source-link" target="_blank" rel="noopener noreferrer">${copy('场馆官网 ↗')}</a></details>`)
  .replace(/<section class="product-guide"[\s\S]*?<\/section>/,`<section class="product-guide" aria-labelledby="guide-title"><h2 id="guide-title">${copy('如何查看座位视角？')}</h2><p>${copy('选择地区、场馆和演唱会，输入区、排、座，或直接点击地图。切换 2D / 3D，进入观众视角；手机取景可调节 1–10 倍画面。')}</p><p>${copy('模型与编号仅供大致参考，不保证对应门票位置；画面不是现场照片。')}</p></section>`)
  .replace(/data-i18n="explorer.legendSource">[^<]*/g,`>${copy('参考位置')}`)
  .replace(/data-i18n="explorer.samples">[^<]*/g,`>${copy('看看其他位置')}`)
  .replace(/data-i18n="explorer.ticketHint">[^<]*/g,`>${copy('示例：101 区 · A 排 · 78 座。')}`)
  .replace(/data-i18n="explorer.distance">[^<]*/g,`>${copy('至示意舞台 · 仅供参考')}`)
  .replace('<!--SITE-HEADER-->',publicHeader(locale,publicMode?'/explore':'/concert-views',{user,explorer:true}))
  .replace('<!--SITE-FOOTER-->',publicFooter(locale))
  .replace('</head>',`<meta name="stagepeek-locale" content="${locale}"><meta name="stagepeek-viewer-mode" content="${publicMode?'public':'research'}"></head>`);
 return publicMode?journeyPage(page,locale):page;
}

function journeyPage(html,locale){
 const copy=source=>interfaceCopy(source,[],locale);
 const picker=html.match(/<div class="venue-picker">[\s\S]*?<\/div>/)[0];
 const events=html.match(/<section class="events-card">[\s\S]*?<\/section>/)[0];
 const layout=html.match(/<section class="layout-card">[\s\S]*?<\/section>\s*(?=<\/aside>)/)[0].trimEnd();
 const layoutPicker=layout.match(/<label class="small">[\s\S]*?<\/label>/)[0];
 return html.replace(/<details class="preview-help">[\s\S]*?<\/details>/,'').replace('<body class="theme-arena"','<body data-journey="true" class="theme-arena"')
  .replace(picker,'').replace(events,'').replace(layout,'')
  .replace('<section class="input-panel"',`<div class="journey-controls"><section id="journey-start" class="journey-panel" aria-labelledby="journey-start-title"><h2 id="journey-start-title">${copy('找到场馆')}</h2><p>${copy('先选场馆，再确认布局。没有门票也可以直接点选分区。')}</p>${picker}<a class="journey-demo" href="/${locale==='en'?'':locale+'/'}explore?venue=kai-tak-stadium&layout=bowl&section=101&row=A&seat=78&demo=1">${copy('先体验启德示例 ↗')}</a></section><section id="journey-context" class="journey-panel" hidden aria-labelledby="journey-context-title"><h2 id="journey-context-title" class="sr-only">${copy('确认布局')}</h2>${layoutPicker}<details class="journey-details"><summary>${copy('演出与布局详情')}</summary><div class="journey-layouts">${events}${layout.replace(layoutPicker,'')}</div></details></section><section class="input-panel"`)
  .replace('<div class="panel-heading"><div><span class="eyebrow">STEP 1–2</span>',`<div class="panel-heading"><div><span class="eyebrow">3 · ${copy('定位位置')}</span>`)
  .replace('<form id="ticket-form"',`<p class="journey-ticket-hint">${copy('有票可填写区排座；没有具体票号，可以直接点击下方地图。')}</p><form id="ticket-form"`)
  .replace('<div class="workspace">','</div><div class="workspace" hidden>')
  .replace('<section class="input-panel"','<section class="input-panel" hidden')
  .replace(/data-i18n="explorer.location">[^<]*/,`>${copy('位置预览')}`)
  .replace('<div class="location-heading">',`<p id="journey-demo-note" class="journey-demo-note" hidden>${copy('示例体验 · 这不是你的票号')}</p><div class="location-heading">`)
  .replace('<p id="save-feedback"',`<a id="journey-account" class="journey-account" href="/${locale==='en'?'':locale+'/'}account">${copy('我的收藏 ↗')}</a><p id="save-feedback"`)
  .replace(copy('选择地区、场馆和演唱会，输入区、排、座，或直接点击地图。切换 2D / 3D，进入观众视角；手机取景可调节 1–10 倍画面。'),copy('先选场馆并确认参考布局，再输入票号或点选分区。可以切换 2D / 3D、观众视角和手机取景。'))
  .replace('value="122"','value=""').replace('value="14"','value=""').replace('value="679"','value=""');
}
