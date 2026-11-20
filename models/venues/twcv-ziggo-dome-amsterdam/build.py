"""Generate the Ziggo Dome black box and separated light facade in StagePeek metres."""
import json
import math
from pathlib import Path
import struct
import subprocess

import bmesh
import bpy
from mathutils import Vector

HERE = Path(__file__).resolve().parent
VENUE = "twcv-ziggo-dome-amsterdam"
banks = json.loads(subprocess.check_output(["node", HERE / "banks.mjs"]))
probe = json.loads(subprocess.check_output(["node", HERE.parents[2] / "scripts/probe-venue-bounds.mjs", VENUE]))
layout = probe["layouts"]["zgd"]
seat_bounds = layout["seatBounds"]
WEST, EAST = -45.7, 45.7
NORTH, SOUTH = -36.6, 59.6
EAVE = 29.8
parts = {}

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.context.scene.unit_settings.system = 'METRIC'


def surface(name, color, label, *, metal=0., roughness=.75, glow=0., alpha=1.):
    material = bpy.data.materials.new(label)
    material.diffuse_color = (*color, alpha)
    shader = material.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = material.diffuse_color
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Metallic"].default_value = metal
    shader.inputs["Alpha"].default_value = alpha
    shader.inputs["Emission Color"].default_value = (*color, 1.)
    shader.inputs["Emission Strength"].default_value = glow
    mesh = ([], [])
    parts[name] = material, mesh
    return mesh


def face(mesh, *points):
    vertices, facets = mesh
    facets.append(tuple(range(len(vertices), len(vertices) + len(points))))
    vertices.extend(tuple(point) for point in points)


def beam(mesh, start, end, width, depth=None):
    a, b = Vector(start), Vector(end)
    axis = (b-a).normalized()
    cross = axis.cross(Vector((0, 1, 0)))
    if cross.length < .01:
        cross = axis.cross(Vector((1, 0, 0)))
    side = cross.normalized() * width / 2
    normal = axis.cross(side).normalized() * (depth or width) / 2
    front = [a+side*x+normal*y for x,y in ((-1,-1),(1,-1),(1,1),(-1,1))]
    back = [p+b-a for p in front]
    face(mesh, *reversed(front))
    face(mesh, *back)
    for i in range(4):
        j = (i+1) % 4
        face(mesh, front[i], front[j], back[j], back[i])


def edge(side, u, y, offset=0.):
    if side == 0:
        return WEST-offset+(EAST-WEST+2*offset)*u, y, NORTH-offset
    if side == 1:
        return EAST+offset, y, NORTH-offset+(SOUTH-NORTH+2*offset)*u
    if side == 2:
        return EAST+offset-(EAST-WEST+2*offset)*u, y, SOUTH+offset
    return WEST-offset, y, SOUTH+offset-(SOUTH-NORTH+2*offset)*u


def strip(mesh, side, u0, u1, low, high, offset=0.):
    points = (edge(side,u0,low,offset),edge(side,u1,low,offset),
              edge(side,u1,high,offset),edge(side,u0,high,offset))
    face(mesh, *(points if offset < 0 else reversed(points)))


soffit = surface("shell_bowl_mass_terrace_soffits", (.085,.101,.119), "Cast-in-place concrete")
for panel in banks["supports"]:
    face(soffit, *panel)

