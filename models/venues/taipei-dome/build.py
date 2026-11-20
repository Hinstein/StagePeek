"""Build the original StagePeek Taipei Dome shell in the section model's coordinate frame."""
import json
import math
from pathlib import Path
import struct
import subprocess

import bmesh
import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parent
VENUE = "taipei-dome"
TAU = math.tau
SAMPLES = 96
RX, RZ, CENTER_Z = 135., 123., -6.
EAVE = 61.6
MODEL = json.loads(subprocess.check_output(["node", ROOT / "terraces.mjs"]))
PROBE = json.loads(subprocess.check_output(["node", ROOT.parents[2] / "scripts/probe-venue-bounds.mjs", VENUE]))
SEATS = PROBE["layouts"]["end"]["seatBounds"]
MESHES = {}


def batch(name, color, roughness=.76, metallic=0., emission=0.):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1.)
    shader = mat.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = mat.diffuse_color
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Metallic"].default_value = metallic
    shader.inputs["Emission Color"].default_value = mat.diffuse_color
    shader.inputs["Emission Strength"].default_value = emission
    vertices, faces = [], []
    MESHES[name] = (mat, vertices, faces)
    return vertices, faces


def face(mesh, *points):
    vertices, faces = mesh
    faces.append(tuple(range(len(vertices), len(vertices) + len(points))))
    vertices.extend(tuple(p) for p in points)


def band(mesh, lower, upper, reverse=False):
    for i in range(len(lower)):
        j = (i + 1) % len(lower)
        points = (lower[i], lower[j], upper[j], upper[i])
        face(mesh, *(points[::-1] if reverse else points))


def sample_ring(fn, count=SAMPLES):
    return [fn(i * TAU / count) for i in range(count)]


def oval(scale, height):
    return sample_ring(lambda a: (RX * scale * math.cos(a), height, CENTER_Z + RZ * scale * math.sin(a)))


def mix(a, b, ratio, lift=0.):
    return (a[0] + (b[0] - a[0]) * ratio, a[1] + (b[1] - a[1]) * ratio + lift,
            a[2] + (b[2] - a[2]) * ratio)


def lift(point, height):
    return point[0], point[1] + height, point[2]


def beam(mesh, start, end, width, depth=None):
    a, b = Vector(start), Vector(end)
    axis = (b - a).normalized()
    side = axis.cross(Vector((0, 1, 0)))
    if side.length < .001:
        side = axis.cross(Vector((1, 0, 0)))
    side = side.normalized() * width / 2
    up = axis.cross(side).normalized() * (depth or width) / 2
    cap_a = [a - side - up, a + side - up, a + side + up, a - side + up]
    cap_b = [b - side - up, b + side - up, b + side + up, b - side + up]
    band(mesh, cap_a, cap_b)
    face(mesh, *cap_a[::-1])
    face(mesh, *cap_b)


def inner_radius(angle):
    samples = MODEL["radial"]
    index = min(3, int(abs(angle) / (math.pi / 4)))
    progress = abs(angle) * 4 / math.pi - index
    return samples[index] + (samples[index + 1] - samples[index]) * progress


def seating_ring(radial_offset, height):
    return sample_ring(lambda a: (math.sin(a) * (inner_radius((a + math.pi) % TAU - math.pi) + radial_offset),
                                  height,
                                  math.cos(a) * (inner_radius((a + math.pi) % TAU - math.pi) + radial_offset)))


