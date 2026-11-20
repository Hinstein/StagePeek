"""Build the original Kai Tak Stadium architectural shell.

Run: blender --background --python-exit-code 1 --python models/venues/kai-tak-stadium/build.py
Node reads the retained bowl via the same source model used by the runtime.
"""
import json
import math
from pathlib import Path
import struct
import subprocess

import bmesh
import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree


HERE = Path(__file__).resolve().parent
ID = "kai-tak-stadium"
ANCHORS = json.loads(subprocess.check_output(["node", str(HERE / "anchors.mjs")], text=True))
HALF_STEPS = 60
ANGLES = [math.tau * i / (HALF_STEPS * 2) for i in range(HALF_STEPS * 2)]
BOX_FACES = [(0, 2, 3, 1), (4, 5, 7, 6), (0, 1, 5, 4),
             (2, 6, 7, 3), (0, 4, 6, 2), (1, 3, 7, 5)]
batches = {}


def material(name, color, roughness, metal=0, emission=0, alpha=1):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, alpha)
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
    axis = (b - a).normalized()
    helper = Vector((0, 1, 0)) if abs(axis.y) < .92 else Vector((0, 0, 1))
    across = axis.cross(helper).normalized()
    right = across * width / 2
    up = across.cross(axis) * (depth or width) / 2
    points = [tuple(p + sx * right + sy * up) for p in (a, b)
              for sx in (-1, 1) for sy in (-1, 1)]
    add(name, mat, points, BOX_FACES)


def rounded_distance(x, z, width, length, corner):
    a, b = abs(x) - width + corner, abs(z) - length + corner
    return math.hypot(max(a, 0), max(b, 0)) + min(max(a, b), 0) - corner


def outline(theta, y, width, length, corner=35):
    dx, dz = math.sin(theta), math.cos(theta)
    low, high = 0, math.hypot(width, length)
    for _ in range(19):
        r = (low + high) / 2
        if rounded_distance(r * dx, r * dz, width, length, corner) < 0:
            low = r
        else:
            high = r
    return (dx * (low + high) / 2, y, 1 + dz * (low + high) / 2)


def ring(y, width, length, corner=35):
    return [outline(a, y, width, length, corner) for a in ANGLES]


def band(name, mat, lower, upper, skip=()):
    for i, a in enumerate(lower):
        if i in skip:
            continue
        j = (i + 1) % len(lower)
        add(name, mat, [a, lower[j], upper[j], upper[i]], [(0, 1, 2, 3)])


def slab(name, mat, bottom, top):
    band(name, mat, bottom, top)
    # The clockwise perimeter as viewed from +Y closes with an upward-facing fan.
    add(name, mat, [(0, top[0][1], 1), *top], [
        (0, i + 1, (i + 1) % len(top) + 1) for i in range(len(top))])
    add(name, mat, [(0, bottom[0][1], 1), *bottom], [
        (0, (i + 1) % len(bottom) + 1, i + 1) for i in range(len(bottom))])


