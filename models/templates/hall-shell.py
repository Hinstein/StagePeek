"""Build an original theatre or flat-floor hall from its JSON and catalog envelope.

Run with Blender:
  blender --background --python models/templates/hall-shell.py -- VENUE_ID
"""
import json
import math
from pathlib import Path
import re
import struct
import subprocess
import sys

import bpy
from mathutils import Vector


TEMPLATES = Path(__file__).resolve().parent
VENUE = sys.argv[sys.argv.index("--") + 1]
if not re.fullmatch(r"[a-z0-9-]+", VENUE):
    raise ValueError("Expected a StagePeek venue ID")
HERE = TEMPLATES.parent / "venues" / VENUE
CFG = json.loads((HERE / "shell-config.json").read_text())
INPUT = json.loads(subprocess.check_output(["node", TEMPLATES / "venue-input.mjs", VENUE]))
PARTS = {}

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.context.scene.unit_settings.system = "METRIC"


def material(name, label, color, *, roughness=.72, metal=0, glow=0, alpha=1):
    mat = bpy.data.materials.new(label)
    mat.diffuse_color = (*color, alpha)
    shader = mat.node_tree.nodes["Principled BSDF"]
    shader.inputs["Base Color"].default_value = (*color, 1)
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Metallic"].default_value = metal
    shader.inputs["Emission Color"].default_value = (*color, 1)
    shader.inputs["Emission Strength"].default_value = glow
    if alpha < 1:
        shader.inputs["Alpha"].default_value = alpha
        mat.surface_render_method = "BLENDED"
    mesh = ([], [])
    PARTS[name] = mesh, mat
    return mesh


def face(mesh, *points):
    vertices, faces = mesh
    offset = len(vertices)
    vertices.extend(tuple(point) for point in points)
    faces.append(tuple(range(offset, offset+len(points))))


def beam(mesh, start, end, width, thickness=None):
    a, b = Vector(start), Vector(end)
    direction = (b-a).normalized()
    reference = Vector((0,1,0)) if abs(direction.y)<.97 else Vector((1,0,0))
    u = direction.cross(reference).normalized()*width/2
    v = direction.cross(u).normalized()*(thickness or width)/2
    cap = ((-1,-1),(1,-1),(1,1),(-1,1))
    near = [a+u*x+v*y for x,y in cap]
    far = [b+u*x+v*y for x,y in cap]
    face(mesh,*reversed(near))
    face(mesh,*far)
    for i in range(4):
        j=(i+1)%4
        face(mesh,near[i],near[j],far[j],far[i])


def wall(mesh, a, b, low, high, inside=False):
    points=((a[0],low,a[1]),(a[0],high,a[1]),(b[0],high,b[1]),(b[0],low,b[1]))
    face(mesh,*(points if inside else reversed(points)))


def color(key):
    raw=CFG[key].lstrip("#")
    if not re.fullmatch(r"[0-9a-fA-F]{6}",raw):
        raise ValueError("Expected a six-digit RGB value for "+key)
    srgb=[int(raw[i:i+2],16)/255 for i in (0,2,4)]
    return tuple(c/12.92 if c<=.04045 else ((c+.055)/1.055)**2.4 for c in srgb)


def between(a,b,t):
    return tuple(x+(y-x)*t for x,y in zip(a,b))


def polygon(expand):
    inset=CFG.get("cornerCut",0)
    x0,x1=west-expand,east+expand
    z0,z1=north-expand,south+expand
    if not inset:
        return [(x0,z0),(x0,z1),(x1,z1),(x1,z0)]
    # Chamfers are outside the clearance envelope, even at the corners.
    cut=min(inset,margin-1)
    return [(x0,z0+cut),(x0,z1-cut),(x0+cut,z1),(x1-cut,z1),
            (x1,z1-cut),(x1,z0+cut),(x1-cut,z0),(x0+cut,z0)]


def spans(outline):
    return zip(outline,outline[1:]+outline[:1])


theatre=CFG["type"]=="theatre"
if CFG["type"] not in ("theatre","hall"):
    raise ValueError("Unknown venue template")
lower,upper=INPUT["bounds"]["min"],INPUT["bounds"]["max"]
margin=max(3,CFG["wallMargin"])
west,east=lower[0]-margin,upper[0]+margin
north,south=lower[2]-margin,upper[2]+margin
mid_x,mid_z=(west+east)/2,(north+south)/2
base_y=min(lower[1],0)-.14
roof_y=max(upper[1]+4.85,base_y+CFG["clearHeight"])
wall_top=roof_y+1.85
bands=CFG["bands"]
bays=CFG["bays"]
roof_rises=CFG.get("roofRises",[])
if not isinstance(roof_rises,list) or not all(
        isinstance(rise,(int,float)) and math.isfinite(rise) and rise>0 for rise in roof_rises):
    raise ValueError("roofRises must contain positive heights in metres")

