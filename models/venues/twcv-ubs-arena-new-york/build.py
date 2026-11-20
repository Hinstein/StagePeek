"""Build the source-aligned UBS Arena architectural shell with Blender 5.2."""
import json
import math
from pathlib import Path
import struct
import subprocess

import bmesh
import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree


HERE = Path(__file__).resolve().parent
ANCHORS = json.loads(subprocess.check_output(["node", str(HERE / "anchors.mjs")], text=True))
BOX_FACES = [(0, 2, 3, 1), (4, 5, 7, 6), (0, 1, 5, 4),
             (2, 6, 7, 3), (0, 4, 6, 2), (1, 3, 7, 5)]
PRISM_FACES = [(0, 1, 2, 3), (7, 6, 5, 4), (0, 4, 5, 1),
               (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)]
batches = {}


def material(name, color, roughness, metallic=0, alpha=1, emission=0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, alpha)
    mat.use_backface_culling = True
    shader = mat.node_tree.nodes["Principled BSDF"]
    shader.inputs["Base Color"].default_value = (*color, 1)
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Metallic"].default_value = metallic
    shader.inputs["Alpha"].default_value = alpha
    shader.inputs["Emission Color"].default_value = (*color, 1)
    shader.inputs["Emission Strength"].default_value = emission
    if alpha < 1:
        mat.surface_render_method = "BLENDED"
    return mat


def add(name, mat, points, faces):
    vertices, polygons = batches.setdefault((name, mat), ([], []))
    offset = len(vertices)
    vertices.extend(points)
    polygons.extend(tuple(offset + i for i in face) for face in faces)


def box_points(center, size, angle=0):
    x, y, z = center
    w, h, d = (n / 2 for n in size)
    c, s = math.cos(angle), math.sin(angle)
    return [(x + dx * c + dz * s, y + dy, z - dx * s + dz * c)
            for dy in (-h, h) for dx in (-w, w) for dz in (-d, d)]


def box(name, mat, center, size, angle=0):
    add(name, mat, box_points(center, size, angle), BOX_FACES)


def bar_points(a, b, width, depth=None):
    a, b = Vector(a), Vector(b)
    axis = (b - a).normalized()
    guide = Vector((0, 1, 0)) if abs(axis.y) < .92 else Vector((0, 0, 1))
    horizontal = axis.cross(guide).normalized()
    right = horizontal * (width / 2)
    across = horizontal.cross(axis) * ((depth or width) / 2)
    return [tuple(p + sx * right + sy * across) for p in (a, b)
            for sx in (-1, 1) for sy in (-1, 1)]


def bar(name, mat, a, b, width, depth=None):
    add(name, mat, bar_points(a, b, width, depth), BOX_FACES)


def wall_strip(name, mat, rings, close=True):
    count = len(rings[0])
    segments = count if close else count - 1
    faces = [(offset + i, offset + (i + 1) % count,
              offset + count + (i + 1) % count, offset + count + i)
             for offset in range(0, count * (len(rings) - 1), count)
             for i in range(segments)]
    add(name, mat, [p for ring in rings for p in ring], faces)


OUTLINE = [(58, -77), (66, -69), (66, 69), (58, 77),
           (-58, 77), (-66, 69), (-66, -69), (-58, -77)]


def ring(y, inset=0):
    return [(x * (1-inset/66), y, z * (1-inset/77)) for x, z in OUTLINE]


def band(name, mat, bottom, top, inset, thickness):
    wall_strip(name, mat, [ring(y, i) for y, i in [(bottom, inset), (top, inset),
               (top, inset + thickness), (bottom, inset + thickness), (bottom, inset)]])


def slab(name, mat, bottom, top, inset):
    low, high = ring(bottom, inset), ring(top, inset)
    wall_strip(name, mat, [low, high])
    count = len(low)
    add(name, mat, low + high, [tuple(range(count)), tuple(reversed(range(count, count * 2)))])


