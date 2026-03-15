# CLAUDE.md — claude-studio Review Guidelines

## Project Overview

- **Stack**: React 18, TypeScript, TanStack Router, TanStack Query, Tailwind CSS, Radix UI, Framer Motion
- **Structure**: Turborepo monorepo (pnpm) — `apps/web`, `apps/studio`, `packages/ui`, `packages/shared`
- **Language**: Korean UI, English code

## Review Priorities

When reviewing PRs, focus on these areas **in order**:

1. **Type Safety** — No `any`, proper Props types, strict null checks
2. **Accessibility** — All interactive elements must be keyboard/screen-reader accessible
3. **Bundle Size** — Avoid full library imports; use tree-shakable imports
4. **Convention** — No debug artifacts, proper hook usage, consistent patterns

## Severity Levels

- **Critical** (REQUEST_CHANGES): Type errors, broken accessibility, security issues
- **Warning** (COMMENT): Bundle size concerns, missing error handling, convention violations
- **Info** (APPROVE with note): Style suggestions, minor optimizations

## Rules Reference

Detailed rules are in `.claude/rules/`:

- [accessibility.md](.claude/rules/accessibility.md)
- [type-safety.md](.claude/rules/type-safety.md)
- [bundle-size.md](.claude/rules/bundle-size.md)
- [convention.md](.claude/rules/convention.md)

## Monorepo Notes

- Shared components live in `packages/ui` — prefer reusing over creating new
- Cross-package type imports must use `import type`
- Changes to `packages/` affect all consumers — review impact carefully
