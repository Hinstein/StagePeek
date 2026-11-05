# 工作树、GitHub main 与线上交付核对 · 2026-11-05

## 结论

本次未发现已迁入 main 的十馆模块被合并过程删除，也未发现已核对的九馆原始逐座文件丢失。**确认存在交付缺口：新版十馆代码和数据已进入 main，但没有连接到生产用户访问的 `/explore`。** 本地验收页面与线上页面仍是不同渲染链路。此前“合并上线”只能说明代码版本发布，不能作为新版十馆用户体验已上线的证据。

本次仅做核对并记录证据，没有改产品代码、发布门禁、认证配置或线上数据；没有合并、部署或清理工作树。

## 版本与线上证据

| 对象 | 核对结果 |
| --- | --- |
| GitHub main（本次 ls-remote） | `3c9669a3f45568e6e82803032ba3a09e2c2c5541` |
| 本地生产集成 checkout | 同一 main SHA；核对开始时工作树干净 |
| 部署记录的运行版本 | `9ed16d43605d060b38336176220017b557126c1d` |
| 部署记录 | 原 Coolify 应用发布记录为 Finished |
| 运行版本至 main 的差异 | 只有 `docs/operations/deployment.md`，没有运行代码差异 |
| 公网健康 | GET `/healthz`、`/api/health` 均 200 |
| 公网页面 | `/explore`、`/zh-CN/explore` 均 200 |

没有独立读取线上容器的 Git SHA；运行 SHA 来自部署记录。额外从公网获取以下九个静态文件并计算 SHA-256，它们全部与 main 一致，因此最新已核对的认证反馈修复、首页宽度 CSS、公共多语言文件确实在线。动态 HTML 和健康 JSON 没有本地静态文件对应，未将其作为哈希差异。

| 公网资源 | 状态 | 与 main | SHA-256 |
| --- | --- | --- | --- |
| `/auth-page.mjs` | 200 | 一致 | `b6ef0f2142b7c07e0e3e51ef866c9697c4f5b8fa1cdec02978047cf46fff3aa9` |
| `/app.mjs` | 200 | 一致 | `dfa9e4194b9a13b331488f07cbdef9e945159b9884c8f9cb410bd2449fc5ad18` |
| `/viewer.mjs` | 200 | 一致 | `379313f7f460e213aa7579a2d5fe80cf2345d773557729b39f6d353a68e188a0` |
| `/home.css` | 200 | 一致 | `93409349b72a0310128d7d38fea8bc56c1063062489f0172ab8e1d39dcbe21c6` |
| `/site-ui.css` | 200 | 一致 | `717dd9db51b721024a773f1b28855badd49dd4c38e1a70b5fe8975e0662a1e90` |
| `/locales.mjs` | 200 | 一致 | `244a038f42b280001871e937792c5b2d4f57c68dfea9a4bd53154d6c9230b853` |
| `/translations/interface.mjs` | 200 | 一致 | `9e3577255ed10905fe0158818e731e9497ae5cf4325a1a37c01aed8d138f5cff` |
| `/venue-picker.mjs` | 200 | 一致 | `b26e55f37e25e3f6ef7f929411e525f341c3ab257250b41aea5684862ef37814` |
| `/venue-view/venue-view-controls.mjs` | 200 | 一致 | `b7a4279c7951977e83dd907232c3b6284d5434d1fd0d02e74fc488ad4829ef0d` |

## 已确认未交付到生产用户入口的内容

| 内容 | main 中的位置 | 生产实际情况 |
| --- | --- | --- |
| 新十馆模型与演唱会座位表 | `data/concert-views/`、`server/concert-views/`、`public/concert-views/` | 研究页面、模块和 API 返回 404 |
| 新版统一场馆控件、固定眼位和手机取景 1–10× | `public/venue-view/`，由 concert-view 适配器调用 | 文件虽可存在于发布包，公开 app/viewer 没有调用这套完整链路 |
| Hydro 推演编号、查询及演出预览 | concert-view Hydro 模块及数据 | 未进入公开场馆目录 |
| 新版页面上的相机状态保留、布局整理及相关国际化 | concert-view 页面与适配器 | 不能据其本地测试推定旧 `/explore` 已获得同样功能 |

具体依据：

- `server/main.mjs:17` 仅在本地开发配置、非生产、local auth 条件下加载 concertViews。
- `server/app.mjs:80` 起对 `/concert-views` 及其模块/API 执行本地、loopback 条件限制；本次公网实测三类入口均 404。
- 公开 `/explore` 使用 `public/app.mjs` 和 `public/viewer.mjs`。它们没有接入 concert-view 使用的完整共享控件链路；公开 app 的 URL zoom 仍限制为 1–8。
- 公网 `/api/venues` 返回 197 个条目，其中没有下表九个 `twcv-*` ID，也没有 `ovo-hydro`。这仅指这些新版 ID，不代表同名场馆的旧版本必然不存在。

