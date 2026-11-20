"""Generate the Grand Theater's permanent shell in the existing StagePeek axes."""
import json
import math
import struct
import subprocess
from collections import defaultdict
from pathlib import Path

import bmesh
import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree

VENUE_ID = "taipei-pac-grand-theater"
HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]

# Read the same source row profiles the viewer uses, so updates to those
# profiles cannot silently leave a second set of baked fitting coordinates.
READ_MODEL = """
import {loadVenues} from './server/concert-views/venues.mjs';
import {sourceBowlDisplay} from './public/concert-views/source-bowl-display.mjs';
import {stageRects} from './public/concert-views/geometry.mjs';
import {chairParts} from './public/concert-views/spatial.mjs';

const venue=loadVenues(undefined,{localDrafts:true,includeResearch:true}).get(process.argv[1],'end');
const model=sourceBowlDisplay(venue);
console.log(JSON.stringify({
  banks:model.banks.map(bank=>({
    section:bank.section,level:bank.level,
    rows:bank.rows.map(row=>({y:row.y,front:row.front,back:row.back})),
  })),
  records:model.records.map(({p,angle,width})=>({p,angle,width})),
  chairParts,
  stages:stageRects('end',venue),
  source:venue.source,
  assetHash:venue.seatLayout.assetSha256,
}));
"""

COLORS = {
    "concrete": ("#354253", 0.86, 0.06),
    "foundation": ("#293441", 0.83, 0.01),
    "cladding": ("#71818d", 0.62, 0.40),
    "seam": ("#354653", 0.73, 0.18),
    "blue": ("#263e63", 0.78, 0.07),
    "baffle": ("#425f8a", 0.82, 0.04),
    "navy": ("#192943", 0.88, 0.01),
    "stage": ("#282a31", 0.87, 0.02),
    "stage_light": ("#30333b", 0.84, 0.02),
    "roof": ("#8194a3", 0.67, 0.30),
    "roof_panels": ("#667c8b", 0.68, 0.29),
    "steel": ("#758898", 0.45, 0.52),
    "glass": ("#a5bacd", 0.29, 0.06),
    "amber": ("#dcab6a", 0.5, 0.15),
}


def linear(srgb):
    return srgb / 12.92 if srgb <= 0.04045 else ((srgb + 0.055) / 1.055) ** 2.4


class Shell:
    def __init__(self):
        self.geometry = defaultdict(lambda: ([], []))

    def mesh(self, node, material, points, faces):
        if node.startswith("shell_bowl_mass_") and node != "shell_bowl_mass_proscenium":
            node = "shell_bowl_mass"
        vertices, polygons = self.geometry[node, material]
        offset = len(vertices)
        vertices.extend((x, y, z) for x, y, z in points)
        polygons.extend(tuple(i + offset for i in face) for face in faces)

    def slab(self, node, material, top, bottom):
        count = len(top)
        self.mesh(
            node,
            material,
            [*top, *bottom],
            [
                tuple(range(count)),
                tuple(reversed(range(count, count * 2))),
                *((i, (i + 1) % count, (i + 1) % count + count, i + count) for i in range(count)),
            ],
        )

    def box(self, node, material, x, y, z):
        plan = ((x[0], z[0]), (x[1], z[0]), (x[1], z[1]), (x[0], z[1]))
        self.slab(node, material, [(a, y[1], b) for a, b in plan], [(a, y[0], b) for a, b in plan])

    def panel(self, node, material, a, b, low, high, depth):
        dx, dz = b[0] - a[0], b[2] - a[2]
        length = math.hypot(dx, dz)
        if length < .001:
            return
        nx, nz = -dz / length * depth / 2, dx / length * depth / 2
        plan = (
            (a[0] - nx, a[1], a[2] - nz), (b[0] - nx, b[1], b[2] - nz),
            (b[0] + nx, b[1], b[2] + nz), (a[0] + nx, a[1], a[2] + nz),
        )
        self.slab(node, material, [(x, y + high, z) for x, y, z in plan], [(x, y + low, z) for x, y, z in plan])

    def write(self):
        material_names = {material for _, material in self.geometry}
        materials = {}
        for name in sorted(material_names):
            material = bpy.data.materials.new(name)
            if material.node_tree is None:
                material.use_nodes = True
            shader = material.node_tree.nodes.get("Principled BSDF")
            color, roughness, metalness = COLORS[name]
            rgb = tuple(linear(int(color[i:i+2], 16) / 255) for i in (1, 3, 5))
            shader.inputs["Base Color"].default_value = (*rgb, 1)
            shader.inputs["Roughness"].default_value = roughness
            shader.inputs["Metallic"].default_value = metalness
            if name == "glass":
                material.surface_render_method = "BLENDED"
                shader.inputs["Alpha"].default_value = .34
            if name == "amber":
                shader.inputs["Emission Color"].default_value = (*rgb, 1)
                shader.inputs["Emission Strength"].default_value = .65
            materials[name] = material

        for (node, material), (vertices, polygons) in self.geometry.items():
            # Blender +Z up to glTF +Y up is applied by the exporter.
            name = node + "_" + material
            mesh = bpy.data.meshes.new(name)
            mesh.from_pydata([(x, -z, y) for x, y, z in vertices], [], polygons)
            bm = bmesh.new()
            bm.from_mesh(mesh)
            bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
            bm.to_mesh(mesh)
            bm.free()
            obj = bpy.data.objects.new(name, mesh)
            obj.data.materials.append(materials[material])
            bpy.context.collection.objects.link(obj)


