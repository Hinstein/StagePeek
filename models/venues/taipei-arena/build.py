"""Build the source-aligned Taipei Arena architectural shell with Blender 5.2."""
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
ANCHORS = json.loads(subprocess.check_output(["node", str(HERE / "anchors.mjs")], text=True))
CENTER_Z = 13.5
RADIUS_X, RADIUS_Z = 59.0, 72.0
POWER = .8
PANELS = 112
ANGLES = [math.tau * index / PANELS for index in range(PANELS)]
BOX_FACES = [(0, 2, 3, 1), (4, 5, 7, 6), (0, 1, 5, 4),
             (2, 6, 7, 3), (0, 4, 6, 2), (1, 3, 7, 5)]
PRISM_FACES = [(0, 1, 2, 3), (7, 6, 5, 4), (0, 4, 5, 1),
               (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)]
batches = {}


def material(name, color, roughness, metallic=0, alpha=1, emission=0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, alpha)
    mat.use_backface_culling = True
    shader = mat.node_tree.nodes["Principled BSDF"]
    shader.inputs["Base Color"].default_value = (*color, 1)
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Metallic"].default_value = metallic
    shader.inputs["Alpha"].default_value = alpha
    shader.inputs["Emission Color"].default_value = (*color, 1)
    shader.inputs["Emission Strength"].default_value = emission
    if alpha < 1:
        mat.surface_render_method = "BLENDED"
    return mat


def add(name, mat, points, faces):
    vertices, polygons = batches.setdefault((name, mat), ([], []))
    offset = len(vertices)
    vertices.extend(points)
    polygons.extend(tuple(offset + i for i in face) for face in faces)


def box_points(center, size, angle=0):
    x, y, z = center
    w, h, d = (n / 2 for n in size)
    c, s = math.cos(angle), math.sin(angle)
    return [(x + dx * c + dz * s, y + dy, z - dx * s + dz * c)
            for dy in (-h, h) for dx in (-w, w) for dz in (-d, d)]


def box(name, mat, center, size, angle=0):
    add(name, mat, box_points(center, size, angle), BOX_FACES)


def bar_points(a, b, width, depth=None):
    a, b = Vector(a), Vector(b)
    axis = (b - a).normalized()
    guide = Vector((0, 1, 0)) if abs(axis.y) < .92 else Vector((0, 0, 1))
    horizontal = axis.cross(guide).normalized()
    right = horizontal * (width / 2)
    across = horizontal.cross(axis) * ((depth or width) / 2)
    return [tuple(p + sx * right + sy * across) for p in (a, b)
            for sx in (-1, 1) for sy in (-1, 1)]


def bar(name, mat, a, b, width, depth=None):
    add(name, mat, bar_points(a, b, width, depth), BOX_FACES)


def wall_strip(name, mat, rings, close=True):
    count = len(rings[0])
    segments = count if close else count - 1
    faces = [(offset + i, offset + (i + 1) % count,
              offset + count + (i + 1) % count, offset + count + i)
             for offset in range(0, count * (len(rings) - 1), count)
             for i in range(segments)]
    add(name, mat, [p for ring in rings for p in ring], faces)


def contour(angle, y, inset=0):
    c, s = math.cos(angle), math.sin(angle)
    return (math.copysign(abs(c) ** POWER, c) * (RADIUS_X - inset), y,
            CENTER_Z + math.copysign(abs(s) ** POWER, s) * (RADIUS_Z - inset))


def band(name, mat, bottom, top, inset, thickness):
    rings = [[contour(a, y, i) for a in ANGLES] for y, i in
             [(bottom, inset), (top, inset), (top, inset + thickness), (bottom, inset + thickness), (bottom, inset)]]
    wall_strip(name, mat, rings)


def slab(name, mat, bottom, top, inset):
    rings = [[contour(a, y, inset) for a in ANGLES] for y in (bottom, top)]
    wall_strip(name, mat, rings)
    add(name, mat, [p for ring in rings for p in ring],
        [tuple(range(PANELS - 1, -1, -1)), tuple(range(PANELS, PANELS * 2))])


