# MVP requirement audit

> 最新复查：2026-10-24完整测试65/65；本地内测可继续，正式公开/收费上线未通过。见[上线准备审计](launch-readiness-2026-10-24.md)。下文测试数量为此前历史记录；当前支持明确标识的模拟排座预览和1—8×视角放大，无效排座不会夹到其他位置。

日期：2026-10-24（Asia/Shanghai）。这是对原始需求的逐项审计，不把测试桩、参数模型或公开链接误写成生产级数据。

| 原始要求 | 当前证据 | 状态 |
| --- | --- | --- |
| 邮件登录 | 本地单次链接、同浏览器绑定、持久 session、退出、重放保护；Resend 适配器已实现 | 本地已完成；真实邮件待凭据 |
| Google 一键登录 | OAuth state、PKCE、verified email、账号关联逻辑和错误分支已有测试 | 代码已完成；真实 Google 待凭据 |
| 免费 / 付费权限 | guest、free、Pro、过期、到期取消权限；服务端 API 和静态文件隔离 | 本地已完成；Stripe 待凭据 |
| 按月付费 | Stripe 月 Price 校验、Checkout、Portal、Webhook、幂等和重放保护 | 协议逻辑已完成；真实支付待凭据 |
| 场馆目录 2D / 3D / 座位 | 原站去重后的193个目录场馆已批量导入，连同 Tottenham、MetLife、SoFi、Wembley 共197馆；104馆有分区参考，59馆有几何但无逐区参考，30馆为目录级示意，7馆保留少量公开座位资产样本；Three.js 3D；已知采样票号定位 | 本地已完成，覆盖仍非完整逐座 |
| 用户输入 Section / Row / Seat | 服务端精确匹配来源票号；字母排、WC 后缀、前缀、前导零保留。前端另可提供明确标识的模拟网格预览；无效、超限输入不定位 | 已完成 |
| 演唱会列表 | 官方场馆来源刷新、缓存、失败保留、日期和取消解析；当前事件显示来源链接 | 已完成基础链路 |
| 演出布局 | 精确匹配到的 Tottenham Karol G、MetLife Zach Bryan、SoFi JAY-Z 和 R&B Tour 有 Ticketmaster 公开参考；MetLife Bon Jovi 当前座位图不可用 | 部分完成；实时库存和真实舞台仍未知 |
| 准确座位表和距离 | 1,798 条离散来源采样可精确复现；所有场馆仍 `completeSeatInventory=false`、`metricCalibrated=false`，距离标示示意 | 未完成验收 |
| 手机和触控 | 390×844 窄屏、无横向溢出、3D 观众视角和模拟拖动已验证 | 浏览器验证完成；真机性能仍未知 |

## 当前证据

- `npm test`：52 tests / 52 pass / 0 fail。
- `node --check`：server、viewer、app、geometry、build script 均通过。
- 本地服务：`http://127.0.0.1:4180`；同 Wi-Fi 地址由启动日志打印。
- 原站正式 REA 证据：`ev_1f87574d159d170f4c5cad6ff7216e4cec76c521e7987993869b76591d156cd0`。
- 批量导入审计：`docs/shijiao-import-report.json`；原站目录去重后193馆，产品目录197馆，完整逐座库存仍为0馆。

## 保持未完成的项目

完整逐座座位库存、统一米制 XYZ、竣工状态配准、每场真实舞台和封区、真实 Google / Resend / Stripe 连接、商用授权、真机 iOS / Android 性能测量，仍需要新的来源或外部凭据。当前产品会保留这些状态，不把估算几何冒充实测。
