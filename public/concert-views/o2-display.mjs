import {o2ChairParts} from './spatial.mjs';
import {sourceSectionGuides,sourceAisleSteps} from './seating.mjs';
import {sourceEventDisplayDraft} from './source-event-display.mjs';

const cache=new WeakMap();
const eventCache=new WeakMap();

// Event pixels have their own diagram registration. Never move the retained
// seat coordinates or reuse the old raw-XYZ overlay on the smoothed bowl.
export function o2EventDisplayDraft(venue,draft){
  if(!draft?.registration.displayMatrix||!o2DisplayModel(venue))return sourceEventDisplayDraft(venue,draft);
  if(!eventCache.has(venue))eventCache.set(venue,new WeakMap());
  if(eventCache.get(venue).has(draft))return eventCache.get(venue).get(draft);
  const m=draft.registration.displayMatrix,s=draft.registration.matrix,det=s[0]*s[3]-s[1]*s[2];
  const pixel=([x,y])=>[m[0]*x+m[1]*y+m[4],m[2]*x+m[3]*y+m[5]];
  const transform=([x,z])=>{
    const px=(s[3]*(x-s[4])-s[1]*(z-s[5]))/det,py=(-s[2]*(x-s[4])+s[0]*(z-s[5]))/det;
    return pixel([px,py]);
  };
  const shapes=items=>items.map(shape=>{
    const polygon=shape.displayPixels?shape.displayPixels.map(pixel):shape.polygon.map(transform);
    const labelPosition=shape.labelPixel?pixel(shape.labelPixel):[0,1].map(axis=>polygon.reduce((sum,p)=>sum+p[axis],0)/polygon.length);
    return {...shape,polygon,holes:(shape.holes||[]).map(hole=>hole.map(transform)),labelPosition};
  });
  const overlay={...draft,stage:shapes(draft.stage),zones:shapes(draft.zones),equipment:shapes(draft.equipment),displayFrame:'o2-continuous-bowl'};
  // An explicitly requested illustration for this seated-block diagram only.
  // Price zones do not establish real row numbers, capacity or ticket inventory.
  overlay.floorChairs=draft.id==='o2-cody-johnson-20261027'?eventFloorChairs(overlay):[];
  eventCache.get(venue).set(draft,overlay);return overlay;
}

function eventFloorChairs(draft){
  const chairs=[];
  for(const zone of draft.zones.filter(shape=>shape.kind==='price-zone')){
    const xs=zone.polygon.map(p=>p[0]),zs=zone.polygon.map(p=>p[1]);
    const minX=Math.min(...xs),maxX=Math.max(...xs),minZ=Math.min(...zs),maxZ=Math.max(...zs);
    const columns=Math.floor((maxX-minX-1.2)/.62),rows=Math.floor((maxZ-minZ-1.2)/.88);
    for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){
      const x=(minX+maxX)/2+(col-(columns-1)/2)*.62,z=(minZ+maxZ)/2+(row-(rows-1)/2)*.88;
      // Leave a longitudinal aisle in wide blocks and a cross aisle in long ones.
      if(maxX-minX>10&&Math.abs(x-(minX+maxX)/2)<.7||maxZ-minZ>12&&Math.abs(z-(minZ+maxZ)/2)<.8)continue;
      const footprint=[[-.26,-.26],[.26,-.26],[.26,.26],[-.26,.26]].map(([dx,dz])=>[x+dx,z+dz]);
      if(!footprint.every(p=>eventPointInside(p,zone.polygon)&&!(zone.holes||[]).some(hole=>eventPointInside(p,hole))))continue;
      if([...draft.stage,...draft.equipment].some(shape=>footprint.some(p=>eventPointInside(p,shape.polygon))))continue;
      chairs.push({zoneId:zone.id,label:zone.label,p:[x,zone.height,z],angle:Math.PI,visualOnly:true,displayBasis:'illustrative-event-seating'});
    }
  }
  return chairs;
}

function eventPointInside([x,z],polygon){
  let inside=false;
  for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
    const a=polygon[i],b=polygon[j];
    if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])inside=!inside;
  }
  return inside;
}
const median=values=>values.toSorted((a,b)=>a-b)[Math.floor(values.length/2)];
// Display-only offset curves: four straight sides and four tangent quarter
// circles. Source ticket records remain immutable. Units are uncalibrated.
const coreX=6.7,coreZ=21.7;
const wrap=t=>(t%8+8)%8;
// Display surfaces use the accepted thin chair at every viewing distance.
// The raw-coordinate clearance model keeps its original conservative bounds.
const displayChairParts=o2ChairParts.map((part,i)=>i<2?{...part,size:part.size.map((n,axis)=>axis===(i?2:1)?.055:n)}:part);

