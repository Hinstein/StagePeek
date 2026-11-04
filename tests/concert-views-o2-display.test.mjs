import test from 'node:test';
import assert from 'node:assert/strict';
import {loadVenues} from '../server/concert-views/venues.mjs';
import {loadRenderBatch,applyRenderBatch} from '../server/concert-views/render-batch.mjs';
import {o2DisplayModel,o2RowLabelAnchors} from '../public/concert-views/o2-display.mjs';
import {polygonIntersectsBox} from '../public/concert-views/spatial.mjs';
import {sceneCollisions} from '../public/concert-views/scene-geometry.mjs';
import {chairGeometry} from '../public/concert-views/chair-geometry.mjs';

const batch=loadRenderBatch();
const venue=applyRenderBatch(loadVenues(undefined,{includeResearch:true}).get('twcv-the-o2-arena-london','o2a'),batch);
const original=JSON.stringify(venue.sourceSeats);
const model=o2DisplayModel(venue);

test('O2 display geometry preserves every source identity without changing source XYZ',()=>{
  assert.equal(model.records.length,14389);
  assert.equal(JSON.stringify(venue.sourceSeats),original);
  for(const [i,seat] of model.records.entries()){
    assert.equal(seat.position,venue.sourceSeats[i].position);
    assert.equal(seat.section,venue.sourceSeats[i].section);
    assert.equal(seat.row,venue.sourceSeats[i].row);
    assert.equal(seat.seat,venue.sourceSeats[i].seat);
    assert.ok([...seat.p,seat.angle,seat.width].every(Number.isFinite));
    assert.equal(seat.displayBasis,'estimated-parametric');
  }
  assert.equal(o2DisplayModel({...venue,researchRenderBatch:null}),null);
});

test('lower bowl completion fills the short rows without inventing source ticket identities',()=>{
  assert.ok(model.supplements?.length>0,'the empty corner bands need illustrative chairs');
  assert.equal(model.renderRecords.length,14389+model.supplements.length+model.referenceRecords.length);
  for(const seat of model.supplements){
    assert.equal(seat.visualOnly,true);
    assert.equal(seat.sourceSeat,false);
    assert.equal(seat.level,'L1');
    assert.ok(Number(seat.section)>=101&&Number(seat.section)<=118);
    assert.equal(seat.seat,undefined);assert.equal(seat.row,undefined);assert.equal(seat.position,undefined);
  }
  for(const section of ['104','105','106','107','108','109'])for(const row of ['8','22','24']){
    assert.ok(model.renderRecords.some(s=>s.section===section&&(s.row??s.displayRow)===row),`${section}/${row} still has an empty band`);
  }
  assert.equal(JSON.stringify(venue.sourceSeats),original);
});

test('stage-side display banks mirror each other without closing the stage opening',()=>{
  for(const row of model.rows.filter(r=>r.level==='L1'))for(const [left,right]of [['118','113'],['117','114'],['116','115']]){
    const seats=id=>model.renderRecords.filter(s=>s.section===id&&(s.row??s.displayRow)===row.row).sort((a,b)=>a.p[2]-b.p[2]||Math.abs(a.p[0])-Math.abs(b.p[0]));
    const a=seats(left),b=seats(right);
    assert.equal(a.length,b.length,`${left}/${right} row ${row.row} chair counts`);
    if(Number(row.row)<9||left!=='118'&&Number(row.row)<18){assert.equal(a.length,0);continue;}
    assert.ok(a.length>0);
    for(let i=0;i<a.length;i++){
      assert.ok(Math.abs(a[i].p[0]+b[i].p[0])<1e-7);
      assert.ok(Math.abs(a[i].p[1]-b[i].p[1])<1e-7);
      assert.ok(Math.abs(a[i].p[2]-b[i].p[2])<1e-7);
    }
  }
  const stage=venue.researchRenderBatch.stage;
  for(const step of model.aisleSteps.filter(s=>s.level==='L1')){
    assert.ok(!polygonIntersectsBox(step.tread,{center:[stage.x,step.top,stage.z],size:[stage.w,.1,stage.d],angle:stage.angle||0}),'walking steps cannot cross the stage footprint');
  }
});