def build_exterior(concrete, dark, rail, glass, lamp):
    slab("shell_bowl_mass_plinth", concrete, ring(-.82, 112, 140, 44), ring(-.24, 112, 140, 44))
    # The glazed South Terrace lies toward the lower bowl's service opening.
    # It is inset from the cantilevered aluminium shell.
    glazed = range(55, 65)
    lower = ring(-.22, 99, 126)
    shoulder = ring(5.9, 101.3, 127.5)
    band("shell_bowl_mass_base_wall", dark, lower, shoulder)
    profiles = [(5.9, 101.3, 127.5), (9, 103.5, 129.5), (13.1, 105.9, 131.5),
                (17.3, 107.5, 133.3), (21.5, 108.5, 134.5), (25.7, 108.7, 135.0),
                (29.9, 108.4, 134.8), (34.1, 107.5, 133.7), (38.3, 105.7, 131.8),
                (42.2, 103.8, 130.1)]
    colors = ((.17, .091, .31), (.265, .13, .397), (.16, .193, .39),
              (.215, .259, .43), (.305, .202, .435))
    panels = [material("Pearlescent aluminium " + str(i + 1), color, .38, .32, emission=.12)
              for i, color in enumerate(colors)]
    inner = [ring(y, w - .62, d - .62) for y, w, d in profiles]
    outer = [ring(y, w, d) for y, w, d in profiles]
    for row, (a, b) in enumerate(zip(outer, outer[1:])):
        skip = glazed if row < 8 else ()
        # An opaque backer makes the narrow seams read as panel joints, and
        # closes the cladding behind the outlined triangle modules.
        band("shell_bowl_mass_cladding_backer", dark, inner[row], inner[row + 1], skip)
        for i, p in enumerate(a):
            j = (i + 1) % len(a)
            if i in skip:
                continue
            corners = [p, a[j], b[j], b[i]]
            faces = ((0, 1, 2), (0, 2, 3)) if (row + i) % 2 else ((0, 1, 3), (1, 2, 3))
            for k, face in enumerate(faces):
                wave = math.sin(i * .14 + row * .31) + math.cos(i * .07 - row * .38) * .45
                palette = (i * 19 + row * 11 + k * 2) % 3 + int(wave > .17) + int(wave > .68)
                verts = [Vector(corners[index]) for index in face]
                centroid = sum(verts, Vector((0, 0, 0))) / 3
                verts = [tuple(centroid + .97 * (point - centroid)) for point in verts]
                add(f"shell_bowl_mass_cladding_{palette + 1}", panels[palette], verts, [(0, 1, 2)])
    band("shell_bowl_mass_plinth_trim", rail, ring(4.95, 101.1, 127.3), ring(5.79, 101.9, 128.1))
    band("shell_bowl_mass_cladding_bezel", rail, outer[-1], ring(43.65, 102.1, 128.8))

    glass_bottom = ring(5.9, 98.3, 123.4)
    glass_top = ring(38.3, 98.3, 123.4)
    band("shell_bowl_mass_suite_glass_south_terrace", glass, glass_bottom, glass_top,
         set(range(len(ANGLES))) - set(glazed))
    for i in range(glazed.start, glazed.stop + 1):
        bar("shell_bowl_mass_terrace_mullions", rail, glass_bottom[i], glass_top[i], .28, .44)
        if i < glazed.stop:
            for y in (6.1, 11.6, 17.1, 22.6, 28.1, 33.6, 38.15):
                a, b = [(glass_bottom[j][0], y, glass_bottom[j][2]) for j in (i, i + 1)]
                bar("shell_bowl_mass_terrace_mullions", rail, a, b, .19, .27)
    # Bridge the glazed return to the aluminium skin without gaps at either jamb.
    for i in (glazed.start, glazed.stop):
        for row in range(8):
            a, b = outer[row][i], outer[row + 1][i]
            x, _, z = glass_bottom[i]
            points = [a, (x, a[1], z), (x, b[1], z), b]
            # Both thickness edges are visible at the window jamb.
            add("shell_bowl_mass_terrace_returns", concrete, points, [(0, 1, 2, 3)])
    for i in glazed:
        add("shell_bowl_mass_terrace_returns", concrete,
            [outer[8][i], outer[8][i + 1], glass_top[i + 1], glass_top[i]], [(0, 1, 2, 3)])

    for i in range(0, len(ANGLES), 5):
        j = (i + 2) % len(ANGLES)
        a, b = [outline(ANGLES[k], 3.95, 100.2, 126.9) for k in (i, j)]
        bar("shell_bowl_mass_entry_lighting", lamp, a, b, .12)


