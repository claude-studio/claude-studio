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
  totalCost: number;
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  totalSessions: number;
  totalProjects: number;
  totalMessages: number;
  totalToolCalls: number;
  modelBreakdown: ModelUsage[];
  dailyUsage: DailyUsage[]; // YYYY-MM-DD 배열
  peakHours: PeakHour[]; // hour(0-23), messages, sessions
  recentSessions: SessionInfo[];
  activityData: { date: string; count: number }[];
  cacheStats: CacheStats;
  toolUsage: ToolUsageItem[];
  conversationStats: ConversationStats;
  lifetime?: ClaudeLifetime;
};

// 세션 요약
type SessionInfo = {
  id: string;
  projectPath: string;
  projectName: string;
  startTime: Date;
  lastTime: Date;
  duration: number; // ms
  messageCount: number;
  toolCallCount: number;
  cost: number;
  inputTokens: number;
  outputTokens: number;
  models: string[];
};

// 세션 상세 (messages 포함)
type SessionDetail = SessionInfo & {
  messages: Message[];
  modelBreakdown: ModelUsage[];
};

// 프로젝트 집계
type ProjectInfo = {
  id: string;
  path: string;
  name: string;
  sessionCount: number;
  totalCost: number;
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  messageCount: number;
  toolCallCount: number;
  lastActivity: Date;
  models: string[];
};

// Claude 설정 (settings.json)
type ClaudeSettings = {
  model?: string;
  enabledPlugins?: Record<string, boolean>;
  permissions?: { defaultMode?: string; allow?: string[] };
};

// 스킬 (SKILL.md 파싱)
type SkillInfo = {
  name: string;
  description: string;
  userInvocable: boolean;
  body: string;
};
```

## claude-reader.ts

`packages/shared/src/shared/api/claude-reader.ts`

### 캐시

```ts
const CACHE_TTL = 30_000; // 30초
const cache = new Map<string, CacheEntry<unknown>>();

// DataChangeSource = 'projects' | 'teams'
// 선택적 무효화
clearCache(scope?: DataChangeSource)
// scope='projects': stats/sessions/projects 캐시만 삭제
// scope='teams': teams 캐시만 삭제
// scope 없음: 전체 삭제
```

캐시 키: `'stats'`, `'projects'`, `'sessions'`, `'session:{sessionId}'`, `'raw:{projectsDir}'`, `'filepath:{sessionId}'`

### 주요 함수

모든 함수는 **동기 함수** (내부 메모리 캐시 기반, `Promise` 반환 없음):

```ts
getClaudeDir(): string    // ~/.claude
getProjectsDir(): string  // ~/.claude/projects

// 데이터 읽기 (캐시 → 파일시스템)
getSessions(claudeDir?: string): SessionInfo[]
getSessionDetail(id: string): SessionDetail
getProjects(): ProjectInfo[]
getDashboardStats(): DashboardStats
getClaudeSettings(): ClaudeSettings
getSkills(): SkillInfo[]
searchSessions(query: string, claudeDir?: string): SessionInfo[]  // 프로젝트명·경로·ID 대소문자 무시 검색
```

### JSONL 파싱 로직

1. `~/.claude/projects/` 하위 디렉토리 재귀 탐색
2. 각 디렉토리의 `*.jsonl` 파일 파싱 (한 줄 = 하나의 메시지)
3. 비용 계산: `costUSD` 필드 우선 → 없으면 `pricing.ts`의 `calculateCost()` 사용

## DataProvider 인터페이스

`packages/shared/src/shared/types/data-source.ts`

```ts
interface DataProvider {
  getStats(): Promise<DashboardStats>;
  getCostAnalysis(): Promise<DashboardStats>;
  getProjects(): Promise<ProjectInfo[]>;
  getDataSource(): Promise<DataSource>;
  setDataSource(source: DataSource): Promise<void>;
  exportData(): Promise<Uint8Array>;
  importData(data: Uint8Array): Promise<void>;
  clearImport(): Promise<void>;
}
```

> `getProjectSessions`, `getSessions`, `getSessionDetail`은 DataProvider 인터페이스에 포함되지 않지만, `use-data.tsx` 훅에서 `useDataProvider()` context를 통해 DataProvider 확장 접근자로 호출한다.

### 구현체

**electronProvider** (Electron 앱용):

```ts
// window.electronAPI IPC invoke 래퍼
const electronProvider: DataProvider = {
  getStats: () => window.electronAPI.getStats(),
  getProjects: () => window.electronAPI.getProjects(),
  // ...
};
```

**httpProvider** (웹 앱용):

```ts
// fetch('/api/stats') 등 REST 호출
```

### DataProviderWrapper 사용

`DataProviderWrapper`는 `packages/ui/src/hooks/use-data.tsx`에서 정의·export되며, `query-provider.tsx`에서 import하여 사용한다.

```tsx
// apps/studio/src/renderer/src/providers/query-provider.tsx
<QueryClientProvider client={queryClient}>
  <DataProviderWrapper provider={electronProvider}>
    <ThemeProvider>
      <DataChangedListener />
      {children}
    </ThemeProvider>
  </DataProviderWrapper>
</QueryClientProvider>
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

`packages/shared/src/shared/lib/format.ts`

```ts
// USD_TO_KRW = 1380 상수 사용
formatCost(usd: number): string          // KRW 변환 (₩1,234)
formatCostUsd(usd: number): string       // $0.0123
formatCostKrw(usd: number): string       // ₩1,234 (KRW만)
formatTokens(n: number): string          // 1.2K, 3.4M
formatNumber(n: number): string          // 약어 (1.0K, 3.4M)
formatDuration(ms: number): string       // Nd Nh / Nh Nm / Nm Ns / Ns (영문 약어)
formatDate(date: Date | string): string  // ko-KR locale (예: 2026년 3월 10일)
formatDateShort(date: Date | string): string  // ko-KR locale (예: 3월 10일)
timeAgo(date: Date | string): string     // N분 전, N시간 전
```
