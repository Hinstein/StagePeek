"""Rebuild the original Uber Arena shell with Blender 5.2 and Node.

blender --background --python-exit-code 1 --python models/venues/twcv-uber-arena-berlin/build.py
"""
import json
import math
from pathlib import Path
import struct
import subprocess

import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree


HERE = Path(__file__).resolve().parent
VENUE = HERE.name
PROFILE = json.loads(subprocess.check_output(["node", str(HERE / "anchors.mjs")], text=True))
ARC = math.radians(105)
FRONT_SPANS = 70
FRONT_RADIUS = 120 / ARC
FRONT_Z = 82 - FRONT_RADIUS
BOX_FACES = [(0, 2, 3, 1), (4, 5, 7, 6), (0, 1, 5, 4),
             (2, 6, 7, 3), (0, 4, 6, 2), (1, 3, 7, 5)]
batches = {}


def material(name, color, roughness, metal=0, emission=0, alpha=1, double=False):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, alpha)
    mat.use_backface_culling = not double
    shader = mat.node_tree.nodes["Principled BSDF"]
    shader.inputs["Base Color"].default_value = (*color, 1)
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Metallic"].default_value = metal
    shader.inputs["Emission Color"].default_value = (*color, 1)
    shader.inputs["Emission Strength"].default_value = emission
    shader.inputs["Alpha"].default_value = alpha
    if alpha < 1:
        mat.surface_render_method = "BLENDED"
    return mat


def add(name, mat, points, faces):
    vertices, polygons = batches.setdefault((name, mat), ([], []))
    start = len(vertices)
    vertices.extend(points)
    polygons.extend(tuple(start + i for i in face) for face in faces)


def box_points(center, size, angle=0):
    x, y, z = center
    w, h, d = (n / 2 for n in size)
    c, s = math.cos(angle), math.sin(angle)
    return [(x + dx * c + dz * s, y + dy, z - dx * s + dz * c)
            for dy in (-h, h) for dx in (-w, w) for dz in (-d, d)]


def box(name, mat, center, size, angle=0):
    add(name, mat, box_points(center, size, angle), BOX_FACES)


def bar(name, mat, start, end, width, depth=None):
    a, b = Vector(start), Vector(end)
    direction = b - a
    if direction.length < 1e-5:
        return
    axis = direction.normalized()
    across = axis.cross(Vector((0, 1, 0) if abs(axis.y) < .92 else (0, 0, 1))).normalized()
    right = across * width / 2
    up = across.cross(axis) * (depth or width) / 2
    points = [tuple(p + sx * right + sy * up) for p in (a, b)
              for sx in (-1, 1) for sy in (-1, 1)]
    add(name, mat, points, BOX_FACES)


def front(theta, y, offset=0):
    radius = FRONT_RADIUS + offset
    return (radius * math.sin(theta), y, FRONT_Z + radius * math.cos(theta))


def outline():
    facade = [front(ARC * (i / FRONT_SPANS - .5), 0) for i in range(FRONT_SPANS + 1)]
    x, _, z = facade[-1]
    handle_z = z - ((65 - x) * math.tan(ARC / 2))
    right = []
    for i in range(1, 19):
        t = i / 18
        right.append(((1 - t)**2 * x + (2 * t - t*t) * 65, 0,
                      (1 - t)**2 * z + 2 * (1 - t) * t * handle_z + t*t * 29))
    right.extend((65, 0, 29 - 66 * i / 22) for i in range(1, 23))
    right.extend((25 + 40 * math.cos(a), 0, -37 - 41 * math.sin(a))
                 for a in [math.pi * i / 40 for i in range(1, 21)])
    return [*facade, *right, *[(-x, y, z) for x, y, z in reversed(right)]]


OUTLINE = outline()


def ring(y, scale=1):
    return [(x * scale, y, 2 + (z - 2) * scale) for x, _, z in OUTLINE]


def strip(name, mat, bottom, top, spans=None):
    for i in range(len(bottom)) if spans is None else spans:
        j = (i + 1) % len(bottom)
        add(name, mat, [bottom[i], bottom[j], top[j], top[i]], [(0, 1, 2, 3)])


def lid(name, mat, edge, upper=True):
    points = [(0, edge[0][1], 2), *edge]
    count = len(edge)
    faces = [(0, i + 1, (i + 1) % count + 1) for i in range(count)]
    add(name, mat, points, faces if upper else [f[::-1] for f in faces])


