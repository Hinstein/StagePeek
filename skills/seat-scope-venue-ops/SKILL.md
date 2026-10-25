---
name: seat-scope-venue-ops
description: "Manage StagePeek venue and concert data: discover official venue and event sources, import public ticket seat-map references, create event-specific 2D/3D layout drafts, validate geometry and provenance, and publish only reviewed versions. Use when the user asks to add venues, add concerts, sync ticketing data, import seat maps, repair stage placement, or automatically fill the StagePeek catalog."
---

# StagePeek 场馆与演出录入

这个 Skill 面向 `/Users/lilinhai/Projects/rea/seatpeep`。它负责把一个场馆或一场演唱会变成 StagePeek 可审计的候选数据和事件级布局，并在来源证据不足时停在草稿状态。

## 先判断用户要做什么

- 用户说“录入/添加/补上某个场馆”：先建立场馆身份、国家/城市、官方场馆来源和永久座位壳体；随后同步该场馆的未来音乐事件。
- 用户说“录入/添加某场演唱会”：先锁定供应商事件 ID、日期、场馆和官方票务 URL，再获取公开座位图并创建事件级布局草稿。
- 用户说“自动补齐/同步所有场馆”：遍历当前目录，保留已确认数据，批量更新事件候选；不能用模糊名称覆盖已有几何。
- 用户说“舞台不对/座位图不准”：进入来源核验和布局修复流程，优先找到该场次的官方或票务座位图，不能只调渲染参数掩盖误差。

不要把照片、库存或票价工作混入最小场馆录入，除非用户明确要求。

## 工作目录和现有命令

```text
项目：/Users/lilinhai/Projects/rea/seatpeep
场馆目录：data/venues.json
人工来源清单：data/manual-venues/
事件来源与手工布局：server/events.mjs、data/events.json
票务事件缓存：data/ticketing/ticketmaster-events.json
场景批量检查：scripts/audit-scenes.mjs
```

常用命令：

```bash
cd /Users/lilinhai/Projects/rea/seatpeep
npm run ticketing:sync -- --venue <venue-id>
node scripts/audit-scenes.mjs docs/audits/scenes-<date>.json
npm test
```

Ticketmaster API key 只从服务端环境变量 `TICKETMASTER_API_KEY` 读取。绝不把密钥写入前端、日志、提交或聊天。没有 key 时仍可使用已有缓存、官方场馆页面和公开票务链接完成候选或人工导入，但要明确标记数据范围。

## 标准流程

### 1. 建立场馆身份

先在官方场馆页、票务供应商或可信场馆资料中确认名称、城市、国家和地址。优先保存供应商 `venueId`；名称只能作为搜索条件，不能作为唯一身份。中文或非 ASCII 名称归一化后为空时必须拒绝匹配并改用 ID、地址和城市国家组合。

检查是否已有同一场馆 ID 或别名。已有场馆只增量更新来源和事件，不重建或覆盖人工校准的永久几何。

### 2. 发现演出

优先使用官方场馆事件页和 Ticketmaster Discovery API。保存：供应商、事件 ID、名称、开始日期、时区、场馆 ID、官方 URL、抓取时间和来源状态。分页读取结果；单页上限不是总结果数。

事件匹配至少满足：

- 供应商事件 ID或稳定官方事件 URL；
- 场馆 ID，或名称 + 城市 + 国家一致；
- 演出日期和时区一致；
- 音乐分类或官方页面可证明是演唱会。

可疑匹配进入 `candidate`，不能直接发布。

### 3. 获取并保留座位图来源

座位图按事件保存，不挂在永久场馆几何上。记录公开图片/SVG/JSON URL、来源页面、抓取时间、内容哈希和许可/再分发备注。优先顺序：

1. 官方或票务供应商 SVG/JSON/结构化座位数据；
2. 官方公开座位图图片；
3. 公开图片的人工描摹草稿；
4. 参数化估算，仅用于预览并标为 estimated。

