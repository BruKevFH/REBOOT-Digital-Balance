# Abgleich mit den Konzeptanforderungen

Grundlage ist die bereitgestellte Projektabgabe 2. Das Spiel heißt **Notification Ninja**; die finale Wortmarke verwendet keinen zusätzlichen Slogan. Die Mock-ups bestimmen Farben, Raumgestaltung und Ablauf. Szenen sind Illustrationen; Auswahl, Würfe, Schnittprüfung, Anzeigen und Ergebnisse sind echte interaktive Spielbestandteile.

| ID | Umsetzung | Technische Prüfung / verbleibender Nachweis |
| --- | --- | --- |
| F01 | Direktstart als Gast, erreichbare Hilfe, NIM-Training und Beispiele vor jeder Situation | Browserablauf und Schulungsdialoge; Verständnis mit Jugendlichen noch prüfen |
| F02 | Drei kostenlose Situationskarten für Lernen, Gaming und Schlafen, mit passendem Ziel | Alle drei Kontexte ohne Namen und Raumkauf gestartet |
| F03 | Gehaltene Maus oder Fingerwischbewegung; hilfreiche Inhalte bewusst durchlassen | Tatsächliche Maus-/Touch-Schnitte, Punkte und Herzverlust geprüft |
| F04 | Punkte, richtige Entscheidungen, Fehler und kurze Text-/Symbolhinweise | Reale richtige und falsche Eingaben ändern die Anzeigen |
| F05 | Pause, Fortsetzen und bewusstes Beenden direkt erreichbar | Zeit, Objekte und Effekte stehen während Pause still; vorzeitiger Abschluss sichert Münzen nur einmal |
| F06 | Ergebnis mit kurzer situationsbezogener Frage; gleichwertiger Neustart und Ausstieg | Auswahl ist freiwillig, ohne Freitext, Pflichtantwort oder Belohnungsdruck |
| NF01 | Kurze Sätze, klare Symbole, konkretes Beispiel, ruhige Ansicht | Technisch umgesetzt; Erklärung der Grundregel durch Testpersonen noch nicht erhoben |
| NF02 | Große Schaltflächen, sichtbarer Fokus und lesbare Beschriftungen | Aktive Hauptbedienziele in den geprüften Ansichten mindestens 44 × 44 CSS-Pixel |
| NF03 | Dorfkarte auf Desktop; Situationskarten auf schmalen Geräten | 360/390/844/1280 px geprüft, kein Querscrollen oder verdeckte Kernbedienung |
| NF04 | Text und Symbol ergänzen Farbe; Ton-Aus, ruhige Effekte und reduzierte Bewegung | Deutsch/Englisch, echte Fehler im ruhigen Modus, Bild-/Kameraeffekte und Pause geprüft |
| NF05 | Begrenzte gleichzeitige Objekte in Kurzrunden; gecachte Illustrationen, sofortige Eingabeverarbeitung | Cloud-Chromium-Prüfung und Renderzeiten; 30-FPS-Ziel auf dem noch festzulegenden physischen Testgerät offen |
| NF06 | Vollständige Runde ohne E-Mail, Klarnamen oder Registrierung | Tatsächliche vollständige Gast-Lernrunde; freiwilliger Alias erst für ausdrücklich veröffentlichte Ranglisteneinträge |

Die drei Kurzrunden bilden den einfachen Kernablauf. Karriere, Bosse, Fähigkeiten und Sammlungen bleiben als aufklappbare Erweiterung erhalten. Bereits gespeicherte Namen, Münzen und Freischaltungen werden nicht durch die neue Oberfläche ersetzt.

Für die nächste Nutzungsprüfung sollten Jugendliche nach der Einführung die Regel mit eigenen Worten erklären und je eine kurze Runde per Touch spielen. Gerät, Browser und Messmethode für das 30-FPS-Ziel sind vorher festzulegen. Diese ausstehenden Prüfungen werden nicht durch Browseremulation oder reine Renderzeitmessungen ersetzt.
