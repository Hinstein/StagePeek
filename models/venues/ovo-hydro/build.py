"""Build the original OVO Hydro shell in the estimated Hydro viewer frame.

blender --background --python-exit-code 1 --python models/venues/ovo-hydro/build.py
"""
import json
import math
from pathlib import Path
import struct
import subprocess

import bpy
from mathutils import Vector


HERE = Path(__file__).resolve().parent
VENUE = "ovo-hydro"
PROFILE = json.loads(subprocess.check_output([
    "node", HERE.parents[2] / "scripts/probe-venue-bounds.mjs", VENUE
]))
LAYOUT = PROFILE["layouts"]["default"]
SEGMENTS = 96
ANGLES = [math.tau * i / SEGMENTS for i in range(SEGMENTS + 1)]
BATCHES = []


class Mesh:
    def __init__(self, name, surface, color, roughness=.68, metal=0, emission=0, alpha=1, outward_only=False, **extras):
        self.name = name
        self.points = []
        self.faces = []
        self.extras = extras
        self.smooth = False
        material = bpy.data.materials.new(surface)
        material.diffuse_color = (*color, alpha)
        shader = material.node_tree.nodes["Principled BSDF"]
        shader.inputs["Base Color"].default_value = (*color, 1)
        shader.inputs["Roughness"].default_value = roughness
        shader.inputs["Metallic"].default_value = metal
        shader.inputs["Emission Color"].default_value = (*color, 1)
        shader.inputs["Emission Strength"].default_value = emission
        shader.inputs["Alpha"].default_value = alpha
        material.use_backface_culling = outward_only
        self.material = material
        BATCHES.append(self)

    def patch(self, points, faces=None):
        offset = len(self.points)
        self.points.extend(points)
        self.faces.extend(tuple(offset + i for i in face) for face in
                          (faces or [tuple(range(len(points)))]))

    def band(self, a, b):
        for p, q, r, s in zip(a, a[1:], b[1:], b):
            self.patch([p, q, r, s])

    def bar(self, start, end, width, depth=None):
        a, b = Vector(start), Vector(end)
        axis = (b - a).normalized()
        ref = Vector((0, 1, 0)) if abs(axis.y) < .96 else Vector((1, 0, 0))
        u = axis.cross(ref).normalized() * (width / 2)
        v = u.normalized().cross(axis) * ((depth or width) / 2)
        self.patch([tuple(p + x * u + y * v) for p in (a, b)
                    for x, y in ((-1, -1), (-1, 1), (1, 1), (1, -1))],
                   [(0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)])

    def rail(self, path, width, depth=None):
        for start, end in zip(path, path[1:]):
            self.bar(start, end, width, depth)


def ellipse(angle, rx, rz, y):
    return rx * math.cos(angle), y, rz * math.sin(angle)


def ring(rx, rz, y, arc=ANGLES):
    return [ellipse(t, rx, rz, y) for t in arc]


def roof_point(t, radius=1, offset=0):
    # The higher eave faces the Clyde. The shallow crown follows that inclined plane.
    y = 33.7 + 7.6 * radius * math.sin(t) + 12.6 * (1 - radius * radius) + offset
    return ellipse(t, 84.0 * radius, 81.6 * radius, y)