def build_exterior(stone, grey, dark, trim, warm):
    body = range(FRONT_SPANS, len(OUTLINE))
    strip("shell_bowl_mass_plaza_plinth", stone, ring(-.46, 1.034), ring(-.044, 1.034))
    lid("shell_bowl_mass_plaza_plinth", stone, ring(-.044, 1.034))
    strip("shell_bowl_mass_cladding_lower", grey, ring(-.04), ring(5.78), body)
    strip("shell_bowl_mass_cladding_upper", dark, ring(6.14), ring(18.6), body)
    strip("shell_bowl_mass_stone_belt", stone, ring(5.35, 1.005), ring(6.25, 1.005))
    strip("shell_bowl_mass_cladding_brow", grey, ring(18.3, 1.004), ring(19.46, 1.005))
    strip("shell_bowl_mass_rim_cap", trim, ring(19.4, 1.005), ring(19.53, 1.006))

    for i in range(FRONT_SPANS, len(OUTLINE), 5):
        p = OUTLINE[i]
        rad = math.atan2(p[0], p[2] - 2)
        box("shell_bowl_mass_cladding_piers", grey, (p[0], 12.31, p[2]), (.25, 11.95, .38), rad)
        box("shell_bowl_mass_side_lighting", warm, (p[0] * 1.002, 5.12, 2+(p[2]-2)*1.002), (1.0, .11, .36), rad)

    front_spans = range(FRONT_SPANS)
    media = material("Reflected blue curtainwall", (.076, .149, .225), .23, .20, .15, .45)
    lobby = material("Clear entrance panes", (.11, .17, .20), .22, .05, .12, .33)
    strip("shell_bowl_mass_media_glass", media, ring(6.18), ring(18.34), front_spans)
    strip("shell_bowl_mass_lobby_glass", lobby, ring(.12), ring(5.35), front_spans)

    lobby_inner = [front(ARC * (i / FRONT_SPANS - .5), 0, -2.6) for i in range(FRONT_SPANS + 1)]
    strip("shell_bowl_mass_lobby_soffit", stone, [height(p, 5.21) for p in lobby_inner],
          ring(5.21), front_spans)
    for i in front_spans:
        j = i + 1
        a, b = lobby_inner[i], lobby_inner[j]
        strip("shell_bowl_mass_lobby_depth", dark, [(a[0], .10, a[2]), (b[0], .10, b[2])],
              [(a[0], 18.34, a[2]), (b[0], 18.34, b[2])], [0])
        p, q = OUTLINE[i], OUTLINE[j]
        if i in (0, FRONT_SPANS - 1):
            a, p = (a, p) if i == 0 else (b, q)
            add("shell_bowl_mass_lobby_jambs", stone, [p, a, (a[0], 18.34, a[2]), (p[0], 18.34, p[2])],
                [(0, 1, 2, 3) if i == 0 else (3, 2, 1, 0)])
        angle = ARC * ((i + .5) / FRONT_SPANS - .5)
        if i % 3 != 2:
            box("shell_bowl_mass_lobby_lights", warm, front(angle, 4.87, -1.44), (1.24, .12, .20), angle)
            box("shell_bowl_mass_lobby_door_rails", trim, front(angle, 2.78, .13), (1.48, .10, .12), angle)
            box("shell_bowl_mass_lobby_door_rails", trim, front(angle, 1.12, .13), (.95, .075, .18), angle)
        if i % 3 == 2:
            box("shell_bowl_mass_lobby_columns", stone, front(angle, 2.72, -.34), (.39, 5.13, .51), angle)

    for i in range(FRONT_SPANS + 1):
        theta = ARC * (i / FRONT_SPANS - .5)
        box("shell_bowl_mass_media_mullions", trim, front(theta, 12.26, .027), (.067, 12.17, .17), theta)
        box("shell_bowl_mass_lobby_door_rails", trim, front(theta, 2.74, .045), (.071, 5.17, .14), theta)
    for y in (6.15, 8.6, 11.02, 13.44, 15.87, 18.32):
        edge = [front(ARC * (i / FRONT_SPANS - .5), y, .047) for i in range(FRONT_SPANS + 1)]
        for a, b in zip(edge, edge[1:]):
            bar("shell_bowl_mass_media_mullions", trim, a, b, .078, .105)

    # One static illustrative lighting composition across the venue-reported 105-degree arc.
    pixels = [material("Media LED " + str(i + 1), color, .5, emission=strength)
              for i, (color, strength) in enumerate([
                  ((.026, .14, .25), .38), ((.032, .22, .52), .52),
                  ((.102, .52, .74), .68), ((.57, .77, .80), .62)
              ])]
    for i in range(210):
        u = (i + .5) / 210
        center = ARC * (u - .5)
        left, right = center - .0021, center + .0021
        for j in range(22):
            y = 6.58 + .53 * j
            wave = 10.3 + 1.67 * math.sin(u * math.tau * 1.47) + .81 * math.sin(u * math.tau * 2.3)
            distance = abs(y - wave)
            k = 3 if distance < .23 else 2 if distance < 1.0 else 1 if distance < 2.1 else 0
            r = .12
            add(f"shell_bowl_mass_media_pixels_{k + 1}", pixels[k],
                [front(left, y-r, .10), front(right, y-r, .10), front(right, y+r, .10), front(left, y+r, .10)],
                [(0, 1, 2, 3)])