test('upper row surfaces end near the retained seating instead of extending empty fins',()=>{
  const rows=model.rows.filter(r=>r.level==='L4');
  assert.ok(rows.at(-1).end(rows.at(-1).radius)-rows.at(-1).start(rows.at(-1).radius)<rows[0].end(rows[0].radius)-rows[0].start(rows[0].radius));
  for(const row of rows){
    const tracks=model.records.filter(s=>s.level==='L4'&&s.row===row.row).map(s=>s.track>6?s.track-8:s.track);
    const clearance=[row.distance(Math.min(...tracks))-row.distance(row.start(row.radius)),row.distance(row.end(row.radius))-row.distance(Math.max(...tracks))];
    for(const gap of clearance)assert.ok(gap>.24&&gap<4,'the end wall clears chair edges without a long empty extension');
  }
});

test('straight-to-corner joins share position and tangent on every display row',()=>{
  for(const row of model.rows)for(let t=0;t<8;t++){
    const a=model.point(row.radius,t-1e-5,row.y),b=model.point(row.radius,t,row.y),c=model.point(row.radius,t+1e-5,row.y);
    const left=[b[0]-a[0],b[2]-a[2]],right=[c[0]-b[0],c[2]-b[2]];
    assert.ok(Math.hypot(...left)<.002&&Math.hypot(...right)<.002);
    assert.ok((left[0]*right[0]+left[1]*right[1])/Math.hypot(...left)/Math.hypot(...right)>.99999,`${row.level}/${row.row} join ${t}`);
  }
});

test('101/112 and 102/111 share mirrored display chairs and aisle boundaries on every row',()=>{
  for(const row of model.rows.filter(r=>r.level==='L1'))for(const [left,right]of [['101','112'],['102','111']]){
    const seats=id=>model.renderRecords.filter(s=>s.section===id&&(s.row??s.displayRow)===row.row).sort((a,b)=>a.p[2]-b.p[2]);
    const a=seats(left),b=seats(right);
    assert.ok(a.length>0,`${left}/${row.row} must have its illustrative row`);
    assert.equal(a.length,b.length,`${left}/${right} row ${row.row} chair counts`);
    for(let i=0;i<a.length;i++){
      assert.ok(Math.abs(a[i].p[0]+b[i].p[0])<1e-8);
      assert.ok(Math.abs(a[i].p[1]-b[i].p[1])<1e-8);
      assert.ok(Math.abs(a[i].p[2]-b[i].p[2])<1e-8);
      assert.ok(Math.abs(Math.sin(a[i].angle)+Math.sin(b[i].angle))<1e-8);
      assert.ok(Math.abs(Math.cos(a[i].angle)-Math.cos(b[i].angle))<1e-8);
      assert.equal(a[i].width,b[i].width);
    }
    const points=id=>model.guides.filter(g=>g.section===id&&g.displayRow===row.row).flatMap(g=>[...g.front,...g.back]);
    const rightPoints=new Set(points(right).map(p=>p.map(n=>n.toFixed(7)).join(',')));
    assert.ok(rightPoints.size>0,'the completed row needs a shared 2D/3D section outline');
    for(const p of points(left))assert.ok(rightPoints.has([-p[0],p[1],p[2]].map(n=>n.toFixed(7)).join(',')));
  }
});