def build_interior(concrete, dark, rail, glass, lamp, ribbon):
    for bank in ANCHORS["upperRear"]:
        y = bank[0][1] - .095
        angles = [math.atan2(x, z - 1) for x, _, z in bank]
        rear = [(x, y, z) for x, _, z in bank]
        concourse = [outline(angle, y, 97.4, 122.3) for angle in angles]
        for i in range(len(rear) - 1):
            a, b = rear[i:i+2]
            c, d = concourse[i:i+2]
            if math.hypot(a[0], a[2] - 1) >= math.hypot(c[0], c[2] - 1):
                continue
            add("shell_bowl_mass_upper_concourse", concrete, [a, b, d, c], [(0, 3, 2, 1)])
    for bank in ANCHORS["middleFront"]:
        # The rim is on the field side of each source-derived gallery edge.
        rim = [(x - .31 * math.sin(a), y, z - .31 * math.cos(a))
               for x, y, z in bank for a in [math.atan2(x, z - 1)]]
        stops = [*rim[::6], rim[-1]]
        for a, b in zip(stops, stops[1:]):
            if math.dist(a, b) < .04:
                continue
            hi = [(p[0], p[1] + .79, p[2]) for p in (a, b)]
            add("shell_balustrades_glass", glass, [a, b, *hi[::-1]], [(0, 1, 2, 3)])
            bar("shell_balustrades_rail", rail, *hi, .075)
        # Narrow scoreboards follow each gallery bank, under the nose and out
        # of the ticket plane. An opaque fascia keeps the strip legible.
        for a, b in zip(stops, stops[1:]):
            if math.dist(a, b) < .04:
                continue
            lower = [(p[0], p[1] - .41, p[2]) for p in (a, b)]
            bar("shell_ribbon_led_housing", dark, *lower, .18, .56)
            lit = [(x - .14 * math.sin(t), y, z - .14 * math.cos(t))
                   for x, y, z in lower for t in [math.atan2(x, z - 1)]]
            bar("shell_ribbon_led", ribbon, *lit, .045, .31)
    for i in (3, 10, 17, 24, 32, 40, 47, 72, 80, 88, 96, 103, 110, 117):
        theta = ANGLES[i]
        x, _, z = outline(theta, 0, 99.4, 124.8)
        y = 33.98
        for side in (-1, 1):
            px, pz = x + side * 1.48 * math.cos(theta), z - side * 1.48 * math.sin(theta)
            box("shell_vomitories_frame", concrete, (px, y + 1.05, pz), (.28, 2.4, .75), theta)
        box("shell_vomitories_frame", concrete, (x, y + 2.20, z), (3.15, .28, .75), theta)
        box("shell_vomitories_recess", dark, (x, y + 1.05, z), (2.54, 2.1, .15), theta)
        box("shell_vomitories_wayfinding", lamp,
            (x - .39 * math.sin(theta), y + 2.19, z - .39 * math.cos(theta)), (.53, .12, .055), theta)


