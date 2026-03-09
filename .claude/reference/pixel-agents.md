# 픽셀 에이전트 라이브 시스템

`packages/pixel-agents` — `/live` 라우트에서 실시간 에이전트를 픽셀아트 오피스로 시각화하는 Canvas 2D 엔진.

## 코딩 규칙

1. **WALK 중 path 비우기 금지** — `setAgentActive(false)` 호출 시 `ch.state === WALK`이면 path 유지. 도착 후 `characters.ts`에서 상태 전환.
2. **WALK 중 tool null 금지** — `setAgentTool(null)` 호출 시 `ch.state === WALK`이면 스킵. 도착 이후 말풍선이 자연스럽게 해제됨.
3. **TYPE 상태는 isActive로 분기** — TYPE 상태에서 자동으로 IDLE 전환 없음. 스프라이트만 다름.
4. **스폰 시 lounge seat TYPE(inactive)** — `addAgent`는 항상 lounge seat에 `isActive=false`로 생성. `agentWorking` 이벤트까지 이동 없음.
5. **1디렉토리 N에이전트** — `dirToAgentIds`는 `Map<string, Set<number>>`. 같은 프로젝트 디렉토리에 복수 에이전트 허용.
6. **spawn 중 moveAgentToWork 지연** — `matrixEffect`가 활성이면 `pendingWork=true`로 기억. spawn 완료 후 자동 호출.
7. **코드 수정 시 이 문서의 관련 섹션도 함께 갱신** — 이 문서는 현재 코드의 truth.

---

## 파일 구조

```
packages/pixel-agents/src/
├── engine/
│   ├── characters.ts        # 캐릭터 이동·애니메이션·상태 머신
│   ├── game-loop.ts         # requestAnimationFrame 루프
│   ├── index.ts             # 엔진 모듈 re-export
│   ├── office-state.ts      # OfficeState 클래스 (에이전트 Map, 좌석 배정)
│   └── renderer.ts          # Canvas 2D 렌더링 (타일→가구→캐릭터)
├── hooks/
│   └── use-pixel-messages.ts  # PixelAgentEvent → OfficeState 변환
├── components/              # React 컴포넌트 (OfficeCanvas 등)
├── layout/
│   ├── index.ts             # 레이아웃 모듈 re-export
│   ├── layout-serializer.ts # OfficeLayout → tileMap/seats/furniture
│   └── tile-map.ts          # findPath(A*), getWalkableTiles, isWalkable
├── sprites/
│   ├── index.ts             # 스프라이트 모듈 re-export
│   ├── sprite-data.ts       # 팔레트·프레임 정의, CharacterSprites 타입
│   └── sprite-cache.ts      # Canvas ImageData 캐시
├── colorize.ts              # hueShift 적용
├── constants.ts             # 그리드·애니메이션·렌더링·팔레트 상수 (DEFAULT_COLS=20, DEFAULT_ROWS=11)
├── floor-tiles.ts           # 바닥 타일 정의
├── messages.ts              # PixelAgentEvent 유니온 타입
├── tool-utils.ts            # extractToolName()
├── types.ts                 # Character, Seat, FurnitureInstance 등 (DEFAULT_COLS=26, DEFAULT_ROWS=14 — 레거시 정의, constants.ts 값이 우선)
└── wall-tiles.ts            # 벽 타일 정의

apps/studio/src/main/services/
├── live-watcher.ts          # JSONL 감시 + Hook 수신 → emit('live:agent-event')
├── transcript-parser.ts     # JSONL 라인 파싱 → LiveAgentEvent
└── live-types.ts            # LiveAgentState, LiveAgentEvent 타입
```

---

## 상태 머신

### CharacterState × isActive 조합

| state  | isActive | 의미                    | 스프라이트                         |
| ------ | -------- | ----------------------- | ---------------------------------- |
| `TYPE` | `true`   | 작업 중 (타이핑/리딩)   | typing/reading frame 3~4 (workSeq) |
| `TYPE` | `false`  | 대기 중 (lounge 착석)   | idle frame 5~6 (idleSeq)           |
| `WALK` | `true`   | work seat으로 이동 중   | walk 0→1→2→1→0 루프                |
| `WALK` | `false`  | lounge seat으로 귀환 중 | walk 0→1→2→1→0 루프                |
| `IDLE` | 무관     | 회의실 서있기           | stand frame 1 (DOWN 고정)          |

### 상태 전이 다이어그램

