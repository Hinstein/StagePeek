# SeatPeep 数据模型和验收门槛

## 来源字段

每个 venue、event 和 eventLayout 都应尽量保留：

- `provider` / `providerVenueId` / `providerEventId`
- `sourceUrl` 或来源页面
- `retrievedAt`
- `contentHash`（图片、SVG 或 JSON）
- `sourceKind`: official-page、ticketing-api、ticketing-seatmap、operator-traced、estimated
- `verificationStatus`: candidate、source-matched、geometry-checked、reviewed、preview-published、rejected
- `verificationNotes`

## 永久场馆和事件布局

永久场馆保存建筑轮廓、楼层、固定看台和已确认的座位来源。演唱会布局单独保存，使用 `eventId` 或供应商事件 ID 作为版本键。事件布局不能覆盖永久场馆的默认座位模型。

事件级对象通常包括：

```json
{
  "eventId": "provider-event-id",
  "venueId": "seat-scope-venue-id",
  "source": {"url": "...", "kind": "ticketing-seatmap", "retrievedAt": "...", "sha256": "..."},
  "stageRects": [],
  "closedSections": [],
  "temporarySections": [],
  "performer": null,
  "coordinateFrame": "venue-source-frame",
  "confidence": {
    "eventIdentity": "source-matched",
    "stage": "operator-traced",
    "seatCoordinates": "estimated",
    "scale": "estimated"
  },
  "verificationStatus": "candidate"
}
```

示例不是固定 schema；适配现有项目字段时保留相同语义。

## 验收门槛

### source-matched

事件 ID、场馆、日期、官方 URL 和座位图来源互相一致。不能只凭名称包含关系通过。

### geometry-checked

通过批量场景检查：有限坐标、无座位/舞台碰撞、无看台表面碰撞、行带不跨来源通道、2D/3D 共用坐标。

### reviewed

人工或有来源证据的复核通过：舞台方向、分区编号、缺口/封区、内场边界和至少一个独立 holdout 锚点一致。

### preview-published

已生成 2D、3D、座位入座和移动端截图或浏览器记录，来源版本可复现，回滚版本已保留。

## 拒绝条件

- 供应商场馆 ID 和目录场馆不一致；
- 中文或特殊字符名称归一化后为空仍继续匹配；
- 只有通用场馆模板，没有事件级舞台证据；
- 自动拟合通过，但原图与模型的方向或分区缺口不一致；
- 坐标或尺寸不可复现；
- 事件来源已变更却继续使用旧布局。
