import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {displaySectionLabel,sectionRenderHalfAngle,tierRowCount,tierPitch,sectionSeatCount,venueShape,venueFloor,stageRects,estimateSeatPosition,seatDragDelta} from '../public/geometry.mjs';

const venues=JSON.parse(readFileSync(new URL('../data/venues.json',import.meta.url),'utf8')).venues;

test('reference venue render span closes the gap between adjacent section anchors',()=>{
  const venue=venues['baotou-olympic-gymnasium'];
  const section=venue.sections.find(s=>s.id==='base-lower-1');
  assert.ok(section);
  const rendered=sectionRenderHalfAngle(venue,section);
  assert.ok(rendered>section.halfAngle);
  assert.ok(rendered*2>=Math.PI/6*.95);
});

test('observed venue render span preserves the measured aisle span',()=>{
  const venue=venues.tottenham;
  const section=venue.sections.find(s=>s.id==='122');
  assert.equal(sectionRenderHalfAngle(venue,section),section.halfAngle);
});

test('display labels keep source ids for lookup but make generated labels readable',()=>{
  assert.equal(displaySectionLabel({id:'base-lower-1'}),'下层 1');
  assert.equal(displaySectionLabel({id:'base-upper-12'}),'上层 12');
  assert.equal(displaySectionLabel({id:'L2-03'}),'L2-03');
  assert.equal(displaySectionLabel({id:'north-premium-suite-123456'}),'north-premium-su…');
});

test('venue profiles drive per-tier row density instead of a universal twelve rows',()=>{
  const venue=venues['ntsu-arena'];
  assert.equal(tierRowCount(venue,0),30);
  const section=venue.sections[0];
  assert.ok(sectionSeatCount(venue,section,sectionRenderHalfAngle(venue,section))>=8);
});

test('Tokyo Dome narrow source spans stay narrow after degree conversion',()=>{
  const venue=venues['tokyo-dome'];
  assert.ok(Math.max(...venue.sections.map(s=>s.halfAngle))<.1);
  assert.ok(Math.max(...venue.sections.map(s=>sectionRenderHalfAngle(venue,s)))<.2);
});

test('venue profiles carry shape and floor dimensions into the renderer',()=>{
  const venue=venues['tokyo-dome'];
  assert.equal(venueShape(venue),'baseball');
  assert.deepEqual(venueFloor(venue),venue.geometry.floor);
  assert.ok(stageRects('end',venue)[0].x>40);
});

test('synthetic row pitch is derived from the venue tier dimensions',()=>{
  const venue={tiers:[[24,32,2,16,8]]};
  const profile=tierPitch(venue,0);
  assert.equal(profile.depth,16);
  assert.equal(profile.rise,8);
  assert.ok(Math.abs(profile.pitch-Math.atan2(8,16))<1e-12);
});

test('rectangular venues get a shape-specific stage scale',()=>{
  const venue=venues['bexco-halls-1-2'];
  assert.equal(venueShape(venue),'rectangle');
  const rect=stageRects('end',venue)[0];
  assert.ok(rect.w>=12&&rect.d>=16);
});

test('Hall 5BC retains the dated 40 floor / 18 riser reference layout, not a perimeter bowl',()=>{
  const venue=venues['hkcec-hall-5bc'];
  assert.equal(venue.geometry.referenceLayout.id,'ivana-sodagreen-hkcec');
  assert.equal(venue.sections.length,58);
  assert.equal(venue.sections.filter(s=>s.block.risers).length,18);
  assert.ok(venue.sections.every(s=>s.block.polygon.length>=4));
  assert.equal(venue.accuracy.metricCalibrated,false);
  assert.equal(venue.accuracy.completeSeatInventory,false);
  const rects=stageRects('end',venue).filter(r=>!r.kind);
  assert.equal(rects.length,3);
  assert.ok(Math.abs(rects[0].z-33.6)<1e-9);
  assert.ok(Math.abs(rects[1].z+rects[1].d/2-(rects[0].z-rects[0].d/2))<1e-9);
  assert.ok(Math.abs(rects[2].z+rects[2].d/2-(rects[1].z-rects[1].d/2))<1e-9);
});

