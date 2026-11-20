"""Build the United Center arena shell in the retained StagePeek seat frame."""
import json
import math
from pathlib import Path
import struct
import subprocess

import bpy
from mathutils import Vector

HERE = Path(__file__).resolve().parent
VENUE = "twcv-united-center-chicago"
probe = json.loads(subprocess.check_output(
    ["node", HERE.parents[2] / "scripts/probe-venue-bounds.mjs", VENUE]
))
layout = probe["layouts"]["unc"]
seat_bounds = layout["seatBounds"]
fascias = json.loads(subprocess.check_output(["node", HERE / "galleries.mjs"]))
CX, _, CZ = seat_bounds["center"]
RX = seat_bounds["size"][0] / 2 + 4.84
RZ = seat_bounds["size"][2] / 2 + 5.18
EAVE = 35.8
SAMPLES = 104
parts = {}

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.context.scene.unit_settings.system = "METRIC"


def batch(name, label, rgb, *, metal=0, roughness=.73, glow=0, opacity=1):
    material = bpy.data.materials.new(label)
    material.diffuse_color = (*rgb, opacity)
    shader = material.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*rgb, 1)
    shader.inputs["Metallic"].default_value = metal
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Alpha"].default_value = opacity
    shader.inputs["Emission Color"].default_value = (*rgb, 1)
    shader.inputs["Emission Strength"].default_value = glow
    vertices, faces = [], []
    parts[name] = material, vertices, faces
    return vertices, faces


def face(mesh, *points):
    vertices, faces = mesh
    faces.append(tuple(range(len(vertices), len(vertices) + len(points))))
    vertices.extend(tuple(point) for point in points)


def beam(mesh, start, end, width, depth=None):
    a, b = Vector(start), Vector(end)
    direction = (b - a).normalized()
    cross = direction.cross(Vector((0, 1, 0)))
    if cross.length < .01:
        cross = direction.cross(Vector((1, 0, 0)))
    side = cross.normalized() * width / 2
    up = direction.cross(side).normalized() * (depth or width) / 2
    first = [a + side * x + up * y for x, y in ((-1, -1), (1, -1), (1, 1), (-1, 1))]
    last = [point + b - a for point in first]
    face(mesh, *reversed(first))
    face(mesh, *last)
    for i in range(4):
        j = (i + 1) % 4
        face(mesh, first[i], first[j], last[j], last[i])


def ring(scale, y):
    # A rounded rectangle keeps the broad side stands inside the building.
    points = []
    for i in range(SAMPLES):
        theta = math.tau * i / SAMPLES
        rho = scale / (math.cos(theta) ** 4 + math.sin(theta) ** 4) ** .25
        points.append((CX + RX * rho * math.cos(theta), y, CZ + RZ * rho * math.sin(theta)))
    return points


def band(mesh, low, high, *, inward=False):
    for i in range(SAMPLES):
        j = (i + 1) % SAMPLES
        quad = (low[i], high[i], high[j], low[j])
        face(mesh, *(reversed(quad) if inward else quad))


def slab(mesh, south_west, north_east, bottom, top):
    x0, z0 = south_west
    x1, z1 = north_east
    rim = [(x0, z0), (x1, z0), (x1, z1), (x0, z1)]
    low = [(x, bottom, z) for x, z in rim]
    high = [(x, top, z) for x, z in rim]
    face(mesh, *low)
    face(mesh, *reversed(high))
    for i in range(4):
        j = (i + 1) % 4
        face(mesh, low[i], high[i], high[j], low[j])


plinth = batch("shell_bowl_mass_plinth", "Precast entry plinth", (.19, .17, .145))
brick = batch("shell_bowl_mass_brick_cladding", "Banded reddish masonry", (.18, .102, .075))
panel = batch("shell_bowl_mass_precast", "Warm grey precast upper walls", (.34, .30, .247))
head = batch("shell_bowl_mass_spandrels", "Recessed dark metal spandrels", (.045, .057, .070), metal=.44)
trim = batch("shell_bowl_mass_masonry_joints", "Dark brick relief joints", (.117, .066, .05))
liner = batch("shell_bowl_mass_acoustic_liner", "Bowl-facing acoustic lining", (.085, .069, .075), roughness=.94)
band(plinth, ring(1.023, -.29), ring(1.023, .55))
band(brick, ring(1.010, .50), ring(1.010, 11.15))
band(panel, ring(1.011, 11.15), ring(1.011, 26.0))
band(head, ring(1.014, 25.96), ring(1.014, EAVE))
band(liner, ring(.998, -.13), ring(.998, EAVE), inward=True)
for y in (2.9, 5.55, 8.2, 10.85):
    band(trim, ring(1.012, y), ring(1.012, y + .14))
for y in (11.1, 15.7, 21.6, 25.9, 29.4, 34.7):
    band(panel, ring(1.020, y), ring(1.020, y + .32))