def build_roof(steel, fixed, moving, seam, lamp):
    last = ring(43.65, 102.1, 128.8)
    # Orthogonal truss pairs frame a long rectangular sliding opening.
    ap_half_x = 45.6
    ap_half_z = 58.5
    inner = ring(48.4, ap_half_x, ap_half_z, .45)
    lower = ring(43.05, 100.9, 127.8)
    band("shell_roof_canopy_fixed", fixed, lower, last)
    # A narrow top reveal splits the perimeter parapet from the sloped roof.
    middle = ring(48.75, 79.5, 104.3, 23)
    band("shell_roof_canopy_fixed", fixed, last, middle)
    band("shell_roof_canopy_fixed", fixed, middle, inner)
    inset = ring(46.8, ap_half_x, ap_half_z, .45)
    band("shell_roof_canopy_aperture", steel, inner, inset)
    band("shell_roof_canopy_soffit", fixed, inset, lower)

    for x in (-46.0, 46.0):
        bar("shell_roof_truss_rolling_rails", seam, (x, 48.91, -81), (x, 48.91, 83), .25, .29)
    for side in (-1, 1):
        side_name = "north" if side < 0 else "south"
        box(f"shell_roof_canopy_retractable_{side_name}", moving, (0, 47.62, side * 28.8 + 1),
            (89, 1.1, 55.4))
        for x in range(-32, 33, 8):
            box("shell_roof_canopy_panel_seams", seam, (x, 48.22, side * 28.8 + 1), (.24, .09, 54.9))
        box("shell_roof_canopy_panel_seams", seam, (0, 48.24, side * 1.2 + 1), (88.7, .11, .22))
        for i in range(side * 30 - 20, side * 30 + 21, 10):
            z = i + 1
            bar("shell_roof_truss_panel_braces", steel, (-44, 46.9, z), (44, 46.9, z), .22, .44)

    for transverse in (False, True):
        half = 92 if transverse else 120
        spread = 57.7 if transverse else 46.6
        for offset in (-spread, spread):
            def p(s, y):
                return (s, y, offset + 1) if transverse else (offset, y, s + 1)
            def crown(s):
                # Follow the underside of the perimeter roof towards each bearing.
                taper = max(0, abs(s) - half * .64) / (half * .36)
                return 45.15 - 2.7 * taper
            bar("shell_roof_truss_orthogonal", steel, p(-half, 40.3), p(half, 40.3), .56, .74)
            steps = 22 if transverse else 28
            stations = [-half + 2 * half * i / steps for i in range(steps + 1)]
            for i, a in enumerate(stations):
                bar("shell_roof_truss_orthogonal", steel, p(a, 40.3), p(a, crown(a)), .30, .36)
                if i:
                    b = stations[i - 1]
                    bar("shell_roof_truss_orthogonal", steel, p(b, crown(b)), p(a, crown(a)), .62, .74)
                    bar("shell_roof_truss_orthogonal", steel, p(b, 40.3 if i % 2 else crown(b)),
                        p(a, crown(a) if i % 2 else 40.3), .38, .40)
    for i in range(0, len(ANGLES), 5):
        j = (i + 1) % len(ANGLES)
        a, b = [outline(ANGLES[k], 38.65, 92.4, 118.6) for k in (i, j)]
        bar("shell_roof_truss_lighting_housings", seam, a, b, .48, .49)
        bar("shell_roof_truss_lighting_lenses", lamp, (a[0], a[1] - .259, a[2]),
            (b[0], b[1] - .259, b[2]), .24, .09)


def build_field(concrete, dark):
    slab("shell_field_floor_apron", concrete, ring(-.22, 98.5, 124.5), ring(-.15, 98.5, 124.5))
    slab("shell_field_floor_runoff", dark, ring(-.145, 43.2, 69.6, 14), ring(-.102, 43.2, 69.6, 14))
    turfs = [material(name, color, .94) for name, color in [
        ("Turf, light mow", (.099, .25, .09)), ("Turf, dark mow", (.074, .20, .066))]]
    box("shell_field_floor_pitch_runoff", turfs[1], (0, -.101, 0), (76, .045, 117))
    for i in range(14):
        box("shell_field_floor_pitch_mow_" + ("dark" if i % 2 else "light"), turfs[i % 2],
            (0, -.066, -52.5 + (i + .5) * 7.5), (68, .031, 7.5))
    paint = material("Pitch marking paint", (.78, .81, .76), .91)
    for x in (-34, 34):
        box("shell_field_floor_pitch_lines", paint, (x, -.038, 0), (.16, .012, 105.16))
    for z in (-52.5, 0, 52.5):
        box("shell_field_floor_pitch_lines", paint, (0, -.038, z), (68, .012, .16))
    for sign in (-1, 1):
        for width, depth in ((40.32, 16.5), (18.32, 5.5)):
            for x in (-width / 2, width / 2):
                box("shell_field_floor_pitch_lines", paint, (x, -.038, sign * (52.5 - depth / 2)),
                    (.16, .012, depth))
            box("shell_field_floor_pitch_lines", paint, (0, -.038, sign * (52.5 - depth)),
                (width, .012, .16))
    circle = [(9.15 * math.cos(a), -.03, 9.15 * math.sin(a)) for a in ANGLES[::3]]
    for a, b in zip(circle, circle[1:] + circle[:1]):
        bar("shell_field_floor_pitch_lines", paint, a, b, .16, .012)