test('event stage traces replace the generic stage in the shared geometry frame',()=>{
  const venue={id:'sofi',tiers:[[91,63,3,21,12]],sections:[{id:'A',tier:0,angle:0,halfAngle:.2,positionBasis:{kind:'synthetic-geometry'}}],eventLayout:{id:'event:sofi:jay-z-30',confidence:'operator-traced',stageRects:[{x:.34,z:0,w:.18,d:.26},{x:.18,z:0,w:.3,d:.07}]}};
  const generic=stageRects('end',{...venue,eventLayout:null}),event=stageRects('event',venue);
  assert.equal(event.length,2);
  assert.notDeepEqual(event,generic);
  assert.ok(event[0].x>0&&event[0].w>0&&event[0].d>0);
  assert.ok(event.every(rect=>Math.abs(rect.x)+rect.w/2<120));
});

test('estimated seats stay inside the selected section and finger drag follows the image',()=>{
  const venue={geometry:{shape:'oval'},tiers:[[24,27,1,23,14]],sections:[{id:'A',tier:0,angle:0,halfAngle:.2,positionBasis:{kind:'synthetic-geometry'}}]};
  const section=venue.sections[0],p=estimateSeatPosition(venue,section,1,1);
  assert.equal(p.every(Number.isFinite),true);
  assert.ok(p[0]>0);
  assert.equal(estimateSeatPosition(venue,section,'B',1).every(Number.isFinite),true);
  assert.deepEqual(seatDragDelta(10,-10),{yaw:.04,pitch:-.03});
});

test('unavailable ticket rows and seats never clamp to an unrelated grid seat',()=>{
  const venue=venues.tottenham,section=venue.sections.find(s=>s.id==='122');
  for(const [row,seat] of [['0','1'],['1','0'],['999999','1'],['1','999999'],['-1','1'],['12garbage','1'],['1','12garbage'],['','1'],['1',''],['1.5','1'],['ZZZZZZZZZZ','1']]){
    assert.equal(estimateSeatPosition(venue,section,row,seat),null,`${row}/${seat} must remain unlocated`);
  }
});

test('audience distance and aiming use the current venue and the same eye/target',async()=>{
  const {audienceSightline}=await import('../public/geometry.mjs');
  // Radius=50; end-stage x=36; torso target y=3.075; eye y=3.075.
  const venue={tiers:[[30,40,0,0,0]]};
  const line=audienceSightline(venue,'end',[0,1.875,0]);
  assert.deepEqual(line.eye,[0,3.075,0]);
  assert.deepEqual(line.target,[36,3.075,0]);
  assert.equal(line.distance,36);
  assert.throws(()=>audienceSightline(null,'end',[0,0,0]),/venue/i);
});

test('zoom multiplies projected performer size instead of dividing degrees',async()=>{
  const {zoomToFov,fovToZoom}=await import('../public/geometry.mjs');
  assert.ok(Math.abs(zoomToFov(2)-32.2042275)<.00001);
  assert.ok(Math.abs(zoomToFov(8)-8.2556206)<.00001);
  assert.ok(Math.abs(fovToZoom(32.2042275)-2)<.00001);
  assert.ok(Math.abs(zoomToFov(0)-60)<.00001);
  assert.ok(Math.abs(fovToZoom(zoomToFov(100))-8)<.00001);
});

test('retained profile radii start at the front edge and radial bands do not overlap',async()=>{
  const {sectionPoint}=await import('../public/geometry.mjs');
  const v={geometry:{coordinateSystem:'profile-inner-radius',power:1},tiers:[[16,8,.3,24,10]]};
  const front={tier:0,angle:Math.PI,halfAngle:.2,radialStart:0,radialEnd:.3};
  const rear={...front,radialStart:.57,radialEnd:1};
  const p=sectionPoint(v,front,0),a=sectionPoint(v,front,1),b=sectionPoint(v,rear,0);
  assert.ok(Math.abs(p[0])<1e-10);assert.ok(Math.abs(p[2]+8)<1e-10);
  assert.ok(Math.abs(a[1]-3.3)<1e-10);assert.ok(b[1]>a[1]);
  assert.ok(Math.abs(b[2])>Math.abs(a[2]));
});