export function o2DisplayModel(venue){
  if(venue.id!=='twcv-the-o2-arena-london'||venue.researchRenderBatch?.layout!=='o2a')return null;
  if(cache.has(venue))return cache.get(venue);
  const groups=new Map();
  for(const seat of venue.sourceSeats){
    const key=seat.level+'|'+seat.row;
    if(!groups.has(key))groups.set(key,{level:seat.level,row:seat.row,seats:[]});
    groups.get(key).seats.push(seat);
  }
  const rows=[...groups.values()].sort((a,b)=>a.level.localeCompare(b.level)||Number(a.row)-Number(b.row));
  const records=[],bySource=new Map(),treads=[],risers=[],walls=[],concourse=[],sectionCenters=new Map();
  for(const level of venue.sourceLevels){
    const levelRows=rows.filter(r=>r.level===level.id);
    const radii=levelRows.map(r=>median(r.seats.filter(s=>Math.abs(s.position[2])<15).map(s=>Math.abs(s.position[0]))));
    const pitch=median(radii.slice(1).map((r,i)=>(r-radii[i])/(Number(levelRows[i+1].row)-Number(levelRows[i].row))));
    const firstRadius=median(radii.map((r,i)=>r-(Number(levelRows[i].row)-1)*pitch));
    const upper=level.id==='L4';
    for(const [index,row] of levelRows.entries()){
      // The lower display bowl reserves room for one shared chair pitch and
      // continuous aisles. This is a display offset, never a source transform.
      row.radius=firstRadius+(Number(row.row)-1)*pitch+(upper?0:2.8);
      row.y=median(row.seats.map(s=>s.position[1]));
      row.front=row.radius-pitch/2;row.back=row.radius+pitch/2;
      // An explicit illustrative stage opening, not a missing-chair heuristic.
      // The rear lower rows pass behind the stage; upper seating stays open.
      const stage=venue.researchRenderBatch.stage;
      row.open=upper||row.front+15<Math.abs(stage.z)+stage.d/2+1;
      // The end of each upper row follows its occupied envelope. Using one
      // maximum for the whole tier left long empty fins behind shortened rows.
      const opening=upper?Math.max(...row.seats.map(s=>Math.abs(unwrappedTrack(s.position)-2.5)))+.035:0;
      const extent=radius=>upper?opening-2.5:Math.acos(Math.min(1,(stage.w/2+1.2-coreX)/(radius-coreX)))*2/Math.PI;
      row.start=radius=>row.open?-extent(radius):0;
      row.end=radius=>row.open?5+extent(radius):8;
      row.treads=[];row.risers=[];
      // All rows use the same angular knots, including the exact line/arc
      // joins. Boundary endpoints are shared with the next radial band.
      const knots=Array.from({length:641},(_,i)=>i/80);
      const edge=radius=>{
        const start=row.start(radius),end=row.end(radius);
        return [start,...knots.map(t=>t>6?t-8:t).filter(t=>t>start&&t<end),end].sort((a,b)=>a-b);
      };
      const cuts=row.open?[...new Set([...edge(row.front),...edge(row.back)])].sort((a,b)=>a-b):knots;
      const at=(radius,t)=>point(radius,Math.max(row.start(radius),Math.min(row.end(radius),t)),row.y);
      const previousY=index?levelRows[index-1].y:row.y-(upper?.8:row.y);
      for(let i=1;i<cuts.length;i++){
        const a=cuts[i-1],b=cuts[i],innerA=at(row.front,a),innerB=at(row.front,b),outerA=at(row.back,a),outerB=at(row.back,b);
        row.treads.push([innerA,outerA,outerB,innerB]);
        const face=[innerA,innerB,[innerB[0],previousY,innerB[2]],[innerA[0],previousY,innerA[2]]];
        face.normals=[normal(a),normal(b),normal(b),normal(a)];
        row.risers.push(face);
      }
      treads.push(...row.treads);risers.push(...row.risers);
      if(row.open)for(const t of [cuts[0],cuts.at(-1)]){
        const a=at(row.front,t),b=at(row.back,t);
        walls.push([a,b,[b[0],upper?levelRows[0].y-.8:0,b[2]],[a[0],upper?levelRows[0].y-.8:0,a[2]]]);
      }
      if(index===levelRows.length-1)for(let i=1;i<cuts.length;i++){
        const a=at(row.back,cuts[i-1]),b=at(row.back,cuts[i]);
        walls.push([a,b,[b[0],upper?levelRows[0].y-.8:0,b[2]],[a[0],upper?levelRows[0].y-.8:0,a[2]]]);
      }
      const lengths=[coreZ*2,(row.radius-coreX)*Math.PI/2,coreX*2,(row.radius-coreX)*Math.PI/2,coreZ*2,(row.radius-coreX)*Math.PI/2,coreX*2,(row.radius-coreX)*Math.PI/2];
      const starts=lengths.map((_,i)=>lengths.slice(0,i).reduce((sum,n)=>sum+n,0)),perimeter=lengths.reduce((sum,n)=>sum+n,0);
      row.distance=t=>{const u=wrap(t),i=Math.floor(u);return Math.floor(t/8)*perimeter+starts[i]+(u-i)*lengths[i];};
      row.track=distance=>{const d=(distance%perimeter+perimeter)%perimeter,i=starts.findLastIndex(n=>n<=d);return Math.floor(distance/perimeter)*8+i+(d-starts[i])/lengths[i];};
      const ordered=row.seats.map(seat=>{
        const t=trackAt(seat.position),i=Math.floor(t);
        return {seat,distance:starts[i]+(t-i)*lengths[i]};
      }).sort((a,b)=>a.distance-b.distance);
      const gaps=ordered.map((s,i)=>(ordered[(i+1)%ordered.length].distance-s.distance+perimeter)%perimeter);
      const cut=(gaps.indexOf(Math.max(...gaps))+1)%ordered.length;
      const seats=[...ordered.slice(cut),...ordered.slice(0,cut).map(s=>({...s,distance:s.distance+perimeter}))];
      // Least-squares spacing on a single row, across ticket boundaries.
      // Independent per-section projection can put two chairs on one point.
      const pools=[];let offset=0;
      for(const [i,s]of seats.entries()){
        if(i)offset+=s.seat.section===seats[i-1].seat.section ? .50 : 1.15;
        s.offset=offset;
        pools.push({first:i,last:i,sum:s.distance-offset,count:1});
        while(pools.length>1&&pools.at(-2).sum/pools.at(-2).count>pools.at(-1).sum/pools.at(-1).count){
          const b=pools.pop(),a=pools.pop();pools.push({first:a.first,last:b.last,sum:a.sum+b.sum,count:a.count+b.count});
        }
      }
      for(const pool of pools)for(let i=pool.first;i<=pool.last;i++){
        const seat=seats[i].seat,distance=((pool.sum/pool.count+seats[i].offset)%perimeter+perimeter)%perimeter;
        const segment=starts.findLastIndex(n=>n<=distance),track=segment+(distance-starts[segment])/lengths[segment];
        const p=point(row.radius,track,row.y),n=normal(track);
        bySource.set(seat,{...seat,p,angle:Math.atan2(n[0],n[2]),width:upper?seat.chairWidth/.52:.48/.52,tier:upper?1:0,track,sourceSeat:true,chairParts:displayChairParts,displayBasis:'estimated-parametric'});
      }
    }
  }
  const lowerBack=rows.filter(row=>row.level==='L1').at(-1),upperFront=rows.find(row=>row.level==='L4');
  // Two recessed gallery bands explain the inter-tier space. Their dimensions
  // are illustrative; these are architectural surfaces, not extra seat tiers.
  const gallery={basis:'estimated-architecture',decks:[],fascias:[],recesses:[],dividers:[]};
  const ceiling=upperFront.y-.8,storey=(ceiling-lowerBack.y)/2;
  for(const [i,face]of upperFront.risers.entries()){
    const a=face[2],b=face[3],ta=trackAt(a),tb=trackAt(b);
    const c=point(lowerBack.back,ta,lowerBack.y),d=point(lowerBack.back,tb,lowerBack.y);
    concourse.push([c,d,[b[0],lowerBack.y,b[2]],[a[0],lowerBack.y,a[2]]]);
    for(let level=0;level<2;level++){
      const y=lowerBack.y+level*storey,front=Math.max(upperFront.front-2.1,lowerBack.back+.7)+level*.7,back=upperFront.front+1.4;
      const band=(radius,lo,hi)=>{
        const q=[point(radius,ta,lo),point(radius,tb,lo),point(radius,tb,hi),point(radius,ta,hi)];
        q.normals=[normal(ta),normal(tb),normal(tb),normal(ta)];return q;
      };
      gallery.decks.push([point(front,ta,y),point(back,ta,y),point(back,tb,y),point(front,tb,y)]);
      gallery.decks.push([point(front-.07,ta,y+.78),point(front+.07,ta,y+.78),point(front+.07,tb,y+.78),point(front-.07,tb,y+.78)]);
      gallery.fascias.push(band(front,y-.18,y+.74));
      gallery.recesses.push(band(back,y+.05,y+storey-.16));
      if(i%10===0)gallery.dividers.push([point(front,ta,y+.74),point(back,ta,y+.74),point(back,ta,y+storey-.16),point(front,ta,y+storey-.16)]);
    }
  }
  for(const source of venue.sourceSeats)records.push(bySource.get(source));
  const upper=regulariseUpperRows(rows.filter(row=>row.level==='L4'),records,venue.researchRenderBatch.upperSeatRuns);
  const lowerRows=rows.filter(row=>row.level==='L1');
  const completion={supplements:layoutLowerRows(lowerRows,records),...completionSurfaces(lowerRows)};
  const stageBanks=layoutStageRows(lowerRows,records);
  completion.supplements.push(...stageBanks.supplements);
  completion.guides.push(...stageBanks.guides);completion.steps.push(...stageBanks.steps);
  const front=referenceFrontBank(venue.researchRenderBatch.frontReference,lowerRows[7]);
  if(front.records.length){
    // The official AA–G bank occupies this area. The former uniform bowl fill
    // consisted entirely of illustrative chairs; no source seats are removed.
    completion.supplements=completion.supplements.filter(s=>Number(s.displayRow)>7||s.p[2]<26.4);
    for(const row of lowerRows.filter(row=>Number(row.row)<=7)){
      const retained=[...records,...completion.supplements].filter(s=>s.level==='L1'&&(s.row??s.displayRow)===row.row);
      row.frontBankCutZ=Math.max(...retained.map(s=>s.p[2]))+.4;
      row.treads=row.treads.map(q=>clipFront(q,row.frontBankCutZ)).filter(q=>q.length>=3);
      row.risers=row.risers.map(q=>clipFront(q,row.frontBankCutZ)).filter(q=>q.length>=3);
    }
    treads.splice(0,treads.length,...rows.flatMap(row=>row.treads));
    risers.splice(0,risers.length,...rows.flatMap(row=>row.risers));
    completion.guides=completion.guides.filter(g=>Number(g.displayRow)>7||g.polygon.some(p=>p[2]<=26.4)).map(g=>{
      if(Number(g.displayRow)>7)return g;
      const cut=lowerRows.find(row=>row.row===g.displayRow).frontBankCutZ;
      return {...g,polygon:clipFront(g.polygon,cut),edges:g.edges.map(q=>clipFront(q,cut)).filter(q=>q.length>=2)};
    });
    completion.steps=completion.steps.filter(s=>{
      if(s.top>=lowerRows[7].y)return true;
      const i=lowerRows.findIndex(row=>row.y>=s.top),cut=Math.min(lowerRows[i].frontBankCutZ??Infinity,lowerRows[i-1]?.frontBankCutZ??Infinity);
      return s.tread.every(p=>p[2]<cut);
    });
    for(const row of lowerRows.filter(row=>Number(row.row)<=7))for(const q of row.treads){
      const edge=q.filter(p=>Math.abs(p[2]-row.frontBankCutZ)<1e-8);
      if(edge.length===2)walls.push([edge[0],edge[1],[edge[1][0],0,row.frontBankCutZ],[edge[0][0],0,row.frontBankCutZ]]);
    }
    treads.push(...front.rows.flatMap(row=>row.treads));risers.push(...front.rows.flatMap(row=>row.risers));walls.push(...front.walls);
  }
  const renderRecords=[...records,...completion.supplements,...front.records];
  for(const section of venue.sections){
    const seats=renderRecords.filter(r=>r.section===section.id);
    sectionCenters.set(section.id,[0,1,2].map(axis=>seats.reduce((sum,r)=>sum+r.p[axis],0)/seats.length));
  }
  const footprints=renderRecords.map(seat=>{
    const width=o2ChairParts[0].size[0]*seat.width/2,depth=.215,c=Math.cos(seat.angle),s=Math.sin(seat.angle);
    return [[-1,-1],[1,-1],[1,1],[-1,1]].map(([x,z])=>[seat.p[0]+x*width*c+z*depth*s,seat.p[1]+.01,seat.p[2]-x*width*s+z*depth*c]);
  });
  const seats=records.map(r=>({...r,position:r.p}));
  const model={basis:'estimated-parametric',rows,referenceRows:front.rows,referenceRecords:front.records,records,renderRecords,supplements:completion.supplements,seats,treads,risers,walls,concourse,gallery,footprints,sectionCenters,point,
    rowForSeat:seat=>seat.referenceSeat?front.rows.find(row=>row.row===seat.row):groups.get(seat.level+'|'+(seat.row??seat.displayRow)),
    upperAisles:upper.aisles,
    guides:[...sourceSectionGuides(seats,'o2a').filter(g=>g.level==='L4'&&!upper.aisles.length),...completion.guides,...front.guides,...upper.guides],
    aisleSteps:[...sourceAisleSteps(seats,'o2a').filter(s=>s.level==='L4'&&!upper.aisles.length),...completion.steps,...upper.steps],
    contains:seat=>{
      if(seat.referenceSeat){const row=front.rows.find(row=>row.row===seat.row);return Math.abs(seat.p[2]-row.z)<.001&&seat.p[0]>=row.left&&seat.p[0]<=row.right;}
      const row=groups.get(seat.level+'|'+(seat.row??seat.displayRow)),t=row.open?unwrappedTrack(seat.p):seat.track;
      return t>=row.start(row.radius)-1e-6&&t<=row.end(row.radius)+1e-6&&(row.frontBankCutZ===undefined||seat.p[2]<=row.frontBankCutZ);
    },
    position:sourcePosition=>records.find(r=>r.position===sourcePosition||r.position.every((n,i)=>Math.abs(n-sourcePosition[i])<1e-6))?.p||null
  };
  cache.set(venue,model);return model;
}

