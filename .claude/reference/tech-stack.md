# 기술 스택

버전 정보는 `pnpm-workspace.yaml`의 `catalog:` 섹션 기준.

## 핵심 런타임/빌드

| 카테고리 | 기술 | 버전 |
|---------|------|------|
| 런타임 | Node.js | >= 22 |
| 패키지 매니저 | pnpm | >= 10 (10.6.0) |
| 빌드 오케스트레이션 | Turborepo | ^2.5 |
| 데스크톱 | Electron | ^35.0.0 |
| 번들러 | Vite | ^6.3.0 |
| Electron 번들러 | electron-vite | ^3.1.0 |
| 패키징 | electron-builder | ^25.1.0 |

## 프론트엔드

| 카테고리 | 기술 | 버전 |
|---------|------|------|
| UI 프레임워크 | React | ^19.0.0 |
| 라우팅 | TanStack Router | ^1.120.0 |
| 서버 상태 | TanStack React Query | ^5.62.0 |
| 스타일링 | Tailwind CSS | ^4.1.0 |
| 애니메이션 유틸 | tw-animate-css | ^1.4.0 |
| UI 컴포넌트 | shadcn/ui | ^2.5.0 |
| 아이콘 | Lucide React | ^0.468.0 |
| 차트 | Recharts | ^2.15.0 |
| 유효성 검사 | Zod | ^3.24.0 |
| 애니메이션 | framer-motion | (packages/ui에 설치) |
| 폰트 | Geist Sans / Geist Mono | latest |

## 개발 도구

| 카테고리 | 기술 | 버전 |
|---------|------|------|
| TypeScript | TypeScript | ^5.9.0 |
| 린트 | ESLint | ^9.39.0 |
| 포매터 | Prettier | ^3.8.0 |
| 커밋 규칙 | commitlint | ^20.4.0 |
| Git hooks | Husky | ^9.1.7 |
| 테스트 | Vitest | ^3.0.0 |
| DOM 테스트 | Testing Library | ^16.0.0 |

## 빌드 타겟 (electron-builder)

- macOS: dmg (universal: x64 + arm64)
- Windows: nsis (x64)

## Turborepo 태스크

```json
// turbo.json
{
  "tasks": {
    "build": { "dependsOn": ["^build"] },
    "dev": { "cache": false, "persistent": true },
    "lint": {},
    "typecheck": {}
  }
}
```

## Vite 플러그인 설정 (apps/studio)

`electron-vite` + `@tanstack/router-plugin` 사용:
- `autoCodeSplitting: true` — 라우트별 자동 코드 분할
- `@vitejs/plugin-react` — React fast refresh
- `@tailwindcss/vite` — Tailwind CSS v4 Vite 플러그인

## 배포

| 환경 | 방법 |
|------|------|
| `apps/web` | Vercel (자동 배포) |
| `apps/studio` | GitHub Releases (electron-builder) |
