# 欧美演出票务接入与座位数据研究

研究日期：2026-10-25  
范围：Ticketmaster、AXS、See Tickets、Eventbrite，以及场馆/主办方票务系统。  
目的：判断 SeatPeep 能否在欧美市场合法取得演出、场馆、座位图和逐座数据，并给出 MVP 的接入顺序。

本文只引用票务平台自己的开发者文档、条款和官方产品页。官方页面随时可能改版或撤销权限；接入前应重新核对对应账号的协议和限制。

## 先给结论

1. **Ticketmaster Discovery API 是当前最适合 MVP 的公开入口。** 注册 API key 后，可以搜索全球事件、艺人和场馆；事件详情模型包含 `seatmap.staticUrl`，但它是演出关联的静态座位图 URL，不是逐座坐标或实时库存。
2. **Ticketmaster 的逐座库存、价格、offer、预订和下单属于 Partner API/Availability。** 官方明确说 Partner API 不是开放 API，只给已有官方分销关系的公司；Availability 的座位库存接口标注为 Channel Partners only，并要求取得 Ticketmaster enablement。
3. **Ticketmaster International Discovery 的座位图接口可以说明数据形态，但已经不接受新的 API key 申请。** 新项目应使用现在的 Discovery API；国际旧接口的 seatmap 返回静态图，官方明确说并非所有活动都有图，而且当前没有 interactive seatmap。
4. **AXS 没有面向普通开发者的公开座位/库存 API 文档。** AXS 的官方开发者入口和合作伙伴页面显示，数据 feeds、分销和 API integration 是合作/商务接入；官方也公开过与合作伙伴签署数据共享协议后开放 API 的案例。对 SeatPeep 应按 partner-only 处理，不能把公开网站当作可抓取 API。
5. **See Tickets 的官方产品页只公开“API Integration”能力和典型集成对象（门禁、CRM、财务报告），没有公开可自助申请的通用座位图或逐座 API。** 若要使用，需与 See Tickets 或具体主办方谈商业集成。
6. **Eventbrite 适合活动和场馆元数据，不是大型体育场逐座布局的主要来源。** 官方平台提供公开活动数据库、事件/场馆接口和 OAuth；其数据模型偏活动组织者、报名、订单和场馆信息，没有通用体育场逐座 seatmap 能力。旧的全局 Event Search API 已被官方标为弃用，不能把旧教程当作当前接口。
7. **MVP 可以先做“官方事件 + 官方静态座位图引用 + 自有归一化几何/舞台模型”。** 不需要等实时库存合作。逐场舞台位置必须以该场演出的官方座位图/布局为输入，并标明来源、抓取时间和置信度；不能把固定场馆模型当成所有演出的真实布局。

## 接入矩阵

| 提供方 | 官方可直接取得的内容 | 是否公开自助 | 逐座/实时库存 | 对 SeatPeep 的用法 |
|---|---|---:|---:|---|
| Ticketmaster Discovery | 事件、艺人、场馆、分类；事件详情中的 `seatmap.staticUrl`（有数据才返回） | 是，API key | 否 | 首选：同步欧美演出目录和静态座位图，人工/半自动校准舞台 |
| Ticketmaster International Discovery v2 | 国际旧市场事件、场馆、静态 seatmap、areas/价格 | **否：停止新 key 申请** | 否；interactive seatmap 不可用 | 仅用于理解旧数据形态；新项目转 Discovery API |
| Ticketmaster Partner/Availability | offer、价格、库存、section/row/seat、reserve/cart/purchase、订单 | 否，官方分销伙伴 | 是（按权限/协议） | 后续商业合作；不作为 MVP 前置条件 |
| AXS | 官方合作伙伴分销、数据 feeds、API integrations（具体范围由商务协议决定） | 否，合作接入 | 合同/伙伴权限 | 先做官方 venue/event deep link；取得 partner 后再接 feed |
| See Tickets | 票务销售、门禁/CRM/财务等 API integration | 未公开通用自助 API | 未公开 | 逐场与场馆/主办方确认；不依赖其公开网页抓取 |
| Eventbrite | 活动、组织者、场馆、用户授权后的订单/管理数据 | API key/OAuth，按资源权限 | 不适合大型场馆逐座 | 作为小型活动/场馆目录补充，不当作座位模型来源 |
| 场馆/主办方自有票务 | 官方 PDF/PNG 座位图、event layout、场馆 CAD/venue map（若公开或获授权） | 取决于各方 | 取决于系统 | 作为舞台布局和几何校准的高可信来源，保留许可记录 |

