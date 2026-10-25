"""Audit the downloaded public Virtual Venue metadata; never infer seat XYZ."""
import csv
import hashlib
import json
import re
from collections import Counter
from html import escape
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE = "https://tottenhamhotspur.io-media.com/web/confignew.json"
RETRIEVED = "2026-10-24"


def save(name, value):
    (ROOT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


class Areas(HTMLParser):
    def __init__(self):
        super().__init__()
        self.items = []

    def handle_starttag(self, tag, attrs):
        if tag == "area":
            self.items.append(dict(attrs))


config = json.loads((ROOT / "virtual-venue-public-config.json").read_text())
assert config["cmd"]["errorCode"] == 0
elements = config["cmdData"]["elements"]
element_index = {e["elementDaeModelName"]: e for e in elements}
views, grouped = [], {}
for e in elements:
    if e["elementType"] != "section":
        continue
    match = re.fullmatch(r"Sub_Section_(.+)_([^_]+)_([^_]+)", e["elementDaeModelName"])
    assert match, e["elementDaeModelName"]
    section, row, seat = match.groups()
    data = json.loads(e["data"] or "{}")
    item = {
        "elementId": e["elementId"], "viewId": e["elementDaeModelName"],
        "section": section, "rowToken": row, "seatToken": seat,
        "levelName": data.get("levelName", ""),
        "numericRowAndSeatTokens": row.isdigit() and seat.isdigit(),
        "interiorView": row == "Interior",
        "cameraAngleTiltX": e["cameraAngleTiltX"],
        "cameraAngleTiltY": e["cameraAngleTiltY"],
        "source": SOURCE,
    }
    views.append(item)
    grouped.setdefault(section, []).append(item)

sections = [{
    "id": section, "baseId": section.removesuffix("WC"),
    "accessibleSuffix": section.endswith("WC"),
    "levelNames": sorted({v["levelName"] for v in items}),
    "sampledRowTokens": sorted({v["rowToken"] for v in items}),
    "sampledSeatTokens": sorted({v["seatToken"] for v in items}),
    "sampleViewCount": len(items), "views": items,
} for section, items in sorted(grouped.items())]
save("virtual-venue-sections-normalized.json", {
    "source": SOURCE, "retrieved": RETRIEVED,
    "status": "SAMPLED_VIEW_METADATA_NOT_EXHAUSTIVE_SEAT_INVENTORY",
    "coordinates": "NO_METRIC_XYZ_IN_THIS_DATASET",
    "currency": "Historical 2022-23 pricing text exists; current ticket inventory unverified",
    "reuse": "Publicly readable; no commercial asset reuse license established",
    "sections": sections,
})
with (ROOT / "virtual-venue-sampled-views.csv").open("w", newline="") as out:
    writer = csv.DictWriter(out, fieldnames=list(views[0]))
    writer.writeheader()
    writer.writerows(views)

polygons, layer_counts = [], []
all_map_files = sorted(ROOT.glob("virtual-venue-*-map.json"))
for path in all_map_files:
    layer = path.name.removeprefix("virtual-venue-").removesuffix("-map.json")
    layer_items = []
    for camera, data in json.loads(path.read_text()).items():
        parser = Areas()
        parser.feed(data["areas"])
        for area in parser.items:
            view_id = area["alt"]
            assert view_id in element_index, view_id
            assert area["shape"] == "poly"
            coords = [int(x) for x in area["coords"].split(",")]
            assert len(coords) >= 6 and len(coords) % 2 == 0
            record = {
                "layer": layer, "camera": camera, "viewId": view_id,
                "elementType": element_index[view_id]["elementType"],
                "points": [coords[i:i+2] for i in range(0, len(coords), 2)],
            }
            layer_items.append(record)
    polygons.extend(layer_items)
    ids = {p["viewId"] for p in layer_items}
    section_ids = {re.fullmatch(r"Sub_Section_(.+)_([^_]+)_([^_]+)", i).group(1)
                   for i in ids if i.startswith("Sub_Section_")}
    layer_counts.append({"layer": layer, "polygonCount": len(layer_items),
                         "uniqueViewIds": len(ids), "sectionIdentifiers": len(section_ids)})

save("virtual-venue-map-polygons-normalized.json", {
    "coordinateSystem": "2D_SCREEN_IMAGE_PIXELS_NOT_METRES_OR_3D",
    "warning": "Same view occurs across multiple cameras and layers; counts are not seat counts",
    "polygons": polygons,
})
prototype_path = ROOT.parents[1] / "venue-view-prototype/venue-data.json"
prototype_ids = {s["id"] for s in json.loads(prototype_path.read_text())["venues"]["tottenham"]["sections"]}
new_ids = set(grouped)
base_ids = {s.removesuffix("WC") for s in new_ids}
summary = {
    "retrieved": RETRIEVED, "elementTypes": dict(Counter(e["elementType"] for e in elements)),
    "sectionIdentifierCount": len(sections),
    "numericSectionIdentifiers": sum(s.isdigit() for s in grouped),
    "wcSuffixIdentifiers": sum(s.endswith("WC") for s in grouped),
    "baseIdentifierCountAfterRemovingWcSuffix": len(base_ids),
    "sampledSectionViews": len(views),
    "numericRowAndSeatTokenViews": sum(v["numericRowAndSeatTokens"] for v in views),
    "interiorViews": sum(v["interiorView"] for v in views),
    "mapPolygonCountAcrossCamerasAndLayers": len(polygons),
    "uniqueMappedViewIds": len({p["viewId"] for p in polygons}),
    "mappedSectionViewCount": len({p["viewId"] for p in polygons if p["elementType"] == "section"}),
    "sectionViewsWithoutMappedPolygon": sorted({v["viewId"] for v in views} - {p["viewId"] for p in polygons}),
    "layers": layer_counts,
    "prototypeSectionCount": len(prototype_ids),
    "prototypeIdsMatchedExactly": len(prototype_ids & new_ids),
    "prototypeIdsMatchedAfterRemovingWcSuffix": len(prototype_ids & base_ids),
    "additionalBaseIdentifiers": sorted(base_ids - prototype_ids),
    "prototypeIdsAbsentEvenAfterWcNormalization": sorted(prototype_ids - base_ids),
    "prototypeGeometryUpdated": False,
}
save("virtual-venue-coverage-summary.json", summary)

# A research figure preserves source screen positions; it is not a new 3D model.
overview = [p for p in polygons if p["layer"] == "FullStadium" and p["camera"] == "Aerial_Camera_Overview"]
points = [xy for p in overview for xy in p["points"]]
x0, y0 = min(p[0] for p in points), min(p[1] for p in points)
x1, y1 = max(p[0] for p in points), max(p[1] for p in points)
svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0-20} {y0-55} {x1-x0+40} {y1-y0+110}">',
       '<rect x="0" y="0" width="1200" height="1200" fill="#f5f7f4"/>',
       f'<text x="{x0}" y="{y0-25}" font-family="sans-serif" font-size="16">Tottenham: public 2D interaction polygons</text>']
