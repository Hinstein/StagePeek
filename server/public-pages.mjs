import {VENUE_GUIDES,REVIEWED_AT} from './public-content.mjs';

export const SITE_ORIGIN='https://stagepeek.live';
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=value=>Number(value).toLocaleString('en-US');
const link=(path,label,attrs='')=>`<a href="${escape(path)}"${attrs}>${escape(label)}</a>`;
const structured=value=>`<script type="application/ld+json">${JSON.stringify(value).replaceAll('<','\\u003c')}</script>`;
export const publicNavigation=()=>`<nav class="public-links" aria-label="网站说明">${[['/venues/','场馆目录'],['/about','关于 StagePeek'],['/methodology','数据方法'],['/plans','计划说明'],['/contact','联系与纠错'],['/privacy','隐私'],['/terms','使用条款']].map(([path,label])=>link(path,label)).join('')}</nav>`;
export const homeSchema=()=>structured({'@context':'https://schema.org','@graph':[
  {'@type':'WebSite','@id':SITE_ORIGIN+'/#website',name:'StagePeek',url:SITE_ORIGIN+'/',inLanguage:'zh-CN'},
  {'@type':'Organization','@id':SITE_ORIGIN+'/#organization',name:'StagePeek',url:SITE_ORIGIN+'/',logo:SITE_ORIGIN+'/brand/stagepeek-mark.svg'}
]});
const pages=[
  {path:'/',title:'StagePeek · 演唱会座位视角',description:'查看演唱会分区、座位来源与几何视角模拟。',indexable:true,type:'home'},
  {path:'/venues/',title:'场馆目录 · 座位表与视角指南',description:'从启德、红馆和台北小巨蛋开始，了解真实布局覆盖、来源与限制，再打开对应场馆工具。',indexable:true,type:'directory'},
  {path:'/about',title:'关于 StagePeek',description:'StagePeek 的用途、项目身份和能力边界。',indexable:true,type:'about'},
  {path:'/methodology',title:'座位数据方法与核验说明',description:'了解来源记录、几何估算、布局版本、核验日期和纠错流程的区别。',indexable:true,type:'methodology'},
  {path:'/plans',title:'免费与 Pro 月订阅计划',description:'比较免费场馆、Pro 访问范围、保存上限与实际月订阅状态。',indexable:true,type:'plans'},
  {path:'/contact',title:'联系与数据纠错',description:'通过 StagePeek 项目入口提交场馆、分区或布局问题。',indexable:true,type:'contact'},
  {path:'/privacy',title:'隐私与数据使用说明',description:'账号、已存位置、账单与可选匿名统计的数据使用说明。',indexable:false,type:'privacy'},
  {path:'/terms',title:'StagePeek 使用条款',description:'座位模拟的参考范围、订阅管理与来源使用说明。',indexable:false,type:'terms'}
];

