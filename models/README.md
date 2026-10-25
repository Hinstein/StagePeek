# StagePeek 3D 模型与几何资产

当前项目没有外部受版权约束的 `.glb/.fbx/.obj` 模型。3D 场景由 `public/geometry.mjs`、`public/scene-geometry.mjs`、`public/viewer.mjs` 和 `data/venues.json` / `data/manual-venues/` 的自有参数化几何生成；来源座位资产保存在 `data/source-seats/`。

`prototypes/venue-view/` 保存早期视觉原型和 Three.js 依赖，作为交互参考。新增外部模型前必须记录来源、许可、坐标系、比例、版本和审计结果，不能把票务平台或参考网站的 3D 资产直接复制进产品。
