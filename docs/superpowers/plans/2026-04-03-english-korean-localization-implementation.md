# English/Korean Localization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship English-default localization across Claude Studio’s desktop app, landing page, shared UI, and public docs while keeping Korean as a first-class switchable locale from a visible in-app control.

**Architecture:** Add a shared `@repo/i18n` package powered by `i18next`/`react-i18next`, persist Studio locale through Electron main/preload under `userData`, expose a visible shell-level switcher plus `/data` backup path, and migrate hard-coded copy into namespaced resources in bounded slices.

**Tech Stack:** TypeScript, React 19, Electron 35, Vite 6, TanStack Router, `i18next`, `react-i18next`, Vitest, Testing Library.

---

## File Structure

### New files

- `packages/i18n/package.json`
- `packages/i18n/tsconfig.json`
- `packages/i18n/eslint.config.js`
- `packages/i18n/src/index.ts`
- `packages/i18n/src/config.ts`
- `packages/i18n/src/init.ts`
- `packages/i18n/src/provider.tsx`
- `packages/i18n/src/resources/en/*.ts`
- `packages/i18n/src/resources/ko/*.ts`
- `packages/i18n/src/locale-utils.test.ts`
- `apps/studio/src/main/services/app-locale-store.ts`
- `apps/studio/src/main/services/app-locale-store.test.ts`
- `apps/studio/src/renderer/src/widgets/language-switcher.tsx`
- `apps/studio/src/renderer/src/widgets/language-switcher.test.tsx`
- `apps/web/src/widgets/language-switcher.tsx`
- `docs/localization.md`
- `docs/maintainers/language-policy.md`

### Modified files

- `pnpm-workspace.yaml`
- `package.json`
- `packages/ui/package.json`
- `packages/ui/src/index.ts`
- `packages/ui/src/charts/*.tsx` for user-facing labels
- `apps/studio/package.json`
- `apps/studio/src/main/ipc/channels.ts`
- `apps/studio/src/main/ipc/settings.ipc.ts`
- `apps/studio/src/preload/api.ts`
- `apps/studio/src/renderer/src/main.tsx`
- `apps/studio/src/renderer/src/providers/electron-provider.ts`
- `apps/studio/src/renderer/src/providers/query-provider.tsx`
- `apps/studio/src/renderer/src/routes/__root.tsx`
- `apps/studio/src/renderer/src/widgets/app-sidebar/index.tsx`
- `apps/studio/src/renderer/src/pages/**/*.tsx`
- `apps/studio/src/renderer/index.html`
- `apps/web/package.json`
- `apps/web/src/main.tsx`
- `apps/web/src/widgets/**/*.tsx`
- `README.md`

### Verification commands

- `rtk pnpm --filter @repo/i18n test`
- `rtk pnpm --filter @repo/studio test`
- `rtk pnpm --filter @repo/studio typecheck`
- `rtk pnpm --filter @repo/web typecheck`
- `rtk pnpm --filter @repo/ui typecheck`
- `rtk pnpm lint`
- `rtk pnpm build`

## Task 1: Add Shared I18n Package

**Files:**
- Create: `packages/i18n/*`
- Modify: `pnpm-workspace.yaml`, `package.json`, `apps/studio/package.json`, `apps/web/package.json`, `packages/ui/package.json`
- Test: `packages/i18n/src/locale-utils.test.ts`

- [ ] **Step 1: Write the failing locale utility test**

```ts
import { describe, expect, it } from 'vitest';

import { normalizeLocale, resolveInitialLocale } from './config';

describe('locale resolution', () => {
  it('normalizes regional variants to supported locales', () => {
    expect(normalizeLocale('en-US')).toBe('en');
    expect(normalizeLocale('ko-KR')).toBe('ko');
    expect(normalizeLocale('ja-JP')).toBeNull();
  });

  it('prefers saved locale over detected locale and falls back to english', () => {
    expect(resolveInitialLocale('ko', 'en-US')).toBe('ko');
    expect(resolveInitialLocale(null, 'ko-KR')).toBe('ko');
    expect(resolveInitialLocale(null, 'fr-FR')).toBe('en');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `rtk pnpm --filter @repo/i18n test packages/i18n/src/locale-utils.test.ts`
Expected: FAIL because `@repo/i18n` package and exports do not exist yet.

- [ ] **Step 3: Add workspace dependencies and the new package skeleton**

```yaml
# pnpm-workspace.yaml catalog
i18next: ^25.0.0
react-i18next: ^15.0.0
```

```json
// packages/i18n/package.json
{
  "name": "@repo/i18n",
  "type": "module",
  "private": true,
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "types": "./src/index.ts"
    }
  },
  "scripts": {
    "build": "tsc --noEmit",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src",
    "test": "vitest run"
  },
  "dependencies": {
    "i18next": "catalog:",
    "react-i18next": "catalog:",
    "react": "catalog:"
  }
}
```

- [ ] **Step 4: Write the minimal locale config and resources**

```ts
// packages/i18n/src/config.ts
export const SUPPORTED_LOCALES = ['en', 'ko'] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: AppLocale = 'en';

