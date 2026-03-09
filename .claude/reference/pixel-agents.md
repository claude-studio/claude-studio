# Pixel Agents

`packages/pixel-agents` — `/live` 라우트에서 실시간 에이전트를 픽셀아트 오피스로 시각화하는 Canvas 2D 엔진.

## 패키지 구조

```
packages/pixel-agents/src/
├── engine/
│   ├── characters.ts    # 캐릭터 이동, 애니메이션, 상태 머신
│   ├── game-loop.ts     # requestAnimationFrame 루프
│   ├── office-state.ts  # 에이전트 Map, 타일맵, 좌석 배정
│   └── renderer.ts      # Canvas 2D 렌더링 (타일→가구→캐릭터)
├── hooks/
│   └── use-pixel-messages.ts  # IPC 이벤트 → OfficeState 변환
├── components/          # React 컴포넌트
├── layout/              # 타일맵/가구 레이아웃 직렬화
├── sprites/             # sprite-cache.ts (Canvas 캐시)
├── colorize.ts          # 스프라이트 색상화
├── constants.ts         # 타이머, 팔레트 상수
├── floor-tiles.ts       # 바닥 타일 정의
├── messages.ts          # 메시지 타입
├── tool-utils.ts        # 도구 이름 매핑
├── types.ts             # 핵심 타입 (Character, Seat, FurnitureInstance 등)
└── wall-tiles.ts        # 벽 타일 bitmask 정의
```

## 엔진 구조

### `office-state.ts` — OfficeState 클래스

```ts
class OfficeState {
  layout: OfficeLayout;
  tileMap: TileType[][];
  seats: Map<string, Seat>;
  blockedTiles: Set<string>;
  furniture: FurnitureInstance[];
  walkableTiles: { col, row }[];
  characters: Map<number, Character>;  // agentId → Character

  // 서브에이전트 추적
  subagentIdMap: Map<string, number>;  // dirKey → 내부 id
  subagentMeta: Map<number, { parentAgentId, parentToolId }>;

  selectedAgentId: number | null;
  hoveredAgentId: number | null;
}
```

**1디렉토리 1에이전트 제약**: `subagentIdMap`으로 동일 프로젝트 디렉토리의 이벤트를 같은 에이전트에 라우팅.

### `game-loop.ts` — 게임 루프

```ts
// requestAnimationFrame 기반
function gameLoop(state: OfficeState, canvas: HTMLCanvasElement) {
  // delta time 계산
  update(state, dt);   // characters.ts
  render(state, ctx);  // renderer.ts
  requestAnimationFrame(...)
}
```

### `renderer.ts` — 렌더링 레이어 순서

1. **타일맵** — Wall/Floor/Void (bitmask 벽 타일)
2. **가구** — desk, bookshelf, plant, cooler, whiteboard, chair, pc, lamp
3. **캐릭터** — 스프라이트 + 말풍선 + matrix 이펙트

### `characters.ts` — 캐릭터 상태 머신

```ts
enum CharacterState {
  Spawning,   // matrix spawn 이펙트
  Walking,    // A* 경로 이동
  Sitting,    // 데스크 착석
  Typing,     // working 상태
  Idle,       // wander 모드
  Despawning, // matrix despawn 이펙트
}
```

이동: `findPath()` A* 경로 탐색 → 타일 단위 보간.

## 캐릭터 라이프사이클

```
agentCreated
  → spawn (matrix 이펙트) → Spawning
  → 좌석 배정 없으면 wander

agentWorking
  → 빈 좌석 배정 → Walking (좌석으로 이동)
  → 도착 → Sitting → Typing

agentToolStart
  → 말풍선에 도구 이름 표시

agentToolPermission (8초 타이머)
  → 말풍선에 물음표 이모지 표시

agentIdle
  → Idle → wander (랜덤 walkable 타일로 이동)

agentClosed or 60초 idle
  → Despawning (matrix 이펙트) → 제거
```

## 이벤트 매핑 (`use-pixel-messages.ts`)

IPC `live:agent-event` → OfficeState 업데이트:

| 이벤트 타입 | OfficeState 액션 |
|-----------|----------------|
| `agentCreated` | 캐릭터 생성 + matrix spawn 이펙트 |
| `agentWorking` | 좌석으로 이동 + Typing 상태 |
| `agentToolStart` | 도구 이름 말풍선 |
| `agentToolPermission` | 물음표 이모지 말풍선 |
| `agentIdle` | wander 모드 전환 |
| `agentClosed` | matrix despawn + 캐릭터 제거 |

## 타일맵

- **TileType**: `Wall`, `Floor`, `Void`
- **bitmask**: 인접 벽 방향에 따라 다른 벽 타일 자동 선택
- **A* 경로 탐색**: `findPath(from, to, tileMap, blockedTiles)`
- **walkableTiles**: `getWalkableTiles(tileMap, blockedTiles)` — wander 대상

## 가구 타입

`desk`, `bookshelf`, `plant`, `cooler`, `whiteboard`, `chair`, `pc`, `lamp`

좌석(`Seat`)이 있는 가구: `desk` — 에이전트 working 시 착석.

## 스프라이트 파이프라인

```
apps/studio/src/main/services/character-loader.ts
  PNG 파일 → hex 배열 파싱

IPC: assets:get-character-sprites, assets:get-wall-sprites

packages/pixel-agents/src/sprites/sprite-cache.ts
  hex 배열 → Canvas ImageData 캐시 (재사용)
```

## React 컴포넌트

### `OfficeCanvas`

- `ResizeObserver`로 컨테이너 크기 감지 → Canvas 자동 zoom
- `gameLoop` 시작/정지 (`useEffect` cleanup)
- `use-pixel-messages.ts` 구독 → OfficeState 업데이트
