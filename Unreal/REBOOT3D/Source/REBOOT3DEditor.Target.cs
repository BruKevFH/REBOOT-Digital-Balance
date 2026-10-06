using UnrealBuildTool;
using System.Collections.Generic;
public class REBOOT3DEditorTarget : TargetRules
{
    public REBOOT3DEditorTarget(TargetInfo Target) : base(Target)
    {
        Type = TargetType.Editor;
        DefaultBuildSettings = BuildSettingsVersion.V5;
        IncludeOrderVersion = EngineIncludeOrderVersion.Unreal5_6;
        ExtraModuleNames.Add("REBOOT3D");
    }
}
