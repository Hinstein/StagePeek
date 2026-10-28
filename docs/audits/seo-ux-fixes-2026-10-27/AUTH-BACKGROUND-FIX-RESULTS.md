# 登录注册与首页背景修复

日期：2026-10-28。

- 首页由单一深色底恢复为固定深蓝渐变，保留原有内容和场馆模型。
- 登录页的“或”置于两条等宽细分隔线中间。
- 恢复登录页“还没有账号？注册”入口。修复 `/auth/register` 未被前端识别、错误显示登录模式的问题。
- 注册页显示邮箱、密码要求和条款勾选；登录、注册之间切换保留安全的场馆返回参数。
- 英文、简体中文、繁体中文、日文、韩文均通过线上跳转检查；390px 登录页没有横向溢出。

## 检查与上线

- `npm run build`、`git diff --check` 通过。
- `npm test`：192项，191通过、1项真实 PostgreSQL 集成测试按配置跳过，0失败。
- 线上只检查表单与页面跳转，未创建真实账号或发送验证邮件。认证请求边界由现有自动化测试覆盖。
- 代码提交：`b9397d55b7b84b0608b4d4a9f34997602f753069`。
- Coolify 部署：`rw0xbmka9re6muxz8s2rzscz`，VPS3，Finished；应用显示 Running。
- `/healthz`、`/api/health` 均为200。
- 回滚代码：`fe7faf04427e6f40f6717c14ff0b9a9cf9ea8199`。

线上截图：`auth-login-live-20261028.png`、`auth-register-live-20261028.png`、`auth-login-mobile-live-20261028.png`、`home-background-live-20261028.png`。
