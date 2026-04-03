# Project Integration Map

**Scope:** How the localization research connects to Claude Studio’s current codebase, current documentation, and the implementation work that should follow.

## Existing Repo Reality

Claude Studio is currently split between:

- a Korean-first public `README.md`
- a Korean-heavy Electron renderer and landing page
- Korean user-facing labels embedded in `packages/ui`
- internal `.claude/reference` materials that remain Korean and internal for now

This means the project’s localization problem is not just “translate the README.” It is a repo-wide public-interface issue spanning docs, app shell, page content, and shared UI components.

## Existing Doc To New Research Mapping

| Existing file or surface | What exists today | New research adds |
|---|---|---|
| `README.md` | Public project overview is Korean-first | English should become the public source of truth, with Korean retained as supported translation |
| `.claude/CLAUDE.md` | Internal project instructions and reference routing in Korean | Confirms this should remain internal in this pass rather than be rewritten immediately |
| `.claude/reference/*.md` | Internal architecture and implementation references | Public docs should move English-first; internal references need a later publish-or-translate decision, not an immediate rewrite |
| `apps/studio/src/renderer/src/routes/__root.tsx` | Hard-coded Korean route titles | Route text should move to translation keys and locale-aware metadata |
| `apps/studio/src/renderer/src/widgets/app-sidebar/index.tsx` | Hard-coded Korean navigation and settings chrome | Supports a visible shell-level language switch plus localized navigation |
| `apps/studio/src/renderer/src/pages/data/index.tsx` | Korean settings copy and a natural place for backup language settings | Research recommends `/data` as the backup path, not the only path |
| `packages/ui` chart/layout components | Korean labels/tooltips inside shared UI | Requires shared localization infrastructure, not app-local string maps |
| `packages/ui/src/hooks/use-theme.tsx` | Theme persisted in renderer local storage | Locale persistence should be app-owned too, but in Studio should move to main/preload instead of copying theme’s renderer-only model |
| `packages/shared/src/shared/api/claude-reader.ts` and Studio settings IPC | Reads Claude-owned settings from `~/.claude/settings.json` | Research says locale must not live there; Claude Studio needs its own persistence boundary |

## What The Research Changes

### 1. It Changes The Target Boundary

Before research, the easiest temptation was to treat localization as:

- replace strings
- add a settings toggle
- translate README

After research, the correct boundary is:

- shared i18n infrastructure across Electron, web, and `packages/ui`
- visible shell-level switcher plus `/data` backup path
- English canonical public content with Korean maintained intentionally
- explicit drift controls and locale ownership

### 2. It Changes The Persistence Decision

Before research, locale might have been stored in:

- renderer `localStorage`
- or incorrectly inside `~/.claude/settings.json`

The architecture research makes the better boundary explicit:

- Studio locale is app-owned state persisted through Electron main/preload under `userData`
- Web locale can use browser-local persistence

### 3. It Changes The Scope Of Translation

Before mapping the repo, it looked possible to localize pages only.

That is incorrect because `packages/ui` already contains Korean tooltips, empty states, chart labels, and card text. The localization layer must reach shared UI components, not only app pages.

### 4. It Changes The Rollout Tone

The governance research clarifies that this should not be pitched as “removing Korean.” The maintainer-facing explanation should be:

- English becomes the access layer for public-facing surfaces
- Korean stays real and maintained
- internal `.claude/reference` remains internal in this phase

## Implementation Implications

The most direct engineering follow-ons are:

1. Add shared locale infrastructure.
2. Add Studio locale persistence and preload/API surface.
3. Add a visible shell-level switcher in Studio.
4. Add a `Language` section in `/data`.
5. Translate shared UI components in `packages/ui`.
6. Translate web landing copy and public docs.
7. Keep `.claude/reference` untouched for now but explain the boundary clearly.

## New Findings Not Explicit In Existing Docs

- Locale should be **app-owned**, not Claude-owned.
- English should be the **single public source language**.
- Korean support needs **review ownership and stale-state handling** to stay credible.
- The switcher must be **visible in the app shell**, not settings-only.
- The repo needs docs tracking fixed locally because `docs/` was globally ignored in this environment.

## Decision Reinforcements

These existing repo facts are reinforced by the research:

- shared UI means shared localization
- the current top bar and `/data` page already provide strong integration points
- the current README and web landing page are the highest-leverage public translation surfaces

## Output Of This Integration Map

The implementation should now proceed as:

- research corpus complete
- design/spec documenting the chosen repo-specific rollout
- implementation plan with task slices
- execution of locale infrastructure, switcher, translation, and docs updates
