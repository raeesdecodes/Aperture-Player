# Aperture Player — Play Store & Release Documentation

## 1. Google Play Store Listing Copy

### App Title (30 characters max)
`Aperture Player`

### Short Description (80 characters max)
`Ultra-fast, open-source offline video & audio player. Zero ads, zero tracking.`

---

### Full Description (4,000 characters max)

**Aperture Player** is a modern, high-performance, open-source media player designed for seamless offline video and audio playback. Powered by the robust VLC engine, Aperture Player plays virtually any media file format smoothly with zero ads, zero analytics, and zero tracking.

#### Key Features:
- 🎬 **Universal Format Support**: Plays MP4, MKV, AVI, MOV, FLV, TS, MP3, AAC, FLAC, and more natively via VLC media engine.
- ⚡ **Fluid Gesture Layer**: Swipe left for brightness, right for volume, double-tap to seek, and pinch to zoom into video details.
- 💬 **Online & Local Subtitles**: Auto-detects local `.srt`/`.ass` subtitle files and offers one-tap search and download via OpenSubtitles API.
- 🎛️ **10-Band Equalizer**: Fine-tune your audio with custom frequency gains and built-in presets (Bass Boost, Vocal, Rock, Jazz, Classical, Pop).
- 🖼️ **Picture-in-Picture (PiP)**: Continue watching your video in a floating system window while multitasking on your Android device.
- 🌙 **Modern Design & AMOLED Theme**: Stunning dark mode user interface tailored for modern displays with AMOLED true-black theme options.
- 🔒 **100% Free & Open Source**: Licensed under GPLv3. No ads, no in-app purchases, no telemetry, and no hidden subscriptions ever.

---

### Feature Graphic Text
- **Headline**: "Pure Playback. Zero Distractions."
- **Sub-headline**: "Free, Open Source Media Engine for Android"

---

## 2. EAS Submit Command & Workflow

To submit production Android App Bundles (`aab`) to the Google Play Console:

```bash
# 1. Build Production App Bundle
eas build --profile production --platform android

# 2. Submit to Google Play Store Internal Track
eas submit --profile production --platform android
```

---

## 3. F-Droid Distribution & Reproducible Build Note

Aperture Player is 100% open-source under GPLv3 and qualifies for F-Droid inclusion.
- **Current Architecture**: Uses EAS Cloud Build pipelines for native prebuilding.
- **F-Droid Requirement**: F-Droid builds apps strictly from git source in isolated build containers without third-party cloud build scripts.
- **v1.x Follow-up Plan**: Maintain a dedicated `fdroid` build recipe script using `expo prebuild` in a reproducible Docker container for submission to the main F-Droid repository.
