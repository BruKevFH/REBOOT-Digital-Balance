# Notification Ninja

Current update: [3.13.1 – automatic rankings, readable counters and more compact views](PATCH_3_13_1.md).

**Development candidate 3.13.0, not yet published:** Refined worlds and Gaming views, an Abilities tab in the Bazaar, 18 skills including six Supers, 36 achievements, and twelve outfits with five cosmetic rarity levels. An original 20-second animated ninja story introduces the game. Device-only active playtime and optional break reminders join the settings. A server-managed UTC weekly podium awards 100/60/30 coins. [Scope, migration and pending release checks, German](EXPANSION_3_13.md).

**Published baseline 3.12.0:** Original landscape maps, mobile mission details, NIM’s twelve everyday learning scenarios, the codex, animated outfit previews and factual round coaching are retained. Modes and worlds remain together under Play. [Detailed master prompt, German](ULTIMATE_EXPERIENCE_MASTERPROMPT.md) · [Previous release report, German](EXPERIENCE_RELEASE.md).

**Historical game and page audit from 17 November:** The complete main campaign and other modes were played using native browser inputs; isolated account and economy checks used SQLite and PostgreSQL across real process restarts. The [complete audit report, German](FULL_GAME_AUDIT.md) remains the baseline evidence. Verification of the 3.13.0 expansion is a separate pending step.

**Historical development release 3.1.0:** PostgreSQL alongside local SQLite, a new account portal and Ninja hub, distinct bosses, Boss Rush and server-issued UTC daily runs. Public accounts were enabled following the documented live preflight and operator-confirmed restart/persistence test on 7 November 2026. The 17 November audit records a CONNECT 403 block when directly accessing production from that environment. A new production check for 3.13.0 is pending; local tests and historical online checks are separate evidence. See [historical validation](ULTIMATE_STATUS.md) and [server setup](../server/README_NINJA_APP.md).

An illustrated browser arcade game in **English and German**. Slice distractions and let helpful items pass. Study, Gaming and Sleep use distinct dojo scenes and context rules. No extra brand name or slogan.

[German guide](README.md) · [Requirement matrix](REQUIREMENTS_FULL.md) · [Executed checks and limitations](TEST_REPORT.md)

## Run the complete application locally

Requires Node.js24 and npm; Python3 only for ZIP packaging.

```sh
npm ci
npm run build:ninja
npm run serve:ninja
```

Open **http://127.0.0.1:8083/**. One process serves the frontend and `/api/v3`, and creates the persistent SQLite database at `server/data/ninja.sqlite`. No external credentials or database process are needed. Restarting with the same DATA_DIR preserves accounts and progress.

For static hosting, use `npm run serve` and open port8000. That process provides no account API itself; the website configuration can connect to the public backend. The ZIP includes the complete guest runtime with account connections explicitly disabled; extract all files, then open home.html or serve them over HTTP if the browser restricts local files.

## Play

Guest play needs no name, email or registration. Choose a free short Study, Gaming or Sleep round. Hold the mouse button or swipe with a finger across distractions; leave useful signals untouched. A wrong cut or missed distraction costs a heart. NIM introduces rules in training; only training displays answer hints. Help also includes untimed, unranked button/keyboard practice.

Pause freezes gameplay. Resume or deliberately stop; the result displays actual points, correct decisions and mistakes. Reflection is optional, local and unrewarded. Starting again and taking a break are equally available.

There are **18 main missions**, six per world, with varied goals and short authored durations. Chapter completion unlocks further worlds; old purchased access remains. Eight additional challenges and three Autoplay bosses remain. The collection now has **36 achievements, 18 skills including six Supers, twelve outfits and five cosmetic rarity levels**. Skills are unlocked through **Bazaar → Abilities**, following three branches with six prices each: 35/90/180/240/360/480 coins. Five ranks and daily/weekly tasks remain. Claim rewards explicitly; buying and equipping are separate choices. The first purchased Super becomes the default; later Supers are deliberately selected. Viewing one notification removes it from unread messages without claiming its reward.