def arch(frame, glass, stone, light, x, z, y, width, height, rise):
    # The arch is filled in subdivisions, with narrow metal glazing bars and
    # a masonry archivolt. No third-party asset or graphic enters the mesh.
    half = width / 2
    spring = y + height - rise
    curve = [(x - half*math.cos(a), spring + rise*math.sin(a), z)
             for a in [math.pi*i/12 for i in range(13)]]
    for a, b in zip(curve, curve[1:]):
        add("shell_bowl_mass_arched_windows", glass, [(a[0], y, z), (b[0], y, z), b, a], [(0, 1, 2, 3)])
        bar("shell_bowl_mass_architraves", stone, a, b, .28, .28)
    for i in range(0, 13, 2):
        px, py, _ = curve[i]
        bar("shell_bowl_mass_window_frames", frame, (px, y, z+.10), (px, py, z+.10), .109 if i % 6 else .19)
    for py in [y, y + height * .34, y + height * .60]:
        bar("shell_bowl_mass_window_frames", frame, (x-half, py, z+.10), (x+half, py, z+.10), .11)
    bar("shell_vomitories_static", light, (x-half, y, z+.17), (x+half, y, z+.17), .09)
    return curve


def build_exterior():
    brick = material("Belmont red running-bond brick", (.36, .107, .061), .82)
    clay = material("Dark burgundy brick piers", (.29, .064, .044), .88)
    mortar = material("Mortar accent coursing", (.22, .097, .065), .84)
    limestone = material("Warm limestone cornice", (.61, .47, .33), .67)
    frame = material("Belmont teal painted steel", (.036, .139, .137), .53, .34)
    glass = material("Warm Great Hall glazing", (.29, .31, .23), .28, .14, .58, .34)
    side_glass = material("Muted blue glass strip", (.079, .16, .196), .27, .27, .81, .09)
    amber = material("Warm entrance linear lighting", (.88, .53, .24), .46, emission=.68)
    core = material("Dark precast concrete", (.087, .104, .126), .87)
    slate = material("Muted charcoal loading doors", (.088, .102, .102), .66, .18)
    zinc = material("Standing seam roof cladding", (.165, .186, .192), .53, .41)
    slab("shell_bowl_mass_plaza", core, -.48, -.235, -4.7)
    band("shell_bowl_mass_enclosure", core, -.17, 30.25, 2.35, .42)
    band("shell_bowl_mass_plinth", core, -.28, 1.26, -.06, .59)
    band("shell_bowl_mass_cladding", brick, 1.18, 29.17, .15, .55)
    band("shell_bowl_mass_facade_panels", limestone, 29.15, 29.70, -.61, 1.14)
    band("shell_bowl_mass_facade_panels", zinc, 29.68, 32.15, .13, 1.29)
    for y in (4.38, 10.58, 16.86, 23.08, 27.68):
        band("shell_bowl_mass_facade_panels", limestone, y, y+.143, -.17, .33)
    for i in range(1, 30, 2):
        y = 1.40 + i * .91
        band("shell_bowl_mass_mortar_lines", mortar, y, y+.039, .056, .13)
    # A south-facing Great Hall projection is framed by two stepped brick
    # towers and a series of arched steel-and-glass openings.
    for sign in (-1, 1):
        box("shell_bowl_mass_cladding", clay, (sign*48.8, 15.14, 78.55), (12.5, 30.48, 10.2))
        for y, h, w, d in [(26.72, .48, 13.15, 10.65), (30.55, .42, 13.07, 10.59),
                            (31.36, .28, 11.98, 9.80), (32.38, .35, 10.1, 8.70)]:
            box("shell_bowl_mass_architraves", limestone, (sign*48.8, y, 78.55), (w, h, d))
        box("shell_bowl_mass_cladding", brick, (sign*48.8, 31.1, 78.55), (10.87, 2.58, 9.09))
        arch(frame, glass, limestone, amber, sign*48.8, 83.73, 12.65, 6.24, 9.73, 2.05)
        box("shell_bowl_mass_window_frames", frame, (sign*48.8, 25.98, 83.79), (6.55, .81, .28))
        for x in (-2.7, 0, 2.7):
            box("shell_bowl_mass_facade_small_glass", side_glass, (sign*48.8+x, 4.87, 83.78), (1.50, 4.24, .12))
    for x in range(-42, 43, 12):
        box("shell_bowl_mass_cladding", brick, (x, 11.18, 79.59), (2.2, 21.99, 5.64))
        box("shell_bowl_mass_architraves", limestone, (x, 21.62, 80.40), (2.78, .57, 4.79))
        box("shell_bowl_mass_architraves", limestone, (x, 1.03, 80.45), (2.68, 1.48, 4.68))
    for x in range(-36, 37, 12):
        curve = arch(frame, glass, limestone, amber, x, 81.70, 5.69, 9.76, 14.10, 3.08)
        for a, b in zip(curve, curve[1:]):
            add("shell_bowl_mass_cladding", brick, [a, b, (b[0], 21.58, b[2]), (a[0], 21.58, a[2])], [(0, 1, 2, 3)])
        for offset in (-3.29, 0, 3.29):
            box("shell_bowl_mass_window_frames", frame, (x+offset, 2.76, 81.86), (3.14, 5.08, .64))
            box("shell_bowl_mass_facade_small_glass", glass, (x+offset, 2.94, 82.19), (2.85, 4.45, .12))
        box("shell_bowl_mass_window_frames", frame, (x, 22.11, 81.42), (5.02, 1.56, .25))
        box("shell_bowl_mass_facade_small_glass", side_glass, (x, 22.11, 81.58), (4.68, 1.23, .12))
    box("shell_bowl_mass_architraves", limestone, (0, 23.37, 80.85), (85, .74, 3.62))
    box("shell_bowl_mass_architraves", limestone, (0, 28.25, 79.56), (86, .68, 2.84))
    box("shell_bowl_mass_cladding", clay, (0, 25.88, 79.13), (86, 4.66, 2.30))
    box("shell_bowl_mass_window_frames", frame, (0, 5.74, 83.89), (86.8, .46, 5.28))
    for x in range(-42, 43, 12):
        bar("shell_bowl_mass_window_frames", frame, (x, 5.59, 86.23), (x, 8.42, 81.76), .132)
        box("shell_bowl_mass_window_frames", frame, (x, 2.69, 85.73), (.183, 5.41, .183))
    box("shell_vomitories_static", amber, (0, 5.42, 85.92), (84.9, .10, .13))
    # Smaller recessed glazed bays continue along the brick side elevations.
    for sign in (-1, 1):
        for z in range(-61, 63, 12):
            box("shell_bowl_mass_cladding", clay, (sign*66.15, 14.90, z), (.67, 27.90, .79))
            box("shell_bowl_mass_window_frames", frame, (sign*66.15, 15.7, z+5.1), (.34, 12.37, 6.3))
            for i in range(3):
                box("shell_bowl_mass_facade_small_glass", side_glass, (sign*66.37, 15.7, z+3.25+1.86*i), (.15, 11.86, 1.63))
            box("shell_bowl_mass_architraves", limestone, (sign*66.33, 9.28, z+5.1), (.55, .30, 6.75))
            if z < -18:
                box("shell_bowl_mass_loading_doors", slate, (sign*66.16, 2.55, z+4.9), (.34, 4.68, 5.77))
    return core, zinc


