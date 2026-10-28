# StagePeek Umami 匿名漏斗接入

更新时间：2026-10-28

## 已接入

- Umami：`https://analytics.auturance.com`
- Website ID：`33628912-9625-427f-919a-2ddf33bb0583`
- 绑定域名：`stagepeek.live`
- 生产代码：`5720b7ba491b7bd8d1a372072eba1c5f8e697d34`
- Coolify 部署：`eyoatfzpnaxqbkpsno99ahcc`，VPS3，Finished / Running

探索页允许带票面参数打开，但发送给 Umami 的页面路径会被规范化为本地化 `/explore`，不会发送 query、hash 或 referrer。认证页、账号页、API 和支付页面不加载 pageview 脚本；探索页上的匿名流程事件仍可用于判断漏斗掉点。

## 事件与问题

| 事件 | 触发位置 | 可以回答 |
| --- | --- | --- |
| `tool_open` | 首页、目录、指南进入工具 | 用户从哪里进入工具 |
| `venue_selected` | 选择免费/Pro 场馆 | 付费场馆兴趣 |
| `ticket_search` | 主动提交区、排、座 | 用户是否开始查询 |
| `ticket_match` / `ticket_miss` | 查询完成 | 数据匹配或缺失导致的流失 |
| `view_2d` / `view_3d` | 切换视角 | 用户真正查看哪种视图 |
| `save_prompt` / `save_position` | 游客保存提示、登录用户保存成功 | 收藏意愿与登录阻力 |
| `login_started` / `login_completed` | 登录引导、登录完成 | 登录漏斗完成率 |
| `plan_open` | 套餐弹窗 | 方案兴趣 |
| `checkout_blocked` | 未登录、未同意、账单未开放 | 结账前具体阻断原因 |
| `checkout_started` / `checkout_failed` | 发起结账、接口失败 | 结账技术流失 |
| `billing_return` / `subscription_active` | 支付返回、订阅确认 | 付款回跳和生效状态 |

事件数据只使用固定枚举（免费/Pro、匹配结果、阻断原因、支付提供方）。不发送邮箱、用户 ID、票面区排座、订单号、金额、支付凭证、完整 URL 或错误原文。

## 真实验收

使用匿名 Ego 浏览器访问生产探索页，确认脚本实际加载，完成以下动作：

- 启德 `101 / A / 78`：收到 `ticket_search`、`ticket_match`、`seat_located`。
- 输入无匹配位置：收到 `ticket_search`、`ticket_miss`。
- 切换 2D/3D：收到 `view_2d`、`view_3d`。
- 选择 Pro 场馆：收到 `venue_selected`、`plan_open`、`checkout_blocked`（当前月订阅未开放）。
- Umami Events 面板已看到上述事件；实时面板显示线上访问。

当前 Stripe 月订阅尚未开放，因此只能验收购买意愿和“结账被阻断”的原因，不能把真实付款或订阅成功写成已验证。

## 隐私控制

浏览器启用 Do Not Track 或 Global Privacy Control 时不加载统计；事件白名单和枚举白名单在浏览器端再次过滤。隐私说明已同步更新到公共页面和 `/privacy.html`。
