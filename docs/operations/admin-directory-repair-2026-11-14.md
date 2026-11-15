# 线上管理后台用户列表故障 · 2026-11-14

- 现象：已登录管理员打开 `/admin`，用户列表返回 `Unexpected server error`。
- 实际接口：`GET /api/admin/users?page=1&pageSize=25&q=` 返回 HTTP 500，数据库错误码 `42883`。
- 根因：线上 `site_stagepeek.schema_migrations` 只有 1–3；缺少现有 `db/migrations/004-admin-users.sql` 创建的 `site_stagepeek.admin_user_directory()`。用真实应用数据库角色调用同一函数，复现 `function admin_user_directory() does not exist`。
- 账号管理员角色有效；本次无需更改身份、密码或成员权限。

## 已准备和验证

- 业务 schema 备份：VPS1 `/root/supabase-backups/stagepeek-admin-directory-20261114/site_stagepeek.before.dump`。归档目录已通过 `pg_restore --list` 验证。
- 将现有 004 迁移放入事务，在生产数据库演练并最终 `ROLLBACK`。管理员目录查询成功；匿名调用被拒绝；应用角色仍无用户表直接读取权限；浏览器角色仍无该函数执行权限。
- 用户明确回复“授权执行，修复后台”后，使用现有 `004-admin-users.sql` 完成生产事务并 `COMMIT`。迁移版本现为 1–4；未发布新的应用版本。

## 修复后验收

- 原线上管理员会话刷新后，用户目录接口从 HTTP 500 恢复为 HTTP 200，错误提示清空，用户列表和分页正常显示。
- 免费场馆页正常加载：39 个场馆、7 个免费、32 个需要 Pro。只验证读取，没有保存或修改配置。
- 以实际应用角色验证管理员可查询；匿名调用仍被拒绝，应用无用户表直接读取权限，`anon`/`authenticated` 无函数执行权限。只读核验事务最终回滚。
- `node --test tests/admin-users.test.mjs`：5 项通过。
- 后续发布前必须核对所有业务迁移，并使用已授权管理员验证用户目录 API；仅检查首页和健康接口不能覆盖本故障。

本次无需发布应用代码；场馆目录的未发布界面改版未包含在修复中。