test('all chairs sit on their own continuous row and face its inward normal',()=>{
  for(const seat of model.renderRecords){
    const row=model.rowForSeat(seat);
    assert.ok(Math.abs(seat.p[1]-row.y)<1e-8);
    assert.ok(model.contains(seat),`${seat.section}/${seat.row}/${seat.seat} unsupported`);
    const a=seat.referenceSeat?[seat.p[0]-.1,row.y,row.z]:model.point(row.radius,seat.track-1e-5,row.y),b=seat.referenceSeat?[seat.p[0]+.1,row.y,row.z]:model.point(row.radius,seat.track+1e-5,row.y);
    const tangent=[b[0]-a[0],b[2]-a[2]],front=[Math.sin(seat.angle),Math.cos(seat.angle)];
    assert.ok(Math.abs(tangent[0]*front[0]+tangent[1]*front[1])/Math.hypot(...tangent)<.001);
    assert.ok(front[0]*seat.p[0]+front[1]*seat.p[2]<0);
  }
});

test('missing seat runs do not cut the skin, and risers never connect different levels',()=>{
  for(const row of model.rows){
    assert.ok(row.treads.length>200);
    for(let i=1;i<row.treads.length;i++){
      const a=row.treads[i-1],b=row.treads[i];
      const shared=a.filter(p=>b.some(q=>p.every((n,k)=>Math.abs(n-q[k])<1e-8)));
      assert.ok(shared.length>=2||a.filter(p=>Math.abs(p[2]-row.frontBankCutZ)<1e-8).length===2&&b.filter(p=>Math.abs(p[2]-row.frontBankCutZ)<1e-8).length===2,'only the explicit front-bank opening may interrupt a bowl row');
    }
    for(const quad of row.risers){
      assert.ok(quad.flat().every(Number.isFinite));
      assert.ok(Math.max(...quad.map(p=>p[1]))-Math.min(...quad.map(p=>p[1]))<1.1);
    }
  }
});

test('display chairs remain separate within a row, including previously overlapping section joins',()=>{
  for(const row of model.rows){
    const seats=model.renderRecords.filter(s=>s.level===row.level&&(s.row??s.displayRow)===row.row).sort((a,b)=>a.track-b.track);
    for(const [i,a]of seats.entries()){
      const b=seats[(i+1)%seats.length],distance=Math.hypot(a.p[0]-b.p[0],a.p[2]-b.p[2]);
      assert.ok(distance>.49,`${a.section}/${a.row}/${a.seat} overlaps ${b.section}/${b.row}/${b.seat}`);
      if(a.level==='L1'&&a.section!==b.section)assert.ok(distance>1.14,'lower display blocks retain their walking aisles');
    }
  }
});

test('official upper banks share continuous rows across ticket boundaries and keep central aisles clear',()=>{
  assert.equal(model.upperAisles.length,22);
  assert.equal(model.records.filter(s=>s.level==='L4').length,7360);
  const previous=o2DisplayModel({...venue,researchRenderBatch:{...venue.researchRenderBatch,upperSeatRuns:undefined}});
  assert.deepEqual(model.renderRecords.filter(s=>s.level==='L1'),previous.renderRecords.filter(s=>s.level==='L1'),'accepted lower rows and all front references stay unchanged');
  for(const section of ['404','414','418']){
    const aisle=model.upperAisles.find(a=>a.section===section);
    for(const row of model.rows.filter(r=>r.level==='L4')){
      const source=venue.researchRenderBatch.upperSeatRuns[section][row.row];
      if(!source?.low.length||!source.high.length)continue;
      const records=model.records.filter(s=>s.section===section&&s.row===row.row);
      const left=records.find(s=>s.seat===source.low.at(-1)),right=records.find(s=>s.seat===source.high[0]);
      const centre=row.distance(aisle.track),lo=row.distance(left.track),hi=row.distance(right.track);
      assert.ok(Math.abs((lo+hi)/2-centre)<1e-7,'every row uses the same stair axis');
      assert.ok(hi-lo>1.29,'walking gap is not squeezed into a ticket boundary');
      if(source.gap>6){
        assert.ok(hi-lo>2.6,'the official entrance recess remains wider than the stair');
        assert.ok(!model.aisleSteps.some(s=>s.section===section&&s.row===row.row),'stairs must not bridge an entrance');
      }
    }
    assert.ok(model.aisleSteps.filter(s=>s.level==='L4'&&s.section===section).length>=7,'upper rows need their walking half steps');
  }
  const h=model.records.filter(s=>s.level==='L4'&&s.row==='8');
  for(const [left,right]of [['413','414'],['414','415'],['403','404']]){
    const a=h.filter(s=>s.section===left).toSorted((a,b)=>Number(a.seat)-Number(b.seat)).at(-1),b=h.filter(s=>s.section===right).toSorted((a,b)=>Number(a.seat)-Number(b.seat))[0];
    const d=Math.hypot(a.p[0]-b.p[0],a.p[2]-b.p[2]);
    assert.ok(d>.49&&d<.71,'a numbering boundary must not create another staircase');
  }
});

