# Session Handoff — Continue Later

## Done this session
- Committed `c9a3ccc` and pushed: critical CSS fix removing unlayered `button { background: none }` that was overriding Tailwind's `.bg-ink` utility (root cause of the white-on-white add-to-cart button bug).
- Cleaned up 8 scratch probe files (`probe-*.mjs`).
- `npm run typecheck` passes clean.
- `git status` is clean.

## Where we left off
- Last verified state in summary: `c9a3ccc` pushed to `github.com:Amr1977/simplestore.git`.
- `simplestore77.web.app` last deploy was the `f317dee` bundle (`index-CjET_lEK.js`). The `c9a3ccc` CSS fix has NOT been redeployed yet — only committed/pushed to GitHub.

## Next steps (in order)

1. **Re-deploy to Firebase** so the CSS fix goes live:
   ```
   npx firebase deploy --only hosting --project simplestore77
   ```
   Verify the new bundle hash in the network tab, then re-check an add-to-cart button: `bg` should be `rgb(42, 31, 23)` (dark brown), `color: rgb(255, 255, 255)`.

2. **Run unit tests** to confirm 70/70 still pass:
   ```
   npm test -- --run
   ```

3. **Run Playwright e2e** to confirm ProductPage redesign + cart flow still pass:
   ```
   npx playwright test e2e/happy-path.spec.ts
   ```

4. **Mobile-first audit** (still on the queue): `ProductCard`, `HomePage`, `Header` have many `md:col-span-2 lg:col-span-2` patterns where base mobile styles are an afterthought. Target a clean mobile-first pass.

5. **Dark mode overlay scrim**: in `src/components/storefront/ProductCard.tsx`, `bg-ink/40` for the "غير متوفر" scrim resolves to cream (not dark) in dark mode. Replace with a `var(--color-overlay)` token like the Header drawer fix.

6. **Store logo URL**: `https://res.cloudinary.com/demo/image/upload/grocery-demo/stores/abu-qir-demo/logo` 404s. Either replace with a working logo or add a graceful fallback. Search: `src/data/store.ts` or wherever the store metadata is.

7. **Capacitor verification locally**:
   ```
   npx cap sync android
   ```

8. **Optional: release signing key** — set `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`, `ANDROID_STORE_PASSWORD` as GitHub secrets to enable release-signed APKs in `.github/workflows/android.yml`.

## Key file references
- `src/index.css:95` — the CSS fix (now committed, needs redeploy).
- `src/components/storefront/ProductCard.tsx` — has `bg-ink text-surface-elevated` on add buttons; check the scrim here for item #5.
- `src/components/storefront/Footer.tsx` — already on quran_lights pattern, uses `APP_VERSION` from `src/lib/version.ts`.
- `scripts/generate-version.mjs` — clean version (no git hash).
- `D:/projects/quran_lights_web/public/index.html:593-601` — source of the quran_lights footer pattern.

## Aesthetic direction (don't forget)
"Bazaar / editorial" — terracotta `#b04a2f`, saffron `#d4a04a`, cream `#f6f1e8`, Amiri Arabic display font, asymmetric hero card spanning 2 rows on `lg:`. Flagship quality, not MVP, not generic AI-slop.
