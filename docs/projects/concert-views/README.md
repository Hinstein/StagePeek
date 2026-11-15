# 演唱会视角子项目

这个目录说明合并后的边界。主站的账户、登录、支付、订阅、多语言和公开目录继续跟随 `main`；十个本地研究场馆的数据、演出内场和模型仍由演唱会视角子项目负责；本地演唱会场景的控件、配色和相机交互统一由公共组件负责。生产页面与业务流程以已审核基线为准。

## 运行入口

本地中文预览入口是 `/zh-CN/concert-views`（`/concert-views` 仍兼容），接口统一在 `/api/concert-views/` 下。它只在本地开发、loopback 和开发预览开关同时打开时暴露，不进入公开目录。

整合起点保留（新增八馆见下方十馆批次）：

- The O2 Arena：场馆座位、O2a 3D 模型、Cody Johnson 与 J. Cole 两个本地演出布局。
- OVO Hydro：场馆座位、Noah Kahan 两个日期的演出视图、参考编号与明确标注的推演编号。

原始 14,389 个 O2 来源座位、Hydro 的来源图和研究文档保持独立；示意补全、推演编号和事件内场不能写成真实票务库存。

## 代码边界

- `public/index.html`、`public/style.css`、`server/public-pages.mjs`：已审核生产页面模板、样式、导航、页脚和业务入口；不在场馆项目复制。
- `public/venue-picker.mjs`：从生产实现抽出的国家 → 场馆筛选，主站与本地场景共同调用，保持原有排序、权限与空选项行为。
- `public/venue-view/`：本地演唱会场景的公共工具栏、图层、暗紫配色、手机取景和固定眼位策略；不接管生产首页和普通探索页。
- `public/concert-views/`：十馆模型、座位查询和演出适配，只拥有场景与场景状态，不创建第二套外层页面。
- `server/concert-views/page.mjs`：读取实际生产 `public/index.html`，只替换场景槽位并接入本地数据；外层查询、步骤、位置卡、演出侧栏、指南与导航由生产模板提供。
- `server/concert-views/`、`data/concert-views/`：本地只读接口与精选研究快照。
- `docs/projects/concert-views/`：方法、来源、设计文稿与验收记录。

当前生产基线为 `2e7cf06ac4f7e21d028f02acd96661c73f6c84d7`。生产首页、普通探索 viewer、地图状态、演出目录与原型预览已逐字恢复；账户、登录、支付、订阅和语言包保留生产实现。主站 `public/app.mjs` 仅将既有筛选抽成共享函数，服务端仅增加受本地开关与 loopback 限制的场景路由。旧独立 `public/concert-views/index.html` 与 `style.css` 已归档并移除，两个静态地址返回 404；不再注入 `entry-link.mjs`。

## 归档

合并前工作区的完整快照在：
`/Users/lilinhai/Projects/seatpeep/archives/2026-11-02-before-main-integration/`

其中 `working-files.tar.gz` 保存文件，`working-tree.patch` 保存当时的未提交差异，`manifest.json` 保存路径、大小、SHA-256、原始 HEAD 和 main 基线。历史设计、研究文案和截图仍在该快照中；恢复时解到临时目录，不要覆盖当前工作树。

本次合并的边界记录在 [archive README](../../../archives/2026-11-02-main-integration/README.md)。

## 方法和设计文稿

- [场馆外壳与演出流程](venue-shell-event-workflow.md)
- [O2 建模方法](o2-render-method-2026-10-30.md)
- [首批范围与设计](render-batch-1-design.md)
- [视觉参考与来源](o2-seating-visual-references-2026-10-30.md)

场馆外壳与演出流程持续维护当前规范；其余文稿保留建模和来源历史。历史相对链接按合并前路径解释，完整资料见快照索引。主站设计和产品文案以 main 为准，不把历史稿覆盖到主站。

## 验收入口

- O2：[/concert-views?venue=twcv-the-o2-arena-london&layout=o2a&mode=3d](/concert-views?venue=twcv-the-o2-arena-london&layout=o2a&mode=3d)
- Hydro：[/concert-views?venue=ovo-hydro&data=source&mode=3d](/concert-views?venue=ovo-hydro&data=source&mode=3d)
- 主站：`/explore`；账户与套餐走 main 原有入口。

本版本于 2026-11-04 整合到本地 main，保留此前已合入的用户管理后台；未推送、未部署。完整功能保留手机取景、屋顶、缩放、舞台人物、观众视角、内场示意入座和演出切换；未发布、权利未决、尺度未校准。

## 生产页面恢复验收（2026-11-04）

已恢复国家 → 场馆筛选、生产导航与页脚、查询表单和步骤、位置卡、演出侧栏及指南。场馆显示名不再拼接括号地区，地区仅由国家筛选和城市说明展示；原始来源名称不改写。十馆模型、演出布局、编号、舞台人物、屋顶、手机 1–10×、固定眼位和暗紫主题保留在本地场景中。

本地演唱会与入口测试 **99/99 通过**。连同生产页面、登录与语言等检查共 **136 条：135 通过，1 条生产基线既有失败**：`interface-locales` 的中文密码恢复链接期望 `lang=zh-CN`，生产实现返回 `lang=en`；对应实现与测试均与基线逐字一致，本次未改动认证行为。`npm run check`、改动模块语法与 `git diff --check` 通过。

实际浏览器核对国家切换清空场馆、美国五馆及英国两馆列表、O2 → Hydro → Ziggo 切换、共用表单、Hydro 208/C/121 查询及 5.4× 手机取景刷新保留眼位；390px 无横向溢出。代表画面：[O2 生产外壳](preview/production-shell-o2.png)、[Hydro 同一外壳](preview/production-shell-hydro.png)、[390px 页面](preview/production-shell-mobile.png)。测试记录：[回归日志](preview/production-shell-regression.log)、[语法检查](preview/production-shell-check.log)。这是本地整合，未部署、未验证真实线上支付。

旧界面及设计实现保存在 [恢复归档](../../../archives/2026-11-04-production-shell-restoration/README.md)，历史研究与设计文稿继续留存。以下 2026-11-03 记录为当时实现历史；涉及主站共用组件、额外导航与旧保护例外的描述，均由本节和上面的代码边界取代。

## 本次整合验证（2026-11-03）

- 场馆与 HTTP 整合回归：63/63 通过；主站 118 个保护文件的字节哈希一致。
- `npm run check`、全部新增模块语法检查和 `git diff --check` 通过。
- 完整 `npm test`：260 条，251 通过、8 失败、1 跳过。未改动 main 上复现相同 8 失败：5 条 billing、1 条 HTTP 元数据、1 条语言回退、1 条注册重发。未修改这些测试或主站实现。
- 浏览器检查：O2 总览/内场区名/示意椅与人物、Hydro 推演查询/事件切换/刷新固定眼位、手机取景与屋顶、main 登录入口与套餐弹窗。390px 小屏无横向溢出。
- 此预览采用 main 的本地登录和支付演示模式，没有发起真实付款，也没有验证线上 Supabase 凭据或 Stripe 交易。

预览截图：[O2](preview/o2-overview.png)、[Hydro](preview/hydro-overview.png)、[手机取景](preview/hydro-phone-view.png)、[小屏](preview/o2-mobile.png)。测试日志同目录保留。

运行：在本工作树执行 `PORT=4188 HOST=127.0.0.1 APP_URL=http://127.0.0.1:4188 node scripts/start-local.mjs`。原 4187 工作区不受影响。

## 统一配色（2026-11-03）

O2 移除旧版绿色覆盖色，2D 和 3D 共用 `public/venue-view/venue-palette.mjs`，与 Hydro 约定一致：暗色背景、紫色座椅、青柠色选中分区、浅色区名。看台、通道、屋顶和内场示意椅同时调整；布局、编号和相机逻辑不变。场馆整合回归 63/63、主站保护文件检查及 `npm run check` 通过；浏览器复核 2D/3D 配色。

## 共用组件与新场馆接入约定（2026-11-03）

公共组件覆盖主站 `/explore` 的全部场馆、首页启德预览、鸟巢原型预览，以及本地 O2 和 Hydro。所有现有 3D 入口共用控件、配色和相机策略，带查询表单的入口共用表单组件：

| 共同部分 | 唯一实现 |
| --- | --- |
| 分区、排、座输入与提交规范 | `public/venue-view/venue-view-controls.mjs` 的 `mountVenueTicketForm()` |
| 2D/3D、总览、近区、观众、重置、舞台、屋顶、手机取景、倍率、全屏 | 同模块的 `mountVenueView()` |
| 工具栏、选中状态栏、手机 4:3 框和小屏布局 | `public/venue-view/venue-view.css` |
| 2D/3D 配色 | `public/venue-view/venue-palette.mjs` |
| 入座眼高、初始视角、倍率换算、拖动与变焦手势 | `public/venue-view/venue-camera-policy.mjs` |

