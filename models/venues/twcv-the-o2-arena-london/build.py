"""Build an original O2 Arena shell from the retained o2a model.

Run from Blender 5.2+ in background mode with --python-exit-code 1.
"""
from hashlib import sha256
import json
from math import cos, hypot, pi, sin
from pathlib import Path
import struct
import subprocess

import bmesh
import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree

VENUE = "twcv-the-o2-arena-london"
HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
BASIS = "source-model-xyz"


def read_profile():
    # Use the same display terraces and coordinate frame as the viewer. The
    # source anchors are included separately so both frames can be checked.
    program = """
import {loadVenues} from './server/concert-views/venues.mjs';
import {applyRenderBatch,loadRenderBatch} from './server/concert-views/render-batch.mjs';
import {o2DisplayModel} from './public/concert-views/o2-display.mjs';
import {stageBoxes} from './public/concert-views/scene-geometry.mjs';
const id=process.argv[1], venue=applyRenderBatch(loadVenues(undefined,{localDrafts:true,includeResearch:true}).get(id,'o2a'),loadRenderBatch());
const model=o2DisplayModel(venue), lastUpper=model.rows.at(-1), count=192;
const rowPath=(row,radius)=>{
  const start=row.start(radius),end=row.end(radius);
  // Preserve the four tangent joins when sampling the track.
  const cuts=[start,...Array.from({length:159},(_,i)=>(i+1)/20).map(t=>t>6&&start<0?t-8:t)
    .filter(t=>t>start&&t<end),end].sort((a,b)=>a-b);
  return cuts.map(t=>model.point(radius,t,row.y));
};
const bands=model.rows.map(row=>({
  level:row.level,y:row.y,front:rowPath(row,row.front),back:rowPath(row,row.back)
}));
const wall=Array.from({length:count+1},(_,i)=>{
  const t=i*8/count, p=model.point(lastUpper.back+1.9,t,0);
  // At the stage end the seats truncate on progressively shorter tracks.
  // Follow that envelope with a widening seal, without building over seats.
  const u=t>6?t-8:t;
  const wing=Math.max(9.8,...model.rows.filter(row=>row.level==='L4').map(row=>{
    const miss=Math.max(0,row.start(row.radius)-u,u-row.end(row.radius));
    return row.y+.45-miss*39;
  }));
  return [p[0],wing,p[2]];
});
const displayStage=venue.researchRenderBatch.stage;
const stage=[...stageBoxes('o2a',venue).filter(b=>b.kind==='platform'),
  {center:[displayStage.x,displayStage.h/2,displayStage.z],size:[displayStage.w,displayStage.h,displayStage.d]}];
process.stdout.write(JSON.stringify({
  bands,wall,stage,fascias:model.gallery.fascias,recesses:model.gallery.recesses,
  source:venue.sourceSeats.map(s=>s.position),
  display:model.renderRecords.map(s=>s.p)
}));
"""
    return json.loads(subprocess.check_output(
        ["node", "--input-type=module", "--eval", program, VENUE], cwd=ROOT,
    ))


def coordinates(point):
    x, y, z = point
    return (x, -z, y)


def rgb(value):
    channels = bytes.fromhex(value)
    return tuple(v / 3294.6 if v <= 10 else ((v / 255 + .055) / 1.055) ** 2.4
                 for v in channels)


