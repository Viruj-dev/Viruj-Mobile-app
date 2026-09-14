# Viruj Health Android

Native Expo 54 / React Native 0.81 application. Application ID: `com.virujhealth.app`.

## Development

From this directory run `bun install`. Copy `apps/mobile/.env.example` to `apps/mobile/.env.local` and set the public origin of your test web backend. For an Android emulator use `http://10.0.2.2:3000`; for a physical device use the computer's LAN address. Never bundle database credentials or provider secrets.

Run `bun run dev:mobile`, or from `apps/mobile` run `bun run android` / `bun run web`.

For temporary OTP-free UI testing, run `bun run tests/fixture-server.ts` and point `EXPO_PUBLIC_WEB_API_URL` in `apps/mobile/.env.local` at that server (port 8093). Set `FIXTURE_HOST=0.0.0.0` for a physical device and use the computer's LAN address. Restart Expo after changing the URL. Enter any valid Indian mobile number and tap **Continue with OTP**; development builds automatically verify the fixture's test code. This uses synthetic data. Remove the local override to return to the real backend; release builds still require OTP entry.

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


### Review every web app page

On the development launch screen, choose **Review all web app pages** for the 25-route UI review menu, or **Explore UI preview** for the normal navigation. Both use local sample data and need no OTP. The mobile pages follow the corresponding `virujhealthapp/src/app` source; backend-dependent operations remain a separate phase. See `docs/FEATURE-PARITY.md` for the exact integration and verification boundaries.
