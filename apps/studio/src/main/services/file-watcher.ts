import { watch, type FSWatcher } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { BrowserWindow } from 'electron';
import { clearCache } from '@repo/shared';

let watchers: FSWatcher[] = [];

function broadcast(source: 'projects' | 'teams'): void {
  clearCache(source);
  const windows = BrowserWindow.getAllWindows();
  for (const win of windows) {
    win.webContents.send('data-changed', source);
  }
}

function watchDir(dirPath: string, source: 'projects' | 'teams'): void {
  try {
    const w = watch(dirPath, { recursive: true }, () => broadcast(source));
    watchers.push(w);
  } catch {
    console.log('File watcher: could not watch', dirPath);
  }
}

export function startFileWatcher(): void {
  const base = join(homedir(), '.claude');
  watchDir(join(base, 'projects'), 'projects');
  watchDir(join(base, 'teams'), 'teams');
  watchDir(join(base, 'tasks'), 'teams');
}

export function stopFileWatcher(): void {
  for (const w of watchers) w.close();
  watchers = [];
}
