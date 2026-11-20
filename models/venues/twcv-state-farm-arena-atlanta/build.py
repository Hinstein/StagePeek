"""Build an original State Farm Arena shell from its retained seating frame."""

from hashlib import sha256
import json
from math import hypot, sqrt
from pathlib import Path
import struct
import subprocess

import bmesh
import bpy
from mathutils import Vector

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
VENUE = "twcv-state-farm-arena-atlanta"
LAYOUT = "sfa"
REFERENCES = [
    "https://www.hok.com/projects/view/state-farm-arena/",
    "https://www.thorntontomasetti.com/project/state-farm-arena-renovation",
    "https://www.daktronics.com/news/atlanta-hawks-welcoming-fans-to-state-farm-arena-with-new-exterior-daktronics-displays",
    "https://www.statefarmarena.com/policies",
    "https://www.statefarmarena.com/arena-info/sponsorship",
]


class Mesh:
    def __init__(self, name, color, roughness=.75, metallic=0., emission=0., alpha=1.):
        self.name = name
        self.color = tuple(v / 3294.6 if v <= 10 else ((v / 255 + .055) / 1.055) ** 2.4
                           for v in bytes.fromhex(color))
        self.roughness = roughness
        self.metallic = metallic
        self.emission = emission
        self.alpha = alpha
        self.vertices = []
        self.indices = {}
        self.faces = []

    def face(self, *points):
        indices = []
        for x, y, z in points:
            point = (round(x, 6), round(-z, 6), round(y, 6))
            if point not in self.indices:
                self.indices[point] = len(self.vertices)
                self.vertices.append(point)
            indices.append(self.indices[point])
        indices = tuple(dict.fromkeys(indices))
        if len(indices) > 2:
            self.faces.append(indices)

    def ring_strip(self, inner, outer):
        for i in range(len(inner)):
            j = (i + 1) % len(inner)
            self.face(inner[i], outer[i], outer[j], inner[j])

    def solid(self, top, bottom):
        self.face(*top)
        self.face(*bottom[::-1])
        self.ring_strip(top, bottom)

    def beam(self, a, b, width, depth=None):
        a, b = Vector(a), Vector(b)
        delta = b - a
        if delta.length < .01:
            return
        axis = delta.normalized()
        side = axis.cross(Vector((0, 1, 0) if abs(axis.y) < .92 else (1, 0, 0)))
        side = side.normalized() * width / 2
        up = axis.cross(side).normalized() * (depth or width) / 2
        offsets = [-side-up, side-up, side+up, -side+up]
        self.solid([b+offset for offset in offsets], [a+offset for offset in offsets])

    def create(self):
        geometry = bpy.data.meshes.new(self.name)
        geometry.from_pydata(self.vertices, [], self.faces)
        geometry.validate()
        halfedge = bmesh.new()
        halfedge.from_mesh(geometry)
        bmesh.ops.recalc_face_normals(halfedge, faces=list(halfedge.faces))
        halfedge.to_mesh(geometry)
        halfedge.free()
        geometry.update()
        obj = bpy.data.objects.new(self.name, geometry)
        bpy.context.collection.objects.link(obj)
        material = bpy.data.materials.new(self.name)
        if material.node_tree is None:
            material.use_nodes = True
        material.use_backface_culling = False
        shader = material.node_tree.nodes.get("Principled BSDF")
        shader.inputs["Base Color"].default_value = (*self.color, 1.)
        shader.inputs["Roughness"].default_value = self.roughness
        shader.inputs["Metallic"].default_value = self.metallic
        shader.inputs["Emission Color"].default_value = (*self.color, 1.)
        shader.inputs["Emission Strength"].default_value = self.emission
        shader.inputs["Alpha"].default_value = self.alpha
        geometry.materials.append(material)
        return obj


def at_height(point, y):
    return (point[0], y, point[2])


def lerp(a, b, t):
    return tuple(x + (y-x)*t for x, y in zip(a, b))


def offset(point, distance, y):
    x, _, z = point
    scale = 1. + distance / hypot(x, z)
    return x*scale, y, z*scale


