# GitHub Pages veröffentlichen

Das Projekt ist eine statische Website ohne Build-Schritt. `index.html` liegt im Repository-Root.

## Einmalige Einstellung

Im Repository **BruKevFH/REBOOT-Digital-Balance**:

1. **Settings → Pages** öffnen.
2. Unter **Build and deployment** die **Source** auf **Deploy from a branch** setzen.
3. **Branch: main**, **Folder: /(root)** wählen und **Save** drücken.

Danach veröffentlicht GitHub neue Commits auf `main` automatisch. Den Status findest du auf derselben Pages-Seite und in **Actions** bei „pages build and deployment“.

Vorgesehene Adresse: **https://brukevfh.github.io/REBOOT-Digital-Balance/**

## Technische Hinweise

- Alle Assets verwenden relative Pfade; die Navigation verwendet URL-Hashes.
- `.nojekyll` verhindert eine unnötige Jekyll-Verarbeitung.
- HTTPS wird von GitHub Pages bereitgestellt und ermöglicht den Service Worker.
- GitHub Pages führt weder Node.js noch SQLite aus. Das Backend im Ordner `server/` bleibt optional.
- Bei Änderungen an gecachten Assets die Version in `sw.js` erhöhen. Alte Tabs schließen, damit der aktualisierte Service Worker aktiv werden kann.
- Profil und Spielstände sind pro Browser-Origin gespeichert. Ein Wechsel von localhost auf GitHub Pages übernimmt lokale Daten nicht automatisch.
