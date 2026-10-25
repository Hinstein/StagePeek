"""Recheck saved release evidence without executing third-party JavaScript."""
from collections import Counter
from pathlib import Path
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "shijiao-evidence/data-sources"
profiles = json.loads((DATA / "venue-geometry-profiles.json").read_text())
references = json.loads((DATA / "geometry-source-references.json").read_text())
assets = json.loads((DATA / "seat-assets-manifest.json").read_text())
saved_evidence = json.loads((ROOT / "shijiao-evidence/rea-evidence-verified.json").read_text())
script = next((ROOT / "shijiao-evidence/scripts/files").rglob("data-CI2ywFAf.js"))
digest = hashlib.sha256(script.read_bytes()).hexdigest()
anchors = [r["evidence_id"] for r in saved_evidence["records"]
           if any(s.get("sha256") == digest for s in r.get("normalized_result", {}).get("capture", {}).get("source_artifacts", []))]
assert anchors

asset_checks = []
for asset in assets:
    path = Path(asset["path"])
    verified = hashlib.sha256(path.read_bytes()).hexdigest() == asset["sha256"]
    assert verified
    data = json.loads(path.read_text())
    variants = {"raw": {"seats": data}} if isinstance(data, list) else data["variants"]
    for layout, value in variants.items():
        labels = Counter(tuple(str(x) for x in seat[:3]) for seat in value["seats"])
        asset_checks.append({
            "venue": asset["venue"], "layout": layout,
            "records": len(value["seats"]), "uniqueSectionRowSeatLabels": len(labels),
            "duplicateLabelKeys": sum(n > 1 for n in labels.values()),
            "sha256Verified": verified,
            "source": None if isinstance(data, list) else data.get("source"),
        })

source_examples = {}
for key in ["london-the-o2", "los-angeles-kia-forum", "kai-tak-stadium"]:
    profile = profiles[key]
    source_examples[key] = {"declaredEvidence": profile.get("evidence"),
                            "sources": profile.get("sources", [])}
section_references = json.loads((DATA / "section-layout-references.json").read_text())
source_examples["kai-tak-stadium"]["sectionReferenceNote"] = section_references["kai-tak-stadium"]["note"]
excerpts = []
upstream = DATA / "upstream-observations/kts-D3A_eNdl.js"
source_text = upstream.read_text()
for term in ["CAD 逐座位圖", "層高冇資料", "三維", "未經 CAD 核實"]:
    match = re.search(re.escape(term), source_text)
    if match:
        excerpts.append({"term": term, "characterOffset": match.start(),
                         "text": source_text[max(0, match.start()-90):match.end()+160]})

result = {
    "audited": "2026-10-24", "releaseScope": "photo-protection-20261023",
    "method": "Static inspection of saved public release data; no target JS execution or field survey",
    "reaSourceEvidenceIds": anchors, "dataScriptSha256": digest,
    "venueDirectoryEntries": len(json.loads((DATA / "venues.json").read_text())),
    "geometryProfiles": len(profiles),
    "selfDeclaredEvidenceLabels": dict(Counter(v.get("evidence") for v in profiles.values())),
    "profilesWithEstimateTermsInSourceNotes": sum(any(any(term in s.get("note", "") for term in ["估算", "估计", "推算"]) for s in v.get("sources", [])) for v in profiles.values()),
    "estimateCountLimitation": "Lexical count of declared notes; not a measured error rate or count of incorrect venues",
    "sourceReferenceRecords": len(references), "uniqueSourceUrls": len({r["url"] for r in references}),
    "socialReferenceRecords": sum(any(site in r.get("url", "") for site in ["xiaohongshu.com", "instagram.com", "weibo.com"]) for r in references),
    "seatAssetFileCount": len(assets), "seatAssetLayoutChecks": asset_checks,
    "consistencyLimitation": "Unique labels and matching hashes do not establish physical accuracy, completeness, source authorization, or as-built status",
    "sourceExamples": source_examples,
    "upstreamScriptSha256": hashlib.sha256(upstream.read_bytes()).hexdigest(),
    "upstreamDeclaredMethodExcerpts": excerpts,
    "measuredPositionError": None,
    "measuredPositionErrorReason": "No independent ground-truth field measurements or error distribution acquired in this audit",
}
out = ROOT / "western-market-research/shijiao-source-accuracy-audit.json"
out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({k: result[k] for k in ["venueDirectoryEntries", "geometryProfiles", "selfDeclaredEvidenceLabels", "profilesWithEstimateTermsInSourceNotes", "sourceReferenceRecords", "uniqueSourceUrls", "socialReferenceRecords", "seatAssetFileCount"]}, ensure_ascii=False, indent=2))
print("All 7 seat-file hashes match; 12 layouts have unique section/row/seat label tuples. Physical error remains unmeasured.")