def seat_supports(shell, banks):
    for bank in banks:
        pit = bank["section"] == "樂池"
        elevated = bank["level"].startswith("6F") or bank["level"] == "包廂"
        for row in bank["rows"]:
            # Offset below the in-app treads. The bottom slopes of the upper
            # deck never fill the headroom of the lower seating beneath it.
            top = row["y"] - .1
            bottom = top - .46 if elevated else (-1.52 if pit else -.18)
            front = row["front"]
            back = row["back"]
            mid_x = sum(p[0] for p in front + back) / (len(front) + len(back))
            mid_z = sum(p[2] for p in front + back) / (len(front) + len(back))
            # Keep an inset at tread edges where neighboring rows overlap.
            plan = [
                (x + (mid_x-x)*.018, top, z+(mid_z-z)*.09)
                for x, _, z in [*front, *reversed(back)]
            ]
            shell.slab("shell_bowl_mass_seat_supports", "navy" if pit else "concrete", plan, [(x, bottom, z) for x, _, z in plan])

        if elevated:
            lip = []
            first = bank["rows"][0]
            for front, back in zip(first["front"], first["back"]):
                direction = (Vector(front) - Vector(back)).normalized()
                lip.append(tuple(Vector(front) + direction * .105))
            for a, b in zip(lip, lip[1:]):
                shell.panel("shell_balustrades", "blue", a, b, -.12, .22, .115)
                shell.panel("shell_balustrades", "glass", a, b, .22, .72, .045)
                shell.panel("shell_balustrades", "steel", a, b, .72, .77, .075)


def box_supports(shell, banks, edge_x):
    for bank in banks:
        if bank["level"] != "包廂":
            continue
        rows = bank["rows"]
        footprint = [point for row in rows for point in row["front"] + row["back"]]
        side_idx = 0 if sum(x for x, _, _ in footprint) < 0 else 1
        outer_x = edge_x[side_idx]
        # A side-box cantilever transfers load to an outboard pier. Its
        # underside stays above the lower stalls and avoids their access aisle.
        side = -1 if side_idx == 0 else 1
        first_y = min(row["y"] for row in rows)
        start = min(z for _, _, z in footprint)
        end = max(z for _, _, z in footprint)
        inner_x = min(x for x, _, _ in footprint) if side > 0 else max(x for x, _, _ in footprint)
        beam_inner = inner_x + side * .48
        pier_x = outer_x - side * .32
        z_limits = (start+.36,end-.35)
        shell.box("shell_bowl_mass_side","concrete",sorted((pier_x-side*.35,pier_x+side*.26)),(-1.49,first_y-.48),z_limits)
        for z in (start+.68,end-.65):
            plan = [(x,z+dz) for x,dz in ((beam_inner,-.37),(pier_x,-.56),(pier_x,.56),(beam_inner,.37))]
            shell.slab(
                "shell_bowl_mass_side", "blue",
                [(x,first_y-.48,d) for x,d in plan],
                [(x,first_y-(1.6 if x==pier_x else .70),d) for x,d in plan],
            )
        shell.box("shell_bowl_mass_side","blue",sorted((beam_inner,pier_x)),(first_y-.58,first_y-.14),z_limits)