body = surface("shell_bowl_mass_cladding", (.026,.033,.045), "Blackened aluminium", metal=.38)
inner = surface("shell_bowl_mass_acoustic_panels", (.037,.047,.061), "Charcoal acoustic wall", roughness=.95)
base = surface("shell_bowl_mass_plinth", (.13,.15,.174), "Exposed precast concrete")
mullions = surface("shell_bowl_mass_facade_panels", (.12,.145,.17), "Satin aluminium details", metal=.52)
glass = surface("shell_bowl_mass_suite_glass_lobby", (.043,.11,.151), "Blue lobby glazing", roughness=.28, metal=.22, alpha=.7)
ports = surface("shell_vomitories_exterior", (.030,.042,.057), "Recessed door portals", metal=.21)
entry = surface("shell_ribbon_led_entry_static", (.64,.65,.63), "Warm entry lighting", glow=.65)
screen_dead = surface("shell_bowl_mass_light_facade_backing", (.019,.022,.029), "Dark LED mask", roughness=.69)
screens = [
    surface("shell_ribbon_led_facade_violet", (.34,.072,.22), "Violet facade diodes", glow=.61),
    surface("shell_ribbon_led_facade_indigo", (.055,.12,.30), "Indigo facade diodes", glow=.62),
    surface("shell_ribbon_led_facade_ice", (.11,.36,.56), "Ice blue facade diodes", glow=.68),
]
ribbon = surface("shell_ribbon_led_bowl", (.18,.16,.37), "Indigo bowl ribbon", glow=.53)
rails = surface("shell_balustrades_concourse", (.25,.30,.36), "Smoked-steel barriers", metal=.52)
guard = surface("shell_balustrades_balcony_glass", (.10,.18,.27), "Smoked balcony glass",
                roughness=.25, metal=.19, alpha=.42)
for bank in banks["balconies"]:
    for a,b in zip(bank,bank[1:]):
        low_a,low_b = [(x*.996,y+.08,z*.996) for x,y,z in (a,b)]
        high_a,high_b = [(x,y+.52,z) for x,y,z in (low_a,low_b)]
        face(guard,low_a,low_b,high_b,high_a)
        beam(rails,high_a,high_b,.065)
for side in range(4):
    strip(base,side,0,1,-.28,1.)
    strip(body,side,0,1,1.,EAVE)
    strip(inner,side,0,1,.2,26.3,-.33)
    strip(screen_dead,side,0,1,7.7,29.55,.76)
    for y in (7.5, 18.3, 29.6):
        beam(mullions,edge(side,0,y,.90),edge(side,1,y,.90),.19)
    for i in range(15):
        u = (i+.5)/15
        beam(mullions,edge(side,u,7.6,.87),edge(side,u,29.6,.87),.085)
        if i % 3 == 0:
            strip(ports,side,u-.016,u+.016,.35,4.68,.067)
            beam(entry,edge(side,u-.016,4.75,.09),edge(side,u+.016,4.75,.09),.095)
    if side in (1,2,3):
        for i in range(10):
            a,b = (i+.05)/10,(i+.95)/10
            strip(glass,side,a,b,1.35,6.38,.099)
            beam(mullions,edge(side,a,1.24,.14),edge(side,a,6.53,.14),.16)
        strip(ribbon,side,.025,.975,23.1,23.82,-.45)
        beam(rails,edge(side,.04,22.9,-.46),edge(side,.96,22.9,-.46),.12)
    # Sample a dense but readable field of diodes. The hardware and event
    # imagery are abstracted by three batches of individually spaced pixels.
    for row in range(27):
        for col in range(112):
            t = col/112
            wave = row - 12 - 6*math.sin((t+side)*math.tau) + 3*math.sin(t*math.tau*2)
            index = 2 if abs(wave)<2.8 else 1 if wave>0 else 0
            if abs(wave)>10 and (col+row*3)%4 in (1,2):
                continue
            u0 = (col+.20)/112
            y = 8.1 + row*.78
            strip(screens[index],side,u0,u0+.0034,y,y+.26,.96)

canopy = surface("shell_roof_canopy_plate", (.045,.052,.070), "Dark zinc roof cladding", metal=.34, roughness=.62)
seams = surface("shell_roof_canopy_seams", (.105,.12,.15), "Standing seams", metal=.48)
structure = surface("shell_roof_truss_steel", (.171,.202,.24), "Coal-grey steel grid", metal=.46)
for side in range(4):
    strip(canopy,side,0,1,29.4,31.25,.94)
face(canopy,(WEST-.94,31.25,NORTH-.94),(WEST-.94,31.25,SOUTH+.94),(EAST+.94,31.25,SOUTH+.94),(EAST+.94,31.25,NORTH-.94))
for i in range(17):
    z = NORTH+(SOUTH-NORTH)*(i+.5)/17
    beam(seams,(WEST,31.35,z),(EAST,31.35,z),.14)