def bowl():
    concrete = batch("shell_bowl_mass_terrace_supports", (.18, .20, .21))
    reveals = batch("shell_vomitories_recesses", (.017, .025, .032), emission=.08)
    casing = batch("shell_vomitories_concrete_frames", (.27, .31, .33))
    edges = batch("shell_balustrades_brushed_rail", (.43, .51, .54), .39, .45)
    glass = batch("shell_bowl_mass_suite_glass", (.029, .075, .116), .33, .27)
    suites = batch("shell_bowl_mass_suite_reveals", (.029, .035, .044))
    lamps = batch("shell_vomitories_portal_lighting", (.82, .68, .33), .47, .02, .63)
    seats = [
        batch("shell_illustrative_seating_lower", (.105, .224, .282)),
        batch("shell_illustrative_seating_middle", (.24, .286, .302)),
        batch("shell_illustrative_seating_upper", (.135, .251, .319)),
        batch("shell_illustrative_seating_top", (.244, .311, .336)),
    ]
    seat_groups = set()
    count = 0
    for sequence, bank in enumerate(MODEL["banks"]):
        tier, rows = bank["tier"], bank["treads"]
        slices = len(rows) // bank["rows"]
        assert slices * bank["rows"] == len(rows)
        seat_group = seats[tier]
        for j in range(slices):
            a, b, _, _ = rows[j]
            _, _, c, d = rows[j-slices]
            lower = max(-.085, a[1] - (1.85 if tier else 1.1))
            face(concrete, lift(a, -.27), lift(b, -.27), lift(c, -.27), lift(d, -.27))
            for left, right in ((a, b), (c, d)):
                face(concrete, lift(left, -.27), lift(right, -.27),
                     (right[0], lower, right[2]), (left[0], lower, left[2]))
        for i in range(0, len(rows), slices):
            for j in range(0, slices, 2):
                a, _, _, d = rows[i+j]
                _, b, c, _ = rows[i+min(j+1, slices-1)]
                span = math.dist(a, b)
                if span < .4:
                    continue
                # The grooves separate small groups visually without assigning seat identities.
                divisions = max(1, round(span / 3.6))
                for section in range(divisions):
                    front_a, front_b = mix(a, d, .34, .055), mix(b, c, .34, .055)
                    rear_a, rear_b = mix(a, d, .73, .055), mix(b, c, .73, .055)
                    lo, hi = (section + .08) / divisions, (section + .92) / divisions
                    left_front, right_front = mix(front_a, front_b, lo), mix(front_a, front_b, hi)
                    left_rear, right_rear = mix(rear_a, rear_b, lo), mix(rear_a, rear_b, hi)
                    face(seat_group, left_front, right_front, right_rear, left_rear)
                    face(seat_group, left_rear, right_rear, lift(right_rear, .28), lift(left_rear, .28))
                    count += 1
                    seat_groups.add(tier)
        # A dark recessed throat at every fourth bank's leading edge.
        # It is hung below the tread and never bridges the camera/pick surface above.
        if tier and sequence % 4 == 1:
            a, _, _, _ = rows[0]
            _, b, _, _ = rows[slices-1]
            p, q = lift(mix(a, b, .39), -2.15), lift(mix(a, b, .61), -2.15)
            width = math.dist(p, q)
            if width > 1.4:
                inward = Vector((-(p[0]+q[0])/2, 0, -(p[2]+q[2])/2)).normalized()
                p, q = Vector(p) + inward*.12, Vector(q) + inward*.12
                face(reveals, p, q, lift(q, 1.8), lift(p, 1.8))
                beam(casing, p, lift(p, 1.92), .14)
                beam(casing, q, lift(q, 1.92), .14)
                beam(lamps, lift(p, 1.86), lift(q, 1.86), .095)

    ribbon = batch("shell_ribbon_led_scoreboards", (.08, .30, .56), .52, .04, .83)
    ribbon_case = batch("shell_ribbon_led_housing", (.05, .082, .105), .56)
    for offset, y in [(15.6, 13.1), (22.55, 24.7), (32.5, 40.25)]:
        # The modeled radial sweep tracks the front of the next seating tier.
        band(ribbon_case, seating_ring(offset+.12, y-.19), seating_ring(offset+.12, y+.98), reverse=True)
        band(ribbon, seating_ring(offset, y), seating_ring(offset, y+.76), reverse=True)
        band(edges, seating_ring(offset+.08, y+.87), seating_ring(offset+.08, y+1.01), reverse=True)

    # Box fronts are between L2 and L4. Only the occupied infield arc is glazed.
    lower = seating_ring(23.25, 22.68)
    upper = seating_ring(23.25, 24.36)
    for i in list(range(0, 30, 2)) + list(range(66, 96, 2)):
        a, b = lower[i], lower[i+1]
        c, d = upper[i], upper[i+1]
        face(suites, *[(x * 1.003, y, z * 1.003) for x, y, z in (a, b, d, c)])
        face(glass, mix(a, b, .07, .07), mix(a, b, .93, .07), mix(c, d, .93, -.07), mix(c, d, .07, -.07))
    assert len(seat_groups) == len(seats)
    return count