def floor_and_portal(shell, stage, pit_rows, edge_x, edge_z):
    stage_left, stage_right = [stage["x"] + side * stage["w"] / 2 for side in (-1, 1)]
    stage_rear, stage_front = [stage["z"] + side * stage["d"] / 2 for side in (-1, 1)]
    stage_base = stage.get("base", 0)
    pit_left = min(p[0] for row in pit_rows for p in row["front"]) - .34
    pit_right = max(p[0] for row in pit_rows for p in row["front"]) + .34
    pit_edge = max(p[2] for row in pit_rows for p in row["back"])
    pit_base = min(row["y"] for row in pit_rows) - .46
    floor_end = edge_z + 2.45

    shell.box("shell_field_floor", "foundation", edge_x, (pit_base - .65, pit_base-.026), (stage_rear - 1.2, floor_end))
    shell.box("shell_field_floor", "stage", (stage_left, stage_right), (pit_base, stage_base), (stage_rear, stage_front))
    shell.box("shell_field_floor", "navy", (pit_left, pit_right), (pit_base, pit_base + .017), (stage_front, pit_edge))
    for side in (-1, 1):
        stage_outer = edge_x[0] if side < 0 else edge_x[1]
        stage_edge = stage_left if side < 0 else stage_right
        pit_edge_x = pit_left if side < 0 else pit_right
        shell.box("shell_field_floor", "stage_light", sorted((stage_outer, stage_edge)), (pit_base, stage_base - .04), (stage_rear, stage_front))
        shell.box("shell_field_floor", "concrete", sorted((stage_outer, pit_edge_x)), (pit_base, stage_base - .13), (stage_front, pit_edge))
        shell.box("shell_field_floor", "foundation", sorted((stage_outer, pit_edge_x)), (stage_base - .18, stage_base - .10), (pit_edge+.03, floor_end))
        # The columns are outside the full official 20 m opening and above
        # the stage platform's support, with the pit itself open.
        post = (stage_edge + side * .27, stage_edge + side * 1.22)
        shell.box("shell_bowl_mass_proscenium", "navy", sorted(post), (stage_base-.04, 9.6), (stage_front-.80, stage_front-.26))
        shell.box("shell_bowl_mass_proscenium", "baffle", sorted((post[0], post[0]+side*.13)), (.05, 9.53), (stage_front-.24, stage_front-.13))
        for offset in (0.0, .19, .38, .57):
            rib = post[1] + side * (offset + .12)
            shell.box("shell_bowl_mass_proscenium", "blue", sorted((rib, rib+side*.11)), (.22, 8.93), (stage_front-.88, stage_front+.1))
    shell.box("shell_bowl_mass_proscenium", "navy", (stage_left-1.22, stage_right+1.22), (9.13,9.81), (stage_front-.80,stage_front-.26))
    shell.box("shell_bowl_mass_proscenium", "baffle", (stage_left-1.16, stage_right+1.16), (9.15,9.26), (stage_front-.24,stage_front-.13))


