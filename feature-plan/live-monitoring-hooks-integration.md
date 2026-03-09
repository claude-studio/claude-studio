# Live Monitoring 개선 계획: Hooks + Plugin 통합

> 검증 기준: Claude Code 공식 문서 (Context7 `/anthropics/claude-code`), wikidocs 훅 레퍼런스,
> 실제 설치된 플러그인 전수 분석 (claude-notifications-go, hookify, ralph-loop, security-guidance, learning-output-style),
> 실측 JSONL 파일 907개 (메인 세션 470개, 서브에이전트 437개)

---

## 1. 현재 아키텍처

```
Claude Code 실행
    │
    ▼ JSONL append
~/.claude/projects/{project}/{session}.jsonl
    │
    ▼ fs.watch (recursive)
live-watcher.ts
    │
    ▼ 라인 파싱
transcript-parser.ts
    │
    ▼ IPC emit
renderer (live-page.tsx)
```

### 관련 파일

| 파일 | 역할 |
|------|------|
| `live-watcher.ts` | 파일 감시, 에이전트 스폰/디스폰, 파일 오프셋 추적 |
| `transcript-parser.ts` | JSONL 레코드 파싱 → 이벤트 emit |
| `timer-manager.ts` | idle 타이머(60s), permission 타이머(8s) |
| `live-types.ts` | 에이전트 상태, 이벤트 타입 정의 |
| `live.ipc.ts` | IPC 핸들러 등록 |

---

## 2. JSONL 파일 구조 분석

### 2-1. 레코드 타입 분포 (실측 845개 기준)

| type | 역할 | 현재 처리 |
|------|------|---------|
| `assistant` | Claude 응답 (tool_use 포함) | ✅ 처리 |
| `user` | 유저 입력 / tool_result | ✅ 처리 |
| `system` | 세션 메타 (turn_duration, stop_hook_summary 등) | ✅ 처리 |
| `progress` | hook_progress, bash_progress | ✅ 일부 처리 |
| `file-history-snapshot` | 파일 변경 스냅샷 | ⬜ 무시 |
| `queue-operation` | 프롬프트 큐 enqueue/dequeue | ⬜ 무시 |
| `last-prompt` | 마지막 프롬프트 텍스트 기록 | ⬜ 무시 |

### 2-2. system 레코드 subtype 상세

| subtype | 의미 | 발생 조건 | JSONL 필드 |
|---------|------|---------|-----------|
| `turn_duration` | API 턴 완료 | Stop 훅이 없는 턴 | `durationMs`, `isMeta`, `timestamp` |
| `stop_hook_summary` | Stop 훅 실행 완료 | Stop 훅이 설치된 턴 | `hookCount`, `stopReason`, `preventedContinuation`, `hasOutput` |
| `compact_boundary` | 컨텍스트 압축 경계 | 자동 compact 발생 시 | `content: "Conversation compacted"` |
| `local_command` | 세션 시작 메타 | 세션 최초 레코드 | `sessionId`, `version`, `gitBranch` |

> **핵심**: `turn_duration`과 `stop_hook_summary`는 같은 턴에 동시에 발생하지 않는다.
> 실측 결과 — 14건 `turn_duration` + 29건 `stop_hook_summary`, 겹침 **0건**.
>
> **플러그인 Stop 훅 설치 후**: 모든 턴이 `stop_hook_summary`를 생성하게 되어
> `turn_duration`은 더 이상 발생하지 않는다. 두 이벤트가 교체 관계임.

### 2-3. progress 레코드 — hook_progress 분포

| data.hookEvent | 건수 | 포함 정보 |
|---------------|------|---------|
| `PostToolUse` | 125건 | `hookEvent`, `hookName`, `command` — **tool 정보 없음** |
| `Stop` | 58건 | `hookEvent`, `hookName`, `command` |
| `SessionStart` | 2건 | `hookEvent`, `hookName`, `command` |

> hook_progress는 훅 진행 상황을 기록하는 레코드이나
> **실제 도구 정보(tool_name, tool_input)를 포함하지 않는다.** 이벤트 감지에 활용 불가.

### 2-4. assistant 레코드 — stop_reason 분포

| stop_reason | 건수 | tool_use 포함 여부 |
|-------------|------|-----------------|
| `tool_use` | 139건 | 항상 있음 |
| `None` | 43건 (22%) | **있음** — 유효한 tool_use, tool_result 1:1 매핑 확인 |
| `end_turn` | 26건 | 없음 |

