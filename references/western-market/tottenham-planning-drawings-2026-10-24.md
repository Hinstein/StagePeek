# Tottenham 规划建筑图纸增量核验（2026-10-24）

## 结论

**能够取得真实、带比例尺和标高的官方公开建筑图纸。**此前只检查委员会摘要/附件，未进入迁移后的完整申请文件库，覆盖不够。当前 Haringey Public Register 不需要登录，精确搜索 `HGY/2015/3000` 后，Files 标签显示 **653 条结果**。本次实际下载并视觉核验了东看台、南看台和全场两个方向的剖面，以及 Level 05 建筑平面；有条件用它们约束独立模型的看台层次与高度。

这些是 **2015-09-18、PLANNING、rev 0 的设计资料**，不是竣工测量，也没有取得完整逐座 XYZ / 排号座号映射。当前产品的 `metricCalibrated=false` 应保持。不能把建筑楼层标高直接当座位眼高，也不能把它和 IOMEDIA 的二维投影多边形坐标直接拼成三维坐标。

官方入口：[Haringey 公开申请详情](https://publicregister.haringey.gov.uk/pr/s/planning-application/a0i8d000002GB1NAAW/hgy20153000?c__r=Arcus_BE_Public_Register)。在页面进入 **Files**，Show filter → Keywords 输入 `section` 或 `Stadium` → Apply filters，可复现下列结果。旧 `planningservices.haringey.gov.uk` 入口不可用，不代表新公开库没有图纸。

## 已取得并验证的原始文件

所有文件在 `tottenham/planning/`，完整来源 URL、字节数、SHA-256、页数与图签信息见 [source-manifest.json](tottenham/planning/source-manifest.json)。本次下载使用真实页面的链接，没有猜测地址，也未下载全部申请包。

| 图号 / 文件 | 图签与实际内容 | 对模型的用途 |
|---|---|---|
| [SC-0183 东看台剖面](https://publicregister.haringey.gov.uk/pr/sfc/servlet.shepherd/version/download/0688d000008j38lAAA) | 1 页，1:200 @ A1；分层看台阶梯、夹层、屋顶、明确楼层标高和 FOP 标记 | 约束东看台轮廓、分层与相对高度；不能提供所有区每排高程 |
| [SC-0185 南看台剖面](https://publicregister.haringey.gov.uk/pr/sfc/servlet.shepherd/version/download/0688d000008j3dQAAQ) | 1 页，1:200 @ A1；连续南看台断面及下部通道/设施，附楼层和屋顶标记 | 防止把南看台按东西看台相同的三层结构建模；未抄录每排尺寸 |
| [SC-0180 全场 A-A / B-B 剖面](https://publicregister.haringey.gov.uk/pr/sfc/servlet.shepherd/version/download/0688d000008j285AAA) | 1 页，1:500 @ A1；North–South GA Section 与 West–East GA Section，两方向贯穿全场 | 交叉核对整体高宽关系和南/北、东/西非对称性 |
| [GA-0155 Level 05 平面](https://publicregister.haringey.gov.uk/pr/sfc/servlet.shepherd/version/download/0688d000008j3fCAAQ) | 1 页，1:500 @ A1；结构轴线、看台排轮廓、通道/开口、周边设施；PDF 有可提取文字和矢量内容 | 可继续做平面轮廓与剖面配准；轴线 E1/S1 等不是当前售票区号，亦没有完整座位号表 |
| [D&A Stadium Design Part1](https://publicregister.haringey.gov.uk/pr/sfc/servlet.shepherd/version/download/0688d000008j2wmAAA) | 1 页，章节封面 | 不提供尺寸；已停止把它当目录 |
| [D&A Stadium Design Part2](https://publicregister.haringey.gov.uk/pr/sfc/servlet.shepherd/version/download/0688d000008j3AGAAY) | 1 页，2015 D&A 第 75 页，外观鸟瞰效果图 | 不提供看台排距或精确几何；没有继续批量下载其余部分 |

本地阅读文件：

- [东看台完整渲染](tottenham/planning/POP-4494-PLN-SC-0183-east-stand-page-1.png)
- [东看台标高与图签放大](tottenham/planning/east-stand-levels-title-detail.png)
- [东看台 FOP 标记放大](tottenham/planning/east-stand-pitch-datum-detail.png)
- [南看台完整渲染](tottenham/planning/POP-4494-PLN-SC-0185-south-stand-page-1.png)
- [全场两个方向剖面](tottenham/planning/POP-4494-PLN-SC-0180-sections-a-b-page-1.png)
- [Level 05 平面](tottenham/planning/POP-4494-PLN-GA-0155-level05-page-1.png)

## 明确读出的东看台标高

来源为 SC-0183 第 1 页，人工阅读上述高分辨率裁图，非 OCR 自动猜数。机器可读抄录：[east-stand-levels-transcribed.json](tottenham/planning/east-stand-levels-transcribed.json)。

| 原图标签 | 原图数值 |
|---|---:|
| FOP | 12.298 |
| LEVEL B1 East | 7.313 |
| LEVEL 00 | 11.530 |
| LEVEL 1 | 15.530 |
| LEVEL 2 | 19.530 |
| LEVEL 4 | 28.155 |
| LEVEL 5 | 32.345 |
| LEVEL 6 | 36.970 |
| LEVEL 8 | 44.420 |
| LEVEL 9 | 47.865 |
| Top of Eaves | 55.600 |
| Top of Roof | 59.154 |

**读取纠正：LEVEL 00 是 11.530，不是缩略图初看时的 13.530。**

FOP 标记明确存在，但本次检查的标高栏与图签没有看到命名为 AOD 的基准说明。因此这些数值只能先记为“图纸采用的标高基准”，不能宣称已确认海拔。按建筑图纸的三位小数标高惯例，单位解释为米是合理推断；机器文件同时记录这一推断及 `aodVerified=false`。即使统一了基准，某楼层标高仍不等于该层每张座椅或眼睛的高程。

## 实际附件覆盖范围

`section` 筛选返回 **31 条结果**，已读完两页并保存 DOM 可见表格：

- [section-search-page1.json](tottenham/planning/section-search-page1.json)：前 20 条。
- [section-search-page2.json](tottenham/planning/section-search-page2.json)：后 11 条。

其中有 10 张体育场剖面 **SC-0180 至 SC-0189**：A-A/B-B、C-C/D-D、西、东、北、南、东南、西北、东北、西南；另有 SC-0198 东西入口、SC-0199 南北入口。上述目录中的真实地址都已保存；除本次三张外，其余只确认目录存在，未声称检查内容。31 条结果也包含酒店、住宅、景观、Section 106 等，与座位无关。

`Stadium` 筛选返回 **49 条结果**，本次查看前两页共 40 条，保存为 [stadium-search-page1.json](tottenham/planning/stadium-search-page1.json) 与 [stadium-search-page2.json](tottenham/planning/stadium-search-page2.json)，未查看最后 9 条。第一页包括 D&A Stadium Design Part1–12；第二页明确列出 **GA-0150 至 GA-0159（Level 00–09）、GA-0160（Basement B1）、GA-0161（Roof）**。只下载其中 GA-0155，未以目录存在代替逐张核验。

委员会页 [HGY/2015/3000 议题](https://www.minutes.haringey.gov.uk/mgAi.aspx?ID=47683) 的 App1 是图纸编号列表、App2 是方案图像、Independent Crowd Safety Review 主要研究外部人行拥挤；它们不足以否定或替代完整申请库的图纸。

## 可做什么、还不能做什么

现在有了可约束独立模型的公开证据：真实平面排轮廓、看台剖面、不同方向结构与标高。下一步可以在明确标注“依据 2015 设计图重建”的前提下，研究结构轴线、图纸比例、FOP 和 IOMEDIA 区块之间的配准，替换任意统一椭圆与统一坡度。

本次没有查到或提取完整的“售票区 → 每排 → 每座 → 三维坐标”数据，没有确认各排踏步宽度/踢面高度的数字尺寸链，也没有测量剖面上的阶梯像素来冒充官方尺寸。PDF 的比例尺支持研究性描图，图纸自身同时提示优先使用标注尺寸并现场复核，因此由图像估出的排距/坡度应另列误差和推断来源。

公开可访问不等于开放许可。图签明确标示 Populous 版权所有并限制复制使用；本次文件仅作来源核验留存，没有把原图发布进 MVP，也没有据此认定可复制其模型或图纸表达。事实参数、独立重建方法和最终商用授权应继续分别判断。本次不对许可作法律结论。