def auditorium_envelope(shell, edge_x, roof_profile, rear_z, top_seat):
    rear_wall_top = top_seat + 2.93
    rear_landing = top_seat - .12
    foundation = -1.49
    # Side walls acquire height along the asymmetric tiered section. Low relief
    # folded panels stay outboard of all seating, including the two side boxes.
    portal_z = roof_profile[0][0]
    for side, outer_x in zip((-1,1),edge_x):
        inside_x = outer_x - side * .62
        panels = side_profile(portal_z, rear_z, rear_wall_top)
        for (za, ya), (zb, yb) in zip(panels, panels[1:]):
            floor_outline = [(x, foundation, z) for x, z in ((inside_x,za),(outer_x,za),(outer_x,zb),(inside_x,zb))]
            shell.slab("shell_bowl_mass_side", "concrete", [(x, ya if z == za else yb, z) for x, _, z in floor_outline], floor_outline)
            for step in range(7):
                t0, t1 = (step+.025)/7, (step+.975)/7
                z0, z1 = (za+(zb-za)*t for t in (t0,t1))
                y0, y1 = (ya+(yb-ya)*t-.085 for t in (t0,t1))
                outside = outer_x + side*.08
                shell.panel("shell_bowl_mass_side_panels", "cladding" if step % 3 else "seam", (outside,y0,z0),(outside,y1,z1),0,.06,.055)
                shell.panel("shell_bowl_mass_side_panels", "cladding", (outside,foundation+.025,z0),(outside,foundation+.025,z1),0,.23,.06)
                end_x = inside_x - side*.014
                shell.panel("shell_ribbon_led", "amber", (end_x,y0,z0),(end_x,y1,z1),-.19,-.165,.02)

    edges = [edge_x[0], edge_x[0]+4.1, edge_x[0]+5.96, edge_x[1]-6.45, edge_x[1]-4.59, edge_x[1]]
    door_top = rear_landing + 2.32
    for index, (left, right) in enumerate(zip(edges, edges[1:])):
        shell.box("shell_bowl_mass_back", "concrete", (left,right), (foundation, rear_landing), (rear_z-.39,rear_z+.35))
        if index in (1,3):
            shell.box("shell_bowl_mass_back", "concrete", (left,right), (door_top,rear_wall_top),(rear_z-.39,rear_z+.35))
            shell.box("shell_vomitories", "navy", (left+.05, right-.05), (rear_landing, door_top), (rear_z+.17,rear_z+.32))
            for x in (left+.07,right-.07):
                shell.box("shell_vomitories", "steel", (x-.035,x+.035), (rear_landing,door_top),(rear_z-.45,rear_z-.39))
            shell.box("shell_vomitories", "steel", (left+.04,right-.04), (door_top-.05,door_top+.04),(rear_z-.45,rear_z-.39))
            shell.box("shell_ribbon_led", "amber", ((left+right)/2-.27,(left+right)/2+.27),(door_top+.13,door_top+.21),(rear_z-.435,rear_z-.395))
        else:
            shell.box("shell_bowl_mass_back", "concrete", (left,right), (rear_landing,rear_wall_top),(rear_z-.39,rear_z+.35))

    # A real solid return closes the bottom behind the upper backs. Keep the
    # platform strictly beyond the runtime's last tread and chair envelopes.
    shell.box("shell_bowl_mass_back", "blue", (edge_x[0]+.63, edge_x[1]-.63), (rear_landing-.48,rear_landing), (rear_z-1.43,rear_z-.39))
    for i in range(28):
        x0 = edge_x[0]+.22+i*(edge_x[1]-edge_x[0]-.44)/28
        x1 = x0+(edge_x[1]-edge_x[0]-.44)/28-.035
        shell.box("shell_bowl_mass_back_panels", "cladding" if i%5 else "seam", (x0,x1), (foundation+.085,rear_landing-.25), (rear_z+.36,rear_z+.42))
    shell.box("shell_bowl_mass_back_panels","cladding",edge_x,(rear_landing-.20,rear_landing+.06),(rear_z+.359,rear_z+.421))


def side_profile(front_z, rear_z, back_height):
    return [(front_z,.25),(-1.8,.25),(5.1,1.10),(9.8,2.35),(15.9,4.85),(22.3,7.90),(rear_z,back_height)]