// Official section maps distinguish the central stair/entrance from a ticket
// boundary. Fit one stair axis per section across all rows, then lay unchanged
// ticket records on either side. Only display positions are regularised.
function regulariseUpperRows(rows,records,topology){
  const guides=[],steps=[];
  if(!topology)return {guides,steps,aisles:[]};
  const lookup=new Map(records.filter(s=>s.level==='L4').map(s=>[`${s.section}|${s.row}|${s.seat}`,s]));
  const aisles=Object.entries(topology).map(([section,source])=>{
    const samples=rows.filter(r=>Number(r.row)>=8&&source[r.row]?.low.length&&source[r.row].high.length&&source[r.row].gap<6);
    const track=median(samples.map(r=>{
      const a=lookup.get(`${section}|${r.row}|${source[r.row].low.at(-1)}`),b=lookup.get(`${section}|${r.row}|${source[r.row].high[0]}`);
      return (unwrappedTrack(a.p)+unwrappedTrack(b.p))/2;
    }));
    const bands=rows.map(row=>{
      const raw=source[row.row];
      if(!raw)return {row,seats:[]};
      // Preserve the broad entrance recesses, but normalise walking stairs to
      // a consistent width. Map units are not calibrated building dimensions.
      const gap=raw.gap?Math.max(1.3,raw.gap*.4):1.5;
      return {row,gap,seats:[...raw.low.map((seat,i)=>({seat:lookup.get(`${section}|${row.row}|${seat}`),offset:-gap/2-(raw.low.length-1-i)*.5,side:0})),...raw.high.map((seat,i)=>({seat:lookup.get(`${section}|${row.row}|${seat}`),offset:gap/2+i*.5,side:1}))]};
    });
    return {section,track,bands};
  });
  // A single axis serves every row. Project the minimum chair spacing across
  // neighbouring banks, never move one row's stair independently of the rest.
  for(let pass=0;pass<800;pass++){
    let error=0;
    for(const row of pass%2?rows.toReversed():rows){
      const active=aisles.filter(a=>a.bands.find(b=>b.row===row).seats.length);
      const shift=(a,d)=>{a.track=row.track(row.distance(a.track)+d);};
      for(const [i,a]of active.entries()){
        const band=a.bands.find(b=>b.row===row),start=row.distance(a.track)+band.seats[0].offset,end=row.distance(a.track)+band.seats.at(-1).offset;
        if(i===0){const d=row.distance(row.start(row.radius))+.3-start;if(d>0){shift(a,d);error=Math.max(error,d);}}
        if(i===active.length-1){const d=end-row.distance(row.end(row.radius))+.3;if(d>0){shift(a,-d);error=Math.max(error,d);}}
        if(!i)continue;
        const before=active[i-1],previous=before.bands.find(b=>b.row===row),d=row.distance(before.track)+previous.seats.at(-1).offset+.5-row.distance(a.track)-band.seats[0].offset;
        if(d>0){shift(before,-d/2);shift(a,d/2);error=Math.max(error,d);}
      }
    }
    if(error<1e-8)break;
    if(pass===799)throw new Error('O2 upper rows cannot fit their retained seats');
  }
  for(const row of rows){
    row.upperLanes=[];
    const banks=aisles.flatMap(aisle=>{
      const band=aisle.bands.find(b=>b.row===row);
      for(const item of band.seats)item.distance=row.distance(aisle.track)+item.offset;
      return [0,1].map(side=>({section:aisle.section,side,seats:band.seats.filter(s=>s.side===side)}));
    });
    // Two ticket zones may occupy one physical bank. Join only adjacent
    // source runs; large source voids remain architectural openings.
    for(let k=1;k<banks.length-1;k+=2){
      const a=banks[k].seats,b=banks[k+1].seats;
      if(!a.length||!b.length)continue;
      const left=a.at(-1).seat.position,right=b[0].seat.position,seats=[...a,...b];
      const pitch=(seats.at(-1).distance-seats[0].distance)/(seats.length-1);
      if(Math.hypot(left[0]-right[0],left[2]-right[2])>1.4||pitch>.7)continue;
      const start=seats[0].distance;
      for(const [i,item]of seats.entries())item.distance=start+i*pitch;
    }
    for(const bank of banks){
      if(!bank.seats.length)continue;
      for(const item of bank.seats){
        const track=row.track(item.distance),n=normal(track);
        Object.assign(item.seat,{p:point(row.radius,track,row.y),track:wrap(track),angle:Math.atan2(n[0],n[2])});
      }
      const a=row.track(bank.seats[0].distance-.24),b=row.track(bank.seats.at(-1).distance+.24),count=Math.max(2,Math.ceil((b-a)*80));
      const edge=radius=>Array.from({length:count+1},(_,i)=>point(radius,a+(b-a)*i/count,row.y+.018));
      const front=edge(row.front),back=edge(row.back);
      row.upperLanes.push({section:bank.section,side:bank.side,a,b});
      guides.push({section:bank.section,level:'L4',row:row.row,y:row.y,front,back,polygon:[...front,...back.toReversed()],edges:[[front[0],back[0]],[front.at(-1),back.at(-1)]]});
    }
  }
  for(const aisle of aisles)for(let i=1;i<rows.length;i++){
    const lower=rows[i-1],row=rows[i],a=aisle.bands[i-1],b=aisle.bands[i];
    if(!a.seats.length||!b.seats.length||a.gap>2.6||b.gap>2.6)continue;
    // Half steps follow the same fixed stair axis. Entrances receive no steps.
    const top=(lower.y+row.y)/2,bottom=lower.y+.004;
    const corners=radius=>{
      const p=point(radius,aisle.track,top),n=normal(aisle.track);
      return [-1,1].map(side=>[p[0]+side*n[2]*.32,top,p[2]-side*n[0]*.32]);
    };
    const front=corners(lower.radius+.03),back=corners(row.front),tread=[front[0],front[1],back[1],back[0]];
    steps.push({level:'L4',section:aisle.section,row:row.row,top,bottom,tread,risers:tread.map((p,j)=>{const q=tread[(j+1)%4];return [p,q,[q[0],bottom,q[2]],[p[0],bottom,p[2]]];})});
  }
  return {guides,steps,aisles:aisles.map(a=>({section:a.section,track:a.track}))};
}

