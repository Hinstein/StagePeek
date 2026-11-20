"""Build the AsiaWorld-Arena exhibition hall in StagePeek source coordinates."""
import json
import math
from pathlib import Path
import struct
import subprocess

import bmesh
import bpy
from mathutils import Vector

HERE = Path(__file__).resolve().parent
VENUE = "asiaworld-arena"
PROBE = json.loads(subprocess.check_output(
    ["node", HERE.parents[2] / "scripts/probe-venue-bounds.mjs", VENUE]
))
BANKS = json.loads(subprocess.check_output(["node", HERE / "banks.mjs"]))

# Offset beyond the retained banks and end-stage, with a column-free
# floorplate sized near the venue's published 10,880 square metres.
SEATS = PROBE["layouts"]["end"]["seatBounds"]
HALF_WIDTH = max(abs(SEATS["min"][0]), SEATS["max"][0]) + 4.4
STAGE_EDGE = min(part["center"][2] - part["size"][2] / 2
                 for part in PROBE["layouts"]["end"]["stageBoxes"])
NORTH = STAGE_EDGE - 4.4
SOUTH = SEATS["max"][2] + 7.0
EAVE = 22.35
GROUND = -.36

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.context.scene.unit_settings.system = 'METRIC'
parts = {}


def surface(name, label, color, roughness=.78, metal=0., alpha=1., emission=0.):
    material = bpy.data.materials.new(label)
    material.use_backface_culling = False
    shader = material.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, alpha)
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Metallic"].default_value = metal
    shader.inputs["Alpha"].default_value = alpha
    shader.inputs["Emission Color"].default_value = (*color, 1.)
    shader.inputs["Emission Strength"].default_value = emission
    material.diffuse_color = (*color, alpha)
    geometry = ([], [])
    parts[name] = (material, geometry)
    return geometry


def face(geometry, *points):
    vertices, faces = geometry
    faces.append(tuple(range(len(vertices), len(vertices) + len(points))))
    vertices.extend(tuple(point) for point in points)


def prism(geometry, front, back):
    face(geometry, *reversed(front))
    face(geometry, *back)
    for i in range(4):
        j = (i + 1) % 4
        face(geometry, front[i], front[j], back[j], back[i])


def beam(geometry, start, end, width, depth=None):
    start, end = Vector(start), Vector(end)
    axis = (end - start).normalized()
    side = axis.cross(Vector((0, 1, 0)))
    if side.length < .01:
        side = axis.cross(Vector((1, 0, 0)))
    side = side.normalized() * width / 2
    normal = axis.cross(side).normalized() * (depth or width) / 2
    front = [start + side*x + normal*y for x,y in ((-1,-1),(1,-1),(1,1),(-1,1))]
    prism(geometry, front, [point + end - start for point in front])


def box(geometry, x0, x1, y0, y1, z0, z1):
    front = [(x0,y0,z0), (x0,y0,z1), (x1,y0,z1), (x1,y0,z0)]
    prism(geometry, front, [(x,y1,z) for x,_,z in front])


def edge(side, u, y, offset=0.):
    x0, x1, z0, z1 = -HALF_WIDTH-offset, HALF_WIDTH+offset, NORTH-offset, SOUTH+offset
    if side == 0:
        return x0+(x1-x0)*u, y, z0
    if side == 1:
        return x1, y, z0+(z1-z0)*u
    if side == 2:
        return x1-(x1-x0)*u, y, z1
    return x0, y, z1-(z1-z0)*u


def wall(geometry, side, start, end, bottom, top, offset=0.):
    face(geometry, edge(side,start,bottom,offset), edge(side,start,top,offset),
         edge(side,end,top,offset), edge(side,end,bottom,offset))


def roof_y(x):
    return EAVE + 2.25 * (1-(x/(HALF_WIDTH+1.2))**2)


