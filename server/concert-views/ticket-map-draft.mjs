// Offline, repeatable ticket-map ingestion. This module cannot publish events.
import {createHash} from 'node:crypto';
export const digest=value=>createHash('sha256').update(value).digest('hex');
const point=p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite);
const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
const distance=(p,a,b)=>{
  const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy)));
  return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy);
};
const on=(p,a,b)=>Math.abs(cross(a,b,p))<1e-9&&distance(p,a,b)<1e-9;
const intersects=(a,b,c,d)=>{
  const abC=cross(a,b,c),abD=cross(a,b,d),cdA=cross(c,d,a),cdB=cross(c,d,b);
  return abC*abD<0&&cdA*cdB<0||on(a,c,d)||on(b,c,d)||on(c,a,b)||on(d,a,b);
};
export function validPolygon(poly){
  if(!Array.isArray(poly)||poly.length<3||!poly.every(point))return false;
  if(new Set(poly.map(p=>JSON.stringify(p))).size!==poly.length)return false;
  if(Math.abs(poly.reduce((sum,a,i)=>sum+a[0]*poly[(i+1)%poly.length][1]-poly[(i+1)%poly.length][0]*a[1],0))<1e-8)return false;
  for(let i=0;i<poly.length;i++)for(let j=i+1;j<poly.length;j++){
    if(j===i+1||i===0&&j===poly.length-1)continue;
    if(intersects(poly[i],poly[(i+1)%poly.length],poly[j],poly[(j+1)%poly.length]))return false;
  }
  return true;
}
export function inside(p,poly){
  let c=false;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++){
    const a=poly[i],b=poly[j];if(on(p,a,b))return true;
    if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])c=!c;
  }
  return c;
}
export const seatDigest=seats=>digest(JSON.stringify(seats.map(s=>[s.section,s.row,s.seat,s.position])));
function verifySource(source,readSource){
  if(!source?.path||!/^https:\/\//.test(source.url||'')||!source.retrievedAt||!source.rights)throw Error('Missing source provenance');
  const bytes=readSource(source.path);
  if(!/^[a-f0-9]{64}$/.test(source.sha256||'')||digest(bytes)!==source.sha256)throw Error('Source hash mismatch: '+source.path);
  return {...source,bytes:bytes.length};
}
export function buildTicketMapDraft(recipe,{venue,readSource}){
  if(!/^[a-z0-9-]+$/.test(recipe.id||''))throw Error('Invalid draft ID');
  if(!venue?.sourceSeats?.length||venue.id!==recipe.venueId||venue.seatLayout.id!==recipe.seatLayoutId)throw Error('Venue/layout binding mismatch');
  if(venue.seatLayout.assetSha256!==recipe.seatAssetSha256)throw Error('Seat asset changed; rebind the recipe');
  if(!recipe.event?.name||!recipe.event.dates?.length||!recipe.event.dates.every(d=>/^\d{4}-\d{2}-\d{2}$/.test(d)))throw Error('Missing event identity');
  const source=verifySource(recipe.source,readSource),eventSource=verifySource(recipe.eventSource,readSource);
  if(!recipe.event.bindingNote||!recipe.actor)throw Error('Missing event binding evidence or actor');
  const {matrix,width,height,rationale}=recipe.registration||{};
  if(!Array.isArray(matrix)||matrix.length!==6||!matrix.every(Number.isFinite)||Math.abs(matrix[0]*matrix[3]-matrix[1]*matrix[2])<1e-10||!(width>0&&height>0)||!rationale)throw Error('Invalid registration');
  const displayMatrix=recipe.registration.displayMatrix;
  if(displayMatrix&&(venue.id!=='twcv-the-o2-arena-london'||recipe.registration.displayFrame!=='o2-continuous-bowl'||!Array.isArray(displayMatrix)||displayMatrix.length!==6||!displayMatrix.every(Number.isFinite)||Math.abs(displayMatrix[0]*displayMatrix[3]-displayMatrix[1]*displayMatrix[2])<1e-10))throw Error('Invalid display registration');
  const transform=([x,y])=>[matrix[0]*x+matrix[1]*y+matrix[4],matrix[2]*x+matrix[3]*y+matrix[5]];
  const shapes=recipe.shapes.map(s=>{
    if(!['stage','standing','equipment','price-zone'].includes(s.kind)||!validPolygon(s.pixels)||!s.id||!s.label||!/^#[a-f0-9]{6}$/i.test(s.color)||!Number.isFinite(s.height)||s.height<=0)throw Error('Invalid shape: '+s.id);
    if(s.pixels.some(([x,y])=>x<0||x>width||y<0||y>height))throw Error('Trace exceeds source image: '+s.id);
    if((s.holes||[]).some(h=>!validPolygon(h)||h.some(p=>!inside(p,s.pixels))))throw Error('Invalid hole: '+s.id);
    if(s.displayPixels&&(!displayMatrix||!validPolygon(s.displayPixels)||s.displayPixels.some(([x,y])=>x<0||x>width||y<0||y>height)||(s.holes||[]).length))throw Error('Invalid display polygon: '+s.id);
    if(s.labelPixel&&(!displayMatrix||!point(s.labelPixel)||!inside(s.labelPixel,s.displayPixels||s.pixels)||(s.holes||[]).some(h=>inside(s.labelPixel,h))))throw Error('Invalid display label: '+s.id);
    return {...s,polygon:s.pixels.map(transform),holes:(s.holes||[]).map(h=>h.map(transform)),method:'AI-visual-trace',actor:recipe.actor,positionStatus:'estimated-registration',heightStatus:'display-estimate'};
  });
  if(!shapes.length||new Set(shapes.map(s=>s.id)).size!==shapes.length)throw Error('Missing or duplicate shapes');
  const collisions=[];
  for(const s of shapes.filter(s=>['stage','equipment'].includes(s.kind)))for(const seat of venue.sourceSeats){
    const p=[seat.position[0],seat.position[2]];
    if(seat.position[1]<=s.height+.5&&(inside(p,s.polygon)||s.polygon.some((a,i)=>distance(p,a,s.polygon[(i+1)%s.polygon.length])<.55)))collisions.push({shape:s.id,section:seat.section,row:seat.row,seat:seat.seat});
  }
  const [w,d]=venue.geometry.floor;
  const outside=shapes.flatMap(s=>s.polygon.filter(([x,z])=>Math.abs(x)>w/2||Math.abs(z)>d/2).map(p=>({shape:s.id,point:p})));
  // Never infer identity, metric calibration, section closures or review from geometry.
  const draft={schemaVersion:1,id:recipe.id,status:'research-preview',publicationStatus:'not-published',event:recipe.event,venueId:venue.id,seatLayoutId:venue.seatLayout.id,
    source,eventSource,registration:{...recipe.registration,coordinateFrame:'source-model-units',metricCalibrated:false,independentHoldoutPassed:false,allowDistances:false,allowPublication:false},
    fixedSeats:{policy:'reuse-verbatim',count:venue.sourceSeats.length,assetSha256:venue.seatLayout.assetSha256,identityPositionSha256:seatDigest(venue.sourceSeats)},
    stage:shapes.filter(s=>s.kind==='stage'),zones:shapes.filter(s=>['standing','price-zone'].includes(s.kind)),equipment:shapes.filter(s=>s.kind==='equipment'),temporarySeats:[],closedSections:null,
    audit:{finiteCoordinates:shapes.every(s=>s.polygon.flat().every(Number.isFinite)),simplePolygons:shapes.every(s=>validPolygon(s.polygon)),modelEnvelopeOutsideVertices:outside,seatEnvelopeConflicts:collisions,
      metricCalibrated:false,independentHoldoutPassed:false,blockers:['图中缺少独立区号／尺度锚点，配准尚未核实','固定看台票号沿用第三方来源，未整体独立认证',...(collisions.length?['舞台或设备与来源座位包络相交，需核对配准或实际封区']:[])],
      scope:'Checks use the source-seat-derived rectangular model envelope, not an independently surveyed building boundary.'},
    notes:recipe.notes||[]};
  return draft;
}