export function o2RowLabelAnchors(venue,section){
  const model=o2DisplayModel(venue);
  if(!model||!venue.researchRenderBatch.seatNumbering)return [];
  const aliases=venue.researchRenderBatch.seatNumbering.rows[section]||{},rows=new Map(),labels=[];
  for(const guide of model.guides.filter(g=>g.section===section)){
    const row=String(guide.displayRow??guide.row);
    if(!rows.has(row))rows.set(row,[]);
    rows.get(row).push(guide);
  }
  for(const [row,guides] of [...rows].sort((a,b)=>a[1][0].y-b[1][0].y)){
    // Only the two lateral edges bound aisles. The extra front/back edges
    // close a section outline and would put a label across the first row.
    const edges=model.guides.filter(g=>g.level===guides[0].level&&String(g.displayRow??g.row)===row).flatMap(guide=>{
      if(guide.edges.length<2)return []; // The reference bank clips some former bowl edges away.
      const sides=guide.edges.slice(0,2).map(edge=>edge[0].map((n,i)=>(n+edge[1][i])/2));
      return sides.map((p,i)=>({guide,p,out:[p[0]-sides[1-i][0],p[2]-sides[1-i][2]]}));
    });
    const candidates=[];
    for(const a of edges.filter(e=>e.guide.section===section)){
      const nearest=edges.filter(b=>b.guide!==a.guide&&
        (b.p[0]-a.p[0])*a.out[0]+(b.p[2]-a.p[2])*a.out[1]>=0&&
        (a.p[0]-b.p[0])*b.out[0]+(a.p[2]-b.p[2])*b.out[1]>=0)
        .map(b=>({b,d:Math.hypot(a.p[0]-b.p[0],a.p[2]-b.p[2])})).sort((a,b)=>a.d-b.d)[0];
      // Touching runs are ticket boundaries, not walking aisles (106/107).
      if(!nearest||nearest.d<.25||nearest.d>3)continue;
      candidates.push({internal:nearest.b.guide.section===section,p:a.p.map((n,i)=>(n+nearest.b.p[i])/2)});
    }
    if(!candidates.length)continue;
    const previous=labels.at(-1)?.p||model.sectionCenters.get(section);
    candidates.sort((a,b)=>Number(b.internal)-Number(a.internal)||Math.hypot(a.p[0]-previous[0],a.p[2]-previous[2])-Math.hypot(b.p[0]-previous[0],b.p[2]-previous[2]));
    labels.push({section,row,label:aliases[row]?.label||row,p:candidates[0].p});
  }
  return labels;
}

