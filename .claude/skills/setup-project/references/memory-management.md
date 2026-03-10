# Claude Code 컨텍스트 관리 원칙

## 컨텍스트 절약 전략

### 1. CLAUDE.md 크기 관리

- **200줄 이하** 유지 — 초과 시 잘림
- 핵심 지시문만 직접 기술
- 상세 규칙은 `.claude/rules/`로 분리

### 2. rules/ + paths frontmatter

- paths 없는 파일 → **항상** 로드 (git.md, memory.md 등)
- paths 있는 파일 → 해당 경로 파일 작업 시만 로드
- 컨텍스트 사용량을 필요한 순간에만 집중

### 3. 서브디렉터리 CLAUDE.md 지연 로드

- `src/api/CLAUDE.md` — API 관련 작업 시 자동 로드
- 자주 접근하는 하위 모듈에 국소적 지시문 배치 가능

## 세션 관리 명령어

| 명령어     | 사용 시점                                                    |
| ---------- | ------------------------------------------------------------ |
| `/compact` | 컨텍스트가 길어졌을 때 — 중요 결정사항을 보존 지시 포함 가능 |
| `/clear`   | 작업 전환 시 — 이전 작업 컨텍스트 완전 초기화                |
| `/resume`  | 이전 세션 이어서 — compact 후 맥락 재주입                    |

### /compact 커스텀 보존 예시

```
/compact 현재 구현 중인 인증 플로우의 결정사항과 미완성 태스크 목록을 보존해줘
```

## SessionStart Hook (선택)

compact/resume 후 맥락 재주입을 자동화하려면:

```json
// .claude/settings.json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "cat .claude/CLAUDE.md"
          }
        ]
      }
    ]
  }
}
```

## memory.md 권장 내용 (~10줄)

```markdown
# 컨텍스트 관리

- CLAUDE.md 200줄 초과 시 rules/로 분리
- 긴 작업 후 `/compact` 사용 (중요 결정사항 보존 지시 포함)
- 작업 전환 시 `/clear` 사용
- 상세 규칙은 .claude/rules/ 파일에 작성 (paths frontmatter로 선택적 로드)
- 반복 패턴이나 큰 컨텍스트는 Skills로 분리 검토
```

## Skills 분리 판단 기준

아래 조건 중 하나라도 해당되면 Skill로 분리:

- 동일한 워크플로우를 **여러 프로젝트**에서 반복 사용
- 단계가 5개 이상인 복잡한 절차
- 많은 참조 자료(레퍼런스 파일)가 필요한 경우
- CLAUDE.md에 넣기엔 너무 길지만 항상 로드할 필요는 없는 경우
