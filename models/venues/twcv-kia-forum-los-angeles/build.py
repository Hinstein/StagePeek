"""Rebuild this original Kia Forum shell with Blender 5.2 and Node.

blender --background --python-exit-code 1 --python models/venues/twcv-kia-forum-los-angeles/build.py
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
BAYS = 80
BAY_ANGLE = math.tau / BAYS
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


def polar(angle, radius, y):
    return (radius * math.sin(angle), y, radius * math.cos(angle))


def ring(radius, y, samples=240):
    return [polar(math.tau*i/samples, radius, y) for i in range(samples)]


def strip(name, mat, a, b, c, d):
    add(name, mat, [a, b, c, d], [(0, 1, 2, 3)])


def band(name, mat, low, high):
    for i, a in enumerate(low):
        j = (i + 1) % len(low)
        strip(name, mat, a, low[j], high[j], high[i])


def lid(name, mat, edge, upper=True):
    path = [(0, edge[0][1], 0), *edge]
    count = len(edge)
    faces = [(0, i + 1, (i + 1) % count + 1) for i in range(count)]
    add(name, mat, path, faces if upper else [f[::-1] for f in faces])


def height(p, y):
    return (p[0], y, p[2])


def radial(p, delta):
    radius = math.hypot(p[0], p[2])
    return ((radius + delta)*p[0]/radius, p[1], (radius + delta)*p[2]/radius)


def edge_height(fraction):
    return 25.5 - 1.15 * (1 - math.cos(math.tau*fraction)) / 2


def arch_width(y):
    # Slender shafts flare into a continuous shallow arcade at the cornice.
    if y < 13:
        return .63 - .08 * (y - 1.32) / 11.68
    if y < 20:
        return .55 + .40 * ((y - 13) / 7) ** 2
    return .95 + 1.80 * ((y - 20) / 4.2) ** 2


def build_exterior(plinth, ivory, wall, dark, warm):
    base_bottom = ring(73.0, -.84)
    base_top = ring(73.0, -.51)
    band("shell_bowl_mass_terrace_base", plinth, base_bottom, base_top)
    lid("shell_bowl_mass_terrace_base", plinth, base_top)
    terrace_outer_low = ring(70.9, -.49)
    terrace_outer_high = ring(70.9, 1.3)
    terrace_inner = ring(65.2, 1.3)
    band("shell_bowl_mass_pedestal", plinth, terrace_outer_low, terrace_outer_high)
    band("shell_bowl_mass_pedestal", plinth, terrace_outer_high, terrace_inner)
    band("shell_bowl_mass_cladding_red", wall, ring(65.2, 1.29), ring(65.2, 24.85))
    band("shell_bowl_mass_acoustic_lining", dark, ring(65.06, .02), ring(65.06, 24.85))

    door = material("Dark glazed service doors", (.077, .104, .133), .31, .09, .10)
    shade = material("Warm concrete soffit", (.27, .218, .163), .72, .08)
    for i in range(BAYS):
        theta = i * BAY_ANGLE
        path = []
        for y in (1.3, 2.08, 12.8, 16.4, 19.2, 20.9, 22.1, 23.2, 24.2):
            w = arch_width(y)
            if y == 1.3:
                w += .12
            depth = .92 + .13 * (y / 24.2)
            if i % 2 == 0:
                depth += .075
            path.append(box_points(polar(theta, 68.5, y), (w*2, 0, depth*2), theta)[:4])
        for low, high in zip(path, path[1:]):
            # Close each stepped loft with the same winding as the box primitive.
            add("shell_bowl_mass_arcade_columns", ivory, [*low, *high], BOX_FACES[2:])
        for f in range(8):
            u, v = f/8, (f+1)/8
            a, b = theta + BAY_ANGLE*u, theta + BAY_ANGLE*v
            lower_a, lower_b = edge_height(u) - .62, edge_height(v) - .62
            upper_a, upper_b = edge_height(u), edge_height(v)
            strip("shell_bowl_mass_arcade_eaves", ivory, polar(a, 70.15, lower_a), polar(b, 70.15, lower_b),
                  polar(b, 70.15, upper_b), polar(a, 70.15, upper_a))
            strip("shell_bowl_mass_arcade_soffit", shade, polar(b, 70.15, lower_b), polar(a, 70.15, lower_a),
                  polar(a, 65.2, 24.81), polar(b, 65.2, 24.81))
        center = theta + .5*BAY_ANGLE
        box("shell_bowl_mass_portal_doors", door, polar(center, 65.26, 2.48), (2.15, 2.29, .19), center)
        box("shell_bowl_mass_portal_door_trim", ivory, polar(center, 65.34, 3.68), (2.27, .10, .22), center)
        if i % 2 == 0:
            box("shell_bowl_mass_portal_lamps", warm, polar(center, 65.38, 4.19), (.72, .093, .15), center)
        if i % 10 == 0:
            for step in range(6):
                y = -.51 + .30*(step + 1)
                box("shell_bowl_mass_entry_stairs", plinth, polar(center, 74.86-step*.68, (-.56+y)/2),
                    (7.25, y+.56, .82 + step*.255), center)


def build_bowl(concrete, dark, trim, warm):
    glass = material("Clear upper rail glass", (.108, .21, .28), .26, .08, alpha=.24, double=True)
    suite = material("Club surround glazing", (.076, .125, .186), .24, .19, .12)
    ribbon = material("Warm red perimeter letterboard", (.68, .102, .07), .41, emission=.48, double=True)
    for bank in PROFILE["banks"]:
        tier = bank["level"]
        if tier == "BOX":
            continue
        rear = [radial(p, .28) for p in bank["rear"]]
        for a, b in zip(rear, rear[1:]):
            y = min(a[1], b[1]) - .09
            foot = 9.34 if tier == "L2" else -.03
            strip("shell_bowl_mass_bank_back", concrete, height(a, foot), height(b, foot), height(b, y), height(a, y))
        if tier != "L2":
            continue
        front = [radial(p, -.24) for p in bank["front"][1:-1]]
        for i, (a, b) in enumerate(zip(front, front[1:])):
            strip("shell_balustrades_glass", glass, a, b, height(b, b[1]+.7), height(a, a[1]+.7))
            bar("shell_balustrades_top_rail", trim, height(a, a[1]+.72), height(b, b[1]+.72), .048)
            if i % 3 == 0:
                bar("shell_balustrades_top_rail", trim, a, height(a, a[1]+.70), .036)
            # A short architectural fascia below the seats keeps the BOX level clear.
            q, r = radial(a, -.07), radial(b, -.07)
            top = min(a[1], b[1]) - .2
            strip("shell_bowl_mass_suite_glass", suite, height(r, top-.58), height(q, top-.58), height(q, top), height(r, top))
            bar("shell_ribbon_led_housing", dark, height(q, top-.72), height(r, top-.72), .063, .13)
            q, r = radial(q, -.042), radial(r, -.042)
            strip("shell_ribbon_led", ribbon, height(r, top-.77), height(q, top-.77), height(q, top-.67), height(r, top-.67))
        for p in (front[0], front[-1]):
            theta = math.atan2(p[0], p[2])
            q = radial(p, -.13)
            box("shell_vomitories_metal_jamb", trim, height(q, q[1]-.52), (.12, .69, .11), theta)
            box("shell_vomitories_wayfinding", warm, height(q, q[1]-.28), (.24, .086, .12), theta)


def build_roof(dark, ivory, warm):
    membrane = material("Dark suspended roof deck", (.135, .151, .174), .63, .30, .08)
    steel = material("Galvanised suspension cables", (.24, .273, .30), .41, .45, .08)
    band("shell_roof_canopy_base", dark, ring(65.15, 24.75), ring(65.15, 27.15))
    outer = ring(67.7, 27.14)
    middle = ring(48, 25.88)
    inner = ring(21.5, 24.55)
    crown = ring(7.6, 25.31)
    band("shell_roof_canopy_membrane", membrane, outer, middle)
    band("shell_roof_canopy_membrane", membrane, middle, inner)
    band("shell_roof_canopy_membrane", membrane, inner, crown)
    lid("shell_roof_canopy_membrane", membrane, crown)
    reversed_rings = [list(reversed(edge)) for edge in (outer, middle, inner, crown)]
    for a, b in zip(reversed_rings, reversed_rings[1:]):
        band("shell_roof_canopy_membrane", membrane, a, b)
    lid("shell_roof_canopy_membrane", membrane, crown, False)
    band("shell_roof_canopy_ring", dark, ring(68.1, 25.58), ring(68.1, 27.24))
    band("shell_roof_canopy_ring_trim", ivory, ring(68.15, 27.11), ring(68.15, 27.32))
    band("shell_roof_canopy_ring_top", dark, ring(68.15, 27.23), ring(67.7, 27.13))

    for i in range(40):
        theta = math.tau*i/40
        points = [polar(theta, radius, y) for radius, y in [(64.6, 26.48), (45, 24.78), (23, 24.05), (8.16, 24.21)]]
        for a, b in zip(points, points[1:]):
            bar("shell_roof_truss_radial_cables", steel, a, b, .133)
        theta_next = theta + math.tau/40
        bar("shell_roof_truss_tension_ring", steel, polar(theta, 8.16, 24.21), polar(theta_next, 8.16, 24.21), .39, .49)
        if i % 2 == 0:
            box("shell_roof_truss_lamp_bodies", dark, polar(theta, 36.3, 23.85), (.45, .22, .35), theta)
            box("shell_roof_truss_lamp_lenses", warm, polar(theta, 36.3, 23.72), (.31, .057, .23), theta)


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
    facade_margin = 65.2 - max(math.hypot(chair["p"][0], chair["p"][2]) for chair in PROFILE["chairs"])
    if errors or clearance <= 3 or facade_margin <= 1:
        raise ValueError(f"Kia Forum clearance: {errors}, roof gap {clearance:.3f}m, facade gap {facade_margin:.3f}m")
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
        if name.startswith(("shell_roof_canopy", "shell_bowl_mass_terrace_base")):
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
stone = material("Arcade plinth concrete", (.246, .222, .178), .75, double=True)
ivory = material("Warm white precast arcade", (.52, .48, .383), .57, .07, .11, double=True)
wall = material("California sunset red cladding", (.355, .042, .038), .60, .07, .15, double=True)
dark = material("Roof and portal graphite", (.065, .073, .087), .67, .17, .08, double=True)
trim = material("Brushed gallery rail", (.23, .258, .30), .38, .36)
warm = material("Warm concourse lighting", (.89, .55, .25), .47, emission=.79)
build_exterior(stone, ivory, wall, dark, warm)
build_bowl(stone, dark, trim, warm)
build_roof(dark, ivory, warm)
floor = material("Neutral graphite event floor", (.045, .056, .071), .87)
lid("shell_field_floor", floor, ring(65.05, -.018))
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
    "sources": [
        "https://npgallery.nps.gov/AssetDetail/8c45d952-7e8c-42b5-8bf4-0cf55cb35bab",
        "https://www.sgh.com/project/the-forum/",
        "https://www.severud.com/news/power-of-the-ring/",
        "https://inglewoodpublicart.org/projects/inglewood-forum/"
    ],
    "limitations": [
        "The 80-column arcade, scalloped cornice, raised concrete plinth and sunset red curtain wall follow the landmark descriptions.",
        "The 40 radial cable groups and central tension ring are illustrative architectural geometry.",
        "The exterior footprint is adjusted to enclose the retained chair envelope, which has no surveyed building transform. The shell is not a dimensional reproduction of the historic building.",
        "The original seat locations and concert-stage preset remain in the runtime."
    ],
    "features": {"arcadeColumns": BAYS, "radialCableGroups": 40},
    "clearance": clearance,
    **export()
}
(HERE / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
