# 欧美场馆公开图纸与开放数据：可获得内容及精度边界

核查时间：2026-10-24。目标是支持演唱会座位定位、视线和距离估算；未修改原型，也未向任何第三方发送消息。本文区分实际访问结果、数据提供者的说明和我们的工程推论。

## 结论

用户的方向是对的：欧美大型场馆确实有公开的总览、分层座位图、规划文件和部分数字场馆服务。应主动获取、交叉验证这些材料，不能因为第一版模型有空白，就判断原始数据不存在。但是，这些资料不是一个统一开放、全覆盖、逐座带 XYZ 的数据集；公开浏览、开放许可、当前竣工状态、真实票务座位号是四个不同问题。

可立即用于补全 MVP 的主要是：官方当前分区图、官方分层图、官方排座/无障碍说明、具有出处的视点标签。精确距离和三维视线还需要平面比例、看台剖面/排高、逐排曲线、演出舞台位置和独立校准。漂亮的三维画面本身不构成精度证明。

## 可实际核查的场馆材料

| 场馆 / 来源 | 已核实可访问内容 | 对 MVP 的用处 | 没有证明的内容 |
|---|---|---|---|
| Tottenham / Haringey 政府规划材料 | 6 页图纸编号清单；3 页总平面和方案效果图，详见下列链接 | 找到方案版本和建筑设计图编号，为进一步检索具体平面、剖面提供索引 | 编号清单不是对应图纸本体；2015 年规划不是 2026 年竣工 / 当前座位数据库 |
| SoFi / 场馆官网 | 官方 2023 多楼层座位 PDF 链接；当前 maps 页面本次抓取返回跳转说明而非图形数据 | 现场分区、楼层和设施定位；可核对第一版只做少数 lower sections 的遗漏 | 文件年份 2023，不能默认代表所有 2026 体育 / 演唱会配置；尚不能据此断言逐座坐标存在 |
| SoFi / Inglewood 政府 | 187 页 Hollywood Park Champions Initiative；含 Stadium Site Plan 和 Stadium Height Measurement Example | 地块、方向、总体尺寸控制、高程基准、规划历史 | 不是逐排看台施工图；高度限制不是实测座位高度；不是竣工图 |
| SoFi / 建筑师 HKS | 建筑师明确说明存在用于许可的盖章数字 Model of Record，以及看台下沉约 100 ft 的设计 | 证明精确建造数字模型确实存在；提供校核级别的宏观事实 | 文章没有提供该数字模型的开放下载 / 商用授权；不能把“政府持有”当“开源” |
| MetLife / 场馆官网 | 当前 full seating map 链接为 `MetLife-Stadium-Seating-Map-3-2-26-…jpg`；另有 plaza、100、200、300 层独立图 | 区块、楼层和区域相邻关系；最新官网地图比旧 fan map 更适合做主索引 | JPG 文件名日期不是坐标精度证明；区块图没有自动变成逐座数据库 |

### Tottenham：不重复既有下载审计

本项目已有 [Tottenham 公开数据审计](./tottenham-public-data-audit.md)，包含官方关联 Virtual Venue 的配置、视点标签、2D 多边形获取结果。这里补充的是政府图纸渠道的边界：

