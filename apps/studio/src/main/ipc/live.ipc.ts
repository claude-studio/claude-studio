import { ipcMain, WebContents } from 'electron';

import { getCachedCharacterSprites, getCachedWallSprites } from '../services/character-loader';
import { getActiveAgents, startLiveWatcher, stopLiveWatcher } from '../services/live-watcher';
import { IpcChannel } from './channels';

export function registerLiveHandlers(): void {
  ipcMain.handle(IpcChannel.GetCharacterSprites, () => {
    return getCachedCharacterSprites();
  });

  ipcMain.handle(IpcChannel.GetWallSprites, () => {
    return getCachedWallSprites();
  });

  ipcMain.handle(IpcChannel.LiveGetActiveAgents, (event) => {
    const agents = getActiveAgents();
    const sender: WebContents = event.sender;

    // renderer가 준비된 직후 현재 상태를 push
    setImmediate(() => {
      if (sender.isDestroyed()) return;
      for (const agent of agents) {
        try {
          if (agent.status === 'working') {
            sender.send('live:agent-event', { type: 'agentWorking', id: agent.id });
          }
          if (agent.activeToolId) {
            sender.send('live:agent-event', {
              type: 'agentToolStart',
              id: agent.id,
              toolId: agent.activeToolId,
              toolName: agent.activeToolName ?? '',
              status: agent.activeToolStatus ?? '',
            });
          }
        } catch { /* ignore */ }
      }
    });

    return agents;
  });

  ipcMain.handle(IpcChannel.LiveStartWatching, () => {
    startLiveWatcher();
  });

  ipcMain.handle(IpcChannel.LiveStopWatching, () => {
    stopLiveWatcher();
  });
}
