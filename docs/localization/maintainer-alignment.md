# Maintainer Alignment for Language Direction

## Intent

This localization effort is not about removing Korean from Claude Studio or flattening the project's identity.

It is about making the public layer of the project easier to enter:

- English first for discovery, onboarding, and contribution
- Korean still fully supported inside the product
- Internal maintainer reference material preserved

## Recommended Framing

Use language like this when discussing the change with a Korean-first maintainer:

> We are not replacing Korean as part of the project's identity. We are making the public entry points readable to more people by default, while keeping Korean as a supported in-product language that is easy to switch to immediately.

> English default helps the project travel further. Korean support keeps existing users comfortable. Those two goals do not conflict if the switcher is visible and the Korean locale remains maintained.

> The internal `.claude/reference/` materials can stay in Korean if that is the best format for the maintainer workflow. This rollout focuses on the public-facing product and docs layer.

## Points That Usually Build Buy-In

- English README and landing copy improve discoverability, sharing, and contributor onboarding.
- A visible Korean switcher shows respect for existing Korean users instead of hiding localization behind setup work.
- Leaving `.claude/reference/` untouched avoids turning a public-language effort into an invasive rewrite of maintainer-private material.
- Shared i18n infrastructure reduces future translation cost instead of creating one-off duplicated copy.

## Suggested PR Summary Language

You can summarize the change like this:

> This PR moves Claude Studio to an English-default public experience while preserving Korean as a first-class supported locale. The landing page, README, and visible app surfaces now default to English, and users can switch to Korean from an obvious control in the UI. Internal `.claude/reference/` docs remain unchanged by design.

## Suggested Contributor Policy

- Public-facing docs should be authored in English first.
- Korean translations should be maintained for supported product surfaces.
- New user-facing copy should not ship in only one language when it lands in shared UI or high-traffic views.
- Internal maintainer references can remain language-specific if they are not part of the public onboarding path.

## Boundaries

This rollout should not be framed as:

- "Korean is hurting the project"
- "The maintainer wrote the docs wrong"
- "Everything must be translated immediately"

Instead, frame it as:

- a discoverability improvement
- a contributor experience improvement
- a structured localization foundation
- a respectful separation between public docs and maintainer-private references

## Follow-Up Work

- Add translation review to the PR checklist for public-facing copy.
- Expand locale coverage to any remaining public pages outside the landing page.
- Decide whether future maintainer docs should be bilingual, selectively translated, or left private by category.
