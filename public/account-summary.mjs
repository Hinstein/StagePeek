// Access is the server's entitlement decision; a historical subscription is not proof of Pro access.
export function accountSummary(me,lang='zh-CN',now=Date.now()){
 const en=lang==='en',t=(zh,english)=>en?english:zh,pro=me.access.plan==='pro',sub=me.subscription;
 const ends=sub?.period_end?new Date(Number(sub.period_end)):null;
 const date=ends&&!Number.isNaN(ends.getTime())?ends.toLocaleDateString(en?'en-US':'zh-CN',{year:'numeric',month:'short',day:'numeric'}):null;
 const statuses={past_due:t('付款待处理','Payment overdue'),unpaid:t('付款未完成','Payment incomplete'),incomplete:t('订阅未完成','Subscription incomplete'),incomplete_expired:t('订阅未完成','Subscription incomplete'),canceled:t('订阅已结束','Subscription ended'),paused:t('订阅已暂停','Subscription paused')};
 const status=pro?(sub?.cancel_at_period_end?t('已取消续费','Renewal cancelled'):sub?.status==='trialing'?t('试用中','Trial active'):t('订阅生效中','Active membership')):statuses[sub?.status]||t('免费使用中','Free membership');
 const period=pro?(date?(sub?.cancel_at_period_end?t(`Pro 权益保留至 ${date}`,`Pro access until ${date}`):sub?.status==='trialing'?t(`试用结束日期：${date}`,`Trial ends ${date}`):t(`当前订阅周期至 ${date}`,`Current period ends ${date}`)):t('Pro 权益已生效；账单周期暂无记录。','Pro access is active; billing period unavailable.')):date&&ends.getTime()<=now?t(`上次订阅已于 ${date} 结束，当前使用免费套餐。`,`Your previous subscription ended ${date}. You are on the free plan.`):sub?t('当前未获得 Pro 权益，可继续使用免费场馆。','Pro access is not active. Your free venues remain available.'):t('当前没有付费订阅，免费权益持续可用。','No paid subscription. Your free benefits remain available.');
 return {pro,plan:pro?'StagePeek Pro':'StagePeek Free',status,period,description:pro?t('全部已开放场馆与更多收藏空间，为下一场现场做好准备。','Explore every available venue, with more room to save your next great view.'):t(`从 ${me.access.venueIds.length} 个精选场馆开始，提前探索你的座位和现场视角。`,`Start with ${me.access.venueIds.length} selected venues and explore your seat before the show.`)};
}