class Mesh:
    def __init__(self, name, color, roughness, metallic=0, emission=0, alpha=1):
        self.name = name
        self.color = rgb(color)
        self.roughness = roughness
        self.metallic = metallic
        self.emission = emission
        self.alpha = alpha
        self.vertices = []
        self.faces = []
        self.indices = {}

    def face(self, *points):
        indices = []
        for point in points:
            key = tuple(round(v, 6) for v in point)
            if key not in self.indices:
                self.indices[key] = len(self.vertices)
                self.vertices.append(coordinates(key))
            indices.append(self.indices[key])
        if len(set(indices)) >= 3:
            self.faces.append(tuple(dict.fromkeys(indices)))

    def prism(self, top, bottom_height):
        bottom = [(x, bottom_height, z) for x, _, z in top]
        self.face(*top)
        self.face(*reversed(bottom))
        for i, point in enumerate(top):
            j = (i + 1) % len(top)
            self.face(point, bottom[i], bottom[j], top[j])

    def line(self, start, end, radius, sides=5, top_radius=None):
        bottom = Vector(start)
        axis = (Vector(end)-bottom).normalized()
        cross = axis.cross(Vector((0, 1, 0) if abs(axis.y)<.92 else (1, 0, 0))).normalized()
        normal = axis.cross(cross)
        offsets = [cos(i*2*pi/sides)*cross+sin(i*2*pi/sides)*normal for i in range(sides)]
        foot = [bottom+radius*v for v in offsets]
        tip = [Vector(end)+(top_radius or radius)*v for v in offsets]
        for i in range(sides):
            j = (i+1)%sides
            self.face(foot[i], foot[j], tip[j], tip[i])
        self.face(*reversed(foot))
        self.face(*tip)

    def create(self):
        if not self.faces:
            return None
        geometry = bpy.data.meshes.new(self.name)
        geometry.from_pydata(self.vertices, [], self.faces)
        geometry.validate()
        halfedge = bmesh.new()
        halfedge.from_mesh(geometry)
        bmesh.ops.recalc_face_normals(halfedge, faces=list(halfedge.faces))
        halfedge.to_mesh(geometry)
        halfedge.free()
        geometry.update()
        object_ = bpy.data.objects.new(self.name, geometry)
        bpy.context.collection.objects.link(object_)
        material = bpy.data.materials.new(self.name)
        if material.node_tree is None:
            material.use_nodes = True
        shader = material.node_tree.nodes.get("Principled BSDF")
        shader.inputs["Base Color"].default_value = (*self.color, 1)
        shader.inputs["Alpha"].default_value = self.alpha
        shader.inputs["Roughness"].default_value = self.roughness
        shader.inputs["Metallic"].default_value = self.metallic
        shader.inputs["Emission Color"].default_value = (*self.color, 1)
        shader.inputs["Emission Strength"].default_value = self.emission
        geometry.materials.append(material)
        return object_


def at_height(point, y):
    return (point[0], y, point[2])


def inward(point, distance, y):
    x, _, z = point
    length = hypot(x, z)
    return (x - distance*x/length, y, z - distance*z/length)


def along(track, fraction):
    at = fraction * (len(track)-1)
    i = min(int(at), len(track)-2)
    return tuple(a+(b-a)*(at-i) for a, b in zip(track[i], track[i+1]))


