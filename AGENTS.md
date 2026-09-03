# Abu Qir Grocery — Agent Notes

## Versioning (quran_lights pattern)

- `public/VERSION` is the single canonical version (plain `MAJOR.MINOR.PATCH`).
- `scripts/generate-version.mjs` reads it, bumps it on conventional commits,
  mirrors to `package.json`, and writes `src/generated/version.ts` for the
  app to import.
- The user-facing footer shows `APP_VERSION` — a clean semver string.
  Never dirty, never with a git hash, never with a commit count.
- `.githooks/post-commit` is wired via `core.hooksPath = .githooks` and
  auto-bumps PATCH on every `fix:` / `chore:` / `docs:` / etc. commit.
  - `feat:` / `perf:` → minor
  - `BREAKING CHANGE` or `!:` → major
- Manual override: `node scripts/generate-version.mjs {major|minor|patch}`.
- The prebuild/predev scripts also re-run this so the generated file is
  always up to date before any build.
