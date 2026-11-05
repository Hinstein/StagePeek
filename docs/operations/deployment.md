# StagePeek 部署与权限记录

> 最新发布（2026-11-05）：代码 `1682fa3d5defd659acb3d039f727d53dec6ff4e7` 已在原 Coolify 应用 / VPS3 上线，部署 `ur5f12toeywx3iwbtqfuuggg` Finished，新容器 healthy。下方版本记录为历史快照。

## 2026-11-05 最新代码与管理员十馆预览发布

- GitHub main 代码 SHA：`1682fa3d5defd659acb3d039f727d53dec6ff4e7`；Coolify 固定完整 SHA 构建，05:10:35 UTC 新容器健康，05:10:36 UTC 完成滚动更新。沿用原应用、VPS3、入口、共享 Auth、数据库和持久卷。
- 生产加载保留的十馆 bundle，`/concert-views` 页面、模块、API 和图像只向已登录 admin/owner 开放；响应 private/no-store、noindex。公开 `/explore` 未切换到十馆引擎，未发布权利未决研究数据。
- `npm test`：313 项，312 通过、0 失败、1 跳过（未配置独立集成数据库的真实 PostgreSQL 测试）；`npm run build`、`git diff --check` 通过。权限回归覆盖匿名/member 拒绝、admin/owner 可用及编码路径。
- 部署后公网：首页、`/explore`、`/auth/login`、`/healthz`、`/api/health`、精确 `/auth/callback` 和 `/auth/reset` 均 200；匿名研究页面、模块及 API 均 404；公开场馆目录仍为 197。
- 浏览器现有会话为 member，研究入口返回 404，未修改其权限。管理员实际页面交互本次未验收；管理员访问行为由上述服务端回归验证。
- 线上 `auth-page.mjs` SHA-256 仍为 `b6ef0f2142b7c07e0e3e51ef866c9697c4f5b8fa1cdec02978047cf46fff3aa9`，保留上一版登录反馈修复。本次未发送真实验证码邮件或执行真实密码登录。
- 回滚代码：`9ed16d43605d060b38336176220017b557126c1d`。后续文档提交不触发额外部署，运行代码固定上述 SHA。

## 2026-11-05 登录提交反馈修复验收

- 复现原因：密码登录和发送验证码请求已经发出，但反馈位于表单上方，在较矮视口滚动到提交按钮后不可见，造成“点击没有反应”的体验。
- 修复：非空反馈获得焦点；仅在反馈超出视口时滚动到可见位置。清空反馈不移动页面；未更改认证接口、账号、邮件服务、Google 配置或基础设施。
- 固定发布 SHA：`9ed16d43605d060b38336176220017b557126c1d`；原 Coolify 应用 / VPS3，部署 `g7l4qr87rqyjuupcnumgjc12` Finished。
- `npm test`：312 项，311 通过、0 失败、1 跳过；跳过项为未配置独立集成数据库的真实 PostgreSQL 测试。`npm run build`、`git diff --check` 通过。
- 公网 `/healthz`、`/api/health`、`/auth/callback`、`/auth/reset` 均为 200；线上 `auth-page.mjs` SHA-256 为 `b6ef0f2142b7c07e0e3e51ef866c9697c4f5b8fa1cdec02978047cf46fff3aa9`，与发布文件一致。
- 实际 Chromium 浏览器 1072×520 视口验证：使用保留的无效域名测试地址，密码登录返回“邮箱或密码不正确”，验证码发送返回拒绝提示；两者提示均可见并获得焦点，按钮恢复可重试。该测试不证明真实邮箱收信或真实密码成功登录已验收。
- Google 登录已在浏览器现有 Google 会话下成功返回；“Open P7M”显示涉及共享认证域名与品牌审核，属于独立问题，本次未变更。详见 [Google OAuth 记录](google-oauth-2026-10-26.md)。
- 回滚点：`316f75c5f0921211c783b65e40f9059a03e033eb`。后续文档提交不触发额外部署，运行版本固定到上述修复 SHA。

## 2026-11-04 首页等宽修复验收