def height(p, y):
    return (p[0], y, p[2])


def offset(p, length):
    dx, dz = p[0], p[2] - 3
    radius = math.hypot(dx, dz)
    return (p[0] + length * dx / radius, p[1], p[2] + length * dz / radius)


def bowl(concrete, dark, trim):
    glass = material("Laminated gallery rail glass", (.108, .21, .28), .21, .08, alpha=.25, double=True)
    suite = material("Blue suite glazing", (.09, .20, .28), .22, .17, .18)
    ribbon = material("Azure gallery LED", (.078, .39, .66), .29, emission=.92, double=True)
    sign = material("Warm aisle markers", (.83, .44, .15), .53, emission=.55)
    for bank in PROFILE["banks"]:
        rear = [offset(p, .32) for p in bank["rear"]]
        for a, b in zip(rear, rear[1:]):
            y = min(a[1], b[1]) - .08
            lower = 7.32 if bank["level"] == "L4" else -.039
            strip("shell_bowl_mass_rear_supports", concrete, [height(a, lower), height(b, lower)],
                  [height(a, y), height(b, y)], [0])

        if bank["level"] != "L4":
            continue
        front_row = bank["front"]
        rail = [offset(p, -.30) for p in front_row[1:-1]]
        for i, (a, b) in enumerate(zip(rail, rail[1:])):
            y = min(a[1], b[1])
            strip("shell_balustrades_glass", glass, [a, b], [height(a, y+.86), height(b, y+.86)], [0])
            bar("shell_balustrades_top_rail", trim, height(a, y+.88), height(b, y+.88), .055)
            if i % 3 == 1:
                bar("shell_balustrades_top_rail", trim, a, height(a, y+.86), .04)

            ox, oz = offset(a, -.19), offset(b, -.19)
            strip("shell_bowl_mass_suite_glass", suite, [height(oz, 11.42), height(ox, 11.42)],
                  [height(oz, 13.96), height(ox, 13.96)], [0])
            if i % 2 == 0:
                bar("shell_bowl_mass_suite_mullions", trim, height(ox, 11.43), height(ox, 13.93), .058, .105)
            lx, lz = offset(a, -.29), offset(b, -.29)
            bar("shell_ribbon_led_housing", dark, height(lx, 14.41), height(lz, 14.41), .13, .38)
            ra, rb = offset(lx, -.09), offset(lz, -.09)
            strip("shell_ribbon_led", ribbon, [height(rb, 14.28), height(ra, 14.28)],
                  [height(rb, 14.55), height(ra, 14.55)], [0])

        for p in (rail[0], rail[-1]):
            angle = math.atan2(p[0], p[2] - 3)
            q = offset(p, -.29)
            box("shell_vomitories_wayfinding", sign, height(q, 13.18), (.38, .115, .10), angle)
            box("shell_vomitories_jamb_trim", concrete, height(q, 12.9), (.115, 2.26, .087), angle)


