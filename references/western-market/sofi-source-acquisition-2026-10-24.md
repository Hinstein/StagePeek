# SoFi 公开结构化资料增量获取与核验

核查日期：2026-10-24。本次只读官方关联网页和其实际引用的配置、互动热区；未登录、购买、联系第三方或下载全景图片库，未改动 MVP 代码和业务数据。已有 PDF / HKS / Inglewood 资料不重复下载。

## 实际新增结果

SoFi 并非只有官方 PDF：两支主场球队目前公开链接的 IOMEDIA Virtual Venue 均能取得完整配置。**已下载 Rams 的 318 个来源分区标识、587 条排座采样标签，及七份分层互动热区；另下载 Chargers 的 255 个标识、523 条采样作交叉核对。** 这批资料足以显著补齐 MVP 的分区覆盖和已知票号采样，不能将其当作全部座位清单或米制三维坐标。

| 数据 | Rams | Chargers | 含义 |
|---|---:|---:|---|
| `elementType=section` 视点 | 587 | 523 | 每条有来源 viewId 中的 section / row / seat token；不是全馆容量 |
| 唯一分区标识 | 318 | 255 | Rams 含 61 个 WC 后缀变体 |
| 仅合并 WC 后的基础标识 | 257 | 255 | 保留 C、VIP、OWN 前缀；不能称为普通实体看台数量 |
| 数字 row + seat 的视点 | 587 | 523 | 仅这些离散采样有来源支持，不推成连续座位范围 |
| 分层 JSON | 7 | 1 | Rams 包含全馆、下层、五组 suites 层 |
| 五相机 / 多层热区总数 | 5,680 | 2,617 | 同一视点跨相机/层重复出现，不能累计为席位 |
| 来源 section 视点缺少热区 | 0 | 0 | 检查每个 viewId 至少在一处有 `area` |

Rams 的 `FullStadium / Aerial_Camera_Overview` 单独即覆盖全部 257 个基础标识。两球队共享 255 个标识，其中 503 个完整 viewId 相同；Rams 另有 WC 变体和 OWN131 / OWN132。没有因几乎相同而合并两份来源或覆盖来源差异。

## 可追溯来源链

### Rams：主来源