- 原因：共享导航与首页内容分别设置宽度上限，先前的局部修复未统一首页规则；不是浏览器缓存或旧版本未发布。
- 固定发布 SHA：`316f75c5f0921211c783b65e40f9059a03e033eb`；部署 `rmszaremeshommzyek7udbjx`，耗时 1 分 24 秒。
- 导航、内容、页脚共用 `--site-frame-width`；同时修复平板首页预览卡片溢出。未更改身份、支付、数据库或部署基础设施。
- 线上实际测量三者的左边界与宽度完全一致：2048px 视口为 394/1260px；1440px 为 130/1180px；1000px 为 24/952px；768px 为 24/720px；390px 为 18/354px。五档均无横向溢出。
- `tests/public-pages.test.mjs` 与 `tests/concert-views-production-shell.test.mjs` 共 11/11 通过；`npm run build`、`git diff --check` 通过。
- 公网 `/healthz`、`/api/health`、`/auth/callback`、`/auth/reset` 和五语言 explore 路由均为 200；研究入口 `/concert-views` 仍为 404。
- 回滚点：`3ea4cff996a6d67feca396bef49f2b14582d1901`，部署 `lyptx417waugjwt4dwaxxxae`。本记录后续文档提交不触发额外部署，运行版本固定到上述修复 SHA。

## 2026-11-04 发布验收

- 地址：https://stagepeek.live；继续使用原 VPS1 Caddy → VPS3 应用 4180、共享 Supabase Auth 和 `site_stagepeek` PostgreSQL。未重建应用、迁移账号或修改环境与持久卷。
- 固定发布 SHA：`3ea4cff996a6d67feca396bef49f2b14582d1901`；Coolify 于 14:49:11 UTC 确认新容器 healthy，14:49:14 UTC 完成滚动更新。
- 回滚点：`2e7cf06ac4f7e21d028f02acd96661c73f6c84d7`，部署 `kiwcbzlwsjo91qwqhvzydu0p`。配置与回滚快照仅保存在受限本地目录，不进入 Git。
- 发布前 `npm test`：308 项，307 通过、0 失败、1 跳过；跳过项为未配置独立集成数据库的真实 PostgreSQL 测试。`npm run build` 通过，演唱会专项 103/103 通过。
- 修正过期测试预期：支付价格 999 美分、统计路径去除票位参数、认证页固定英语、重复注册与显式重发验证码的不同契约；未为通过测试改变生产业务行为。
- 公网 `/healthz`、`/api/health`、精确 `/auth/callback`、`/auth/reset` 均为 200；`/api/me` 确认 Supabase/邮箱验证码启用，本地邮箱与本地支付模拟关闭。
- 匿名管理接口与收藏读写均返回 401；未执行真实注册发信、付款或用户数据写入。
- 英语 `/explore` 及 `/zh-CN/explore`、`/zh-TW/explore`、`/ja/explore`、`/ko/explore` 均返回 200 和对应文档语言；浏览器确认国家→场馆选择、座位图加载正常。英语采用无前缀路径，`/en/explore` 不属于站点路由。
- Umami 标记已加载；含排座查询的 URL 仍只记录规范 `/explore` 路径，未将票位参数写入统计。此处只验证前端接线，不声称统计后台已收到事件。
- 十馆研究入口 `/concert-views` 及研究 API 继续为公网 404；未绕过本地研究和权利未决的发布门禁。本次代码上线不等于十馆数据公开发布。
- 推送保护曾发现第三方捕获 HTML 中的凭据；已删去四处凭据值并更新来源哈希，以不含该未发布历史的干净发布提交推送，未绕过 GitHub 保护。受污染的本地备份历史不得推送。

本记录后续提交仅更新部署文档；实际部署代码仍固定到以上完整 SHA。

> 当前身份方案：2026-10-26 已上线共享 Supabase Auth 邮箱验证码（生产 SHA `8eb7c62`）。原应用、PostgreSQL 和 10 个免费场馆保持；真实收信/OTP 端到端验收待完成。以 [统一 Auth 上线记录](shared-auth-rollout.md) 为准，下方旧身份/邮件状态为历史快照。

核验日期：2026-10-25。正式品牌 **StagePeek**，域名 https://stagepeek.live，仓库 https://github.com/Hinstein/StagePeek。

## 已发布生产环境

| 项目 | 当前事实 |
| --- | --- |
| 入口 | VPS1 Caddy HTTPS → VPS3 节点代理 → 应用 4180 |
| 管理 | VPS2 Coolify，复用原应用 `capinwnna0ijx4rafkwju3ms` |
| 代码版本 | `f93a1df031f2aad8dae0f3a7f40917267f4f47b0` |
| 部署结果 | `vr4rkbvg8gvvabvfqncdx2gr` finished，应用 running:healthy |
| 健康路径 | `GET /healthz`、`GET /api/health` |
| 数据库 | VPS1 既有 Supabase PostgreSQL 17.6，`site_stagepeek` schema |
| 开发数据库 | 独立 schema `site_stagepeek_dev`，不写入生产测试账号 |
| 数据链路 | VPS3 专用 SSH 数据库隧道，监听仅 Docker 网桥；未增加公网数据库监听 |
| 旧数据 | 原 SQLite 最终一致性快照已导入，保留旧镜像、配置和持久卷 |
| 场馆权限 | 目录 197 个，匿名免费 10 个；受限场馆服务端返回 403 |
| 身份 | 应用自有 Magic Link / Google OAuth 代码；未迁共享 Supabase Auth |
| 外部服务 | Brevo、Google、Stripe、Ticketmaster 实时 API、Umami 尚未启用或完成生产验收 |