test('a one-sided upper last row stays beside its wide opening',()=>{
  const aisle=model.upperAisles.find(a=>a.section==='404');
  const row=model.rows.find(r=>r.level==='L4'&&r.row==='19');
  const seats=model.records.filter(s=>s.section==='404'&&s.row==='19');
  assert.deepEqual(seats.map(s=>s.seat).sort(),['547','548','549','550']);
  for(const seat of seats)assert.ok(row.distance(seat.track)-row.distance(aisle.track)>3.5,'the four retained chairs stay on the occupied side of the entrance');
  assert.ok(!model.aisleSteps.some(step=>step.section==='404'&&step.row==='19'),'the opening must not acquire a bridging stair');
});

test('rendered tread polygons support every chair footprint, not just its centre',()=>{
  const inside=(p,q)=>{
    const area=q.reduce((sum,a,i)=>{const b=q[(i+1)%q.length];return sum+a[0]*b[2]-a[2]*b[0];},0);
    if(Math.abs(area)<1e-12)return false;
    const crosses=q.map((a,i)=>{const b=q[(i+1)%q.length];return (b[0]-a[0])*(p[2]-a[2])-(b[2]-a[2])*(p[0]-a[0]);});
    return crosses.every(n=>n>=-1e-9)||crosses.every(n=>n<=1e-9);
  };
  for(const [i,seat]of model.renderRecords.entries()){
    const row=model.rowForSeat(seat);
    for(const point of model.footprints[i])assert.ok(row.treads.some(q=>inside(point,q)),`${seat.section}/${seat.row}/${seat.seat} overhangs its tread`);
  }
});

test('the actual display walls and risers do not cut through chair cushions or backs',()=>{
  const buckets=new Map();
  for(const seat of model.renderRecords){
    const key=`${Math.floor(seat.p[0]/2)}|${Math.floor(seat.p[2]/2)}`;
    if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(seat);
  }
  for(const face of [...model.risers,...model.walls,...model.gallery.decks,...model.gallery.fascias,...model.gallery.recesses,...model.gallery.dividers,...model.aisleSteps.flatMap(s=>[s.tread,...s.risers])]){
    const lo=[0,1,2].map(i=>Math.min(...face.map(p=>p[i]))),hi=[0,1,2].map(i=>Math.max(...face.map(p=>p[i])));
    for(let x=Math.floor((lo[0]-.5)/2);x<=Math.floor((hi[0]+.5)/2);x++)for(let z=Math.floor((lo[2]-.5)/2);z<=Math.floor((hi[2]+.5)/2);z++)for(const seat of buckets.get(`${x}|${z}`)||[]){
      if(seat.p[1]+.6<lo[1]||seat.p[1]+.22>hi[1])continue;
      for(const part of seat.chairParts.slice(0,2)){
        const box={size:[part.size[0]*seat.width,part.size[1],part.size[2]],angle:seat.angle,center:[seat.p[0]+part.center[2]*Math.sin(seat.angle),seat.p[1]+part.center[1],seat.p[2]+part.center[2]*Math.cos(seat.angle)]};
        assert.ok(!polygonIntersectsBox(face,box),`surface cuts ${seat.section}/${seat.row}/${seat.seat}`);
      }
    }
  }
});

