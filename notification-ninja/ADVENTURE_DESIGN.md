# Notification Ninja 3.11.0 – die Bildwelt im ganzen Spiel

Stand: 17.11.2026. Die vom Nutzer ausdrücklich bestätigte Spielen-Seite bleibt die visuelle Referenz. Dieses Update überträgt deren Bilddichte, gemalte japanische Schauplätze, dunkle Konturen, Papierflächen und plastische Mint-/Gold-Buttons auf die übrigen Ansichten.

## Sichtbare Änderungen

- **Hub:** Ein echter illustrierter Dorfhof integriert den ausgerüsteten animierten Ninja. Level, XP und Münzen sind reale kompakte Medaillons; die nächste Mission zeigt den tatsächlichen Fortschritt. Ein zentraler Spielen-Button bleibt der Einstieg.
- **Homepage und Kontenportal:** Sakura-/Fuji-Kopfbereich, gemalter Dojo-Eingang mit Fuchs-Sensei und ein klarer Papierbereich für die vorhandenen Zugangswege beziehungsweise Formulare. Registrierung, Datenschutz, MFA und Wiederherstellung behalten ihre echten Funktionen. Bestätigt angemeldete Besucher gelangen von der Homepage wieder zur Übersicht statt versehentlich zur Modusauswahl.
- **Basar:** Ein eigener Laternenmarkt ersetzt das flache Kopfschild. Sammlung, Filter und Käufe rücken näher an den Einstieg; Spielorte und Outfits haben gerahmte Vorschauen und nachvollziehbare Preise.
- **Karriere und Rangliste:** Illustrierte Szenenköpfe, kompakter Fortschritt, Missionsüberschriften auf den Landschaften, echte Schlosszeichen und klarere Papier-/Medaillonflächen. Es werden weiterhin nur echte Missionen und veröffentlichte Ergebnisse gezeigt.
- **Spiel:** Die Arena bekommt die volle Breite und einen eigenen Rahmen. Zeit, Münzen, Tempo und die drei Anzeigen liegen in einem kompakten unteren Spielribbon. Pause, SUPER, Erklärungen und bewusstes Stoppen bleiben echte erreichbare Bedienelemente. Die Ninjas erhalten freundlichere Chibi-Proportionen, klare Augen und Masken, Stofflicht und runde Stiefel; alle zwölf Outfits bleiben erkennbar. NIM ist nun durchgängig als freundlicher Fuchs-Sensei mit denselben Animations- und Dialogfunktionen gestaltet.
- **Briefing, Pause, Ergebnis, Profil und Einstellungen:** Zusammengehörige Szenen- und Papierflächen ersetzen die großen grünen Formularplatten. Die Bilder überdecken keine dynamischen Texte oder Kontrollen.

Vier neue eigene Illustrationen liegen in `assets/indie-scenes.png`. `scene-art.js` wählt echte SVG-Ausschnitte mit erhaltenen Proportionen; Texte, Spielerfigur, Werte und Bedienelemente werden separat gerendert. Die Styles sind auf ihre Ansichten begrenzt, damit die bestätigte Spielen-Seite erhalten bleibt. Dark/Noir, reduzierte Animationen, lokale Schriften und Deutsch/Englisch bleiben verfügbar.

## Erhalt von Funktionen und Daten

Konten, Gastprofile, Inventar, Münzen, Freischaltungen, Missionen, dauerhafte IDs, Tageswechsel, Ranglistenprüfung, Transaktionen und Belohnungsregeln werden nicht ersetzt. Das Update verändert die Präsentation. Wurfhand und Projektilkontakt, Flugbahn, Kollisionsmodell und Spielregeln bleiben erhalten. Testdaten sind ausschließlich synthetische lokale Daten.

## Prüfung

- Gesamte lokale Testsuite mit echtem PostgreSQL 17: **463 bestanden, keine Fehler, keine übersprungenen Tests**. Konten, SQLite, PostgreSQL, Migrationen, Belohnungen, Wirtschaft, Replay-Regeln und Spielstände sind damit weiterhin abgedeckt.
- Portal/MFA: **360, 768, 941 und 1280 px** bestanden, einschließlich echter Registrierung, Datenschutz-/Passwortsperren, TOTP-Einrichtung, Anmeldung mit einmaligem Wiederherstellungscode, Deaktivierung und Löschen des Testkontos.
- Vollständige Menüprüfung: dieselben vier Breiten, jeweils 16 Ansichten in Deutsch/Englisch und alle acht Welt-/Moduskarten, bestehende Weltfreischaltungen, alte Links, Browser-Zurück und Erhalt des Gastfortschritts. Keine JS-Fehler, fehlenden Übersetzungen, horizontalen Überläufe oder zu kleinen geprüften Bedienelemente.
- Gameplay: dieselben vier Breiten bestanden, vier echte Maus-/Touch-Runden in den Dojos, alle neun Übungsaufgaben mit tatsächlicher Pointer-Erreichbarkeit, Einstellungen, Reloads und Rückkehr ins Menü. Die neue Anzeige wurde auf einer freien Arena geprüft. Pause und Vollbild wurden nativ betätigt; die Uhr hält an und echte Vollbildwechsel sind bestätigt. Alle sechs Ribbon-Statistiken sind sichtbar. Eine durch kanonische Spielentscheidungen erspielte SUPER-Ladung wurde nativ eingesetzt (100 → 0, Nutzungen 0 → 1, Zeitlupe aktiv). Reduzierte Bewegung verhindert Kameraeffekte. Native Profil-/Wochenziel-Links und Zurück erhalten Münzen und Inventar.
- Figuren: alle zwölf Outfits gerendert, echte Schnitte und beobachtete Wurfphasen bei 360/941 px. Der Hand-/Projektilkontakt bleibt deckungsgleich. NIMs echte Tippwarteschlange, Button und Escape wurden nach dem Fuchs-Redesign geprüft.
- Die bestätigte Spielen-Seite bleibt visuell erhalten: im direkten Vergleich bei 941 px und in beiden vollständigen Seitenscreenshots **0 geänderte Pixel**; im 360-px-Viewport nur 33 Pixel durch Fokus-Antialiasing (0,011 %).
- Neue Homepage und Anmelde-/Registrierungsoberfläche zusätzlich in zwölf DE/EN-Browserfällen bei 360/941 px geprüft; alle drei Themes, lange Profilnamen und Passwortanzeige ebenfalls getestet.

Der Download wurde zweimal identisch erzeugt. CRC und Laufzeitidentität wurden geprüft; nur Account-Konfiguration und deren Metadatum erhalten den vorgesehenen Gast-Overlay. Die mobile Prüfung verwendet emulierte Chromium-Geräte; physische Geräte sind dadurch nicht nachgewiesen.

## Öffentliche Kontenanbindung

Die bestehende aktivierte öffentliche Account-Konfiguration bleibt erhalten. Die separate Account-Domain war im vorigen Auftrag aus dieser Cloud am CONNECT-Tunnel gesperrt. Ein neuer öffentlicher Zwei-Konten-/Neustartnachweis wird daraus nicht behauptet. Dieses Designupdate bestellt keine Anbieterressourcen, verursacht keine neuen Hostingtarife und löscht keine alte Cloud-Umgebung.

Download: `Notification-Ninja-3.11.0.zip`, 20.307.353 Bytes, SHA-256 `d66f35465408095c3e90631da5579c6a211f35a4a97121642ccac67997501b49`.
