# Convention Rules

## Critical (REQUEST_CHANGES)

- No `console.log`, `console.warn`, `console.error` in production code (use logger or remove)
- `useEffect` must list all dependencies — missing deps cause stale closure bugs
- No commented-out code blocks — use git history instead
- Async functions inside `useEffect` must be defined inside the effect, not outside

## Warning (COMMENT)

- TODO/FIXME comments must include a GitHub issue reference: `// TODO(#123): ...`
- Custom hooks must start with `use` prefix and live in a `hooks/` directory
- Component files should export one primary component matching the filename
- Avoid inline styles — use Tailwind classes or CSS variables
- `key` prop in lists must be stable and unique — avoid using array index as key for dynamic lists

## Monorepo-Specific

- Components intended for reuse must go in `packages/ui`, not `apps/`
- Cross-package imports must go through the package's public export (`@repo/ui`, not deep paths)
- `packages/shared` types must not import from `apps/`

## Patterns to Flag

```tsx
// ❌ Debug artifact
console.log('data:', data);

// ❌ Missing useEffect dependency
useEffect(() => {
  fetchData(userId);
}, []); // userId missing

// ✅ Correct
useEffect(() => {
  fetchData(userId);
}, [userId]);

// ❌ Async in useEffect wrong pattern
useEffect(() => {
  const result = await fetchData(); // SyntaxError
}, []);

// ✅ Correct
useEffect(() => {
  const load = async () => {
    const result = await fetchData();
    setData(result);
  };
  void load();
}, []);

// ❌ Index as key in dynamic list
{
  items.map((item, index) => <Item key={index} {...item} />);
}

// ✅ Stable unique key
{
  items.map((item) => <Item key={item.id} {...item} />);
}
```