## Ticketmaster

### Discovery API（公开入口）

官方 Discovery API 文档称该 API 可搜索 events、attractions 和 venues，调用需要把 API key 放在 `apikey` 查询参数中。官方 Getting Started 页面把 Discovery API 的用途列为按地点、艺人、国家/城市/场馆搜索演出，并说明事件覆盖全球市场。

事件详情模型中有：

```json
{
  "_embedded": {
    "venues": [{ "id": "...", "name": "..." }]
  },
  "seatmap": {
    "staticUrl": "https://..."
  }
}
```

这意味着我们可以在服务端保存 `eventId`、场馆 ID、演出时间、来源 URL 和静态座位图 URL。`staticUrl` 是一张图，官方模型没有承诺该图带逐座几何、排号坐标或可点击区域。因此它可以作为描摹和校准输入，不能直接当作 3D 场馆模型。

官方文档示例响应带有 `Rate-Limit`、`Rate-Limit-Available` 和 `Rate-Limit-Reset` 响应头；文档示例中的默认额度是 5,000 次。实际账号额度和每秒速率应以申请到的 key 返回值为准，服务端必须读取响应头并做退避。

**可执行的 MVP 接口：**

```text
GET https://app.ticketmaster.com/discovery/v2/events.json?apikey=...&countryCode=US&classificationName=music
GET https://app.ticketmaster.com/discovery/v2/events/{eventId}.json?apikey=...
GET https://app.ticketmaster.com/discovery/v2/venues.json?apikey=...&keyword=...
GET https://app.ticketmaster.com/discovery/v2/venues/{venueId}.json?apikey=...
```

Discovery key 应只放在服务端。前端请求 SeatPeep 自己的 `/api/events`，避免暴露 key、超出配额或让浏览器直接形成不可控流量。

来源：