def roof_point(u, v, lift_by=0.):
    radius = math.hypot(u, v)
    return (RX * u, EAVE + 17.2*(1 - radius**2.25) + 2.45*(u*u - v*v) + 1.9*v + lift_by,
            CENTER_Z + RZ * v)


def roof_and_facade():
    plinth = batch("shell_bowl_mass_plinth", (.26, .285, .30))
    surround = batch("shell_bowl_mass_cladding_titanium", (.47, .51, .55), .46, .51, .19)
    flange = batch("shell_bowl_mass_facade_panels_titanium_sweeps", (.65, .67, .69), .43, .44, .16)
    seam = batch("shell_bowl_mass_cladding_panel_lines", (.26, .31, .35), .52, .42, .16)
    curtain = batch("shell_bowl_mass_facade_glazing", (.035, .073, .108), .27, .44, .18)
    mullions = batch("shell_vomitories_entry_mullions", (.49, .54, .56), .45, .53, .12)
    portals = batch("shell_vomitories_entry_apron_lights", (.84, .59, .27), .44, .05, .46)
    band(plinth, oval(1.019, -.18), oval(1.019, 5.0))
    band(plinth, oval(1.019, 5.0), oval(1.008, 6.45))

    def skin(a, t, offset=0.):
        # The long sweep closes the edge of the modeled terraces below the saddle.
        ca, sa = math.cos(a), math.sin(a)
        eave = roof_point(ca, sa)[1]
        scale = 1.002 + .041*math.sin(math.pi*t) - .027*math.sin(TAU*t) + offset
        return RX*scale*ca, 6.4 + (eave-6.4)*t, CENTER_Z + RZ*scale*sa

    skin_rings = [sample_ring(lambda a: skin(a, row/20)) for row in range(21)]
    for j, (lower, upper) in enumerate(zip(skin_rings, skin_rings[1:])):
        for i in range(SAMPLES):
            k = (i+1) % SAMPLES
            use_flange = (j + (i//12 if j < 12 else i//17)) % 7 in (2, 3)
            face(flange if use_flange else surround, lower[i], lower[k], upper[k], upper[i])
    # Straight oblique runs trace the diamond seams around the titanium skirt.
    for start in range(0, SAMPLES, 2):
        a = start * TAU / SAMPLES
        for row in range(1, 20):
            t0, t1 = row/20, (row+1)/20
            for slope in (-1, 1):
                begin, end = a + slope*t0*1.45, a + slope*t1*1.45
                face(seam, skin(begin, t0, .0034), skin(end, t1, .0034),
                     skin(end+.0017, t1, .0034), skin(begin+.0017, t0, .0034))
    # The main plaza meets a tall glazed strip under the titanium skirt.
    for i in range(SAMPLES):
        a, b = i*TAU/SAMPLES, (i+1)*TAU/SAMPLES
        entrance = 13 <= i <= 37 or 67 <= i <= 74
        if not entrance and i % 3 != 0:
            continue
        radius = 1.02
        lo, hi = (.72, 6.2) if entrance else (2.4, 4.35)
        def glazing(angle, y):
            return RX*radius*math.cos(angle), y, CENTER_Z + RZ*radius*math.sin(angle)
        face(curtain, glazing(a, lo), glazing(b, lo), glazing(b, hi), glazing(a, hi))
        beam(mullions, glazing(a, lo), glazing(a, hi), .23)
        if entrance:
            beam(portals, glazing(a, 5.75), glazing(b, 5.75), .15, .23)

    canopy = batch("shell_roof_canopy_titanium_skin", (.62, .66, .69), .46, .52, .23)
    flashing = batch("shell_roof_canopy_panel_seams", (.35, .43, .49), .54, .55)
    chord = batch("shell_roof_truss_diagonal_chords", (.36, .44, .49), .51, .43, .05)
    diagonals = batch("shell_roof_truss_diagonal_web", (.50, .53, .56), .56, .32)
    ring = batch("shell_roof_truss_saddle_ring", (.36, .42, .45), .50, .42)
    radii = [sample_ring(lambda a: roof_point((j/18)*math.cos(a), (j/18)*math.sin(a))) for j in range(1, 19)]
    for lower, upper in zip(radii, radii[1:]):
        band(canopy, lower, upper)
    for i in range(SAMPLES):
        face(canopy, roof_point(0, 0), radii[0][i], radii[0][(i+1) % SAMPLES])
    band(ring, [lift(p, -1.65) for p in radii[-1]], [lift(p, -.13) for p in radii[-1]])
    band(ring, [lift(p, -1.65) for p in radii[-1]],
         sample_ring(lambda a: roof_point(.993*math.cos(a), .993*math.sin(a), -1.72)))

    # Two sets of diagonal through-trusses share the shaped perimeter ring.
    # The thinner roof seam follows each family above the visible steelwork.
    for angle in (.73, -.73):
        cs, sn = math.cos(angle), math.sin(angle)
        for track in range(-8, 9):
            edge = track / 9.5
            limit = math.sqrt(.996**2 - edge**2)
            panels = max(7, round(limit*20))
            def lattice(position, lift_by, offset=0.):
                u = position*cs - (edge+offset)*sn
                v = position*sn + (edge+offset)*cs
                return roof_point(u, v, lift_by)
            for i in range(panels):
                start, end = limit*(2*i/panels-1), limit*(2*(i+1)/panels-1)
                top_a, top_b = lattice(start, -.65), lattice(end, -.65)
                low_a, low_b = lattice(start, -3.35), lattice(end, -3.35)
                beam(chord, top_a, top_b, .32)
                beam(chord, low_a, low_b, .38)
                beam(diagonals, low_a if i % 2 else top_a, top_b if i % 2 else low_b, .21)
                if i % 2 == 0:
                    beam(diagonals, low_a, top_a, .15)
                face(flashing, lattice(start, .22, -.0015), lattice(end, .22, -.0015),
                     lattice(end, .22, .0015), lattice(start, .22, .0015))


def field():
    slab = batch("shell_field_floor_foundation", (.16, .193, .199))
    stripes = [batch("shell_field_floor_turf_"+str(index), color, .92)
               for index, color in enumerate([(.072, .192, .074), (.081, .212, .087)])]
    clay = batch("shell_field_floor_clay", (.38, .188, .092), .89)
    chalk = batch("shell_field_floor_chalk", (.84, .85, .79), .71, .03, .04)
    wall = batch("shell_field_floor_padding", (.027, .061, .065))
    foundation = oval(1.019, -.18)
    for i in range(SAMPLES):
        face(slab, (0., -.18, CENTER_Z), foundation[i], foundation[(i+1) % SAMPLES])
    perimeter = seating_ring(-1.05, -.037)
    # Clip parallel stripes to the same footprint used for the warning track.
    # Strip intersections are computed on polygon edges to keep a sealed turf edge.
    def clip_x(polygon, x, direction):
        clipped = []
        for a, b in zip(polygon, polygon[1:]+polygon[:1]):
            da, db = (a[0]-x)*direction, (b[0]-x)*direction
            if da >= 0:
                clipped.append(a)
            if (da < 0) != (db < 0):
                clipped.append(mix(a, b, da/(da-db)))
        return clipped

    for index, x in enumerate(range(-88, 88, 8)):
        strip = clip_x(clip_x(perimeter, x, 1), x+8, -1)
        if len(strip) > 2:
            face(stripes[index % 2], *strip)
    warning_inner = seating_ring(-3.05, -.022)
    band(clay, perimeter, warning_inner)
    for a, b in zip(perimeter, perimeter[1:]+perimeter[:1]):
        if max(a[2], b[2]) < 0:
            face(wall, a, b, lift(b, .84), lift(a, .84))

    # Home faces the deep side of the section model, with explicitly schematic bases.
    base_z, side = 33.8, 19.35
    diamond = [(0., -.028, base_z), (side, -.028, base_z-side),
               (0., -.028, base_z-2*side), (-side, -.028, base_z-side)]
    center = (0., -.028, base_z-side)
    band(clay, [mix(center, p, 1.145) for p in diamond], [mix(center, p, .85) for p in diamond])
    for x, y, z in [center, *diamond]:
        radius = 2.6 if (x, y, z) == center else 1.58
        disk = sample_ring(lambda a: (x+radius*math.cos(a), y+.002, z+radius*math.sin(a)), 24)
        for i in range(len(disk)):
            face(clay, (x,y+.002,z), disk[i], disk[(i+1) % len(disk)])
    for x, _, z in diamond:
        r = .32
        face(chalk, (x-r, -.013, z), (x, -.013, z-r), (x+r, -.013, z), (x, -.013, z+r))
    for sign in (-1, 1):
        face(chalk, (0., -.012, base_z), (.12, -.012, base_z),
             (sign*53.+.12, -.012, base_z-53.), (sign*53., -.012, base_z-53.))


def export(illustrative_count):
    for name, (mat, vertices, faces) in MESHES.items():
        assert faces, name
        mesh = bpy.data.meshes.new(name)
        mesh.from_pydata([(x, -z, y) for x, y, z in vertices], [], faces)
        mesh.validate()
        normals = bmesh.new()
        normals.from_mesh(mesh)
        bmesh.ops.remove_doubles(normals, verts=list(normals.verts), dist=.00001)
        bmesh.ops.recalc_face_normals(normals, faces=list(normals.faces))
        normals.to_mesh(mesh)
        normals.free()
        mesh.update()
        obj = bpy.data.objects.new(name, mesh)
        bpy.context.scene.collection.objects.link(obj)
        mesh.materials.append(mat)
        if name.startswith("shell_illustrative_seating"):
            obj["precision"] = "illustrative"
        if name in ("shell_roof_canopy_titanium_skin", "shell_bowl_mass_cladding_titanium"):
            for polygon in mesh.polygons:
                polygon.use_smooth = True
        mat.use_backface_culling = False

    output = ROOT / "shell.glb"
    bpy.ops.export_scene.gltf(filepath=str(output), export_format='GLB', export_yup=True,
                              export_apply=True, export_extras=True, export_cameras=False, export_lights=False)
    with output.open("rb") as glb:
        glb.seek(12)
        size, _ = struct.unpack("<II", glb.read(8))
        document = json.loads(glb.read(size))
    names = {node["name"]: document["meshes"][node["mesh"]]["primitives"] for node in document["nodes"]}
    accessors = [document["accessors"][p["attributes"]["POSITION"]] for primitives in names.values() for p in primitives]
    bounds = {
        key: [round(combine(a[key][axis] for a in accessors), 4) for axis in range(3)]
        for key, combine in (("min", min), ("max", max))
    }
    roof_nodes = [name for name in names if name.startswith("shell_roof_")]
    lowest_truss = min(document["accessors"][p["attributes"]["POSITION"]]["min"][1]
                        for name in roof_nodes if name.startswith("shell_roof_truss") for p in names[name])
    clearance = lowest_truss - SEATS["max"][1]
    assert output.stat().st_size <= 5_000_000 and clearance > 3
    manifest = {
        "venueId": VENUE,
        "generator": "blender-bpy",
        "version": 1,
        "coordinateBasis": "stagepeek-section-model",
        "precision": "illustrative",
        "units": "metres",
        "upAxis": "+Y",
        "bounds": bounds,
        "seatBounds": SEATS,
        "sourceSeatsCount": 0,
        "sectionCount": PROBE["layouts"]["end"]["sectionCount"],
        "lightingPreset": "stadium-dusk",
        "roofNodeNames": roof_nodes,
        "ribbonNodeNames": [name for name in names if name.startswith("shell_ribbon_led")],
        "illustrativeSeatElements": illustrative_count,
        "roofTrussClearanceAboveHighestIllustrativeSeat": round(clearance, 3),
        "meshPrimitives": len(accessors),
        "assetBytes": output.stat().st_size,
        "references": [
            "https://www.archasia.asia/en/projects/taipeidome",
            "https://populous.com/article/taipei-dome-opens-as-asias-new-landmark-baseball-arena",
            "https://www.farglorydome.com.tw/park-detail/taipeidome__1/",
            "https://www.farglorydome.com.tw/park-detail/map/",
        ],
        "notes": "Original interpretation of the titanium skin, diagonal roof trusses, and saddle ring. "
                 "The field and shell dimensions are approximate. The permanent field surface sits below "
                 "the runtime stage for concert layouts. Folded seating bands represent modeled sections "
                 "without assigning ticket identities.",
    }
    (ROOT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")


bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.context.scene.unit_settings.system = 'METRIC'
count = bowl()
roof_and_facade()
field()
export(count)
