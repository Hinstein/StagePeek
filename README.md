# SeatPeep 本地 MVP

Node.js 24+，原生 HTTP、SQLite、Three.js；依赖资源已放在 `public/vendor/`，无需 npm 安装或前端构建。

## 本地体验

```sh
cd /Users/lilinhai/Projects/rea/seatpeep
npm run start:local
```

电脑访问 http://127.0.0.1:4180 。启动日志会打印当前同 Wi-Fi 手机地址；本次为 http://192.168.6.150:4180 。电脑需要保持运行，网络变化后地址可能改变。

点击“登录 / 注册”，输入以下测试邮箱，发送后点击“本地测试：打开登录链接”，再确认登录。不会向外发邮件或扣费。

本地模式还提供两个明确标注的演示流程：登录弹窗中的“本地模拟 Google 登录”使用固定的开发账号和同浏览器 OAuth state；Pro 方案中的“本地模拟升级 Pro”只写入独立的本地测试数据库，模拟 30 天月订阅，不连接 Google 或 Stripe。它们只在 `DEV_MAILBOX=true`、非生产和回环请求下开放。

| 邮箱 | 权限 |
| --- | --- |
| `free@seatpeep.test` | 免费账号，可访问配置的 10 个免费场馆，最多保存 8 个位置 |
| `pro@seatpeep.test` | 本地 Pro 测试状态，解锁全部场馆目录，最多保存 100 个位置 |
| `expired@seatpeep.test` | 过期订阅，回落到免费权限 |
| `admin@seatpeep.test` | 本地管理员，用于配置免费场馆和验证场馆导入接口 |

本地预览模式会直接解锁全部 197 个场馆，方便检查批量导入的 2D/3D；它只在 `start:local` 下生效，正式环境仍按订阅限制场馆。测试收件箱仅允许服务电脑的回环访问，且只显示当前浏览器申请、未消费且未过期的登录链接。真实邮箱服务配置后才支持手机收邮件登录；本地模拟 Google 和升级流程只建议在运行服务的电脑上演示。

免费场馆默认是当前来源证据最完整的 10 个：启德主场馆、香港红馆、亚洲国际博览馆 Arena/VIVA/2 号馆/Runway 11、台北小巨蛋、Tottenham、MetLife 和 SoFi。正式环境可以在 `/admin.html` 配置，管理员必须先登录，保存时必须选择恰好 10 个已存在场馆。服务端把名单写入 `access_settings`，每次读取场馆和座位 API 时重新执行权限检查；浏览器传入的场馆 id 不会授予权限。

测试数据放在独立的 `var/seatpeep-local.sqlite`。`start:local` 不读取 `.env`，清空第三方服务配置，只重置三个测试账号的订阅状态，保留已存位置。正式启动 `npm start` 使用另一份数据库 `var/seatpeep.sqlite`，不会自动灌入测试权限。不要把测试数据库用于正式服务。

## 可以测试什么

1. 访客、免费、Pro、订阅到期的访问差异，以及直接访问 API 时的限制。
2. 场馆目录切换、2D 地图、3D 总览、点击分区、靠近分区、观众视角、拖动与缩放。当前目录包含原站去重后的 193 个场馆，加上 MVP 原有的 Tottenham、MetLife、SoFi 和 Wembley，共 197 个；没有逐座证据的场馆不会伪造票号样本。
3. Tottenham `Section 122 / Row 14 / Seat 679` 仅匹配来源票号，不提供座位 XYZ 或入座相机；`680` 未收录，保持分区预览。台北小巨蛋 `center / 紅1A / 1 / 1` 可测试来源坐标的二维点选与三维入座。
4. 登录后保存、重新查看、删除位置；刷新保持登录；退出后重新限制场馆。
5. 官方演出列表、来源链接、更新时间与布局待核实状态。

新增可测试票号：MetLife `203A / Row 6 / Seat 11`、`115CWC / Row A / Seat 16`；SoFi `C116 / Row 10 / Seat 10`、`OWN131 / Row 16 / Seat 7`、`504 / Row 10 / Seat 7`。前缀、字母排及 WC 后缀须按来源原样输入。未在采样中的相邻座位不能据此推断存在。

## 数据准确性

2026-10-24 修复：七馆12种来源布局、138,856条记录已按原始票号/XYZ全量接入，按馆按布局加载；七馆为启德主场馆、香港红馆、亚洲博览馆 Arena / VIVA / 2号馆 / Runway11、台北小巨蛋。二维座点、三维椅子、来源舞台共用坐标。Kai Tak使用每条CAD记录的Y（字段11），没有场次舞台时不显示人物或距离。保存位置包含布局；不支持的布局或未收录票号不会转到别的座位。

