# REBOOT 3D unter Windows einrichten

Dieses Verzeichnis enthält ein echtes Unreal-Engine-5.6-C++-Quellprojekt für einen 3D-Prototyp. Ein fertig kompilierter und getesteter Windows-Build liegt noch nicht vor. Die bisherige Web-App bleibt daneben im Repository erhalten.

In der Linux-Cloud ist Unreal Engine nicht installiert. Deshalb sind hier weder die Unreal-C++-Kompilierung noch das Rendering im Editor oder ein Windows-Paket geprüft. Der Material-Generator wird hier nur auf Python-Syntax geprüft; die PowerShell-Helfer werden als Quelltext geprüft. Die folgenden Schritte führen die tatsächlichen Engine-Prüfungen auf deinem Windows-Rechner aus.

## Voraussetzungen

- Windows 10/11 auf einem 64-Bit-Rechner mit einer für Unreal geeigneten Grafikkarte und ausreichend freiem Speicher für Engine, Projekt und Build-Ausgaben.
- **Unreal Engine 5.6**, über den Epic Games Launcher installiert. Der Engine-Ordner ist beispielsweise `C:\Program Files\Epic Games\UE_5.6`.
- **Visual Studio 2022** mit der Workload **Spieleentwicklung mit C++**, MSVC-C++-Buildtools und Windows-SDK. Nutze die von UE 5.6 unterstützte Toolchain; bei einem Versionsfehler nennt UnrealBuildTool die benötigte Version.
- Ein lokaler Checkout dieses Repositories. Keine GitHub- oder Epic-Zugangsdaten in Projektdateien oder Skripte eintragen.

Die enthaltenen Helfer installieren keine Engine und keine Compiler. Windows-Editor, Spiel und Paket laufen lokal; GitHub Pages führt keine Unreal-Windows-Anwendung aus.

## Projekt vorbereiten

Öffne PowerShell im Repository-Root und passe nur den Engine-Pfad an deine Installation an:

```powershell
.\Unreal\REBOOT3D\Scripts\PrepareProject.ps1 -EngineRoot "C:\Program Files\Epic Games\UE_5.6"
```

Das Skript baut zuerst das Editor-Target `REBOOT3DEditor`. Danach startet es den echten Unreal-Editor ohne Fenster, um den Python-Generator auszuführen. Auch Engine- und Projektpfade mit Leerzeichen werden unterstützt.

Der Generator erzeugt diese Dateien, falls sie noch fehlen:

- `Content/REBOOT/Materials/M_REBOOT.uasset`: beleuchtetes Material mit `Tint` für die Grundfarbe und `Glow` für die Emission; Roughness 0,6, Metallic 0,15.
- `Content/REBOOT/Maps/L_REBOOT.umap`: leere Startkarte. `RebootGameMode` erzeugt `RebootWorld` beim Spielstart; die Karte enthält deshalb keinen zusätzlichen World-Actor.

Vorhandene Materialien und Karten bleiben erhalten. Ein erneuter Aufruf löscht keine Inhalte. Wenn du diese Assets verändert hast, setzt das Skript deine Änderungen nicht zurück.

## Im Editor spielen

Öffne `Unreal/REBOOT3D/REBOOT3D.uproject` mit Unreal Engine 5.6. Warte auf eventuell erforderliche Shader-Kompilierung und drücke **Play**. Klicke in das Spielfenster, damit Maus und Tastatur dort ankommen. **Shift + F1** gibt im Editor den Mauszeiger frei.