test('illustrative completion stays clear of the research stage and inside continuous lanes',()=>{
  assert.equal(sceneCollisions(venue,'event',model.renderRecords).length,0);
  for(const row of model.rows.filter(r=>r.level==='L1')){
    assert.equal(row.completionLanes.length,14,'one bank per section, with the two wide corner transitions split by an aisle');
    const seats=model.renderRecords.filter(s=>s.level==='L1'&&(s.row??s.displayRow)===row.row&&Number(s.section)>=101&&Number(s.section)<=112);
    for(const seat of seats){
      const t=seat.track>6?seat.track-8:seat.track;
      assert.equal(row.completionLanes.filter(l=>l.section===seat.section&&t>=l.a&&t<=l.b).length,1);
    }
    for(let i=1;i<row.completionLanes.length;i++)assert.ok(row.completionLanes[i-1].b<row.completionLanes[i].a,'walking aisles remain open');
  }
});

test('completed aisle paths do not zigzag or change width at the curved joins',()=>{
  const rows=model.rows.filter(r=>r.level==='L1');
  for(let k=1;k<rows[0].completionLanes.length;k++){
    const centres=rows.map(row=>{
      const left=row.completionLanes[k-1],right=row.completionLanes[k];
      const a=row.distance(left.b),b=row.distance(right.a);
      assert.ok(b-a>.65,'the walkway must fit between chair edges');
      return model.point(row.radius,row.track((a+b)/2),row.y);
    });
    for(let i=1;i<centres.length-1;i++){
      const a=centres[i-1],b=centres[i],c=centres[i+1];
      const u=[b[0]-a[0],b[2]-a[2]],v=[c[0]-b[0],c[2]-b[2]];
      const cosine=(u[0]*v[0]+u[1]*v[1])/Math.hypot(...u)/Math.hypot(...v);
      assert.ok(cosine>Math.cos(Math.PI/180),'adjacent aisle segments turn less than one degree');
    }
  }
});

test('O2 chair size stays constant across display records and both geometry detail levels',()=>{
  assert.equal(new Set(model.renderRecords.map(s=>s.width)).size,1);
  for(const part of model.records[0].chairParts.slice(0,2)){
    const simple=chairGeometry(part),rounded=chairGeometry(part,true);
    simple.computeBoundingBox();rounded.computeBoundingBox();
    for(const end of ['min','max'])for(let axis=0;axis<3;axis++){
      assert.ok(Math.abs(simple.boundingBox[end].getComponent(axis)-rounded.boundingBox[end].getComponent(axis))<1e-6,'LOD must not make a cushion thicker or change its size');
    }
    simple.dispose();rounded.dispose();
  }
});

test('the documented AA–G bank replaces speculative fill with 508 reference seats and two aisles',()=>{
  assert.equal(model.referenceRecords.length,508);
  assert.equal(model.referenceRecords.filter(s=>s.section==='106').length,235);
  assert.equal(model.referenceRecords.filter(s=>s.section==='107').length,273);
  assert.deepEqual(model.referenceRows.map(r=>r.row),['AA','BB','CC','A','B','C','D','E','F','G']);
  for(const row of model.referenceRows){
    const seats=model.referenceRecords.filter(s=>s.row===row.row).sort((a,b)=>a.p[0]-b.p[0]);
    const gaps=seats.slice(1).map((s,i)=>s.p[0]-seats[i].p[0]);
    assert.equal(gaps.filter(g=>g>1).length,2);
    for(const gap of gaps)assert.ok(Math.abs(gap-.52)<1e-8||gap>1,'one chair size and pitch, with actual aisle separators');
    for(const seat of seats){
      assert.equal(seat.sourceSeat,false);assert.equal(seat.visualOnly,undefined);
      assert.equal(seat.position,undefined,'camera-derived placement is not a source XYZ');
      assert.equal(seat.displayBasis,'panorama-camera-estimate');
      for(const other of model.renderRecords)if(seat!==other)assert.ok(Math.hypot(...seat.p.map((n,i)=>n-other.p[i]))>.49,'new chairs cannot overlap each other or the retained bowl');
    }
  }
  assert.equal(model.supplements.filter(s=>Number(s.displayRow)<=7&&s.p[2]>26.4).length,0);
});

