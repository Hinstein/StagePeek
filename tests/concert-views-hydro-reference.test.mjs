import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,copyFileSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
import {loadHydroReference} from '../server/concert-views/hydro-reference.mjs';

const relative='data/research-global/2026-10-26/hydro-meo-supplement';
test('Hydro loader refuses altered placement or an author-inferred identity even with a valid row capacity',()=>{
 const root=mkdtempSync(resolve(tmpdir(),'hydro-anchors-'));
 const dir=resolve(root,relative);mkdirSync(dir,{recursive:true});
 for(const file of ['hydro-numbering-reference.json','hydro-model-numbering-anchors.json','hydro-noah-20261105-row-geometry.json','hydro-204-numbered-rows.json'])copyFileSync(resolve(relative,file),resolve(dir,file));
 const file=resolve(dir,'hydro-numbering-reference.json'),original=JSON.parse(readFileSync(file));
 try{
  assert.equal(loadHydroReference(root).references.length,80);
  const moved=structuredClone(original);moved.references[0].rowFraction=.5;
  writeFileSync(file,JSON.stringify(moved));assert.throws(()=>loadHydroReference(root),/anchor mismatch/);
  const inferred=structuredClone(original);
  Object.assign(inferred.references[0],{section:'206',row:'E',seat:'97',modelObject:'OBREF_206_e_97_key',rowFraction:.5});
  writeFileSync(file,JSON.stringify(inferred));assert.throws(()=>loadHydroReference(root),/anchor mismatch/);
  writeFileSync(file,JSON.stringify(original));
  writeFileSync(resolve(dir,'hydro-model-numbering-anchors.json'),'{}');
  assert.throws(()=>loadHydroReference(root),/anchors changed/);
 }finally{rmSync(root,{recursive:true,force:true});}
});

test('Hydro transcribed row endpoints expand to 66 unique reference identities without importing generic E',()=>{
 const ref=loadHydroReference(process.cwd()),rows=ref.references.filter(r=>r.section==='204');
 assert.equal(rows.length,66);
 assert.deepEqual([...new Set(rows.map(r=>r.row))].sort(),['A','B','C','D','F']);
 assert.equal(new Set(rows.map(r=>`${r.row}/${r.seat}`)).size,66);
 for(const row of ['A','B','C','D','F'])assert.equal(rows.filter(r=>r.row===row).length,ref.eventRows.sections['204'][row]);
 assert.equal(rows.find(r=>r.row==='D'&&r.seat==='66').identityBasis,'reference-model-manifest-match');
 assert.equal(rows.find(r=>r.row==='D'&&r.seat==='69').eventAvailability,'unknown');
});
