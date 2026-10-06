using UnrealBuildTool;
using System.Collections.Generic;
public class REBOOT3DTarget : TargetRules
{
    public REBOOT3DTarget(TargetInfo Target) : base(Target)
    {
        Type = TargetType.Game;
        DefaultBuildSettings = BuildSettingsVersion.V5;
        IncludeOrderVersion = EngineIncludeOrderVersion.Unreal5_6;
        ExtraModuleNames.Add("REBOOT3D");
    }
}