- [Haringey 图纸编号和技术报告清单（6 页）](https://www.minutes.haringey.gov.uk/documents/s82753/App%201%20Drawing%20Numbers%20and%20Technical%20Reports.pdf)：本次 web 读取可访问 PDF，但正文主要是图像，提取文字不完整。不能将已列入审批的图纸编号当成已经获得的 DWG、IFC 或逐座数据。
- [Site Plans and Scheme Images（3 页）](https://www.minutes.haringey.gov.uk/documents/s82754/App%202%20Site%20Plans%20and%20Scheme%20and%20Images.pdf)：页面标题直接区分 NDP Site、44 White Hart Lane 和方案效果图；这是一份总图 / 效果图附件，不是全馆逐座平面。

### SoFi：政府确实公开图纸，但公开的层次要看具体文件

- [Inglewood：Hollywood Park Champions Initiative，187 页](https://www.cityofinglewood.org/DocumentCenter/View/1162/Hollywood-Park-Champions-Initiative)。零起算 PDF 第 48 页为 Exhibit 6-9 Stadium Site Plan；第 49 页为 Exhibit 6-10 Stadium Height Measurement Example。该示意包括 AMSL 高程及建筑高度控制，不是看台所有座位的 z 坐标。文中早期方案允许约 80,000 fixed seats，不能当成现状容量或座位清单。
- [HKS：Inside SoFi Stadium’s Innovative Design](https://www.hksinc.com/our-news/articles/inside-sofi-stadiums-innovative-design/)。建筑师说明 Inglewood 接受盖章数字 Model of Record 代替纸质图纸用于建筑许可，并解释下沉设计。该事实支持“建造方有更精确模型”，不能推出“公众可以下载整个 BIM”。
- [官方 Maps 入口](https://www.sofistadium.com/plan-your-visit/seating-map)：2026-10-24 web 抓取显示 Redirecting to Maps，未在文本中返回交互地图内部数据。
- [官方 2023 座位图 PDF](https://www.sofistadium.com/assets/doc/SoFi-Stadium-Seating-Map-2023-f238aaef5f.pdf)：公开搜索结果直接指向场馆域名。web 工具因 20,362,423 字节超大小限制未能读取；本地下载审计见文末，不以搜索摘要代替已完成的逐页核查。

### MetLife：当前官网分层图可以直接作为分区校验底图

- [官方 Seating Charts](https://www.metlifestadium.com/events-tickets/seating-charts)：实际可读取，列出 Full、Plaza、100、200、300 五种地图下载。
- [当前官网 Full Seating Map JPG](https://www.metlifestadium.com/assets/img/MetLife-Stadium-Seating-Map-3-2-26-a168abb39c.jpg)：由上述页面 Download Map 链接直接取得，web 可打开图像。只依赖官方实际链接，不猜未公开接口。
- [官方 2024 Fan Map PDF](https://www.metlifestadium.com/assets/doc/825101_fan_map-april-2024_dc_x9-1-ce7eea95a7.pdf)：公开可读取，包含 plaza / concourse 等设施和分区示意；主要是到场导航资料。

## 开放数据究竟有什么

| 数据源 | 一手文档中的真实字段 / 表达能力 | 能解决的部分 | 不能默认解决的部分 | 许可 |
|---|---|---|---|---|
| OpenStreetMap / Simple Indoor Tagging | `level`、`indoor=room/area/corridor/wall/level`、名称、`ref`、可选 `height`；既有建筑 / 室外标签可合用 | 场馆位置、入口、走廊、楼层、轮廓；有志愿者实际绘制的特征 | schema 能表示不等于每个体育馆有人录入；不是官方票务逐座库；楼层不是座位实际眼高 | ODbL，署名及相关数据库再分发要求；不能把未经许可的商业地图抄入 OSM |
| OSM grandstand | `building=grandstand` 画看台轮廓；`leisure=bleachers` 等另有表达 | 看台 footprint / 建筑部件的粗模型 | 屋顶或看台外轮廓不是内部排深、坡度、每个 seat XYZ | 同上 |
| Overture Buildings | building footprint；可选 `height`、`num_floors`、`min_height`、`has_parts` 和 BuildingPart | 建筑底图、外观体量、跨源实体关联 | 官方把 height / floors 描述为近似 3D 形状；该 schema 不是室内座位 / 演出舞台 schema | 当前 Buildings theme 为 ODbL，仍需上游归属 / 署名，不能混同 Places theme 的 CDLA / Apache 许可 |

一手来源：

- [OSM Simple Indoor Tagging](https://wiki.openstreetmap.org/wiki/Simple_Indoor_Tagging)
- [OSM building=grandstand](https://wiki.openstreetmap.org/wiki/Tag%3Abuilding%3Dgrandstand)
- [OSM Copyright and License](https://www.openstreetmap.org/copyright)
- [Overture Building schema](https://docs.overturemaps.org/schema/reference/buildings/building/)
- [Overture Buildings guide](https://docs.overturemaps.org/guides/buildings/)
- [Overture Attribution and Licensing](https://docs.overturemaps.org/attribution/)

本轮没有对三个场馆逐一导出 OSM / Overture 要素，因此不声称它们对任意一个场馆的室内覆盖已经完整。以上是对其官方 schema 和许可的核查。

## 为什么平面图仍不足以声称“这张票精确到这个座位、距离舞台 60 m”

以下是工程推论，不是数据提供者的精度承诺：

1. 总览图可以有完整区号，但可能为排版而压缩、拉伸或分离楼层；只有图像像素并不天然对应真实米数。应优先使用标注尺寸 / 比例尺，或用已知场地尺寸、多点控制做校准。
2. 逐座小方块如存在，也必须核对 row / seat 编号顺序、跳号、无障碍平台、包厢、立席和被移除座位。不能套统一 30 排 × 24 座的网格冒充真实票号。
3. 垂直高度来自剖面、排高、坡度或测量。建筑总高或 Overture height 不能替代座位 z。二维看起来正确也可能算错直线距离和遮挡。
4. 演唱会舞台、延伸台、FOH、灯塔、屏幕、内场座椅是 event-specific。足球场底图再精确，也不能单独确定到艺人的距离。
5. 带 seat / row 标签的社交照片适合检验视线、栏杆和层级，不宜单图反推出绝对米数：焦距、数码变焦、裁切、镜头畸变、拍摄人站起以及舞台位置都会改变观感。要用于尺寸校准应取得原作者许可和原片元数据，并尽量有多张不同已知视点。

## MVP 可以实行的精度门槛

建议分别发布验证等级，禁止把不同来源的精度合并成一个“准确”标签：

- **分区已核实**：官方当前图和至少一个独立来源核对区号、楼层、相邻关系；能定位到区域，暂不声称具体米数。
- **排座编号已核实**：官方 / 已授权票务或现场验证支持真实 row / seat 范围和编号方向；没有确认的票号明确无法定位，不能悄悄映射到模拟座位。
- **几何已校准**：有平面尺度、看台剖面 / 排高和多个保留不用拟合的视点做误差评估。误差需实测后报告，不能先承诺 ±1 m / ±5 m。
- **演出布局已核实**：指定演出日期和舞台版本，有可靠尺寸 / 位置；否则距离输出一个说明假设的范围，不展示伪精确小数。

## 公开浏览不等于开放许可

本轮没有在上述官方座位 PDF、JPG、规划附件上找到允许复制 / 商业再分发第三方素材的开放许可。合理下一步是保留来源和出处、抽取需要核对的事实，并对拟使用的图形 / 模型 / 贴图单独核对权利；不要把政府公开审阅理解成整份图纸已经公有领域。美国版权局明确把建筑图纸 / 设计列入可保护作品，具体使用仍需按地区和使用方式评估。

- [美国版权局：Architectural Works](https://www.copyright.gov/register/va-architecture.html)
- [英国 GOV.UK：规划申诉使用图纸需有版权许可](https://www.gov.uk/appeal-planning-inspectorate)

## 下载审计

SoFi PDF 公开响应总大小为 20,362,423 字节。初始下载 45 秒收到 2,867,586 字节后超时；续传、重试及 IPv4 / HTTP1.1 连接均遇到 SSL 连接失败或超时。本轮未完成完整下载，因此不能可靠判断全文件是否矢量、是否含逐座图形 / 排座文字、比例尺或尺寸，也不声称已经从它提取出真实座位。

暂存文件已改名为 `public-venue-samples/SoFi-Stadium-Seating-Map-2023.pdf.partial`，避免被当成完整 PDF。来源、预期 / 已收字节、哈希和失败原因保存于 [下载清单](./public-venue-samples/download-manifest.json)。这是当前网络获取限制，不是源数据不存在的证据。
