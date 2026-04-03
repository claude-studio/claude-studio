# Korean English Copy And Accessibility Rules

**Scope:** Rules for how English and Korean should appear in the UI, how the switcher should be labeled, and what accessibility mechanics are required.

## Recommendation

Use **autonyms**, not flags:

- `English`
- `한국어`

Use a **target-language shell control** and a **fully labeled settings control**:

- shell: `한국어` or `English`
- settings: `Language` with options `English` and `한국어`

## Labeling Rules

### 1. Use Native Language Names

Show language options in the language itself so users can recognize them even when they cannot read the current UI language.

This is consistent with multilingual UX guidance and accessibility expectations:

- MDN `lang` guidance: <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/lang>
- USWDS language selector accessibility expectations: <https://designsystem.digital.gov/components/language-selector/accessibility-tests/>

### 2. Do Not Use Flags

Flags represent countries, not languages. They are ambiguous and widely discouraged in multilingual UI.

Relevant guidance:

- USWDS language-selection pattern: <https://designsystem.digital.gov/patterns/select-a-language/selected-content/>

### 3. Use A Full Accessible Name

The shell-level toggle can stay visually compact, but it needs a fuller assistive label such as:

- `Current language English. Change language to 한국어.`
- `현재 언어 한국어. 언어를 English로 변경.`

## Accessibility Mechanics

### 1. Mark Language Tokens Correctly

Every mixed-language label should expose language metadata:

- `lang="en"` for `English`
- `lang="ko"` for `한국어`

This helps screen readers pronounce the language names correctly and aligns with WCAG Language of Parts guidance:

- WCAG understanding: <https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html>
- MDN `lang`: <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/lang>
- WebAIM language guidance: <https://webaim.org/techniques/language/>

### 2. Update The Root Document Language

When the locale changes, the UI should update the page language metadata:

- web: `<html lang="en">` or `<html lang="ko">`
- Studio renderer: same rule for the rendered document

### 3. Keep Focus Stable

After the user changes language:

- return focus to the invoking control when appropriate
- do not trap focus inside the menu
- keep the control in the same place after rerender

Focus-order reference:

- <https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html>

### 4. Announce The Change

Use a polite live region such as:

- `Language changed to 한국어.`
- `언어가 English로 변경되었습니다.`

Use `role="status"` so the result is announced without stealing focus:

- <https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA22>

## Layout And Copy Rules

### 1. Plan For Expansion

UI labels may grow when translated. Avoid hard-width slots for:

- header controls
- badges
- tabs
- buttons

Let the switcher and related controls use min-width plus padding instead of fixed widths.

### 2. Avoid Permanent Bilingual Duplication

Do not turn the regular app UI into duplicated labels like `Projects / 프로젝트`.

Reserve bilingual or mixed-language presentation for:

- the language switch itself
- first-run recovery hints
- support or explanatory surfaces where discoverability matters

### 3. Keep Product Copy Simple

Use these defaults:

- navigation: short nouns
- buttons: direct verbs
- empty states: one clear sentence plus one next action
- status text: short and descriptive

This lowers translation ambiguity and makes English/Korean parity easier to maintain.

### 4. Match Meaning, Not Syntax

English and Korean strings should stay semantically equivalent rather than mirror each other word-for-word. Preserve action and intent instead of forcing literal structure.

## Minimum Copy Rules For Claude Studio

- Use `English` and `한국어` everywhere language options are shown.
- Avoid flags.
- Mark mixed-language tokens with `lang`.
- Keep the shell toggle short and the accessible label complete.
- Use one language per screen by default.
- Localize assistive copy, not just visible copy.

## Sources

- <https://designsystem.digital.gov/components/language-selector/accessibility-tests/>
- <https://designsystem.digital.gov/patterns/select-a-language/selected-content/>
- <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/lang>
- <https://webaim.org/techniques/language/>
- <https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html>
- <https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html>
- <https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA22>