export function createPublicSite(venues){
  // A guide is publishable only with actual source/version metadata and one
  // unambiguous, coordinate-backed example. No raw seat asset is serialized here.
  function guides(){return VENUE_GUIDES.flatMap(editorial=>{
    try{
    const v=venues.get(editorial.id);
    if(!v?.seatLayout?.assetSha256||v.seatLayout.assetSha256!==editorial.reviewedAssetSha256||!v?.accuracy?.sourceDate||!v.seatLayouts?.length||!v.sourceSeats?.length)return [];
    const candidate=v.sourceSeats.find(s=>s.section&&s.row&&s.seat&&Array.isArray(s.position));
    if(!candidate||venues.resolve(v.id,{...candidate,layout:v.seatLayout.id}).status!=='matched')return [];
    return [{...editorial,path:'/venues/'+v.id,type:'venue',indexable:true,description:editorial.intro,
      city:v.city,layoutId:v.seatLayout.id,layouts:v.seatLayouts,sourceDate:v.accuracy.sourceDate,
      version:v.seatLayout.assetSha256.slice(0,12),sectionCount:v.sections.length,seatCount:v.sourceSeats.length,
      sample:{section:candidate.section,row:candidate.row,seat:candidate.seat},sectionLabels:v.sections.slice(0,8).map(s=>s.id)}];
    }catch{return []; /* A missing source withdraws this guide, never unrelated routes. */}
  });}
  const registry=()=>[...pages,...guides()];
  const get=path=>pages.find(p=>p.path===path)||(path.startsWith('/venues/')?guides().find(p=>p.path===path):undefined);
  const brandImages=new Set(['/brand/stagepeek-social.png','/brand/stagepeek-social.svg','/brand/stagepeek-mark.svg','/brand/stagepeek-logo-dark.svg','/brand/stagepeek-logo-light.svg']);
  return {
    registry,get,
    isIndexable(path){return brandImages.has(path)||!!get(path)?.indexable||(path.startsWith('/previews/')&&guides().some(g=>path==='/previews/'+g.id+'.svg'));},
    redirect(path){if(path==='/venues')return '/venues/';if(path.endsWith('/')&&path!=='/'&&get(path.slice(0,-1)))return path.slice(0,-1);return null;},
    sitemap(){return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${registry().filter(p=>p.indexable).map(p=>`  <url><loc>${SITE_ORIGIN+escape(p.path)}</loc>${p.type==='venue'?`<lastmod>${REVIEWED_AT}</lastmod>`:''}</url>`).join('\n')}\n</urlset>\n`;},
    homeEnhancements(){const list=guides();return `<section class="product-guide venue-entry" aria-labelledby="venues-title"><h2 id="venues-title">从场馆座位表，找到对应的工具。</h2><p>先看布局版本、覆盖范围与能力限制，再核对门票。当前已整理 ${list.length} 个场馆指南。</p><ul>${list.map(g=>`<li>${link(g.path,g.title)}</li>`).join('')}</ul>${link('/venues/','浏览场馆目录 →')}</section>`;},
    render(path,context={}){const page=get(path);if(!page||page.type==='home')return null;
      const crumbs=[{name:'首页',path:'/'}];if(page.type==='venue')crumbs.push({name:'场馆目录',path:'/venues/'});crumbs.push({name:page.type==='venue'?page.name:page.title,path:page.path});
      const schema={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,name:c.name,item:SITE_ORIGIN+c.path}))};
      return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(page.title)} | StagePeek</title><meta name="description" content="${escape(page.description)}"><link rel="canonical" href="${SITE_ORIGIN+page.path}">${page.indexable?'':'<meta name="robots" content="noindex,follow">'}<meta property="og:type" content="website"><meta property="og:site_name" content="StagePeek"><meta property="og:url" content="${SITE_ORIGIN+page.path}"><meta property="og:title" content="${escape(page.title)}"><meta property="og:description" content="${escape(page.description)}"><meta property="og:image" content="${SITE_ORIGIN}/brand/stagepeek-social.png"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/brand/stagepeek-mark.svg" type="image/svg+xml"><link rel="stylesheet" href="/public-pages.css">${structured(schema)}</head><body><a class="skip" href="#content">跳到内容</a><header><a class="brand" href="/"><img src="/brand/stagepeek-logo-dark.svg" width="166" height="32" alt="StagePeek"></a><nav aria-label="主导航">${link('/venues/','场馆目录')}${link('/methodology','数据方法')}${link('/explore','打开工具',' data-tool-entry')}</nav></header><main id="content"><nav class="breadcrumbs" aria-label="面包屑">${crumbs.map((c,i)=>i===crumbs.length-1?`<span aria-current="page">${escape(c.name)}</span>`:link(c.path,c.name)).join('<span aria-hidden="true"> / </span>')}</nav><p class="eyebrow">STAGEPEEK · SEATING GUIDE</p><h1>${escape(page.type==='directory'?'场馆目录':page.title)}</h1>${body(page,guides(),context)}</main><footer><p>StagePeek · 演唱会座位探索与几何视角模拟</p>${publicNavigation()}<p>独立参考工具。非售票平台，不代表场馆或演出主办方。</p></footer></body></html>`;
    }
  };
}

