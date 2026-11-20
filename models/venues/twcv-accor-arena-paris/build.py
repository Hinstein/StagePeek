"""Build the original Paris-Bercy arena shell from the retained seating frame."""

from hashlib import sha256
import json
from math import ceil, hypot
from pathlib import Path
from random import Random
import struct
import subprocess

import bmesh
import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
VENUE = "twcv-accor-arena-paris"
LAYOUT = "acc"
REFERENCES = [
    "https://cdn.paris.fr/presse/2020/03/23/6a1e88c4dc2ed1cd87978f6d3a1b1973.pdf",
    "https://www.dvvd.fr/projet/accorhotels-arena/",
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


def octagon(x, z, cut, y):
    return [(-x+cut,y,z), (x-cut,y,z), (x,y,z-cut), (x,y,-z+cut),
            (x-cut,y,-z), (-x+cut,y,-z), (-x,y,-z+cut), (-x,y,z-cut)]


def read_profile():
    return json.loads(subprocess.check_output(["node", "--input-type=module", "--eval", """
import {loadVenues} from './server/concert-views/venues.mjs';
import {sourceBowlDisplay} from './public/concert-views/source-bowl-display.mjs';
import {stageBoxes} from './public/concert-views/scene-geometry.mjs';
const [id,layout]=process.argv.slice(1);
const venue=loadVenues(undefined,{localDrafts:true,includeResearch:true}).get(id,layout);
const display=sourceBowlDisplay(venue);
const banks=display.banks.map(bank=>({
  front:bank.rows[0].front,
  rear:bank.rows.at(-1).back,
  y:bank.rows[0].y,
  rearY:bank.rows.at(-1).y
}));
console.log(JSON.stringify({banks,sourceSeatsCount:display.renderRecords.length,
  sectionCount:venue.sections.length,stage:stageBoxes(layout,venue),
  aisles:display.aisleSteps.map(step=>step.tread)}));
""", VENUE, LAYOUT], cwd=ROOT))


def shell_base():
    outer = octagon(72.3, 83, 20, 1.7)
    inner = octagon(54.6, 68.1, 15.6, -.12)
    plinth = Mesh("shell_bowl_mass_plinth", "81868b", .94)
    plinth.ring_strip(inner, outer)
    plinth.ring_strip(outer, [at_height(p,-.23) for p in outer])
    return plinth


def exterior():
    slope_foot = octagon(70, 81, 20, 1.7)
    slope_head = octagon(54, 69.5, 14, 27.9)
    cladding = Mesh("shell_bowl_mass_cladding", "777e70", .89)
    grass = [Mesh(f"shell_bowl_mass_planted_slope_{i+1}", color, .96)
             for i, color in enumerate(("657e47", "68814a", "6c844d", "607b43", "647e46"))]
    glass = Mesh("shell_bowl_mass_slope_skylight", "688b9e", .28, .28, .19)
    glazing = Mesh("shell_bowl_mass_skylight_mullions", "738297", .59, .42)
    trunk = Mesh("shell_bowl_mass_enclosure", "68737c", .81)
    randomizer = Random(221)

    for i, low in enumerate(slope_foot):
        j = (i + 1) % 8
        high = slope_head[i]

        def patch(u, v):
            return lerp(lerp(low, slope_foot[j], u), lerp(high, slope_head[j], u), v)

        # The Bercy slopes carry broad grass fields between glazed cuts.
        cutouts = {0: ((.18, .35), (.68, .76)), 1: ((.39, .64),),
                   3: ((.69, .78),), 4: ((.34, .41),), 6: ((.61, .69),)}.get(i, ())
        frames = sorted({0., 1., *[u for span in cutouts for u in span]})
        for a, b in zip(frames, frames[1:]):
            if (a, b) in cutouts:
                for step in range(9):
                    t = .09 + step*.10
                    left, right = patch(a, t), patch(b, t)
                    glass.face(left, right, patch(b, t+.10), patch(a, t+.10))
                    glazing.beam(left, right, .16)
                for part in range(7):
                    u = a + (b-a)*part/6
                    glazing.beam(patch(u,.09), patch(u,.99), .16, .19)
                cladding.face(patch(a,0),patch(b,0),patch(b,.09),patch(a,.09))
                cladding.face(patch(a,.99),patch(b,.99),patch(b,1),patch(a,1))
                continue
            # Adjacent patches meet along shared edges. The plants are encoded
            # as material variation and remain distinct from the arena floor.
            steps = max(2, round((b-a)*18))
            for col in range(steps):
                u, v = a+(b-a)*col/steps, a+(b-a)*(col+1)/steps
                for row in range(10):
                    low_t, high_t = .045 + .091*row, .045 + .091*(row+1)
                    batch = grass[randomizer.choices(range(len(grass)), [5,4,1,2,4])[0]]
                    batch.face(patch(u,low_t),patch(v,low_t),patch(v,high_t),patch(u,high_t))
            cladding.face(patch(a,0),patch(b,0),patch(b,.045),patch(a,.045))
            cladding.face(patch(a,.955),patch(b,.955),patch(b,1),patch(a,1))
        glazing.beam(patch(0,.04),patch(0,.96),.16)
    # The concrete inner skin is inset behind the glazing with a visible reveal.
    trunk.ring_strip(octagon(66.9, 77.3, 20, 1.6), octagon(53.4,68.8,14,27.9))
    return [cladding,*grass,glass,glazing,trunk]


def entrance():
    # The lowered glazed 2015 hall includes the diagonal roof promenade and
    # the public forecourt below the original grass-clad mass.
    roof = Mesh("shell_bowl_mass_entrance_promenade", "828080", .86)
    glazing = Mesh("shell_bowl_mass_entrance_glazing", "6b8393", .3, .31, .19)
    frame = Mesh("shell_bowl_mass_entrance_mullions", "51535a", .47, .45)
    lamp = Mesh("shell_vomitories_entrance_static", "f8ce91", .53, emission=.65)
    steps = Mesh("shell_bowl_mass_entrance_concrete_steps", "797f87", .95)
    span = [(-42,6.5,76),(-28,5.7,94),(9,4.4,99),(30,3.5,91),(39,2.65,78)]
    rear = [(-44,6.65,70),(-27,6.2,73),(7,6.2,76),(28,6.05,74),(38,4.55,71)]
    for i,(a,b) in enumerate(zip(span,span[1:])):
        c,d = rear[i+1],rear[i]
        strips = 6 if i<3 else 1
        for j in range(strips):
            p,q=lerp(a,d,j/strips),lerp(b,c,j/strips)
            r,s=lerp(a,d,(j+1)/strips),lerp(b,c,(j+1)/strips)
            roof.face(p,q,s,r)
            if j:
                frame.beam(at_height(p,p[1]+.095),at_height(q,q[1]+.095),.17,.08)
        glazing.face(at_height(a,.35),at_height(b,.35),b,a)
        frame.beam(a,b,.23,.27)
        frame.beam(at_height(a,2.3),at_height(b,2.3),.095)
        segments = max(2, round(hypot(b[0]-a[0],b[2]-a[2])/2.45))
        for k in range(segments+1):
            p=lerp(a,b,k/segments)
            frame.beam(at_height(p,.35),p,.14)
            if k<segments and k%2==0:
                mid=at_height(lerp(a,b,(k+.5)/segments),2.44)
                lamp.beam((mid[0]-.42,mid[1],mid[2]+.065),(mid[0]+.42,mid[1],mid[2]+.065),.07)
    for a,b in ((span[0],rear[0]),(span[-1],rear[-1])):
        glazing.face(at_height(a,.35),at_height(b,.35),b,a)
        frame.beam(a,b,.23)
    for i in range(5):
        near=.02+.58*i
        top=.76-.13*i
        a,b=lerp(span[1],span[2],.02-.002*i),lerp(span[1],span[2],.98+.002*i)
        slab=[(a[0],top,a[2]+near),(b[0],top,b[2]+near),
              (b[0],top,b[2]+near+.58),(a[0],top,a[2]+near+.58)]
        steps.solid(slab,[at_height(p,0) for p in slab])
    return [roof,glazing,frame,lamp,steps]


def interior(profile):
    support = Mesh("shell_bowl_mass_terrace_supports", "555b66", .93)
    apron = Mesh("shell_bowl_mass_concrete_front_skirt", "4f5663", .91)
    gallery = Mesh("shell_bowl_mass_suite_reveals", "424959", .84)
    glazing = Mesh("shell_bowl_mass_suite_glass", "7693a1", .27, .17, .16, .68)
    rail = Mesh("shell_balustrades_brushed_steel", "788a97", .53, .42)
    guard = Mesh("shell_balustrades_laminated_glass", "91b3c3", .28, .1, .07, .34)
    portal = Mesh("shell_vomitories_portal_frames", "92979e", .71)
    recess = Mesh("shell_vomitories_recesses", "161a23", .84, emission=.1)
    lamp = Mesh("shell_vomitories_portal_static", "f1cd86", .45, emission=.75)
    sign = Mesh("shell_ribbon_led", "71a9e4", .53, emission=.5)
    shelf = Mesh("shell_ribbon_led_housing", "333c4b", .76)

    for bank in profile["banks"]:
        upper = bank["y"] >= 12
        rear = bank["rear"]
        # Recessed support follows the actual last source row while the
        # existing source-rendered treads and tread heights stay in use.
        low = 10.38 if upper else -.08
        high = bank["rearY"]-.16
        for a,b in zip(rear,rear[1:]):
            p,q=offset(a,.52,high),offset(b,.52,high)
            r,s=offset(a,1.15,high),offset(b,1.15,high)
            support.face(p,q,s,r)
            support.face(p,at_height(p,low),at_height(q,low),q)
            support.face(r,s,at_height(s,low),at_height(r,low))
        for end in (rear[0],rear[-1]):
            a,b=offset(end,.52,high),offset(end,1.15,high)
            support.face(a,b,at_height(b,low),at_height(a,low))
        first = bank["front"]
        if not upper:
            high = bank["y"]-.115
            for a,b in zip(first,first[1:]):
                p,q=offset(a,.075,high),offset(b,.075,high)
                # Skip the retained stage envelope instead of inferring
                # concrete across its opening.
                if any(all(max(p[axis],q[axis])>box["center"][axis]-box["size"][axis]/2-.12
                           and min(p[axis],q[axis])<box["center"][axis]+box["size"][axis]/2+.12
                           for axis in (0,2)) for box in profile["stage"]):
                    continue
                apron.face(p,q,at_height(q,-.085),at_height(p,-.085))
            continue
        if hypot(first[-1][0]-first[0][0],first[-1][2]-first[0][2])<2.4:
            continue
        y = bank["y"]
        sampled = first[2:-2:3]
        for a,b in zip(sampled,sampled[1:]):
            p,q = offset(a,-.43,y+.55),offset(b,-.43,y+.55)
            r,s = at_height(p,y+.07),at_height(q,y+.07)
            guard.face(r,s,q,p)
            rail.beam(p,q,.055)
            rail.beam(r,p,.047)
        if len(sampled)>1:
            p = offset(sampled[-1],-.43,y+.55)
            rail.beam(at_height(p,y+.07),p,.047)

    aisles = aisle_clearance(profile["aisles"])
    ring = octagon(37.1,52.3,15.2,0)
    for i,a in enumerate(ring):
        b = ring[(i+1)%8]
        segments = max(3, round(hypot(b[0]-a[0],b[2]-a[2])/4.5))
        for j in range(segments):
            p,q=lerp(a,b,j/segments),lerp(a,b,(j+1)/segments)
            r,s=offset(p,.96,0),offset(q,.96,0)
            portal_bay = j%4==2
            back = recess if portal_bay else gallery
            strips = ceil(hypot(q[0]-p[0],q[2]-p[2])/.48)
            for k in range(strips):
                lo,hi = k/strips,(k+1)/strips
                front_a,front_b = lerp(p,q,lo),lerp(p,q,hi)
                rear_a,rear_b = lerp(r,s,lo),lerp(r,s,hi)
                add_clear_face(back,aisles,at_height(rear_a,10.38),at_height(rear_b,10.38),
                               at_height(rear_b,12.58),at_height(rear_a,12.58))
                add_clear_face(gallery,aisles,at_height(front_a,10.38),at_height(front_b,10.38),
                               at_height(rear_b,10.38),at_height(rear_a,10.38))
                if not portal_bay:
                    add_clear_face(glazing,aisles,at_height(front_a,10.52),at_height(front_b,10.52),
                                   at_height(front_b,12.43),at_height(front_a,12.43))
            if portal_bay:
                for front,rear in ((p,r),(q,s)):
                    add_clear_face(gallery,aisles,at_height(front,10.38),at_height(rear,10.38),
                                   at_height(rear,12.54),at_height(front,12.54))
            frame = portal if portal_bay else rail
            frame.beam(at_height(p,10.43),at_height(p,12.55),.13)
            frame.beam(at_height(p,12.54),at_height(q,12.54),.12)
            if portal_bay:
                entry_a,entry_b=offset(lerp(p,q,.31),-.16,12.22),offset(lerp(p,q,.69),-.16,12.22)
                lamp.beam(entry_a,entry_b,.087)
            if j%3!=2:
                start,end=offset(lerp(p,q,.07),-.13,0),offset(lerp(p,q,.93),-.13,0)
                sign.face(at_height(start,12.86),at_height(end,12.86),at_height(end,13.19),at_height(start,13.19))
            shelf.beam(at_height(p,13.02),at_height(q,13.02),.17,.46)
    return [support,apron,gallery,glazing,rail,guard,portal,recess,lamp,sign,shelf]


def aisle_clearance(treads):
    vertices, faces = [], []
    for tread in treads:
        base = len(vertices)
        vertices.extend((x,y+lift,z) for lift in (.026,2.12) for x,y,z in tread)
        faces.extend(tuple(base+i for i in face) for face in (
            (0,1,2,3),(7,6,5,4),(0,4,5,1),(1,5,6,2),(2,6,7,3),(3,7,4,0)
        ))
    return BVHTree.FromPolygons(vertices,faces)


def add_clear_face(mesh, aisles, *points):
    # Keep adjacent gallery strips while opening only the path occupied by
    # the existing stair headroom.
    face = BVHTree.FromPolygons(points,((0,1,2),(0,2,3)),all_triangles=True)
    if not face.overlap(aisles):
        mesh.face(*points)


def floor_tiles():
    slab = Mesh("shell_field_floor_slab", "575955", .92)
    panels = [Mesh(f"shell_field_floor_court_{i+1}", color, .84)
              for i,color in enumerate(("565652","595954","575853","5b5b54"))]
    terrain = octagon(54.5,68,15.5,-.118)
    slab.solid(terrain,[at_height(p,-.2) for p in terrain])
    randomizer = Random(150)
    # Large muted modules are the arena surface, not facade grass or stage.
    for i in range(14):
        for j in range(20):
            x,z = -35+i*5,-50+j*5
            points=[(x,-.059,z),(x+4.988,-.059,z),(x+4.988,-.059,z+4.988),(x,-.059,z+4.988)]
            panels[randomizer.randrange(len(panels))].face(*points)
    return [slab,*panels]


def roof():
    skin = Mesh("shell_roof_canopy_zinc", "a8b1bb", .64, .24)
    seams = Mesh("shell_roof_canopy_seams", "8e9ba8", .63, .28)
    girders = Mesh("shell_roof_truss_main_girders", "667d9e", .56, .31)
    chord = Mesh("shell_roof_truss_perimeter_chords", "466da0", .49, .36, .11)
    fascia = Mesh("shell_roof_canopy_edge_band", "354b6b", .62, .28)
    clerestory = Mesh("shell_roof_canopy_clerestory", "596d83", .47, .21, .08)
    vent = Mesh("shell_roof_canopy_plant_rooms", "6e777c", .86)

    bottom = octagon(54,69.5,14,27.9)
    eaves = octagon(53.5,69,13.6,33.6)
    deck = octagon(52.9,68.4,13.3,34.2)
    ridge = octagon(32.3,48.1,11,35.5)
    skin.ring_strip(deck,ridge)
    skin.face(*ridge)
    fascia.ring_strip(eaves,deck)
    clerestory.ring_strip([offset(p,-.45,27.89) for p in bottom],
                          [offset(p,-.5,33.58) for p in eaves])

    def roof_height(x,z):
        radius = max(abs(x)/52.9,abs(z)/68.4,(abs(x)+abs(z))/108)
        return 34.24 + min(1,max(0,1-radius)/.38)*1.3

    for i,a in enumerate(eaves):
        j=(i+1)%8
        b=eaves[j]
        depth=hypot(b[0]-a[0],b[2]-a[2])
        segments=max(3,round(depth/4.3))
        for k in range(segments):
            t,u=k/segments,(k+1)/segments
            p,q=lerp(a,b,t),lerp(a,b,u)
            r,s=lerp(bottom[i],bottom[j],t),lerp(bottom[i],bottom[j],u)
            chord.beam(p,q,.26)
            chord.beam(r,s,.24)
            chord.beam(r,q,.19)
            chord.beam(p,s,.19)
            if k%2==0:
                chord.beam(r,p,.24)
        a,b=deck[i],deck[j]
        c,d=ridge[i],ridge[j]
        divisions = max(3, round(hypot(b[0]-a[0],b[2]-a[2])/7.8))
        for k in range(divisions):
            t=k/divisions
            p,q=lerp(a,b,t),lerp(c,d,t)
            seams.beam(at_height(p,p[1]+.075),at_height(q,q[1]+.075),.22,.052)
    for x in range(-24,25,8):
        seams.beam((x,35.575,-39),(x,35.575,39),.22,.055)
    # Two structural directions remain visible from the upper bowl.
    for along_x,count,step in ((True,14,8.8),(False,11,8.6)):
        for i in range(count+1):
            position=(i-count/2)*step
            span=min(52.0 if along_x else 67.5,107.6-abs(position))
            pieces=max(4,round(2*span/5.5))
            for j in range(pieces):
                low,high=-span+2*span*j/pieces,-span+2*span*(j+1)/pieces
                x,z=(low,position) if along_x else (position,low)
                a,c=(high,z) if along_x else (x,high)
                high_p=(x,roof_height(x,z)-.55,z)
                high_q=(a,roof_height(a,c)-.55,c)
                low_y=29.7 if along_x else 30.7
                low_p,low_q=at_height(high_p,low_y),at_height(high_q,low_y)
                girders.beam(high_p,high_q,.36 if along_x else .24)
                girders.beam(low_p,low_q,.39 if along_x else .28)
                girders.beam(low_p if j%2==0 else high_p,high_q if j%2==0 else low_q,.18)
    for x,z,width,depth,height in ((-38,14,6,11,5),(39,-26,6,10,4.3),(-14,-36,8,4,1.7),(17,27,8,4,1.8)):
        base=roof_height(x,z)-.72
        points=[(x-width/2,base+height,z-depth/2),(x+width/2,base+height,z-depth/2),
                (x+width/2,base+height,z+depth/2),(x-width/2,base+height,z+depth/2)]
        vent.solid(points,[at_height(p,base) for p in points])
    return [skin,seams,girders,chord,fascia,clerestory,vent]


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
    generated = [shell_base(),*exterior(),*entrance(),*interior(profile),*floor_tiles(),*roof()]
    objects = [batch.create() for batch in generated]
    for obj in objects:
        if obj.name.startswith(("shell_roof_", "shell_bowl_mass_entrance_")):
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
        "notes": "Approximate original building geometry anchored to the retained TW Concert View seat coordinates. The planted slopes, lattice roof and the renovated glazed hall follow the architectural references. Gallery surfaces leave the existing aisle treads and headroom clear. Shell dimensions are illustrative. The source coordinate frame is not independently surveyed."
    }
    (HERE / "manifest.json").write_text(json.dumps(manifest,indent=2)+"\n",encoding="utf8")


if __name__ == "__main__":
    main()