colors = {"1": "#517a63", "2": "#80a491", "3": "#b2ba7e", "4": "#5b8fa3", "5": "#9e83b4"}
for p in overview:
    match = re.fullmatch(r"Sub_Section_(.+)_([^_]+)_([^_]+)", p["viewId"])
    section = match.group(1) if match else ""
    color = "#e99336" if section == "122" else colors.get(section[:1], "#c0c5c2")
    coords = " ".join(f"{x},{y}" for x, y in p["points"])
    svg.append(f'<polygon points="{coords}" fill="{color}" fill-opacity="0.75" stroke="#f5f7f4" stroke-width="0.55"><title>{escape(p["viewId"])}</title></polygon>')
svg += [f'<text x="{x0}" y="{y1+28}" font-family="sans-serif" font-size="12">Orange: Block 122. Pixel coordinates, not metric XYZ. Research reference only.</text>', '</svg>']
(ROOT / "virtual-venue-public-map-overview.svg").write_text("\n".join(svg))

failed_path = ROOT / "virtual-venue-FullStadium.json"
if failed_path.exists() and failed_path.read_text().lstrip().startswith("<"):
    failed_path.rename(ROOT / "virtual-venue-wrong-base-access-denied.xml")
raw_sources = {
    "virtual-venue-public-config.json": SOURCE,
    **{p.name: f"https://tottenhamhotspur.io-media.com/media/venueview/models/{p.name.removeprefix('virtual-venue-').removesuffix('-map.json')}.json" for p in all_map_files},
    "Stadium-Map-official-2026.pdf": "https://resources.thfc.pulselive.com/thfc/document/2026/03/12/717e595c-0e87-42f1-9f93-054b42607733/Stadium-Map.pdf",
}
save("virtual-venue-source-manifest.json", {
    "retrieved": RETRIEVED,
    "successfulDownloads": [{"file": name, "url": url, "bytes": (ROOT/name).stat().st_size,
                             "sha256": hashlib.sha256((ROOT/name).read_bytes()).hexdigest()}
                            for name, url in raw_sources.items()],
    "pathResolution": "Runtime prepends ../media/ to areaMapFileName from /web/. The correct files are /media/venueview/models/*.json. Initial /web/venueview/ and /web/media/ requests failed; not evidence that the correctly resolved public files are restricted.",
    "license": "No open commercial reuse license established; retained for research, not bundled into prototype.",
})
print(json.dumps(summary, ensure_ascii=False, indent=2))
