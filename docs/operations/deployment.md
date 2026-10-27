# StagePeek 部署与权限记录

> 最新发布（2026-10-27）：A + E 正式首页已上线，代码 `34c5c8da53abc66491cdabc8e0bde2597366dee2`，原 Coolify 应用 / VPS3，running:healthy；公网 44/44。详见 [首页发布记录](homepage-release-2026-10-27.md)。下方旧版本表为历史快照。

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
