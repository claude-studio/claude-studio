import { clearCache, type DataChangeSource } from '@repo/shared';

import { BrowserWindow } from 'electron';
import { type FSWatcher, watch } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

let watchers: FSWatcher[] = [];

function broadcast(source: DataChangeSource): void {
  clearCache(source);
  const windows = BrowserWindow.getAllWindows();
  for (const win of windows) {
    if (!win.isDestroyed()) {
      try { win.webContents.send('data-changed', source); } catch { /* renderer not ready */ }
    }
  }
}

function watchDir(dirPath: string, source: DataChangeSource): void {
  try {
    const w = watch(dirPath, { recursive: true }, () => broadcast(source));
    watchers.push(w);
  } catch {
    console.log('File watcher: could not watch', dirPath);
  }
}

export function startFileWatcher(): void {
  if (watchers.length > 0) return;

  const base = join(homedir(), '.claude');
  watchDir(join(base, 'projects'), 'projects');
}

export function stopFileWatcher(): void {
  for (const w of watchers) w.close();
  watchers = [];
}
