// Only new shared-view phrases live here; existing site translations stay authoritative.
const phrases={
 '取景变焦':['Camera zoom','取景變焦','カメラズーム','카메라 줌'],
 '查看舞台':['View stage','查看舞台','ステージを見る','무대 보기'],
 '缩小视图':['Zoom out','縮小視圖','縮小','축소'],
 '放大视图':['Zoom in','放大視圖','拡大','확대'],
 '视角放大 · 示意':['View zoom · illustrative','視角放大 · 示意','視野ズーム · イメージ','시야 확대 · 예시'],
 '手机取景框':['Phone framing','手機取景框','スマートフォンのフレーム','휴대폰 프레임'],
 '拖动平移 · 滚轮 / 双指缩放 · 点击分区或座位':['Drag to pan · scroll / pinch to zoom · select a section or seat','拖動平移 · 滾輪 / 雙指縮放 · 點擊分區或座位','ドラッグで移動 · スクロール / ピンチで拡大縮小 · 区画や座席を選択','드래그로 이동 · 스크롤 / 핀치로 확대 · 구역 또는 좌석 선택'],
 '固定座位视角 · 拖动只转头 · 滚轮 / 双指变焦':['Fixed seat viewpoint · drag to look around · scroll / pinch to zoom','固定座位視角 · 拖動只轉頭 · 滾輪 / 雙指變焦','座席位置は固定 · ドラッグで見回す · スクロール / ピンチでズーム','고정 좌석 시점 · 드래그로 둘러보기 · 스크롤 / 핀치로 확대'],
 '拖动旋转 · 滚轮 / 双指缩放 · 点击座位入座':['Drag to orbit · scroll / pinch to zoom · select a seat to enter','拖動旋轉 · 滾輪 / 雙指縮放 · 點擊座位入座','ドラッグで回転 · スクロール / ピンチで拡大縮小 · 座席を選んで入席','드래그로 회전 · 스크롤 / 핀치로 확대 · 좌석 선택으로 입장']
};
export function venueViewCopy(source,locale,translate){
 const index=['en','zh-TW','ja','ko'].indexOf(locale);
 return index>=0&&phrases[source]?phrases[source][index]:translate(source);
}
