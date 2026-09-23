# Viruj Health mobile

Native Expo 54 / React Native 0.81 application. Application ID: `com.virujhealth.app`.

## Development

Run `bun install`. The mobile app uses **`../viruj-backend`** for Google and Facebook authentication and all mobile API traffic.
See [social sign-in setup](../viruj-backend/docs/mobile-social-auth.md) for provider consoles, server configuration, and the verification matrix.

Set `EXPO_PUBLIC_API_BASE_URL` in `apps/mobile/.env.local` to the backend on port 4000.
Use `http://10.0.2.2:4000` for Android emulator or your computer's LAN IP for a physical phone.
Copy `apps/mobile/.env.example` to `.env.local` and set both Google client IDs, the Facebook app ID and client token, and the API URL. Never bundle the Facebook app secret or database credentials. Restart Expo and rebuild the native app after changing provider IDs.

Run `bun run dev:api` and `bun run dev:mobile` in separate terminals.
The native Google and Facebook SDKs require a development or release build; Expo Go cannot run sign-in.
Use the built-in **Explore UI preview** for synthetic offline data.

Only the existing central backend endpoints are available. Web-only feature endpoints still need implementation in viruj-backend; the app does not fall back to virujhealthapp.

## Checks

From `apps/mobile`:

```sh
bun run check-types
bun test
bunx expo install --check
bunx expo export --platform android
```

Use an isolated test database and synthetic accounts for integration tests. Do not seed production. Unit tests use in-memory fixtures and never call production.

## Android builds

Use JDK 17 or the Android Studio bundled JDK, Android SDK platform 36, and an emulator/device. Set `ANDROID_HOME` to the installed SDK directory.

```sh
cd apps/mobile
bunx expo prebuild --platform android
bunx expo run:android
```

For EAS, authenticate with the owner's Expo account and associate the project, then run `eas build --platform android --profile preview` for an APK or `eas build --platform android --profile production` for a signed AAB. Review the application ID first. Keep signing files outside Git. EAS uploads source and may incur build charges; no cloud build or publication has been performed by these instructions.

## iOS builds

On macOS with Xcode, set the same Expo public variables and run `bunx expo prebuild --platform ios` then `bunx expo run:ios`. Register bundle ID `com.virujhealth.app` with both providers. The Google and Facebook config plugins add their return URL schemes. Use a native development build and a signed release build for final checks.

See `docs/FEATURE-PARITY.md` for workflow scope and unverified integrations. Implemented source, passing checks, built AAB, and Play submission readiness are separate milestones.


### Review every web app page

On the development launch screen, choose **Review all web app pages** for the UI review menu, or **Explore UI preview** for the normal navigation. Both use local sample data. The mobile pages follow the corresponding `virujhealthapp/src/app` source; backend-dependent operations remain a separate phase. See `docs/FEATURE-PARITY.md` for the exact integration and verification boundaries.

