import { describe, expect, it } from 'vitest';

import {
  normalizeLocale,
  resolveInitialLocale,
  resolveLocaleBootstrap,
  resolveLocaleChange,
} from './config';

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

  it('returns the normalized bootstrap locale and persisted value when supported', () => {
    expect(resolveLocaleBootstrap('ko-KR', 'en-US')).toEqual({
      locale: 'ko',
      persistedLocale: 'ko',
    });
    expect(resolveLocaleBootstrap('ja-JP', 'ko-KR')).toEqual({
      locale: 'ko',
      persistedLocale: null,
    });
    expect(resolveLocaleBootstrap(null, 'fr-FR')).toEqual({
      locale: 'en',
      persistedLocale: null,
    });
  });

  it('normalizes locale changes for persistence', () => {
    expect(resolveLocaleChange('ko-KR')).toBe('ko');
    expect(resolveLocaleChange('en')).toBe('en');
    expect(resolveLocaleChange('fr-FR')).toBeNull();
  });
});
