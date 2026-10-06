[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$EngineRoot,

    [ValidateNotNullOrEmpty()]
    [string]$ArchiveDirectory = (Join-Path ([System.IO.Path]::GetTempPath()) "REBOOT3D-Builds\Windows")
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$ProjectFile = Join-Path $ProjectRoot "REBOOT3D.uproject"
$EngineRoot = (Resolve-Path -LiteralPath $EngineRoot).Path
$RunUAT = Join-Path $EngineRoot "Engine\Build\BatchFiles\RunUAT.bat"
$ArchiveDirectory = [System.IO.Path]::GetFullPath($ArchiveDirectory)

foreach ($RequiredFile in @($ProjectFile, $RunUAT)) {
    if (-not (Test-Path -LiteralPath $RequiredFile -PathType Leaf)) {
        throw "Required file missing: $RequiredFile. Use an installed Unreal Engine 5.6."
    }
}
foreach ($Asset in @("Content\REBOOT\Materials\M_REBOOT.uasset", "Content\REBOOT\Maps\L_REBOOT.umap")) {
    if (-not (Test-Path -LiteralPath (Join-Path $ProjectRoot $Asset) -PathType Leaf)) {
        throw "Missing $Asset. Run Scripts\PrepareProject.ps1 first."
    }
}

# A fresh archive prevents an EXE from an earlier run from satisfying validation.
# Keep older successful packages intact instead of deleting or replacing them.
[System.IO.Directory]::CreateDirectory($ArchiveDirectory) | Out-Null
$PackageId = "{0}-{1}" -f (Get-Date -Format "yyyyMMdd-HHmmss"), ([System.Guid]::NewGuid().ToString("N"))
$RunArchiveDirectory = Join-Path $ArchiveDirectory "REBOOT3D-$PackageId"
New-Item -Path $RunArchiveDirectory -ItemType Directory -ErrorAction Stop | Out-Null

Write-Host "Building, cooking and packaging the Windows Development game..."
& $RunUAT "BuildCookRun" "-project=$ProjectFile" "-platform=Win64" "-clientconfig=Development" "-build" "-cook" "-stage" "-pak" "-archive" "-archivedirectory=$RunArchiveDirectory" "-map=/Game/REBOOT/Maps/L_REBOOT" "-prereqs" "-unattended" "-nop4" "-utf8output"
if ($LASTEXITCODE -ne 0) {
    throw "Windows packaging failed (exit $LASTEXITCODE). Check the Unreal Automation Tool output above."
}

$Executables = @(Get-ChildItem -LiteralPath $RunArchiveDirectory -Recurse -File -Filter "REBOOT3D.exe")
if ($Executables.Count -eq 0) {
    throw "Packaging returned success, but no REBOOT3D.exe was found in this run's fresh archive: $RunArchiveDirectory. Inspect the Automation Tool log."
}
Write-Host "Windows package created. Keep all files in the archive together."
Write-Host "Executable: $($Executables[0].FullName)"
Write-Host "Archive: $RunArchiveDirectory"
