"""Build the original Kai Tak Arena Grand Hall shell with Blender 5.2."""
import json
import math
from pathlib import Path
import struct
import subprocess

import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree

HERE = Path(__file__).resolve().parent
ID = "kai-tak-arena"
BUDGET = 3_000_000
ANCHORS = json.loads(subprocess.check_output(["node", str(HERE / "anchors.mjs")]))
BOX_FACES = ((0, 2, 3, 1), (4, 5, 7, 6), (0, 1, 5, 4),
             (2, 6, 7, 3), (0, 4, 6, 2), (1, 3, 7, 5))
batches = {}


def material(name, rgb, roughness, metal=0, emission=0, alpha=1):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*rgb, alpha)
    shader = mat.node_tree.nodes["Principled BSDF"]
    shader.inputs["Base Color"].default_value = (*rgb, 1)
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Metallic"].default_value = metal
    shader.inputs["Emission Color"].default_value = (*rgb, 1)
    shader.inputs["Emission Strength"].default_value = emission
    shader.inputs["Alpha"].default_value = alpha
    if alpha < 1:
        mat.surface_render_method = "BLENDED"
    return mat


def add(name, mat, points, faces):
    verts, polys = batches.setdefault((name, mat), ([], []))
    start = len(verts)
    verts.extend(points)
    polys.extend(tuple(start + index for index in face) for face in faces)


def box_points(center, size, angle=0):
    x, y, z = center
    w, h, d = (n / 2 for n in size)
    c, s = math.cos(angle), math.sin(angle)
    return [(x + dx*c + dz*s, y + dy, z - dx*s + dz*c) for dy in (-h, h)
            for dx in (-w, w) for dz in (-d, d)]


def box(name, mat, center, size):
    add(name, mat, box_points(center, size), BOX_FACES)


def bar(name, mat, start, end, width, depth=None):
    axis = (Vector(end) - Vector(start)).normalized()
    up = Vector((0, 1, 0)) if abs(axis.y) < .93 else Vector((0, 0, 1))
    cross = axis.cross(up).normalized()
    right = cross * width / 2
    climb = cross.cross(axis) * (depth or width) / 2
    points = [tuple(Vector(p) + dx * right + dz * climb) for p in (start, end)
              for dx in (-1, 1) for dz in (-1, 1)]
    add(name, mat, points, BOX_FACES)


def chamfer(w, length, cut, y):
    return [(x, y, z) for x, z in (
        (-w+cut, -length), (w-cut, -length), (w, -length+cut),
        (w, length-cut), (w-cut, length), (-w+cut, length),
        (-w, length-cut), (-w, -length+cut),
    )]


def at_y(points, y):
    return [(x, y, z) for x, _, z in points]


def band(name, mat, lower, upper, inward=False):
    for i, first in enumerate(lower):
        j = (i + 1) % len(lower)
        quad = (first, upper[i], upper[j], lower[j])
        add(name, mat, quad[::-1] if inward else quad, [(0, 1, 2, 3)])


def slab(name, mat, lower, upper):
    band(name, mat, lower, upper)
    add(name, mat, upper, [tuple(reversed(range(len(upper))))])
    add(name, mat, lower, [tuple(range(len(lower)))])


