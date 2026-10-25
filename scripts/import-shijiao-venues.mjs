import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Convert the REA-retained public catalog into SeatPeep manifests. The output
// deliberately keeps source provenance and accuracy flags; it does not copy
// remote images/models and it never expands a sampled seat into a full inventory.
const here = fileURLToPath(new URL('.', import.meta.url));
const project = resolve(here, '..');
const sourceRoot = resolve(project, '..', 'shijiao-evidence', 'data-sources');
const output = join(project, 'data', 'manual-venues');
const read = file => JSON.parse(readFileSync(join(sourceRoot, file), 'utf8'));
const venues = [...read('venues.json'), ...read('venues-extension.json')];
const byId = new Map(venues.map(value => [value.id, value]));
const inventory = new Map(read('venue-source-inventory.json').map(value => [value.id, value]));
const profiles = read('venue-geometry-profiles.json');
const references = read('section-layout-references.json');
const assets = new Map(read('seat-assets-manifest.json').map(value => [value.venue, value]));
const kspo = read('kspo-sections-derived.json').sections;
const specialTiers = {
  'birds-nest': read('birds-nest-tiers.json'),
  'kspo-dome': read('kspo-tiers.json')
};
const keep = new Set(['metlife', 'sofi', 'tottenham']);

const finite = value => Number.isFinite(value) ? value : 0;
const rad = value => {
  const number = finite(value);
  return Math.abs(number) > Math.PI * 2.1 ? number * Math.PI / 180 : number;
};
const spanRad = (id, value) => id === 'tokyo-dome' && Math.abs(Number(value)) < 10
  ? Number(value) * Math.PI / 180
  : rad(value);
const slug = value => String(value || '').trim().replace(/\s+/g, '-');
const publicUrl = value => typeof value === 'string' && /^https:\/\//.test(value) ? value : null;

function fallbackTiers(entry) {
  const base = entry.geometry || {};
  const count = Math.max(1, Number(base.levels) || 1);
  const a = Math.max(12, Number(base.a) || 28);
  const b = Math.max(12, Number(base.b) || a * 1.25);
  return Array.from({ length: count }, (_, index) => [
    a + index * Math.max(5, a * .16),
    b + index * Math.max(7, b * .16),
    1 + index * 12,
    Math.max(12, Math.min(30, a * .22)),
    Math.max(7, Math.min(20, 8 + index * 2))
  ]);
}

function tiersFor(id, entry) {
  const tiers = bowlTiersFor(id, entry);
  if(references[id]?.sections?.some(s=>Number.isFinite(s.x)&&Number.isFinite(s.width)))tiers.push([1,1,0,1,0]);
  return tiers;
}
function bowlTiersFor(id, entry) {
  const special = specialTiers[id];
  if (special) return Object.values(special).map(t => [t.a, t.b, t.base, t.depth, t.rise]);
  const profile = profiles[id];
  if (profile?.tiers?.length) return profile.tiers.map(t => [t.a, t.b, t.base, t.depth, t.rise]);
  return fallbackTiers(entry);
}

function shapeFor(entry, profile) {
  if (profile?.shape) return profile.shape;
  if (entry?.kind === 'baseball') return 'baseball';
  if (entry?.kind === 'stadium') return 'oval';
  if (entry?.kind === 'hall') return 'rectangle';
  if (entry?.kind === 'theatre') return 'fan';
  if (entry?.kind === 'club') return 'rear';
  return 'rounded';
}

