# Google OAuth 生产接入 · 2026-10-26

状态：**已配置、已启用，真实 Google 授权与原票面座位回跳通过。**

## 实际配置

- 用户指定 hinstein li 账号操作 Google Cloud；独立 StagePeek 项目 `powerful-link-512806-a4`，未修改 PerpPulse/InboxRevamp。
- OAuth Web Client：`Shared Supabase Auth · StagePeek`。仅 `openid`、`userinfo.email`、`userinfo.profile`，没有 Gmail、Drive、Cloud 管理权限。
- Google 唯一 redirect URI：`https://supabase.openp7m.com/auth/v1/callback`。
- 应用最终 callback：`https://stagepeek.live/auth/google/callback`，精确加入共享 Auth allow-list，原项目地址保留。
- Consent External / In production。Google Verification Center 明确基本权限不要求数据访问审核；品牌尚未验证，Google 登录页当前显示 `openp7m.com`，不能称为 StagePeek 品牌审核通过。
- 首页、隐私政策与条款均链接 StagePeek 真实页面；用户已分别确认 Google 数据政策、客户端创建、Production 发布、真实账号授权与本站条款。
- 凭据只在 VPS1 `/opt/supabase/.env` 及 root 私有备份；本地临时凭据文件已删除。Git、StagePeek 容器和浏览器业务代码不保存 Client Secret。

## 发布与备份

- 生产代码仍为 `c20d37d6d2c2f5cf2dd91c1f92797817e14bb747`，仅启用已有 Google 实现。
- Coolify 原应用 `capinwnna0ijx4rafkwju3ms`；部署 `1c84b4e7-14d1-4bf6-8a22-c00ace66c7d6` finished，应用 `running:healthy`，2026-10-26 06:57:05 UTC 完成。
- VPS1 备份：`/root/supabase-backups/stagepeek-google-20261026T065459Z`，包含原 `.env` 与 `docker-compose.auth-templates.yml`，目录700、文件600。
- VPS2 Coolify 备份：`/data/coolify/backups/platform-stagepeek/before-google-oauth-20261026065636.json`，root600。
- 仅重建现有 Auth 服务，保留邮件 Hook、SMTP、数据库、用户、项目权限、VPS3应用数据卷和隧道。

## 验收证据

- [公网检查](../audits/google-oauth-2026-10-26/production-public.json)：28/28，Google enabled、共享 S256 PKCE、精确 callback、免费10场馆、匿名后台/保存拒绝、付费场馆拒绝、开发入口关闭。不发信、不创建用户。
- 认证回归：`node --test tests/auth-flows.test.mjs tests/supabase-auth.test.mjs`，15/15 通过（本地 HTTP mock，非真实邮件投递）。
- [真实浏览器验收](../audits/google-oauth-2026-10-26/google-browser-acceptance.json)：指定真实账号 Google 授权 → 共享 Auth → StagePeek 条款 → MetLife / 103WC / 46 / 27，票面别名保留。
- 登录后 `/api/me`：googleConnected=true、role=member、plan=free、免费10，consentRequired=false。后台接口 `ADMIN_REQUIRED`，KSPO 付费接口 `SUBSCRIPTION_REQUIRED`。
- Google 登录创建/连接的真实账号保留，不作为临时测试身份删除。未付款、未发送邮件。该座位来源缺 XYZ，截图没有声称距离准确。
- [Production 状态截图](../audits/google-oauth-2026-10-26/production-audience.png) · [原座位回跳截图](../audits/google-oauth-2026-10-26/login-return-seat.png)。个人账号授权截图仅本机留存，不提交公共仓库。

## 回滚

先将原 Coolify 应用 `AUTH_GOOGLE_ENABLED=false` 并部署原代码，隐藏入口；现有邮箱密码、OTP、恢复照常使用。需要撤销共享 Provider 时，用上述 VPS1 备份恢复 `.env` 与 Auth override，只重建 Auth。该步骤影响以后复用此 Provider 的项目，须先盘点；不删除已生成身份或业务数据，不回退 PG 迁移。回滚点已保存，未执行破坏性回滚演练。

## 尚未完成

- Google StagePeek 品牌验证；在完成前授权页展示共享 Auth 域名。
- 品牌邮件真实收件箱端到端验收，未因 Google 登录成功而标记完成。
- Stripe、Umami 的外部配置不在此次 OAuth 完成范围。

官方配置依据：[Supabase Google](https://supabase.com/docs/guides/auth/social-sign-in/auth-google)、[Google Web Server OAuth](https://developers.google.com/identity/protocols/oauth2/web-server)。
