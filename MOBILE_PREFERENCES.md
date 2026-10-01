# Nearby care and phone alerts

After successful native login, the phone automatically requests foreground location access and notification access once per account. There is no permission onboarding screen. Granted location access saves the current coordinates automatically; saving keeps coordinates usable with GPS turned off. Manual area search uses the authenticated backend geocoder and never requests GPS access. Settings are stored per account in native secure storage (localStorage for the web preview).

Home, directory lists, department doctors, related doctors and search all use the saved coordinates through the shared resource hook. Choose 5, 10, 25 or 50 km in Location & App Preferences. Clinics now open their own directory. No providers in range shows an empty state; it never expands to the global database automatically.

Denied permissions do not block login. Settings can request access again or open system settings. Nearby discovery waits for a saved location and never fetches the global directory when access is denied. Granted access registers the installation with the authenticated backend, retries on app resume and refreshes rotated tokens. Notification taps fetch the owned notification before navigation, including after a cold launch. Sign-out unregisters the installation before clearing credentials; a registration failure is shown when enabling alerts.

Light native haptics run from the root touch listener across app screens, with an 80 ms debounce. Disable Touch feedback in preferences. Web and unsupported devices do not vibrate.

Set `EXPO_PUBLIC_EAS_PROJECT_ID` and configure Expo FCM/APNs credentials, then rebuild the native app. Optional `EXPO_PUBLIC_GOOGLE_SERVICES_FILE` supplies the Android Firebase configuration. Deploy backend push migrations and configure `GEOCODING_URL` as described in `../viruj-backend/MOBILE_DISCOVERY_PUSH.md`. A browser preview cannot verify actual vibration or phone push delivery.

## Android USB development

Adding native libraries requires rebuilding the installed development app. Reloading Metro alone can produce `Cannot find native module 'ExpoLocation'`. Run commands from `apps/mobile` so Expo uses the Viruj configuration; the repository-root Android configuration belongs to a different package.

Use JDK 17 for this project's Gradle 8.14.3 build. Android Studio's bundled Java 25 is incompatible. Set `JAVA_HOME` to your JDK 17 directory and add its `bin` directory to `PATH` for the terminal session. Enable USB debugging on the phone and accept its debugging prompt, then run:

```powershell
cd apps/mobile
bunx expo prebuild --platform android --no-install
adb reverse tcp:8081 tcp:8081
adb reverse tcp:4000 tcp:4000
bun run android
```

Use `http://127.0.0.1:8081` for Metro over USB. The API can use `http://127.0.0.1:4000` when running locally; forwarding must be repeated after reconnecting the phone. Reinstalling a debug APK with `adb install -r` preserves app data when its package and signing key match.

If Windows reports `ninja: error: manifest 'build.ninja' still dirty after 100 tries` in Google sign-in, use the included Gradle init script to shorten that module's generated C++ paths. From `apps/mobile` after prebuild:

```powershell
cd android
.\gradlew.bat :app:assembleDebug -PreactNativeArchitectures=arm64-v8a --init-script ../../../scripts/android-windows.gradle
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

The architecture above targets an ARM64 physical phone. Keep Metro running separately with `bun run dev:mobile` from the repository root.
