"""Mesh batching helpers for the Tottenham and Wembley illustrative shells."""
import json
import math
import struct

import bpy
from mathutils import Vector


class Shell:
    def __init__(self):
        bpy.ops.wm.read_factory_settings(use_empty=True)
        bpy.context.scene.unit_settings.system = "METRIC"
        self.parts = {}

    def part(self, name, label, rgb, *, metal=0, roughness=.68, alpha=1, glow=0, unshadowed=False):
        material = bpy.data.materials.new(label)
        material.use_backface_culling = False
        shader = material.node_tree.nodes["Principled BSDF"]
        shader.inputs["Base Color"].default_value = (*rgb, 1)
        shader.inputs["Metallic"].default_value = metal
        shader.inputs["Roughness"].default_value = roughness
        if alpha < 1:
            shader.inputs["Alpha"].default_value = alpha
            material.surface_render_method = "BLENDED"
        if glow:
            shader.inputs["Emission Color"].default_value = (*rgb, 1)
            shader.inputs["Emission Strength"].default_value = glow
        mesh = Batch()
        self.parts[name] = (mesh, material, unshadowed)
        return mesh

    def export(self, directory, notes, references, features):
        for name, (batch, material, unshadowed) in self.parts.items():
            mesh = bpy.data.meshes.new(name)
            mesh.from_pydata([(x, -z, y) for x, y, z in batch.points], [], batch.faces)
            mesh.validate()
            mesh.update()
            obj = bpy.data.objects.new(name, mesh)
            bpy.context.collection.objects.link(obj)
            obj.data.materials.append(material)
            if unshadowed:
                obj["unshadowed"] = True
        path = directory / "shell.glb"
        bpy.ops.export_scene.gltf(filepath=str(path), export_format="GLB",
                                  export_yup=True, export_extras=True)
        data = path.read_bytes()
        magic, version, size, length, chunk = struct.unpack_from("<4s4I", data)
        if (magic, version, size, chunk) != (b"glTF", 2, len(data), 0x4e4f534a) or len(data) > 5_000_000:
            raise ValueError(f"Invalid shell or size budget exceeded: {path}")
        gltf = json.loads(data[20:20 + length])
        bounds = [gltf["accessors"][p["attributes"]["POSITION"]]
                  for mesh in gltf["meshes"] for p in mesh["primitives"]]
        manifest = {
            "venueId": directory.name, "generator": "blender-bpy", "version": 1,
            "units": "metres", "upAxis": "+Y", "coordinateBasis": "estimated-parametric",
            "precision": "illustrative", "sourceSeatsCount": 0,
            "seating": {"precision": "illustrative", "provider": "main-viewer-parametric"},
            "assetBytes": len(data), "meshPrimitives": len(bounds),
            "bounds": {key: [round(fn(p[key][axis] for p in bounds), 3) for axis in range(3)]
                       for key, fn in (("min", min), ("max", max))},
            "roofNodeNames": sorted(k for k in self.parts if k.startswith("shell_roof_")),
            "ribbonNodeNames": sorted(k for k in self.parts if k.startswith("shell_ribbon_led")),
            "references": references, "features": features, "notes": notes,
        }
        (directory / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")


class Batch:
    def __init__(self):
        self.points, self.faces = [], []

    def add(self, points, faces):
        offset = len(self.points)
        self.points.extend(points)
        self.faces.extend(tuple(offset + i for i in face) for face in faces)

    def quad(self, a, b, c, d):
        self.add((a, b, c, d), ((0, 1, 2, 3),))

    def beam(self, start, end, width, depth=None, sides=4):
        a, b = Vector(start), Vector(end)
        axis = (b - a).normalized()
        guide = Vector((0, 1, 0)) if abs(axis.y) < .98 else Vector((1, 0, 0))
        u = axis.cross(guide).normalized() * width / 2
        v = axis.cross(u).normalized() * (depth or width) / 2
        profile = [(math.cos(math.tau * i / sides), math.sin(math.tau * i / sides))
                   for i in range(sides)]
        points = [tuple(p + u * c + v * s) for p in (a, b) for c, s in profile]
        faces = [(i, (i + 1) % sides, (i + 1) % sides + sides, i + sides) for i in range(sides)]
        faces.extend((tuple(reversed(range(sides))), tuple(range(sides, 2 * sides))))
        self.add(points, faces)

    def rect(self, x0, z0, x1, z1, y):
        self.quad((x0, y, z0), (x0, y, z1), (x1, y, z1), (x1, y, z0))


def football_pitch(shell, *, split=False):
    grass = [shell.part(f"shell_field_floor_turf_{i}", "Cut turf", color, roughness=.94)
             for i, color in enumerate(((.042, .20, .058), (.059, .26, .074)))]
    paint = shell.part("shell_field_floor_pitch_lines", "Pale pitch paint", (.69, .78, .68))
    for i in range(14):
        z = -52.5 + 7.5 * i
        grass[i % 2].rect(-34, z, 34, z + 7.5, -.095)

    def line(a, b, width=.15):
        dx, dz = b[0] - a[0], b[1] - a[1]
        scale = width / (2 * math.hypot(dx, dz))
        x, z = -dz * scale, dx * scale
        paint.quad((a[0] + x, -.081, a[1] + z), (b[0] + x, -.081, b[1] + z),
                   (b[0] - x, -.081, b[1] - z), (a[0] - x, -.081, a[1] - z))

    for z in (-52.5, 0, 52.5):
        line((-34, z), (34, z))
    for x in (-34, 34):
        line((x, -52.5), (x, 52.5))
    for end in (-1, 1):
        for x, depth in ((20.16, 16.5), (9.16, 5.5)):
            z = end * (52.5 - depth)
            line((-x, z), (x, z))
            for side in (-x, x):
                line((side, z), (side, end * 52.5))
    for i in range(64):
        a, b = math.tau * i / 64, math.tau * (i + 1) / 64
        line((9.15 * math.cos(a), 9.15 * math.sin(a)), (9.15 * math.cos(b), 9.15 * math.sin(b)))
    if split:
        seams = shell.part("shell_field_floor_pitch_tray_seams", "Retractable turf tray joints", (.043, .14, .053))
        for x in (-34 / 3, 34 / 3):
            seams.rect(x - .045, -52.5, x + .045, 52.5, -.089)
