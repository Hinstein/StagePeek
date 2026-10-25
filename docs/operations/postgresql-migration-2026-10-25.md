# StagePeek PostgreSQL 迁移记录

日期：2026-10-25（Asia/Shanghai）。本记录覆盖工作区代码、VPS1 建表和本地预览，生产切换的最新结果见本文末尾的 Coolify 执行记录。

## 用户要求与平台事实

用户明确要求 PostgreSQL。开发 Skill 默认复用 VPS1 Supabase PostgreSQL；此前保留 SQLite 是已有项目的兼容规则，并非默认推荐 SQLite。用户本次要求覆盖该兼容选择。

通过既有 SSH 只读核验：VPS1 `43.135.155.97` 的 `supabase-db` 为 healthy，实际 PostgreSQL 版本为 **17.6**，数据库为 `postgres`，容器配置端口是 **55432**。宿主机另有 `127.0.0.1:5432` PostgreSQL；本项目复用 Supabase 的实例，未增加 PostgreSQL 容器或开放公网数据库端口。

## 实施状态

| 项目 | 状态 |
| --- | --- |
| 生产目标 schema `site_stagepeek` | 已创建项目角色和 RLS；真实线上 SQLite 最终快照已按逐表计数导入 |
| 开发 schema `site_stagepeek_dev` | 已创建；本地 SQLite 已一致性快照并导入 |
| 应用数据库层 | 已改为异步查询、固定 PostgreSQL search_path、受限连接池、参数化 SQL |
| 生产强制 PostgreSQL | `NODE_ENV=production` 缺少 DATABASE_URL 立即拒绝启动，不回落 SQLite |
| 本地默认启动 | `npm run start:local` 使用 PostgreSQL；SQLite 需明确运行 `start:local:sqlite` |
| 自有 Auth / Stripe | 逻辑保留；存储已可在 PostgreSQL 上执行 |
| 共享 Supabase Auth | 未迁移；不能把建 PostgreSQL schema 当作共享身份接入 |
| 场馆模型 / 事件研究资产 | 继续是现有 JSON/静态文件；此次迁移的是用户、token、session、订阅、收藏、权限和限流业务表 |
| Coolify 生产切换 | 已通过 VPS2 既有管理连接与 Coolify 的 VPS3 节点密钥执行；本机直连失败不构成部署阻塞 |

生产和开发各有独立的 `app_site_stagepeek*` 账号。它们无超级用户、建库、建角色或 DDL 权限；schema 不开放给 public / anon / authenticated。各业务表启用 FORCE RLS，仅允许对应服务端角色访问。**这是项目服务端隔离**，终端用户的行权限仍由登录会话和带 user_id 的应用查询执行；没有授权浏览器直接使用数据库账号。

凭据仅保存在 Git 忽略的 `var/site_stagepeek*.env`，权限 0600，未进入聊天或 Git。部署时应放到 Coolify secret；跨机连接需验证 TLS 或 SSH 隧道，不开放 PostgreSQL 给全网。当前开发通过仅本机的 SSH 隧道到 VPS1 容器端口，不依赖公网数据库监听。

## 数据迁移

`scripts/migrate-sqlite-postgres.mjs` 默认 dry-run；`--apply` 前要求空目标。它用 `VACUUM INTO` 获取包含 WAL 的 SQLite 一致性快照，以 PostgreSQL 单事务按外键顺序导入并比对逐表行数。失败回滚，不覆盖原 SQLite；拒绝把 `*-local.sqlite` 导入生产 schema。

本次开发快照位于本地忽略目录 `var/backups/`。导入：4 个用户、2 条测试订阅、1 条限流记录，其余表为 0。原 SQLite 保留。生产账号、订单和已有收藏必须从**线上实际文件**另做快照导入，不能把空的本地正式文件视为线上事实。

## 验证

- `npm run check` 通过。
- 全量本地测试：136 通过、0 失败、1 项集成入口按默认配置跳过。
- 单独启用真实 PostgreSQL 集成检查：6 通过、0 失败、0 跳过。
- 跨两个独立连接池同时消费同一登录 token，仅一个成功；哈希存储保持。
- 登录 Session 可跨连接读取，退出后失效。
- 事务故意抛错后用户修改回滚；并发限流只允许规定次数。
- 开发账号尝试读取生产 schema / auth.users、创建表，均被 PostgreSQL 权限拒绝。
- HTTP 登录、保存位置、付费场馆 403、写入测试订阅后 200、退出登录均使用真实 PostgreSQL。
- 预切换本地端口 4182 的 `/healthz` 和 `/api/me` 返回 200，免费场馆数为 10；随后已将用户当前地址 4181 切换到 PostgreSQL，旧 SQLite 预览进程停止。
- 外部 Brevo、Google 和 Stripe 尚未真实验收；开发模拟仍明确标记。

## 代码问题预检与处理

| severity | 分类 / 位置 | 触发与影响 | 证据 / 建议 | 状态 |
| --- | --- | --- | --- | --- |
| S1 | 架构不匹配，`server/store.mjs:1` / `server/auth.mjs:19` | 旧同步 SQLite API 无法连接远程 PostgreSQL | 已增加异步存储层和真实 PG 集成验收 | 本地已修复 |
| S1 | 配置缺失，`server/config.mjs:22` | 生产未指定 PG 时可能误开空 SQLite | 生产要求 DATABASE_URL，启动时校验 schema_migrations | 已修复 |
| S2 | 并发语义，`server/store.mjs:64` | async 改造后事务可能被其他请求穿插 | SQLite 串行队列；PG 事务绑定同一连接与 schema 级 advisory lock；收藏配额检查与写入同事务 | 已修复，覆盖 token/回滚/限流竞争 |
| S1 | 外部部署未验收，VPS3 / Coolify | 本机 SSH 登录被拒绝，但 VPS2 既有管理连接和 Coolify 节点连接可用 | 已通过既有管理通道完成线上备份、快照导入和运行时密钥注入 | 生产 PG 连接及公网边界已验收 |
| S2 | 外部 provider 未验收 | 邮件、Google、Stripe 真实业务仍缺应用级证据 | 保留本地模拟；分别配置并验收 | 原有阻塞 |