export function normalizeLocale(input?: string | null): AppLocale | null {
  if (!input) return null;
  const base = input.toLowerCase().split('-')[0];
  return base === 'en' || base === 'ko' ? base : null;
}

export function resolveInitialLocale(
  savedLocale?: string | null,
  detectedLocale?: string | null,
): AppLocale {
  return normalizeLocale(savedLocale) ?? normalizeLocale(detectedLocale) ?? DEFAULT_LOCALE;
}
```

```ts
// packages/i18n/src/index.ts
export * from './config';
export * from './init';
export * from './provider';
```

- [ ] **Step 5: Run test to verify it passes**

Run: `rtk pnpm --filter @repo/i18n test packages/i18n/src/locale-utils.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
rtk proxy git add pnpm-workspace.yaml package.json apps/studio/package.json apps/web/package.json packages/ui/package.json packages/i18n
rtk proxy git commit -m "feat: add shared i18n package"
```

## Task 2: Add Studio Locale Persistence And Electron API

**Files:**
- Create: `apps/studio/src/main/services/app-locale-store.ts`, `apps/studio/src/main/services/app-locale-store.test.ts`
- Modify: `apps/studio/src/main/ipc/channels.ts`, `apps/studio/src/main/ipc/settings.ipc.ts`, `apps/studio/src/preload/api.ts`, `apps/studio/src/renderer/src/providers/electron-provider.ts`
- Test: `apps/studio/src/main/services/app-locale-store.test.ts`

- [ ] **Step 1: Write the failing store test**

```ts
import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { createAppLocaleStore } from './app-locale-store';