def read_profile():
    return json.loads(subprocess.check_output(["node", "--input-type=module", "--eval", """
import {loadVenues} from './server/concert-views/venues.mjs';
import {sourceBowlDisplay} from './public/concert-views/source-bowl-display.mjs';
import {stageBoxes} from './public/concert-views/scene-geometry.mjs';
const [id,layout]=process.argv.slice(1);
const venue=loadVenues(undefined,{localDrafts:true,includeResearch:true}).get(id,layout);
const display=sourceBowlDisplay(venue);
const banks=display.banks.map(bank=>({
  front:bank.rows[0].front,level:bank.level,
  rear:bank.rows.at(-1).back,
  y:bank.rows[0].y,
  rearY:bank.rows.at(-1).y
}));
console.log(JSON.stringify({banks,sourceSeatsCount:display.renderRecords.length,
  sectionCount:venue.sections.length,stage:stageBoxes(layout,venue)}));
""", VENUE, LAYOUT], cwd=ROOT))


def ring(y, expand=0):
    footprint=[(-49,74),(37,74),(55,59),(57,32),(57,-50),(47,-68),
               (-45,-73),(-65,-55),(-70,-23),(-70,42),(-65,60)]
    return [offset((x,y,z),expand,y) for x,z in footprint]


def wall(mesh, a, b, bottom, top):
    mesh.face(at_height(a,bottom),at_height(b,bottom),at_height(b,top),at_height(a,top))


def exterior():
    base = Mesh("shell_bowl_mass_plinth", "81838a", .94)
    inside = [(x,-.17,z) for x,z in ((-56,61),(47,61),(47,-61),(-56,-61))]
    below = ring(-.21,2.4)
    base.solid(below,[at_height(p,-.35) for p in below])
    main = ring(0)
    for i,a in enumerate(main):
        b=main[(i+1)%len(main)]
        p,q=offset(a,2.4,-.03),offset(b,2.4,-.03)
        base.face(p,q,b,a)
    base.face(*inside)
    brick = Mesh("shell_bowl_mass_cladding_brick", "84514b", .93)
    panel = Mesh("shell_bowl_mass_facade_panels", "949ca7", .75, .13)
    seams = Mesh("shell_bowl_mass_facade_panel_joints", "747e8d", .83)
    glass = Mesh("shell_bowl_mass_entrance_glazing", "698ea4", .32, .28, .23)
    metal = Mesh("shell_bowl_mass_entrance_mullions", "666c75", .63, .37)
    lights = Mesh("shell_bowl_mass_concourse_lights_static", "e7af71", .62, emission=.66)
    steel = Mesh("shell_bowl_mass_atlanta_structural_letters", "d2d0ca", .62, .24, .09)

    for i,a in enumerate(main):
        b = main[(i+1)%len(main)]
        public_front = i in (0,1,2,3,10)
        width=hypot(b[0]-a[0],b[2]-a[2])
        segment_count=max(3,round(width/(2.35 if public_front else 5.8)))
        yglass=17.3 if i==0 else 11 if public_front else 7.1
        wall(glass if public_front else brick,a,b,0,yglass)
        wall(panel,a,b,yglass,36)
        outward = (-(b[2]-a[2])/width, 0, (b[0]-a[0])/width)
        for step in range(segment_count+1):
            p=lerp(a,b,step/segment_count)
            p=tuple(value+shift*.065 for value,shift in zip(p,outward))
            if public_front:
                metal.beam(at_height(p,0),at_height(p,yglass),.09,.13)
                if step<segment_count and step%3==1:
                    q=lerp(a,b,(step+.7)/segment_count)
                    q=tuple(value+shift*.065 for value,shift in zip(q,outward))
                    lights.beam(at_height(p,3.4),at_height(q,3.4),.09)
            if step%2==0:
                seams.beam(at_height(p,yglass+.08),at_height(p,35.8),.09,.11)
        p=tuple(value+shift*.055 for value,shift in zip(a,outward))
        q=tuple(value+shift*.055 for value,shift in zip(b,outward))
        for y in ([3.5,7.3,11.8,16.9] if i==0 else [3.4,6.8] if public_front else [3.5]):
            metal.beam(at_height(p,y),at_height(q,y),.14)
        for y in (yglass,23.8,29.8,35.85):
            seams.beam(at_height(p,y),at_height(q,y),.12)
    # Street-side entrance character comes from the white structural lettering.
    letters={
        "A":[((0,0),(.5,1)),((.5,1),(1,0)),((.25,.43),(.75,.43))],
        "T":[((0,1),(1,1)),((.5,1),(.5,0))],
        "L":[((0,1),(0,0)),((0,0),(1,0))],
        "N":[((0,0),(0,1)),((0,1),(1,0)),((1,0),(1,1))],
    }
    # Set the lettering above the entrance canopy across the full frontage.
    for i,glyph in enumerate("ATLANTA"):
        x=-42+i*10.35
        for (a,b),(c,d) in letters[glyph]:
            steel.beam((x+8.6*a,6.86+10.3*b,76.25-1.5*b),
                       (x+8.6*c,6.86+10.3*d,76.25-1.5*d),.83,1.17)
    canopy = Mesh("shell_bowl_mass_entrance_canopy", "71767d", .66, .24)
    upper=[(-48,5.62,74), (43,5.62,74), (39,4.82,80.4), (-42,4.82,80.4)]
    canopy.solid(upper,[(x,y-.33,z) for x,y,z in upper])
    return [base,brick,panel,seams,glass,metal,lights,steel,canopy]


