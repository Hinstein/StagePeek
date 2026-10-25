# 收尾状态记录

核对时间：2026-10-24（Asia/Shanghai）。用户未提供 Google、Resend 或 Stripe 凭据，因此本记录只确认本地可测试链路和已经取得的公开资料，不把第三方服务写成已接通。

## 已验证

- `npm test`：48 tests / 48 pass / 0 fail。
- `node --check`：`server/events.mjs`、`server/app.mjs`、`public/app.mjs`、`public/viewer.mjs`、`public/geometry.mjs`、`scripts/build-venues.mjs` 全部通过。
- 已运行的本地服务：`http://127.0.0.1:4180`，同 Wi-Fi 地址为 `http://192.168.6.150:4180`。
- 两个地址的 `/api/health` 均返回 HTTP 200 和 `{"ok":true}`。
- Tottenham 事件接口显示 Karol G 2027-07-06，并动态附带 Ticketmaster 公开座位图参考；MetLife 的 Zach Bryan，以及 SoFi 的 JAY-Z 2026-10-24 和 R&B Tour 2026-11-15 已登记公开 Ticketmaster 参考链接；Bon Jovi 当前座位图不可用，但 SoFi 对免费账号保持服务端锁定。
- 浏览器重载后确认 Tottenham 卡片显示“有公开场次座位图参考”；切换到 MetLife 后确认 Zach Bryan 显示公开参考、Bon Jovi 和 Kenny Chesney 显示“座位图待票务平台发布”。切换到 2D 后确认 187 个分区仍可交互，页面明确标注来源热区不是逐座坐标。

## 正式 REA 证据

本地 MVP 前端的正式 REA 静态分析证据：`ev_8051d82d1c974da7c74e83306956352b35de0be2af78261cb7102aa2845a3467`（`app.mjs`、`viewer.mjs`、`geometry.mjs`，shipped-artifact；JavaScript 未执行，静态图为 partial）。

当前 Codex 会话已经接入正式 `mcp__rea`。原站保留证据已导出到：

`/Users/lilinhai/Projects/rea/shijiao-evidence/re-a-evidence-bundle-2026-10-24.json`

核心证据 ID：

`ev_1f87574d159d170f4c5cad6ff7216e4cec76c521e7987993869b76591d156cd0`

这份证据观察到并静态解析了 12 个脚本，包含 React/Vite、OrbitControls、场馆数据大包和场馆/分区/布局参数线索。REA 没有执行目标站 JavaScript，也没有把低置信字符串候选当作已经发生的网络请求。

原站资料统计仍为：196 个场馆目录、188 个几何配置、270 条来源记录、154 条含估算措辞的配置、7 份独立逐座 JSON。由此可确认它采用官方资料、第三方座位数据、社交/票图交叉核对和参数化几何的混合路线；不能据此证明所有场馆都是实测或具有统一米制精度。

## 当前数据边界

已发布四馆，其中 Tottenham、MetLife、SoFi 有逐座采样；Wembley 仍保持 `completeSeatInventory=false`、`metricCalibrated=false`、`stage=generic`。当前可以精确匹配来源采样票号并显示 2D/3D 示意；未知票号不会自动落到邻近模拟座位。三馆共保留 1,798 条可用排座采样，但这不是完整逐座库存，也不是现场误差认证。

公开图纸、Virtual Venue 热区、票务座位图和观众照片可以支持分区覆盖与交叉校验。它们不能单独推出每座真实 XYZ、每场演出的舞台封区、真实距离或手机成像清晰度。公开可下载也不等于获得商用再分发许可。

## 尚未宣称完成

完整逐座座位表、统一米制 XYZ、竣工状态配准、每场演出舞台布局、Google/Resend/Stripe 真实端到端连接、真机 iOS/Android/Safari 性能，以及第三方资产的商用授权，仍需要新的来源、现场/授权数据或真实服务凭据。

## 最后一轮真实 HTTP 验收（本地模式）

- 通过 `pro@seatpeep.test` 从本地开发收件箱完成邮箱申请、同浏览器确认和 session 建立。
- `/api/me` 返回 `plan=pro`，四馆均解锁，`canSave=true`。
- `/api/venues/metlife/events` 返回 Zach Bryan 等事件，并附 `layout.status=reference-only` 的 Ticketmaster 参考。
- `/api/venues/sofi/events` 返回 JAŸ-Z 30 等事件，并附 `layout.status=reference-only` 的 Ticketmaster 参考。
- `/api/venues/metlife` 返回 146 个基础分区、602 条采样排座；`/api/venues/sofi` 返回 257 个基础分区、587 条采样排座。
- 本轮没有使用或发送真实 Google、Resend、Stripe 凭据，也没有进行真实支付。

本次会话重启后正式 `mcp__rea` 已可调用；通过 `get_evidence_bundle(detail=complete)` 重新确认原站证据记录仍被保留，核心记录由 `rea-cdp-browser` provider 产生，12 个脚本、场馆数据大包、Three.js/OrbitControls 等结论与导出文件一致。

## 观众视角手势修复

用户反馈手机上“手指往右，画面往左（上下也反）”。根因是座位视角把 pointer 位移直接加到 yaw/pitch，和相机拖拽的自然跟手方向相反。已提取 `seatDragDelta()` 并改为横纵坐标都取反；新增回归测试，当前完整套件为 48/48。Chrome 中重新进入 Tottenham 的观众视角后确认三维画面可正常渲染，Three.js 版本185、26,928把示意椅子、187个分区。

## 本地第三方流程演示

为满足“没有第三方凭据也能本地完整演示”的 MVP 需求，新增了两条严格开发模式路径：

- Google：`DEV_MAILBOX=true`、非生产、回环请求时，按钮显示“本地模拟 Google 登录”，仍使用服务端 OAuth state、浏览器绑定和一次性消费；固定开发身份为 `google@seatpeep.test`，不会访问 Google。
- 月订阅：同样的开发边界下，价格接口返回标明 `local=true` 的 $9.99/月演示价，Checkout 生成一次性本地 token，消费后写入独立本地数据库的 30 天 Pro 订阅；不会调用 Stripe，也不会被生产配置启用。

正式环境仍要求真实 Google OAuth 和 Stripe 配置；开发演示不会被写成真实 provider 已接通。