describe('app locale store', () => {
  it('reads and writes the locale in an app-owned json file', () => {
    const root = mkdtempSync(join(tmpdir(), 'claude-studio-locale-'));
    const store = createAppLocaleStore(root);

    expect(store.getLocale()).toBeNull();
    store.setLocale('ko');
    expect(store.getLocale()).toBe('ko');

    rmSync(root, { recursive: true, force: true });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `rtk pnpm --filter @repo/studio test apps/studio/src/main/services/app-locale-store.test.ts`
Expected: FAIL because no test script or store implementation exists yet.

- [ ] **Step 3: Add a minimal Studio test script and implement the store**

```json
// apps/studio/package.json
{
  "scripts": {
    "test": "vitest run"
  }
}
```

```ts
// apps/studio/src/main/services/app-locale-store.ts
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import type { AppLocale } from '@repo/i18n';

export function createAppLocaleStore(rootDir: string) {
  const filePath = join(rootDir, 'preferences.json');

  return {
    getLocale(): AppLocale | null {
      if (!existsSync(filePath)) return null;
      const parsed = JSON.parse(readFileSync(filePath, 'utf8')) as { locale?: AppLocale };
      return parsed.locale ?? null;
    },
    setLocale(locale: AppLocale) {
      mkdirSync(rootDir, { recursive: true });
      writeFileSync(filePath, JSON.stringify({ locale }, null, 2) + '\n', 'utf8');
    },
  };
}
```

- [ ] **Step 4: Add IPC and preload surface**

```ts
// apps/studio/src/main/ipc/channels.ts
GetAppLocale = 'app-locale:get',
SetAppLocale = 'app-locale:set',
```

```ts
// apps/studio/src/preload/api.ts
getAppLocale: createInvoker<AppLocale | null>('app-locale:get'),
setAppLocale: createInvoker<void, [AppLocale]>('app-locale:set'),
```

- [ ] **Step 5: Run tests and typecheck**

Run:
- `rtk pnpm --filter @repo/studio test apps/studio/src/main/services/app-locale-store.test.ts`
- `rtk pnpm --filter @repo/studio typecheck`

Expected: PASS

- [ ] **Step 6: Commit**

```bash
rtk proxy git add apps/studio/package.json apps/studio/src/main/ipc/channels.ts apps/studio/src/main/ipc/settings.ipc.ts apps/studio/src/main/services/app-locale-store.ts apps/studio/src/main/services/app-locale-store.test.ts apps/studio/src/preload/api.ts apps/studio/src/renderer/src/providers/electron-provider.ts
rtk proxy git commit -m "feat: persist studio locale through electron"
```

## Task 3: Wire Providers And Add Visible Switchers

**Files:**
- Create: `apps/studio/src/renderer/src/widgets/language-switcher.tsx`, `apps/studio/src/renderer/src/widgets/language-switcher.test.tsx`, `apps/web/src/widgets/language-switcher.tsx`
- Modify: `packages/i18n/src/init.ts`, `packages/i18n/src/provider.tsx`, `apps/studio/src/renderer/src/main.tsx`, `apps/web/src/main.tsx`, `apps/studio/src/renderer/src/routes/__root.tsx`, `apps/studio/src/renderer/src/pages/data/index.tsx`, `apps/web/src/widgets/landing-header/ui/landing-header.tsx`
- Test: `apps/studio/src/renderer/src/widgets/language-switcher.test.tsx`

- [ ] **Step 1: Write the failing switcher test**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AppLocaleProvider } from '@repo/i18n';
import { LanguageSwitcher } from './language-switcher';

describe('LanguageSwitcher', () => {
  it('shows the target locale as the visible action and persists explicit choice', async () => {
    const user = userEvent.setup();
    const setLocale = vi.fn();

    render(
      <AppLocaleProvider initialLocale="en" onLocaleChange={setLocale}>
        <LanguageSwitcher />
      </AppLocaleProvider>,
    );

    await user.click(screen.getByRole('button', { name: /change language to 한국어/i }));
    expect(setLocale).toHaveBeenCalledWith('ko');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `rtk pnpm --filter @repo/studio test apps/studio/src/renderer/src/widgets/language-switcher.test.tsx`
Expected: FAIL because provider/switcher do not exist.

- [ ] **Step 3: Implement provider wiring and the visible switchers**

```tsx
// packages/i18n/src/provider.tsx
export function AppLocaleProvider({ children, initialLocale, onLocaleChange }: Props) {
  // initialize i18next instance once, expose locale + setLocale
}
```

```tsx
// apps/studio/src/renderer/src/widgets/language-switcher.tsx
export function LanguageSwitcher() {
  const { locale, setLocale } = useAppLocale();
  const nextLocale = locale === 'en' ? 'ko' : 'en';
  const visibleLabel = nextLocale === 'ko' ? '한국어' : 'English';

  return (
    <button
      type="button"
      onClick={() => setLocale(nextLocale)}
      aria-label={locale === 'en' ? 'Current language English. Change language to 한국어.' : '현재 언어 한국어. 언어를 English로 변경.'}
    >
      {visibleLabel}
    </button>
  );
}
```

- [ ] **Step 4: Mount the switcher in both shell and settings**

```tsx
// apps/studio/src/renderer/src/routes/__root.tsx
<div className="ml-auto">
  <LanguageSwitcher />
</div>
```

```tsx
// apps/studio/src/renderer/src/pages/data/index.tsx
<CardTitle>Language</CardTitle>
```

- [ ] **Step 5: Run tests and typecheck**

Run:
- `rtk pnpm --filter @repo/studio test apps/studio/src/renderer/src/widgets/language-switcher.test.tsx`
- `rtk pnpm --filter @repo/studio typecheck`
- `rtk pnpm --filter @repo/web typecheck`

Expected: PASS

- [ ] **Step 6: Commit**

```bash
rtk proxy git add packages/i18n apps/studio/src/renderer/src/main.tsx apps/studio/src/renderer/src/routes/__root.tsx apps/studio/src/renderer/src/pages/data/index.tsx apps/studio/src/renderer/src/widgets/language-switcher.tsx apps/studio/src/renderer/src/widgets/language-switcher.test.tsx apps/web/src/main.tsx apps/web/src/widgets/language-switcher.tsx apps/web/src/widgets/landing-header/ui/landing-header.tsx
rtk proxy git commit -m "feat: add visible english-korean switchers"
```

## Task 4: Translate Studio Shell, Shared UI, And Pages

**Files:**
- Modify: `packages/ui/src/charts/*.tsx`, `packages/ui/src/index.ts`, `apps/studio/src/renderer/src/widgets/app-sidebar/index.tsx`, `apps/studio/src/renderer/src/routes/__root.tsx`, `apps/studio/src/renderer/src/pages/**/*.tsx`, `apps/studio/src/renderer/index.html`
- Test: `packages/i18n/src/locale-utils.test.ts`, `apps/studio/src/renderer/src/widgets/language-switcher.test.tsx`

- [ ] **Step 1: Add failing translation coverage assertions for key namespaces**

```ts
import { describe, expect, it } from 'vitest';
import { enResources, koResources } from './resources';

describe('resource parity', () => {
  it('has navigation and settings namespaces in both locales', () => {
    expect(Object.keys(enResources.navigation)).toEqual(Object.keys(koResources.navigation));
    expect(Object.keys(enResources.settings)).toEqual(Object.keys(koResources.settings));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `rtk pnpm --filter @repo/i18n test`
Expected: FAIL until translated resource files exist for the required namespaces.

- [ ] **Step 3: Translate high-visibility Studio chrome first**

```ts
// packages/i18n/src/resources/en/navigation.ts
export const navigation = {
  overview: 'Overview',
  projects: 'Projects',
  live: 'Live',
  costs: 'Costs',
  skills: 'Skills',
  settings: 'Settings',
};
```

```ts
// packages/i18n/src/resources/ko/navigation.ts
export const navigation = {
  overview: '개요',
  projects: '프로젝트',
  live: '라이브',
  costs: '비용',
  skills: '스킬',
  settings: '설정',
};
```

- [ ] **Step 4: Replace literals in shared UI and Studio pages**

```tsx
// example conversion
<span>{t('navigation.overview')}</span>
<p>{t('settings.pluginInstalled')}</p>
<FieldLabel label={t('overview.cacheHitRate')} />
```

- [ ] **Step 5: Run tests, typecheck, and lint**

Run:
- `rtk pnpm --filter @repo/i18n test`
- `rtk pnpm --filter @repo/studio typecheck`
- `rtk pnpm --filter @repo/ui typecheck`
- `rtk pnpm lint`

Expected: PASS

- [ ] **Step 6: Commit**

```bash
rtk proxy git add packages/i18n packages/ui apps/studio/src/renderer
rtk proxy git commit -m "feat: localize studio shell and shared ui"
```

## Task 5: Translate Web Landing, README, And Maintainer Docs

**Files:**
- Modify: `apps/web/src/widgets/**/*.tsx`, `README.md`
- Create: `docs/localization.md`, `docs/maintainers/language-policy.md`
- Test: manual verification checklist

- [ ] **Step 1: Write the failing manual verification checklist**

```md
- Landing header is English by default
- Web switcher shows 한국어 from English UI
- README opening section is English-first
- Docs explain English public source-of-truth and Korean support
```

- [ ] **Step 2: Translate the landing widgets and README**

```tsx
// apps/web/src/widgets/hero-section/ui/hero-section.tsx
<h1>See Claude Code usage at a glance</h1>
<p>Analyze cost, tokens, and projects from local data, and watch live activity in the pixel office.</p>
```

```md
<!-- README.md -->
# Claude Studio

Desktop dashboard for analyzing Claude Code usage from local transcript data.
```

- [ ] **Step 3: Add implementation-facing docs**

```md
<!-- docs/localization.md -->
# Localization

Claude Studio uses English as the source of truth for public copy and keeps Korean as a supported locale.
```

```md
<!-- docs/maintainers/language-policy.md -->
# Language Policy

Public-facing docs and product copy are English-first. Korean remains supported through reviewed locale resources and freshness discipline.
```

- [ ] **Step 4: Run verification**

Run:
- `rtk pnpm --filter @repo/web typecheck`
- `rtk pnpm lint`
- `rtk pnpm build`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
rtk proxy git add apps/web README.md docs/localization.md docs/maintainers/language-policy.md
rtk proxy git commit -m "docs: translate public surfaces to english"
```

## Task 6: Final Verification, PR Prep, And Review

**Files:**
- Modify only if verification or review finds issues
- Test: full repo verification

- [ ] **Step 1: Run full verification**

Run:
- `rtk pnpm lint`
- `rtk pnpm --filter @repo/i18n test`
- `rtk pnpm --filter @repo/studio test`
- `rtk pnpm --filter @repo/studio typecheck`
- `rtk pnpm --filter @repo/web typecheck`
- `rtk pnpm build`

Expected: all commands exit `0`

- [ ] **Step 2: Re-read the design spec and research summary**

Check:
- visible shell switcher exists
- English default is active
- Korean switch is immediate and obvious
- `.claude/reference` remains untranslated
- public docs are English-first

- [ ] **Step 3: Prepare PR content**

Use this structure:

```md
## Summary
- add shared i18n runtime for Studio, Web, and shared UI
- make English the default public/app locale and preserve Korean support
- add visible language switching plus public docs and policy updates

## Verification
- pnpm lint
- pnpm --filter @repo/i18n test
- pnpm --filter @repo/studio test
- pnpm --filter @repo/studio typecheck
- pnpm --filter @repo/web typecheck
- pnpm build
```

- [ ] **Step 4: Commit any final fixes**

```bash
rtk proxy git add packages/i18n packages/ui apps/studio apps/web README.md docs/localization.md docs/maintainers/language-policy.md
rtk proxy git commit -m "chore: finalize english-korean localization rollout"
```