test('import keeps the theatre front/back bands and profile origin metadata',async()=>{
  const {normalizeVenueManifest}=await import('../server/venue-import.mjs');
  const v=venues['londoner-theatre'];
  const raw={...v,geometry:{...v.geometry,coordinateSystem:'profile-inner-radius'},sections:v.sections.map(s=>({...s,radialStart:0,radialEnd:.3}))};
  const result=normalizeVenueManifest(raw);
  assert.equal(result.sections[0].radialEnd,.3);
  assert.equal(result.geometry.coordinateSystem,'profile-inner-radius');
  assert.equal(result.sections[0].center[1],1.8);
});


test('each theatre riser is one row high and all treads are horizontal',async()=>{
  const {sectionSteps,sectionRowCount}=await import('../public/geometry.mjs');
  const v=venues['londoner-theatre'];
  assert.equal(v.geometry.coordinateSystem,'profile-inner-radius');
  assert.equal(v.geometry.oneSided,true);
  for(const section of v.sections){
    const steps=sectionSteps(v,section),rows=sectionRowCount(v,section);
    const height=v.tiers[section.tier][4]*((section.radialEnd??1)-(section.radialStart??0))/rows;
    for(const quad of steps.treads)assert.equal(new Set(quad.map(p=>p[1])).size,1);
    for(const quad of steps.risers)assert.ok(Math.max(...quad.map(p=>p[1]))-Math.min(...quad.map(p=>p[1]))<=Math.max(.18,height)+1e-8);
  }
});

test('theatre ticket bands remain distinct throughout the retained import pipeline',()=>{
  const v=venues['londoner-theatre'];
  const front=v.sections.find(s=>s.id==='101'),middle=v.sections.find(s=>s.id==='201'),back=v.sections.find(s=>s.id==='301');
  assert.equal(front.radialEnd,.3);assert.equal(middle.radialStart,.32);assert.equal(back.radialStart,.57);
  assert.ok(front.center[1]<middle.center[1]&&middle.center[1]<back.center[1]);
  assert.equal(stageRects('end',v)[0].z,10);
});

test('generic profile stages stay inside the inner bowl rather than under seats',()=>{
  for(const id of ['ntsu-arena','baotou-olympic-gymnasium','baotou-olympic-stadium']){
    const v=venues[id],[rx,rz]=v.tiers[0],exponent=2/(v.geometry.power||1);
    for(const layout of ['end','runway','center'])for(const rect of stageRects(layout,v)){
      for(const x of [rect.x-rect.w/2,rect.x+rect.w/2])for(const z of [rect.z-rect.d/2,rect.z+rect.d/2]){
        assert.ok((Math.abs(x)/rx)**exponent+(Math.abs(z)/rz)**exponent<1,`${id}/${layout}: stage must not intersect seating`);
      }
    }
  }
});

test('saddle treads follow local seat height across the full section width',async()=>{
  const {sectionPoint,sectionSteps,sectionRowCount}=await import('../public/geometry.mjs');
  const v=venues['philippine-arena'],s=v.sections.find(s=>s.id==='L3-02');
  const rows=sectionRowCount(v,s),half=sectionRenderHalfAngle(v,s),steps=sectionSteps(v,s);
  const slices=steps.treads.length/rows;
  for(let row=0;row<rows;row++)for(let i=0;i<slices;i++){
    const q=steps.treads[row*slices+i],a=-1+i*2/slices,b=-1+(i+1)*2/slices;
    for(const [point,lateral] of [[q[0],a],[q[1],b],[q[2],b],[q[3],a]]){
      assert.ok(Math.abs(point[1]+.035-sectionPoint(v,s,(row+.5)/rows,lateral,half)[1])<1e-8,'seat base must sit on its local tread');
    }
  }
});
