# Claude Studio

> Claude Code를 열심히 쓴 당신, 도대체 얼마나 썼는지 궁금하지 않으셨나요?

Claude Studio는 `~/.claude/` 에 쌓인 JSONL 세션 파일을 파싱해서 **비용, 토큰, 세션, 프로젝트**를 한눈에 보여주는 로컬 분석 대시보드입니다.

"이번 달 Claude한테 얼마 썼지?" 라는 질문에 답해드립니다. (대답이 무섭더라도 책임지지 않습니다)

---

## 주요 기능

- **개요 대시보드** — 총 비용, 토큰, 세션, 메시지를 한 화면에
- **비용 분석** — 전체 / 이번 달 / 이번 주 필터로 기간별 지출 추적
- **모델별 분석** — Sonnet vs Opus vs Haiku, 누가 제일 비싼지 파이차트로 확인
- **프로젝트별 통계** — 어떤 프로젝트에 Claude를 가장 많이 투자했는지
- **세션 상세** — 실제 대화 내용을 채팅 UI로 복기
- **활동 히트맵** — GitHub 잔디처럼 보이는 Claude 사용 기록
- **피크 타임 분석** — 당신이 Claude를 가장 많이 부려먹는 시간대

---

## 스크린샷

| 개요 | 비용 분석 | 세션 상세 |
|------|-----------|-----------|
| 총 사용량 한눈에 | 기간별 필터링 | 대화 내용 복기 |

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
│   ├── studio/     # Electron 데스크톱 앱
│   └── web/        # 브라우저 버전 (개발/확인용)
└── packages/
    ├── ui/         # shadcn/ui 공유 컴포넌트 + 차트
    └── shared/     # 비즈니스 로직, JSONL 파서, 타입
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
