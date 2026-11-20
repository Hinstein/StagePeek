"""Model Newark's brick arena and two lit entrance drums in the source seat frame."""
import json
import math
from pathlib import Path
import struct
import subprocess

import bpy
from mathutils import Vector

HERE = Path(__file__).resolve().parent
VENUE = "twcv-prudential-center-newark"
layout = json.loads(subprocess.check_output(
    ["node", HERE.parents[2] / "scripts/probe-venue-bounds.mjs", VENUE]
))["layouts"]["pru"]
galleries = json.loads(subprocess.check_output(["node", HERE / "vomitories.mjs"]))
seat_bounds = layout["seatBounds"]
CX, _, CZ = seat_bounds["center"]
WEST, EAST = seat_bounds["min"][0] - 5.5, seat_bounds["max"][0] + 5.5
NORTH, SOUTH = seat_bounds["min"][2] - 6.2, seat_bounds["max"][2] + 6.2
EAVE = 40.9
parts = {}

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.context.scene.unit_settings.system = "METRIC"


def batch(name, label, color, *, roughness=.71, metal=0, glow=0, opacity=1):
    material = bpy.data.materials.new(label)
    material.diffuse_color = (*color, opacity)
    shader = material.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, 1)
    shader.inputs["Metallic"].default_value = metal
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Emission Color"].default_value = (*color, 1)
    shader.inputs["Emission Strength"].default_value = glow
    shader.inputs["Alpha"].default_value = opacity
    vertices, facets = [], []
    parts[name] = material, vertices, facets
    return vertices, facets


def face(mesh, *points):
    vertices, facets = mesh
    facets.append(tuple(range(len(vertices), len(vertices)+len(points))))
    vertices.extend(tuple(point) for point in points)


def beam(mesh, start, end, width, depth=None):
    a, b = Vector(start), Vector(end)
    direction = (b - a).normalized()
    side = direction.cross(Vector((0, 1, 0)))
    if side.length < .01:
        side = direction.cross(Vector((1, 0, 0)))
    side = side.normalized() * width / 2
    cross = direction.cross(side).normalized() * (depth or width) / 2
    first = [a+side*x+cross*y for x,y in ((-1,-1),(1,-1),(1,1),(-1,1))]
    last = [p+b-a for p in first]
    face(mesh, *reversed(first))
    face(mesh, *last)
    for i in range(4):
        j = (i + 1) % 4
        face(mesh, first[i], first[j], last[j], last[i])


def outline(y, offset=0, bevel=8.0):
    w, e = WEST - offset, EAST + offset
    n, s = NORTH - offset, SOUTH + offset
    return [(w+bevel,y,n), (e-bevel,y,n), (e,y,n+bevel), (e,y,s-bevel),
            (e-bevel,y,s), (w+bevel,y,s), (w,y,s-bevel), (w,y,n+bevel)]


def wall(mesh, low, high, *, inward=False):
    for i in range(len(low)):
        j = (i + 1) % len(low)
        quad = [low[i],high[i],high[j],low[j]]
        face(mesh, *(reversed(quad) if inward else quad))


def disk(x, z, radius, y, count=64):
    return [(x+radius*math.cos(math.tau*i/count), y, z+radius*math.sin(math.tau*i/count))
            for i in range(count)]


def strip(mesh, a, b, y0, y1, offset, *, room=True):
    def point(p, y):
        dx, dz = p[0]-CX,p[2]-CZ
        distance = math.hypot(dx,dz)
        return p[0]-dx*offset/distance, y, p[2]-dz*offset/distance
    quad = [point(a,y0),point(b,y0),point(b,y1),point(a,y1)]
    cavity = Vector((CX-a[0],0,CZ-a[2]))
    vector = (Vector(quad[1])-Vector(quad[0])).cross(Vector(quad[2])-Vector(quad[0]))
    face(mesh, *(quad if (vector.dot(cavity)>0)==room else reversed(quad)))


