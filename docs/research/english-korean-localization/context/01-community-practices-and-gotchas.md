# Community Practices and Gotchas for English/Korean Localization

## Summary

This handback focuses on practitioner and community signal for retrofitting English/Korean localization into an existing React/Electron codebase. The strongest repeated pattern is that teams do not get hurt by “adding translations” alone; they get hurt by adding i18n late without changing engineering workflow, key governance, release discipline, and UI assumptions. Across GitHub issues, Reddit threads, Hacker News discussion, and migration writeups, the recurring failure modes are: hard-coded strings discovered too late, translation keys that age badly, JSON catalogs that become merge-conflict hotspots, one locale silently going stale, and language controls that are either hidden, mistrusted, or overridden by incorrect auto-detection.

For Claude Studio specifically, the practical implication is clear: treat this as a product-and-maintenance retrofit, not a find/replace exercise. A visible language switcher, shared web/desktop resources, route/feature-based catalogs, CI for missing and stale keys, and explicit ownership for English/Korean parity are not “nice to haves”; they are the difference between a workable bilingual app and a permanently half-localized one.

The evidence below distinguishes repeated patterns from single-source anecdotes. “Repeated pattern” means the same complaint or mitigation appeared in multiple independent sources or source types. “Anecdote” means it is still useful, but came from a narrower slice of evidence.

## Migration Gotchas

### 1. Late extraction from hard-coded UI copy is not automated in the way teams expect

Repeated pattern.

