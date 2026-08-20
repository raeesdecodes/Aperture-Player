# Aperture Player — AI Coding Micro-Prompts Roadmap (v2: React Native + Expo/EAS)

Run these in order in your AI coding tool, one at a time, committing after each success. Paste Docs 1–4 (v2) into context first. Every prompt assumes **no local native edits** — any prompt that adds a native dependency ends with "trigger a new EAS dev-client build," which you run yourself via `eas build --profile development --platform android`.

---

## Phase 0 — Setup

**Prompt 0.1**
> Scaffold a new Expo app named `aperture-player` using `npx create-expo-app` with TypeScript. Install and configure `expo-dev-client`. Set up the folder structure exactly as in `3_File_Directory_Structure.md` under `src/`, `plugins/`, and `modules/` (empty files with a one-line doc comment for purpose are fine for now). Do not write feature logic yet.

**Prompt 0.2**
> Create `eas.json` with three build profiles: `development` (internal distribution, dev client), `preview` (internal distribution, release build for testers), and `production` (store build). Create `app.config.js` with app name, slug, Android package identifier, and an empty `plugins` array to be filled in later prompts.

**Prompt 0.3**
> Add a `LICENSE` file with full GPLv3 text, a `README.md` using the vision section from `1_PRD_and_Features.md`, and `CONTRIBUTING.md`. Configure ESLint + Prettier + strict `tsconfig.json`. Add a GitHub Actions workflow at `.github/workflows/ci.yaml` running `tsc --noEmit`, `eslint`, and `jest` on every PR.

**Prompt 0.4**
> Explain the exact `eas build --profile development --platform android` command I need to run locally to produce the first Custom Dev Client build, and what to do with the resulting install link/APK. Do not attempt to run native build commands yourself — just prepare the project so this build succeeds.

---

## Phase 1 — Core Playback Engine

**Prompt 1.1**
> In `src/domain/interfaces/playerService.ts`, define a `PlayerService` interface (TypeScript, no RN/native imports) with methods: `open(uri: string): Promise<void>`, `play(): Promise<void>`, `pause(): Promise<void>`, `seek(positionMs: number): Promise<void>`, `setVolume(volume: number): Promise<void>`, and an event-subscription method `onPlaybackStateChange(callback: (state: PlaybackState) => void): () => void`. Define `PlaybackState` in `src/domain/types/playbackState.ts` with `positionMs`, `durationMs`, `isPlaying`, `isBuffering`.

**Prompt 1.2**
> Install `react-native-vlc-media-player`. Add any required entry to `app.config.js`'s `plugins` array (research whether it ships its own Expo config plugin; if not, create a minimal `plugins/withVlcPlayerConfig.js` for any manifest/permission needs it documents). Implement `src/data/services/vlcPlayerService.ts` implementing `PlayerService` by wrapping the library's `VLCPlayer` component/imperative API. This adds a native dependency — after this prompt, tell me to run a new EAS development build before testing.

**Prompt 1.3**
> Create `src/store/usePlayerStore.ts` — a Zustand store exposing `playbackState`, `open(uri)`, `play()`, `pause()`, `seekRelative(deltaMs)`, backed internally by the `PlayerService` implementation (inject via a simple factory/singleton, not hardwired, so it can be swapped in tests).

**Prompt 1.4**
> Build a minimal `src/features/player/screens/PlayerScreen.tsx` that accepts a file URI route param, calls `usePlayerStore.getState().open(uri)` on mount, renders the VLC video view full-screen, and shows a basic play/pause button plus a seek `Slider` bound to position/duration. No custom gestures yet — this proves end-to-end playback of an MKV/HEVC/AC3 test file on a real Android device via the dev client.

---

## Phase 2 — Gesture Layer