base = batch("shell_bowl_mass_plinth", "Concrete service plinth", (.18,.168,.162))
brick = batch("shell_bowl_mass_cladding", "Newark red-brown brick", (.28,.102,.073), roughness=.87)
joints = batch("shell_bowl_mass_brick_joints", "Recessed warm mortar courses", (.17,.085,.071))
pilasters = batch("shell_bowl_mass_brick_pilasters", "Raised copper brick pilasters", (.22,.071,.049))
pale = batch("shell_bowl_mass_facade_panels", "Pale precast slab edges", (.31,.274,.226))
acoustic = batch("shell_bowl_mass_acoustic_liner", "Bowl acoustic enclosure", (.075,.079,.090), roughness=.95)
windows = batch("shell_bowl_mass_suite_glass_clerestory", "Slate grey curtain wall", (.085,.132,.162),
                metal=.18,roughness=.27,opacity=.64)
spandrel = batch("shell_bowl_mass_spandrel", "Recessed charcoal spandrel", (.039,.048,.054),metal=.45)
wall(base,outline(-.30,.61),outline(.78,.61))
wall(brick,outline(.70,.08),outline(31.7,.08))
wall(acoustic,outline(-.12,-.34),outline(EAVE,-.34),inward=True)
wall(spandrel,outline(31.72,.10),outline(EAVE,.10))
for y in (9.6,20.4,31.55,39.25):
    wall(pale,outline(y,.45),outline(y+.48,.45))
for i in range(49):
    y = 1.2+i*.60
    wall(joints,outline(y,.10),outline(y+.036,.10))
for side in (0,2,4,6):
    a,b = outline(0,.47)[side],outline(0,.47)[(side+1)%8]
    count = 10 if side%4==0 else 11
    for i in range(count+1):
        x = a[0]+(b[0]-a[0])*i/count
        z = a[2]+(b[2]-a[2])*i/count
        beam(pilasters,(x,.86,z),(x,31.52,z),.39,.70)
    a,b = outline(0,.23)[side],outline(0,.23)[(side+1)%8]
    for i in range(count):
        low,high = (i+.085)/count,(i+.915)/count
        first = tuple(a[k]+(b[k]-a[k])*low for k in range(3))
        last = tuple(a[k]+(b[k]-a[k])*high for k in range(3))
        strip(windows,first,last,32.35,37.4,-.04,room=False)
        for y in (33.1,35.45,37.4):
            beam(spandrel,(first[0],y,first[2]),(last[0],y,last[2]),.15)

drum_glass = batch("shell_bowl_mass_suite_glass_drums", "Red entry drum curtain wall",
                   (.25,.074,.083), roughness=.235,metal=.19,opacity=.50)
drum_frame = batch("shell_bowl_mass_drums_mullions", "Brushed curtain wall mullions",
                   (.27,.22,.22),metal=.48,roughness=.32)
drum_red = batch("shell_bowl_mass_drums_red_lights", "Interior red entrance lighting",
                 (.70,.035,.054),roughness=.53,glow=1.08)
drum_slab = batch("shell_bowl_mass_drums_caps", "Zinc caps and balcony edges",
                  (.25,.218,.212),metal=.43)
foyer_glass = batch("shell_bowl_mass_suite_glass_foyer", "Glazed entrance concourse",
                    (.096,.164,.196),metal=.18,roughness=.28,opacity=.63)
portal = batch("shell_vomitories_entry_and_bowl", "Recessed entry portal metal",
               (.26,.19,.173),roughness=.47,metal=.46)
