# 原站交互对照 · 2026-10-24

参考： https://shijiao.xingpaste.com/?venue=kspo-dome&section=23&depth=40&lateral=50&standing=1&date=four-sided&layout=center&lang=zh

## 证据范围

原站实际页面观察：三维总览、入座视角、手机取景弹窗。静态参数来自工作区保留的 `shijiao-evidence/scripts/files/origins/08a3d92a8dd745d136ae160b17d72397ead1e154bac0df91bfaf44e738c7c679/releases/photo-protection-20261023/assets/` 中的 `Stadium-hdz890bx.js`、`OrbitControls-DcB4Swpe.js` 与 `AppRoute-FKjE7l3d.js`。静态阅读不能等同于完整运行轨迹；尚未证明所有设备上的手感一致。

| 原站观察 | v2 实现 |
|---|---|
| Three.js r185、OrbitControls、阻尼0.07 | 使用MIT版同版本引擎及控制器，阻尼0.07 |
| 总览FOV43°、极角限制π/2.04 | 同类透视相机与极角限制 |
| 750ms、1-(1-t)^3相机过渡 | 相同时间及缓动公式，独立实现 |
| 入座拖动yaw/pitch；手机灵敏度除以倍率 | 独立位置/朝向状态、缩放相关拖动灵敏度 |
| 手机独立画面、1/2/5/8/10×、横竖拍 | 大幅弹窗与独立相机，倍率及比例切换 |
| 变焦保留位置/方向 | 用FOV变焦，不移动手机机位、不重置朝向 |
| 人物/舞台目标、24mm等效、PNG | 目标重置、可调12–50mm、带估算水印PNG |

v1 的自制 Canvas 透视已从主入口替换。v2 的场馆几何、195个分区样本与统一模拟排座仍然是估算；交互机制的改进不意味着获得了真实逐座坐标。
