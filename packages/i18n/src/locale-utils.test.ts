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
