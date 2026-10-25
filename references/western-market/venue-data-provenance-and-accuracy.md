# 场馆数据从哪里来，以及怎样验证准确性

核查日期：2026-10-24。对象为 shijiao.xingpaste.com 当前已保存公开发布版本，以及 KSPO DOME、Tottenham、SoFi、MetLife 的一手公开资料。本文是资料调查，未将新资料接入现有原型，未进行现场测量、购买授权或联系第三方。

## 核心判断

数据获取与校准是当前 MVP 的主要工作。官方平面图、规划附件、互动座位图、带排座标签的照片确实存在，部分运营方还提供三维模型下载。此前原型存在大片空白，是资料收集和建模覆盖不完整；不能以此推断现实中没有座位或公开资料不存在。

原网站展示很多场馆，采用的是官方图、第三方座位数据、人工整理和参数化估算的组合。它公开说明了不少估算项，不能将场馆数量视作同等数量的实测模型。尚未取得其作者的内部采集记录、现场测量记录或商业授权关系。

## 一、原网站实际如何形成大量数据

本节依据已保存的公开脚本和座位 JSON，而非对作者流程的采访。正式 REA `analyze_web_bundle` 证据锚点：

`ev_1f87574d159d170f4c5cad6ff7216e4cec76c521e7987993869b76591d156cd0`

关联 `data-CI2ywFAf.js` SHA-256：`4f2a15832526950f3ea07d366bd5c6e9a493b8c1c268d0f1bab6072064553823`。静态统计及文件校验结果见 [审计 JSON](shijiao-source-accuracy-audit.json)，完整资源索引见 [原站数据来源追踪](../shijiao-evidence/data-sources/README.md)。

| 已观察到的数据 | 数量 | 含义和边界 |
|---|---:|---|
| 场馆目录条目 | 196 | 目录覆盖，不是逐座实测模型数 |
| 馆体几何配置 | 188 | 内场、看台、坡度等参数；可用于生成场景 |
| 来源记录 | 270，去重 URL 249 | 一份资料可支持多项配置，并非全部独立核实 |
| 来源备注含“估算 / 估计 / 推算”的几何配置 | 154 | 仅统计这些措辞，不能视为错误数或错误率 |
| 小红书 / 微博 / Instagram 来源记录 | 76 | 说明社会化资料确实参与参考；不证明所有投稿标签准确 |
| 已定位的独立座位 JSON | 7 | 部分馆有逐座数据；其他路径也可能由代码生成座位 |

可追溯的来源有四类：

