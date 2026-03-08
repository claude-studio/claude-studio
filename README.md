# Claude Studio

> Claude Code를 열심히 쓴 당신, 도대체 얼마나 썼는지 궁금하지 않으셨나요?

Claude Studio는 `~/.claude/` 에 쌓인 JSONL 세션 파일을 파싱해서 **비용, 토큰, 프로젝트**를 한눈에 보여주는 로컬 분석 대시보드입니다.
그리고 지금 이 순간 Claude Code가 무엇을 하고 있는지 **픽셀 오피스**로 실시간 확인할 수 있습니다.

"이번 달 Claude한테 얼마 썼지?" 라는 질문에 답해드립니다. (대답이 무섭더라도 책임지지 않습니다)

---

## 주요 기능

### 라이브 `Beta`
- **실시간 에이전트 시각화** — 현재 실행 중인 Claude Code 세션을 픽셀 캐릭터로 표시
- **작업 상태 표시** — 작업 중 / 도구 실행 / 대기 상태를 애니메이션으로 구분
- **도구 말풍선** — 현재 실행 중인 도구명(`Read`, `Bash`, `WebSearch` 등)을 캐릭터 위에 표시
- **멀티 에이전트** — 여러 Claude Code 세션이 동시에 실행되면 각각 별도 캐릭터로 스폰
- **서브에이전트** — Task 도구로 생성된 서브에이전트도 별도 캐릭터로 시각화

### 개요
- **사용 통계 요약** — 총 비용, 토큰, 세션, 메시지를 한 화면에
- **사용 시작일 & D+N** — Claude Code와 함께한 기간 표시
- **모델별 일별 비용 차트** — 날짜별로 어떤 모델에 얼마나 썼는지 스택 차트
- **활동 히트맵** — GitHub 잔디처럼 보이는 Claude 사용 기록
- **피크 타임 분석** — Claude를 가장 많이 부려먹는 시간대
- **캐시 절약 현황** — 캐시 적중률, 절약 비용, 캐시 토큰 (툴팁 설명 포함)
- **툴 사용 순위** — 가장 많이 호출한 도구 Top 10
- **대화 패턴 분석** — 평균 세션 길이, 메시지당 토큰, 세션 길이 분포

### 비용
- **기간 필터** — 전체 / 이번 달 / 이번 주
- **월별 비교** — 이번 달 vs 지난 달 비용 증감률
- **프로젝트별 비용 순위** — 어떤 프로젝트에 가장 많이 투자했는지 바 차트
- **모델별 분석** — Sonnet vs Opus vs Haiku 파이 차트

### 프로젝트
- **프로젝트 목록** — 비용, 토큰, 세션 수, 마지막 활동 시간
- **Worktree & 서브디렉토리 구분** — `frontend (worktree-xxx)`, `frontend (apps-admin)` 형태로 표시

### 스킬
- **커스텀 스킬 목록** — `~/.claude/skills/` 에 등록된 스킬 카드 보기
- **호출 가능 스킬 구분** — `/skill-name` 으로 호출 가능한 스킬 별도 분류
- **스킬 상세 Dialog** — 스킬 설명과 전체 본문 확인

### 설정
- **현재 모델** — `~/.claude/settings.json` 에서 읽은 기본 모델
- **권한 모드** — default / acceptEdits / bypassPermissions 등
- **활성 플러그인** — 활성화된 MCP 플러그인 목록

---

## 스크린샷

| 개요 | 비용 분석 | 세션 상세 |
|------|-----------|-----------|
| 총 사용량 한눈에 | 기간별 필터링 | 대화 내용 복기 |

---

## 다운로드

[GitHub Releases](https://github.com/FRONT-JB/claude-studio/releases) 에서 최신 버전을 다운로드하세요.

| OS | 파일 |
|----|------|
| macOS Apple Silicon | `Claude-Studio-x.x.x-arm64.dmg` |
| macOS Intel | `Claude-Studio-x.x.x-x64.dmg` |

### macOS에서 "손상됨" 오류가 뜰 때

Apple 공증(Notarization)을 받지 않은 앱은 Gatekeeper가 차단합니다. 터미널에서 격리 속성을 제거하면 정상 실행됩니다.

```bash
xattr -cr /Applications/Claude\ Studio.app
```

DMG 파일 자체가 차단된 경우:

```bash
xattr -cr ~/Downloads/Claude-Studio-x.x.x-arm64.dmg
```

---

## 시작하기

### 필요 환경

- Node.js >= 20
- pnpm >= 10

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# Electron 데스크톱 앱 실행
pnpm --filter @repo/studio dev

# 브라우저 버전 실행 (개발용)
pnpm --filter @repo/web dev
```

### 빌드

```bash
# Electron 앱 패키징 (macOS DMG)
pnpm --filter @repo/studio build
```

---

## 프로젝트 구조

Turborepo 모노레포로 구성되어 있습니다.

```
claude-studio/
├── apps/
│   ├── studio/        # Electron 데스크톱 앱
│   └── web/           # 브라우저 버전 (개발/확인용)
└── packages/
    ├── ui/            # shadcn/ui 공유 컴포넌트 + 차트
    ├── shared/        # 비즈니스 로직, JSONL 파서, 타입
    └── pixel-agents/  # 픽셀 캐릭터 시각화 엔진 (라이브 탭)
```

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 데스크톱 | Electron + electron-vite |
| 프레임워크 | React 19 + TypeScript |
| 라우팅 | TanStack Router (파일 기반) |
| 데이터 | TanStack Query |
| 스타일 | Tailwind CSS v4 + shadcn/ui |
| 차트 | Recharts |
| 모노레포 | Turborepo + pnpm workspace |

---

## 어떻게 동작하나요?

Claude Code는 모든 대화를 `~/.claude/projects/` 아래 JSONL 파일로 저장합니다.

Claude Studio는 이 파일들을 읽어서:
1. 메시지별 토큰 사용량과 모델을 집계
2. 모델별 공식 가격표로 비용 계산
3. 프로젝트 / 세션 / 날짜별로 정리해서 시각화

모든 데이터는 **로컬에서만 처리**됩니다. 외부 서버로 아무것도 전송하지 않습니다.

---

## 원본 프로젝트

[Claud-ometer](https://github.com/deshraj/Claud-ometer) 에서 영감을 받아,
Electron 네이티브 앱 + Turborepo 모노레포로 재구축했습니다.

---

## 라이선스

MIT
