const USD_TO_KRW = 1380;

export type FormatLocale = 'en' | 'ko';

export interface FormatOptions {
  locale?: FormatLocale;
}

export interface FormatCostOptions extends FormatOptions {
  currency?: 'usd' | 'krw';
}

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

type CompactUnit = {
  value: number;
  suffix: string;
};

type DurationUnit = 'day' | 'hour' | 'minute' | 'second';

const ENGLISH_TOKEN_UNITS: CompactUnit[] = [
  { value: 1_000_000_000, suffix: 'B' },
  { value: 1_000_000, suffix: 'M' },
  { value: 1_000, suffix: 'K' },
];

const ENGLISH_NUMBER_UNITS: CompactUnit[] = [
  { value: 1_000_000, suffix: 'M' },
  { value: 1_000, suffix: 'K' },
];

const KOREAN_TOKEN_UNITS: CompactUnit[] = [
  { value: 100_000_000, suffix: '억' },
  { value: 10_000, suffix: '만' },
  { value: 1_000, suffix: '천' },
];

const KOREAN_NUMBER_UNITS: CompactUnit[] = [
  { value: 100_000_000, suffix: '억' },
  { value: 10_000, suffix: '만' },
  { value: 1_000, suffix: '천' },
];

export function formatTokens(tokens: number, options?: FormatOptions): string {
  const locale = options?.locale ?? 'en';

  return formatCompactNumber(tokens, locale === 'ko' ? KOREAN_TOKEN_UNITS : ENGLISH_TOKEN_UNITS, {
    locale,
  });
}

export function formatCost(cost: number, options?: FormatCostOptions): string {
  const locale = options?.locale ?? 'en';
  const currency = options?.currency ?? (locale === 'ko' ? 'krw' : 'usd');
  return currency === 'krw' ? formatCostKrw(cost) : formatCostUsd(cost);
}

export function formatCostUsd(cost: number): string {
  if (cost === 0) return '$0.00';
  if (cost < 0.0001) return `$${cost.toFixed(6)}`;
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  return `$${cost.toFixed(2)}`;
}

export function formatCostKrw(cost: number): string {
  const krw = cost * USD_TO_KRW;
  if (krw === 0) return '₩0';
  if (krw < 1) return `₩${krw.toFixed(2)}`;
  if (krw < 10) return `₩${krw.toFixed(1)}`;
  return `₩${Math.round(krw).toLocaleString('ko-KR')}`;
}

export function formatDuration(ms: number, options?: FormatOptions): string {
  const locale = options?.locale ?? 'en';
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return formatDurationParts(days, 'day', hours % 24, 'hour', locale);
  if (hours > 0) return formatDurationParts(hours, 'hour', minutes % 60, 'minute', locale);
  if (minutes > 0) return formatDurationParts(minutes, 'minute', seconds % 60, 'second', locale);
  return formatDurationPart(seconds, 'second', locale);
}

export function formatNumber(n: number, options?: FormatOptions): string {
  const locale = options?.locale ?? 'en';

  return formatCompactNumber(n, locale === 'ko' ? KOREAN_NUMBER_UNITS : ENGLISH_NUMBER_UNITS, {
    locale,
  });
}

export function timeAgo(date: Date | string, options?: FormatOptions): string {
  const locale = options?.locale ?? 'en';
  const d = parseDateInput(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSeconds < 60) return locale === 'ko' ? '방금 전' : 'just now';
  if (diffMinutes < 60) return formatRelativeTime(diffMinutes, 'minute', locale);
  if (diffHours < 24) return formatRelativeTime(diffHours, 'hour', locale);
  if (diffDays < 7) return formatRelativeTime(diffDays, 'day', locale);
  if (diffWeeks < 4) return formatRelativeTime(diffWeeks, 'week', locale);
  if (diffMonths < 12) return formatRelativeTime(diffMonths, 'month', locale);
  return formatRelativeTime(Math.floor(diffMonths / 12), 'year', locale);
}

export function formatDate(date: Date | string, options?: FormatOptions): string {
  const locale = options?.locale ?? 'en';
  const d = parseDateInput(date);

  return d.toLocaleDateString(getDateLocale(locale), getFullDateOptions(locale));
}

export function formatDateShort(date: Date | string, options?: FormatOptions): string {
  const locale = options?.locale ?? 'en';
  const d = parseDateInput(date);

  return d.toLocaleDateString(getDateLocale(locale), getShortDateOptions(locale));
}

function formatCompactNumber(value: number, units: CompactUnit[], options?: FormatOptions): string {
  if (!value || Number.isNaN(value)) return '0';

  const locale = options?.locale ?? 'en';
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  for (const unit of units) {
    if (absValue >= unit.value) {
      const scaled = absValue / unit.value;
      return `${sign}${scaled.toFixed(1)}${unit.suffix}`;
    }
  }

  return new Intl.NumberFormat(getDateLocale(locale)).format(value);
}

function formatRelativeTime(
  value: number,
  unit: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year',
  locale: FormatLocale,
): string {
  if (locale === 'ko') {
    const labels = {
      minute: '분 전',
      hour: '시간 전',
      day: '일 전',
      week: '주 전',
      month: '개월 전',
      year: '년 전',
    } as const;

    return `${value}${labels[unit]}`;
  }

  return `${value} ${unit}${value === 1 ? '' : 's'} ago`;
}

function formatDurationParts(
  firstValue: number,
  firstUnit: DurationUnit,
  secondValue: number,
  secondUnit: DurationUnit,
  locale: FormatLocale,
): string {
  return `${formatDurationPart(firstValue, firstUnit, locale)} ${formatDurationPart(secondValue, secondUnit, locale)}`;
}

function formatDurationPart(value: number, unit: DurationUnit, locale: FormatLocale): string {
  if (locale === 'ko') {
    const labels = {
      day: '일',
      hour: '시간',
      minute: '분',
      second: '초',
    } as const;

    return `${value}${labels[unit]}`;
  }

  const labels = {
    day: 'd',
    hour: 'h',
    minute: 'm',
    second: 's',
  } as const;

  return `${value}${labels[unit]}`;
}

function getDateLocale(locale: FormatLocale): string {
  return locale === 'ko' ? 'ko-KR' : 'en-US';
}

function getFullDateOptions(locale: FormatLocale): Intl.DateTimeFormatOptions {
  if (locale === 'ko') {
    return {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
  }

  return {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
}

function getShortDateOptions(locale: FormatLocale): Intl.DateTimeFormatOptions {
  if (locale === 'ko') {
    return {
      month: 'long',
      day: 'numeric',
    };
  }

  return {
    month: 'short',
    day: 'numeric',
  };
}

function parseDateInput(date: Date | string): Date {
  if (date instanceof Date) {
    return date;
  }

  const dateOnlyMatch = DATE_ONLY_PATTERN.exec(date);

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  return new Date(date);
}
