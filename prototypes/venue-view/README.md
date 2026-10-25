# SeatPeep — THROWAWAY PROTOTYPE

验证问题：只关注场馆、分区、排座、舞台距离与手机取景，是否已能形成有用的最小产品？

v2 使用本地 ES modules，需要通过 HTTP 打开。在工作区根目录执行：

```bash
python3 -m http.server 4173 --bind 127.0.0.1 --directory venue-view-prototype
```

打开 http://127.0.0.1:4173/?variant=A 。Three.js 依赖已放在 `vendor/`，无需安装包，无登录、无持久化、无外部运行时请求。A/B/C 是布局试验，可通过底部切换。旧版保存为 `index-v1.html`。

## 当前真正取得的数据

| 场馆 | 分区标签样本 | 来源 | 处理方式 |
|---|---:|---|---|
| MetLife Stadium | 82 | 官方当前链接的 2026 完整分区 JPG | 人工核对 100 层和 300 层标签中心，200 层和后缀小区未录入 |
| SoFi Stadium | 38 | Rams 官方导航页当前链接的 Level 2 地图 | 人工核对下层分区标签与相对方向；图片本身日期为 2021-11-16 |
| Tottenham Hotspur Stadium | 75 | 官方 2026/27 Category B 票价图 PDF | 提取图中数字标签及其文本中心，排除右侧价格表 |

`venue-data.json` 保留来源 URL、来源图标签锚点、估算参数与状态。`build-data.py` 可重新生成该 JSON；HTML 内嵌同一份 JSON 以便单文件分享，重新生成 JSON 后需同步内嵌内容。

这不是 195 个精确分区多边形或 195 组逐座坐标。标签和图中相对方向有官方资料依据，SVG 轮廓、米制尺度、层高、倾角是原创估算。

## 已可操作的效果

- 三馆切换、2D SVG 分区图和 Three.js r185 WebGL 三维场景。
- OrbitControls 阻尼 0.07；拖动旋转、平移、滚轮缩放；750ms 缓动切换机位。点击分区靠近、点击模拟椅子入座，入座后拖动环顾与滚轮调视角。2D 支持键盘 Enter/空格选区。
- 椅面、椅背采用实例绘制；台阶只在已建模编号分区下生成。分区间缺失范围使用灰色斜纹占位，点击显示“尚未建模”，不代表真实场馆无座位。2D与3D使用同一份缺失范围。场景另含舞台和独立制作的1.75m立体示意人物。
- 手机独立取景弹窗，支持拖动构图、1/2/5/8/10×、3:4 竖拍和 4:3 横拍、人物/舞台目标、基准等效焦距调整和 PNG 导出；变焦保留朝向。
- Row 1–30、Seat 1–24 是统一的模拟网格，用于验证排深和横向变化；不保证真实场馆有对应排座，也未核对每排座号方向。
- 三种通用布局：端头、端头加延伸台、中央。不是对应艺人的巡演实景布置。
- 直线距离来自模拟眼点到表演者身体中心的三维欧氏距离；舞台边缘距离为地面二维最近距离。显示取整到 5 米。
- 手机预览使用 24mm 等效基准、全画幅对角线 43.266mm 的 4:3 等效传感器，焦距随 1–10× 变化。人物身高 1.75m，显示投影占画高。不会创造可拍清细节，不模拟设备换镜、数码变焦画质、舞台屏幕或灯光。
- 无遮挡／屋顶／栏杆验证，未通过测量校准，不是购票精度承诺。

## 来源和文件

- MetLife 页面：https://www.metlifestadium.com/events-tickets/seating-charts
- MetLife 图：https://www.metlifestadium.com/assets/img/MetLife-Stadium-Seating-Map-3-2-26-a168abb39c.jpg
- SoFi 官方 Rams 页面：https://www.therams.com/game-day/navigating
- SoFi Level 2 图：https://static.clubs.nfl.com/image/upload/v1637183916/rams/rg8upbjttpnkjdsgkzcg.jpg
- Tottenham PDF：https://resources.thfc.pulselive.com/thfc/document/2026/08/13/dcd3483a-2f97-41cb-8ea6-198c65a8c634/THFC-2627-Official-Category-B-Pricing-Map-94-.pdf
- 艺人及巡演选馆依据：`../western-market-research/artist-tour-venues.md`

官方原始资料仅作为本地核验参照。原型没有嵌入原始地图图片，没有取得任何商业再分发、衍生使用或 3D 模型授权；公开可访问不等于获准商用。正式产品仍需逐项核实资料权利和供应商许可。

## 原始抓取排除项

`research/raw/sofi-seat-map.jpg` 仅为“Pinch and Stretch to Zoom”提示，不能算座位图。
`research/raw/tottenham-seating-2025-26.pdf` 实际是跳转后的 HTML，不能算有效 PDF。
`research/raw/tottenham-map-2026.pdf` 是入口图，入口 1–23 不能当作分区。
`research/raw/metlife-ocr.json` 是失败 OCR 的空文件，不用于生成数据。

原型根据原站的交互行为与公开加载脚本所呈现的控制参数独立实现，未复制其场馆模型或专有应用代码。三维依赖是 MIT 授权的 Three.js 0.185.0 与官方 OrbitControls，取自 `https://cdn.jsdelivr.net/npm/three@0.185.0/`；许可证见 `vendor/THREE-LICENSE.txt`。具体对照见 `interaction-reference.md`，浏览器核验见 `verification.md`。当前目录不在 Git 仓库内，尚未作分支归档；保留此目录作为实验记录，尚未选定正式产品布局。

## 模型覆盖修正 · 2026-10-24

用户指出 Tottenham122周边大量无椅台阶无法选择。官方票价图可提取的75个数字分区已录入，但这些编号与锚点不足以还原全部包厢、客队区、通道、分区宽度与真实楼层结构。旧版把每层台阶生成完整360°，而椅子只覆盖部分角度，视觉上夸大了模型覆盖。

现改为按已建模分区生成台阶，未覆盖范围用明确标注的灰色斜纹占位；2D/3D均可点击查看缺失说明。占位不是新增分区、真实建筑面或座位数据，也不改变75个已录入编号。后续准确模型仍需真实分区边界和排座资料。