**Open Run** is a single mode with three hearts, two throwers, no time limit and gentle continuous acceleration. Purchased skills and Supers are disabled. An early exit is unranked. Completed account runs are replayed on the server before rewards become spendable; publishing a qualifying score is a separate explicit action.

Settings include language, separate music/effects volume, master mute, calm effects and independent screen shake. Defaults: music40%, effects50%, unmuted, shake enabled; operating-system reduced motion is respected. Browser audio/fullscreen depend on a user gesture and device support.

The intro is an original Canvas/SVG story from the ninja’s perspective: four scenes with a normal running time of 20 seconds, rather than an MP4 asset. Skip, pause and replay are available. Reduced motion uses manual scene advances; optional browser narration depends on device support. Training remains a separate activity.

**Your time in the dojo** records active rounds on this device from activation onward, separately for the guest and each account profile. Menus, pauses and hidden tabs do not count. Total, today and session values are shown. Break reminders default to enabled after 15 minutes of active session time; choose 10/20/30 minutes or disable them. The player chooses whether to pause or be reminded later. These values never change rewards and are not synced to the account server.

## Accounts and data

Optional new accounts require a Ninja name, private email address, confirmed password and privacy consent. Recovery uses a one-time key; email ownership verification and email delivery are not configured. Keep the recovery key; password recovery cannot be inferred from a name. Passwords use salted scrypt hashes. Session and recovery secrets are256bit random, hashed on the server. New v3 account tokens stay in sessionStorage; passwords are never stored in browser storage. A historical v2 device-deletion credential may remain in localStorage so old demo entries can still be removed; it is not a v3 account session.

The server owns wallet, purchases and progress. Transactions and user-scoped idempotency keys prevent duplicate rewards and overspending. A guest can carry safe tutorial/settings information across once; arbitrary local money/XP/unlocks are not imported as verified funds. Existing guest progress remains separately on the original device. Signing out clears the account session; confirmed deletion requires the password and removes related account data.

New account daily/weekly periods use UTC; guest tasks keep their previous local calendar. Reflection answers are not sent to the server. No ads, tracking or medical diagnoses are included.

The new weekly podium runs Monday 00:00 UTC to the following Monday. Runs must finish and be explicitly published in the same week; each regular account contributes its best result. After rollover, the server freezes the result and the three distinct winners may explicitly claim 100, 60 or 30 coins once. Admin test accounts are excluded from public rankings and competitive prizes on the server. [Private provisioning and podium rules, German](../server/NINJA_ADMIN_AND_PODIUM.md). Public admin provisioning is pending; credentials belong outside the repository.

The new leaderboard accepts only server-started, seeded, replay-validated Open runs ending through lost hearts, explicitly published by the user. It never trusts a submitted client score. Only the best published run per account appears. Input-log limits bound verification costs; they do not end the playable endless run. Replay validation is not a guarantee against bots.

## Public hosting status

Public v3 accounts were already configured at **https://notification-ninja-accounts.onrender.com/api/v3**, with the historical 7 November PostgreSQL and persistence checks documented above. The previous Render v2 leaderboard is a separate historical service; its rows were not migrated into verified v3 accounts.

The canonical address planned for 3.13.0 is **https://notification-ninja-accounts.onrender.com/** on that existing service and database. **Deployment and public verification of this candidate are pending.** GitHub Pages and the new address have separate browser storage. An explicit “Bring my guest profile” action opens the new address and requests confirmation before importing the validated guest profile; the original is retained. Account tokens, active runs and device playtime are not transferred. Existing account progress remains on the server and is available after signing in again. This guest transfer does not turn local currency into verified account funds. [Migration details, German](EXPANSION_3_13.md#adresse-und-gastprofil-übernahme) · [Deployment instructions](../server/README_NINJA_APP.md).

## Checks

```sh
npm run test:ninja
npm test
npm run build:ninja
npm run package:ninja
```

Only executed tests are listed as passed in [TEST_REPORT](TEST_REPORT.md). Emulated Chromium touch checks do not replace a physical iPhone/Safari test, teenager usability sessions or frame-rate measurements on a specified real device.
