export const ticketSeatKey=seat=>JSON.stringify([seat.section,seat.row,seat.seat]);
export const ticketConflictColor='#ff6b6b';

// Draft audits describe model intersections, not ticket availability or closures.
export function ticketMapConflictIndex(draft){
 const seats=new Map();
 for(const conflict of draft?.audit.seatEnvelopeConflicts||[]){
  const key=ticketSeatKey(conflict);
  if(!seats.has(key))seats.set(key,{section:conflict.section,row:conflict.row,seat:conflict.seat,shapes:[]});
  const seat=seats.get(key);
  if(!seat.shapes.includes(conflict.shape))seat.shapes.push(conflict.shape);
 }
 return seats;
}
