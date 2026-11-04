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
