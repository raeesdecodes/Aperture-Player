# Aperture Player

Aperture Player is a **free, open-source, ad-free mobile media player** built with React Native and Expo that fuses MX Player's fluid, gesture-driven UI with VLC's universal codec support. No ads, no paywalls, no locked "pro" tier — every feature ships free for everyone.

---

## 🌟 Vision & Features

### Core Vision
- **Universal Playback:** Plays virtually any container and codec (MKV, HEVC, AC3, ASS subtitles, etc.) natively via libVLC, with hardware acceleration and seamless software fallback.
- **Fluid Gesture Controls:** Full gesture parity inspired by MX Player Pro — swipe for volume/brightness, drag for frame scrubbing, double-tap to seek, pinch-to-zoom, and screen locking.
- **Community Owned & Ad-Free:** 100% free under the [GNU General Public License v3 (GPLv3)](LICENSE). Zero ads, zero tracking SDKs, zero telemetry.

### Key Features Overview
- **Containers:** MP4, MKV, AVI, MOV, WebM, FLV, TS, 3GP
- **Video Codecs:** H.264, HEVC/H.265, VP8/VP9, AV1, MPEG-4, MPEG-2
- **Audio Codecs:** AAC, MP3, FLAC, OGG/Vorbis, Opus, AC3/E-AC3, DTS, PCM/WAV
- **Subtitles:** SRT, ASS/SSA, VTT, SUB/IDX, local auto-detection, and online search/download via OpenSubtitles REST API.
- **Audio Controls:** Background audio playback with system media controls, audio sync offset adjustment, and 10-band equalizer.
- **Picture-in-Picture (PiP):** Floating mini-player mode on Android.

---

## 🛠️ Architecture & Tech Stack

- **Framework:** React Native + Expo (SDK 57, Managed Workflow + Custom Dev Client)
- **Build Pipeline:** Expo Application Services (EAS Build)
- **Media Engine:** `react-native-vlc-media-player` (libVLC)
- **Gestures & Motion:** `react-native-gesture-handler` + `react-native-reanimated`
- **State Management:** Zustand
- **Database:** `expo-sqlite` + `drizzle-orm`
- **Background Audio:** `react-native-track-player`

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm / yarn / pnpm
- Expo CLI & EAS CLI (`npm install -g eas-cli`)

### Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/raeesdecodes/Aperture-Player.git
   cd Aperture-Player
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Typecheck & Lint:
   ```bash
   npm run typecheck
   npm run lint
   ```

---

## 📄 License

This project is licensed under the [GNU General Public License v3 (GPLv3)](LICENSE).
