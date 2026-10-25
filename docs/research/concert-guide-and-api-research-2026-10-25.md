# 演唱会座位／入场攻略产品与公开接口研究

研究日期：2026-10-25。范围：官网／公开页面功能与接口文档核查；未申请 API key、未登录实测 API，也未完整验收 3D 视觉精度；未修改业务代码。公开链接不等于自动取得商业使用或再分发许可。

本文以平台官方文档、产品运营者自述和场馆／艺人官方公告为依据。“产品一手来源”只证明该产品公开呈现的能力，不代表它得到艺人、场馆或票务商背书。Reddit 仅作为社区需求与内容组织方式的证据。

## 对 SeatPeep 的主要结论

1. **值得做的是演出攻略页面，而不只是一个通用 3D 场馆。** 页面应把“这一场的舞台和开放分区”“我的座位视角”“入场／交通／安检”“社区实拍”连接起来。下文的成熟产品已经分别验证这些形态；这里是产品设计推论，不能据此断言其流量或商业成功。
2. **事件目录、建筑室内图、逐座库存是不同的数据。** Ticketmaster Discovery 适合事件／场馆元数据及有条件返回的静态座位图；HERE／Mapbox／OSM 可支持建筑和周边设施，但都不承诺演出逐座布局。逐座库存和交易应走 Ticketmaster 等票务方商业合作。
3. **BTS 3D fan guide 不应统称为“官方 3D 指南”。** 已核实的 Seat Seven 与粉丝模拟站明确独立或非官方；官方 UTEP／Weverse 指南则能作为入场、停车、设施、等待时间等事实来源。
4. **优先级建议：** 官方场馆／主办方攻略与 Ticketmaster Discovery → 自有演出布局 → 获许可的照片与社区链接 → 有明确覆盖和授权的室内地图／商业票务合作。Bandsintown、Songkick、Reddit 都有实质准入条件，不宜先假设能免费聚合。

## 一、产品形态与可借鉴部分

