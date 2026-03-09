import type { PixelAgentEvent } from '../messages';
import { extractToolName } from '../tool-utils';

import type { OfficeState } from '../engine/office-state';

export function processPixelAgentEvent(os: OfficeState, event: PixelAgentEvent): void {
  switch (event.type) {
    case 'agentCreated': {
      os.addAgent(event.id, { folderName: event.shortId ?? event.folderName });
      break;
    }
    case 'agentClosed': {
      os.removeAllSubagents(event.id);
      os.removeAgent(event.id);
      break;
    }
    case 'agentWorking': {
      os.moveAgentToWork(event.id); // 내부에서 isActive=true 설정
      break;
    }
    case 'agentIdle': {
      os.returnAgentToSeat(event.id); // 내부에서 isActive=false 설정
      break;
    }
    case 'agentSessionEnd': {
      // 세션 종료 — 회의실로 복귀 후 despawn 대기
      os.returnAgentToSeat(event.id);
      break;
    }
    case 'agentToolStart': {
      const toolName = extractToolName(event.status);
      os.setAgentTool(event.id, toolName);
      os.clearPermissionBubble(event.id);
      if (event.status.startsWith('Subtask:')) {
        os.addSubagent(event.id, event.toolId);
      }
      break;
    }
    case 'agentToolDone': {
      break;
    }
    case 'agentToolsClear': {
      os.setAgentTool(event.id, null);
      os.clearPermissionBubble(event.id);
      os.removeAllSubagents(event.id);
      // 도구가 모두 끝나면 즉시 isActive=false → sprite frame[3][4]로 전환
      os.setAgentActive(event.id, false);
      break;
    }
    case 'agentToolPermission': {
      os.showPermissionBubble(event.id);
      break;
    }
  }
}
