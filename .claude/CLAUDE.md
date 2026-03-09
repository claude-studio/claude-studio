# Claude Studio 프로젝트 지침

## 프로젝트 개요

Claude Code 사용량 대시보드 데스크톱 앱 (Electron + React). `~/.claude/projects/` JSONL 파일을 파싱하여 비용·토큰·세션 통계를 시각화하며, 실시간 에이전트 상태를 픽셀아트 오피스로 표시한다.

## 개발 명령어

```bash
pnpm dev          # Electron 앱 개발 서버 (apps/studio)
pnpm build        # 전체 빌드 (Turborepo)
pnpm lint         # ESLint 검사
pnpm typecheck    # TypeScript 타입 검사
pnpm test         # Vitest 유닛 테스트
```

> `apps/studio` 단독 실행: `cd apps/studio && pnpm dev`

---

## 커밋 워크플로우

커밋 전 반드시 아래 순서를 따른다.

1. **변경 파일 파악** — `git diff --name-only` 로 변경 파일 목록 확인
2. **문서 동기화 검토** — 변경사항 중 아래 기준에 해당하는 항목이 있으면 **커밋 전에 사용자에게 질문**한다

   | 변경 유형                                   | 수정할 문서                             |
   | ------------------------------------------- | --------------------------------------- |
   | 새 TypeScript·ESLint·Git·의존성 규칙 추가   | `.claude/reference/coding-rules.md`     |
   | 새 기술·라이브러리·버전 추가                | `.claude/reference/tech-stack.md`       |
   | 아키텍처·패키지 구조 변경                   | `.claude/reference/architecture.md`     |
   | UI 컴포넌트·훅·프리미티브 변경              | `.claude/reference/ui-components.md`    |
   | 스타일·테마·CSS 변수 변경                   | `.claude/reference/styling.md`          |
   | 라우트·데이터 패칭 패턴 변경                | `.claude/reference/routing.md`          |
   | IPC 채널·서비스 레이어 변경                 | `.claude/reference/ipc-and-services.md` |
   | shared 타입·DataProvider·claude-reader 변경 | `.claude/reference/data-layer.md`       |
   | 픽셀 에이전트 상태·이벤트·스프라이트 변경   | `.claude/reference/pixel-agents.md`     |

3. **문서 반영 후 커밋** — 사용자가 반영을 승인하면 문서 수정 → 커밋에 포함

> 문서에 추가할 내용은 유추하지 않는다. 기존 레퍼런스 문서를 먼저 읽고, 실제 코드 변경에서 확인된 사실만 반영한다.
> 레퍼런스 문서가 300줄을 초과하면 관련 섹션을 별도 파일로 분리하고 원본 문서에서 링크로 참조한다.

---

## 카테고리별 레퍼런스

### 코딩 규칙 (TypeScript, ESLint, 의존성, Git 등 공통 규칙) 확인 시 참조하세요.

| 레퍼런스                                     | 설명                                              |
| -------------------------------------------- | ------------------------------------------------- |
| [coding-rules.md](reference/coding-rules.md) | TypeScript, ESLint, 의존성, 패키지 격리, Git 규칙 |

### 패키지 구조, 데이터 흐름, 의존 관계가 궁금하거나 새 패키지/앱을 추가할 때 참조하세요.

| 레퍼런스                                     | 설명                                    |
| -------------------------------------------- | --------------------------------------- |
| [architecture.md](reference/architecture.md) | 모노레포 구조, 패키지 역할, 데이터 흐름 |
| [tech-stack.md](reference/tech-stack.md)     | 기술 스택 버전 정보                     |

### UI 컴포넌트 추가·수정, 스타일 적용, 페이지·라우트 작업 시 참조하세요.

| 레퍼런스                                       | 설명                                                |
| ---------------------------------------------- | --------------------------------------------------- |
| [styling.md](reference/styling.md)             | 스타일링 패턴, 테마 변수, glass-morphism, 코딩 규칙 |
| [ui-components.md](reference/ui-components.md) | UI 패키지 프리미티브, 차트, 훅                      |
| [routing.md](reference/routing.md)             | TanStack Router 라우트, 데이터 패칭 패턴            |

### Electron IPC 채널 추가·수정, 서비스 레이어·데이터 파싱 작업 시 참조하세요.

| 레퍼런스                                             | 설명                                                        |
| ---------------------------------------------------- | ----------------------------------------------------------- |
| [ipc-and-services.md](reference/ipc-and-services.md) | IPC 채널, 서비스 레이어, 이벤트 흐름, 코딩 규칙             |
| [data-layer.md](reference/data-layer.md)             | shared 패키지, 타입, claude-reader, DataProvider, 코딩 규칙 |

### /live 라우트, 픽셀 오피스 시각화, 에이전트 상태 처리 작업 시 참조하세요.

| 레퍼런스                                     | 설명                                                        |
| -------------------------------------------- | ----------------------------------------------------------- |
| [pixel-agents.md](reference/pixel-agents.md) | 픽셀 에이전트 상태 머신, 이벤트 흐름, 스프라이트, 코딩 규칙 |

---

## 도구 레퍼런스

### 배포·환경변수 관리가 필요할 때 슬래시 커맨드를 사용하세요.

| 스킬                                              | 설명                                                                            |
| ------------------------------------------------- | ------------------------------------------------------------------------------- |
| [/deploy](skills/deploy/SKILL.md)                 | Vercel 배포 — `prod` 또는 `preview` 인수로 환경 선택                            |
| [/deploy-preview](skills/deploy-preview/SKILL.md) | Vercel preview 배포 (빌드 검증 포함)                                            |
| [/vercel-env](skills/vercel-env/SKILL.md)         | Vercel 환경변수 조회(`ls`) 또는 로컬 pull                                       |
| [/verify-refs](skills/verify-refs/SKILL.md)       | 레퍼런스 문서 9개와 코드 불일치 검증 후 수정 (기본), `--no-fix`로 보고서만 출력 |

### 브라우저 자동화 또는 터미널 제어가 필요한 경우 아래 레퍼런스를 읽고 cmux 명령어를 사용하세요.

| 레퍼런스                                 | 설명                                                      |
| ---------------------------------------- | --------------------------------------------------------- |
| [cmux-browser.md](tools/cmux-browser.md) | 터미널 내 브라우저 자동화 (열기, 클릭, 폼, 스냅샷 등)     |
| [cmux.md](tools/cmux.md)                 | 워크스페이스/surface 제어, 입력 전송, 사이드바 메타데이터 |
