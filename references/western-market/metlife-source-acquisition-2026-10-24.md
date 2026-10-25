# MetLife 官方关联座位数据获取

核查日期：2026-10-24。只读公开来源；未登录、购买或下载全景图库。

## 已取得

[Jets 官方 Seating / Pricing Chart](https://www.newyorkjets.com/tickets/seating-information/pricing-chart) 的 Virtual Venue 链接实际指向 [newyorkjets.io-media.com](https://newyorkjets.io-media.com/)。其 [web/index.html](https://newyorkjets.io-media.com/web/index.html) 引用 [clientConfig.js](https://newyorkjets.io-media.com/web/clientConfig.js)，明确设置 `LOCAL_SERVICE_URL: confignew.json`。

[公开配置](https://newyorkjets.io-media.com/web/confignew.json) 实际取得837,032字节，`cmd.errorCode=0`；SHA-256 `8514d4131902760851bb56cb0a9cb052467d3b06e30ea1bf5a34c56e5683ceb2`。

| 资料 | 数量 | 含义 |
|---|---:|---|
| section 类型视点 | 602 | 离散采样，不能当容量或全座位表 |
| 原始分区标识 | 173 | 含27个WC后缀变体 |
| 仅合并WC后的基础标识 | 146 | 100系列36、200系列60、300系列50 |
| 数字排和座视点 | 601 | 另有115CWC的字母排A、座16 |
| 分层点击热区文件 | 5 | 全馆、下层、上层、两组包厢层 |
| 跨相机/层重复热区 | 6,824 | 不是独立座位数 |

配置还含241个suite、19个club和3个easteregg，应用未把这些类型混入普通分区采样。所有section的 `sectionDisplay/rowDisplay/seatDisplay` 均为null，本快照未发现应覆盖viewId票号的显示别名。

明确例子：101区14排13座；203A区6排11座；115CWC区A排16座。未知排座不会按这些离散采样推成连续库存，203A和203B、111A和111C等标识也未合并。

## 二维与三维的边界

配置 `venueLayers[].areaMapFileName` 明确列出五份JSON，实际取得：

- [FullStadium.json](https://newyorkjets.io-media.com/media/venueview/models/FullStadium.json)
- [LevelLower.json](https://newyorkjets.io-media.com/media/venueview/models/LevelLower.json)
- [LevelUpper.json](https://newyorkjets.io-media.com/media/venueview/models/LevelUpper.json)
- [LevelSuiteLower.json](https://newyorkjets.io-media.com/media/venueview/models/LevelSuiteLower.json)
- [LevelSuite.json](https://newyorkjets.io-media.com/media/venueview/models/LevelSuite.json)

每份包含五个Aerial Camera的HTML `area` 多边形。`FullStadium/Aerial_Camera_Overview` 有584个不同section视点，覆盖全部146个基础标识；其余18条采样仍有标签事实。应用只用同一全馆相机的热区中心建立相对方位，避免混合分层投影；没有把屏幕像素当米制XYZ，也没有直接复制第三方底图。

新增的200层能补上此前82区版本缺失的中层覆盖。看台宽度、坡度、排距、座位XYZ及舞台仍由参数生成，不能据此承诺门票到舞台的真实米数或遮挡。

这份来源针对Jets橄榄球布局，未证明任何具体演唱会的可售区、临时内场座位或舞台朝向。配置本身未给可验证修订日期；当前官方仍链接不等于所有价格及采样已更新。

## 保存与复现

文件在 [metlife/](metlife/)，含原始配置、五份热区、规范化section/view、规范化像素多边形、覆盖审计及精确URL/字节数/SHA-256清单。

离线重跑：`python3 western-market-research/metlife/normalize-virtual-venue.py`。该脚本验证标签格式、空别名、热区点对及所有热区ID的来源归属。内部一致性不等于现场测量精度。

Jets官方页已通过web读取确认链接，但本机curl保存该页HTML时SSL连接超时；未将失败文件记为成功下载。IOMEDIA入口、客户端配置、座位配置和五份热区均成功保存。Python默认信任库曾报缺证书，改用系统curl正常校验TLS取得，没有关闭证书验证。

未发现允许商业复制这些资产的开放许可证。公开取得和研究副本不代表已经取得图库、地图资产或模型的商业再分发权；此次未作进一步法律结论。
