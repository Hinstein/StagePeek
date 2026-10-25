# Tottenham 公开资料复核

> 2026-10-24增量更正：已在迁移后的Haringey Public Register完整申请库找到真实带比例/标高图纸。此前旧portal/委员会附件的访问范围不足以判断不存在。最新证据见 [规划图纸核验报告](tottenham-planning-drawings-2026-10-24.md)；不改变完整座号及竣工米制XYZ尚缺的结论。

复核时间：2026-10-24。范围：场馆、俱乐部、建筑师、地方政府的公开资料；未登录、未提交表单、未购买或申请授权。

## 结论

**能获取，而且本次已实际取得远多于原来 75 个分区样本的数据。上一轮资料核查和建模不完整；原型里的空白不能归因于公开资料不存在。** 已下载官方背书的 Virtual Venue 配置及其七份二维交互轮廓文件，完成分区、排座视点、楼层与多边形的关联校验。此前从票价图提取的 75 个编号，在去除无障碍 `WC` 后缀后全部能与这批资料对应。

但以下命题尚未证实：全场每一个座位的真实三维坐标已公开为可再利用数据；官方视野平台提供下载或商用模型许可；一份足球通用图能代表每场演唱会舞台及可售座位。

## 本次实际取得的数据

官方公告明确链接 [Tottenham Virtual Venue](https://tottenhamhotspur.io-media.com/)。沿首页路由、`/web/index.html`、`clientConfig.js` 中的 `LOCAL_SERVICE_URL`，实际取得 [confignew.json](https://tottenhamhotspur.io-media.com/web/confignew.json)（717,115 字节，服务状态 SUCCESS）。没有登录、使用凭证或绕过访问控制。

| 已取得内容 | 实际数量 / 示例 | 可以支持什么 | 不能推定什么 |
|---|---|---|---|
| 分区标识 | 217 个：184 个纯数字标识、33 个带 WC 后缀标识；去掉 WC 后有 187 个基础标识 | 补核普通看台、Premium、包厢及无障碍区名称 | 217 个完全独立的普通物理看台，或当前可售库存 |
| `section` 类型视点 | 665 条；599 条的排座 token 均为数字，56 条是 Interior，另 10 条有字母排号 | 查证部分真实分区、排、座的编号方式和所属层级 | 全馆只有 665 座；或已获得全部座位、每排边界及连续编号 |
| 其他视点 | 64 条 club，3 条 easteregg | 包厢内部、场馆服务空间的辅助参照 | 普通门票座位 |
| 二维交互轮廓 | 全馆 + Level100/200/300/400/500/Tunnel，共 7 文件，5 个相机投影；共 6,283 个多边形记录 | 更完整的分区平面覆盖、局部轮廓和视点对应 | 6,283 个座位，或米制三维几何 |
| 轮廓关联校验 | 727 个不同视点 ID 均能关联到配置；665 条 section 视点全部至少有一个轮廓 | 下载文件之间相互一致，分层图可补全总览遗漏的视点 | 当前年份现场布局完全一致 |

同一视点会出现在多个层级和相机投影，数量不能相加成座位数。总览单文件覆盖 211 个分区标识；其余层级文件共同补齐配置的 217 个标识。`LevelTunnel` 主要是 Club 内部区域，不应硬套为普通座区。

**122 区的直接例子**：配置将其标为 `East Lower`，六个视点分别是 Row 4 / Seat 698、Row 4 / Seat 679、Row 14 / Seat 679、Row 14 / Seat 698、Row 24 / Seat 698、Row 24 / Seat 679。这证明原型统一使用 Seat 1–24 不是真实票面编号。这些只是采样，不能由此宣布其完整排号为 4–24、座号为 679–698。

**原型漏掉的具体内容**：新增基础标识有 112 个，包括 114–118 客队区、多组 2xx 包厢、301–321、多个 4xx Premium / 包厢、001–003 等特殊区域。75 与 187 的差异是标识覆盖差异，不是可以直接换算的面积或座位数量。完整清单在统计 JSON 中。

### 文件路径解析的纠正

配置字段 `areaMapFileName` 写作 `venueview/models/FullStadium.json`。最初按错误基准目录请求得到 AccessDenied；检查页面实际加载的 [v220 运行脚本](https://d32ikx2sw2easi.cloudfront.net/v220/web/js/com/iomedia/vv/script.min.js) 后，确认它拼接 `VIEW_MEDIA_PATH = "../"`、`MEDIA_PATH = "media/"`，所以正确文件是 [根目录 /media/venueview/models/FullStadium.json](https://tottenhamhotspur.io-media.com/media/venueview/models/FullStadium.json)，现已成功取得。

因此此前的错误响应只说明路径拼错，**不能作为正确模型路径被限制访问的证据**。而这些 `models/*.json` 的实际内容是各相机下的 HTML `<area shape='poly' coords='…'>`，属于二维图片热区。文件夹名为 models 不代表已经获得 GLB、CAD、逐座 XYZ 或可自由旋转的三维场景。

同一运行脚本还按 `Sub_Section_分区_排_座` 组织全景视点，并调用 `pano.loadPano`。据此可以确认客户端有按座位标签组织的全景展示路径；不能因产品称作“3D Virtual Venue”就假定这份公开配置必然附带原始三维座椅数据库。本次未下载全景贴图，也未获得原始三维工程。

### 已保存、可复核的产物

- [分区及采样视点规范化 JSON](tottenham/virtual-venue-sections-normalized.json)
- [665 条视点 CSV](tottenham/virtual-venue-sampled-views.csv)
- [二维多边形规范化 JSON](tottenham/virtual-venue-map-polygons-normalized.json)
- [覆盖统计与新增标识](tottenham/virtual-venue-coverage-summary.json)
- [按原屏幕坐标绘制的总览图](tottenham/virtual-venue-public-map-overview.svg)：122 区橙色，非米制平面图，仅供研究核验
- [总览图 PNG 预览](tottenham/virtual-venue-public-map-overview.png)
- [原文件来源、大小、SHA-256](tottenham/virtual-venue-source-manifest.json)
- [可重复运行的整理脚本](tottenham/normalize-virtual-venue.py)

**时效边界**：配置里仍含 `2022-23 Season Ticket Price`，所以属于带历史内容的当前公开资源。采集日期是 2026-10-24，不代表座位和票价均已更新到 2026。字段中的 cameraAngleTiltX/Y 是视点方向设置，不能作为座椅位置坐标。

### 验证结果

已检查 9 份原始下载文件的字节数与 SHA-256；JSON/CSV 的 217 个标识、665 条 section 视点计数一致；6,283 条多边形坐标均可解析且顶点成对；所有地图视点均能匹配到配置记录；665 条 section 视点全部有二维地图对应；原型 75 个编号去掉 WC 差异后全部匹配。PNG 总览已实际查看，122 区橙色高亮。此验证只证明下载数据及关联处理一致，不证明每个座位的现实精度或完整性。

重启后的 `mcp__rea__binary_session` 已成功响应，报告 server/package 均为 rea-agents 6.5.0，客户端为 codex-mcp-client。[连接状态记录](tottenham/rea-connection-check.json) 证明正式 MCP 已接入，不代表旧 Chrome 9222 的 CDP 路由已修复。本次公共资料路径采集不依赖该端口。

## 已取得或直接核验的资料

| 资料 | 直接来源 | 确认能提供 | 边界 |
|---|---|---|---|
| 当前官方场馆图，1 页 PDF | [Stadium-Map.pdf](https://resources.thfc.pulselive.com/thfc/document/2026/03/12/717e595c-0e87-42f1-9f93-054b42607733/Stadium-Map.pdf) | 场馆轮廓、入口 1–23 与周边位置 | 根任务实际下载并核验后确认：没有座位分区编号，不能用于补完整分区；不是座位 XYZ 数据库 |
| 现行访问页面为上图背书 | [Visiting Supporters](https://www.tottenhamhotspur.com/the-stadium/attending-matches/visiting-supporters/) | 当前 “View and download stadium map” 按钮指向上述新 CDN URL | 老 /media 链接会失效或重定向 |
| 官方 Access Guide，29 页 PDF | [Access Guide](https://resources.thfc.pulselive.com/thfc/document/2026/03/12/235d32eb-9e15-4fef-9b32-ca8acfea79a7/tottenham-hotspur-access-guide.pdf) | 第 6 页说明可在全馆所有层级的无障碍区观看，并直接链接互动座位图；第 11 页定位 Sensory Suite 为北看台 416 区 | 本文不是完整排座表或楼层标高图 |
| 官方 3D 平台公告 | [2022-01-20 官方公告](https://www.tottenhamhotspur.com/news/1009794/club-becomes-first-in-the-uk-to-launch-ticketmasters-3d-virtual-venue-technology) | 明确支持桌面和移动端 360° 座位视野、比较分区，含 Premium；链接到 [IOMEDIA Virtual Venue](https://tottenhamhotspur.io-media.com/) | 宣传精度声明不是我们已验证的模型精度；未给数据导出许可 |
| 另一官方链接的互动图 | [3D Digital Venue 旧客户端入口](https://www.3ddigitalvenue.com/3dmap/clients/tottenham/) | 官方 Access Guide 第 6 页实际指向此入口，因而有一手背书 | 本次 web 抓取工具无法访问此 URL；不能据此声称已取得其模型 |

## 可直接修正当前模型的真实约束

1. **统一“每区 30 排”不符合实际编号方式。** 官方安全站立公告列明南看台 248、249、250、251、252、254、256、257、258、259、260 区覆盖 Rows 1–29；323、324、451、452、453 区指定的站立范围是 Rows 71–82。这些是指定安全站立范围，不能进一步推定为所有这些分区的全部排范围。[官方公告](https://www.tottenhamhotspur.com/news/991389/safe-standing-to-begin-at-tottenham-hotspur-stadium)

2. **南看台不应简单按数字百位拆成几个不相连楼层。** 俱乐部介绍其为 17,500 座单层看台，高度超过 34 米；前排至足球边线为 4.9–7.9 米。它们可校准总体尺度，但不能直接转成每一排的高度。[俱乐部场馆介绍](https://www.tottenhamhotspur.com/the-stadium)

3. 建筑师公开介绍看台 35° 的设计，并说明有安全站立栏杆。[Populous 场馆开幕介绍](https://populous.com/article/populous-designed-tottenham-hotspur-stadium-opens)；俱乐部历史选座指南使用的是 “up to 35 degrees”，所以应把 35° 当总体设计上限线索，不能把全场每个分区都定死为 35°。

4. 客队无障碍资料可交叉验证区域关系：114–118 位于东北角，234 有 26 个轮椅空间，入口 11a 可达。此信息能纠正方位、特殊座区，不能据此生成所有座号。[官方客队指南](https://www.tottenhamhotspur.com/the-stadium/attending-matches/visiting-supporters/)

## 建筑图纸的公开线索

地方政府保留了 2015 年最终方案的审批资料。英国政府 Planning Data 将 `HGY/2015/3000` 关联至 Tottenham 项目，并提供原规划门户记录号 `PKID=284412`。[政府实体记录](https://www.planning.data.gov.uk/entity/1710157)

Haringey 的 [2015-12-16 委员会议程](https://www.minutes.haringey.gov.uk/ieListDocuments.aspx?CId=728&MID=7657) 当前可打开，附录包括：

- [批准图纸和技术报告清单](https://www.minutes.haringey.gov.uk/documents/s82753/App%201%20Drawing%20Numbers%20and%20Technical%20Reports.pdf)：含 Stadium 的 `POP-4494-PLN-GA-0119…0140` 平面编号、`POP-4494-PLN-EL-0142` 立面编号及大量 `PLN-SC-…` 剖面编号。这是**图纸目录**，不是已经取得相应 CAD / BIM。
- [Site Plans and Scheme and Images](https://www.minutes.haringey.gov.uk/documents/s82754/App%202%20Site%20Plans%20and%20Scheme%20and%20Images.pdf)：可打开的 3 页 PDF，主要为总平面和效果图，不是座位级图。
- [主报告](https://www.minutes.haringey.gov.uk/documents/s82752/DRAFT%20Committee%20Report%20THFC%202015%2019.pdf)：144 页，证明该方案范围及图纸列表。2015 规划容量与现行容量有变化，旧设计不能冒充竣工现状。

下一步应以这些**已确认的精确图号**去规划门户核对公开附件；不能把图号目录称为已下载全套技术图。

## 演唱会布局

[官方 Kendrick Lamar / SZA 事件页](https://www.tottenhamhotspurstadium.com/events/1013061/kendrick-lamar-sza/) 确认 2025-07-22、23 在此演出，但当前页面正文没有可提取的带尺寸舞台图。

搜索引擎仍索引旧官方 Travis Scott、Lady Gaga 与 Pearl Jam 场馆图，但本次直接访问旧地址返回 404；不能把搜索摘要当已拿到有效文件：

- `https://www.tottenhamhotspurstadium.com/media/gbbn4tl1/large_travisscott_map.pdf`
- `https://www.tottenhamhotspur.com/media/qtddw5hc/th-stadium-plan_gaga_2.pdf`（搜索摘要包含 001–050、201–247、3xx、4xx 等大量分区，但本次直接取回 404；仅线索）
- `https://www.tottenhamhotspurstadium.com/media/4wqnhtc0/large_flip_pj_map.pdf`

足球通用图和票务视野平台主要校准固定看台；演唱会舞台位置、延伸台、地面高度、控台和遮挡塔需要按场次单独核对。

## 失效链接与迁移，避免重复走弯路

- `https://www.tottenhamhotspur.com/media/1g5klhhu/th-stadium-map_football.pdf`：搜索索引保留丰富分区信息，但本次实际打开重定向主页。
- `https://www.tottenhamhotspur.com/media/15879/stadium-map-all-levels-fans.pdf`：同样重定向主页。
- `https://www.tottenhamhotspur.com/media/6426/tottenhamhotspur-2018-19season-newstadium.pdf`：本次直接打开 404。仅作为历史索引线索，不记作已取得文件。
- [带 premier-league 路径的 3D Digital Venue 页面](https://sites.3ddigitalvenue.com/3dmap/clients/premier-league/tottenham-hotspur-stadium/) 现显示迁移到 `seatseven.io/premier-league/tottenham-hotspur-stadium/`。这不等同于 Access Guide 的 `clients/tottenham/` 入口，亦未凭此确认官方关系。

## 实施判断

现在可以做的是：用已取得的七份二维轮廓与 217 个分区标识补核分区覆盖，按 levelName 和真实看台结构重做分层，再结合官方视野 / 建筑资料校准局部高度、坡度和视野。不能简单按编号百位把南看台切成互不相连的环形楼层。可把每项参数标成“官方事实 / 图上测量 / 独立推估”，而不是统一套用 30×24 网格。当前场馆入口导览图不能直接补完整座位分区。

本轮交付的是原始资料、规范化数据和覆盖核验。**现有在线原型仍使用原来的 75 个样本与估算几何，本轮没有将新的第三方轮廓资产发布进原型，也没有宣布三维场馆已重建完成。** 下一步模型改造应先校准完整分区和看台结构，再处理逐排座号、尺寸和具体演唱会布局。距离和手机取景功能本身可以实现，但输入的座位、舞台与相机尺度未经校准时，结果必须保留“估算”状态。

仍需核验的是：每个区具体排号和座号范围、每排弧线、座号是否全看台连续、每座精确三维位置、演唱会具体搭台尺寸、特殊包厢和栏杆遮挡。公开可浏览的商业 3D 资产也没有因此自动获得复制与分发许可；可以拿来校验，但不能默认将整套资产打包进产品。