for z in (NORTH+20.0,SOUTH-21.0):
    x, radius = EAST+7.55, 10.2
    wall(base,disk(x,z,radius+.36,-.30),disk(x,z,radius+.36,.52))
    wall(drum_glass,disk(x,z,radius,.48),disk(x,z,radius,28.6))
    wall(drum_slab,disk(x,z,radius+.24,28.48),disk(x,z,radius+.24,29.30))
    face(drum_slab,*reversed(disk(x,z,radius+.24,29.30)))
    for y in (8.1,16.2,23.75,27.45):
        wall(drum_frame,disk(x,z,radius+.045,y),disk(x,z,radius+.045,y+.20))
        wall(drum_red,disk(x,z,radius-.96,y+.29),disk(x,z,radius-.96,y+.59))
    for i in range(0,64,2):
        a,b = disk(x,z,radius+.055,.5)[i],disk(x,z,radius+.055,28.5)[i]
        beam(drum_frame,a,b,.12)
        if i%4==0:
            a,b = disk(x,z,radius-1.08,1.32)[i],disk(x,z,radius-1.08,27.42)[i]
            beam(drum_red,a,b,.38,.22)
    for i in range(-2,3):
        theta = i*.17
        dx,dz = math.cos(theta),math.sin(theta)
        a = (x+(radius+.07)*dx,.52,z+(radius+.07)*dz)
        b = (a[0],4.0,a[2])
        beam(portal,a,b,.19)
        beam(portal,(b[0]+.81*dz,b[1],b[2]-.81*dx),(b[0]-.81*dz,b[1],b[2]+.81*dx),.20)

wall_x = EAST+3.9
span = (NORTH+23,SOUTH-24)
face(foyer_glass,(wall_x,.60,span[0]),(wall_x,8.55,span[0]),(wall_x,8.55,span[1]),(wall_x,.60,span[1]))
for y in (.55,4.55,8.6):
    beam(drum_slab,(wall_x,y,span[0]),(wall_x,y,span[1]),.38)
for i in range(15):
    z = span[0]+(span[1]-span[0])*i/14
    beam(drum_frame,(wall_x+.10,.56,z),(wall_x+.10,8.62,z),.22)

rails = batch("shell_balustrades_gallery_cap", "Stainless concourse rail caps", (.27,.30,.34),metal=.52)
guards = batch("shell_balustrades_gallery_glass", "Tempered concourse guards",
               (.13,.225,.28),metal=.15,roughness=.24,opacity=.36)
ribbon = batch("shell_ribbon_led_bowl", "Red arena ribbon", (.46,.047,.054),glow=.67)
for a,b,floor in galleries["galleries"]:
    strip(guards,a,b,floor+.042,floor+.81,.11)
    strip(rails,a,b,floor+.80,floor+.87,.13)
    if floor < 10:
        strip(ribbon,a,b,floor+1.36,floor+1.70,.093)

# The upper perimeter carries a second ribbon while the lower one follows the fascia.
wall(ribbon,outline(30.32,-.57),outline(31.12,-.57),inward=True)
alcove = batch("shell_bowl_mass_vomitory_lining", "Precast concourse alcove", (.16,.148,.142))
recess = batch("shell_vomitories_dark_recesses", "Dark recessed doorways", (.022,.024,.030))
for x,y,z in galleries["portals"]:
    rear = Vector((x-CX,0,z-CZ)).normalized()
    tangent = Vector((-rear.z,0,rear.x))
    datum = Vector((x,y-.05,z))

    def point(depth, width, height):
        return datum+rear*depth+tangent*width+Vector((0,height,0))

    face(alcove,point(.55,-1.61,0),point(.55,1.61,0),point(3.55,1.61,0),point(3.55,-1.61,0))
    face(alcove,point(3.25,-1.61,2.55),point(3.25,1.61,2.55),
         point(3.55,1.61,2.55),point(3.55,-1.61,2.55))
    face(recess,point(3.50,-1.21,0),point(3.50,-1.21,2.42),point(3.50,1.21,2.42),point(3.50,1.21,0))
    for side in (-1,1):
        a,b = point(2.8,side*1.53,0),point(3.55,side*1.53,0)
        face(alcove,a,a+Vector((0,2.55,0)),b+Vector((0,2.55,0)),b)
        beam(portal,point(3.12,side*1.28,0),point(3.12,side*1.28,2.42),.18)
    beam(portal,point(3.12,-1.30,2.42),point(3.12,1.30,2.42),.19)

