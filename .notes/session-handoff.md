# Session Handoff — Continue Later

## Done this session

1. **Versioning fixed** (quran_lights pattern, fully working):
   - `public/VERSION` is the single canonical semver source (currently `1.0.6`)
   - `.githooks/post-commit` auto-bumps on conventional commits (no loop)
   - User-facing version is **always clean** (no `-dirty`, no git hash)
   - 77/77 tests pass, typecheck clean, deploy succeeded

2. **Per-store logo + admin flow added**:
   - `src/lib/storeLogo.ts`: procedural SVG logo/banner generator with 5 warm bazaar palettes, Arabic-first Amiri typography. No external CDN dependencies.
   - `src/components/storefront/Header.tsx`: img onError falls back to the procedural logo if the CDN URL 404s.
   - `src/data/store.ts`: replaced the broken Cloudinary 404 URLs with procedural SVGs.
   - **Firestore re-seeded** — the live demo's logo/banner are now the procedural SVGs.
   - `src/pages/admin/StoreSignupPage.tsx`: public `/admin/signup` — creates a new store + its first admin user + UserProfile.
   - `src/pages/admin/StoresListPage.tsx`: `/admin/stores` — platform-admin list view of all stores.
   - `src/components/admin/Sidebar.tsx`: added "Stores" link.
   - `src/pages/admin/LoginPage.tsx`: added "create new store" link.
   - Firebase: added `setDoc`, `getAllStores`, `createStore`, `createUserProfile`. Auth: added `signUpWithEmail` + `signUp` in AuthContext.
   - 7 new unit tests for the logo util. **77/77 tests pass.**

## Live state
- **Live**: `https://simplestore77.web.app` (footer shows clean `v1.0.6`)
- **Last commit**: `0309d4f` on `master`, pushed to `github.com:Amr1977/simplestore.git`

## Next steps (in order)

1. **CRITICAL — Firestore rules for new collections** (without these, `createUserProfile` will be rejected on first signup):
   - `userProfiles` collection: allow create if `request.auth.uid == userId`
   - `stores` collection: allow create (currently may only allow read for known stores)
   - Check `firestore.rules` and add appropriate rules.

2. **Verify on phone**: visit `https://simplestore77.web.app` — logo should now render in the header (procedural SVG, no more 404). Add to cart still works correctly (CSS fix in `c9a3ccc`).

3. **Test the new admin flow**:
   - Go to `/admin/login`, click "أنشئ متجراً جديداً" → fill form → should land on `/admin` with the new store active
   - Existing admins at `/admin/stores` should see the new store in the list

4. **Capacitor local verification**:
   ```
   npx cap add android  # one-time, creates android/ dir
   npx cap sync android
   ```

5. **Optional: release signing key** — set `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`, `ANDROID_STORE_PASSWORD` as GitHub secrets to enable release-signed APKs in `.github/workflows/android.yml`.

6. **Mobile-first audit** (still on the queue): `ProductCard`, `HomePage`, `Header` — many `md:col-span-2 lg:col-span-2` patterns where base mobile styles are an afterthought.

## Key file references
- `src/lib/storeLogo.ts:1` — procedural logo generator (the centerpiece of the logo fix)
- `src/pages/admin/StoreSignupPage.tsx:1` — public store + admin signup
- `src/pages/admin/StoresListPage.tsx:1` — admin store list
- `src/data/store.ts:1` — demo store data (now uses procedural logos)
- `src/firebase/firestore.ts:185-200` — new helpers (`getAllStores`, `createStore`, `createUserProfile`)
- `src/firebase/auth.ts:14-17` — `signUpWithEmail`
- `src/components/storefront/Header.tsx:62-75` — img onError fallback
- `src/generated/version.ts` — auto-generated, **do not edit**

## Aesthetic direction
"Bazaar / editorial" — terracotta `#b04a2f`, saffron `#d4a04a`, cream `#f6f1e8`, Amiri Arabic display font, asymmetric hero card spanning 2 rows on `lg:`. Flagship quality, not MVP, not generic AI-slop.
