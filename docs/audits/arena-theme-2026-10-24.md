# 深色演唱会主题验收

按已确认的深色演唱会样稿，将主页面、表单、国家分组菜单、座位信息、场次卡片、来源说明、账号/订阅弹窗统一为深色界面。

3D 仅调整颜色、材质和灯光；背景与看台使用深色，座椅使用紫色，选中分区使用荧光绿，来源采样保持金色。2D 地图、图例、按钮选中状态使用相同颜色语义。原始几何、座位身份与 XYZ、相机移动/变焦逻辑保持不变。

验证：

- 语法检查：`node --check public/app.mjs`、`node --check public/viewer.mjs` 通过。
- 全量既有测试：101/101 通过（日志 `/private/tmp/seatpeep-arena-final.log`）。
- 桌面 Chrome：检查 Tottenham、亚洲国际博览馆 VIVA、KSPO；来源坐标不可用时手机取景保持禁用。
- 390×844 响应式布局：VIVA 的 2D、3D、5×手机取景、账号弹窗；无页面横向溢出，移动操作栏为 100px。
- 切馆后保留 19 个国家/地区分组，重置取景状态。
- 截图：`explorer-parity/arena-desktop.png`、`explorer-parity/arena-mobile.png`。

本轮是视觉改造，未改变各馆的来源覆盖和校准声明。手机检查为桌面 Chrome 的视口模拟，不代表 iOS/Android 真机性能已验收。
