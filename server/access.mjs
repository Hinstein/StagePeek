export const VENUE_IDS=['tottenham','metlife','sofi'];
// The initial free tier is deliberately made from the venues with retained
// source seat assets or independently reviewed public layouts.  The list is
// a policy default; production administrators can replace it through the
// access settings endpoint without changing code.
export const DEFAULT_FREE_VENUE_IDS=[
  'kai-tak-stadium','hong-kong-coliseum','asiaworld-arena',
  'asiaworld-viva','asiaworld-summit-hall-2','asiaworld-runway-11',
  'taipei-arena','tottenham','metlife','sofi'
];
const SETTING_KEY='free_venue_ids';
const fallbackFree=['tottenham'];

function uniqueStrings(values) {
  return [...new Set((Array.isArray(values)?values:[]).filter(value=>typeof value==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)))];
}

export function normalizeFreeVenueIds(values,availableIds, {requireExactlyTen=false}={}) {
  const available=new Set(uniqueStrings(availableIds));
  const ids=uniqueStrings(values).filter(id=>available.has(id));
  if(requireExactlyTen&&ids.length!==10)throw Object.assign(new Error('Exactly 10 existing venue ids are required'),{code:'INVALID_FREE_VENUES',status:422});
  if(!ids.length)throw Object.assign(new Error('At least one existing free venue id is required'),{code:'INVALID_FREE_VENUES',status:422});
  return ids;
}

export function freeVenueIds(db,availableIds,configuredIds=DEFAULT_FREE_VENUE_IDS) {
  const available=uniqueStrings(availableIds);
  const stored=db.prepare('SELECT value FROM access_settings WHERE key=?').get(SETTING_KEY);
  if(stored){try{return normalizeFreeVenueIds(JSON.parse(stored.value),available);}catch{/* fall through to the safe configured default */}}
  const configured=uniqueStrings(configuredIds);
  const usable=configured.filter(id=>available.includes(id));
  return usable.length?usable:available.filter(id=>DEFAULT_FREE_VENUE_IDS.includes(id)).slice(0,10).length?available.filter(id=>DEFAULT_FREE_VENUE_IDS.includes(id)).slice(0,10):available.slice(0,1);
}

export function saveFreeVenueIds(db,ids,availableIds,updatedBy='',now=Date.now()) {
  const normalized=normalizeFreeVenueIds(ids,availableIds,{requireExactlyTen:true});
  db.prepare(`INSERT INTO access_settings(key,value,updated_at,updated_by) VALUES(?,?,?,?)
    ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at,updated_by=excluded.updated_by`)
    .run(SETTING_KEY,JSON.stringify(normalized),now,String(updatedBy||'').slice(0,254));
  return normalized;
}

export function entitlements(db,user,now=Date.now(),venueIds=VENUE_IDS,configuredFreeVenueIds=fallbackFree) {
  const all=uniqueStrings(venueIds);
  const free=uniqueStrings(configuredFreeVenueIds).filter(id=>all.includes(id));
  const paid=user&&db.prepare(`SELECT id FROM subscriptions WHERE user_id=?
    AND status IN ('active','trialing') AND period_end>? LIMIT 1`).get(user.id,now);
  return {plan:paid?'pro':user?'free':'guest',venueIds:paid?all:free,freeVenueIds:free,paidVenueCount:Math.max(0,all.length-free.length),canSave:!!user,maxSaved:paid?100:8};
}
