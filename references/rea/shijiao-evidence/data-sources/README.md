# 场馆、2D/3D 与逐座数据来源追踪

日期：2026-10-23。对象：shijiao.xingpaste.com 当前公开发布版本。

## 结论

已经定位到具体数据，且本轮补到了上一轮 12 个脚本之外的 7 个座位 JSON。此前的脚本采集不能称为全站完整数据；本轮也不包含后端数据库、全部演出附件、所有原始制图文件或全部发布版本。

当前实现采用“内置场馆及几何参数 + 少数场馆独立座位 JSON + 客户端生成 2D/3D”的组合。未发现一个统一返回全部场馆 3D 模型的公共 API。

## 数据在哪里

| 数据 | 当前定位 | 本地文件 |
|---|---|---|
| 场馆目录 | `data-CI2ywFAf.js` 静态定义，194 条扩展 + 2 条内置 | [venues.json](/Users/lilinhai/Projects/rea/shijiao-evidence/data-sources/venues.json) |
| 通用馆体几何 | 同一脚本中的 `r` 对象，188 个 profile；包括内场、看台、坡度与来源说明 | [venue-geometry-profiles.json](/Users/lilinhai/Projects/rea/shijiao-evidence/data-sources/venue-geometry-profiles.json) |
| 分区/排座参考 | 同一脚本中的 `s` 对象，109 个 profile；部分有 rowSlots 和具体排座规则 | [section-layout-references.json](/Users/lilinhai/Projects/rea/shijiao-evidence/data-sources/section-layout-references.json) |
| 逐座坐标 | `AppRoute` 的 `yr` 映射指定 7 个 CDN JSON，`Cr` 按需 fetch | [seat-assets-manifest.json](/Users/lilinhai/Projects/rea/shijiao-evidence/data-sources/seat-assets-manifest.json) |
| 六馆布局概览 | 内置参考快照有舞台、区界与来源，seats 初始为空；逐座数据随后从上述 JSON 加载 | [reference-layouts-inline.json](/Users/lilinhai/Projects/rea/shijiao-evidence/data-sources/reference-layouts-inline.json) |
| 2D 图 | `AppRoute` 内 SVG 组件读取分区参数或座位 x/z 坐标，生成路径 | 见下面实现说明 |
| 3D 图 | `Stadium` + Three.js，根据馆体、座位、舞台配置生成几何与实例 | 见下面实现说明 |

这些数据集合相互重叠，数量不能相加得到场馆总数。缺少独立 JSON 不代表没有座位：另有参数生成、图纸录入及专用代码路径。

## 7 个公开座位文件已成功取得

合计 **14,625,248 bytes**，为解压后的 JSON 大小，不是网络传输量。记录数量代表发布数据，不是官方核准容量；同馆不同布局有大量重复，不能相加。

