"""Build the Bird's Nest from the StagePeek catalog and architectural references.

blender --background --python-exit-code 1 --python models/venues/birds-nest/build.py
"""

import json
import math
from pathlib import Path
import struct
import subprocess

import bpy
from mathutils import Vector


HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
VENUE = HERE.name
STEPS = 144
ANGLES = [math.tau * index / STEPS for index in range(STEPS + 1)]
PROFILE = json.loads(subprocess.check_output(
    ["node", ROOT / "scripts/probe-venue-bounds.mjs", VENUE]))
LAYOUT = PROFILE["layouts"]["end"]
SEAT_HEIGHT = LAYOUT["seatBounds"]["max"][1]
BATCHES = []


class Mesh:
    def __init__(self, name, label, color, roughness=.78, metal=0, glow=0, alpha=1, **extras):
        self.name = name
        self.vertices = []
        self.faces = []
        self.extras = extras
        self.material = bpy.data.materials.new(label)
        self.material.diffuse_color = (*color, alpha)
        shader = self.material.node_tree.nodes["Principled BSDF"]
        shader.inputs["Base Color"].default_value = (*color, 1)
        shader.inputs["Roughness"].default_value = roughness
        shader.inputs["Metallic"].default_value = metal
        shader.inputs["Emission Color"].default_value = (*color, 1)
        shader.inputs["Emission Strength"].default_value = glow
        if alpha < 1:
            shader.inputs["Alpha"].default_value = alpha
            self.material.surface_render_method = "BLENDED"
        BATCHES.append(self)

    def face(self, *points):
        offset = len(self.vertices)
        self.vertices.extend(points)
        self.faces.append(tuple(range(offset, offset + len(points))))

    def strip(self, inner, outer):
        for i in range(len(inner) - 1):
            self.face(inner[i], inner[i + 1], outer[i + 1], outer[i])

    def bar(self, a, b, width, depth=None):
        start, end = Vector(a), Vector(b)
        along = (end - start).normalized()
        reference = Vector((0, 1, 0)) if abs(along.y) < .96 else Vector((0, 0, 1))
        u = along.cross(reference).normalized() * (width / 2)
        v = u.cross(along) * ((depth or width) / 2)
        corners = [(p - u - v, p - u + v, p + u + v, p + u - v) for p in (start, end)]
        near, far = corners
        self.face(*near)
        self.face(*reversed(far))
        for i in range(4):
            j = (i + 1) % 4
            self.face(near[i], far[i], far[j], near[j])

    def rail(self, points, width, depth=None):
        for a, b in zip(points, points[1:]):
            self.bar(a, b, width, depth)


def oval(theta, rx, rz, y):
    return rx * math.cos(theta), y, rz * math.sin(theta)


def raised(point, height):
    return point[0], point[1] + height, point[2]


def mix(a, b, fraction):
    return tuple(x + (y - x) * fraction for x, y in zip(a, b))


def bowl_profile():
    # The same profile drives the runtime seating, its section picks and stairs.
    return json.loads(subprocess.check_output(
        ["node", "--input-type=module", "-e", """
import {loadVenues} from './server/venues.mjs';
import {sectionPoint} from './public/geometry.mjs';
const venue=loadVenues().get(process.argv[1], 'end');
const count=Number(process.argv[2]);
const point=(tier,i,t)=>sectionPoint(venue,{tier,angle:i/count*Math.PI*2,halfAngle:0},t,0,0);
console.log(JSON.stringify(venue.tiers.map((_,tier)=>Array.from({length:count+1},(_,i)=>[point(tier,i,0),point(tier,i,1)]))));
""", VENUE, str(STEPS)], cwd=ROOT))