Teams retrofitting i18n commonly expect extraction tooling to rewrite JSX or TSX for them. In practice, it usually does not. The clearest recent example is i18next CLI issue [#183](https://github.com/i18next/i18next-cli/issues/183), opened by `vitonsky` on February 14, 2026. The user expected plain strings like `<Button title="Hello world">I am button</Button>` to be turned into `t()` calls plus JSON entries. Maintainer `adrai` clarified on February 17, 2026 that `i18next-cli` does not instrument or rewrite source; it only extracts keys from code that is already using `t()` or `Trans`. That is a meaningful retrofit gotcha because it means teams must budget for a codemod or manual conversion pass before extraction tools become useful.

This same pain shows up in community discussion. In [r/Frontend](https://reddit.com/r/Frontend/comments/15rnotf/is_it_just_me_or_dealing_with_translations_is_the/), `u/KapiteinNekbaard` complained there is no good out-of-the-box way to keep translations close to modules, and `u/techie2200` described using extraction only to generate blank keys, then handing English-plus-context to translators. On Hacker News discussion [37062755](https://news.ycombinator.com/item?id=37062755), multiple commenters recommended pseudo-locales explicitly because teams otherwise miss hard-coded strings and layout regressions until very late.

Implication for Claude Studio: expect a migration phase with code edits first, extraction second. Plan for an inventory pass, codemod assistance where possible, and manual cleanup around JSX attributes, button labels, tooltips, table columns, empty states, and menu labels.

### 2. Teams regret concatenation, over-reuse, and “single-word” assumptions

Repeated pattern.

The most consistent practitioner warning is not about library APIs; it is about message design. In [r/ExperiencedDevs](https://reddit.com/r/ExperiencedDevs/comments/1n01aev/pointers_on_i18n_best_practices_and_workflow/), `u/meowisaymiaou` argued for scoped IDs and strongly against string reuse, concatenation, and naïve plural handling, using examples like “Save”, “Cancel”, and “Go back” changing meaning by context. A separate commenter, `u/David_AnkiDroid`, agreed on explicit keys and pointed to CLDR plural rules, but still reinforced that context and numeric correctness are required. Hacker News [37062755](https://news.ycombinator.com/item?id=37062755) surfaced the same point from another angle: full sentences translate better than sentence fragments, and interpolation is safer than concatenation only if the system preserves grammatical agreement.

Node.js i18n issue [#50](https://github.com/nodejs/i18n/issues/50) is still one of the clearest maintainers’ explanations of why text-as-key ages badly. On April 3, 2018, `srl295` described the “default language as key” approach as popular but fragile because even punctuation changes can sever the link to existing translations. The same thread also notes a second-order problem that matters for bilingual OSS: if English is treated as a privileged “root,” other languages become structurally second-class.

Implication for Claude Studio: avoid concatenating Korean and English fragments into mixed UI strings; avoid a large global “common” namespace for generic words; prefer one message per context, with scoped semantic IDs and translator notes where needed.

### 3. JSON catalogs become both merge-conflict hotspots and dead-weight bundles

Repeated pattern.

In [r/reactjs](https://reddit.com/r/reactjs/comments/1s01nfj/what_is_the_modern_way_to_do_a_i18n_for_react_app/), several commenters converged on the same operational advice: split namespaces early because one giant `en.json` becomes painful. `u/ajd984` recommended nested keys and route- or domain-level namespace files; another commenter sarcastically highlighted the cost of duplicating “Submit” everywhere without governance. In [r/ExperiencedDevs](https://reddit.com/r/ExperiencedDevs/comments/1n01aev/pointers_on_i18n_best_practices_and_workflow/), the original post described shipping a single 150 KB gzipped message file and called it unsustainable.

The “centralized JSONs create a lot of conflicts” point also appears in the September 5, 2023 Lingui migration writeup (“One Command, One Day, Multiple Languages”), which argues that flat JSON catalogs in `react-i18next` hurt searchability, context, and translator experience. The same theme appears in [r/reactjs](https://reddit.com/r/reactjs/comments/1s01nfj/what_is_the_modern_way_to_do_a_i18n_for_react_app/): if everything is loaded everywhere, route-level bundle hygiene degrades and the team stops pruning unused keys.

Implication for Claude Studio: share translation resources across desktop and web, but do not ship or edit them as one monolith. Use feature-scoped namespaces aligned to product surfaces like navigation, overview, costs, projects, skills, data/settings, and live view.

### 4. Plurals, interpolation, and formatting are where “simple” custom i18n falls apart

Repeated pattern.

The community is unusually consistent here: basic key/value lookup is easy; everything after that is the real reason mature libraries exist. In [r/reactjs](https://reddit.com/r/reactjs/comments/1s01nfj/what_is_the_modern_way_to_do_a_i18n_for_react_app/), `u/CommunicationFun742` pushed back on the idea that a tiny custom helper is enough, explicitly naming plurals, rich formatting, and extraction as the missing hard parts. On Hacker News [37062755](https://news.ycombinator.com/item?id=37062755), commenters warned that grammatical gender, number, case, and sentence order break simplistic interpolation strategies.

The anti-i18next essay [“Don’t use i18next”](https://dev.to/nevodavid/dont-use-i18next-n1a) is opinionated, but its criticism is useful as practitioner pressure-test: non-standard message formats and complex translation-file features age poorly when teams later need ICU-style tooling, TMS compatibility, or richer plural handling. The counter-signal is that multiple Reddit practitioners still recommend `react-i18next` because it handles lazy loading, plurals, RTL, and interpolation without forcing teams to reinvent them. The practical conclusion is not “avoid i18n libraries”; it is “avoid writing a custom one unless your needs are genuinely narrow.”

Implication for Claude Studio: because Korean/English is only a two-language rollout, a minimalist approach can feel tempting. Resist that unless the team is willing to own plural, formatting, extraction, linting, and missing-key detection long term.

### 5. Electron adds its own localization friction outside React

Repeated pattern for Electron-specific UI.

Electron issue [#26231](https://github.com/electron/electron/issues/26231), opened October 28, 2020 and still open as of February 10, 2026 activity, is a useful reminder that desktop localization is not only about React components. The reporter showed that default macOS application menu labels were only partially localized. Electron maintainer `MarshallOfSound` replied the same day that Electron does not provide menu translations out of the box and that apps may need to provide their own labels when constructing menus. The thread continued for years with repeated confirmations from users that standard menu roles and items still lacked correct localization.

Implication for Claude Studio: the bilingual plan must include non-React surfaces: Electron menus, window titles, tray/menu-bar surfaces if any, native dialogs, installer copy if applicable, and strings exposed through preload or IPC-driven notifications.

## Library Experience Signals

### react-i18next

Overall signal: still the default runtime choice for many React teams, but the aging pain is real.

Positive practitioner signal:

- In [r/reactjs](https://reddit.com/r/reactjs/comments/1s01nfj/what_is_the_modern_way_to_do_a_i18n_for_react_app/), `u/lacymcfly` called `react-i18next` the default for non-Next React projects because of ecosystem maturity, lazy-loading namespaces, RTL handling, and plural support.
- The same thread shows broad acceptance that it is “old but still does the job,” especially where teams want a conventional runtime model and lots of community examples.

Negative practitioner signal:

- The September 2023 migration writeup from `react-i18next` to LinguiJS argues that JSON keys lacked semantic meaning, were hard to search, and created translator-unfriendly catalogs.
- GitHub issue [#1171](https://github.com/i18next/react-i18next/issues/1171), opened by `ThisIsMissEm` on September 9, 2020, documents a real production-ish edge case: translations not re-rendering as expected when bundles are reloaded dynamically. Maintainer `jamuhl` explained that the defaults are intentionally conservative to avoid unnecessary re-renders, but the thread shows how quickly “safe defaults” become confusing when teams combine dynamic loading, HMR, and code-splitting.
- GitHub issue [#1636](https://github.com/i18next/react-i18next/issues/1636), opened May 9, 2023, shows another nuance: `useTranslation` causing extra renders in development under React Strict Mode. That issue closed as expected behavior, not a library defect, which is exactly the kind of thing that makes retrofits feel noisier during rollout than teams expect.
- In [r/reactjs](https://reddit.com/r/reactjs/comments/1s01nfj/what_is_the_modern_way_to_do_a_i18n_for_react_app/), several commenters complained about namespace management, TypeScript friction, and large JSON files.

Interpretation:

`react-i18next` is viable for Claude Studio, especially because it supports Electron/React well and does not force compile-time extraction. But the community evidence says it stays maintainable only if the team is disciplined about namespaces, missing-key checks, route/feature splitting, and context-rich keys.

### react-intl / FormatJS

Overall signal: respected for ICU correctness and standards alignment, but often noisier during retrofit and migration.

Positive practitioner signal:

- It keeps teams closer to ICU message format, which matters if translators, tooling, or a future TMS expect standards-based messages.
- Some practitioners still describe it as working well in production, especially when the product needs solid number/date formatting and consistent ICU semantics.

Negative practitioner signal:

- GitHub issue [formatjs/formatjs#465](https://github.com/formatjs/formatjs/issues/465) shows a long-running developer complaint about missing-message noise in development when teams intentionally avoid `defaultMessage` fallback.
- Strapi issue [#25480](https://github.com/strapi/strapi/issues/25480) on June 2, 2025 is a more current migration example: upgrading to Strapi v5 caused a wave of `MISSING_TRANSLATION` errors for component/block attributes, with maintainers and users describing it as breaking-change noise and hours of manual translation work.
- The anti-i18next side of the community regularly uses ICU compliance as an argument for `react-intl`, Lingui, or ICU-backed alternatives, but the counterweight is that teams also describe ICU syntax as verbose and less ergonomic for day-to-day authoring.

Interpretation:

`react-intl` is attractive if Claude Studio wants ICU-native messages from day one of the retrofit. The practitioner warning is that it can feel heavier during migration, and if the team does not need advanced ICU-rich authoring immediately, its ergonomics may not justify the switch.

### Lingui and compile-time or extraction-heavy approaches

Overall signal: admired for cleaner catalogs and better extraction, but setup cost is real.

Positive practitioner signal:

- The September 2023 migration writeup from `radist2s` described a successful move from `react-i18next` to LinguiJS in a day using codemods, macros, and extraction tooling.
- In [r/reactjs](https://reddit.com/r/reactjs/comments/1s01nfj/what_is_the_modern_way_to_do_a_i18n_for_react_app/), Lingui got praise for smaller bundles and nicer DX once configured.

Negative practitioner signal:

- The same Reddit thread also says “the setup is a headache.”
- The “compiler” discussion in [r/react](https://reddit.com/r/react/comments/1rdq5dq/the_problem_with_retrofitting/) is partly self-promotional, but the criticism still maps to real retrofit risk: magical extraction that works in 98% of cases is exactly the kind of tool that leaves teams manually cleaning up the last 2%.

Interpretation:

For Claude Studio, Lingui-style extraction is attractive if the team wants to push toward colocated messages, compile-time help, and stronger catalog hygiene. The community evidence suggests it is best as a deliberate platform choice, not as a “quick retrofit shortcut.”

### Custom i18n

Overall signal: okay only for narrow use cases; practitioners distrust it once the app needs plurals, formatting, or scaling.

Evidence:

- In [r/reactjs](https://reddit.com/r/reactjs/comments/1s01nfj/what_is_the_modern_way_to_do_a_i18n_for_react_app/), a commenter argued a custom menu plus `translate()` function was sufficient; the immediate response was that this covers only the simple cases and ignores extraction, ICU-style messages, rich formatting, and proper pluralization.
- Hacker News [37062755](https://news.ycombinator.com/item?id=37062755) reinforces the same lesson from a different community: translators and users suffer when developers treat i18n as string substitution rather than grammar-aware content rendering.

Interpretation:

A custom approach is not well supported by the community evidence for Claude Studio’s retrofit, especially because the plan includes a visible switcher, shared web/desktop resources, and a move from hard-coded Korean strings to maintained keyed resources.

## OSS Localization Rollout Gotchas

### 1. One locale goes stale unless there is explicit process and ownership

Repeated pattern.

This is one of the strongest OSS signals in the evidence set.

- In React docs localization issue [#1605](https://github.com/reactjs/react.dev/issues/1605), opened January 30, 2019, maintainers explicitly called out stale translations as a core problem with Crowdin-based flow and proposed fork-based ownership plus bots because “it would be easier to prevent stale translations since issues would be generated to keep track of what copy needs to be changed.”
- The same thread contains concrete quality complaints from Indonesian contributors: machine-like translations, poor review flow, and confusion around Crowdin voting. `regalius` wrote on February 4, 2019 that some contributors were “too excited to contribute” but not strong enough in English, leading to bad Google-Translate-style output; the move to GitHub was framed as a way to add review discipline.
- PKP discussion [#8038](https://github.com/pkp/pkp-lib/discussions/8038) from 2022 described a different failure mode: branch divergence. Because Weblate only supported one branch cleanly, maintainers ended up with stale LTS translations and manual reconciliation work.
- Iris issue [#2872](https://github.com/IrisShaders/Iris/issues/2872), opened September 30, 2025, is a blunt modern example: locale PRs had been left unmerged for so long that contributors were duplicating each other’s work.

Implication for Claude Studio: “English/Korean parity” needs an owner and a release rule. Without that, the secondary locale will drift as soon as features ship faster than translation review.

### 2. Contribution UX matters as much as file format

Repeated pattern.

In [r/selfhosted](https://reddit.com/r/selfhosted/comments/1pror7x/best_way_to_let_community_handle_translations/), `u/trace_systems` framed the problem as a workflow and trust-boundary issue rather than a file-format issue: JSON-in-repo works early, then excludes non-technical contributors and pushes review bottlenecks onto maintainers. React’s localization fork discussion reached a similar conclusion years earlier: contributors were more motivated when they could work in GitHub with visible ownership and clean review flow instead of an external platform with opaque voting and syncing.

Implication for Claude Studio: if community contributions to Korean or English copy are expected later, use a workflow that keeps Git as source of truth but lowers contribution friction. The actual platform can vary, but reviewability and auditability matter more than whether the source files are JSON, YAML, or PO.

### 3. Users do not trust hidden or over-automatic language selection

Repeated pattern.

This is especially relevant because Claude Studio will likely add a visible switcher.

- The long-running [r/webdev thread](https://reddit.com/r/webdev/comments/7a2cfe/dont_change_someones_language_based_on_their/) is blunt: users hate being pushed into the “wrong” language by location guesses. The most repeated practical advice was to use browser or device preferences as a starting point, but always provide an obvious manual override and persist it once the user chooses.
- Multiple commenters in that thread also repeated two design rules: do not use flags as the primary language selector, and make the selector discoverable outside the footer.
- In [r/UI_Design](https://reddit.com/r/UI_Design/comments/12df2fm/designing_buttons_for_bilingual_app_how_to_avoid/), commenters rejected bilingual double-labeled buttons and recommended either defaulting to the device language plus a visible selector, or showing an explicit language choice early.
- Shopify community thread [“Translate & Adapt Language switcher gone”](https://community.shopify.com/t/translate-adapt-language-switcher-gone/382366) is a narrower anecdote, but it matches the same pattern: when the switcher became harder to find, merchants immediately saw it as a real usability problem.

Implication for Claude Studio: the switcher should be obvious, persistent, and override automatic detection. Users need to know where it is and trust that it will stay where they put it.

### 4. Partial localization looks worse than no localization

Repeated pattern.

React maintainers explicitly warned in [#1605](https://github.com/reactjs/react.dev/issues/1605) that mixed-language sections look bad and reduce trust. Electron issue [#26231](https://github.com/electron/electron/issues/26231) is the desktop analogue: partially localized menus look broken. Community comments in the webdev and UI design threads make the same trust point from the user side: users will tolerate defaults if the override is obvious; they lose trust when the app is half-translated, inconsistent, or impossible to switch back.

Implication for Claude Studio: avoid shipping “mostly Korean with scattered English” or “mostly English with Korean leftovers” in the same surface. If a screen is not ready, hold it back or fall back consistently.

## Recommended Mitigations

### For the migration itself

1. Start with a hard-coded string inventory and classify it by surface.
   Use lint plus pseudo-localization and targeted codemods. Do not assume extraction tools will rewrite source for you. The i18next CLI evidence says they usually will not.

2. Adopt scoped semantic keys, not Korean-as-key or English-as-key.
   The Node.js discussion and multiple practitioner threads show why text-as-key becomes brittle when copy changes. Favor keys like `settings.language.label` over literal strings.

3. Use one message per context.
   Do not centralize generic “Save/Cancel/Back” messages unless the context is genuinely identical. Community evidence repeatedly says reuse is where grammar and UX drift start.

4. Split catalogs by feature or route from the beginning.
   Avoid a single shared blob. Align namespaces to the actual app surfaces so web and desktop can share resources without loading everything everywhere.

5. Pick a library that solves your actual hard parts.
   A custom helper is only reasonable if the team is prepared to own plural rules, formatting, missing-key detection, extraction, and fallback behavior. Community evidence does not support “tiny custom i18n” as the safe choice for a retrofit of this scope.

### For English/Korean product behavior

1. Make language choice explicit and easy to reverse.
   Device or OS language can be the first guess; it should never be the last word. Persist the user’s choice and do not keep overriding it.

2. Put the switcher in a stable, obvious location.
   Header or settings are safer than a deep footer. Do not rely on a mixed-language button label as the only affordance.

3. Label languages in their native form.
   Community discussion strongly prefers native language names over flags. For an English/Korean switcher, `English` and `한국어` is safer than flag icons.

4. Apply the same locale to Electron-native surfaces.
   Menus, dialogs, and any desktop-only UI need explicit localization work. Do not assume the React layer covers the whole product.

### For governance and OSS maintenance

1. Define a parity rule before rollout.
   Example: no user-facing feature ships unless English and Korean strings are both present, or the feature is explicitly marked single-locale behind a feature flag.

2. Add CI for missing, extra, and stale keys.
   The next-intl discussion [#503](https://github.com/amannn/next-intl/discussions/503) is useful here: teams want static analysis for missing and unused translations because drift is otherwise invisible until users report it.

3. Add pseudo-localization to development builds.
   This was one of the most repeated practical mitigations in the evidence set. It catches hard-coded strings, clipping, and assumptions about width.

4. Give one owner responsibility for translation freshness.
   Every source set that avoided drift had either designated maintainers, proofreaders, or clear review paths. Every source set that drifted lacked them.

5. Treat translation review like code review.
   Keep Git as the source of truth, and make translation changes observable, auditable, and attributable. This is the most stable lesson across React, self-hosted community discussions, and the GitHub issue evidence.

## Sources

### Core practitioner and community sources

- Reddit, r/ExperiencedDevs, `u/[deleted]`, Aug. 25, 2025: “Pointers on i18n best practices and workflow”  
  https://reddit.com/r/ExperiencedDevs/comments/1n01aev/pointers_on_i18n_best_practices_and_workflow/

- Reddit, r/reactjs, `u/hexwit`, Mar. 21, 2026: “What is the modern way to do a i18n for react app today?”  
  https://reddit.com/r/reactjs/comments/1s01nfj/what_is_the_modern_way_to_do_a_i18n_for_react_app/

- Reddit, r/Frontend, `u/[deleted]`, Aug. 15, 2023: “Is it just me or dealing with translations is the awful pain”  
  https://reddit.com/r/Frontend/comments/15rnotf/is_it_just_me_or_dealing_with_translations_is_the/

- Reddit, r/react, `u/aymericzip`, Feb. 25, 2026: “The problem with retrofitting internationalization (i18n)”  
  https://reddit.com/r/react/comments/1rdq5dq/the_problem_with_retrofitting/

- Reddit, r/selfhosted, `u/riofriz`, Dec. 20, 2025: “Best way to let community handle translations?”  
  https://reddit.com/r/selfhosted/comments/1pror7x/best_way_to_let_community_handle_translations/

- Reddit, r/webdev, `u/KuyaEduard`, Nov. 1, 2017: “Don't change someone's language based on their location. Instead, use their browser settings.”  
  https://reddit.com/r/webdev/comments/7a2cfe/dont_change_someones_language_based_on_their/

- Reddit, r/UI_Design, `u/it_me1`, Apr. 6, 2023: “Designing buttons for bilingual app. How to avoid long button with both languages”  
  https://reddit.com/r/UI_Design/comments/12df2fm/designing_buttons_for_bilingual_app_how_to_avoid/

- Hacker News discussion, Aug. 11, 2023: “i18n Best Practices for Front-End Developers”  
  https://news.ycombinator.com/item?id=37062755

### GitHub and issue tracker evidence

- i18next CLI issue [#183](https://github.com/i18next/i18next-cli/issues/183), `vitonsky`, Feb. 14, 2026: extraction does not rewrite JSX/TSX; maintainer clarified retrofit expectations.

- react-i18next issue [#1171](https://github.com/i18next/react-i18next/issues/1171), `ThisIsMissEm`, Sept. 9, 2020: stale UI on language change when dynamic loading/HMR expectations do not match defaults.

- react-i18next issue [#1636](https://github.com/i18next/react-i18next/issues/1636), `developer82`, May 9, 2023: extra renders from `useTranslation` in development / Strict Mode context.

- Electron issue [#26231](https://github.com/electron/electron/issues/26231), `aabuhijleh`, Oct. 28, 2020 through Feb. 10, 2026 activity: default menu items not reliably localized on non-English macOS.

- Node.js i18n issue [#50](https://github.com/nodejs/i18n/issues/50), Mar. 14, 2018: key-based i18n vs default-language-as-key, including detailed comments by `srl295`, `zeke`, and others.

- React docs localization issue [#1605](https://github.com/reactjs/react.dev/issues/1605), Jan. 30, 2019: Crowdin pain, stale translation risk, fork-based ownership model, glossary/proofreader concerns, and direct maintainer/translators’ commentary.

- Iris issue [#2872](https://github.com/IrisShaders/Iris/issues/2872), Sept. 30, 2025: locale PR backlog causing duplicated contributor work.

- PKP discussion [#8038](https://github.com/pkp/pkp-lib/discussions/8038), Jun.-Dec. 2022: stale branch translations and “summit” branch workflow proposal.

- next-intl discussion [#503](https://github.com/amannn/next-intl/discussions/503): community demand for static analysis of missing/unused translations.

- Strapi issue [#25480](https://github.com/strapi/strapi/issues/25480), June 2, 2025: migration-induced `MISSING_TRANSLATION` noise and manual cleanup burden.

### Blogs and practitioner writeups

- `radist2s`, Sept. 5, 2023: “One Command, One Day, Multiple Languages: Our Migration from react-i18next to LinguiJS”  
  https://medium.com/@radist2s/one-command-one-day-multiple-languages-our-migration-from-react-i18next-to-linguijs-4b07ac73a9bb

- `David Rezessy`, locize: “A Definitive Guide to i18n Key Naming for Longevity and Sanity”  
  https://www.locize.com/blog/guide-to-i18n-key-naming

- locize: “react-intl vs react-i18next”  
  https://www.locize.com/blog/react-intl-vs-react-i18next

- `nevodavid`, Dev.to: “Don’t use i18next”  
  https://dev.to/nevodavid/dont-use-i18next-n1a

- Shopify Community, Dec. 22, 2024: “Translate & Adapt Language switcher gone”  
  https://community.shopify.com/t/translate-adapt-language-switcher-gone/382366

## Gaps

1. There is less high-signal public evidence specifically about English/Korean Electron app retrofits than about React web apps generally.
   I compensated by weighting React/Electron-specific issue threads and bilingual UX discussions, but there is still some inference here.

2. Several search results around language-switcher UX were forums or community support threads rather than formal usability studies.
   They are still useful for “what users complain about in practice,” but they are complaint-driven and should not be treated as statistically representative.

3. Some library-comparison content in blogs was vendor- or maintainer-adjacent.
   I used those sources mainly for failure modes and trade-offs, not as sole authority for recommendations.

4. Crowdin and Shopify community pages scraped thinly in one pass.
   Their existence still contributed signal during search ranking and triangulation, but the stronger claims in this document come from GitHub and Reddit threads where the full discussion was available.