**Prompt 2.1**
> Install `react-native-gesture-handler` and `react-native-reanimated`, configure the Babel plugin and root `GestureHandlerRootView`. Create `src/features/player/components/GestureLayer.tsx` wrapping the video view, composing: (a) `Gesture.Pan()` restricted to the left 25% width for brightness, (b) another `Gesture.Pan()` on the right 25% for volume, (c) a center `Gesture.Pan()` for horizontal seek, (d) `Gesture.Tap({numberOfTaps: 2})` split into left/center/right thirds, (e) `Gesture.Pinch()` for zoom, composed with `Gesture.Race`/`Gesture.Simultaneous` as appropriate. For now, just log the detected gesture type and delta via worklet `console.log` — no visual feedback yet.

**Prompt 2.2**
> Create `src/store/usePlayerStore.ts` additions (or a separate `useGestureStore.ts`) holding ephemeral gesture UI state as Reanimated shared values: `activeGesture`, `gestureValue`, `seekDeltaPreviewMs`. Wire `GestureLayer.tsx` worklets to update these shared values directly (UI thread) instead of logging.

**Prompt 2.3**
> Build `src/features/player/components/VolumeBrightnessIndicator.tsx` per `4_design.md` §5 (vertical animated pill, spring physics via Reanimated, auto-dismiss 600ms after gesture end). Drive it from the shared values set in `GestureLayer.tsx`.

**Prompt 2.4**
> Build `src/features/player/components/SeekScrubOverlay.tsx` per `4_design.md` §5 (center delta-time label with chevrons, blurred scrim). On pan gesture end, call `usePlayerStore.getState().seekRelative(deltaMs)` via `runOnJS` from the worklet, then clear the preview shared value.

**Prompt 2.5**
> Build `src/features/player/components/PlayerControlsOverlay.tsx`: top bar (back button, title) and bottom bar (play/pause, seek slider, time labels, lock button, more-options button) with auto-hide after 3 seconds of inactivity, per `1_PRD_and_Features.md` Flow B. A plain single tap on `GestureLayer` (not consumed by another gesture) toggles this overlay's visibility.

