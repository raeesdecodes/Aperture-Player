# Aperture Player — Technical Architecture & Development Phases (v2: React Native + Expo/EAS)

> **Supersedes the Flutter/media_kit version.** Confirmed constraints driving this doc: Android-first (iOS kept in mind), React Native + Expo, EAS cloud builds only, Custom Dev Client (not Expo Go) for the media engine, zero manual edits to `android/`/`ios/` — everything via Expo Config Plugins, gestures via `react-native-gesture-handler` + `react-native-reanimated`, GPLv3, OpenSubtitles.

## 1. Tech Stack

| Layer                       | Choice                                                                                                                                                           | Why                                                                                                                                                                                                                                                                                                                                                                        |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App framework               | **React Native + Expo (SDK, managed workflow + Custom Dev Client)**                                                                                              | Your build constraint. Expo prebuild generates `android`/`ios` at build time on EAS servers — you never hand-edit them.                                                                                                                                                                                                                                                    |
| Build pipeline              | **EAS Build** (`eas build --profile development` for dev client, `--profile production` for release)                                                             | No local Gradle/Kotlin/Xcode toolchain needed at all.                                                                                                                                                                                                                                                                                                                      |
| Media engine                | **`react-native-vlc-media-player`** (wraps **libVLC**), Android-first                                                                                            | Only mainstream RN wrapper that gives true VLC-level universal codec support (MKV, HEVC, AC3/DTS, ASS subtitles) out of the box — matches the PRD's "never fail to play a file" requirement. It's a standard native module, so it autolinks fine under an Expo prebuild/Custom Dev Client — **no bare workflow required**.                                                 |
| Media engine (fallback/alt) | `react-native-video` (ExoPlayer/AVPlayer-backed) or the official `expo-video` module                                                                             | Better first-party Expo support and easier PiP/background hooks, but narrower codec coverage (no native MKV/ASS/AC3 without extra work) — see §2 trade-off table. Keep as a documented fallback, not primary.                                                                                                                                                              |
| Gestures                    | **`react-native-gesture-handler`** + **`react-native-reanimated`**                                                                                               | Native-thread gesture recognition + animation, avoids JS-thread jank for the swipe/pinch/double-tap gestures in the PRD.                                                                                                                                                                                                                                                   |
| State management            | **Zustand**                                                                                                                                                      | Minimal boilerplate, no context-provider tree, works cleanly with Reanimated shared values for gesture state.                                                                                                                                                                                                                                                              |
| Navigation                  | `@react-navigation/native` (stack + bottom tabs)                                                                                                                 | Standard Expo-compatible navigation.                                                                                                                                                                                                                                                                                                                                       |
| Local DB                    | **`expo-sqlite`** + **`drizzle-orm`** (or `op-sqlite` if you outgrow expo-sqlite's perf ceiling)                                                                 | Type-safe schema/queries, works inside Expo managed + Custom Dev Client without native linking headaches.                                                                                                                                                                                                                                                                  |
| Subtitles                   | libVLC's built-in ASS/SRT rendering (via the VLC wrapper) + OpenSubtitles REST API                                                                               | mpv/VLC both render subtitle timing/styling natively — no separate subtitle-render library needed.                                                                                                                                                                                                                                                                         |
| Background audio            | **`react-native-track-player`**                                                                                                                                  | Purpose-built for Android foreground-service + iOS background-audio-mode + lock-screen/notification controls; has a config-plugin-friendly path (or a small custom plugin, see §3) so no manual `AndroidManifest.xml`/`Info.plist` edits.                                                                                                                                  |
| Picture-in-Picture          | Custom **Expo Module** (Expo Modules API) exposing `enterPipMode()` / `isPipSupported()`                                                                         | Neither `react-native-vlc-media-player` nor Expo core ship Android PiP out of the box. A small local Expo Module is still 100% EAS-buildable and config-plugin-friendly — you still never touch `android/`/`ios/` by hand; the module's native code lives in your repo under `modules/` and Expo's prebuild wires it in. iOS PiP (AVKit) added later when iOS work starts. |
| Equalizer / audio delay     | libVLC's audio filter chain, exposed through `react-native-vlc-media-player`'s native bridge (or the custom Expo Module if the wrapper's bridge is insufficient) | Same filter chain VLC itself uses.                                                                                                                                                                                                                                                                                                                                         |

## 2. Why libVLC wrapper over `expo-video`/`react-native-video`

|                                                | `react-native-vlc-media-player` (libVLC)               | `expo-video` / `react-native-video` (ExoPlayer/AVPlayer)                                         |
| ---------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| MKV/AVI/exotic containers                      | Native                                                 | Partial — MKV works on ExoPlayer for common codec combos, breaks on some AC3/DTS/subtitle combos |
| HEVC, AV1, VP9                                 | Yes                                                    | Yes (device/OS dependent)                                                                        |
| AC3/DTS/E-AC3 audio                            | Native                                                 | Needs extra extension work, inconsistent                                                         |
| ASS/SSA subtitle styling                       | Native                                                 | Limited (usually SRT-only well-supported)                                                        |
| First-party Expo support / PiP/background ease | Community module, more plumbing                        | Official Expo module, easier config plugin story                                                 |
| Maintenance activity                           | Community-maintained, check activity before locking in | Actively maintained by Expo/Meta                                                                 |

**Recommendation**: start with `react-native-vlc-media-player` for Phase 1 because universal codec support is a _core PRD requirement_, not a nice-to-have. Budget time in Phase 5 to evaluate whether its PiP/equalizer bridge is sufficient, or whether you need to fork it / wrap libVLC yourself via a custom Expo Module for finer control (libVLC's Android/iOS binaries are the same regardless of which JS wrapper calls them).

## 3. Expo Config Plugins — How Native Config Is Handled

Because you must never hand-edit `android/`/`ios/`, every native requirement becomes a **Config Plugin** entry in `app.config.js`. Config plugins run during EAS's remote `prebuild` step and declaratively modify the generated native project.

```js
// app.config.js (excerpt)
export default {
  expo: {
    name: 'Aperture Player',
    plugins: [
      'react-native-vlc-media-player',
      'react-native-track-player',
      ['./plugins/withPipSupport.js', {}],
      [
        'expo-build-properties',
        {
          android: { minSdkVersion: 24, compileSdkVersion: 34, targetSdkVersion: 34 },
        },
      ],
    ],
    android: {
      permissions: ['READ_MEDIA_VIDEO', 'READ_MEDIA_AUDIO', 'FOREGROUND_SERVICE'],
    },
  },
};
```

**Custom local plugins** (for things no third-party plugin covers, e.g. PiP manifest flags) live in `plugins/` as small Node scripts using `@expo/config-plugins` helpers (`withAndroidManifest`, `withInfoPlist`, etc.) — they programmatically edit the manifest/plist _at build time on EAS's servers_. You author and commit these JS files; you never touch the generated XML/plist directly.

Example shape of `plugins/withPipSupport.js`:

```js
const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withPipSupport(config) {
  return withAndroidManifest(config, (config) => {
    const mainActivity = config.modResults.manifest.application[0].activity.find(
      (a) => a.$['android:name'] === '.MainActivity',
    );
    mainActivity.$['android:supportsPictureInPicture'] = 'true';
    mainActivity.$['android:configChanges'] =
      'screenSize|smallestScreenSize|screenLayout|orientation';
    return config;
  });
};
```

## 4. High-Level Architecture

```
Presentation Layer (RN)
  Screens/Components -- Player, Library, Subtitles, etc.
  react-native-gesture-handler -> gesture recognizers
  react-native-reanimated -> 60fps UI-thread animations
        |
        v  reads/calls
State / Application Layer (Zustand)
  usePlayerStore, useLibraryStore, useSubtitleStore, useSettingsStore
        |
        v  calls abstract interface
Domain / Services Layer
  PlayerService interface: play(), seek(), setVolume(), setAudioDelay(),
  setEqualizerBand(), loadSubtitle()... (plain TS module, no RN/native imports)
        |
        v  implemented by
Media Engine Bridge Layer
  VlcPlayerService -- wraps react-native-vlc-media-player native bridge calls
        |
        v  native module (autolinked via Expo prebuild)
Native Layer (generated by EAS prebuild)
  libVLC (Android/iOS), custom PiP Expo Module,
  react-native-track-player foreground service/session
```

Same principle as before: UI never talks to the native bridge directly — only through `PlayerService`, so the engine stays swappable and the gesture/state code stays testable with a fake service.

## 5. Gesture-to-Engine Data Flow (horizontal swipe seek)

1. `Gesture.Pan()` (react-native-gesture-handler) on the video's gesture layer tracks `translationX` on the **UI thread**.
2. A `useAnimatedReaction`/worklet (Reanimated) converts `translationX` to seek-delta seconds via a sensitivity curve, updates a shared value driving the scrub-preview label — no seek call yet, purely UI-thread, zero JS bridge traffic per frame.
3. On gesture end (`onEnd` worklet -> `runOnJS`), call `usePlayerStore.getState().seekRelative(deltaSeconds)`.
4. Zustand action calls `playerService.seek(newPosition)`.
5. `VlcPlayerService` invokes the native bridge's seek method.
6. The native module emits an `onProgress`/`onPositionChanged` event -> Zustand store updates -> UI re-renders position/time label.

## 6. Development Phases (Expo/EAS-adjusted)

### Phase 0 — Project Setup

- `npx create-expo-app aperture-player`, add Custom Dev Client (`npx expo install expo-dev-client`)
- Configure `eas.json` with `development`, `preview`, `production` build profiles
- First EAS dev-client build (`eas build --profile development --platform android`) to prove the pipeline works before writing any feature code
- GPLv3 `LICENSE`, `README.md`, CI (GitHub Actions running `eas build` on tag push, `tsc`/`eslint`/`jest` on PR)

### Phase 1 — Core Playback Engine

- Add `react-native-vlc-media-player`, write its Config Plugin entry (or confirm it autolinks cleanly under prebuild)
- `PlayerService` interface + `VlcPlayerService` implementation
- New EAS dev-client build including the native module (rebuild required any time a native dependency changes — pure-JS changes after this reuse the same dev client via Expo's JS bundler/OTA)
- Minimal player screen proving playback of MKV/HEVC/AC3 test files on a real Android device

### Phase 2 — Gesture Layer

- Implement all PRD §5.2 gestures with `react-native-gesture-handler` + `react-native-reanimated` worklets
- Visual feedback components (volume/brightness pill, scrub overlay, double-tap ripple, lock mode)

### Phase 3 — Library

- `expo-sqlite` + `drizzle-orm` schema (MediaItems, WatchProgress, Playlists)
- Android media scanning (via `expo-media-library` where possible; anything it can't cover goes into the custom Expo Module)
- Library grid/list UI, thumbnail generation/caching

### Phase 4 — Subtitles

- Local auto-detect + OpenSubtitles search/download screen
- Sync offset + style controls via the VLC bridge

### Phase 5 — Advanced Audio/PiP

- Equalizer + audio delay via VLC bridge (evaluate bridge sufficiency here — fork/extend if needed, per §2)
- `react-native-track-player` integration for background audio + lock-screen controls
- Custom Expo Module + `withPipSupport` config plugin for Android PiP; new EAS dev-client build to pick up the native module

### Phase 6 — Playlists, Settings, Polish

- Folder-as-playlist auto-advance, shuffle/repeat
- Settings screen (theme, sensitivity, subtitle defaults, cache mgmt)
- Accessibility pass, performance profiling on real devices via EAS **preview** builds (shareable install links, no store submission needed for testing)

### Phase 7 — Beta & Release

- `eas build --profile production` for signed release artifacts
- `eas submit` for Play Store upload (F-Droid requires a separate manual/reproducible-build path — flag as a v1.x follow-up given EAS's build reproducibility constraints)
- iOS work begins here if/when you pick it back up: same Expo codebase, new EAS iOS build profile, iOS-specific PiP (AVKit) and background-audio config plugin work

## 7. Testing Strategy

- Unit tests: Zustand store actions, gesture-delta math (pure functions/worklets extracted as plain TS where possible) — Jest
- Component tests: React Native Testing Library for gesture zones and overlay show/hide behavior
- Device-lab tests: maintain a small repo of sample files across the codec matrix from the PRD, install via EAS **preview** build links on physical Android devices (emulators are unreliable for hardware-decode verification)