1. **官方座位图和场馆资料。** 用于确定区号、楼层、总体布局和部分尺度；不同场馆公开程度不同。
2. **第三方现有模型。** 红馆、亚博 Arena、VIVA、Summit、Runway 11、台北小巨蛋六份座位 JSON 的 `source` 指向 [Flytix](https://venue.flytix.live/viewer?venue=hkc)。启德的参考说明另指向 Flytix 的 CAD 派生逐座平面数据。
3. **演出票图与社交实景。** 帮助核对舞台方向、分区、排座与现场外观。原站来源表包含具体帖子链接。
4. **人工规则及参数生成。** 用相似的看台绘制方式和参数化几何扩展到很多场馆，再由同一套数据生成 SVG 二维图和 Three.js 三维场景。这解释了较广覆盖；具体生产流程和投入人力未知。

上游 Flytix 启德脚本还描述了逐座 PDF/CAD 到 `src/data/kts_seats.json` 的整理路径，同时注明排高、层底高度等推算项。该开发路径不是已经取得的原始 CAD 下载地址。本轮未获得其整理时使用的全部原始图纸。

## 二、原网站是否准确

应按字段和场馆分别判断，现有证据不足以给出全站准确率。

| 例子 | 原发布数据自己的说明 | 可以得出的结论 |
|---|---|---|
| London The O2 | 尺寸、层高、坡度和排座为估算，以现场为准 | 可参考布局；无法直接认定距离、眼高和逐座位置已校准 |
| Kia Forum | 原参考票图没有区号，使用方位示意；尺寸、层高、坡度与排座估算 | 某些配置不能直接匹配真实票面分区编号 |
| 启德 | 逐座平面坐标和编号参考 CAD 派生数据；区界、部分排归属仍待核对；高度坡度估算 | 二维编号证据比垂直几何更强，不能统一标为“精确三维” |
| 启德内场尺度 | 官方面积 12,200㎡；86×142m 是等面积量级推算 | 已知面积不唯一决定长宽，距离仍受形状假设影响 |
| 手机取景 | 通用手机估算，未按具体手机校准，不模拟光学 / 数字变焦画质差异及防抖裁切 | 能表达画面占比的估算；不能承诺拍出清晰人脸 |

七份座位文件 SHA-256 校验通过，覆盖的十二种数据布局内部没有重复的“分区 / 排 / 座”键。这证明文件和编号在内部一致，**不证明数据完整、符合现场、取得授权或达到某个米级误差**。不同布局的座位记录大量重叠，不能相加得到真实容量。

本轮没有取得独立现场真值或误差分布，因此没有“准确率 95%”“误差 ±1m”等结论。

## 三、官方真的会公开建造图或三维模型吗

### KSPO DOME：已确认实际三维文件存在

[运营方设施资料页](https://www.ksponco.or.kr/olympicpark/menu.es?mid=a10405050100) 明确提供一、二、三层平面 PDF，座位图 JPG / EPS，以及 SKP / DAE 下载。

- [一层平面 PDF](https://www.ksponco.or.kr/attachFiles/download/kspo/popimg_acro_1f.pdf)：可访问，包含建筑平面及尺寸标注；不据此宣称含全馆逐座坐标。
- [官方 DAE 压缩包](https://www.ksponco.or.kr/attachFiles/download/kspo/kspodome_dae.zip)：GET Range 实际成功返回 HTTP 206，完整压缩包大小 58,775,583 字节。
- 读取包尾 65,536 字节并解析 ZIP 中央目录，确认 28 个条目，其中确有 `kspodome_dae/sketchfab(설계용)/source/temp_export/temp_export.dae` 和贴图文件。该 DAE 的解压大小为 475,561,443 字节。
- [保留的目录、响应元数据及哈希](public-venue-samples/kspodome-dae-archive-inventory.json)；[包尾字节样本](public-venue-samples/kspodome-dae-archive-tail.bin)。样本不是完整 ZIP。

这一步已超出“网页有下载按钮”：实际确认了模型条目存在。但尚未完整下载、解析几何、核对单位、座位编号或现状，因此不能宣称已取得可直接用于手机的真实逐座模型。原站是否使用这个官方模型，也没有证据。

**许可另行核查。** [运营方版权政策](https://www.ksponco.or.kr/menu.es?mid=a10745000000) 要求确认资料是否标有 KOGL 第 1 类自由使用标识；没有标识的材料需事先协商。本轮未确认该模型具备相应标识，公开下载不能直接视为商用授权。

### 欧美：已找到的真实资料

| 场馆 | 实际取得或直接核实 | 当前不足 |
|---|---|---|
| Tottenham | 官方关联 Virtual Venue 配置和七份二维轮廓；217 个分区标识、665 个 section 采样视点；政府规划图纸目录及总图 | 二维轮廓是屏幕像素，采样视点不是全部座位 XYZ；规划图纸目录不等于已取得对应施工图 |
| SoFi | 官方座位 PDF 入口；Inglewood 政府规划文件；建筑师 HKS 说明存在用于审批的数字 Model of Record | 官方 PDF 本轮仅下载部分，不能声称已完成逐页解析；HKS 文章未开放完整 BIM 下载 |
| MetLife | 官网提供全馆、Plaza、100、200、300 层地图 | 已核实分区图不等于完整逐座编号和三维坐标 |

Tottenham 的 [公开配置](https://tottenhamhotspur.io-media.com/web/confignew.json) 已下载并规范化。217 个标识包含无障碍 WC 变体，合并后为 187 个基础标识；不是 217 个普通实体看台。665 个采样视点也不是全馆座位总数。122 区样本包含 Row 4 / 14 / 24 与 Seat 679 / 698，证明原型统一使用 Seat 1–24 不符合真实票号。

原型此前 75 个分区标识均能与这批公开配置对应，但覆盖明显不足。配置含历史赛季文字，当前可访问不意味着所有信息已更新到 2026。详见 [Tottenham 完整审计与原始数据](tottenham-public-data-audit.md)。

欧美一手入口：

- [Haringey 图纸编号清单](https://www.minutes.haringey.gov.uk/documents/s82753/App%201%20Drawing%20Numbers%20and%20Technical%20Reports.pdf)、[总图与方案图](https://www.minutes.haringey.gov.uk/documents/s82754/App%202%20Site%20Plans%20and%20Scheme%20and%20Images.pdf)。后续可按明确图号查平面和剖面；旧规划不能直接代表当前竣工状态。
- [HKS：SoFi 数字模型说明](https://www.hksinc.com/our-news/articles/inside-sofi-stadiums-innovative-design/)。证明模型存在，未证明对公众开放。
- [MetLife 官方分层座位图](https://www.metlifestadium.com/events-tickets/seating-charts)。

更多获取记录及 SoFi 下载失败边界见 [欧美公开图纸研究](open-venue-drawings-and-data.md)。本轮没有把未完成下载的文件计入已取得的完整图纸。

## 四、开源数据与社交平台能补多少

**开放地理数据适合建筑底图。** [Overture Buildings](https://docs.overturemaps.org/schema/reference/buildings/building/) 主要提供建筑轮廓、可选高度、层数和建筑部件；[OSM 室内标注](https://wiki.openstreetmap.org/wiki/Simple_Indoor_Tagging) 可表达房间、走廊、楼层等。字段能够表达，不代表每个体育馆有人完整录入，更不代表已有官方座位库。本轮没有发现一个可直接覆盖目标市场、逐座带真实 XYZ 的统一开放数据集。

**用户确实会分享自己坐在哪里。** [A View From My Seat 官方 FAQ](https://aviewfrommyseat.com/faq/) 明确说明照片由观众分享，也会在翻修、改名后更新 section / row / seat 对应关系。但标签首先是投稿信息；其审核说明主要针对内容适宜性，不能推导为逐张测量验真。[条款](https://aviewfrommyseat.com/legal/terms_of_service/) 也未保证用户内容准确，并对使用设置条件。不能据此批量复制商业图库。

研究使用时，可按“场馆 + 分区 + 排号 + 演出名称”寻找照片，再用过道、出口、栏杆、对面区号等固定特征交叉核对。优先保留原帖、时间、布局和编号证据。未知焦距、裁切和手机变焦的单张照片，很难独立确定绝对米数；要做摄影测量还需要相机信息、尺度约束和多个视点。

[3D Digital Venue 的官方技术说明](https://3ddigitalvenue.com/seat-view-technology-for-ticketing-platform-how-it-works-and-what-integration-requires/) 把 CAD / BIM / 测绘、看台与排定义、现场拍摄或扫描列为输入，并要求与票务座位清单对齐。其校验流程支持“多来源建模并验证”的路线，但厂商自己的精度宣传不等于独立误差认证。更多平台差异见 [座位参考与准确性研究](seat-reference-and-accuracy.md)。

## 五、适合本 MVP 的资料与验收顺序

以下是工程建议，不代表已完成建模或验证。

| 验收对象 | 主要依据 | 通过前的展示方式 |
|---|---|---|
| 完整分区与楼层关系 | 当前官方图、分层图、票务区号、特殊区说明 | 只对已核实区域提供定位；空缺注明数据未覆盖 |
| 真实 Row / Seat 对应 | 官方或授权座位清单、逐座图、多个独立票面 / 视点标签 | 仅支持已核实采样席位或排范围；不将未知票号映射到模拟座位 |
| 米制平面坐标 | 有尺寸的平面图、尺度控制点、逐排几何 | 距离保留估算状态，不由排版示意图像素直接换算 |
| 座位高度与视线 | 看台剖面、标高、排高、栏杆及现场核对 | 无依据的参数标为推算，不承诺量化误差 |
| 当场舞台与艺人位置 | 指定演出 / 日期 / 版本的舞台图和现场布局 | 自由预览声明假设；舞台位置未知时不给伪精确距离 |
| 手机画面人物占比 | 已校准距离、人物高度、水平 / 垂直视场角 | 指明等效焦距和裁切假设；画面占比不代表成像清晰度 |

每个字段应记录来源 URL、资料时间、版本、单位及“官方确认 / 交叉核对 / 推算 / 未知”状态。模型拟合后保留一组未参与拟合的已知视点做核验，覆盖上下层、角部、前后排和遮挡位置；先量出误差，再决定对外如何描述精度。

相机理想模型中，正对镜头的人物高度占比可由 `人物高度 / (2 × 距离 × tan(垂直视场角 / 2))` 近似估算。它依赖姿态、视角及镜头假设，无法单独预测数字变焦、抖动、降噪和光线决定的细节。

对欧美第一馆，Tottenham 已有足够资料推进完整分区核对和真实票号采样验证；继续查具体图号对应的剖面与平面，补齐米制坐标和排座清单。此前模型中的统一 30 排 × 24 座、估算层高和大片空白仍需改造。**本轮交付资料和核验报告，当前原型没有因本报告自动变为准确模型。**

## 六、后续复核：当前 MVP 与数据准确性必须分开验收

2026-10-24 再次运行 `audit-shijiao-source-accuracy.py`：196 条目录、188 份馆体配置、154 份备注含估算措辞、7 份座位文件的统计及文件哈希仍与保存的公开发布材料一致。这是保存版本的复核，不代表实时全站审计，也没有新增现场误差测量。

同时读取 `seatpeep/data/venues.json`，当前版本与较早的 75 分区原型已有区别：Tottenham 有 187 个基础标识、217 个来源分区标识；MetLife 有 82 个分区样本；SoFi 有 38 个分区样本。三馆仍全部标记 `completeSeatInventory: false`、`metricCalibrated: false`、`stage: generic`。Tottenham 122 区保存的六个来源排座标签，其 `positionStatus` 仍为 `estimated`。因此“采样标签来自官方关联平台”不能被解释成“采样座位的场景 XYZ 已经来自官方测量”。

再次打开并确认的一手网页：

- [KSPO 设施资料](https://www.ksponco.or.kr/olympicpark/menu.es?mid=a10405050100)：仍列出三层平面 PDF、座位 JPG/EPS、SKP/DAE 下载。
- [MetLife Seating Charts](https://www.metlifestadium.com/events-tickets/seating-charts)：仍有全馆及 Plaza/100/200/300 层图。
- [HKS SoFi 设计说明](https://www.hksinc.com/our-news/articles/inside-sofi-stadiums-innovative-design/)：确实说明数字 Model of Record；该文章没有开放原始模型下载。
- [Overture Buildings schema](https://docs.overturemaps.org/schema/reference/buildings/building/)：描述建筑轮廓及可选高度/层数，用于近似三维建筑形体；不能将该字段表视为开放座位库。
- [3D Digital Venue 技术说明](https://3ddigitalvenue.com/seat-view-technology-for-ticketing-platform-how-it-works-and-what-integration-requires/)：厂商列明建筑/测绘资料与 seating manifest 为不同输入，并要求对齐实际票务标识及现场验证。这是厂商对其流程的说明，并非我们已取得其资产或独立认证其精度。
- [A View From My Seat FAQ](https://aviewfrommyseat.com/faq/)：照片来自观众；公开审核说明主要针对内容适宜性，且承认翻修/改名后会更新排座标签。[条款第 5 节](https://aviewfrommyseat.com/legal/terms_of_service/)不保证投稿准确性。因此这些内容适合作为交叉核对材料，不能作为未经核验的测量真值。

面向用户的准确性判断应拆成四项：票号是否真实存在、平面位置是否有米制尺度、垂直位置与遮挡是否已校准、舞台是否对应指定场次。人物画面占比还取决于相机视场角；画面占比正确也不证明具体手机能拍清人物细节。