def roof(dark, trim):
    metal = material("Anthracite standing-seam roof", (.115, .137, .174), .55, .28, .12)
    soffit = material("Acoustic soffit", (.123, .135, .156), .71, .11, .11)
    steel = material("Pale steel arena trusses", (.26, .29, .34), .49, .37, .11)
    lamps = material("Warm roof downlights", (.82, .64, .42), .48, emission=.97)
    edge = ring(29.62, 1.004)
    rim = ring(34.75, .83)
    strip("shell_roof_canopy_fascia", dark, ring(19.52, 1.006), edge)
    strip("shell_roof_canopy_main", metal, edge, rim)
    lid("shell_roof_canopy_main", metal, rim)
    lid("shell_roof_canopy_soffit", soffit, ring(29.61, 1.004), False)
    for y, scale in ((20.0, 1.007), (29.48, 1.007)):
        strip("shell_roof_canopy_trim", trim, ring(y-.084, scale), ring(y+.084, scale))
    for i in range(0, len(edge), 4):
        bar("shell_roof_canopy_standing_seams", dark, height(edge[i], 29.68), height(rim[i], 34.8), .055, .079)

    for z, half_span in [(-52, 51), (-37, 60), (-20, 63), (-3, 63), (14, 63), (31, 62), (48, 55), (64, 38)]:
        stations = [half_span * (i / 6 - 1) for i in range(13)]
        for y, width in ((27.40, .47), (29.10, .57)):
            bar("shell_roof_truss_lattice", steel, (-half_span, y, z), (half_span, y, z), width, .52)
        for i, x in enumerate(stations):
            bar("shell_roof_truss_lattice", steel, (x, 27.40, z), (x, 29.10, z), .21, .22)
            if i:
                bar("shell_roof_truss_lattice", steel, (stations[i-1], 27.4 if i % 2 else 29.1, z),
                    (x, 29.1 if i % 2 else 27.4, z), .20, .22)
        for x in (-24, -12, 12, 24):
            box("shell_roof_truss_lamp_bodies", dark, (x, 27.19, z), (.49, .21, .39))
            box("shell_roof_truss_lamp_lenses", lamps, (x, 27.061, z), (.39, .058, .30))
    for x in (-25, 25):
        bar("shell_roof_truss_lattice", steel, (x, 28.38, -52), (x, 28.38, 65), .37, .38)


def validate():
    def volume(items):
        vertices, faces = [], []
        for points, shape in items:
            start = len(vertices)
            vertices.extend(points)
            faces.extend(tuple(start + i for i in face) for face in shape)
        return BVHTree.FromPolygons(vertices, faces)

    def chair_parts():
        for chair in PROFILE["chairs"]:
            x, y, z = chair["p"]
            angle, width = chair["angle"], chair["width"]
            c, s = math.cos(angle), math.sin(angle)
            for part in chair["chairParts"]:
                a, b, d = part["center"]
                w, h, l = part["size"]
                center = (x + a*width*c + d*s, y + b, z - a*width*s + d*c)
                yield box_points(center, (w*width, h, l), angle), BOX_FACES

    chairs = volume(chair_parts())
    aisles = volume(([(x, y + h, z) for h in (.026, 2.12) for x, y, z in tread],
                    [(0, 1, 2, 3), (7, 6, 5, 4), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)])
                   for tread in PROFILE["aisles"])
    stages = volume((box_points(stage["center"], stage["size"], stage.get("angle", 0)), BOX_FACES)
                    for stage in PROFILE["stage"])
    errors = {}
    for (name, _), (points, faces) in batches.items():
        mesh = BVHTree.FromPolygons(points, faces)
        for label, check in [("seats", chairs), ("aisles", aisles), ("stage", stages)]:
            count = len(mesh.overlap(check))
            if count:
                errors[(name, label)] = count
    clearance = min(p[1] for (name, _), (points, _) in batches.items()
                    if name.startswith("shell_roof_truss") for p in points)
    clearance -= max(chair["p"][1] for chair in PROFILE["chairs"])
    # The façade plan is convex. Each tangent half-plane must enclose every
    # chair in the source frame as well as the envelopes checked above.
    facade_margin = math.inf
    for a, b in zip(OUTLINE, OUTLINE[1:] + OUTLINE[:1]):
        dx, dz = b[0] - a[0], b[2] - a[2]
        length = math.hypot(dx, dz)
        inward = min(dz * (chair["p"][0] - a[0]) - dx * (chair["p"][2] - a[2])
                     for chair in PROFILE["chairs"]) / length
        facade_margin = min(facade_margin, inward)
    if errors or clearance <= 3 or facade_margin <= 1:
        raise ValueError(f"Uber Arena clearance: {errors}, roof gap {clearance:.3f}m, facade gap {facade_margin:.3f}m")
    return {"sourceChairsChecked": len(PROFILE["chairs"]), "aisleTreadsChecked": len(PROFILE["aisles"]),
            "stagePartsChecked": len(PROFILE["stage"]), "lowestRoofTrussAboveHighestSeatBase": round(clearance, 3),
            "smallestFacadeMarginAtSeatBase": round(facade_margin, 3),
            "seatIntersections": 0, "aisleIntersections": 0, "stageIntersections": 0}