```
addAgent()
  └─ [lounge seat] → TYPE(inactive)
       │
       ├─ agentWorking → moveAgentToWork()
       │    ├─ spawn 중: pendingWork=true (spawn 완료 후 자동 호출)
       │    └─ spawn 완료: isActive=true → WALK(active) → [work seat] → TYPE(active)
       │
       ├─ agentIdle / agentSessionEnd → returnAgentToSeat()
       │    └─ isActive=false → WALK(inactive) → [lounge seat] → TYPE(inactive)
       │
       ├─ agentToolsClear → setAgentActive(false)
       │    └─ WALK 중이면 path 유지, 아니면 즉시 TYPE(inactive)
       │
       └─ agentClosed → removeAllSubagents() → startDespawn()
            └─ matrixEffect='despawn' → [MATRIX_EFFECT_DURATION 후 Map에서 삭제]

WALK 도착 (path.length===0):
  isActive=true  → work seat 도착? TYPE(active) : 재탐색
  isActive=false → currentTool=null (말풍선 해제)
               → lounge seat 도착? TYPE(inactive) : IDLE
```

---

## 이벤트 흐름

### JSONL 감시 경로 (live-watcher.ts)

```
~/.claude/projects/<dir>/*.jsonl
  → fs.watch() 로 변경 감지
  → readNewLines() → processTranscriptLine() → emit('live:agent-event')
```

- 앱 시작 시 최근 10분 이내 수정된 JSONL 자동 스캔 (`SCAN_ACTIVE_WINDOW_MS = 600_000`, live-watcher.ts)
- 새 JSONL 파일 생성 시 dir watcher가 감지하여 file watcher 등록
- 60초 idle 후 자동 despawn (`IDLE_DESPAWN_MS = 60_000`, live-watcher.ts)

### Hook 서버 경로 (live-watcher.ts)

```
Claude Code hook event (Unix socket → net.createServer)
  → session_id → sessionToAgentId 매핑
  → emit('live:agent-event')
```

### transcript-parser 이벤트 매핑

| JSONL type / subtype                      | 생성되는 이벤트   |
| ----------------------------------------- | ----------------- |
| `assistant` (tool_use)                    | `agentToolStart`  |
| `user` (tool_result)                      | `agentToolDone`   |
| `system` + `subtype: 'turn_duration'`     | `agentIdle`       |
| `system` + `subtype: 'stop_hook_summary'` | `agentSessionEnd` |

> `agentCreated`는 transcript-parser가 아닌 `live-watcher.ts`의 `spawnAgent()`에서 직접 emit.

---

## 이벤트 → OfficeState 매핑

`use-pixel-messages.ts` — `processPixelAgentEvent(os, event)`:

| 이벤트                | OfficeState 호출                                                                                                            | 부수 효과                                |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `agentCreated`        | `os.addAgent(id, { folderName: shortId ?? folderName })`                                                                    | matrix spawn 이펙트, lounge seat 배정    |
| `agentClosed`         | `os.removeAllSubagents(id)` + `os.removeAgent(id)`                                                                          | matrix despawn 이펙트                    |
| `agentWorking`        | `os.moveAgentToWork(id)`                                                                                                    | isActive=true, WALK → work seat          |
| `agentIdle`           | `os.returnAgentToSeat(id)`                                                                                                  | isActive=false, WALK → lounge seat       |
| `agentSessionEnd`     | `os.returnAgentToSeat(id)`                                                                                                  | agentIdle과 동일 동작                    |
| `agentToolStart`      | `extractToolName(event.status)` → `os.setAgentTool(id, toolName)` + `os.clearPermissionBubble(id)`                          | status가 `Subtask:` 이면 `addSubagent()` |
| `agentToolDone`       | (no-op)                                                                                                                     | —                                        |
| `agentToolsClear`     | `os.setAgentTool(id, null)` + `os.clearPermissionBubble(id)` + `os.removeAllSubagents(id)` + `os.setAgentActive(id, false)` | sprite → idle frame                      |
| `agentToolPermission` | `os.showPermissionBubble(id)`                                                                                               | 말풍선 표시                              |

---

## 스프라이트 인덱스 매핑

### 외부 스프라이트 시트 (setCharacterTemplates)

각 방향(down/up/right)에 7프레임 제공, left는 right 좌우 미러:

| 프레임 인덱스 | 용도                | 시퀀스 이름     |
| ------------- | ------------------- | --------------- |
| 0             | 걷기A               | walkSeq         |
| 1             | 정면 서있기 (stand) | walkSeq + stand |
| 2             | 걷기B               | walkSeq         |
| 3             | 앉기 작업중 A       | workSeq         |
| 4             | 앉기 작업중 B       | workSeq         |
| 5             | 앉기 대기 A         | idleSeq         |
| 6             | 앉기 대기 B         | idleSeq         |