function geometryFor(id, entry, profile, tiers) {
  const shape = shapeFor(entry, profile);
  const floor = profile?.floor || [
    Math.max(48, Math.round(Math.max(...tiers.map(t => t[0] + Math.abs(t[3] || 0) / 2)) * 2.25)),
    Math.max(48, Math.round(Math.max(...tiers.map(t => t[1] + Math.abs(t[3] || 0) / 2)) * 2.25))
  ];
  const namedTiers = profile?.tiers || Object.entries(specialTiers[id] || {}).map(([key, tier], index) => ({
    id: key, name: key, steps: Number(tier.steps) || Math.max(8, Math.round(tier[4] ? tier[4] * 2 : 12))
  }));
  return {
    shape,
    ...(profile?.tiers?.length ? {coordinateSystem:'profile-inner-radius',power:profile.power??1,oneSided:!!profile.oneSided,...profile.stage?{stage:profile.stage}:{},...profile.saddle?{saddle:profile.saddle}:{},...profile.radial?{radial:profile.radial}:{}} : {}),
    floor,
    ...(references[id]?.sections?.some(s=>Number.isFinite(s.x)&&Number.isFinite(s.width))?{rectangularFloor:true}:{}),
    // Explicit section references define the occupied angles; never close a
    // stage opening by inventing background rows behind a dedicated stage.
    ...(profile?.stage?{openBowl:true}:{}),
    tiers: namedTiers.length ? namedTiers.map((tier, index) => ({
      id: tier.id || `tier-${index}`,
      name: tier.name || `Level ${index + 1}`,
      steps: Number(tier.steps) || 12
    })) : tiers.map((tier, index) => ({
      id: `tier-${index}`,
      name: `Level ${index + 1}`,
      // When no public row count exists, keep this explicitly estimated but
      // derive density from the tier rise so large stadiums do not collapse
      // into the same twelve-row template.
      steps: Math.max(8, Math.min(40, Math.round(8 + Math.abs(Number(tier[4]) || 0) * 1.5)))
    }))
  };
}

function sourceLinksFor(id, entry, profile, sectionReference, inventoryEntry, asset) {
  const links = new Set();
  for (const value of [entry.url, entry.mapUrl, inventoryEntry?.venue_reference_url,
    inventoryEntry?.map_reference_url, inventoryEntry?.section_source,
    sectionReference?.source, ...(profile?.sources || []).map(source => source.url), asset?.url]) {
    const url = publicUrl(value);
    if (url) links.add(url);
  }
  return [...links];
}

function sourceSamples(id, section, asset) {
  if (!asset) return [];
  const file = asset.path;
  let data;
  try { data = JSON.parse(readFileSync(file, 'utf8')); } catch { return []; }
  let rows = [];
  if (Array.isArray(data)) {
    rows = data.filter(record => Array.isArray(record) && String(record[0]) === String(section.id));
  } else if (data?.variants) {
    const variant = data.variants[data.defaultLayout] || Object.values(data.variants)[0];
    rows = (variant?.seats || []).filter(record => Array.isArray(record) && String(record[0]) === String(section.id));
  }
  // Keep a bounded holdout sample for ticket identity checks. The source asset
  // remains referenced in accuracy.seatAsset; the full asset is not republished.
  return rows.slice(0, 3).map(record => {
    const [label, row, seat, x, y, z, ...rest] = record;
    // The Kai Tak list is the site's CAD payload: x/z are sign-flipped and
    // Y is field 11 of each CAD record. The dictionary assets already expose
    // decoded x/y/z triples, so keep those coordinates as provided.
    const position = id === 'kai-tak-stadium'
      ? [-finite(x), finite(record[11]), -finite(y)]
      : [finite(x), finite(y), finite(z)];
    return {
      section: String(label), row: String(row), seat: String(seat),
      position, source: asset.url,
      identityStatus: 'source-sampled', positionStatus: 'source-coordinate',
      sourceRecord: { format: asset.format, assetSha256: asset.sha256, extra: rest.slice(0, 3) }
    };
  });
}

function genericSections(id, tiers, asset) {
  const sections = [];
  const count = 12;
  for (let tier = 0; tier < tiers.length; tier += 1) {
    for (let index = 0; index < count; index += 1) {
      const label = `L${tier + 1}-${String(index + 1).padStart(2, '0')}`;
      const section = {
        id: label,
        ticketLabels: [label],
        levelName: `Level ${tier + 1} · 示意分区`,
        tier,
        angle: -Math.PI / 2 + index * Math.PI * 2 / count,
        halfAngle: Math.PI / count * .72,
        samples: [],
        positionBasis: { kind: 'synthetic-geometry', coordinateSystem: 'estimated-metre-frame' }
      };
      section.samples = sourceSamples(id, section, asset);
      sections.push(section);
    }
  }
  return sections;
}

