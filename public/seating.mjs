// Small row surfaces from source seats. Never extend a tread across an aisle
// or connect rows at different elevations. Seat XYZ itself is not adjusted.
export function sourceSeatDecks(seats){
 const rows=new Map();
 for(const seat of seats){const key=JSON.stringify([seat.section,seat.level,seat.row,seat.depth,seat.position[1]]),row=rows.get(key)||[];row.push(seat);rows.set(key,row);}
 const quads=[];
 for(const row of rows.values()){
  row.sort((a,b)=>a.seat.localeCompare(b.seat,undefined,{numeric:true}));
  for(const seat of row){
   const [x,y,z]=seat.position,w=seat.chairWidth||.46,d=Math.max(.3,Math.min(2,seat.rowDepth||.8)),yaw=seat.treadYaw;
   const along=[Math.cos(yaw),-Math.sin(yaw)],back=[Math.sin(yaw),Math.cos(yaw)];
   const p=(a,b)=>[x+a*along[0]+b*back[0],y-.025,z+a*along[1]+b*back[1]];
   quads.push([p(-w*.56,-d*.3),p(w*.56,-d*.3),p(w*.56,d*.7),p(-w*.56,d*.7)]);
  }
 }
 return quads;
}
// Compact transport: repeat venue provenance once instead of once per chair.
export const packSourceSeats=seats=>seats.map(s=>[s.section,s.row,s.seat,...s.position,s.yaw,s.treadYaw,s.chairWidth,s.rowDepth,s.level,s.depth]);
export const unpackSourceSeats=rows=>rows.map(r=>({section:r[0],row:r[1],seat:r[2],position:r.slice(3,6),yaw:r[6],treadYaw:r[7],chairWidth:r[8],rowDepth:r[9],level:r[10],depth:r[11]}));
