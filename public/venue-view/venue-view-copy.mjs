// Only new shared-view phrases live here; existing site translations stay authoritative.
const phrases={
 '更多操作':['More controls','更多操作','その他の操作','추가 조작'],
 '模型资料来源 ↗':['Model source ↗','模型資料來源 ↗','モデルの出典 ↗','모델 출처 ↗'],
 '来源编号 · 位置估算':['Source seat numbers · estimated positions','來源編號 · 位置估算','出典の座席番号 · 位置は推定','출처 좌석 번호 · 위치는 추정'],
 '来源座位 · 视角供参考':['Source seat data · illustrative view','來源座位 · 視角供參考','出典の座席データ · 視点は参考','출처 좌석 데이터 · 참고용 시야'],
 '站区 · 无座号':['Standing area · no seat numbers','站區 · 無座號','スタンディング · 座席番号なし','스탠딩 구역 · 좌석 번호 없음'],
 '分区模型 · 无逐座数据':['Section model · no individual seat data','分區模型 · 無逐座資料','区画モデル · 個別座席データなし','구역 모델 · 개별 좌석 데이터 없음'],
 '参考编号 · 位置估算':['Reference seat numbers · estimated positions','參考編號 · 位置估算','参考座席番号 · 位置は推定','참고 좌석 번호 · 위치는 추정'],
 '取景变焦':['Camera zoom','取景變焦','カメラズーム','카메라 줌'],
 '查看舞台':['View stage','查看舞台','ステージを見る','무대 보기'],
 '缩小视图':['Zoom out','縮小視圖','縮小','축소'],
 '放大视图':['Zoom in','放大視圖','拡大','확대'],
 '视角放大 · 示意':['View zoom · illustrative','視角放大 · 示意','視野ズーム · イメージ','시야 확대 · 예시'],
 '手机取景框':['Phone framing','手機取景框','スマートフォンのフレーム','휴대폰 프레임'],
 '拖动平移 · 滚轮 / 双指缩放 · 点击分区或座位':['Drag to pan · scroll / pinch to zoom · select a section or seat','拖動平移 · 滾輪 / 雙指縮放 · 點擊分區或座位','ドラッグで移動 · スクロール / ピンチで拡大縮小 · 区画や座席を選択','드래그로 이동 · 스크롤 / 핀치로 확대 · 구역 또는 좌석 선택'],
 '固定座位视角 · 拖动只转头 · 滚轮 / 双指变焦':['Fixed seat viewpoint · drag to look around · scroll / pinch to zoom','固定座位視角 · 拖動只轉頭 · 滾輪 / 雙指變焦','座席位置は固定 · ドラッグで見回す · スクロール / ピンチでズーム','고정 좌석 시점 · 드래그로 둘러보기 · 스크롤 / 핀치로 확대'],
 '拖动旋转 · 滚轮 / 双指缩放 · 点击座位入座':['Drag to orbit · scroll / pinch to zoom · select a seat to enter','拖動旋轉 · 滾輪 / 雙指縮放 · 點擊座位入座','ドラッグで回転 · スクロール / ピンチで拡大縮小 · 座席を選んで入席','드래그로 회전 · 스크롤 / 핀치로 확대 · 좌석 선택으로 입장'],
 '拖动旋转 · 滚轮 / 双指缩放 · 点击分区查看':['Drag to orbit · scroll / pinch to zoom · select a section','拖動旋轉 · 滾輪 / 雙指縮放 · 點擊分區查看','ドラッグで回転 · スクロール / ピンチで拡大縮小 · 区画を選択','드래그로 회전 · 스크롤 / 핀치로 확대 · 구역 선택']
};
export function venueViewCopy(source,locale,translate){
 const index=['en','zh-TW','ja','ko'].indexOf(locale);
 return index>=0&&phrases[source]?phrases[source][index]:translate(source);
}