for i in range(0, SAMPLES, 4):
    a, b = ring(1.020, 11.45)[i], ring(1.020, 25.9)[i]
    beam(panel, a, b, .31, .20)

guard = batch("shell_balustrades_concourse_glass", "Concourse glass guards",
              (.14, .24, .29), metal=.17, roughness=.24, opacity=.36)
guard_cap = batch("shell_balustrades_concourse_rail", "Brushed alloy rail cap", (.28, .31, .34), metal=.52)
suite = batch("shell_bowl_mass_suite_glass", "Suite-front smoked glazing",
              (.075, .15, .19), metal=.18, roughness=.26, opacity=.53)
suite_back = batch("shell_bowl_mass_suite_recess", "Suite recess and shadows", (.045, .047, .052))
suite_glow = batch("shell_bowl_mass_suite_ceiling_lights", "Warm suite ceiling light",
                   (.92, .57, .31), glow=.60)
rail = batch("shell_bowl_mass_suite_mullions", "Black powder-coated suite framing",
             (.12, .131, .143), metal=.55)
ribbon = batch("shell_ribbon_led_bowl", "Crimson arena ribbon", (.36, .042, .065), glow=.72)


def fascia_strip(mesh, a, b, y0, y1, opening=.0):
    # Set the infill a few centimetres in front of the existing fascia.
    def point(p, y):
        dx, dz = p[0] - CX, p[2] - CZ
        distance = math.hypot(dx, dz)
        return p[0] - dx * opening / distance, y, p[2] - dz * opening / distance
    quad = [point(a, y0), point(b, y0), point(b, y1), point(a, y1)]
    normal = (Vector(quad[1]) - Vector(quad[0])).cross(Vector(quad[2]) - Vector(quad[0]))
    center_direction = Vector((CX - a[0], 0, CZ - a[2]))
    face(mesh, *(quad if normal.dot(center_direction) > 0 else reversed(quad)))


for index, (a, b, bottom) in enumerate(fascias):
    y = bottom + 1.08
    fascia_strip(guard, a, b, bottom + .04, bottom + .89, .15)
    fascia_strip(guard_cap, a, b, bottom + .85, bottom + .91, .17)
    fascia_strip(suite, a, b, y, y + 1.48, .10)
    fascia_strip(suite_back, a, b, y + .03, y + 1.47, .05)
    fascia_strip(suite_glow, a, b, y + 1.36, y + 1.43, .077)
    fascia_strip(rail, a, b, y - .08, y, .133)
    fascia_strip(rail, a, b, y + 1.45, y + 1.53, .13)
    if bottom > 10:
        fascia_strip(ribbon, a, b, y - .43, y - .13, .12)
    if index % 6 == 0:
        dx, dz = a[0]-CX, a[2]-CZ
        point = a[0]-dx*.125/math.hypot(dx,dz), a[2]-dz*.125/math.hypot(dx,dz)
        beam(rail, (point[0], y, point[1]), (point[0], y+1.49, point[1]), .07)

radius, y = .982, 27.45
band(suite, ring(radius, y + .25), ring(radius, y + 1.76), inward=True)
band(suite_back, ring(radius + .008, y + .32), ring(radius + .008, y + 1.80), inward=True)
band(suite_glow, ring(radius + .006, y + 1.62), ring(radius + .006, y + 1.70), inward=True)
band(rail, ring(radius - .001, y + .17), ring(radius - .001, y + .28), inward=True)
band(rail, ring(radius - .001, y + 1.72), ring(radius - .001, y + 1.86), inward=True)
band(ribbon, ring(radius - .003, y - .25), ring(radius - .003, y + .14), inward=True)
low, high = ring(radius - .001, y + .20), ring(radius - .001, y + 1.82)
for i in range(0, SAMPLES, 2):
    beam(rail, low[i], high[i], .071)

portals = batch("shell_vomitories_entry_portals", "Recessed public doorframes", (.068, .079, .093), metal=.42)
atrium = batch("shell_bowl_mass_suite_glass_east_atrium", "East atrium glazing",
               (.08, .20, .29), metal=.22, roughness=.24, opacity=.68)
frame = batch("shell_bowl_mass_east_atrium_frame", "East atrium steel mullions", (.34, .37, .37), metal=.43)
inner = batch("shell_bowl_mass_east_atrium_interior", "Illuminated east lobby", (.22, .13, .082), glow=.37)
sx = CX + RX * .985
east, z0, z1 = CX + RX + 10.3, CZ - 25.8, CZ + 25.8
slab(plinth, (sx, z0 - .7), (east + .8, z1 + .7), -.29, .43)
slab(frame, (sx, z0 - .31), (east + .33, z1 + .31), 15.9, 16.36)
slab(inner, (sx, z0 + .40), (east - 1.75, z1 - .40), 6.2, 6.43)
slab(inner, (sx, z0 + .40), (east - 1.75, z1 - .40), 11.72, 11.94)
face(atrium, (east, .42, z0), (east, 16.0, z0), (east, 16.0, z1), (east, .42, z1))
face(atrium, (sx, .42, z0), (sx, 16.0, z0), (east, 16.0, z0), (east, .42, z0))
face(atrium, (east, .42, z1), (east, 16.0, z1), (sx, 16.0, z1), (sx, .42, z1))
for i in range(19):
    z = z0 + (z1 - z0) * i / 18
    beam(frame, (east+.08, .43, z), (east+.08, 16.0, z), .15 if i % 3 else .28)
