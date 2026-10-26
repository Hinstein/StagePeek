# StagePeek 完整账号流程验收

用户批准：邮箱 + 密码 → 注册 OTP → 自动登录 → 原页面；统一 Supabase Auth。不使用自有身份或认证链接。部署沿用既有 Coolify 应用、PG 和 10 个免费场馆。

## 已实现

独立注册/登录/验证/三步恢复/账号安全/条款/隐私页面，zh-CN/en、密码显示与自动填充、重发倒计时、刷新恢复、取消/更换邮箱。账号页保留收藏和套餐周期。回跳保留演出、布局、票面分区别名、排座及取景倍率，不自动发起付款。

服务端不同 OTP 用途隔离；恢复凭据加密并单次原子消费；密码更新响应丢失时不重新开放 grant。明确临时失败可在原有效期内重试。Google 使用共享 PKCE 和浏览器绑定，provider 未配置时隐藏。

## 验证和差异

- 全量测试 148 pass / 0 fail / 1 默认 PG integration 入口跳过；实际 v3 migration/RLS 回滚演练另外通过。语法检查和构建通过。
- 审查发现并修复：临时恢复故障重试、密码提交结果未知、票面分区别名回跳、条款对安全入口的误封锁；均有回归。
- 390×844 手机注册页无横向溢出；本地 UI 使用 mock，不代表真实邮件。
- Google OAuth Client ID/Secret 缺失，生产必须保持 false。
- 本轮未获真实收件地址授权，不申请真实邮件；不能宣称收件箱全链路通过。
- 新增表保留兼容回滚，不删除共享身份/会员/收藏/订阅。生产证据见下方。

## 生产发布完成 — 2026-10-26

此节取代早期 OTP-only / recovery 未开放的历史状态。

- 代码 `c20d37d6d2c2f5cf2dd91c1f92797817e14bb747`，Coolify deployment `9d642c66-4648-4949-9b56-dc357a2e20bf` finished；04:40:43Z 创建、04:41:38Z 完成（北京时间 12:40:43–12:41:38），应用 running:healthy。
- 前一部署 `f17b4568-9e51-4efe-bee1-ba99f5d7f0eb` 为 `a5d932269ccbebefb00960650a0bc005ffc4b414`，先发布消费者页面，后启用恢复邮件与应用开关。
- 沿用 VPS3、原应用 `capinwnna0ijx4rafkwju3ms`、PG/volume/tunnel/Caddy；没有重建应用或导出 Coolify 私钥。
- `/api/me` 实际确认 auth=supabase，email/emailOtp/password/emailRegistration/recovery=true，google=false，开发 provider 全 false，免费场馆仍 10 个。
- 增量 migration 003 已备份并应用；实际 v3/RLS 回滚演练通过。VPS1 备份 `/root/supabase-backups/stagepeek-auth-flows-2026-10-26T04-29-48-096Z`。
- 品牌邮件恢复路由已加入原 Hook 注册表，启用 confirmation / magic-link / recovery。这里 magic-link 是 GoTrue 技术动作名，用户收到的仍为 OTP，不提供认证链接。VPS1 备份 `/root/supabase-backups/stagepeek-recovery-20261026T044007Z`；原 SMTP 和其他项目保留。
- VPS2 配置备份：`/data/coolify/backups/platform-stagepeek/before-auth-flows-20261026043551.json` 与 `before-auth-flows-20261026044042.json`，root0600，不入 Git。

## 最终验收证据

- [公网检查 27/27](../audits/auth-flows-2026-10-26/production-public.json)：TLS、健康、能力开关、免费10、付费403、后台/收藏401、开发/敏感入口404、跨站403、认证页200+noindex+深色主题。没有发信或创建用户。
- [共享 Auth 真实协议 14/14](../audits/auth-flows-2026-10-26/shared-protocol.json)：通过官方 admin/generate_link 生成唯一 `.invalid` 身份的 OTP，不发信；验证注册确认、重放拒绝、密码登录、恢复改密、旧密码失效、新密码身份一致与清理。临时身份已删除。报告是已完成服务器运行的脱敏记录，不是重新执行，也不是收件箱或浏览器全链路验收。
- 正式浏览器注册、密码登录、恢复页面已检查；无控制台 warning/error，回跳仍保留 MetLife 103WC / 46 / 27。只查看页面，没有提交真实邮箱或密码。
- 截图：[注册](../audits/auth-flows-2026-10-26/register-production.png)、[登录](../audits/auth-flows-2026-10-26/login-production.png)、[找回](../audits/auth-flows-2026-10-26/recovery-production.png)。desktop/mobile 无 production 后缀的图片是本地 mock，不能混用。
- 全量测试 148 pass / 0 fail / 1 默认 PG integration skipped；最后重发路由修正后 focused Auth 15/15 和语法检查通过。真实 PG migration/RLS 演练单独执行，不用默认 skip 冒充通过。

## 剩余验收与回滚

真实品牌邮件收件、From/Subject/Logo/语言与从收件箱抄码回本站的端到端流程仍待授权邮箱验收。没有发送真实测试信。Google 代码已实现，但缺平台 OAuth Client ID/Secret，生产隐藏入口，未完成真实 Google 授权。

如需回滚，先关闭 AUTH_RECOVERY_ENABLED/AUTH_EMAIL_ENABLED 并保留共享身份和业务数据；按 root-only 备份恢复对应 env/代码/Hook 注册表，不盲目降级为自建 Auth，不删除增量表或覆盖新增写入。密码属于共享身份，已完成的密码变更不能靠回滚镜像撤销；完整灾备恢复演练未做。

## 后续 Google 接入（2026-10-26）

上文 Google 未配置为当时快照；现已启用并完成真实账号、普通成员边界及原票面座位回跳验收。详见 [Google OAuth 上线记录](google-oauth-2026-10-26.md)。品牌验证和真实收件箱仍待完成。