| Taste | Funktion |
| --- | --- |
| WASD | Bewegen |
| Maus | Umsehen |
| Linke Umschalttaste | Sprinten |
| E | Gespräch am aktuellen Hub starten, wenn du höchstens 2,6 Meter entfernt bist |
| 1 / 2 / 3 | Im Startmenü einen Spielmodus, im Dialog eine Entscheidung, im Memory-Minispiel ein Eingabefeld oder im Lab eines der ersten drei Module wählen |
| F | Das nächste der vier Minigames starten; jeder Typ ist einmal pro Spieltag verfügbar |
| Leertaste | Aktion im Minigame; im Lab durch alle fünf Module wechseln |
| Tab | MedTech-Lab öffnen |
| Enter | Im Startmenü einen gespeicherten Run fortsetzen; im Lab das ausgewählte Modul kaufen; nach Abschluss oder in der Pause ins Startmenü wechseln |
| Esc | Pause öffnen/schließen; einen Dialog abbrechen oder das Lab schließen |
| F5 | Lokale JSON-Zusammenfassung exportieren |

Mit **Tab** kannst du das Lab auch wieder schließen. Ein Wechsel aus der Pause ins Startmenü löscht den aktuellen Run nicht. Die aktuellen Aktionen stehen außerdem im HUD. Profildaten werden über Unreal SaveGame lokal gespeichert; es werden keine Cloud-Zugangsdaten benötigt.

## Windows-Paket erstellen

Führe zuerst die Vorbereitung aus. Danach baut Unreal Automation Tool ein **Development**-Paket samt benötigter Karte und Assets:

```powershell
.\Unreal\REBOOT3D\Scripts\PackageWindows.ps1 -EngineRoot "C:\Program Files\Epic Games\UE_5.6" -ArchiveDirectory "$env:USERPROFILE\Games\REBOOT3D-Build"
```

Jeder Aufruf erzeugt einen neuen Unterordner `REBOOT3D-<Zeitstempel>-<ID>` innerhalb von `-ArchiveDirectory`. Frühere Pakete bleiben erhalten. Ohne `-ArchiveDirectory` ist der Archiv-Root `%TEMP%\REBOOT3D-Builds\Windows`, außerhalb des Checkouts. Das Paketieren kann länger dauern als der Editor-Build. Das Skript meldet Erfolg erst, wenn Automation Tool erfolgreich endet und ausschließlich im neu erstellten Unterordner eine `REBOOT3D.exe` gefunden wurde. Eine EXE aus einem früheren Aufruf zählt nicht. Das Skript prüft damit das erzeugte Paket, führt das Spiel aber nicht automatisch aus.

Starte die gemeldete EXE und behalte die übrigen Archivdateien daneben. Nur die EXE allein zu kopieren reicht nicht. Ein Development-Paket ist eine Testversion; Veröffentlichung und Shipping-Konfiguration sind ein eigener Schritt.

## Lokale Prüfung und Fehlerdiagnose

Prüfe nach erfolgreicher Vorbereitung den Start der 3D-Welt, Bewegung und Kamera, einen NPC-Dialog, die Auswahl 1/2/3, ein Minigame, das Lab, Pause und die Speicherung nach einem Neustart. Prüfe dieselben Abläufe anschließend im erzeugten Windows-Paket.

- **Build fehlt oder schlägt fehl:** Engine-Pfad und Visual-Studio-Workload prüfen. Die konkrete Fehlermeldung von UnrealBuildTool steht direkt in der PowerShell-Ausgabe.
- **Material oder Karte fehlt:** `PrepareProject.ps1` erneut ausführen. Der Generator benötigt die im Projekt aktivierten Editor-Plugins `PythonScriptPlugin` und `EditorScriptingUtilities`. Editor-Protokolle liegen unter `Saved/Logs`.
- **Editor startet, aber die Karte bleibt leer:** Sicherstellen, dass `/Game/REBOOT/Maps/L_REBOOT` geöffnet und `RebootGameMode` die aktive GameMode-Klasse ist. Die Welt entsteht erst nach **Play**.
- **Paketieren schlägt fehl:** Die erste konkrete Build-/Cook-Fehlermeldung in der Ausgabe von Automation Tool prüfen. Das Skript behauptet bei einem Fehler keinen fertigen Build.

Die Quellprojektdateien ersetzen keine erfolgreiche Kompilierung und keinen Test auf einem Windows-Rechner mit Unreal Engine.