현재 파서는 `stop_reason` 무관하게 content 블록만 확인하므로 올바르게 처리된다.

### 2-5. tool_use → tool_result 매핑 정확도

- 전체 182개 tool_use ID: 중복 0, 누락 0, 매칭률 **100%**
- tool_use → tool_result 타임스탬프 간격: 중앙값 22ms, 최대 6.5초, 10초 초과 0건

### 2-6. 서브에이전트 파일 구조

```
~/.claude/projects/{project}/
├── {session-uuid}.jsonl              ← 메인 세션 (470개)
└── {session-uuid}/
    └── subagents/
        └── agent-a{id}.jsonl        ← 서브에이전트 (437개, 전체의 48%)
```

서브에이전트 파일 특징:
- 모든 레코드에 `isSidechain: true`
- `system` 레코드 없음 → `turn_duration`, `stop_hook_summary` 없음
- 메인 세션 JSONL과 완전히 다른 구조

---

## 3. 현재 버그 분석

### Bug A: `agentIdle` 후 idle 타이머 미시작 (좀비 에이전트)

**위치**: `live-watcher.ts` → `processFile` → `emitWithTimer`

```typescript
// 현재 코드
const emitWithTimer = (event: object) => {
  emit(event);
  const e = event as { type: string };
  if (e.type === 'agentWorking') {
    cancelIdleTimer(agentId);
  } else if (e.type === 'agentSessionEnd') {
    startIdleTimer(agentId);   // ← stop_hook_summary 있을 때만
  }
  // ❌ agentIdle (turn_duration) 케이스 없음
};
```

Stop 훅이 없는 환경에서는 `turn_duration` → `agentIdle`만 발생하고
idle 타이머가 시작되지 않아 에이전트가 영구 생존한다.

**수정**:

```typescript
} else if (e.type === 'agentIdle' || e.type === 'agentSessionEnd') {
  startIdleTimer(agentId);
}
```

---

### Bug B: 서브에이전트 파일이 phantom 에이전트로 스폰

**위치**: `live-watcher.ts` → `dirWatcher` (`recursive: true`) → `trySpawnFile`

1. `dirWatcher`가 `recursive: true`로 `~/.claude/projects/` 전체 감시
2. 서브에이전트 실행 시 `/subagents/agent-a*.jsonl` 파일 수정
3. `trySpawnFile()` 호출 → `/subagents/` 경로 필터 없음
4. `projectName = "subagents"` 인 유령 에이전트 스폰

**수정**:

```typescript
function trySpawnFile(filePath: string): void {
  if (!JSONL_PATTERN.test(filePath)) return;
  if (filePath.includes('/subagents/')) return;   // ← 추가
  // ...
}
```

---

### 구조적 한계: Permission 감지 불가

`PermissionRequest`에 대응하는 JSONL 레코드 타입이 존재하지 않는다.
현재 8초 타이머 휴리스틱으로만 추정 가능하며, JSONL 파싱으로는 해결 불가.

---

## 4. Claude Code Hooks 이벤트 분석

### 4-1. 이벤트 목록 및 플러그인 사용 가능 여부

wikidocs, Context7, 실제 설치 플러그인 전수조사를 교차 검증한 결과:

| 이벤트 | matcher | 플러그인 사용 | 실제 사용 예 |
|--------|---------|------------|------------|
| `SessionStart` | 옵션 (source 타입) | ✅ 확인 | learning-output-style, explanatory-output-style |
| `PreToolUse` | **필수** | ✅ 확인 | security-guidance, hookify, claude-notifications-go |
| `PostToolUse` | **필수** | ✅ 확인 | hookify |
| `Stop` | 옵션 | ✅ 확인 | ralph-loop, hookify, claude-notifications-go |
| `SubagentStop` | 옵션 | ✅ 확인 | claude-notifications-go |
| `UserPromptSubmit` | 없음 | ✅ 확인 | hookify |
| `Notification` | 필수 (matcher 타입) | ✅ 확인 | claude-notifications-go |
| `PermissionRequest` | — | ⚠️ 미확인 | wikidocs 기재, 플러그인 미사용 |
| `SubagentStart` | — | ⚠️ 미확인 | wikidocs 기재, 플러그인 미사용 |
| `SessionEnd` | — | ⚠️ 미확인 | Context7 기재, 플러그인 미사용 |
| `PreCompact` | 옵션 | ✅ Context7 확인 | — |
| `PostCompact` | 없음 | ✅ Context7 확인 | — |
| `TeammateIdle` | 없음 | ⚠️ wikidocs 기재 | — |
| `TaskCompleted` | 없음 | ⚠️ wikidocs 기재 | — |

