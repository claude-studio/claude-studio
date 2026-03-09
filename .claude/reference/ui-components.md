# UI 컴포넌트

`packages/ui` 패키지. 소비자: `import { X } from '@repo/ui'`

## 코딩 규칙

- **라우터 의존 금지** — `packages/ui`에서 `@tanstack/react-router`의 `Link`, `useNavigate`, `useRouterState` 등을 직접 import하지 않는다. TanStack Router의 `Register` 타입은 앱별로 전역 주입되므로, 공유 패키지에서 사용하면 다른 앱의 typecheck에서 routeTree 충돌이 발생한다.
- **라우터 의존 컴포넌트는 앱 내부에 작성** — `Link`를 사용하는 페이지·위젯은 `apps/studio/src/renderer/src/pages/` 또는 `widgets/`에 FSD 구조로 작성한다.
- **packages/ui는 프리미티브 전용** — shadcn 컴포넌트, 차트, 훅(useStats, useProjects 등), 유틸(cn, CostDisplay)만 export한다.

## Pages

`packages/ui`에서 Page 컴포넌트는 export하지 않는다. 페이지는 앱 내부에 작성:

| 위치                                               | 페이지                          |
| -------------------------------------------------- | ------------------------------- |
| `apps/studio/src/renderer/src/pages/overview/`     | OverviewPage                    |
| `apps/studio/src/renderer/src/pages/costs/`        | CostsPage                       |
| `apps/studio/src/renderer/src/pages/projects/`     | ProjectsPage, ProjectDetailPage |
| `apps/studio/src/renderer/src/pages/skills/`       | SkillsPage                      |
| `apps/studio/src/renderer/src/pages/data/`         | DataPage                        |
| `apps/studio/src/renderer/src/pages/live-page.tsx` | `LivePage`                      |

## Layout (`packages/ui/src/layout/`)

### `AppSidebar`

studio 앱 내부에 위치: `apps/studio/src/renderer/src/widgets/app-sidebar/index.tsx`

- `@repo/ui`의 shadcn Sidebar 프리미티브 사용
- `@tanstack/react-router`의 `Link`로 네비게이션 (studio 전용)

### `StatCard`

```ts
interface StatCardProps {
  title: string;
  value: ReactNode;
  description?: string;
  trend?: { value: number; label: string };
  className?: string;
  featured?: boolean; // 좌측 primary accent bar
}
```

### `CostDisplay`

- `{ cost: number, className? }` — KRW + USD 두 줄 표시

## Charts (`packages/ui/src/charts/`)

| 컴포넌트                | 파일                     | 차트 종류          | 주요 Props                             |
| ----------------------- | ------------------------ | ------------------ | -------------------------------------- |
| `ActivityHeatmap`       | `activity-heatmap.tsx`   | 커스텀 DOM         | `activityData: {date, count}[]`        |
| `CacheStatsCard`        | `cache-stats.tsx`        | 텍스트 카드        | `data: CacheStats`                     |
| `ClaudeLifetimeCard`    | `claude-lifetime.tsx`    | 텍스트 카드        | `lifetime: ClaudeLifetime`             |
| `ConversationStatsCard` | `conversation-stats.tsx` | 텍스트 카드        | `conversationStats: ConversationStats` |
| `CostChart`             | `cost-chart.tsx`         | Recharts AreaChart | `dailyUsage: DailyUsage[]`             |
| `ModelBreakdown`        | `model-breakdown.tsx`    | Recharts PieChart  | `modelBreakdown: ModelUsage[]`         |
| `PeakHours`             | `peak-hours.tsx`         | Recharts BarChart  | `peakHours: PeakHour[]`                |
| `ProjectCostChart`      | `project-cost-chart.tsx` | Recharts BarChart  | `data: ProjectCostItem[]`              |
| `ToolUsageChart`        | `tool-usage.tsx`         | Recharts BarChart  | `toolUsage: ToolUsageItem[]`           |
| `UsageOverTime`         | `usage-over-time.tsx`    | Recharts AreaChart | `dailyUsage: DailyUsage[]`             |

## Hooks (`packages/ui/src/hooks/`)

### `use-data.tsx` — TanStack Query 훅

```ts
// 모두 DataProviderWrapper Context에 의존
useStats(): UseQueryResult<DashboardStats>
useProjects(): UseQueryResult<ProjectInfo[]>
```

공통 설정: `staleTime: 30_000`, `placeholderData: keepPreviousData`

> **참고**: `useProjectSessions`, `useSessions`, `useSessionDetail`도 `use-data.tsx`에 정의되어 있으나 `index.ts`에서 export하지 않음. 앱 내부에서 직접 import하여 사용.

```ts
// Provider 주입
export function DataProviderWrapper({ provider, children }) { ... }
```

### `use-theme.tsx`

```ts
useTheme(): { theme: 'dark'|'light', toggle: () => void, toggleRef: React.RefObject<HTMLButtonElement | null> }
```

- `ThemeProvider` 래핑 필요
- `localStorage.setItem('theme', ...)` 지속
- View Transition API 활용 (미지원 시 fallback)

### `use-mobile.ts`

```ts
useIsMobile(): boolean  // matchMedia('(max-width: 767px)')
```

## shadcn/ui 컴포넌트 (`packages/ui/src/components/ui/`)

Accordion, Badge, Button, Card(+Header/Title/Content/Footer/Description), Dialog, DropdownMenu, Input, Particles, Progress, ScrollArea, Select, Separator, Sheet, Sidebar, Skeleton, Table, Tabs, Tooltip

> **참고**: 위는 `packages/ui/src/components/ui/`에 존재하는 전체 목록이다. 이 중 barrel export(`index.ts`)되는 것은 아래 Export 패턴 섹션 참조.

## Export 패턴

```ts
// packages/ui/src/index.ts — barrel export
// 유틸: cn
// shadcn: Badge, Button, Card, Dialog, DropdownMenu, Input, Particles, ScrollArea, Sidebar*, Tabs, Tooltip
// 레이아웃: StatCard, CostDisplay
// 차트: ActivityHeatmap, CacheStatsCard, CostChart, ModelBreakdown, PeakHours, ProjectCostChart, ToolUsageChart, UsageOverTime, ...
// 훅: DataProviderWrapper, useStats, useProjects, ThemeProvider, useTheme, useSidebar
// ❌ AppSidebar, OverviewPage, CostsPage 등 Page 컴포넌트는 export하지 않음
```

CSS는 별도 import 필요:

```ts
import '@repo/ui/globals.css';
```