**Prompt 2.6**
> Implement `src/features/player/components/LockScreenButton.tsx` and a two-finger-tap lock gesture in `GestureLayer.tsx`: when locked, all gestures except a tap on the lock icon are disabled (use a shared `isLocked` value checked at the top of each gesture's `onStart`).

---

## Phase 3 — Library

**Prompt 3.1**
> Set up `expo-sqlite` + `drizzle-orm`. Define schemas in `src/data/db/schema/` for `mediaItems`, `watchProgress`, and `playlists` per `3_File_Directory_Structure.md`. Create `src/data/db/client.ts` initializing the Drizzle client against the Expo SQLite database.

**Prompt 3.2**
> Install `expo-media-library`, add the required permissions to `app.config.js`. Implement `src/data/mediaScanner/deviceMediaScanner.ts` to enumerate video/audio files on the Android device and upsert results into the `mediaItems` table via Drizzle.

**Prompt 3.3**
> Build `src/features/library/screens/LibraryHomeScreen.tsx`: a `FlatList`/grid of `MediaGridTile.tsx` components showing thumbnail, filename, duration badge, plus a horizontal `ContinueWatchingRow.tsx` sourced from `watchProgress` rows where `positionMs > 0`.

**Prompt 3.4**
> Add background thumbnail generation: for any `mediaItem` without a cached thumbnail, generate one (via `expo-video-thumbnails` or the VLC bridge's frame-extraction if available), cache to the app's file system directory, and update the Drizzle row with the cache path.

---

## Phase 4 — Subtitles

**Prompt 4.1**
> Implement local subtitle auto-detection: when `vlcPlayerService.open()` is called, check the same directory (via Expo's file system APIs) for a same-basename `.srt`/`.ass`/`.vtt` file, and if found, load it as the default subtitle track via the VLC bridge's subtitle API.

**Prompt 4.2**
> Create `src/data/remote/openSubtitles/openSubtitlesApi.ts` wrapping the OpenSubtitles REST API (search by filename/hash, download). Implement the corresponding `SubtitleService` interface + implementation in `src/data/services/subtitleService.ts`.

**Prompt 4.3**
> Build `src/features/subtitles/screens/SubtitleSearchScreen.tsx`: search field + language filter, result list, tap to download-and-apply, following `1_PRD_and_Features.md` Flow C.

**Prompt 4.4**
> Build `src/features/subtitles/components/SubtitleSyncSlider.tsx` (± ms offset) wired to the VLC bridge's subtitle-delay API, plus a subtitle style settings panel (font size/color/background/position).

---

## Phase 5 — Advanced Audio & PiP

**Prompt 5.1**
> Build `src/features/equalizer/screens/EqualizerScreen.tsx` with a 10-band slider UI per `4_design.md`. Wire band changes to the VLC bridge's equalizer API in `src/store/useEqualizerStore.ts`. Include presets (Flat/Bass Boost/Vocal/Rock/Jazz). If the VLC wrapper's bridge doesn't expose per-band equalizer control, flag this clearly and propose the custom Expo Module fallback from `2_Technical_Architecture_and_phases.md` §2.

**Prompt 5.2**
> Add an audio-delay control (± ms slider) in the player's more-options sheet, wired to the VLC bridge's audio-delay property.

**Prompt 5.3**
> Install `react-native-track-player`, add its config plugin entry to `app.config.js`. Implement background audio playback: foreground service on Android with notification play/pause/seek controls, wired to `usePlayerStore`. This adds a native dependency — trigger a new EAS development build after this prompt.

**Prompt 5.4**
> Scaffold a local Expo Module at `modules/aperture-pip/` (Expo Modules API) exposing `enterPipMode(): Promise<void>` and `isPipSupported(): Promise<boolean>` for Android `PictureInPictureParams`. Create `plugins/withPipSupport.js` to set the required `AndroidManifest.xml` flags (`supportsPictureInPicture`, `configChanges`) via `@expo/config-plugins`, and register it in `app.config.js`. Wire `src/features/pip/pipService.ts` to call this module, triggered on Android home-press during playback. Trigger a new EAS development build after this prompt.

---

## Phase 6 — Playlists, Settings, Polish

**Prompt 6.1**
> Implement folder-as-playlist auto-advance: when the current file finishes, automatically load the next file in the same folder (respecting sort order), per `1_PRD_and_Features.md` §5.7, using `useLibraryStore` and `usePlayerStore` together.

**Prompt 6.2**
> Build `src/features/settings/screens/SettingsScreen.tsx` covering theme selection (Dark/AMOLED/Light/System per `4_design.md` §2), default gesture sensitivity, default subtitle language, and cache management (clear thumbnail cache), backed by `useSettingsStore` persisted via `expo-sqlite` or `AsyncStorage`.

**Prompt 6.3**
> Run an accessibility pass: add `accessibilityLabel`/`accessibilityRole` to every interactive component in the player and library screens, verify minimum 44x44dp touch targets, and ensure every gesture-only action (seek/volume/zoom) has an equivalent button in `PlayerControlsOverlay.tsx`.

**Prompt 6.4**
> Write Jest unit tests for the seek-delta and volume/brightness sensitivity-curve pure functions in `src/core/utils`, and React Native Testing Library component tests for `GestureLayer.tsx` covering each gesture zone boundary.

---

## Phase 7 — Release Prep

**Prompt 7.1**
> Finalize `eas.json`'s `production` profile (Android app signing via EAS-managed credentials, versioning strategy). Confirm no analytics/ad SDK dependencies exist anywhere in `package.json`.

**Prompt 7.2**
> Write Play Store listing copy (short description, full description, feature graphic text) reusing language from `1_PRD_and_Features.md` §1–2, emphasizing "free, open-source, no ads." Draft the `eas submit` configuration for Android. Note F-Droid as a v1.x follow-up requiring a separate reproducible-build investigation given EAS's cloud-build model.
