# Aperture Player — Product Requirements Document (PRD)

## 1. Vision

Aperture Player is a **free, open-source, ad-free mobile media player** that fuses MX Player's fluid, gesture-driven UI with VLC's universal codec support. No ads, no paywalls, no locked "pro" tier — every feature ships free for everyone.

## 2. Goals

- Play _anything_ the user throws at it (any container/codec) without transcoding.
- Feel as fast and gesture-native as MX Player Pro.
- Be fully community-owned: permissive OSS license (recommend GPLv3, since core engine libVLC/libmpv are GPL-derived — see Doc 2), transparent roadmap, no telemetry beyond opt-in crash reports.

## 3. Non-Goals (v1)

- Streaming service integrations (Netflix/YouTube etc.)
- Cloud sync of watch history across devices
- Video editing/trimming
- Casting to TV (Chromecast/AirPlay) — deferred to v2
- Desktop/TV app — mobile (Android first, iOS second) only for v1

## 4. Target Users

- Power users who currently juggle MX Player + VLC because neither alone satisfies them.
- Users with large local media libraries (ripped Blu-rays, anime fansubs, podcasts, downloaded lectures) with unusual codecs/containers.
- Privacy-conscious users who want zero ads/tracking.

## 5. Core Feature List

### 5.1 Universal Playback

- Containers: MP4, MKV, AVI, MOV, WebM, FLV, TS, 3GP
- Video codecs: H.264, HEVC/H.265, VP8/VP9, AV1, MPEG-4, MPEG-2
- Audio codecs: AAC, MP3, FLAC, OGG/Vorbis, Opus, AC3/E-AC3 (Dolby Digital), DTS, PCM/WAV
- Subtitle formats embedded/external: SRT, ASS/SSA, VTT, SUB/IDX
- Hardware-accelerated decoding (MediaCodec on Android, VideoToolbox on iOS) with automatic software-decode fallback for unsupported codecs (this is the "VLC superpower" — never fail to play a file)
- Variable playback speed (0.25x–3x)
- Frame-accurate seeking

### 5.2 Gesture Controls (MX-Player parity)

| Gesture                 | Zone                             | Action                                                                  |
| ----------------------- | -------------------------------- | ----------------------------------------------------------------------- |
| Vertical swipe          | Right edge (top-to-bottom third) | Volume up/down                                                          |
| Vertical swipe          | Left edge                        | Screen brightness up/down                                               |
| Horizontal swipe (drag) | Center of screen                 | Seek forward/back, scrubbing preview + delta time (e.g. "+00:32") shown |
| Double tap              | Left third                       | Rewind 10s (ripple animation)                                           |
| Double tap              | Right third                      | Forward 10s (ripple animation)                                          |
| Double tap              | Center third                     | Play/Pause                                                              |
| Pinch                   | Anywhere on video                | Zoom / aspect-fit toggle (Fit / Fill / Crop / Stretch)                  |
| Single tap              | Anywhere                         | Toggle control overlay visibility                                       |
| Long press              | Anywhere                         | Temporary 2x speed-boost (release to resume normal speed)               |
| Two-finger tap          | Anywhere                         | Lock screen (gestures disabled except unlock button)                    |

All gestures show a transient on-screen indicator (icon + value bar/text) that auto-hides after ~800ms of inactivity.

### 5.3 Library & Browsing

- Auto-scan device storage for media (folders view, "All Videos", "All Audio")
- Thumbnail generation (cached, background-generated)
- Resume playback ("Continue Watching" with saved position per file)
- Search & sort (name, date, size, duration, folder)
- Hide/exclude folders

### 5.4 Subtitles

- Auto-detect same-name external subtitle files next to media
- Manual subtitle file picker
- **Online subtitle search & download** (e.g. OpenSubtitles API) with language selection
- Subtitle sync offset control (+/- ms, gesture: two-finger vertical swipe on subtitle track, or a slider in settings)
- Style customization: font size, color, background, position

### 5.5 Audio

- Background audio playback (continues when app backgrounded / screen off), with media-session notification controls (play/pause/seek/next)
- Audio track selection (multi-track files)
- **Audio delay adjustment** (A/V sync, ± ms, for mismatched rips)
- 5/10-band **equalizer** with presets (Flat, Bass Boost, Vocal, Rock, Jazz, Custom) + virtualizer/bass-boost toggles where platform supports it

### 5.6 Picture-in-Picture (PiP)

- Enter PiP on home-press or explicit button while video is playing
- Mini-player retains play/pause/seek controls
- Tap to return to full player

### 5.7 Playlists & Queue

- Folder-as-playlist auto behavior (auto-advance to next file in folder)
- Manual playlist creation
- Shuffle / repeat (one/all/off)

### 5.8 Settings

- Theme (Dark default / Light / AMOLED black / System)
- Default gesture sensitivity tuning
- Hardware/software decoder toggle (advanced/debug)
- Default subtitle language
- Storage/cache management

## 6. Key User Flows

**Flow A — First Launch**

1. Splash → storage permission request (with rationale) → auto-scan starts in background
2. Library populates progressively (skeleton loaders → thumbnails)
3. Empty state offers "Open file" if no media found

**Flow B — Play a Video**

1. Tap file in library → Player opens full-screen, auto-hides system bars
2. Playback starts, resumes from last position if previously watched
3. Control overlay auto-hides after 3s; gestures work regardless of overlay visibility

**Flow C — Subtitle Download**

1. In player, tap Subtitles icon → "Search Online"
2. App matches filename/hash against subtitle provider, shows list by language
3. User selects → downloads, auto-applies, syncs by default at 0ms offset
4. User can nudge sync via slider if audio drifts

**Flow D — Gesture-Driven Seek**

1. User horizontal-swipes on video
2. Playback pauses scrubbing preview shows target frame thumbnail + delta (non-destructive preview)
3. On release, seeks to target position and resumes

**Flow E — Backgrounding to PiP**

1. User presses device Home button while video plays
2. App requests PiP mode → shrinks to floating window, system-level, continues playback
3. Tap floating window → returns to full app

## 7. Non-Functional Requirements

- Cold start to first frame < 1.5s on mid-range device for local files
- No dropped-frame stutter on 1080p H.264/HEVC on devices from last 4 years
- APK/IPA size kept lean; no bundled ad SDKs, no analytics SDKs beyond optional/opt-in crash reporting (e.g. self-hostable or none by default)
- Fully functional offline (subtitle download is the only feature needing network)
- Accessible: TalkBack/VoiceOver labels on all controls, minimum tap target 44x44dp

## 8. Open Questions (for you to confirm before Doc 2 finalizes tech stack)

1. **Platforms**: Android-only v1, or Android + iOS simultaneously?
2. **Team size/skillset**: Solo dev? Kotlin/Swift experience, or prefer single codebase (Flutter/RN)?
3. **License preference**: GPLv3 (matches libVLC/libmpv copyleft) vs MIT (would require an alternative engine)?
4. **Subtitle provider**: OpenSubtitles (needs API key/rate limits) acceptable, or prefer a different provider?