- [Ticketmaster Discovery API v2](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/)
- [Ticketmaster Getting Started / use cases / coverage](https://developer.ticketmaster.com/products-and-docs/apis/getting-started/)

### International Discovery v2（旧国际接口）

官方页面明确写着“不再接受新的 International Discovery API key 申请”，新集成推荐使用 Discovery API。旧接口的 base URL 是 `https://app.ticketmaster.eu/mfxapi/v2/`，认证是 query-string API key，要求 HTTPS/TLS 1.2+，并列出欧洲若干市场覆盖；它不覆盖 Ticketmaster.com 的美国市场。

旧接口的 `GET /events/{event_id}/seatmap` 返回 event 关联的静态 map image。官方特别说明：并非每个活动都有 seatmap（例如 packages、festivals、很多 general-admission music events），而且 interactive seatmaps 当前不可用。`GET /events/{event_id}/areas` 返回演出可用 seating areas 和票价。

这正好解释了为什么“原参考站”可以展示某些演出的舞台与分区：它很可能把演出级别的官方静态图、区域信息或公开票图作为输入，再自行描摹成几何；不能假设所有场馆或所有场次都有同样完整的数据。

来源：

- [International Discovery API v2 overview](https://developer.ticketmaster.com/products-and-docs/apis/international-discovery/v2/)
- [Event Seatmap（静态图、缺失情况、无 interactive seatmap）](https://developer.ticketmaster.com/products-and-docs/apis/international-discovery/v2/#event-seatmap)
- [Event Areas](https://developer.ticketmaster.com/products-and-docs/apis/international-discovery/v2/#event-areas)

### Partner API / Availability（受限入口）

官方 Partner API 文档直接说明：Partner API “unlike the Discovery API, is not an open API”，仅限与 Ticketmaster 已有官方分销关系的公司；它可 reserve、purchase、retrieve ticket and event information。文档还列出 native/link-over integrations、认证 key、生产/预生产地址和 partner certification checklist。

Availability 文档进一步说明：

- `GET /partners/v1/events/{event_id}/availability` 提供 ticket and seat availability。
- “Ticket Inventory and Seat Availability” 章节标注 **For use by Channel Partners only**。
- 返回当前未售座位库存和 reservation limit；该服务不应在用户正在下单时实时调用，数据可缓存较长时间，使用必须符合双方约定的速率限制。
- 官方要求联系 Ticketmaster 才能 enable 该能力。

因此，逐座库存、价格、offer、reserve、购买和订单位置都不应通过抓取公开 Ticketmaster 页面获得。MVP 只需要“解释座位/舞台几何”，可以完全不依赖 Partner API；将来若要展示当前可售座位或做购票闭环，再走正式商业合作和认证。

来源：

- [Ticketmaster Partner API](https://developer.ticketmaster.com/products-and-docs/apis/partner/)
- [Ticketmaster Availability API](https://developer.ticketmaster.com/products-and-docs/apis/partner/availability/)

### Ticketmaster 条款对本项目的影响

General Terms 规定 API 内容（事件名称、日期、时间、场馆名以及 Tickets/Attendees/Orders 等 Event Content）归组织者和/或 Ticketmaster 所有，授权是全球、非独家、不可转授权、不可转让；所有未明确授予的权利保留。条款还要求：

- 版权/内容所有者要求时，24 小时内从应用移除相关 Event Content；
- 在应用中披露收集、使用、存储和披露数据的隐私政策；
- 只能在提供服务所需的合理期限内缓存 Event Content；
- 不得复制或替代 Ticketmaster.com/官方 App 的独特核心购票体验；
- 不得把 API 当作通用图片托管或进行高频、伪装身份的抓取（具体限制以当前条款全文为准）。

对 SeatPeep 的边界是：保存事件 ID、来源 URL、抓取时间、归一化的自有几何和“来源/置信度”是合理的产品数据设计；长期镜像 Ticketmaster 座位图、把其静态图包装成票务数据库，或让用户在 SeatPeep 完成 Ticketmaster 购票，则需要重新审查许可和商业协议。

来源：[Ticketmaster General Terms of Use](https://developer.ticketmaster.com/support/terms-of-use/)、[Partner API Terms of Use](https://developer.ticketmaster.com/support/terms-of-use/partner/)

## AXS

AXS 的官方产品页把 AXS Anywhere 描述为把票销售到官方渠道、市场和平台，并把 Data Integrations & Partnerships、数据/分析和 API driven data feeds 作为商务产品；页面以 “Request a Demo” 作为入口，而不是公开 API key 注册。AXS 官方开发者入口为 [developers.axs.com](https://developers.axs.com/)，当前页面需要 JavaScript/访问授权，未公开可供普通开发者自助使用的座位图或库存 endpoint。

AXS 自己公开的合作案例显示，第三方 API 需要正式数据共享协议。例如 AXS 关于英国数字票的官方文章写明，为了让不同售票代理的票通过场馆 App 入场，AXS 与竞争方建立第三方集成并使用数据共享协议；这属于合作模式的证据，不是对公众开放的抓取许可。

AXS UK 官方网站条款明确禁止使用 robot、spider、offline reader 或其他自动方式去 retrieve/index/data mine/reproduce 网站内容，也禁止对交易/票务页面进行重复查询；因此不能把 AXS 公开网页当作无授权数据源。

对 SeatPeep 的可执行策略：

1. 先只保存 AXS 事件的官方 deep link（在允许的品牌/合作范围内），不抓取网页座位图。
2. 如果某个目标场馆由 AXS 运营，向场馆或 AXS 申请只读 event/seatmap feed，要求明确允许缓存、再展示和派生几何。
3. 在没有书面授权前，不把 AXS 的实时库存、价格、逐座数据或前端接口纳入产品。

来源：

- [AXS Partnerships & Integrations](https://solutions.axs.com/us/partnerships-integrations/)
- [AXS 官方开发者入口](https://developers.axs.com/)
- [AXS：第三方 API 与数据共享协议案例](https://solutions.axs.com/uk/2022/11/16/all-together-for-fans/)
- [AXS UK Terms of Use](https://www.axs.com/uk/about-terms-of-use_UK_v4.html)

## See Tickets

See Tickets 官方 ticketing 产品页公开“API Integration”栏目，列出的典型集成对象是 access control、CRM 和 financial reporting platforms；页面还介绍销售、门票类型和客户支持。该页没有公开通用的 seatmap、section/row/seat 或库存 API 规范，也没有公开普通开发者自助申请 key 的流程。

因此，See Tickets 可以作为“具体场馆/主办方商务接入”的候选，而不是 MVP 的公开数据 API：先确认目标演出由谁售票，再向 See Tickets 或主办方索取 event layout/seatmap feed、授权范围、缓存期限、速率限制和下游展示条件。

来源：[See Tickets Ticketing / API Integration](https://group.seetickets.com/ticketing/)

## Eventbrite

Eventbrite 官方开发者平台把能力分成三类：把公开活动数据库带到自己的产品、在网站中收集报名/售票、以及查看和管理组织者自己的 events/attendees/orders。当前 API 文档提供事件和场馆资源，例如：

```text
GET /events/{event_id}/
GET /venues/{venue_id}/
GET /venues/{venue_id}/events/
```

这些接口需要 API key 或 OAuth，并受资源权限约束。Eventbrite 的 OAuth 文档要求应用和用户分别完成认证。Eventbrite 官方法律页还把 API Terms of Use 单列为第三方开发者应遵守的条款。

旧教程里的全局 Event Search API 已被官方标为 deprecated/关闭；接入前应以当前 `platform/new/api` 文档和账号可用 scope 为准。

Eventbrite 的活动/场馆模型没有承诺大型体育场的逐座坐标、排号拓扑或演出级舞台配置。因此它适合补充小型活动目录、场馆地址和组织者信息，不能用来替代 SeatPeep 的 venue geometry 或 Ticketmaster/场馆的 event seatmap。

来源：

- [Eventbrite for Developers](https://www.eventbrite.com/platform/)
- [Eventbrite API documentation](https://www.eventbrite.com/platform/new/api)
- [Eventbrite App OAuth Flow](https://www.eventbrite.com/platform/docs/app-oauth-flow)
- [Eventbrite Legal Terms（含 API Terms of Use 入口）](https://www.eventbrite.com/corporate/legal/legalterms/)
- [Eventbrite 旧 Event Search API 已弃用说明](https://www.eventbrite.com/platform/docs/by-date)

## 场馆/主办方数据从哪里来

对 2D/3D 和舞台准确性，最可信的来源通常按以下顺序排列：

1. **该场演出的官方 seat map / ticket map**：售票页、官方 PDF/PNG、官方票务 feed；优先决定舞台、内场、封闭看台和站席范围。
2. **场馆官方 venue map / seating chart**：用于固定看台分区、层数、通道、无障碍和座位编号校准。
3. **票务平台事件级 seatmap**：例如 Ticketmaster 的 `seatmap.staticUrl`；作为可追溯的图形输入。
4. **场馆/主办方书面提供的 CAD、BIM、GLTF/OBJ 或坐标数据**：可建立高精度 3D，但必须取得再展示/派生作品许可。
5. **公开照片、社交平台座位视角、用户上传票图**：只能作为交叉验证，不能单独证明舞台或座位坐标。
6. **固定参数化模型**：只能在没有演出级资料时提供“示意/估算”，必须在 UI 标注置信度。

关键原则：**场馆模型和演出布局是两层数据。** 同一场馆可有端舞台、中央舞台、四面台、延伸台、封闭扇区、内场站席等多个 event layout；若只拿 venue geometry 而没有 event layout，舞台“挤到座位”或分区错位是预期风险，不应标成“准确”。

## 对 SeatPeep 的推荐数据模型

不要把票务平台的图片或逐座库存直接塞进 venue JSON。建议增加独立的来源和演出布局层：

```js
{
  "provider": "ticketmaster-discovery",
  "eventId": "tm-event-id",
  "venueId": "tm-venue-id",
  "sourceUrl": "https://...",
  "seatmapUrl": "https://.../static-seatmap.png",
  "retrievedAt": "2026-10-25T00:00:00Z",
  "layout": {
    "stage": { "kind": "end-stage", "polygon": [[...]] },
    "floorZones": [{ "id": "floor-a", "kind": "seated" }],
    "closedSections": ["101", "102"],
    "standingZones": []
  },
  "geometrySource": "operator-traced",
  "confidence": "verified-by-official-seatmap",
  "license": {
    "display": "derived-geometry-only",
    "expiresAt": null,
    "removalContact": "..."
  }
}
```

建议的置信度枚举：

- `official-coordinates`：场馆/票务方提供坐标或 CAD，且许可明确；
- `verified-by-official-seatmap`：以该场演出官方图校准，人工复核；
- `operator-traced`：依据官方静态图描摹为自有几何；
- `estimated`：只有通用场馆模型或公开照片，不能用于承诺距离/视野精度。

## MVP 的最短可行路径

### 阶段 1：只读事件和静态 seatmap

1. 服务端保存 Ticketmaster Discovery API key。
2. 定时按国家、城市、艺人、场馆同步事件和 venue 元数据。
3. 事件详情如果存在 `seatmap.staticUrl`，只保存来源 URL、哈希、抓取时间和许可状态；不要把 Ticketmaster 图床当作自己的永久 CDN。
4. 运营工具显示静态图，人工标注舞台、延伸台、内场、封闭区和层级。
5. 导出 SeatPeep 自有 `eventLayout` 几何，前端只渲染自有数据，并在页面显示来源和置信度。

### 阶段 2：质量验证

- 每个 event layout 至少通过一张官方票图和一份场馆官方座位图交叉验证。
- 随机抽查 2D section、层级、舞台距离；发现冲突时降级为 `estimated` 或下线该布局。
- 对没有 seatmap 的 general admission、festival、package event 显示“暂无演出级布局”，不要套用默认舞台。
- 记录 `lastVerifiedAt` 和 `verifiedBy`，让运营可逐场修订。

### 阶段 3：商业合作（可选）

- Ticketmaster：申请 Partner/Channel Partner，取得 Availability/seat-level 权限；单独评估条款、缓存、品牌和购票流程限制。
- AXS/See Tickets：与具体场馆或主办方谈只读 feed 或 event layout 合作，书面确认派生几何的展示许可。
- 场馆：签署 venue data license，明确 CAD/GLTF 的使用、再分发、撤回和更新周期。

## 不应采取的方式

- 不抓取 Ticketmaster、AXS、See Tickets 的前端内部接口来伪造公开 API。
- 不把别人页面的静态图、3D 资产或座位坐标原样复制到 SeatPeep 的 CDN。
- 不把实时库存/价格/逐座信息写入公开 venue JSON；这些数据通常是短时、权限受限且会快速变化的。
- 不在没有演出级证据时对用户承诺“距离舞台 X 米”或“视野一定无遮挡”。应显示估算值和误差等级。

## 最终建议

SeatPeep 的欧美 MVP 应采用 **“Discovery API 做事件发现，官方 event seatmap 做舞台/分区输入，自有几何做 2D/3D 渲染，实时票务留给合作阶段”** 的架构。这条路线能覆盖大量 Ticketmaster 市场，同时避开把受限库存接口、公开网页抓取和票务平台图片托管误当成合法数据源。

如果要尽快上线，第一批优先做 Ticketmaster 覆盖强、且有明确演出 seatmap 的 20–50 个场馆；每个场馆先做 1–3 个真实演出布局，达到“按场次切换舞台”的产品价值，再扩充场馆数量。没有官方 event seatmap 的演出保留场馆总览，但不生成看似精确的舞台和逐座视图。
