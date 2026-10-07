# REBOOT auf GitHub Pages veröffentlichen

GitHub Pages ist für **BruKevFH/REBOOT-Digital-Balance** bereits auf **Branch `main`, Ordner `/(root)`** eingestellt. Die Website-Adresse lautet:

**https://brukevfh.github.io/REBOOT-Digital-Balance/**

## Eine neue Version veröffentlichen

Im Repository-Root:

```sh
npm ci
npm run build
npm test
npm run package
```

Danach die Änderungen einschließlich **`dist/`**, **`downloads/`** und gegebenenfalls der aktualisierten Cache-Version in **`sw.js`** committen und auf `main` pushen. GitHub veröffentlicht anschließend die statischen Dateien automatisch. Den Status zeigt **Actions → pages build and deployment**; die veröffentlichte Adresse steht auch unter **Settings → Pages**.

Die Pages-Veröffentlichung führt keinen npm-Build aus. Sie verwendet das bereits gebündelte `dist/reboot.js` im Repository. Three.js liegt im Bundle; externe CDNs, API-Schlüssel und ein Backend werden zum Spielen nicht benötigt.

## Veröffentlichungseinstellung prüfen

Falls die Einstellung später geändert wird: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main → Folder: /(root) → Save**.

`index.html` liegt direkt im Root. Stylesheet, Skript, Manifest, Service Worker und Download verwenden relative Pfade und funktionieren auch unter `/REBOOT-Digital-Balance/`. `.nojekyll` lässt GitHub die Dateien ohne Jekyll-Verarbeitung ausliefern.

## Download und Offline-Nutzung

Der Download-Link der Startseite verweist auf **`downloads/REBOOT-Neon-Balance-1.0.0.zip`**. Das Paket wird mit `npm run package` aus den aktuellen Laufzeitdateien erstellt. Zum Spielen die gesamte ZIP-Datei entpacken und `index.html` im Browser öffnen; ein Server ist nicht nötig. Die Datei `START-HIER.txt` liegt bei.

Beim Versionswechsel Paketversion und Download-Link gemeinsam aktualisieren und neu bauen. Das ZIP sowie die zugehörige `.zip.sha256`-Datei müssen ebenfalls auf `main` liegen.

Die Online-Version verwendet HTTPS und einen Service Worker. Bei Änderungen an gecachten Dateien die Cache-Version in `sw.js` erhöhen. Falls noch eine alte Version angezeigt wird, alte Spiel-Tabs schließen und die Seite neu öffnen. Online- und Download-Version können getrennte lokale Spielstände haben.

GitHub Pages veröffentlicht das Browserspiel. Die historischen Dateien unter `legacy/`, das optionale Demo-Backend und das ungebaute Unreal-Quellprojekt sind zusätzliche Repository-Inhalte; der Server und die Unreal Engine werden dort nicht ausgeführt.
