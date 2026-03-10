# Taskmaster 설정 가이드

## 개요

Taskmaster는 PRD(Product Requirements Document) 기반으로 태스크를 생성·관리하는 MCP 서버다.

## 생성 파일

### .mcp.json

```json
{
  "mcpServers": {
    "taskmaster-ai": {
      "command": "npx",
      "args": ["-y", "--package=task-master-ai", "task-master-ai"],
      "env": {
        "ANTHROPIC_API_KEY": "${ANTHROPIC_API_KEY}",
        "MODEL": "claude-sonnet-4-5",
        "MAX_TOKENS": "64000",
        "TEMPERATURE": "0.2",
        "DEFAULT_SUBTASKS": "5",
        "DEFAULT_PRIORITY": "medium",
        "PROJECT_NAME": "<!-- 프로젝트 이름 -->",
        "PROJECT_VERSION": "0.1.0"
      }
    }
  }
}
```

### .taskmaster/config.json

```json
{
  "models": {
    "main": {
      "provider": "anthropic",
      "modelId": "claude-sonnet-4-5",
      "maxTokens": 64000,
      "temperature": 0.2
    },
    "research": {
      "provider": "anthropic",
      "modelId": "claude-sonnet-4-5",
      "maxTokens": 64000,
      "temperature": 0.1
    },
    "fallback": {
      "provider": "anthropic",
      "modelId": "claude-haiku-4-5",
      "maxTokens": 32000,
      "temperature": 0.2
    }
  },
  "global": {
    "logLevel": "info",
    "debug": false,
    "defaultSubtasks": 5,
    "defaultPriority": "medium",
    "projectName": "<!-- 프로젝트 이름 -->",
    "ollama": false,
    "azureOpenAI": false
  }
}
```

### .taskmaster/docs/prd.md (플레이스홀더)

```markdown
# <!-- 프로젝트 이름 --> PRD

## 개요

<!-- 프로젝트가 해결하는 문제와 목표를 2-3문장으로 설명 -->

## 목표

## <!-- 달성하려는 주요 목표 3-5개 -->

-
-

## 기능 요구사항

<!-- Phase별 기능 목록 -->

### Phase 1

-
-

### Phase 2

-
-

## 기술 스택

<!-- 사용할 기술/프레임워크 -->

- Frontend:
- Backend:
- Database:
- Infra:

## 비기능 요구사항

## <!-- 성능, 보안, 접근성 등 -->
```

### .claude/rules/taskmaster.md

```markdown
# Taskmaster 워크플로우

## 기본 명령어

- 태스크 목록 조회: `get_tasks` 또는 `next_task`
- 태스크 상세: `get_task` (id 지정)
- 태스크 상태 변경: `set_task_status`
- 태스크 확장(서브태스크 생성): `expand_task`
- PRD에서 태스크 파싱: `parse_prd`

## 작업 흐름

1. `next_task`로 다음 작업할 태스크 확인
2. 태스크 구현 시작 전 `set_task_status` → `in_progress`
3. 완료 후 `set_task_status` → `done`
4. 복잡한 태스크는 `expand_task`로 서브태스크 분리

## PRD 위치

`.taskmaster/docs/prd.md` — PRD 작성 후 `parse_prd`로 태스크 생성
```

## 설치 확인

```bash
# Taskmaster 정상 동작 확인
npx -y --package=task-master-ai task-master-ai --version
```
