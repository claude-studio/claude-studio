import { app, BrowserWindow, shell } from 'electron';
import { join } from 'path';

import { registerAllIpcHandlers } from './ipc/index';
import { loadCharacterSprites, loadWallSprites } from './services/character-loader';
import { startFileWatcher, stopFileWatcher } from './services/file-watcher';
import { startHookServer, stopHookServer } from './services/hook-server';
import { processHookEvent, startLiveWatcher, stopLiveWatcher } from './services/live-watcher';

// dev: <project>/apps/studio, prod: <app>/resources/app
function getAssetsRoot(): string {
  const appPath = app.getAppPath();
  // electron-vite dev: appPath = apps/studio
  // prod: appPath = resources/app
  const candidates = [
    join(appPath, 'public', 'assets'),
    join(appPath, '..', 'public', 'assets'),
  ];
  for (const p of candidates) {
    if (require('fs').existsSync(p)) return p;
  }
  return join(appPath, 'public', 'assets');
}

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'default',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.on('ready-to-show', () => {
    win.show();
  });

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  registerAllIpcHandlers();
  loadCharacterSprites(getAssetsRoot());
  loadWallSprites(getAssetsRoot());
  startFileWatcher();
  startLiveWatcher();
  startHookServer((e) => processHookEvent(e));
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  stopFileWatcher();
  stopLiveWatcher();
  stopHookServer();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  stopHookServer();
});
