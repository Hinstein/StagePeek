# StagePeek 3D 模型与几何资产

当前项目没有外部受版权约束的 `.glb/.fbx/.obj` 模型。3D 场景由 `public/geometry.mjs`、`public/scene-geometry.mjs`、`public/viewer.mjs` 和 `data/venues.json` / `data/manual-venues/` 的自有参数化几何生成；来源座位资产保存在 `data/source-seats/`。

`prototypes/venue-view/` 保存早期视觉原型和 Three.js 依赖，作为交互参考。新增外部模型前必须记录来源、许可、坐标系、比例、版本和审计结果，不能把票务平台或参考网站的 3D 资产直接复制进产品。

## 场馆建筑壳

`models/venues/<venue-id>/` 中的 `shell.glb` 由同目录的 Blender 脚本构建，`manifest.json` 记录几何依据及来源精度。杭州奥体中心体育场重建所需的几何输入保存在同目录的 `input.json`。

```bash
blender --background --python models/venues/hangzhou-olympic-stadium/build.py
npm ci
npm run build
```

发布构建从 GLB 原件生成并验证 Meshopt 与 gzip 变体，运行镜像保留 `var/venue-shell-delivery/`。下载沿用场馆访问权限。演出卡片只有座位图参考时，选择场次会显示空场。
