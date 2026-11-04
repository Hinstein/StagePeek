// Editorial review dates describe this content review, not a new venue survey.
export const REVIEWED_AT='2026-10-27';
export const VENUE_GUIDES=[
  {
    id:'kai-tak-stadium',name:'启德主场馆',aliases:'啟德主場館 · Kai Tak Stadium',
    reviewedAssetSha256:'7a2a28335d337a82cad8c6e11f7bdf9d7650199b9fa1bbd81d633c9ff5fa81f8',
    title:'启德座位表与看台视角说明',
    intro:"先按门票分区找到固定看台，再查看排座和舞台方向。",
    reading:"选择看台层级后，按票面完整区号、排号和座号查询。层级与入场口请以门票和场馆指引为准。",
    limitation:"此图展示固定看台。演出的内场、延伸台和设备安排可能不同，请选择对应场次或查看主办方座位图。",
    question:'启德内场票也能用这份座位表吗？',answer:"此图主要展示固定看台。内场座位和站席安排请查看对应演出的座位图。",
    sources:[['场馆官方介绍','https://www.kaitaksportspark.com.hk/sc/venues-spaces/4'],['固定看台参考查看器','https://venue.flytix.live/viewer?venue=kts']],
    diagram:'bowl'
  },
  {
    id:'hong-kong-coliseum',name:'香港体育馆 · 红馆',aliases:'香港體育館 · 紅館 · Hong Kong Coliseum',
    reviewedAssetSha256:'926e37787d56b6dd4e100ae5da5c023f8a9ee4004d9524403c31e9f3b9f0859c',
    title:'红馆座位表与四面台、正面台说明',
    intro:'红馆看座位前，先区分四面台和正面舞台。同一座位标签在不同舞台配置中的方向与可见内容可能不同，不能只靠区号判断是否正对舞台。',
    reading:"先选择四面台或正面舞台，再按门票查询区、排、座。同一座位在不同舞台配置中的观看方向可能不同。",
    limitation:"舞台、屏幕和临时设备会随演出变化，视角仅供参考。",
    question:'红馆四面台一定没有背面吗？',answer:'四面台说明舞台的布局类型，不保证每个方向都能看到同样画面。艺人走位、屏幕及设备遮挡需要查看该场官方说明，模型无法保证全程无遮挡。',
    sources:[['红馆官方场地资料下载','https://www.lcsd.gov.hk/sc/hkc/downloads.html'],['官方中央舞台平面参考','https://www.lcsd.gov.hk/en/hkc/common/form/hkc_center_stage.pdf']],
    diagram:'center'
  },
  {
    id:'taipei-arena',name:'台北小巨蛋',aliases:'臺北小巨蛋 · Taipei Arena',
    reviewedAssetSha256:'f1b66f49d6ef8dc34f3a7aaf1cdfe621d45e1b6a28316c39d8539869344f6b5d',
    title:'台北小巨蛋座位图与分区视角说明',
    intro:'查询台北小巨蛋时，请保留票面完整色区、数字及字母，例如「紅1B」。只输入「红区」会丢失分区信息；也应先确认演出使用远端还是中央舞台。',
    reading:"先选择远端或中央舞台，再输入完整分区，例如「紅1B」或「紫1B」。",
    limitation:"内场、站席与延伸台会随演出变化，请结合当场座位图查看。",
    question:"查询台北小巨蛋时应怎样填写分区？",answer:"请保留票面的颜色、数字和字母，例如「紅1B」，并选择对应的舞台布局。",
    sources:[['台北小巨蛋官方网站','https://www.arena.taipei/'],['官方座位视野参考','https://web.metro.taipei/taipeiarenaseatview/taipeiarenaseat-center-tw.html']],
    diagram:'end'
  }
];