plinth=material("shell_bowl_mass_plinth","Precast concrete plinth",color("plinth"))
skin=material("shell_bowl_mass_cladding","Exterior cladding",color("facade"),metal=.25)
framing=material("shell_bowl_mass_facade_panels","Facade framing",color("trim"),metal=.28)
lining=material("shell_bowl_mass_wall_lining","Acoustic wall lining" if theatre else "Hall wall lining",color("lining"))
features=material("shell_bowl_mass_interior_trim","Acoustic detailing" if theatre else "Hall wall framing",color("interiorTrim"),metal=.1)
glazing=material("shell_bowl_mass_suite_glass_lobby","Entrance glazing",color("glazing"),roughness=.27,metal=.15,alpha=.58)
portals=material("shell_bowl_mass_portal_frames","Recessed entrances",color("trim"))
ribbon=material("shell_ribbon_led_perimeter","Upper light strip",color("accent"),glow=.5)
sign=material("shell_ribbon_led_entry_static","Entrance wash",color("accent"),glow=.42)
floor=material("shell_field_floor_deck","Timber auditorium floor" if theatre else "Sealed event floor",color("floor"),roughness=.83)
plaza=material("shell_field_floor_apron","Concrete perimeter apron",color("plinth"))
roof=material("shell_roof_canopy","Roof standing seam",color("roof"),metal=.31)
fascia=material("shell_roof_canopy_fascia","Roof seam and edge",color("trim"),metal=.29)
soffit=material("shell_roof_canopy_soffit","Ceiling liner",color("lining"))
steel=material("shell_roof_truss","Roof steel",color("steel"),roughness=.65,metal=.31)
comfort=material("shell_roof_truss_acoustic","Acoustic ceiling reflectors" if theatre else "Service rails",color("interiorTrim"))

