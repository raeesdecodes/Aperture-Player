# Aperture Player — Design System

## 1. Design Principles

1. **Video is the hero, chrome disappears.** Controls fade to nothing within 3s of inactivity; the player screen is edge-to-edge, immersive, system bars hidden.
2. **Every gesture has instant, legible feedback.** No gesture is "silent" — a value bar, icon pulse, or ripple always confirms what just happened.
3. **Dark by default.** Media consumption happens in low light; dark/AMOLED-black themes reduce eye strain and battery draw on OLED screens.
4. **Zero visual clutter from monetization.** No banner slots, no "upgrade" badges, no dialog interstitials — this is a structural design constraint, not just a policy.

## 2. Color Palette

### Dark (default)

| Token                 | Hex             | Usage                                                 |
| --------------------- | --------------- | ----------------------------------------------------- |
| `background.primary`  | `#0E0E10`       | App background, player background                     |
| `background.surface`  | `#1A1A1D`       | Cards, sheets, library tiles                          |
| `background.elevated` | `#242428`       | Modals, bottom sheets                                 |
| `accent.primary`      | `#5B8CFF`       | Play button, active slider fill, selected states      |
| `accent.secondary`    | `#FF7A59`       | Recording/live indicators, warnings (subtle use only) |
| `text.primary`        | `#F5F5F7`       | Titles, primary labels                                |
| `text.secondary`      | `#A0A0A8`       | Timestamps, metadata, disabled                        |
| `overlay.scrim`       | `#000000` @ 55% | Gradient behind player controls overlay               |
| `divider`             | `#2C2C30`       | Hairlines                                             |

### AMOLED Black variant

Same tokens, `background.primary` → `#000000`, `background.surface` → `#0A0A0A` (true black for OLED power savings).

### Light (optional/secondary)

| Token                | Hex       |
| -------------------- | --------- |
| `background.primary` | `#FAFAFA` |
| `background.surface` | `#FFFFFF` |
| `accent.primary`     | `#3D6BFF` |
| `text.primary`       | `#1A1A1A` |
| `text.secondary`     | `#6B6B70` |

Player screen itself **always uses the dark scrim overlay regardless of app theme** — video controls must stay legible over arbitrary video content.

## 3. Typography

- Font: **Inter** (open-source, excellent legibility at small sizes, wide language coverage) or system default as fallback to keep bundle lean.
- Scale:
  | Style        | Size/Weight               | Usage                                                                        |
  | ------------ | ------------------------- | ---------------------------------------------------------------------------- |
  | Display      | 28/Bold                   | Empty states, onboarding                                                     |
  | Title        | 20/SemiBold               | Screen titles, now-playing title                                             |
  | Body         | 15/Regular                | List items, metadata                                                         |
  | Caption      | 12/Medium                 | Timestamps, duration badges                                                  |
  | Overlay Time | 16/SemiBold, tabular-nums | Seek time / gesture value labels (must not jitter width while digits change) |

## 4. Spacing & Layout

- Base unit: **4dp** grid (4, 8, 12, 16, 24, 32...)
- Library grid: 2-column portrait / 4-column tablet-landscape, 12dp gutter
- Minimum tap target: **44x44dp** (accessibility requirement from PRD)
- Player control overlay: bottom gradient scrim height ~120dp, top scrim ~80dp (for status-bar-area title/back button)

## 5. Gesture Feedback Components

**Volume/Brightness Indicator**

- Vertical pill, 8dp wide x 120dp tall, positioned at the edge the gesture originated from
- Fill animates with spring physics (no linear snapping), icon (speaker/sun) above the pill changes glyph at mute/max thresholds
- Auto-dismiss 600ms after gesture ends, fade+scale-down exit

**Seek Scrub Overlay**

- Center-screen, shows large delta time (`+00:45` / `−00:12`) with directional chevrons
- Optional thumbnail preview strip above (stretch goal — Phase 6 polish)
- Background: soft blurred scrim circle behind the text for legibility over any video

**Double-Tap Ripple**

- Circular ripple emanates from tap point, contained to left/right third of screen, accompanied by a small "+10"/"−10" label that rises and fades

**Lock Mode**

- Single persistent lock icon, bottom-corner, low-opacity (30%) until tapped; all other gesture zones inert while locked

## 6. Iconography

- Icon set: **Material Symbols (outlined)** or **Lucide** — both open-source, consistent stroke weight (2dp), scalable
- Icons are always paired with a text label in settings/menus; icon-only in the immersive player overlay

## 7. Motion

- Standard transition: 200ms, ease-out for entrances, ease-in for exits
- Overlay show/hide: 150ms fade + 4dp translate
- Spring curve (`Curves.easeOutCubic` equivalent) for gesture-driven value changes (volume/brightness fill) — feels physical, not robotic
- Respect system "reduce motion" accessibility setting: fall back to simple fades, no scale/translate flourishes

## 8. Empty & Error States

- Empty library: friendly illustration (open-source SVG, no stock-photo look), single CTA "Open a file"
- Unsupported/corrupt file: inline error card, plain language ("This file couldn't be played — it may be corrupted or use an unsupported codec"), never a raw error code/stack trace to the user (log full detail internally only)

## 9. Accessibility

- All interactive elements have semantic labels (TalkBack/VoiceOver)
- Color contrast ≥ 4.5:1 for text on background per WCAG AA
- Gestures have equivalent button-based alternatives in the control overlay (gestures are an accelerator, never the _only_ path to an action)
