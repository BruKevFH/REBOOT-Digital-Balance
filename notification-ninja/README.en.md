# Notification Ninja

**Development release 3.1.0:** PostgreSQL alongside local SQLite, a new account portal and Ninja hub, distinct bosses, Boss Rush and server-issued UTC daily runs. Public accounts remain disabled pending actual Render/Neon verification. See [validation and blockers](ULTIMATE_STATUS.md) and [server setup](../server/README_NINJA_APP.md).

An illustrated browser arcade game in **English and German**. Slice distractions and let helpful items pass. Study, Gaming and Sleep use distinct dojo scenes and context rules. No extra brand name or slogan.

[German guide](README.md) · [Requirement matrix](REQUIREMENTS_FULL.md) · [Executed checks and limitations](TEST_REPORT.md)

## Run the complete application locally

Requires Node.js24 and npm; Python3 only for ZIP packaging.

```sh
npm ci
npm run build:ninja
npm run serve:ninja
```

Open **http://127.0.0.1:8083/notification-ninja/home.html**. One process serves the frontend and `/api/v3`, and creates the persistent SQLite database at `server/data/ninja.sqlite`. No external credentials or database process are needed. Restarting with the same DATA_DIR preserves accounts and progress.

For static guest-only play, use `npm run serve` and open port8000. The ZIP includes the complete guest runtime; extract all files, then open home.html or serve them over HTTP if the browser restricts local files.

## Play

Guest play needs no name, email or registration. Choose a free short Study, Gaming or Sleep round. Hold the mouse button or swipe with a finger across distractions; leave useful signals untouched. A wrong cut or missed distraction costs a heart. NIM introduces rules in training; only training displays answer hints. Help also includes untimed, unranked button/keyboard practice.

Pause freezes gameplay. Resume or deliberately stop; the result displays actual points, correct decisions and mistakes. Reflection is optional, local and unrewarded. Starting again and taking a break are equally available.

There are **18 main missions**, six per world, with varied goals and short authored durations. Chapter completion unlocks further worlds; old purchased access remains. The previous eight challenges, three Autoplay bosses, 24 achievements, nine skills, cosmetic outfits, five ranks and daily/weekly tasks remain. Claim rewards explicitly; purchases and equipping are separate choices. Viewing one notification removes it from unread messages without claiming its reward.

**Open Run** is a single mode with three hearts, two throwers, no time limit and gentle continuous acceleration. Purchased skills and Supers are disabled. An early exit is unranked. Completed account runs are replayed on the server before rewards become spendable; publishing a qualifying score is a separate explicit action.

Settings include language, separate music/effects volume, master mute, calm effects and independent screen shake. Defaults: music40%, effects50%, unmuted, shake enabled; operating-system reduced motion is respected. Browser audio/fullscreen depend on a user gesture and device support.

## Accounts and data

Optional new accounts require a Ninja name, private email address, confirmed password and privacy consent. Recovery uses a one-time key; email ownership verification and email delivery are not configured. Keep the recovery key; password recovery cannot be inferred from a name. Passwords use salted scrypt hashes. Session and recovery secrets are256bit random, hashed on the server. New v3 account tokens stay in sessionStorage; passwords are never stored in browser storage. A historical v2 device-deletion credential may remain in localStorage so old demo entries can still be removed; it is not a v3 account session.

The server owns wallet, purchases and progress. Transactions and user-scoped idempotency keys prevent duplicate rewards and overspending. A guest can carry safe tutorial/settings information across once; arbitrary local money/XP/unlocks are not imported as verified funds. Existing guest progress remains separately on the original device. Signing out clears the account session; confirmed deletion requires the password and removes related account data.

New account daily/weekly periods use UTC; guest tasks keep their previous local calendar. Reflection answers are not sent to the server. No ads, tracking or medical diagnoses are included.

The new leaderboard accepts only server-started, seeded, replay-validated Open runs ending through lost hearts, explicitly published by the user. It never trusts a submitted client score. Only the best published run per account appears. Input-log limits bound verification costs; they do not end the playable endless run. Replay validation is not a guarantee against bots.

## Public hosting status

**Durable public account hosting is not connected yet.** GitHub Pages serves the static guest game. The previous free Render v2 leaderboard is a separate historical demo with ephemeral storage and basic plausibility checks. Its rows are not presented as verified v3 accounts.

To enable public accounts, provision an actual HTTPS Node24/Docker service with persistent DATA_DIR, verify it survives restart, then set its real `/api/v3` endpoint in accounts-config.json. No paid product has been activated. [Exact deployment instructions](../server/README_NINJA_APP.md).

## Checks

```sh
npm run test:ninja
npm test
npm run build:ninja
npm run package:ninja
```

Only executed tests are listed as passed in [TEST_REPORT](TEST_REPORT.md). Emulated Chromium touch checks do not replace a physical iPhone/Safari test, teenager usability sessions or frame-rate measurements on a specified real device.
