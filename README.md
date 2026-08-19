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
| `npm run preview` | Preview production build |
| `npm run cap:sync` | Sync Capacitor |
| `npm run cap:build` | Build Android APK |

## Deployment / النشر
- **Web (Firebase):** `firebase deploy`
- **Android:** `npm run cap:build`

## Security / الأمان
- No secrets in client code
- Firestore rules protect data
- Admin routes require auth
- Cloudinary unsigned preset only

## Free Tier Constraints / حدود الباقة المجانية
- Firebase Spark plan
- Cloudinary free tier
- No Cloud Functions
- No paid services