function toolUrl(g,example=false,layout=g.layoutId){return '/?'+new URLSearchParams({venue:g.id,layout,...(example?g.sample:{})}).toString();}
function body(page,guides,context){
  if(page.type==='directory')return `<p class="lead">目录先展示已整理来源、版本和能力说明的场馆。工具中还有其他场馆，数据覆盖各不相同。</p><div class="guide-grid">${guides.map(g=>`<article><p class="eyebrow">${escape(g.city)}</p><h2>${link(g.path,g.name)}</h2><p>${escape(g.aliases)}</p><p>${escape(g.intro)}</p><p>默认版本 ${escape(g.layoutId)} · ${number(g.sectionCount)} 个分区 · ${number(g.seatCount)} 条来源记录</p>${link(g.path,'查看覆盖、来源与布局 →')}</article>`).join('')}</div><section><h2>如何选择场馆与版本</h2><ol><li>按票面场馆名称进入指南，核对别名。</li><li>区分固定看台与临时内场，再确认舞台版本。</li><li>打开工具核对区、排、座；未匹配的记录保持未核实。</li></ol><p>记录数不等于官方容量或当场完整库存。${link('/methodology','了解数据方法')}。</p></section>`;
  if(page.type==='venue'){
    const g=page;
    return `<p class="aliases">${escape(g.aliases)} · ${escape(g.city)}</p><p class="lead">${escape(g.intro)}</p><a class="button" href="${escape(toolUrl(g,true))}" data-tool-entry>打开${escape(g.name)}座位工具 →</a><p class="small">示例：${escape(g.sample.section)} 区 · ${escape(g.sample.row)} 排 · ${escape(g.sample.seat)} 座 · ${escape(g.layoutId)} 版本。${link(toolUrl(g),'只选场馆，填写我的票号',' data-tool-entry')}。访问范围以当前账号权限为准。</p><figure><img class="venue-preview" src="/previews/${g.id}.svg" width="960" height="540" alt="${escape(g.name)}${g.diagram==='bowl'?'固定看台与内场区别':g.diagram==='center'?'四面台与正面舞台阅读':'色区标签与舞台版本阅读'}示意，非按比例座位表"><figcaption>StagePeek 原创布局阅读示意，非实景、非按比例座位表，不是官方座位图；实际几何与排座请在工具中核对。</figcaption></figure><section><h2>当前覆盖与布局版本</h2><p>${escape(g.reading)}</p><div class="table-scroll"><table><caption>已导入来源版本（记录数不是容量）</caption><thead><tr><th scope="col">版本</th><th scope="col">分区数</th><th scope="col">坐标记录数</th><th scope="col">工具</th></tr></thead><tbody>${g.layouts.map(l=>`<tr><th scope="row">${escape(l.label)} · ${escape(l.id)}</th><td>${number(l.sectionCount)}</td><td>${number(l.count)}</td><td>${link(toolUrl(g,false,l.id),'打开此版本',' data-tool-entry')}</td></tr>`).join('')}</tbody></table></div><p>默认布局：${escape(g.layoutId)}。分区示例：${g.sectionLabels.map(escape).join('、')}。所有坐标均未独立实测校准，也不代表当场完整库存。</p></section><section><h2>视角与舞台：能参考到什么程度？</h2><p>${escape(g.limitation)}</p><p>3D 是几何模拟，不是现场照片。栏杆、音响塔、屏幕、观众遮挡与相机成像未被完整建模；缺少场次舞台或米制校准时不能提供真实距离。</p></section><section><h2>来源、版本与核验日期</h2><ul>${g.sources.map(([label,url])=>`<li>${link(url,label,' target="_blank" rel="noopener noreferrer"')}</li>`).join('')}</ul><p>场馆官方资料用于核对场馆与布局参考；工具逐座记录来自已保留的第三方来源资产，不是场馆直接授权提供的数据库。${link('/methodology','查看记录来源与核验方法')}。</p><dl><dt>记录来源标记</dt><dd>${escape(g.sourceDate)}</dd><dt>当前默认资产版本指纹</dt><dd>${escape(g.version)}</dd><dt>页面内容核验</dt><dd><time datetime="${REVIEWED_AT}">${REVIEWED_AT}</time> · 本地导入版本及功能核对，非现场实测，也非当场售票图核验</dd></dl><p>来源可访问不等于获得图片、模型或数据库再分发授权。本页仅展示原创说明与阅读示意，不复制第三方座位图或提供原始资产下载。</p></section><section><h2>${escape(g.question)}</h2><p>${escape(g.answer)}</p><p>发现票号、版本或来源有问题？${link('/contact','提交纠错')}，请注明场馆、布局版本与公开来源。</p></section><section><h2>继续了解</h2><ul>${guides.filter(other=>other.id!==g.id).map(other=>`<li>${link(other.path,other.title)}</li>`).join('')}</ul>${link('/venues/','返回场馆目录')}</section>`;
  }
  const sections={
    about:`<p class="lead">StagePeek 帮助观众理解演唱会场馆分区、核对已有票号，并探索几何模型中的视角。</p><section><h2>先理解位置，再看模拟</h2><p>2D 用于阅读分区和来源坐标，3D 用于旋转、缩放与模拟观众视角。两者都受到数据版本和校准状态限制。我们不出售门票，也不代表场馆、艺人或主办方。</p><p>本项目公开代码仓库：${link('https://github.com/Hinstein/StagePeek','Hinstein / StagePeek')}。SeatPeep / SeatScope 是历史名称，部分技术文件可能保留旧称。</p></section><section><h2>为什么逐馆说明</h2><p>有的场馆只有分区，有的保留了排座记录；有坐标仍可能缺少舞台或实测尺度。我们逐馆列明已知与未知，不以模型推断“绝无遮挡”或“最佳座位”。</p><p>${link('/venues/','选择已有指南的场馆')} · ${link('/methodology','了解数据方法')} · ${link('/contact','联系与纠错')}</p></section>`,
    methodology:`<p class="lead">匹配来源记录、生成几何模型、核实当场舞台，是三件不同的事。</p><section><h2>数据从哪里来</h2><p>场馆官方资料用于参考分区与布局；部分逐座记录来自已保留的第三方布局资产。当前三个指南的逐座来源均为 shijiao-static-cn.oss-cn-beijing.aliyuncs.com 上的版本资产。场馆页展示布局、记录数和版本指纹；工具的数据来源区可查看对应来源链接。</p><p>公开可访问不等于获得再分发许可。指南的插图是 StagePeek 原创阅读示意，不是第三方图纸，也不是现场照片。</p></section><section><h2>如何核对与更新</h2><ol><li>保留来源、捕获日期及资产指纹，区分同馆的不同舞台版本。</li><li>检查分区、排、座标签及坐标是否能唯一匹配。重复票号保持歧义，不自动认定位置。</li><li>逐页核对当前导入版本与工具入口。页面核验日期不等于来源发布日期、现场测量日或演出核验日。</li><li>收到纠错后先核查公开依据，再更新相应版本和说明；没有依据时保留未知。</li></ol><p>本批指南内容核验日期：${REVIEWED_AT}；记录捕获标记为 2026-10-24。后续只在实质更新时修改页面日期与 sitemap lastmod。</p></section><section><h2>如何阅读定位状态</h2><dl><dt>来源票号匹配</dt><dd>相应版本中存在该区、排、座记录；还需看是否有唯一来源坐标。</dd><dt>未核实或存在歧义</dt><dd>不生成虚假的确定位置；分区中心或示意椅子不代表真实座号。</dd><dt>几何模拟与距离</dt><dd>看台形状、椅子、屋顶和手机倍率可能是示意。未独立实测校准，缺少场次舞台坐标时不提供真实舞台距离。</dd></dl></section><section><h2>场次与版权边界</h2><p>通用或历史布局不能替代当前演出官方售票图。临时内场、设备和封区按场次变化。来源权利人或用户可通过${link('/contact','纠错入口')}提交出处及问题；请勿上传不具备分享依据的完整图纸或数据库。</p></section>`,
    contact:`<p class="lead">场馆数据、布局版本、访问问题或来源使用问题，都可以从项目入口反馈。</p><section><h2>提交公开数据纠错</h2><p>${link('https://github.com/Hinstein/StagePeek/issues/new','在 GitHub 新建 StagePeek 问题 →')}（需要 GitHub 账号）。请写明场馆名、布局版本、问题描述和可公开的官方来源链接。</p><p>GitHub 问题对公众可见。请勿提交完整门票、二维码、邮箱、验证码、支付信息或私人已存位置。提交截图前遮挡个人信息。</p></section><section><h2>账号、订阅与来源权利问题</h2><p>可先用${link('/?panel=plans','工具内的订阅与账单入口')}查看订阅状态和取消续订。需要进一步联系时，请在项目入口仅说明问题类别，请求后续沟通方式；不要公开账号或交易资料。当前没有在本站公布独立客服邮箱或即时响应承诺。</p></section>`,
    privacy:`<p class="lead">以下说明对应当前 StagePeek 功能。更新日期：${REVIEWED_AT}。</p><section><h2>账号与保存位置</h2><p>登录通过共享 Supabase Auth 处理邮箱、密码和验证码；密码不保存在 StagePeek 业务表中，会话使用 HttpOnly Cookie。账号流程的完整双语政策与版本见${link('/privacy.html','账号隐私政策')}。注册后主动保存的位置包括场馆、布局、区排座、可选演出和标签，用于在账号中恢复位置；可在“已存位置”删除。</p><p>普通选座输入用于请求来源匹配。可选分析不会发送票号、邮箱、token、保存位置或完整查询字符串。</p></section><section><h2>可选匿名统计</h2><p>只有生产环境已配置统计且满足匿名公共页面规则时，才启用 analytics.auturance.com 上的 Umami。记录受控公共路径、工具入口点击与聚合功能动作；不发送查询参数、页面片段或来源网址。带认证或票号参数的页面不启用，登录后停止动作统计。浏览器 Do Not Track 或 Global Privacy Control 启用时不加载。</p></section><section><h2>账单与第三方服务</h2><p>启用付费时由 Stripe 处理结算与账单中心；本站保存订阅状态与账单关联标识，用于授予访问权限。请勿在公开纠错入口提供支付资料。点击外部场馆来源或 GitHub 后适用其各自的数据政策。</p></section><section><h2>数据请求与联系</h2><p>位置可自行删除，订阅可在账单中心管理。账号或其他数据请求请从${link('/contact','联系入口')}仅说明请求类别，先取得后续沟通方式，勿公开个人信息。本说明不承诺尚未建立的自动删除期限或跨服务删除机制。</p></section>`,
    terms:`<p class="lead">使用 StagePeek 前，请理解模拟范围与数据限制。更新日期：${REVIEWED_AT}。</p><section><h2>参考用途</h2><p>本工具用于理解分区和来源记录，不能保证现场视线、实测距离、实际库存或门票有效性。购票、入场和视线不良标识以主办方与票务平台公布的当场信息为准。</p></section><section><h2>免费与订阅</h2><p>免费范围与 Pro 权限由当前配置决定，${link('/plans','计划说明')}展示访问及保存上限。仅当正式结算开放且确认价格时才发起付费；实际金额、税费与续订条件以 Stripe 结算确认页面为准。可在工具内账单中心取消下个周期续订，当前周期状态以账单为准。</p></section><section><h2>来源与合理使用</h2><p>来源作品与数据的权利归相应权利人。不得将可访问的来源理解为商业再分发授权；本站也不宣称获得场馆官方合作或背书。发现错误或来源权利问题，请${link('/contact','联系项目')}，并提供可公开核对的依据。</p></section><section><h2>账号与服务变更</h2><p>账号安全、共享身份影响及禁止滥用等规则见${link('/terms.html','完整账号服务条款')}；注册时的条款确认继续使用该版本。</p><p>场馆覆盖、来源与功能会随核验结果调整。订阅不会把缺失数据变成完整库存，也不会提升尚未完成的实测精度。隐私处理请参阅${link('/privacy','隐私说明')}。</p></section>`
  };
  if(page.type==='plans')return plans(context);
  return sections[page.type]||'';
}
function plans({access,price,billingReady=false}={}){
  const freeCount=access?.freeVenueIds?.length;
  const cost=price?new Intl.NumberFormat('zh-CN',{style:'currency',currency:price.currency}).format(price.amount/100)+' / 每月':billingReady?'暂时无法读取正式价格，请稍后在工具内重试。':'月订阅暂未开放。';
  return `<p class="lead">按访问范围选择计划。各馆来源覆盖与校准状态相同，订阅不代表更高的测量精度。</p><div class="guide-grid"><article><h2>免费体验</h2><p class="price">免费</p><p>${freeCount===undefined?'精选场馆':`当前 ${freeCount} 个免费场馆`}，支持已有的 2D / 3D 分区和来源位置；注册后可保存 8 个位置。</p></article><article><h2>StagePeek Pro</h2><p class="price">${escape(cost)}</p><p>解锁当前工具目录内的场馆访问，可保存 100 个位置。演出、布局及票号覆盖仍逐馆不同。</p></article></div><section><h2>价格与续订</h2><p>这里的正式价格读取与结算相同的月订阅配置，不使用本地模拟价格。最终应付金额和税费以结算页面为准。可从账单中心取消下个周期续订。</p>${link('/?panel=plans','打开工具查看当前计划',' class="button" data-tool-entry')}<p>${link('/terms','使用条款')} · ${link('/privacy','隐私说明')} · ${link('/contact','账单问题联系入口')}</p></section>`;
}
