# 探索页与用户流程重设计验收

2026-10-28，Asia/Shanghai。本记录对应设计说明 [2026-10-28-stagepeek-page-ux-audit-design.md](../../../../docs/superpowers/specs/2026-10-28-stagepeek-page-ux-audit-design.md) 及实施计划 [2026-10-28-page-ux-redesign.md](../../../../docs/superpowers/plans/2026-10-28-page-ux-redesign.md)。

## 已完成

- 探索页改成“选择场馆 → 输入票面位置 → 查看视角”三步流程；每一步有当前状态和下一步提示。
- 场馆目录、场馆详情、座位核对、3D 场景和演出列表都有加载、成功、失败与重试反馈。座位核对成功后，页面状态明确提示查看下方视角。
- `Find my seat` 只在场馆加载完成且区、排、座均有内容时可提交；提交期间按钮显示处理中状态。
- 座位匹配结果支持来源座位、示意位置、未匹配和布局不可用等不同说明；不把示意坐标包装成已核实座位。
- 游客保存座位时说明登录原因；登录用户保存成功后显示确认，并提示到账号页查看收藏。
- 移动端改为单列步骤卡和输入卡，操作按钮保持足够触控高度；语言按钮和登录入口在窄屏保持可见。
- 五种语言补齐探索页标题、步骤、输入提示、状态、重试、保存反馈和地图图例；语言切换会保留场馆、演出、布局、区、排、座、模式和缩放上下文。

## 实际回归

- 本地 Ego 桌面流程：加载目录、切换香港启德、输入 `101 / A / 78`、成功匹配、状态转为 `Seat found`、步骤转为第 3 步。
- 本地 Ego 移动流程：390×844，页面 `scrollWidth=390`，无横向溢出；截图见 [explorer-ux-mobile-20261028.png](explorer-ux-mobile-20261028.png)。
- 地球按钮菜单显示 English、简体中文、繁體中文、日本語、한국어；简中与日文切换后保留 Kai Tak 和票面查询参数。
- 游客点击保存会打开登录窗口并显示保存原因；登录窗口没有注册入口。
- `npm run build` 通过。
- `npm test`：186 项测试，185 通过，1 项真实 PostgreSQL 集成测试按项目配置跳过，0 失败。
- 新增 `tests/explorer-ux.test.mjs`，覆盖三步结构、异步状态区、重试按钮、提交条件和保存反馈；`tests/app-selection.test.mjs`、`tests/lazy-viewer.test.mjs`、`tests/interface-locales.test.mjs` 也全部通过。
- `git diff --check` 通过。

## 保留边界

本轮没有改变座位数据、3D 几何、来源资产、免费场馆政策、订阅协议或认证协议；真实分区图、代表视角和模型清晰度继续按用户要求留待数据准备完成后处理。

## 线上发布复核

- Coolify deployment `cxttj1dbvppfxunxwdh8f1fa` 已完成，状态为 `Finished`，运行在 VPS3；发布提交为 `47f0c4b9fcd24b0cc5f4a38eba4fcc5339dbc12c`，健康检查通过。
- 线上 `/explore` 默认英文；地球按钮可切换 English、简体中文、繁體中文、日本語、한국어。启德 `101 / A / 78` 真实匹配后显示 `Seat found`，流程进入第 3 步。
- 线上 `/venues/` 已按地区与国家分组，当前显示 197 个场馆；SoFi 的两场同名演出已按 `2026-11-15`、`2026-11-16` 分成日期组，每组使用紧凑卡片，避免长条列表。
- 390px 线上复核 `scrollWidth=390`；补丁后语言按钮在 480px 以下保持可见。截图见 [explorer-ux-live-mobile-20261028.png](explorer-ux-live-mobile-20261028.png)。
- 补丁后 `npm run build` 通过；使用共享依赖和本地回环权限重新运行完整测试：187 项，186 通过，1 项真实 PostgreSQL 集成测试按配置跳过，0 失败。
- 浏览器调试确认：日文路由初始 `locale=ja`，但异步加载期间文档的 `lang` 被变成 `zh-CN`，导致动态反馈跟随文档属性变化。语言改由 URL 路由确定，并新增此场景的回归测试；同时修正简中“找到我的座位”和成功/未核实反馈的翻译键。