floor = surface("shell_field_floor_slab", "Graphite event flooring", (.057,.067,.076), .89)
box(floor,-HALF_WIDTH,HALF_WIDTH,GROUND,-.12,NORTH,SOUTH)
plinth = surface("shell_bowl_mass_plinth", "Precast concrete plinth", (.12,.123,.124))
box(plinth,-HALF_WIDTH-1,HALF_WIDTH+1,GROUND-.12,GROUND,NORTH-1.4,SOUTH+8.)
bank_skin = surface("shell_bowl_mass_bleacher_skirt", "Retractable bank charcoal shroud", (.077,.084,.094))
bank_back = surface("shell_bowl_mass_grandstand_rear", "Cast-in-place concrete", (.12,.128,.137))
rail = surface("shell_balustrades_rear_concourse", "Brushed steel balustrades", (.22,.25,.28), .45,.50)
for bank in BANKS:
    front, back, rear = bank["front"], bank["back"], bank["rear"]
    for i in range(0,len(front)-1,2):
        j = min(i+2,len(front)-1)
        a,b,c,d = [(x,.34,z) for x,_,z in (front[i],front[j],back[j],back[i])]
        face(bank_skin,a,b,c,d)
        face(bank_skin,a,(a[0],-.11,a[2]),(b[0],-.11,b[2]),b)
        a,b = rear[i],rear[j]
        face(bank_back, a,b,(b[0],-.11,b[2]),(a[0],-.11,a[2]))
        face(bank_back, back[i], back[j], b, a)
        beam(rail,(a[0],a[1]+.86,a[2]),(b[0],b[1]+.86,b[2]),.065)
    for x,y,z in rear[::max(1,len(rear)//5)]:
        beam(rail,(x,y,z),(x,y+.86,z),.045)

cladding = surface("shell_bowl_mass_cladding", "Warm-grey aluminium cassettes", (.37,.40,.41), .65,.36)
base = surface("shell_bowl_mass_facade_base", "Dark grey precast concrete", (.13,.151,.16))
trim = surface("shell_bowl_mass_facade_panels", "Champagne anodised aluminum", (.29,.25,.20), .52,.44)
interior = surface("shell_bowl_mass_acoustic_wall", "Charcoal acoustic backing", (.043,.052,.068), .94)
acoustics = surface("shell_bowl_mass_acoustic_baffles", "Graphite fabric over acoustic panels", (.079,.093,.112), .94)
ports = surface("shell_vomitories_recesses", "Gunmetal door frames", (.067,.078,.090), .65,.23)
exits = surface("shell_ribbon_led_exit_static", "Wayfinding green", (.12,.55,.28), .62, emission=.32)
ribbon = surface("shell_ribbon_led_concourse_display", "Cool blue concourse displays", (.054,.21,.38), .51, emission=.53)
for side in range(4):
    wall(base,side,0,1,GROUND,5.6)
    wall(cladding,side,0,1,5.6,EAVE+.03)
    wall(interior,side,0,1,GROUND,EAVE+.03,-.18)
    beam(trim,edge(side,0,5.63,.08),edge(side,1,5.63,.08),.14)
    beam(trim,edge(side,0,13.2,.075),edge(side,1,13.2,.075),.11)
    for position in range(1,49 if side%2 else 33):
        u = position / (49 if side%2 else 33)
        beam(trim,edge(side,u,5.7,.049),edge(side,u,EAVE,.049),.036)
    # Three horizontal runs of inset sound-absorbing rectangular panels.
    for row in range(3):
        y = 8.25+row*3.15
        for panel in range(28 if side%2 else 20):
            count = 28 if side%2 else 20
            wall(acoustics,side,(panel+.09)/count,(panel+.92)/count,y,y+2.91,-.34)
    if side in (0,1,3):
        for u in (.13,.48,.83):
            wall(trim,side,u-.035,u+.035,.06,4.65,.067)
            wall(ports,side,u-.031,u+.031,.13,4.35,.085)
            for row in range(1,7):
                y = .20 + row*.52
                beam(trim,edge(side,u-.031,y,.112),edge(side,u+.031,y,.112),.039)
    for u in (.15,.34,.66,.85):
        # Perimeter portals sit outside both retained seating envelopes.
        wall(ports,side,u-.020,u+.020,.02,3.68,-.33)
        beam(ports,edge(side,u-.021,.05,-.41),edge(side,u-.021,3.68,-.41),.15)
        beam(ports,edge(side,u+.021,.05,-.41),edge(side,u+.021,3.68,-.41),.15)
        beam(ports,edge(side,u-.021,3.68,-.41),edge(side,u+.021,3.68,-.41),.15)
        wall(exits,side,u-.009,u+.009,4.,4.29,-.43)
        if side in (1,3):
            wall(ribbon,side,u-.030,u+.030,7.16,7.65,-.35)

# The public concourse is a low glazed strip attached to the arena's metal volume.
lobby = surface("shell_bowl_mass_lobby", "Lobby soffit and lining", (.17,.20,.21), .66)
glass = surface("shell_bowl_mass_suite_glass_concourse", "Concourse blue-grey glazing",
                (.093,.21,.25), .26,.17,.68)
lobby_frame = surface("shell_bowl_mass_concourse_frame", "Deep anodised glazing mullions", (.086,.107,.117), .48,.50)
lobby_light = surface("shell_ribbon_led_lobby_static", "Warm concourse lighting", (.52,.38,.22), .69, emission=.45)
box(lobby,-HALF_WIDTH,HALF_WIDTH,5.32,5.76,SOUTH+.04,SOUTH+6.25)
box(lobby,-HALF_WIDTH,HALF_WIDTH,GROUND,-.07,SOUTH+.04,SOUTH+6.25)
box(lobby,-HALF_WIDTH,HALF_WIDTH,4.31,5.3,SOUTH+5.81,SOUTH+6.05)
box(lobby_light,-HALF_WIDTH+.9,HALF_WIDTH-.9,4.95,5.0,SOUTH+3.,SOUTH+3.16)
for i in range(26):
    x0 = -HALF_WIDTH+(2*HALF_WIDTH)*i/26
    x1 = -HALF_WIDTH+(2*HALF_WIDTH)*(i+1)/26
    box(glass,x0+.062,x1-.062,.04,4.28,SOUTH+5.76,SOUTH+5.80)
    box(lobby_frame,x0-.062,x0+.062,-.07,4.31,SOUTH+5.70,SOUTH+5.90)
for x in (-HALF_WIDTH,HALF_WIDTH):
    box(lobby_frame,x-.12,x+.12,-.07,5.32,SOUTH,SOUTH+5.8)
    for i in range(2):
        z = SOUTH+2.81*i
        box(glass,x-.025,x+.025,.08,5.29,z+.10,z+2.73)
        box(lobby_frame,x-.1,x+.1,-.07,5.32,z+2.73,z+2.87)
# A line of metal fins shades the glazed entrance.
for i in range(15):
    x = HALF_WIDTH-.42-i*.37
    box(trim,x-.038,x+.038,.08,5.35,SOUTH+5.91,SOUTH+6.16)

shell = surface("shell_roof_canopy_aluminium", "Standing-seam aluminium", (.39,.43,.46), .58,.38)
seams = surface("shell_roof_canopy_seams", "Weathered folded roof seams", (.32,.356,.38), .58,.42)
truss = surface("shell_roof_truss_long_span", "Charcoal painted long-span steel", (.091,.115,.139), .64,.46)
purlins = surface("shell_roof_truss_secondary", "Galvanised secondary steel", (.14,.17,.191), .63,.37)
bays = [-HALF_WIDTH-1.2+(2*HALF_WIDTH+2.4)*i/30 for i in range(31)]
for i,(x0,x1) in enumerate(zip(bays,bays[1:])):
    z0,z1 = NORTH-1.05,SOUTH+.9
    face(shell,(x0,roof_y(x0),z0),(x0,roof_y(x0),z1),
         (x1,roof_y(x1),z1),(x1,roof_y(x1),z0))
    for z in (z0,z1):
        face(shell,(x0,EAVE-.11,z),(x1,EAVE-.11,z),(x1,roof_y(x1),z),(x0,roof_y(x0),z))
    face(shell,(x0,roof_y(x0)-.16,z1),(x0,roof_y(x0)-.16,z0),
         (x1,roof_y(x1)-.16,z0),(x1,roof_y(x1)-.16,z1))
    if i%2==0:
        beam(seams,(x0,roof_y(x0)+.028,z0),(x0,roof_y(x0)+.028,z1),.23,.12)
for x in (bays[0],bays[-1]):
    face(shell,(x,EAVE-.16,NORTH-1.05),(x,EAVE-.16,SOUTH+.9),
         (x,roof_y(x)+.031,SOUTH+.9),(x,roof_y(x)+.031,NORTH-1.05))
for i in range(11):
    z = NORTH+2.5+(SOUTH-NORTH-5.)*i/10
    ends = [-HALF_WIDTH+.24+(2*HALF_WIDTH-.48)*j/12 for j in range(13)]
    beam(truss,(ends[0],19.17,z),(ends[-1],19.17,z),.32,.30)
    for j,(x0,x1) in enumerate(zip(ends,ends[1:])):
        lower_a,lower_b = (x0,19.17,z),(x1,19.17,z)
        upper_a,upper_b = (x0,roof_y(x0)-.39,z),(x1,roof_y(x1)-.39,z)
        beam(truss,upper_a,upper_b,.29)
        beam(truss,lower_a if j%2==0 else upper_a,upper_b if j%2==0 else lower_b,.19)
        beam(truss,lower_a,upper_a,.15)
for i in range(1,9):
    x = -HALF_WIDTH+i*HALF_WIDTH*2/9
    beam(purlins,(x,roof_y(x)-.66,NORTH+.24),(x,roof_y(x)-.66,SOUTH-.24),.16,.23)
for x in (-HALF_WIDTH*.59,0,HALF_WIDTH*.59):
    for dx in (-.25,.25):
        beam(purlins,(x+dx,19.65,NORTH+.26),(x+dx,19.65,SOUTH-.26),.11,.17)
    for i in range(25):
        z = NORTH+2+(SOUTH-NORTH-4)*i/24
        beam(purlins,(x-.28,19.68,z),(x+.28,19.68,z),.08)


def letters():
    font = bpy.data.curves.new("Hall identification", 'FONT')
    font.body = "ASIAWORLD-ARENA    /    HALL 1"
    font.align_x = 'CENTER'
    font.size = 1.36
    font.extrude = .021
    material = bpy.data.materials.new("Champagne hall identification")
    material.diffuse_color = (.68,.57,.38,1.)
    material.node_tree.nodes.get("Principled BSDF").inputs["Base Color"].default_value = material.diffuse_color
    font.materials.append(material)
    object = bpy.data.objects.new("shell_bowl_mass_facade_lettering", font)
    object.location = (0, -(SOUTH+.105), 7.04)
    object.rotation_euler.x = math.pi / 2
    bpy.context.scene.collection.objects.link(object)
    bpy.context.view_layer.objects.active = object
    object.select_set(True)
    bpy.ops.object.convert(target='MESH')
    object.select_set(False)


letters()
for name,(material,(vertices,faces)) in parts.items():
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata([(x,-z,y) for x,y,z in vertices],[],faces)
    mesh.validate()
    data = bmesh.new()
    data.from_mesh(mesh)
    bmesh.ops.remove_doubles(data,verts=list(data.verts),dist=.00001)
    bmesh.ops.recalc_face_normals(data,faces=list(data.faces))
    data.to_mesh(mesh)
    data.free()
    mesh.update()
    object = bpy.data.objects.new(name,mesh)
    bpy.context.scene.collection.objects.link(object)
    mesh.materials.append(material)

output = HERE / "shell.glb"
bpy.ops.export_scene.gltf(filepath=str(output),export_format='GLB',export_yup=True,
                          export_apply=True,export_extras=True,export_cameras=False,export_lights=False)
with output.open('rb') as binary:
    binary.seek(12)
    length,_ = struct.unpack('<II',binary.read(8))
    doc = json.loads(binary.read(length))
# Lettering is a translated, rotated node. It sits within the bounds of the
# baked lobby and hall envelope, which defines the exported AABB.
primitives = [primitive for node in doc["nodes"]
              if "mesh" in node and node["name"] != "shell_bowl_mass_facade_lettering"
              for primitive in doc["meshes"][node["mesh"]]["primitives"]]
accessors = [doc["accessors"][primitive["attributes"]["POSITION"]] for primitive in primitives]
names = [node["name"] for node in doc["nodes"]]
assert output.stat().st_size <= 3_000_000
manifest = {
    "venueId": VENUE,
    "generator": "blender-bpy",
    "version": 1,
    "upAxis": "+Y",
    "units": "metres",
    "coordinateBasis": "source-model-xyz",
    "precision": "illustrative-architecture",
    "sourceSeatsCount": PROBE["layouts"]["end"]["sourceSeatsCount"],
    "seatBounds": SEATS,
    "layouts": {key: {k: value[k] for k in ("sourceSeatsCount", "seatBounds")}
                for key,value in PROBE["layouts"].items()},
    "bounds": {key: [round(fn(a[key][axis] for a in accessors),4) for axis in range(3)]
               for key,fn in [('min',min),('max',max)]},
    "assetBytes": output.stat().st_size,
    "meshPrimitives": len(primitives)+1,
    "roofNodeNames": [name for name in names if name.startswith("shell_roof_")],
    "ribbonNodeNames": [name for name in names if name.startswith("shell_ribbon_led")],
    "lightingPreset": "arena-dark",
    "references": [
        "https://www.asiaworld-expo.com/en-us/planning/venues/asiaworld-arena/",
        "https://rlp.asia/en/project/asiaworld-expo/",
        "https://www.hkengineer.org.hk/issue/vol34-jan2006/cover_story/",
    ],
    "notes": "Original Hall 1 shell fitted to the retained seat envelope. The operator's published 19 m column-free ceiling informs the roof clearance. The aluminium roof profile, glazed concourse, cladding, acoustic panels and wayfinding are schematic. Retained seats, aisles and stage remain runtime geometry. No third-party mesh or texture is embedded.",
}
(HERE / "manifest.json").write_text(json.dumps(manifest,indent=2)+"\n")
