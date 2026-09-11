# Viruj Android feature parity

Source of truth: `../virujhealthapp`, https://app.virujhealth.com. This is a living implementation checklist, not a claim of release readiness.

## Architecture

Keep the existing Expo 54 / React Native 0.81 / TypeScript project. Native screens use the patient web backend through `/api/mobile/*` aliases, which reuse existing route handlers and database tables. Better Auth signed bearer sessions are stored in Android SecureStore. Web preview keeps tokens only in memory. No health data is persisted locally. Existing central-backend OTP code is retained but is not mixed with web-account sessions.

Design: faithfully port the patient web app, as requested on 2026-09-11. Home follows `home-header`, `problem-icons`, `hospital-banner-slider`, `service-categories`, `doctor-card`, and `hospital-card`; bottom navigation follows `bottom-nav`. Reuse the original images, department icons, Merienda font (bundled with OFL license), burgundy header stops, spacing, and section order. Home and navigation are implemented; remaining screens still need visual parity. Native interaction and safe-area adjustments must preserve the web layout. Do not invent a replacement design.

## Workflow inventory

| Web workflow / role | Native destination | Dependency | Implementation / verification |
|---|---|---|---|
| Email login, signup / all accounts | Sign in / Create account | Better Auth | Pending |
| Google / Facebook login | Auth | Provider credentials + native redirect registration | Pending integration; do not substitute an unrelated account |
| Phone OTP | Existing central mobile auth | Separate identity database | Existing implementation retained; web account linking unresolved |
| Password recovery | Reset password | Existing email endpoint | Pending |
| Session restore, renewal, logout | App root | Better Auth bearer plugin | Pending |
| Onboarding / profile edit | Profile | Shared user table | Pending |
| Profile image upload | Profile | Existing upload handler | Pending |
| Doctors: search, pagination, details | Find care | Existing doctors endpoints | Pending |
| Hospitals: search, details, departments, doctors | Find care | Existing hospitals endpoints | Pending |
| Departments / category discovery | Find care | Existing departments endpoints | Pending |
| Pathlabs and detail | Find care | Existing pathlabs endpoints | Pending; web booking behavior must be checked |
| Appointment request / patient | Booking | Existing appointments endpoint | Pending; web creates pending approval, not a confirmed slot |
| My health / appointments | My health | Shared appointments + profile | Pending; remove automatic synthetic appointment insertion |
| Cancel / reschedule / video call | Appointment detail | No corresponding patient web mutation/call integration found | Incomplete web workflow; do not fake success |
| AI text / image conversation | Ask AI | Existing OpenRouter chat endpoint | Pending |
| Voice input / speech output | Ask AI | Existing transcription / speech endpoints | Pending |
| AI history / session bundles / deletion | Ask AI history | Existing AI endpoints | Pending; enforce ownership before reuse |
| AI reports / PDF export | My health | Existing generated reports | Pending; AI-generated content must not be presented as clinician-authored |
| Community feed / search | Community | Existing feed/posts APIs | Pending |
| Post / edit / delete / media | Community | Existing posts APIs | Pending |
| Like / bookmark / report / share | Community | Existing engagement APIs + native Share | Pending |
| Comments / replies / likes | Post details | Existing comments APIs | Pending; web comment like counts are placeholders |
| Awareness / offer posts / doctor, admin | Community composer | Existing server role restriction | Pending; ordinary users must not gain privileged roles |
| Stories / events | Home / community | Existing story/event APIs | Pending |
| Notifications: list / read / delete | Notifications | Existing server actions, thin HTTP adapter needed | Pending |
| Feedback | Profile | Existing feedback endpoint | Pending |
| Privacy policy | Profile | Existing public privacy page | Pending native external link |
| Account deletion | Profile + public resource | No complete web deletion workflow found | Release blocker: retention policy + safe deletion workflow |
| Payments | Booking | No completed patient payment integration found | Do not reuse ERP SaaS billing for patient payments |
| Push / reminders | Notifications | No complete native push registration found | In-app inbox is separate; native push pending |

## Verification boundaries

No staging account was provided. Use isolated synthetic fixtures for client checks; never write to production to test. Cross-platform persistence, provider credentials, Android device behavior, and release signing need separate verification. Owner approved `com.virujhealth.app` as a new application ID. Production deployments and Play publication are not authorized.

## Visual checkpoint — 2026-09-11

Home and floating navigation inspected in the local synthetic browser preview. Department tiles use the existing `/departments/:slug/doctors` API; More Departments expands, original offers have previous/next controls, and service tiles open their directories. Clinics and Radiology remain disabled as on the web. The icon strip is rasterized at 3x from the exact React Icons used by the web `problem-icons.tsx` component. Header colors are sRGB conversions of the existing OKLCH brand variables. TypeScript, 27 existing tests, and Android JS export passed. This does not establish APK/device readiness or complete visual parity across every screen.

## Auth visual parity — 2026-09-11

The native auth entry now follows the web welcome → three-slide onboarding → login flow, followed by signup and password recovery. Original onboarding images were already bundled; the three white curve masks reproduce the web SVG clip paths. Forms match the web centered headings, Merienda type, field backgrounds, red buttons, social row, and footer links. Native touch targets and keyboard scrolling remain accessible. Browser checks covered login, signup, confirmation mismatch, and password-reset layout; unit checks cover consent, confirmation, and email validation.

Remember me is forwarded to Better Auth. Signup uses the existing eight-character backend password minimum rather than the web UI’s weaker six-character validation. Google/Facebook buttons explicitly report that native OAuth is not connected; no pretend login or browser-only session handoff. Privacy opens the existing public web page. PWA install prompts are omitted inside the native app. Reset email delivery and real signup require the shared backend; the local fixture does not send mail or create production accounts.