固定相机规则：示意眼高 1.18 个模型单位，初始纵向 FOV 50°，手机取景内提供 1–10× 连续滑杆（0.1×步长）。入座后拖动只转头，滚轮或双指只改 FOV；两馆使用相同的手势灵敏度与变焦范围。切换 2D/3D 不重新入座。Hydro 切换演出保留眼位、朝向、倍率，旧 v1 相机链接继续可读。这些数值是展示约定，不是实测人体或场馆尺度。

场馆适配层仍分别负责几何和编号：主站的 `public/app.mjs` / `public/viewer.mjs`，本地 O2 的 `public/concert-views/app.mjs` / `viewer.mjs`，Hydro 的 `hydro-panel.mjs` / `hydro-viewer.mjs`，以及首页/原型的 `public/venue-preview.mjs`。适配层向组件提供 canvas、2D 地图、选中信息和楼层/演出插槽，处理 `onAction`，通过 `update()` 回报展示模式、相机模式、手机框、屋顶、倍率和功能可用性；退出时调用 `dispose()`。两馆渲染器没有强行合成一个几何引擎。

新增场馆遵循以下顺序：

1. 接场馆模型、座位与演出数据；来源编号、参考编号、推演编号保持各自含义。
2. 挂载共同表单和视图组件，接通动作和状态。已有功能不得另写一套按钮、配色或手势；没有数据支持的操作保留控件并禁用。
3. 在场馆适配层实现总览、近区、入座、舞台和场次切换；入座手势调用共同相机策略，不能移动眼位。
4. 验证查询、点击、2D/3D 切换、屋顶、手机 4:3、四档倍率、全屏和小屏，再检查相机不会因普通切换跳位。

本轮组件与场馆回归 67/67 通过，包含主站 118 个保护文件的哈希检查。实际浏览器核对两馆控件和暗紫配色、O2 内场区名/示意椅/舞台人物、两馆固定眼位拖动与变焦、Hydro 日期切换、手机框、屋顶和 390px 布局。手势测试包含双指倍率计算；浏览器使用真实鼠标拖动和滚轮，未声称完成真实手机设备测试。

本轮预览：[O2 共用控件](preview/shared-o2-desktop.png)、[Hydro 手机取景](preview/shared-hydro-phone.png)、[Hydro 小屏](preview/shared-hydro-mobile.png)。当前仍是本地整合工作树，主站登录、支付与公开目录继续由 main 维护。


## 全站组件接入与回归（2026-11-03）

本轮把公共实现从研究目录提升到 `public/venue-view/`，公开页面不依赖本地研究开关。旧的研究组件路径只保留转导，不能继续承载独立实现。首页与原型共享 `mountVenuePreview()`；通用目录场馆通过主站渲染器自动复用组件，无须逐馆复制。

后续场馆只能增加模型、座位和演出适配。工具栏、选座表单、暗紫配色、手机框、全屏和入座手势必须使用上述公共模块；无数据支持的功能通过状态禁用，不自行删除。渲染引擎可以不同，但不能自行维护另一套外观或相机规则。

`tests/venue-view-entrypoints.test.mjs` 扫描所有非 vendor 的公开模块，检查现有 3D 引擎对公共配色/相机策略的依赖、视图入口对公共控件的依赖，以及四个 HTML 入口的公共样式引用。新增引擎或入口应进入同一回归，不能仅在文档中声称复用。

全屏后的 canvas、SVG 和 4:3 手机框布局由公共样式负责。本轮实测发现旧 Hydro 全屏 CSS 会把迁入公共容器的 canvas 高度压到 0，已在公共容器规则中修复；桌面全屏与 390px 视口均复查画面可见。

验证：组件、场馆、HTTP、懒加载和公开页面相关回归 80/80 通过；`npm run check`、公共模块语法检查与 `git diff --check` 通过。浏览器实际检查主站启德入座/拖动/滚轮/2D–3D 切换固定眼位，首页预览选区/入座/全屏/手机框，鸟巢原型加载，以及 O2 内场标识/座椅/舞台人物、Hydro 演出切换/手机框/小屏。手机框在桌面和 390px 视口保持 4:3；未进行真实手机硬件测试，也未重跑或宣称整库测试全绿。

预览：[全站启德](preview/shared-all-kaitak.png)、[首页](preview/shared-all-home.png)、[O2 演出](preview/shared-all-o2.png)、[Hydro 手机框](preview/shared-all-hydro-phone.png)、[Hydro 小屏](preview/shared-all-hydro-mobile.png)。

## 十馆批次 · 2026-11-03

本次目标是总计十馆的本地演唱会视角。O2、Hydro 保留已验收模型；其余八馆按下表接入同一公共组件。日期是来源中的演出日期，巴黎和阿姆斯特丹为历史演出参考，不能写成近期演出。

| 顺序 | 场馆 | 本次演出 | 日期 | 来源座位 | 内场 |
| --- | --- | --- | --- | ---: | --- |
| 1 | The O2 Arena · London | Cody Johnson / J. Cole | 已保留场次 | 14,389 | 原版本保留 |
| 2 | OVO Hydro · Glasgow | Noah Kahan | 2026-11-05、06 | 分区来源＋示意编号 | 原版本保留 |
| 3 | Accor Arena · Paris | Lady Gaga · The MAYHEM Ball | 2025-11-17、18、20、22 | 14,493 | 三个站区 |
| 4 | Ziggo Dome · Amsterdam | Lady Gaga · The MAYHEM Ball | 2025-11-09 | 10,093 | 三个站区，区名为示意 |
| 5 | Uber Arena · Berlin | Muse · The Wow!Signal Tour | 2026-11-18 | 11,256 | 连通站区 |
| 6 | Kia Forum · Los Angeles | Don Omar | 2026-11-06 | 13,869 | 15 个座席区，1,841 把示意椅 |
| 7 | United Center · Chicago | KATSEYE | 2026-11-05 | 17,335 | 9 个座席区，984 把示意椅 |
| 8 | UBS Arena · New York | Anuel AA | 2026-11-06 | 14,429 | 5 个座席区，643 把示意椅 |
| 9 | Prudential Center · Newark | XG | 2026-11-14 | 14,979 | 8 个座席区，626 把示意椅 |
| 10 | State Farm Arena · Atlanta | Doja Cat · Tour Ma Vie | 2026-11-17 | 13,700 | 8 个座席区＋2 个 PIT，829 把示意椅 |

新增八馆共 110,154 条保留的来源座位。该数表示保留的来源资产覆盖，不代表完整现场库存或官方逐座实测。事件内场椅子没有票号，只提供拍摄/视角位置。舞台人物是统一比例的示意人物，不是艺人肖像。

### 逐馆入口