def profile_height(profile, z):
    for (za, ya), (zb, yb) in zip(profile,profile[1:]):
        if z <= zb:
            return ya + (yb-ya)*(z-za)/(zb-za)
    return profile[-1][1]


def canopy(shell, profile, edge_x, rear_z, top_seat):
    # A zinc-clad asymmetric volume caps the auditorium. A higher, independent
    # upstage fly tower is visually legible without recreating the rest of TPAC.
    for (za, left_a, crown_a, right_a), (zb, left_b, crown_b, right_b) in zip(profile, profile[1:]):
        xs = [edge_x[0]-.22, edge_x[0]*.62, 2.1, edge_x[1]*.68, edge_x[1]+.28]
        ya = [left_a, left_a+(crown_a-left_a)*.64, crown_a, right_a+(crown_a-right_a)*.53, right_a]
        yb = [left_b, left_b+(crown_b-left_b)*.64, crown_b, right_b+(crown_b-right_b)*.53, right_b]
        for i in range(len(xs)-1):
            top = [(xs[i],ya[i],za), (xs[i+1],ya[i+1],za), (xs[i+1],yb[i+1],zb), (xs[i],yb[i],zb)]
            shell.slab("shell_roof_canopy", "roof", top, [(x,y-.48,z) for x,y,z in top])
            for j in range(6):
                t = (j + .5) / 6
                x = xs[i] + (xs[i+1]-xs[i])*t
                a = (x,ya[i]+(ya[i+1]-ya[i])*t,za)
                b = (x,yb[i]+(yb[i+1]-yb[i])*t,zb)
                shell.panel("shell_roof_canopy_standing_seams","roof_panels",a,b,.013,.076,.054)
        # The exposed fold has a shallow catwalk/truss below the canopy.
        for i in range(len(xs)-1):
            b = (xs[i+1],yb[i+1],zb-.24)
            a = (xs[i],yb[i],zb-.24)
            shell.panel("shell_roof_truss","steel",a,b,-1.04,-.44,.24)

    lower = side_profile(profile[0][0], rear_z, top_seat+2.93)
    for side, x in zip((-1,1),edge_x):
        roof = [(row[0], row[1 if side < 0 else 3]) for row in profile]
        stations = sorted(set(z for z, _ in lower + roof))
        for za, zb in zip(stations, stations[1:]):
            plan = ((x-.15*side,za),(x+.22*side,za),(x+.22*side,zb),(x-.15*side,zb))
            shell.slab(
                "shell_roof_canopy_upper_walls","roof_panels",
                [(wx,profile_height(roof,z)-.15,z) for wx,z in plan],
                [(wx,profile_height(lower,z)-.07,z) for wx,z in plan],
            )

    for (z,left,crown,right), lower_y, end_z in (
        (profile[0],-1.45,profile[0][0]+.30),
        (profile[-1],top_seat+2.86,rear_z+.37),
    ):
        xs = [edge_x[0]-.22, edge_x[0]*.62, 2.1, edge_x[1]*.68, edge_x[1]+.28]
        ys = [left,left+(crown-left)*.64,crown,right+(crown-right)*.53,right]
        for i, (x0,x1) in enumerate(zip(xs,xs[1:])):
            plan = ((x0,z),(x1,z),(x1,end_z),(x0,end_z))
            shell.slab("shell_roof_canopy_upper_walls","roof_panels",
                       [(x,ys[i] if x==x0 else ys[i+1],d) for x,d in plan],
                       [(x,lower_y,d) for x,d in plan])
            for seam in range(1,7):
                t = seam / 7
                x = x0 + (x1-x0)*t
                shell.box("shell_roof_canopy_standing_seams","roof_panels",
                          (x-.028,x+.028),(lower_y+.19,ys[i]+(ys[i+1]-ys[i])*t-.63),
                          (min(z,end_z)-.068,min(z,end_z)-.009))