def source_volumes():
    vertices, faces = [], []
    for seat in ANCHORS["seats"]:
        x, y, z = seat["p"]
        width, angle = seat["width"], seat["angle"]
        c, s = math.cos(angle), math.sin(angle)
        for part in ANCHORS["chairParts"]:
            a, b, d = part["center"]
            w, h, l = part["size"]
            center = (x + a*width*c + d*s, y+b, z-a*width*s+d*c)
            faces.extend(tuple(len(vertices)+i for i in face) for face in BOX_FACES)
            vertices.extend(box_points(center, (w*width, h, l), angle))
    chairs = BVHTree.FromPolygons(vertices, faces)
    vertices, faces = [], []
    for tread in ANCHORS["aisles"]:
        faces.extend(tuple(len(vertices)+i for i in face) for face in PRISM_FACES)
        vertices.extend((x,y+h,z) for h in (.025, 2.125) for x,y,z in tread)
    aisle = BVHTree.FromPolygons(vertices, faces)
    stages = [BVHTree.FromPolygons(box_points(part["center"],part["size"],part.get("angle",0)),BOX_FACES)
              for part in ANCHORS["stages"]]
    return {"chairs":[chairs], "aisles":[aisle], "stage":stages}


def clear(points, faces, volumes):
    mesh = BVHTree.FromPolygons(points, faces)
    return not any(mesh.overlap(volume) for group in volumes.values() for volume in group)


def offset(point, distance, y):
    x, _, z = point
    scale = 1 + distance / math.hypot(x, z)
    return (x*scale, y, z*scale)


def at_height(p, y):
    return (p[0], y, p[2])