- [Accor / Lady Gaga](http://127.0.0.1:4188/concert-views?venue=twcv-accor-arena-paris&layout=acc&event=accor-gaga-20251117&mode=3d)
- [Ziggo / Lady Gaga](http://127.0.0.1:4188/concert-views?venue=twcv-ziggo-dome-amsterdam&layout=zgd&event=ziggo-gaga-20251109&mode=3d)
- [Uber / Muse](http://127.0.0.1:4188/concert-views?venue=twcv-uber-arena-berlin&layout=uba&event=uber-muse-20261118&mode=3d)
- [Kia Forum / Don Omar](http://127.0.0.1:4188/concert-views?venue=twcv-kia-forum-los-angeles&layout=kfo&event=kia-forum-don-omar-20261106&mode=3d)
- [United Center / KATSEYE](http://127.0.0.1:4188/concert-views?venue=twcv-united-center-chicago&layout=unc&event=unc-katseye-20261105&mode=3d)
- [UBS / Anuel AA](http://127.0.0.1:4188/concert-views?venue=twcv-ubs-arena-new-york&layout=ubs&event=ubs-anuel-aa-20261106&mode=3d)
- [Prudential / XG](http://127.0.0.1:4188/concert-views?venue=twcv-prudential-center-newark&layout=pru&event=pru-xg-20261114&mode=3d)
- [State Farm / Doja Cat](http://127.0.0.1:4188/concert-views?venue=twcv-state-farm-arena-atlanta&layout=sfa&event=sfa-doja-cat-20261117&mode=3d)

### 共享实现与资料边界

`source-bowl-display.mjs` 保留八馆来源椅子及其身份，通过 `source-bank-shell.mjs` 另建连续排面、立面、侧后封闭面和层间支撑，保留来源座位 XYZ；`source-event-display.mjs` 统一生成事件区内的标签锚点、舞台人物锚点和可点击示意椅。非凸区域的标签落在区域内部；座席完整脚印避开舞台、设备、区外和洞，保留中间通道。2D/3D 共同引用同一对象，不能各自生成另一套位置。

演出原件、描摹配方与哈希在 `data/research-events/<event>/`，不可变草稿在 `data/research-events/ticket-map-pipeline/`。巴黎/阿姆斯特丹的低分辨率图不支持准确的内场编号；柏林及美区票图同样没有据此创建真实内场票号。资料配准未通过独立米制校准，不计算精确距离。

这是座位和演出布局的研究视图：来源资产里的空区仍保留，尚未建立完整建筑 CAD、包厢立面和层间结构。不能把来源缺口自动解释为现场疏散口。暗紫配色、表单、全屏、屋顶、手机框和相机手势全部复用 `public/venue-view/`，没有新增逐馆的工具栏实现。

### 十馆验收记录

本轮相关测试 **81/81 通过**，包含来源身份与坐标保持、排面支撑、舞台设备冲突、内场椅子脚印、共享组件入口和主站保护文件检查；`npm run check`、四个新增/调整的展示模块语法检查及 `git diff --check` 通过。没有宣称整库测试全绿。日志：[本轮回归](preview/ten-venue-final-tests.log)。

新增八馆逐馆实测：来源区排座查询 → 入座 → 拖动与滚轮 → 2× → 屋顶/手机框 → 2D/3D → 舞台人物 → 未知号码拒绝 → 返回常规场馆清除事件。眼位在入座手势和视图切换中保持不变；手机框保持 4:3。五场有内场座席的演出均从 2D 点椅进入无票号视点，Kia Forum 另实测三维椅子拾取。八馆均做 390px 表单溢出、全屏画面和手机框检查；这是浏览器仿真，没有进行真实手机硬件测试。

O2 查询、取景与人物已复查；Hydro 的 `204/D/66` 在两日期之间切换保留眼位和手机取景。新增场馆没有借此重建两馆已接受几何，也没有修改登录、付款和订阅行为。具体记录：[桌面交互](preview/ten-venue-feature-browser.json)、[小屏交互](preview/ten-venue-mobile-browser.json)。

代表画面：[巴黎 2D](preview/batch-accor-arena-paris-2d-final.png)、[柏林 3D](preview/batch-uber-arena-berlin-3d.png)、[Kia Forum 观众](preview/batch-kia-forum-los-angeles-seat.png)、[Kia 内场点选](preview/batch-kia-floor-3d-click.png)、[纽约 2D](preview/batch-ubs-arena-new-york-2d-final.png)、[亚特兰大小屏](preview/batch-state-farm-arena-atlanta-mobile.png)。其余逐馆总览、2D、观众和舞台截图在同一 `preview/` 目录，以 `batch-<venue>-<view>.png` 命名。

初次批次的停止点只覆盖十馆本地视角的操作闭环；下面的几何复审已确认新增八馆仍需视觉整改。来源空缺、建筑外壳完整度、未核实的逐座库存及资料权利不是已完成事项；仍保持本地研究未发布。后续若优化外壳，沿用已冻结的座位身份、工具栏、主题和相机规则，只替换场馆几何适配。


## 八馆连续结构修复 · 2026-11-03

已完成下方复审指出的八馆结构修复，并逐馆查看当前 2D、3D 总览。O2、Hydro 沿用已接受模型。五场座席内场此前的共享排布框架继续保留。以下记录是本次修复结果；后面的十馆复审保存修复前证据。

`source-bank-shell.mjs` 将每区每层作为独立结构体：从较完整的排拟合两侧连续边界，扩展到覆盖全部来源椅子的完整脚印；生成连续踏面、连接立面、侧后封闭面。相邻窄通道生成步面；层间存在对应下层时补平台和立面。宽服务口与舞台开口保持开放，交叉或夹尖的台阶不生成。短排或缺失点不再直接切断地板。

二维总览显示平顺结构轮廓，放大到 2× 后显示来源逐座细节。来源记录中的排长差异仍可见，但不再决定混乱的结构外沿。没有移动、新增或重编号任何来源椅子；结构面明确属于估算显示模型，不表示实测建筑或票务库存。

| 场馆 | 连续分区结构 | 通道步面 | 来源椅子 | 当前画面 |
| --- | ---: | ---: | ---: | --- |
| Accor | 44 | 196 | 14,493 | [2D](preview/structure-fixed-accor-2d.png) / [3D](preview/structure-fixed-accor-3d.png) |
| Ziggo | 26 | 8 | 10,093 | [2D](preview/structure-fixed-ziggo-2d.png) / [3D](preview/structure-fixed-ziggo-3d.png) |
| Uber | 45 | 336 | 11,256 | [2D](preview/structure-fixed-uber-2d.png) / [3D](preview/structure-fixed-uber-3d.png) |
| Kia Forum | 86 | 817 | 13,869 | [2D](preview/structure-fixed-kia-2d.png) / [3D](preview/structure-fixed-kia-3d.png) |
| United Center | 90 | 772 | 17,335 | [2D](preview/structure-fixed-united-2d.png) / [3D](preview/structure-fixed-united-3d.png) |
| UBS | 77 | 541 | 14,429 | [2D](preview/structure-fixed-ubs-2d.png) / [3D](preview/structure-fixed-ubs-3d.png) |
| Prudential | 74 | 588 | 14,979 | [2D](preview/structure-fixed-prudential-2d.png) / [3D](preview/structure-fixed-prudential-3d.png) / [近区](preview/structure-fixed-prudential-near.png) / [入座取景](preview/structure-fixed-prudential-audience.png) |
| State Farm | 52 | 494 | 13,700 | [2D](preview/structure-fixed-statefarm-2d.png) / [3D](preview/structure-fixed-statefarm-3d.png) |

验证：`node --test tests/concert-views-*.test.mjs tests/venue-view-entrypoints.test.mjs` **87/87 通过**，覆盖八馆全量来源身份/XYZ、完整椅子脚印受支撑、有效踏面/台阶、相邻排连接、通道不覆盖来源座位和宽开口保留。实际页面检查了八馆 2D/3D 总览，以及 Prudential 20 区近景与 20/11/1 入座：眼位为 `[-22.789,4.950,16.518]`，手机取景和屋顶可开启；实际拖动转头并滚轮变焦到 48.03° 后，眼位保持完全一致。`npm run check`、四个修改模块直接语法检查与 `git diff --check` 通过。共用暗紫色、椅子、相机规则、主站认证/支付和发布门禁未改。

本轮关闭的是复审发现的连续结构与排端显示缺陷，不宣称复刻实测 CAD 或所有视角已无缺陷。保留本地研究、未发布、权利未决和未校准状态。

[本轮回归日志](preview/eight-venue-structure-tests.log)。

## 十馆几何复审 · 2026-11-03

> 以下为修复前的历史复审记录；当前结构实现及结果见上方“八馆连续结构修复”。

**复审结论：十馆都已查看二维与三维总览，但不能据此把十馆标为视觉验收通过。** 先前 81/81 是功能与内部几何约束的结果，未充分覆盖用户关心的左右过渡、连续看台、转角与排端观感。本轮补上这项检查：O2、Hydro 保留已接受模型；新增八馆的来源排带仍需要结构和显示整理，不能直接归档为与两馆同等完成度。

### 已修复的内场共性错误

此前每个内场座席块单独朝向舞台锚点，导致同一演出相邻区域各自旋转；每块又单独居中排椅，排距相同但行列错位。Prudential 的 A/C/D/E/F/G/H/J 因而呈现扇散和斜切。

`source-event-display.mjs` 现在为同一演出拟合一个正交排布框架，全部座席块共享方向、起点和行列间距（模型单位列距 0.66、排距 0.95），完整椅子脚印继续裁剪到所属区域并避开舞台、设备与孔洞。共性修复应用于 Kia、United、UBS、Prudential、State Farm 五场座席内场；Accor、Ziggo、Uber 的站区不生成椅子。新数量只是重新排布的示意椅数，不是新增真实座位或可售库存。原始票图、草稿多边形、来源 XYZ 和票号保持不变。[Prudential 内场修正近景](preview/geometry-review-prudential-floor-aligned.png)。

### 逐馆视觉结论

下表中的“待整改”指显示模型，不能仅因存在来源数据而忽略。截图是实际本地页面；当前抽查不证明全部楼层、全部座位及所有相机角度均无缺陷。

| 场馆 | 本轮实际观察与结论 | 后续重点 | 画面 |
| --- | --- | --- | --- |
| O2 | 连续下碗、两侧过渡和内场标签保留；端台上层开口仍存在，没有因本次修复重建 | 保留已接受模型 | [2D](preview/geometry-review-o2-2d.png) / [3D](preview/geometry-review-o2-3d.png) |
| Hydro | 规则分层、转角排带与站区保留；大幅左右差异未在总览中出现 | 保留已接受模型 | [2D](preview/geometry-review-hydro-2d.png) / [3D](preview/geometry-review-hydro-3d.png) |
| Accor | 侧面和转角排端呈阶梯碎边，三维层间缺少连续支撑，内场长标签在总览较拥挤 | 高优先级：排面、转角和标签 | [2D](preview/geometry-review-accor-2d.png) / [3D](preview/geometry-review-accor-3d.png) |
| Ziggo | 下层左右主体接近，侧边短排和分段开口在二维明显；三维未形成独立连续壳体 | 待整改：排端及结构补面，保留通道 | [2D](preview/geometry-review-ziggo-2d.png) / [3D](preview/geometry-review-ziggo-3d.png) |
| Uber | 下层整体轮廓接近对称，217/103 附近及转角有分段；三维上下层仍像独立排片 | 待整改：层间与转角衔接、内场长标签 | [2D](preview/geometry-review-uber-2d.png) / [3D](preview/geometry-review-uber-3d.png) |
| Kia Forum | 椭圆轮廓较规整；内场已统一成平行排，外层排端仍有突变，BOX 与数字区标签拥挤 | 待整改：排端、标签层级 | [2D](preview/geometry-review-kia-2d.png) / [3D](preview/geometry-review-kia-3d.png) |
| United Center | 内场已统一排向；下层入口附近和三层边缘缺口突出，三维分层之间没有连贯结构 | 高优先级：分层结构与排端 | [2D](preview/geometry-review-united-2d.png) / [3D](preview/geometry-review-united-3d.png) |
| UBS | 内场已统一排向；上层二维呈细碎环带且后侧区号拥挤，三维后端和层间分段明显 | 待整改：上层可读性与连续结构；本次二维截图为 U 层，未当作下层证据 | [2D](preview/geometry-review-ubs-2d.png) / [3D](preview/geometry-review-ubs-3d.png) |
| Prudential | 18/20 与 9/7 的来源排长不同；20 区近景确认排端逐排突变。内场扇散已修复，看台过渡仍未解决 | 最高优先级：先分辨真实缺口，再做独立显示排面 | [2D](preview/geometry-review-prudential-2d.png) / [3D](preview/geometry-review-prudential-detail-3d.png) / [20 区近景](preview/geometry-review-prudential-20-near.png) |
| State Farm | 内场已统一排向；下层前部与上层左右开口差异明显，三维排片断开感强 | 高优先级：逐层结构、开口边界和过渡 | [2D](preview/geometry-review-statefarm-2d.png) / [3D](preview/geometry-review-statefarm-3d.png) |

### 对称性不能用一个开关处理

Prudential 保留的[本场票图](../../../data/research-events/pru-sfa-source-2026-10-28/pru-xg.png)确实画有不同的包厢/服务区域，不能把一边直接镜像成真实座位。来源 18/9 区分别有 367/400 条记录，20/7 区分别有 354/400 条，均为 23 排；这能解释输入数据不同，不能证明每个缺口就是建筑开口，也不能证明渲染质量合格。State Farm 的[本场票图](../../../data/research-events/pru-sfa-source-2026-10-28/sfa-doja-cat.png)也有不同的侧区与通道，不能强制全馆镜像。

八馆共用 `source-bowl-display.mjs`，其支撑面由逐座踏面拼接，`walls`、`concourse`、`gallery` 仍为空。这是本轮发现的主要实现缺口：**共用了外观和交互组件，却没有把“先做连续结构再摆椅子”的建模要求落实到八馆适配器。** 用户的截图不是靠再换颜色就能解决。

后续按 Prudential → United → Accor → State Farm → UBS → Kia → Uber → Ziggo 整理显示壳体。保留原始来源座位身份与坐标，另建带估算标记的连续排面、层间支撑和明确通道；必要的显示补全与来源层分离。只有来源支持的左右部分才共享对称模板；不能把缺点云直接当作洞，也不以新增真实库存为整改目标。每馆先验左右正视、两个转角、近区、观众和二维，再进入下一馆，不把八馆再批量套一遍未经验证的形体。

本轮停止点是完成十馆复审与已确认内场错误的修复，**八馆结构整改尚未完成，也未归档视觉版本**。本轮没有修改共用配色、椅子模型、相机、手机取景、登录、支付或发布门禁。

验证：`node --test tests/concert-views-*.test.mjs tests/venue-view-entrypoints.test.mjs` **86/86 通过**，包含新增五场行列共框架回归；另有舞台/设备/区域/洞碰撞与身份保持回归。`npm run check`、两个显示模块直接语法检查与 `git diff --check` 通过。[日志](preview/ten-venue-geometry-tests.log)。这是本地内部一致性与功能验证，不代表现场布局准确性或整库测试结论。

## 紧凑排版四版对比 · 2026-11-04

以下为四版选择阶段的历史记录。用户已选定 B；当前 `/zh-CN/concert-views` 默认采用 B，不再需要 variant 参数，也不显示四版切换条。未部署。

四版共用既有表单和场馆场景，没有复制查询、登录、支付或模型。页头 logo 左边界、导航右边界与正文卡片对齐；桌面 1440px 实测为 24–1416px，手机 390px 为 16–374px。四版手机均无横向溢出。

| 版本 | 布局 | 桌面预览 |
| --- | --- | --- |
| A 紧凑双行 | 保留薄步骤条，地区/场馆一行，区排座一行 | [截图](preview/layout-option-a.png) |
| B 一行直达 | 桌面全部查询项一行，使用说明折叠 | [截图](preview/layout-option-b.png) |
| C 场馆摘要 | 默认显示当前场馆，点击更换再展开地区与场馆 | [截图](preview/layout-option-c.png) |
| D 左右分栏 | 左侧场馆筛选，右侧票位输入 | [截图](preview/layout-option-d.png) |

已实际操作 C 的国家→场馆联动（换国家清空场馆、美国五馆、英国两馆），并复查四版单一查询表单、桌面与手机边界。查询和场景仍由原有模块处理。生产外壳/入口相关回归 6/6 通过；`npm run check`、预览模块及页面生成器语法检查、`git diff --check` 通过。


## B 版定稿与共享操作栏压缩 · 2026-11-04

B 版成为演唱会视角页面的默认布局：桌面地区、场馆、区、排、座与查询按钮横排；手机依次收成地区/场馆、区排座和查询按钮。使用说明默认折叠，页头与正文继续共用对齐边界。

所有场馆的操作区均由 `public/venue-view` 共享组件负责：模式切换与缩放同排，楼层和图层同排，长状态移入“图层说明”。桌面 1072px 下，O2 的 2D 操作栏从 150px 降为 90px，3D 也为 90px；窄屏三维操作按钮横向滚动，保留全屏入口。手机展开说明限制在操作栏边界内。

没有移除楼层、事件内场、官方区界、屋顶、手机取景、1–10×滑条、固定座位视角或查询功能。O2、Hydro 切换和 390px 手机无横向溢出已实测，手机取景滑条仍位于取景框内。相关组件、图层、页面外壳及入口回归 16/16 通过；`npm run check`、修改模块语法检查及 `git diff --check` 通过。

[定稿预览](preview/layout-b-compact-toolbar.png)。旧 A–D 截图仅作设计归档。

## 本地 main 整合验证 · 2026-11-04

十馆视角、共用界面、五语国际化与既有用户管理后台一起保留。原始保护快照不变，`main-boundary.json` 的 `mainUpdate` 单独记录来自 `ab7c4e9` 的后台文件哈希。

合并前完整测试对照：干净 main 为 202 条（193 通过、8 失败、1 跳过），十馆版本为 302 条（293 通过、相同 8 失败、1 跳过）。既有失败集中于支付、元数据及认证，不修改这些业务来掩盖基线失败。原根目录未提交研究文件保留在 `codex/preserved-research-workspace-20261104` 工作区。原始网页及测试日志按证据原字节保留，代码与文档另行检查空白。

最终整合树验证：十馆及后台专项 108/108 通过，`npm run check` 通过；完整套件 307 条（298 通过、相同 8 条既有失败、1 跳过），未增加失败项。根目录保留清单 5,205 个文件 SHA-256 全部一致。


## 公开 explore B 版上线 · 2026-11-05

此前定稿 B 版只接入演唱会预览入口，公开 `/explore` 仍显示大步骤卡和双行查询，造成生产画面与已审核版本不一致。本次将紧凑布局移至公共 `explorer-layout.css`，公开与演唱会入口共用模板，删除旧原型注入；不是要求用户清缓存来掩盖入口差异。

运行代码 `82877979cc415a619f7791df01d5d53af5338ea5` 已上线。桌面 1072px 下头部、标题和查询栏均为 24–1048px，查询栏约 95px 高；手机 390px 下为 16–374px，无横向溢出。使用说明默认折叠，国家→场馆筛选和票位查询已在生产实际操作。Tottenham 122 / 14 / 679 返回票号已找到、暂无座位视角，未将查询结果误记为视点验收。

[生产桌面](preview/public-explore-b-production-desktop.png) / [生产手机](preview/public-explore-b-production-mobile.png)。完整测试 315 项：314 通过、0 失败、1 项真实 PostgreSQL 集成测试因缺少独立数据库跳过；构建和差异检查通过。公开目录仍为 197，匿名十馆研究入口继续 404；本次仅统一外层排版，不改变研究数据发布门禁或认证支付流程。


## 2026-11-12：台北、新北与香港整合发布验收

用户授权将已整理场馆统一上线，并隐藏旧目录和未完成条目。发布清单 `data/concert-views/release.json` 显式列出 39 馆：原重排十馆、台北/新北 18 馆、香港 11 馆。29 个区域场馆共检查 35 个布局。另有 10 个只有目录、没有可用保留模型的条目列入 `archived.json`，不出现在目录、地图、指南或 sitemap；旧 SoFi、MetLife、Tottenham 等入口也不再返回旧模型。未把“目录项存在”当作“建模完成”。

公开 `/explore` 使用同一 B 版页面和公共控件。场馆适配只提供模型、编号、布局与能力，不新增页面外壳。地区→场馆、五语、座位查询、固定眼位、1–10×手机取景、屋顶和全屏保留。订阅门禁沿用原策略；当前匿名可用 7 馆，其他已发布馆仍需对应权益。研究原图与管理 API 不随公开场景模块开放。

来源坐标与估算模型分开：保留来源的 ID、XYZ、yaw 和资产哈希；无来源逐座位置的场馆使用示意座椅，不赋予来源票号。纯站区不生成座椅或座号。台北大巨蛋估算分区限制在相邻边界内，取消重叠和跨区无归属补椅；闭合场馆与剧院连续排面分别处理，不能用圆形碗体覆盖所有建筑。台北小巨蛋端台 10,000 座/79 区，中央舞台 12,877 座/98 区；中央舞台不继承端台 standing-1。台北/香港此批不虚构具体演唱会。

验收：35 个区域布局的 2D/3D 总览已截图查看，补查剧院、站区、香港会展及手机界面。台北中央舞台查询、转头与手机 1→10× 保持同一眼位；未知号码不替换最近位置。390px 无横向溢出；站区以无票号示意眼位入场；O2/Hydro 保留同一表单及原编号。结构仍是参考模型，不能声称建筑 CAD 或实际可售库存。

完整测试 334 项：333 通过、0 失败、1 跳过（没有独立数据库的真实 PostgreSQL 集成）；`npm run build` 通过。发布必须固定完整提交 SHA，并在生产复核目录仅 39 馆、归档/旧 ID 404、权限边界、认证 callback/reset 200。

记录：[站区](preview/regional-standing-release.png)、[剧院](preview/regional-theater-release.png)、[香港会展](preview/regional-hkcec-release.png)、[390px 手机](preview/regional-mobile-release.png)。本节为上线前验收；实际生产版本和回滚点以部署记录为准。


## 2026-11-12：生产发布结果

运行代码 `bac70ec8a4a642f15ecfe54b3047561e5176f9cb` 已部署，原 Coolify 应用健康，部署 `fuvcm25izawlvq5gdyeknghi` Finished。生产目录为发布清单的 39 馆；10 个归档场馆及抽查旧入口均 404，不向用户展示未完成模型。原权益策略保留，匿名免费 7 馆。

生产 HTTP 使用正常 TLS 证书校验通过；因本机域名直连异常，实际浏览器通过不转发身份的临时中继检查生产响应。台北中央舞台为 12,877 座 / 98 区、无端台 standing-1，1–10× 变焦眼位固定，390px 无溢出。该检查不等于证明本机直连已恢复。[生产三维截图](preview/regional-production-taipei-center.png)。完整发布、检查边界和回滚点见 [部署记录](../../operations/deployment.md)。


## 2026-11-12：高雄、台中扩展草稿（未发布）

沿用同一 B 版页面与来源座位适配器，新增三馆、四套布局：

| 场馆 | 布局 | 保留座位记录 | 分区 |
| --- | --- | ---: | ---: |
| 高雄巨蛋 | 端台 | 11,658 | 32 |
| 高雄巨蛋 | 中央舞台 | 14,934 | 50 |
| 高雄流行音乐中心 | 端台 | 3,003 | 10（5 坐席、5 站区） |
| 台中国家歌剧院·大剧院 | 端台 | 1,994 | 17 |

以上是参考模型记录数，不是本场可售库存或实测容量。保留公开参考页内的几何 JSON、来源链接及哈希，归一化由 `scripts/build-regional-reference-seats.mjs` 生成；不导入参考站脚本、页面或图片。来源：[高雄巨蛋](https://twconcertview.com/en/3d/kaohsiung-arena)、[高雄流行音乐中心](https://twconcertview.com/en/3d/kaohsiung-music-center)、[台中国家歌剧院](https://twconcertview.com/en/3d/taichung-opera-house)。林口体育馆本次不接入：检查到的参考只有程序化模型，没有明确逐座表，不能据此制造票号。

高雄巨蛋来源含 7 组重复身份（两布局均保留），音乐中心含 1 组。查询 `214 / 27 / 10` 或 `2D / 8 / 24` 时返回歧义、禁止入座；不删除原记录、不随机选一把椅子。未知号码同样不回退最近座位。端台和中央舞台独立过滤收合/关闭看台，音乐中心站区不生成座椅。

四套 2D/3D 总览均已截图查看，已实际操作高雄巨蛋端台→中央舞台切换、剧院 `4F 中央 / 1 / 1` 查询、重复与未知号码拒绝定位。剧院转头、屋顶和手机 1→10× 后眼位保持 `[0,9.800,28.358]`，10× FOV 为 5.34°；390px 页面无横向溢出。O2 16,882 把显示椅子和 Hydro 10,109 把示意椅子仍可通过同一表单进入。

**仍为本地草稿，未提交、未部署，公开清单保持 39 馆。** 高雄巨蛋和音乐中心部分排端、结构转角仍有阶梯与碎片，当前通过的是数据接线和交互回归，不代表视觉发布验收通过。三馆暂不接具体演唱会，不新增页面、相机或主题实现。

验证：扩展专项 6/6、演唱会/筛选/入口 132/132；完整测试 340 项，339 通过、0 失败、1 跳过（没有独立数据库的真实 PostgreSQL 集成）。`npm run check`、转换器直接语法检查、`git diff --check` 通过。

预览：[高雄端台](preview/expansion-kaohsiung-arena-end-3d.png)、[高雄中央舞台](preview/expansion-kaohsiung-arena-center-3d.png)、[音乐中心](preview/expansion-kaohsiung-music-center-3d.png)、[剧院](preview/expansion-taichung-opera-house-3d.png)、[手机](preview/expansion-taichung-mobile.png)。本地入口：`/zh-CN/concert-views?venue=kaohsiung-arena&layout=end&mode=3d`。


## 2026-11-13：已有逐座场馆的演出座位图补齐（本地待审核）

本轮暂停扩展场馆，按当前公开清单中有来源逐座记录的 28 馆核对具体演出。新增 **21 张本地票图参考，涉及 17 馆**；与保留的 10 个既有事件预览合计 31 条，覆盖 **26/28 馆**。覆盖只表示取得至少一张对应演出的票图，不表示该馆所有演出、所有布局或全馆每个座位均已核实。红馆仅有局部分区图，国家戏剧院当前为历史演出的二手归档图，不能把两者算作完整官方总图。Hydro 为独立示意编号/演出方案，不计入这 28 个来源逐座场馆；高雄/台中三馆扩展草稿也不计入公开清单分母。

新增图沿用同一事件侧栏、日期卡、布局选择及原尺寸图片入口，没有新增另一套页面。选择 `reference-only` 时保留所绑定的常规座位布局，但将事件舞台、内场、设备、临时椅子保持为空，禁用舞台视角和事件距离；不能把图片上的舞台直接当作已配准三维模型。返回常规布局后清除图片与事件引用。21 条均为 `localOnly:true`，默认/公开事件 API 与图片入口不返回它们；本轮没有提交、部署或更改公开 39 馆清单。

### 逐馆覆盖清单

| 场馆 | 演出 / 日期 / 绑定布局 | 当前状态 |
| --- | --- | --- |
| The O2 Arena (`twcv-the-o2-arena-london`) | [Cody Johnson — Live ’26](https://www.theo2.co.uk/events/detail/cody-johnson) · 2026-10-27 · `o2a`<br>[J. Cole — The Fall-Off Tour](https://www.theo2.co.uk/events/detail/jcole-2026) · 2026-11-02 · `o2a` | 有票图；保留既有事件布局 |
| Accor Arena (`twcv-accor-arena-paris`) | [Lady Gaga — The MAYHEM Ball](https://www.accorarena.com/en/events-and-tickets/lady-gaga--88d1b) · 2025-11-17、2025-11-18、2025-11-20、2025-11-22 · `acc` | 有票图；保留既有事件布局 |
| Ziggo Dome (`twcv-ziggo-dome-amsterdam`) | [Lady Gaga — The MAYHEM Ball](https://ziggodome.nl/en/events/f5e44ab3-5df9-45f5-9fd6-2e179180400c/) · 2025-11-09 · `zgd` | 有票图；保留既有事件布局 |
| Uber Arena (`twcv-uber-arena-berlin`) | [Muse — The Wow! Signal Europe Tour](https://www.uber-arena.de/en/events/detail/muse_2026/2026-11-18-1930) · 2026-11-18 · `uba` | 有票图；保留既有事件布局 |
| Kia Forum (`twcv-kia-forum-los-angeles`) | [DON OMAR](https://thekiaforum.com/event/don-omar/) · 2026-11-06 · `kfo` | 有票图；保留既有事件布局 |
| United Center (`twcv-united-center-chicago`) | [KATSEYE · The Wildworld Tour](https://www.unitedcenter.com/events/2026/11/05/katseye-the-wildworld-tour/) · 2026-11-05 · `unc` | 有票图；保留既有事件布局 |
| UBS Arena (`twcv-ubs-arena-new-york`) | [Anuel AA](https://ubsarena.com/event/anuel-aa/) · 2026-11-06 · `ubs` | 有票图；保留既有事件布局 |
| Prudential Center (`twcv-prudential-center-newark`) | [XG · The Core World Tour](https://www.prucenter.com/events/xg) · 2026-11-14 · `pru` | 有票图；保留既有事件布局 |
| State Farm Arena (`twcv-state-farm-arena-atlanta`) | [Doja Cat · Tour Ma Vie](https://www.statefarmarena.com/events/detail/doja-cat-tour-ma-vie-world-tour) · 2026-11-17 · `sfa` | 有票图；保留既有事件布局 |
| 台北小巨蛋 (`taipei-arena`) | [告五人 — 台北演唱會](https://tixcraft.com/activity/detail/26_aftp) · 2026-11-06、2026-11-07、2026-11-08 · `end`<br>[劉若英 — 台北演唱會](https://tixcraft.com/activity/detail/26_renetp) · 2026-12-05 · `center` | 有票图；本地原图参考，未配准 |
| 亚洲国际博览馆 Arena (`asiaworld-arena`) | [KUN — The Deadman](https://www.asiaworld-expo.com/en-us/whats-on/upcoming-events/events/cai-xukun-live-in-hong-kong-2026-the-deadman-hong?event_type=Concert&ebmsid=27364) · 2026-11-28、2026-11-29 · `end` | 有票图；本地原图参考，未配准 |
| 亚洲国际博览馆 · Runway 11 (`asiaworld-runway-11`) | [JOJI — SOLARIS](https://www.asiaworld-expo.com/en-us/whats-on/upcoming-events/events/joji-live-in-hong-kong-2026?event_type=Concert&ebmsid=27112) · 2026-11-29 · `end`<br>[DONGHAE — ALIVE](https://www.asiaworld-expo.com/en-us/whats-on/upcoming-events/events/2026-lee-donghae-concert-in-hong-kong?event_type=Concert&ebmsid=26494) · 2026-06-27、2026-06-28 · `end` | 有票图；本地原图参考，未配准 |
| 亚洲国际博览馆 · 2号馆 (`asiaworld-summit-hall-2`) | [EUNHYUK — be: WARE OF THE RABBIT](https://www.asiaworld-expo.com/en-us/whats-on/upcoming-events/events/2026-eunhyuk-fancon-be-wave-of-the-rabbit-in-hong?event_type=Concert&ebmsid=27794) · 2026-09-19 · `end` | 有票图；本地原图参考，未配准 |
| 亚洲国际博览馆 · VIVA (`asiaworld-viva`) | [2024 RIIZE FAN-CON RIIZING DAY in HONG KONG](https://www.asiaworld-expo.com/en-us/whats-on/upcoming-events/events/riize-live-in-hong-kong-2024/) · 2024-06-01 · `end` | 有票图；本地原图参考，未配准 |
| 香港体育馆 · 红馆 (`hong-kong-coliseum`) | [LOVE Gigi World Tour 2026](https://www.urbtix.hk/event-detail/15531) · 2026-11-27 · `end`<br>[LOVE Gigi World Tour 2026](https://www.urbtix.hk/event-detail/15531) · 2026-11-28 · `end`<br>[LOVE Gigi World Tour 2026](https://www.urbtix.hk/event-detail/15531) · 2026-11-29 · `end` | 三场各自的局部分区图，非全馆完整图 |
| 启德主场馆 (`kai-tak-stadium`) | [Stray Kids — RUN IT HONG KONG](https://hkt.hkticketing.com/en/#/allEvents/detail?projectId=50000001506002) · 2026-12-05 · `bowl` | 有票图；本地原图参考，未配准 |
| 台北流行音乐中心 (`taipei-music-center`) | [Atarayo — ASIA TOUR 2026 in TAIPEI](https://www.tmc.taipei/tw/blog/show/atarayo2026) · 2026-12-19 · `end` | 有票图；本地原图参考，未配准 |
| 台大综合体育馆 (`ntu-sports-center`) | [JESSICA CONCERT TOUR Reflections IN TAIPEI](https://asiamedia-2.kktix.cc/events/vretar01?locale=zh-TW) · 2027-02-20 · `end` | 有票图；本地原图参考，未配准 |
| 台北国际会议中心 TICC (`ticc-taipei`) | [Young K — The Youngest](https://tixcraft.com/activity/detail/26_youngk) · 2026-11-28、2026-11-29 · `end` | 有票图；本地原图参考，未配准 |
| Clapper Studio (`clapper-studio-taipei`) | [VICTON — [10:NOW] IN TAIPEI](https://ticketplus.com.tw/activity/8c547569ec0844087f59d05b38e802bc) · 2026-12-11 · `end` | 有票图；本地原图参考，未配准 |
| 台北国家音乐厅 (`national-concert-hall-taipei`) | [Yuja Wang & Mahler Chamber Orchestra — Taipei](https://ticket.mna.com.tw/UTK0201_?PRODUCT_ID=P1FX0ASD) · 2026-11-22 · `end` | 有票图；本地原图参考，未配准 |
| 台北国家戏剧院 (`national-theater-taipei`) | [LES MISÉRABLES STAGED CONCERT SPECTACULAR](https://www.opentix.life/event/1864938599362674689) · 2025-06-27 · `end` | 历史演出；二手归档原图，待官方原件 |
| 台北城市舞台 (`taipei-city-stage`) | — | 缺图，未补齐 |
| 台北表演艺术中心 · 蓝盒子 (`taipei-pac-blue-box`) | — | 缺图，未补齐 |
| 台北表演艺术中心 · 球剧场 (`taipei-pac-globe-playhouse`) | [阿龔 — 月光動物園音樂會](https://isshowind.kktix.cc/events/ng07da16) · 2026-01-18 · `end` | 有票图；本地原图参考，未配准 |
| 台北表演艺术中心 · 大剧院 (`taipei-pac-grand-theater`) | [2026風動室內樂團《無限》ACG電玩動漫音樂會](https://www.opentix.life/event/1955916913608867841) · 2026-12-13 · `end` | 有票图；本地原图参考，未配准 |
| 台湾戏曲中心 · 大表演厅 (`taiwan-traditional-theatre-center-grand-theater`) | [臺灣國樂團《情繫NCO》](https://www.opentix.life/event/2087435617998233601) · 2026-12-05 · `end` | 有票图；本地原图参考，未配准 |
| Zepp New Taipei (`zepp-new-taipei`) | [Karencici — The Loser Live In Concert](https://warnermusictwtw.kktix.cc/events/ofgkrikd?locale=zh-TW) · 2026-11-27 · `standing` | 有票图；本地原图参考，未配准 |

### 原件与绑定

- 配方、图片及演出页面原件保存在 `data/research-events/regional-concert-maps-2026-11-12/`；`references.json` 逐项记录图片 URL、演出来源、取得日期、实际内容 SHA-256、场馆/布局及再分发状态。图片许可未确认，继续仅在本地研究入口使用。
- `node scripts/build-concert-map-references.mjs data/research-events/regional-concert-maps-2026-11-12/references.json` 生成不可变票图版本及索引，不手改生成物。原 10 个事件预览的版本未变；新图的固定席位身份/坐标摘要必须与绑定来源布局一致。
- 红馆 Gigi 2026-11-27、28、29 来自 URBTIX 同一官方活动页的三个独立日期图，哈希各异；都是局部分区预览，不能拼接为全馆或据颜色推断永久封区。
- VIVA RIIZE 为 2024-06-01 官方历史图，明确标注 Hall 8 & 10；没有把 Runway 11 或 Hall 10 单馆图冒充 VIVA。国家戏剧院 Les Mis 为 2025-06-27 历史音乐会，图取自二手归档复现，来源等级保留在 bindingNote，不声称取得官方原图。
- 仅 `tpac-grand-acg-20261213`、`tttc-nco-20261205` 两图由实际官方选座 SVG 按浏览器计算样式栅格化为 PNG，保留原 SVG、哈希和 Codex 执行方法；颜色仅代表取得时点，不是永久库存。JESSICA 按官方延期公告绑定 2027-02-20，不沿用旧 2026-10-24。

### 未补齐的两馆

1. **城市舞台**：核查 TCO、Bean Babies 2025/2026，以及风动 ACG 的场次。2026 Bean Babies [官方主办页](https://www.jpg.org.tw/event/2026beanbabies)及 [OPENTIX](https://www.opentix.life/event/2046829520049606657) 确认节目，但当前无可售场次、无可用票图；巡演日程图不作为座位图。ACG 已取得的 12 月 13 日图属于北艺大剧院，不能复制给城市舞台。
2. **北艺蓝盒子**：核查 TJO、TEJO、击乐系列、Elephant 等官方节目；新增核查 [2024 Camac 音乐会主办页](https://www.camacprizetaiwan.com/closing-concert)及 [OPENTIX《飘浪郭德堡》](https://www.opentix.life/event/1777984904206077953)。公开页已下架或没有可用选座场次，未取得该场票图。不使用常规技术图或其他剧场票图填空，也不把普通戏剧误标演唱会。

这两项仍是明确的数据缺口，后续只沿主办方公开归档图、新可售音乐会或获得授权的原图继续补，不制造替代图。

### 验证

完整测试 **345 项：344 通过、0 失败、1 跳过**（真实 PostgreSQL 集成缺少独立数据库）；票图专项 5/5，`npm run check`、`git diff --check` 通过。测试验证原件哈希、日期/场馆/布局绑定、来源座位摘要不变、拒绝错误绑定、参考图不生成三维事件几何、默认公开接口隐藏新图。

实际 Ego 浏览器逐条检查 21 张图均解码、日期一致、布局为参考模式、单一查询表单；补查 VIVA 常规 5,600 座、台北中央舞台 12,877 座/98 区，均无参考图事件舞台/临时座椅，舞台视角禁用。红馆 27→28→29 点击切换正确日期/图片；390px 无横向溢出、原尺寸图片入口可打开、返回常规布局清除引用。既有 O2 Cody 仍显示 1,720 把内场示意椅子及舞台人物，舞台视角可用。

预览：[VIVA 历史票图](preview/concert-map-viva-reference.png)、[中央舞台手机参考图](preview/concert-map-center-mobile-final.png)。本地入口：`http://127.0.0.1:4188/zh-CN/concert-views`。这是票图获取和接线验收，尚未完成全部场馆覆盖或新增事件三维配准。


## 2026-11-13：按热门歌手演出拓展三馆（本地草稿）

本批从已确认的演出反推场馆优先级，不再先堆场馆目录：官方场次及日期 → 场馆身份 → 可复用场馆/编号资料 → 本场票图 → 共享页面验收。新增三个本地场馆、三份官方演出票图、合计九个演出日期；公开发布清单仍为 39 馆，没有提交或部署本批。

| 场馆 | 演出与官方日期 | 当前模型范围 |
| --- | --- | --- |
| 高雄世运主场馆 `kaohsiung-national` | [BTS ARIRANG](https://tixcraft.com/activity/detail/26_btskns)：2026-11-19、21、22 | 135 个编号分区，40,407 个来源编号及估算位置；支持区排座查询 |
| 东京巨蛋 `tokyo-dome` | [The Romantic Tour](https://www.livenationhip.co.jp/en/all-events/bruno-mars-tickets-ae147754)：2027-01-27、28 | 304 个模型分区，分区级示意；无来源逐座表，不提供具体座号定位 |
| 新加坡国家体育场 `singapore-national` | [The Romantic Tour](https://ticketmaster.sg/activity/detail/27sg_brunomars)：2027-04-13、14、17、18 | 122 个模型分区，分区级示意；无来源逐座表，不提供具体座号定位 |

高雄保留的[参考资料](https://twconcertview.com/en/3d/kaohsiung-national-stadium)提供编号范围、排深、曲线和层高。转换器 `scripts/curve-seat-reference.mjs` 只解释这些字段，不运行第三方 viewer；保留号码断点，未取得编号依据的 B04 main/strip 不补号。40,407 个唯一编号的位置是重建结果，`positionStatus:reference-model-estimate`、`identityStatus:source-range-reference`，不是原始逐座 XYZ 或现场测量。目录与画布也明确记录估算来源。`E18 / 5 / 6` 没有来源，返回未验证与空位置；不能补成最近的一把椅子。

东京和新加坡复用已有参数化分区模型，显示椅子全部为 visualOnly/sourceSeat:false，不把模型密度变成实际容量或门票。它们的事件图通过 section-only 模型哈希绑定；高雄通过来源布局与编号/位置摘要绑定。旧来源逐座绑定验证继续有效。三张票图均保存原件、官方演出页、日期、来源 URL 和内容哈希，配方在 `data/research-events/artist-led-2026-11-13/references.json`，由原有生成器建立不可变版本。

三张图目前都是 `reference-only/localOnly`：高雄 BTS 的中央舞台及临时内场、东京 VIP/票价分区、新加坡 standing pen 与设备区均未配准到三维。选择演出后可以看原图，但不制造三维舞台、人物、内场椅子、封区或距离；常规场馆也不自动生成一个没有依据的默认舞台。图像再分发权利未确认，当前仅本地研究使用。

浏览器已实际核对三馆 2D/3D、三图解码、对应日期、单一公共表单、地区分组、未知号码拒绝、无默认舞台。高雄 A01/1/80 的手机取景 1→10× 保持眼位 `[87.850,3.030,25.917]`，10× FOV 5.59°；390px 无横向溢出。O2 16,882 把显示椅子、Hydro 10,109 把示意椅子仍可通过同一页面进入。总览截图须等待相机和全屏 resize 动画完成，不能把过渡帧当成模型裁切。

最终完整测试 350 项：349 通过、0 失败、1 项真实 PostgreSQL 集成因未配置独立数据库跳过；`npm run check`、相关模块语法和 `git diff --check` 通过。自动测试验证编号、配方绑定、私有隔离及共享交互，不证明 CAD 精度或本场完整座位库存。高雄排端和结构连接、东京/新加坡的示意分区仍需要视觉打磨，因此本批未加入公开清单。

预览：[高雄 3D](preview/artist-kaohsiung-3d.png)、[BTS 票图](preview/artist-kaohsiung-event.png)、[东京 3D](preview/artist-tokyo-3d.png)、[东京票图](preview/artist-tokyo-event.png)、[新加坡 3D](preview/artist-singapore-3d.png)、[新加坡票图](preview/artist-singapore-event.png)、[手机页面](preview/artist-expansion-mobile.png)。本地入口 `/zh-CN/concert-views?venue=kaohsiung-national&mode=3d`。


### 2026-11-13：三场演出布局与内场视角验收

本节更新上述仅原图参考阶段：三份配方现为 `estimated-layout / localOnly:true`，已经接入共享 2D/3D 场景。官方票图约束形状，AI 描摹、坐标拟合及高度仍是示意；本次没有独立实测或升格为官方座位库存。来源编号、来源位置摘要和 section-only 模型哈希均保留原有校验。

| 演出 | 事件图形 | 临时示意椅子 | 内场视角 |
| --- | ---: | ---: | --- |
| BTS 高雄 | 61：5 个舞台片、54 个内场区、2 个控台 | 6,260 | 坐席逐椅进入；四翼分别保持统一排座方向 |
| The Romantic Tour 东京 | 4：舞台、VIP GOLD、VIP SILVER、SS | 1,449 | 坐席逐椅进入 |
| The Romantic Tour 新加坡 | 7：舞台、站区、控台、4 个延迟塔 | 0 | 1 个站区示意入口，避开设备和控台遮挡 |

临时椅子与站区入口均不附真实区排座身份，不能保存为门票位置；2D 入口与 3D 共享位置。新加坡站区默认入口会检查设备占地、边界余量和至舞台的设备交叉；没有清晰候选就不生成入口。它不是完整的现场遮挡分析。

Ego 实际验收：三场 2D/3D 与舞台人物；BTS、东京坐席和新加坡站区进入观众视角；固定眼位下拖动/手机取景变焦；390px 无横向溢出；屋顶和全屏可用。新加坡返回常规布局后事件图形、人物、站区入口清除，相机回总览；重新选择事件恢复叠加。日文舞台、站区、控台、延迟塔与入口说明正确，五语言语义词条由回归测试覆盖。O2 16,882、Hydro 10,109 把显示椅子及单一表单保持。

最终检查：`npm test` **351 项，350 通过、0 失败、1 跳过**（独立 PostgreSQL 数据库未配置）；专项 17/17、`npm run check`、相关模块语法、`git diff --check` 通过。公开清单仍为 39 馆，本批没有提交或部署。建筑连接和排端仍按示意模型呈现，此验收针对本批事件布局与视角功能，不代表 CAD 精度或现场库存认证。

预览：[BTS 3D](preview/artist-bts-event-layout-3d.png)、[东京 3D](preview/artist-tokyo-event-layout-3d.png)、[新加坡 2D](preview/artist-singapore-event-layout-2d.png)、[新加坡 3D](preview/artist-singapore-event-layout-3d.png)、[站区视角](preview/artist-singapore-standing-view.png)、[手机取景](preview/artist-event-view-mobile.png)。


## 2026-11-13：大阪、菲律宾两馆演唱会扩展验收（本地）

沿用热门歌手巡演反查场馆的方法，本批新增两馆、两份独立官方票图和四个有图支持的演出日期。原有公开清单保持 39 馆，本批未提交、未部署。

| 场馆 | 官方演出日期与票图来源 | 本地模型与本场内场 |
| --- | --- | --- |
| 大阪京瓷巨蛋 `kyocera-dome` | The Romantic Tour，2027-01-19、20；[Live Nation Japan](https://www.livenationhip.co.jp/en/all-events/bruno-mars-tickets-ae147754) | 52 个通路分区、54,148 把示意看台椅；舞台、VIP GOLD、VIP SILVER、SS，8,305 把临时示意椅 |
| 菲律宾竞技场 `philippine-arena` | The Romantic Tour，2027-05-15、16；[Ticketmaster Philippines](https://ticketmaster.ph/activity/detail/27ph_brunomars) | 按本场图抄录 80 个分区标签、35,872 把示意看台椅；舞台和站区，0 把临时椅、1 个站区视角入口 |

菲律宾演出页另列 5 月 18 日，但取得的票图只注明 15、16 日，因此本配方没有覆盖 18 日。分区标签来自图，角度、半径、层高和临时内场配准由 Codex AI 估算，不是实测 CAD。菲律宾私有模型替换原先的 36 个合成标签，但不改根场馆资料；大阪常规模型保留全碗，不因票价图推断背台永久封区。两馆均无来源逐座表，不提供真实座号定位；看台椅不能当成容量统计。

官方图片、演出页面、URL、日期、内容哈希及 AI 描摹说明保留在 `data/research-events/artist-led-2026-11-13/`。配方通过已有生成器产生不可变版本，绑定 section-only 模型哈希，仍为 `estimated-layout / localOnly:true / allowPublication:false / allowDistances:false`。没有把本场估算升格为正式库存或距离依据。

实际 Ego 检查两馆 2D/3D、舞台人物、内场座椅/站区入座、手机取景、屋顶和全屏。修复共享入口的一处遗漏：2D 点内场视点后现在等待公共 3D 懒加载完成再入座，坐席和站区行为一致。进入时清空区排座、禁止保存。大阪眼位 `[25.077,1.225,-31.583]` 在转头、屋顶与手机 10×（FOV 5.34°）期间保持不变；菲律宾返回常规布局后事件图形、人物和视点清除，未知座号 99999 不定位。390px 无横向溢出；日文舞台、站区及入口说明正确；O2 16,882、Hydro 10,109 把显示椅子与单一表单保持。

最终 `npm test` **355 项：354 通过、0 失败、1 项真实 PostgreSQL 集成因未配置独立数据库跳过**。新内场入口与两馆专项 4/4；`npm run check`、相关模块语法及 `git diff --check` 通过。图形与交互验收不证明建筑精度、完整票号或实际演出封区。

预览：[大阪 2D](preview/artist-osaka-event-2d.png)、[大阪 3D](preview/artist-osaka-event-3d.png)、[菲律宾 2D](preview/artist-philippines-event-2d.png)、[菲律宾 3D](preview/artist-philippines-event-3d.png)、[站区视角](preview/artist-philippines-standing-view.png)、[手机排版](preview/artist-philippines-mobile.png)。本地入口：`/zh-CN/concert-views?venue=philippine-arena&event=philippines-bruno-20270515&mode=3d`。


## 2026-11-13：曼谷、吉隆坡两馆演唱会扩展验收（本地）

延续热门歌手的官方巡演站点拓展，本批新增两馆、两份事件票图、四个日期，公开发布清单仍为 39 馆，未提交、未部署。

| 场馆 | 官方演出与日期 | 看台分区 | 本场内场 |
|---|---|---:|---|
| 拉加曼加拉国家体育场 · 曼谷 (`rajamangala`) | [The Romantic Tour](https://ticketmaster.co.th/activity/detail/26th_brunomarsbkk) · 2027-04-24 / 25 | 100 | 16 坐席块、1 个 ST 站区、1,904 把示意椅、1 个站区视点 |
| 武吉加里尔国家体育场 · 吉隆坡 (`bukit-jalil`) | [BTS WORLD TOUR ARIRANG](https://www.golive-asia.com/event-detail/175/BTS-WORLD-TOUR-ARIRANG-IN-KUALA-LUMPUR) · 2026-12-12 / 13 | 112 | 中央台与四条延伸台、58 个全坐席块、4,632 把示意椅，无站区入口 |

分区标签和像素锚点由 Codex AI 依据官方票图读取，保留于 `artist-models/bangkok-kl-anchors.json`；`scripts/build-artist-bowls.mjs` 校验原图哈希后生成两个模型。看台半径、层高、排数和椅子数量均为估算，不是逐座来源库。原根目录 36 个旧合成分区没有被改写；本地模型覆盖与本场票图独立保存。相邻分区按角间距限制跨度，不补无归属的座位。看台示意椅分别为 13,496 / 46,470 把，均无真实票号。

事件配方继续由 `build-concert-map-references.mjs` 生成不可变版本，绑定模型哈希。曼谷保留端台、设备区和后部 ST；吉隆坡保留四翼朝向共享网格（A/B/C/D 四个方向），不能逐块朝中心散排。原 WebP 与派生 PNG 的哈希、无查询参数的来源 URL、AI 描摹和估算坐标记录齐全；未保留临时签名 URL。基础场馆没有默认舞台，只有选择事件后显示本场舞台、人物和临时内场。许可及独立尺度仍未确认，保持 localOnly / not-published，不能用于真实库存、封区判断或实测距离。

Ego 实际验收两馆 2D/3D、内场坐席/站区入口、人物、手机 1–10×、转头、屋顶和全屏。曼谷 ST 眼位 `[-1.004,1.225,22.820]`、吉隆坡 A4 眼位 `[3.096,1.225,-21.098]` 在拖动和变焦期间保持；10× FOV 约 5.36°，入座清空票面排座并禁用保存。吉隆坡返回常规布局后事件图形、临时椅子、人物与临时视点共同清除；99999 未知排座拒绝定位。390px 页面无横向溢出；日文控件/地区及来源链接正确；O2 16,882 把、Hydro 10,109 把及单一查询表单保持。排端与建筑轮廓仍为简化模型，测试和截图不证明现场精度。

完整回归 **359 项：358 通过、0 失败、1 项真实 PostgreSQL 集成因缺少独立数据库跳过**。最后仅调整来源/精度说明后，两批专项 **7/7** 通过；`npm run check`、生成器/加载器语法与 diff 检查通过。

画面：[曼谷 2D](preview/artist-bangkok-event-2d.png)、[曼谷 3D](preview/artist-bangkok-event-3d.png)、[曼谷站区视角](preview/artist-bangkok-standing-view.png)、[吉隆坡 2D](preview/artist-kl-event-2d.png)、[吉隆坡 3D](preview/artist-kl-event-3d.png)、[吉隆坡坐席视角](preview/artist-kl-seat-view.png)、[390px](preview/artist-kl-mobile.png)。本地入口：`/zh-CN/concert-views?venue=bukit-jalil&event=kuala-lumpur-bts-20261212&mode=3d`。
