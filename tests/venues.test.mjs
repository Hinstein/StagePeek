import test from 'node:test';
import assert from 'node:assert/strict';

test('Tottenham retains actual sampled ticket labels including global seat numbers and leading-zero sections',async()=>{
  const {loadVenues}=await import('../server/venues.mjs');const repo=loadVenues();
  const venue=repo.get('tottenham');
  assert.equal(venue.ticketLabelCount,217);
  assert.equal(venue.sections.length,187);
  const seat=repo.resolve('tottenham',{section:'122',row:'14',seat:'679'});
  assert.equal(seat.status,'matched');assert.equal(seat.seat,'679');
  assert.equal(seat.identityStatus,'source-sampled');assert.equal(seat.positionStatus,'unavailable');
  assert.equal(seat.position,null);
  assert.equal(repo.resolve('tottenham',{section:'001',row:'4',seat:'19'}).status,'matched');
});

test('unknown ticket rows and seats never fall back to synthetic or nearest real seat',async()=>{
  const {loadVenues}=await import('../server/venues.mjs');const repo=loadVenues();
  assert.equal(repo.resolve('tottenham',{section:'122',row:'14',seat:'12'}).status,'unverified');
  assert.equal(repo.resolve('tottenham',{section:'122',row:'999',seat:'679'}).status,'unverified');
  assert.equal(repo.resolve('tottenham',{section:'999',row:'14',seat:'679'}).status,'unknown-section');
  assert.equal(repo.resolve('metlife',{section:'124',row:'18',seat:'12'}).status,'unverified');
});

test('all source sample seats resolve with the same position used for rendering, while coverage stays explicit',async()=>{
  const {loadVenues}=await import('../server/venues.mjs');const repo=loadVenues();
  const venue=repo.get('tottenham');let checked=0;
  for(const section of venue.sections)for(const sample of section.samples){
    const found=repo.resolve('tottenham',{section:sample.section,row:sample.row,seat:sample.seat});
    assert.equal(found.status,'matched');assert.deepEqual(found.position,sample.position);checked++;
  }
  assert.ok(checked>500);assert.equal(venue.accuracy.completeSeatInventory,false);
  assert.equal(venue.accuracy.metricCalibrated,false);
});

test('MetLife and SoFi use official linked sample labels with prefixes, letter rows and middle/upper tiers',async()=>{
  const {loadVenues}=await import('../server/venues.mjs');const repo=loadVenues();
  const metlife=repo.get('metlife'),sofi=repo.get('sofi');
  assert.equal(metlife.sections.length,146);assert.equal(metlife.ticketLabelCount,173);
  assert.equal(sofi.sections.length,257);assert.equal(sofi.ticketLabelCount,318);
  assert.equal(repo.resolve('metlife',{section:'101',row:'14',seat:'13'}).status,'matched');
  assert.equal(repo.resolve('metlife',{section:'115CWC',row:'A',seat:'16'}).status,'matched');
  assert.equal(repo.resolve('sofi',{section:'100',row:'10',seat:'10'}).status,'matched');
  for(const [id,count] of [['metlife',602],['sofi',587]]){
    const venue=repo.get(id);let checked=0;
    for(const section of venue.sections)for(const sample of section.samples){
      const found=repo.resolve(id,sample);assert.equal(found.status,'matched');
      assert.deepEqual(found.position,sample.position);assert.equal(found.position,null);
      assert.equal(found.identityStatus,'source-sampled');assert.equal(found.positionStatus,'unavailable');checked++;
    }
    assert.equal(checked,count);assert.equal(venue.accuracy.completeSeatInventory,false);
    assert.equal(venue.accuracy.metricCalibrated,false);
    assert.equal(repo.resolve(id,{section:venue.sections[0].id,row:'9999',seat:'9999'}).status,'unverified');
  }
  assert.equal(metlife.sections.find(s=>s.id==='203A').tier,1);
  assert.equal(sofi.sections.find(s=>s.id==='504').tier,4);
  assert.ok(sofi.sections.some(s=>s.id==='C116'));
  assert.ok(sofi.sections.some(s=>s.id==='VIP218'));
  assert.ok(sofi.sections.some(s=>s.id==='OWN131'));
  assert.equal(repo.resolve('sofi',{section:'116',row:'10',seat:'10'}).status,'unknown-section');
});

test('Tottenham tier-only sections keep distinct sourced directions instead of one missing-data fallback',async()=>{
  const {loadVenues}=await import('../server/venues.mjs');const venue=loadVenues().get('tottenham');
  const suites=venue.sections.filter(s=>s.levelName==='Level 2 - Sideline Suite');
  assert.equal(suites.length,29);
  assert.equal(new Set(suites.map(s=>s.angle.toFixed(5))).size,29);
  for(const s of suites){
    assert.equal(s.positionBasis.layer,'Level200');assert.equal(s.positionBasis.camera,'Aerial_Camera_Overview');
    assert.equal(s.positionBasis.kind,'source-tier-overview');assert.equal(s.center.every(Number.isFinite),true);
  }
  const booth=venue.sections.find(s=>s.id==='900');
  assert.equal(booth.positionBasis.layer,'Level500');assert.equal(booth.tier,4);
  const known=venue.sections.find(s=>s.id==='122');
  assert.equal(known.positionBasis.layer,'FullStadium');assert.equal(known.positionBasis.kind,'source-full-overview');
  assert.equal(venue.accuracy.metricCalibrated,false);
});

test('2D source hit areas retain their camera and vertices without treating pixels as metres',async()=>{
  const {loadVenues}=await import('../server/venues.mjs');const repo=loadVenues();
  for(const id of ['tottenham','metlife','sofi']){
    const venue=repo.get(id);
    for(const section of venue.sections){
      assert.ok(section.sourcePolygons?.length,id+'/'+section.id+' missing source hit areas');
      for(const polygon of section.sourcePolygons){
        assert.ok(polygon.points.length>=3,id+'/'+section.id+' source polygon too small');
        assert.ok(polygon.points.every(p=>p.length===2&&p.every(Number.isFinite)));
      }
      assert.equal(section.positionBasis.kind.includes('source'),true);
      assert.equal(section.positionBasis.coordinateSystem,'screen-pixel-projection');
    }
    assert.equal(venue.accuracy.metricCalibrated,false);
  }
  const {readFile}=await import('node:fs/promises');
  const original=JSON.parse(await readFile(new URL('../../western-market-research/tottenham/virtual-venue-map-polygons-normalized.json',import.meta.url),'utf8')).polygons;
  const section=repo.get('tottenham').sections.find(s=>s.id==='122');
  for(const p of section.sourcePolygons){
    const source=original.find(x=>x.layer==='FullStadium'&&x.camera==='Aerial_Camera_Overview'&&x.viewId===p.viewId);
    assert.deepEqual(p.points,source.points);
  }
});