def clearance_index(points):
    cells = {}
    for point in points:
        cells.setdefault((int(point[0]//2), int(point[2]//2)), []).append(point)
    return cells


def tread_ceiling(polygon, requested, cells):
    xs, _, zs = zip(*polygon)
    lo_x, hi_x = min(xs)-.34, max(xs)+.34
    lo_z, hi_z = min(zs)-.39, max(zs)+.39
    candidates = [point[1]-.11
                  for x in range(int(lo_x//2), int(hi_x//2)+1)
                  for z in range(int(lo_z//2), int(hi_z//2)+1)
                  for point in cells.get((x, z), ())
                  if lo_x < point[0] < hi_x and lo_z < point[2] < hi_z]
    return min([requested, *candidates])


def stage_clear(polygon, stages):
    xs, _, zs = zip(*polygon)
    for stage in stages:
        x, _, z = stage["center"]
        w, _, d = stage["size"]
        if (max(xs) > x-w/2-.04 and min(xs) < x+w/2+.04
                and max(zs) > z-d/2-.04 and min(zs) < z+d/2+.04):
            return False
    return True


def concrete_shell(profile):
    lower = Mesh("shell_bowl_mass_lower", "4d5162", .89)
    upper = Mesh("shell_bowl_mass_upper", "4a5063", .84)
    lower_seats = clearance_index(p for p in profile["source"]+profile["display"] if p[1]<12)
    upper_seats = clearance_index(p for p in profile["source"]+profile["display"] if p[1]>=12)
    for band in profile["bands"]:
        is_lower = band["level"] == "L1"
        mesh = lower if is_lower else upper
        cells = lower_seats if is_lower else upper_seats
        # The composite lower foundation extends to grade. The upper bowl
        # cantilevers above the open galleries and closes at the facade.
        for i in range(96):
            a, b = i/96, (i+1)/96
            ring = [along(band["front"], a), along(band["front"], b),
                    along(band["back"], b), along(band["back"], a)]
            top = tread_ceiling(ring, band["y"]-.11, cells)
            bottom = 0 if is_lower else max(17.05, top-2.15)
            if top>bottom+.03 and (not is_lower or stage_clear(ring, profile["stage"])):
                mesh.prism([at_height(p,top) for p in ring], bottom)
    return [lower, upper]


def enclosure(profile):
    concrete = Mesh("shell_bowl_mass_enclosure", "555e70", .83)
    cladding = Mesh("shell_bowl_mass_cladding", "737e8d", .62, .16)
    caps = Mesh("shell_bowl_mass_trim", "343d4d", .56, .28)
    frames = Mesh("shell_vomitories_reveals", "8b9aa9", .54, .28)
    recess = Mesh("shell_vomitories_doors", "2b3749", .84)
    # Thicken toward the exterior so the aisle lights and inner clearance stay in place.
    wall = [inward(point, -.45, point[1]) for point in profile["wall"]]
    for index, (a, b) in enumerate(zip(wall, wall[1:])):
        # Continuous front/back faces avoid coplanar internal faces at each
        # tessellation seam. Only service apertures need return faces.
        entry = index%12==6
        grade = 2.8 if entry else -.02
        outer_a, outer_b = at_height(a,grade), at_height(b,grade)
        inner_a, inner_b = inward(a,1.60,grade), inward(b,1.60,grade)
        top_a, top_b = inward(a,1.60,a[1]), inward(b,1.60,b[1])
        concrete.face(outer_a,outer_b,b,a)
        concrete.face(inner_a,top_a,top_b,inner_b)
        concrete.face(a,b,top_b,top_a)
        concrete.face(outer_a,inner_a,inner_b,outer_b)
        if entry:
            # The lintel sits above an actual aperture. Its service door is
            # recessed behind the exterior jambs and threshold.
            point = lambda p, y: inward(p, .92, y)
            recess.face(point(a,.015),point(b,.015),point(b,2.8),point(a,2.8))
            recess.face(at_height(a,.015),at_height(b,.015),point(b,.015),point(a,.015))
            for side in [a,b]:
                concrete.face(at_height(side,-.02),inward(side,1.60,-.02),
                              inward(side,1.60,2.8),at_height(side,2.8))
                frames.line(inward(side,-.025,.02),inward(side,-.025,2.8),.095,sides=4)
            frames.line(inward(a,-.025,2.8),inward(b,-.025,2.8),.10,sides=4)
        for lo, hi in [(1,1.22),(6.7,7.02),(9.8,10.05),(15.5,16.04),(23.6,24.09)]:
            if min(a[1], b[1]) < hi+.3 or (entry and hi<2.8):
                continue
            cladding.face(inward(a,-.035,lo), inward(b,-.035,lo),
                          inward(b,-.035,hi), inward(a,-.035,hi))
        caps.face(inward(a,-.025,a[1]-.22), inward(b,-.025,b[1]-.22),
                  inward(b,-.025,b[1]), inward(a,-.025,a[1]))
    return [concrete, cladding, caps, frames, recess]


def gallery(profile):
    glass = Mesh("shell_balustrades_glass", "8bb0cc", .28, .23, alpha=.31)
    windows = Mesh("shell_bowl_mass_suite_windows", "556e85", .33, .46)
    rail = Mesh("shell_balustrades_rails", "abb6c4", .34, .58)
    led = Mesh("shell_ribbon_led", "50a9d2", .42, emission=.74)
    glass_segments = 4
    for index in range(0,len(profile["fascias"])-2*glass_segments,2*glass_segments):
        for layer in (0,1):
            a = profile["fascias"][index+layer][3]
            b = profile["fascias"][index+2*(glass_segments-1)+layer][2]
            if hypot(a[0]-b[0], a[2]-b[2])>7:
                continue
            # The existing deck supplies the lower opaque fascia. The facing
            # and handrails tuck just inside the edge above that fascia.
            q, r = inward(a,.12,a[1]), inward(b,.12,b[1])
            top_q, top_r = at_height(q,q[1]+.69), at_height(r,r[1]+.69)
            glass.face(q,r,top_r,top_q)
            rail.line(top_q,top_r,.036,sides=4)
            rail.line(q,top_q,.029,sides=4)
            if layer==1:
                led.face(inward(a,.13,a[1]-.25), inward(b,.13,b[1]-.25),
                         inward(b,.13,b[1]-.14), inward(a,.13,a[1]-.14))
    for start in range(0,len(profile["recesses"])-2*glass_segments,2*(glass_segments+1)):
        for layer in (0,1):
            a, _, _, d = profile["recesses"][start+layer]
            _, b, c, _ = profile["recesses"][start+2*(glass_segments-1)+layer]
            if hypot(a[0]-b[0],a[2]-b[2])<6:
                windows.face(inward(a,.08,a[1]+.77),inward(b,.08,b[1]+.77),
                             inward(c,.08,c[1]-.21),inward(d,.08,d[1]-.21))
    return [glass, rail, windows, led]


def floor_shell():
    # Stage platforms are added separately at y=0. Sink the perimeter paving
    # and keep the performance deck nearly flush with the stage base.
    deck = [Mesh("shell_field_floor", "30353f", .82),
            Mesh("shell_field_floor_panels", "313641", .83)]
    plinth = Mesh("shell_field_floor_apron", "404b5a", .89)
    contour = [(68*cos(i*2*pi/128), -.28, 9+84*sin(i*2*pi/128)) for i in range(128)]
    plinth.prism(contour, -.54)
    for i in range(25):
        a, b = -54+i*4.55, -54+(i+1)*4.55
        deck[i%2].face((-40,-.026,b),(40,-.026,b),(40,-.026,a),(-40,-.026,a))
    for x in (-40,40):
        deck[0].face((x,-.026,-54),(x,-.026,59.75),(x,-.31,59.75),(x,-.31,-54))
    for z in (-54,59.75):
        deck[0].face((-40,-.026,z),(40,-.026,z),(40,-.31,z),(-40,-.31,z))
    return [*deck, plinth]


def roof_shell(highest):
    fabric = [Mesh("shell_roof_canopy", "e7e8ec", .70),
              Mesh("shell_roof_canopy_gore", "d5dbe1", .77)]
    edge = Mesh("shell_roof_truss_perimeter", "65778b", .49, .67)
    steel = Mesh("shell_roof_truss_cables", "8596a5", .48, .64)
    masts = Mesh("shell_roof_truss_masts", "f8b52c", .43, .24)
    beacons = Mesh("shell_roof_truss_beacons", "ff8164", .42, emission=.6)
    eave = highest+3.85

    def profile(a, r, offset=0):
        return (62.3*r*cos(a), eave+12.8*(1-r*r)+offset, 10.26+78.4*r*sin(a))

    divisions = 96
    radii = [0,.14,.28,.42,.56,.70,.82,.92,1]
    for i in range(divisions):
        a, b = i*2*pi/divisions, (i+1)*2*pi/divisions
        canopy = fabric[int((i//4)%6==2)]
        for lo, hi in zip(radii,radii[1:]):
            canopy.face(profile(a,lo),profile(a,hi),profile(b,hi),profile(b,lo))
        edge.line(profile(a,1,-.21),profile(b,1,-.21),.29,sides=5)
        if i%4==0:
            for lo, hi in zip(radii[1:],radii[2:]):
                steel.line(profile(a,lo,.24),profile(a,hi,.24),.105,sides=5)
        for r in (.39,.63,.83):
            steel.line(profile(a,r,.24),profile(b,r,.24),.092,sides=4)

    for i in range(12):
        a = (i+.5)*2*pi/12
        foot, top = profile(a,.59,-5.25), profile(a,.52,15.8)
        # Twelve inclined tripod masts give the compacted canopy its identity.
        for leg in range(3):
            d = leg*2*pi/3+a
            base = (foot[0]+.98*cos(d),foot[1],foot[2]+.98*sin(d))
            apex = (top[0]+.25*cos(d),top[1],top[2]+.25*sin(d))
            masts.line(base,apex,.235,sides=6,top_radius=.165)
        for t in (.22,.42,.62,.82):
            centre = tuple(a_+(b_-a_)*t for a_,b_ in zip(foot,top))
            r = .98-.73*t
            points = [(centre[0]+r*cos(d*2*pi/3+a),centre[1],centre[2]+r*sin(d*2*pi/3+a))
                      for d in range(3)]
            for j in range(3):
                masts.line(points[j-1],points[j],.11,sides=4)
        for delta, radius in ((-.14,.99),(.14,.99),(-.21,.21),(.21,.21)):
            steel.line(top,profile(a+delta,radius,.23),.104,sides=5)
        beacons.line(top, (top[0],top[1]+.45,top[2]), .15,sides=6)

    return [*fabric, edge, steel, masts, beacons]


def bounds(points):
    return {"min":[round(min(axis),3) for axis in zip(*points)],
            "max":[round(max(axis),3) for axis in zip(*points)]}


def inspect_export(file):
    with file.open("rb") as glb:
        magic, version, _ = struct.unpack("<4sII", glb.read(12))
        length, chunk = struct.unpack("<I4s", glb.read(8))
        assert magic == b"glTF" and version == 2 and chunk == b"JSON"
        gltf = json.loads(glb.read(length))
    groups = {}
    for node in gltf["nodes"]:
        if "mesh" not in node:
            continue
        assert not set(node).intersection({"matrix","translation","rotation","scale"})
        primitive, = gltf["meshes"][node["mesh"]]["primitives"]
        bound = gltf["accessors"][primitive["attributes"]["POSITION"]]
        groups[node["name"]] = {key:bound[key] for key in ("min","max")}
    return groups


def verify_seats(profile, shell):
    # A conservative narrow-phase test around both retained and display seats.
    # Separate lower and upper concrete so the overhead balcony is not treated
    # as the base of a lower chair.
    for geometry, upper in zip(shell, (False, True)):
        points = profile["source"]+profile["display"]
        bvh = BVHTree.FromPolygons(geometry.vertices,geometry.faces)
        worst = float("inf")
        count = 0
        for p in (p for p in points if (p[1]>=12)==upper):
            for dx, dz in ((0,0),(-.22,-.24),(-.22,.24),(.22,-.24),(.22,.24)):
                hit, _, _, _ = bvh.ray_cast(
                    Vector(coordinates((p[0]+dx,p[1]+1.05,p[2]+dz))),
                    Vector((0,0,-1)), 1.21)
                if hit is not None:
                    worst = min(worst, p[1]-hit.z)
                count += 1
        assert worst>=.097, (geometry.name,worst)
        print(f"{geometry.name}: {count} rays, closest shell surface {worst:.3f} model units below the chair")


def main():
    profile = read_profile()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.context.scene.unit_settings.system = "METRIC"
    bpy.context.scene.unit_settings.scale_length = 1
    highest = max(p[1] for p in profile["source"]+profile["display"])
    bowl = concrete_shell(profile)
    verify_seats(profile,bowl)
    for mesh in [*bowl, *enclosure(profile), *gallery(profile), *floor_shell(),
                 *roof_shell(highest)]:
        object_ = mesh.create()
        if mesh.name == "shell_bowl_mass_enclosure":
            object_["castsShadow"] = True
        if mesh.name == "shell_field_floor_apron":
            object_["unshadowed"] = True
    file = HERE/"shell.glb"
    result = bpy.ops.export_scene.gltf(
        filepath=str(file), export_format="GLB", export_yup=True,
        export_apply=True, export_cameras=False, export_lights=False, export_extras=True,
    )
    assert result == {"FINISHED"}
    groups = inspect_export(file)
    roof_nodes = [name for name in groups if name.startswith("shell_roof_")]
    ribbon_nodes = [name for name in groups if name.startswith("shell_ribbon_led")]
    roof_clearance = min(groups[name]["min"][1] for name in roof_nodes)-highest
    assert roof_clearance>3 and file.stat().st_size<=3_000_000
    asset = ROOT/"data/concert-views/o2/source-seats"/f"{VENUE}.json"
    manifest = {
        "venueId": VENUE, "version": 1, "generator": "blender-bpy",
        "coordinateBasis": BASIS, "upAxis": "+Y", "unitScale": 1,
        "bounds": bounds([point for group in groups.values() for point in group.values()]),
        "seatAnchorBounds": bounds(profile["source"]),
        "displaySeatAnchorBounds": bounds(profile["display"]),
        "sourceSeatCount": len(profile["source"]),
        "sourceAssetSha256": sha256(asset.read_bytes()).hexdigest(),
        "lightingPreset": "arena-dark",
        "roofNodeNames": roof_nodes, "ribbonNodeNames": ribbon_nodes,
        "roofClearance": round(roof_clearance, 3),
        "meshCount": len(groups), "shellBytes": file.stat().st_size,
        "architectureAccuracy": "illustrative",
        "basis": [
            "Original Blender geometry registered to the unchanged o2a source frame and the existing StagePeek presentation terraces.",
            "The arena and the surrounding Millennium Dome are separate buildings. The canopy is compacted around the arena envelope for this cutaway.",
            "Venue display dimensions and architectural detailing are indicative. The export uses metres as scene units and does not establish surveyed distances or egress dimensions.",
        ],
        "references": [
            "https://rshp.com/projects/culture-and-leisure/the-millennium-dome/",
            "https://populous.com/showcases/the-o2-london",
        ],
    }
    (HERE/"manifest.json").write_text(json.dumps(manifest,indent=2)+"\n")


if __name__ == "__main__":
    main()
