# 라우팅

## TanStack Router

파일 기반 라우팅 (`createFileRoute`). `autoCodeSplitting: true` (Vite 플러그인에서 설정).

```
apps/studio/src/renderer/src/routes/
├── __root.tsx          # 루트 레이아웃
├── index.tsx           # /
├── costs.tsx           # /costs
├── skills.tsx          # /skills
├── data.tsx            # /data
├── live.tsx            # /live
└── projects/
    ├── index.tsx       # /projects
    └── $id.tsx         # /projects/:id
```

## 라우트 테이블

| 경로            | 파일                 | 페이지 컴포넌트     | 데이터 패칭 방식                      |
| --------------- | -------------------- | ------------------- | ------------------------------------- |
| `/`             | `index.tsx`          | `OverviewPage`      | 내부 훅 자급자족                      |
| `/costs`        | `costs.tsx`          | `CostsPage`         | 내부 훅 자급자족                      |
| `/projects`     | `projects/index.tsx` | `ProjectsPage`      | 내부 훅 자급자족                      |
| `/projects/$id` | `projects/$id.tsx`   | `ProjectDetailPage` | 내부 훅 자급자족                      |
| `/skills`       | `skills.tsx`         | `SkillsPage`        | 라우트 useQuery → props               |
| `/data`         | `data.tsx`           | `DataPage`          | 라우트 useQuery + useMutation → props |
| `/live`         | `live.tsx`           | `LivePage`          | Live 전용 이벤트 구독                 |

## 루트 레이아웃 (`__root.tsx`)

```tsx
function RootLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 h-svh overflow-hidden flex flex-col">
        <TopBar /> // SidebarTrigger + 페이지 타이틀
        <Particles /> // fixed, z-0, pointer-events-none
        <div className="relative z-10 flex-1 overflow-y-auto px-6 py-5">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
```

페이지 타이틀 매핑:

```ts
const PAGE_TITLES = {
  '/': '개요',
  '/projects': '프로젝트',
  '/costs': '비용',
  '/skills': '스킬',
  '/data': '설정',
  '/live': '라이브',
};
```

## 데이터 패칭 패턴

### 패턴 1: 내부 훅 자급자족 (OverviewPage, CostsPage, ProjectsPage, ProjectDetailPage)

페이지 컴포넌트 내부에서 직접 훅 호출. 라우트 파일이 단순함.

```tsx
// routes/index.tsx
import { OverviewPage } from '../pages/overview';
export const Route = createFileRoute('/')({
  component: OverviewPage, // 내부에서 useStats() 호출
});
```

### 패턴 2: 라우트에서 useQuery → props 전달 (SkillsPage, DataPage)

라우트에서 데이터 패칭 + mutation 처리. 페이지 컴포넌트는 순수 표현 담당.

```tsx
// routes/skills.tsx
export const Route = createFileRoute('/skills')({
  component: function SkillsRoute() {
    const {
      data: skills = [],
      isLoading,
      isError,
    } = useQuery({
      queryKey: ['skills'],
      queryFn: () => window.electronAPI.getSkills(),
      staleTime: 60_000,
    });
    return <SkillsPage skills={skills} isLoading={isLoading} isError={isError} />;
  },
});
```

```tsx
// routes/data.tsx
export const Route = createFileRoute('/data')({
  component: function DataRoute() {
    const { data: settings } = useQuery({
      queryKey: ['claude-settings'],
      queryFn: () => window.electronAPI.getClaudeSettings(),
      staleTime: 60_000,
    });

    const { data: pluginInstalled } = useQuery({
      queryKey: ['plugin-installed'],
      queryFn: () => window.electronAPI.checkPluginInstalled(),
    });

    const installMutation = useMutation({
      mutationFn: () => window.electronAPI.installPlugin(),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['plugin-installed'] });
        queryClient.invalidateQueries({ queryKey: ['claude-settings'] });
      },
    });

    const uninstallMutation = useMutation({
      mutationFn: () => window.electronAPI.uninstallPlugin(),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['plugin-installed'] });
        queryClient.invalidateQueries({ queryKey: ['claude-settings'] });
      },
    });

    return (
      <DataPage
        settings={settings}
        pluginInstalled={pluginInstalled}
        pluginLoading={installMutation.isPending || uninstallMutation.isPending}
        onInstallPlugin={() => installMutation.mutate()}
        onUninstallPlugin={() => uninstallMutation.mutate()}
      />
    );
  },
});
```

## 실시간 데이터 구독

파일 변경 감지 → React Query 무효화. `providers/query-provider.tsx`의 `DataChangedListener` 컴포넌트에서 처리:

```tsx
// apps/studio/src/renderer/src/providers/query-provider.tsx

const INVALIDATE_KEYS = ['stats', 'projects'];

function DataChangedListener() {
  const qc = useQueryClient();
  useEffect(() => {
    if (!window.electronAPI?.onDataChanged) return;

    const invalidate = debounce(() => {
      for (const key of INVALIDATE_KEYS) {
        qc.invalidateQueries({ queryKey: [key] });
      }
    }, 2_000);

    const unsub = window.electronAPI.onDataChanged(() => {
      invalidate();
    });
    return unsub;
  }, [qc]);
  return null;
}
```

> `main.tsx`가 아닌 `providers/query-provider.tsx`에 위치. `DataChangedListener`는 독립 컴포넌트로 분리됨.
