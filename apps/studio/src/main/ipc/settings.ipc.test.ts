import { beforeEach, describe, expect, it, vi } from 'vitest';

import { IpcChannel } from './channels';
import { registerSettingsHandlers } from './settings.ipc';

const mocks = vi.hoisted(() => {
  const handlers = new Map<string, (...args: unknown[]) => unknown>();
  const handle = vi.fn((channel: string, handler: (...args: unknown[]) => unknown) => {
    handlers.set(channel, handler);
  });
  const getAppLocale = vi.fn<() => Promise<'en' | 'ko' | null>>();
  const setAppLocale = vi.fn<(locale: 'en' | 'ko') => Promise<void>>();

  return {
    getAppLocale,
    handlers,
    handle,
    setAppLocale,
  };
});

vi.mock('electron', () => ({
  ipcMain: {
    handle: mocks.handle,
  },
}));

vi.mock('@repo/shared', () => ({
  getClaudeSettings: vi.fn(() => ({})),
  getSkills: vi.fn(() => []),
}));

vi.mock('../services/app-locale-store', () => ({
  getAppLocaleStore: vi.fn(() => ({
    getAppLocale: mocks.getAppLocale,
    setAppLocale: mocks.setAppLocale,
  })),
}));

describe('registerSettingsHandlers', () => {
  beforeEach(() => {
    mocks.handlers.clear();
    mocks.handle.mockClear();
    mocks.getAppLocale.mockReset().mockResolvedValue(null);
    mocks.setAppLocale.mockReset().mockResolvedValue(undefined);
  });

  it('normalizes supported locale input before persistence', async () => {
    registerSettingsHandlers();

    const setLocaleHandler = mocks.handlers.get(IpcChannel.SetAppLocale);

    expect(setLocaleHandler).toBeTypeOf('function');

    await setLocaleHandler!(undefined, 'ko-KR');

    expect(mocks.setAppLocale).toHaveBeenCalledWith('ko');
  });

  it('rejects unsupported locale input at the IPC boundary', async () => {
    registerSettingsHandlers();

    const setLocaleHandler = mocks.handlers.get(IpcChannel.SetAppLocale);

    expect(setLocaleHandler).toBeTypeOf('function');
    await expect(setLocaleHandler!(undefined, 'ja-JP')).rejects.toThrow('Unsupported app locale');
    expect(mocks.setAppLocale).not.toHaveBeenCalled();
  });
});
