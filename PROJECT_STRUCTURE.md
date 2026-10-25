# SeatPeep 项目结构

SeatPeep 是场馆、演唱会座位和 2D/3D 视角验证项目。这个仓库把可运行产品、研究证据、逆向参考和操作技能放在一起，方便后续用一句“录入某场馆/某场演唱会”继续增量维护。

## 目录

- `public/`：SeatPeep 前端、2D 座位图、Three.js/WebGL 视角和深色演唱会风格样式。
- `server/`：场馆、事件、票务适配、身份、订阅和来源精度边界。
- `data/`：场馆目录、来源座位、人工导入包、演出事件和 The Weeknd 研究包。
- `scripts/`：场馆导入、艺人巡演导入、票务同步、场景审计和本地启动脚本。
- `tests/`：几何净空、来源座位、事件、HTTP、认证、票务和导入校验。
- `docs/`：上线审计、数据准确性、3D 修复、来源研究和 The Weeknd 导入报告。
- `references/rea/`：对参考网站的 REA 运行时证据、资源盘点、接口线索和逆向分析文件。
- `references/western-market/`：欧美场馆来源、版权边界、公开图和事件布局研究。
- `prototypes/venue-view/`：早期 2D/3D 场馆原型、交互记录和视觉验收截图。
- `skills/seat-scope-venue-ops/`：场馆/演唱会录入、来源核验、几何审计和发布门槛。
- `skills/reverse-engineer-anything/`：REA 逆向分析工作流和浏览器运行时证据要求。

## 常用命令

```sh
npm install
npm test
npm run start:local
npm run artist:import:weeknd
npm run artist:validate
node scripts/audit-scenes.mjs docs/audits/scenes-weeknd-venues-2026-10-25.json
```

本地服务默认访问 `http://127.0.0.1:4180`；局域网地址由 `start:local` 启动时打印。`.env`、SQLite 数据库、临时目录和依赖不会进入 Git。

## 数据边界

公开座位图只作为来源引用和人工描摹输入；它们不自动等于逐座 3D 坐标、实时库存或可商业再分发资产。每个场馆和事件都保留来源状态：`source`、`operator-traced`、`estimated` 或 `unverified`。只有经过来源匹配、几何审计和人工复核的事件布局才允许进入发布状态。
