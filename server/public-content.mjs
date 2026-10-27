// Editorial review dates describe this content review, not a new venue survey.
export const REVIEWED_AT='2026-10-27';
export const VENUE_GUIDES=[
  {
    id:'kai-tak-stadium',name:'启德主场馆',aliases:'啟德主場館 · Kai Tak Stadium',
    reviewedAssetSha256:'7a2a28335d337a82cad8c6e11f7bdf9d7650199b9fa1bbd81d633c9ff5fa81f8',
    title:'启德座位表与看台视角说明',
    intro:'先按门票上的分区和层级找固定看台，再核对排座。启德当前接入的是固定看台来源布局，不能把它当作某一场演唱会的内场座位表。',
    reading:'来源以 101 等数字标记分区，并区分 L1、L2、L5L、L5U 层级。层级是来源标识，不能仅凭数字推断实际楼层或入场口。工具可在已有记录中核对排座并显示来源坐标。',
    limitation:'当前 bowl 版本没有场次舞台坐标；临时内场、延伸台、控台、封区与视线遮挡都需要对应演出的官方图纸。固定看台记录不能推断这些区域，也不能据此计算真实舞台距离。',
    question:'启德内场票也能用这份座位表吗？',answer:'这份版本只覆盖固定看台。内场排座及站席范围由演出制作决定；没有对应场次来源时，不能把看台坐标套到内场票上。',
    sources:[['场馆官方介绍','https://www.kaitaksportspark.com.hk/sc/venues-spaces/4'],['固定看台参考查看器','https://venue.flytix.live/viewer?venue=kts']],
    diagram:'bowl'
  },
  {
    id:'hong-kong-coliseum',name:'香港体育馆 · 红馆',aliases:'香港體育館 · 紅館 · Hong Kong Coliseum',
    reviewedAssetSha256:'926e37787d56b6dd4e100ae5da5c023f8a9ee4004d9524403c31e9f3b9f0859c',
    title:'红馆座位表与四面台、正面台说明',
    intro:'红馆看座位前，先区分四面台和正面舞台。同一座位标签在不同舞台配置中的方向与可见内容可能不同，不能只靠区号判断是否正对舞台。',
    reading:'工具保留 center（四面台）与 end（正面舞台）两个来源版本。43、44 等为来源分区标识；排号、座号与版本一起核对。切换版本时，记录数会改变，不等于场馆增加或减少了同样数量的实际座位。',
    limitation:'两个版本是来源布局参考，尚未独立核对当前演出的制作方案。舞台尺寸、屏幕朝向、封区和临时设备可能变化；四面台也不保证四个方向能看到相同内容。',
    question:'红馆四面台一定没有背面吗？',answer:'四面台说明舞台的布局类型，不保证每个方向都能看到同样画面。艺人走位、屏幕及设备遮挡需要查看该场官方说明，模型无法保证全程无遮挡。',
    sources:[['红馆官方场地资料下载','https://www.lcsd.gov.hk/sc/hkc/downloads.html'],['官方中央舞台平面参考','https://www.lcsd.gov.hk/en/hkc/common/form/hkc_center_stage.pdf']],
    diagram:'center'
  },
  {
    id:'taipei-arena',name:'台北小巨蛋',aliases:'臺北小巨蛋 · Taipei Arena',
    reviewedAssetSha256:'f1b66f49d6ef8dc34f3a7aaf1cdfe621d45e1b6a28316c39d8539869344f6b5d',
    title:'台北小巨蛋座位图与分区视角说明',
    intro:'查询台北小巨蛋时，请保留票面完整色区、数字及字母，例如「紅1B」。只输入「红区」会丢失分区信息；也应先确认演出使用远端还是中央舞台。',
    reading:'当前提供 end（远端舞台）与 center（中央舞台）来源版本。分区如紅1B、紫1B等沿用来源原文；不同版本的分区和坐标记录数量不同。工具显示的来源层级编号不直接等于建筑楼层。',
    limitation:'通用来源版本不能替代当场售票图。临时摇滚区、站席、延伸台、封闭看台与主办方的视线不良标记仍需逐场核对；不根据几何模型推荐“最佳座位”。',
    question:'为什么台北小巨蛋两个布局的记录数不同？',answer:'来源按舞台版本保留不同的座位集合。这里展示的是相应版本导入的记录数，不是官方容量、可售余票或完整库存；选错版本可能导致查不到票号。',
    sources:[['台北小巨蛋官方网站','https://www.arena.taipei/'],['官方座位视野参考','https://web.metro.taipei/taipeiarenaseatview/taipeiarenaseat-center-tw.html']],
    diagram:'end'
  }
];
