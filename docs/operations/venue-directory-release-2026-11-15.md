# 场馆目录紧凑版生产发布

2026-11-15，production：[场馆资料](https://stagepeek.live/zh-CN/venues/)。

## 发布与回滚

- 固定代码：`5b58a6aa6397bb091414e2b4eeab49eaa90784c7`，部署 `j6x2fzwj20f7zbn1ipkpgqoe` Finished，耗时 2 分 44 秒，应用 Running。
- 复用原 StagePeek Coolify 应用、VPS3 `49.51.204.51:4180` 与 VPS1 Caddy；共享 Supabase Auth、PostgreSQL、邮件与统计接线保留。
- 回滚代码：`fdb982b87144a27befad8c67f88d40a78137f0e3`。在同一应用固定旧 SHA 重新发布，不覆盖新业务数据。
- 发布前备份：VPS1 `/root/supabase-backups/stagepeek-directory-20261115/site_stagepeek.before.dump`，归档清单已验证；数据库迁移版本 1–4。本次不迁移数据库、不更改环境、账号或免费名单。
- 主分支后续合入的本地研究草稿不随本次上线；生产继续固定上述 SHA。

## 变化

目录改为桌面双列紧凑条目、手机单列，统一国家／地区和城市展示，减少重复层级。分区数明确标记为“默认布局”，并用默认折叠说明解释“场馆 → 布局 → 分区 → 排 → 座”，保留各馆真实票面名称。搜索和地区筛选同步更新组内计数；所有条目保留服务端 HTML 与本地化链接。

## 验收

- 发布代码测试 344 项：343 通过、0 失败、1 跳过；构建通过。跳过项为未配置独立数据库的真实 PostgreSQL 集成测试。
- [28 项正式 HTTPS 检查](../audits/venue-directory-release-2026-11-15/http-checks.json)全部通过：五语目录各 39 条、规范链接、首页／健康／explore／套餐／callback／reset；匿名管理接口 401，研究入口和开发邮箱 404，5 个公共资源 SHA-256 匹配发布文件。
- 当前数据库已保存免费 39 馆、Pro 0 馆；匿名目录与已登录后台读取一致。该名单更新时间早于本次部署，未通过验收脚本改写。此前记录的 7 个免费馆为历史状态。
- 真实管理员 `/api/admin/users`、`/api/admin/access` 均 200，只读验证，不输出用户资料。
- Ego 直连正式域名：39 条／7 个国家地区组；Paris 搜索 1 条，欧洲筛选 5 条／4 组，无结果为 0 条；说明可展开收起，条目入口保留场馆参数。
- 1060px 桌面目录高度约 3028px（原约 5732px）；390px 手机单列，文档宽度 390px，无横向溢出。[桌面截图](../audits/venue-directory-release-2026-11-15/desktop.png)／[手机截图](../audits/venue-directory-release-2026-11-15/mobile.png)。
- 未发送真实邮件、执行付款或进行完整灾备恢复；统计接线不等于本次事件已在统计后台收录。