def roof():
    canopy = Mesh("shell_roof_canopy_aluminium", "Standing-seam silver aluminium", (.34, .39, .43), .48, .47,
                  unshadowed=True)
    canopy.smooth = True
    rings = 16
    vertices = [roof_point(0, 0)] + [roof_point(t, r / rings)
                                      for r in range(1, rings + 1) for t in ANGLES[:-1]]
    faces = [(0, 1 + (i + 1) % SEGMENTS, 1 + i) for i in range(SEGMENTS)]
    for r in range(rings - 1):
        start = 1 + r * SEGMENTS
        for i in range(SEGMENTS):
            a, b = start + i, start + (i + 1) % SEGMENTS
            faces.append((a, b, b + SEGMENTS, a + SEGMENTS))
    canopy.patch(vertices, faces)

    eave = Mesh("shell_roof_truss_eave_beam", "Bronze graphite fascia", (.13, .145, .163), .52, .50)
    eave.band([roof_point(t, offset=-1.1) for t in ANGLES],
              [roof_point(t, offset=.03) for t in ANGLES])
    inner = Mesh("shell_roof_truss_rim_steel", "Pale compression ring", (.54, .52, .46), .47, .36)
    inner.rail([roof_point(t, .972, -1.34) for t in ANGLES], .84, .52)
    lattice = Mesh("shell_roof_truss_diagonal_lattice", "Silver space-frame steel", (.46, .51, .54), .50, .38)
    rings = [.13, .25, .37, .49, .61, .73, .85, .97]
    divisions = 32
    for j, radius in enumerate(rings):
        chord = [roof_point(math.tau * (i + (j % 2) / 2) / divisions, radius, -1.50)
                 for i in range(divisions + 1)]
        lattice.rail(chord, .28)
        if j == len(rings) - 1:
            continue
        for i, a in enumerate(chord[:-1]):
            for step in (-.5, .5):
                t = math.tau * (i + (j % 2) / 2 + step) / divisions
                lattice.bar(a, roof_point(t, rings[j + 1], -1.50), .25)
        for i in range(0, divisions, 2):
            t = math.tau * (i + (j % 2) / 2) / divisions
            lattice.bar(chord[i], roof_point(t, radius, -.26), .22)
    rig = Mesh("shell_roof_truss_central_lighting_ring", "Aviation grey house rig", (.27, .30, .32), .48, .36)
    rig.rail([roof_point(t, .20, -3.01) for t in ANGLES[::3]], .43)
    for t in ANGLES[:-1:6]:
        rig.bar(roof_point(t, .20, -3.01), roof_point(t, .25, -1.40), .28)


