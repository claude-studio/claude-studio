---
name: setup-project
description: >
  Claude Code 프로젝트 초기 구성 스킬. CLAUDE.md, .claude/rules/, Taskmaster, GitHub 이슈 라벨을 단계적으로 셋업한다.
  트리거 문구: "초기 구성해줘", "프로젝트 설정해줘", "셋업해줘", "CLAUDE.md 만들어줘", "rules 설정해줘",
  "메모리 구성해줘", "프로젝트 초기화", "개발환경 셋업", "Claude Code 설정", "새 프로젝트 시작", "프로젝트 세팅"
---

# setup-project Skill

## 목적

모든 Claude Code 프로젝트에서 재사용 가능한 메모리·컨텍스트 관리 구조를 빠르게 셋업한다.

- `.claude/CLAUDE.md` — 핵심 지시문 (항상 로드)
- `.claude/rules/` — paths frontmatter로 선택적 로딩되는 규칙 파일
- 선택적: Taskmaster MCP 통합
- 선택적: GitHub 이슈 라벨 세트

## 실행 워크플로우

### Step 1: 옵션 확인

**AskUserQuestion**으로 두 가지 옵션을 한 번에 묻는다:

```
이 프로젝트 셋업에 대해 두 가지 확인할게요.

1. Taskmaster를 사용할까요? (태스크 관리 + PRD 기반 워크플로우)
2. GitHub 이슈 라벨을 생성할까요? (gh CLI 필요)

각각 예/아니오로 답해주세요.
```

### Step 2: 기존 구조 검사

현재 작업 디렉터리에서 다음을 확인한다:

```bash
# 존재 여부 확인
ls .claude/CLAUDE.md 2>/dev/null
ls .claude/rules/ 2>/dev/null
ls .mcp.json 2>/dev/null
ls .taskmaster/ 2>/dev/null
```

충돌하는 파일이 있으면 각각 **AskUserQuestion**으로 처리 방식을 묻는다:

> `{파일경로}` 파일이 이미 존재합니다. 어떻게 할까요?
>
> - **덮어쓰기** — 새 템플릿으로 교체
> - **병합** — 기존 내용을 유지하고 누락된 항목만 추가
> - **건너뛰기** — 그대로 두기

**병합 선택 시**: 기존 파일의 마크다운 형식(헤더 레벨, 리스트 스타일, 코드블록 방식)을 먼저 파악한 뒤, 동일한 형식으로 누락된 섹션만 추가한다.

### Step 3: 핵심 파일 생성

충돌 처리 후 아래 파일들을 생성/수정한다.

#### .claude/CLAUDE.md

`references/claude-md-guide.md`의 템플릿을 참조하여 생성.

작성 원칙:

- **200줄 이하** 유지
- 핵심 지시문만 직접 기술 (상세 규칙은 rules/로 분리)
- 프로젝트 설명, 빌드 명령어, 아키텍처, 주의사항 4개 섹션 포함

#### .claude/rules/git.md

`references/rules-guide.md`의 git.md 템플릿을 참조하여 생성.

- frontmatter 없음 (모든 컨텍스트에서 항상 로드)
- 커밋 형식, 브랜치 전략, PR 규칙 포함

#### .claude/rules/memory.md

`references/memory-management.md`를 참조하여 ~10줄 요약본 생성:

- frontmatter 없음 (항상 로드)
- `/compact`, `/clear` 사용 시점
- CLAUDE.md 크기 경고 기준
- rules/ 파일 분리 원칙

### Step 4: Taskmaster 셋업 (선택)

Step 1에서 "예" 선택 시 실행. `references/taskmaster-guide.md` 참조.

생성 파일:

- `.mcp.json`
- `.taskmaster/config.json`
- `.taskmaster/docs/prd.md` (플레이스홀더)
- `.claude/rules/taskmaster.md`

### Step 5: GitHub 이슈 라벨 생성 (선택)

Step 1에서 "예" 선택 시 실행. `references/labels-guide.md` 참조.

1. 공통 라벨 11개를 `gh label create`로 생성 (중복 스킵)
2. 프로젝트 전용 라벨 추가 여부를 **AskUserQuestion**으로 확인

### Step 6: 완료 보고

생성/수정된 파일 목록을 출력하고, 다음 단계를 안내한다:

```
셋업 완료!

생성된 파일:
- .claude/CLAUDE.md
- .claude/rules/git.md
- .claude/rules/memory.md
[선택 항목에 따라 추가]

다음 단계:
1. .claude/CLAUDE.md의 플레이스홀더를 프로젝트 정보로 채우세요
[Taskmaster 선택 시] 2. .taskmaster/docs/prd.md에 PRD를 작성하세요
```

## 참조 파일

| 파일                              | 용도                                            |
| --------------------------------- | ----------------------------------------------- |
| `references/claude-md-guide.md`   | CLAUDE.md 작성 가이드 + 플레이스홀더 템플릿     |
| `references/rules-guide.md`       | .claude/rules/ 구성 가이드 + git.md 기본 템플릿 |
| `references/memory-management.md` | 컨텍스트 절약 원칙                              |
| `references/taskmaster-guide.md`  | Taskmaster 설정 가이드                          |
| `references/labels-guide.md`      | GitHub 이슈 라벨 정의 및 생성 명령어            |
