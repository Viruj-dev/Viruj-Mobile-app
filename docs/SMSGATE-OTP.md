# Mobile OTP with an Android SMS gateway

Flow: Viruj app → `/api/mobile/auth/phone-otp/send` → Better Auth → SMSGate cloud → your gateway phone's SIM → recipient.
Verification uses `/api/mobile/auth/phone-otp/verify` and returns the existing mobile access/refresh tokens. Gateway credentials never go into the mobile app.

## Gateway phone setup

1. Install the secure APK from https://github.com/capcom6/android-sms-gateway/releases on an Android phone with an active SIM and SMS allowance.
2. Enable Cloud server and tap START SERVICE, then grant Send SMS permission when prompted. Older versions use an Offline/Online button.
3. The Cloud Server section generates a username and password automatically. No separate registration is required.
4. Keep this phone powered, connected to the internet and cellular network. Check battery restrictions if delivery is delayed.
5. If cloud messages stay Pending until their TTL expires, use Settings → Cloud Server → Notification Channel → SSE Only, then stop and start the service. This uses a persistent connection and may use more battery than automatic push notifications. Confirm a fresh OTP reaches the recipient.

## Backend configuration

In `virujhealthapp`, add server-only `SMSGATE_USERNAME` and `SMSGATE_PASSWORD` to an ignored environment file (local development uses `.env.development.local`). Restart the auth server.
The mobile API in `viruj-backend` needs `WEB_AUTH_BASE_URL` pointing to that auth server: locally `http://127.0.0.1:3000`; production uses the deployed auth server with gateway credentials configured there.
The mobile app needs `EXPO_PUBLIC_API_BASE_URL` pointing to the mobile API. For the USB-connected test phone with `adb reverse tcp:4000 tcp:4000`, `http://127.0.0.1:4000` works. Wi-Fi testing needs the computer's LAN address.

### Local gateway for USB development

Enable Local server in SMSGate. Forward it with `adb forward tcp:18080 tcp:8080`, then set `SMSGATE_API_URL=http://127.0.0.1:18080/messages` and use the **Local server** username/password in the auth server's ignored environment file. This sends directly to the phone without cloud notifications. Keep USB connected. Leaving `SMSGATE_API_URL` empty uses the cloud endpoint and requires Cloud server credentials.

## Delivery and cost

The gateway software and public cloud are currently free; the SIM's SMS plan and carrier restrictions still apply. SMS arrives from the gateway SIM number.
API success means queued, not delivered. The phone must actually send it. OTPs expire after five minutes; the gateway queue has a 300-second TTL and high priority. Per-phone resend cooldown is 30 seconds. Better Auth verifies codes, limits attempts to three, and deletes consumed codes.

Delivery reports are disabled to avoid a documented cause of Android's `RESULT_ERROR_GENERIC_FAILURE`. If sending still fails with that error, test a normal SMS from the gateway phone to the same recipient and check its SIM's SMS allowance, service and default SMS SIM. See https://docs.sms-gate.app/faq/errors/.

Live check: send to a different phone/number, confirm receipt, verify, sign out and sign in again; also check wrong/expired/reused codes. Do not treat a mock test or accepted queue as proof of delivery.

References: https://docs.sms-gate.app/getting-started/public-cloud-server/ and https://docs.sms-gate.app/pricing/
