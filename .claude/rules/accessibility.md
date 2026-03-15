# Accessibility Rules

## Critical (REQUEST_CHANGES)

- `<img>` must have `alt` attribute (empty string `alt=""` allowed for decorative images)
- `<button>` without visible text must have `aria-label` or `aria-labelledby`
- Interactive elements (`<div onClick>`, `<span onClick>`) must have `role` and `tabIndex={0}` and keyboard handler (`onKeyDown`)
- Form inputs must have associated `<label>` or `aria-label`
- Modal/Dialog must trap focus and support `Escape` key to close (Radix UI Dialog handles this — use it)

## Warning (COMMENT)

- Avoid `tabIndex` values greater than 0
- Color alone should not convey meaning — pair with text or icon
- `<a>` with `target="_blank"` should include `rel="noopener noreferrer"`
- Loading states should use `aria-busy` or visually hidden status text

## Patterns to Flag

```tsx
// ❌ Missing alt
<img src={url} />

// ✅ Correct
<img src={url} alt="User avatar" />
<img src={decorative} alt="" />

// ❌ Div used as button without accessibility
<div onClick={handleClick}>Click me</div>

// ✅ Use actual button or add role
<button onClick={handleClick}>Click me</button>
// or
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
  Click me
</div>
```
