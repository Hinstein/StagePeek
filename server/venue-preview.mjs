// A fixed public marketing preview, separate from the paid venue/seat APIs.
// Never expose source seat inventories, samples, events or arbitrary venue IDs.
export function birdsNestPreview(venues){
  const venue=venues.get('birds-nest');
  if(!venue)return null;
  return {
    id:venue.id,name:venue.name,city:venue.city,
    tiers:venue.tiers.map(tier=>[...tier]),
    geometry:{shape:venue.geometry.shape,floor:[...venue.geometry.floor],tiers:venue.geometry.tiers.map(tier=>({...tier}))},
    sections:venue.sections.map(section=>({id:section.id,ticketLabels:[section.id],tier:section.tier,angle:section.angle,halfAngle:section.halfAngle,center:[...section.center],samples:[]})),
    accuracy:{position:'estimated',metricCalibrated:false,completeSeatInventory:false,sectionLabels:'synthetic-tier-labels',geometryBasis:venue.accuracy.geometryBasis},
    preview:{label:'鸟巢 · 看台参数模型',note:'分区为示意，非官方实测模型；未包含当场演出舞台。'}
  };
}
