# StagePeek 品牌、SEO 与开发交付

> 历史阶段记录：本文件中的空仓库、缺少正式域名、VPS3 直连阻塞及生产仍用 SQLite 等说法已被后续执行取代。最新数据库/部署事实见 [PostgreSQL 迁移记录](postgresql-migration-2026-10-25.md)。不要对现有应用重新执行通用 launch --apply。

日期：2026-10-25。范围：已授权的更名与 SEO 开发；本记录不证明生产部署、DNS 生效或搜索收录。

## 产品与技术栈

- 品牌 / package slug：StagePeek / stagepeek。
- 目标域名：https://stagepeek.live。
- 原生 Node.js 24+ HTTP、浏览器 ES modules / Three.js、VPS1 Supabase PostgreSQL 独立 schema；SQLite 仅作离线回退。
- 继续使用现有 Magic Link / Google OAuth、Stripe 月订阅与服务端场馆权限。
- 数据库迁移：开发 SQLite 已备份并迁入 `site_stagepeek_dev`；生产 `site_stagepeek` 已建表但尚未执行线上 SQLite 数据迁移和应用切换。保留旧文件、ss_ Cookie、Stripe metadata/idempotency 和本地账号标识便于恢复。
- 项目目录和旧 Git / Coolify 资源不随品牌文字自动迁移；历史 REA 证据与研究文件保留原名。
- PostgreSQL schema：`site_stagepeek` / `site_stagepeek_dev`；各自独立应用角色和 RLS。RLS 用于服务端项目角色隔离，用户行级授权仍在应用中执行；没有开放浏览器直连。共享 Supabase Auth / site_id / Storage bucket 尚未接入。
- Umami Website ID：尚未在本轮创建或验收；已补 UMAMI_WEBSITE_ID 可选配置与现有 analytics.auturance.com 的加载能力。仅生产规范首页的匿名无参数访问会加载脚本，DNT/GPC 生效；不传票号、账号、查询参数、hash 或 referrer。未配置时完全不加载。部署前仍需创建独立站点并核验 pageview。

## 搜索意图与 URL