def stands(upper_edge, glow_color):
    support = Mesh("shell_bowl_mass_terrace_supports", "Dark precast concrete", (.154, .164, .175))
    housing = Mesh("shell_ribbon_led_housing", "Hollow graphite steel edge", (.039, .045, .052))
    ribbon = Mesh("shell_ribbon_led_bowl_edge", "Continuous stadium ribbon", glow_color, glow=.54)
    frames = Mesh("shell_vomitories_concourse_frames", "Cast-in-place concrete portal frame", (.48, .48, .45))
    recess = Mesh("shell_vomitories_concourse_insets", "Recessed charcoal passage", (.035, .044, .047))
    egress = Mesh("shell_ribbon_led_egress_static", "Amber aisle wayfinding", (.72, .43, .15), glow=.45)
    glass = Mesh("shell_balustrades_front_glass", "Tinted safety glazing", (.29, .40, .42), roughness=.33,
                 metal=.14, alpha=.34)
    rails = Mesh("shell_balustrades_cap", "Stainless rail cap", (.44, .49, .51), roughness=.43, metal=.40)
    banks = bowl_profile()
    for tier, bank in enumerate(banks):
        front = [raised(a, -.39) for a, _ in bank]
        rear = [raised(b, -.66) for _, b in bank]
        support.strip(rear, front)
        if tier == 0:
            support.strip([(x, -.14, z) for x, _, z in front], front)
            continue
        # The steel edge is inset into the fascia below the upper rows.
        low = [(x * .996, y - .47, z * .996) for x, y, z in front]
        mid = [(x * .994, y - .11, z * .994) for x, y, z in front]
        housing.strip(low, [raised(p, .34) for p in front])
        ribbon.strip([raised(p, -.28) for p in mid], [raised(p, -.02) for p in mid])
        base = [(x * .996, y + .56, z * .996) for x, y, z in front]
        top = [raised(p, .42) for p in base]
        glass.strip(base, top)
        rails.rail(top, .061)
        for i in range(0, STEPS, 12):
            j = i + 1
            a, b = [raised(front[k], -1.35) for k in (i, j)]
            c, d = [raised(front[k], -.33) for k in (i, j)]
            a, b, c, d = [(x * .998, y, z * .998) for x, y, z in (a, b, c, d)]
            recess.face(a, b, d, c)
            frames.bar(a, c, .15)
            frames.bar(b, d, .15)
            frames.bar(c, d, .15)
            egress.bar((c[0] * .998, c[1] - .12, c[2] * .998),
                       (d[0] * .998, d[1] - .12, d[2] * .998), .08)
    # Extend the retained top bank without modifying any seat geometry.
    start = [raised(b, -.37) for _, b in banks[-1]]
    support.strip(start, upper_edge)


def pitch(edge_x, edge_z, y):
    colors = ((.055, .18, .051), (.071, .222, .061))
    turf = [Mesh(f"shell_field_floor_turf_{i + 1}", "Mown football grass", color)
            for i, color in enumerate(colors)]
    paint = Mesh("shell_field_floor_football_markings", "Muted white pitch lines", (.74, .77, .68))

    def rectangle(mesh, x1, x2, z1, z2, height):
        mesh.face((x1, height, z1), (x1, height, z2), (x2, height, z2), (x2, height, z1))

    for i in range(14):
        a = (i / 7 - 1) * edge_z
        b = ((i + 1) / 7 - 1) * edge_z
        rectangle(turf[i % 2], -edge_x, edge_x, a, b, y)
    height = y + .033
    width = .105
    for half_x, half_z, center_z in (
            (edge_x, edge_z, 0), (edge_x * .59, edge_z * .16, -edge_z * .84),
            (edge_x * .59, edge_z * .16, edge_z * .84),
            (edge_x * .27, edge_z * .052, -edge_z * .948),
            (edge_x * .27, edge_z * .052, edge_z * .948)):
        for x in (-half_x, half_x):
            rectangle(paint, x - width, x + width, center_z - half_z, center_z + half_z, height)
        for z in (center_z - half_z, center_z + half_z):
            rectangle(paint, -half_x, half_x, z - width, z + width, height)
    rectangle(paint, -edge_x, edge_x, -width, width, height)
    ring_r = 9.15 * edge_x / 34
    paint.strip([oval(a, ring_r - width, ring_r - width, height) for a in ANGLES],
                [oval(a, ring_r + width, ring_r + width, height) for a in ANGLES])


