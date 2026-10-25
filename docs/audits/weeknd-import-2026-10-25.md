# The Weeknd 2026 近六个月导入审计

**审计日期：** 2026-10-25  
**窗口：** 2026-04-25 至 2026-10-25（当地日期，含首尾）  
**数据包：** `data/artist-events/the-weeknd-after-hours-til-dawn-2026.json`

## 结果

- 58 场演出候选；
- 24 个场馆、24 个城市；
- 20 个场馆只保留在候选资料层，未写入永久场馆目录；Wembley 和 Belluna Dome 复用已有目录；
- 39 场具备官方场馆、票务或交互地图参考，19 场目前只有场馆/票务身份参考；
- 0 场已经取得可复现的事件级逐座坐标；
- 0 场被标记为已核验的 The Weeknd 临时舞台 CAD；
- 所有事件保持 `candidate`，事件布局保持 `unconfirmed`，不会把常规体育场壳体误报成当场演唱会布局。
- 研究、候选、发布三层已分离；当前发布层为空，候选事件不会出现在普通场馆事件列表。

## 已执行检查

```text
npm run artist:import:weeknd   # 幂等导入，0 个重复覆盖
npm run artist:validate        # 2/2 通过
npm test                       # 115/115 通过
scripts/audit-scenes.mjs       # 197 个场馆、582 个布局组合、0 个座位/表面碰撞或舞台越界
```

几何审计同时检查有限坐标、座位/看台表面碰撞和舞台矩形是否落在场馆 footprint 内。它不能证明每个 The Weeknd 场次的真实舞台方向、封区和逐座位置；没有事件级布局的场次不会渲染通用舞台。

## Observations

研究资料包保存了官方艺人巡演页、Republic Records/PR Newswire、Ticketmaster Brasil、Live Nation Europe/Asia/Japan 和场馆官方座位资料。巴西票务页明确有 `MAPAS E PREÇOS`；Belluna Dome 官方资料给出 Arena Reserved/Stage Front 等票档；曼彻斯特 Ticketmaster UK 页面能区分 standing 和 seated；巴黎、阿姆斯特丹、Wembley、Croke Park、高阳和香港 Kai Tak 的官方资料提供了场馆级或场次级座位参考。Kai Tak 的 Live Nation HK 入场通知还提供了官方 venue site map 下载链接。

导入脚本会把场馆身份、城市/国家、座位结构、来源 URL 和精度状态写入候选资料，把演出日期、场馆、官方来源和座位图参考状态写入候选事件文件；它不修改正式目录或正式事件库。

## Inferences

这些公开资料足以先做场馆选择、看台层级和“公开参考”的产品入口，也足以指导事件级人工描摹。它们不足以自动生成可靠的 3D 舞台、延伸台、FOH、封闭看台或米制距离；这些字段必须逐场绑定票务图或制作方资料，再进入 `source-matched → geometry-checked → reviewed`。

## Unknowns

- Ticketmaster/Live Nation 页面是否允许将座位图缓存或商业再分发，当前没有得到统一许可；项目只保存引用和元数据，不复制第三方图片到静态资源。
- 事件座位图可能在售票、场馆调整或演出当天变化；当前导入不代表实时库存或最终现场配置。
- 没有 API key 时，Ticketmaster Discovery 只能使用已有缓存和公开官方页面，不能保证拿到每场的结构化座位图。

## 来源

- [The Weeknd 官方巡演页](https://www.theweeknd.com/tour/)
- [Ticketmaster Brasil 巴西活动页](https://www.ticketmaster.com.br/event/the-weeknd-sp)
- [Live Nation Asia The Weeknd 页面](https://www.livenation.asia/the-weeknd-tickets-adp474869)
- 完整逐场来源和座位证据等级见 [研究报告](../research/the-weeknd-concerts-2026-04-25-to-2026-10-25.md)。
