"""Create the first-run assets inside the real Unreal Editor (UE 5.6).

Existing assets and maps are preserved. This script does not add world actors:
RebootGameMode creates RebootWorld at runtime.
"""

import unreal


MATERIAL_DIRECTORY = "/Game/REBOOT/Materials"
MATERIAL_PATH = f"{MATERIAL_DIRECTORY}/M_REBOOT"
MAP_DIRECTORY = "/Game/REBOOT/Maps"
MAP_PATH = f"{MAP_DIRECTORY}/L_REBOOT"


def require_success(success, operation):
    if not success:
        raise RuntimeError(f"REBOOT setup failed: {operation}")


def ensure_directory(assets, path):
    if not assets.does_directory_exist(path):
        require_success(assets.make_directory(path), f"create {path}")


def expression(material, expression_class, x, y, **properties):
    node = unreal.MaterialEditingLibrary.create_material_expression(
        material, expression_class, x, y
    )
    if node is None:
        raise RuntimeError(f"Cannot create material node {expression_class}")
    for name, value in properties.items():
        node.set_editor_property(name, value)
    return node


def create_material(assets):
    if assets.does_asset_exist(MATERIAL_PATH):
        material = assets.load_asset(MATERIAL_PATH)
        if not isinstance(material, unreal.Material):
            raise RuntimeError(f"{MATERIAL_PATH} already exists but is not a Material")
        unreal.log(f"REBOOT: preserving existing material {MATERIAL_PATH}")
        return

    ensure_directory(assets, MATERIAL_DIRECTORY)
    material = unreal.AssetToolsHelpers.get_asset_tools().create_asset(
        "M_REBOOT", MATERIAL_DIRECTORY, unreal.Material, unreal.MaterialFactoryNew()
    )
    if material is None:
        raise RuntimeError(f"Cannot create {MATERIAL_PATH}")

    material.set_editor_property("material_domain", unreal.MaterialDomain.MD_SURFACE)
    material.set_editor_property("blend_mode", unreal.BlendMode.BLEND_OPAQUE)
    material.set_editor_property(
        "shading_model", unreal.MaterialShadingModel.MSM_DEFAULT_LIT
    )
    tint = expression(
        material,
        unreal.MaterialExpressionVectorParameter,
        -600,
        -160,
        parameter_name="Tint",
        default_value=unreal.LinearColor(0.08, 0.75, 1.0, 1.0),
    )
    glow = expression(
        material,
        unreal.MaterialExpressionScalarParameter,
        -600,
        100,
        parameter_name="Glow",
        default_value=0.0,
    )
    emissive = expression(material, unreal.MaterialExpressionMultiply, -300, 40)
    roughness = expression(material, unreal.MaterialExpressionConstant, -300, 220, r=0.6)
    metallic = expression(material, unreal.MaterialExpressionConstant, -300, 360, r=0.15)
    editing = unreal.MaterialEditingLibrary
    require_success(
        editing.connect_material_property(tint, "", unreal.MaterialProperty.MP_BASE_COLOR),
        "connect Tint to Base Color",
    )
    require_success(
        editing.connect_material_expressions(tint, "", emissive, "A"),
        "connect Tint to emission multiplier",
    )
    require_success(
        editing.connect_material_expressions(glow, "", emissive, "B"),
        "connect Glow to emission multiplier",
    )
    require_success(
        editing.connect_material_property(
            emissive, "", unreal.MaterialProperty.MP_EMISSIVE_COLOR
        ),
        "connect emission multiplier",
    )
    require_success(
        editing.connect_material_property(
            roughness, "", unreal.MaterialProperty.MP_ROUGHNESS
        ),
        "connect roughness",
    )
    require_success(
        editing.connect_material_property(metallic, "", unreal.MaterialProperty.MP_METALLIC),
        "connect metallic",
    )
    editing.recompile_material(material)
    require_success(assets.save_loaded_asset(material, False), "save material")
    unreal.log(f"REBOOT: created material {MATERIAL_PATH}")


def create_map(assets):
    if assets.does_asset_exist(MAP_PATH):
        unreal.log(f"REBOOT: preserving existing map {MAP_PATH}")
        return
    ensure_directory(assets, MAP_DIRECTORY)
    levels = unreal.get_editor_subsystem(unreal.LevelEditorSubsystem)
    require_success(levels.new_level(MAP_PATH), "create empty REBOOT map")
    require_success(levels.save_current_level(), "save REBOOT map")
    unreal.log(f"REBOOT: created empty runtime map {MAP_PATH}")


def main():
    assets = unreal.get_editor_subsystem(unreal.EditorAssetSubsystem)
    create_material(assets)
    create_map(assets)
    require_success(assets.does_asset_exist(MATERIAL_PATH), "material verification")
    require_success(assets.does_asset_exist(MAP_PATH), "map verification")
    unreal.log("REBOOT setup assets ready. Open the project and press Play.")


if __name__ == "__main__":
    main()