test('reference front rows meet the main bowl without detached illustrative corner stubs',()=>{
  const h=model.rows.find(r=>r.level==='L1'&&r.row==='8'),g=model.referenceRows.at(-1);
  assert.ok(Math.abs(model.point(h.front,2.5,h.y)[2]-g.back)<1e-7,'the G platform must meet the H riser');
  for(const row of model.rows.filter(r=>r.level==='L1'&&Number(r.row)<=7))for(const section of ['104','109']){
    const seats=model.renderRecords.filter(s=>s.section===section&&(s.row??s.displayRow)===row.row);
    assert.ok(seats.length===0||seats.length>=3||seats.some(s=>s.sourceSeat),'a clipped illustrative bank cannot leave one or two isolated chairs');
  }
  for(const row of model.rows.filter(r=>r.level==='L1'&&Number(r.row)<=7)){
    const end=Math.max(...model.renderRecords.filter(s=>s.level==='L1'&&(s.row??s.displayRow)===row.row).map(s=>s.p[2]));
    assert.ok(Math.max(...row.treads.flat().map(p=>p[2]))-end<=.401,'the capped side platform cannot extend past its remaining chairs');
  }
});

test('every official O2 stand node has either a matched source seat or a reference display seat',()=>{
  const covered=new Set();
  for(const seat of model.records){
    const mapping=venue.researchRenderBatch.seatNumbering.rows[seat.section]?.[seat.row];
    if(mapping?.label&&mapping.seats.includes(seat.seat))covered.add(`${seat.section}|${mapping.label}|${seat.seat}`);
  }
  for(const seat of model.referenceRecords)covered.add(`${seat.section}|${seat.row}|${seat.seat}`);
  const official=[];
  for(const entry of Object.values(batch.sectionReference.reference.sections))for(const seat of entry.seats){
    const match=seat.id.match(/^S_(\d+)-([A-Z]+)-(\d+)$/);
    assert.ok(match,`invalid official seat id ${seat.id}`);
    official.push(`${match[1]}|${match[2]}|${match[3]}`);
  }
  assert.equal(official.length,14719);
  assert.equal(new Set(official).size,official.length);
  assert.equal(official.filter(id=>covered.has(id)).length,14719);
});

test('near-view row labels sit in walking aisles without covering numbered chairs',()=>{
  for(const section of ['106','107','110']){
    const labels=o2RowLabelAnchors(venue,section);
    assert.equal(labels.length,section==='110'?24:27);
    assert.equal(new Set(labels.map(label=>label.row)).size,labels.length);
    if(section!=='110')assert.deepEqual(labels.slice(0,4).map(label=>label.label),['AA','BB','CC','A']);
    assert.ok(labels.some(label=>label.label==='H'));
    assert.ok(labels.some(label=>label.label==='Z'));
    for(const label of labels){
      assert.ok(label.p.every(Number.isFinite));
      const seats=model.renderRecords.filter(s=>s.level==='L1'&&String(s.row??s.displayRow)===label.row);
      const nearest=Math.min(...seats.map(s=>Math.hypot(s.p[0]-label.p[0],s.p[2]-label.p[2])));
      assert.ok(nearest>.49,`${section}/${label.label} is placed over a chair`);
      assert.ok(nearest<2,`${section}/${label.label} is detached from its row`);
      for(const guide of model.guides.filter(g=>g.level==='L1'&&String(g.displayRow??g.row)===label.row)){
        assert.ok(!polygonIntersectsBox(guide.polygon,{center:label.p,size:[.1,.02,.1],angle:0}),`${section}/${label.label} must stay outside the seating lanes`);
      }
    }
  }
  assert.deepEqual(o2RowLabelAnchors({...venue,researchRenderBatch:null},'106'),[]);
});
