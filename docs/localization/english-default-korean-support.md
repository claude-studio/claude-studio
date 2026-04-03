# English-Default, Korean-Supported Localization

## Goal

Claude Studio should be easy to discover, install, and understand for the widest possible audience without dropping Korean support for existing users.

That means:

- English is the default language for the public website, onboarding copy, and first-run product experience.
- Korean remains fully supported as a first-class product language.
- Switching languages must be visible, immediate, and reversible.
- Internal maintainer reference docs under `.claude/reference/` stay out of scope for this rollout.

## Product Rules

- Default locale: `en`
- Supported locales: `en`, `ko`
- Public landing page: English first, Korean switch visible in the header
- Studio desktop app: English first, Korean switch visible in the shell and again in `/data`
- Persistence:
  - Web stores locale in browser storage
  - Studio stores locale per device through the Electron app locale store

## Why English Default

- Public repos, landing pages, and README files are entry points for contributors, users, and search.
- English lowers the barrier for issue triage, community discovery, and third-party sharing.
- English default does not remove Korean identity. It simply means the first layer is accessible to more people before they opt into Korean.

## Why Korean Still Matters

- Existing Korean users should not lose speed or comfort.
- The product already has Korean-oriented assumptions in copy and workflows.
- Korean support remains visible and easy to activate instead of being hidden behind settings menus or browser defaults.

## UX Requirements

- The language switcher must be visible from the top-level shell, not buried in a settings page.
- The switcher must use language autonyms:
  - `English`
  - `한국어`
- The currently active locale should be obvious.
- Changing language should update the interface immediately and persist reliably.
- Public-facing copy should avoid culture-specific phrasing that does not translate cleanly.

## Documentation Scope

Translate or maintain in English:

- Root `README.md`
- Public-facing docs under `docs/`
- Landing page copy
- First-run and settings copy inside the app

Do not translate in this rollout:

- `.claude/reference/`
- Maintainer-specific internal notes that are intentionally private or workflow-specific

## Translation Standards

- Write source-of-truth copy in English for public-facing surfaces.
- Treat Korean as a maintained companion locale, not a machine-translated afterthought.
- Prefer concise product language over slang or jokes.
- Keep terminology stable across README, landing page, and app UI:
  - cost
  - tokens
  - sessions
  - projects
  - live monitoring
  - language

## Implementation Notes

- Shared runtime: `@repo/i18n`
- Namespace strategy:
  - `common`
  - `settings`
  - `studio`
  - `analytics`
  - `web`
- Locale changes should update both runtime translation state and the persisted preference before claiming success.
- User-facing formatters should be locale-aware:
  - currency
  - compact numbers
  - durations
  - dates
  - relative time

## Review Checklist

- README is readable in English from top to bottom.
- Landing page ships English as default and Korean as a visible alternative.
- Studio launches in English by default.
- Korean can be selected from a visible shell control and from `/data`.
- Shared analytics UI does not fall back to Korean-only formatting.
- `.claude/reference/` remains untouched.