| 搜索意图 | 关键词 | URL | 页面价值 / 操作 | 索引 |
| --- | --- | --- | --- | --- |
| 提前了解演唱会座位与舞台方向 | 演唱会座位视角、演唱会座位图、3D 座位图、场馆分区图、concert seat view、3D seating chart | https://stagepeek.live/ | 场馆选择、票号核对、2D/3D、观众视角、手机取景、来源覆盖说明 | 正式域名的生产实例允许 |
| 同一工具的座位或场次状态 | 同义意图，不创建大量关键词页 | /?venue=… 等 | 保留深链；canonical 指向 / | 合并到 / |
| 旧首页路径 | 无单独意图 | /index.html | 308 → /，保留查询参数 | 重定向 |
| 后台 / API / 设计选项 | 无公开搜索意图 | /admin.html、/api/*、/mockups/*、/brand/options/* | 后台数据由认证保护，noindex 仅控制搜索 | noindex |
| 登录与支付回跳 | 无公开搜索意图 | /?auth=…、/?billing=…、/?token=… 等 | 保留业务流程，不进入搜索 | noindex |

当前只有中文完整工具页，英文关键词作为功能名称自然出现，没有伪造英文翻译或 hreflang。面向欧美进一步获客时，应增加真正的英文首页/工具文案及独立搜索意图内容。本轮未测搜索量或排名，不承诺排名提升。

## 已补齐

- 标题、description、唯一 H1、canonical、主题色与品牌 favicon。
- Open Graph / Twitter 分享信息，1200 × 630 自有品牌分享图及可编辑 SVG。
- 初始 HTML 中可抓取的产品说明、三步使用方法、精度与免费层 FAQ。
- robots.txt、仅列真实公开规范首页的 sitemap.xml，服务端正确 XML MIME。
- 后台、预览、工具 API、错误页与认证回跳的 X-Robots-Tag；本地和其他 staging 实例统一 noindex。
- D2 Arena Bowl 图标保留，正式字标 StagePeek 已同时应用于工具、A–E 首页设计稿、登录对话框、邮件和套餐名称。

统计实现依据 [Umami tracker 配置](https://docs.umami.is/docs/tracker-configuration) 与 [自定义 payload](https://docs.umami.is/docs/tracker-functions)：关闭自动采集，只发送固定首页信息；不调用 identify。

没有增加 meta keywords 堆词，没有编造评分、评论、价格、真实照片、逐座精度或实时票务库存。A+E 首页仍为独立设计预览；本轮没有把设计稿擅自替换为正式根路由。

## 开发预检 findings 与状态

| severity / 分类 | 位置 | 触发与影响 | 证据 / 建议 | 状态 |
| --- | --- | --- | --- | --- |
| S2 代码缺口 | public/index.html:5 | 公开抓取时旧品牌且缺少规范 URL、分享和功能正文 | 原始 HTML；已补品牌、metadata 和正文 | 已修复并由 HTTP 测试验证 |
| S2 代码缺口 | server/app.mjs:15 | sitemap XML 不能按正确类型提供；预览缺少统一 noindex | 原 MIME 列表/静态路由；已加 XML、308 与 crawler headers | 已修复并由 HTTP 测试验证 |
| S2 架构/模板不匹配 | server/config.mjs:22 | 原 SQLite 同步查询不能连接 PostgreSQL | 已改为异步存储层，开发数据已迁入 `site_stagepeek_dev`；生产 schema 已建立，自有 AuthService 保留 | 本地真实 PG 已验收，生产切换未完成 |
| S2 外部服务未验收 | docs/operations/deployment.md:10 | 更名后 DNS、证书、邮件发信域、OAuth/Stripe 回跳仍需验收 | 仅有本地运行与代码证据；按下列精确地址配置后测真实流程 | 待部署验证 |
| S3 配置缺失/未验收 | 本文件“产品与技术栈” | 无独立 Umami ID 和 pageview 证据 | 不填写虚构 ID，不发送票号/账号到统计 | 待平台接入 |

## 启动与环境

```sh
npm ci
npm run check
npm test
npm run build
PORT=4181 npm run start:local
```

健康检查：GET /healthz；兼容 /api/health，JSON service=stagepeek。

生产仍使用 npm start，至少核对：

- NODE_ENV=production、APP_URL=https://stagepeek.live、DEV_MAILBOX=false、DEV_PREVIEW_ALL_VENUES=false。
- HOST、PORT、ALLOWED_ORIGINS、ADMIN_EMAILS、FREE_VENUE_IDS。
- `DATABASE_URL` 指向 VPS1 PostgreSQL 的项目专用角色；两个 schema 已建立，开发 schema 完成迁移和事务回滚验收。生产旧数据导入、Coolify 连接注入和恢复演练仍未完成。SQLite 开发快照保存在本地忽略目录。
- BREVO_API_KEY / EMAIL_FROM（需真实验证发信域）；RESEND_API_KEY 为既有兼容项。
- GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET。
- STRIPE_SECRET_KEY / STRIPE_PRICE_ID / STRIPE_WEBHOOK_SECRET。
- TICKETMASTER_API_KEY 仅用于服务端票务接入。
- UMAMI_WEBSITE_ID 为公开 UUID，服务端验证后才启用受限统计；服务端管理 API token 不进入项目浏览器配置。

服务端秘密不得放进 public、Git、截图或日志。

精确生产地址：

- Google callback：https://stagepeek.live/api/auth/google/callback。
- Stripe webhook：https://stagepeek.live/api/billing/webhook。
- canonical：https://stagepeek.live/。
- sitemap：https://stagepeek.live/sitemap.xml。

## 上线验证和回滚

本轮本地 HTTP 集成检查覆盖：规范 URL、重定向、XML MIME、sitemap 白名单、1200×630 分享图、生产/本地索引策略；已有登录绑定、管理权限、付费门禁和私有静态文件隔离测试继续运行。

上线时还需从公网核验根页 200、无 noindex、HTTPS/DNS、Google/邮件/Stripe 真实流程、管理员修改免费名单与 403/200 门禁、分享图片可访问。Search Console 所有权与 sitemap 提交/收录须单独验收；本地测试不代表收录。

回滚使用上一版应用代码/发布镜像；数据库路径与 provider 标识未变，不需要数据迁移。回滚前保持持久卷与密钥配置，不能把本地测试库部署上去。

## 本轮验证结果

- npm ci：完成；项目无第三方 npm 运行时依赖，锁文件安装成功。
- npm run check / npm run build：通过（build 为现有语法检查入口，不代表 bundler 生产优化）。
- npm test：129 / 129 通过，含 SEO 路由、统计隐私、登录、付费权限和现有几何检查。
- 浏览器：已查看 StagePeek A+E 设计稿与实际工具，确认标题、品牌资产和正文出现；1280px 工具页面无图片加载失败。
- 当前浏览器 viewport override 未实际改变该标签的 1280px viewport，本轮不声称完成 390px 真机/断点验收。截图 tool-desktop-full.png 如实按桌面保存。
- 本地预览：http://127.0.0.1:4181/；设计稿：http://127.0.0.1:4181/mockups/home-prototype.html?variant=A。
- 未在本轮发布生产，也未提交搜索引擎收录。


## 鸟巢首页交互预览

首页 A 方案的右侧示意已改为真实目录中的“国家体育场 · 鸟巢”场馆数据预览。它复用正式 Three.js 查看器，支持拖拽旋转、滚轮/双指缩放、键盘方向键切换分区、重置视角和靠近分区；滚出可见区域时暂停渲染。首页只读取脱敏的固定预览接口，不泄露座位采样、演出、票务库存或付费场馆数据。

鸟巢当前目录证据是公开资料驱动的参数化看台模型：48 个示意分区、0 条逐座采样，`metricCalibrated=false`、`completeSeatInventory=false`、演出舞台为空。因此首页用“看台参数模型 / 分区为示意 / 未含演出舞台”标注；不要把它宣传为官方 CAD 或现场实测 3D。若要达到参考站的实测级别，需要补齐鸟巢官方或授权座位图、米制校准、演出级舞台布局和独立复核。

## README 与 GitHub 同步（2026-10-25）

README 已按 StagePeek 的正式域名、Arena Bowl 品牌、A + E 首页、功能、数据精度、免费 10 馆、PostgreSQL 和已启用 / 未启用服务重新整理。PROJECT_STRUCTURE、品牌说明、首页设计文档、模型说明和场馆 Skill 的展示名称同步为 StagePeek；历史路径和兼容性标识保留。

生产已于本文后续完成 PG 切换：实际代码版本 f93a1df，独立测试 126 项通过、真实 PG 集成 6 项通过、公网 18 项通过。当前品牌/首页代码归档与 GitHub 更新不等于该工作区已重新部署。早期“无运行依赖”已过时，目前 pg 8.23.0 是锁定的服务端依赖。

### 本次品牌同步验证

- 独立副本以远端 `5f6d5fe` 为基线，只同步品牌、首页、SEO 及说明依赖，不覆盖其他进行中的场馆几何和研究改动。
- 语法检查通过；130 项测试通过，1 项真实 PG 集成入口按默认配置跳过。PG 本身的真实集成与生产证据仍引用之前的迁移记录。
- README、项目结构、部署与品牌说明的相对链接存在性检查通过；场馆 Skill quick_validate 通过。
- GitHub 仓库确认为 Hinstein/StagePeek，简介、https://stagepeek.live 主页和项目主题已更新；本地 origin 更新为正式新地址。
- README Logo 支持 GitHub 深浅色主题。本次归档未改变生产发布版本，也没有启用尚未接通的外部登录或付款服务。