1. [Rams 官方 SoFi Stadium 页面](https://www.therams.com/stadium/sofi-stadium-2) 的 **EXPLORE THE VIRTUAL VENUE** 实际链接到 [rams.io-media.com/web/index.html](https://rams.io-media.com/web/index.html)。这条官方关联链已打开验证。
2. 首页直接引用 [clientConfig.js](https://rams.io-media.com/web/clientConfig.js)。脚本设置 `APP_VERSION=v220`、`LOCAL_SERVICE_URL=confignew.json`、`GET_LOCAL_SERVICE_DATA=true`。
3. 实际 GET [confignew.json](https://rams.io-media.com/web/confignew.json) 成功，637,458 bytes，`cmd.errorCode=0`。SHA-256：`2fb323742c0f2384697510b5a6764a8e38021f95ecc7851396d6f237189f85cf`。
4. `venueLayers[].areaMapFileName` 指向七份 JSON。首页实际加载的 [v220 应用脚本](https://d32ikx2sw2easi.cloudfront.net/v220/web/js/com/iomedia/vv/script.min.js) 把 `VIEW_MEDIA_PATH=../` 与 `MEDIA_PATH=media/` 拼接。因此准确地址是 `/media/venueview/models/*.json`，不是 `/web/venueview/models/*.json`。
5. 实际下载 [FullStadium.json](https://rams.io-media.com/media/venueview/models/FullStadium.json)、[LowerLevel.json](https://rams.io-media.com/media/venueview/models/LowerLevel.json)、[LevelSuite1.json](https://rams.io-media.com/media/venueview/models/LevelSuite1.json)、[LevelSuite2.json](https://rams.io-media.com/media/venueview/models/LevelSuite2.json)、[LevelSuite4.json](https://rams.io-media.com/media/venueview/models/LevelSuite4.json)、[LevelSuite5.json](https://rams.io-media.com/media/venueview/models/LevelSuite5.json)、[LevelSuite7.json](https://rams.io-media.com/media/venueview/models/LevelSuite7.json)，全部是有效 JSON。

初始按错误基址请求 `/web/venueview/models/FullStadium.json` 返回 HTTP 403。按真实代码修正路径后取得公开文件；初始 403 不代表正确路径的资源不存在，也没有使用登录或权限绕过。

### Chargers：独立官方关联验证

1. [Chargers 官方 Seating Map & Benefits](https://www.chargers.com/sofi-stadium/seating-map) 的 Virtual Venue 实际链接到 [chargers.io-media.com/web/index.html](https://chargers.io-media.com/web/index.html)。
2. 其首页的 [clientConfig.js](https://chargers.io-media.com/web/clientConfig.js) 同样明确引用 [confignew.json](https://chargers.io-media.com/web/confignew.json)，实际下载 376,477 bytes。SHA-256：`77a7cc2aa355ffb96b8f97a8dd073307603f54d5b416be5b072afb1a5a2ffb85`。
3. 配置仅含一份层数据：[FullStadium.json](https://chargers.io-media.com/media/venueview/models/FullStadium.json)，实际下载并解析。

两个 Virtual Venue 的标题明确为 IOMEDIA。不能据此断言 SoFi 官网当前 Maps 页的所有导航/席位产品都由同一供应商提供。

## 这些文件究竟包含什么

原始配置包含五个 `venueCameras`、`daeCameraName`、二维 `backplates` 资源路径、`venueLayers`、`seatingCharts`、`elements`。每个 section element 的 `elementDaeModelName` 类似 `Sub_Section_122_10_10`，可规范化成 Section122 / Row10 / Seat10，并保留 `source`、`viewId`、`elementId`、`levelName` 和相机倾角。

Rams 587 条 section 的 `sectionDisplay`、`rowDisplay`、`seatDisplay` 全部是 null，没有发现应覆盖 token 的显示别名。OWN131、OWN132 确为 `elementType=section`，各有 Row16 / Seat7，`levelName=VIP`。C110 和 VIP110、C130 和 VIP130 等是不同来源标识，不合并为同一票面区号。

例：Rams Section122 有 **Row5 / Seat9、Row10 / Seat10、Row16 / Seat12** 三个视点；526 有 Row3 / Seat6、Row10 / Seat7、Row17 / Seat7。不能把 5–16 排或 9–12 座之间所有组合宣称存在。WC 后缀也保留原始视点标签，不仅保留合并结果。

热区 JSON 的 key 是五个 `Aerial_Camera_*` 名称，value 中是 HTML `area shape=poly coords=... alt=Sub_Section_*`。坐标是**底图屏幕像素**。文件所在目录虽名叫 `models`，内容不是 OBJ/GLTF/DAE 的三维顶点、米制座位 XYZ 或可直接放入 Three.js 的场馆网格。`daeCameraName` / `elementDaeModelName` 的命名也不能证明已有公开 DAE 模型下载。

Rams 还含 266 个 `suite` 元素和 3 个 `easteregg`。规范化 section 文件未混入这两类；热区原始文件和规范化多边形保留其 `elementType`，避免把包厢视点误数成普通座位。

配置中的价格、球队标识和体育场场地布局不应直接作为演唱会场次数据。**此次没有取得具体演出的舞台布局、舞台尺寸、坐标单位、每排坡度、全馆逐座清单或视线遮挡真值。**

## 与当前官方楼层资料核对

[Rams 当前分层地图页](https://www.therams.com/game-day/sofi-stadium-maps) 明确把 100 系列列在 Level2、200 系列分布于 Level3 / Level4、300 系列列在 Level6、400 / 500 系列列在 Level8，另列 C/VIP/OWN 区。与本次来源标签存在明显相符的编号体系，但该页并未验证所有采样的排座坐标。

因此，MVP 用数字首位 1–5 表示看台层级时，应称 tier / seating level，不能把它直接称建筑物第1–5楼。尤其 200 系列并非都在同一个建筑楼层。

## 当前 SoFi 官网 Maps 入口的实际边界

- 旧 [seating-map](https://www.sofistadium.com/plan-your-visit/seating-map) 当前 web GET 返回 Redirecting to Maps；导航真实 Maps 链接是 [plan-your-visit/maps](https://www.sofistadium.com/plan-your-visit/maps)。
- web 读取新 Maps 页只取得站点导航和 Maps 标题，没有嵌入 view-from-seat / wayfinding 内部链接。搜索索引仍能返回先前页面的 View From Seat、Interactive Map、Level1–8 文本，但这不足以证明当前 iframe 的 provider URL。
- 本机对新 Maps 页的精确 GET 返回 `LibreSSL SSL_connect: SSL_ERROR_SYSCALL`。未关闭 TLS 校验。没有因为当前 SoFi 主域网络限制而判断地图不存在；通过球队官方链已成功取得结构化资料。
- 未猜测或遍历其他提供商域名、隐藏 URL。未将搜索摘要中的“exact view”当作独立精度证明。

## 本地交付与复现

原始文件、派生文件和来源清单在 [sofi/](./sofi/)：

- [Rams 规范化分区 / 视点](./sofi/rams-sections-normalized.json)：兼容 Tottenham 的 `sections[].id/baseId/levelNames/views[]`；可用于后续应用接入。
- [Rams 规范化二维热区](./sofi/rams-map-polygons-normalized.json)：带 layer / camera / viewId / elementType / points。
- [Chargers 规范化分区](./sofi/chargers-sections-normalized.json)、[二维热区](./sofi/chargers-map-polygons-normalized.json)：独立关联来源。
- [覆盖审计](./sofi/coverage-summary.json)：计数、源差异和 missingView 检查。
- [来源清单](./sofi/source-manifest.json)：每份下载的精确 URL、字节数和 SHA-256；共保存15份源文件，未下载全景图。
- [复现脚本](./sofi/normalize-research-snapshot.py)：只读同目录保存的原始文件，重新生成规范化资料及断言检查，不联网、不改 MVP。运行 `python3 western-market-research/sofi/normalize-research-snapshot.py`。

核验包含：每个 section viewId 格式正确、row/seat token 类型统计、所有热区 ID 均在对应配置元素中、所有 polygon 点对合法、section viewId 在热区中全覆盖、两来源差异可追踪。该内部一致性不等于现场米级精度认证。

本次未在下载配置、首页或脚本发现允许本项目商业复制分发这些素材的开放许可。首页标示 IOMEDIA / 球队版权信息；研究副本和事实核验的获取记录不代表已取得资产复用许可。没有作进一步法律判断。