公开可访问不等于获得商业再分发许可。未确认许可时保存引用和元数据，不把第三方图片打包进静态资源，也不把实时库存当作永久数据。

### 4. 创建事件级布局

把永久场馆壳体和演唱会临时布局分开。事件布局可包含：主舞台、延伸台、侧台、屏幕、FOH、封闭分区、内场和临时座位块。2D 与 3D 必须共享同一坐标系，事件版本不能修改永久场馆默认布局。

每个字段分别标记来源和精度：

- `source`：来源直接给出的 ID/坐标；
- `operator-traced`：依据来源图人工描摹；
- `estimated`：由场馆尺寸、比例或参数模型估计；
- `unverified`：还没有足够证据。

不能为了让座位避开舞台而自动缩放或移动真实来源几何。自动拟合产生的 previewScale 只能作为草稿提示。

### 5. 自动几何检查

运行 `scripts/audit-scenes.mjs`，至少检查：

- 坐标是否有限，多边形是否闭合、连通、不自交；
- 座位、行带和看台表面是否穿过舞台、屏幕、FOH 或设备区；
- 通道和来源图缺口是否被座位桥接；
- 2D 和 3D 点击是否返回同一个分区/座位；
- 事件舞台是否脱离永久场馆默认值；
- 切换事件、深链接、清缓存加载和移动端手势是否仍保持同一布局。

几何通过只代表模型内部自洽，不代表真实演唱会布局正确。

### 6. 独立来源校验和发布门槛

发布前必须把来源座位图与生成的 2D 图叠加或并排比较，并检查独立的分区编号、分区间隙、舞台方向、封闭看台和内场边界。用未参与拟合的锚点做 holdout 检查；有实测距离才标米制准确，没有就显示估算。

状态只能按下列顺序推进：

```text
candidate -> source-matched -> geometry-checked -> reviewed -> preview-published
```

任何来源、编号、舞台方向或比例检查失败，保留候选和失败原因，页面显示“布局待核实”。已发布事件使用不可变版本，保留上一版本以便回滚。

## 不同请求的默认交付

### 录入一个场馆

完成场馆身份、国家分组、官方来源、可用楼层/分区、默认 2D/3D 壳体和未来事件候选。运行场景审计，给出来源覆盖率和哪些字段仍是估算。不要凭一张体育馆照片伪造逐座 ID。

### 录入一场演唱会

完成事件身份、公开座位图引用、舞台和封区草稿、2D/3D 预览、距离估算和审计文件。只有来源匹配和人工复核通过，才进入 `reviewed`。若只有图片没有米制或逐座坐标，明确显示“座位/尺寸为参考或估算”。

### 自动补齐目录

先生成增量候选报告，再写入缓存；每批最多处理有限数量并保留失败项。必须保留已有人工布局和来源版本。同步完成后运行全量场景审计和测试，并输出：新增事件数、带公开座位图数量、已核验布局数量、待复核数量、失败数量和回滚文件。

## 交付时必须说明

报告中区分 observations、inferences 和 unknowns。至少写清：

- 哪些是官方事件/票务来源；
- 哪些是人工描摹；
- 哪些是逐座真实数据；
- 哪些是模拟座位和估算距离；
- 哪些接口或版权许可仍未知；
- 自动检查的范围和它不能证明的事实。

当用户只说“帮我补上”时，默认执行可逆的候选导入和校验，完成后再报告哪些可以直接预览、哪些必须人工确认；不要因缺少第三方 API key 而停止所有工作。

## 详细字段和状态

需要设计或检查数据结构时，读取 [references/data-model-and-gates.md](references/data-model-and-gates.md)。涉及欧美票务提供商、公开座位图使用边界或 Ticketmaster/AXS/See Tickets 时，读取 [references/provider-and-rights.md](references/provider-and-rights.md)。