def read_glb(path):
    data = path.read_bytes()
    _, version, size, length, chunk_type = struct.unpack_from("<4sIIII", data)
    if version != 2 or size != len(data) or chunk_type != 0x4E4F534A:
        raise ValueError("Unexpected glTF container")
    doc = json.loads(data[20:20+length])
    accessors = doc["accessors"]
    bounds = {}
    for node in doc["nodes"]:
        if "mesh" not in node:
            continue
        if any(key in node for key in ("matrix", "rotation", "scale", "translation")):
            raise ValueError("Shell mesh coordinates must be exported directly in source space")
        positions = [accessors[p["attributes"]["POSITION"]] for p in doc["meshes"][node["mesh"]]["primitives"]]
        bounds[node["name"]] = {
            "min": [min(a["min"][i] for a in positions) for i in range(3)],
            "max": [max(a["max"][i] for a in positions) for i in range(3)],
        }
    return doc, bounds


def bounds_for(points):
    return {label: [round(fn(p[axis] for p in points),3) for axis in range(3)] for label,fn in (("min",min),("max",max))}


def validate_clearance(shell, records, chair_parts, stage):
    # Test surfaces against the same oriented chair proxies used by the stage
    # clearance code. Oriented corners prevent box-seat yaw from inflating hit
    # envelopes; triangles are checked directly by the BVH.
    sides = ((0,1,3,2),(4,6,7,5),(0,4,5,1),(2,3,7,6),(0,2,6,4),(1,5,7,3))
    chair_vertices, chair_faces = [], []
    chairs = []
    for seat in records:
        x, y, z = seat["p"]
        c, s = math.cos(seat["angle"]), math.sin(seat["angle"])
        for part in chair_parts:
            sx, sy, sz = part["size"]
            cx, cy, cz = part["center"]
            local = [(cx+dx*sx/2,cy+dy*sy/2,cz+dz*sz/2) for dx in (-1,1) for dy in (-1,1) for dz in (-1,1)]
            offset = len(chair_vertices)
            chair_vertices.extend((x+u*seat["width"]*c+w*s, y+v, z-u*seat["width"]*s+w*c) for u,v,w in local)
            chair_faces.extend(tuple(offset+i for i in face) for face in sides)
            chairs.extend([seat["p"]] * len(sides))
    chair_bvh = BVHTree.FromPolygons(chair_vertices, chair_faces)
    base = stage.get("base",0)
    # Inset the test solid to allow contact at the stage underside.
    stage_proxy = Shell()
    stage_proxy.box("stage", "stage",
        (stage["x"]-stage["w"]/2+.001,stage["x"]+stage["w"]/2-.001),
        (base+.001,base+stage["h"]-.001),
        (stage["z"]-stage["d"]/2+.001,stage["z"]+stage["d"]/2-.001))
    stage_bvh = BVHTree.FromPolygons(*stage_proxy.geometry["stage","stage"])
    for (node, material), (vertices, faces) in shell.geometry.items():
        shell_bvh = BVHTree.FromPolygons(vertices, faces)
        hits = shell_bvh.overlap(chair_bvh)
        if hits:
            samples = [chairs[i] for _,i in hits[:3]]
            raise ValueError(f"{node}/{material} crosses chair proxies at {samples}")
        if shell_bvh.overlap(stage_bvh):
            raise ValueError(f"{node}/{material} crosses source stage platform")


