import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  formatCost,
  formatDate,
  formatDateShort,
  formatDuration,
  formatNumber,
  formatTokens,
  timeAgo,
} from './lib/format';

afterEach(() => {
  vi.useRealTimers();
});

describe('format helpers', () => {
  it('uses locale-aware defaults for cost formatting', () => {
    expect(formatCost(0.5, { locale: 'en' })).toBe('$0.50');
    expect(formatCost(0.5, { locale: 'ko' })).toBe('₩690');
    expect(formatCost(0.5, { locale: 'en', currency: 'krw' })).toBe('₩690');
  });

  it('formats compact values with locale-specific units', () => {
    expect(formatTokens(12_500, { locale: 'en' })).toBe('12.5K');
    expect(formatTokens(12_500, { locale: 'ko' })).toBe('1.3만');
    expect(formatNumber(1_250_000, { locale: 'en' })).toBe('1.3M');
    expect(formatNumber(1_250_000, { locale: 'ko' })).toBe('125.0만');
  });

  it('formats durations with locale-specific abbreviations', () => {
    expect(formatDuration(3_900_000, { locale: 'en' })).toBe('1h 5m');
    expect(formatDuration(3_900_000, { locale: 'ko' })).toBe('1시간 5분');
  });

  it('preserves date-only strings without timezone drift', () => {
    expect(formatDate('2026-04-03', { locale: 'en' })).toBe('Apr 3, 2026');
    expect(formatDate('2026-04-03', { locale: 'ko' })).toBe('2026년 4월 3일');
    expect(formatDateShort('2026-04-03', { locale: 'en' })).toBe('Apr 3');
    expect(formatDateShort('2026-04-03', { locale: 'ko' })).toBe('4월 3일');
  });

  it('formats relative time in both supported locales', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-03T12:00:00Z'));

    expect(timeAgo(new Date('2026-04-03T11:59:30Z'), { locale: 'en' })).toBe('just now');
    expect(timeAgo(new Date('2026-04-03T11:58:00Z'), { locale: 'en' })).toBe('2 minutes ago');
    expect(timeAgo(new Date('2026-04-03T11:58:00Z'), { locale: 'ko' })).toBe('2분 전');
  });
});