// Panorama camera centres give a row layout, not surveyed chair bases. Keep
// their numbered references separate, subtract the measured model eye offset,
// and regularise pitch within each documented run without shrinking chairs.
function referenceFrontBank(reference,mainRow){
  const records=[],rows=[],guides=[],walls=[];
  if(!reference)return {records,rows,guides,walls};
  // Match the display bowl, which reserves extra radius for its common pitch.
  // Camera metadata stays untouched; only this estimated display bank moves.
  const offset=point(mainRow.front,2.5,mainRow.y)[2]-median(reference.rows.at(-1).seats.map(s=>s.camera[0]))-.41;
  for(const [index,raw]of reference.rows.entries()){
    const y=median(raw.seats.map(s=>s.camera[1]))-reference.estimate.eyeOffset,z=median(raw.seats.map(s=>s.camera[0]))+offset;
    const byId=new Map(raw.seats.map(s=>[s.id,s])),runs=[];
    for(const ordered of raw.runs){
      let run=[];
      for(const id of [...ordered,null]){
        if(id!==null){run.push(byId.get(id));continue;}
        if(run.length)runs.push(run.sort((a,b)=>b.camera[2]-a.camera[2]));
        run=[];
      }
    }
    runs.sort((a,b)=>b[0].camera[2]-a[0].camera[2]);
    // Section 106/107 is a ticket boundary, not a third physical aisle.
    for(let i=runs.length-1;i>0;i--)if(-runs[i][0].camera[2]+runs[i-1].at(-1).camera[2]<.8)runs.splice(i-1,2,[...runs[i-1],...runs[i]]);
    const rowRecords=[];
    for(const run of runs){
      const centre=run.reduce((sum,s)=>sum-s.camera[2],0)/run.length;
      for(const [i,seat]of run.entries())rowRecords.push({section:seat.section,row:raw.label,seat:seat.seat,referenceId:seat.id,referenceSeat:true,sourceSeat:false,level:'L1',tier:0,p:[centre+(i-(run.length-1)/2)*.52,y,z],angle:Math.PI,width:.48/.52,chairParts:displayChairParts,displayBasis:'panorama-camera-estimate'});
    }
    const left=Math.min(...rowRecords.map(s=>s.p[0]))-.3,right=Math.max(...rowRecords.map(s=>s.p[0]))+.3;
    const front=z-.41,back=z+.41,quad=[[left,y,front],[left,y,back],[right,y,back],[right,y,front]];
    const bottom=index?rows[index-1].y:0;
    const row={level:'L1',row:raw.label,y,z,left,right,front,back,treads:[quad],risers:[[[left,y,front],[right,y,front],[right,bottom,front],[left,bottom,front]]]};
    rows.push(row);records.push(...rowRecords);
    walls.push([[left,y,front],[left,y,back],[left,0,back],[left,0,front]],[[right,y,back],[right,y,front],[right,0,front],[right,0,back]]);
    for(const run of raw.runs){
      let ids=[];
      for(const id of [...run,null]){
        if(id!==null){ids.push(id);continue;}
        if(!ids.length)continue;
        const seats=rowRecords.filter(s=>ids.includes(s.referenceId)),a=Math.min(...seats.map(s=>s.p[0]))-.26,b=Math.max(...seats.map(s=>s.p[0]))+.26;
        const frontEdge=[[a,y+.018,front],[b,y+.018,front]],backEdge=[[a,y+.018,back],[b,y+.018,back]];
        guides.push({section:seats[0].section,level:'L1',displayRow:raw.label,referenceRow:true,y,front:frontEdge,back:backEdge,polygon:[...frontEdge,...backEdge.toReversed()],edges:[[frontEdge[0],backEdge[0]],[frontEdge[1],backEdge[1]]]});
        ids=[];
      }
    }
  }
  return {records,rows,guides,walls};
}

