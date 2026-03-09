# UI 컴포넌트

`packages/ui` 패키지. 소비자: `import { X } from '@repo/ui'`

## Pages (`packages/ui/src/pages/`)

| 컴포넌트 | 파일 | Props | 데이터 소스 |
|---------|------|-------|-----------|
| `OverviewPage` | `overview-page.tsx` | 없음 | 내부 `useStats()` |
| `CostsPage` | `costs-page.tsx` | 없음 | 내부 `useStats()` + `useProjects()` |
| `ProjectsPage` | `projects-page.tsx` | 없음 | 내부 `useProjects()` |
| `ProjectDetailPage` | `project-detail-page.tsx` | `{ id: string }` | 내부 `useProjectSessions(id)` |
| `SkillsPage` | `skills-page.tsx` | `{ skills, isLoading, isError }` | 라우트에서 props 전달 |
| `DataPage` | `data-page.tsx` | `{ settings, pluginInstalled?, pluginLoading?, onInstallPlugin?, onUninstallPlugin? }` | 라우트에서 props 전달 |

**헬퍼**:
- `CostValue` — `{ cost: number, className? }` — KRW + USD 표시
- `PageSpinner` — 로딩 스피너

## Layout (`packages/ui/src/layout/`)

### `AppSidebar`
- `collapsible="icon"` 방식 (shadcn Sidebar 프리미티브)
- `useSidebar()` 훅으로 open 상태 접근
- NavItem 목록: 개요(`/`), 비용(`/costs`), 프로젝트(`/projects`), 스킬(`/skills`), 라이브(`/live`), 설정(`/data`)
- 하단: 테마 토글 버튼 (`toggleRef` 로 위치 계산)

### `StatCard`
```ts
interface StatCardProps {
  title: string;
  value: string | ReactNode;
  description?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  className?: string;
  featured?: boolean;  // 좌측 primary accent bar
}
```

### `CostDisplay`
- `{ cost: number, className? }` — KRW + USD 두 줄 표시

## Charts (`packages/ui/src/charts/`)

| 컴포넌트 | 파일 | 차트 종류 | 주요 Props |
|---------|------|---------|-----------|
| `ActivityHeatmap` | `activity-heatmap.tsx` | 커스텀 DOM | `activityData: {date, count}[]` |
| `CacheStatsCard` | `cache-stats.tsx` | 텍스트 카드 | `cacheStats: CacheStats` |
| `ClaudeLifetimeCard` | `claude-lifetime.tsx` | 텍스트 카드 | `lifetime: ClaudeLifetime` |
| `ConversationStatsCard` | `conversation-stats.tsx` | 텍스트 카드 | `conversationStats: ConversationStats` |
| `CostChart` | `cost-chart.tsx` | Recharts AreaChart | `dailyUsage: DailyUsage[]` |
| `ModelBreakdown` | `model-breakdown.tsx` | Recharts PieChart | `modelBreakdown: ModelUsage[]` |
| `PeakHours` | `peak-hours.tsx` | Recharts BarChart | `peakHours: PeakHour[]` |
| `ProjectCostChart` | `project-cost-chart.tsx` | Recharts BarChart | `projects: ProjectInfo[]` |
| `ToolUsageChart` | `tool-usage.tsx` | Recharts BarChart | `toolUsage: ToolUsageItem[]` |
| `UsageOverTime` | `usage-over-time.tsx` | Recharts AreaChart | `dailyUsage: DailyUsage[]` |

## Hooks (`packages/ui/src/hooks/`)

### `use-data.tsx` — TanStack Query 훅

```ts
// 모두 DataProviderWrapper Context에 의존
useStats(): UseQueryResult<DashboardStats>
useProjects(): UseQueryResult<ProjectInfo[]>
useProjectSessions(id: string): UseQueryResult<SessionInfo[]>
useSessions(limit?: number): UseQueryResult<SessionInfo[]>
useSessionDetail(id: string): UseQueryResult<SessionDetail>
```

공통 설정: `staleTime: 30_000`, `placeholderData: keepPreviousData`

```ts
// Provider 주입
export function DataProviderWrapper({ provider, children }) { ... }
```

### `use-theme.tsx`
```ts
useTheme(): { theme: 'dark'|'light', toggle: () => void, toggleRef: RefObject<HTMLButtonElement> }
```
- `ThemeProvider` 래핑 필요
- `localStorage.setItem('theme', ...)` 지속
- View Transition API 활용 (미지원 시 fallback)

### `use-is-mobile.tsx`
```ts
useIsMobile(): boolean  // matchMedia('(max-width: 767px)')
```

## shadcn/ui 컴포넌트 (`packages/ui/src/components/ui/`)

Badge, Button, Card(+Header/Title/Content/Footer/Description), Dialog, DropdownMenu, Input, Particles, ScrollArea, Sidebar, Tabs, Tooltip

## Export 패턴

```ts
// packages/ui/src/index.ts — barrel export
export { OverviewPage, CostsPage, ... } from './pages/index';
export { AppSidebar, StatCard, CostDisplay } from './layout/...';
export { ActivityHeatmap, CostChart, ... } from './charts/...';
export { DataProviderWrapper, useStats, useProjects } from './hooks/use-data';
export { ThemeProvider, useTheme } from './hooks/use-theme';
// shadcn 프리미티브
export { SidebarProvider, SidebarTrigger, SidebarInset } from './components/ui/sidebar';
```

CSS는 별도 import 필요:
```ts
import '@repo/ui/globals.css'
```
