# StagePeek 统一 Supabase Auth

用户明确批准“同意 方案切换到统一 Supabase Auth”，并授权 StagePeek 发信域 DNS 与 Termius VPS2 原应用更新。执行最新版开发/部署 Skill：只用邮箱验证码，不保留生产 Magic Link。技术 slug seatpeep，品牌 StagePeek。

## 实现与边界

- 共享 Auth `https://supabase.openp7m.com`，业务 `site_stagepeek`，site UUID `472e7705-2a72-423d-8aad-cf59497ab4e9`。
- 已确认旧生产 users/sessions/subscriptions/saved_positions 均为 0；迁移 002 additive 注册项目和成员权限，未自动按邮箱授予管理员。
- BFF 在线 `/user` 校验；AES-GCM HttpOnly/Secure/SameSite Cookie 仅运输共享凭据。共享身份不是独立本地会话。
- 登录 OTP 首次消费后加入普通 member。角色只取可信成员表。收藏、订阅和 checkout 按 actor + member RLS；验签后的账单 webhook 使用后端上下文。
- `/auth/callback` 为验证码工具页，`/auth/reset` 说明无密码，不启用密码恢复。均 noindex。Google provider 未配置，保持关闭。
- 刷新使用共享 Auth；退出清除本站 Cookie 并撤销相应 refresh session。不要声称已经签发的 JWT 可立即全局撤销。
- 私有文件功能尚不需要 Storage；registry 保留 bucket 名称，不把 bucket 名写入等同实际启用。

## 邮件

共享签名 Send Email Hook 代码位于 infrastructure/auth-mail，VPS1 systemd platform-auth-mail；仅 Docker bridge 172.21.0.1:14680，未公开 Hook。
按注册表精确 origin/path + 已声明 lang/next 合约选品牌，不使用用户 metadata。OpenP7M 支持 it/en 注册确认与恢复；StagePeek 支持中文/英文注册确认与邮箱 OTP。未实现邀请、改邮箱、reauth 时明确拒绝。
Brevo mail.stagepeek.live DNS 与 domain authentication 成功，sender 3 `StagePeek <noreply@mail.stagepeek.live>` active。SMTP 凭据复用服务器已有配置，秘密不入 Git。PNG 只公开两个固定路径。
持久 ledger 只存 fingerprint/status/time；相同已成功 OTP 不重发，网络不确定结果保留 pending，需申请新码；明确 SMTP 拒绝可以重试。

## 已执行验证

- 本地完整测试 138 pass / 0 fail / 1 PG integration entry skipped；新增 Auth 5、mail 3。
- 真实 PG 回滚演练通过 confirmed membership、跨用户无 WHERE 隐藏、跨用户写拒绝、普通成员后台拒绝、共享身份表隔离、可信 admin 权限。
- 迁移已备份并应用：`/root/supabase-backups/stagepeek-shared-auth-2026-10-25T16-56-03-272Z`。
- 共享路由已安装；真实 unsigned401 / unknown project422 / unsupported action422，未触发邮件。PNG200。
- 共享代理/Compose备份：`/root/supabase-backups/mail-hook-20261025T170143Z`。
- OpenP7M callback/reset 真实200。
- 应用已原地发布：Auth SHA `639b736d5661f016663043ee9ad9ca3b012c89e6`；初始邮件关闭 deployment `lkthpxoqxn7yoxomgepsfd` finished，邮件开启 deployment `rqcrpq158g3nrtfwxdtpkaqy` finished，应用 running:healthy。
- 线上 `/api/me` 确认 auth=supabase、emailOtp=true、email=true，免费名单 10 个；未启用开发邮箱、开发 Google 或模拟付费。
- [18 项不发信公网检查](../audits/shared-auth-public-2026-10-26.json) 全部通过：callback/reset 200+noindex，后台/收藏 401、付费场馆 403、跨站请求 403、无 pending 的验证码提交 400、敏感文件/开发邮箱 404。此检查不申请验证码、不创建账号。
- VPS1 SMTP TLS/auth verify 通过，Auth 容器到 Hook `/healthz` 返回 ok。为 UFW 增加唯一内部规则：`br-0ef0e383e9a8`，来源 `172.21.0.0/16` 到 `172.21.0.1:14680/tcp`；未开放公网端口。
- Brevo 回查：域 verified/authenticated=true，DKIM1/DKIM2/所有权/DMARC 四项 true，sender 3 active=true。
- 真实收件箱、From/Subject/Logo/语言与 OTP 一次性消费尚未端到端验收。本轮无真实收件授权，不发送测试邮件。尝试官方管理生成无邮件 fixture 被网关 401 拒绝，未生成凭据；已确认服务器 fixture 文件不存在、匹配的 `.invalid` 临时身份数量为 0。不能用本地模拟或 RLS 回滚演练替代真实登录验收。
- 浏览器检查发现 auth 工具页缺失深色主题，已补上 `theme-arena`，修正深色 Logo 在浅色底上的文字对比。SHA `8eb7c62f6221bd17fd71d95364b30386ede6006c`；Coolify deployment `e6kxcdgvjj3auocvtc6wv445` finished、running:healthy，公网页面已确认深色主题。

## 发布与回滚顺序

1. 原 Coolify UUID capinwnna0ijx4rafkwju3ms 保存完整配置/环境到 VPS2 root-only backup，发布完整 Git SHA，保留 volume/PG/10免费配置。初始 AUTH_EMAIL_ENABLED=false。
2. callback/reset200 后合并允许回调，启用共享 Hook；保留 OpenP7M条目/模板/原 SMTP。验证 Auth health和真实容器桥接可达后再开 StagePeek 邮件。
3. 使用明确授权的收件地址做 From/Subject/Logo/语言/验证码一次性验证。没有授权不擅自发测试邮件，只标待验收。
4. 失败先关闭 AUTH_EMAIL_ENABLED，恢复 VPS2 保存的原应用 env/SHA；回滚共享 Hook 时恢复备份 Compose 并只重建 auth，不删除身份/成员/业务数据。迁移已撤销旧应用对身份表的权限，恢复旧版自有 Auth 前必须评估v2新增共享账号，不能盲目降级。

## 备份和当前未完成项

- VPS2 原应用配置备份（host）：`/data/coolify/backups/platform-stagepeek/before-shared-auth-20261025170922.json`，root0600。
- Hook 启用备份：`/root/supabase-backups/enable-mail-20261025T171227Z`。不要重跑安装脚本覆盖当前签名密钥或重复追加 Compose extra_hosts。
- 共享 SMTP 与 Hook 密钥仅位于服务器 root-only 环境或 Coolify secrets；不进入仓库。统一平台注册表已同步实际 sender、Auth、语言路由和待验收状态。
- Google、Stripe 真实付款、独立 Umami ID 尚未完成；Storage 当前无产品功能使用，不能标记已启用。
- 旧技能文档里“Hook 尚未部署/StagePeek 自有 Auth”的 dated snapshot 已被本记录及平台项目记录取代，不可作为当前生产事实。

生产登录页截图：[邮箱验证码入口](../audits/shared-auth-login-2026-10-26.png)。验证脚本：`python3 scripts/verify-shared-auth-public.py --release <Coolify已部署完整SHA>`；不发信、不创建账号。