def exterior():
    apron = Mesh("shell_field_floor_forecourt", "Granite forecourt", (.195, .186, .174), unshadowed=True)
    apron.band(ring(75, 75, -.35), ring(92, 89, -.35))
    kerb = Mesh("shell_bowl_mass_forecourt_edge", "Concrete forecourt edge", (.23, .220, .204))
    kerb.band(ring(92, 89, -.68), ring(92, 89, -.35))

    # The public entrance and metal eave are exterior architecture. The existing
    # Hydro model remains responsible for treads, aisles and every chair.
    base = Mesh("shell_bowl_mass_concrete_podium", "Dark precast concrete base", (.145, .150, .16))
    base.band(ring(77.5, 74.5, -.35), ring(77.5, 74.5, 2.0))
    base.band(ring(77.5, 74.5, 2.0), ring(76.8, 74.1, 2.6))
    glass = Mesh("shell_bowl_mass_concourse_glazing", "Deep entrance glazing", (.049, .066, .083), .37, .22)
    glass.band(ring(76.8, 74.1, 2.6), ring(77.9, 75.2, 6.24))
    wall = Mesh("shell_bowl_mass_terrace_back", "Acoustic charcoal concrete", (.071, .077, .092), .88)
    top = [ellipse(t, 75.4, 75.1, 17.0 - 6.8 * math.sin(t)) for t in ANGLES]
    wall.band(ring(75.4, 75.1, -.35), top)
    cap = Mesh("shell_balustrades_terrace_rim", "Folded bronze-gray coping", (.32, .30, .267), .55, .29)
    cap.rail(top, .28, .23)
    skirt = Mesh("shell_bowl_mass_cushion_supports", "Champagne façade rails", (.23, .187, .143), .52, .4)
    pods = [Mesh(f"shell_bowl_mass_facade_panels_etfe_{i}", f"Translucent ETFE cushions {i}", color,
                 .54, .10, glow, .88, outward_only=True, unshadowed=True)
            for i, (color, glow) in enumerate([
                ((.68, .38, .17), .58), ((.78, .45, .22), .82), ((.56, .28, .125), .48)
            ])]
    frit = Mesh("shell_bowl_mass_facade_panels_frit", "Screen-printed foil dots", (.25, .142, .084), .73, .08, .18,
                outward_only=True, unshadowed=True)

    def panel(t, level, outward=0):
        return ellipse(t, 77.85 + 5.24 * level + outward,
                       75.10 + 5.64 * level + outward,
                       6.22 + (roof_point(t)[1] - 7.35) * level)

    fractions = [0, .165, .335, .506, .669, .833, 1]
    for i, (left, right) in enumerate(zip(ANGLES, ANGLES[1:])):
        middle = (left + right) / 2
        skirt.bar(panel(left, 0), panel(left, 1), .13)
        for j, (low, high) in enumerate(zip(fractions, fractions[1:])):
            skirt.bar(panel(left, low), panel(right, low), .105)
            a, b = left + .0013, right - .0013
            c, d = low + .004, high - .004
            centre_level = (c + d) / 2
            # Each inflated panel has a weld seam and a softly crowned outside.
            points = [panel(a, c), panel(a, d), panel(b, d), panel(b, c),
                      panel(middle, centre_level, .38)]
            glow = .52 + .30 * math.sin(middle) + .26 * math.cos(middle * 4 + j * .21)
            material = pods[1 if glow > .63 else 2 if glow < .36 else 0]
            material.patch(points, [(0, 1, 4), (1, 2, 4), (2, 3, 4), (3, 0, 4)])
            for u in (.25, .5, .75):
                for v in (.23, .5, .77):
                    angle, level = a + (b - a) * u, c + (d - c) * v
                    inflation = .38 * (1 - 2 * max(abs(u - .5), abs(v - .5)))
                    r = inflation + .069
                    frit.patch([panel(angle, level - .027, r), panel(angle - .00145, level, r),
                                panel(angle, level + .027, r), panel(angle + .00145, level, r)])
    skirt.rail([panel(t, 1) for t in ANGLES], .23, .21)

    gates = Mesh("shell_vomitories_entrance_frames", "Glazed entry aluminium", (.34, .305, .24), .48, .24)
    lights = Mesh("shell_ribbon_led_amber_entry", "Warm foyer lights", (.82, .43, .13), .51, 0, 1.25,
                  unshadowed=True)
    for i, (a, b) in enumerate(zip(ANGLES, ANGLES[1:])):
        if i % 2 and math.sin(a) < .69:
            continue
        near, far = a + .009, b - .009
        gates.bar(ellipse(near, 77.7, 74.9, 2.20), ellipse(near, 78.02, 75.47, 6.08), .23)
        gates.bar(ellipse(near, 78.02, 75.47, 6.08), ellipse(far, 78.02, 75.47, 6.08), .27)
        if math.sin(a) > .46:
            lights.bar(ellipse(near, 78.12, 75.53, 5.86), ellipse(far, 78.12, 75.53, 5.86), .13)
    led = Mesh("shell_ribbon_led_concourse", "Soft-amber concourse LED fascia", (.62, .318, .096),
               .55, emission=.7)
    arc = [t for t in ANGLES if t >= math.pi]
    led.band(ring(74.94, 74.94, 20.38, arc), ring(74.94, 74.94, 20.62, arc))


def floor():
    middle = Mesh("shell_field_floor_event_slab", "Dark event-grade concrete", (.109, .120, .139))
    side = Mesh("shell_field_floor_service_slab", "Charcoal concrete outer floor", (.138, .147, .159))
    points = ring(43, 43, -.35)
    for a, b in zip(points[1:], points):
        middle.patch([(0, -.35, 0), a, b])
    side.band(points, ring(75, 75, -.35))


