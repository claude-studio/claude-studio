// @vitest-environment jsdom

import { act, cleanup, render, screen, waitFor } from '@testing-library/react';

import type { ReactElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { initI18n } from './init';
import { AppLocaleProvider, useAppLocale } from './provider';

afterEach(() => {
  cleanup();
});

function LocaleProbe({
  capture,
}: {
  capture: (value: ReturnType<typeof useAppLocale>) => void;
}): ReactElement {
  const value = useAppLocale();
  capture(value);

  return (
    <>
      <div data-testid="locale">{value.locale}</div>
      <div data-testid="changing">{String(value.isChanging)}</div>
    </>
  );
}

describe('AppLocaleProvider', () => {
  it('stays in sync when i18n language changes externally', async () => {
    const i18n = await initI18n('en');
    let latest!: ReturnType<typeof useAppLocale>;

    render(
      <AppLocaleProvider i18n={i18n} initialLocale="en">
        <LocaleProbe capture={(value) => (latest = value)} />
      </AppLocaleProvider>,
    );

    expect(latest.locale).toBe('en');
    expect(document.documentElement.lang).toBe('en');

    await act(async () => {
      await i18n.changeLanguage('ko');
    });

    await waitFor(() => {
      expect(screen.getByTestId('locale').textContent).toBe('ko');
      expect(latest.locale).toBe('ko');
      expect(document.documentElement.lang).toBe('ko');
    });
  });

  it('serializes quick locale changes against the live i18n locale', async () => {
    const i18n = await initI18n('en');
    let latest!: ReturnType<typeof useAppLocale>;
    const onLocaleChange = vi.fn(async () => {});

    render(
      <AppLocaleProvider i18n={i18n} initialLocale="en" onLocaleChange={onLocaleChange}>
        <LocaleProbe capture={(value) => (latest = value)} />
      </AppLocaleProvider>,
    );

    const firstChange = latest.setLocale('ko');
    const secondChange = latest.setLocale('en');

    await act(async () => {
      await Promise.all([firstChange, secondChange]);
    });

    expect(onLocaleChange).toHaveBeenNthCalledWith(1, 'ko');
    expect(onLocaleChange).toHaveBeenNthCalledWith(2, 'en');
    expect(i18n.resolvedLanguage).toBe('en');
    expect(latest.locale).toBe('en');
  });

  it('does not switch runtime locale when persistence fails', async () => {
    const i18n = await initI18n('en');
    let latest!: ReturnType<typeof useAppLocale>;
    const onLocaleChange = vi.fn(async () => {
      throw new Error('persist failed');
    });

    render(
      <AppLocaleProvider i18n={i18n} initialLocale="en" onLocaleChange={onLocaleChange}>
        <LocaleProbe capture={(value) => (latest = value)} />
      </AppLocaleProvider>,
    );

    await expect(
      act(async () => {
        await latest.setLocale('ko');
      }),
    ).rejects.toThrow('persist failed');

    expect(i18n.resolvedLanguage).toBe('en');
    expect(latest.locale).toBe('en');
    expect(screen.getByTestId('changing').textContent).toBe('false');
  });
});