def boundary(p, y):
    # Convex clipped rectangle. The eight half planes are the actual facade
    # contour, shrunken to the back of the exterior wall.
    x, _, z = p
    edges = ring(0, 2.61)
    limits = []
    for a,b in zip(edges,edges[1:]+edges[:1]):
        dx, dz = b[0]-a[0], b[2]-a[2]
        direction = dz*x-dx*z
        if direction > 0:
            limits.append((dz*a[0]-dx*a[2])/direction)
    scale = min(limits)
    return (x*scale, y, z*scale)


def build_bowl(concrete, volumes):
    rail = material("Satin steel rail caps", (.244,.306,.384), .43, .46)
    glazing = material("Low-tint gallery glazing", (.067,.176,.233), .22, .12,.27)
    glazing.use_backface_culling = False
    glass = material("Blue-grey suite glazing", (.113,.208,.248), .22, .19,.62)
    glass.use_backface_culling = False
    smoke = material("Charcoal suite recess", (.056,.071,.084), .72)
    wallpaper = material("Warm maple suite backing", (.244,.147,.085), .79, emission=.15)
    amber = material("Concourses and suite accent lighting", (.82,.48,.21), .40, emission=.77)
    ribbon_low = material("Lower LED ribbon cobalt", (.059,.212,.49), .44, emission=.92)
    ribbon_high = material("Upper LED ribbon ice blue", (.061,.266,.54), .42, emission=.91)
    ribbon_low.use_backface_culling = False
    ribbon_high.use_backface_culling = False
    floor = material("Concert charcoal composite floor", (.077,.087,.098), .77)
    slab("shell_field_floor", floor, -.22, -.074, 2.1)

    counts = {"supports":0,"balustrades":0,"suiteBays":0,"upperLandings":0}
    for bank in ANCHORS["banks"]:
        level, rows = bank["level"], bank["rows"]
        first, last = rows[0]["front"], rows[-1]["back"]
        for i in range(0,len(rows),4):
            front, back = rows[i]["front"], rows[min(i+3,len(rows)-1)]["back"]
            y = front[0][1]-.136
            bottom = -.13 if level=="L" else max(front[0][1]-2.14, rows[0]["front"][0][1]-1.18)
            for j in range(0,len(front)-1,5):
                k = min(j+5,len(front)-1)
                top = [at_height(p,y) for p in (front[j],front[k],back[k],back[j])]
                # Keep the support out of the coplanar runtime bank sidewall.
                centre = sum((Vector(p) for p in top), Vector((0,0,0)))/4
                top = [tuple(Vector(p).lerp(centre,.026)) for p in top]
                points = [at_height(p,bottom) for p in top]+top
                if clear(points,PRISM_FACES,volumes):
                    add("shell_bowl_mass_terrace_supports",concrete,points,PRISM_FACES)
                    counts["supports"]+=1
        if level=="L":
            continue
        for j in range(0,len(first)-1,2):
            a,b = first[j],first[min(j+2,len(first)-1)]
            low = [offset(p,-.16,p[1]+.033) for p in (a,b)]
            top = [at_height(p,p[1]+.76) for p in low]
            frame = bar_points(*top,.055)
            quad = low+top[::-1]
            if clear(quad,[(0,1,2,3)],volumes) and clear(frame,BOX_FACES,volumes):
                add("shell_balustrades_glass",glazing,quad,[(0,1,2,3)])
                add("shell_balustrades_rail",rail,frame,BOX_FACES)
                counts["balustrades"]+=1
        # Independent LED runs at the two elevated levels follow the front-row
        # terraces. The suite bank is set back from the lower LED housing.
        for j in range(0,len(first)-1,4):
            a,b = first[j],first[min(j+4,len(first)-1)]
            y = a[1]-.42
            path = [offset(p,-.71,y) for p in (a,b)]
            quad = [at_height(p,t) for t in (y-.28,y+.19) for p in path]
            support = bar_points(*(offset(p,-.29,y-.049) for p in (a,b)),.64,.34)
            if clear(quad,[(0,1,3,2)],volumes) and clear(support,BOX_FACES,volumes):
                add("shell_ribbon_led_lower" if level=="U" else "shell_ribbon_led_upper",
                    ribbon_low if level=="U" else ribbon_high,quad,[(0,3,1),(0,2,3)])
                add("shell_ribbon_led_housing",smoke,support,BOX_FACES)
            if level!="T" or math.dist(a,b)<1.2:
                continue
            low, high = y-2.42,y-.57
            inset = [offset(p,-.16,h) for h in (low,high) for p in (a,b)]
            if not clear(inset,[(0,1,3,2)],volumes):
                continue
            add("shell_bowl_mass_suite_glass",glass,inset,[(0,3,1),(0,2,3)])
            for depth, name, face_mat in [(1.18, "shell_bowl_mass_suite_recess", smoke),
                                          (.95, "shell_bowl_mass_suite_wood", wallpaper)]:
                backing = [offset(p,depth,h) for h in (low,high) for p in (a,b)]
                if clear(backing,[(0,1,3,2)],volumes):
                    add(name,face_mat,backing,[(0,3,1),(0,2,3)])
            for p,q,thickness in [(inset[0],inset[1],.082),(inset[2],inset[3],.081),(inset[0],inset[2],.11)]:
                part = bar_points(p,q,thickness)
                if clear(part,BOX_FACES,volumes):
                    add("shell_bowl_mass_suite_frames",rail,part,BOX_FACES)
            lamp = bar_points(*(offset(p,.26,high-.19) for p in (a,b)),.052)
            if clear(lamp,BOX_FACES,volumes):
                add("shell_vomitories_static",amber,lamp,BOX_FACES)
            counts["suiteBays"]+=1
        if level!="T":
            continue
        y = last[0][1]-.14
        for j in range(1,len(last)-2,4):
            a,b = last[j],last[min(j+4,len(last)-2)]
            top = [offset(a,.19,y),offset(b,.19,y),boundary(b,y),boundary(a,y)]
            points = [at_height(p,y-.39) for p in top]+top
            if clear(points, PRISM_FACES, volumes):
                add("shell_bowl_mass_terrace_supports",concrete,points,PRISM_FACES)
                counts["upperLandings"]+=1

    band("shell_bowl_mass_concourse",concrete,6.69,7.05,2.60,2.25)
    band("shell_vomitories_static",amber,7.03,7.109,4.79,.095)
    for sign in (-1,1):
        for z in range(-58,59,14):
            for side in (-1,1):
                box("shell_vomitories",smoke,(sign*62.22,8.61,z+side*1.60),(.89,3.10,.28))
            box("shell_vomitories",smoke,(sign*62.22,10.19,z),(.89,.39,3.5))
            box("shell_vomitories_static",amber,(sign*61.74,10.16,z),(.098,.125,1.19))
    return counts


