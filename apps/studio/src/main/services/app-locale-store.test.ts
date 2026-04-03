import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { createAppLocaleStore } from './app-locale-store';

async function createTempRoot(): Promise<string> {
  return mkdtemp(path.join(tmpdir(), 'app-locale-store-'));
}

describe('app locale store', () => {
  it('returns null when the locale file is missing', async () => {
    const rootDir = await createTempRoot();
    const store = createAppLocaleStore({ rootDir });

    try {
      await expect(store.getAppLocale()).resolves.toBeNull();
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });

  it('persists and reads supported locales from the app-owned file', async () => {
    const rootDir = await createTempRoot();
    const store = createAppLocaleStore({ rootDir });

    try {
      await store.setAppLocale('ko');

      await expect(store.getAppLocale()).resolves.toBe('ko');

      const persisted = JSON.parse(
        await readFile(path.join(rootDir, 'settings', 'app-locale.json'), 'utf-8'),
      ) as { locale?: string };

      expect(persisted).toEqual({ locale: 'ko' });
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });

  it('fails closed to null for invalid JSON and unsupported locales', async () => {
    const rootDir = await createTempRoot();
    const store = createAppLocaleStore({ rootDir });
    const filePath = path.join(rootDir, 'settings', 'app-locale.json');

    try {
      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(filePath, '{invalid json', 'utf-8');
      await expect(store.getAppLocale()).resolves.toBeNull();

      await writeFile(filePath, JSON.stringify({ locale: 'ja' }), 'utf-8');
      await expect(store.getAppLocale()).resolves.toBeNull();
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });
});