function clipFront(polygon,z){
  if(polygon.every(p=>p[2]<=z))return polygon;
  const result=[];
  for(const [i,a]of polygon.entries()){
    const b=polygon[(i+1)%polygon.length],inside=a[2]<=z,next=b[2]<=z;
    if(inside)result.push(a);
    if(inside!==next){const t=(z-a[2])/(b[2]-a[2]);result.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,z]);}
  }
  return result;
}

// A single symmetric bank layout owns the lower sides and rear. Bank widths
// vary linearly with row depth; gaps and chair pitch are shared across banks.
// Ticket counts bound capacity, but never create holes in the supporting skin.
function layoutLowerRows(rows,records){
  const pitch=.5,aisle=1.15,sections=Array.from({length:12},(_,i)=>String(101+i));
  const grouped=rows.map(row=>sections.map(section=>records.filter(s=>s.level==='L1'&&s.row===row.row&&s.section===section).sort((a,b)=>unwrappedTrack(a.p)-unwrappedTrack(b.p))));
  const fits=sections.slice(0,6).map((_,k)=>{
    const lanes=k===2?2:1;
    const needs=rows.map((row,i)=>({x:Number(row.row)-1,y:Math.max(1,(Math.ceil(Math.max(grouped[i][k].length,grouped[i][11-k].length)/lanes)-1)*pitch*lanes+(lanes-1)*aisle)}));
    const slopes=[0,...needs.flatMap((a,i)=>needs.slice(i+1).map(b=>(b.y-a.y)/(b.x-a.x)))].filter(s=>s>=0);
    return slopes.map(slope=>({slope,base:Math.max(...needs.map(n=>n.y-slope*n.x))})).sort((a,b)=>a.base+12*a.slope-b.base-12*b.slope)[0];
  });
  const supplements=[];
  for(const [i,row]of rows.entries()){
    const start=row.distance(-.11),rearStart=row.distance(.733),rearEnd=row.distance(4.267);
    const widths=sections.map((_,k)=>{const f=fits[Math.min(k,11-k)];return f.base+f.slope*(Number(row.row)-1);});
    const sideSpare=rearStart-start-widths[0]-widths[1]-2*aisle;
    const rearSpare=rearEnd-rearStart-7*aisle-widths.slice(2,10).reduce((sum,width)=>sum+width,0);
    if(Math.min(sideSpare,rearSpare)<0)throw new Error(`O2 lower row ${row.row} cannot fit its display banks`);
    for(let k=0;k<12;k++)widths[k]+=k<2||k>9?sideSpare/2:rearSpare/8;
    row.completionLanes=[];
    let cursor=start;
    for(const [k,section]of sections.entries()){
      const lanes=Math.min(k,11-k)===2?2:1,width=widths[k],span=(width-(lanes-1)*aisle)/lanes;
      // Paired banks have identical counts, endpoints, and tangent directions.
      const count=Math.floor((span+1e-8)/pitch)+1,slots=[];
      for(let lane=0;lane<lanes;lane++){
        const a=cursor+lane*(span+aisle),b=a+span;
        row.completionLanes.push({section,a:row.track(a-.24),b:row.track(b+.24)});
        for(let n=0;n<count;n++)slots.push(a+(count===1?span/2:span*n/(count-1)));
      }
      const source=grouped[i][k],assigned=new Map();
      if(source.length>slots.length)throw new Error('O2 lower display capacity lost a source ticket');
      const retained=Number(row.row)<=7?slots.filter(d=>point(row.radius,row.track(d),row.y)[2]<26.4):slots;
      // A cutoff through a missing bank used to leave one or two invented
      // chairs on a tiny platform. Keep source chairs, not these display stubs.
      const available=!source.length&&retained.length<3?[]:retained;
      if(!available.length)for(const lane of row.completionLanes.slice(-lanes))lane.active=false;
      if(source.length>available.length)throw new Error(`O2 lower row ${row.row}/${section} overlaps the front bank`);
      for(const [n,seat]of source.entries())assigned.set(source.length===1?Math.floor((available.length-1)/2):Math.round(n*(available.length-1)/(source.length-1)),seat);
      for(const [n,distance]of available.entries()){
        const track=wrap(row.track(distance)),direction=normal(track),shape={p:point(row.radius,track,row.y),angle:Math.atan2(direction[0],direction[2]),track,width:.48/.52};
        const source=assigned.get(n);
        if(source){Object.assign(source,shape);continue;}
        supplements.push({...shape,section,level:'L1',displayRow:row.row,tier:0,chairParts:displayChairParts,sourceSeat:false,visualOnly:true,displayBasis:'estimated-completion'});
      }
      cursor+=width+aisle;
    }
  }
  return supplements;
}