for i in range(8):
    z = NORTH+5+(SOUTH-NORTH-10)*i/7
    for j in range(12):
        a,b = WEST+.6+(EAST-WEST-1.2)*j/12, WEST+.6+(EAST-WEST-1.2)*(j+1)/12
        beam(structure,(a,25.45,z),(b,25.45,z),.37)
        beam(structure,(a,28.7,z),(b,28.7,z),.31)
        beam(structure,(a,25.45,z),(b,28.7,z),.18)
        beam(structure,(b,25.45,z),(b,28.7,z),.16)
for x in (-31., -15.5, 0., 15.5, 31.):
    beam(structure,(x,27.5,NORTH+.65),(x,27.5,SOUTH-.65),.36)

ground = surface("shell_field_floor_deck", (.045,.051,.064), "Dark event deck", roughness=.82)
floor_rim = surface("shell_field_floor_perimeter", (.092,.112,.13), "Concourse floor concrete")
face(ground,(WEST+.55,-.10,NORTH+.55),(WEST+.55,-.10,SOUTH-.55),
     (EAST-.55,-.10,SOUTH-.55),(EAST-.55,-.10,NORTH+.55))
for side in range(4):
    face(floor_rim,edge(side,0,-.26,.46),edge(side,1,-.26,.46),
         edge(side,1,-.26,-.7),edge(side,0,-.26,-.7))

for name,(material,(vertices,facets)) in parts.items():
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata([(x,-z,y) for x,y,z in vertices],[],facets)
    mesh.validate()
    data = bmesh.new()
    data.from_mesh(mesh)
    bmesh.ops.remove_doubles(data,verts=list(data.verts),dist=.00001)
    # Preserve the outward winding on independent diode faces.
    if not name.startswith("shell_ribbon_led_facade_"):
        bmesh.ops.recalc_face_normals(data,faces=list(data.faces))
    data.to_mesh(mesh)
    data.free()
    mesh.update()
    obj = bpy.data.objects.new(name,mesh)
    bpy.context.scene.collection.objects.link(obj)
    mesh.materials.append(material)
    material.use_backface_culling = False

output = HERE / "shell.glb"
bpy.ops.export_scene.gltf(filepath=str(output),export_format='GLB',export_yup=True,
                          export_apply=True,export_extras=True,export_cameras=False,export_lights=False)
with output.open('rb') as binary:
    binary.seek(12)
    size,_ = struct.unpack('<II',binary.read(8))
    document = json.loads(binary.read(size))
accessors = [document["accessors"][primitive["attributes"]["POSITION"]]
             for mesh in document["meshes"] for primitive in mesh["primitives"]]
names = [node["name"] for node in document["nodes"]]
assert output.stat().st_size <= 3_000_000
manifest = {
    "venueId": VENUE, "generator": "blender-bpy", "version": 1, "upAxis": "+Y", "units": "metres",
    "coordinateBasis": "source-model-xyz", "precision": "illustrative-architecture", "seatBounds": seat_bounds,
    "bounds": {key: [round(fn(a[key][axis] for a in accessors), 4) for axis in range(3)]
               for key,fn in [('min',min),('max',max)]},
    "sourceSeatsCount": layout["sourceSeatsCount"], "meshPrimitives": len(accessors), "assetBytes": output.stat().st_size,
    "roofNodeNames": [name for name in names if name.startswith("shell_roof_")],
    "ribbonNodeNames": [name for name in names if name.startswith("shell_ribbon_led")], "lightingPreset": "arena-dark",
    "references": ["https://www.benthemcrouwel.com/projects/ziggo-dome-amsterdam",
                   "https://www.hoogendoornbv.nl/projecten/ziggo-dome/"],
    "notes": "Original black-box shell fitted to the retained seating. Acoustic treatment, glazing and the faceted LED arrangement are schematic. No ticket geometry is exported.",
}
(HERE / "manifest.json").write_text(json.dumps(manifest,indent=2)+"\n")
