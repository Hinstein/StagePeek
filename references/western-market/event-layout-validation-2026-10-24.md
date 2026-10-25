# MVP 演出布局参考核验（2026-10-24）

## 结论

`seatpeep/server/events.mjs` 中的 5 条 `LAYOUT_REFERENCES` 均能与一个公开的一手演出页面建立“场馆 + 演出 + 日期”的对应关系。这个核验足以证明这些 URL 是合理的**公开参考入口**，但不足以证明图片/座位图已经是该场次最终排版，也不足以证明它们包含完整逐座库存、舞台精确坐标或真实可用性。产品里继续标记 `reference-only` 是必要的。

最需要修正的产品语义是：当前 `reference-only` 同时覆盖了三种证据强度——（1）官方页面确认了演出；（2）售票平台页面展示了一个参考图；（3）静态图片 URL 只是根据售票事件 ID 构造、但当前页面没有公开可验证图。建议下一版把“事件已确认”和“地图已确认”拆成独立字段，避免把事件确认误解为舞台/座位图确认。

## 逐项核验

### Tottenham Hotspur Stadium — KAROL G, 2027-07-06

- 场馆官方演出页明确写出 Karol G 在 Tottenham Hotspur Stadium 于 **2027-07-06（星期二）**演出，并说明为 `Viajando Por El Mundo Tropitour`；页面还明确列出“Reserved seating and standing”。来源：[Tottenham 官方演出页](https://www.tottenhamhotspurstadium.com/events/1021367/karol-g)。
- Ticketmaster UK 场馆页同样列出 **6 July 2027, 17:30** 的 Karol G 场次，并在其 seating chart 下显示“Karol G at Tottenham Hotspur Stadium seat map”。该页明确警告图示为参考用途且不反映可售库存。来源：[Ticketmaster UK 场馆页](https://www.ticketmaster.co.uk/tottenham-hotspur-stadium-tickets-london/venue/434396?language=en-gb)（页面文字位于 seating chart 段落）。
- `events.mjs` 使用的 `https://s1.ticketm.net/uk/tmimages/venue/maps/uk1/32451s.gif` 是 Ticketmaster 页面给出的公开图片链接；本次研究工具不能读取 GIF 二进制，但页面链接本身是可见的。
- 可证明：日期、场馆、演出名称、存在一个“Karol G seat map”参考入口。
- 不能证明：GIF 是否为最终演出舞台方向、是否包含全部座位、是否与最终售票图相同；官方页没有公开机器可读的舞台坐标。

### SoFi Stadium — JAŸ-Z 30, 2026-10-24

- SoFi Stadium 官方活动页明确写出 `JAŸ-Z 30`、日期 **2026-10-24**、开演 **20:00**，并提供 Ticketmaster 的购票入口。来源：[SoFi 官方活动页](https://www.sofistadium.com/events/detail/jay-z-october-24-2026)。
- SoFi 官方活动列表也同时列出 2026-10-23 和 2026-10-24 两晚 `JAŸ-Z 30`，因此 10 月 24 日不是从场馆通用日期推断出来的。来源：[SoFi 官方 Events](https://www.sofistadium.com/events)。
- `events.mjs` 的 `sourcePage` 指向 Ticketmaster event ID `0A0064C8E971D777`，`image` 指向 Ticketmaster `mapsapi.tmol.io` 的该 event ID 静态图端点。当前公开文本抓取无法读取该 PNG 端点，不能独立确认图像内容或其最终舞台方向。
- 可证明：官方场馆与日期/演出对应，Ticketmaster event ID 被作为参考入口保存。
- 不能证明：静态图端点在当前时刻返回的图一定是最终图；不能从公开活动页推出座位编号到三维坐标的映射。

### SoFi Stadium — The R&B Tour（Usher Raymond & Chris Brown）, 2026-11-15

- SoFi 官方活动页明确写出 **2026-11-15、19:30**，并说明这是由于需求增加而增加的场次。来源：[SoFi 官方活动页](https://www.sofistadium.com/events/detail/chris-brown-usher-november-15)。
- SoFi 官方新闻稿也明确说明 11 月 15 日是新增的第三场，并列出 SoFi 的 9 月 25、9 月 26、11 月 15 三个日期。来源：[SoFi 官方新闻稿](https://www.sofistadium.com/news/detail/usher-and-chris-brown-reveal-dates-for-2026-co-headlining-stadium-tour)。
- Ticketmaster 的 event page 对应同一日期、场馆和演出，并显示开演时间由 19:00 改为 19:30，说明时间可能发生运营调整。来源：[Ticketmaster event page](https://www.ticketmaster.com/the-r-b-tour-starring-usher-raymond-chris-brown-inglewood-11-15-2026/event/0A006494C5CE878D)。
- `events.mjs` 的 `sourcePage` 和静态图端点使用该 Ticketmaster event ID；本次公开抓取未能读取静态 PNG，因此不能把 `image` 字段解释为已核实的最终布局。
- 可证明：演出、日期、场馆与 Ticketmaster event ID 的对应关系；时间应以官方/售票页最新值为准。
- 不能证明：图中舞台、封区、站票边界、逐座编号及三维舞台位置。

### MetLife Stadium — Zach Bryan, 2027-05-14

- MetLife 官方活动页明确写出 `Young Manhood and Other Donatable Organs Tour`，日期 **2027-05-14 至 2027-05-15**，其中 5 月 14 日为 19:00；页面说明演出在 MetLife Stadium 举行。来源：[MetLife 官方活动页](https://www.metlifestadium.com/events/detail/zach-bryan)。
- Ticketmaster event page 对应 **2027-05-14 19:00、MetLife Stadium**；搜索索引还显示该页有 Seat Map 段落并提醒座位图是通用布局、可能随活动变化。来源：[Ticketmaster Zach Bryan event](https://www.ticketmaster.com/zach-bryan-east-rutherford-new-jersey-05-14-2027/event/0000654CE2BEAC96)。
- `events.mjs` 的 static image URL 使用该 event ID，并附带 `sectionColor` 与 `sectionLevel` 参数。当前页面文本抓取没有返回图片二进制，不能独立确认端点当前是否仍返回图。
- 可证明：官方活动日期/场馆、Ticketmaster event ID、存在一个售票图参考入口。
- 不能证明：该参考图就是 5 月 14 日最终的演唱会配置；MetLife 官方页没有公开舞台朝向或逐座 JSON。

### MetLife Stadium — Bon Jovi: Forever Tour, 2027-07-15

- MetLife 官方活动页明确写出 `Forever Tour`，日期 **2027-07-15**；页面说明开演时间仍为 `TBA`，并链接至 Bon Jovi 预售注册。来源：[MetLife 官方活动页](https://www.metlifestadium.com/events/detail/bon-jovi)。
- MetLife 官方新闻稿明确宣布 Bon Jovi 于 **2027-07-15** 在 MetLife Stadium 演出。来源：[MetLife 官方新闻稿](https://www.metlifestadium.com/news/detail/bon-jovi-to-bring-the-forever-tour-to-metlife-stadium-on-july-15)。
- Ticketmaster event page 对应同一日期、场馆和演出，但当前页面明确显示“final layout and seat map ... subject to change”，并且当次抓取显示 `The Seating Chart is currently unavailable`。来源：[Ticketmaster Bon Jovi event](https://www.ticketmaster.com/bon-jovi-east-rutherford-new-jersey-07-15-2027/event/00006550B4D5AF70)。
- 因此，`events.mjs` 中 Bon Jovi 的 static image URL 只能标记为**待确认售票图入口**；在 Ticketmaster 页面显示 unavailable 时，不应向用户宣称已经拿到该场次座位图。
- 可证明：日期、场馆、演出、Ticketmaster event ID。
- 不能证明：最终座位图、舞台方向、票面分区，尤其不能证明静态 URL 在页面当前状态下可用。

## 对 MVP 数据模型的建议

1. 保留现有 `layout.status = "reference-only"`，因为所有 5 条都不应被当作完整或实时库存。
2. 增加独立证据字段（名称可调整）：
   - `eventVerification: "official-venue" | "ticketmaster-event"`
   - `mapVerification: "ticketmaster-image-visible" | "ticketmaster-page-unavailable" | "url-unchecked"`
   - `stageVerification: "unknown"`（除非取得官方场次图或现场核验）
3. 对 MetLife Bon Jovi 直接显示“座位图待售票平台发布”，而不是“已加载布局”。
4. 对 SoFi 两场保留 event ID，但在静态图端点未成功读取前，UI 文案应使用“售票平台参考图链接”而非“该场最终座位图”。
5. 对 Tottenham 可以显示“Karol G 参考座位图”，但仍需注明 Ticketmaster 的“reference only / availability not reflected”警告。

## 对准确性的影响

这 5 条参考的准确性可以分成三层：

| 层级 | 当前证据 | 可用于 MVP 的内容 |
|---|---|---|
| A：事件身份 | 官方场馆页 + 售票页日期/场馆/名称 | 展示演出列表、把用户选中的演出与参考链接关联 |
| B：参考图存在 | Ticketmaster seating chart 或图片链接 | 提供外链/参考图，辅助人工检查 2D 分区 |
| C：几何与逐座 | 公开页面未给出受验证的 XYZ、完整逐座 JSON、最终舞台坐标 | 不能作为真实距离、视线遮挡或精确座位视角依据 |

当前三馆 MVP 应继续把几何和“距离舞台”标为示意/估算；这一结论由售票平台自己“图示可能变化、不反映可售性”的声明支持，而不是对图片做了额外推断。

## 来源与采集边界

- 只使用官方场馆页面、场馆官方新闻稿和 Ticketmaster 公开活动/场馆页面。
- 没有登录、购买、绕过验证码、读取票务账户或抓取实时库存。
- `mapsapi.tmol.io` 的静态图 URL 在当前文本抓取工具中不可读取，不能把 HTTP URL 的存在当成图像内容已经核验。
- 所有日期以 2026-10-24 这次访问看到的页面为准；活动售票图与舞台配置可能在售票前后变化。