// Stage-side banks share the same mirrored envelope. The rear banks start at
// their documented first occupied row; empty space in front stays open.
function layoutStageRows(rows,records){
  const sections=['113','114','115','116','117','118'],pitch=.5,aisle=1.15;
  const stageRows=rows.filter(row=>Number(row.row)>=9).map(row=>({...row}));
  const grouped=stageRows.map(row=>sections.map(section=>records.filter(s=>s.section===section&&s.row===row.row).sort((a,b)=>a.track-b.track)));
  const weights=sections.map((_,k)=>Math.max(...grouped.map(groups=>Math.max(groups[k].length,groups[5-k].length)))-1);
  const supplements=[];
  for(const [i,row]of stageRows.entries()){
    const start=row.distance(row.completionLanes.at(-1).b)+.95,end=row.distance(row.completionLanes[0].a+8)-.95;
    const usable=end-start-5*aisle,edgeWidth=Math.max(weights[0]*pitch,usable*weights[0]/weights.reduce((sum,n)=>sum+n,0));
    const widths=weights.map((weight,k)=>k===0||k===5?edgeWidth:(usable-2*edgeWidth)*weight/(weights[1]+weights[2]+weights[3]+weights[4]));
    row.completionLanes=[];
    let cursor=start;
    for(const [k,section]of sections.entries()){
      const width=widths[k],count=Math.floor((width+1e-8)/pitch)+1;
      const active=k===0||k===5||Number(row.row)>=18;
      const slots=Array.from({length:count},(_,n)=>cursor+width*n/(count-1)).filter(d=>{
        if(!row.open)return true;
        const t=unwrappedTrack(point(row.radius,row.track(d),row.y));
        return t>row.start(row.front)+.015&&t<row.end(row.front)-.015;
      });
      row.completionLanes.push({section,a:row.track(cursor-.24),b:row.track(cursor+width+.24),active});
      const source=grouped[i][k],assigned=new Map();
      if(source.length>slots.length)throw new Error(`O2 stage row ${row.row}/${section} lost a source chair`);
      for(const [n,seat]of source.entries())assigned.set(source.length===1?Math.floor((slots.length-1)/2):Math.round(n*(slots.length-1)/(source.length-1)),seat);
      if(active)for(const [n,d]of slots.entries()){
        const track=wrap(row.track(d)),direction=normal(track),shape={p:point(row.radius,track,row.y),angle:Math.atan2(direction[0],direction[2]),track,width:.48/.52};
        const source=assigned.get(n);
        if(source){Object.assign(source,shape);continue;}
        supplements.push({...shape,section,level:'L1',displayRow:row.row,tier:0,chairParts:displayChairParts,sourceSeat:false,visualOnly:true,displayBasis:'estimated-completion'});
      }
      cursor+=width+aisle;
    }
  }
  return {supplements,...completionSurfaces(stageRows)};
}

