import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { app } from 'electron';

const PLUGIN_NAME = 'claude-studio';
const PLUGIN_VERSION = '1.0.0';
const PLUGIN_KEY = `${PLUGIN_NAME}@local`;
const INSTALL_DIR = path.join(
  os.homedir(),
  '.claude',
  'plugins',
  'cache',
  'local',
  PLUGIN_NAME,
  PLUGIN_VERSION,
);
const CLAUDE_DIR = path.join(os.homedir(), '.claude');
const INSTALLED_PLUGINS_PATH = path.join(CLAUDE_DIR, 'installed_plugins.json');
const SETTINGS_PATH = path.join(CLAUDE_DIR, 'settings.json');

function getResourcesPluginPath(): string {
  // dev: app.getAppPath() = apps/studio
  // prod: process.resourcesPath
  if (process.env['NODE_ENV'] === 'development' || app.isPackaged === false) {
    return path.join(app.getAppPath(), 'resources', 'plugin');
  }
  return path.join(process.resourcesPath, 'plugin');
}

function copyDirSync(src: string, dest: string): void {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function readJsonFile(filePath: string): Record<string, unknown> {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function writeJsonFile(filePath: string, data: Record<string, unknown>): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

export function isPluginInstalled(): boolean {
  const data = readJsonFile(INSTALLED_PLUGINS_PATH);
  return PLUGIN_KEY in data;
}

export function installPlugin(): void {
  const srcPath = getResourcesPluginPath();

  // 1. 플러그인 파일 복사
  copyDirSync(srcPath, INSTALL_DIR);

  // 2. notify.sh 실행 권한 부여
  const notifyShPath = path.join(INSTALL_DIR, 'hooks', 'notify.sh');
  try {
    fs.chmodSync(notifyShPath, 0o755);
  } catch {
    // ignore
  }

  // 3. installed_plugins.json 업데이트 (version 2 포맷)
  const installedPlugins = readJsonFile(INSTALLED_PLUGINS_PATH);
  installedPlugins[PLUGIN_KEY] = {
    version: PLUGIN_VERSION,
    installedAt: new Date().toISOString(),
    type: 'local',
  };
  writeJsonFile(INSTALLED_PLUGINS_PATH, installedPlugins);

  // 4. settings.json의 enabledPlugins에 true 추가
  const settings = readJsonFile(SETTINGS_PATH);
  const enabledPlugins = (settings['enabledPlugins'] as Record<string, boolean> | undefined) ?? {};
  enabledPlugins[PLUGIN_KEY] = true;
  settings['enabledPlugins'] = enabledPlugins;
  writeJsonFile(SETTINGS_PATH, settings);
}

export function uninstallPlugin(): void {
  // 1. settings.json에서 제거
  try {
    const settings = readJsonFile(SETTINGS_PATH);
    const enabledPlugins = settings['enabledPlugins'] as Record<string, boolean> | undefined;
    if (enabledPlugins) {
      delete enabledPlugins[PLUGIN_KEY];
      settings['enabledPlugins'] = enabledPlugins;
      writeJsonFile(SETTINGS_PATH, settings);
    }
  } catch {
    // ignore
  }

  // 2. installed_plugins.json에서 제거
  try {
    const installedPlugins = readJsonFile(INSTALLED_PLUGINS_PATH);
    delete installedPlugins[PLUGIN_KEY];
    writeJsonFile(INSTALLED_PLUGINS_PATH, installedPlugins);
  } catch {
    // ignore
  }

  // 3. 설치 디렉토리 제거
  try {
    fs.rmSync(INSTALL_DIR, { recursive: true, force: true });
  } catch {
    // ignore
  }
}