此处需要解决的是生产入口集成及符合既有发布规则的数据可见性，**不是重新部署同一 SHA 就能解决**。本次没有通过关闭发布门禁来掩盖差异。

## 数据与归档完整性

研究根目录 `data/source-seats/index.json` 保留 50 馆、535,954 条布局座位记录。迁入新版 concert bundle 的九馆原始 JSON 与根工作树原文件逐字节一致：

| 新版场馆 ID | 原始座位记录 | 与研究根目录 |
| --- | ---: | --- |
| twcv-the-o2-arena-london | 14389 | 逐字节一致 |
| twcv-accor-arena-paris | 14493 | 逐字节一致 |
| twcv-ziggo-dome-amsterdam | 10093 | 逐字节一致 |
| twcv-uber-arena-berlin | 11256 | 逐字节一致 |
| twcv-kia-forum-los-angeles | 13869 | 逐字节一致 |
| twcv-united-center-chicago | 17335 | 逐字节一致 |
| twcv-ubs-arena-new-york | 14429 | 逐字节一致 |
| twcv-prudential-center-newark | 14979 | 逐字节一致 |
| twcv-state-farm-arena-atlanta | 13700 | 逐字节一致 |

Hydro 使用单独的数据包 `data/concert-views/hydro/venue.json` 及编号参考资产，不包含在上表九馆逐座索引内；其推演编号不能计作真实来源库存。

另外 41 馆未纳入此次九馆 concert bundle 的 source-seats 索引，仍保存在研究根目录及归档；部分场馆可能在生产使用另一版本或不同 ID，不能将“未进入此 bundle”解释为“线上数据被删除”。

归档核对：

- `archives/2026-11-02-before-main-integration/working-files.tar.gz`：按清单流式校验 5,902/5,902 文件，缺失 0、哈希不一致 0，未覆盖解压到工作区。
- `archives/2026-11-04-production-shell-restoration/`：18/18 文件通过清单哈希校验。

## 工作树与历史分支

| 工作树 | 状态及处理 |
| --- | --- |
| 研究根目录 | 分支 `codex/preserved-research-workspace-20261104`，HEAD `ab7c4e9`；47 项已跟踪修改、5,170 项未跟踪状态项（含 integration 项），主要为资料、数据、图像、脚本和研究代码；全部保留，未自动合并 |
| `integration/main-venue-views` | main，开始核对时干净，本报告是本次新增内容 |
| multilingual-20261027 | 7 个已跟踪文件修改、2 份未跟踪文档；五语言共 30 项文案变更均已存在 main，无漏合并；旧 home/index 的导航及语言入口改动已由当前生产 shell 接管，不应恢复整份旧页面 |
| 三个临时 release worktree | 路径已不存在但 Git 元数据仍在，相关提交仍保留；本次未 prune |

旧集成分支 `codex/main-venue-views-20261102` 与 main 的 public/server/data/tests 比较，仅涉及来源捕获脱敏、来源索引更新、认证反馈、首页 CSS 和测试期望等 12 项路径变更，未发现 concert 模型或模块在该交付范围内被删除。此项是文件范围比较，不以分支祖先关系推断功能遗漏；不应盲目 cherry-pick 旧研究历史。

## 测试与验收记录缺口

实际运行：

```sh
node --test tests/concert-views-http.test.mjs tests/venue-view-entrypoints.test.mjs tests/concert-views-production-shell.test.mjs
```

结果 **9/9 通过**。它们验证了保留业务文件、共享组件约束及研究入口隔离；其中入口测试只约束 custom concert 引擎。**这些测试没有证明新版十馆在生产 `/explore` 可使用。** 本次没有重跑全库测试，也没有验证真实邮箱投递或数据库备份。

`docs/projects/concert-views/README.md` 中“共享控件覆盖主站 public app/viewer”等历史表述超出了当前代码证据；部署文档则明确保留了研究入口 404。后续应以实际入口依赖图和线上交互验收为准，避免把本地验证、提交 main、发布代码、生产开放数据四件事混称完成。

## 后续应闭环的交付项

1. 将已验收的统一 2D/3D 场景能力接到生产使用的入口，沿用生产外壳及认证/支付。
2. 对明确允许公开的数据按场馆/事件各自规则接入；未决研究数据继续隔离，不因入口集成自动公开。
3. 为实际生产入口补充断言：场馆目录、对应模型、演出切换、手机 1–10×、固定眼位、五语言切换均应指向验收版本。
4. 部署后在真实 `/explore` 路由验收，并记录模型/资产版本；不能仅凭健康检查和静态文件存在宣称功能交付。

本报告证明已核对范围内文件和资产的保存情况，不证明每个历史工作树修改都应上线，也不证明数据库、邮件或每个历史行为已完成审计。