欧美三馆采样只有票号及屏幕热区，其虚构XYZ已经取消；手工输入未知票号不再转换为模拟网格座位。点击模拟椅子仍仅供演示，输入框不会把模拟排号冒充票号。来源坐标一致性不等于现场实测准确：所有馆仍为 `metricCalibrated=false`、`completeSeatInventory=false`。图形/数据商用权也尚未确认。详细证据和验收见 [数据准确性修复](docs/data-accuracy-2026-10-24.md)。

## 原站场馆批量导入

原站 REA 证据包中的 196 条目录记录按场馆 ID 去重后得到 193 个场馆。已全部转换为 SeatPeep 导入包并重建产品数据：104 个同时有分区布局参考，59 个有几何 profile 但没有逐区参考，30 个只有目录级公开信息，7 个在本次修复中改为全量来源座位资产。当前 `data/venues.json` 共 197 个场馆（含原有 4 个 MVP 场馆）。详见 [批量导入审计](docs/shijiao-import-report.md)。

导入脚本是 `scripts/import-shijiao-venues.mjs`，审计输出是 `docs/shijiao-import-report.json`。目录导入脚本保存来源和有限采样；`data:build` 另外校验并打包已保留的七馆完整来源资产，未复制图片或全景图库；所有场馆都保持 `completeSeatInventory=false`、`metricCalibrated=false`。30 个目录级场馆的分区标签是浏览用示意标签，页面会通过准确性字段保留这一边界。

重新从已保留的研究资料构建：

```sh
node scripts/import-shijiao-venues.mjs
npm run data:build
```

普通访客仍只能读取 Tottenham；本地 Pro 测试账号可以读取全部 197 个场馆。来源公开可访问不等于允许商业再分发，正式上线前仍需逐场馆确认地图、模型和座位数据的授权。

| 场馆 | 基础分区 | 可用排座采样 | 完整逐座库存 | 米制坐标校准 |
| --- | ---: | ---: | --- | --- |
| Tottenham | 187（原始标识 217，含 WC 变体） | 609 | 未取得 | 未完成 |
| MetLife | 146（原始标识 173，含 WC 变体） | 602 | 未取得 | 未完成 |
| SoFi | 257（原始标识 318，含 WC 变体及 C/VIP/OWN） | 587 | 未取得 | 未完成 |
| Wembley | 25 个官方页面明确出现的分区锚点 | 0 | 未取得 | 未完成 |

**当前可运行产品链路，不代表现场准确性验收已完成。** 七馆坐标已与原始资产逐条核对，保留来源哈希和记录索引；它们的可选布局与来源资产一一对应。其余馆仍有示意几何。欧美来源的采样票号只用于身份核对，不再生成XYZ或入座视角。未收录票号、重复票号或不支持的布局不自动落座。来源清单也不能证明本场演出完整库存、遮挡或实时封区。

已修复33个仅在分层图出现的Tottenham基础标识方向缺失：套房不再挤在默认角度，900号广播区归入来源高层。分层图只用于相对方向，未用于冒充米制校准。

只有来源座位坐标和来源舞台均存在时，才显示明确标注为非实测的模型距离；它不保证特定演出的门票距离。模拟椅子仍仅显示示意模型值。三种通用舞台不对应任何已确认演出；目前各场次没有已核实的舞台位置或封区信息。已提供1×/2×/5×/8×视角放大；它按60°垂直视野的投影倍率计算，不代表真实手机镜头成像。暂无现场照片。

来源研究：`../western-market-research/venue-data-provenance-and-accuracy.md`、`tottenham-public-data-audit.md`、`public-data-followup-2026-10-24.md`，以及新增 `metlife-source-acquisition-2026-10-24.md`、`sofi-source-acquisition-2026-10-24.md`。原始配置、热区和 SHA-256 清单保存在研究目录，应用未打包第三方全景图库。公众可访问的 Virtual Venue 配置、审批图纸或观众照片，不自动代表有权商用再分发；尚未取得相关场馆数据的商用授权。

## 公开二维分区投影

二维图现在保留官方关联 Virtual Venue 的公开屏幕热区轮廓（每个来源视点单独绘制），所以能显示真实的弧形、过道和不规则边缘。它们仍是屏幕像素投影，不是米制平面坐标；三维和距离计算继续使用独立的估算几何，页面会明确标注这一点。未取得完整逐座表的区域不会因为轮廓存在而被当成可核实座位。

