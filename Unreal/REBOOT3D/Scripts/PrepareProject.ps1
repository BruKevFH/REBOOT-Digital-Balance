[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$EngineRoot
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$ProjectFile = Join-Path $ProjectRoot "REBOOT3D.uproject"
$Generator = Join-Path $PSScriptRoot "create_content.py"
$EngineRoot = (Resolve-Path -LiteralPath $EngineRoot).Path
$BuildBat = Join-Path $EngineRoot "Engine\Build\BatchFiles\Build.bat"
$EditorCmd = Join-Path $EngineRoot "Engine\Binaries\Win64\UnrealEditor-Cmd.exe"

foreach ($RequiredFile in @($ProjectFile, $Generator, $BuildBat, $EditorCmd)) {
    if (-not (Test-Path -LiteralPath $RequiredFile -PathType Leaf)) {
        throw "Required file missing: $RequiredFile. EngineRoot must point to the UE_5.6 installation folder."
    }
}

Write-Host "Building REBOOT3DEditor with Unreal Engine..."
& $BuildBat "REBOOT3DEditor" "Win64" "Development" "-Project=$ProjectFile" "-WaitMutex" "-FromMsBuild"
if ($LASTEXITCODE -ne 0) {
    throw "Unreal Editor target build failed (exit $LASTEXITCODE). Check the compiler output above."
}

Write-Host "Creating missing material and map assets; existing assets are preserved..."
# Start-Process forwards this command-line string to the editor unchanged.
# Explicit quotes around both paths also support Windows PowerShell 5.1 and spaces.
$EditorArguments = '"{0}" -run=pythonscript -script="{1}" -unattended -nop4 -nosplash -NullRHI -stdout -FullStdOutLogOutput' -f $ProjectFile, $Generator
$EditorProcess = Start-Process -FilePath $EditorCmd -ArgumentList $EditorArguments -NoNewWindow -Wait -PassThru
if ($EditorProcess.ExitCode -ne 0) {
    throw "Unreal content generation failed (exit $($EditorProcess.ExitCode)). Check the editor output and Saved\Logs."
}

foreach ($Asset in @("Content\REBOOT\Materials\M_REBOOT.uasset", "Content\REBOOT\Maps\L_REBOOT.umap")) {
    $AssetFile = Join-Path $ProjectRoot $Asset
    if (-not (Test-Path -LiteralPath $AssetFile -PathType Leaf)) {
        throw "Content generation did not produce the required asset: $AssetFile"
    }
}

Write-Host "Editor target and required assets are ready."
Write-Host "Open this project in Unreal Engine 5.6, then press Play:"
Write-Host $ProjectFile
