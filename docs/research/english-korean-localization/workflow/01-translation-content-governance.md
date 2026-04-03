# Translation Content Governance

**Scope:** Governance rules for making Claude Studio English-default while preserving Korean as a first-class supported language.

## Recommendation

Use **English as the single source of truth for all public-facing product copy and public documentation**, and treat Korean translations as **maintained derived artifacts** with explicit owners, freshness signals, and review gates.

This matches how mature multilingual OSS projects operate:

- Kubernetes treats English documentation as upstream and requires fixes to land there first before localizations are updated: <https://kubernetes.io/docs/contribute/localization/>
- React points translators back to the canonical English docs and language-specific forks: <https://react.dev/community/translations>
- Read the Docs assumes English by default for multilingual public docs while supporting linked translations: <https://docs.readthedocs.com/platform/stable/localization.html>

## What Should Be Source-Of-Truth

For Claude Studio, make English canonical for:

- root `README.md`
- public docs under `docs/`
- app and web locale source strings
- contributor-facing governance or contribution docs

Korean should remain first-class through:

- maintained `ko` locale resources
- Korean versions of high-value public docs where actively maintained
- locale owners/reviewers
- a glossary for product and AI-domain terms
- explicit freshness markers when Korean content lags behind English

## What Should Stay Out Of Scope For This Pass

Do **not** translate `.claude/reference` in this rollout. Instead:

- classify it as internal reference material
- document that it is intentionally excluded from the public localization surface
- add a future decision gate for selective publication, summarization, or translation if parts become contributor-critical

This boundary is consistent with projects that distinguish public docs from internal operational material:

- GitLab separates public docs, the public handbook, and internal handbook material: <https://about.gitlab.com/blog/gitlab-engineer-how-i-improved-my-onboarding-experience-with-ai/>
- Read the Docs supports different visibility models for internal/private docs versus public docs: <https://docs.readthedocs.com/platform/stable/commercial/sharing.html>

## Drift Prevention Rules

Use explicit anti-drift mechanisms from day one:

1. **English-first merge order**
   - English copy changes merge first.
   - Korean updates reference the English source commit or PR.

2. **Freshness metadata**
   - Every localized doc or locale bundle should expose a status such as `fresh`, `needs-update`, or `stale`.
   - Microsoft’s recent docs translation model treats translations as versioned assets with explicit sync state: <https://techcommunity.microsoft.com/blog/azuredevcommunityblog/rethinking-documentation-translation-treating-translations-as-versioned-software/4491755>

3. **Changed-source detection**
   - Track whether English changed after Korean was last reviewed.
   - Kubernetes ships localization drift tooling and branch comparison scripts for this exact purpose: <https://kubernetes.io/docs/contribute/localization/>

4. **Visible stale-state handling**
   - Show a banner or status when Korean content is out of date instead of silently serving stale copy.
   - Examples and discussion:
     - FastAPI stale translation discussion: <https://github.com/tiangolo/fastapi/issues/5642>
     - Storybook translated-content warning example: <https://storybook.js.org/tutorials/ui-testing-handbook/react/en/user-flow-testing/>

5. **Human review requirement**
   - Machine translation can assist, but human review must gate release.
   - Kubernetes explicitly states machine-generated translation is insufficient without human review: <https://kubernetes.io/docs/contribute/localization/>

## Ownership Model

Adopt explicit locale ownership instead of “everyone owns translation”:

- add locale-specific owners/reviewers for Korean resources and Korean docs
- use `CODEOWNERS` or equivalent review rules for `ko` files
- keep ownership lightweight but named

Relevant models:

- Kubernetes uses locale-specific reviewers and approvers: <https://kubernetes.io/docs/contribute/localization/>
- MDN tracks locale maintainers and archives retired locales when maintenance drops: <https://developer.mozilla.org/en-US/docs/MDN/Community/Translated_content>
- GitLab assigns proofreaders per language and requires contribution history before granting stronger permissions: <https://docs.gitlab.com/development/i18n/proofreader/>

## Translation Resource Design Guidance

Structure content to reduce churn and translation cost:

- keep UI strings in small, well-scoped resources
- separate reusable/common strings from feature-specific strings
- keep product terminology consistent through a glossary
- prefer small reusable content blocks for docs when repetition is high

Useful precedents:

- GitHub Docs uses reusable Markdown/data fragments to reduce churn and improve localization behavior: <https://docs.github.com/github-ae@latest/contributing/writing-for-github-docs/creating-reusable-content>
- Docusaurus separates UI strings and documentation translation surfaces clearly: <https://docusaurus.io/docs/i18n/introduction>
- GitLab’s Korean translation effort used glossaries and coordinated proofing for consistency: <https://about.gitlab.com/blog/behind-the-scenes-of-gitlab-korean-translation/>

## Minimum Process For Claude Studio

This is the minimum viable governance model worth shipping:

- English is canonical for public-facing content.
- Korean translations are maintained, not aspirational.
- Korean files require human review before release.
- Translation freshness is tracked visibly.
- Stale Korean docs/pages are marked or hidden, not silently left incorrect.
- `.claude/reference` is explicitly marked internal and excluded from this pass.

## Risks If Governance Is Weak

Without clear governance:

- Korean becomes nominally supported but practically stale
- contributors do not know which language wins when content conflicts
- public docs drift from app behavior
- maintainers burn time manually reconciling parallel sources of truth

MDN’s locale freeze/archive strategy is a useful warning: a smaller honestly maintained surface is better than a large inaccurate one: <https://hacks.mozilla.org/2020/12/an-update-on-mdn-web-docs-localization-strategy/>

## Sources

- <https://kubernetes.io/docs/contribute/localization/>
- <https://react.dev/community/translations>
- <https://docs.readthedocs.com/platform/stable/localization.html>
- <https://docs.readthedocs.com/platform/stable/commercial/sharing.html>
- <https://docs.github.com/github-ae@latest/contributing/writing-for-github-docs/creating-reusable-content>
- <https://developer.mozilla.org/en-US/docs/MDN/Community/Translated_content>
- <https://hacks.mozilla.org/2020/12/an-update-on-mdn-web-docs-localization-strategy/>
- <https://docs.gitlab.com/development/i18n/proofreader/>
- <https://about.gitlab.com/blog/behind-the-scenes-of-gitlab-korean-translation/>
- <https://techcommunity.microsoft.com/blog/azuredevcommunityblog/rethinking-documentation-translation-treating-translations-as-versioned-software/4491755>
- <https://github.com/tiangolo/fastapi/issues/5642>
- <https://storybook.js.org/tutorials/ui-testing-handbook/react/en/user-flow-testing/>
