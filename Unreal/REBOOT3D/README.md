# REBOOT – Neon Balance (Unreal Engine 5)

Ein natives 3D-Campus-Abenteuer für Windows, als **erster Unreal-C++-Prototyp**. Der Quellcode und die engineunabhängigen Spielregeln sind vorhanden. **Ein gestarteter Unreal-Editor, geprüfte Grafik oder eine fertige Windows-EXE sind noch nicht nachgewiesen**, weil Unreal Engine in der Cloud fehlt.

## Die Spielidee

Du bewegst dich aus der First-Person-Perspektive durch einen stilisierten Neon-Campus: Schule, LOOP Plaza, Reset Park, FocusBand Lab, One More Arena und Night Garden. Leuchtende Bodenflächen zeigen den nächsten Ort. Dort triffst du Nora, Mia, Sami oder Leon und entscheidest über Fokus, Freunde, Gaming, Social Media und Schlaf. Jede Entscheidung verändert fünf Werte und die Beziehung zum jeweiligen NPC.

Die Welt wird aus echten Unreal-Meshes, dynamischen Materialien, Lichtern und Nebel erzeugt. Dafür werden weder Marketplace-Assets noch Downloads fremder Modelle benötigt. Es ist eine bewusst einfache, geometrische erste Fassung; eigene Charaktermodelle, Animationen, Musik und umfangreiche filmische Story-Szenen sind weitere Entwicklungsarbeit.

## Im Quellcode enthalten

- First-Person-Steuerung, Mausblick, Sprint, Kollision und sechs Campus-Orte
- 21-Tage-Story mit Kapiteln, Endless-Modus und dreitägige Daily Challenge
- Sechs Entscheidungen pro Tag, vier NPCs und Beziehungen
- Focus Rush mit anvisierbaren Zielen im 3D-Raum
- Notification Shield mit wichtigen und unwichtigen Nachrichten
- Signal Calibration mit Timing-Fenster und vier Messversuchen
- Memory Pulse mit fünfteiliger Sequenz für die Tasten 1/2/3
- XP, Chips, Level, Achievements und fünf kaufbare Lab-Module
- Lokale Unreal-SaveGame-Datei und JSON-Zusammenfassung mit F5
- Kontextabhängiges HUD, Dialoge, Pause und Fortsetzen

Diese Liste beschreibt implementierten Quellcode, keine bestandenen Engine-Integrationstests. Die Story verwendet 21 Kapiteltitel und wiederkehrende Entscheidungsszenen; sie ist noch keine ausproduzierte 21-tägige Kampagne.

## Auf Windows vorbereiten und spielen

Installiere **Unreal Engine 5.6** und **Visual Studio 2022 mit Spieleentwicklung in C++ und Windows-SDK**. Dann im Repository-Root:

```powershell
.\Unreal\REBOOT3D\Scripts\PrepareProject.ps1 -EngineRoot "C:\Program Files\Epic Games\UE_5.6"
```

Das baut das Editor-Modul und erstellt die erforderliche Startkarte und das Material im echten Unreal Editor. Anschließend `REBOOT3D.uproject` öffnen und **Play** starten. Die Karte wird erst bei Play zur begehbaren Welt.

Die vollständige Anleitung mit Steuerung und Windows-Paketierung steht in [SETUP_WINDOWS.md](SETUP_WINDOWS.md).

## Struktur

```text
REBOOT3D.uproject
Config/                     # Engine, Renderer, Eingabe und Packaging
Content/                    # Material und Karte nach PrepareProject
Scripts/                    # Editor-Generator und Windows-Build-Helfer
Source/REBOOT3D/Public/      # Gameplay-Klassen, SaveGame und portable Regeln
Source/REBOOT3D/Private/     # 3D-Welt, Spieler, GameMode und HUD
Tests/reboot_rules_test.cpp # Ausführbare Tests ohne Unreal-Abhängigkeit
```

Generierte `Content/*.uasset`- und `*.umap`-Dateien sollten nach erfolgreicher Erstellung und Prüfung versioniert werden. Binaries, Intermediate, DerivedDataCache, Saved und lokale Projektdateien sind ignoriert. Die Generierung überschreibt keine bestehenden Karten oder Materialien.

## Hier ausgeführte Prüfungen

```sh
g++ -std=c++17 -Wall -Wextra -Werror -pedantic Tests/reboot_rules_test.cpp -o /tmp/reboot_rules_test
/tmp/reboot_rules_test
```

**762 Prüfungen bestehen**, darunter 126 Story-Entscheidungen, 18 Daily-Entscheidungen, Endless-Fortschritt, Wertebegrenzung, Minigame-Belohnungen und Modul-Käufe. Projekt-JSON, Dateiverweise und die Python-Syntax des Asset-Generators werden ebenfalls geprüft.

Die Tests ersetzen keinen Unreal-Build: UHT, Unreal-spezifische C++-Kompilierung, Material- und Kartenerzeugung, Grafik, Eingaben, SaveGame-Serialisierung und Windows-Paketierung bleiben auf dem Windows-Rechner auszuführen. Die PowerShell-Helfer sind hier nur als Quellcode geprüft.

## Daten

Spieldaten werden lokal gespeichert. Ein JSON-Export landet unter `Saved/Exports/reboot-profile.json`. Es werden keine echten Gesundheitsdaten benötigt oder Server-Aufrufe gesendet. REBOOT ist ein vereinfachtes Lernmodell und kein Medizinprodukt.