def export():
    for (name, mat), (points, faces) in batches.items():
        mesh = bpy.data.meshes.new(name)
        mesh.from_pydata([(x, -z, y) for x, y, z in points], [], faces)
        mesh.validate()
        node = bpy.data.objects.new(name, mesh)
        bpy.context.collection.objects.link(node)
        node.data.materials.append(mat)
        if name.startswith(("shell_roof_canopy", "shell_bowl_mass_media", "shell_bowl_mass_plaza")):
            node["unshadowed"] = True
    path = HERE / "shell.glb"
    bpy.ops.export_scene.gltf(filepath=str(path), export_format="GLB", export_yup=True,
                             export_apply=True, export_extras=True)
    data = path.read_bytes()
    magic, version, total, length, chunk = struct.unpack_from("<4s4I", data)
    if (magic, version, total, chunk) != (b"glTF", 2, len(data), 0x4e4f534a) or len(data) > 3_000_000:
        raise ValueError(f"Invalid arena GLB or exceeded 3 MB: {len(data)} bytes")
    doc = json.loads(data[20:20+length])
    nodes = [node for node in doc["nodes"] if "mesh" in node]
    if any(set(node).intersection({"matrix", "translation", "rotation", "scale"}) for node in nodes):
        raise ValueError("Export must retain the baked model frame")
    positions = [doc["accessors"][p["attributes"]["POSITION"]] for mesh in doc["meshes"] for p in mesh["primitives"]]
    return {
        "bounds": {"min": [round(min(p["min"][i] for p in positions), 3) for i in range(3)],
                   "max": [round(max(p["max"][i] for p in positions), 3) for i in range(3)]},
        "roofNodeNames": sorted(node["name"] for node in nodes if node["name"].startswith("shell_roof_")),
        "ribbonNodeNames": sorted(node["name"] for node in nodes if node["name"].startswith("shell_ribbon_led")),
        "assetBytes": len(data),
        "meshPrimitives": len(positions)
    }


bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
bpy.context.scene.unit_settings.system = "METRIC"
stone = material("Light precast concrete", (.31, .30, .27), .78, double=True)
grey = material("Galvanised facade panels", (.17, .19, .21), .62, .2, double=True)
dark = material("Obsidian cladding", (.066, .083, .111), .61, .24, .08, double=True)
trim = material("Brushed alloy", (.26, .285, .31), .36, .41)
warm = material("Amber lobby lighting", (.89, .54, .26), .47, emission=.78)
build_exterior(stone, grey, dark, trim, warm)
bowl(stone, dark, trim)
roof(dark, trim)
floor = material("Graphite arena event flooring", (.047, .062, .086), .88)
lid("shell_field_floor", floor, ring(-.014, .995))
clearance = validate()
manifest = {
    "venueId": VENUE,
    "generator": "blender-bpy",
    "version": 1,
    "coordinateSystem": "source-model-xyz",
    "upAxis": "+Y",
    "unit": "meter",
    "lightingPreset": "arena-dark",
    "modelQuality": "illustrative source-aligned architectural shell",
    "sources": ["https://www.uber-arena.de/en/the-venue/facts/",
                "https://www.uber-arena.de/pages/18/",
                "https://www.gbp-architekten.de/projekte/projekt/o2-world-jetzt-mercedes-benz-arena.html",
                "https://www.aeggp.com/venues/uber-arena"],
    "limitations": [
        "Curved glass and the 105 degree media facade use public venue dimensions and original illustrative optics.",
        "The curtain wall pixel pattern is static illustrative lighting. The model includes no event media, signage or third-party meshes.",
        "Bowl trim, suite glazing, roof and floor are source-aligned architectural interpretations without a surveyed transform.",
        "The main approach is represented at the positive-Z end of the retained bowl frame.",
        "The source chairs and layout stage remain in the runtime. The neutral floor represents the existing concert preset."
    ],
    "clearance": clearance,
    **export()
}
(HERE / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
