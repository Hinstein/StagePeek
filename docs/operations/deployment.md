# SeatPeep 登录、权限与部署记录

## 项目状态

- slug：`seatpeep`
- 当前运行时：Node.js 24+ 原生 HTTP + SQLite MVP
- 健康检查：`GET /healthz`（同时保留 `GET /api/health`）
- 本地启动：`npm run start:local`
- 生产启动：`npm start`
- 当前仓库：本地 Git `main` 分支；尚未配置远程仓库

## 已完成

- 邮箱 Magic Link：浏览器绑定、一次性消费、会话撤销和速率限制。
- Google OAuth：PKCE、state 与浏览器绑定；本地模式只提供明确标记的模拟回调。
- Stripe 月订阅：Hosted Checkout、Webhook 状态核验和付费场馆服务端门禁。
- Brevo 事务邮件适配：生产配置使用 `BREVO_API_KEY`；`RESEND_API_KEY` 仅为兼容回退。
- 免费层权限：默认 10 个来源证据最完整的场馆。
- 管理员权限后台：`/admin.html`；管理员通过 `/api/admin/access` 读取和保存恰好 10 个免费场馆。
- 数据库迁移：`access_settings` 表由 `openStore()` 幂等创建，保存名单、更新时间和管理员邮箱。

## 生产环境变量

必须放在 Coolify secret 或服务器密钥文件中，不进入 Git：

```dotenv
NODE_ENV=production
APP_URL=https://<正式域名>
HOST=0.0.0.0
PORT=<应用节点端口>
ADMIN_EMAILS=<管理员邮箱>
BREVO_API_KEY=<服务器端密钥>
EMAIL_FROM=SeatPeep <login@verified-domain>
GOOGLE_CLIENT_ID=<服务器端密钥>
GOOGLE_CLIENT_SECRET=<服务器端密钥>
STRIPE_SECRET_KEY=<服务器端密钥>
STRIPE_PRICE_ID=<每月 recurring Price>
STRIPE_WEBHOOK_SECRET=<服务器端密钥>
FREE_VENUE_IDS=kai-tak-stadium,hong-kong-coliseum,asiaworld-arena,asiaworld-viva,asiaworld-summit-hall-2,asiaworld-runway-11,taipei-arena,tottenham,metlife,sofi
```

`DEV_MAILBOX=false`，生产环境不能开启本地收件箱。`TICKETMASTER_API_KEY` 如果启用，也只能放服务端。

## 部署阻塞

按照快速开发和多 VPS Skill，正式部署还需要项目正式域名、远程仓库地址（或 Coolify 可访问的源码来源）以及本机的 `~/.config/openp7m/platform.env`。当前本机没有该凭据文件，也没有为 SeatPeep 记录域名，因此只能完成本地开发和部署前验证，不能声称已经上线。

## 验收命令

```sh
npm ci
npm run check
npm test
npm run build
curl -i http://127.0.0.1:4180/healthz
```

上线后还要分别验收：真实 Brevo 登录邮件、Google callback、Stripe webhook、`/admin.html` 权限配置、免费场馆和任一付费场馆的 403/200 行为，以及 Caddy/HTTPS 路由。
