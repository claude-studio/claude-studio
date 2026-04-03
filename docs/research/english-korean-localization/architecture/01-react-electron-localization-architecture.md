# React Electron Localization Architecture

**Scope:** Target architecture for retrofitting bilingual English/Korean support into Claude Studio’s Electron app, Vite landing page, and shared UI package.

## Recommendation

Adopt a **shared monorepo localization layer** built on `i18next` + `react-i18next`, with:

- English as the canonical source and fallback locale
- Korean as a first-class explicit override
- shared translation resources organized by namespace
- app-owned locale persistence in Electron, not in `~/.claude/settings.json`

## Why The Current Repo Needs A Shared Architecture

Claude Studio’s Korean copy is not isolated to one app:

- `apps/studio` contains hard-coded Korean route titles, navigation, settings, and dashboard copy
- `apps/web` contains Korean landing-page copy
- `packages/ui` contains Korean labels, tooltips, empty states, and chart annotations

That means a page-local dictionary is not enough. The localization layer has to span:

- Studio renderer pages and shell
- Web landing widgets
- shared UI components in `packages/ui`

## Target Resource Shape

Use a dedicated shared package, such as `packages/i18n`, to export:

- `supportedLocales = ['en', 'ko']`
- `defaultLocale = 'en'`
- namespace resource bundles
- locale type helpers
- app initialization helpers for Studio and Web

Recommended namespaces:

- `common`
- `navigation`
- `settings`
- `overview`
- `projects`
- `costs`
- `skills`
- `live`
- `landing`

This matches i18next’s documented namespace model for splitting reusable strings from feature or page-specific strings: <https://www.i18next.com/principles/namespaces>

## Locale Precedence

Use this runtime order:

1. persisted app locale
2. supported OS/browser locale hint
3. English fallback

Lock supported locales to `en` and `ko` only. Missing Korean keys should fall back to English, not blank or raw keys.

Relevant i18next docs:

- fallback behavior: <https://www.i18next.com/principles/fallback>
- configuration options: <https://www.i18next.com/overview/configuration-options>

## Persistence Boundary

### Electron Studio

Persist locale as **app-owned state** under Electron’s `userData`, exposed through main/preload IPC.

Why:

- `app.getPath('userData')` is the standard Electron location for per-app config/state: <https://electronjs.org/docs/latest/api/app>
- the `app` module is main-process-only, so persistence belongs in main rather than renderer-only storage: <https://electronjs.org/docs/latest/tutorial/process-model>
- Electron security guidance favors narrow, explicit preload APIs instead of broad renderer access to privileged state: <https://electronjs.org/docs/latest/tutorial/security>
- `contextBridge` is the right place to expose a small locale API such as `getLocale`, `setLocale`, and `onLocaleChanged`: <https://electronjs.org/docs/latest/api/context-bridge>

Do **not** store locale in `~/.claude/settings.json`. In this repo that file is Claude-owned state surfaced for inspection, not the right home for Claude Studio’s own UI preference.

### Web

Use `localStorage` for the landing page. The web app has no Electron main process, so browser-local persistence is sufficient.

## Provider Layout

Add a locale/i18n provider near the top of each app tree:

- `apps/studio/src/renderer/src/main.tsx`
- `apps/web/src/main.tsx`

The provider should initialize `i18next`, expose `t(...)`, and react to locale changes. Shared components in `packages/ui` should consume the same provider/hook rather than owning separate dictionaries.

## Route And Chrome Strategy

Do not keep route titles or nav labels in hard-coded Korean maps. Instead:

- route metadata should carry translation keys
- shell components should render via `t(...)`
- shared UI copy in `packages/ui` should either consume the provider directly or receive translated labels from the app

This removes the current static Korean map in the Studio shell and makes language switching consistent across navigation and content.

## Migration Order

Use a phased retrofit instead of rewriting everything at once:

1. add the shared i18n package and providers
2. localize app chrome first
3. localize settings and the visible switcher
4. localize high-traffic pages and landing copy
5. localize shared chart/tooltips/empty states
6. sweep remaining errors, dialogs, and fallback text

Practical first slice:

- top bar titles
- sidebar navigation
- language controls
- `/data` page
- landing header and hero

This flips the public experience to English-default quickly without waiting for every dashboard detail to be translated.

## Migration Safety Rules

- English must remain complete throughout rollout.
- Korean can ship incrementally as long as it falls back to English cleanly.
- Do not auto-detect locale in a way that hides the visible switcher.
- Do not mix app-owned locale state into Claude’s own config files.
- Keep one shared runtime i18n instance per app to avoid package-boundary divergence.

## Repo-Specific Implications

For Claude Studio specifically, this architecture implies:

- adding new main/preload IPC for locale persistence in Studio
- updating the renderer provider tree in both apps
- moving hard-coded copy into namespaced locale resources
- touching `packages/ui` because that package already contains Korean user-facing strings

## Sources

- <https://www.i18next.com/principles/namespaces>
- <https://www.i18next.com/principles/fallback>
- <https://www.i18next.com/overview/configuration-options>
- <https://electronjs.org/docs/latest/api/app>
- <https://electronjs.org/docs/latest/tutorial/process-model>
- <https://electronjs.org/docs/latest/tutorial/security>
- <https://electronjs.org/docs/latest/api/context-bridge>
