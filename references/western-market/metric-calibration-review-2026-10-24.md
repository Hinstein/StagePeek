# Tottenham 米制校准与座位定位：一手来源独立复核

核验日期：2026-10-24。范围：已有 Haringey 规划图、Tottenham / Populous / sbp 官方信息，以及已留存的 Tottenham Virtual Venue 配置。本报告不修改产品数据。

## 可执行结论

**现在有条件把 Tottenham 的独立模型从任意椭圆，推进为“有官方尺度约束的设计重建”；还没有证据把任意门票的排、座转换为经过验证的米制三维位置。**这两项必须分开验收。真实区号/采样座号与真实尺寸分别存在，但连接它们的逐排几何、座号方向和坐标变换尚未取得。

### 1. 已核验的米制约束

| 一手事实 | 可落地的校准用途 | 适用范围与边界 |
|---|---|---|
| 可伸缩球场为 **105 × 68m** | 建立独立模型的长、宽参考矩形；把球场中心设为本地原点时，边界为长向 ±52.5、宽向 ±34m（后者为计算值） | sbp 项目技术资料；不是已取得场馆测量坐标或演唱会舞台范围。[sbp](https://www.sbp.de/en/project/tottenham-hotspur-stadium/) |
| 首排距边线 **4.9–7.9m**；南看台单层、17,500 座且高度超过 34m | 检查模型内边缘量级与南看台结构是否明显错误 | 俱乐部足球场介绍的整体描述，不能代替每个区的首排坐标。[俱乐部](https://www.tottenhamhotspur.com/the-stadium/) |
| 南看台首排距球门线 **4.98m**；建筑师介绍看台倾角 35° | 给南端首排提供独立检查值；35°只能作设计特征核对 | 不能把 35°统一套给所有看台、所有排；已取得剖面显示不同楼层与断面。[Populous，2019-05-31](https://populous.com/article/make-it-loud-designing-for-atmosphere-at-new-tottenham-hotspur-stadium?lang=zh-hans) |
| 2015 规划东/南看台剖面 **1:200 @ A1**；全场两向剖面和平面 **1:500 @ A1** | 按各方向剖面/平面研究内边缘、台阶、层间开口与看台非对称性；校验上述已知尺度 | 图签为 **2015-09-18，PLANNING，rev 0**；不是竣工测绘。[原始来源清单](tottenham/planning/source-manifest.json)、[规划申请](https://publicregister.haringey.gov.uk/pr/s/planning-application/a0i8d000002GB1NAAW/hgy20153000?c__r=Arcus_BE_Public_Register) |

sbp 还明确列出项目使用 **LOD 400 / Revit + Navisworks**。这证明项目有 BIM 工作流，**没有证明模型公开下载、包含完整座位，或允许我们商用**；本次检查的项目页未提供该模型下载。[sbp](https://www.sbp.de/en/project/tottenham-hotspur-stadium/)

### 2. 标高可以校验结构，不能直接生成座位眼高

东看台 SC-0183 的 FOP 标记为 **12.298**。下表是已人工视觉抄录数值及相减结果；不是新增测量。原图没有在已检查图签/标高栏命名 AOD 基准，也没有逐项打印单位；“米”是建筑标高惯例及比例尺支持的解释，仍保留这一推断状态。[抄录与 SHA-256](tottenham/planning/east-stand-levels-transcribed.json)、[原图](https://publicregister.haringey.gov.uk/pr/sfc/servlet.shepherd/version/download/0688d000008j38lAAA)

| 标签 | 原图值 | 相对 FOP 差值（按米解释） |
|---|---:|---:|
| LEVEL 00 | 11.530 | −0.768 |
| LEVEL 1 | 15.530 | 3.232 |
| LEVEL 2 | 19.530 | 7.232 |
| LEVEL 4 | 28.155 | 15.857 |
| LEVEL 5 | 32.345 | 20.047 |
| LEVEL 6 | 36.970 | 24.672 |
| LEVEL 8 | 44.420 | 32.122 |
| LEVEL 9 | 47.865 | 35.567 |
| Top of Eaves | 55.600 | 43.302 |
| Top of Roof | 59.154 | 46.856 |

LEVEL 00 确认为 **11.530**。这些是建筑楼层/屋顶标签，不能把某层全部座椅放在同一高度，不能把楼层值当座面或观众眼睛高度。相对 FOP 相减消除了未知的绝对偏移，但没有补足逐排高度、施工变更或演唱会地面高程。

### 3. Virtual Venue 提供的是采样位置标识与二维命中区

已留存的 [公开配置](https://tottenhamhotspur.io-media.com/web/confignew.json) 有 732 个 `elements`，其中包括非座位的内部/趣味视角；因此不能把 732 当成座位总数。形如 `Sub_Section_101_4_8` 的条目提供区、排、座采样标识与相机倾角。本次所检查字段没有米制 XYZ。完整本地内容见 [public-config](tottenham/virtual-venue-public-config.json) 与 [规范化元数据](tottenham/virtual-venue-sections-normalized.json)。

[FullStadium-map](tottenham/virtual-venue-FullStadium-map.json) 是按相机名称划分的 HTML `area shape='poly' coords='…'`，可做对应背景图上的点击命中。它不是场馆平面的真实边界，不是世界坐标；不能给像素乘一个固定系数就算出座椅 XYZ。多个透视视图若没有相机标定和对应锚点，也不能直接还原准确三维位置。

排座标识应保留原字符串，包括前导零、无障碍后缀和跨区连续座号。稀疏采样既不能证明两点之间所有座号都存在，也不能证明排座号按相同方向、同样间距递增。该数据还包含历史 2022–23 价格文字，不是当前可售库存。[本地规范化说明与采样明细](tottenham/virtual-venue-sections-normalized.json)

## 下一步校准工作应怎样落地

1. **分开坐标系。**新建独立本地米制模型，声明 `footballPitchCentre` 原点、轴向、单位和足球 FOP 高度；规划图、Virtual Venue 投影、现有参数化模型分别保留坐标框架及转换记录。不要覆盖原始像素坐标。
2. **先配准结构。**以 105×68m 球场为尺寸锚点，结合两方向剖面和平面校核横纵比例、方向与相对高度，再按东/西/南/北不同断面建模。没有精确数字尺寸链的描图成果标为 `designDerived`，保留所用图号、比例尺、点位与提取方式。
3. **再连接真实门票。**逐区建立实际排标签、各排座号区间、编号方向、通道缺口、无障碍/俱乐部席变更；先验证官方采样里的已知三元组。二维命中区只负责选中来源视角，未经配准不负责产生米制位置。
4. **距离以事件为单位验收。**必须取得或独立验证该演唱会的舞台位置/大小、高度、延伸台与封区。足球草坪尺寸不能证明演唱会舞台坐标；没有舞台定位时不能给出“真实距表演者多少米”。
5. **用未参与拟合的锚点检查。**保留独立检查点、差值与未通过项目；有检查样本才能讨论误差。图纸精细、来源官方或拟合残差很小，都不能单独证明真实席位误差在某个米数内。

每个校准参数至少记录：`sourceUrl`、源文件 SHA-256、图号/页码/日期/修订、`sourceStage`、单位、坐标基准、适用布局、提取方法、直接值或派生值、验证点。建议独立区分“区号已核验”“采样三元组已核验”“设计几何已配准”“竣工/实测米制已验证”“本场舞台已验证”，避免一个 `verified=true` 混淆所有层次。

## 还没有解决的缺口

- 未取得逐座 XYZ、完整可售排座清单、每排踏步/踢面数字尺寸链，以及规划轴线到当前售票分区的完整映射。
- 未确认设计图对竣工状态、后续安全站席改造、无障碍/临时席调整的覆盖情况。
- 未取得指定演唱会舞台的米制坐标及相应地面高度。足球 FOP 不自动等于 NFL/演唱会地面。
- 一条搜索索引中的官方 Travis Scott 2024 地图地址直接访问返回 404：`https://www.tottenhamhotspurstadium.com/media/gbbn4tl1/large_travisscott_map.pdf`。真实 curl 与 Web 读取均确认失败；对同一俱乐部主域的对应地址检查也返回 404。原始响应是 HTML 而非 PDF，已留存 [响应/状态/哈希记录](tottenham/source-checks/travis-pdf-retrieval-check.json) 与对应头文件/HTML。未取得原件，不能把搜索摘要中的数字当已核验排座数据。当前 [官方 Travis 活动页](https://www.tottenhamhotspurstadium.com/events/1010149/travis-scott/) 也未提供可用地图链接。本次不伪造 PDF 提取结果。
- 规划图签提示优先采用标注尺寸并现场核对，同时注明 Populous 版权。公开查阅不等于获得复制图纸、模型或商用资产许可；本报告只核验来源与事实，未把图纸放入产品资源。

**建议当前产品继续保持 `metricCalibrated=false`。**已有资料足够支持有出处的结构改进与已知采样点定位；不足以把任意输入的排、座宣称为真实坐席，也不足以发布经过验证的米制距离或人物大小预测。
