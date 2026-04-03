# English Korean Localization Research Master Summary

**Research date:** 2026-04-03  
**Scope:** English-default, Korean-supported localization for Claude Studio across Electron, web, shared UI, and public docs.  
**Sources:** Official library docs, Electron docs, W3C/WCAG/USWDS guidance, OSS governance docs, and practitioner/community reports.

## Document Index

| # | Doc | Key content |
|---|---|---|
| 01 | [Architecture: React/Electron localization architecture](architecture/01-react-electron-localization-architecture.md) | Shared i18n shape, persistence boundary, namespace model, migration order |
| 02 | [Architecture: Library options and recommendation](architecture/02-library-options-and-recommendation.md) | `i18next` decision, comparison against `react-intl` and custom approaches |
| 03 | [UX: Language switcher visibility and onboarding](ux/01-language-switcher-visibility-and-onboarding.md) | Shell placement, first-run behavior, explicit-user-choice precedence |
| 04 | [UX: Korean/English copy and accessibility rules](ux/02-korean-english-copy-and-accessibility-rules.md) | Autonyms, `lang` metadata, focus/announcement rules, copy constraints |
| 05 | [Workflow: Translation content governance](workflow/01-translation-content-governance.md) | Source-of-truth policy, drift prevention, ownership model |
| 06 | [Workflow: Maintainer alignment and rollout](workflow/02-maintainer-alignment-and-rollout.md) | Respectful maintainer framing, rollout sequencing, risks |
| 07 | [Context: Community practices and gotchas](context/01-community-practices-and-gotchas.md) | Retrofit pain points, library experience signals, rollout failure modes |
| 08 | [Context: Project integration map](context/02-project-integration-map.md) | How the research maps to Claude Studio’s actual code and docs |

## Critical Findings

1. **Use `i18next` + `react-i18next`.** It is the best fit for a phased retrofit across Electron, web, and shared UI because it provides namespaces, fallbacks, and workable TS support. Full details: [02](architecture/02-library-options-and-recommendation.md)
2. **Studio locale must be app-owned state.** Do not store it in `~/.claude/settings.json`; persist it through Electron main/preload under `userData`. Full details: [01](architecture/01-react-electron-localization-architecture.md)
3. **A settings-only language switch is not enough.** Claude Studio needs a visible shell-level control plus `/data` as a backup path. Full details: [03](ux/01-language-switcher-visibility-and-onboarding.md)
4. **English should become the public source of truth.** Korean should remain supported, reviewed, and visible, but public docs and product copy need one canonical source. Full details: [05](workflow/01-translation-content-governance.md)
5. **Do not translate `.claude/reference` in this pass.** Keep it internal, explain the boundary, and revisit publication or translation later. Full details: [05](workflow/01-translation-content-governance.md), [06](workflow/02-maintainer-alignment-and-rollout.md)
6. **Shared UI changes are mandatory.** The repo already embeds Korean user-facing strings in `packages/ui`, so localization cannot stay page-local. Full details: [01](architecture/01-react-electron-localization-architecture.md), [08](context/02-project-integration-map.md)
7. **Late i18n retrofits fail on process more than syntax.** The practitioner evidence is clear: missing ownership, stale translations, and hidden switchers break trust faster than library choice alone. Full details: [07](context/01-community-practices-and-gotchas.md)

## Cross-Domain Insights

- **The visible switcher and the governance policy depend on each other.** If English becomes the default but Korean is not easy to reach, the policy feels dismissive. If Korean is visible but not maintained, the UI feels fake. UX and governance must ship together.
- **The persistence boundary is a product decision as much as a technical one.** Storing locale in Electron main/preload is not just cleaner; it makes the language choice durable, app-owned, and future-safe for native surfaces.
- **The repo’s real localization surface is larger than the page list suggests.** The shared UI package is part of the product surface, so the architecture must support package-level translation consumption.
- **Internal-versus-public documentation is the right compromise.** The repo can widen public accessibility now without pretending every internal Korean reference needs immediate translation.

## Action Items

1. Implement shared locale infrastructure and choose `i18next` as the runtime foundation.
2. Add Studio locale persistence through main/preload IPC and web persistence through browser-local state.
3. Add the visible Studio shell switcher and `/data` backup control, using `English` and `한국어`.
4. Translate shared UI package strings before claiming the product is English-default.
5. Translate public entry points first: README, landing page, app chrome, settings surface.
6. Add governance artifacts that define English as public source-of-truth and Korean freshness/ownership rules.
7. Leave `.claude/reference` unchanged in this pass, but document why.

## What This Research Covers Vs. Does Not

### Covered

- library/runtime choice
- Electron/web architecture
- UX placement and copy rules
- translation governance
- maintainer framing
- practitioner pain points
- repo-specific integration points

### Not Covered

- translation management SaaS/tool procurement
- native Electron menu localization implementation details beyond boundary guidance
- a full Korean product-writing style guide
- automated extraction/lint tooling selection beyond architecture implications

## Recommended Implementation Posture

Proceed as an intentional retrofit:

- spec first
- implementation plan second
- then execute locale infrastructure, switcher, translation, and docs changes in bounded commits

This work should not be treated as a find-and-replace task.
