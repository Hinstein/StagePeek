# StagePeek SEO 实施与验证

日期：2026-10-26（Asia/Shanghai）。状态：隔离发布候选已完成，基于完整账号流程版本 a5d932269ccbebefb00960650a0bc005ffc4b414；尚待生产发布验收。主工作区其他研究与几何修改未纳入。

## 已交付

| 审核项 | 实施结果 |
|---|---|
| SEO-01 独立搜索入口 | `/venues/` 和启德、红馆、台北小巨蛋三个指南；首页、目录、指南、相关指南通过普通链接连接。没有批量生成其余场馆或座位薄页面。 |
| SEO-02 分类索引 | 页面登记信息控制 canonical、索引白名单及 sitemap。仅正式域名生产环境开放合格公共页和指定品牌/预览图片；参数页、认证、API、后台、原型、隐私/条款、未知页面、开发环境保持 noindex。原有权限检查保留。 |
| SEO-03 初始 HTML | 公共页面由现有 Node 服务输出完整正文、独有标题、description、canonical、面包屑、普通工具链接，不依赖前端 JS 或 WebGL。工具参数页保留首页 canonical 并 noindex。 |
| SEO-04 内容与默认演示 | 逐馆展示布局、分区/记录数、来源、版本指纹、来源捕获标记、页面核验日期、校准与内场/场次限制。默认优先可访问且有坐标的台北小巨蛋，其次红馆、启德。指定场馆/版本深链保持原意，受限时明确提示。 |
| SEO-05 结构化数据 | 首页 WebSite / Organization；公共内容页与可见导航一致的 BreadcrumbList。未增加虚构票价、评论、Event 或 FAQ 富结果标记。 |
| SEO-06 加载体验 | 工具先显示 2D，点击 3D 后才导入 viewer/Three.js；账户与目录请求并行。公共内容页完全不加载工具或 Three.js。WebGL 初始化失败及加载中切回 2D 有回归覆盖。尚无 Lighthouse/CWV 实测结果。 |
| SEO-07 信任与服务说明 | `/about`、`/methodology`、`/contact`、`/plans`、`/privacy`、`/terms`，首页和指南页脚可达。联系使用已核实项目仓库 GitHub，不编造客服邮箱、公司、认证或响应承诺。计划页与结算共用 billing.price()，失败不显示旧价/本地模拟价。 |
| SEO-08 最小匿名测量 | 已配置 Umami 时允许固定匿名公共路径、工具入口、手动有效定位、3D、登录入口、计划弹窗事件；事件每页去重。拒绝任意事件名和自定义数据，不发送票号、邮箱、查询串、hash、来源网址或账号标识；登录后停止动作统计，尊重 DNT/GPC。自动演示不计作有效定位。独立 Umami Website ID 已创建，生产采集待发布验收；GSC 未验收；不收集认证后注册/订阅归因，不能声称完整收入漏斗已建立。 |
| SEO-09 语言 | 保留完整简体页面及真实繁体/英文场馆别名。按原计划，完整翻译与 hreflang 等待目标市场和查询证据；未生成仅翻标题的伪语言版本。 |
| SEO-10 静态预览 | 三张原创、带尺寸/alt/说明的 SVG 布局阅读示意，可按白名单索引，手机端响应式显示。明确“非实景、非按比例”，不复制未获再分发许可的第三方图纸/座位数据，不声称提供实拍或已授权的逐座静态视角图库。 |

## 页面地图