def marquee():
    mounting=Mesh("shell_ribbon_led_marquee_housing", "454752", .68, .31)
    faces=[Mesh(f"shell_ribbon_led_marquee_display_{i+1}", color, .59, emission=.48)
           for i,color in enumerate(("b71d32","d23d3f","a73456"))]
    bands=Mesh("shell_ribbon_led_marquee_graphics_static", "f7a881", .61, emission=.62)
    flank, short = 9.14, 5.49
    height=12.8
    triangle=[(50.4,0,80.2),(50.4+short,0,80.2),
              (50.4+short/2,0,80.2+sqrt(flank**2-(short/2)**2))]
    mounting.solid([at_height(p,3.68) for p in triangle],[at_height(p,-.07) for p in triangle])
    mounting.solid([at_height(p,17.04) for p in triangle],[at_height(p,16.68) for p in triangle])
    ledges=Mesh("shell_bowl_mass_marquee_plaza", "8a8c90", .89)
    landing=[(34,-.045,73),(48,-.045,67),(63,-.045,76),(63,-.045,89),(55,-.045,93),(46,-.045,88)]
    ledges.solid(landing,[at_height(p,-.22) for p in landing])
    for i,p in enumerate(triangle):
        q=triangle[(i+1)%3]
        dx,dz=q[0]-p[0],q[2]-p[2]
        length=hypot(dx,dz)
        direction=(dz/length,-dx/length)

        def screen(u,v,depth):
            p1=lerp(p,q,u)
            return (p1[0]+direction[0]*depth,3.77+height*v,p1[2]+direction[1]*depth)

        mounting.face(screen(0,-.007,.015),screen(1,-.007,.015),screen(1,1.017,.015),screen(0,1.017,.015))
        faces[i].face(screen(0,0,.065),screen(1,0,.065),screen(1,1,.065),screen(0,1,.065))
        # Original fixed graphics remain readable with reduced motion.
        for j in range(5):
            y=.17+j*.095
            bands.face(screen(.1,y,.101),screen(.9,y+.19,.101),screen(.9,y+.208,.101),screen(.1,y+.018,.101))
        for y in (.1,.85):
            bands.face(screen(.1,y,.105),screen(.79,y,.105),screen(.79,y+.025,.105),screen(.1,y+.025,.105))
    return [mounting,*faces,bands,ledges]


