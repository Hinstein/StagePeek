# SeatPeep 登录、权限与部署记录

## 项目状态

- slug：`seatpeep`
- 当前运行时：Node.js 24+ 原生 HTTP + SQLite MVP
- 健康检查：`GET /healthz`（同时保留 `GET /api/health`）
- 本地启动：`npm run start:local`
- 生产启动：`npm start`
- 当前仓库：本地 Git `main` 分支；尚未配置远程仓库
- 正式域名：待用户购买；当前不配置 `openp7m.com` 或其他旧域名。买好后把域名和 DNS zone 写入平台 manifest。
- Coolify 项目：`OpenP7M SaaS Projects`
- Coolify environment：`production`（已创建；应用资源尚未创建）

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

## 本轮上线测试

- `npm run check`：通过。
- `npm test`：118/118 通过。
- 生产配置临时实例：`GET /healthz` 返回 `200`，正式域名 Host 校验通过，安全响应头存在。
- 已修正一个过期测试断言：产品目录当前为 197 个已发布场馆，测试原来仍期待 217 个候选场馆。
- 已生成平台 manifest：`platform/config/seatpeep.json`。
- 架构核对：SeatPeep 当前使用服务端 SQLite（`var/seatpeep.sqlite`）和自有 Magic Link/Google/Stripe 实现，尚未接入共享 Supabase Auth、`site_members`、schema/RLS 或 Storage bucket；因此本轮可以做部署链路测试，但不能把“共享平台数据隔离”标记为已验收。

## 部署阻塞

按照快速开发和多 VPS Skill，正式部署还需要：

1. `Hinstein/seatpeep` 当前是空 GitHub 仓库，Coolify 没有可拉取的源码；需要把当前本地代码推送到该仓库，或提供另一个可访问的 Git/Docker 来源。
2. 本机缺少 `~/.config/openp7m/platform.env`，因此一键入口还没有 Coolify、Spaceship 和 Umami 的 API 凭据。
3. 新域名尚未购买，Spaceship A 记录暂不写入；买好后需要把新域名指向 VPS1 `43.135.155.97`。
4. Brevo、Google OAuth、Stripe 的生产密钥没有写入项目环境，邮件、Google 登录和真实订阅仍不能标记为生产验收通过。

这些是外部资源配置阻塞，不影响代码测试和本地生产模式验证；在源码来源和 API 凭据补齐后，可以直接执行：

```sh
node platform/scripts/platform-cli.ts launch platform/config/seatpeep.json --apply
```

## 验收命令

```sh
npm ci
npm run check
npm test
npm run build
curl -i http://127.0.0.1:4180/healthz
```

上线后还要分别验收：真实 Brevo 登录邮件、Google callback、Stripe webhook、`/admin.html` 权限配置、免费场馆和任一付费场馆的 403/200 行为，以及 Caddy/HTTPS 路由。
