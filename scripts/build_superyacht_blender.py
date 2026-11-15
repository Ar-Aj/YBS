# pyright: reportMissingImports=false, reportAttributeAccessIssue=false, reportOptionalMemberAccess=false
# ruff: noqa: E402
import math
import os
import bpy  # type: ignore[import-not-found]
import bmesh  # type: ignore[import-not-found]

# Reset Blender scene to clean state
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

# ==============================================================================
# 1. Bake High-Dynamic-Range Open-Ocean Golden-Hour .HDR Environment Map
#    (Matches Image 5: Deep Twilight Sapphire Sky -> Fiery Golden Sunset Horizon -> Deep Navy Sea)
# ==============================================================================
def bake_open_ocean_hdr(filepath):
    width, height = 1024, 512
    img_name = "YBS_OpenOcean_HDR"
    if img_name in bpy.data.images:
        bpy.data.images.remove(bpy.data.images[img_name])
    img = bpy.data.images.new(img_name, width=width, height=height, alpha=True, float_buffer=True)

    pixels = [0.0] * (width * height * 4)
    sun_phi = 0.14 * math.pi
    sun_theta = 0.525 * math.pi
    sx = math.sin(sun_theta) * math.cos(sun_phi)
    sy = math.sin(sun_theta) * math.sin(sun_phi)
    sz = math.cos(sun_theta)

    for y in range(height):
        v = (y + 0.5) / height
        theta = (1.0 - v) * math.pi
        cos_t = math.cos(theta)
        sin_t = math.sin(theta)

        for x in range(width):
            u = (x + 0.5) / width
            phi = (u - 0.5) * 2.0 * math.pi
            dx = sin_t * math.cos(phi)
            dy = sin_t * math.sin(phi)
            dz = cos_t

            dot_sun = max(0.0, dx * sx + dy * sy + dz * sz)
            horiz_glow = max(0.0, (dx * sx + dy * sy) * 0.5 + 0.5)

            if dz >= 0.0:
                h_factor = math.pow(1.0 - dz, 3.2)
                zenith_r, zenith_g, zenith_b = 0.05, 0.12, 0.26
                mid_r, mid_g, mid_b = 0.15, 0.28, 0.48
                sun_az = math.pow(horiz_glow, 2.6)
                horiz_r = 0.28 * (1.0 - sun_az) + 2.45 * sun_az
                horiz_g = 0.38 * (1.0 - sun_az) + 1.08 * sun_az
                horiz_b = 0.54 * (1.0 - sun_az) + 0.34 * sun_az

                sky_r = zenith_r * (1.0 - dz) + mid_r * dz
                sky_g = zenith_g * (1.0 - dz) + mid_g * dz
                sky_b = zenith_b * (1.0 - dz) + mid_b * dz

                r = sky_r * (1.0 - h_factor) + horiz_r * h_factor
                g = sky_g * (1.0 - h_factor) + horiz_g * h_factor
                b = sky_b * (1.0 - h_factor) + horiz_b * h_factor

                corona = math.pow(dot_sun, 22.0) * 4.5 + math.pow(dot_sun, 240.0) * 24.0
                r += corona * 1.25
                g += corona * 0.76
                b += corona * 0.30
            else:
                depth = min(1.0, abs(dz) * 2.8)
                sea_horiz_r, sea_horiz_g, sea_horiz_b = 0.08, 0.16, 0.28
                sea_deep_r, sea_deep_g, sea_deep_b = 0.012, 0.045, 0.10
                r = sea_horiz_r * (1.0 - depth) + sea_deep_r * depth
                g = sea_horiz_g * (1.0 - depth) + sea_deep_g * depth
                b = sea_horiz_b * (1.0 - depth) + sea_deep_b * depth

                refl_dot = max(0.0, dx * sx + dy * sy - dz * sz)
                shimmer = math.pow(refl_dot, 16.0) * (1.0 - depth * 0.5) * 2.8
                r += shimmer * 1.20
                g += shimmer * 0.68
                b += shimmer * 0.22

            idx = (y * width + x) * 4
            pixels[idx] = r
            pixels[idx + 1] = g
            pixels[idx + 2] = b
            pixels[idx + 3] = 1.0

    img.pixels.foreach_set(pixels)
    img.filepath_raw = filepath
    img.file_format = 'HDR'
    img.save()
    print("SUCCESS_HDR_SAVED:", filepath)

hdr_output_path = r"C:\Yacht Broker Service\public\models\ocean_morning.hdr"
os.makedirs(os.path.dirname(hdr_output_path), exist_ok=True)
bake_open_ocean_hdr(hdr_output_path)

