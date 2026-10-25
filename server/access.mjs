export const VENUE_IDS=['tottenham','metlife','sofi'];
export function entitlements(db,user,now=Date.now(),venueIds=VENUE_IDS) {
  const paid=user&&db.prepare(`SELECT id FROM subscriptions WHERE user_id=?
    AND status IN ('active','trialing') AND period_end>? LIMIT 1`).get(user.id,now);
  return {plan:paid?'pro':user?'free':'guest',venueIds:paid?[...venueIds]:['tottenham'],canSave:!!user,maxSaved:paid?100:8};
}