```ts
walkSeq = [frame0, frame1, frame2, frame1, frame0]; // 5-step loop
workSeq = [frame3, frame4]; // TYPE(active) → typing/reading
idleSeq = [frame5, frame6]; // TYPE(inactive) → idle sit
stand = frame1; // IDLE → stand DOWN
```

### getCharacterSprite 분기 (characters.ts)

```ts
TYPE + isActive=true  → isReadingTool(tool) ? sprites.reading[dir][frame%2]
                                             : sprites.typing[dir][frame%2]
TYPE + isActive=false → sprites.idle[dir][frame%2]
WALK                  → sprites.walk[dir][frame%5]
IDLE                  → sprites.stand[DOWN]
```

### READING_TOOLS (reading 스프라이트 적용 대상)

```ts
{
  ('Read', 'Grep', 'Glob', 'WebFetch', 'WebSearch');
}
```

---

## 에이전트 생성과 관리

### 식별자

| 식별자             | 설명                                       |
| ------------------ | ------------------------------------------ |
| `id` (양수)        | JSONL 파일 기반 에이전트 (`nextAgentId++`) |
| `id` (음수)        | 서브에이전트 (`nextSubagentId--`)          |
| `fileToAgentId`    | JSONL 경로 → agentId                       |
| `dirToAgentIds`    | 프로젝트 디렉토리 → `Set<agentId>`         |
| `sessionToAgentId` | hook session_id → agentId                  |

### 앱 시작 시 스캔

```
~/.claude/projects/ 하위 *.jsonl 중
  → mtime이 최근 10분 이내 → onNewFile() → agentCreated 이벤트
```

### Idle → Despawn

- `agentWorking` 없이 60초 경과 → `idleTimers` → `removeAgent()` → despawn

---

## 좌석 시스템

### work seat vs lounge seat

| 종류        | UID 접두사  | 용도                            |
| ----------- | ----------- | ------------------------------- |
| work seat   | `desk-*` 등 | 작업 중 착석 위치               |
| lounge seat | `lc-*`      | 대기 중 착석 위치 (회의실 구역) |

- `addAgent()` 시 work seat + lounge seat 동시 배정
- 스폰 위치 = lounge seat (또는 cols×0.8 중앙)
- `returnAgentToSeat()` → lounge seat으로 WALK
- lounge seat 없으면 `findFreeSeat(true)`로 재배정

### 경로 탐색

```ts
findPath(fromCol, fromRow, toCol, toRow, tileMap, blockedTiles);
// A* — blockedTiles에서 자기 자리(ownSeatKey)는 임시 제외 후 탐색
```

- 경로 없으면 즉시 `placeCharacterAtSeat()` (순간이동)
- WALK 중 목적지가 변경되면 매 프레임 lastStep 체크 후 재탐색

---

## 서브에이전트

- `agentToolStart` 이벤트의 `status.startsWith('Subtask:')` → `os.addSubagent(parentId, toolId)`
- `subagentIdMap`: `"parentId:toolId"` → 음수 id
- `subagentMeta`: 음수 id → `{ parentAgentId, parentToolId }`
- 팔레트·hueShift는 부모 에이전트와 동일
- `agentToolsClear` 또는 `agentClosed` → `removeAllSubagents()` → despawn

---

## 주요 상수

### `constants.ts` (packages/pixel-agents/src/constants.ts)

| 상수                          | 값    | 설명                      |
| ----------------------------- | ----- | ------------------------- |
| `TILE_SIZE`                   | 16 px | 타일 크기                 |
| `DEFAULT_COLS`                | 20    | 기본 맵 너비              |
| `DEFAULT_ROWS`                | 11    | 기본 맵 높이              |
| `WALK_SPEED_PX_PER_SEC`       | 48    | 이동 속도                 |
| `WALK_FRAME_DURATION_SEC`     | 0.12  | 걷기 프레임 간격          |
| `TYPE_FRAME_DURATION_SEC`     | 0.5   | 타이핑 프레임 간격        |
| `MATRIX_EFFECT_DURATION_SEC`  | 0.3   | spawn/despawn 이펙트 시간 |
| `WAITING_BUBBLE_DURATION_SEC` | 2     | waiting 말풍선 유지 시간  |
| `PALETTE_COUNT`               | 6     | 캐릭터 팔레트 수          |

### `live-watcher.ts` (apps/studio/src/main/services/live-watcher.ts)

| 상수                    | 값         | 설명                      |
| ----------------------- | ---------- | ------------------------- |
| `IDLE_DESPAWN_MS`       | 60_000 ms  | idle 후 despawn 대기 시간 |
| `SCAN_ACTIVE_WINDOW_MS` | 600_000 ms | 앱 시작 시 스캔 기준 시간 |