def source_clearances():
    checks = []
    for layout in ANCHORS["layouts"]:
        chairs_points, chairs_faces = [], []
        for seat in layout["chairs"]:
            x, y, z = seat["p"]
            angle = seat["angle"]
            center = (x - math.sin(angle) * .014, y + .36, z - math.cos(angle) * .014)
            points = box_points(center, (.52 * seat["width"], .72, .51), angle)
            chairs_faces.extend(tuple(len(chairs_points) + i for i in face) for face in BOX_FACES)
            chairs_points.extend(points)
        aisles_points, aisles_faces = [], []
        for aisle in layout["aisles"]:
            aisles_faces.extend(tuple(len(aisles_points) + i for i in face) for face in PRISM_FACES)
            aisles_points.extend((x, y + lift, z) for lift in (.02, 2.12) for x, y, z in aisle)
        stages = [BVHTree.FromPolygons(box_points(part["center"], part["size"], part.get("angle", 0)), BOX_FACES)
                  for part in layout["stage"]]
        checks.append((layout, BVHTree.FromPolygons(chairs_points, chairs_faces),
                       BVHTree.FromPolygons(aisles_points, aisles_faces), stages))
    return checks


def keep_clear(points, faces, checks):
    proposed = BVHTree.FromPolygons(points, faces)
    return all(not proposed.overlap(chairs) and not proposed.overlap(aisles)
               and not any(proposed.overlap(stage) for stage in stages)
               for _, chairs, aisles, stages in checks)