> **⚠️ 미확인 이벤트**: wikidocs나 Context7 문서에는 기재되어 있으나,
> 실제 설치된 플러그인 어디에서도 hooks.json에 사용되지 않음.
> 구현 시 실증 테스트 필요.

### 4-2. matcher 필드 규칙 (실제 플러그인으로 검증)

| 이벤트 | matcher 필요 여부 | 값 예시 |
|--------|----------------|--------|
| `PreToolUse` | **필수** | `"Bash"`, `"Edit\|Write"`, `".*"` |
| `PostToolUse` | **필수** | `"Bash"`, `"Edit\|Write\|MultiEdit"`, `".*"` |
| `Notification` | **필수** | `"permission_prompt"`, `"idle_prompt"` |
| `SessionStart` | 옵션 | `"startup"`, `"compact"` (생략 시 전체) |
| `Stop` | 옵션 | 생략 가능 (전체 매칭) |
| `SubagentStop` | 옵션 | 생략 가능 (전체 매칭) |

### 4-3. 훅 입력 데이터 (stdin JSON) — wikidocs 기준

```json
// 공통 필드 (모든 이벤트)
{
  "session_id": "abc123",
  "transcript_path": "/path/to/session.jsonl",
  "cwd": "/current/working/dir",
  "permission_mode": "default",
  "hook_event_name": "PreToolUse",
  "agent_id": "agent-xxx",
  "agent_type": "main"
}

// SessionStart 추가 필드
{
  "source": "startup|resume|compact|clear",
  "model": "claude-sonnet-4-6"
}

// PreToolUse 추가 필드
{
  "tool_name": "Bash",
  "tool_input": { "command": "npm test" },
  "tool_use_id": "toolu_abc123"
}

// PostToolUse 추가 필드
{
  "tool_name": "Bash",
  "tool_input": { "command": "npm test" },
  "tool_output": "Tests passed",
  "tool_use_id": "toolu_abc123"
}

// Stop 추가 필드
{
  "stop_hook_active": false
}
```

---

## 5. 플러그인 방식으로 해결

### 5-1. 플러그인 시스템 구조

```
~/.claude/plugins/cache/{marketplace}/{plugin-name}/{version}/
├── .claude-plugin/
│   └── plugin.json        ← 플러그인 메타데이터
└── hooks/
    ├── hooks.json          ← 이벤트 훅 설정
    └── notify.sh           ← 이벤트를 Studio로 전달
```

플러그인 훅은 `~/.claude/settings.json`의 `hooks` 필드와 완전히 분리되어
**append 방식으로 병합**되므로 기존 유저 설정과 충돌하지 않는다.
(출처: Context7 — "Plugin hooks are designed to merge with user-defined hooks and run in parallel")

### 5-2. hooks.json 설계

실제 플러그인 패턴을 반영한 올바른 형식:

```json
{
  "description": "Claude Studio live monitoring hooks",
  "hooks": {
    "SessionStart": [
      {
        "hooks": [{
          "type": "command",
          "command": "sh ${CLAUDE_PLUGIN_ROOT}/hooks/notify.sh",
          "async": true
        }]
      }
    ],
    "PreToolUse": [
      {
        "matcher": ".*",
        "hooks": [{
          "type": "command",
          "command": "sh ${CLAUDE_PLUGIN_ROOT}/hooks/notify.sh",
          "async": true
        }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": ".*",
        "hooks": [{
          "type": "command",
          "command": "sh ${CLAUDE_PLUGIN_ROOT}/hooks/notify.sh",
          "async": true
        }]
      }
    ],
    "Stop": [
      {
        "hooks": [{
          "type": "command",
          "command": "sh ${CLAUDE_PLUGIN_ROOT}/hooks/notify.sh",
          "async": true
        }]
      }
    ],
    "SubagentStop": [
      {
        "hooks": [{
          "type": "command",
          "command": "sh ${CLAUDE_PLUGIN_ROOT}/hooks/notify.sh",
          "async": true
        }]
      }
    ]
  }
}
```

