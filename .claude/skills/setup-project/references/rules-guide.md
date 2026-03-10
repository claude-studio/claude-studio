# .claude/rules/ 구성 가이드

## 핵심 개념: paths frontmatter

rules/ 파일에 `paths` frontmatter를 지정하면 **해당 경로의 파일을 다룰 때만** 자동 로드된다.
지정하지 않으면 **항상** 로드된다.

```markdown
---
paths:
  - 'src/api/**'
  - '**/*.test.ts'
---
```

## 분류 기준

| 파일          | paths                        | 로드 시점                 |
| ------------- | ---------------------------- | ------------------------- |
| `git.md`      | 없음                         | 항상                      |
| `memory.md`   | 없음                         | 항상                      |
| `monorepo.md` | 없음                         | 항상 (구조가 복잡한 경우) |
| `api.md`      | `src/api/**`                 | API 파일 작업 시          |
| `testing.md`  | `**/*.test.*`                | 테스트 파일 작업 시       |
| `database.md` | `src/db/**`, `migrations/**` | DB 파일 작업 시           |

## 크기 원칙

- 파일 하나당 **50줄 이하** 권장
- 길어지면 더 세분화하여 paths로 분리

## git.md 범용 템플릿

```markdown
# Git 규칙

## 브랜치 전략

\`\`\`
main # 프로덕션 브랜치
feat/기능명 # 새 기능
fix/버그명 # 버그 수정
chore/작업명 # 설정, 빌드, 문서
\`\`\`

## 커밋 메시지 형식

\`\`\`
type(scope): 설명
\`\`\`

### type

| type       | 설명             |
| ---------- | ---------------- |
| `feat`     | 새로운 기능      |
| `fix`      | 버그 수정        |
| `chore`    | 빌드, 설정, 기타 |
| `refactor` | 리팩토링         |
| `docs`     | 문서             |
| `style`    | 코드 포맷        |
| `test`     | 테스트           |

### 예시

\`\`\`
feat(web): 로그인 폼 컴포넌트 구현
fix(api): 인증 토큰 만료 오류 수정
chore: 의존성 업데이트
\`\`\`

## PR 규칙

- PR 제목은 커밋 메시지 형식과 동일
- 머지 전 CI 통과 확인
```

## 프로젝트 유형별 추천 rules 파일

### 풀스택 웹 앱

- `git.md` — 커밋/브랜치
- `memory.md` — 컨텍스트 관리
- `api.md` (paths: `src/api/**`) — API 설계 규칙
- `testing.md` (paths: `**/*.test.*`) — 테스트 작성 규칙

### 모노레포

- `git.md`
- `memory.md`
- `monorepo.md` — 패키지 구조, import 규칙

### 라이브러리/패키지

- `git.md`
- `memory.md`
- `api-design.md` — 공개 API 설계 원칙
- `changelog.md` — 변경 이력 작성 규칙

### 데이터/AI 프로젝트

- `git.md`
- `memory.md`
- `data-handling.md` (paths: `data/**`, `notebooks/**`)
- `model.md` (paths: `models/**`, `training/**`)
