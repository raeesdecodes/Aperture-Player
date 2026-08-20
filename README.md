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

## 📱 Custom Dev Client Builds (EAS)

Aperture Player utilizes **libVLC** and custom native modules. Because native code is required, development takes place inside an Expo Custom Dev Client build rather than standard Expo Go.

### Steps to Produce the First Android Development Build:

1. **Install EAS CLI & Authenticate:**
   ```bash
   npm install -g eas-cli
   eas login
   ```

2. **Initialize Expo Project Link (first time only):**
   ```bash
   eas project:init
   ```

3. **Run the EAS Development Build:**
   ```bash
   eas build --profile development --platform android
   ```

4. **Install & Run on Device/Emulator:**
   - EAS will compile the Android app in the cloud and generate a downloadable `.apk` link & QR code.
   - Install the resulting APK on your physical Android device or drag-and-drop onto an Android Emulator.
   - Start the local JavaScript Metro bundler:
     ```bash
     npx expo start --dev-client
     ```
   - Connect the app to your local bundler by scanning the QR code or selecting the local server link in the dev client launcher.

---

## 📄 License

This project is licensed under the [GNU General Public License v3 (GPLv3)](LICENSE).