> **수정 사항**:
> - `PreToolUse`, `PostToolUse`에 `"matcher": ".*"` 추가 (필수 필드, 실증)
> - `PermissionRequest`, `SessionEnd` 제거 (플러그인 사용 미확인)
> - 전체 훅에 `"async": true` 적용 — Claude 실행 블로킹 없음
> - `hook_event_name`은 stdin에 이미 포함되어 별도 주입 불필요

### 5-3. notify.sh — Electron 소켓 브릿지

stdin으로 수신한 훅 JSON을 Unix 소켓으로 Electron 메인 프로세스에 전달:

```bash
#!/bin/sh
# notify.sh: Claude Code 훅 이벤트를 Claude Studio로 전달
# stdin: hook event JSON (hook_event_name 필드 포함)

SOCKET_PATH="$HOME/.claude/studio.sock"

# Studio 소켓이 없으면 무시 (Claude Studio 미실행 시)
if [ ! -S "$SOCKET_PATH" ]; then
  exit 0
fi

# stdin JSON을 소켓으로 전달 (hook_event_name은 이미 포함됨)
cat | nc -U "$SOCKET_PATH" -w 1 2>/dev/null || true
```

> **수정 사항**:
> - 기존 `jq` 를 통한 `studio_event` 주입 제거
> - `hook_event_name`이 stdin에 이미 포함되어 있어 불필요
> - `|| true` 로 소켓 전송 실패 시에도 Claude 블로킹 없음

### 5-4. Electron 메인 프로세스 — Unix 소켓 서버

```typescript
// apps/studio/src/main/services/hook-server.ts
import * as net from 'net'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

export const SOCKET_PATH = path.join(os.homedir(), '.claude', 'studio.sock')

export interface HookEvent {
  hook_event_name: string
  session_id: string
  transcript_path: string
  cwd: string
  tool_name?: string
  tool_input?: Record<string, unknown>
  tool_output?: string
  tool_use_id?: string
  source?: string
  model?: string
  stop_hook_active?: boolean
  agent_id?: string
  agent_type?: string
}

export function startHookServer(onEvent: (event: HookEvent) => void): net.Server {
  if (fs.existsSync(SOCKET_PATH)) fs.unlinkSync(SOCKET_PATH)

  const server = net.createServer((socket) => {
    let data = ''
    socket.on('data', (chunk) => { data += chunk })
    socket.on('end', () => {
      try {
        onEvent(JSON.parse(data) as HookEvent)
      } catch { /* malformed JSON 무시 */ }
    })
  })

  server.listen(SOCKET_PATH)
  return server
}

export function stopHookServer(server: net.Server): void {
  server.close()
  if (fs.existsSync(SOCKET_PATH)) fs.unlinkSync(SOCKET_PATH)
}
```

### 5-5. 훅 이벤트 처리 — live-watcher 통합

```typescript
// apps/studio/src/main/services/live-watcher.ts 추가 분

export function processHookEvent(event: HookEvent): void {
  const { hook_event_name, session_id, tool_name, tool_input, tool_use_id } = event

  switch (hook_event_name) {
    case 'SessionStart': {
      // mtime 기반 60초 추정 대신 session_id + transcript_path로 즉시 식별
      trySpawnFromHook(session_id, event.transcript_path, event.source, event.model)
      break
    }
    case 'PreToolUse': {
      // transcript 파싱과 동일한 결과 + tool_use_id 직접 수신
      if (tool_name && tool_use_id) {
        emitToolStart(session_id, tool_use_id, tool_name, tool_input ?? {})
      }
      break
    }
    case 'PostToolUse': {
      if (tool_use_id && tool_name) {
        emitToolDone(session_id, tool_use_id, tool_name)
      }
      break
    }
    case 'Stop':
    case 'SubagentStop': {
      // turn_duration + stop_hook_summary 모두 대체
      // Stop 훅 설치 후: 모든 턴이 stop_hook_summary 생성 → turn_duration 소멸
      emitIdle(session_id)
      startIdleTimer(session_id)
      break
    }
  }
}
```

---

## 6. 플러그인 설치 자동화