def export():
    for batch in BATCHES:
        mesh = bpy.data.meshes.new(batch.name)
        mesh.from_pydata([(x, -z, y) for x, y, z in batch.points], [], batch.faces)
        mesh.validate()
        mesh.materials.append(batch.material)
        if batch.smooth:
            mesh.polygons.foreach_set("use_smooth", [True] * len(mesh.polygons))
        node = bpy.data.objects.new(batch.name, mesh)
        bpy.context.collection.objects.link(node)
        for key, value in batch.extras.items():
            node[key] = value
    output = HERE / "shell.glb"
    status = bpy.ops.export_scene.gltf(filepath=str(output), export_format="GLB", export_yup=True,
                                      export_apply=True, export_extras=True)
    if "FINISHED" not in status:
        raise RuntimeError("Hydro shell export did not finish")
    data = output.read_bytes()
    magic, version, size, json_size, json_chunk = struct.unpack_from("<4s4I", data)
    if (magic, version, size, json_chunk) != (b"glTF", 2, len(data), 0x4e4f534a) or size > 3_000_000:
        raise ValueError(f"Unexpected Hydro GLB header or size: {size} bytes")
    doc = json.loads(data[20:20 + json_size])
    nodes = [node for node in doc["nodes"] if "mesh" in node]
    if any(set(node) & {"matrix", "translation", "rotation", "scale"} for node in nodes):
        raise ValueError("Export must preserve the baked Hydro display frame")
    positions = [(n["name"], doc["accessors"][p["attributes"]["POSITION"]])
                 for n in nodes for p in doc["meshes"][n["mesh"]]["primitives"]]
    seat_top = LAYOUT["seatBounds"]["max"][1]
    clearance = min(a["min"][1] for n, a in positions if n.startswith("shell_roof_truss")) - seat_top
    if clearance <= 3:
        raise ValueError(f"Hydro roof truss clearance is only {clearance:.3f} m")
    return {
        "bounds": {"min": [round(min(a["min"][i] for _, a in positions), 3) for i in range(3)],
                   "max": [round(max(a["max"][i] for _, a in positions), 3) for i in range(3)]},
        "assetBytes": size,
        "meshPrimitives": len(positions),
        "roofNodeNames": sorted(n["name"] for n in nodes if n["name"].startswith("shell_roof_")),
        "ribbonNodeNames": sorted(n["name"] for n in nodes if n["name"].startswith("shell_ribbon_led")),
        "roofTrussClearanceAboveIllustrativeSeating": round(clearance, 3)
    }


def main():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.context.scene.unit_settings.system = "METRIC"
    if PROFILE["hasSourceSeats"] or PROFILE["metricCalibrated"]:
        raise ValueError("Expected the Hydro's uncalibrated display reconstruction")
    roof()
    exterior()
    floor()
    manifest = {
        "venueId": VENUE,
        "generator": "blender-bpy",
        "version": 1,
        "upAxis": "+Y",
        "units": "meters",
        "coordinateBasis": "hydro-local-v0",
        "precision": "illustrative",
        "sourceSeatsCount": 0,
        "metricCalibrated": False,
        "completeSeatInventory": False,
        "seatBounds": LAYOUT["seatBounds"],
        "lightingPreset": "arena-warm-night",
        "referenceUrls": [
            "https://www.ovohydro.com/Home/About",
            "https://www.arup.com/en-us/projects/sse-hydro-glasgow/",
            "https://www.archilovers.com/projects/100965/the-sse-hydro.html",
            "https://www.novummembranes.com/novum_projects/ovo-hydro/"
        ],
        "notes": [
            "Original interpretation of the inclined aluminium saucer, diagonal steel lattice and glowing, dot-printed ETFE cushions.",
            "Shell proportions fit the uncalibrated existing Hydro preview frame. The model span and heights are illustrative.",
            "The Hydro viewer retains its existing chair renderer and its separate event overlays. The GLB contains no seating inventory, ticket IDs or event objects."
        ],
        **export()
    }
    (HERE / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