## 新取得的建筑图纸

已从迁移后的Haringey公开申请库取得Tottenham东/南看台剖面、全场南北/东西剖面和Level05平面，图签比例为1:200或1:500 @ A1；另两份D&A附件仅封面/效果图。6份PDF的字节与SHA-256已复核。[图纸核验报告](../western-market-research/tottenham-planning-drawings-2026-10-24.md)列明真实来源及附件覆盖范围。

这些是2015年PLANNING设计资料，可用于下一步配准与结构重建；尚未用于校准当前模型。东看台FOP=12.298、LEVEL00=11.530；外部标高基准未确认，楼层高度不能当作每座坐标。它们没有完整票号表，也未证明与竣工状态一致。原始图纸仅保存在研究目录，没有放进产品静态资源。

## 官方演出刷新

```sh
npm run events:refresh
npm run events:refresh -- metlife
```

仅请求已配置场馆官网的 HTTPS 域名，每馆最多 30 页；正式服务每六小时刷新。缓存区分完整抓取、部分失败、过期缓存和不可用；这不是官网全部演出的完整性承诺，列表分页和站点变更仍可能漏项。结束时间早于开始时间时不用于历史筛选；无 offset 时间保留场馆本地日期。

本轮 Tottenham 自动取得 1 项未来演出、MetLife 3 项。SoFi 本机自动请求失败；已从官网详情人工核验并单独标明缓存来源的 3 项演出，失败记录继续保留。详见 `docs/verification.md`。

## 正式服务配置（登录和权限）

复制 `.env.example` 为 `.env`，填写自己的配置，再 `npm start`。不要向聊天粘贴密钥。

- Google：Web OAuth Client，回调为 `APP_URL/api/auth/google/callback`。
- Brevo：`BREVO_API_KEY` 和已验证发信域名的 `EMAIL_FROM`。正式服务必须 `DEV_MAILBOX=false`；Resend 仅保留为迁移兼容回退。
- Stripe：先使用测试环境；配置有效的每 1 月循环 Price、Secret Key、Webhook Secret；Webhook 地址 `APP_URL/api/billing/webhook`，订阅及 Checkout 相关事件见 `server/billing.mjs`，并启用同账号 Billing Portal。
- 部署时 `NODE_ENV=production`、HTTPS `APP_URL`，用受信反向代理。生产拒绝开发收件箱；密钥留在服务器端。

当前仓库没有生产账号凭据，Google / Brevo / 真实支付尚未在本机连接真实第三方；本地模式的 Google 和升级按钮只是明确标注的开发演示，不会发起外部请求。可验证的是正式 provider 协议逻辑、开发演示和安全边界。付款回跳不会授予权限，只有服务端核验的订阅状态才生效。

管理员权限接口：`GET /api/admin/access` 查看当前名单，`PUT /api/admin/access` 提交 `{ "freeVenueIds": ["...十个场馆 id..."] }`。两条接口都要求当前登录邮箱位于 `ADMIN_EMAILS`。普通用户只能看到 `/api/venues` 返回的锁定标记，读取付费场馆详情仍会在服务端返回 `403 SUBSCRIPTION_REQUIRED`。

## 验证

```sh
npm test
```

2026-10-24 上线准备复查：最新完整结果 **65/65**，21个模块语法检查通过。正式上线仍未通过，原因和验收证据见 [上线准备审计](docs/launch-readiness-2026-10-24.md)。覆盖身份、会话、权限、账单、来源解析、三馆全部1,798条可用采样的精确解析、Wembley 导入校验、管理员校验接口、已知及未知票号，以及公开场次座位图参考链接；测试使用临时数据库和本地 HTTP，不发信、不付款。浏览器验证及尚缺项见 `docs/verification.md`。


## 后续如何添加场馆

场馆不是由模型临时生成，也不应该让普通用户上传一张图就直接发布。现在采用“研究资料包 → 严格校验 → 管理员发布 → 服务热加载”的流程：