def validate_clearance():
    # Match the runtime chair envelopes and the walking volume above each
    # inferred aisle polygon. Only architectural surfaces are added here.
    def volume(items):
        vertices, faces = [], []
        for points, sides in items:
            offset = len(vertices)
            vertices.extend(points)
            faces.extend(tuple(offset + i for i in face) for face in sides)
        return BVHTree.FromPolygons(vertices, faces), vertices

    chair_volume, chair_points = volume(
        (box_points((seat["p"][0] - .014 * math.sin(seat["angle"]), seat["p"][1] + .36,
                     seat["p"][2] - .014 * math.cos(seat["angle"])),
                    (.52 * seat["width"], .72, .51), seat["angle"]), BOX_FACES)
        for seat in ANCHORS["chairs"])
    aisle_volume, aisle_points = volume(
        ([(x, y + h, z) for h in (.02, 2.12) for x, y, z in tread],
         [(0, 1, 2, 3), (7, 6, 5, 4), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)])
        for tread in ANCHORS["aisles"])
    stage_volumes = [volume([(box_points(box["center"], box["size"], box.get("angle", 0)), BOX_FACES)])[0]
                     for box in ANCHORS["stage"]]
    intersections = {"seatIntersections": {}, "aisleIntersections": {}, "stageIntersections": {}}
    for (name, _), (points, faces) in batches.items():
        mesh = BVHTree.FromPolygons(points, faces)
        for kind, volumes in [("seatIntersections", [chair_volume]), ("aisleIntersections", [aisle_volume]),
                              ("stageIntersections", stage_volumes)]:
            hit = sum(len(mesh.overlap(other)) for other in volumes)
            if hit:
                intersections[kind][name] = hit

    truss_y = min(p[1] for (name, _), (points, _) in batches.items()
                  if name.startswith("shell_roof_truss") for p in points)
    gap = truss_y - max(seat["p"][1] for seat in ANCHORS["chairs"])
    # Near the glazable opening the glazing is well outside the outermost
    # source banks. The base profile is the least expansive part of the wall.
    margin = min(-rounded_distance(x, z - 1, 98.3, 123.4, 35)
                 for x, _, z in chair_points + aisle_points)
    if any(intersections.values()) or gap <= 3 or margin <= 1:
        raise ValueError(f"Kai Tak clearance: {intersections}, roof {gap:.3f} m, facade {margin:.3f} m")
    return {"sourceChairsChecked": len(ANCHORS["chairs"]), "aisleTreadsChecked": len(ANCHORS["aisles"]),
            "stagePartsChecked": len(stage_volumes), "lowestRoofTrussAboveHighestSeatBase": round(gap, 3),
            "smallestFacadeMargin": round(margin, 3), **{key: 0 for key in intersections}}


