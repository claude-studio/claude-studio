import { watch, type FSWatcher } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { BrowserWindow } from 'electron';
import { clearCache } from '@repo/shared';

let watcher: FSWatcher | null = null;

export function startFileWatcher(): void {
  const claudeDir = join(homedir(), '.claude', 'projects');

  try {
    watcher = watch(claudeDir, { recursive: true }, (_eventType, _filename) => {
      clearCache();
      const windows = BrowserWindow.getAllWindows();
      for (const win of windows) {
        win.webContents.send('data-changed');
      }
    });
  } catch {
    console.log('File watcher: could not watch', claudeDir);
  }
}

export function stopFileWatcher(): void {
  watcher?.close();
  watcher = null;
}
