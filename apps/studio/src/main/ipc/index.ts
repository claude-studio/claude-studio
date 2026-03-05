import { registerDataSourceHandlers } from './data-source.ipc';
import { registerProjectHandlers } from './projects.ipc';
import { registerSessionHandlers } from './sessions.ipc';
import { registerSettingsHandlers } from './settings.ipc';
import { registerStatsHandlers } from './stats.ipc';

export function registerAllIpcHandlers(): void {
  registerStatsHandlers();
  registerProjectHandlers();
  registerSessionHandlers();
  registerDataSourceHandlers();
  registerSettingsHandlers();
}