| 意图 | canonical 路径 | 独有价值 | 下一步 | 索引 |
|---|---|---|---|---|
| 演唱会座位探索 | `/` | 产品、2D/3D 工具与限制 | 默认演示/选择场馆 | 是 |
| 选择已有指南的场馆 | `/venues/` | 三馆覆盖、布局与别名比较 | 相应指南 | 是 |
| 启德座位表 | `/venues/kai-tak-stadium` | bowl 固定看台、81 区、48,483 条记录与无场次舞台限制 | 对应版本/示例 | 是 |
| 红馆座位表 | `/venues/hong-kong-coliseum` | 四面台/正面台两个版本，分别 11,446 / 11,562 条记录 | 对应版本/示例 | 是 |
| 台北小巨蛋座位图 | `/venues/taipei-arena` | 远端/中央版本、完整色区标签，10,000 / 12,877 条记录 | 对应版本/示例 | 是 |
| 项目、方法、联系、计划 | `/about`、`/methodology`、`/contact`、`/plans` | 对应服务说明 | 场馆/工具/项目联系入口 | 是 |
| 政策说明 | `/privacy`、`/terms` | 当前功能的数据与参考范围 | 联系或计划 | 否 |

全部公共页 self-canonical。sitemap 当前 9 个 canonical URL；隐私/条款不进入。记录数不等于容量、余票或完整库存。新增版本必须更新审核指纹后再发布；来源缺失、变更或解析错误只撤下相应指南，不应使健康检查、认证或其他页面失败。运行时 sitemap 和 `npm run build` 输出的静态副本共用同一登记信息。lastmod 仅用于本批馆页的实质内容核验日期。

## 已执行验证

- `npm run build`：通过；包括语法检查和公共 sitemap 生成。
- `npm test`：隔离版本 161 项，160 通过、0 失败、1 项真实 PostgreSQL 集成入口按原配置跳过。
- `git diff --check`：本次修改涉及的已有文件通过。
- HTTP 集成：三个馆页/目录/说明页初始 HTML、200、HEAD、self-canonical、唯一主标题、schema JSON、静态预览与索引响应头；sitemap 全部地址均为可索引 200；别名 308、未知/未审核/编码变体 404；参数、后台、API、认证及开发环境 noindex。
- 工具深链：三馆示例在对应版本解析为 matched；浏览器实际点击台北指南进入 end 版本并匹配分区/排/座。版本切换、未知版本、受限初始场馆不替换为其他场馆，有自动回归覆盖。
- 浏览器：1280×720 桌面目录、台北指南→2D→点击加载 3D；390×844 手机指南与选座，两页 document 宽度均 390px，无横向页面溢出。3D 样本未见 console warn/error。没有把桌面缩窄检查称为真实手机测试。
- 隐私回归：仅固定路径和受控事件载荷；恶意/重复事件忽略；敏感查询、hash、登录状态与隐私偏好阻止采集。
- 独立代码复核发现来源异常可能影响全站的问题，已用失败回归复现并修复；另修正默认演示误计有效定位。最终完整测试在修正后运行。

截图：[桌面目录](implementation/directory-desktop.png)、[手机指南](implementation/taipei-mobile.png)、[手机工具](implementation/tool-mobile.png)。

## 尚需外部条件的验收

1. 发布本次范围的隔离版本后复核真实 HTTPS 路由、代理响应头、预览图和 sitemap；当前没有把混合工作区直接推向生产。
2. 负责人已有 Search Console 资产中提交/核对 sitemap、收录和主要查询。没有对应连接或后台证据，不报告真实曝光、排名或收录量。
3. 正式 Umami website 配置启用后核验实际收集；本次不写入凭据、不启用未知配置。当前统计按隐私约定不做认证后的用户级转化串联，订阅结果应从经授权的聚合账单数据评估。
4. 对隔离发布版本多次运行移动 Lighthouse，并用真实手机检查触控与弱网；取得足够现场样本后才判断 p75 LCP/INP/CLS。本次无可靠分数或 CWV，未把代码优化等同于性能达标。
5. 根据真实搜索数据、来源权利与逐馆核验，扩展下一批馆页、真实演出页及完整语言版本；第三方座位图/视角图库仍需适当公开使用依据。

实施时参考的官方规范：[Google 站点名称](https://developers.google.com/search/docs/appearance/site-names)、[Organization](https://developers.google.com/search/docs/appearance/structured-data/organization)、[Breadcrumb](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)、[Umami 自定义载荷](https://docs.umami.is/docs/tracker-functions)。结构化数据有效不保证富结果或排名。
