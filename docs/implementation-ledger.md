# 实施记录

2026-10-24：检查确认现有 `venue-view-prototype` 是纯静态实验，没有身份与计费。当前工作区非 Git 仓库；独立 `seatpeep` 目录隔离开发。

决策：用户明确要求自主完成 MVP，采用 Node 24+ / SQLite / 浏览器模块执行，不新增设计审批。免费馆为 Tottenham，月费通过 Stripe Price 配置；不编造价格或真实席位。

上一 goal turn 分类：progress，新增数据来源与准确性报告、KSPO ZIP 目录证据及审计结果，明确下一步不能延用合成排座冒充真实票号。

Task 1：SQLite / 邮件单次 token / 持久会话 / Google state+PKCE / 安全账号绑定 / 订阅周期权限已实现。首批测试 RED→GREEN，6/6 通过。

Task 2 进展：Google 和 Resend HTTP 适配器、Stripe 月价检查、Checkout / Portal / 签名 Webhook、订阅按当前状态串行同步、同源与 Host 校验、受保护场馆 API、本地邮箱、保存位置接口已实现。测试 RED→GREEN，18/18 通过；测试只调用本地服务及受控协议应答，未向第三方发信或创建真实支付。沙箱监听 127.0.0.1 返回 EPERM，经本地集成测试权限执行后通过。

Task 2/4 本地体验：用户确认暂时没有服务凭据、先做本地可测试版，并要求睡觉期间不提问。已实现独立 `start:local` 和 `*-local.sqlite` 测试夹具，free/pro/expired三个账号；真实服务全部禁用。测试邮箱只对回环、当前申请浏览器、未过期未消费token开放；前端提供同源测试链接。邮件origin修复覆盖LAN/loopback Cookie；RED→GREEN。

Task 3：Tottenham 187基础分区/217来源标识/609可用排座采样；MetLife82区、SoFi38区，无排座采样。三馆米制和全逐座清单均未完成。未知票号拒绝落到模拟座位；采样标签与估算XYZ分别标记。研究补充见 `../western-market-research/public-data-followup-2026-10-24.md`。

Task 3：修正MetLife官网入口及SoFi已验证详情URL，尾斜杠去重，失败刷新保留旧缓存；修正无效结束时间隐藏BonJovi与体育活动混入；Tottenham自动1项、MetLife自动3项未来演出；SoFi自动请求失败，3份官方详情经web人工核验，以人工缓存标记保留，未冒充自动抓取。未获得各场次校准舞台布局。

Task 4：实际Chrome走通Pro邮箱登录、三馆权限、保存/读取、未知680拒绝/已知679恢复。SVG hidden属性导致2D不可见的浏览器复现已修复并回测可见。390px视口无横向溢出；实际点击检测仍有效。透明点击代理不再参与渲染，同初始视角drawCalls430→56；不以此声称真机FPS或内存测试通过。

Task 5：独立只读整体review `mvp_final_review` 完成，Critical0、Important3、Minor0。三个Important均修复：持久化Checkout并防重复订阅、无offset日期、HTTP200解析损坏的旧缓存保留。审查当时 `npm test` 为 37/37；之后新增来源二维热区和公开场次座位图参考测试，当前为 48/48。Declined to judge的真实provider接通与场馆数据准确性继续列为未完成验收项。

Task 5：已补README、verification、final-review和三份截图。最终服务 `npm run start:local` 在4180运行；本机/LAN health均200。未发布、未发送真实邮件、未扣费、未改其他项目。代码本地体验已交付，完整原始目标仍active，不能把示意和受控协议测试当作数据精度与外部接通验收。

Task 3增量（后续轮，progress）：沿Jets官网Virtual Venue真实链接取得MetLife公开config837,032bytes及五份热区，规范化173标识/146基础区/602采样；SoFi专项研究代理沿Rams官方链取得318标识/257基础标识/587采样和七份热区，另用Chargers独立来源255标识/523采样核对。所有原始下载记录URL/hash；未取图库。两馆已接入MVP，补MetLife200系列、SoFi五个编号系列，保留字母排、C/VIP/OWN前缀及WC票号。只用同一全馆Overview推相对角度，XYZ仍estimated；没有借别的来源标签替补未知票号。

Task 3增量验证：新增行为测试先RED（MetLife旧82区不符146），接入后GREEN；完整38/38通过，三馆1,798采样逐条解析、XYZ一致、未知票号拒绝、字母/前缀保留。实际Chrome验证MetLife203A/6/11、SoFiC116/10/10、未知9999禁用及恢复，二维146/257交互目标，三维SoFi257区。新增两份效果截图和来源报告。仍未取得完整座表、米制XYZ、具体场次舞台及开放商用授权；这些要求未完成，不标goal complete。

Task 3场次追踪：沿MetLife/SoFi官方BuyTickets链接到艺人页，再到具体Ticketmaster场次（Zach2027-05-14、Usher2026-11-15）。web可读演出资料但无地图，本机GET401；Chrome正常导航只到等待页。Tottenham KarolG链接进入eticketing排队页。保留准确访问边界，不绕过验证，也未用通用布局替代场次真实图。此增量轮仍有新数据接入成果，分类progress，非blocked。

Task 3方向修复（增量，progress）：发现Tottenham33基础标识只在分层图，旧默认角0造成重叠。对相同Overview相机、共享view中心对齐的Level200/500补方位，新增positionBasis并取消静默缺省；29套房各自方位、900归高层。测试RED为1≠29，修复后当时完整39/39；当前完整套件为47/47。重启4180，Chrome点选201/211/231/900及122保存恢复验证。分层屏幕坐标只校正相对方向，米制/逐座/场次布局仍未完成。

Task 3公开建筑资料（增量，progress）：研究复用代理进入Haringey迁移后申请HGY/2015/3000的Files653附件，读完section31项并核验3剖面+1平面，另2份D&A仅封面/效果图。source-manifest保留实际URL、字节和SHA256；主执行代理独立复核6文件及东看台标高裁图。此前旧portal访问失败不再视为图纸不存在。2015 PLANNING/rev0非竣工测量，没有完整座号、统一XYZ或场次舞台；尚未用该资料校准应用，goal保持active。报告见../../western-market-research/tottenham-planning-drawings-2026-10-24.md。

Task 4二维轮廓增量（progress，当前测试48/48）：将官方关联Virtual Venue公开热区顶点保留在venues.json，二维渲染按原始屏幕投影绘制不规则看台和过道，三维估算坐标不被误当成像素坐标。新增来源顶点/坐标系测试及精确场次票务图参考测试，完整48/48通过；Chrome重启后看到弧形布局、缺口和585个Tottenham投影多边形。来源没有转为米制校准，也没有增加未知座位的自动匹配。
