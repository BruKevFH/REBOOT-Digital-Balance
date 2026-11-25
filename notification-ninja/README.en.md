# Notification Ninja

Current update: [3.13.1 – automatic rankings, readable counters and more compact views](PATCH_3_13_1.md).

**Current version: 3.13.1** at **https://notification-ninja-accounts.onrender.com/**. The [tested source `6878dd4`](https://github.com/BruKevFH/REBOOT-Digital-Balance/commit/6878dd4bc8717d48f257d5b89c17868c355fc2bd) runs on the existing Render Free service and durable PostgreSQL database. Refined worlds, Bazaar abilities, 18 skills including six Supers, 36 achievements and twelve outfits with five cosmetic rarity levels are included. New eligible account Open Runs are ranked automatically after server validation. An original ninja intro, device-only active playtime and optional break reminders are available. [Release evidence, migration and limits, German](EXPANSION_3_13.md) · [3.13.1 update, German](PATCH_3_13_1.md).

Local checks passed **591 repository tests with PostgreSQL**, **1,368 page states**, **60 compact/expanded UI states**, **132 integrated guest states** and **216 HUD presentation cases**. The [production two-account acceptance](https://github.com/BruKevFH/REBOOT-Digital-Balance/actions/runs/45445114118) confirmed purchases, progress and rankings after an actual Render restart on 24 November; its accounts and public rows were deleted afterwards. The [build and download run](https://github.com/BruKevFH/REBOOT-Digital-Balance/actions/runs/45517079333) and [public API/guest acceptance](https://github.com/BruKevFH/REBOOT-Digital-Balance/actions/runs/45517079859) passed; the latter confirms nine identical runtime files and the public guest interface. The [checks](https://github.com/BruKevFH/REBOOT-Digital-Balance/actions/runs/45517079240) also completed successfully.

The [native complete campaign/mode audit from 17 November](FULL_GAME_AUDIT.md) remains historical evidence and is not presented as a new full 3.13.1 playthrough. [3.12.0 experience features](EXPERIENCE_RELEASE.md), the [master prompt](ULTIMATE_EXPERIENCE_MASTERPROMPT.md), and the [original 7 November account release](ULTIMATE_STATUS.md) describe earlier stages.

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

**Open Run** is a single mode with three hearts, two throwers, no time limit and gentle continuous acceleration. Purchased skills and Supers are disabled. An early exit is unranked. Completed account runs are replayed on the server before rewards become spendable; new eligible account scores are ranked automatically after validation. The pre-run notice explains this. A user-bound local outbox stores run IDs and retries the protected API request if a connection fails; it never supplies trusted scores or publishes the entire run history.

Settings include language, separate music/effects volume, master mute, calm effects and independent screen shake. Defaults: music40%, effects50%, unmuted, shake enabled; operating-system reduced motion is respected. Browser audio/fullscreen depend on a user gesture and device support.

The intro is an original Canvas/SVG story from the ninja’s perspective: four scenes with a normal running time of 20 seconds, rather than an MP4 asset. Skip, pause and replay are available. Reduced motion uses manual scene advances; optional browser narration depends on device support. Training remains a separate activity.

**Your time in the dojo** records active rounds on this device from activation onward, separately for the guest and each account profile. Menus, pauses and hidden tabs do not count. Total, today and session values are shown. Break reminders default to enabled after 15 minutes of active session time; choose 10/20/30 minutes or disable them. The player chooses whether to pause or be reminded later. These values never change rewards and are not synced to the account server.

## Accounts and data

Optional new accounts require a Ninja name, private email address, confirmed password and privacy consent. Recovery uses a one-time key; email ownership verification and email delivery are not configured. Keep the recovery key; password recovery cannot be inferred from a name. Passwords use salted scrypt hashes. Session and recovery secrets are256bit random, hashed on the server. New v3 account tokens stay in sessionStorage; passwords are never stored in browser storage. A historical v2 device-deletion credential may remain in localStorage so old demo entries can still be removed; it is not a v3 account session.

The server owns wallet, purchases and progress. Transactions and user-scoped idempotency keys prevent duplicate rewards and overspending. A guest can carry safe tutorial/settings information across once; arbitrary local money/XP/unlocks are not imported as verified funds. Existing guest progress remains separately on the original device. Signing out clears the account session; confirmed deletion requires the password and removes related account data.

New account daily/weekly periods use UTC; guest tasks keep their previous local calendar. Reflection answers are not sent to the server. No ads, tracking or medical diagnoses are included.

The new weekly podium runs Monday 00:00 UTC to the following Monday. Runs must finish and be published in the same week; each regular account contributes its best result. After rollover, the server freezes the result and the three distinct winners may explicitly claim 100, 60 or 30 coins once. Admin test accounts are excluded from public rankings and competitive prizes on the server. [Private provisioning and podium rules, German](../server/NINJA_ADMIN_AND_PODIUM.md). Private bootstrap configuration was supplied before the successful service start and then removed. Owner credentials stay outside the repository; interactive production owner login is not part of the public acceptance. Roles, budget and ranking exclusion were verified locally.

The leaderboard accepts server-started, seeded, replay-validated account Open Runs with valid points and an ordinary lost-hearts ending. New eligible regular-account results are published automatically; guests, early exits and admin tests remain unranked. It never trusts a submitted client score. Only the best published run per account appears. Input-log limits bound verification costs; they do not end the playable endless run. Replay validation is not a guarantee against bots.

## Public hosting status

Public v3 accounts use **https://notification-ninja-accounts.onrender.com/api/v3**. The [24 November production acceptance](https://github.com/BruKevFH/REBOOT-Digital-Balance/actions/runs/45445114118) verified both accounts and their wallets, inventory and rankings across an actual operator restart, then removed both synthetic accounts and public rows. This was a real-time HTTP/replay check; native automatic browser publication was separately checked locally.

The canonical site is **https://notification-ninja-accounts.onrender.com/** on that existing service and database, without the former repository path. GitHub Pages and this address have separate browser storage. An explicit “Bring my guest profile” action opens the new address and requests confirmation before importing the validated guest profile; the original is retained. Account tokens, active runs and device playtime are not transferred. Existing account progress remains on the server and is available after signing in again. This guest transfer does not turn local currency into verified account funds. The previous Render v2 leaderboard remains a separate historical service; its rows were not migrated into verified v3 accounts. [Migration details, German](EXPANSION_3_13.md#adresse-und-gastprofil-übernahme) · [Deployment instructions](../server/README_NINJA_APP.md).

## Checks

```sh
npm run test:ninja
npm test
npm run build:ninja
npm run package:ninja
```

Only executed tests are listed as passed in [TEST_REPORT](TEST_REPORT.md). Emulated Chromium touch checks do not replace a physical iPhone/Safari test, teenager usability sessions or frame-rate measurements on a specified real device.
