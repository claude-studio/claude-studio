# 데이터 레이어

## 코딩 규칙

- TanStack Query v5: `placeholderData: keepPreviousData` 사용 (v4의 `keepPreviousData` 옵션 X)
- `staleTime: 30_000` 기본값 유지
- 새 훅 추가 시 `packages/ui/src/hooks/use-data.tsx`에 `useQuery` 래퍼로 작성
- 타입 추가 시 Zod 스키마 먼저 작성 후 `z.infer<>` 로 타입 추출
- `claude-reader.ts` 직접 수정 시 캐시 키 일관성 유지 (`clearCache` 스코프 확인)

---

## @repo/shared 구조

FSD(Feature-Sliced Design) 유사 패턴:

```
packages/shared/src/
├── entities/
│   ├── project/     # ProjectInfo 관련
│   ├── session/     # SessionInfo 관련
│   └── stats/       # DashboardStats 관련
├── features/
│   ├── cost-analysis/   # 비용 분석 로직
│   ├── export-data/     # 데이터 내보내기
│   └── search-sessions/ # 세션 검색
└── shared/
    ├── api/
    │   ├── claude-reader.ts  # JSONL 파싱 핵심 로직
    │   └── data-source.ts    # 활성 데이터 소스 관리
    ├── config/
    │   └── pricing.ts        # 모델별 토큰 단가
    ├── lib/
    │   ├── format.ts         # 날짜/숫자/토큰 포맷 유틸
    │   └── index.ts
    └── types/
        └── index.ts          # Zod 스키마 + TypeScript 타입
```

## 핵심 타입 (`shared/types/index.ts`)

모두 Zod 스키마로 정의 후 `z.infer<>` 타입 추출.

```ts
// 전체 대시보드 집계
type DashboardStats = {
  totalCost: number; totalTokens: number;
  inputTokens: number; outputTokens: number;
  totalSessions: number; totalProjects: number;
  totalMessages: number; totalToolCalls: number;
  modelBreakdown: ModelUsage[];
  dailyUsage: DailyUsage[];     // YYYY-MM-DD 배열
  peakHours: PeakHour[];        // hour(0-23), messages, sessions
  recentSessions: SessionInfo[];
  activityData: { date: string; count: number }[];
  cacheStats: CacheStats;
  toolUsage: ToolUsageItem[];
  conversationStats: ConversationStats;
  lifetime?: ClaudeLifetime;
}

// 세션 요약
type SessionInfo = {
  id: string; projectPath: string; projectName: string;
  startTime: Date; lastTime: Date; duration: number; // ms
  messageCount: number; toolCallCount: number;
  cost: number; inputTokens: number; outputTokens: number;
  models: string[];
}

// 세션 상세 (messages 포함)
type SessionDetail = SessionInfo & {
  messages: Message[];
  modelBreakdown: ModelUsage[];
}

// 프로젝트 집계
type ProjectInfo = {
  id: string; path: string; name: string;
  sessionCount: number; totalCost: number;
  totalTokens: number; inputTokens: number; outputTokens: number;
  messageCount: number; toolCallCount: number;
  lastActivity: Date; models: string[];
}

// Claude 설정 (settings.json)
type ClaudeSettings = {
  model?: string;
  enabledPlugins?: Record<string, boolean>;
  permissions?: { defaultMode?: string; allow?: string[] };
}

// 스킬 (SKILL.md 파싱)
type SkillInfo = {
  name: string; description: string;
  userInvocable: boolean; body: string;
}
```

## claude-reader.ts

`packages/shared/src/shared/api/claude-reader.ts`

### 캐시

```ts
const CACHE_TTL = 30_000; // 30초
const cache = new Map<string, CacheEntry<unknown>>();

// 선택적 무효화
clearCache(scope?: DataChangeSource)
// scope='projects': stats/sessions/projects 캐시만 삭제
// scope 없음: 전체 삭제
```

캐시 키: `'stats'`, `'projects'`, `'sessions'`, `'session:{id}'`, `'raw:{filepath}'`, `'filepath:{projectPath}'`

### 주요 함수

```ts
getClaudeDir(): string    // ~/.claude
getProjectsDir(): string  // ~/.claude/projects

// 데이터 읽기 (캐시 → 파일시스템)
getSessions(limit?: number): Promise<SessionInfo[]>
getSessionDetail(id: string): Promise<SessionDetail>
getProjects(): Promise<ProjectInfo[]>
getDashboardStats(): Promise<DashboardStats>
getClaudeSettings(): Promise<ClaudeSettings>
getSkills(): Promise<SkillInfo[]>
```

### JSONL 파싱 로직

1. `~/.claude/projects/` 하위 디렉토리 재귀 탐색
2. 각 디렉토리의 `*.jsonl` 파일 파싱 (한 줄 = 하나의 메시지)
3. 비용 계산: `costUSD` 필드 우선 → 없으면 `pricing.ts`의 `calculateCost()` 사용

## DataProvider 인터페이스

```ts
interface DataProvider {
  getStats(): Promise<DashboardStats>;
  getProjects(): Promise<ProjectInfo[]>;
  getProjectSessions(id: string): Promise<SessionInfo[]>;
  getSessions(limit?: number): Promise<SessionInfo[]>;
  getSessionDetail(id: string): Promise<SessionDetail>;
}
```

### 구현체

**electronProvider** (Electron 앱용):
```ts
// window.electronAPI IPC invoke 래퍼
const electronProvider: DataProvider = {
  getStats: () => window.electronAPI.getStats(),
  getProjects: () => window.electronAPI.getProjects(),
  // ...
}
```

**httpProvider** (웹 앱용):
```ts
// fetch('/api/stats') 등 REST 호출
```

### DataProviderWrapper 사용

```tsx
// apps/studio/src/renderer/src/main.tsx
<DataProviderWrapper provider={electronProvider}>
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
</DataProviderWrapper>
```

## pricing.ts

`packages/shared/src/shared/config/pricing.ts`

```ts
const MODEL_PRICING: Record<string, ModelPricing> = {
  'claude-opus-4-6':          { input: 15,   output: 75   },
  'claude-sonnet-4-6':        { input: 3,    output: 15   },
  'claude-haiku-4-5':         { input: 0.8,  output: 4    },
  'claude-3-5-sonnet-20241022': { input: 3,  output: 15   },
  // ... (단위: $/M tokens)
}

// 폴백: prefix 매칭 → 패밀리 매칭 → 기본값(3/15)
getPricing(model: string): ModelPricing
calculateCost(model: string, inputTokens: number, outputTokens: number): number
```

> 캐시 읽기 토큰은 별도 계산하지 않음 (입력 가격의 10% 수준).

## format.ts

```ts
formatCost(usd: number): string      // KRW 변환 (₩1,234)
formatCostUsd(usd: number): string   // $0.0123
formatTokens(n: number): string      // 1.2K, 3.4M
formatNumber(n: number): string      // 천 단위 콤마
formatDateShort(d: string): string   // MM/DD
timeAgo(d: Date): string             // N분 전, N시간 전
```