for y in (3.5, 6.4, 9.4, 12.0, 15.74):
    beam(frame, (east+.1, y, z0), (east+.1, y, z1), .18)
    for z in (z0, z1):
        beam(frame, (sx, y, z), (east, y, z), .18)
for i in range(6):
    z = z0 + (z1 - z0) * (i + .5) / 6
    slab(portals, (east-.11, z-1.5), (east+.12, z+1.5), .43, 2.95)
slab(head, (east-.3, CZ-16.5), (east+3.4, CZ+16.5), 3.9, 4.27)
for z in (CZ-15.9, CZ-8, CZ, CZ+8, CZ+15.9):
    beam(frame, (east+3.05, .41, z), (east+3.05, 3.92, z), .22)

canopy = batch("shell_roof_canopy_standing_seam", "Zinc hipped roof", (.20, .213, .23), metal=.41)
flashing = batch("shell_roof_canopy_flashing", "Bright seam ribs", (.31, .333, .35), metal=.48)
steel = batch("shell_roof_truss_long_span", "Exposed brown-black steel trusses", (.208, .17, .156), metal=.51)
band(canopy, ring(1.023, EAVE - .22), ring(1.023, EAVE + .32))
band(canopy, ring(1.023, EAVE + .31), ring(.836, 39.65))
face(canopy, *reversed(ring(.836, 39.65)))
outer, inner = ring(1.024, EAVE + .42), ring(.836, 39.77)
for i in range(0, SAMPLES, 2):
    beam(flashing, outer[i], inner[i], .085)
for i in range(15):
    z = CZ - 55.4 + i * 7.9
    half = RX * (.985**4 - ((z - CZ) / RZ)**4)**.25
    span = 2*half
    beam(steel, (CX-half, 30.78, z), (CX+half, 30.78, z), .66)
    beam(steel, (CX-half, 34.80, z), (CX+half, 34.80, z), .54)
    for bay in range(12):
        x0 = CX - half + span * bay / 12
        x1 = CX - half + span * (bay+1) / 12
        beam(steel, (x0, 30.78, z), (x1, 34.80, z), .26)
        beam(steel, (x1, 30.78, z), (x1, 34.80, z), .20)
for x in (-44, -24, 0, 24, 44):
    beam(steel, (CX+x, 33.08, CZ-57), (CX+x, 33.08, CZ+57), .42)

deck = batch("shell_field_floor_event_deck", "Charcoal event slab", (.064, .064, .070))
face(deck, *reversed(ring(1.004, -.12)))

for name, (material, vertices, faces) in parts.items():
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata([(x, -z, y) for x, y, z in vertices], [], faces)
    mesh.validate()
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    obj.data.materials.append(material)
    bpy.context.scene.collection.objects.link(obj)

output = HERE / "shell.glb"
bpy.ops.export_scene.gltf(filepath=str(output), export_format="GLB", export_yup=True,
                         export_apply=True, export_extras=True, export_cameras=False, export_lights=False)
with output.open("rb") as binary:
    binary.seek(12)
    size, _ = struct.unpack("<II", binary.read(8))
    document = json.loads(binary.read(size))
accessors = [document["accessors"][primitive["attributes"]["POSITION"]]
             for mesh in document["meshes"] for primitive in mesh["primitives"]]
names = [node["name"] for node in document["nodes"]]
assert output.stat().st_size <= 3_000_000
manifest = {
    "venueId": VENUE, "generator": "blender-bpy", "version": 1, "upAxis": "+Y",
    "units": "metres", "coordinateBasis": "source-model-xyz", "precision": "illustrative-architecture",
    "seatBounds": seat_bounds, "sourceSeatsCount": layout["sourceSeatsCount"],
    "bounds": {key: [round(fn(a[key][axis] for a in accessors), 4) for axis in range(3)]
               for key, fn in [("min", min), ("max", max)]},
    "meshPrimitives": len(accessors), "assetBytes": output.stat().st_size,
    "roofNodeNames": [name for name in names if name.startswith("shell_roof_")],
    "ribbonNodeNames": [name for name in names if name.startswith("shell_ribbon_led")],
    "lightingPreset": "arena-dark",
    "references": ["https://www.thorntontomasetti.com/project/united-center",
                   "https://www.unitedcenter.com/venue/blueprint/"],
    "notes": "Original masonry, east atrium and long-span steel truss shell fitted to the retained seating. Three schematic suite lines and event deck follow the StagePeek concert layout. The shell contains no ticket geometry."
}
(HERE / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
