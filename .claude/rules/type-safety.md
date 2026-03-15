# Type Safety Rules

## Critical (REQUEST_CHANGES)

- No `any` type — use `unknown` and narrow, or define a proper interface
- No type assertions (`as SomeType`) without a comment explaining why it's safe
- Component Props must be explicitly typed (inline or separate `interface`)
- Event handler types must be specific (`React.MouseEvent<HTMLButtonElement>`, not `any`)
- `useRef` must be typed: `useRef<HTMLDivElement>(null)`, not `useRef(null)`

## Warning (COMMENT)

- Prefer `interface` over `type` alias for object shapes
- Use `import type` for type-only imports
- Optional chaining (`?.`) is preferred over manual null checks
- Avoid non-null assertions (`!`) unless absolutely necessary — prefer optional chaining
- TanStack Query return types should be typed: `useQuery<ResponseType, ErrorType>`

## Patterns to Flag

```tsx
// ❌ any type
const handleData = (data: any) => { ... }
const ref = useRef(null)

// ✅ Correct
const handleData = (data: unknown) => { ... }
const ref = useRef<HTMLDivElement>(null)

// ❌ Untyped Props
const MyComponent = ({ title, onClick }) => { ... }

// ✅ Typed Props
interface MyComponentProps {
  title: string;
  onClick: () => void;
}
const MyComponent = ({ title, onClick }: MyComponentProps) => { ... }

// ❌ Unsafe type assertion
const el = document.getElementById('root') as HTMLDivElement;

// ✅ With guard
const el = document.getElementById('root');
if (!(el instanceof HTMLDivElement)) throw new Error('Root not found');
```