def interior(profile):
    concrete = Mesh("shell_bowl_mass_terrace_supports", "5c6473", .92)
    skirts = Mesh("shell_bowl_mass_concrete_front_skirts", "636a74", .91)
    portals = Mesh("shell_vomitories_recesses", "242b36", .9)
    frames = Mesh("shell_vomitories_warm_wood_frames", "995f3a", .79)
    lights = Mesh("shell_vomitories_portal_static", "f7cc8e", .61, emission=.73)
    rail = Mesh("shell_balustrades_brushed_steel", "909eaa", .54, .35)
    glass = Mesh("shell_balustrades_concourse_glass", "8fade0", .33, .1, .08, .34)
    ribbon = Mesh("shell_ribbon_led", "b97250", .55, emission=.48)
    housing = Mesh("shell_ribbon_led_housing", "3b4a5a", .76)

    for bank in profile["banks"]:
        level = bank["level"]
        if level not in ("L","T","U"):
            continue
        front,rear=bank["front"],bank["rear"]
        top=bank["rearY"]-.145
        bottom={"L":-.07,"T":8.3,"U":14.0}[level]
        for a,b in zip(rear,rear[1:]):
            p,q=offset(a,.51,top),offset(b,.51,top)
            r,s=offset(a,.99,top),offset(b,.99,top)
            concrete.face(p,q,s,r)
            concrete.face(p,at_height(p,bottom),at_height(q,bottom),q)
            concrete.face(r,s,at_height(s,bottom),at_height(r,bottom))
        for p in (rear[0],rear[-1]):
            a,b=offset(p,.51,top),offset(p,.99,top)
            concrete.face(a,b,at_height(b,bottom),at_height(a,bottom))
        if level=="L":
            for a,b in zip(front,front[1:]):
                p,q=offset(a,.085,bank["y"]-.125),offset(b,.085,bank["y"]-.125)
                if any(all(max(p[k],q[k])>box["center"][k]-box["size"][k]/2-.11
                           and min(p[k],q[k])<box["center"][k]+box["size"][k]/2+.11
                           for k in (0,2)) for box in profile["stage"]):
                    continue
                skirts.face(p,q,at_height(q,bottom),at_height(p,bottom))
            continue
        sampled=front[2:-2:3]
        for a,b in zip(sampled,sampled[1:]):
            p,q=offset(a,-.48,bank["y"]+.55),offset(b,-.48,bank["y"]+.55)
            r,s=at_height(p,p[1]-.48),at_height(q,q[1]-.48)
            glass.face(r,s,q,p)
            rail.beam(p,q,.053)
            rail.beam(r,p,.052)

    # Shallow end and side portals remain behind the lower bank, away from
    # the reserved front-side social openings and behind-stage terraces.
    for x,z0,z1 in ((-32,-28,31),(32,-27,31),(-24,37,49),(24,37,49)):
        for j in range(max(2,round((z1-z0)/5))):
            low=z0+(z1-z0)*j/max(2,round((z1-z0)/5))
            high=low+3.8
            if x>0 and -26<low<27:
                continue
            a,b=(x,0,low),(x,0,high)
            sign=1 if x>0 else -1
            y=8.13
            depth=1.1 if sign>0 else 1.6
            p,q=(x+sign*depth,0,low),(x+sign*depth,0,high)
            wall(portals,p,q,y,y+2.38)
            wall(frames,a,p,y,y+2.38)
            wall(frames,q,b,y,y+2.38)
            frames.beam(at_height(a,y+2.43),at_height(b,y+2.43),.19,.38)
            lights.beam((x-sign*.07,y+2.04,low+.55),(x-sign*.07,y+2.04,high-.55),.08)
            wall(ribbon,(x-sign*.15,0,low),(x-sign*.15,0,high),y+2.76,y+3.03)
            housing.beam((x,y+2.89,low),(x,y+2.89,high),.17,.46)
    return [concrete,skirts,portals,frames,lights,rail,glass,ribbon,housing]


def concourse():
    terrace = Mesh("shell_bowl_mass_open_concourse_decks", "737782", .88)
    timber = Mesh("shell_bowl_mass_social_club_warm_wood", "a36d47", .77)
    steel = Mesh("shell_bowl_mass_concourse_columns", "586a7a", .67, .3)
    glow = Mesh("shell_vomitories_concourse_static", "ffd19a", .61, emission=.59)
    guard = Mesh("shell_balustrades_open_concourse", "859baf", .52, .25)
    # Open terraces project into the bowl ahead of the retained seating
    # fascia. The stepped profiles keep guards clear of the ticketed seats.
    for y,start,end,x,outer in ((7.92,-33,34,31.25,48.2),
                               (11.85,-26,29,32.05,48.2),
                               (15.62,-22,25,33.12,49.5)):
        deck = [(x,y,start+2), (x+1.8,y,start), (outer,y,start),
                (outer,y,end), (x+1.8,y,end), (x,y,end-2)]
        terrace.solid(deck,[(a,y-.36,b) for a,_,b in deck])
        for a,b in ((deck[1],deck[0]), (deck[0],deck[-1]), (deck[-1],deck[-2])):
            guard.beam(at_height(a,y+1.02),at_height(b,y+1.02),.073)
            guard.beam(at_height(a,y+.13),at_height(b,y+.13),.083)
            divisions=max(2,round(hypot(b[0]-a[0],b[2]-a[2])/2.85))
            for i in range(divisions+1):
                p=lerp(a,b,i/divisions)
                guard.beam(at_height(p,y+.13),at_height(p,y+1.05),.055)
        for z in range(start+3,end-4,9):
            wall(timber,(x-.035,0,z),(x-.035,0,z+7.5),y-.32,y-.07)
            glow.beam((x-.055,y-.37,z+.3),(x-.055,y-.37,z+7.2),.078)
        for z in (-16,0,16):
            steel.beam((50.5,y,z),(50.5,y+3.61,z),.38,.42)
    # Bridge the terraces at both ends and retain the long sightline.
    for z in (-24,26):
        steel.beam((32.2,7.63,z),(34.1,15.67,z),.32,.32)
        for y,x in ((7.92,34.9),(11.85,36.2)):
            wall(timber,(x,0,z-.63),(x,0,z+.63),y,y+2.29)
            glow.beam((x-.045,y+2.07,z-.53),(x-.045,y+2.07,z+.53),.079)
    return [terrace,timber,steel,glow,guard]


