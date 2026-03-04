import { registerStatsHandlers } from './stats.ipc';
import { registerProjectHandlers } from './projects.ipc';
import { registerSessionHandlers } from './sessions.ipc';
import { registerDataSourceHandlers } from './data-source.ipc';
import { registerSettingsHandlers } from './settings.ipc';

export function registerAllIpcHandlers(): void {
  registerStatsHandlers();
  registerProjectHandlers();
  registerSessionHandlers();
  registerDataSourceHandlers();
  registerSettingsHandlers();
}
