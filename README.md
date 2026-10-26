<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/brand/stagepeek-logo-dark.svg">
    <img src="public/brand/stagepeek-logo-light.svg" alt="StagePeek" width="440">
  </picture>
</p>

# StagePeek · Concert Seat View

**购票前，先看看你离舞台有多远。** StagePeek 是演唱会场馆与座位视角探索工具：按国家查找场馆，查看 2D 座位图，在 3D 中探索看台，并在有来源坐标时核对票面位置和预览观众视角。

[访问 stagepeek.live](https://stagepeek.live/) · [GitHub](https://github.com/Hinstein/StagePeek) · [项目结构](PROJECT_STRUCTURE.md) · [数据准确性](docs/data-accuracy-2026-10-24.md) · [部署记录](docs/operations/deployment.md)

> 正式名称为 **StagePeek**，域名为 **stagepeek.live**。SeatPeep / SeatScope 是项目旧称；历史研究、Skill 标识、Cookie、数据库文件名及支付幂等标识中可能保留旧名字，以兼容已有资料与数据。

## 它能做什么

- **找场馆**：按国家分组浏览目录，选择场馆和可用布局。
- **看 2D / 3D**：切换分层座位图、场馆总览和观众视角，拖拽、缩放、点击分区与来源座位。
- **核对门票**：输入 Section / Row / Seat。只有匹配来源记录的票号才被认定为已匹配，不把示意网格当成真实票号。
- **理解舞台视野**：有来源座位与舞台坐标时展示模型距离和人物取景倍率；缺少演出布局时明确说明，不自动补一个通用舞台。
- **保存位置**：账户可保存、查看和删除位置；服务端根据免费 / Pro 权限控制场馆访问及收藏配额。
- **维护数据**：管理员配置恰好 10 个免费场馆；通过录入 Skill、CLI 和管理接口整理来源、验证场馆与演出布局，再发布复核版本。

使用流程：**选择国家 / 场馆 → 选择布局或演出 → 核对分区、排、座 → 查看 2D / 3D 和来源状态**。

它不是售票平台，不提供实时可售库存、预订或购票功能。

## 当前线上状态

以下为 **2026-10-26** 的部署验收状态；代码能力和外部服务开通情况分别列出。

| 项目 | 状态 |
| --- | --- |
| 正式网站 | [https://stagepeek.live](https://stagepeek.live/)，HTTPS 与健康检查通过 |
| 场馆目录 | 197 个；不同场馆的分区、逐座和演出布局覆盖程度不同 |
| 免费 / Pro 门禁 | 免费名单可配置，当前 10 个；付费场馆由服务端检查权限 |
| 数据库 | VPS1 已有 Supabase PostgreSQL 17.6，独立 `site_stagepeek` schema |
| 数据库迁移 | 线上 SQLite 已备份并导入；生产容器实际 PG 读写、跨连接持久化及事务回滚通过 |
| 登录与项目权限 | 统一 Supabase Auth：注册确认、密码登录、验证码登录、找回密码和账号管理已上线；业务逐用户 RLS 已启用 |
| Brevo 邮件 | 发信域、品牌发件人、共享签名 Hook 和 SMTP 已配置启用；真实收信及验证码端到端验收待完成 |
| Google 登录 | 共享 Supabase Google Provider 已启用；真实账号授权、普通成员权限与原票面座位回跳已验证；StagePeek 名称与 Logo 已保存、域名所有权已验证；授权页品牌待 Google 同步后复核 |
| Stripe 付款 | 接口和服务端门禁已实现，生产尚未启用真实付款 |
| Ticketmaster | 服务端适配器已实现；生产当前为缓存模式，未启用实时 API 拉取 |
| Umami | 可选集成代码已整理，独立 Website ID 与生产采集尚未接通 |

当前账号流程生产代码：`c20d37d6d2c2f5cf2dd91c1f92797817e14bb747`，原 Coolify 应用、数据卷和 PostgreSQL 保留。Google 启用后公网检查 28/28、共享 Auth 无邮件协议检查 14/14；Google 真实授权与原座位回跳通过，真实收件箱仍待验收。见 [完整账号流程验收与回滚](docs/operations/auth-flows-2026-10-26.md) 和 [PostgreSQL 迁移记录](docs/operations/postgresql-migration-2026-10-25.md)。

## 品牌与首页设计

品牌采用 **Arena Bowl**：紫色环形看台环抱荧光绿舞台，配合深色演唱会主题。

- [深色字标](public/brand/stagepeek-logo-dark.svg)、[浅色字标](public/brand/stagepeek-logo-light.svg)、[图标](public/brand/stagepeek-mark.svg)、[品牌规范](public/brand/README.md)。
- 首页选择 **A「沉浸舞台」布局 + E「观众 / 手机视角」轻量模块**，突出产品用途、功能及三步使用流程。
- 独立预览：`/mockups/home-prototype.html?variant=A`；A–E 五套方案保留作设计资料。
- A 方案接入鸟巢目录的可拖拽 Three.js 看台预览，复用产品渲染器。它是**未实测校准的参数模型**，没有当场演出舞台，不称为官方 CAD 或真实逐座模型。
- 正式 `/` 仍是座位探索工具；首页设计预览与生产入口的区别见 [设计记录](docs/design/homepage-2026-10-25/README.md)。

## 技术结构

**Node.js 24+ · 原生 HTTP / ES Modules · PostgreSQL · Three.js / WebGL**。

浏览器依赖已保存在 `public/vendor/`，无需前端打包器。`npm run build` 目前执行代码语法检查，不代表做了独立的资源压缩构建。

| 路径 | 内容 |
| --- | --- |
| `public/` | 工具页面、2D 地图、3D 渲染器、品牌资源和首页设计稿 |
| `server/` | 认证、权限、订阅、场馆服务、票务适配与 PostgreSQL 存储 |
| `db/migrations/` | PostgreSQL schema 迁移 |
| `data/` | 场馆目录、来源座位、研究包、候选及已发布演出版本 |
| `scripts/` / `tests/` | 导入、审计、发布、迁移和自动化检查 |
| `references/rea/` | 参考站的 REA 证据、资源盘点与逆向研究 |
| `references/western-market/` | 欧美场馆、公开图纸、座位及数据来源研究 |
| `models/` | 参数化 3D 模型与几何资产说明 |
| `skills/` | 场馆 / 演出录入 Skill 和 REA 工作流 |
| `docs/` / `prototypes/` | 设计、验证、部署记录和探索原型 |

## 本地开发

```sh
git clone https://github.com/Hinstein/StagePeek.git
cd StagePeek
npm ci
```

默认本地开发使用独立 PostgreSQL schema **`site_stagepeek_dev`**。维护者按 [数据库迁移记录](docs/operations/postgresql-migration-2026-10-25.md) 准备数据库和受保护链路，将以下变量保存在被 Git 忽略的 `var/site_stagepeek_dev.env` 中：

```dotenv
DATABASE_URL=postgresql://<project-role>:<password>@<protected-host>:<port>/postgres
DATABASE_SCHEMA=site_stagepeek_dev
DATABASE_POOL_MAX=5
```

上面的地址仅是格式示例，不能直接运行。生产与开发各用独立账号；数据库凭据不能进入浏览器、Git 或聊天。

```sh
npm run start:local
```

默认访问 `http://127.0.0.1:4181/`，启动日志打印同一局域网手机地址。本地 PostgreSQL 隧道需要保持可用。本地模式为方便审核会开放全部场馆；这不是正式免费套餐规则。

无远程数据库凭据时，也可明确使用隔离的离线演示：

```sh
npm run start:local:sqlite
```

该模式默认端口 4180，使用 `var/seatpeep-local.sqlite`。**生产必须连接 PostgreSQL，禁止回落 SQLite。**

### 本地测试账户

在服务电脑通过 `127.0.0.1` 打开登录，输入测试邮箱，发送后使用“本地测试：打开登录链接”。本地模拟不向外发信，不扣款。

| 测试邮箱 | 用途 |
| --- | --- |
| `free@seatpeep.test` | 免费账号，收藏最多 8 个位置 |
| `pro@seatpeep.test` | 模拟有效订阅，收藏最多 100 个位置 |
| `expired@seatpeep.test` | 过期订阅回落 |
| `admin@seatpeep.test` | 管理员免费名单和导入接口 |

开发模拟 Google、模拟订阅和测试收件箱受非生产与回环地址限制；手机可以先测试访客浏览。旧测试邮箱保留作为兼容 fixture，不代表旧品牌仍在使用。

## 数据覆盖与准确性

**有公开分区图，不等于有逐座坐标；有来源坐标，也不等于现场实测准确。**

- 目录包含 197 个场馆，不保证每个都有真实逐座模型。证据不足的场馆保留示意 / 未校准状态。
- 七个场馆的 12 种来源布局已接入共 138,856 条来源座位记录；涵盖启德主场馆、香港红馆、亚洲博览馆 Arena / VIVA / 2 号馆 / Runway 11、台北小巨蛋。布局之间不混用票号。
- Tottenham、MetLife 和 SoFi 的来源采样主要是票号与屏幕热区；不能当作米制 XYZ，也不会给未知票号伪造入座相机。
- `metricCalibrated=false`、`completeSeatInventory=false` 的状态继续保留。模型距离不是现场测量结果，取景倍率也不是特定手机成像保证。
- 没有事件级舞台证据时显示“布局待核实”；人物、距离和座位避让只按当前证据允许的范围提供。
- 暂不提供现场照片。第三方来源的商业授权尚未逐项确认；本仓库可访问不代表第三方地图、模型、图纸和座位资产可自由再分发。

详见 [数据准确性修复](docs/data-accuracy-2026-10-24.md)、[目录导入审计](docs/shijiao-import-report.md)、[来源研究](references/western-market/) 和 [模型说明](models/README.md)。

### 场馆与演出录入

使用 [场馆 / 演出录入 Skill](skills/seat-scope-venue-ops/SKILL.md)，流程为：**来源采集 → 场馆身份匹配 → 布局建模 → 2D / 3D 几何检查 → 人工复核 → 版本发布**。

```sh
npm run venue:validate -- data/manual-venues/wembley.json
npm run venue:add -- data/manual-venues/<id>.json --publish
npm run events:refresh -- metlife
npm run ticketing:sync -- --venue sofi
npm run events:publish -- /absolute/path/reviewed-event.json
```

演出发布命令默认只校验；加 `--publish` 才写入已发布版本。Ticketmaster 同步需先在服务端配置密钥，其事件和 `seatmap.staticUrl` 只是来源线索，不能直接变成逐座 3D 模型或实时售票库存。

The Weeknd 的六个月研究保留 **58 条候选、24 个场馆**，只进入研究 / 候选层；`data/events-published/` 当前没有这批演出的已复核发布版本。不能把候选数量理解成已经校准的演唱会布局。见 [研究](docs/research/the-weeknd-concerts-2026-04-25-to-2026-10-25.md) 和 [导入审计](docs/audits/weeknd-import-2026-10-25.md)。

## 权限与生产配置

管理员在 `/admin.html` 配置**恰好 10 个免费场馆**，名单保存在 PostgreSQL `access_settings`。普通用户无法通过修改浏览器参数解锁付费场馆；付费状态只由服务端核验。

配置项以 [.env.example](.env.example) 为准，生产 secret 由 Coolify 注入：

- `NODE_ENV=production`、`APP_URL=https://stagepeek.live`、`DATABASE_URL`、`DATABASE_SCHEMA=site_stagepeek`。
- `DEV_MAILBOX=false`、`DEV_PREVIEW_ALL_VENUES=false`；生产管理员来自可信 `platform.site_members.role`，不按邮箱白名单授予。
- Brevo、Google、Stripe、Ticketmaster 配置只放服务端；未配置的 provider 明确保持关闭。
- 共享 Auth：`AUTH_MODE=supabase`、`SUPABASE_URL`、`SUPABASE_ANON_KEY`、`SITE_ID`、服务端 `AUTH_COOKIE_KEY`。
- 验证码页面：`/auth/callback`；`/auth/reset` 提供邮箱验证码恢复密码。生产 Google 入口依共享 Provider 配置开放。
- Stripe webhook：`https://stagepeek.live/api/billing/webhook`。

生产由 VPS2 Coolify 管理 VPS3 应用，VPS1 提供 HTTPS 入口和已有 PostgreSQL。沿用已有应用 UUID 与持久卷；升级前保留版本、配置与数据备份，不能用通用初始化命令重建现有生产资源。

## 验证与维护记录

```sh
npm run check
npm test
npm run build
npm run test:postgres  # 需专用开发 PG 配置；会检查 schema 隔离
```

2026-10-25 PostgreSQL 发布验收：隔离发布代码 **126 项通过**，1 项 PG 集成入口默认跳过；另行真实 PostgreSQL 集成 **6 项通过**；公网 HTTP **18/18** 通过。品牌 / 首页同步隔离副本另有 **130 项通过**、1 项 PG 入口默认跳过；验证另记于 [StagePeek 品牌与开发交付](docs/operations/stagepeek-release.md)，不混同线上发布版本。

- [项目结构](PROJECT_STRUCTURE.md)
- [生产 PostgreSQL 迁移](docs/operations/postgresql-migration-2026-10-25.md)
- [品牌与 SEO 交付](docs/operations/stagepeek-release.md)
- [首页 A + E 设计](docs/design/homepage-2026-10-25/README.md)
- [参考站 REA 证据](references/rea/)
- [场馆与演出录入 Skill](skills/seat-scope-venue-ops/SKILL.md)

## 统一 Auth 更新

用户已批准切换共享 Supabase Auth。注册先输入邮箱和密码，再用邮箱验证码完成验证并返回原座位；支持邮箱密码登录、已有账号的邮箱验证码登录，以及验证码恢复密码。邮件不含认证链接；首次成功验证后加入 StagePeek 普通成员。身份由共享 Auth 在线核验，业务收藏、订阅和后台权限由项目成员及 RLS 控制。浏览器只持 HttpOnly 加密 Cookie，不在 JavaScript/localStorage 保存访问或刷新凭据。

共享邮件路由代码见 `infrastructure/auth-mail/`，运行在 VPS1，复用已有 Brevo SMTP。域名与发件人已验证；真实收件箱验收须使用用户授权地址。部署和回滚状态详见 [共享 Auth 记录](docs/operations/shared-auth-rollout.md)。


## 完整账号流程（2026-10-26）

- `/auth/register`：邮箱 + 密码 + 条款确认 → 注册验证码 → 自动登录 → 原场馆/演出/票面排座。
- `/auth/login`：邮箱密码登录；可切换已有账号的邮箱验证码登录，验证码登录不会自动注册新身份。
- `/auth/reset`：邮箱 → 恢复验证码 → 新密码 → 重新登录。恢复凭据只在服务端短期加密保存，不授予普通业务访问权。
- `/auth/password`：登录用户重新验证本人邮箱后设置或更改共享密码；同时说明对其他平台产品的影响。
- `/account`：身份、套餐和周期、收藏位置与删除、密码管理及退出。未同意当前条款不封锁安全操作和退出。
- Google：共享 Supabase PKCE 已在生产启用，`AUTH_GOOGLE_ENABLED=true`。Google → 共享 Auth → `/auth/google/callback` → 条款确认 → 原场馆/票面排座已用真实账号验证；密钥仅在 VPS1。授权页暂显示 `openp7m.com`，StagePeek 品牌展示仍待 Google 验证。

生产依赖增量迁移 `003-auth-flows.sql`。先运行 `node scripts/auth-flows-migration.mjs` 只读检查，`--rehearse` 回滚演练，确认备份后 `--apply`。不要重跑旧的 v2 身份迁移或邮件安装脚本。生产已应用 v3、发布消费页面并启用品牌恢复路由，`AUTH_RECOVERY_ENABLED=true`。真实 Google 验收见 [Google OAuth 上线记录](docs/operations/google-oauth-2026-10-26.md)；真实收信仍需单独验收。

[账号流程设计](docs/superpowers/specs/2026-10-26-auth-user-flows-design.md) · [实施和验收](docs/operations/auth-flows-2026-10-26.md)。

### 公共场馆指南与 SEO

`/venues/` 提供首批三馆指南（启德、红馆、台北小巨蛋）。公共 HTML、canonical、索引角色、面包屑和运行时 sitemap 由 `server/public-pages.mjs` 共用登记信息生成；内容及经核验的资产指纹在 `server/public-content.mjs`。来源版本变化或读取异常时只撤下受影响指南，新增馆需先审内容和使用范围。

`npm run build` 同步生成 `public/sitemap.xml`，正式运行仍以同一登记信息动态响应。开发环境、参数工具页、认证、API、后台及原型保持 noindex。工具先显示 2D，3D 由用户点击后加载；匿名统计只在既有生产 Umami 配置有效时启用。

本次实施、测试证据及上线待验收事项见 [SEO 实施报告](docs/audits/stagepeek.live-audit/2026-10-26/IMPLEMENTATION-REPORT.md)。
