# Lucky Numbers

A cross-platform (iOS + Android) Expo / React Native app that generates lottery numbers personalized to a user's name, date of birth, hometown, and (optionally) time of birth. Supports Powerball, Mega Millions, and California games (SuperLotto Plus, Fantasy 5, Daily 3, Daily 4).

> **For entertainment only.** Not affiliated with any lottery or government agency.

## Quick start

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS). For builds that include AdMob you'll need a development build via EAS:

```bash
npm install -g eas-cli
eas build --profile development --platform ios
eas build --profile development --platform android
```

## Project layout

- `App.tsx` — single-screen UI (form + generated draws)
- `src/games.ts` — definitions for each lottery game
- `src/lottery.ts` — deterministic seeded RNG (FNV-1a + mulberry32) and draw generation
- `src/components/` — `NumberBall`, `Disclaimer`, `AdBanner`
- `app.json` — Expo config; AdMob app IDs are Google's public **test** IDs

## AdMob

`react-native-google-mobile-ads` is wired up. Replace the test IDs:

1. In `app.json`: swap `androidAppId` / `iosAppId` for your real AdMob app IDs.
2. In `src/components/AdBanner.tsx`: set `PROD_BANNER_ID` to your real banner unit IDs (one per platform).

The banner falls back to a placeholder when the native module isn't linked (e.g., on web).

## How the "personalization" works

Inputs are normalized (trimmed/lowercased) and concatenated with the game id, then hashed with FNV-1a to produce a 32-bit seed. The seed feeds a [mulberry32](https://gist.github.com/tommyettinger/46a3c011fc2f900c5c4f9b6e6ef02c1c) PRNG that draws unique numbers in each game's range. Same inputs → same numbers, every time. Different game → different numbers.

## Disclaimer

The app shows an in-app disclaimer that it is for entertainment, that numbers are randomly generated, and that the app is not affiliated with any lottery or state government.
