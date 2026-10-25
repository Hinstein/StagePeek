# 演出级舞台布局接入

## 发现

此前选择演出只更新右侧说明，`2D`、`3D`、座位避让和距离计算仍然使用通用 `end/runway/center` 舞台。这会让用户看到“演出已找到”，但舞台仍然停在通用位置。

## 修复

- `server/events.mjs` 为 Tottenham × Karol G、SoFi × JAŸ-Z 30、SoFi × The R&B Tour、MetLife × Zach Bryan 保存公开 Ticketmaster 座位图引用和人工描摹的归一化舞台矩形。
- `public/app.mjs` 选择演出后把该模型挂到当前场馆，切换到“本场演出”布局，并在 2D/3D 中立即重建。
- `public/geometry.mjs` 在同一个场馆坐标系中解析演出矩形；`stageBoxes`、座位避让、表演者位置和观众距离继续复用同一结果。
- 没有舞台证据的场次仍显示“通用示意”或“座位图待发布”，不会把通用舞台伪装成本场准确布局。

## 证据边界

这些舞台矩形来自公开票务座位图的人工描摹，状态为 `operator-traced`。它们能表达舞台所在端、主舞台和延伸台的大致关系，但不等于演出制作方的 CAD 图纸，也不保证临时调整、封区和现场安全边界。上线前应继续补充每场的封区/内场 polygon 和官方图纸或现场复核。

## 验证

- `node --test tests/app-selection.test.mjs tests/events.test.mjs tests/geometry.test.mjs`：40/40 通过。
- 浏览器回归：SoFi 页面选择 `JAŸ-Z 30` 后，事件卡片变为“有公开座位图 + 舞台布局”，舞台布局选择器变为“JAŸ-Z 30 · 公开座位图舞台”，右侧显示“本场布局已接入”。