def floor():
    slab = Mesh("shell_field_floor_slab", "50525a", .91)
    center = [(x,-.049,z) for x,z in ((-14,-38),(14,-38),(14,33),(-14,33))]
    pad = Mesh("shell_field_floor_concert_pad", "625e5b", .88)
    footprint = [(-45,-.117,-57),(40,-.117,-57),(47,-.117,-39),(47,-.117,40),
                 (40,-.117,61),(-47,-.117,61),(-55,-.117,42),(-55,-.117,-41)]
    slab.face(*footprint)
    pad.face(*center)
    return [slab,pad]


def roof():
    skin=Mesh("shell_roof_canopy_standing_seam", "a5a9aa", .67, .27)
    seams=Mesh("shell_roof_canopy_panel_joints", "858b92", .73, .3)
    edge=Mesh("shell_roof_canopy_fascia", "687887", .73, .25)
    vents=Mesh("shell_roof_canopy_mechanical", "687785", .86)
    truss=Mesh("shell_roof_truss_steel_lattice", "637483", .66, .31)
    transfer=Mesh("shell_roof_truss_social_side_transfer", "647c95", .61, .31)
    shell=ring(37.25,1.05)
    rim=ring(36.02,1.05)
    crown=[(x*.57,40,z*.71) for x,_,z in shell]
    skin.ring_strip(shell,crown)
    skin.face(*crown)
    edge.ring_strip(rim,shell)
    edge.ring_strip(rim,ring(35.98,-.2))
    for i,a in enumerate(shell):
        index=(i+1)%len(shell)
        b=shell[index]
        divisions=max(2,round(hypot(b[0]-a[0],b[2]-a[2])/6))
        for j in range(divisions):
            p,q=lerp(a,b,j/divisions),lerp(crown[i],crown[index],j/divisions)
            seams.beam(at_height(p,p[1]+.11),at_height(q,q[1]+.11),.22,.059)
    for x in range(-28,23,8):
        seams.beam((x,40.11,-44),(x,40.11,46),.22,.062)
    for x,z in ((-28,-26),(20,-28),(-26,28),(20,27)):
        top=[(x-3,41.7,z-5),(x+3,41.7,z-5),(x+3,41.7,z+5),(x-3,41.7,z+5)]
        vents.solid(top,[at_height(p,39.6) for p in top])

    def top_chord(x,z):
        return 37.02+1.2*max(0,min(1,(55-abs(x))/16,(64-abs(z))/15))

    for z in range(-60,61,8):
        left=-65 if abs(z)<=46 else -54
        right=52 if abs(z)<=45 else 43
        for k in range(22):
            a,b=left+(right-left)*k/22,left+(right-left)*(k+1)/22
            p,q=(a,35.67,z),(b,35.67,z)
            r,s=(a,top_chord(a,z),z),(b,top_chord(b,z),z)
            truss.beam(p,q,.36)
            truss.beam(r,s,.29)
            diagonal=(p,s) if k%2==0 else (r,q)
            truss.beam(*diagonal,.19)
    for x in range(-56,49,13):
        for z in range(-56,57,8):
            truss.beam((x,36.64,z-4),(x,36.64,z+4),.23)
    for k in range(10):
        a,b=-26.7+k*5.34,-26.7+(k+1)*5.34
        p,q=(49.7,35.21,a),(49.7,35.21,b)
        r,s=(49.7,37.5,a),(49.7,37.5,b)
        transfer.beam(p,q,.53)
        transfer.beam(r,s,.53)
        diagonal=(p,s) if k%2==0 else (r,q)
        transfer.beam(*diagonal,.31)
        if k%2==0:
            transfer.beam(p,r,.35)
    return [skin,seams,edge,vents,truss,transfer]