详细回滚资产和验证证据以 [PostgreSQL 迁移记录](postgresql-migration-2026-10-25.md) 为准。后续 README、品牌、首页或研究提交不自动代表已部署；当前应用固定到上述验收代码版本。

## 构建、启动与检查

Node.js 24+；前端使用已保留的 vendor 资源，无独立 bundler。

```sh
npm ci
npm run check
npm test
npm run build
npm start
```

`npm run build` 当前为语法检查，不是独立的资源打包。`npm run start:local` 使用开发 PG，默认端口 4181；离线 SQLite 演示需明确使用 `npm run start:local:sqlite`，生产拒绝 SQLite 回退。

## 运行时配置

完整键名见仓库根目录 `.env.example`。值仅保存在 Coolify runtime secret 或本地忽略配置，不能进入 Git、浏览器或日志。

- `NODE_ENV=production`、`APP_URL=https://stagepeek.live`、`HOST=0.0.0.0`、`PORT=4180`。
- `DATABASE_URL` 使用生产项目角色与已验证的受保护链路；`DATABASE_SCHEMA=site_stagepeek`、`DATABASE_POOL_MAX=5`。
- `DEV_MAILBOX=false`、`DEV_PREVIEW_ALL_VENUES=false`。
- `ALLOWED_ORIGINS` 使用实际入口精确 origin，并保留当前容器健康检查需要的 localhost origin。
- `ADMIN_EMAILS`、`FREE_VENUE_IDS` 为权限配置；数据库保存的管理员免费名单优先。
- Brevo、Google、Stripe、Ticketmaster 的 secret 只在对应服务真正启用时配置。
- 可选 Umami 使用独立 Website ID；管理 token 不进入前端。

生产 Google callback：`https://stagepeek.live/api/auth/google/callback`。Stripe webhook：`https://stagepeek.live/api/billing/webhook`。配置地址不等于外部业务已验收。

## 权限

- 后台 `/admin.html`，管理 API 要求登录邮箱位于 `ADMIN_EMAILS`。
- `GET /api/admin/access` 读取；`PUT /api/admin/access` 保存恰好 10 个存在的场馆 ID。
- 名单保存在 PostgreSQL `access_settings`；每次场馆 API 请求检查权限。
- 免费 / Pro 收藏上限分别为 8 / 100；收藏配额检查和写入放在同一事务。
- 未登录的管理及收藏接口返回 401；付费场馆的数据门禁在服务端执行，前端参数不能授予权益。
- 只有服务端核验的有效订阅才解锁 Pro，支付回跳本身不授予权限。

## 既有应用升级流程

1. 阅读本记录与平台项目记录，核对现有资源、线上完整提交号和待发布范围。
2. 优先复用已登录 Coolify 或既有管理连接。VPS3 拒绝本机直连，不代表 Coolify 的节点连接不可用；不要导出 Coolify 私钥。
3. 保存环境、版本、数据与回滚点；脏工作区使用隔离发布副本，不混入其他修改。
4. 数据库切换先停止旧库写入、制作最终一致性快照、事务导入并核对计数。
5. 在原 Coolify 应用注入运行时 secret，使用**完整 SHA**发布。不要对现有应用执行通用初始化 `launch --apply` 或重建卷。
6. 验证 HTTPS、健康、权限、实际数据库、持久化、事务与所用外部服务；更新记录。

## 已执行与待验收

- PostgreSQL 发布代码：126 项测试通过，1 项集成入口默认跳过；真实开发 PG 集成另行 6 项全部通过。
- 正式域名 HTTP：18/18 通过，TLS 验证通过；未知 Host 被节点代理拒绝。
- 新生产容器实际使用 `app_site_stagepeek` / `site_stagepeek`，跨连接提交/读取和事务回滚通过，探针已清理。
- 迁移前 SQLite 与配置备份、迁移后 PG dump 均已保留；PG dump 可列出目录，完整灾备恢复演练未做。
- Brevo 登录邮件、Google 真回调、Stripe Checkout/Webhook/Portal、Umami 真实采集仍待独立接入与验收。

[早期问题记录](launch-issue-report-2026-10-25.md) 中的空仓库、未购域名、仍用生产 SQLite 等为历史状态，不是当前部署阻塞。品牌与首页工作另见 [StagePeek 交付](stagepeek-release.md)。