1. 管理员整理一个 JSON 导入包，至少包括场馆名称、官方来源链接、分区标签、分层、相对方向和准确性状态。逐座数据没有来源时，`samples` 必须留空；不能用 30×24 的合成排座冒充票面数据。
2. 先运行 `npm run venue:validate -- data/manual-venues/wembley.json`。这只做校验，不写入产品。
3. 本地或后台管理员发布时运行 `npm run venue:add -- data/manual-venues/<id>.json --publish`。脚本会把原始导入包保存到 `data/manual-venues/`，并原子更新 `data/venues.json`。
4. 线上后台可以调用同一套服务端接口：管理员登录后 `POST /api/admin/venues/validate` 预检，确认报告后 `POST /api/admin/venues/publish` 发布。本地模式默认管理员是 `admin@seatpeep.test`，正式环境必须在 `ADMIN_EMAILS` 中配置真实管理员邮箱。接口受 `ADMIN_EMAILS` 约束，普通用户不能调用；发布后 `loadVenues()` 会立即重载当前进程。
5. 发布后再刷新场馆事件来源、做浏览器验收，并把来源、许可和精度等级写入研究记录。真实逐座票号和米制距离需要额外证据，不能因为分区图存在就自动升级准确性。

## 票务系统接入（欧美 MVP）

当前已接入 Ticketmaster Discovery 的服务端适配器。它不会把 API key 发给浏览器，也不会抓取票务网页的内部接口。配置 `TICKETMASTER_API_KEY` 后，可用管理员接口读取单场事件或搜索事件；接口返回事件、场馆、官方详情链接和演出级 `seatmap.staticUrl` 引用。没有 key 时，原有官方缓存演出仍可正常使用。

管理员接口为 `GET /api/admin/ticketing/ticketmaster/events/:eventId`、`POST /api/admin/ticketing/ticketmaster/search` 和 `POST /api/admin/ticketing/ticketmaster/venues/search`；它们都要求已登录邮箱位于 `ADMIN_EMAILS`，请求只在服务端访问 Ticketmaster。

要批量为当前场馆目录同步 Ticketmaster 候选演出：

```sh
TICKETMASTER_API_KEY=... npm run ticketing:sync
# 只同步一个场馆，便于先核验匹配结果
TICKETMASTER_API_KEY=... npm run ticketing:sync -- --venue sofi
```

脚本按场馆名称查询并把候选结果写入 `data/ticketing/ticketmaster-events.json`。结果带 `matchStatus=venue-name-candidate`，需要运营逐馆确认；不会因为名称相似就自动把舞台或座位当成准确数据。服务启动后，`GET /api/venues/:id/events` 会把已缓存的 Ticketmaster 候选与场馆官网事件合并，前端会显示“有公开参考 / 布局待核实”。

接入边界：Discovery 只提供事件和静态座位图引用；实时库存、价格、逐座可售状态、预订和购票属于 Ticketmaster Partner/Channel Partner 能力，不能通过公开页面或前端接口代替。静态图也不等于 3D 坐标。只有经过官方演出图人工描摹、场馆图交叉验证并记录许可的 `eventLayout`，才可以进入舞台避让和距离计算。详细的官方文档、版权、缓存和 AXS/See Tickets/Eventbrite 对比见 [欧美票务接入研究](docs/research/ticketing-integration-2026-10-24.md)。

### The Weeknd 2026 最近六个月候选导入

The Weeknd `After Hours Til Dawn Stadium Tour` 在 2026-04-25 至 2026-10-25 的公开一手来源窗口内整理出 58 场、24 个场馆和城市。候选清单、场馆座位结构和公开座位图来源保存在 [the-weeknd-after-hours-til-dawn-2026.json](data/artist-events/the-weeknd-after-hours-til-dawn-2026.json)，研究和来源等级见 [The Weeknd 最近六个月研究](docs/research/the-weeknd-concerts-2026-04-25-to-2026-10-25.md)。
导入和校验边界记录在 [The Weeknd 导入审计](docs/audits/weeknd-import-2026-10-25.md)。

```sh
npm run artist:import:weeknd
npm run artist:validate
```

这批数据已经录入事件候选库，所有事件均为 `candidate`，舞台布局为 `unconfirmed`。已有目录中的 Wembley 和 Belluna Dome 可继续关联现有场馆模型；其余场馆需要先录入永久壳体，再逐场提取活动座位图，不能把常规体育场座位图直接当成 The Weeknd 的演唱会 3D。

导入脚本是幂等的：已存在的场馆和事件不会被覆盖，只会补入缺失项；它保留 `data/artist-events/` 研究包和 `data/manual-venues/` 原始场馆包，方便之后换艺人或换时间窗口时复用同一套校验流程。所有 58 场当前都保留在事件候选库，即使演出日期已经过去，也不会从研究资料包中删除。

因此，短期由我们用研究资料包和 CLI 添加，后台管理员随后可以用同一份校验/发布接口操作；前端不承担建模和数据审核。Wembley 是这条流程的第一个样例：25 个官方支持页明确出现的锚点已发布，0 条逐座采样，页面会显示“尚无可核对的排座采样”。
