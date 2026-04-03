import { describe, expect, it } from 'vitest';

import { bootstrapI18n } from './bootstrap';
import { createBrowserLocaleStorage } from './browser';

describe('bootstrapI18n', () => {
  it('falls back to detected locale when the saved locale reader throws', async () => {
    const { initialLocale, i18n } = await bootstrapI18n({
      detectLocale: 'ko-KR',
      getSavedLocale: () => {
        throw new Error('storage unavailable');
      },
    });

    expect(initialLocale).toBe('ko');
    expect(i18n.resolvedLanguage).toBe('ko');
  });
});

describe('createBrowserLocaleStorage', () => {
  it('returns null when reading storage throws', () => {
    const localeStorage = createBrowserLocaleStorage({
      storage: {
        getItem() {
          throw new Error('blocked');
        },
        setItem() {},
      },
    });

    expect(localeStorage.getSavedLocale()).toBeNull();
  });
});
