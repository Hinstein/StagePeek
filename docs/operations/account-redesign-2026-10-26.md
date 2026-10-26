# StagePeek 账户中心重设计 · 2026-10-26

## 实现

账户页从登录卡片改为个人资料侧栏与套餐、收藏、安全三个内容区域，沿用深色、紫色与荧光绿品牌。手机使用单列布局与横向导航。

- `/api/me`：真实邮箱、Google 连接、当前访问套餐、场馆权限、收藏额度、订阅状态及周期。Pro 仅由服务端 access.plan 决定，历史订阅不能作为当前权限。
- `/api/positions` 与 `/api/venues`：收藏数量、场馆名与区排座、原位置回看和现有移除操作。读取失败可重试。
- 免费、试用、生效、取消续费、欠费和已结束分别说明。没有有效周期时不生成续费日期。
- 根据运行中的 billing/recovery 开关展示账单/密码入口；付款未开放时明确提示，不展示不可用付款按钮。
- 仍使用既有共享 Supabase Auth、PG/RLS、服务端权限和同意流程；未更改认证、支付、业务数据或场馆模型。

## 验证

- `npm run check`、`npm run build` 通过。
- `npm test`：164 pass，0 fail，1 默认 PG 集成入口 skipped。
- 聚焦账号与认证回归：19/19 通过。
- 浏览器使用 `.invalid` 虚构身份验证免费/Pro/取消续费、已到期及待同意状态；中英文、390×844 手机无横向溢出，安全区域可操作。
- `docs/design/account-2026-10-26/` 的截图为界面 fixture，不是真实付费账号。
- 不发送测试邮件、不进行付款、不修改真实身份；生产结果发布后追加。

## 发布与回滚

复用原 Coolify 应用 capinwnna0ijx4rafkwju3ms，发布前保存当前配置，保持 Auth/Google/PG/volume/env。本次无数据库迁移，回滚到前一镜像/完整 SHA 即可，用户身份和业务数据不回退。

## 生产验收结果

- 已上线代码：`16856dc40bf63db385e4580e0d65db07b618fa24`。
- Coolify 正式 HTTPS 管理入口原地发布；deployment `brpewakht6sfza3gkaxncpg2` finished，2026-10-26 19:31:11 北京时间完成滚动更新，新容器 healthy。
- 发布前快照：VPS2 `/data/coolify/backups/platform-stagepeek/before-account-redesign-20261026112922.json`（root0600）。原代码回滚点 `c20d37d6d2c2f5cf2dd91c1f92797817e14bb747`，环境变量未更改。
- 不发信公网检查 28/28，保留 Google/密码/注册/恢复，免费名单10。见 `docs/audits/account-2026-10-26/production-public.json`。
- 已用用户现有登录会话验收账户页：真实 Free、无付费订阅、10个免费场馆、8个收藏额度、Google已连接、收藏0/8；原票面 MetLife/103WC/46/27 返回链接正确。
- 生产390×844手机宽度与文档宽度均390；控制台无 warn/error。真实账户截图仅本机临时目录保存，不提交公开仓库。
- 付费订阅各状态使用虚构fixture测试；本次未创建真实订阅、未发邮件、未改账号密码或真实收藏。Stripe实际付款仍未开放。