def build_floor(concrete):
    footing = chamfer(51.7, 64.6, 5.5, -.235)
    slab("shell_bowl_mass_plaza", concrete, at_y(footing, -1.0), footing)
    base = material("Rubberized arena floor", (.084, .105, .112), .71)
    oak = [material("Warm sports timber " + str(i + 1), c, .54)
           for i, c in enumerate(((.238, .148, .091), (.262, .169, .102), (.211, .137, .088)))]
    box("shell_field_floor_subfloor", base, (0, -.25, 0), (95, .30, 118))
    y = -.042
    for row in range(104):
        z, next_z = -27.5 + row*55/104, -27.5 + (row+1)*55/104
        cut = -10.2 + (row * 11 % 29) * .68
        for segment, (left, right) in enumerate(zip((-20.5, cut, 12.7), (cut, 12.7, 20.5))):
            tone = (row * 17 + segment * 29 + row // 7) % len(oak)
            add(f"shell_field_floor_timber_{tone+1}", oak[tone],
                [(left,y,z), (left,y,next_z), (right,y,next_z), (right,y,z)], [(0,1,2,3)])


def build_bowl(concrete, charcoal, trim):
    glass = material("Neutral balustrade glazing", (.13, .236, .26), .30, .12, alpha=.43)
    lamp = material("Perimeter aisle markers", (.48, .61, .59), .44, emission=.55)
    ribbon = material("Concourse LED displays", (.13, .37, .52), .38, emission=.75)
    seating = [
        material("Grand Hall pine green", (.073, .171, .095), .68),
        material("Grand Hall spring green", (.13, .275, .13), .63),
        material("Grand Hall charcoal gray", (.072, .095, .101), .71),
    ]
    for tier, (front, rear) in enumerate(ANCHORS["rims"]):
        label = str(tier + 1)
        bed = -.18 if tier == 0 else front[0][1] - .50
        under_front = [(x, y-.36, z) for x, y, z in front]
        under_rear = [(x, y-.36, z) for x, y, z in rear]
        band(f"shell_bowl_mass_tier_{label}_front", charcoal, at_y(front, bed), under_front, inward=True)
        band(f"shell_bowl_mass_tier_{label}_soffit", concrete, under_front, under_rear, inward=True)
        band(f"shell_bowl_mass_tier_{label}_rear", concrete, at_y(rear, bed), under_rear)
        if tier == 0:
            continue
        # The rear concourse continues at the last tread height to the acoustic lining.
        walk_y = rear[0][1] - .15
        walk_start = [(x*1.006, walk_y, z*1.006) for x, _, z in rear]
        walk_end = []
        for x, _, z in rear:
            radial_extension = min(45.9/max(abs(x), .01), 57.6/max(abs(z), .01))
            walk_end.append((x*radial_extension, walk_y, z*radial_extension))
        for i, a in enumerate(walk_start):
            j = (i+1)%len(walk_start)
            add("shell_bowl_mass_rear_concourse", concrete,
                [a, walk_start[j], walk_end[j], walk_end[i]], [(0,1,2,3)])
        # The balcony face is clear of the lower seat crown and ahead of the first upper row.
        inset = [(x*.990, y-.08, z*.990) for x, y, z in front]
        for i in range(len(inset)):
            a, b = inset[i], inset[(i+1) % len(inset)]
            if i % 8 in (0, 7):
                continue
            atop, btop = (a[0], a[1]+.88, a[2]), (b[0], b[1]+.88, b[2])
            add("shell_balustrades_upper_glass", glass, [a, b, btop, atop], [(0, 1, 2, 3)])
            bar("shell_balustrades_upper_rails", trim, atop, btop, .065)
            if i % 2 == 1:
                bar("shell_balustrades_upper_rails", trim, a, atop, .057)
            if i % 24 in (2, 3, 4, 5):
                strip_a = (a[0] * .997, a[1]-.39, a[2] * .997)
                strip_b = (b[0] * .997, b[1]-.39, b[2] * .997)
                bar("shell_ribbon_led_housing_concourse", charcoal, strip_a, strip_b, .11, .46)
                bar("shell_ribbon_led_concourse", ribbon,
                    (strip_a[0]*.997, strip_a[1], strip_a[2]*.997),
                    (strip_b[0]*.997, strip_b[1], strip_b[2]*.997), .045, .36)

    row_count = 0
    for index, bank in enumerate(ANCHORS["banks"]):
        treads = bank["treads"]
        slices = len(treads) // bank["rows"]
        assert len(treads) == slices * bank["rows"]
        for row in range(bank["rows"]):
            run = treads[row*slices:(row+1)*slices]
            edges = [(quad[0], quad[3]) for quad in run] + [(run[-1][1], run[-1][2])]
            # Folded row ribbons depict the movable tiers without creating seat identities.
            for end, neighbor in ((0, 1), (-1, -2)):
                edges[end] = tuple(Vector(a).lerp(Vector(b), .18)
                                   for a, b in zip(edges[end], edges[neighbor]))
            points = []
            for inner, outer in edges:
                a, b = Vector(inner), Vector(outer)
                for depth, height in ((.20, .10), (.58, .12), (.74, .34)):
                    p = a.lerp(b, depth)
                    points.append((p.x, p.y + height, p.z))
            faces = [(i, i+3, i+4, i+1) for i in range(0, len(points)-3, 3)]
            faces += [(i+1, i+4, i+5, i+2) for i in range(0, len(points)-3, 3)]
            tone = 2 if (index * 7 + row // 4) % 8 < 3 else (index + row // 5) % 2
            add(f"shell_illustrative_seating_{tone+1}", seating[tone], points, faces)
            row_count += 1
        # Rear access portals sit beyond the upper tier, with clear concourse in front.
        if bank["tier"] == 1:
            left, right = treads[-slices][3], treads[-1][2]
            x, y, z = ((a+b)/2 for a, b in zip(left, right))
            radial = Vector((x, 0, z)).normalized()
            tangent = Vector((-radial.z, 0, radial.x))
            center = Vector((x, y, z)) + 1.6 * radial
            center.y = walk_y
            j1, j2 = center - .88*tangent, center + .88*tangent
            a, b = j1+Vector((0, 2.25, 0)), j2+Vector((0, 2.25, 0))
            add("shell_vomitories_recess", charcoal, [tuple(j1), tuple(j2), tuple(b), tuple(a)], [(0, 1, 2, 3)])
            for start, end in ((j1, a), (j2, b), (a, b)):
                bar("shell_vomitories_frames", trim, start, end, .12)
            bar("shell_ribbon_led_vomitories_static", lamp, a+Vector((0,.24,0)), b+Vector((0,.24,0)), .07)
    return row_count


def build_exterior(concrete, charcoal, trim):
    glazing = material("Smoked concourse glass", (.11, .25, .28), .27, .22, alpha=.55)
    bronze = material("Warm lobby soffit", (.37, .235, .128), .62, emission=.17)
    slate = material("Blue-violet anodized metal trim", (.123, .134, .204), .40, .31)
    panels = [material("Green aluminum fin " + str(i + 1), rgb, .47, .30, emission=.08)
              for i, rgb in enumerate(((.071, .16, .102), (.114, .254, .124), (.208, .324, .119),
                                       (.115, .218, .134), (.187, .304, .176)))]
    shell = chamfer(48.2, 60.4, 5.0, 6.8)
    podium = chamfer(48.0, 60.1, 5.0, -.21)
    inset = chamfer(46.6, 58.7, 5.0, -.21)
    band("shell_bowl_mass_plaza_lobby_back", charcoal, inset, at_y(inset, 6.8))
    band("shell_bowl_mass_envelope", charcoal, shell, at_y(shell, 19.5))
    band("shell_bowl_mass_crown_trim", slate, at_y(shell, 18.55), chamfer(48.7, 60.9, 5.0, 20.1))

    for side, p in enumerate(shell):
        q = shell[(side+1)%len(shell)]
        a, b = Vector(p), Vector(q)
        u = (b-a).normalized()
        out = Vector((u.z, 0, -u.x))
        run = (b-a).length
        divisions = max(3, round(run / (2.1 if side in (0, 6, 7) else 3)))
        for index in range(divisions):
            start = a.lerp(b, index/divisions)
            end = a.lerp(b, (index+1)/divisions)
            width = (end-start).length
            joint = .10 if side in (0, 6, 7) else .08
            opening = side in (0, 6, 7)
            if opening:
                front = Vector(podium[side]).lerp(Vector(podium[(side+1)%len(podium)]), index/divisions)
                next_front = Vector(podium[side]).lerp(Vector(podium[(side+1)%len(podium)]), (index+1)/divisions)
                for bottom, top in ((.05, 3.12), (3.26, 6.66)):
                    f, n = front.copy(), next_front.copy()
                    f.y = n.y = bottom
                    add("shell_bowl_mass_lobby_glazing", glazing,
                        [f, (f.x, top, f.z), (n.x, top, n.z), n], [(0, 1, 2, 3)])
                bar("shell_bowl_mass_plaza_mullions", trim, (front.x, .05, front.z), (front.x, 6.71, front.z), .12)
                if index % 4 == 0:
                    baffle = front + (next_front-front)*.5 - out*.48
                    bar("shell_bowl_mass_lobby_soffit", bronze, (baffle.x, 5.9, baffle.z),
                        (baffle.x-out.x*.64, 5.9, baffle.z-out.z*.64), width*.78, .15)
            else:
                f, n = Vector(podium[side]), Vector(podium[(side+1)%len(podium)])
                lo, hi = f.lerp(n,index/divisions), f.lerp(n,(index+1)/divisions)
                add("shell_bowl_mass_podium", concrete,
                    [lo, (lo.x, 6.8, lo.z), (hi.x, 6.8, hi.z), hi], [(0, 1, 2, 3)])
            # Folded face plates stand off the graphite backing and follow the plaza corner.
            start += out * .18 + u * joint
            end += out * .18 - u * joint
            ridge = start.lerp(end, .32) + .30 * out
            tone = (side * 7 + index * 13 + index // 5) % len(panels)
            bottom = 6.82 if opening else 6.5
            for left, right, color in ((start, ridge, tone), (ridge, end, (tone+1)%len(panels))):
                add(f"shell_bowl_mass_cladding_{color+1}", panels[color],
                    [(left.x, bottom, left.z), (left.x, 18.5, left.z),
                     (right.x, 18.5, right.z), (right.x, bottom, right.z)], [(0, 1, 2, 3)])
        for y in (6.72, 18.58):
            e1, e2 = a + out*.28, b + out*.28
            bar("shell_bowl_mass_facade_flashings", slate, (e1.x, y, e1.z), (e2.x, y, e2.z), .29, .19)
        if side in (0, 6, 7):
            e1, e2 = a + out*1.85, b + out*1.85
            bar("shell_bowl_mass_entry_canopy", slate, (e1.x, 4.2, e1.z), (e2.x, 4.2, e2.z), 3.8, .28)
            e1, e2 = a + out*3.55, b + out*3.55
            bar("shell_bowl_mass_entry_canopy_edge", trim, (e1.x, 4.21, e1.z),
                (e2.x, 4.21, e2.z), .14, .32)

    # A separate inner acoustic wall leaves an annular concourse behind the movable banks.
    interior = chamfer(45.7, 57.4, 4.3, 5.48)
    band("shell_bowl_mass_acoustic_liner", charcoal, interior, at_y(interior, 18.2), inward=True)
    panel = material("Dark acoustic panel", (.082, .121, .121), .82)
    for i, start in enumerate(interior):
        end = interior[(i+1)%len(interior)]
        a, b = Vector(start), Vector(end)
        u = (b-a).normalized()
        inward = Vector((-u.z, 0, u.x))
        count = max(2, round((b-a).length/3.5))
        for j in range(count):
            left = a.lerp(b, j/count) + u*.08 + inward*.08
            right = a.lerp(b, (j+1)/count) - u*.08 + inward*.08
            add("shell_bowl_mass_acoustic_panels", panel,
                [left, right, (right.x, 17.5, right.z), (left.x, 17.5, left.z)], [(0, 1, 2, 3)])


def build_roof(trim):
    steel = material("Smoke gray truss steel", (.23, .268, .301), .54, .35)
    skin = material("Light gray standing seam metal", (.37, .44, .45), .55, .28, emission=.10)
    seams = material("Roof seams and walkways", (.244, .292, .303), .54, .32, emission=.08)
    solar = material("Photovoltaic modules", (.036, .072, .111), .37, .20)
    light = material("Roof light fittings", (.68, .82, .79), .35, emission=.7)
    lower = chamfer(48.8, 61.0, 5.0, 19.98)
    upper = chamfer(48.8, 61.0, 5.0, 22.48)
    slab("shell_roof_canopy_deck", skin, lower, upper)
    for x in range(-44, 45, 4):
        edge = 60.96 - max(0, abs(x)-43.8)
        bar("shell_roof_canopy_seams", seams, (x,22.49,-edge), (x,22.49,edge), .075, .04)
    for x in (-35, -29, 31, 37):
        for z in range(-41, 42, 6):
            box("shell_roof_canopy_solar", solar, (x, 22.58, z), (4.8, .14, 5.7))
    for z in range(-48, 49, 8):
        for y, width in ((17.55, .43), (20.28, .39)):
            bar("shell_roof_truss_chords", steel, (-45.35,y,z), (45.35,y,z), width)
        for index, x in enumerate(range(-44, 44, 4)):
            a = (x, 17.55 if index % 2 else 20.28, z)
            b = (x+4, 20.28 if index % 2 else 17.55, z)
            bar("shell_roof_truss_webs", steel, a, b, .23)
        for x in (-32, -16, 0, 16, 32):
            box("shell_roof_truss_lights", light, (x,17.29,z), (.91,.16,.43))
    for x in (-44, -31, -16, 0, 16, 31, 44):
        bar("shell_roof_truss_purlins", trim, (x, 19.16, -55), (x, 19.16, 55), .25)


def audit_clearance():
    def volume_tree(volumes):
        points, faces = [], []
        for vertices, polygons in volumes:
            base = len(points)
            points.extend(vertices)
            faces.extend(tuple(base + i for i in face) for face in polygons)
        return BVHTree.FromPolygons(points, faces)

    def chair_volumes():
        for chair in ANCHORS["chairs"]:
            x, y, z = chair["p"]
            width, angle = chair["width"], chair["angle"]
            c, s = math.cos(angle), math.sin(angle)
            for part in ANCHORS["chairParts"]:
                dx, dy, dz = part["center"]
                w, h, depth = part["size"]
                center = (x+dx*width*c+dz*s, y+dy, z-dx*width*s+dz*c)
                yield box_points(center, (w*width, h, depth), angle), BOX_FACES

    prism_faces = ((0,1,2,3), (7,6,5,4), (0,4,5,1), (1,5,6,2), (2,6,7,3), (3,7,4,0))
    aisle_volumes = (([(x,y+lift,z) for lift in (.028,2.12) for x,y,z in quad], prism_faces)
                     for quad in ANCHORS["aisleTreads"])
    layouts = ANCHORS["layouts"]
    targets = {
        "illustrative-chair": volume_tree(chair_volumes()),
        "aisle": volume_tree(aisle_volumes),
        **{layout: volume_tree((box_points(part["center"],part["size"],part.get("angle",0)), BOX_FACES)
                               for part in details["stage"]) for layout, details in layouts.items()},
    }
    hits = {}
    for (name, _), (points, faces) in batches.items():
        mesh = BVHTree.FromPolygons(points, faces)
        for kind, target in targets.items():
            # Row ribbons occupy the modeled chair envelope by design.
            if kind == "illustrative-chair" and name.startswith("shell_illustrative_seating"):
                continue
            overlap = mesh.overlap(target)
            if overlap:
                hits.setdefault(kind, {})[name] = len(overlap)
    if hits:
        raise ValueError(f"Grand Hall clearance conflicts: {hits}")
    return {
        "testedIllustrativeSeatPositions": len(ANCHORS["chairs"]),
        "testedAisleTreads": len(ANCHORS["aisleTreads"]),
        "tests": {k: 0 for k in targets},
    }


def export():
    for (name, mat), (points, faces) in batches.items():
        mesh = bpy.data.meshes.new(name)
        mesh.from_pydata([(x, -z, y) for x, y, z in points], [], faces)
        mesh.validate()
        obj = bpy.data.objects.new(name, mesh)
        bpy.context.collection.objects.link(obj)
        obj.data.materials.append(mat)
        if name.startswith("shell_illustrative_seating"):
            obj["precision"] = "illustrative"
        if name.startswith(("shell_roof_canopy", "shell_bowl_mass_cladding", "shell_bowl_mass_plaza")):
            obj["unshadowed"] = True

    path = HERE / "shell.glb"
    bpy.ops.export_scene.gltf(filepath=str(path), export_format="GLB", export_yup=True,
                             export_apply=True, export_extras=True)
    raw = path.read_bytes()
    magic, version, total, size, kind = struct.unpack_from("<4s4I", raw)
    assert (magic, version, total, kind) == (b"glTF", 2, len(raw), 0x4e4f534a)
    assert len(raw) <= BUDGET, f"{len(raw)} bytes exceeds the arena asset budget"
    gltf = json.loads(raw[20:20+size])
    nodes = [node for node in gltf["nodes"] if "mesh" in node]
    assert not any(set(node) & {"matrix", "translation", "rotation", "scale"} for node in nodes)
    positions = [gltf["accessors"][primitive["attributes"]["POSITION"]]
                 for mesh in gltf["meshes"] for primitive in mesh["primitives"]]
    return {
        "bounds": {"min": [min(a["min"][i] for a in positions) for i in range(3)],
                   "max": [max(a["max"][i] for a in positions) for i in range(3)]},
        "roofNodeNames": sorted(node["name"] for node in nodes if node["name"].startswith("shell_roof_")),
        "ribbonNodeNames": sorted(node["name"] for node in nodes if node["name"].startswith("shell_ribbon_led")),
        "assetBytes": len(raw),
        "meshPrimitives": len(positions),
    }


def main():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.context.scene.unit_settings.system = "METRIC"
    concrete = material("Precast concrete Grand Hall", (.17, .196, .196), .85)
    charcoal = material("Warm graphite acoustic backing", (.056, .074, .077), .75)
    trim = material("Cool brushed aluminum", (.23, .28, .32), .42, .34)
    build_floor(concrete)
    rows = build_bowl(concrete, charcoal, trim)
    build_exterior(concrete, charcoal, trim)
    build_roof(trim)
    clearance = audit_clearance()
    layouts = ANCHORS["layouts"]
    roof_min = min(p[1] for (name, _), (points, _) in batches.items()
                   if name.startswith("shell_roof_truss") for p in points)
    manifest = {
        "venueId": ID,
        "generator": "blender-bpy",
        "version": 1,
        "units": "metres",
        "upAxis": "+Y",
        "coordinateBasis": "catalog-parametric-display",
        "precision": "illustrative",
        "sourceSeatsCount": 0,
        "seatBounds": layouts["end"]["seatBounds"],
        "geometryClearance": clearance,
        "layoutClearance": {layout: {
            "roofAboveHighestSeatBase": round(roof_min-data["seatBounds"]["max"][1], 3),
            "stageParts": len(data["stage"]),
            "illustrativePositions": data["illustrativePositions"],
        } for layout, data in layouts.items()},
        "illustrativeSeatElements": rows,
        "lightingPreset": "arena-dark",
        "references": [
            {"url": "https://www.arup.com/en-us/projects/kai-tak-arena/",
             "use": "Grand Hall long-span trusses, movable banks, interior and plaza photographs"},
            {"url": "https://www.kaitaksportspark.com.hk/venues-spaces/5",
             "use": "Operator identifies the Grand Hall and Sports Hall"},
        ],
        "notes": "Original schematic of the indoor Grand Hall, fitted to the catalog's display coordinates. The green plaza fins, recessed lobby, timber floor, steel roof and photovoltaic arrays are interpretations of the public references. Dimensions are illustrative. Render-only row ribbons carry no individual seats or ticket identities.",
        **export(),
    }
    assert all(record["roofAboveHighestSeatBase"] > 3 for record in manifest["layoutClearance"].values())
    (HERE / "manifest.json").write_text(json.dumps(manifest, indent=2)+"\n", encoding="utf-8")


if __name__ == "__main__":
    main()
