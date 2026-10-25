# The Weeknd 最近六个月演唱会与公开座位图研究

**检索日期：** 2026-10-25  
**时间窗口：** 2026-04-25 至 2026-10-25（含首尾）  
**演出范围：** The Weeknd 的 `After Hours Til Dawn Tour`；不把同名粉丝活动或非本人演出混入。

## 结论

在这个窗口内，公开一手来源可以确认 **58 场、24 个场馆、24 个城市**。演出覆盖巴西、欧洲、英国、日本、印度尼西亚、新加坡、韩国、泰国和香港。

Live Nation/VIP Nation 的欧洲官方日期页是欧洲段的主清单；巴西 Ticketmaster 官方页确认巴西三场；Live Nation Japan 官方页确认 Belluna Dome 两场；Live Nation Asia 官方页确认亚洲后段日期。不同页面的抓取时间和售票状态不同，票务座位图也会随着售票系统变化。

座位形态整体可分成三类：

1. **体育场碗 + 内场站席/临时座席**：欧洲大多数体育场、巴西和亚洲体育场；
2. **体育场碗 +分区座席 +内场区域**：部分欧洲场次和日本场次；
3. **内场分级座位/靠近舞台的 VIP 区**：Belluna Dome 的官方票档明确写出 Arena Reserved Seat、Stage Front Reserved Seat 和靠近 thrust 的区域。

公开座位图的证据强度不一致：曼彻斯特 Ticketmaster UK 页面明确显示 `Map`、Standing/Seated 年龄规则；巴西 Ticketmaster 页面有 `MAPAS E PREÇOS`；日本 Live Nation 页面有官方座位等级和 seat image；其他场次目前能确认官方售票页和场馆事件，但本次抓取没有获得可复用的完整 SVG/JSON 逐座数据。它们应先导入为“公开参考 / 布局待核实”。

## 逐场演出清单

以下按日期分组。相同场馆的多场演出通常使用同一类体育场演出布局，但不能因此把某一场的舞台坐标直接复制给另一场；每场仍应保存自己的事件 ID、座位图引用和版本。

### 巴西

| 日期 | 城市 | 场馆 | 座位/公开图状态 |
|---|---|---|---|
| 2026-04-26 | 里约热内卢 | Estádio Nilton Santos | 体育场碗 + 内场；Ticketmaster Brasil 官方页确认演出，公开页有 `MAPAS E PREÇOS` 入口；完整图像资产待提取 |
| 2026-04-30 | 圣保罗 | Estádio MorumBIS | 体育场碗 + 内场；Ticketmaster Brasil 官方页确认日期和场馆，公开页有地图/价格区 |
| 2026-05-01 | 圣保罗 | Estádio MorumBIS | 同上；必须按事件日期保存独立版本 |