def build_roof(zinc):
    steel = material("Grey welded roof trusses", (.116,.151,.171),.59,.43)
    baffle = material("Dark ceiling sound absorption baffles", (.066,.081,.095),.94)
    cap = material("Dark ribbed metal rooftop", (.116,.137,.16),.54,.53)
    wall_strip("shell_roof_canopy",zinc,[ring(y,d) for y,d in [(31.84,-.33),(32.29,-.42),(33.49,1.76),(34.24,4.72)]])
    slab("shell_roof_canopy_top",cap,33.45,34.24,4.72)
    band("shell_roof_truss",steel,29.47,31.42,2.79,.44)
    for z in range(-63,64,14):
        for index in range(16):
            a,b=-61+122*index/16,-61+122*(index+1)/16
            bar("shell_roof_truss",steel,(a,30.12,z),(b,30.12,z),.39,.44)
            bar("shell_roof_truss",steel,(a,33.12,z),(b,33.12,z),.39,.44)
            bar("shell_roof_truss",steel,(a,30.12,z),(b,33.12,z),.23)
            bar("shell_roof_truss",steel,(a,30.12,z),(a,33.12,z),.24)
        for x in range(-45,46,15):
            box("shell_roof_canopy_baffles",baffle,(x,30.24,z-3.12),(12.9,.37,4.95))
    for x in range(-53,54,7):
        box("shell_roof_canopy_seams",zinc,(x,34.30,0),(.143,.082,137))
    for x in (-47,47):
        for z in (-32,32):
            box("shell_roof_canopy_ventilation",baffle,(x,34.93,z),(14.1,1.3,20.1))
            for n in range(7):
                box("shell_roof_canopy_ventilation_covers",zinc,(x,35.63,z-7.5+2.5*n),(13.9,.18,1.25))


