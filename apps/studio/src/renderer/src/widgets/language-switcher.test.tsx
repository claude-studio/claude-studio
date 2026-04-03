// @vitest-environment jsdom

import { AppLocaleProvider, initI18n } from '@repo/i18n';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { LanguageSwitcher } from './language-switcher';

afterEach(() => {
  cleanup();
});

describe('LanguageSwitcher', () => {
  it('shows the alternate locale label and switches between English and Korean', async () => {
    const i18n = await initI18n('en');
    const persistLocale = vi.fn(async () => {});
    const user = userEvent.setup();

    render(
      <AppLocaleProvider i18n={i18n} initialLocale="en" onLocaleChange={persistLocale}>
        <LanguageSwitcher />
      </AppLocaleProvider>,
    );

    expect(screen.getByRole('button', { name: /한국어/i }).textContent).toBe('한국어');

    await user.click(screen.getByRole('button', { name: /한국어/i }));

    await waitFor(() => {
      expect(persistLocale).toHaveBeenCalledWith('ko');
      expect(screen.getByRole('button', { name: /English/i }).textContent).toBe('English');
    });
  });

  it('renders settings mode as a selectable language group', async () => {
    const i18n = await initI18n('en');
    const persistLocale = vi.fn(async () => {});

    render(
      <AppLocaleProvider i18n={i18n} initialLocale="en" onLocaleChange={persistLocale}>
        <LanguageSwitcher mode="settings" />
      </AppLocaleProvider>,
    );

    const group = screen.getByRole('radiogroup', { name: /Language/i });
    const user = userEvent.setup();
    const englishOption = screen.getByRole('radio', { name: /Current language: English/i });
    const koreanOption = screen.getByRole('radio', { name: /Switch to 한국어/i });

    expect(group.contains(englishOption)).toBe(true);
    expect(group.contains(koreanOption)).toBe(true);
    expect((englishOption as HTMLInputElement).checked).toBe(true);
    expect((koreanOption as HTMLInputElement).checked).toBe(false);

    englishOption.focus();
    expect(document.activeElement).toBe(englishOption);

    await user.click(koreanOption);

    await waitFor(() => {
      expect(persistLocale).toHaveBeenCalledWith('ko');
      expect((koreanOption as HTMLInputElement).checked).toBe(true);
    });
  });
});