def build(checks):
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    bpy.context.scene.unit_settings.system = "METRIC"

    concrete = material("Warm precast concrete", (.29, .24, .187), .82)
    limestone = material("Ivory facade panel", (.47, .46, .40), .62, .22, emission=.08)
    basalt = material("Basalt podium", (.087, .106, .11), .83)
    floor = material("Graphite arena event floor", (.082, .094, .108), .78)
    floor_seam = material("Dark terrazzo control joints", (.075, .086, .095), .88)
    frame = material("Graphite powder-coated frames", (.072, .105, .12), .49, .48)
    mullion = material("Satin stainless steel", (.28, .33, .35), .43, .62)
    glazing = material("Blue-green structural glazing", (.122, .248, .270), .24, .20, .58, emission=.2)
    suite = material("Reflective suite glass", (.145, .238, .239), .28, .14, .64)
    warm = material("Amber lobby lighting", (.88, .56, .25), .42, emission=.55)
    screen = material("Public facade LED", (.078, .23, .37), .49, emission=.68)
    ribbon = material("Warm interior ribbon display", (.77, .42, .17), .55, emission=.65)
    skin = material("Titanium-silver standing-seam canopy", (.32, .39, .48), .47, .49)
    seams = material("Titanium seam caps", (.30, .36, .45), .50, .47)
    truss = material("Roof lattice steel", (.22, .26, .275), .55, .52)

    def eave(angle):
        return 33.20 + 1.09 * math.sin(angle) + .30 * math.cos(2 * angle)

    def roof_at(angle, radius, lift=0):
        x, _, z = contour(angle, 0, -2.65)
        curve = 1 - radius ** 1.65
        y = eave(angle) * radius + 43.42 * (1 - radius) + 7.8 * curve * radius
        return (x * radius + 4.8 * curve, y + lift, CENTER_Z + (z - CENTER_Z) * radius - 8.0 * curve)

    for x, _, z in ANCHORS["facadeAnchors"]:
        if (abs(x) / (RADIUS_X - 1.35)) ** 2.5 + (abs(z - CENTER_Z) / (RADIUS_Z - 1.35)) ** 2.5 >= 1:
            raise ValueError("Source display architecture exceeds the inner facade")

    slab("shell_field_floor_plaza", basalt, -.46, -.23, -5.4)
    box("shell_field_floor_plaza", basalt, (18, -.35, -67), (62, .21, 38))
    slab("shell_field_floor", floor, -.20, -.081, 1.50)
    for x in range(-30, 31, 5):
        box("shell_field_floor_control_joints", floor_seam, (x, -.065, 0), (.068, .009, 80))
    for z in range(-38, 39, 5):
        box("shell_field_floor_control_joints", floor_seam, (0, -.065, z), (60, .009, .068))

    # The glazed curtain wall sits outside the structural shell. Floor edges
    # and recessed lighting remain visible through the curtain wall.
    band("shell_bowl_mass_plinth", basalt, -.17, 2.45, .60, 1.2)
    band("shell_bowl_mass_enclosure", concrete, -.10, 32.15, 1.35, .60)
    for y, height in [(2.45, .23), (6.60, .34), (10.72, .22), (16.16, .28), (22.1, .32), (27.8, .21)]:
        band("shell_bowl_mass_facade_panels", limestone, y, y + height, -.05, 1.94)
    for y in [5.9, 10.02, 15.44, 21.37, 27.12]:
        band("shell_vomitories_static", warm, y, y + .105, .47, .30)

    curtain = [[contour(a, y if y is not None else eave(a) - .28)
                for a in ANGLES] for y in (2.59, 6.52, 10.63, 16.07, 22.02, 27.72, None)]
    wall_strip("shell_bowl_mass_curtain_wall", glazing, curtain)
    for i, a in enumerate(ANGLES):
        b = ANGLES[(i + 1) % PANELS]
        root = contour(a, 1.94, -.10)
        head = contour(a, eave(a) - .38, -.18)
        bar("shell_bowl_mass_facade_frames", mullion, root, head, .22, .25)
        if i % 4 == 0:
            bar("shell_bowl_mass_facade_frames", mullion,
                contour(a - math.tau / PANELS, 7.10, .29), contour(b, 16.0, .29), .48)
            bar("shell_bowl_mass_facade_frames", mullion,
                contour(b, 16.0, .29), contour(b + 2 * math.tau / PANELS, 7.10, .29), .48)

    entrance = [-.46 + i * .92 / 22 for i in range(23)]
    wall_strip("shell_ribbon_led_housing", frame,
               [[contour(a, y, -.49) for a in entrance] for y in (12.2, 19.75)], close=False)
    wall_strip("shell_ribbon_led_facade", screen,
               [[contour(a, y, -.56) for a in entrance[1:-1]] for y in (12.57, 19.41)], close=False)
    wall_strip("shell_bowl_mass_facade_panels", limestone,
               [[contour(a, y, inset) for a in entrance] for y, inset in ((3.12, -.25), (3.12, -4.6),
                                                                          (3.40, -4.6), (3.40, -.25))], close=False)
    for a in entrance[1:-1:3]:
        bar("shell_bowl_mass_facade_frames", mullion, contour(a, -.19, -4.1), contour(a, 3.12, -4.1), .22)
        bar("shell_vomitories_static", warm, contour(a - .016, 3.075, -3.8), contour(a + .016, 3.075, -3.8), .084)

    # Permanent premium tiers on the long sides. The fronts stand behind the
    # source backrest envelope. The shaded cavity gives the glazing depth.
    for sign in (-1, 1):
        for y in (10.33, 13.84):
            box("shell_bowl_mass_suite_concrete", concrete, (sign * 37.6, y, -5.9), (5.4, .34, 58.0))
            box("shell_bowl_mass_suite_concrete", concrete, (sign * 40.1, y + 1.65, -5.9), (.32, 3.2, 58.0))
            for z in range(-33, 23, 5):
                box("shell_bowl_mass_suite_glass", suite, (sign * 35.34, y + 1.65, z), (.07, 2.19, 4.66))
                box("shell_bowl_mass_facade_frames", mullion, (sign * 35.34, y + 1.61, z + 2.37), (.12, 2.48, .15))
                box("shell_vomitories_static", warm, (sign * 38.20, y + 2.73, z), (.14, .09, 4.20))

    # The permanent upper rear landings reach the concourse wall. Each section
    # stops before a neighbouring aisle or a change in rear-row elevation.
    landings = 0
    for path in ANCHORS["backs"]:
        for i in range(1, len(path) - 2):
            a, b = path[i:i + 2]
            corners = []
            for x, y, z in (a, b):
                radius = math.hypot(x, z - CENTER_Z)
                along_x, along_z = x / radius, (z - CENTER_Z) / radius
                angle = math.atan2(math.copysign(abs(along_z / (RADIUS_Z - 1.6)) ** 1.25, along_z),
                                   math.copysign(abs(along_x / (RADIUS_X - 1.6)) ** 1.25, along_x))
                inner = (x + along_x * .22, y - .09, z + along_z * .22)
                outer = contour(angle, y - .09, 1.58)
                corners.append((inner, outer))
            top = [corners[0][0], corners[1][0], corners[1][1], corners[0][1]]
            points = [(x, y - .37, z) for x, y, z in top] + top
            if keep_clear(points, PRISM_FACES, checks):
                add("shell_bowl_mass_rear_concourse", concrete, points, PRISM_FACES)
                landings += 1

    balustrades = 0
    for a, b in ANCHORS["galleries"]:
        if math.dist(a, b) < .07:
            continue
        moved = []
        for x, y, z in (a, b):
            r = max(1, math.hypot(x, z))
            moved.append((x - .22 * x / r, y + .025, z - .22 * z / r))
        a, b = moved
        top_a, top_b = [(x, y + .82, z) for x, y, z in (a, b)]
        glass = [a, b, top_b, top_a]
        rail = bar_points(top_a, top_b, .055)
        if keep_clear(glass, [(0, 1, 2, 3)], checks) and keep_clear(rail, BOX_FACES, checks):
            add("shell_balustrades_glass", suite, glass, [(0, 1, 2, 3)])
            add("shell_balustrades_rail", mullion, rail, BOX_FACES)
            balustrades += 1
    suite.use_backface_culling = False

    # A continuous rear passage connects the upper edge of each stair portal.
    # It stays outside the documented aisle and chair envelopes.
    band("shell_bowl_mass_rear_concourse", concrete, 6.20, 6.55, 1.85, 1.97)
    band("shell_bowl_mass_facade_frames", frame, 6.53, 6.64, 3.79, .14)
    band("shell_vomitories_static", warm, 6.57, 6.66, 3.88, .07)

    # Exterior-facing portals lead from the outer landing into the lower ring.
    # Each vestibule has a setback wall with side jambs and a visible lintel.
    for index in (6, 18, 33, 46, 60, 74, 89, 102):
        a = ANGLES[index]
        x, _, z = contour(a, 0, 3.05)
        before, after = contour(a - .002, 0, 3.05), contour(a + .002, 0, 3.05)
        yaw = math.atan2(before[2] - after[2], after[0] - before[0])
        tangent = (math.cos(yaw), -math.sin(yaw))
        for side in (-1, 1):
            box("shell_vomitories", frame, (x + tangent[0] * side * 1.53, 8.0, z + tangent[1] * side * 1.53),
                (.31, 2.61, .70), yaw)
        box("shell_vomitories", frame, (x, 9.34, z), (3.36, .38, .70), yaw)
        box("shell_vomitories_static", warm, (x, 9.35, z), (.83, .16, .72), yaw)
        box("shell_vomitories", frame, (x, 6.63, z), (3.36, .27, .71), yaw)

    band("shell_ribbon_led_housing", frame, 27.52, 28.53, 2.24, .38)
    band("shell_ribbon_led", ribbon, 27.70, 28.36, 2.68, .065)

    # The secondary ice hall is read from the architect's reference as an
    # attached lower volume. It carries no modeled interior or ticket data.
    annex_angles = ANGLES[::2]

    def annex(a, scale, y):
        return (18 + 26.5 * scale * math.cos(a), y, -64.2 + 17.2 * scale * math.sin(a))

    def annex_roof(a, scale):
        return 17.35 - 4.4 * scale ** 1.7 + .8 * scale * math.sin(a)

    wall_strip("shell_bowl_mass_enclosure_annex", concrete,
               [[annex(a, .94, -.22) for a in annex_angles],
                [annex(a, .94, annex_roof(a, .94) - .18) for a in annex_angles]])
    wall_strip("shell_bowl_mass_curtain_wall", glazing,
               [[annex(a, 1, y) for a in annex_angles] for y in (0, 5.0, 9.1)]
               + [[annex(a, 1, annex_roof(a, 1) - .14) for a in annex_angles]])
    for a in annex_angles:
        bar("shell_bowl_mass_facade_frames", mullion, annex(a, 1.006, .04),
            annex(a, 1.006, annex_roof(a, 1.006) - .16), .17)
    wall_strip("shell_bowl_mass_facade_panels", limestone,
               [[annex(a, 1.009, y) for a in annex_angles] for y in (4.86, 5.13)])
    annex_rings = [[annex(a, t, annex_roof(a, t)) for a in annex_angles]
                   for t in [.2, .4, .6, .8, 1.035]]
    wall_strip("shell_roof_canopy", skin, annex_rings)
    add("shell_roof_canopy", skin, [(18, 17.35, -64.2)] + annex_rings[0],
        [(0, (i + 1) % len(annex_angles) + 1, i + 1) for i in range(len(annex_angles))])

    # Roof-on presents a skewed titanium lens. Connecting ribs give the same
    # contour visible depth in the seat-level camera.
    roof_rings = [[roof_at(a, delta / 16) for a in ANGLES] for delta in range(1, 17)]
    wall_strip("shell_roof_canopy", skin, roof_rings)
    cap = roof_at(0, 0)
    add("shell_roof_canopy", skin, [cap] + roof_rings[0],
        [(0, (i + 1) % PANELS + 1, i + 1) for i in range(PANELS)])
    wall_strip("shell_roof_canopy", skin,
               [[roof_at(a, 1, lift) for a in ANGLES] for lift in (0, -.65)])
    # Match the canopy's radial tessellation so the seam stays above each facet.
    for index in range(0, PANELS, 2):
        a = ANGLES[index]
        rings = []
        for i in range(3, 17):
            p = Vector(roof_at(a, i / 16, .033))
            tangent = (Vector(roof_at(ANGLES[(index + 1) % PANELS], i / 16)) - p).normalized()
            rings.append([tuple(p + side * .067 * tangent) for side in (-1, 1)])
        wall_strip("shell_roof_canopy_seams", seams, rings, close=False)
    for index in range(0, PANELS // 2, 4):
        a = ANGLES[index]
        op = a + math.pi
        upper = [roof_at(a, i / 8, -.64) for i in range(8, 0, -1)] + [roof_at(0, 0, -.64)] + [roof_at(op, i / 8, -.64) for i in range(1, 9)]
        lower = [(x, y - (1.0 if n in (0, 16) else 1.5), z) for n, (x, y, z) in enumerate(upper)]
        for i in range(len(upper)):
            bar("shell_roof_truss", truss, lower[i], upper[i], .24)
            if i:
                bar("shell_roof_truss", truss, upper[i - 1], upper[i], .38)
                bar("shell_roof_truss", truss, lower[i - 1], lower[i], .32)
                bar("shell_roof_truss", truss, upper[i - 1], lower[i], .22)
    for i, a in enumerate(ANGLES):
        next_a = ANGLES[(i + 1) % PANELS]
        bar("shell_roof_truss", truss, roof_at(a, .975, -.89), roof_at(next_a, .975, -.89), .31, .44)

    for (name, mat), (points, polygons) in batches.items():
        mesh = bpy.data.meshes.new(name)
        mesh.from_pydata([(x, -z, y) for x, y, z in points], [], polygons)
        mesh.validate()
        bm = bmesh.new()
        bm.from_mesh(mesh)
        bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
        bm.to_mesh(mesh)
        bm.free()
        node = bpy.data.objects.new(name, mesh)
        bpy.context.collection.objects.link(node)
        node.data.materials.append(mat)
        if name == "shell_field_floor_plaza":
            node["unshadowed"] = True
    return {"curtainWallBays": PANELS, "sharedGalleryPanels": balustrades, "rearLandingPanels": landings}


def clearance(checks):
    geometry = [(name, BVHTree.FromPolygons(vertices, faces))
                for (name, _), (vertices, faces) in batches.items()]
    lowest_roof = min(point[1] for (name, _), (vertices, _) in batches.items()
                      if name == "shell_roof_truss" for point in vertices)
    report = {}
    for layout, chairs, aisles, stage in checks:
        gap = lowest_roof - max(p["p"][1] for p in layout["chairs"])
        chair_hits = [name for name, mesh in geometry if mesh.overlap(chairs)]
        aisle_hits = [name for name, mesh in geometry if mesh.overlap(aisles)]
        stage_hits = [name for name, mesh in geometry if any(mesh.overlap(part) for part in stage)]
        if chair_hits or aisle_hits or stage_hits or gap <= 3:
            raise ValueError(f"{layout['id']} overlaps: chairs {chair_hits}, aisles {aisle_hits}, stages {stage_hits}; roof {gap:.3f} m")
        report[layout["id"]] = {
            "chairsChecked": len(layout["chairs"]), "aisleTreadsChecked": len(layout["aisles"]),
            "aisleHeightChecked": 2.1, "stagePartsChecked": len(stage),
            "seatIntersections": len(chair_hits), "aisleIntersections": len(aisle_hits),
            "stageIntersections": len(stage_hits), "roofTrussClearance": round(gap, 3),
        }
    return report


def export():
    path = HERE / "shell.glb"
    bpy.ops.export_scene.gltf(filepath=str(path), export_format="GLB", export_yup=True,
                            export_apply=True, export_extras=True)
    data = path.read_bytes()
    magic, version, size, length, chunk = struct.unpack_from("<4s4I", data)
    if (magic, version, size, chunk) != (b"glTF", 2, len(data), 0x4e4f534a):
        raise ValueError("Invalid GLB header")
    doc = json.loads(data[20:20 + length])
    nodes = [node for node in doc["nodes"] if "mesh" in node]
    if any(set(node).intersection({"matrix", "translation", "rotation", "scale"}) for node in nodes):
        raise ValueError("Shell must use baked world coordinates")
    accessors = [doc["accessors"][primitive["attributes"]["POSITION"]]
                 for mesh in doc["meshes"] for primitive in mesh["primitives"]]
    if len(data) > 3_000_000 or len(accessors) > 24:
        raise ValueError(f"Shell budget exceeded: {len(data)} bytes in {len(accessors)} draw primitives")
    bounds = {"min": [round(min(a["min"][axis] for a in accessors), 3) for axis in range(3)],
              "max": [round(max(a["max"][axis] for a in accessors), 3) for axis in range(3)]}
    return {
        "bounds": bounds, "assetBytes": len(data), "meshPrimitives": len(accessors),
        "roofNodeNames": sorted(n["name"] for n in nodes if n["name"].startswith("shell_roof_")),
        "ribbonNodeNames": sorted(n["name"] for n in nodes if n["name"].startswith("shell_ribbon_led")),
    }


if __name__ == "__main__":
    checks = source_clearances()
    features = build(checks)
    report = clearance(checks)
    manifest = {
        "venueId": ANCHORS["venueId"], "generator": "blender-bpy", "version": 1,
        "coordinateSystem": "source-model-xyz", "upAxis": "+Y", "units": "metres",
        "lightingPreset": "arena-dark", "precision": "illustrative architecture, retained source seats",
        "references": [
            "https://www.archasia.asia/projects/taipeiarena-stadium",
            "https://www.bes.com.tw/project_gov_detail.php?id=52",
            "https://www.arena.taipei/cp.aspx?n=DBBAC48E714B28C5&s=BC87E8ACAE8723FC",
        ],
        "limitations": [
            "Asymmetric titanium canopy, glazed curtain wall and curved LED frontage follow published building references.",
            "The inferred exterior fits the retained end- and center-stage seating envelopes. Dimensions and details are illustrative.",
            "Every seat and event remains supplied by the existing viewer. No third-party asset is embedded.",
        ],
        "features": features,
        "clearance": report,
        **export(),
    }
    (HERE / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