### 6-1. Electron 앱이 JSON 직접 조작으로 설치

CLI(`claude plugin install`)는 TTY 의존성으로 Electron에서 비동작.
JSON 파일 직접 조작 방식으로 우회:

```typescript
// apps/studio/src/main/services/plugin-installer.ts
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

const PLUGIN_NAME = 'claude-studio'
const PLUGIN_VERSION = '1.0.0'
const MARKETPLACE_ID = 'local'
const PLUGIN_KEY = `${PLUGIN_NAME}@${MARKETPLACE_ID}`

export function isPluginInstalled(): boolean {
  try {
    const installed = readInstalledPlugins()
    return PLUGIN_KEY in (installed.plugins ?? {})
  } catch {
    return false
  }
}

export function installPlugin(pluginSrcDir: string): void {
  const installPath = getInstallPath()

  // 1. 플러그인 파일 복사 (앱 번들 리소스 → 플러그인 캐시)
  fs.cpSync(pluginSrcDir, installPath, { recursive: true })

  // 2. installed_plugins.json 업데이트
  // 포맷: { version: 2, plugins: { "name@marketplace": [{ scope, installPath, version, ... }] } }
  const installed = readInstalledPlugins()
  installed.plugins[PLUGIN_KEY] = [{
    scope: 'user',
    installPath,
    version: PLUGIN_VERSION,
    installedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  }]
  writeInstalledPlugins(installed)

  // 3. settings.json enabledPlugins 추가 (기존 항목 보존)
  const settings = readSettings()
  settings.enabledPlugins = { ...settings.enabledPlugins, [PLUGIN_KEY]: true }
  writeSettings(settings)
}

export function uninstallPlugin(): void {
  const installPath = getInstallPath()
  fs.rmSync(installPath, { recursive: true, force: true })

  const installed = readInstalledPlugins()
  delete installed.plugins[PLUGIN_KEY]
  writeInstalledPlugins(installed)

  const settings = readSettings()
  delete settings.enabledPlugins?.[PLUGIN_KEY]
  writeSettings(settings)
}

// --- 헬퍼 ---

function getInstallPath(): string {
  return path.join(
    os.homedir(), '.claude', 'plugins', 'cache',
    MARKETPLACE_ID, PLUGIN_NAME, PLUGIN_VERSION,
  )
}

function readInstalledPlugins() {
  const p = path.join(os.homedir(), '.claude', 'plugins', 'installed_plugins.json')
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

function writeInstalledPlugins(data: unknown) {
  const p = path.join(os.homedir(), '.claude', 'plugins', 'installed_plugins.json')
  fs.writeFileSync(p, JSON.stringify(data, null, 2))
}

function readSettings() {
  const p = path.join(os.homedir(), '.claude', 'settings.json')
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

function writeSettings(data: unknown) {
  const p = path.join(os.homedir(), '.claude', 'settings.json')
  fs.writeFileSync(p, JSON.stringify(data, null, 2))
}
```

### 6-2. 온보딩 플로우

```
앱 첫 실행
    │
    ▼ isPluginInstalled()
    ├── true  → 소켓 서버 시작, 훅 이벤트 수신
    │
    └── false
          ↓
     온보딩 UI
     "라이브 모니터링 정확도 향상을 위해
      Claude Code 훅 플러그인을 설치합니다.
      ~/.claude/settings.json의 기존 설정은 변경되지 않습니다."
          ↓
     [설치] 클릭 → installPlugin()
          ↓
     "Claude Code를 재시작하면 활성화됩니다"
```

---

## 7. 개선 전후 비교

### 이벤트 감지 정확도

| 이벤트 | 현재 | 개선 후 |
|--------|------|--------|
| 세션 시작 | mtime 60초 임계값 추정 | `SessionStart` 훅 즉시 수신 (session_id, model, source 포함) |
| 도구 시작 | JSONL assistant 레코드 파싱 | `PreToolUse` 훅 즉시 수신 (tool_use_id 직접 수신) |
| 도구 완료 | JSONL user 레코드 파싱 | `PostToolUse` 훅 즉시 수신 |
| 턴 완료 | turn_duration 또는 stop_hook_summary 파싱 | `Stop` 훅 즉시 수신 (Stop 훅 설치 후 turn_duration 소멸) |
| 권한 요청 | 8초 타이머 휴리스틱 | `Notification(permission_prompt)` 훅 즉시 수신 (확인됨) |
| 서브에이전트 종료 | 미지원 | `SubagentStop` 훅 즉시 수신 |
| 서브에이전트 phantom | phantom 에이전트 오염 | `/subagents/` 경로 필터 + SubagentStop 훅 |

