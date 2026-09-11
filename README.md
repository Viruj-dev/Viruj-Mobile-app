# Viruj Health Android

Native Expo 54 / React Native 0.81 application. Application ID: `com.virujhealth.app`.

## Development

From this directory run `bun install`. Copy `apps/mobile/.env.example` to `apps/mobile/.env.local` and set the public origin of your test web backend. For an Android emulator use `http://10.0.2.2:3000`; for a physical device use the computer's LAN address. Never bundle database credentials or provider secrets.

Run `bun run dev:mobile`, or from `apps/mobile` run `bun run android` / `bun run web`.

The app uses the **patient web backend**, `../virujhealthapp`. That backend needs its mobile rewrites, Better Auth bearer plugin, and ownership fixes deployed before mobile sign-in works against it. Existing central API OTP components are retained for reference but are not the active login path: they use different accounts.

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

See `docs/FEATURE-PARITY.md` for workflow scope and unverified integrations. Implemented source, passing checks, built AAB, and Play submission readiness are separate milestones.