canopy = batch("shell_roof_canopy_zinc", "Pale standing-seam metal roof", (.22,.247,.268),metal=.39)
seams = batch("shell_roof_canopy_seams", "Raised zinc seams", (.32,.35,.37),metal=.47)
truss = batch("shell_roof_truss_steel", "Long-span arena steel", (.21,.204,.22),metal=.49)
wall(canopy,outline(EAVE-.19,.72),outline(EAVE+.24,.72))
wall(canopy,outline(EAVE+.24,.72),outline(EAVE+2.52,-5.8))
face(canopy,*reversed(outline(EAVE+2.52,-5.8)))
for i in range(23):
    z = NORTH+11+(SOUTH-NORTH-22)*i/22
    beam(seams,(WEST+6.0,EAVE+2.59,z),(EAST-6.0,EAVE+2.59,z),.075)
for i in range(14):
    z = NORTH+12+(SOUTH-NORTH-24)*i/13
    start,end = WEST+.7,EAST-.7
    span = end-start
    beam(truss,(start,33.92,z),(end,33.92,z),.64)
    beam(truss,(start,39.68,z),(end,39.68,z),.50)
    for bay in range(12):
        a,b = start+span*bay/12,start+span*(bay+1)/12
        beam(truss,(a,33.92,z),(b,39.68,z),.24)
        beam(truss,(b,33.92,z),(b,39.68,z),.21)
for x in (-40,-20,0,20,40):
    beam(truss,(CX+x,36.8,NORTH+7),(CX+x,36.8,SOUTH-7),.45)

court = batch("shell_field_floor_event_deck", "Charcoal concrete event deck", (.074,.073,.079))
face(court,*reversed(outline(-.085,-.20)))

for name,(material,vertices,facets) in parts.items():
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata([(x,-z,y) for x,y,z in vertices],[],facets)
    mesh.validate()
    mesh.update()
    object = bpy.data.objects.new(name,mesh)
    object.data.materials.append(material)
    bpy.context.scene.collection.objects.link(object)

output = HERE / "shell.glb"
bpy.ops.export_scene.gltf(filepath=str(output),export_format="GLB",export_yup=True,
                         export_apply=True,export_extras=True,export_cameras=False,export_lights=False)
with output.open("rb") as binary:
    binary.seek(12)
    size,_ = struct.unpack("<II",binary.read(8))
    document = json.loads(binary.read(size))
accessors = [document["accessors"][primitive["attributes"]["POSITION"]]
             for mesh in document["meshes"] for primitive in mesh["primitives"]]
names = [node["name"] for node in document["nodes"]]
assert output.stat().st_size <= 3_000_000
manifest = {
    "venueId": VENUE, "generator": "blender-bpy", "version": 1, "upAxis": "+Y",
    "units": "metres", "coordinateBasis": "source-model-xyz", "precision": "illustrative-architecture",
    "seatBounds": seat_bounds, "sourceSeatsCount": layout["sourceSeatsCount"],
    "bounds": {key: [round(fn(a[key][axis] for a in accessors),4) for axis in range(3)]
               for key,fn in [("min",min),("max",max)]},
    "meshPrimitives": len(accessors), "assetBytes": output.stat().st_size,
    "roofNodeNames": [name for name in names if name.startswith("shell_roof_")],
    "ribbonNodeNames": [name for name in names if name.startswith("shell_ribbon_led")],
    "lightingPreset": "arena-dark",
    "references": ["https://www.focuslighting.com/new-gallery-57",
                   "https://projects.vitroglazings.com/prudential-center?lang=en"],
    "notes": "Schematic brick arena, two red-lit glazed entrance drums and joined foyer. Bowl detailing is fitted to the retained rows and does not add seat geometry."
}
(HERE / "manifest.json").write_text(json.dumps(manifest,indent=2)+"\n")