def export(notes, references):
    for batch in BATCHES:
        if not batch.faces:
            continue
        mesh = bpy.data.meshes.new(batch.name)
        mesh.from_pydata([(x, -z, y) for x, y, z in batch.vertices], [], batch.faces)
        if mesh.validate():
            raise ValueError(f"Invalid vertices in {batch.name}")
        mesh.materials.append(batch.material)
        node = bpy.data.objects.new(batch.name, mesh)
        bpy.context.collection.objects.link(node)
        for key, value in batch.extras.items():
            node[key] = value
    output = HERE / "shell.glb"
    bpy.ops.export_scene.gltf(filepath=str(output), export_format="GLB", export_yup=True,
                             export_apply=True, export_extras=True)
    asset = output.read_bytes()
    magic, version, size, length, chunk = struct.unpack_from("<4s4I", asset)
    if (magic, version, size, chunk) != (b"glTF", 2, len(asset), 0x4e4f534a):
        raise ValueError("Invalid GLB header")
    if size > 5_000_000:
        raise ValueError(f"Stadium shell exceeds 5 MB: {size} bytes")
    doc = json.loads(asset[20:20 + length])
    nodes = [n for n in doc["nodes"] if "mesh" in n]
    if any(set(node) & {"matrix", "translation", "rotation", "scale"} for node in nodes):
        raise ValueError("Export must retain the baked model frame")
    positions = [(node["name"], doc["accessors"][item["attributes"]["POSITION"]])
                 for node in nodes for item in doc["meshes"][node["mesh"]]["primitives"]]
    bounds = {"min": [min(a["min"][i] for _, a in positions) for i in range(3)],
              "max": [max(a["max"][i] for _, a in positions) for i in range(3)]}
    minimum_roof_y = min(a["min"][1] for name, a in positions if name.startswith("shell_roof_truss"))
    clearance = minimum_roof_y - SEAT_HEIGHT
    if clearance <= 3:
        raise ValueError(f"Insufficient roof clearance: {clearance:.3f} m")
    if any(bounds["min"][i] > LAYOUT["seatBounds"]["min"][i]
           or bounds["max"][i] < LAYOUT["seatBounds"]["max"][i] for i in range(3)):
        raise ValueError("Seating envelope exceeds shell bounds")
    manifest = {
        "venueId": VENUE,
        "generator": "blender-bpy",
        "version": 1,
        "coordinateBasis": "estimated-parametric",
        "upAxis": "+Y",
        "units": "meters",
        "precision": "illustrative",
        "lightingPreset": "stadium-dusk",
        "sourceSeatsCount": LAYOUT["sourceSeatsCount"],
        "visualSeating": {"precision": "illustrative", "layer": "runtime-parametric",
                          "chairCount": LAYOUT["totalRenderedChairs"]},
        "seatBounds": LAYOUT["seatBounds"],
        "bounds": {key: [round(n, 3) for n in values] for key, values in bounds.items()},
        "roofNodeNames": sorted(n["name"] for n in nodes if n["name"].startswith("shell_roof_")),
        "ribbonNodeNames": sorted(n["name"] for n in nodes if n["name"].startswith("shell_ribbon_led")),
        "assetBytes": size,
        "meshPrimitives": len(positions),
        "roofTrussClearanceAboveIllustrativeSeating": round(clearance, 3),
        "referenceUrls": references,
        "notes": notes,
    }
    (HERE / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


def reset_scene():
    if LAYOUT["sourceSeatsCount"]:
        raise ValueError("This illustrative shell requires a section-only catalog")
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.context.scene.unit_settings.system = "METRIC"

def facade_point(theta, level, offset=0):
    # The steel leaves the concrete bowl as an open, expanding outer layer.
    rise = 54.5 + 6.2 * math.cos(theta * 2)
    return oval(theta, 122 + 14 * math.sin(level * math.pi * .73) + offset,
                149 + 15 * math.sin(level * math.pi * .74) + offset, rise * level)


def facade():
    drum = Mesh("shell_bowl_mass_cladding_red_bowl", "Deep vermilion precast concrete", (.38, .047, .043))
    warm = Mesh("shell_bowl_mass_cladding_red_panels", "Red aluminum concourse panels", (.48, .057, .039),
                roughness=.61, metal=.22)
    shadow = Mesh("shell_bowl_mass_concourse_recess", "Subdued vermilion concrete", (.15, .028, .021))
    glazing = Mesh("shell_bowl_mass_suite_glass", "Smoke tinted concourse glass", (.22, .25, .24), roughness=.33)
    base = Mesh("shell_bowl_mass_plinth", "Cool slate precast concrete", (.25, .28, .29))
    steel = Mesh("shell_bowl_mass_exoskeleton_primary", "Silver gray box section steel", (.48, .53, .55),
                 roughness=.63, metal=.29)
    tie = Mesh("shell_bowl_mass_exoskeleton_secondary", "Pale galvanized box section steel", (.62, .655, .66),
               roughness=.62, metal=.23)
    door = Mesh("shell_vomitories_exterior_portals", "Recessed stadium entrances", (.039, .046, .052))
    edge = Mesh("shell_ribbon_led_approach_static", "Amber portal light", (.65, .27, .095), glow=.34)

    rings = [(120.1, 145.1, -.18), (120.4, 145.5, 5.3), (119.7, 145.1, 7.2),
             (119.8, 145.6, 13.6), (115.7, 145.1, 15.2), (116.2, 145.6, 22.5),
             (115.7, 145.1, 24.1), (116.2, 145.6, 33.5), (115.7, 145.1, 36.4),
             (116.7, 147, 49.2)]
    profiles = [[oval(t, *ring) for t in ANGLES] for ring in rings]
    for i, layer in enumerate((base, shadow, drum, shadow, warm, shadow, drum, shadow, drum)):
        layer.strip(profiles[i + 1], profiles[i])
    glazing.strip([oval(t, 116.3, 146, 36.14) for t in ANGLES],
                  [oval(t, 116.3, 146, 33.83) for t in ANGLES])
    for i in range(0, STEPS - 1, 6):
        t = ANGLES[i]
        a, b = [oval(t + d, 120.68, 145.85, .12) for d in (-.033, .033)]
        door.face(raised(a, 3.8), raised(b, 3.8), b, a)
        edge.bar(raised(a, 3.46), raised(b, 3.46), .11)
        for y in (13.75, 22.58, 33.62):
            warm.bar(oval(t, 116.52, 146.2, y), oval(t, 116.52, 146.2, y + 2.18), .23)

    # Primary bent box girders meet lighter diagonals across an irregular
    # triangular grid. Keep the lower structural lattice with the facade.
    for i in range(24):
        angle = math.tau * i / 24
        twist = .12 * math.sin(1.71 * i)
        for side in (-1, 1):
            steel.rail([
                facade_point(angle + side * .063, 0, -.8),
                facade_point(angle + side * .128 + twist, .29 + .045 * math.sin(i), 1.9),
                facade_point(angle + side * .065 + twist, .65 + .037 * math.cos(i * 1.7), .55),
                facade_point(angle + side * .17, 1)], 1.62, 2.04)
        steel.bar(facade_point(angle, .92), raised(facade_point(angle, 1), 5.12), 1.77, 2.28)
        tie.rail([
            facade_point(angle - .16, .04, .9),
            facade_point(angle - .015, .40 + .088 * math.cos(i * 2.1), 1.85),
            facade_point(angle + .17, .68 + .074 * math.sin(i * 1.4), .9),
            facade_point(angle + .335, 1, .06)], 1.15, 1.27)
        tie.rail([
            facade_point(angle + .23, .10, 1.07),
            facade_point(angle + .095, .53 + .12 * math.sin(i * 1.3), 1.95),
            facade_point(angle - .14, .88 + .038 * math.cos(i), 1.04)], .98, 1.19)
    return profiles[-1]


def canopy():
    silver = Mesh("shell_roof_truss_box_steel", "Satin silver roof box girders", (.51, .55, .56),
                  roughness=.55, metal=.32)
    seams = Mesh("shell_roof_truss_lattice_bracing", "Pale steel weave and seams", (.55, .60, .62),
                 roughness=.58, metal=.27)
    skin = [Mesh(f"shell_roof_canopy_etfe_{i}", "Translucent cushion membrane", c, roughness=.53, metal=.05,
                 alpha=.72, unshadowed=True)
            for i, c in enumerate(((.59, .65, .68), (.72, .76, .77), (.65, .71, .73)), start=1)]

    def roof_point(t, u, lift=0):
        x, y, z = facade_point(t, 1)
        # U runs from the inner opening to the crest of the braided facade.
        # With a raised inner high rim, every radial chord clears the top bank.
        inner = oval(t, 53, 84, SEAT_HEIGHT + 8.4 + 1.8 * math.cos(2 * t))
        return raised(mix(inner, (x, y + 5.7, z), u), 4.15 * math.sin(math.pi * u) + lift)

    for i in range(STEPS):
        a, b = ANGLES[i:i + 2]
        fractions = (0, .18, .36, .57, .77, 1)
        for j, (u, v) in enumerate(zip(fractions, fractions[1:])):
            skin[((i // 3) * 3 + i // 9 + j * 5) % 3].face(
                roof_point(a, u, -.66), roof_point(b, u, -.66),
                roof_point(b, v, -.66), roof_point(a, v, -.66))

    silver.rail([roof_point(t, 0, -.38) for t in ANGLES], 1.28, 1.63)
    silver.rail([roof_point(t, 1, -.38) for t in ANGLES], 1.43, 1.66)
    for i in range(24):
        t = math.tau * i / 24
        for direction in (-1, 1):
            bend = .07 * math.sin(i * 1.37) + direction * .1
            silver.rail([roof_point(t + bend * (.8 - u) + direction * (.82 - u) * .31, u, .32)
                         for u in (0, .28, .55, .74, 1)], 1.21, 1.30)
        wobble = .055 * math.cos(i * 2.39)
        for j in range(2):
            seams.rail([roof_point(t + (.17 + wobble) * u + j * .122, u, .3)
                        for u in (.11, .34, .53, .73, 1)], .86, .92)
        seams.rail([roof_point(t + offset + wobble, u, .46)
                    for offset, u in ((-.13, .18), (0, .38), (.14, .55), (.28, .61), (.41, .79))],
                   .77, .82)


def field():
    apron = Mesh("shell_field_floor_concourse", "Slate Olympic podium", (.245, .26, .27), unshadowed=True)
    grass = Mesh("shell_field_floor_infield", "Infield turf", (.06, .19, .053))
    track = Mesh("shell_field_floor_athletics_track", "Olympic red rubber track", (.35, .086, .062))
    lanes = Mesh("shell_field_floor_track_markings", "Track lane paint", (.74, .65, .57))
    curb = Mesh("shell_bowl_mass_plinth_edge", "Slate plinth edging", (.205, .215, .216))
    ys = -.065
    # Track and pitch fit the existing illustrative lower oval. Keep all
    # markings below the runtime event stage platform at Y=0.
    half_pitch_x, half_pitch_z = 30.8, 47.8
    grid = sorted(set(ANGLES) | {
        math.atan2(z, x) % math.tau
        for x in (-half_pitch_x, half_pitch_x) for z in (-half_pitch_z, half_pitch_z)})

    def running_line(radius, y):
        points = []
        for t in grid:
            x, z = math.cos(t), math.sin(t)
            side = radius / max(abs(x), 1e-6)
            reach = .86 * 42.195
            r = side if abs(z) * side <= reach else reach * abs(z) + math.sqrt(radius ** 2 - (reach * x) ** 2)
            points.append((x * r, y, z * r))
        return points

    pitch_border = [oval(t, 1, 1, ys) for t in grid]
    pitch_border = [(x * r, y, z * r) for x, y, z in pitch_border
                    for r in [min(half_pitch_x / max(abs(x), 1e-8), half_pitch_z / max(abs(z), 1e-8))]]
    inner = running_line(33.4, ys)
    grass.strip(pitch_border, inner)
    outline = inner
    for i in range(1, 9):
        before = running_line(33.4 + i * 1.22 - .038, ys)
        after = running_line(33.4 + i * 1.22 + .038, ys)
        track.strip(outline, before)
        lanes.strip(before, after)
        outline = after
    boundary = [oval(t, 142, 171, -.19) for t in grid]
    apron.strip(outline, boundary)
    curb.strip(boundary, [raised(p, -.48) for p in boundary])
    pitch(half_pitch_x, half_pitch_z, ys)


reset_scene()
stands(facade(), (.82, .21, .096))
canopy()
field()
export([
    "Original interpretation of the Bird's Nest open steel facade, saddle-shaped roof lattice and translucent membrane ring.",
    "The enclosed red bowl and open concourse lattice remain visible when toggling the roof.",
    "Existing anonymous runtime seating fills the section-only catalog. Shell and seating are indicative visual geometry."
], [
    "https://www.herzogdemeuron.com/projects/226-national-stadium/",
    "https://www.arup.com/en-us/projects/chinese-national-stadium/"
])