def file_bounds(path):
    with path.open("rb") as glb:
        magic,version,file_size,chunk_length,chunk_kind=struct.unpack("<4sIII4s",glb.read(20))
        assert (magic,version,file_size,chunk_kind)==(b"glTF",2,path.stat().st_size,b"JSON")
        gltf=json.loads(glb.read(chunk_length))
    assert all(not any(key in node for key in ("matrix","translation","rotation","scale"))
               for node in gltf["nodes"])
    accessors = [gltf["accessors"][primitive["attributes"]["POSITION"]]
                 for mesh in gltf["meshes"] for primitive in mesh["primitives"]]
    return {"min":[round(min(item["min"][i] for item in accessors),4) for i in range(3)],
            "max":[round(max(item["max"][i] for item in accessors),4) for i in range(3)]},len(accessors)


def main():
    profile = read_profile()
    probe = json.loads(subprocess.check_output(
        ["node", "scripts/probe-venue-bounds.mjs", VENUE, LAYOUT], cwd=ROOT))["layouts"][LAYOUT]
    assert profile["sourceSeatsCount"] == probe["sourceSeatsCount"]
    assert probe["boundsBasis"] == "source-model-xyz"
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.context.scene.unit_settings.system = "METRIC"
    generated = [*exterior(),*marquee(),*interior(profile),*concourse(),*floor(),*roof()]
    objects = [batch.create() for batch in generated]
    for obj in objects:
        if obj.name.startswith(("shell_roof_", "shell_ribbon_led_marquee_")):
            obj["unshadowed"] = True
    path = HERE / "shell.glb"
    bpy.ops.export_scene.gltf(filepath=str(path), export_format="GLB", export_yup=True,
                             export_apply=True, export_extras=True, export_animations=False)
    bounds, primitives = file_bounds(path)
    assert path.stat().st_size <= 3_000_000
    trusses = [batch for batch in generated if batch.name.startswith("shell_roof_truss")]
    minimum = min(vertex[2] for batch in trusses for vertex in batch.vertices)
    clearance = minimum - probe["seatBounds"]["max"][1]
    assert clearance > 3.
    manifest = {
        "marqueeScreenDimensions": {"height": 12.8, "faceWidths": [9.14, 9.14, 5.49]},
        "venueId": VENUE, "generator": "blender-bpy", "version": 1, "upAxis": "+Y",
        "units": "metres", "coordinateBasis": "source-model-xyz",
        "precision": "illustrative", "bounds": bounds, "seatBounds": probe["seatBounds"],
        "sourceSeatsCount": probe["sourceSeatsCount"], "sectionCount": profile["sectionCount"],
        "lightingPreset": "arena-dark",
        "roofNodeNames": sorted(obj.name for obj in objects if obj.name.startswith("shell_roof_")),
        "ribbonNodeNames": sorted(obj.name for obj in objects if obj.name.startswith("shell_ribbon_led")),
        "roofTrussClearanceAboveHighestSourceSeat": round(clearance, 3),
        "meshPrimitives": primitives, "assetBytes": path.stat().st_size,
        "retainedSeatAssetSha256": sha256(
             (ROOT / "data/concert-views/o2/source-seats" / f"{VENUE}.json").read_bytes()).hexdigest(),
        "references": REFERENCES,
        "notes": "Approximate original building geometry anchored to the retained TW Concert View seat coordinates. The open social concourses, transfer truss, structural ATLANTA letters and three-face Gate 4 marquee follow public architectural references. Orientation to real-world north is unverified. Shell dimensions are illustrative. The source coordinate frame is not independently surveyed."
    }
    (HERE / "manifest.json").write_text(json.dumps(manifest,indent=2)+"\n",encoding="utf8")


if __name__ == "__main__":
    main()
