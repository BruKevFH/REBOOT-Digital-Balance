# Notification Ninja – illustrierte Art Direction

Die neuen Illustrationen wurden eigens für Notification Ninja anhand der vom Nutzer gelieferten Designreferenz erzeugt. Sie sind lokale Laufzeitdateien und benötigen keinen externen Bilddienst im Spiel.

- `indie-modes.png`: 1536 × 1024; vier gleich hohe Banner, oben nach unten Boss Rush, Tages-Challenge, Zen-Training, Wochenziele. CSS verwendet denselben Atlas ohne zusätzliche Karten-Downloads.
- `indie-worlds.png`: 1536 × 1024; 2 × 2 Dojos: Gaming/Schule, Schlaf/Balance. Derselbe Atlas wird für Weltkarten und die echten Canvas-Spielhintergründe verwendet; das Verhältnis der Motive bleibt beim Cover-Cropping erhalten.
- `indie-scenes.png`: 1536 × 1024; vier neue gemalte Schauplätze (Dorfhof, Laternenbasar, Willkommen im Dojo mit Fuchs-Sensei, Belohnungsschrein). Inline-SVGs verwenden echte Ausschnitt-Koordinaten und `preserveAspectRatio`, damit die Szenen auf allen Formaten unverzerrt bleiben.
- `indie-journeys.png`: 1536 × 1024; eigens erzeugter 2 × 2 Landschaftsatlas für Version 3.12.0. Oben links liegt das sonnige Lern-Tal mit Holzdojos und Steinweg, oben rechts die blau-violette Cyber-Landschaft, unten links der mondhelle Ruhegarten und unten rechts NIMs Trainingsgarten. Die drei Karrierekapitel und der Fokuspfad verwenden getrennte unverzerrte Ausschnitte. Missionsknoten, Fortschritt, Beschriftungen und Aktionen bleiben echte Elemente über der Illustration; die Grafik ersetzt keine Spieldaten und enthält keine bedienbaren Menüs.
- `indie-masthead.png`: Sakura, Ninja, Fuji und Sonne als wiederverwendbare Kopfillustration.
- `indie-wordmark.png`: freigestellte Wortmarke ohne eingebrannten Seitenhintergrund.
- `indie-masthead.svg`: eigenständige lokale Vektorillustration als ergänzendes Dekor.

Beschriftungen und Bedienelemente sind echtes HTML/SVG und werden separat übersetzt; die Grafiken ersetzen keine interaktive Oberfläche. Die älteren Dojo-/Logo-Assets bleiben für bestehende Verweise erhalten.

Die Schrift Nunito ist lokal eingebunden. Ihre Open-Font-Lizenz liegt unter `fonts/OFL-Nunito.txt`; die WOFF2-Dateien stammen aus der Fontsource-Veröffentlichung von Nunito. Es werden keine Google-Fonts- oder CDN-Anfragen zur Laufzeit benötigt.
