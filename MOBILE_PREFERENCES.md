# Nearby care and phone alerts

New users choose a saved location before browsing providers. Use current location requests foreground access only; saving keeps coordinates usable with GPS turned off. Manual area search uses the authenticated backend geocoder and never requests GPS access. Settings are stored per account in native secure storage (localStorage for the web preview).

Home, directory lists, department doctors, related doctors and search all use the saved coordinates through the shared resource hook. Choose 5, 10, 25 or 50 km in Location & App Preferences. Clinics now open their own directory. No providers in range shows an empty state; it never expands to the global database automatically.

New users are asked about phone notifications and may choose Maybe later. Settings can request access again or open system settings. Granted access registers the installation with the authenticated backend, retries on app resume and refreshes rotated tokens. Notification taps fetch the owned notification before navigation, including after a cold launch. Sign-out unregisters the installation before clearing credentials; a registration failure is shown when enabling alerts.

Light native haptics run from the root touch listener across app screens, with an 80 ms debounce. Disable Touch feedback in preferences. Web and unsupported devices do not vibrate.

Set `EXPO_PUBLIC_EAS_PROJECT_ID` and configure Expo FCM/APNs credentials, then rebuild the native app. Optional `EXPO_PUBLIC_GOOGLE_SERVICES_FILE` supplies the Android Firebase configuration. Deploy backend push migrations and configure `GEOCODING_URL` as described in `../viruj-backend/MOBILE_DISCOVERY_PUSH.md`. A browser preview cannot verify actual vibration or phone push delivery.
