# Language Switcher Visibility And Onboarding

**Scope:** Where Claude Studio should place its language switcher, how first-launch behavior should work, and how explicit user choice should override detection.

## Recommendation

Do **not** hide language selection inside settings only.

Claude Studio should use:

- a **persistent top-bar language action** visible on every screen
- a **backup control in `/data`** for explanation and confirmation

This is the strongest fit for the repo because the product is desktop-shell-first and the user requirement is explicit: a Korean-only user must be able to recover from the English default immediately.

## Primary Placement

Put the primary control in the top bar at the far right.

Why:

- W3C guidance on language negotiation stresses that automatic detection is only a starting point and users need an obvious override: <https://www.w3.org/International/questions/qa-accept-lang-locales.en.html>
- W3C also recommends making translated-page access discoverable rather than trapping users in automatic behavior: <https://www.w3.org/International/questions/qa-site-conneg.en.html>
- USWDS places language access in the header/upper corner for persistent discovery: <https://designsystem.digital.gov/patterns/select-a-language/selected-content/>

For Claude Studio, a top-bar control is better than a footer-only or settings-only path because:

- the top bar already exists on all Studio pages
- the sidebar footer is less discoverable in a dense desktop shell
- a settings-only path fails the “recover immediately” requirement

## Secondary Placement

Mirror the same control in `/data` under a clearly labeled `Language` section.

Use this secondary placement for:

- explaining what the setting does
- showing the currently selected locale
- offering the same choice through a familiar settings surface

## First-Launch Behavior

Because the product requirement is English-default:

- first launch may default to English
- but only if the visible override is already present in the shell

If the OS/browser language is Korean and no explicit in-app choice exists yet, show a **one-time non-modal hint** pointing to the top-bar `한국어` action.

This approach is a practical compromise between the product requirement and the standards guidance that users should not be trapped by detection. It avoids a blocking modal while still giving Korean users an immediate escape hatch.

## Persistence Rule

Use this precedence:

1. explicit saved app choice
2. supported OS/browser language hint
3. English default

Once the user has chosen a language, that choice should win until they change it.

Relevant sources:

- W3C `Accept-Language` guidance: <https://www.w3.org/International/questions/qa-accept-lang-locales.en.html>
- W3C translated pages guidance: <https://www.w3.org/International/questions/qa-site-conneg.en.html>

## Two-Language Control Pattern

Because Claude Studio only needs English and Korean right now, prefer a **direct visible toggle** over a generic “Languages” dropdown for the shell control.

That means:

- in English UI, the visible action should show `한국어`
- in Korean UI, the visible action should show `English`

This is more discoverable for a Korean-only user than a generic label they may not be able to read.

Keep the fuller language settings UI in `/data`, where a two-option radio group or menu can show both `English` and `한국어`.

## Patterns To Avoid

Do not:

- use a settings-only language switch
- rely on flags to represent languages
- auto-redirect or auto-switch purely from locale detection
- use a first-run modal as the only available path

USWDS explicitly warns against relying on auto-redirect/location or browser settings alone: <https://designsystem.digital.gov/patterns/select-a-language/selected-content/>

## Web Consistency

Mirror the same pattern on the landing site:

- place the language control in the header
- keep the same English/Korean labels
- persist explicit user choice there as well

That way the web entry point teaches the same behavior as the desktop app.

## Sources

- <https://www.w3.org/International/questions/qa-accept-lang-locales.en.html>
- <https://www.w3.org/International/questions/qa-when-lang-neg.en.html>
- <https://www.w3.org/International/questions/qa-site-conneg.en.html>
- <https://designsystem.digital.gov/patterns/select-a-language/selected-content/>
- <https://designsystem.digital.gov/components/language-selector/accessibility-tests/>
