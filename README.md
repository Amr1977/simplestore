# بقالة أبو قير - Grocery Storefront

## Overview / نظرة عامة
Arabic-first, RTL, mobile-first grocery storefront platform built for Egyptian single-vendor grocery stores.
منصة واجهة بقالة عربية أولاً، من اليمين لليسار، مصممة للجوال، للبقالات المصرية ذات البائع الواحد.

## Tech Stack / التقنيات
- React 19 + Vite + TypeScript
- Firebase (Auth, Firestore, Hosting)
- Cloudinary (media storage)
- Tailwind CSS v4
- Capacitor (Android)
- React Router v7

## Architecture / البنية
```
src/
  features/     # feature-based modules (cart, catalog, checkout, admin, auth)
  components/   # shared UI components
  hooks/        # custom hooks
  lib/          # utilities and configs
  firebase/     # Firebase initialization and services
  data/         # seed data and constants
  pages/        # route-level pages
  styles/       # global CSS and Tailwind directives
```

## Local Setup / الإعداد المحلي
1. Clone repo
2. `npm install`
3. Copy `.env.example` to `.env` and fill values
4. `npm run dev`

## Firebase Setup / إعداد فايربيس
1. Create project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password)
3. Create **Firestore** database
4. Deploy rules: `firebase deploy --only firestore:rules`
5. Deploy hosting: `firebase deploy --only hosting`

## Cloudinary Setup / إعداد كلاوديناري
1. Create account at [cloudinary.com](https://cloudinary.com)
2. Create unsigned upload preset
3. Set `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET`

## Environment Variables / متغيرات البيئة
| Variable | Description |
|---|---|
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Unsigned upload preset |
| `VITE_STORE_SLUG` | Store identifier (e.g. `abu-qir-grocery`) |
| `VITE_WHATSAPP_NUMBER` | Store WhatsApp number (national format) |

## Firestore Rules
See `firestore.rules` for full security rules. Key points:
- Products readable by all authenticated users
- Orders readable by the owner and the customer
- Admin actions require auth + custom claims

## Demo Data Seeding
```bash
npm run seed
```

## Commands / الأوامر
| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run Oxlint |
| `npm run typecheck` | Run TypeScript compiler |
| `npm run test` | Run Vitest |
| `npm run test:e2e` | Run Playwright e2e (uses Firebase emulator) |
| `npm run test:e2e:ui` | Playwright UI mode |
| `npm run preview` | Preview production build |
| `npm run cap:sync` | Sync Capacitor |
| `npm run cap:build` | Build Android APK |

## Deployment / النشر
- **Web (Firebase):** `firebase deploy`
- **Android:** `npm run cap:build`

> ⚠️ **`VITE_STORE_SLUG` must be present in `.env` at `npm run build` time**, and its value must match the `slug` field of the seeded store document in the Firestore `stores` collection. If it is missing or wrong, the storefront will render "المتجر غير متاح حالياً" on every page for every visitor, because `StoreProvider` will query Firestore for the wrong slug and get no results. For CI / GitHub Actions deploys, `VITE_STORE_SLUG` (and other `VITE_*` vars) must be injected as build-time environment variables or repo secrets — see `.github/workflows/deploy.yml`. The deploy workflow reads `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`, `VITE_STORE_SLUG`, and `VITE_WHATSAPP_NUMBER` from repo **Variables** (Settings → Variables → Actions).

## Security / الأمان
- No secrets in client code
- Firestore rules protect data
- Admin routes require auth
- Cloudinary unsigned preset only

## E2E Testing / اختبارات نهاية إلى نهاية
This project uses [Playwright](https://playwright.dev) for end-to-end browser tests, scoped to the route map in `src/App.tsx`. The suite is the primary regression guard against build-time env var / store-resolution bugs (e.g. the "المتجر غير متاح حالياً" bug fixed in commit `ee72f83` — see `e2e/home.spec.ts`).

- **Run locally:** `npm run test:e2e` (headless) or `npm run test:e2e:ui` (UI mode).
- **What it does:** Playwright's `webServer` boots the Firebase Local Emulator Suite (Firestore + Auth) and `npm run preview` against the emulator, then `e2e/global-setup.ts` seeds the emulator with the store, categories, products, and a test admin user from `src/data/`.
- **Emulator flag:** the client connects to the emulator only when `VITE_USE_FIRESTORE_EMULATOR=true` is set at build time. The flag is set automatically by `playwright.config.ts` for the e2e build; it is never set in production deploys, so the live site never accidentally points at the emulator.
- **Specs:** `e2e/home.spec.ts`, `category.spec.ts`, `product.spec.ts`, `search.spec.ts`, `cart-and-checkout.spec.ts`, `client-side-nav.spec.ts`, `admin-auth.spec.ts`, `admin-products.spec.ts`, `admin-orders.spec.ts`.
- **CI:** `.github/workflows/deploy.yml` runs `npm run test:e2e` in a `test` job before the `deploy` job, and uploads the Playwright HTML report + traces as artifacts on failure. A failing e2e suite blocks the Firebase deploy.

## Free Tier Constraints / حدود الباقة المجانية
- Firebase Spark plan
- Cloudinary free tier
- No Cloud Functions
- No paid services
