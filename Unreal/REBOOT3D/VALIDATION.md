# Prüfstand des Unreal-Prototyps

Stand: 6. Oktober 2026.

## Tatsächlich ausgeführt

- GCC/G++ 14.2, C++17, `-Wall -Wextra -Werror -pedantic`.
- `Tests/reboot_rules_test.cpp`: **762 Prüfungen bestanden**.
- Geprüft: 126 Story- und 18 Daily-Entscheidungen, Endless-Fortschritt, Wertebegrenzungen, Abschluss-Sperren, Minigame-Belohnungen, Modulpreise und 21 Story-Titel.
- `.uproject` als JSON gelesen; Runtime-Modul und Build-Datei vorhanden.
- Projektinterne Include-Verweise und die Position der UHT-generated-Header geprüft.
- Material-Cook-Verzeichnis und GameMode-Konfiguration geprüft.
- `Scripts/create_content.py` mit dem Python-AST-Parser auf Syntax geprüft.
- Native Klassen und Windows-Helfer durch unabhängige Quellcodeprüfung geprüft; dabei gefundene Include-, Belohnungs- und Speicherprobleme korrigiert.

## Noch nicht ausgeführt

- UnrealHeaderTool und UnrealBuildTool für die Unreal-spezifischen Klassen.
- Material-/Map-Generierung im Unreal Editor.
- Start und Rendering der Welt, Kollision, Kamera, Eingabe und HUD.
- Spielabläufe und SaveGame-Serialisierung in Unreal.
- Ausführung der PowerShell-Helfer.
- BuildCookRun und Start einer Windows-EXE.

Die Linux-Cloud stellt keinen zugänglichen Unreal Editor oder Engine-SDK bereit. Deshalb ist das Ergebnis ein Quellprojekt, kein validiertes Windows-Spiel. Die nächsten Engine-Prüfungen erfolgen auf Windows mit Unreal Engine 5.6 und passender C++-Toolchain anhand von `SETUP_WINDOWS.md`.