# ==============================================================================
# 2. PBR Materials
# ==============================================================================
def make_pbr_mat(name, base_color, metallic=0.0, roughness=0.4, clearcoat=0.0, clearcoat_rough=0.25, emission_color=None, emission_strength=0.0, alpha=1.0):
    mat = bpy.data.materials.new(name=name)
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if not bsdf:
        bsdf = mat.node_tree.nodes.new(type="ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = (*base_color, 1.0)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if "Coat Weight" in bsdf.inputs:
        bsdf.inputs["Coat Weight"].default_value = clearcoat
        bsdf.inputs["Coat Roughness"].default_value = clearcoat_rough
    if emission_color and "Emission Color" in bsdf.inputs:
        bsdf.inputs["Emission Color"].default_value = (*emission_color, 1.0)
        bsdf.inputs["Emission Strength"].default_value = emission_strength
    if alpha < 1.0:
        bsdf.inputs["Alpha"].default_value = alpha
        if hasattr(mat, 'blend_method'):
            mat.blend_method = 'BLEND'
    return mat

# 1. Satin Light Silver-Grey Awlgrip Hull Paint (non-mirror matte-satin marine finish)
mat_hull_metallic = make_pbr_mat(
    "YBS_Hull_MetallicSilverChampagne",
    base_color=(0.84, 0.82, 0.78),
    metallic=0.0,
    roughness=0.58,
    clearcoat=0.0,
    clearcoat_rough=0.50
)

# 2. Satin Pearl-White Superstructure Gelcoat
mat_super_pearl = make_pbr_mat(
    "YBS_Superstructure_PearlWhite",
    base_color=(0.95, 0.93, 0.90),
    metallic=0.0,
    roughness=0.55,
    clearcoat=0.0,
    clearcoat_rough=0.50
)

# 3. Satin Carbon-Black Architectural Trim
mat_obsidian = make_pbr_mat(
    "YBS_Obsidian_GlossBlack",
    base_color=(0.11, 0.12, 0.14),
    metallic=0.02,
    roughness=0.58,
    clearcoat=0.0,
    clearcoat_rough=0.50
)

# 4. Dark Smoked Architectural Marine Window Glass (subtle non-reflective tint)
mat_salon_glass = make_pbr_mat(
    "YBS_Salon_Glass",
    base_color=(0.10, 0.12, 0.15),
    metallic=0.0,
    roughness=0.60,
    clearcoat=0.0,
    clearcoat_rough=0.50,
    alpha=0.18
)

# 5. Frameless Balustrade Glass
mat_balustrade_glass = make_pbr_mat(
    "YBS_Balustrade_Glass",
    base_color=(0.55, 0.68, 0.78),
    metallic=0.20,
    roughness=0.03,
    clearcoat=1.0,
    alpha=0.24
)

# 6. Rich Warm Burmese Teak Decking & Interior Walnut
mat_teak = make_pbr_mat(
    "YBS_Burmese_Teak",
    base_color=(0.44, 0.27, 0.13),
    metallic=0.02,
    roughness=0.44
)

mat_walnut = make_pbr_mat(
    "YBS_Interior_Walnut",
    base_color=(0.20, 0.11, 0.05),
    metallic=0.05,
    roughness=0.26,
    clearcoat=0.5
)

# 7. Cream Loro Piana Marine Linen Upholstery & Charcoal Accent Pillows
mat_cushion_linen = make_pbr_mat(
    "YBS_Cushion_Linen",
    base_color=(0.92, 0.89, 0.84),
    metallic=0.0,
    roughness=0.65
)

mat_pillow_accent = make_pbr_mat(
    "YBS_Pillow_Charcoal",
    base_color=(0.15, 0.17, 0.20),
    metallic=0.0,
    roughness=0.62
)

# 8. Warm 2700K Golden-Amber Interior Architectural Lighting (Rich warm golden-amber, not white!)
mat_warm_glow = make_pbr_mat(
    "YBS_Warm_Interior_Glow",
    base_color=(0.92, 0.48, 0.12),
    metallic=0.0,
    roughness=0.22,
    emission_color=(0.98, 0.50, 0.12),
    emission_strength=1.65
)

mat_ceiling_soffit = make_pbr_mat(
    "YBS_Ceiling_Warm_Soffit",
    base_color=(0.82, 0.54, 0.24),
    metallic=0.08,
    roughness=0.26,
    emission_color=(0.95, 0.56, 0.18),
    emission_strength=1.15
)

# 9. Underwater Turquoise-Cyan Hull LEDs
mat_underwater_led = make_pbr_mat(
    "YBS_Underwater_Cyan_LED",
    base_color=(0.20, 0.96, 0.92),
    metallic=0.0,
    roughness=0.1,
    emission_color=(0.16, 0.95, 0.90),
    emission_strength=6.5
)

# 10. Mirror-Polished 316L Stainless Steel
mat_stainless = make_pbr_mat(
    "YBS_Stainless_Steel",
    base_color=(0.94, 0.95, 0.97),
    metallic=0.98,
    roughness=0.04,
    clearcoat=0.95
)

# Flag tricolor materials
mat_flag_green = make_pbr_mat("YBS_Flag_Green", base_color=(0.0, 0.50, 0.22), roughness=0.55)
mat_flag_white = make_pbr_mat("YBS_Flag_White", base_color=(0.95, 0.95, 0.95), roughness=0.55)
mat_flag_red = make_pbr_mat("YBS_Flag_Red", base_color=(0.78, 0.10, 0.14), roughness=0.55)

# ==============================================================================
# 3. Geometry Helpers
# ==============================================================================
def create_mesh_obj(name, verts, faces, mat, auto_smooth_deg=32, bevel_width=0.0):
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()

    # Guarantee 100% outward-pointing normals on both open hull shells and closed solids
    bm = bmesh.new()
    bm.from_mesh(mesh)
    if name in ("Hull_Shell", "Hull_BootStripe"):
        bm.normal_update()
        for f in bm.faces:
            fc = f.calc_center_median()
            if abs(f.normal.y) > 0.12 and abs(fc.y) > 0.005:
                if fc.y * f.normal.y < 0.0:
                    f.normal_flip()
            elif fc.z >= 0.0:
                if f.normal.z < 0.0:
                    f.normal_flip()
            else:
                if f.normal.z > 0.0:
                    f.normal_flip()
        bm.normal_update()
    else:
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        bm.normal_update()
        if len(bm.verts) > 0 and len(bm.faces) > 0:
            cx = sum(v.co.x for v in bm.verts) / len(bm.verts)
            cy = sum(v.co.y for v in bm.verts) / len(bm.verts)
            cz = sum(v.co.z for v in bm.verts) / len(bm.verts)
            dot_sum = 0.0
            for f in bm.faces:
                fc = f.calc_center_median()
                dot_sum += (fc.x - cx) * f.normal.x + (fc.y - cy) * f.normal.y + (fc.z - cz) * f.normal.z
            if dot_sum < 0.0:
                bmesh.ops.reverse_faces(bm, faces=bm.faces)
                bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()
    mesh.update()

    obj = bpy.data.objects.new(name, mesh)
    scene.collection.objects.link(obj)
    obj.data.materials.append(mat)

    for poly in mesh.polygons:
        poly.use_smooth = True

    if bevel_width > 0:
        bev = obj.modifiers.new(name="Bevel", type='BEVEL')
        bev.width = bevel_width
        bev.segments = 2
        bev.limit_method = 'ANGLE'
        bev.angle_limit = math.radians(28)

    if auto_smooth_deg > 0:
        mod = obj.modifiers.new(name="EdgeSplit", type='EDGE_SPLIT')
        mod.split_angle = math.radians(auto_smooth_deg)

    return obj

def add_box(name, center, size, mat, bevel=0.010, rot_euler=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=center, rotation=rot_euler)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    if bevel > 0:
        bev = obj.modifiers.new(name="Bevel", type='BEVEL')
        bev.width = bevel
        bev.segments = 2
        bev.limit_method = 'ANGLE'
    for poly in obj.data.polygons:
        poly.use_smooth = True
    return obj

def add_cylinder(name, center, radius_bottom, radius_top, depth, mat, rot_euler=(0, 0, 0), segs=20):
    bpy.ops.mesh.primitive_cone_add(
        vertices=segs,
        radius1=radius_bottom,
        radius2=radius_top,
        depth=depth,
        location=center,
        rotation=rot_euler
    )
    obj = bpy.context.active_object
    obj.name = name
    obj.data.materials.append(mat)
    for poly in obj.data.polygons:
        poly.use_smooth = True
    return obj

def deck_profile_w(u, w_rear, w_mid, w_front):
    u_c = max(0.0, min(1.0, u))
    if u_c < 0.5:
        t = u_c / 0.5
        return w_rear + (w_mid - w_rear) * math.sin(t * math.pi * 0.5)
    else:
        t = (u_c - 0.5) / 0.5
        return w_mid + (w_front - w_mid) * (1.0 - math.cos(t * math.pi * 0.5))

def add_conformal_fashion_pillar(name, x_bot_rear, x_bot_front, x_top_rear, x_top_front,
                                  xr_bot, xf_bot, wr_b, wm_b, wf_b,
                                  xr_top, xf_top, wr_t, wm_t, wf_t,
                                  side, z_bot, z_top, thickness, mat, bevel=0.008):
    """
    Computes the exact lateral Y coordinate at all 4 X-corners from the lower and upper
    deck width profiles so the pillar never pokes out at the front or rear!
    """
    yb_r = side * deck_profile_w((x_bot_rear - xr_bot) / (xf_bot - xr_bot), wr_b, wm_b, wf_b)
    yb_f = side * deck_profile_w((x_bot_front - xr_bot) / (xf_bot - xr_bot), wr_b, wm_b, wf_b)
    yt_r = side * deck_profile_w((x_top_rear - xr_top) / (xf_top - xr_top), wr_t, wm_t, wf_t)
    yt_f = side * deck_profile_w((x_top_front - xr_top) / (xf_top - xr_top), wr_t, wm_t, wf_t)

    verts = [
        (x_bot_rear, yb_r - side * thickness * 0.6, z_bot),
        (x_bot_front, yb_f - side * thickness * 0.6, z_bot),
        (x_bot_front, yb_f + side * thickness * 0.4, z_bot),
        (x_bot_rear, yb_r + side * thickness * 0.4, z_bot),
        (x_top_rear, yt_r - side * thickness * 0.6, z_top),
        (x_top_front, yt_f - side * thickness * 0.6, z_top),
        (x_top_front, yt_f + side * thickness * 0.4, z_top),
        (x_top_rear, yt_r + side * thickness * 0.4, z_top),
    ]
    if side > 0:
        faces = [
            (0, 1, 2, 3),
            (7, 6, 5, 4),
            (3, 2, 6, 7),
            (1, 0, 4, 5),
            (2, 1, 5, 6),
            (0, 3, 7, 4),
        ]
    else:
        faces = [
            (3, 2, 1, 0),
            (4, 5, 6, 7),
            (7, 6, 2, 3),
            (5, 4, 0, 1),
            (6, 5, 1, 2),
            (4, 7, 3, 0),
        ]
    return create_mesh_obj(name, verts, faces, mat, auto_smooth_deg=35, bevel_width=bevel)

# ==============================================================================
# 4. Sculpted Displacement Hull with 3D Extruded Hull-Conforming Glazing Windows
# ==============================================================================
def hull_half_beam_at_x(x, z_level=0.24):
    x_stern = -5.65
    x_bow = 6.20
    u = max(0.0, min(1.0, (x - x_stern) / (x_bow - x_stern)))
    if u < 0.16:
        t = u / 0.16
        b = 1.18 + 0.16 * math.sin(t * math.pi * 0.5)
    elif u < 0.55:
        t = (u - 0.16) / 0.39
        b = 1.34 + 0.04 * math.sin(t * math.pi)
    else:
        t = (u - 0.55) / 0.45
        b = 1.34 * math.pow(max(0.0, 1.0 - t), 1.36)

    knuckle_b = b * (0.975 - 0.055 * math.pow(u, 2.0))
    wl_b = b * (0.89 - 0.16 * math.pow(u, 1.6))
    tz = max(0.0, min(1.0, (z_level + 0.06) / 0.42))
    return wl_b * (1.0 - tz) + knuckle_b * tz

def add_hull_window_strip_3d(name, x_start, x_end, z_bot, z_top, mat, segs=16, y_out=0.016):
    """Creates a solid 3D curved window band along the hull so there is zero sawtooth z-fighting."""
    verts, faces = [], []
    for side in [-1, 1]:
        base = len(verts)
        for i in range(segs + 1):
            t = i / segs
            x = x_start + (x_end - x_start) * t
            yb_in = side * (hull_half_beam_at_x(x, z_bot) - 0.015)
            yb_out = side * (hull_half_beam_at_x(x, z_bot) + y_out)
            yt_out = side * (hull_half_beam_at_x(x, z_top) + y_out)
            yt_in = side * (hull_half_beam_at_x(x, z_top) - 0.015)
            verts.extend([
                (x, yb_in, z_bot),
                (x, yb_out, z_bot),
                (x, yt_out, z_top),
                (x, yt_in, z_top),
            ])
        for i in range(segs):
            b = base + i * 4
            n = base + (i + 1) * 4
            if side > 0:
                faces.append((b + 2, n + 2, n + 1, b + 1)) # outer face (+Y)
                faces.append((b + 3, n + 3, n + 2, b + 2)) # top lip (+Z)
                faces.append((b + 1, n + 1, n + 0, b + 0)) # bottom lip (-Z)
                faces.append((b + 0, n + 0, n + 3, b + 3)) # inner face (-Y)
            else:
                faces.append((b + 1, n + 1, n + 2, b + 2)) # outer face (-Y)
                faces.append((b + 2, n + 2, n + 3, b + 3)) # top lip (+Z)
                faces.append((b + 0, n + 0, n + 1, b + 1)) # bottom lip (-Z)
                faces.append((b + 3, n + 3, n + 0, b + 0)) # inner face (+Y)
        # End caps
        last = base + segs * 4
        if side > 0:
            faces.append((base + 3, base + 2, base + 1, base + 0))
            faces.append((last + 0, last + 1, last + 2, last + 3))
        else:
            faces.append((base + 0, base + 1, base + 2, base + 3))
            faces.append((last + 3, last + 2, last + 1, last + 0))
    return create_mesh_obj(name, verts, faces, mat, auto_smooth_deg=45)

def build_hull():
    num_u = 104
    x_stern = -5.65
    x_bow = 6.20

    def station_profile(u):
        x = x_stern + (x_bow - x_stern) * u
        if u < 0.16:
            t = u / 0.16
            b = 1.18 + 0.16 * math.sin(t * math.pi * 0.5)
        elif u < 0.55:
            t = (u - 0.16) / 0.39
            b = 1.34 + 0.04 * math.sin(t * math.pi)
        else:
            t = (u - 0.55) / 0.45
            b = 1.34 * math.pow(max(0.0, 1.0 - t), 1.36)

        sheer_z = 0.52 + 0.24 * math.pow(max(0.0, u - 0.32) / 0.68, 1.45)

        if u < 0.085:
            st_t = u / 0.085
            sheer_z = 0.06 + (0.52 - 0.06) * math.pow(st_t, 0.88)

        if 0.26 < u < 0.62:
            ct = (u - 0.26) / 0.36
            sheer_z -= 0.065 * math.pow(math.sin(ct * math.pi), 1.6)

        knuckle_z = min(sheer_z - 0.03, 0.35 + 0.20 * math.pow(max(0.0, u - 0.25) / 0.75, 1.40))
        knuckle_b = b * (0.975 - 0.045 * math.pow(u, 2.0))

        wl_z = -0.06 + 0.05 * math.pow(u, 1.8)
        wl_b = b * (0.89 - 0.15 * math.pow(u, 1.6))

        bilge_z = -0.36 + 0.10 * math.pow(u, 1.5)
        bilge_b = wl_b * 0.58
        keel_z = -0.48 + 0.16 * math.pow(u, 1.7)

        rake = math.pow((u - 0.88) / 0.12, 1.8) * 0.22 if u > 0.88 else 0.0

        return {
            "sheer": (x + rake * 0.85, max(0.003, b), sheer_z),
            "knuckle": (x + rake * 0.48, max(0.003, knuckle_b), knuckle_z),
            "wl": (x + rake * 0.12, max(0.002, wl_b), wl_z),
            "bilge": (x - rake * 0.18, max(0.002, bilge_b), bilge_z),
            "keel": (x - rake * 0.36, 0.0, keel_z),
        }

    stations = [station_profile(i / (num_u - 1)) for i in range(num_u)]
    verts, faces = [], []

    def add_quad(p00, p10, p11, p01):
        idx = len(verts)
        verts.extend([p00, p10, p11, p01])
        faces.append((idx, idx + 1, idx + 2, idx + 3))

    def mir(p):
        return (p[0], -p[1], p[2])

    for i in range(num_u - 1):
        a, b = stations[i], stations[i + 1]
        # +Y side (outward normal has +Y)
        add_quad(a["sheer"], b["sheer"], b["knuckle"], a["knuckle"])
        add_quad(a["knuckle"], b["knuckle"], b["wl"], a["wl"])
        add_quad(a["wl"], b["wl"], b["bilge"], a["bilge"])
        add_quad(a["bilge"], b["bilge"], b["keel"], a["keel"])
        # -Y side (outward normal has -Y)
        add_quad(mir(a["knuckle"]), mir(b["knuckle"]), mir(b["sheer"]), mir(a["sheer"]))
        add_quad(mir(a["wl"]), mir(b["wl"]), mir(b["knuckle"]), mir(a["knuckle"]))
        add_quad(mir(a["bilge"]), mir(b["bilge"]), mir(b["wl"]), mir(a["wl"]))
        add_quad(mir(a["keel"]), mir(b["keel"]), mir(b["bilge"]), mir(a["bilge"]))

    # Cap the sloped stern haunch tops (u from 0 to 0.085) with upward (+Z) normals
    for i in range(int(num_u * 0.085)):
        a, b = stations[i], stations[i + 1]
        for side in [-1, 1]:
            p0 = (a["sheer"][0], side * a["sheer"][1], a["sheer"][2])
            p1 = (b["sheer"][0], side * b["sheer"][1], b["sheer"][2])
            p2 = (b["sheer"][0], side * 0.88, b["sheer"][2])
            p3 = (a["sheer"][0], side * 0.88, a["sheer"][2])
            if side > 0:
                add_quad(p3, p2, p1, p0)
            else:
                add_quad(p0, p1, p2, p3)

    # Cap the entire forward hull deck (u from 0.62 to 1.0) with upward (+Z) normals
    for i in range(int(num_u * 0.62), num_u - 1):
        a, b = stations[i], stations[i + 1]
        p0 = (a["sheer"][0], a["sheer"][1], a["sheer"][2])
        p1 = (b["sheer"][0], b["sheer"][1], b["sheer"][2])
        p2 = (b["sheer"][0], -b["sheer"][1], b["sheer"][2])
        p3 = (a["sheer"][0], -a["sheer"][1], a["sheer"][2])
        add_quad(p3, p2, p1, p0)

    create_mesh_obj("Hull_Shell", verts, faces, mat_hull_metallic, auto_smooth_deg=28)

    # Boot stripe at the waterline (outward normals on both +Y and -Y sides)
    boot_verts, boot_faces = [], []
    for i in range(num_u - 1):
        a, b = stations[i]["wl"], stations[i + 1]["wl"]
        idx = len(boot_verts)
        boot_verts.extend([
            (a[0], a[1] + 0.006, a[2] - 0.025),
            (b[0], b[1] + 0.006, b[2] - 0.025),
            (b[0], b[1] + 0.006, b[2] + 0.045),
            (a[0], a[1] + 0.006, a[2] + 0.045),
        ])
        boot_faces.append((idx + 3, idx + 2, idx + 1, idx + 0))
        idx2 = len(boot_verts)
        boot_verts.extend([
            (a[0], -a[1] - 0.006, a[2] + 0.045),
            (b[0], -b[1] - 0.006, b[2] + 0.045),
            (b[0], -b[1] - 0.006, b[2] - 0.025),
            (a[0], -a[1] - 0.006, a[2] - 0.025),
        ])
        boot_faces.append((idx2 + 3, idx2 + 2, idx2 + 1, idx2 + 0))
    create_mesh_obj("Hull_BootStripe", boot_verts, boot_faces, mat_obsidian, auto_smooth_deg=45)

    # 3D Hull-Conforming Glazing Windows (Crisp horizontal edges with zero sawtooth z-fighting!)
    add_hull_window_strip_3d("Hull_Win_AftSlot", -4.15, -2.25, 0.22, 0.295, mat_obsidian, segs=18)
    add_hull_window_strip_3d("Hull_Win_MidGlass", -0.82, 0.14, 0.13, 0.30, mat_obsidian, segs=12)
    for fx in [0.90, 1.50, 2.10, 2.70, 3.30, 3.85]:
        add_hull_window_strip_3d(f"Hull_Win_Fwd_{fx}", fx - 0.11, fx + 0.11, 0.21, 0.30, mat_obsidian, segs=4)
    add_hull_window_strip_3d("Hull_BowSlot", 3.25, 4.85, 0.50, 0.585, mat_obsidian, segs=12, y_out=0.018)

    # Stainless steel anchor pocket & anchor near bow
    for side in [-1, 1]:
        yb = hull_half_beam_at_x(5.15, 0.34)
        add_box(f"Anchor_Plate_{side}", (5.15, side * yb, 0.34), (0.34, 0.03, 0.16), mat_stainless, bevel=0.005, rot_euler=(0, 0.10, side * -0.26))

    # Underwater Turquoise LED Hull Lights along the aft quarters
    for lx in [-6.1, -5.1, -4.0, -2.9, -1.8]:
        y_led = 1.12 if lx < -5.2 else 1.23
        for side in [-1, 1]:
            add_box(f"Underwater_LED_{lx}_{side}", (lx, side * y_led, -0.07), (0.18, 0.04, 0.035), mat_underwater_led, bevel=0.004)

build_hull()

# ==============================================================================
# 5. Walk-In Beach Club, Furnished Dining Room, Twin Teak Stairs & Sunloungers
# ==============================================================================
def build_beach_club_and_swim_platform():
    # Extended Swim Platform (-6.95 to -4.8) with rounded metallic rim and Burmese teak deck
    add_box("Swim_Platform_Rim", (-5.90, 0.0, -0.03), (2.25, 2.34, 0.11), mat_hull_metallic, bevel=0.035)
    add_box("Swim_Platform_StainlessRub", (-5.92, 0.0, -0.025), (2.27, 2.36, 0.025), mat_stainless, bevel=0.008)
    add_box("Swim_Platform_Teak", (-5.90, 0.0, 0.03), (2.16, 2.24, 0.025), mat_teak, bevel=0.008)

    # Open Walk-In Beach Club Interior (-4.88 to -3.65, strictly underneath Main Deck Coaming at -4.90!)
    add_box("BeachClub_TeakFloor", (-4.40, 0.0, 0.04), (1.45, 1.54, 0.025), mat_teak, bevel=0.005)
    add_box("BeachClub_CeilingSoffit", (-4.32, 0.0, 0.455), (1.12, 1.48, 0.02), mat_ceiling_soffit, bevel=0.005)
    for gx in [-4.72, -4.35, -3.98]:
        for gy in [-0.48, 0.0, 0.48]:
            add_cylinder(f"BC_Downlight_{gx}_{gy}", (gx, gy, 0.442), 0.040, 0.040, 0.012, mat_warm_glow)

    # Illuminated Back Credenza & Warm Wood Bulkhead + Side Walls inside Beach Club
    add_box("BeachClub_Bulkhead", (-3.76, 0.0, 0.25), (0.06, 1.46, 0.42), mat_walnut, bevel=0.008)
    add_box("BeachClub_BackGlowPanel", (-3.80, 0.0, 0.28), (0.03, 1.28, 0.28), mat_warm_glow, bevel=0.005)
    for side in [-1, 1]:
        add_box(f"BeachClub_SideWall_{side}", (-4.32, side * 0.74, 0.25), (1.12, 0.04, 0.42), mat_walnut, bevel=0.005)
        add_box(f"BeachClub_SideGlow_{side}", (-4.32, side * 0.71, 0.26), (0.75, 0.02, 0.24), mat_warm_glow, bevel=0.004)
        add_box(f"BC_DoorFrame_{side}", (-4.86, side * 0.74, 0.25), (0.05, 0.05, 0.42), mat_obsidian, bevel=0.004)
        # Solid painted hull transom cheeks flanking the Beach Club doorway and behind the teak stairs
        add_box(f"Stern_Transom_Cheek_{side}", (-4.80, side * 0.96, 0.25), (0.14, 0.44, 0.44), mat_hull_metallic, bevel=0.010)
    add_box("BC_DoorLintel", (-4.86, 0.0, 0.45), (0.05, 1.52, 0.04), mat_obsidian, bevel=0.004)

    # Beach Club Dining Table + 8 Individual Dining Chairs
    add_box("BC_DiningTable_Top", (-4.36, 0.0, 0.19), (0.56, 0.88, 0.03), mat_walnut, bevel=0.008)
    add_box("BC_DiningTable_Pedestal", (-4.36, 0.0, 0.11), (0.28, 0.42, 0.14), mat_obsidian, bevel=0.005)
    for cy in [-0.30, -0.10, 0.10, 0.30]:
        for cx, dir_x in [(-4.68, 1), (-4.04, -1)]:
            add_box(f"BC_Chair_Seat_{cx}_{cy}", (cx, cy, 0.12), (0.14, 0.14, 0.025), mat_cushion_linen, bevel=0.005)
            add_box(f"BC_Chair_Back_{cx}_{cy}", (cx - dir_x * 0.06, cy, 0.18), (0.025, 0.14, 0.11), mat_walnut, bevel=0.004)

    # Twin Recessed Teak Staircases with Illuminated Riser Strips & Stainless Handrails
    for side in [-1, 1]:
        y_stair = side * 0.92
        for step in range(8):
            sx = -5.45 + step * 0.088
            sz = 0.055 + step * 0.060
            add_box(f"Stair_Step_{side}_{step}", (sx, y_stair, sz), (0.10, 0.26, 0.03), mat_teak, bevel=0.004)
            add_box(f"Stair_Glow_{side}_{step}", (sx - 0.038, y_stair, sz - 0.012), (0.018, 0.24, 0.014), mat_warm_glow, bevel=0.002)
        add_cylinder(
            f"Stair_Handrail_{side}",
            (-5.12, y_stair - side * 0.12, 0.40),
            0.011, 0.011, 0.76,
            mat_stainless,
            rot_euler=(0, 0.86, 0)
        )

    # 3 Detailed Aft Sunloungers with Bolsters, Throw Pillows & Side Tables on Swim Platform
    for idx, ly in enumerate([-0.64, 0.0, 0.64]):
        add_box(f"Lounger_Base_{idx}", (-6.08, ly, 0.06), (0.74, 0.34, 0.045), mat_walnut, bevel=0.008)
        add_box(f"Lounger_Mattress_{idx}", (-6.00, ly, 0.098), (0.50, 0.31, 0.042), mat_cushion_linen, bevel=0.012)
        add_box(f"Lounger_Backrest_{idx}", (-5.66, ly, 0.155), (0.22, 0.31, 0.038), mat_cushion_linen, bevel=0.010, rot_euler=(0, 0.42, 0))
        add_cylinder(f"Lounger_Bolster_{idx}", (-5.62, ly, 0.195), 0.026, 0.026, 0.26, mat_pillow_accent, rot_euler=(math.pi * 0.5, 0, 0))
        if idx in [0, 2]:
            add_box(f"Lounger_SideTable_{idx}", (-6.12, ly + (0.24 if ly > 0 else -0.24), 0.075), (0.22, 0.14, 0.06), mat_walnut, bevel=0.006)

    # 4 Warm Glass & Bronze Deck Lanterns on the Swim Platform
    for lx, ly in [(-6.68, -0.96), (-6.68, 0.96), (-5.58, -0.92), (-5.58, 0.42)]:
        add_box(f"Lantern_Cage_{lx}_{ly}", (lx, ly, 0.10), (0.065, 0.065, 0.13), mat_obsidian, bevel=0.004)
        add_cylinder(f"Lantern_Candle_{lx}_{ly}", (lx, ly, 0.095), 0.024, 0.024, 0.09, mat_warm_glow)

build_beach_club_and_swim_platform()

# ==============================================================================
# 6. Multi-Deck Superstructure, Sculpted Coamings, Flush Mullions,
#    Conformal Fashion Plates, Balustrade Stanchions, Radar Mast & Italian Ensign
# ==============================================================================
def build_deck_slab(name, x_rear, x_front, w_rear, w_mid, w_front, z_base, thickness, mat, bevel=0.018, overhang_taper=0.94):
    segs = 44
    verts, faces = [], []

    for i in range(segs + 1):
        u = i / segs
        x = x_rear + (x_front - x_rear) * u
        w = deck_profile_w(u, w_rear, w_mid, w_front)
        verts.append((x, w * overhang_taper, z_base))
        verts.append((x, -w * overhang_taper, z_base))
        verts.append((x, -w, z_base + thickness))
        verts.append((x, w, z_base + thickness))

    for i in range(segs):
        b = i * 4
        n = (i + 1) * 4
        faces.append((b + 3, n + 3, n + 0, b + 0))  # +Y side
        faces.append((b + 1, n + 1, n + 2, b + 2))  # -Y side
        faces.append((b + 2, n + 2, n + 3, b + 3))  # +Z top
        faces.append((b + 0, n + 0, n + 1, b + 1))  # -Z bottom

    faces.append((0, 1, 2, 3))                      # -X rear cap
    last = segs * 4
    faces.append((last + 0, last + 3, last + 2, last + 1))  # +X front cap

    return create_mesh_obj(name, verts, faces, mat, auto_smooth_deg=35, bevel_width=bevel)

def add_balustrade_with_stanchions(prefix, x_start, y_start, x_end, y_end, z_base, height, num_posts):
    cx = (x_start + x_end) * 0.5
    cy = (y_start + y_end) * 0.5
    dx = x_end - x_start
    dy = y_end - y_start
    length = math.sqrt(dx * dx + dy * dy)
    angle = math.atan2(dy, dx)
    add_box(f"{prefix}_Glass", (cx, cy, z_base + height * 0.5), (length, 0.012, height * 0.90), mat_balustrade_glass, bevel=0.002, rot_euler=(0, 0, angle))
    add_box(f"{prefix}_TopRail", (cx, cy, z_base + height), (length + 0.02, 0.022, 0.020), mat_stainless, bevel=0.004, rot_euler=(0, 0, angle))
    for i in range(num_posts + 1):
        t = i / max(1, num_posts)
        px = x_start + dx * t
        py = y_start + dy * t
        add_cylinder(f"{prefix}_Post_{i}", (px, py, z_base + height * 0.5), 0.009, 0.009, height, mat_stainless)

def build_superstructure():
    # --- 1. MAIN DECK (z = 0.52) ---
    # MainDeck_Coaming runs from aft cockpit (-4.90) to forward end of Main Salon (+2.65) so it never pokes through the rising bow hull flare!
    build_deck_slab("MainDeck_Coaming", -4.90, 2.65, 1.18, 1.28, 0.96, 0.46, 0.075, mat_super_pearl, bevel=0.018)
    build_deck_slab("MainDeck_AftTeak", -4.82, -2.80, 1.10, 1.16, 1.12, 0.52, 0.025, mat_teak, bevel=0.005)

    # Main Salon Panoramic Smoked Glass Structure (-3.05 to +2.55) + Warm Interior Core & Furniture Silhouettes
    ms_xr, ms_xf = -3.05, 2.55
    ms_wr, ms_wm, ms_wf = 0.94, 1.06, 0.68
    build_deck_slab("MainSalon_Glass", ms_xr, ms_xf, ms_wr, ms_wm, ms_wf, 0.53, 0.47, mat_salon_glass, bevel=0.012, overhang_taper=0.98)
    build_deck_slab("MainSalon_Floor", -3.01, 2.51, 0.92, 1.038, 0.66, 0.535, 0.025, mat_walnut, bevel=0.004)
    build_deck_slab("MainSalon_InnerCore", -2.95, 1.35, 0.80, 0.90, 0.72, 0.56, 0.39, mat_warm_glow, bevel=0.010, overhang_taper=0.98)
    build_deck_slab("MainSalon_FwdBridgeCore", 1.30, 2.47, 0.777, 0.72, 0.58, 0.56, 0.39, mat_walnut, bevel=0.008, overhang_taper=0.98)
    for sx in [-2.45, -1.65, -0.85, -0.05, 0.75]:
        u_si = (sx - ms_xr) / (ms_xf - ms_xr)
        y_si = deck_profile_w(u_si, ms_wr, ms_wm, ms_wf) - 0.08
        for side in [-1, 1]:
            add_box(f"MainSalon_IntSilhouette_{sx}_{side}", (sx, side * y_si, 0.63), (0.48, 0.08, 0.14), mat_walnut, bevel=0.005)
    build_deck_slab("MainSalon_SillBot", ms_xr - 0.02, ms_xf + 0.02, ms_wr + 0.01, ms_wm + 0.01, ms_wf + 0.01, 0.525, 0.035, mat_obsidian, bevel=0.004)
    build_deck_slab("MainSalon_SillTop", ms_xr - 0.02, ms_xf + 0.02, ms_wr + 0.01, ms_wm + 0.01, ms_wf + 0.01, 0.97, 0.035, mat_obsidian, bevel=0.004)

    # Warm Golden-Amber Aft Salon Sliding Glass Door Entrance
    add_box("MainSalon_AftGlowDoor", (-3.06, 0.0, 0.76), (0.03, 1.16, 0.40), mat_warm_glow, bevel=0.005)
    for dy in [-0.58, -0.20, 0.20, 0.58]:
        add_box(f"MainSalon_AftDoorMull_{dy}", (-3.075, dy, 0.76), (0.035, 0.035, 0.42), mat_obsidian, bevel=0.003)

    # Flush Vertical Window Mullions along Main Salon side glass
    for mx in [-2.85, -2.15, -1.45, -0.75, -0.05, 0.65, 1.35, 2.05]:
        u_m = (mx - ms_xr) / (ms_xf - ms_xr)
        y_mull = deck_profile_w(u_m, ms_wr, ms_wm, ms_wf)
        for side in [-1, 1]:
            add_box(f"MainSalon_Mullion_{mx}_{side}", (mx, side * y_mull, 0.76), (0.045, 0.03, 0.44), mat_obsidian, bevel=0.003)

    # Warm Soffit Ceiling + Recessed Downlight Strips under Bridge Deck Overhang
    build_deck_slab("MainDeck_CeilingSoffit", -4.42, 2.55, 1.02, 1.14, 0.70, 0.985, 0.02, mat_ceiling_soffit, bevel=0.005)
    for lx in [-4.15, -3.75, -3.35]:
        for ly in [-0.58, 0.0, 0.58]:
            add_cylinder(f"Main_Light_{lx}_{ly}", (lx, ly, 0.98), 0.035, 0.035, 0.012, mat_warm_glow)

    # Main Deck Aft Cockpit Lounge (Sectional sofas, throw pillows, twin teak tables)
    add_box("MainAft_Sofa_RearBase", (-4.45, 0.0, 0.56), (0.28, 1.34, 0.06), mat_walnut, bevel=0.008)
    add_box("MainAft_Sofa_RearPad", (-4.44, 0.0, 0.61), (0.26, 1.32, 0.07), mat_cushion_linen, bevel=0.015)
    add_box("MainAft_Sofa_RearBack", (-4.54, 0.0, 0.68), (0.08, 1.32, 0.12), mat_cushion_linen, bevel=0.015)
    for side in [-1, 1]:
        add_box(f"MainAft_Sofa_WingBase_{side}", (-3.92, side * 0.56, 0.56), (0.78, 0.28, 0.06), mat_walnut, bevel=0.008)
        add_box(f"MainAft_Sofa_WingPad_{side}", (-3.92, side * 0.56, 0.61), (0.76, 0.26, 0.07), mat_cushion_linen, bevel=0.015)
        add_box(f"MainAft_Sofa_WingBack_{side}", (-3.92, side * 0.66, 0.68), (0.76, 0.08, 0.12), mat_cushion_linen, bevel=0.015)
        for px in [-4.20, -3.75]:
            add_box(f"MainAft_Pillow_{side}_{px}", (px, side * 0.59, 0.67), (0.11, 0.06, 0.10), mat_pillow_accent, bevel=0.008)
    for ty in [-0.20, 0.20]:
        add_box(f"MainAft_CoffeeTable_{ty}", (-3.95, ty, 0.58), (0.44, 0.28, 0.05), mat_teak, bevel=0.008)

    # --- 2. BRIDGE DECK / UPPER DECK (z = 1.00) ---
    bd_xr, bd_xf = -4.50, 2.95
    bd_wr, bd_wm, bd_wf = 1.06, 1.18, 0.72
    build_deck_slab("BridgeDeck_Fascia", bd_xr, bd_xf, bd_wr, bd_wm, bd_wf, 1.00, 0.135, mat_super_pearl, bevel=0.024, overhang_taper=0.92)
    build_deck_slab("BridgeDeck_DarkBelt", -4.48, 2.92, 1.065, 1.185, 0.725, 1.005, 0.032, mat_obsidian, bevel=0.004)
    build_deck_slab("BridgeDeck_AftTeak", -4.38, -2.05, 0.96, 1.02, 0.98, 1.12, 0.022, mat_teak, bevel=0.005)

    # Sky Lounge & Wheelhouse Smoked Glass + Warm Interior Core & Furniture Silhouettes + Flush Mullions
    sl_xr, sl_xf = -2.15, 1.65
    sl_wr, sl_wm, sl_wf = 0.78, 0.90, 0.58
    build_deck_slab("SkyLounge_Glass", sl_xr, sl_xf, sl_wr, sl_wm, sl_wf, 1.13, 0.41, mat_salon_glass, bevel=0.012, overhang_taper=0.98)
    build_deck_slab("SkyLounge_Floor", -2.11, 1.61, 0.76, 0.878, 0.56, 1.135, 0.02, mat_walnut, bevel=0.004)
    build_deck_slab("SkyLounge_InnerCore", -2.05, 0.55, 0.68, 0.76, 0.64, 1.155, 0.34, mat_warm_glow, bevel=0.010, overhang_taper=0.98)
    build_deck_slab("SkyLounge_WheelhouseCore", 0.50, 1.57, 0.657, 0.60, 0.48, 1.155, 0.34, mat_walnut, bevel=0.008, overhang_taper=0.98)
    for sx in [-1.65, -0.95, -0.25]:
        u_sl = (sx - sl_xr) / (sl_xf - sl_xr)
        y_sl = deck_profile_w(u_sl, sl_wr, sl_wm, sl_wf) - 0.07
        for side in [-1, 1]:
            add_box(f"SkyLounge_IntSilhouette_{sx}_{side}", (sx, side * y_sl, 1.22), (0.42, 0.07, 0.12), mat_walnut, bevel=0.005)
    build_deck_slab("SkyLounge_SillBot", sl_xr - 0.02, sl_xf + 0.02, sl_wr + 0.01, sl_wm + 0.01, sl_wf + 0.01, 1.125, 0.03, mat_obsidian, bevel=0.004)
    build_deck_slab("SkyLounge_SillTop", sl_xr - 0.02, sl_xf + 0.02, sl_wr + 0.01, sl_wm + 0.01, sl_wf + 0.01, 1.51, 0.03, mat_obsidian, bevel=0.004)
    add_box("SkyLounge_AftGlowDoor", (-2.16, 0.0, 1.33), (0.03, 0.92, 0.35), mat_warm_glow, bevel=0.005)
    for dy in [-0.46, -0.15, 0.15, 0.46]:
        add_box(f"SkyLounge_AftDoorMull_{dy}", (-2.175, dy, 1.33), (0.035, 0.03, 0.37), mat_obsidian, bevel=0.003)
    for mx in [-1.95, -1.30, -0.65, 0.0, 0.65, 1.25]:
        u_s = (mx - sl_xr) / (sl_xf - sl_xr)
        y_mull = deck_profile_w(u_s, sl_wr, sl_wm, sl_wf)
        for side in [-1, 1]:
            add_box(f"SkyLounge_Mullion_{mx}_{side}", (mx, side * y_mull, 1.33), (0.04, 0.03, 0.39), mat_obsidian, bevel=0.003)

    # Swept Pilothouse Visor Brow & Warm Ceiling Soffit
    build_deck_slab("Pilothouse_Brow", 1.15, 2.15, 0.78, 0.68, 0.44, 1.48, 0.075, mat_super_pearl, bevel=0.018)
    build_deck_slab("BridgeDeck_CeilingSoffit", -3.50, 1.65, 0.84, 0.96, 0.60, 1.535, 0.02, mat_ceiling_soffit, bevel=0.005)
    for lx in [-3.2, -2.6, -2.0]:
        for ly in [-0.46, 0.0, 0.46]:
            add_cylinder(f"Bridge_Light_{lx}_{ly}", (lx, ly, 1.53), 0.030, 0.030, 0.012, mat_warm_glow)

    # Bridge Deck Aft Exterior Lounge & Al-Fresco Dining
    for side in [-1, 1]:
        add_box(f"BridgeAft_SofaBase_{side}", (-3.25, side * 0.52, 1.16), (0.96, 0.26, 0.05), mat_walnut, bevel=0.008)
        add_box(f"BridgeAft_SofaPad_{side}", (-3.25, side * 0.52, 1.20), (0.94, 0.24, 0.06), mat_cushion_linen, bevel=0.012)
        add_box(f"BridgeAft_SofaBack_{side}", (-3.25, side * 0.62, 1.26), (0.94, 0.07, 0.10), mat_cushion_linen, bevel=0.012)
    add_box("BridgeAft_RearSettee", (-4.12, 0.0, 1.19), (0.24, 1.06, 0.085), mat_cushion_linen, bevel=0.012)
    add_box("BridgeAft_DiningTable", (-2.60, 0.0, 1.20), (0.50, 0.74, 0.04), mat_walnut, bevel=0.008)

    # --- 3. SUN DECK (z = 1.55) ---
    sd_xr, sd_xf = -3.60, 1.85
    sd_wr, sd_wm, sd_wf = 0.88, 0.98, 0.60
    build_deck_slab("SunDeck_Fascia", sd_xr, sd_xf, sd_wr, sd_wm, sd_wf, 1.55, 0.125, mat_super_pearl, bevel=0.022, overhang_taper=0.92)
    build_deck_slab("SunDeck_DarkBelt", -3.58, 1.82, 0.885, 0.985, 0.605, 1.555, 0.028, mat_obsidian, bevel=0.004)
    build_deck_slab("SunDeck_AftTeak", -3.48, -1.45, 0.78, 0.84, 0.82, 1.665, 0.020, mat_teak, bevel=0.005)

    # Sun Deck Enclosed Observation Lounge & Hardtop Canopy (z = 1.68 to 2.05)
    sg_xr, sg_xf = -1.50, 0.65
    sg_wr, sg_wm, sg_wf = 0.58, 0.66, 0.44
    build_deck_slab("SunDeck_Glass", sg_xr, sg_xf, sg_wr, sg_wm, sg_wf, 1.68, 0.33, mat_salon_glass, bevel=0.012, overhang_taper=0.98)
    build_deck_slab("SunDeck_InnerCore", -1.42, 0.52, 0.50, 0.56, 0.36, 1.70, 0.28, mat_warm_glow, bevel=0.008, overhang_taper=0.98)
    add_box("SunDeck_AftGlowDoor", (-1.51, 0.0, 1.84), (0.03, 0.68, 0.28), mat_warm_glow, bevel=0.004)
    for dy in [-0.34, 0.0, 0.34]:
        add_box(f"SunDeck_AftDoorMull_{dy}", (-1.525, dy, 1.84), (0.03, 0.025, 0.30), mat_obsidian, bevel=0.002)
    build_deck_slab("Hardtop_Canopy", -2.35, 0.95, 0.64, 0.74, 0.48, 2.01, 0.09, mat_super_pearl, bevel=0.020, overhang_taper=0.92)
    build_deck_slab("Hardtop_DarkTrim", -2.33, 0.93, 0.645, 0.745, 0.485, 2.015, 0.024, mat_obsidian, bevel=0.003)
    build_deck_slab("Hardtop_Soffit", -2.25, 0.85, 0.60, 0.70, 0.44, 1.99, 0.02, mat_ceiling_soffit, bevel=0.004)

    # Sun Deck Aft Lounge Sunpads & Forward Observation Sofa
    for side in [-1, 1]:
        add_box(f"SunDeck_AftPad_{side}", (-2.75, side * 0.42, 1.72), (0.82, 0.28, 0.085), mat_cushion_linen, bevel=0.012)
    add_box("SunDeck_AftSettee", (-3.28, 0.0, 1.72), (0.22, 0.84, 0.085), mat_cushion_linen, bevel=0.012)
    add_box("SunDeck_FwdLounge", (1.15, 0.0, 1.72), (0.42, 0.72, 0.085), mat_cushion_linen, bevel=0.012)

    # --- 4. FOREDECK PORTUGUESE BRIDGE, SUNPADS & WINDLASS HARDWARE ---
    build_deck_slab("Foredeck_Coachroof", 2.35, 4.75, 0.72, 0.56, 0.22, 0.68, 0.12, mat_super_pearl, bevel=0.016)
    for side in [-1, 1]:
        add_box(f"Foredeck_Sunpad_{side}", (3.55, side * 0.23, 0.81), (1.18, 0.34, 0.07), mat_cushion_linen, bevel=0.012)
        add_cylinder(f"Bow_Windlass_{side}", (5.05, side * 0.18, 0.78), 0.05, 0.04, 0.07, mat_stainless)
        add_cylinder(f"Bow_Bollard_{side}", (5.45, side * 0.14, 0.79), 0.02, 0.02, 0.06, mat_stainless)
    add_box("Foredeck_BowSeat", (4.45, 0.0, 0.79), (0.30, 0.48, 0.07), mat_cushion_linen, bevel=0.010)
    add_cylinder("Bow_Jackstaff", (5.92, 0.0, 0.90), 0.009, 0.005, 0.36, mat_stainless)

    # --- 5. CONFORMAL SWEPT ARCHITECTURAL FASHION PLATES & BLACK WING ARCHES ---
    for side in [-1, 1]:
        # 1. Main-to-Bridge Aft Pearl Swept Fashion Plate
        add_conformal_fashion_pillar(
            f"FashionPlate_Main_{side}",
            x_bot_rear=-3.28, x_bot_front=-2.62,
            x_top_rear=-2.82, x_top_front=-2.22,
            xr_bot=ms_xr, xf_bot=ms_xf, wr_b=ms_wr, wm_b=ms_wm, wf_b=ms_wf,
            xr_top=bd_xr, xf_top=bd_xf, wr_t=bd_wr * 0.92, wm_t=bd_wm * 0.92, wf_t=bd_wf * 0.92,
            side=side, z_bot=0.53, z_top=1.01, thickness=0.045, mat=mat_super_pearl, bevel=0.010
        )
        # 2. Main-to-Bridge Midship Obsidian Black Structural Wing Pillar
        add_conformal_fashion_pillar(
            f"BlackWing_Main_{side}",
            x_bot_rear=-1.68, x_bot_front=-1.10,
            x_top_rear=-1.22, x_top_front=-0.68,
            xr_bot=ms_xr, xf_bot=ms_xf, wr_b=ms_wr, wm_b=ms_wm, wf_b=ms_wf,
            xr_top=ms_xr, xf_top=ms_xf, wr_t=ms_wr, wm_t=ms_wm, wf_t=ms_wf,
            side=side, z_bot=0.53, z_top=1.01, thickness=0.045, mat=mat_obsidian, bevel=0.008
        )
        # 3. Bridge-to-SunDeck Aft Pearl Swept Fashion Plate
        add_conformal_fashion_pillar(
            f"FashionPlate_Bridge_{side}",
            x_bot_rear=-2.35, x_bot_front=-1.80,
            x_top_rear=-1.95, x_top_front=-1.45,
            xr_bot=sl_xr, xf_bot=sl_xf, wr_b=sl_wr, wm_b=sl_wm, wf_b=sl_wf,
            xr_top=sd_xr, xf_top=sd_xf, wr_t=sd_wr * 0.92, wm_t=sd_wm * 0.92, wf_t=sd_wf * 0.92,
            side=side, z_bot=1.12, z_top=1.56, thickness=0.042, mat=mat_super_pearl, bevel=0.010
        )
        # 4. Bridge-to-SunDeck Obsidian Black Structural Wing
        add_conformal_fashion_pillar(
            f"BlackWing_Bridge_{side}",
            x_bot_rear=-1.05, x_bot_front=-0.55,
            x_top_rear=-0.68, x_top_front=-0.20,
            xr_bot=sl_xr, xf_bot=sl_xf, wr_b=sl_wr, wm_b=sl_wm, wf_b=sl_wf,
            xr_top=sl_xr, xf_top=sl_xf, wr_t=sl_wr, wm_t=sl_wm, wf_t=sl_wf,
            side=side, z_bot=1.12, z_top=1.56, thickness=0.042, mat=mat_obsidian, bevel=0.008
        )
        # 5. SunDeck-to-Hardtop Signature Black Architectural Arch
        add_conformal_fashion_pillar(
            f"BlackArch_SunDeck_{side}",
            x_bot_rear=-1.35, x_bot_front=-0.75,
            x_top_rear=-0.95, x_top_front=-0.40,
            xr_bot=sg_xr, xf_bot=sg_xf, wr_b=sg_wr, wm_b=sg_wm, wf_b=sg_wf,
            xr_top=sg_xr, xf_top=sg_xf, wr_t=sg_wr, wm_t=sg_wm, wf_t=sg_wf,
            side=side, z_bot=1.67, z_top=2.02, thickness=0.045, mat=mat_obsidian, bevel=0.008
        )

    # --- 6. GLASS BALUSTRADE RAILINGS WITH STAINLESS STANCHIONS ---
    add_balustrade_with_stanchions("Bal_Main_Port", -4.82, 1.13, -3.25, 1.16, 0.53, 0.18, 5)
    add_balustrade_with_stanchions("Bal_Main_Stbd", -4.82, -1.13, -3.25, -1.16, 0.53, 0.18, 5)
    add_balustrade_with_stanchions("Bal_Bridge_Rear", -4.36, -0.94, -4.36, 0.94, 1.13, 0.18, 6)
    add_balustrade_with_stanchions("Bal_Bridge_Port", -4.36, 0.94, -2.35, 1.00, 1.13, 0.18, 5)
    add_balustrade_with_stanchions("Bal_Bridge_Stbd", -4.36, -0.94, -2.35, -1.00, 1.13, 0.18, 5)
    add_balustrade_with_stanchions("Bal_Sun_Rear", -3.46, -0.76, -3.46, 0.76, 1.67, 0.17, 5)
    add_balustrade_with_stanchions("Bal_Sun_Port", -3.46, 0.76, -1.75, 0.82, 1.67, 0.17, 4)
    add_balustrade_with_stanchions("Bal_Sun_Stbd", -3.46, -0.76, -1.75, -0.82, 1.67, 0.17, 4)
    add_balustrade_with_stanchions("Bal_Bow_Port", 3.20, 0.88, 5.75, 0.14, 0.68, 0.16, 7)
    add_balustrade_with_stanchions("Bal_Bow_Stbd", 3.20, -0.88, 5.75, -0.14, 0.68, 0.16, 7)

    # --- 7. SWEPT BLACK RADAR MAST, TWIN SATCOM DOMES & ANTENNA ARRAY ---
    verts_m = [
        (-1.25, -0.09, 2.08), (-0.65, -0.09, 2.08), (-0.65, 0.09, 2.08), (-1.25, 0.09, 2.08),
        (-1.42, -0.09, 2.76), (-0.95, -0.09, 2.76), (-0.95, 0.09, 2.76), (-1.42, 0.09, 2.76),
    ]
    faces_m = [(0,1,2,3), (7,6,5,4), (3,2,6,7), (1,0,4,5), (2,1,5,6), (0,3,7,4)]
    create_mesh_obj("RadarMast_Pylon", verts_m, faces_m, mat_obsidian, auto_smooth_deg=35, bevel_width=0.012)
    add_box("RadarMast_CrossBar", (-1.15, 0.0, 2.34), (0.24, 1.24, 0.05), mat_obsidian, bevel=0.01)
    for side in [-1, 1]:
        add_cylinder(f"Satcom_Base_{side}", (-1.15, side * 0.46, 2.39), 0.06, 0.05, 0.08, mat_obsidian)
        bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=24, radius=0.145, location=(-1.15, side * 0.46, 2.52))
        dome = bpy.context.active_object
        dome.name = f"Satcom_Dome_{side}"
        dome.data.materials.append(mat_obsidian)
        for p in dome.data.polygons:
            p.use_smooth = True
        bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=16, radius=0.065, location=(-1.18, side * 0.22, 2.70))
        mdome = bpy.context.active_object
        mdome.name = f"Mini_Dome_{side}"
        mdome.data.materials.append(mat_obsidian)
        for p in mdome.data.polygons:
            p.use_smooth = True
        add_cylinder(f"VHF_Whip_{side}", (-1.18, side * 0.56, 2.86), 0.006, 0.002, 0.95, mat_obsidian)

    add_box("Radar_Scanner_Pedestal", (-0.95, 0.0, 2.78), (0.08, 0.08, 0.08), mat_obsidian, bevel=0.005)
    add_box("Radar_Scanner_Array", (-0.95, 0.0, 2.84), (0.09, 0.74, 0.045), mat_super_pearl, bevel=0.008)
    add_cylinder("Mast_Spire", (-1.18, 0.0, 3.04), 0.026, 0.010, 0.68, mat_obsidian)
    add_box("Mast_Yardarm_1", (-1.18, 0.0, 3.12), (0.024, 0.46, 0.024), mat_obsidian, bevel=0.003)
    add_box("Mast_Yardarm_2", (-1.18, 0.0, 3.26), (0.020, 0.28, 0.020), mat_obsidian, bevel=0.003)
    add_cylinder("Mast_AnchorLight", (-1.18, 0.0, 3.40), 0.022, 0.022, 0.04, mat_warm_glow)

    # --- 8. STERN ENSIGN FLAGPOLE & ITALIAN YACHT ENSIGN ---
    add_cylinder("Stern_Flagpole", (-4.86, 0.0, 0.74), 0.015, 0.009, 0.62, mat_stainless, rot_euler=(0, -0.45, 0))
    add_box("Ensign_Green", (-4.96, 0.02, 0.84), (0.08, 0.012, 0.17), mat_flag_green, bevel=0.002, rot_euler=(0.15, -0.35, 0.1))
    add_box("Ensign_White", (-5.03, 0.03, 0.79), (0.08, 0.012, 0.17), mat_flag_white, bevel=0.002, rot_euler=(0.18, -0.35, 0.12))
    add_box("Ensign_Red", (-5.10, 0.04, 0.74), (0.08, 0.012, 0.17), mat_flag_red, bevel=0.002, rot_euler=(0.20, -0.35, 0.14))

build_superstructure()

# Export to GLB
output_path = r"C:\Yacht Broker Service\public\models\superyacht.glb"
os.makedirs(os.path.dirname(output_path), exist_ok=True)

bpy.ops.export_scene.gltf(
    filepath=output_path,
    export_format='GLB',
    export_apply=True,
    export_yup=True,
    export_materials='EXPORT'
)
print("SUCCESS_EXPORT_GLB:", output_path)
