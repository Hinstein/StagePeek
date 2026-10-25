"""Recover coloured map regions; image pixels are NOT surveyed geometry.

Usage: python extract-map.py /tmp/map.png /tmp/ocr.json output.json
Requires Pillow. Retains concave boundaries, discards text holes; no raster is
copied into the output. Labels are OCR candidates, never silently corrected.
"""
import collections
import hashlib
import json
import math
import sys
from PIL import Image


def simplify(points, epsilon):
    if len(points) <= 2:
        return points
    a, b = points[0], points[-1]
    dx, dy = b[0] - a[0], b[1] - a[1]
    norm = math.hypot(dx, dy)
    def distance(p):
        return abs(dy * (p[0] - a[0]) - dx * (p[1] - a[1])) / norm if norm else math.dist(p, a)
    index = max(range(1, len(points) - 1), key=lambda i: distance(points[i]), default=0)
    if not index or distance(points[index]) <= epsilon:
        return [a, b]
    return simplify(points[:index + 1], epsilon)[:-1] + simplify(points[index:], epsilon)


def signed_area(points):
    return sum(a[0] * b[1] - b[0] * a[1] for a, b in zip(points, points[1:] + points[:1])) / 2


image_path, ocr_path, output_path = sys.argv[1:]
im = Image.open(image_path).convert('RGB')
width, height = im.size
pixels = im.load()
mask = bytearray(width * height)
for y in range(height):
    for x in range(width):
        r, g, b = pixels[x, y]
        mask[y * width + x] = r < 65 and 45 < g < 180 and b > 170 and b > g * 1.25

seen = bytearray(len(mask))
components = []
pixel_to_region = {}
for offset, value in enumerate(mask):
    if not value or seen[offset]:
        continue
    queue = collections.deque([offset])
    seen[offset] = 1
    component = []
    while queue:
        i = queue.popleft()
        component.append(i)
        x, y = i % width, i // width
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < width and 0 <= ny < height:
                n = ny * width + nx
                if mask[n] and not seen[n]:
                    seen[n] = 1
                    queue.append(n)
    if len(component) < 90:
        continue
    region_index = len(components)
    occupied = set(component)
    edges = collections.defaultdict(list)
    for i in component:
        pixel_to_region[i] = region_index
        x, y = i % width, i // width
        if y == 0 or i - width not in occupied:
            edges[(x, y)].append((x + 1, y))
        if x == width - 1 or i + 1 not in occupied:
            edges[(x + 1, y)].append((x + 1, y + 1))
        if y == height - 1 or i + width not in occupied:
            edges[(x + 1, y + 1)].append((x, y + 1))
        if x == 0 or i - 1 not in occupied:
            edges[(x, y + 1)].append((x, y))
    loops = []
    while edges:
        start = next(iter(edges))
        loop, current = [start], start
        for _ in range(len(component) * 5):
            options = edges.get(current)
            if not options:
                break
            nxt = options.pop()
            if not options:
                del edges[current]
            current = nxt
            if current == start:
                loops.append(loop)
                break
            loop.append(current)
    outer = max(loops, key=lambda p: abs(signed_area(p)))
    # Split the closed ring at the vertex furthest from its first vertex.
    far = max(range(len(outer)), key=lambda i: math.dist(outer[0], outer[i]))
    boundary = simplify(outer[:far + 1], 1.0)[:-1] + simplify(outer[far:] + [outer[0]], 1.0)[:-1]
    components.append({
        'id': f'region-{region_index + 1:03d}',
        'areaPixels': len(component),
        'polygonPixels': [list(p) for p in boundary],
        'centroidPixels': [round(sum(i % width for i in component) / len(component), 2),
                           round(sum(i // width for i in component) / len(component), 2)],
        'labelCandidates': [],
        'geometryStatus': 'image-segmented-not-surveyed',
    })

unassigned = []
for observation in json.load(open(ocr_path)):
    text = observation['text'].strip()
    x, y, w, h = observation['box']
    cx, cy = (x + w / 2) * width, (y + h / 2) * height
    votes = collections.Counter()
    for py in range(max(0, int(cy - 4)), min(height, int(cy + 5))):
        for px in range(max(0, int(cx - 4)), min(width, int(cx + 5))):
            idx = pixel_to_region.get(py * width + px)
            if idx is not None:
                votes[idx] += 1
    candidate = {'text': text, 'confidence': observation['confidence'],
                 'centerPixels': [round(cx, 2), round(cy, 2)], 'status': 'ocr-unreviewed'}
    if votes:
        idx, count = votes.most_common(1)[0]
        candidate['regionVotePixels'] = count
        components[idx]['labelCandidates'].append(candidate)
    else:
        unassigned.append(candidate)

result = {
    'schemaVersion': 1, 'width': width, 'height': height,
    'sourceImageHash': hashlib.sha256(open(image_path, 'rb').read()).hexdigest(),
    'coordinateSystem': 'ticketing-image-pixels-not-metres',
    'algorithm': 'blue-fill-4-connected-components/exterior-contour/RDP-1px + Apple-Vision-OCR',
    'components': components, 'unassignedText': unassigned,
    'limitations': ['Colours indicate visible map regions, not sellable inventory.',
                   'OCR may merge adjacent labels or miss small labels; never a seat inventory.',
                   'No real heights, rows, seat coordinates or metric scale are supplied by the raster.'],
}
with open(output_path, 'w') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)
    f.write('\n')
print(json.dumps({'regions': len(components), 'regionsWithOCR': sum(bool(c['labelCandidates']) for c in components),
                  'ocrObservations': len(json.load(open(ocr_path))), 'output': output_path}))
