import { registerDataSourceHandlers } from './data-source.ipc';
import { registerLiveHandlers } from './live.ipc';
import { registerPluginHandlers } from './plugin.ipc';
import { registerProjectHandlers } from './projects.ipc';
import { registerSettingsHandlers } from './settings.ipc';
import { registerStatsHandlers } from './stats.ipc';

export function registerAllIpcHandlers(): void {
  registerStatsHandlers();
  registerProjectHandlers();
  registerDataSourceHandlers();
  registerSettingsHandlers();
  registerLiveHandlers();
  registerPluginHandlers();
}
