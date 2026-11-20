"""Generate the Hong Kong Coliseum shell in Blender 5.2+.

Run from any working directory with:
  blender --background --python-exit-code 1 --python models/venues/hong-kong-coliseum/build.py
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
LAYOUT = json.loads(subprocess.check_output(["node", str(HERE / "anchors.mjs")], text=True))
FACES = [(0, 2, 3, 1), (4, 5, 7, 6), (0, 1, 5, 4),
         (2, 6, 7, 3), (0, 4, 6, 2), (1, 3, 7, 5)]
batches = {}


def material(name, color, roughness, metal=0, alpha=1, emission=0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, alpha)
    shader = mat.node_tree.nodes["Principled BSDF"]
    shader.inputs["Base Color"].default_value = (*color, 1)
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Metallic"].default_value = metal
    shader.inputs["Alpha"].default_value = alpha
    shader.inputs["Emission Color"].default_value = (*color, 1)
    shader.inputs["Emission Strength"].default_value = emission
    if alpha < 1:
        mat.surface_render_method = "BLENDED"
    return mat


def add(name, mat, vertices, faces):
    points, polygons = batches.setdefault((name, mat), ([], []))
    offset = len(points)
    points.extend(vertices)
    polygons.extend(tuple(offset + i for i in face) for face in faces)


def box_points(center, size, angle=0):
    x, y, z = center
    w, h, d = (n / 2 for n in size)
    c, s = math.cos(angle), math.sin(angle)
    return [(x + dx * c + dz * s, y + dy, z - dx * s + dz * c)
            for dy in (-h, h) for dx in (-w, w) for dz in (-d, d)]


def box(name, mat, center, size, angle=0):
    add(name, mat, box_points(center, size, angle), FACES)


def bar(name, mat, start, end, width, depth=None):
    a, b = Vector(start), Vector(end)
    axis = (b - a).normalized()
    helper = Vector((0, 1, 0)) if abs(axis.y) < .92 else Vector((0, 0, 1))
    right = axis.cross(helper).normalized() * width / 2
    up = right.normalized().cross(axis) * (depth or width) / 2
    vertices = [tuple(p + sx * right + sy * up) for p in (a, b)
                for sx in (-1, 1) for sy in (-1, 1)]
    add(name, mat, vertices, FACES)


def ring(name, mat, layers):
    count = len(layers[0])
    faces = [(level + i, level + (i + 1) % count,
              (level + count) % (count * len(layers)) + (i + 1) % count,
              (level + count) % (count * len(layers)) + i)
             for level in range(0, count * len(layers), count) for i in range(count)]
    add(name, mat, [p for layer in layers for p in layer], faces)


def square(r, y):
    return [(-r, y, -r), (r, y, -r), (r, y, r), (-r, y, r)]


def square_point(angle, r, y):
    s, c = math.sin(angle), math.cos(angle)
    scale = r / max(abs(s), abs(c))
    return (s * scale, y, c * scale)


def side_point(side, offset, y, radius):
    angle = side * math.pi / 2
    c, s = math.cos(angle), math.sin(angle)
    return (offset * c + radius * s, y, -offset * s + radius * c)


def rear_walkway(back_anchors, concrete, radius_at):
    steps = 192
    anchors = sorted((math.atan2(x, z), math.hypot(x, z), y) for x, y, z in back_anchors)
    angles = [(-math.pi + i * math.tau / steps) for i in range(steps)]
    inner, outer = [], []
    for angle in angles:
        # Choose the outer end of the local fixed seating bank. Radius padding
        # leaves the complete upper tread visible and accommodates segment seams.
        near = [point for point in anchors if abs(math.remainder(point[0] - angle, math.tau)) < .052]
        _, radius, y = max(near, key=lambda point: point[1])
        level = y - .10
        facade = radius_at(level)
        # Some rear anchors are further out than the concourse at their level.
        # Keep the inner edge inside the outer edge without moving any chairs.
        limit = (facade - .76) / max(abs(math.sin(angle)), abs(math.cos(angle)))
        r = min(radius + .42, limit)
        inner.append((r * math.sin(angle), level, r * math.cos(angle)))
        outer.append(square_point(angle, facade - .64, level))
    # Each bay is a convex 3D cell. Keeping individual cells preserves seams
    # where rear rows finish at different levels around the four banks.
    for i in range(steps):
        j = (i + 1) % steps
        corners = [inner[i], inner[j], outer[j], outer[i]]
        add("shell_bowl_mass_rear_concourse", concrete,
            [(x, y - .46, z) for x, y, z in corners] + corners,
            [(0, 1, 2, 3), (7, 6, 5, 4), (0, 4, 5, 1), (1, 5, 6, 2),
             (2, 6, 7, 3), (3, 7, 4, 0)])


def build():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    bpy.context.scene.unit_settings.system = "METRIC"

    ivory = material("Warm concrete", (.44, .40, .35), .78, emission=.12)
    seams = material("Facade mullions", (.26, .23, .19), .65, .24)
    basalt = material("Basalt plinth", (.088, .096, .106), .84)
    landing = material("Concourse cement", (.153, .161, .168), .84)
    glass = material("Smoke-blue laminated glass", (.22, .4, .52), .29, .14, .28)
    steel = material("Satin stainless steel", (.26, .31, .36), .49, .66)
    frame = material("Charcoal door reveals", (.046, .056, .065), .84)
    bronze = material("Door bronze", (.23, .145, .082), .57, .62)
    light = material("Recessed amber LED", (.92, .38, .13), .43, emission=.8)
    roof = material("Roof zinc panels", (.43, .48, .49), .61, .28)
    truss = material("Roof lattice steel", (.22, .25, .28), .55, .58)
    deck = material("Arena dark graphite", (.093, .103, .114), .8)
    score = material("Arena construction joints", (.103, .114, .126), .88)

    source = [seat["p"] for layout in LAYOUT["layouts"] for seat in layout["chairs"]]
    seat_top = max(y for _, y, _ in source)
    fixed_radius = max(max(abs(x), abs(z)) for x, _, z in LAYOUT["rear"])
    roof_level = seat_top + 6.1
    cap_radius = fixed_radius + 7.0
    # The model coordinates are uncalibrated. Use the retained bowl to keep
    # the characteristic four inclined sides outside both sets of chairs.
    plinth_radius = 28.2
    facade_offset = .40
    base_y = 1.38
    side_slope = (cap_radius - plinth_radius) / (roof_level - base_y)

    def radius_at(y):
        return plinth_radius + side_slope * (y - base_y)

    box("shell_field_floor", basalt, (0, -.38, 0), (cap_radius * 2 + 8, .6, cap_radius * 2 + 8))
    box("shell_field_floor_arena", deck, (0, -.142, 0), (54.6, .14, 54.6))
    for offset in range(-24, 25, 4):
        # Slightly raised construction joints break the large flat surface
        # while keeping the entire finished floor below stage and chair bases.
        box("shell_field_floor_joints", score, (offset, -.041, 0), (.027, .013, 52.8))
        box("shell_field_floor_joints", score, (0, -.041, offset), (52.8, .013, .027))

    ring("shell_bowl_mass_plinth", basalt,
         [square(plinth_radius + .5, -.08), square(plinth_radius + .5, base_y + .04),
          square(plinth_radius - .30, base_y + .04), square(plinth_radius - .30, -.08)])
    ring("shell_bowl_mass_inverted_pyramid", ivory,
         [square(plinth_radius + facade_offset, base_y), square(cap_radius + facade_offset, roof_level),
          square(cap_radius - .84, roof_level), square(plinth_radius - .84, base_y)])
    rear_walkway(LAYOUT["rear"], landing, radius_at)

    for side in range(4):
        for k in range(-9, 10):
            fraction = k / 10
            a = side_point(side, fraction * (plinth_radius - .4), base_y + .12, radius_at(base_y + .12) + facade_offset + .025)
            b = side_point(side, fraction * (cap_radius - .6), roof_level - .12, radius_at(roof_level - .12) + facade_offset + .025)
            bar("shell_bowl_mass_facade_seams", seams, a, b, .060)
        for k in (-2, -1, 1, 2):
            x = k * 5.4
            box("shell_bowl_mass_plinth", basalt, side_point(side, x, .55, plinth_radius + .6),
                (4.8, 1.26, 2.30), side * math.pi / 2)

        # Thresholds sit outside the audience bank. The sidewalls reach back
        # to the inclined facade, leaving a visible open recess below the lintel.
        for k in (-1, 1):
            offset = k * 11.4
            y = 18.78
            front = radius_at(y) - .78
            box("shell_vomitories", frame, side_point(side, offset, y - .07, front + .26),
                (2.8, .14, .57), side * math.pi / 2)
            for dx in (-1.28, 1.28):
                box("shell_vomitories", frame, side_point(side, offset + dx, y + 1.04, front + .26),
                    (.24, 2.08, .58), side * math.pi / 2)
            box("shell_vomitories", frame, side_point(side, offset, y + 2.15, front + .26),
                (2.8, .22, .58), side * math.pi / 2)
            box("shell_vomitories_recess", bronze, side_point(side, offset, y + .98, front + .60),
                (2.30, 1.96, .085), side * math.pi / 2)
            box("shell_vomitories_wayfinding", light, side_point(side, offset, y + 2.16, front - .10),
                (.62, .13, .04), side * math.pi / 2)

        for offset in (-23, 0, 23):
            x = radius_at(23) - 1.34
            box("shell_ribbon_led_housing", frame, side_point(side, offset, 23, x),
                (17.2, .72, .24), side * math.pi / 2)
            box("shell_ribbon_led", light, side_point(side, offset, 23, x - .15),
                (16.9, .32, .052), side * math.pi / 2)

    galleries = []
    for a, b in LAYOUT["sharedGalleries"]:
        mid_x, mid_z = (a[0] + b[0]) / 2, (a[2] + b[2]) / 2
        radius = math.hypot(mid_x, mid_z)
        toward_floor = (mid_x / radius, mid_z / radius)
        a, b = [(x - .19 * toward_floor[0], y + .04, z - .19 * toward_floor[1]) for x, y, z in (a, b)]
        if math.dist(a, b) > .035:
            galleries.append([a, b])
            hi_a, hi_b = [(x, y + .76, z) for x, y, z in (a, b)]
            add("shell_balustrades_glass", glass, [a, b, hi_b, hi_a], [(0, 1, 2, 3)])
            bar("shell_balustrades_rail", steel, hi_a, hi_b, .041, .06)

    # Flat folded roof over the four-sided inner lattice. Mass and concourse
    # remain in place when the roof and truss are toggled away in the viewer.
    box("shell_roof_canopy", roof, (0, roof_level + .45, 0), (cap_radius * 2 + .44, .70, cap_radius * 2 + .44))
    ring("shell_roof_canopy_coping", ivory,
         [square(cap_radius + .65, roof_level - .34), square(cap_radius + .65, roof_level + 1.04),
          square(cap_radius - .42, roof_level + 1.04), square(cap_radius - .42, roof_level - .34)])
    for i in range(-7, 8):
        offset = i * cap_radius / 8
        box("shell_roof_canopy_standing_seams", seams, (offset, roof_level + .862, 0),
            (.093, .085, cap_radius * 2))
    for swap in (False, True):
        for grid in (-.66, -.33, 0, .33, .66):
            across = cap_radius * grid
            span = cap_radius - 1
            step = span / 6
            stations = [-span + 2 * i * step for i in range(7)]

            def pos(along, y):
                return (across, y, along) if swap else (along, y, across)

            bar("shell_roof_truss", truss, pos(-span, roof_level + .05), pos(span, roof_level + .05), .34)
            bar("shell_roof_truss", truss, pos(-span, roof_level - 1.75), pos(span, roof_level - 1.75), .29)
            for i, t in enumerate(stations):
                bar("shell_roof_truss", truss, pos(t, roof_level + .05), pos(t, roof_level - 1.75), .23)
                if i:
                    mid = t - step
                    bar("shell_roof_truss", truss, pos(t, roof_level + .05), pos(mid, roof_level - 1.75), .21)
                    bar("shell_roof_truss", truss, pos(stations[i - 1], roof_level + .05), pos(mid, roof_level - 1.75), .21)

    for (name, mat), (points, faces) in batches.items():
        mesh = bpy.data.meshes.new(name)
        mesh.from_pydata([(x, -z, y) for x, y, z in points], [], faces)
        mesh.validate()
        bm = bmesh.new()
        bm.from_mesh(mesh)
        bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
        bm.to_mesh(mesh)
        bm.free()
        node = bpy.data.objects.new(name, mesh)
        bpy.context.collection.objects.link(node)
        node.data.materials.append(mat)
        if name == "shell_bowl_mass_inverted_pyramid":
            # Trim inferred runtime bank undersides at this inner skin.
            # The chair and ticket layers remain outside this rendering rule.
            node["interiorClip"] = [base_y, plinth_radius - .32, side_slope]
        if name == "shell_field_floor":
            # Interior bank shadow lengths are illustrative. Keep their
            # cascades from painting striped outlines on the exterior piazza.
            node["unshadowed"] = True
    return {"sharedGalleryPanels": len(galleries), "rearProfileAnchors": len(LAYOUT["rear"])}


def clearance():
    report = {}
    base_y, base_radius, slope = bpy.data.objects["shell_bowl_mass_inverted_pyramid"]["interiorClip"]

    def margin(points):
        return min(base_radius + slope * (y - base_y) - max(abs(x), abs(z)) for x, y, z in points)

    geometry = {name: BVHTree.FromPolygons(vertices, faces)
                for (name, _), (vertices, faces) in batches.items()}
    exterior_margin = margin([point for (name, _), (points, _) in batches.items()
                              if name.startswith(("shell_vomitories", "shell_ribbon_led", "shell_bowl_mass_rear_concourse"))
                              for point in points])
    if exterior_margin <= -.28:
        raise ValueError(f"Interior portal, ribbon, or concourse protrudes through the exterior facade: {exterior_margin:.3f} m")
    height = min(p[1] for (name, _), (vertices, _) in batches.items()
                 if name.startswith("shell_roof_truss") for p in vertices)
    for layout in LAYOUT["layouts"]:
        # A local seat box encloses the runtime chair, including the slightly
        # rear-shifted backrest and both front and rear rounded profiles.
        chairs_vertices, chairs_faces = [], []
        for seat in layout["chairs"]:
            x, y, z = seat["p"]
            angle = seat["angle"]
            width = seat["width"]
            size = (.52 * width, .72, .51)
            center = (x - math.sin(angle) * .014, y + .36, z - math.cos(angle) * .014)
            offset = len(chairs_vertices)
            chairs_vertices.extend(box_points(center, size, angle))
            chairs_faces.extend(tuple(offset + i for i in face) for face in FACES)
        chairs = BVHTree.FromPolygons(chairs_vertices, chairs_faces)
        stages = [BVHTree.FromPolygons(box_points(part["center"], part["size"], part.get("angle", 0)), FACES)
                  for part in layout["stage"]]
        # Walking envelopes start just above each existing tread and retain
        # 2.1 m overhead clearance along the entire inferred aisle.
        aisles_vertices, aisles_faces = [], []
        for aisle in layout["aisles"]:
            offset = len(aisles_vertices)
            aisles_vertices.extend((x, y + lift, z) for lift in (.02, 2.12) for x, y, z in aisle)
            aisles_faces.extend(tuple(offset + i for i in face) for face in
                                [(0, 1, 2, 3), (7, 6, 5, 4), (0, 4, 5, 1), (1, 5, 6, 2),
                                 (2, 6, 7, 3), (3, 7, 4, 0)])
        aisles = BVHTree.FromPolygons(aisles_vertices, aisles_faces)
        overlaps = {name: len(hits) for name, mesh in geometry.items() if (hits := mesh.overlap(chairs))}
        aisle_overlaps = [name for name, mesh in geometry.items() if mesh.overlap(aisles)]
        stage_overlaps = [name for name, mesh in geometry.items() if any(mesh.overlap(stage) for stage in stages)]
        gap = height - max(seat["p"][1] for seat in layout["chairs"])
        clip_margin = margin(chairs_vertices + aisles_vertices)
        if overlaps or stage_overlaps or aisle_overlaps or gap <= 3 or clip_margin <= .25:
            raise ValueError(f"{layout['id']} clearance: chair triangles {overlaps}, stages {stage_overlaps}, aisles {aisle_overlaps}, roof {gap:.3f} m, clip {clip_margin:.3f} m")
        report[layout["id"]] = {
            "chairsChecked": len(layout["chairs"]), "stagePartsChecked": len(stages),
            "aisleTreadsChecked": len(layout["aisles"]), "aisleHeightChecked": 2.1,
            "seatIntersections": sum(overlaps.values()), "stageIntersections": len(stage_overlaps),
            "aisleIntersections": len(aisle_overlaps),
            "lowestRoofTrussAboveHighestSeatBase": round(gap, 3),
            "smallestChairOrAisleMarginInsideFacade": round(clip_margin, 3),
        }
    return report


def export_shell():
    path = HERE / "shell.glb"
    bpy.ops.export_scene.gltf(filepath=str(path), export_format="GLB", export_yup=True, export_apply=True, export_extras=True)
    data = path.read_bytes()
    magic, version, total, length, chunk = struct.unpack_from("<4s4I", data)
    if (magic, version, total, chunk) != (b"glTF", 2, len(data), 0x4e4f534a):
        raise ValueError("Invalid exported glTF header")
    document = json.loads(data[20:20 + length])
    nodes = [node for node in document["nodes"] if "mesh" in node]
    if any(set(node).intersection({"matrix", "translation", "rotation", "scale"}) for node in nodes):
        raise ValueError("Shell must export in the baked world coordinate frame")
    positions = [document["accessors"][primitive["attributes"]["POSITION"]]
                 for mesh in document["meshes"] for primitive in mesh["primitives"]]
    bounds = {"min": [round(min(a["min"][i] for a in positions), 3) for i in range(3)],
              "max": [round(max(a["max"][i] for a in positions), 3) for i in range(3)]}
    if len(data) > 3_000_000 or len(positions) > 20:
        raise ValueError(f"Shell budget exceeded: {len(data)} bytes and {len(positions)} draw primitives")
    return {
        "bounds": bounds,
        "roofNodeNames": sorted(node["name"] for node in nodes if node["name"].startswith("shell_roof_")),
        "ribbonNodeNames": sorted(node["name"] for node in nodes if node["name"].startswith("shell_ribbon_led")),
        "assetBytes": len(data),
        "meshPrimitives": len(positions),
    }


def main():
    features = build()
    clearances = clearance()
    gltf = export_shell()
    manifest = {
        "venueId": LAYOUT["venueId"],
        "generator": "blender-bpy",
        "version": 1,
        "coordinateSystem": "source-model-xyz",
        "upAxis": "+Y",
        "unit": "meter",
        "lightingPreset": "arena-dark",
        "modelQuality": "illustrative source-aligned architectural shell",
        "positionBasis": "retained center and end seating profiles, without surveyed calibration",
        "sources": [
            "https://www.lcsd.gov.hk/en/hkc/aboutus/abouthongkongcoliseum.html",
            "https://www.lcsd.gov.hk/en/hkc/aboutus/photogallery/historicalphotos.html",
            "https://www.lcsd.gov.hk/en/hkc/common/form/hkc_tec_e.pdf",
        ],
        "limitations": [
            "The inverted-pyramid massing follows LCSD references. Exterior dimensions, concourse details, roof framing and materials are interpretive.",
            "Roof height is fitted to the retained model's chair envelope and preview clearance. LCSD lists 23 m for the arena height.",
            "Runtime seat banks and events retain their separate coordinates, geometry, and ticket semantics.",
            "Original procedural mesh and material colors generated by this script. No external mesh or texture is embedded.",
        ],
        "features": features,
        "clearance": clearances,
        **gltf,
    }
    (HERE / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
