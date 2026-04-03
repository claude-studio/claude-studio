# Maintainer Alignment And Rollout

**Scope:** How to explain the English-default shift to the repo owner respectfully, and how to phase the change without turning Korean into a neglected side path.

## Maintainer Framing

The correct framing is:

> We are not moving away from Korean. We are widening the project’s public interface so more people can discover, use, and contribute to Claude Studio, while keeping Korean as a supported and respected language.

That is the tone to use in docs, PR text, and rollout notes. Do **not** frame Korean as a problem to be removed.

## What To Say

Lead with these points:

- Korean helped the project exist and gain trust.
- English-first public docs improve contributor reach and first-contact onboarding.
- Korean remains first-class through maintained locale files, visible language switching, glossary control, and review ownership.
- Internal Korean-heavy reference material can stay internal in this phase while public surfaces become more accessible.

Support:

- Open Source Guides emphasizes clear, welcoming entry points for contributors at project start: <https://opensource.guide/pcm/starting-a-project/>
- Open Source Guides also shows why README and contribution docs matter for participation quality: <https://opensource.guide/how-to-contribute/>
- GitLab’s Korean translation effort shows how to honor a specific language community through real stewardship instead of symbolic support: <https://about.gitlab.com/blog/behind-the-scenes-of-gitlab-korean-translation/>

## What Not To Say

Avoid language like:

- “Korean is hurting the project.”
- “Everyone uses English anyway.”
- “We need to replace Korean.”

Those arguments dismiss the maintainer’s identity and the history of the project. They make agreement harder, not easier.

## Strong Arguments That Actually Help

### 1. Contributor Reach

GitHub surfaces the root README and contribution paths first. If those stay Korean-only, the project’s first contact stays narrow. English-first public docs improve the chance that a new user can install, understand, and contribute before dropping off.

This is partly an inference from OSS onboarding guidance and multilingual docs tooling, but it is a strong one:

- <https://opensource.guide/pcm/starting-a-project/>
- <https://opensource.guide/how-to-contribute/>
- <https://docusaurus.io/docs/i18n/introduction>

### 2. Release Hygiene

A single public source language keeps changes ordered:

- English changes first
- Korean updates follow
- reviewers can detect drift cleanly

Kubernetes is the clearest operational precedent here: <https://kubernetes.io/docs/contribute/localization/>

### 3. Better Triage And Fewer Contradictions

When one public language is canonical, issue triage, docs review, and release notes stop arguing with multiple “source” versions of the same content. This is an inference from source-of-truth models used by Kubernetes, React, and Read the Docs:

- <https://kubernetes.io/docs/contribute/localization/>
- <https://react.dev/community/translations>
- <https://docs.readthedocs.com/platform/stable/localization.html>

## Claude Studio Rollout Policy

Adopt this explicit project policy:

- English is the source of truth for public-facing docs and product copy.
- Korean is a maintained supported locale, not an archival afterthought.
- `.claude/reference` remains internal and untranslated in this pass.
- Any future public exposure of `.claude/reference` content requires a separate decision.

## Rollout Sequence

### Phase 1: Public Entry Points

Convert first:

- root `README.md`
- landing page copy in `apps/web`
- Electron product copy and visible navigation in `apps/studio`
- new public documentation under `docs/`

### Phase 2: Visible Korean Support

Ship these at the same time as the English-default move:

- Korean locale resources
- a visible language switcher in the app
- Korean labels shown in their own language where appropriate
- a documented freshness/review workflow

### Phase 3: Freshness Controls

Before expanding the translation surface further, add:

- locale ownership
- stale-state markers
- release-bound translation review
- a glossary for repeated domain terms

### Phase 4: Future Internal/Public Boundary Review

After the public-facing localization pass is stable, decide whether any `.claude/reference` material should be:

- summarized publicly
- selectively translated
- or intentionally kept internal

## Recommended PR / Maintainer Note

Use language close to this:

> This PR makes Claude Studio English-default on public-facing surfaces so more users can discover, evaluate, and contribute to the project. Korean is still supported as a first-class locale in the product, and this change does not rewrite the internal `.claude/reference` corpus. The goal is to widen access without discarding the project’s Korean context.

## Risks To Call Out Honestly

These are the real failure modes:

- Korean is marked “supported” but stops being reviewed
- public English copy diverges from Korean app strings
- translation scope grows faster than maintainer capacity
- internal Korean-only knowledge remains critical but inaccessible to external contributors

If Korean support cannot be kept current, shrink the Korean surface honestly instead of pretending it is fresh. MDN’s archive/freeze model is the right precedent: <https://hacks.mozilla.org/2020/12/an-update-on-mdn-web-docs-localization-strategy/>

## Recommended Operational Rules

- English PRs land first for public-facing copy.
- Korean follow-up updates reference the English source commit.
- Locale-specific ownership is required for `ko` files.
- Human review gates Korean releases.
- Stale localized content is visibly marked.
- Internal `.claude/reference` docs are not implied to be public contributor docs.

## Sources

- <https://opensource.guide/pcm/starting-a-project/>
- <https://opensource.guide/how-to-contribute/>
- <https://kubernetes.io/docs/contribute/localization/>
- <https://react.dev/community/translations>
- <https://docs.readthedocs.com/platform/stable/localization.html>
- <https://docusaurus.io/docs/i18n/introduction>
- <https://about.gitlab.com/blog/behind-the-scenes-of-gitlab-korean-translation/>
- <https://hacks.mozilla.org/2020/12/an-update-on-mdn-web-docs-localization-strategy/>