function sectionsFor(id, tiers, asset) {
  const reference = id === 'kspo-dome' ? { sections: kspo, source: byId.get(id)?.url } : references[id];
  if (!reference?.sections?.length) return genericSections(id, tiers, asset);
  // Some venue PDFs export anchors in degrees while the normalized references
  // for other venues already use radians. Detect the source convention once
  // per reference so small degree values such as 6.47° are not mistaken for
  // 6.47 radians.
  // Some stadium references use unwrapped radians that continue below -2π
  // as sections wrap around the venue. Treat only clearly degree-like values
  // as degrees; the old 2π threshold collapsed KSPO DOME into one narrow arc.
  const anglesInDegrees = id !== 'kspo-dome' && reference.sections.some(item => Math.abs(Number(item.angle)) > 20);
  const profile = profiles[id];
  const tierNames = profile?.tiers?.map(t => String(t.id)) || tiers.map((_, index) => `tier-${index}`);
  const indexFor = level => {
    if (typeof level === 'number') return Math.max(0, Math.min(tiers.length - 1, level));
    const key = String(level || '').toLowerCase();
    const exact = tierNames.findIndex(name => name.toLowerCase() === key);
    if (exact >= 0) return exact;
    // Many public seat references use these canonical level names even when
    // the venue has no separate geometry profile. Preserve that information
    // instead of collapsing every section onto the first tier.
    if (key === 'lower' || key === 'lower bowl' || key === 'level 1' || key === 'floor') return 0;
    if (key === 'middle' || key === 'mid' || key === 'level 2') return Math.min(1, tiers.length - 1);
    if (key === 'upper' || key === 'upper bowl' || key === 'level 3') return Math.min(2, tiers.length - 1);
    if (key === 'top' || key === 'level 4' || key === 'level 5') return Math.min(3, tiers.length - 1);
    if (key === 'field' || key === 'inner') return 0;
    const numeric = Number(key.match(/\d+/)?.[0]);
    return Number.isFinite(numeric) ? Math.max(0, Math.min(tiers.length - 1, numeric - 1)) : 0;
  };
  return reference.sections.map((item, index) => {
    const label = String(item.id ?? item.label ?? `${index + 1}`);
    const block = Number.isFinite(item.x)&&Number.isFinite(item.z)&&Number.isFinite(item.width)&&Number.isFinite(item.depth) ? {x:item.x,z:item.z,width:item.width,depth:item.depth,base:item.base??0,facing:item.facing??-1,...item.risers?{risers:item.risers}:{}} : null;
    const tier = block ? tiers.length-1 : indexFor(item.level);
    const section = {
      id: slug(label) || `section-${index + 1}`,
      // Section ids are the stable ticket lookup key. Human labels are kept in
      // sourceLabel because the source can reuse the same descriptive text.
      ticketLabels: [label],
      sourceLabel: String(item.label || '').trim() || label,
      levelName: tierNames[tier] || `Level ${tier + 1}`,
      tier,
      ...(block?{block}:{}),
      angle: anglesInDegrees ? finite(item.angle) * Math.PI / 180 : rad(item.angle),
      halfAngle: Math.max(.012, Math.min(.75, Math.abs(spanRad(id, item.span ?? .12)) / 2)),
      ...(Number.isFinite(item.radialStart)?{radialStart:item.radialStart}:{}),
      ...(Number.isFinite(item.radialEnd)?{radialEnd:item.radialEnd}:{}),
      samples: [],
      positionBasis: {
        kind: 'source-layout-reference',
        coordinateSystem: 'source-relative-angle',
        source: reference.source || byId.get(id)?.url
      }
    };
    section.samples = sourceSamples(id, section, asset);
    return section;
  });
}