> **PermissionRequest 대안**: 실증 미확인인 `PermissionRequest` 훅 대신,
> 이미 실사용 중인 `Notification` 이벤트의 `"matcher": "permission_prompt"` 로
> 권한 요청을 정확하게 감지한다. (claude-notifications-go 플러그인에서 확인)

### 아키텍처 변화

| 항목 | 현재 | 개선 후 |
|------|------|--------|
| 데이터 소스 | 내부 파일 포맷 직접 파싱 | 공식 훅 이벤트 + JSONL 파싱 병행 |
| 이벤트 지연 | 파일 쓰기 + fs.watch 지연 | 훅 실행 즉시 (async: true, 블로킹 없음) |
| 서브에이전트 오염 | 발생 (경로 필터 없음) | 제거 (경로 필터 + SubagentStop 훅) |
| 유저 설정 충돌 | 없음 | 없음 (플러그인 훅은 분리 병합) |
| permission 감지 | 8초 타이머 | Notification 훅 즉시 |

---

## 8. 구현 우선순위

### Phase 1 — JSONL 파싱 버그 수정 (즉시)

1. `processFile`의 `emitWithTimer`에 `agentIdle` → `startIdleTimer()` 추가 (**Bug A**)
2. `trySpawnFile`에 `/subagents/` 경로 필터 추가 (**Bug B**)

### Phase 2 — 플러그인 기반 아키텍처

3. 플러그인 리소스 추가 (`apps/studio/src/main/plugin/`)
   - `.claude-plugin/plugin.json`
   - `hooks/hooks.json` (matcher 필드 포함 정확한 형식)
   - `hooks/notify.sh`
4. `plugin-installer.ts` 구현 (JSON 직접 조작)
5. `hook-server.ts` 구현 (Unix 소켓 서버)
6. `live-watcher.ts`에 `processHookEvent()` 통합
7. 온보딩 UI 추가

### Phase 3 — JSONL 파싱 정리

8. 훅으로 커버되는 이벤트에 대해 JSONL 파싱을 fallback으로 격하
   (훅 미설치 환경 대비 — JSONL 파싱 코드 유지, 훅 이벤트 우선 처리)
9. `stop_reason=None` assistant 레코드 처리 유지

---

## 9. 미검증 항목 (추가 실증 필요)

| 항목 | 상태 | 확인 방법 |
|------|------|---------|
| `PermissionRequest` 이벤트 플러그인 사용 | ⚠️ wikidocs 기재, 플러그인 미사용 | hooks.json에 등록 후 직접 테스트 |
| `SubagentStart` 이벤트 플러그인 사용 | ⚠️ wikidocs 기재, 플러그인 미사용 | hooks.json에 등록 후 직접 테스트 |
| `SessionEnd` 이벤트 플러그인 사용 | ⚠️ Context7 기재, 플러그인 미사용 | hooks.json에 등록 후 직접 테스트 |
| macOS에서 `nc -U` 가용성 | ✅ macOS 기본 탑재 | — |
| JSON 직접 조작 후 Claude Code 인식 | 구조 확인됨, 동작 미테스트 | 실제 설치/재시작 테스트 |

---

## 10. 참고

- Claude Code 훅 문서: Context7 `/anthropics/claude-code` (Hooks, Plugin Structure)
- wikidocs 훅 레퍼런스: 2026-03-05 업데이트 기준 이벤트 목록
- 실증 플러그인: `~/.claude/plugins/cache/claude-notifications-go/` (Stop, SubagentStop, Notification)
- 실증 플러그인: `~/.claude/plugins/marketplaces/claude-plugins-official/plugins/hookify/` (PreToolUse, PostToolUse, Stop, UserPromptSubmit)
- 실증 플러그인: `~/.claude/plugins/marketplaces/claude-plugins-official/plugins/learning-output-style/` (SessionStart, matcher 없음)
- JSONL 분석 파일: `~/.claude/projects/-Users-genie-Desktop-jb-claude-studio/1e84f417...jsonl` (845 레코드)