def export_shell():
    for (name, mat), (points, faces) in batches.items():
        mesh = bpy.data.meshes.new(name)
        mesh.from_pydata([(x, -z, y) for x, y, z in points], [], faces)
        mesh.validate()
        if name.startswith(("shell_field_floor", "shell_roof_truss", "shell_vomitories", "shell_ribbon_led")):
            bm = bmesh.new()
            bm.from_mesh(mesh)
            bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
            bm.to_mesh(mesh)
            bm.free()
        node = bpy.data.objects.new(name, mesh)
        bpy.context.collection.objects.link(node)
        node.data.materials.append(mat)
        if name == "shell_bowl_mass_plinth" or name.startswith("shell_roof_canopy"):
            node["unshadowed"] = True
    path = HERE / "shell.glb"
    bpy.ops.export_scene.gltf(filepath=str(path), export_format="GLB", export_yup=True,
                             export_apply=True, export_extras=True)
    data = path.read_bytes()
    magic, version, total, length, chunk = struct.unpack_from("<4s4I", data)
    if (magic, version, total, chunk) != (b"glTF", 2, len(data), 0x4e4f534a):
        raise ValueError("Invalid exported glTF header")
    doc = json.loads(data[20:20 + length])
    nodes = [node for node in doc["nodes"] if "mesh" in node]
    if any(set(node).intersection({"matrix", "translation", "rotation", "scale"}) for node in nodes):
        raise ValueError("Export must retain the baked model frame")
    positions = [doc["accessors"][primitive["attributes"]["POSITION"]]
                 for mesh in doc["meshes"] for primitive in mesh["primitives"]]
    if len(data) > 5_000_000:
        raise ValueError(f"Shell exceeds the stadium asset budget: {len(data)} bytes")
    return {
        "bounds": {"min": [round(min(p["min"][i] for p in positions), 3) for i in range(3)],
                   "max": [round(max(p["max"][i] for p in positions), 3) for i in range(3)]},
        "roofNodeNames": sorted(node["name"] for node in nodes if node["name"].startswith("shell_roof_")),
        "ribbonNodeNames": sorted(node["name"] for node in nodes if node["name"].startswith("shell_ribbon_led")),
        "assetBytes": len(data),
        "meshPrimitives": len(positions),
    }


def main():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    bpy.context.scene.unit_settings.system = "METRIC"
    concrete = material("Precast concrete", (.175, .185, .205), .79)
    dark = material("Dark anodised graphite", (.049, .058, .081), .62, .21)
    rail = material("Pearl trim aluminium", (.285, .313, .39), .35, .41)
    glass = material("Neutral blue terrace glazing", (.115, .21, .28), .29, .16, alpha=.38)
    lamp = material("Warm concourse lamps", (.84, .58, .30), .43, emission=.85)
    ribbon = material("Perimeter LED ribbon", (.196, .45, .83), .28, emission=.82)
    steel = material("Pale roof truss steel", (.35, .39, .43), .48, .39)
    fixed = material("Pale zinc fixed canopy", (.49, .54, .58), .56, .25, emission=.12)
    moving = material("Pearl roof deck", (.59, .64, .67), .50, .23, emission=.15)
    seam = material("Roof panel seams and bogie rail", (.295, .337, .38), .50, .35, emission=.10)

    build_exterior(concrete, dark, rail, glass, lamp)
    build_interior(concrete, dark, rail, glass, lamp, ribbon)
    build_roof(steel, fixed, moving, seam, lamp)
    build_field(concrete, dark)
    clearance = validate_clearance()
    manifest = {
        "venueId": ID,
        "generator": "blender-bpy",
        "version": 1,
        "coordinateSystem": "source-model-xyz",
        "upAxis": "+Y",
        "unit": "meter",
        "lightingPreset": "stadium-dusk",
        "modelQuality": "illustrative source-aligned architectural shell",
        "sources": ["https://www.arup.com/projects/kai-tak-stadium/",
                    "https://populous.com/showcases/kai-tak-sports-park",
                    "https://www.kaitaksportspark.com.hk/venues-spaces/4"],
        "limitations": [
            "Model proportions follow retained source coordinates without surveyed metric calibration.",
            "Triangular pearlescent cladding, glazed South Terrace and paired orthogonal trusses are simplified architectural interpretations.",
            "Movable roof leaves are modeled in the near-closed position. The viewer toggles complete roof visibility.",
            "The fixed bowl has no event stage. Pitch markings describe an illustrative football setup.",
            "The original mesh and materials are generated locally. Source chairs and identities remain in the runtime.",
        ],
        "clearance": clearance,
        **export_shell(),
    }
    (HERE / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
