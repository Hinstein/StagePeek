# SeatPeep 上线流程问题汇总

日期：2026-10-25（Asia/Shanghai）

## 已通过

- `npm run check`：通过。
- `npm test`：118/118 通过。
- 临时生产配置启动成功，`GET /healthz` 返回 `200`。
- 正式域名 Host 校验、安全响应头、HSTS、CSP 和静态资源访问已通过本地验收。
- Coolify 已创建项目 `OpenP7M SaaS Projects` 和 `production` 环境。
- 部署 manifest 已保存到基础设施仓库的 `platform/config/seatpeep.json`，但域名字段故意保留为占位符，防止误写旧域名 DNS。

## 代码和架构问题

### 1. SeatPeep 还没有接入共享 Supabase

当前代码使用：

- 服务端 SQLite：`var/seatpeep.sqlite`
- 自有 Magic Link 登录
- 自有 Google OAuth
- 自有 Stripe 订阅和权限表

当前没有使用：

- 共享 Supabase Auth
- `site_members`
- 项目 schema/RLS
- Supabase Storage bucket

因此它可以作为“独立 SQLite 项目”部署测试，但不能标记为“共享平台项目”已验收。需要二选一：

1. 保留 SQLite，并在 Coolify 为应用挂载持久化 volume；或
2. 按平台标准把用户、会话、订阅和业务数据迁移到共享 Supabase，并补齐 RLS 和项目成员关系。

在没有做出选择前，不应把它作为共享 Supabase 模板发布。

### 2. 生产第三方能力尚未接通

代码已实现 Brevo、Google OAuth、Stripe 的接口，但本地没有生产密钥，因此以下项目只能标记为“代码已验证”：

- Brevo 真实登录邮件
- Google 真实回调
- Stripe Checkout、Webhook 和 Billing Portal
- Ticketmaster 真实 API

## 平台和外部资源问题

### 3. GitHub 仓库为空

目标仓库 `Hinstein/seatpeep` 当前存在但没有提交。Coolify 没有源码可拉取。

本机 Git 也没有 `origin`，并且当前 GitHub CLI 登录令牌已失效。推送前需要重新登录 GitHub，或提供一个可访问的 Git/Docker 源码地址。

### 4. 平台 API 凭据缺失

本机没有 `~/.config/openp7m/platform.env`，因此一键入口还不能执行：

- Coolify API URL、Token、项目 UUID、节点 UUID
- Umami API Token
- Spaceship API Key/Secret

### 5. 新域名尚未购买

本轮不写入任何 DNS，不配置 `openp7m.com`。新域名购买后需要：

```text
A 记录：新域名或子域名 → 43.135.155.97
```

随后再写入 manifest、配置 Caddy、申请 HTTPS 并执行公网健康检查。

## 当前可执行的收尾顺序

1. 重新登录 GitHub，推送当前 SeatPeep 代码。
2. 决定 SeatPeep 保留 SQLite 还是迁移共享 Supabase；若保留 SQLite，先配置 Coolify 持久化 volume。
3. 用户购买新域名并配置 A 记录。
4. 创建 `~/.config/openp7m/platform.env`，补齐 Coolify、Umami、Spaceship 凭据。
5. 填入 Brevo、Google、Stripe 的生产环境变量。
6. 执行：

```sh
node platform/scripts/platform-cli.ts launch platform/config/seatpeep.json --apply
```

7. 重新执行真实邮件、Google、Stripe、RLS/权限、DNS/HTTPS、回滚和恢复验收。

## 结论

当前没有发现新的代码测试失败。剩余问题主要是外部账号/域名/凭据，以及 SeatPeep 与共享 Supabase 架构尚未统一；这些问题不能通过继续重复部署命令解决。
