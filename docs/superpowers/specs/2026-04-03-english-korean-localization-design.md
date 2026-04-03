# English/Korean Localization Design

## Purpose

Convert Claude Studio from a Korean-first public/project experience into an **English-default product with Korean as a first-class supported language**, while improving the language-setting UX inside the app and creating a public docs structure that can scale without translation drift.

This spec is written from the explicit instruction to proceed without blocking for clarifying questions. Assumptions are therefore fixed here and should be treated as the implementation contract for this pass.

## Fixed Assumptions

- English becomes the source of truth for public-facing docs and product copy.
- Korean remains a supported locale in the app and on public surfaces that are maintained in this pass.
- `.claude/reference` and `.claude/CLAUDE.md` remain internal and are not translated in this rollout.
- The app must expose a visible language switch from the shell, not only from settings.
- The default language is English, but a Korean-only user must be able to switch immediately.

## Goals

- Add a real localization system shared across `apps/studio`, `apps/web`, and `packages/ui`.
- Make English the default runtime locale.
- Preserve Korean as a complete, intentional alternate locale for migrated surfaces.
- Add a visible Studio switcher plus a backup path in `/data`.
- Translate public docs and landing/app copy into English.
- Add new `docs/` content that explains implementation decisions and maintainer-facing rollout policy.

## Non-Goals

- Translating `.claude/reference` in this pass
- Selecting or integrating a translation-management SaaS
- Full native Electron menu-bar localization if not already surfaced by the current UI
- Generalizing beyond English/Korean in this implementation round

## Five-Lens Synthesis

### 1. Product Lens

Users should experience Claude Studio as English-first on first launch, but never feel trapped there. The language switch must therefore be present in the shell and mirrored in settings.

### 2. Architecture Lens

Localization cannot live only in app pages because `packages/ui` already contains Korean copy. The runtime must be shared across both apps and shared UI, with Electron-specific persistence handled as app-owned state through main/preload.

### 3. Accessibility Lens

Language names must be shown as autonyms (`English`, `한국어`), mixed-language labels need `lang` metadata, focus must remain stable across switching, and language changes should be announced without hijacking focus.

### 4. Governance Lens

English should be the public source of truth. Korean remains supported through explicit review ownership and freshness discipline, not through silent duplication.

### 5. Delivery Lens

This is a retrofit, not greenfield i18n. The implementation should flip the highest-visibility surfaces first, then work inward, with frequent commits and verification at each stage.

## Chosen Design

### Localization Runtime

Use `i18next` + `react-i18next` with namespaced resources.

Planned namespace split:

- `common`
- `navigation`
- `settings`
- `overview`
- `projects`
- `costs`
- `skills`
- `live`
- `landing`

### Package Structure

Add a shared localization package, expected to be `packages/i18n`, that exports:

- supported locale definitions
- default locale definition
- resource bundles
- initialization helpers for Studio and Web
- locale key/type helpers where practical

### Persistence

#### Studio

Persist locale in an app-owned settings file under Electron `userData`, exposed through IPC/preload. Locale must not be stored in `~/.claude/settings.json`.

#### Web

Persist locale in browser-local storage.

### Locale Precedence

Use this order:

1. saved explicit choice
2. supported system/browser hint
3. English fallback

### Switcher UX

Studio will expose:

- a top-bar language action visible on every page
- a `Language` section in `/data`

The shell action should be a direct two-language control:

- English UI shows `한국어`
- Korean UI shows `English`

The `/data` page should show the fuller setting model and current value.

### Translation Scope

Translate in this pass:

- Studio shell and pages
- Web landing copy
- shared `packages/ui` user-facing labels/tooltips
- root README and new `docs/`

Do not translate in this pass:

- `.claude/reference`
- `.claude/CLAUDE.md`

## Component-Level Design

### Studio Main/Preload

- Add locale read/write handlers in main
- expose locale APIs through preload
- keep the API small and explicit

### App Providers

- Wrap both apps with a locale provider above current page rendering
- keep theme provider separate but adjacent
- allow `packages/ui` components to consume the same locale context

### Shell

- replace hard-coded route titles with translated keys
- replace sidebar/static labels with translated keys
- add visible switch control in the top bar

### Settings

- add `Language` section to `/data`
- show current locale and selection controls
- explain that the choice applies to the app

### Shared UI

- remove Korean literals from charts, tooltips, empty states, and labels
- use translation keys or locale-aware labels from the shared runtime

### Web Landing

- translate current Korean public marketing copy to English
- add a web-visible language switch consistent with Studio behavior

## Error Handling And Fallback

- English resources must remain complete throughout the rollout.
- Korean can fall back to English while translation coverage is being completed.
- Missing translations should not crash rendering.
- Language changes should preserve the user’s last explicit choice.

## Docs Design

### Public Docs

- `README.md` becomes English-first
- new `docs/research/english-korean-localization/` remains as decision record
- maintainer-facing rollout explanation should emphasize widening access, not replacing Korean

### Internal Docs

- `.claude/reference` stays untouched
- public docs should explicitly state that boundary to avoid ambiguity

## Verification Strategy

- lint the repo
- typecheck the affected apps/packages
- build the affected apps if feasible
- manually verify Studio switcher, persistence, and fallback behavior
- manually verify web header switcher and public copy

Where automated test coverage is added, it should focus first on locale persistence and core locale selection behavior.

## Risks

- Shared package integration may surface bundler or dependency-boundary issues.
- `packages/ui` translation work may reveal more strings than the initial grep caught.
- If Korean coverage is partial, the product can feel inconsistent unless English fallback is clean.
- Translating README and landing copy without keeping terminology aligned may create drift between docs and UI.

## Implementation Direction

Proceed in this order:

1. shared runtime and persistence
2. visible switchers
3. shell and settings translation
4. shared UI translation
5. landing and README/docs translation
6. verification and PR creation
