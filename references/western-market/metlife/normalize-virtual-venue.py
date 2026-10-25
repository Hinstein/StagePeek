"""Normalize one publicly linked Jets Virtual Venue snapshot; no seat interpolation."""
import hashlib
import json
import re
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE = 'https://newyorkjets.io-media.com/web/confignew.json'
RETRIEVED = '2026-10-24'


def save(name, value):
    (ROOT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


class Areas(HTMLParser):
    def __init__(self):
        super().__init__()
        self.items = []

    def handle_starttag(self, tag, attrs):
        if tag == 'area':
            self.items.append(dict(attrs))


config = json.loads((ROOT / 'virtual-venue-public-config.json').read_text())
assert config['cmd']['errorCode'] == 0
elements = config['cmdData']['elements']
index = {e['elementDaeModelName']: e for e in elements}
grouped = {}
for e in elements:
    if e['elementType'] != 'section':
        continue
    match = re.fullmatch(r'Sub_Section_(.+)_([^_]+)_([^_]+)', e['elementDaeModelName'])
    assert match, e['elementDaeModelName']
    section, row, seat = match.groups()
    # Null overrides are explicit in this snapshot; never silently ignore a later override.
    assert all(e[k] is None for k in ['sectionDisplay', 'rowDisplay', 'seatDisplay'])
    level = {'1': 'Level 100', '2': 'Level 200', '3': 'Level 300'}.get(section[0])
    assert level, section
    grouped.setdefault(section, []).append({
        'elementId': e['elementId'], 'viewId': e['elementDaeModelName'],
        'section': section, 'rowToken': row, 'seatToken': seat,
        'levelName': level, 'levelNameBasis': 'section-number-series',
        'sourceLevelText': json.loads(e['data'])['levelName'],
        'interiorView': row == 'Interior', 'source': SOURCE,
    })

sections = [{'id': s, 'baseId': s.removesuffix('WC'),
             'levelNames': sorted({v['levelName'] for v in views}), 'views': views}
            for s, views in sorted(grouped.items())]
save('virtual-venue-sections-normalized.json', {
    'source': SOURCE, 'retrieved': RETRIEVED,
    'status': 'SAMPLED_VIEW_METADATA_NOT_EXHAUSTIVE_SEAT_INVENTORY',
    'coordinates': 'NO_METRIC_XYZ_IN_THIS_DATASET',
    'currency': 'Jets football preview; no source revision date or current concert inventory established',
    'reuse': 'Publicly readable; no commercial asset reuse license established',
    'sections': sections,
})

polygons = []
for path in sorted(ROOT.glob('virtual-venue-*-map.json')):
    layer = path.name.removeprefix('virtual-venue-').removesuffix('-map.json')
    for camera, data in json.loads(path.read_text()).items():
        parser = Areas()
        parser.feed(data['areas'])
        for area in parser.items:
            assert area['shape'] == 'poly'
            coords = [int(x) for x in area['coords'].split(',')]
            assert len(coords) >= 6 and len(coords) % 2 == 0
            view_id = area['alt']
            assert view_id in index
            polygons.append({'layer': layer, 'camera': camera, 'viewId': view_id,
                             'elementType': index[view_id]['elementType'],
                             'points': [coords[i:i+2] for i in range(0, len(coords), 2)]})
save('virtual-venue-map-polygons-normalized.json', {
    'coordinateSystem': '2D_SCREEN_IMAGE_PIXELS_NOT_METRES_OR_3D',
    'warning': 'Repeated cameras are not distinct seats; research reference only',
    'polygons': polygons,
})
sources = [
    ('official-pricing-page.html', 'https://www.newyorkjets.com/tickets/seating-information/pricing-chart'),
    ('virtual-venue-entry.html', 'https://newyorkjets.io-media.com/'),
    ('virtual-venue-index.html', 'https://newyorkjets.io-media.com/web/index.html'),
    ('virtual-venue-clientConfig.js', 'https://newyorkjets.io-media.com/web/clientConfig.js'),
    ('virtual-venue-public-config.json', SOURCE),
]
sources += [(p.name, 'https://newyorkjets.io-media.com/media/venueview/models/' +
             p.name.removeprefix('virtual-venue-').replace('-map.json', '.json'))
            for p in sorted(ROOT.glob('virtual-venue-*-map.json'))]
save('virtual-venue-source-manifest.json', {
    'retrieved': RETRIEVED,
    'officialChain': 'Jets pricing page → Virtual Venue link → web/index.html → clientConfig.js → confignew.json → venueLayers area maps',
    'successfulDownloads': [{'file': name, 'url': url, 'bytes': (ROOT / name).stat().st_size,
                             'sha256': hashlib.sha256((ROOT / name).read_bytes()).hexdigest()}
                            for name, url in sources if (ROOT / name).exists()],
    'license': 'No open commercial reuse license established; no panorama/image library downloaded',
})
summary = {'source': SOURCE, 'retrieved': RETRIEVED,
           'sectionIdentifiers': len(sections), 'baseSections': len({s['baseId'] for s in sections}),
           'sampledViews': sum(len(s['views']) for s in sections),
           'polygonsAcrossCamerasAndLayers': len(polygons),
           'fullOverviewSectionViews': len({p['viewId'] for p in polygons if p['layer'] == 'FullStadium' and p['camera'] == 'Aerial_Camera_Overview' and p['elementType'] == 'section'}),
           'completeSeatInventory': False, 'metricCalibrated': False}
save('virtual-venue-coverage-summary.json', summary)
print(json.dumps(summary, indent=2))
