# Contributing to Aperture Player

Thank you for your interest in contributing to Aperture Player! We welcome contributions from the community.

## Code of Conduct & Open Source Values

Aperture Player is a free and open-source project released under the **GNU General Public License v3 (GPLv3)**. We strictly maintain:

- **No Ads, Tracking, or Paywalls:** Any PR adding ad SDKs, analytics, tracking, or locked features will be rejected.
- **Respectful & Inclusive Environment:** Treat all contributors and users with respect.

## Development Constraints

- **React Native + Expo Managed Workflow:** We build using Expo and EAS remote builds.
- **Never Hand-Edit `android/` or `ios/`:** Platform configuration must be expressed declaratively via Expo Config Plugins in `app.config.js` or `plugins/`, and native code goes in `modules/` using the Expo Modules API.
- **Code Style & Formatting:** Ensure code passes `npm run typecheck`, `npm run lint`, and `npm test` prior to submitting pull requests.

## How to Submit a Pull Request

1. Fork the repository and create your feature branch:
   ```bash
   git checkout -b feature/my-new-feature
   ```
2. Make your changes and commit with descriptive messages following Conventional Commits (e.g. `feat: ...`, `fix: ...`).
3. Ensure all CI checks pass locally:
   ```bash
   npm run typecheck
   npm run lint
   npm test
   ```
4. Push your branch to GitHub and open a Pull Request targeting `main`.
