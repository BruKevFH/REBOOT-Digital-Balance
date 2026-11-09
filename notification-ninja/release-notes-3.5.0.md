# Notification Ninja 3.5.0 — illustrated release

This release ensures the new illustrated dojo landscape, winding career map,
and earned XP/skin/boss animations are published as the **actual browser bundle**
rather than only as unbuilt source. It replaces 3.4.0 service-worker caches,
uses network-first fetching for mutable UI assets (offline fallback retained),
and distributes a matching 3.5.0 ZIP.

The asset commit is staged into this release branch before merge, so a normal
GitHub Pages build from the merge receives the **already-generated dist files**.
