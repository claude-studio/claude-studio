# IPC & 서비스 레이어

## 코딩 규칙

- 채널 문자열 리터럴 직접 사용 금지 — 반드시 `IpcChannel` enum 사용
- Renderer에서 main process 직접 접근 불가 — `window.electronAPI.*` 로만 호출
- 새 IPC 채널 추가 순서: `channels.ts` enum → `*.ipc.ts` 핸들러 → `preload/api.ts` 노출
- push 이벤트 구독 시 반드시 cleanup 함수 반환 (`ipcRenderer.off`)

---

## IPC 채널 (`apps/studio/src/main/ipc/channels.ts`)

```ts
export enum IpcChannel {
  GetStats              = 'stats:get',
  GetProjects           = 'projects:get',
  GetDataSource         = 'data-source:get',
  SetDataSource         = 'data-source:set',
  ExportData            = 'data:export',
  ImportData            = 'data:import',
  ClearImport           = 'data:clear-import',
  GetCostAnalysis       = 'costs:get',
  GetClaudeSettings     = 'settings:get',
  GetSkills             = 'skills:get',
  LiveGetActiveAgents   = 'live:get-active-agents',
  LiveStartWatching     = 'live:start-watching',
  LiveStopWatching      = 'live:stop-watching',
  GetCharacterSprites   = 'assets:get-character-sprites',
  GetWallSprites        = 'assets:get-wall-sprites',
  PluginCheckInstalled  = 'plugin:check-installed',
  PluginInstall         = 'plugin:install',
  PluginUninstall       = 'plugin:uninstall',
}
```

**push 채널** (main → renderer, `ipcRenderer.on` 구독):
- `data-changed` — 파일 변경 감지 시 `DataChangeSource` 페이로드
- `live:agent-event` — 에이전트 상태 변경 이벤트 (`LiveAgentEvent`)

## Preload API (`apps/studio/src/preload/api.ts`)

`contextBridge`로 노출. Renderer에서 `window.electronAPI.*` 접근.

```ts
// 타입 안전 invoke 래퍼 팩토리
function createInvoker<TReturn, TArgs extends unknown[] = []>(channel: string) {
  return (...args: TArgs): Promise<TReturn> => ipcRenderer.invoke(channel, ...args);
}

export const electronAPI = {
  // Stats
  getStats: createInvoker<DashboardStats>('stats:get'),
  getCostAnalysis: createInvoker<DashboardStats>('costs:get'),

  // Projects
  getProjects: createInvoker<ProjectInfo[]>('projects:get'),

  // Settings
  getClaudeSettings: createInvoker<ClaudeSettings>('settings:get'),
  getSkills: createInvoker<SkillInfo[]>('skills:get'),

  // Data source
  getDataSource, setDataSource, exportData, importData, clearImport,

  // Push events (cleanup 함수 반환)
  onDataChanged: (callback) => { ... return () => ipcRenderer.off(...) },
  onLiveAgentEvent: (callback) => { ... return () => ipcRenderer.off(...) },

  // Character/wall sprites
  getCharacterSprites, getWallSprites,

  // Live watching
  getActiveAgents, startLiveWatching, stopLiveWatching,

  // Plugin
  checkPluginInstalled, installPlugin, uninstallPlugin,
};
```

## 서비스 레이어 (`apps/studio/src/main/services/`)

| 파일 | 역할 |
|------|------|
| `file-watcher.ts` | `~/.claude/projects/` fs.watch → `data-changed` IPC broadcast |
| `live-watcher.ts` | JSONL 실시간 추적 + `processHookEvent()` 에이전트 상태 관리 |
| `hook-server.ts` | Unix socket `~/.claude/studio.sock` — Claude Code hook 수신 |
| `transcript-parser.ts` | JSONL 한 줄 → `LiveAgentEvent` 변환 |
| `timer-manager.ts` | 8초 permission 타이머 관리 |
| `character-loader.ts` | PNG 스프라이트 파일 파싱 → hex 배열 |
| `plugin-installer.ts` | Claude Code 플러그인 설치/제거 |
| `live-types.ts` | 에이전트 관련 타입 정의 |

## IPC 핸들러 파일 (`apps/studio/src/main/ipc/`)

| 파일 | 담당 채널 |
|------|----------|
| `stats.ipc.ts` | `stats:get`, `costs:get` |
| `projects.ipc.ts` | `projects:get` |
| `data-source.ipc.ts` | `data-source:*`, `data:*` |
| `settings.ipc.ts` | `settings:get`, `skills:get` |
| `live.ipc.ts` | `live:*`, `assets:*` |
| `plugin.ipc.ts` | `plugin:*` |

## 에이전트 라이프사이클

```
JSONL 변경 or Hook 수신
    │
    ▼
transcript-parser.ts → LiveAgentEvent
    │
    ▼
live-watcher.ts 상태 관리:
  spawn (agentCreated)
    → working (agentWorking) — 60초 idle 타이머 리셋
    → permission (agentPermissionRequest) — 8초 타이머
    → idle (agentIdle) — wander 모드
    → despawn (agentClosed or 60초 idle 만료)
    │
    ▼
IPC push 'live:agent-event'
    │
    ▼
Renderer → use-pixel-messages.ts → OfficeState
```

**1디렉토리 1에이전트**: `dirToAgentId: Map<string, number>` — 동일 프로젝트 디렉토리의 이벤트는 같은 에이전트에 라우팅.

**이중 감시**: JSONL `fs.watch` + Hook server가 idempotent하게 공존. 둘 중 하나만 있어도 동작.