## 后续生产切换

1. 从实际线上 SQLite 制作并保留一致性快照、当前应用版本和环境回滚点，暂停业务写入。
2. 导入空 `site_stagepeek`，核对用户、订阅、收藏、设置和现有 token/session；保留原文件。
3. 配置受保护的 VPS3 → VPS1 数据库连接和 Coolify secrets，避免裸露数据库端口；不能把仅本机 15433 的开发连接串直接复制到 VPS3。
4. 发布含 PG 改造的新版本，验证健康、登录、免费/付费权限、收藏和 webhook 幂等；失败时停止新写入，再恢复旧版本与旧数据库。
5. 切换后有新写入时，回滚必须迁回增量数据，不能直接启动过期 SQLite；生产备份/恢复演练仍需完成。

此前阶段未修改线上应用；下方记录后续实际生产切换。

## Coolify 生产迁移执行记录

- 重新核对部署 Skill 的 access/current-state/coolify/launch/rollback 流程和平台项目记录。发现 `/tmp/platform-vps2-ssh` 管理连接仍可用，VPS2 Coolify v4.5.0 正常；通过其既有节点密钥连接 VPS3 成功。私钥未复制到本机。此前“VPS3 直连失败所以不能备份”的结论已纠正。
- 复用原应用 UUID `capinwnna0ijx4rafkwju3ms`、VPS3、4180 端口、原 `/app/var` 数据卷、原域名/Caddy/DNS。
- Coolify 配置回滚点：VPS2 `/data/coolify/backups/platform-stagepeek/before-postgres-20261025.json`；容器/原卷与最终一致性 SQLite：VPS3 `/root/stagepeek-backups/prepg-20261025/`。均限制访问，未加入 Git。
- 使用 Coolify StopApplication 保留旧容器并停止写入，再通过旧镜像的 Node SQLite VACUUM INTO 生成最终快照。真实线上 12 张业务表当时均为 0 行；事务导入 `site_stagepeek` 后逐表计数一致。未导入开发演示账号。
- 跨机连接：VPS3 `stagepeek-db-tunnel.service` → VPS1 Supabase PostgreSQL；监听仅 Docker 网桥 `172.18.0.1:15434`，无新增公网数据库监听。专用密钥只允许 VPS3 来源转发至已核验的数据库地址，禁止 shell；systemd 自动恢复并校验主机指纹。VPS1 容器内部地址改变时需更新授权 permitopen 与隧道目标并重新验收。
- Coolify `DATABASE_URL` 为运行时加密 secret，`is_buildtime=false`；开发连接串没有直接复制到生产。
- 隔离发布副本基于已发布提交 `2881996`，只带 PG 迁移所需代码和测试，未将工作区其他页面/研究改动混入生产；提交 `f93a1df031f2aad8dae0f3a7f40917267f4f47b0` 已推送。独立副本 126 项通过、1 项默认跳过，真实 PG 集成另行 6 项全部通过。
- 首次部署使用短 SHA，Coolify 浅克隆报 `couldn't find remote ref`；已改为完整 SHA。当前部署 ID `vr4rkbvg8gvvabvfqncdx2gr`，最终状态 finished，应用 running:healthy，实际镜像为该完整提交。

### 实际生产数据库验收

在新生产容器中调用应用相同存储层，返回 `dialect=postgres`、`current_user=app_site_stagepeek`、`current_schema=site_stagepeek`。独立探针通过跨两个连接的提交/读取检查，事务故意失败后数据保持原值；探针已清理。`NODE_ENV=production`，两个开发绕过开关均为 false。数据库密码没有输出。正式域名 `/healthz` 返回 200，系统 curl TLS verify result 为 0。

自有登录、订阅和收藏已经使用 PostgreSQL，但 Brevo/Google/Stripe/Umami 仍未在此次迁移中接入，不能将数据库成功迁移表述为第三方真实登录或付款已可用。共享 Supabase Auth 也未切换。

回滚须先停止新库写入并核对增量；本次保留旧镜像和 SQLite 快照，不执行 drop schema、删除卷或通用 launch 重建。故障时可恢复已保存的 Coolify 配置并发布旧完整提交；若 PG 已有用户/订单/收藏新增，必须先处理增量，不能直接回到过期 SQLite。当前只做了事务回滚和回滚资产检查，未在完成迁移后再主动切回旧库做灾备演练。

### 公网验收与迁移后备份

- 正式入口 `https://stagepeek.live`：18/18 项检查通过，覆盖首页、健康、目录、公开资产、免费场馆 200、付费场馆 403、管理/收藏 401、私有源码/环境路径不可访问、跨来源 POST 拒绝、生产开发回调禁用。证据见 [HTTP 验收](../audits/postgres-production-http-2026-10-25.json)。
- 目录 197 个场馆，匿名免费名单 10 个。未知 Host 通过 VPS3 代理返回 503，未进入业务应用。TLS 保持证书校验，curl verify result=0。
- 迁移后 PostgreSQL 项目备份位于 VPS1 `/root/stagepeek-backups/site-stagepeek-after-migration-20261025.dump`；pg_restore --list 可以解析。该检查不是完整灾备恢复演练。
- 现有正式站点的 Brevo、Google、Stripe、Ticketmaster 为 disabled/cached-only；Umami 待接入。未发送外部邮件或创建真实付款。