def build():
    model = json.loads(subprocess.check_output(
        ["node", "--input-type=module", "-e", READ_MODEL, VENUE_ID], cwd=ROOT, text=True,
    ))
    stages = model["stages"]
    if len(stages) != 1 or stages[0].get("angle",0) or stages[0].get("outline"):
        raise ValueError("The fixed proscenium opening expects the retained axis-aligned platform")
    stage = stages[0]
    seat_bounds = bounds_for([record["p"] for record in model["records"]])
    top_seat = seat_bounds["max"][1]
    edge_x = (seat_bounds["min"][0] - 1.35, seat_bounds["max"][0] + 1.24)
    rear_z = seat_bounds["max"][2] + 2.03
    profile = [
        (stage["z"]-stage["d"]/2-1.2, 20.2, 22.0, 20.8),
        (stage["z"]-stage["d"]*.23, 20.2, 22.0, 20.8),
        (1.1, top_seat+4.96, top_seat+7.32, top_seat+5.52),
        (12.8, top_seat+4.48, top_seat+7.17, top_seat+5.71),
        (23.4, top_seat+4.41, top_seat+6.47, top_seat+5.29),
        (rear_z+.64, top_seat+4.26, top_seat+5.85, top_seat+4.76),
    ]

    shell = Shell()
    seat_supports(shell, model["banks"])
    box_supports(shell, model["banks"], edge_x)
    pit_rows = next(bank["rows"] for bank in model["banks"] if bank["section"] == "樂池")
    floor_and_portal(shell, stage, pit_rows, edge_x, seat_bounds["max"][2])
    auditorium_envelope(shell, edge_x, profile, rear_z, top_seat)
    canopy(shell, profile, edge_x, rear_z, top_seat)
    validate_clearance(shell, model["records"], model["chairParts"], stage)

    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.context.scene.unit_settings.system = "METRIC"
    bpy.context.scene.unit_settings.scale_length = 1
    shell.write()
    path = HERE / "shell.tmp.glb"
    bpy.ops.export_scene.gltf(
        filepath=str(path), export_format="GLB", export_yup=True, export_apply=True,
    )
    gltf, node_bounds = read_glb(path)
    roof_nodes = [node for node in node_bounds if node.startswith("shell_roof_")]
    truss_low = min(node_bounds[node]["min"][1] for node in roof_nodes if node.startswith("shell_roof_truss"))
    if truss_low <= top_seat + 3:
        raise ValueError(f"Roof truss altitude {truss_low:.3f} violates {top_seat+3:.3f}m clearance")
    primitives = sum(len(mesh["primitives"]) for mesh in gltf["meshes"])
    if path.stat().st_size > 3_000_000 or primitives > 24:
        raise ValueError("Architectural shell is over its mesh budget")

    manifest = {
        "venueId": VENUE_ID,
        "generator": "blender-bpy",
        "version": 1,
        "bounds": bounds_for([point for bounds in node_bounds.values() for point in bounds.values()]),
        "coordinateBasis": "source-model-xyz",
        "lightingPreset": "theatre-warm",
        "roofNodeNames": roof_nodes,
        "ribbonNodeNames": [node for node in node_bounds if node.startswith("shell_ribbon_led")],
        "calibration": {
            "layout": "end",
            "sourceModelAssetSha256": model["assetHash"],
            "sourceModelSeats": len(model["records"]),
            "seatBounds": seat_bounds,
            "stageRect": stage,
            "orchestraPitFirstRowY": min(row["y"] for row in pit_rows),
            "lowestRoofTrussY": round(truss_low,3),
            "roofTrussClearanceAboveHighestSeat": round(truss_low-top_seat,3),
            "shellMeshPrimitives": primitives,
        },
        "provenance": {
            "geometryPrecision": "illustrative",
            "coordinateCalibration": "Aligned to retained model coordinates. Physical as-built dimensions have not been independently established.",
            "references": [
                {"url": model["source"], "scope": "Retained StagePeek reference-model chair and stage placement"},
                {"url": "https://space.tpac-taipei.org/storage/manager/%E6%8A%80%E8%A1%93%E8%B3%87%E6%96%99/Technical_Information/GT/TPACGrandTheatreTechnicalInformation_20260310.pdf",
                 "scope": "Auditorium section, orchestra lift, adjustable stage opening and black stage surface"},
                {"url": "https://www.oma.com/projects/taipei-performing-arts-center", "scope": "Asymmetric theatre volume and steel cladding concept"},
                {"url": "https://tpac.org.taipei/en/venue-color", "scope": "Blue palette for interior acoustic panels"},
            ],
            "assetOrigin": "Original procedural mesh. No external photographs, textures, or 3D models are packaged. Other TPAC venues and production-specific stage settings are outside the model.",
        },
    }
    path.replace(HERE / "shell.glb")
    (HERE / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    build()
