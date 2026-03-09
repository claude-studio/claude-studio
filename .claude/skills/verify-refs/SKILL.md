---
name: verify-refs
description: |
  Claude Studio 프로젝트의 `.claude/reference/` 문서 9개와 실제 코드의 불일치를 검증하고 수정하는 스킬.
  `/verify-refs` 로 호출한다. `--no-fix` 인수를 주면 보고서만 출력하고 수정하지 않는다.

  사용 시점:
  - 레퍼런스 문서와 코드가 뒤처졌을 가능성이 있을 때
  - 대규모 리팩토링 후 문서 동기화 확인이 필요할 때
  - 커밋 전 문서 정합성을 검증하고 싶을 때

  기본 동작: 검증 후 유저 승인을 받아 문서를 수정한다.
  `--no-fix` 인수 시: 불일치 보고서만 출력하고 수정하지 않는다.
---

# verify-refs 스킬

## 개요

4개의 team-reviewer가 병렬로 레퍼런스 문서를 코드와 교차검증하고, team-lead가 결과를 취합하여 보고서를 출력한다.

---

## 팀 구성

| 역할             | 담당 문서                                             | 검증 코드 경로                                                 |
| ---------------- | ----------------------------------------------------- | -------------------------------------------------------------- |
| R1 인프라/규칙   | `architecture.md`, `coding-rules.md`, `tech-stack.md` | `pnpm-workspace.yaml`, `turbo.json`, 각 `package.json`         |
| R2 UI/스타일     | `styling.md`, `ui-components.md`                      | `packages/ui/src/`                                             |
| R3 라우팅/데이터 | `routing.md`, `data-layer.md`                         | `apps/studio/src/renderer/src/routes/`, `packages/shared/src/` |
| R4 IPC/픽셀      | `ipc-and-services.md`, `pixel-agents.md`              | `apps/studio/src/main/`, `packages/pixel-agents/src/`          |

---

## Phase 0: 문서 줄 수 사전 확인 & 분리 (팀 스폰 전)

team-lead가 팀 스폰 **전에** 다음을 수행한다:

1. 9개 문서 줄 수 일괄 확인:
   ```bash
   wc -l .claude/reference/*.md
   ```
2. **300줄 초과 문서가 있으면** 해당 문서 담당 reviewer를 **먼저 단독 스폰**하여 분리 작업을 맡긴다
   - reviewer에게 전달할 지시: "담당 문서 중 300줄 초과 파일을 가장 큰 섹션 기준으로 별도 `.md`로 분리하고, 원본에 `→ [상세](파일명.md)` 링크로 대체하라. 분리 완료 후 team-lead에게 보고하라."
   - reviewer의 분리 완료 보고를 받은 후 다음 단계로 진행
3. **300줄 이하이면** 즉시 Phase 1로 진행

---

## Phase 1: 병렬 검증 (R1~R4 동시 실행)

각 reviewer는 **독립적으로** 다음을 수행한다:

1. 담당 레퍼런스 문서 읽기 (`.claude/reference/` 경로)
2. 문서에 언급된 **코드로 확인 가능한 구체적 값**만 코드에서 교차 검증
   - CSS 클래스명, 상수값, 함수 시그니처, 타입명, prop명, 파일 경로, 패키지 버전
   - "설명문"(`~하는 방식이다`)은 검증 대상 아님
3. 불일치 발견 시 아래 형식으로 기록:
   - 항목명 / 문서 값 / 코드 값 / 코드 위치(`파일:줄`) / 판정
4. team-lead에게 SendMessage로 보고 후 응답 대기

**판정 기준:**

- `문서 수정` — 코드가 맞고 문서가 뒤처진 경우
- `코드 수정` — 문서가 의도된 설계이고 코드가 벗어난 경우
- `확인 필요` — 어느 쪽이 맞는지 판단 불가

---

## Phase 2: 취합 & 보고 (team-lead)

1. 4개 reviewer의 보고를 모두 수신할 때까지 대기
2. 아래 형식으로 최종 보고서를 유저에게 출력

```markdown
# 레퍼런스 문서 검증 보고서

## 요약

- 검증 문서: 9개
- 일치: N개 | 불일치: N개 (총 N건)

## 불일치 상세

### [문서명] — N건

| #   | 항목 | 문서 값 | 코드 값 | 코드 위치 | 판정      |
| --- | ---- | ------- | ------- | --------- | --------- |
| 1   | ...  | ...     | ...     | 파일:줄   | 문서 수정 |

### [문서명] — 일치

## 권장 조치

- 문서 수정: N건
- 코드 수정: N건
- 확인 필요: N건
```

---

## Phase 3: 수정 실행 (`--no-fix` 인수가 없으면 항상 실행)

1. team-lead가 유저에게 수정 항목 확인 요청 (승인 전 수정 금지)
2. 승인된 항목에 대해 담당 reviewer에게 수정 명령 전달
3. reviewer가 문서 수정 후 줄 수 확인 (`wc -l`)
   - **300줄 초과 시**: 가장 큰 섹션을 별도 `.md`로 분리하고 원본에 `→ [상세](파일명.md)` 링크 추가
4. reviewer가 수정 완료 후 team-lead에게 보고
5. team-lead가 최종 결과 출력

---

## Phase 4: 팀 종료

**팀 스폰은 유저가 명시적으로 "종료" 또는 완료를 확인할 때까지 유지한다.**

- team-lead는 Phase 3 완료 후 reviewer들에게 shutdown_request를 보내지 않는다
- 유저가 "종료해", "끝났어", "팀 종료해" 등의 명시적 종료 신호를 보낼 때 shutdown_request를 전송한다
- 종료 전까지 reviewer는 대기 상태(idle)로 유지되며, 추가 수정 지시를 받을 수 있다

---

## 문서 수정 포맷 규칙 (reviewer 준수 사항)

- 수정 전 기존 문서의 마크다운 구조·테이블 형식·헤딩 계층·들여쓰기 파악
- 새 항목 추가 시 기존 항목과 동일한 형식(테이블이면 테이블, 리스트면 리스트)
- 값만 변경 시 주변 텍스트/구조 변경 금지
- 코드 블록의 언어 태그(`ts`, `tsx`, `css`, `bash` 등) 기존과 동일하게 유지
- 다른 문서에서 링크로 참조하는 섹션 삭제 시 참조 링크도 함께 처리

---

## 레퍼런스 문서 경로

```
.claude/reference/
├── architecture.md      — 모노레포 구조, 패키지 역할
├── coding-rules.md      — TypeScript, ESLint, 의존성, Git 규칙
├── tech-stack.md        — 기술 스택 버전
├── styling.md           — 스타일링 패턴, 테마 변수
├── ui-components.md     — UI 컴포넌트, 차트, 훅
├── routing.md           — TanStack Router 라우트, 데이터 패칭
├── data-layer.md        — shared 타입, claude-reader, DataProvider
├── ipc-and-services.md  — IPC 채널, 서비스 레이어
└── pixel-agents.md      — 픽셀 에이전트 상태, 스프라이트
```
