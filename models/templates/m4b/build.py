"""Build five StagePeek shell profiles from a batch of probed model envelopes."""
import json
import math
from pathlib import Path
import runpy
import sys

from mathutils import Vector
from mathutils.geometry import delaunay_2d_cdt


HERE = Path(__file__).resolve().parent
Shell = runpy.run_path(str(HERE.parent / "stadium-mesh.py"))["Shell"]


def polar_outline(power, steps):
    return [(math.copysign(abs(math.cos(a)) ** power, math.cos(a)),
             math.copysign(abs(math.sin(a)) ** power, math.sin(a)))
            for a in (math.tau * i / steps for i in range(steps))]


def baseball_outline():
    # The home-plate end pinches inward, leaving a broader outfield rim.
    return [(x * (.89 - .13 * z), z) for x, z in polar_outline(.85, 72)]


PROFILES = {
    "oval": lambda: polar_outline(1, 72),
    "rounded": lambda: polar_outline(.58, 64),
    "rectangle": lambda: [(-1, -1), (1, -1), (1, 1), (-1, 1)],
    "fan": lambda: [(-1, -.83), (-.75, -1), (.75, -1), (1, -.83),
                    (.66, .81), (.49, 1), (-.49, 1), (-.66, .81)],
    "baseball": baseball_outline,
}


