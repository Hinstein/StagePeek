# 公开场馆资料定向复核

复核日期：2026-10-24。范围仅为已有研究的一手来源复查；未修改应用、未抓取图库、未取得新授权。

## 已取得或再次直接确认

- **Tottenham 的官方关联来源真实存在。** [俱乐部 2022-01-20 公告](https://www.tottenhamhotspur.com/news/1009794/club-becomes-first-in-the-uk-to-launch-ticketmasters-3d-virtual-venue-technology) 当前仍明确链接 IOMEDIA Virtual Venue，并说明桌面和手机的 360° 视野预览、分区比较等用途。这证明平台得到官方背书；宣传用语不是我们独立测得的精度。
- **公开配置再次下载成功。** [confignew.json](https://tottenhamhotspur.io-media.com/web/confignew.json) 经系统 curl 取得 717,115 字节，SHA-256 为 `e53668f37139da7f279c135dd8ae134c672fb45067f5b4813a0a87c4d7f91c24`，与此前保存文件和来源清单完全相同。不是仅凭搜索摘要确认。浏览工具打不开该 JSON；Python 的本机证书链失败；系统 curl 成功，不应把前两项工具失败当作来源不存在。
- 既有规范化结果为 217 个分区标识，合并 WC 变体后 187 个基础标识，以及 665 条 section 采样视点。它们是采样视野和分区信息，**不是 665 个全部座位，也不是完整米制 XYZ**。原文件、七份二维热区文件及处理过程见 [Tottenham 审计](tottenham-public-data-audit.md) 和 [来源清单](tottenham/virtual-venue-source-manifest.json)。本轮文件哈希相同，因此没有发现配置变化。
- **政府审批资料确实公开。** [Haringey 2015-12-16 议程](https://www.minutes.haringey.gov.uk/ieListDocuments.aspx?CId=728&MID=7657) 对 HGY/2015/3000 直接列出 [图纸编号与技术报告清单（6 页）](https://www.minutes.haringey.gov.uk/documents/s82753/App%201%20Drawing%20Numbers%20and%20Technical%20Reports.pdf) 和 [总图、方案与效果图（3 页）](https://www.minutes.haringey.gov.uk/documents/s82754/App%202%20Site%20Plans%20and%20Scheme%20and%20Images.pdf)。网页和 PDF 均被浏览工具取回；后者内容标题确认为总图及效果图。本机 curl 对政府 PDF 的 TLS 失败不改变浏览工具已取回的结论。
- **观众会提供排座位置。** [A View From My Seat FAQ](https://aviewfrommyseat.com/faq/) 说明素材由用户分享，场馆翻修或更名时可能更新 section / row / seat 的对应信息。其 quality control 说明主要是家庭适宜性，不能据此认为每张照片的票号都经过测量验真。

## 有线索，尚未取得目标成果

- Haringey 图纸目录的既有人工核查记录含 `POP-4494-PLN-GA-*` 平面和 `PLN-SC-*` 剖面图号；**目录不等于图纸本体**。本轮 PDF 文字提取主要返回页眉，未重新 OCR 核对所有具体图号，具体编号仍应以原 PDF/既有审计为准。
- 可按 HGY/2015/3000 与精确图号继续查规划门户；取得具体带尺寸剖面后才可用于校准排高、坡度和层标高。2015 年审批设计还需与现状交叉核对。
- 社交照片可借助过道、出口、栏杆、对面区号及多个独立投稿交叉验证。单张照片的标签、焦距和裁切不足以给出可靠绝对距离。这是对数据能力的工程判断，平台未提供逐张独立定位精度报告。

## 未知与复用边界

- 尚未确认 Tottenham 的完整逐座清单、全场真实 XYZ、竣工 BIM/CAD 及其开放商用许可；“公众可看”不能自动升级为“开源可再分发”。
- [AVFMS 现行条款](https://aviewfrommyseat.com/legal/terms_of_service/) 第 5、10 节不保证用户内容准确、完整或及时。第 6.1 节对票务/推广/销售及特定大型场馆关联业务要求书面许可；对其他使用者另有须链接原内容且不修改的许可条件。不能一概说全站开放商用，也不能一概说所有引用都被禁止；SeatPeep 的具体业务归类和所需许可未确定。第 8 节还限制通过未获允许的方式访问或搜索，本轮没有进行批量抓取。
- 现有资料支持继续补齐**分区覆盖及真实票号采样**，尚不足以对所有位置承诺米级距离或手机取景精度。距离功能要另外核实米制座位坐标、眼高、具体演出舞台位置；视觉顺滑程度不证明输入数据准确。

本轮新增的一手索引入口仅为 [Haringey 该审批事项的完整附件页](https://www.minutes.haringey.gov.uk/mgAi.aspx?ID=47683)，可定位同一事项的进一步文档；不将其视为已取得新增施工图。