for i,((a,b),(c,d),(e,f),(a0,b0),(da,db),(ia,ib)) in enumerate(
        zip(*(spans(polygon(inset)) for inset in (0,.92,1.42,2.25,1.07,-.42)))):
    wall(lining,a,b,base_y,wall_top-.18,inside=True)
    wall(plinth,c,d,base_y-.22,base_y+.98)
    wall(skin,c,d,base_y+.98,wall_top)
    wall(fascia,e,f,wall_top-.37,wall_top+.27)
    face(floor,(mid_x,base_y,mid_z),(a[0],base_y,a[1]),(b[0],base_y,b[1]))
    face(plaza,(c[0],base_y-.20,c[1]),(d[0],base_y-.20,d[1]),
         (b0[0],base_y-.20,b0[1]),(a0[0],base_y-.20,a0[1]))
    if math.dist(a,b)>6:
        lobby_height=min(4.3,(roof_y-base_y)*.42)
        for j in range(bays):
            u,v=j/bays,(j+1)/bays
            lo,hi=(j+.16)/bays,(j+.84)/bays
            low,high=between(da,db,lo),between(da,db,hi)
            if i==CFG["entryEdge"]:
                wall(glazing,low,high,base_y+1.0,base_y+lobby_height)
                if j%2==0:
                    wall(portals,between(low,high,.22),between(low,high,.79),
                         base_y+.08,base_y+min(2.8,lobby_height-.25))
                beam(sign,(low[0],base_y+lobby_height+.08,low[1]),
                     (high[0],base_y+lobby_height+.08,high[1]),.11)
            side=between(da,db,u)
            beam(framing,(side[0],base_y+1.0,side[1]),(side[0],wall_top-.24,side[1]),.15)
            if theatre:
                for detail in (.18,.43,.68):
                    at=between(ia,ib,u+(v-u)*detail)
                    bottom=base_y+min(1.3,(roof_y-base_y)*.19)
                    beam(features,(at[0],bottom,at[1]),(at[0],roof_y-.57,at[1]),CFG.get("slatWidth",.11))
            elif j%2==0:
                at=between(ia,ib,lo)
                beam(features,(at[0],base_y,at[1]),(at[0],roof_y,at[1]),.21)
    for t in bands:
        h=base_y+(roof_y-base_y)*t
        beam(features,(ia[0],h,ia[1]),(ib[0],h,ib[1]),.16,.26)
    if theatre and CFG.get("sideBoxes",False) and math.dist(a,b)>=7:
        for t in bands:
            y=base_y+(roof_y-base_y)*t
            for j in range(bays//2):
                lo,hi=(j+.16)/(bays//2),(j+.79)/(bays//2)
                p,q=between(ia,ib,lo),between(ia,ib,hi)
                wall(features,p,q,y+.12,y+.63,inside=True)
                beam(sign,(p[0],y+.67,p[1]),(q[0],y+.67,q[1]),.075)
    if CFG.get("led",False):
        wall(ribbon,ia,ib,roof_y-1.1,roof_y-.73,inside=True)
    face(roof,(mid_x,wall_top+.25,mid_z),(e[0],wall_top+.25,e[1]),(f[0],wall_top+.25,f[1]))
    face(soffit,(mid_x,wall_top+.16,mid_z),(f[0],wall_top+.16,f[1]),(e[0],wall_top+.16,e[1]))

if theatre and CFG.get("proscenium",False):
    # The fixed stage-end frame sits outside every retained stage bound.
    stage_end=north+.30 if CFG.get("stageEnd","north")=="north" else south-.30
    center_low=base_y+(roof_y-base_y)*.58
    span=(east-west)*.30
    beam(features,(mid_x-span,center_low,stage_end),(mid_x+span,center_low,stage_end),.38,.7)
    for x in (mid_x-span,mid_x+span):
        beam(features,(x,base_y,stage_end),(x,center_low,stage_end),.34,.7)

if roof_rises:
    # Each tier narrows to a terrace with room for the eave of the next tier.
    # The last one finishes in a narrow hip along the longer building axis.
    outline=polygon(2.82)
    lift=wall_top+.25
    long_x=east-west>=south-north
    for index,rise in enumerate(roof_rises):
        hip=material(f"shell_roof_canopy_hip_{index+1}","Hipped roof panels",color("roof"),metal=.23)
        last=index+1==len(roof_rises)
        sx,sz=((.54,.038) if long_x else (.038,.54)) if last else (.75,.72)
        upper=[(mid_x+(x-mid_x)*sx,mid_z+(z-mid_z)*sz) for x,z in outline]
        bend=[between(a,b,.39) for a,b in zip(outline,upper)]
        bend_y=lift+rise*.26
        top=lift+rise
        for (a,b),(c,d),(e,f) in zip(spans(outline),spans(bend),spans(upper)):
            face(hip,(a[0],lift,a[1]),(b[0],lift,b[1]),(d[0],bend_y,d[1]),(c[0],bend_y,c[1]))
            face(hip,(c[0],bend_y,c[1]),(d[0],bend_y,d[1]),(f[0],top,f[1]),(e[0],top,e[1]))
            face(hip,(mid_x,top,mid_z),(e[0],top,e[1]),(f[0],top,f[1]))
            wall(fascia,a,b,lift-.19,lift+.013)
        if not last:
            outline=[between(a,b,.86) for a,b in zip(outline,upper)]
            for a,b in spans(upper):
                wall(fascia,a,b,top,top+.39)
            lift=top+.40

for i in range(bays+1):
    z=north+(south-north)*i/bays
    if not roof_rises:
        beam(fascia,(west-.9,wall_top+.27,z),(east+.9,wall_top+.27,z),.091)
    for j in range(8):
        a=west+(east-west)*j/8
        b=west+(east-west)*(j+1)/8
        beam(steel,(a,roof_y,z),(b,roof_y,z),.20)
        beam(steel,(a,wall_top-.38,z),(b,wall_top-.38,z),.17)
        beam(steel,(a,roof_y,z),(b,wall_top-.38,z),.105)
    if theatre:
        depth=min(2.7,(south-north)/bays*.60)
        z0=min(south,z+depth)
        drop=roof_y-.45+math.cos(i*math.pi/bays)*.23
        width=(east-west)*(.34 if i%2==0 else .40)
        if i<bays:
            face(comfort,(mid_x-width,drop,z),(mid_x+width,drop,z),
                 (mid_x+width*.92,drop+.42,z0),(mid_x-width*.92,drop+.42,z0))
if not theatre:
    for x in (west+(east-west)*.18,east-(east-west)*.18):
        beam(comfort,(x,roof_y-.22,north),(x,roof_y-.22,south),.10)

if CFG.get("standingGalleries"):
    galleries=material("shell_illustrative_gallery_slabs","Precast gallery decks",color("plinth"))
    rails=material("shell_illustrative_gallery_guardrails","Gallery guardrails",color("steel"),metal=.48)
    for platform in INPUT["raisedStanding"]:
        edges=list(spans(platform))
        walls=[(0,west),(0,east),(2,north),(2,south)]
        (a,b),(axis,wall_at)=min(((edge,boundary) for edge in edges for boundary in walls),
            key=lambda item:sum(abs(p[item[1][0]]-item[1][1]) for p in item[0]))
        y=a[1]-.07
        inner_a,inner_b=max(edges,key=lambda edge:sum(abs(p[axis]-wall_at) for p in edge))
        c=list(inner_b)
        d=list(inner_a)
        c[axis]=d[axis]=wall_at
        deck=[(p[0],p[2]) for p in (inner_a,inner_b,c,d)]
        if sum(e[0]*f[1]-f[0]*e[1] for e,f in spans(deck))>0:
            deck.reverse()
        face(galleries,*[(x,y,z) for x,z in deck])
        face(galleries,*[(x,y-.40,z) for x,z in reversed(deck)])
        for e,f in spans(deck):
            wall(galleries,e,f,y-.40,y)
        rail_y=a[1]+1.05
        beam(rails,(inner_a[0],rail_y,inner_a[2]),(inner_b[0],rail_y,inner_b[2]),.055)
        divisions=max(1,math.ceil(math.dist(inner_a,inner_b)/1.3))
        for i in range(divisions+1):
            x,_,z=between(inner_a,inner_b,i/divisions)
            beam(rails,(x,y,z),(x,rail_y,z),.045)

if CFG.get("facadeDome"):
    # An attached cap leaves the rectangular auditorium and all aisles intact.
    radius=min(CFG["facadeDome"],(roof_y-base_y)*.44,(south-north)*.33)
    center=(east+.91,base_y+radius+.6,mid_z)
    dome=material("shell_bowl_mass_facade_dome","Aluminium panels",color("glazing"),roughness=.34,metal=.68)
    seams=material("shell_bowl_mass_dome_seams","Aluminium panel joints",color("trim"),metal=.42)
    rings=[]
    count=48
    for i in range(1,13):
        tilt=math.pi*i/24
        x=center[0]+radius*math.cos(tilt)
        ring_radius=radius*math.sin(tilt)
        rings.append([(x,center[1]+ring_radius*math.cos(math.tau*j/count),
                       center[2]+ring_radius*math.sin(math.tau*j/count)) for j in range(count)])
    apex=(center[0]+radius,center[1],center[2])
    for j in range(count):
        k=(j+1)%count
        face(dome,apex,rings[0][j],rings[0][k])
        for n,(inner,outer) in enumerate(zip(rings,rings[1:])):
            face(dome,inner[j],outer[j],outer[k],inner[k])
            if n%2==0:
                beam(seams,outer[j],outer[k],.045)
            if j%4==0:
                beam(seams,inner[j],outer[j],.04)

if INPUT["rows"]:
    rows=material("shell_illustrative_seating_rows","Illustrative rows",color("seat"),glow=.08)
    def seat_point(p,q,t):
        x,y,z=between(p,q,t)
        return x,y+.065,z
    for a,b,c,d in INPUT["rows"]:
        p,q,r,s=seat_point(a,d,.29),seat_point(b,c,.29),seat_point(b,c,.67),seat_point(a,d,.67)
        face(rows,between(p,q,.03),between(p,q,.97),between(s,r,.97),between(s,r,.03))

for name,((vertices,faces),mat) in PARTS.items():
    if not faces:
        continue
    mesh=bpy.data.meshes.new(name)
    mesh.from_pydata([(x,-z,y) for x,y,z in vertices],[],faces)
    mesh.validate()
    obj=bpy.data.objects.new(name,mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    if name == "shell_roof_truss":
        obj["stageRigCeiling"] = round(roof_y - (.70 if theatre else .28), 3)
    if name.startswith("shell_illustrative_"):
        obj["precision"]="illustrative"

asset=HERE/"shell.glb"
bpy.ops.export_scene.gltf(filepath=str(asset),export_format="GLB",export_yup=True,
                          export_apply=True,export_extras=True)
data=asset.read_bytes()
magic,version,size,json_length,chunk=struct.unpack_from("<4s4I",data)
if (magic,version,size,chunk)!=(b"glTF",2,len(data),0x4e4f534a) or len(data)>3_000_000:
    raise ValueError(f"{VENUE} GLB violates its header or 3 MB budget: {len(data)}")
doc=json.loads(data[20:20+json_length])
accessors=[doc["accessors"][primitive["attributes"]["POSITION"]]
           for mesh in doc["meshes"] for primitive in mesh["primitives"]]
names=[node["name"] for node in doc["nodes"] if "mesh" in node]
bounds={key:[round(fn(a[key][axis] for a in accessors),4) for axis in range(3)]
        for key,fn in (("min",min),("max",max))}
manifest={
    "venueId":VENUE,"generator":"blender-bpy","template":CFG["type"],"version":1,
    "units":"metres","upAxis":"+Y","bounds":bounds,"precision":"illustrative",
    "lightingPreset":"theatre-warm" if theatre else "arena-dark",
    "sourceLayouts":INPUT["layouts"],"assetBytes":len(data),"meshPrimitives":len(accessors),
    "roofNodeNames":sorted(name for name in names if name.startswith("shell_roof_")),
    "ribbonNodeNames":sorted(name for name in names if name.startswith("shell_ribbon_led")),
    "references":list(dict.fromkeys(CFG["references"]+[INPUT["venueSource"]])),
    "notes":CFG["notes"]+" Architectural surfaces are illustrative. No source ticket, seat or event data is embedded."
}
(HERE/"manifest.json").write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