| 产品／一手来源 | 实际产品形态 | 对 SeatPeep 的启发与边界 |
|---|---|---|
| [Seat Seven About](https://seatseven.io/about/) | 按场馆／活动组织指南，包含交互 3D 座位图、360° 视角、分区说明和实用活动信息；其视角是场馆重建，舞台布置、活动配置和排内位置会改变实际视野。 | “座位 → 分区 → 场馆 → 演出”的信息路径比先选通用场馆更符合用户任务。该站明确独立、无艺人／场馆／售票方背书；免费并有广告／affiliate，不代表其模型可被复制。 |
| [Seat Seven BTS ARIRANG tour guide](https://seatseven.io/music/arirang-2026/) | 巡演级场馆目录，已上线的场馆可点分区看全景视角，未完成的标 coming soon。页面明确它是 Seat Seven 的独立指南，非 BTS／HYBE／Live Nation 官方网站，且不卖票。 | 巡演聚合页 → 城市／场馆／场次 → 座位预览，是可复用导航形态；不要把第三方托管域名或全景功能当作官方授权证据。 |
| [BTS ARIRANG Kuala Lumpur 3D](https://3d-bts-arirang-kl.pages.dev/) | 粉丝制作：票档／分区／排／座定位，俯视与眼平视角，坐姿／站姿、观众、视野遮挡估算；页面自述不是官方站，排座位置是估计值。 | 视角条件（身高、站坐、观众、镜头）与误差说明应直接出现在模拟旁。其互动和内容可作为产品参考；不能把估计排座数当成官方数据。 |
| [Arirang Perú](https://arirangperu.com/)、[ROAD TO 7](https://www.roadto7.app/) | 单站演出社区入口，把 San Marcos 3D 模拟、按票面找座、照片贡献、创作者联系和粉丝项目放在一起；模拟站还提供画质档位。 | 单场活动可形成分享和纠错闭环；移动端宜提供低负载模式。作者／fanclub 的一手页面不等于主办方的入场或座位认证。 |
| [SeatView · Real Seat Views](https://seat.genchi.top/en) | 搜场馆，在座位图 marker 上看真实照片；用户把自摄照片放回图上。要求遮盖人脸／可识别信息，演出中摄影须符合官方规则，内容标为 CC BY-NC 4.0。 | 真实照片应独立于模拟，带拍摄位置／活动／日期。**NC 不可直接当商业站可自由复用的素材许可**；更合适的是建立自己的上传授权流程，或取得作者额外许可。 |
| [SeatPOV Malaysia](https://brightknight0110.github.io/seatpov-malaysia/) | 按 CAT／区／排／座找视角，显示舞台距离、眼高和屏幕视野；可上传主办方座位图，设置舞台／延伸台／内场与关闭分区，分享布局代码。 | “固定场馆 + 当场布局”分层非常清楚。页面声明模型来自公开数字、非官方 CAD，区位／排数／座数有估算，布局只存当前浏览器；不应把模拟称为逐座测绘。 |
| [SeatGeek 官方 Seat View 说明](https://support.seatgeek.com/hc/en-us/articles/360007200934-Where-does-SeatGeek-get-its-venue-maps) | 自制 venue maps，把 section 视角图片嵌在地图上。官方说明卖家逐座数据不够可靠，因此搜索和地图只提供到排级。 | 成熟售票产品也会限定精度。可先给可信的分区／排视角，不必虚构完整座号。其自制图和图片也不等于 Platform API 开放素材。 |
| [UTEP 官方 BTS Fan Guide](https://www.utep.edu/btsfanguide/) | 演出专属指南，整合入场时间、停车、安保、体育场图和粉丝活动。 | 官方活动攻略可作为事件页的主干；字段应有来源与最后复核时间，避免把一次演出的规则外推到所有场次。 |
| [Weverse 官方 MAP & WAIT TIMES 公告](https://weverse.io/bts/notice/9249) | BTS Busan 活动曾提供场馆／LIVEPLAY 地图、展位／设施位置和等待时间，在 Weverse 手机 App 中使用。 | 入场前后可用“地图 + 设施 + 排队时间”，但这是一场活动的官方功能案例，不是开放的通用实时排队 API。 |
| [r/bangtan tour megathread](https://www.reddit.com/r/bangtan/comments/1tkbrpt/202627_bts_arirang_tour_megathread_part_4/)、[SoFi seat review thread](https://www.reddit.com/r/bangtan/comments/r864nu) | **非官方社区证据**：把座位图、FAQ、应援、行程、现场反馈／座位体验集中在一串持续更新的讨论中。 | 借鉴“主帖事实清单 + 分类 FAQ + 座位报告”的组织方式；评论只能反映个人经验，不能证明当前舞台、入场政策或座位可售状态，也不授予搬运权。 |

官方布局也会变动。例如 [BIGHIT／Weverse Goyang 公告](https://weverse.io/bts/notice/34591)记录了 FOH／production 信息及部分遮挡席开放情况的更新。因此来源应绑定 `eventId + layoutVersion + retrievedAt`，而不是只绑定 venue。

## 二、接口能力与接入判断

### 快速矩阵

| 数据源 | 能拿到什么 | 认证／准入 | 关键限制 | 建议用途 |
|---|---|---|---|---|
| Ticketmaster Discovery | 事件、艺人、场馆、分类、官方购票 URL；事件可含 `seatmap.staticUrl` | 注册 API key | 静态图不等于逐座几何，字段可能缺失；受配额和内容条款约束 | 首选事件／场馆目录与座位图引用 |
| Ticketmaster Partner／Availability | offer、价格、库存、section／row／seat；reserve／purchase | 已有官方分销关系、特定账户 enablement | 非公开；合同、展示限制、速率与认证要求 | 商业合作后再接逐座库存／交易 |
| SeatGeek Platform | events／performers／venues、位置及事件聚合统计 | `client_id`，可加 `client_secret` | 官方不提供 individual ticket listings；不是 seatmap API | 北美目录／链接补充 |
| Bandsintown | 艺人及该艺人的活动、票链、lineup、场馆地点 | 艺人／获授权团队；发放 key／`app_id`，默认单艺人 | 其他用途及商业用途须批准 | 有授权艺人活动同步；先询问聚合许可 |
| Songkick | 事件、艺人、场馆、metro、历史演出／用户 tracking | 申请 key + partnership／license fee | 当前不批学生、教育和 hobbyist 请求 | 有预算后洽谈目录授权 |
| HERE Indoor Map（旧称 Venue Maps） | 建筑／多层几何、POI；按权限加载和搜索室内图 | HERE key／OAuth、catalog HRN、目标地图访问权 | 没有承诺任意场馆覆盖或演出逐座数据 | 授权场馆设施、楼层、通道 |
| Mapbox indoor | 有限内置场馆楼层；或渲染自有室内向量数据 | Mapbox access token／账户 | 实验功能、覆盖有限；多数场馆需自带数据 | 地图渲染与自有 floor plan |
| OSM Overpass | 按区域／标签查询已有 nodes／ways／relations 与几何 | 公共实例通常无 key | 社区完整性不保证；共享资源、ODbL | 周边交通、入口／设施候选和建筑轮廓 |
| Reddit Data API | 帖子、评论、搜索与 listing | 先申请并获明确批准，再按要求使用 OAuth／User-Agent；商业使用需书面批准 | 商业许可、限速、删帖同步；不能无授权抓取替代 | 获准后的社区链接／经验索引 |
| Wikimedia Commons Action API | 图片搜索、文件 URL／缩略图、作者／许可元数据 | 公开读接口；鉴权可得较高额度 | 每张文件许可不同，需署名／许可／变更标记 | 场馆外观和环境参考图 |

表中结论分别来自下列文档；“建议用途”是本项目的接入推论。

### 1. Ticketmaster Discovery

- **能力／接口：** `GET https://app.ticketmaster.com/discovery/v2/events.json`、`/events/{id}.json`、`/venues.json`、`/venues/{id}.json`；支持事件／艺人／场馆查询。事件模型的 `seatmap.staticUrl` 只是静态座位图 URL，没有公开承诺排座坐标、3D 模型或实时可售状态。[Discovery v2 官方文档](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/)
- **认证／配额：** query 参数 `apikey`。官方 FAQ 给出的默认额度为 5,000 次／天、5 次／秒；深分页有上限，应以账号授权和响应 rate-limit headers 为准。[官方 FAQ](https://developer.ticketmaster.com/support/faq/)
- **授权风险：** API 使用权和图片／事件内容权利不是一回事。缓存、移除、归属与应用用途受 General Terms 管理；长期镜像座位图、对外转售完整数据或复制核心购票体验，不能仅凭 key 推定获准。[API General Terms](https://developer.ticketmaster.com/support/terms-of-use/)
- **接入判断：** 可先保存 provider ID、官方 URL、时间／地点与图 URL，并按当前许可展示；精确舞台几何和实拍许可另行管理。静态图描摹为几何也不自动消除原始内容的授权问题。

### 2. Ticketmaster Partner／Availability

- **能力／认证：** Partner 可查询票与事件、预留和购买；官方明确它不是开放 API，只面向已有官方分销关系的企业。Ticketmaster 发放 key，通过 `apikey` 或 `x-api-key`，全程 HTTPS。[Partner 官方文档](https://developer.ticketmaster.com/products-and-docs/apis/partner/)
- **库存：** `/partners/v1/events/{event_id}/availability` 可含 offer／价格和未售 section、row、seats；明确 Channel Partners only、需 enablement。官方列出 3,600 requests／hour／key 的 quota，同时要求按双方约定使用；不能作为活跃下单流程中的实时同步源。[Availability 官方文档](https://developer.ticketmaster.com/products-and-docs/apis/partner/availability/)
- **授权风险：** 返回的 `locRowSeatRestrict` 等字段可能要求隐藏排座；获接口访问并不代表所有事件／库存都可展示或交易。必须按商业协议、认证范围和响应限制执行。公开售票网站前端接口不能视为 Partner 许可。

### 3. SeatGeek Platform API

- **能力／认证：** base `https://api.seatgeek.com/2`，公开文档列出 `/events`、`/performers`、`/venues` 及详情接口，支持位置／日期／文本过滤和分页。`client_id` 必需，`client_secret` 可选，可通过 query 或 Basic Auth。[SeatGeek 官方维护文档](https://seatgeek.github.io/)
- **限制：** FAQ 明确不计划通过该 API 暴露 individual ticket listings，应将用户引导至资源 `url`。不能把它当作逐座库存、座位几何或 Seat View 图片 API。该文档较旧，实际新 key 发放、字段和额度必须在注册／合同阶段确认，不能以旧教程保证可用性。
- **授权风险：** 当前 Platform Terms 允许 SeatGeek 设定调用／流量限制、限制或终止访问；商业伙伴还可能适用 Partner Agreement。技术文档没有给出普遍适用的固定限速保证。[Platform Terms](https://seatgeek.com/api-terms)

### 4. Bandsintown API

- **能力：** 只读艺人资料及艺人 events，含日期时间、场馆名称／位置、票链、lineup、描述、event URL，可按过去／将来／日期范围筛选；示例为 `GET https://rest.bandsintown.com/artists/{name}/events/?app_id=...`。[当前官方 API 文档](https://help.artists.bandsintown.com/en/articles/9186477-api-documentation)
- **准入：** 当前官方说明仅 artists 与获授权的代表团队可访问；key 默认绑定单一艺人，其他情况需 Bandsintown 批准。不能把任意字符串 `app_id` 或技术上返回数据当许可。[官方 access 说明](https://help.artists.bandsintown.com/en/articles/7053475-what-is-the-bandsintown-api)
- **授权／限制：** 条款限制未批准商业用途、非官方抓取、内容聚合与缓存，要求来源归属、票链和数据更新／移除；公开资料未给出可据以承诺的统一配额。SeatPeep 如做跨艺人目录，应先获得明确书面同意。[Data Applications Terms](https://corp.bandsintown.com/data-applications-terms)

### 5. Songkick API

- **能力：** upcoming events 按艺人／日期／场馆／地点查询，另有艺人／场馆／metro 搜索、event／venue detail、用户 events／trackings、历史 gigography。[官方开发者入口](https://www.songkick.com/developer/)
- **认证：** 申请成功后获得 key，每次请求加 `apikey`；例如 `https://api.songkick.com/api/3.0/artists/{id}/gigography.json?apikey=...`。[Getting started](https://www.songkick.com/developer/getting-started)
- **准入／风险：** 当前开发者页明确使用需 partnership agreement 和 license fee，且当前不批准 student／educational／hobbyist 申请。不能沿用旧“免费开放 API”的印象；缓存、再分发、归属及调用额度应在许可中确认，没有 key 和合同前不承诺它可供 MVP 使用。

### 6. HERE Venue Maps／HERE Indoor Map

- **现行能力：** 多层建筑 geometry、POI、地图列表／加载、楼层切换与设施搜索。当前 JS 文档要求凭证有权访问目标 indoor map，且需相应 catalog HRN；无 HRN 用有效 OAuth token，有 HRN 时仍需 Platform API key 或 token。[现行集成文档](https://docs.here.com/maps-api-for-js/docs/indoor-maps)
- **旧名说明：** 旧 HERE Venue Maps 材料描述 PNG／JS tiles 或 full JSON，包括楼层、polygons、升降梯／自动扶梯、入口和商店／POI；这是产品历史形态，不能用旧覆盖数字保证当前某体育场可得。[HERE 官方旧指南](https://knowledge.here.com/sys_attachment.do?sys_id=adf51e941bd3951486f72f42b24bcbcd&view=true)
- **授权／限制：** 建图访问权、目录覆盖、导出／持久缓存／再展示及计费须与 HERE／地图权利人确认；默认不是全世界建筑的开放数据库。适合场馆楼层／设施导览，未承诺演唱会舞台、临时封闭区、座号或实时排队数据。

### 7. Mapbox indoor maps

- **能力：** GL JS 可启用 Standard style 的有限内置 indoor 数据，也可渲染自有向量 floor plan；内置方式需 `showIndoor: true` 和 `IndoorControl`，zoom 16 以上生效。官方称该功能 experimental，API 可能变化，内置覆盖有限；大多数建筑／场馆须用自有数据。[Indoor mapping 官方指南](https://docs.mapbox.com/mapbox-gl-js/guides/indoor/)
- **认证／限制：** Mapbox 账户及 access token；token 权限和 URL 限制应按产品设置，secret token 留在服务端。[Access tokens 官方文档](https://docs.mapbox.com/help/dive-deeper/access-tokens/)
- **授权风险：** 它主要解决渲染与地图服务，不提供任意场馆的许可 floor plan。自带室内图仍须取得数据权利；Mapbox 数据、SDK、attribution、计费和存储限制按适用条款处理。[Mapbox Terms](https://www.mapbox.com/legal/tos)

### 8. OpenStreetMap Overpass

- **能力：** 只读选择 OSM 数据，可按 bbox／附近范围及 tag 查 node／way／relation，输出已有几何；可查建筑、步行路、停车、公共交通、entrance、toilets／wheelchair 等有贡献者标注的设施。tag 和覆盖不等于主办方已复核的现实状态。[OSM API 说明](https://wiki.openstreetmap.org/wiki/APIs)、[Overpass QL](https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL)
- **认证／运行限制：** 公共实例一般无需 key，但不是无上限托管后端。官方维护者给约 10,000 requests／day、1 GB／day 的宽泛安全指导，有资源槽／冷却／429／504；面向公众的应用持续把公共实例当后端被列为不当用法，应缓存导入结果、自建或选服务商。[Overpass 维护者使用指南](https://dev.overpass-api.de/overpass-doc/en/preface/commons.html)
- **授权风险：** OSM 数据受 ODbL；公开展示要署名，派生数据库可能触发额外义务；与自有数据混合前应明确数据库边界。不要将 OSM editing API 或默认 tile server 的政策误套为 Overpass 托管保证。[OSMF attribution guidelines](https://osmfoundation.org/wiki/Attribution_Guidelines)、[OSMF API policy](https://operations.osmfoundation.org/policies/api/)

### 9. Reddit Data API

- **前置批准：** 2026-10-05 更新的 Responsible Builder Policy 明确要求 API 数据访问先申请并取得明确批准，商业用途另需明确书面批准；注册 OAuth 或符合免费调用额度均不能替代准入。[Responsible Builder Policy](https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy)
- **能力：** 帖子／评论／搜索／listing，可按 OAuth scopes 读取获准资源；listing 用 `after`／`before` 游标，不是稳定全量历史数据集。[官方 API docs](https://www.reddit.com/dev/api/)
- **认证／限速：** 必须注册 OAuth token 和可识别 User-Agent；当前官方 Data API Wiki 对 eligible free access 给 100 QPM／OAuth client ID（按时间窗平均），需读 rate-limit headers。未认证访问会被阻断，不能假设 `.json` URL 可绕过授权。[官方 Data API Wiki](https://support.reddithelp.com/hc/en-us/articles/16160319875092-Reddit-Data-API-Wiki)
- **授权／删除：** 商业用途和超额用途须按 Data API Terms 另行处理；保存内容时必须同步 Reddit 已删内容／账号信息。官方还明确禁止无授权 scraping。对 SeatPeep，先做人工复核的社区原帖链接，比全量搬运评论更可控；API key 不是照片版权许可。[Data API Terms](https://redditinc.com/policies/data-api-terms)、[官方 Don't break the site](https://support.reddithelp.com/hc/en-us/articles/360043512931-Don-t-break-the-site)

### 10. Wikimedia Commons／MediaWiki Action API

- **能力：** Commons 读接口 `https://commons.wikimedia.org/w/api.php`；可查询／搜索文件，`prop=imageinfo` + `iiprop=url|extmetadata` 获取文件／描述页 URL、缩略图及许可／作者等 metadata。`extmetadata` 是较贵的属性，应小批量按需请求。[Commons API](https://commons.wikimedia.org/wiki/Commons:API)、[Imageinfo 文档](https://www.mediawiki.org/wiki/API:Imageinfo)
- **认证／限速：** 公开读通常不需登录；所有请求需可识别 User-Agent（浏览器可用 Api-User-Agent），鉴权可获得更高限额。缓存、退避、遵守当前 API 限速，大规模导入改用 dumps。[Wikimedia API access policy](https://www.mediawiki.org/wiki/Wikimedia_APIs/Access_policy)
- **授权风险：** Commons 不是统一“免署名图库”。逐文件核对作者、来源、license 和变更要求；CC BY-SA、CC BY、public domain 等不同，且人格／商标等权利另存。建议保存 `filePageUrl + author + licenseUrl + attributionText + modified`，用作场馆外观／环境图，不推断其为当场座位实景。[Commons reuse policy](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia)

## 三、建议的数据分层与落地顺序

以下为基于上述事实的工程建议，不是任何平台授予的额外权利。

| 层 | 最可信输入 | 应保存的证据 | 不应混淆 |
|---|---|---|---|
| 场次事实 | 艺人／主办方／场馆／获许可事件 API | provider ID、官方 URL、本地时间／时区、抓取和复核时间 | 官方活动 ≠ 官方 3D 模型 |
| 固定场馆 | 获授权 CAD／floor plan／自有测绘；OSM 用于外部环境 | 数据许可、几何版本、来源、精度 | 建筑室内图 ≠ 演出布局 |
| 当场布局 | 该场官方 seating chart／更新公告 | layout ID、适用场次、舞台／内场／封闭区、版本、置信度 | 通用体育场模型 ≠ 这场真实舞台 |
| 视角模拟 | 自有参数与校准模型 | 座位／分区精度、镜头、眼高、站坐、遮挡假设 | 模拟 ≠ 实拍；距离估算 ≠ 测量 |
| 实拍／社区经验 | 用户自摄并授权、可合规引用的原帖 | 拍摄日期、活动、位置、作者／许可、原始链接、删除机制 | 一张照片 ≠ 整区每个座位视野 |
| 入场攻略 | 当前场次官方 fan guide／场馆公告 | 发布时间、适用日期、最后复核、来源链接 | 旧场次规则 ≠ 当前安检／开门政策 |

1. **第一步：** 每场统一官方入口与“最后核实”标记，先做门票／场次／场馆匹配、官方 seatmap 链接、入场／停车／安检摘要和原文链接。复用现有 [ticketing integration research](./ticketing-integration-2026-10-24.md)，不重复建设交易系统。
2. **第二步：** 用同一场馆的不同 event layout 驱动 2D／3D，允许标记未确认舞台／排座，并建立编辑者校准、来源变更和纠错入口。授权明确前，参考网站的模型、照片、JS 数据不能直接复制进目录。
3. **第三步：** 建自己的照片贡献机制，上传时取得覆盖预期商业用途的许可、遮盖个人信息、记录活动／座位；社区原帖先做链接索引。需要 Reddit 自动化或第三方照片镜像时再解决平台许可和删除同步。
4. **第四步：** 按实际场馆验证 HERE／Mapbox indoor 覆盖及许可，再决定是否加入楼层／洗手间／电梯。逐座售票和实时库存留待商务 enablement；先与目标主办方／场馆获取只读布局授权，通常比寻找“万能 seatmap API”更直接。

## 四、尚未验证的接入前置条件

- 各平台是否向 SeatPeep 发新 key、实际账号 quota、商业费用、允许缓存时间与图片再展示范围，均未通过账号或合同验证。
- 未发现上述公开文档承诺覆盖所有体育场、逐座坐标、每场舞台、临时安保封路或实时排队数据；不能把“文档可读”推定为“数据可商用且完整”。
- SeatView／SeatPOV 名称存在同名产品；本文明确研究 `seat.genchi.top` 与 `brightknight0110.github.io/seatpov-malaysia/`。如目标是另一个同名站，应另行核实。
- 历史 Venue Maps 材料、旧 SeatGeek 文档及在线活动指南的内容会变；实施时以当时官方页面、实际账号权限和签订协议为准。


## 补充：公开攻略案例与发现接口

以下页面由本次并行调研核查后合并；其作用是证明产品形态，不据此保证模型视觉精度或下游再分发权。

| 案例 | 形态与可借鉴点 | 证据边界 |
|---|---|---|
| [Azki Studio BTS 3D fan guide](https://arirang.azki.cl/) | 覆盖 Chile／Colombia／Argentina／Brazil 的多国粉丝指南，演出布局与找座入口 | fan-made，排／座 approximate，不能标为官方测绘 |
| [Taiwan Concert View · Kaohsiung BTS](https://twconcertview.com/en/3d/kaohsiung-national-stadium-bts) | 用图纸／粉丝照片校准座位视角 | reference 模型，校准输入并不证明获官方认证 |
| [Wembley · Taylor Swift 2024](https://www.wembleystadium.com/events/2024/Taylor-Swift-The-Eras-Tour) | 官方 Know Before You Go：票色对应排队坡道／turnstile、时间、周边、交通 | 规则只适用于当时活动，须保留事件和版本 |
| [Allegiant · Beyoncé Cowboy Carter](https://www.allegiantstadium.com/events/detail/beyonce-cowboy-carter-tour) | 官方活动页含停车、开门、周边售卖区；页面示例为 parking 4pm、doors 5pm、merch Lot N | 用作结构案例，不能外推其他场次的时间 |
| [Coldplay 官方 tour app](https://www.coldplay.com/download-the-music-of-the-spheres-world-tour-app/) | 官方 tour／travel 信息融入专属 App | 页面功能证据，不是开放 API |
| [RateYourSeats Sphere restricted views](https://www.rateyourseats.com/the-sphere-las-vegas/seating/restricted-views) | 按驻演场馆专门解释遮挡席，体现“观演目标／屏幕可见性”类攻略 | 独立指南，一手运营者内容，非场馆政策 |
| [Live Nation España Shakira](https://www.livenation.es/en/shakira) | 官方 Access map、到场／回程接驳、VIP、FAQ | 适合拉丁演出官方攻略，交通／入口须按场次复核 |
| [Live Nation Feid Madrid practical info](https://www.livenation.es/noticias/feid-madrid-informacion-practica) | 官方先让粉丝查票面门号列表，再看入口图，同时列时间、交通和寄存 | 票面门号 → 正确入口图，是入场攻略可直接借鉴的任务路径 |
| [Travis Scott fan tour guide](https://www.reddit.com/r/travisscott/comments/18re94u/)、[Rome pit entrance discussion](https://www.reddit.com/r/travisscott/comments/15kcv0i/) | **非官方社区证据**：时间、周边、安检和 pit 入口问题有集中需求 | 混有未经验证建议，不可当作安保／入场规则或直接搬运 |

发现公开攻略的接口不能替代内容授权：

| 接口／官方文档 | 可得数据与认证 | 约束与适用方式 |
|---|---|---|
| [YouTube `search.list`](https://developers.google.com/youtube/data/reference/rest/v3/search/list) | 搜索公开视频／频道／播放列表，返回搜索片段与 ID；项目 API key，用户私有范围需 OAuth | 搜索调用消耗 quota；用于找座位视频原始链接，不能据搜索结果下载／再分发视频，也不能保证搜索画面就是目标座位 |
| [Brave Web Search](https://api-dashboard.search.brave.com/app/documentation/web-search/get-started) | API subscription token；网页搜索可用 site／filetype／freshness 等限制发现官方攻略、PDF 与更新 | 配额／计费按计划；搜索索引及摘要不是原网页内容的授权，展示结果仍应链接原文并验证时间／场次 |
| [X post search](https://docs.x.com/x-api/posts/search/introduction) | 认证和账户计划下的帖子搜索；可发现现场更新与攻略链接 | 历史范围、额度、价格以当时计划为准；获 API 访问仍受内容展示／删除和再分发政策约束，粉丝帖不能当官方规则 |

Reddit 接入还应以最新 [Responsible Builder Policy](https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy) 为准：API 访问需 approval，商业使用需书面批准。100 QPM 是符合条件的免费访问技术额度，不能取代准入和商业许可。