function completionSurfaces(rows){
  const guides=[],steps=[];
  for(const [i,row]of rows.entries())for(const [k,lane]of row.completionLanes.entries()){
    if(lane.active===false)continue;
    const before=rows[i-1]?.completionLanes[k],after=rows[i+1]?.completionLanes[k];
    const edge=(radius,other)=>{
      const a=other?(other.a+lane.a)/2:lane.a,b=other?(other.b+lane.b)/2:lane.b;
      const count=Math.max(2,Math.ceil((b-a)*80-1e-9));
      return Array.from({length:count+1},(_,n)=>point(radius,a+(b-a)*n/count,row.y+.018));
    };
    const front=edge(row.front,before),back=edge(row.back,after);
    guides.push({section:lane.section,level:'L1',displayRow:row.row,y:row.y,front,back,polygon:[...front,...back.toReversed()],edges:[[front[0],back[0]],[front.at(-1),back.at(-1)],...i===0?[front]:[],...i===rows.length-1?[back]:[]]});
    if(!i||!k||before.active===false||row.completionLanes[k-1].active===false)continue;
    const lower=rows[i-1],left=row.completionLanes[k-1],lowerLeft=lower.completionLanes[k-1],lowerRight=lower.completionLanes[k];
    const t=(left.b+lane.a)/2,previousT=(lowerLeft.b+lowerRight.a)/2;
    const top=(lower.y+row.y)/2,bottom=lower.y+.004;
    const corners=(radius,track)=>{
      const centre=point(radius,track,top),n=normal(track);
      return [-1,1].map(side=>[centre[0]+side*n[2]*.32,top,centre[2]-side*n[0]*.32]);
    };
    const a=corners(lower.radius+.03,previousT),b=corners(row.front,(previousT+t)/2),tread=[a[0],a[1],b[1],b[0]];
    steps.push({level:'L1',top,bottom,tread,risers:tread.map((a,j)=>{const b=tread[(j+1)%4];return [a,b,[b[0],bottom,b[2]],[a[0],bottom,a[2]]];})});
  }
  return {guides,steps};
}

function point(radius,track,y){
  const t=wrap(track),segment=Math.floor(t),u=t-segment,arc=radius-coreX,a=u*Math.PI/2;
  if(segment===0)return [-radius,y,-coreZ+2*coreZ*u];
  if(segment===1)return [-coreX-arc*Math.cos(a),y,coreZ+arc*Math.sin(a)];
  if(segment===2)return [-coreX+2*coreX*u,y,coreZ+arc];
  if(segment===3)return [coreX+arc*Math.sin(a),y,coreZ+arc*Math.cos(a)];
  if(segment===4)return [radius,y,coreZ-2*coreZ*u];
  if(segment===5)return [coreX+arc*Math.cos(a),y,-coreZ-arc*Math.sin(a)];
  if(segment===6)return [coreX-2*coreX*u,y,-coreZ-arc];
  return [-coreX-arc*Math.sin(a),y,-coreZ-arc*Math.cos(a)];
}

function normal(track){
  const t=wrap(track),segment=Math.floor(t),a=(t-segment)*Math.PI/2;
  if(segment===0)return [1,0,0];
  if(segment===1)return [Math.cos(a),0,-Math.sin(a)];
  if(segment===2)return [0,0,-1];
  if(segment===3)return [-Math.sin(a),0,-Math.cos(a)];
  if(segment===4)return [-1,0,0];
  if(segment===5)return [-Math.cos(a),0,Math.sin(a)];
  if(segment===6)return [0,0,1];
  return [Math.sin(a),0,Math.cos(a)];
}

function trackAt([x,,z]){
  if(Math.abs(z)<=coreZ)return x<0?(z+coreZ)/(2*coreZ):4+(coreZ-z)/(2*coreZ);
  if(Math.abs(x)<=coreX)return z>0?2+(x+coreX)/(2*coreX):6+(coreX-x)/(2*coreX);
  const a=Math.atan2(Math.abs(z)-coreZ,Math.abs(x)-coreX)*2/Math.PI;
  if(z>0)return x<0?1+a:4-a;
  return x>0?5+a:8-a;
}

function unwrappedTrack(position){const t=trackAt(position);return t>6?t-8:t;}