function manifestFor(id, entry) {
  const profile = profiles[id];
  const inventoryEntry = inventory.get(id) || {};
  const asset = assets.get(id);
  const tiers = tiersFor(id, entry);
  const reference = id === 'kspo-dome' ? { sections: kspo, source: entry.url } : references[id];
  const sections = sectionsFor(id, tiers, asset);
  const hasReference = Boolean(reference?.sections?.length);
  const hasProfile = Boolean(profile?.tiers?.length || specialTiers[id]);
  const source = publicUrl(entry.url) || publicUrl(inventoryEntry.venue_reference_url);
  const geometryEvidence = profile?.evidence || (specialTiers[id] ? 'reference' : 'estimated');
  const assetRecords = asset ? (asset.records || Object.values(asset.variants || {}).reduce((n, v) => n + (v.seats || 0), 0)) : 0;
  const sourceLinks = sourceLinksFor(id, entry, profile, reference, inventoryEntry, asset);
  const sourceInventory = {
    venueReferenceUrl: publicUrl(inventoryEntry.venue_reference_url),
    mapReferenceUrl: publicUrl(inventoryEntry.map_reference_url),
    sectionSource: publicUrl(inventoryEntry.section_source),
    geometryEvidenceLabel: inventoryEntry.geometry_evidence_label || null,
    note: inventoryEntry.note || null
  };
  const geometry = geometryFor(id, entry, profile, tiers);
  if(geometry.rectangularFloor){const floorLevel=reference.levels?.find(l=>l.id==='floor');geometry.tiers.push({id:'floor',name:floorLevel?.name||'内场（布局示意）',steps:12});}
  return {
    id,
    name: entry.name,
    city: [entry.region, entry.city].filter(Boolean).join(' · ') || '未注明地区',
    capacity: '原站目录未提供统一容量字段',
    source: source || sourceLinks[0] || 'https://shijiao.xingpaste.com/',
    sourceTitle: 'REA 导出的公开场馆来源索引与参数化座位示意',
    sourceLinks,
    accuracy: {
      sectionLabels: hasReference ? 'source-layout-reference' : 'synthetic-tier-labels',
      completeSeatInventory: false,
      metricCalibrated: false,
      stage: 'generic',
      position: 'estimated',
      geometryBasis: hasProfile ? `source-informed-parametric:${geometryEvidence}` : 'estimated-parametric',
      catalogStatus: hasProfile ? (hasReference ? 'source-geometry-and-sections' : 'source-geometry-only') : 'catalog-only',
      seatDataStatus: asset ? 'bounded-source-samples' : 'section-only',
      sourceLayout: entry.defaultLayout || 'generic',
      coverage: `${sections.length} 个${hasReference ? '来源分区' : '示意分区'}；${sections.reduce((n, section) => n + section.samples.length, 0)} 条座位采样。${hasReference ? '区号来自公开布局参考。' : '未找到逐区公开布局，标签仅用于浏览。'}${asset ? ` 原站公开资产记录约 ${assetRecords} 条，仅保留少量核对样本。` : ''}`,
      reuse: '来源页面可公开访问；未建立商业图形、模型或座位数据库再分发许可，发布前需逐源复核。',
      sourceDate: 'REA capture 2026-10-24',
      sourceInventory,
      seatAsset: asset ? { url: asset.url, sha256: asset.sha256, records: assetRecords } : null
    },
    tiers,
    geometry,
    sections,
    importedAt: '2026-10-24T00:00:00.000Z'
  };
}

mkdirSync(output, { recursive: true });
const stale = readdirSync(output).filter(file => file.endsWith('.json') && file !== 'wembley.json');
for (const file of stale) rmSync(join(output, file));
const report = { sourceCatalog: byId.size, generated: 0, skippedExisting: [], withGeometry: 0, withSectionReferences: 0, withSeatAssets: 0, genericOnly: 0, files: [] };
for (const [id, entry] of [...byId.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  if (keep.has(id)) { report.skippedExisting.push(id); continue; }
  const manifest = manifestFor(id, entry);
  const file = join(output, `${id}.json`);
  writeFileSync(file, `${JSON.stringify(manifest, null, 2)}\n`, { mode: 0o600 });
  report.generated += 1;
  report.withGeometry += manifest.accuracy.catalogStatus !== 'catalog-only' ? 1 : 0;
  report.withSectionReferences += manifest.accuracy.catalogStatus === 'source-geometry-and-sections' ? 1 : 0;
  report.withSeatAssets += manifest.accuracy.seatDataStatus === 'bounded-source-samples' ? 1 : 0;
  report.genericOnly += manifest.accuracy.catalogStatus === 'catalog-only' ? 1 : 0;
  report.files.push({ id, sections: manifest.sections.length, samples: manifest.sections.reduce((n, section) => n + section.samples.length, 0), status: manifest.accuracy.catalogStatus });
}
writeFileSync(join(project, 'docs', 'shijiao-import-report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
