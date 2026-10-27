// Access is the server's entitlement decision; a historical subscription is not proof of Pro access.
import {interfaceCopy} from './translations/interface.mjs';
export function accountSummary(me,lang='zh-CN',now=Date.now()){
 const copy=(source,values)=>interfaceCopy(source,values,lang),pro=me.access.plan==='pro',sub=me.subscription;
 const ends=sub?.period_end?new Date(Number(sub.period_end)):null;
 const date=ends&&!Number.isNaN(ends.getTime())?ends.toLocaleDateString(lang,{year:'numeric',month:'short',day:'numeric'}):null;
 const statuses={past_due:copy("付款待处理"),unpaid:copy("付款未完成"),incomplete:copy("订阅未完成"),incomplete_expired:copy("订阅未完成"),canceled:copy("订阅已结束"),paused:copy("订阅已暂停")};
 const status=pro?(sub?.cancel_at_period_end?copy("已取消续费"):sub?.status==='trialing'?copy("试用中"):copy("订阅生效中")):statuses[sub?.status]||copy("免费使用中");
 const period=pro?(date?(sub?.cancel_at_period_end?copy("Pro 权益保留至 {0}", [date]):sub?.status==='trialing'?copy("试用结束日期：{0}", [date]):copy("当前订阅周期至 {0}", [date])):copy("Pro 权益已生效；账单周期暂无记录。")):date&&ends.getTime()<=now?copy("上次订阅已于 {0} 结束，当前使用免费套餐。", [date]):sub?copy("当前未获得 Pro 权益，可继续使用免费场馆。"):copy("当前没有付费订阅，免费权益持续可用。");
 return {pro,plan:pro?'StagePeek Pro':'StagePeek Free',status,period,description:pro?copy("全部已开放场馆与更多收藏空间，为下一场现场做好准备。"):copy("从 {0} 个精选场馆开始，提前探索你的座位和现场视角。", [me.access.venueIds.length])};
}
