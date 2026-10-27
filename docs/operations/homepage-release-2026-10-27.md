# A + E 正式首页

用户要求把已选 A + E 原型替换为线上主页。沿用既有 StagePeek 应用、VPS3、共享 PostgreSQL/Auth、Brevo 品牌邮件与 Umami 配置。

## 页面与兼容

- `/` 使用生产页面 `public/home.html`，保留 A 的布局、鸟巢只读 3D 模型和 E 的手机取景倍率演示。移除方案切换、未选方案和设计预览标记；样式及两张原创 SVG 放到正式资源路径。
- “免费体验”“开始探索场馆”进入 `/explore`，登录进入 `/auth/login`，已登录时显示“我的账号”。手机也提供登录入口。
- `/?venue=…`、票号、演出、工具面板、登录和账单回跳继续展示原座位工具。营销参数如 `utm_source` 保持展示主页。原 `/index.html` 重定向继续保留参数。
- 正式主页保留 canonical、分享信息、WebSite/Organization schema、公共指南及说明导航；工具与原型继续 noindex，sitemap 不加入工具路径。

## 发布前检查

- 当前生产完整 SHA：`3f7816e8285eb8a4dd7fd39a0376eed4454bcf34`，Coolify 应用 `capinwnna0ijx4rafkwju3ms`，running:healthy，队列无待部署。
- 使用独立发布副本，基于远端 main；它比生产仅多账户发布文档，不含其他未完成的场馆研究修改。
- `npm ci --offline --ignore-scripts`、`npm run build` 通过。
- 完整测试：165 通过、0 失败、1 个 PostgreSQL 集成入口按默认配置跳过；本次无数据库变更。
- 浏览器：1280px 桌面和 390px 手机无横向溢出；鸟巢分区键盘交互、5× 取景与免费体验进入座位工具已验证，无 warn/error。
- 不发送邮件、不创建账号、不发起付款。已有密码、Google、OTP、收藏、权限和数据库代码不变。

## 发布与回滚

通过 VPS2 既有管理连接操作原 Coolify 应用，以完整 SHA 发布；先将应用、环境和卷配置备份到服务器私有目录。回滚恢复上述生产 SHA，保留当前共享账号、业务数据和卷，不恢复旧数据库快照。

正式 HTTPS 首页、静态资源、工具深链、认证回调、健康和权限须在发布后再次验证，部署结果另行补录。
