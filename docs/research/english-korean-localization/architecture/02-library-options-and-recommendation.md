# Library Options And Recommendation

**Scope:** Evaluate localization approaches for Claude Studio’s English-default, Korean-supported retrofit across Electron, web, and shared UI.

## Recommendation

Choose **`i18next` + `react-i18next`**.

It is the best fit for this repo because it combines:

- explicit fallback chains
- namespace-based resource organization
- workable TypeScript support
- shared-instance patterns across package boundaries
- a gradual migration path from hard-coded strings

## Comparison

| Option | Strengths | Weaknesses | Fit For Claude Studio |
|---|---|---|---|
| `i18next` + `react-i18next` | Strong fallback model, namespaces, React hooks, typed resource support, incremental migration | Monorepo/shared-instance setup needs discipline | **Best fit** |
| `FormatJS` / `react-intl` | Strong ICU/message-formatting model, good imperative API, extraction pipeline | Higher retrofit friction, weaker namespace story, more message-descriptor overhead | Credible, but heavier than needed |
| Thin custom dictionary/context | Small day-1 footprint, no extra dependency | You own fallback logic, typing, interpolation, plurals, extraction, and long-term debt | Not recommended |

## Why `i18next` Wins

### 1. Fallback Behavior Matches The Product Requirement

Claude Studio needs:

- English default
- Korean explicit override
- English fallback when Korean coverage is incomplete

i18next directly supports this through `fallbackLng`, `supportedLngs`, and namespace fallback: <https://www.i18next.com/principles/fallback>

That is a cleaner fit than `react-intl`, whose default-message model is workable but less aligned with locale-chain fallback.

### 2. Namespace Organization Fits This Monorepo

Claude Studio has shared UI plus two apps. i18next’s namespace model maps well onto:

- shared/common strings
- page/feature namespaces
- optional lazy loading per feature

Docs:

- <https://www.i18next.com/principles/namespaces>
- <https://react.i18next.com/latest/i18nextprovider>

### 3. Retrofit Cost Is Lower

This repo is already full of hard-coded literals. `i18next` lets the team:

- move strings into keyed resources
- call `t(...)` from hooks/components
- migrate feature-by-feature

That is simpler than reshaping the codebase around `defaultMessage`, extraction rules, and message descriptors from the start.

### 4. TypeScript Story Is Good Enough And Improving

i18next supports typed resources and selector-oriented typing:

- <https://www.i18next.com/overview/typescript>

This is especially useful in a repo where translation keys will be touched across many files during migration.

## Why Not `react-intl`

`react-intl` remains a strong library, especially when ICU-first authoring and message extraction are the main priorities. But for Claude Studio, its trade-offs are worse:

- more descriptor/extraction ceremony during retrofit
- weaker built-in namespace conventions
- higher message-ID discipline burden across shared packages
- more effort up front to reach parity with the needed fallback/resource layout

Useful docs:

- `react-intl` overview: <https://formatjs.github.io/docs/react-intl/>
- API: <https://formatjs.github.io/docs/react-intl/api/>
- extraction: <https://formatjs.github.io/docs/getting-started/message-extraction/>

## Why Not A Custom Dictionary

A custom dictionary/context looks cheap only at the beginning. Over time it forces the repo to reinvent:

- fallback behavior
- interpolation and escaping
- pluralization
- resource loading strategy
- typed key safety
- extraction and translator workflow

For a repo that already spans Electron, web, and shared UI, that is avoidable debt.

Relevant critique:

- <https://tolgee.io/blog/dont-create-your-own-i18n-library>

## Practical Constraints To Watch

Even with the recommended approach, watch these implementation details:

- keep one shared i18n runtime per app
- avoid package-boundary duplication of the i18n instance
- verify bundler/export behavior for the new shared i18n package in this monorepo
- keep English complete so Korean can fall back safely during migration

## Decision

For this repo, the decision should be:

- **library**: `i18next` + `react-i18next`
- **default locale**: English
- **supported alternate locale**: Korean
- **persistence**: app-owned Electron state for Studio, browser-local state for Web
- **organization**: shared namespaced resources in a monorepo package

## Sources

- <https://www.i18next.com/principles/fallback>
- <https://www.i18next.com/principles/namespaces>
- <https://www.i18next.com/overview/typescript>
- <https://react.i18next.com/latest/i18nextprovider>
- <https://formatjs.github.io/docs/react-intl/>
- <https://formatjs.github.io/docs/react-intl/api/>
- <https://formatjs.github.io/docs/getting-started/message-extraction/>
- <https://tolgee.io/blog/dont-create-your-own-i18n-library>