来源：[Ticketmaster Brasil 官方活动页](https://www.ticketmaster.com.br/event/the-weeknd-sp)、[São Paulo 官方票务页](https://www.ticketmaster.com.br/event/the-weeknd-after-hours-til-dawn-venda-geral-01-05-sao-paulo)。

### 欧洲和英国

| 日期 | 城市 | 场馆 | 座位/公开图状态 |
|---|---|---|---|
| 2026-06-11、06-12 | 曼彻斯特 | Etihad Stadium | Ticketmaster UK 页面明确有 Map，并区分 standing、seated、East/West pitch；公开座位图可作为参考 |
| 2026-06-19、06-20 | 哥本哈根 | Parken | 体育场碗 + 内场；Parken 官方页确认加场，Ticketmaster.dk/LN 售票；完整公开图未在本次抓取中保留 |
| 2026-06-25、06-26、06-27 | 慕尼黑 | Allianz Arena | 体育场碗 + 内场；官方场馆页确认三场，公开票务由 Ticketmaster/München Ticket 等渠道提供；完整活动图待提取 |
| 2026-07-03、07-04 | 里尔/维伦纽夫达斯克 | Stade Pierre-Mauroy / Decathlon Arena | 可伸缩屋顶体育场，演唱会为内场 + 看台；官方场馆页确认两场；未取得可复用逐座图 |
| 2026-07-08、07-10、07-11、07-12 | 巴黎/圣但尼 | Stade de France | 体育场碗 + pit/内场；官方场馆页和售票队列页确认四场；公开售票图可查看但本次未固化图像 |
| 2026-07-16、07-17、07-18 | 阿姆斯特丹 | Johan Cruijff ArenA | 体育场碗 + field；官方场馆页确认 16/17/18 三场，票务由 Ticketmaster；完整活动图待提取 |
| 2026-07-21、07-22 | 尼斯 | Allianz Riviera | 体育场碗 + 内场；官方 VIP PDF 明确“靠近草地和舞台的座位”和中央看台 E2 Garibaldi，但不是完整公开座位图 |
| 2026-07-24、07-25、07-26 | 米兰 | Stadio San Siro | 体育场碗 + 内场；Live Nation/VIP Nation 官方日期页确认三场；完整票务图待提取 |
| 2026-07-30、07-31、08-01 | 法兰克福 | Deutsche Bank Park | 体育场碗 + 内场站席/座席；官方场馆页明确三场及无障碍座位块 20–36；完整活动图待提取 |
| 2026-08-04、08-05 | 华沙 | PGE Narodowy | 体育场碗 + 内场；官方 Live Nation/VIP Nation 日期页确认两场；完整活动图待提取 |
| 2026-08-08、08-09、08-10 | 斯德哥尔摩 | Strawberry Arena | 体育场碗 + 内场；官方 Live Nation/VIP Nation 日期页确认三场；完整活动图待提取 |
| 2026-08-14、08-15、08-16、08-18、08-19 | 伦敦 | Wembley Stadium | 体育场碗 + 内场；Wembley 官方页确认演出及 Ticketmaster 售票，特别提示 Level 5 坡度较陡；完整活动图待提取 |
| 2026-08-22、08-23 | 都柏林 | Croke Park | 体育场碗 + 内场；Live Nation 官方事件页确认两场；完整活动图待提取 |
| 2026-08-28、08-29、08-30 | 马德里 | Riyadh Air Metropolitano | 体育场碗 + 内场；Live Nation/VIP Nation 官方日期页确认三场；完整活动图待提取 |
| 2026-09-01 | 巴塞罗那 | Estadi Olímpic Lluís Companys | 体育场碗 + 内场；Live Nation/VIP Nation 官方日期页确认；完整活动图待提取 |
| 2026-09-05、09-06 | 里斯本 | Estádio do Restelo | 体育场/开放式看台 + 内场；Live Nation/VIP Nation 官方日期页确认两场；完整活动图待提取 |

欧洲主来源：[Live Nation VIP Nation 官方日期页](https://www--vipnation--eu.netsite.livenationinternational.com/theweeknd)。补充一手场馆来源：[Stade de France](https://www.stadefrance.com/en/le-stade/weeknd-stade-de-france)、[Johan Cruijff ArenA](https://www.johancruijffarena.nl/en/calendar/421549-the-weeknd-after-hours-til-dawn-tour/)、[Allianz Arena](https://allianz-arena.com/en/news/2026/06/visitor-information-for-the-weeknd-concerts-at-allianz-arena)、[Parken](https://www.parkenstadion.dk/nyhed/ekstra-koncert-med-the-weeknd)、[Allianz Riviera 官方 PDF](https://www.allianz-riviera.fr/sites/allianz-riviera/files/2025-09/AR_CONCERT-THEWEEKND_PLAQUETTE-CONCERT_V2.pdf)、[Deutsche Bank Park](https://www.deutschebankpark.de/news/the-weeknd-aktuelle-besucher-und-serviceinformationen-178284/)、[Wembley Stadium](https://www.wembleystadium.com/events/2026/The-Weeknd)、[Stade Pierre-Mauroy](https://www.stade-pierre-mauroy.com/programmation/concert/the-weeknd)。

**重要勘误：** Live Nation/VIP Nation 日期页在 2026-07-31 一行把场馆文本显示成 `Etihad Stadium, Manchester`，但该行位于法兰克福三场之间；Deutsche Bank Park 官方页明确 7 月 30、31 日和 8 月 1 日为法兰克福三场，因此项目导入应按法兰克福处理，并把该页面异常写入审计备注。

### 日本与亚洲后段

| 日期 | 城市 | 场馆 | 座位/公开图状态 |
|---|---|---|---|
| 2026-09-19、09-20 | 埼玉/东京圈 | Belluna Dome（Seibu Dome） | 官方 Live Nation Japan 页面有 seat image 和票档：Platinum 为靠近 stage/thrust 的 Arena Reserved Seat，Gold 为 Arena Reserved Seat，Silver 为 Stage Front Reserved Seat；这是目前证据最完整的亚洲场次 |
| 2026-09-26、09-27 | 雅加达 | Jakarta International Stadium | Live Nation Asia 官方页面确认两场；体育场碗 + 内场，公开活动图未在本次抓取中固化 |
| 2026-10-02、10-03 | 新加坡 | National Stadium | Live Nation Asia 官方页面确认两场；体育场碗 + 内场，公开活动图未在本次抓取中固化 |
| 2026-10-07、10-08 | 高阳/首尔 | Goyang Stadium | Live Nation Asia 官方页面确认两场；体育场碗 + 内场，公开活动图未在本次抓取中固化 |
| 2026-10-11、10-12、10-13 | 曼谷 | Rajamangala National Stadium | Live Nation Asia 官方页面确认三场；体育场碗 + 内场，公开活动图未在本次抓取中固化 |
| 2026-10-24、10-25 | 香港 | Kai Tak Stadium | The Weeknd 官方 Tour 页和 Live Nation Asia 官方页确认两场；体育场碗 + 内场，公开活动图未在本次抓取中固化 |

亚洲主来源：[Live Nation Asia The Weeknd 官方页](https://www.livenation.asia/the-weeknd-tickets-adp474869)、[Live Nation Japan 官方页](https://www.livenationhip.co.jp/en/all-events/the-weeknd-tickets-ae474869)、[The Weeknd 官方 Tour 页](https://www.theweeknd.com/tour/)。

## 座位图导入建议

### 可以直接进入项目的来源层

- 事件身份：供应商事件 ID、日期、场馆、城市、官方 URL；
- 公开图引用：Ticketmaster/Live Nation 官方座位图 URL 或官方活动页；
- 座位类型：`standing`、`reserved-seat`、`arena-reserved`、`stage-front`、`VIP`；
- 场馆永久壳体：使用 SeatPeep 已有或新导入的场馆模型。

### 仍需逐场校准的部分

- 主舞台朝向和精确长宽；
- 延伸台、侧台、屏幕、FOH；
- 封闭看台和临时分区；
- 票图上的分区编号到 SeatPeep 分区的映射；
- 米制比例和逐座位置。

体育场名称和常规建筑座位图不能直接证明演唱会临时布局。对没有保存事件图像的场次，项目中应写入 `mapVerification=reference`、`stageVerification=unverified`，前端显示“公开参考 / 布局待核实”。

## 录入项目的建议状态

| 状态 | 适用范围 |
|---|---|
| `source-matched` | 58 场事件的身份、日期、场馆和官方来源已确认 |
| `reference-only` | 有官方票务页或公开座位图引用，但还没有可复现的 SeatPeep 舞台模型 |
| `operator-traced` | 已对照事件图人工描摹舞台/封区，并通过独立分区锚点复核 |
| `reviewed` | 2D、3D、座位入座、碰撞和来源叠加检查全部通过 |

本次研究可以直接支持批量导入 58 个事件候选和 24 个场馆关联；不应把 58 场都标成已核验 3D。下一步应优先提取 8 个最容易获得事件座位图的来源：Manchester、São Paulo、Paris、Amsterdam、Frankfurt、Wembley、Belluna Dome、Hong Kong。
