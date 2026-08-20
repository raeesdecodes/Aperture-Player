# Aperture Player — Project Directory Structure (v2: Expo/EAS)

No `android/`/`ios/` folders are committed — Expo generates them remotely during EAS `prebuild`. Everything native is expressed as config plugins under `plugins/` or custom native code under `modules/`.

```
aperture-player/
├── app.config.js                 # Expo config, plugin list, permissions (see Doc 2 §3)
├── eas.json                       # EAS build profiles: development / preview / production
├── package.json
├── tsconfig.json
├── babel.config.js                # includes reanimated plugin
├── metro.config.js
│
├── plugins/                       # Custom Expo Config Plugins (no manual native edits)
│   ├── withPipSupport.js          # Android PiP manifest flags
│   └── withVlcPlayerConfig.js     # Any extra manifest/build tweaks the VLC wrapper needs
│
├── modules/                       # Custom native code via Expo Modules API
│   └── aperture-pip/              # Local Expo Module: enterPipMode()/isPipSupported()
│       ├── android/
│       ├── ios/
│       ├── index.ts
│       └── expo-module.config.json
│
├── assets/
│   ├── icons/
│   ├── fonts/
│   └── i18n/
│
├── docs/
│   ├── 1_PRD_and_Features.md
│   ├── 2_Technical_Architecture_and_phases.md
│   ├── 3_File_Directory_Structure.md
│   ├── 4_design.md
│   └── 5_AI_Coding_Prompts.md
│
├── __tests__/                     # Jest unit/component tests, mirrors src/
│
├── src/
│   ├── App.tsx                    # Root component, navigation container
│   │
│   ├── core/
│   │   ├── constants/
│   │   │   ├── appConstants.ts
│   │   │   └── gestureConstants.ts       # sensitivity curves, edge zone widths
│   │   ├── theme/
│   │   │   ├── theme.ts
│   │   │   ├── colors.ts
│   │   │   └── typography.ts
│   │   ├── navigation/
│   │   │   └── AppNavigator.tsx          # react-navigation stack/tabs
│   │   ├── utils/
│   │   │   ├── durationFormatter.ts
│   │   │   └── fileExtensionUtils.ts
│   │   └── components/                   # Shared dumb components (buttons, sliders)
│   │
│   ├── data/
│   │   ├── db/
│   │   │   ├── client.ts                 # expo-sqlite + drizzle-orm setup
│   │   │   └── schema/
│   │   │       ├── mediaItems.ts
│   │   │       ├── watchProgress.ts
│   │   │       └── playlists.ts
│   │   ├── mediaScanner/
│   │   │   └── deviceMediaScanner.ts     # expo-media-library based scan
│   │   ├── remote/
│   │   │   └── openSubtitles/
│   │   │       ├── openSubtitlesApi.ts
│   │   │       └── openSubtitlesTypes.ts
│   │   └── services/
│   │       ├── vlcPlayerService.ts       # implements PlayerService, wraps VLC bridge
│   │       ├── libraryService.ts
│   │       └── subtitleService.ts
│   │
│   ├── domain/                            # Plain TS — no RN/native imports
│   │   ├── types/
│   │   │   ├── mediaItem.ts
│   │   │   ├── subtitleTrack.ts
│   │   │   ├── playbackState.ts
│   │   │   └── equalizerPreset.ts
│   │   ├── interfaces/
│   │   │   ├── playerService.ts
│   │   │   ├── libraryService.ts
│   │   │   └── subtitleService.ts
│   │   └── usecases/
│   │       ├── playMedia.ts
│   │       ├── seekRelative.ts
│   │       ├── searchOnlineSubtitles.ts
│   │       └── applyEqualizerPreset.ts
│   │
│   ├── store/                             # Zustand stores
│   │   ├── usePlayerStore.ts
│   │   ├── useLibraryStore.ts
│   │   ├── useSubtitleStore.ts
│   │   ├── useEqualizerStore.ts
│   │   └── useSettingsStore.ts
│   │
│   └── features/
│       ├── player/
│       │   ├── screens/
│       │   │   └── PlayerScreen.tsx
│       │   └── components/
│       │       ├── GestureLayer.tsx           # Gesture.Race/Simultaneous compositions
│       │       ├── SeekScrubOverlay.tsx
│       │       ├── VolumeBrightnessIndicator.tsx
│       │       ├── PlayerControlsOverlay.tsx
│       │       ├── LockScreenButton.tsx
│       │       └── AspectRatioToggle.tsx
│       │
│       ├── library/
│       │   ├── screens/
│       │   │   ├── LibraryHomeScreen.tsx
│       │   │   └── FolderViewScreen.tsx
│       │   └── components/
│       │       ├── MediaGridTile.tsx
│       │       └── ContinueWatchingRow.tsx
│       │
│       ├── subtitles/
│       │   ├── screens/
│       │   │   └── SubtitleSearchScreen.tsx
│       │   └── components/
│       │       └── SubtitleSyncSlider.tsx
│       │
│       ├── equalizer/
│       │   ├── screens/
│       │   │   └── EqualizerScreen.tsx
│       │   └── components/
│       │       └── EqBandSlider.tsx
│       │
│       ├── pip/
│       │   └── pipService.ts               # thin wrapper calling modules/aperture-pip
│       │
│       ├── playlists/
│       │   ├── screens/
│       │   └── components/
│       │
│       └── settings/
│           ├── screens/
│           │   └── SettingsScreen.tsx
│           └── components/
│
├── LICENSE                                 # GPLv3
├── CONTRIBUTING.md
└── README.md
```

## Directory Rules of Thumb
- **`src/domain/`** stays plain TypeScript — no `react-native`, no VLC bridge imports — keeps business logic testable and engine-swappable.
- **`src/data/services/`** is the only place that talks to the native VLC bridge directly.
- **`plugins/`** and **`modules/`** are the *only* places native/config concerns live — never edit generated `android/`/`ios/` output.
- Each feature under `src/features/<feature>/` owns its own `screens/`/`components/`; shared UI goes in `src/core/components/`.
- Any change under `modules/` requires a new EAS dev-client build; changes elsewhere in `src/` hot-reload against the existing dev client.