def write_model(volumes,features):
    for (name,mat),(points,faces) in batches.items():
        geom = BVHTree.FromPolygons(points,faces)
        hit = [kind for kind, solids in volumes.items() if any(geom.overlap(solid) for solid in solids)]
        if hit:
            raise ValueError(f"{name} overlaps {', '.join(hit)}")
        mesh=bpy.data.meshes.new(name)
        mesh.from_pydata([(x,-z,y) for x,y,z in points],[],faces)
        mesh.validate()
        bm=bmesh.new()
        bm.from_mesh(mesh)
        bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces))
        bm.to_mesh(mesh)
        bm.free()
        obj=bpy.data.objects.new(name,mesh)
        bpy.context.collection.objects.link(obj)
        mesh.materials.append(mat)
        if name=="shell_bowl_mass_plaza" or name.startswith("shell_roof_canopy"):
            obj["unshadowed"]=True
    highest=max(c["p"][1] for c in ANCHORS["seats"])
    roof=min(p[1] for (name,_),(points,_) in batches.items() if name.startswith("shell_roof_truss") for p in points)
    clearance=roof-highest
    if clearance<3:
        raise ValueError(f"UBS roof truss clearance is only {clearance:.3f} metres")
    path=HERE/"shell.glb"
    bpy.ops.export_scene.gltf(filepath=str(path),export_format="GLB",export_yup=True,export_apply=True,export_extras=True)
    data=path.read_bytes()
    magic,version,size,length,chunk=struct.unpack_from("<4s4I",data)
    if (magic,version,size,chunk)!=(b"glTF",2,len(data),0x4e4f534a) or len(data)>3_000_000:
        raise ValueError(f"UBS Arena GLB size or format invalid: {len(data)} bytes")
    doc=json.loads(data[20:20+length])
    nodes=[n for n in doc["nodes"] if "mesh" in n]
    if any(set(node).intersection({"matrix","translation","rotation","scale"}) for node in nodes):
        raise ValueError("Shell must retain baked source coordinates")
    positions=[doc["accessors"][p["attributes"]["POSITION"]] for mesh in doc["meshes"] for p in mesh["primitives"]]
    manifest={
        "venueId":HERE.name,"generator":"blender-bpy","version":1,"coordinateSystem":"source-model-xyz",
        "upAxis":"+Y","units":"metres","lightingPreset":"arena-dark",
        "precision":"illustrative architecture, retained source seats",
        "references":["https://jrdv.com/ubs-belmont-arena-and-master-plan/",
                      "https://populous.com/article/populous-serves-as-architect-of-record-for-new-ubs-arena-at-belmont-park",
                      "https://populous.com/article/live-from-populous-designing-for-music"],
        "limitations":["The brick exterior and arched Great Hall glazing are based on architect references. The approach is represented at the positive-Z end of the retained frame.",
                       "The two LED ribbon heights, concourse, suites and acoustic baffles are illustrative. The plan and placement are aligned to the retained geometry rather than measured from a building survey.",
                       "All original seats, ticket identities and event stages come from the viewer. No third-party asset or design media is embedded."],
        "features":features,
        "clearance":{"ubs":{"chairsChecked":len(ANCHORS["seats"]),"aisleTreadsChecked":len(ANCHORS["aisles"]),
                             "aisleHeightChecked":2.1,"stagePartsChecked":len(ANCHORS["stages"]),"seatIntersections":0,
                             "aisleIntersections":0,"stageIntersections":0,"roofTrussClearance":round(clearance,3)}},
        "assetBytes":len(data),"meshPrimitives":len(positions),
        "bounds":{"min":[round(min(a["min"][i] for a in positions),3) for i in range(3)],
                  "max":[round(max(a["max"][i] for a in positions),3) for i in range(3)]},
        "roofNodeNames":sorted(n["name"] for n in nodes if n["name"].startswith("shell_roof_")),
        "ribbonNodeNames":sorted(n["name"] for n in nodes if n["name"].startswith("shell_ribbon_led")),
    }
    (HERE/"manifest.json").write_text(json.dumps(manifest,indent=2)+"\n",encoding="utf-8")


if __name__=="__main__":
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    bpy.context.scene.unit_settings.system="METRIC"
    volumes=source_volumes()
    concrete,zinc=build_exterior()
    features=build_bowl(concrete,volumes)
    build_roof(zinc)
    write_model(volumes,features)
