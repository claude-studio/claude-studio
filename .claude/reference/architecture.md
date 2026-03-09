# 아키텍처

## 모노레포 구조

Turborepo + pnpm workspaces. `pnpm-workspace.yaml`의 `catalog:` 섹션으로 의존성 버전 통합 관리.

```
claude-studio/
├── apps/
│   ├── studio/          # Electron 데스크톱 앱 (main + preload + renderer)
│   └── web/             # Vercel 배포 랜딩 페이지
├── packages/
│   ├── ui/              # 공유 React UI 라이브러리 (@repo/ui)
│   ├── shared/          # 공유 타입/유틸/데이터 레이어 (@repo/shared)
│   ├── pixel-agents/    # Canvas 픽셀 오피스 엔진 (@repo/pixel-agents)
│   ├── eslint-config/   # 공유 ESLint 설정
│   └── typescript-config/ # 공유 tsconfig
└── turbo.json           # build, lint, typecheck, dev 태스크 정의
```

## 패키지 의존 트리

```
apps/studio
  ├── @repo/ui          (React UI 컴포넌트, 페이지, 훅)
  ├── @repo/shared      (타입, JSONL 파싱, 비용 계산)
  └── @repo/pixel-agents (Canvas 픽셀 오피스 엔진)

apps/web
  ├── @repo/ui
  └── @repo/shared

packages/ui
  └── @repo/shared      (타입 임포트)
```

## 각 패키지/앱 역할

### apps/studio — Electron 데스크톱 앱

3-tier Electron 구조 (`electron-vite`로 3타겟 동시 빌드):

```
src/
├── main/         # Node.js 메인 프로세스
│   ├── index.ts  # 앱 진입점, BrowserWindow 생성
│   ├── ipc/      # IPC 핸들러 등록 (채널별 파일)
│   └── services/ # 서비스 레이어 (파일 감시, 파싱 등)
├── preload/      # contextBridge API 노출 (api.ts)
└── renderer/     # React 앱 (TanStack Router 라우트)
    └── src/
        └── routes/  # 파일 기반 라우트
```

### apps/web — 랜딩 페이지

Vite + React. `@repo/ui` 컴포넌트 재사용, Vercel 배포.

### packages/ui — 공유 UI 라이브러리

shadcn/ui 기반. pages/, charts/, layout/, hooks/, components/ui/ 구조.
barrel export: `index.ts` → 소비자는 `import { X } from '@repo/ui'`

### packages/shared — 공유 데이터 레이어

FSD(Feature-Sliced Design) 유사 구조:
```
src/
├── entities/     # project/, session/, stats/
├── features/     # cost-analysis/, export-data/, search-sessions/
└── shared/
    ├── api/      # claude-reader.ts (JSONL 파싱), data-source.ts
    ├── config/   # pricing.ts (모델별 토큰 단가)
    ├── lib/      # format.ts (포맷 유틸), index.ts
    └── types/    # index.ts (Zod 스키마 + 타입)
```

### packages/pixel-agents — 픽셀 오피스 엔진

Canvas 2D 기반 실시간 에이전트 시각화. 상세: [pixel-agents.md](pixel-agents.md)

## 핵심 데이터 흐름

```
~/.claude/projects/**/*.jsonl
  │
  ├─ [변경 감지] services/file-watcher.ts (fs.watch)
  │             services/hook-server.ts (Unix socket)
  │
  ▼
shared/claude-reader.ts
  (JSONL 파싱 + 30초 TTL 캐시)
  │
  ▼
apps/studio/src/main/ipc/*.ipc.ts
  (IPC 핸들러: stats, projects, costs, settings, skills...)
  │
  ▼
apps/studio/src/preload/api.ts
  (contextBridge → window.electronAPI)
  │
  ▼
packages/ui/src/shared/api/ (electronProvider / httpProvider)
  │
  ▼
DataProviderWrapper (React Context)
  │
  ▼
useStats() / useProjects() / ... (TanStack Query 훅)
  │
  ▼
UI 컴포넌트 (OverviewPage, CostsPage, ...)
```

### 실시간 에이전트 흐름 (Live)

```
~/.claude/projects/**/*.jsonl (실시간 변경)
    + ~/.claude/studio.sock (Hook server)
          │
          ▼
    services/live-watcher.ts
    (LiveAgentEvent 생성 + 상태 관리)
          │
          ▼
    IPC push: 'live:agent-event'
          │
          ▼
    window.electronAPI.onLiveAgentEvent()
          │
          ▼
    use-pixel-messages.ts
          │
          ▼
    OfficeState (캐릭터 생성/이동/제거)
          │
          ▼
    Canvas renderer (requestAnimationFrame)
```
