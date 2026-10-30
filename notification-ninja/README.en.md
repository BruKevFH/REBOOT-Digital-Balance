# Notification Ninja

An illustrated browser arcade game about making digital choices that fit your situation. Play in **English or German**, using a mouse or touch.

**[Play](https://brukevfh.github.io/REBOOT-Digital-Balance/notification-ninja/home.html)** · **[Download 2.0.0](downloads/Notification-Ninja-2.0.0.zip)** · **[Deutsche Anleitung](README.md)**

## Start without signing up

Choose **English** on the homepage or in Settings. You can play a complete round as a guest. No email, password, real name or registration is required. Progress stays in the browser on this device. You may choose a Ninja name later; a public alias is required only if you explicitly publish an Open Run score.

Choose one of three free everyday situations:

- **Study:** keep schoolwork and helpful breaks; swipe away unrelated interruptions.
- **Gaming:** playing is welcome, while your chosen time limit still matters.
- **Sleep:** leave calm bedtime signals alone and recognise the temptation of endless autoplay.

Study and Sleep rounds last **45 seconds**. Gaming also offers 60 or 90 seconds. Pick Relaxed, Normal or Pro. Short rounds limit simultaneous objects and begin gently. These free rounds are separate from purchased campaign rooms, so existing unlocks retain their value.

## How to play

Hold the mouse button or drag a finger through a distraction. **Leave helpful objects untouched** until they leave the top of the screen. The current situation decides what is helpful. A missed distraction or a wrong cut costs a heart. Optional bonus objects do not cost a heart when missed.

NIM explains swiping and keeping during training. Answer hints appear only there. The normal game shows recognisable objects and your current goal.

**Pause** freezes time and objects. Resume when ready, or end the round deliberately. Earned coins are secured once; ending early does not pretend that you won. Empty immediate exits do not earn run XP. Afterward, an optional reflection question connects your choices with everyday life. **New round** and **End & take a break** are equally easy to reach. The break screen does not automatically start another round.

## Make the game comfortable

Settings contain language, **calm effects**, and music controls. Calm effects remove particle showers, screen shake and large celebrations while retaining clear text and essential object movement. The operating system's reduced-motion preference is also respected. Switching languages does not reset your round or change your name, coins or unlocks.

## Illustrated worlds

The desktop world map and three detailed dojo interiors follow the concept mock-ups. On phones, three large illustrated cards keep the same choices easy to reach. Scenery contains no fixed language labels; real HTML controls and Canvas objects switch with your language. Room illustrations load in the background; a playable vector fallback remains available if loading fails. The final logo has no slogan.

## Your adventure

The extra adventure area retains eight career missions, three Autoplay bosses, daily and weekly tasks, Ninja ranks, a wardrobe, nine skills and 24 achievements. Earn coins to unlock campaign rooms and extra designs. Claim rewards explicitly. New outfits stay in your wardrobe until you choose to equip them.

**Open Run** has three hearts, no timer and steadily increasing speed. Purchased skills and Supers are disabled for a fair comparison. An early exit is unranked. Publishing your chosen alias and result to the shared leaderboard is always an explicit action. Local downloads cannot publish to the public service; use the hosted web version.

## Saving and download

Progress is local to this browser and device; there is no cross-device account sync. Signing out keeps progress. Deleting your profile requires confirmation and removes your saved game. If you published scores, online entries are deleted first. Language and calm effects are general device preferences.

Extract the entire ZIP and open `home.html` or `index.html`. Both languages, graphics and music are bundled locally. If the browser restricts local files, serve the extracted folder over HTTP. Offline play does not require the leaderboard service. The free ranking demo may take time to wake up and may lose online scores after a restart.

## Development

Requires Node.js 24+ and Python 3:

```sh
npm ci
npm run test:ninja
npm run build:ninja
npm run package:ninja
```

`src/game.js` owns rules and saved runs; `src/i18n.js` translates presentation without rewriting stable IDs or player names. `src/preferences.js` stores language and calm effects separately. The standalone homepage has its own small bundle in `dist/home.js`. Both bundles are included in the offline cache and download.

See [TEST_REPORT.md](TEST_REPORT.md) for actual checks and their limits. Browser emulation does not establish performance or compatibility on a physical iPhone, and no testing with teenage participants is claimed.