def color(code):
    srgb = [int(code[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    return tuple(c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4 for c in srgb)


def spans(points):
    return zip(points, points[1:] + points[:1])


def panel(mesh, a, b, low, high):
    mesh.quad((a[0], low, a[1]), (b[0], low, b[1]), (b[0], high, b[1]), (a[0], high, a[1]))


def point(xz, y):
    return (xz[0], y, xz[1])


def fitted_outline(shape, envelope):
    dims = list(zip(*envelope))
    center = tuple((max(axis) + min(axis)) / 2 for axis in dims)
    size = tuple((max(axis) - min(axis)) / 2 for axis in dims)
    offsets = [(x*size[0], z*size[1]) for x, z in PROFILES[shape]()]
    # Fit the polygon edges, not just its X/Z extents, to enclose real corners.
    scale = 1
    for a, b in spans(offsets):
        dx, dz = b[0] - a[0], b[1] - a[1]
        intercept = dz*a[0] - dx*a[1]
        if intercept <= 0:
            raise ValueError(f"{shape} profile must surround its center with CCW edges")
        outer = max(dz*(p[0]-center[0])-dx*(p[1]-center[1]) for p in envelope)
        scale = max(scale, (outer + 1.9*math.hypot(dx, dz)) / intercept)
    perimeter = []
    for a, b in spans(offsets):
        steps = max(1, math.ceil(math.dist(a, b)*scale / 6))
        for j in range(steps):
            perimeter.append(tuple(c + (p+(q-p)*j/steps)*scale for c, p, q in zip(center, a, b)))
    return center, perimeter


def roof_profile(style, center, perimeter, height, size):
    half_x = max(abs(p[0]-center[0]) for p in perimeter)
    half_z = max(abs(p[1]-center[1]) for p in perimeter)
    rise = min(13, max(2.2, size*(.12 if style in ("dome", "vaulted") else .068)))

    def at(p, radius):
        x, z = [c + (v-c)*radius for c, v in zip(center, p)]
        dx, dz = abs(x-center[0])/half_x, abs(z-center[1])/half_z
        if style == "gable":
            delta = max(0, 1-dx)
        elif style == "vaulted":
            delta = max(0, 1-dx*dx) ** .7
        elif style == "acoustic":
            delta = (1-radius)*.36 + max(0, .52-dz)*.35
        elif style == "open-ring":
            delta = max(0, 1-radius)*1.65 + .22*dz*dz
        else:
            delta = max(0, 1-radius*radius) ** .65
        return (x, height + rise*delta, z)

    return at


def roof_surface(part, style, perimeter, at):
    canopy = part("shell_roof_canopy", "Roof cladding", "roof", metal=.26)
    structure = part("shell_roof_truss", "Roof steel", "trim", metal=.29)
    edge = part("shell_roof_canopy_fascia", "Roof edge band", "facade", metal=.24)
    fabric = part("shell_roof_canopy_eaves", "Diffused roof edge", "roof", alpha=.67) if style == "open-ring" else canopy
    aperture = .55 if style == "open-ring" else 0
    rings = (1.015, .90, .78, .65, aperture) if aperture else (1.015, .82, .60, .36, .13, 0)

    for i, (a, b) in enumerate(spans(perimeter)):
        for j, (r, r2) in enumerate(zip(rings, rings[1:])):
            top = [at(a, r), at(b, r), at(b, r2), at(a, r2)]
            skin = fabric if aperture and j == len(rings)-2 else canopy
            if r2:
                skin.quad(*reversed(top))
            else:
                skin.add(top[:3], ((2, 1, 0),))
            if i % 3 == 0:
                beam_start, beam_end = at(a, r), at(a, r2)
                structure.beam((beam_start[0],beam_start[1]-.64,beam_start[2]),
                               (beam_end[0],beam_end[1]-.64,beam_end[2]), .24, .41)
        p, q = at(a, rings[0]), at(b, rings[0])
        edge.quad((p[0],p[1]-.45,p[2]),(q[0],q[1]-.45,q[2]),q,p)
        p, q = at(a, aperture or .36), at(b, aperture or .36)
        structure.beam((p[0],p[1]-.46,p[2]),(q[0],q[1]-.46,q[2]), .24, .38)


def rectangle(x0, z0, x1, z1):
    return [(x0, z0), (x1, z0), (x1, z1), (x0, z1)]


def field_surface(shell, perimeter, floor, mode, dimensions, y):
    # Triangulate the apron, turf and markings in one plane, so they share
    # edges instead of competing for depth in stadium-scale overviews.
    regions = [(floor, perimeter)]
    if mode == "turf":
        x = min(34, dimensions[0] * .24)
        z = min(52.5, dimensions[1] * .30)
        turf = [shell.part(f"shell_field_floor_turf_{i}", "Illustrative grass", rgb, roughness=.94)
                for i, rgb in enumerate(((.058, .177, .069), (.075, .21, .081)))]
        for i in range(12):
            regions.append((turf[i % 2], rectangle(-x, -z + z*i/6, x, -z + z*(i+1)/6)))
        stripe = shell.part("shell_field_floor_paint", "Field paint", (.56, .69, .59))
        for start in (-z, 0, z-.14):
            regions.append((stripe, rectangle(-x, start, x, start+.14)))
        for start in (-x, x-.14):
            regions.append((stripe, rectangle(start, -z+.14, start+.14, z-.14)))
    elif mode == "diamond":
        grass = shell.part("shell_field_floor_turf", "Illustrative turf", (.055, .21, .073))
        clay = shell.part("shell_field_floor_clay", "Clay infield", (.31, .14, .068))
        x = min(43, dimensions[0] * .32)
        z = min(46, dimensions[1] * .32)
        regions.append((grass, [(a*x, b*z) for a, b in polar_outline(1, 64)]))
        regions.append((clay, [(0, -.46*z), (.44*x, .04*z), (0, .59*z), (-.44*x, .04*z)]))
    elif mode == "timber":
        timber = shell.part("shell_field_floor_timber", "Warm auditorium apron", (.28, .16, .098), roughness=.84)
        x = min(7, dimensions[0] * .20)
        z = min(9, dimensions[1] * .25)
        regions.append((timber, rectangle(-x, -z, x, z)))

    coords, faces = [], []
    for _, polygon in regions:
        faces.append(list(range(len(coords), len(coords) + len(polygon))))
        coords.extend(Vector(pair) for pair in polygon)
    vertices, _, triangles, _, _, origins = delaunay_2d_cdt(coords, [], faces, 1, 1e-5)
    for triangle, owners in zip(triangles, origins):
        if 0 in owners:
            mesh = regions[max(owners)][0]
            mesh.add([point(vertices[i], y) for i in reversed(triangle)], ((0, 1, 2),))


def build(data, output):
    settings, colors = data["config"], data["colors"]
    shape = settings["profile"]
    center, perimeter = fitted_outline(shape, data["outline"])
    y = data["lower"] - .18
    size = min(data["floor"])
    height = max(data["top"] + 3.8, data["chairTop"] + 5.2, y + 7)
    wall_top = height - .12
    wall_height = wall_top-y
    roof_at = roof_profile(settings["roof"],center,perimeter,height,size)
    shell = Shell()

    def part(name, label, key, **kwargs):
        return shell.part(name, label, color(colors[key]), **kwargs)

    plinth = part("shell_bowl_mass_plinth", "Precast concrete plinth", "concrete")
    shell_wall = part("shell_bowl_mass_enclosure", "Precast concrete enclosure", "concrete")
    cladding = part("shell_bowl_mass_cladding", "Folded wall cladding", "facade", metal=.24)
    horizontal = part("shell_bowl_mass_panel_bands", "Shadow joints and concourse fascia", "trim", metal=.22)
    ribs = part("shell_bowl_mass_facade_panels", "Exterior structural frames", "trim", metal=.22)
    portals = part("shell_vomitories_exterior", "Dark portal recesses", "floor")
    glazing = part("shell_bowl_mass_suite_glass", "Recessed concourse glazing", "glass", alpha=.61)
    rails = part("shell_bowl_mass_perimeter_rails", "Concourse metal rails", "trim", metal=.22)
    led = part("shell_ribbon_led_perimeter", "Perimeter LED", "accent", glow=1.12)
    floor = part("shell_field_floor", "Field apron", "floor", roughness=.88)
    walk = part("shell_field_floor_walk", "Exterior concrete apron", "concrete", roughness=.9, unshadowed=True)

    def radial(p, step):
        return tuple(c + (v-c)*step for c, v in zip(center, p))

    window_y = min(y+4.6, y+wall_height*.44)
    for i, (a, b) in enumerate(spans(perimeter)):
        a0, b0 = radial(a, 1.09), radial(b, 1.09)
        a1, b1 = radial(a, 1.008), radial(b, 1.008)
        panel(plinth, a, b, y-.4, y+1.15)
        a_top,b_top = roof_at(a,1)[1]-.12, roof_at(b,1)[1]-.12
        shell_wall.quad(point(a,y+1.15),point(b,y+1.15),point(b,b_top),point(a,a_top))
        if i%4 != 3:
            cladding.quad(point(a1,window_y+.35),point(b1,window_y+.35),
                          point(b1,b_top-.13),point(a1,a_top-.13))
        for fraction in (.46,.71,.92):
            level=y+wall_height*fraction
            panel(horizontal,radial(a,1.014),radial(b,1.014),level,level+.15)
        if i % 3 != 2:
            panel(glazing, a1, b1, y+1.28, window_y)
        else:
            panel(portals, a1, b1, y+.07, window_y)
        rails.beam(point(a1, window_y+.19), point(b1, window_y+.19), .075, .095)
        if i % 2 == 0:
            ribs.beam(point(a1, y+.08), point(a1, a_top), .19, .30)
        panel(led, radial(a, .993), radial(b, .993), wall_top-.54, wall_top-.4)
        walk.quad(point(a,y-.036),point(b,y-.036),point(b0,y-.036),point(a0,y-.036))

    field_surface(shell, perimeter, floor, settings["floor"], data["floor"], y)
    roof_surface(part, settings["roof"], perimeter, roof_at)
    output.mkdir()
    shell.export(output, "Illustrative architecture derived from retained StagePeek layout geometry.",
                 data["references"], [shape,settings["roof"],settings["floor"]])
    path = output/"manifest.json"
    manifest = json.loads(path.read_text())
    manifest.update({"template":shape,"roofStyle":settings["roof"],"palette":settings["palette"],
                     "catalogShape":data["shape"],"seating":{"precision":"illustrative","layer":"main-viewer-parametric"},
                     "sourceSeatsCount":max(layout["sourceSeats"] for layout in data["layouts"])})
    if data["hasSourceSeats"]:
        manifest.update({"coordinateBasis":"source-model-xyz","seating":{"layer":"main-viewer-source"}})
    path.write_text(json.dumps(manifest,indent=2)+"\n")


job, directory = map(Path, sys.argv[sys.argv.index("--")+1:])
for request in json.loads(job.read_text()):
    build(request,directory/request["id"])
