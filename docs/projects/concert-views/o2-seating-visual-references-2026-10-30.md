# O2 座椅与看台视觉参考板

2026-10-30。用途：改善 O2 本地研究 v0 的座椅比例、排面、转角与分区交界。采集者为 Codex，使用 Ego 浏览器实际查看；首次采集只补充参考资料；随后结合 FlytiX 检查落实了一轮 O2 局部修复，见第 7 节及渲染方法文档。

## 结论：此前的“图片够了”不够严谨

现有坐标和几何规则可以处理自交、穿模、切线不连续等数学问题，但不能据此断言座椅观感已经达到参考站。此前缺少**安装近景、通道组件、具体分区交界的对照**；同时，已收集的参考也没有落实为稳定的观察角度和视觉验收。资料组织与建模执行都有不足。

后侧增加 900 把示意椅子，解决的是一部分排尾和轮廓不齐；不能凭新增座位数宣称整体渲染达标。连续排面也不能抹掉横向走道、分区边缘和入口平台。

本次保留了 **11 张已实际打开并目检的截图**，来自官方查看器、安装供应商、厂商组件指南和用户指定参考站四类资料。截图数量不等于独立来源数量。

## 1. O2 官方链接的分区模型：核对交界和转角

来源链：[The O2 官方演出页的 View seat map](https://www.theo2.co.uk/events/detail/cody-johnson) → [3D Digital Venue 查看器](https://sites.3ddigitalvenue.com/3dmap/clients/the-o2-arena-uk/)。2026-10-30 实际通过 UI 选择 **110 / T / 319**，进入分区模型和观众全景。

这是官方链接的数字模型，**不是现场实拍或已取得的建筑施工图**。它使用的通用演出配置不能直接作为我们的事件舞台；字母排 T 也不能未经映射就等同来源数据的某个数字排。

![O2 官方 110 区模型：中间楼梯、两侧座排、前排平台与相邻转角](/Users/lilinhai/Projects/seatpeep/docs/audits/render-batch-1/ref-o2-official-110-selection.png)

图中可直接观察：分区两侧的座排长度不同；中央楼梯贯穿；部分前排配置和邻区之间有平台/收边。需要学习的是这些部件的连接关系，不能把所有座位空白解释成缺数，也不能一律填成完整圆环。

保留的三个角度：

- [官方俯视全图](/Users/lilinhai/Projects/seatpeep/docs/audits/render-batch-1/ref-o2-official-map.png)：层间关系、全场分块、楼梯布局。
- [110 区分区图](/Users/lilinhai/Projects/seatpeep/docs/audits/render-batch-1/ref-o2-official-110-selection.png)：转角、末端、平台连接。
- [110 / T / 319 观众模型视角](/Users/lilinhai/Projects/seatpeep/docs/audits/render-batch-1/ref-o2-official-110-audience.png)：座椅与排深、前方踏面及场内空间的比例。

## 2. O2 安装现场照片：核对椅子怎样落在排面上

来源：[Audience Systems — The O2 Arena North End](https://www.audiencesystems.com/case-studies/the-o2-arena-north-end/)。这是安装方的伦敦 O2 案例，涉及可移动伸缩座席与北端改造；不能推广成全场固定座席的统一规格。

![O2 厂商安装照片：单椅、座面、椅背、固定件与排间通行空间](/Users/lilinhai/Projects/seatpeep/docs/audits/render-batch-1/ref-o2-supplier-chairs.png)

观察重点：座面是独立薄片，椅子支撑落在水平踏面上，前后排之间有可识别的通行空间。照片包含放下与翻起的座面，不能把两种状态误判成同一几何的尺寸差。用户已认可现有简化椅型，这张实拍用于校正比例和接地关系，不要求改成照片中的高背、杯架和复杂结构。

![O2 北端安装照片：横向通道、栏杆、阶梯和排端收边](/Users/lilinhai/Projects/seatpeep/docs/audits/render-batch-1/ref-o2-supplier-north-end.png)

第二张补足横向走道、栏杆和不同单元之间的连接。其来源位置是 North End，不宣称对应 103–110 的当前逐排结构。

直接原图：[座椅近景](https://www.audiencesystems.com/img/2025/06/the-o2-espace-628-cupholder-seats-5721de2184402.jpg?q=100)、[北端看台](https://www.audiencesystems.com/img/2025/06/the-o2-north-end-seating-5721ddd6d378b.jpg?q=100)。两张均在浏览器完成加载后截图、目检。

## 3. 厂商组件图：通道和排带需要一起组织

来源：[Espace 628 High Back BIM User Guide](https://www.audiencesystems.com/app/uploads/2025/06/BIM_User_Guide__Espace_628_High_Back.pdf)，第 2 页。浏览器实际查看了中央通道、两端通道、双中央通道三种组件图。

![厂商通道模块示意：椅子、排面和楼梯共同构成模块](/Users/lilinhai/Projects/seatpeep/docs/audits/render-batch-1/ref-seating-bim-aisle-modules.png)

这份通用组件说明把排深、排高、座宽与通道宽分开控制，适合作为建模结构参考；它不是 O2 的逐排施工模型。后续应先组织排面和楼梯的接合，再放置椅子与排端边界。

可继续查阅的规格原件：[High Back 尺寸表](https://www.audiencesystems.com/app/uploads/2025/06/Espace_628_High_Back_Datasheet_Metric.pdf)、[High Back 产品页](https://www.audiencesystems.com/products/espace-628-high-back/)。本轮核验了来源和链接，未目检尺寸表全部图注；不将产品的可选规格当作 O2 实测值。

## 4. 用户指定参考站：保留简化风格，建立可复看的近景

来源：[视野](https://shijiao.xingpaste.com/)。实际选择启德主场馆、自由预览、228 区 G 排 156 座，再横向环顾，复现用户强调的座椅与整排关系。该次为自由预览，未选择 BTS 事件；比较的是座椅和排面风格。

![参考站启德 228 区横向近景：薄座面、圆角椅背、均匀重复与干净排面](/Users/lilinhai/Projects/seatpeep/docs/audits/render-batch-1/ref-shijiao-kaitak-228-chairs.png)

可观察的风格目标：薄座面、克制倒角、稳定间距、整排一致的姿态、座椅与踏面之间清楚的关系。场馆结构应参考 O2；启德在这里提供简化表达的目标，不能把启德的排数、分区宽度或通道位置搬到 O2。

同站还实际查看了 O2 本身：其分区有较强的规则化处理。这说明可以采用示意几何，但不能由参考站画面推出真实逐座精度。

- [启德 228 区观众全景](/Users/lilinhai/Projects/seatpeep/docs/audits/render-batch-1/ref-shijiao-kaitak-228-audience.png)
- [启德 228 区横向近景](/Users/lilinhai/Projects/seatpeep/docs/audits/render-batch-1/ref-shijiao-kaitak-228-chairs.png)
- [参考站 O2 总览](/Users/lilinhai/Projects/seatpeep/docs/audits/render-batch-1/ref-shijiao-o2-overview.png)
- [参考站 O2 101 区近景](/Users/lilinhai/Projects/seatpeep/docs/audits/render-batch-1/ref-shijiao-o2-near101.png)
- [参考站 O2 105 区观众视角](/Users/lilinhai/Projects/seatpeep/docs/audits/render-batch-1/ref-shijiao-o2-105.png)

## 5. 资料如何落到后续修改

| 当前待改的观感 | 本次参考能回答什么 | 下一次实现与观察重点 |
| --- | --- | --- |
| 转角、排端显得生硬 | 官方 110 区给出直段、转角和平台的连接关系 | 选 110/109 一处接口作样板；共同控制排线、通道、边墙，不继续只靠补座位改善轮廓 |
| 椅子像一串悬挂块 | 实拍可见水平踏面、固定件与独立通行空间 | 同视高侧视，检查椅腿接地、座面厚度、前后排净空；保留已认可的椅型 |
| 排座很多但空间读不清 | 组件图把楼梯与排面一起建模，参考站减少无关细节 | 让踏面、立面、通道与座椅有稳定层次；控制边线和选中高亮对密集座椅的干扰 |
| 2D 补齐却不够自然 | 官方俯视图有清晰的分区、通道和平台边界 | 从同一套结构生成 2D 边界和 3D；只补允许示意的区域，保留明确通道 |

停止条件继续是四遍法与实际画面：总览看轮廓与分区；分区近景看转角与通道；横向看排面和单椅；观众视角看空间与舞台方位。没有固定图数能证明“资料足够”。有一个无法解释的连接，就给那个连接补对应视角；能解释后就回到实现。

## 6. 额外图库与当前限制

- [Quinette / 原 K+ 的 O2 安装图库](https://quinette.com/en/product/o2-arena/)：核验为伦敦 O2 可移动伸缩平台，页面列出 10 个图像链接。未逐张目检，不计入上面的 11 张；与 Audience Systems 有集团/案例关联，不能当独立交叉证明。
- [Populous 的 O2 项目图库](https://populous.com/showcases/the-o2-london)：核验为设计方项目页，适合整体碗形和层间结构；未逐张目检。
- [Audience Systems 综合手册](https://www.audiencesystems.com/app/uploads/2025/06/Audience_Systems_General_Brochure.pdf)：文本包含转角单元、入口、轮椅平台及踏步关系。该大 PDF 的浏览器加载未完成，不把未看见的图示算作已验证。
- 仍没有独立验证的 O2 103–110 完整逐排施工图。大致参考允许示意，但本次照片和模型不能让我们的补全座位变成真实库存。
- 排除了布拉格 `o2arena.cz`、同园区 indigo 场馆、园区导览图，以及只剩搜索缩略图却无法打开原件的图片。

本文件和页面截图只用于本地研究与对照，未进入产品公开静态资源。来源记录、原有标注、权利状态和发布门槛均未改变。


## 7. FlytiX 技术核查与本轮落实

用户指定 [FlytiX 亚博 Arena](https://venue.flytix.live/viewer.html?venue=awe)。2026-10-30 在 Ego 实际打开，并检查页面发送的公开客户端代码：

- [查看器代码](https://venue.flytix.live/assets/viewer-DTZmpK2K.js)：canvas 运行时标记为 **three.js r180**，使用 WebGLRenderer、PerspectiveCamera、OrbitControls。抗锯齿开启，像素比封顶 2。
- [亚博场馆模块](https://venue.flytix.live/assets/awe-BVwtCF4o.js)：`seatGeometry` 合并座面和靠背两个盒体，分别为 0.46×0.10×0.44、0.46×0.38×0.09 个模型单位。`createSeatMesh` 用 InstancedMesh 复用一个模型，逐实例写位置和朝向，未做逐椅尺寸缩放。
- 座椅材质为 MeshLambertMaterial；可见画面不依赖高精度外部椅子模型。场馆模块带预生成的排面、楼梯、入口及平台多边形，并单独生成栏杆。其入口配置记录了 CAD footprint 与未测量内部路径/高度的区分。因此不能把它概括成“只有几个椭圆参数”，也不能由视觉完整推出每座准确。
- 这次仅核查用户截图对应的亚博实现；其他场馆模块可能采用不同数据组织，不将结论推广成全站统一规则。

![FlytiX 亚博实际总览](/Users/lilinhai/Projects/seatpeep/docs/audits/render-batch-1/ref-flytix-awe-overview.png)

我们当前也使用 Three.js（r185）与 InstancedMesh。差距主要是共同边界、结构组件与座椅细节的一致性：旧 O2 后侧的每排宽度独立调整，通道会偏摆；远景盒体厚 0.085，近景圆角模型却被压到 0.055；层间直接生成整面墙。已在 O2 显示模型中修正这些问题，详见 [本轮方法与验证](../operations/o2-render-method-2026-10-30.md)。没有复制 FlytiX 场馆资产或把其亚博坐标接入 O2。

本轮查到的技术证明现有引擎足以实现规则的座排与连贯结构，不证明我们的全场模型已达到相同完成度。后续应继续用同角度画面检验具体交界，不用引擎名称或测试数量代替视觉判断。

## 8. 3D Digital Venue 的公开座位表：可作编号参考，不能替代本地座位资产

2026-10-31 进一步检查了官方 O2 查看器公开加载的 [端台座位查询目录](https://sites.3ddigitalvenue.com/3dmap/clients/the-o2-arena-uk/src/js/dataconfig/search/endstage-advanced_search.json)。目录是 `分区 → 字母排 → 座号` 的查询索引；端台配置的排序为 `A–H、J–N、P–Z`，跳过 I、O。它与页面上的分区、排、座查询实际联动，不是只存在于截图中的标签。

把该目录与本地保留的 14,389 条 O2 来源记录逐项比对：14,211 条可以对应，178 条只在本地来源记录中，508 条只在公开目录中；按分区独立排序并有共享座号的排组为 689 / 695。以可对应的记录为边界，`110 / T / 319` 映射到本地原始 `110 / 18 / 319`，坐标、票号和来源索引仍取本地记录。

排号对齐按**每个分区单独进行**：比较该排的座号集合、官方排序和本地数字排顺序，允许官方目录存在本地没有的排，也允许本地存在官方没有的记录。不能把一个全馆字母序列按数字排下标硬套到所有分区；例如 106/107 的本地第 8 排可对应官方 H 排，而 101 的本地第 3 排没有足够证据对应一个官方字母排。只有座号集合有交集的原始座位获得别名，无法确认的记录继续使用数字排。

项目现在把这份目录作为 O2 本地研究 v0 的**显示别名和查询参考**：输入 `110 / T / 319` 会转换为内部数字排并定位来源坐标；2D 放大图和 3D 位置栏显示字母排号。原始 `section / numeric row / seat / XYZ` 不被改写，公开目录缺少的本地记录不被删除，目录独有的座位不被补成真实库存。示意补全座位继续没有 `row / seat / ticket`，只能做分区预览。

该目录的来源、查看器地址、配置、状态和规范化快照哈希保存在 [`data/render-batch/o2-numbering-reference.json`](/Users/lilinhai/Projects/seatpeep/data/render-batch/o2-numbering-reference.json)。它只服务于本地研究和大致方位参考；权利未决策前不进入公开目录，也不改变现有发布门槛。

本地界面的具体行为：总览只显示区号；2D 放大到 200% 后显示选中区的字母排，500% 后显示已对应来源座位的座号。3D 目前在选中位置栏显示区、字母排和座号，尚未在每把三维椅子上绘制数字。字母查询与原数字排链接均可使用。浏览器近景检查发现全局字距被放大到座号里、区号和选中圆点遮住小号座位文字，已清除数字字距并限制区号和标记的近景尺寸。

![O2 本地编号近景：选中区的字母排与来源座号](/Users/lilinhai/Projects/seatpeep/docs/audits/render-batch-1/o2-official-numbering-detail.png)

## 9. 官方地图结构：编号表、分区轮廓与三维资源分开

2026-10-31 的 REA 运行记录为 `ev_a6a5e266a86d96f8f357fec58e254bae00948528250a5b55d4671f75c244cb72`。场景执行完成，但网络事件采集达到资源预算，记录的完整性状态为 `incomplete`；不能据此声称已取得全部官方资源或完整三维模型。

已取得并检查的 [端台地图配置](https://resources-contentdistribution.3ddvapis.com/v2-resources-eu-west-1/eu-gb-00040/default/endstage/default/map-viewer/sets/default/maps/blockmap/master_full.json?v=2.9.1) 将静态 JPG 瓦片层与动态 SVG 分区层分开。[mainlayer.svg](https://resources-contentdistribution.3ddvapis.com/v2-resources-eu-west-1/eu-gb-00040/default/endstage/default/map-viewer/sets/default/maps/blockmap/mainlayer.svg?v=2.9.1) 的坐标范围为 `0 0 8192 4096`，包含 40 个编号看台路径；101–118 每个分区都包含两个闭合子轮廓。解析时必须保留子轮廓之间的空隙，不能将整个分区取凸包后填满。仅凭这些分区路径，还不能确定每条空隙的实体构造或每把椅子的 XYZ。

本次保留响应内容的 SHA-256 为 `ec2d12f5bdfb621c53fa369e4f83dd6737b059330b78f29bf80075fadaba8d68`。它是已获取 SVG 内容的哈希，不是完整网站或所有网络传输的哈希。原 SVG 留作研究对照，未接入产品静态目录，也没有直接叠加在当前示意座位上。

可复用的做法是按用途接资料：座位目录核对编号，分区 SVG 核对分块和留空，三维画面核对排面、入口和转角连接。二维图像坐标不能当成已校准的三维坐标。本轮已落地的是编号查询与显示；分区路径解析确认了可用的下一步参考，但没有冒充已经完成几何配准。

验证：编号、O2 研究批次、选择行为和二维地图四个测试文件共 31 条，30 条通过；唯一失败仍为既有启德布局相交用例（期待 348，实际 0）。新增检查覆盖了字母排与原记录一一对应、缩放显示、座号落在同一显示座位、示意补全座位不获得票号。实际浏览器验证了 `110 / T / 319` 深链接和点击 `110 / T / 318`。

## 10. 2026-10-31：前部 508 席的覆盖核对

把公开目录的 508 个独有座位按分区拆开后，差额全部落在 106 和 107 两区的前部：每区都是 `AA、BB、CC、A、B、C、D、E、F、G` 排。通过 REA 读取这两个分区的公开 `master_full.json`，确认排内的 `null` 是两条运行之间的通道标记；它们是地图结构信息，不能解释成缺失座位，也不能用凸包补平。

官方座位点击后的三维入口是座位全景视点。视点配置有相机位置，但没有随页面公开下载的完整可编辑椅子网格；相机 `p` 只能用来估算排面位置。项目因此将 508 席作为独立的 `panorama-camera-estimate` 显示层，保留公开的区、排、座和参考 ID，位置由 102 个对应锚点的轴向换算得到。它改善了 106/107 前部的 2D/3D 连续性与查询，却不改变 14,389 条本地来源记录，也不把参考目录当成可售库存。

本轮在本地预览中实际检查了 `106 / AA / 170`：2D 可见参考排和两条通道，状态明确为“位置为模型估算”；切到 3D 总览和靠近分区后，参考座位仍使用共用的排面与椅型。`110 / T / 319` 仍回到本地来源的数字第 18 排。查询与画面现在同时覆盖三种身份：来源座位、无票号示意补全、公开目录参考座位。

近区排号使用共享锚点而不是座位中心平均值。实现从相邻排带的边界中点寻找步道，将 `AA–Z` 放在通道边；因此 106/107 各有 27 个排号，110 有 24 个排号，2D 和 3D 的文字位置一致。这个处理只改善可读性和分区衔接，不把官方二维图的局部坐标冒充全馆三维测量。

40 个正式看台的逐座中心、局部多边形、排顺序和 `null` 排内分隔已规范化保存于 [`data/render-batch/o2-official-section-reference.json`](/Users/lilinhai/Projects/seatpeep/data/render-batch/o2-official-section-reference.json)，共 14,719 个官方参考节点。它作为本地研究参考由服务端校验，向页面提供分区数量、座位数量和哈希摘要；2026-11-01 又增加约 68 KB 的上层排内座带与间距比例。原始局部图形坐标不被直接当作全馆 XYZ，也不被转成发布库存。

2026-11-01 已将逐编号覆盖核对写成回归：14,719 个参考编号中，14,211 个映射到已有来源记录，508 个映射到参考前排，未覆盖编号为 0。另有 178 个仅本地来源编号继续保留，1,025 把无票号示意椅子不冒充官方节点。这里的覆盖只针对所保留的端台目录版本。

实际浏览器复核还发现近区文字使用旧相机矩阵裁剪的问题，现已修复。排号沿通道显示并按屏幕间距避让，座号仍在 2D 放大显示及 3D 选中信息中读取；没有声称每把 3D 椅子都印有数字。相关六个测试文件 51/52 通过，唯一失败仍为既有启德相交标记用例。当前 [106 区近景](/Users/lilinhai/Projects/seatpeep/docs/audits/render-batch-1/o2-official-106-near-final.png) 与 [2D 下层](/Users/lilinhai/Projects/seatpeep/docs/audits/render-batch-1/o2-official-coverage-2d-final.png) 已实际目检。

## 11. 2026-11-01：官方上层分区图用于修正实体座带

实际打开官方 `414/A/789`、`404/H/539` 的分区图，并核对已保留的 [414 分区节点](https://resources-contentdistribution.3ddvapis.com/v2-resources-eu-west-1/eu-gb-00040/default/endstage/default/map-viewer/sets/default/maps/S_414/master_full.json?v=2.9.1)。画面可见连续座排跨越票区颜色边界，而主楼梯位于分区内部。SDK 排序中的 null 也不总是楼梯：414/A 的 789、788 紧邻，782、773 之间才有明显宽间隔。因此，排内顺序须结合中心间距判断，不能对所有 null 或分区边界一律开缝。

项目已用这些关系整理 22 个上层通道轴，去除相接票区之间的假间隙，补上 237 个中间踏步，并保留宽入口。404/U 的四把单侧末排椅子继续位于开口旁，不因对侧缺座而移向中央。该处理使用参考图的相对结构，显示位置仍为估算；建筑入口的完整形体、栏杆和包厢尚未由这些节点证明。

最新相关六个测试文件 53/54 通过，唯一失败仍为既有启德事件相交标记；上层 7,360 个原始身份和下层显示位置保持不变。具体生成规则记录在 [操作规范第 7 节](../operations/o2-render-method-2026-10-30.md#7-2026-11-01上层票区边界与通道分开)。

## 行业方法核查（2026-11-01）

本节核查公开第一手技术资料，不修改产品，也不把建筑设计标准提升为本项目的大致参考验收门槛。

**来源事实：** Stantec 在 Autodesk University 的 [Stadium seating bowl optimization with Dynamo and Refinery](https://static.au-uw2-prd.autodesk.com/Class_Handout_AS320086_Achintya_Bhat.pdf) 中给出明确流程（PDF 第 3–10 页）：以边界、排深、排高等参数生成排剖面；用边界曲线作为路径、剖面作为截面生成看台实体；另建出口/通道实体并切分看台。其二维输出提取座带顶面多边形导出 SVG，而不是把所有三维细节直接压成一张图。资料包含视线优化，但本项目无需据此承担实测视线保证。

**来源事实：** [Arup 的 Singapore Sports Hub 项目说明](https://www.arup.com/projects/singapore-sports-hub/)明确提及专用参数化看台生成软件。这支持“参数控制整体看台”的真实工程用法；页面没有公开可供复刻的完整算法，也不能据此证明所有场馆都使用同一套方法。

**来源事实：** [Blender 的 Instance on Points 官方手册](https://docs.blender.org/manual/en/4.3/modeling/geometry_nodes/instances/instance_on_points.html)将几何引用放置到点上，并分别输入旋转、缩放；重复使用原始几何而非逐把复制数据。[Three.js 的 LOD 文档](https://threejs.org/docs/pages/LOD.html)则说明按距离切换不同细节对象。这些机制控制重复件和绘制成本，本身不会修复排线或结构边界。

**来源事实：** [3D Digital Venue 的 2D Map Selection 产品页](https://3ddigitalvenue.com/solutions-suite/venue-mapping/2d-map-selection/)将普通 2D 与 2DHD 分开：普通版适用于建筑资产有限的场馆，增强版使用真实平面图补充楼梯、门、出口。由此只能推断资料完整度影响建筑细节复原，不能把缺少完整建筑资料当成无法绘制清楚示意图的理由；该页面也不能证明国内外版权或资料可得性存在何种差别。

**面向本项目的建议（由上述流程推导）：** 将整体平面路径、楼层剖面、通道/入口遮罩作为统一结构输入，生成连续排面，再沿排线按弧长排列同尺寸椅子；编号作为独立绑定信息。2D 从同一结构提取简化分区/座带，在总览保留区号、舞台和主通道，近区才显示排线和椅子。先在固定的总览、转角、横向近景、观众视角验证比例和衔接，再推广局部规则。以上是为“大致参考”选择的产品方法，并非现成行业强制标准；当前代码已经有连续轮廓，下一步应查清局部补全与独立通道规则的冲突，而不是把换一个建模软件或再生成一个环当成充分修复。