| 场馆 | 布局与座位记录数 | 目标站公开地址 |
|---|---|---|
| 启德主场馆 | 48,483 条原始记录 | [kaitakSeatSource-jer28SXf.json](https://shijiao-static-cn.oss-cn-beijing.aliyuncs.com/releases/photo-protection-20261023/assets/kaitakSeatSource-jer28SXf.json) |
| 香港红馆 | center 11,446；end 11,562 | [hkc-Gbi7T1FS.json](https://shijiao-static-cn.oss-cn-beijing.aliyuncs.com/releases/photo-protection-20261023/assets/hkc-Gbi7T1FS.json) |
| 亚博 Arena | end 11,724；standing 8,300 | [awe-Ca55Pf13.json](https://shijiao-static-cn.oss-cn-beijing.aliyuncs.com/releases/photo-protection-20261023/assets/awe-Ca55Pf13.json) |
| 亚博 VIVA | end 5,600；expanded 8,364 | [viva-rS3OQoqC.json](https://shijiao-static-cn.oss-cn-beijing.aliyuncs.com/releases/photo-protection-20261023/assets/viva-rS3OQoqC.json) |
| 亚博 Summit 2 号馆 | end 5,080 | [summit-B0YE2Xxi.json](https://shijiao-static-cn.oss-cn-beijing.aliyuncs.com/releases/photo-protection-20261023/assets/summit-B0YE2Xxi.json) |
| 亚博 Runway 11 | end 3,800；compact 1,620 | [r11-DBeBuvo4.json](https://shijiao-static-cn.oss-cn-beijing.aliyuncs.com/releases/photo-protection-20261023/assets/r11-DBeBuvo4.json) |
| 台北小巨蛋 | end 10,000；center 12,877 | [tpa-hUGCMqZh.json](https://shijiao-static-cn.oss-cn-beijing.aliyuncs.com/releases/photo-protection-20261023/assets/tpa-hUGCMqZh.json) |

原样 JSON 已保存在当前目录的 `seat-assets/`。清单保存了原始 URL、时间、解压字节数和本地 SHA-256。

## 上游从哪里来

### Flytix：七馆中可明确追到的一组来源

红馆、亚博四种场馆和台北小巨蛋这 6 个 JSON 的 `source` 字段都指向 Flytix：

- [红馆](https://venue.flytix.live/viewer?venue=hkc)
- [亚博 Arena](https://venue.flytix.live/viewer?venue=awe)
- [亚博 VIVA](https://venue.flytix.live/viewer?venue=viva)
- [亚博 Summit](https://venue.flytix.live/viewer?venue=summit)
- [亚博 Runway 11](https://venue.flytix.live/viewer?venue=r11)
- [台北小巨蛋](https://venue.flytix.live/viewer?venue=tpa)

其元数据同时包含 `reference`、`defaultLayout`、`rotation`、`snapshotSHA256`，布局内有 seats/stage/zones。`snapshotSHA256` 是目标数据声明的上游快照标识，不应与本次下载文件的 SHA-256 混为一谈。

启德的 `section-layout-references` 则明确标注 [Flytix 启德模型](https://venue.flytix.live/viewer?venue=kts) 为参考，并说明逐座平面坐标、排号、座号来自其公开 CAD 派生数据；区界与部分排归属仍待票面确认，高度、坡度和设备仍含估算。

本次进一步读取了 Flytix 公开页面与它实际引用的 viewer、hkc、kts 三个脚本。上游确实有相应场馆模块。其启德模块说明了从逐座 PDF/CAD 资料整理到 `src/data/kts_seats.json` 的过程，同时反复区分量测与推算部分。

这些说明支持“目标站标注参考 Flytix，且上游有相应数据实现”。未逐点比较当前上游与目标站历史快照，不声称两者当下全部坐标一致，也不推断两站作者、商业合作或授权关系。

上游代码提到 `tools/kai-tak/README.md`；尝试相应公开 URL 返回 404。尚未取得它整理时使用的全部原始 CAD/PDF，代码中的开发路径不能直接当可下载地址。

### 官方座位图、场馆资料与人工整理

通用几何的 `sources` 中有 270 条来源记录；188 个 profile 的自标证据类型为 reference 107、dimension 35、plan 29、structure 17。这些标签属于原站的数据标注，并非本次对每条来源完成独立核验。

可定位的例子：

| 场馆 | 发布数据标注的参考 | 需要保留的精度边界 |
|---|---|---|
| KSPO DOME | [官方座位图](https://www.ksponco.or.kr/olympicpark/img/sub/s3_01_03_seat.jpg)及活动页 | 当前视角由内置参数生成，未发现官方逐座 3D 坐标接口 |
| 香港红馆 | [康文署下载页](https://www.lcsd.gov.hk/sc/hkc/downloads.html)、[四面台 PDF](https://www.lcsd.gov.hk/en/hkc/common/form/hkc_center_stage.pdf) | 官方分区图与模型高度/坡度是不同证据 |
| 亚博 Arena | [官方场馆图](https://www.asiaworld-expo.com/zh-sc/visiting/venue-map/) | 通用 profile 的尺寸说明仍标初步估计；逐座路径另有 Flytix JSON |
| 台北小巨蛋 | [官方座位视野页面](https://web.metro.taipei/taipeiarenaseatview/taipeiarenaseat-center-tw.html) | 有官方分区支持，但不等于取得实测建筑剖面 |
| 蚕室室内体育馆 | [首尔官网分区图](https://stadium.seoul.go.kr/files/2016/08/jamsil_drawing_indoormain.jpg)及特定演出票图 | 发布说明称部分区逐排录入，其他区仍估算 |

因此，并非“接入一个 API 就自动拥有 196 个精确场馆”。其数据有官方事实、图纸读图、第三方模型、人工录入和算法估算多个层次。

## 2D 与 3D 的生成关系

参考模型路径：座位 JSON → `Wd` 解码每座坐标/朝向 → 按分区和排分组 → `Gd/Kd` 生成每排踏步轮廓 → SVG 取 x/z 平面绘制；相同的座位记录交给 3D 实例化网格。

`AppRoute` 的 `ii` 组件会读取 `model.seats`、`model.polygons`、`variant.stage` 和 zones，生成 SVG path/rect/polygon。所以这里的“2D 图”主要是数据生成的交互图，不是独立下载的成品图片。

通用馆体路径使用 `floor`、`tiers`、`shape`、区界、rowSlots 等配置生成几何。官网 JPG/PDF 常用作建模参考，不能将参考图片 URL 当成该页面最终 SVG 的下载接口。

KSPO 的 `ep` 内置两层参数；`$f` 构造 1–22 区、23–52 区及四个内场站区。已按该明确公式生成 [56 个分区的可读版本](/Users/lilinhai/Projects/rea/shijiao-evidence/data-sources/kspo-sections-derived.json)，其性质为本次分析派生数据。

相机由分区角度、看台半径、排深比例、高度/坡度、站坐眼高计算。真实逐座数据与示意生成座位应在产品里分开标注。

## 座位字段已经解码

红馆等六馆的 `seats` 是长度 14 的紧凑数组。`Wd` 解码关系为：

| 索引 | 含义 |
|---|---|
| 0 / 1 / 2 | 分区 / 排标识 / 座号 |
| 3 / 4 / 5 | 场景 x / y / z |
| 6 / 7 | 座椅朝向分量，yaw 由 atan2 计算 |
| 8 / 9 | 层级 / 排深分组参数 |
| 10 / 11 | 椅宽 / 排深 |
| 12 / 13 | 踏步朝向分量 |

启德使用不同字段顺序；`rf` 会转换坐标方向、补入高度，保留 `cadIndex` 和来源类型。不能用红馆解码器直接解释启德。

[解码后的座位样本](/Users/lilinhai/Projects/rea/shijiao-evidence/data-sources/decoded-seat-examples.json)保留每种布局的一个示例，便于核对。

## 可直接查看的交付

- [196 个场馆及来源总表 CSV](/Users/lilinhai/Projects/rea/shijiao-evidence/data-sources/venue-source-inventory.csv)
- [总表 JSON](/Users/lilinhai/Projects/rea/shijiao-evidence/data-sources/venue-source-inventory.json)
- [7 个座位文件清单](/Users/lilinhai/Projects/rea/shijiao-evidence/data-sources/seat-assets-manifest.json)
- [188 个馆体参数](/Users/lilinhai/Projects/rea/shijiao-evidence/data-sources/venue-geometry-profiles.json)
- [109 组分区参考](/Users/lilinhai/Projects/rea/shijiao-evidence/data-sources/section-layout-references.json)

提取方法：Babel AST + 只允许字面值、静态引用和固定算术的解码器，没有执行目标脚本。JS 来自正式 REA 已保留的 capture；新座位 JSON 和上游脚本通过无凭据公开 HTTPS GET 读取，属于本轮额外材料，不冒充 REA retained browser evidence。

这些公开文件的可访问性不等于已确认商业再利用授权。若要用于我们的网站，需确定数据使用方式和授权，同时保留原始来源与估算标签。

## MVP 补充核验：票面定位、距离与手机倍率

本节为对既有 REA 保留脚本的静态复核，不是新增运行时观测，也不是产品设计批准。

- `AppRoute-FKjE7l3d.js` 的 `Go` 函数按 `等效焦距 × zoom` 计算水平／垂直视场角，并按 4:3 或 3:4 分配等效成像尺寸；按钮提供 1、2、5、8、10 倍。`Stadium` 读取 `lens` 后将该垂直视场角用于座位相机。
- UI 明确写有“通用手机估算”“暂未按具体手机校准”“估算场景 · 非实拍”，并声明不模拟光学与数字变焦的画质差异，也不包含视频防抖裁切。因此它支持几何取景和人物画面大小示意，不能据此保证具体手机在演出中能拍清人脸。
- 精确按 `Section / Row / Seat` 找票面位置，需要真实编号与坐标的映射；生成一排示意椅子并不能验证其座号与实际门票一致。原站部分欧美记录明确缺少尺寸／剖面或把排座标为估算。缺少独立 JSON 不等于不能生成座位，但生成结果的票面准确性需要另外验证。
- 原站 `london-the-o2` 的来源说明将尺寸、层高、坡度、排座标为估算；`los-angeles-kia-forum` 的特定场次说明原图无区号，使用方位示意。不能把它们直接计作已核验的欧美逐座覆盖。
- 距离计算需要真实尺度。座位到台前最近边缘、舞台中心、延伸台或指定表演者位置是不同距离；仅有场景坐标不能直接标成米。几何距离和人物投影在尺度、相机及目标位置可靠后可独立计算，不依赖实拍照片。

可确认的是实现机制和数据自述；尚未验证欧美各馆实际座号、测量误差、当场舞台尺度或具体手机成像误差。
