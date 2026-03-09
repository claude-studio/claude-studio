---
name: vercel-env
description: Vercel 환경변수 조회 또는 로컬 pull. /vercel-env ls 로 목록 조회, /vercel-env pull 로 .env 파일 생성.
---

`$ARGUMENTS`에 따라 환경변수를 조회하거나 로컬로 pull한다.

## Step 1: 환경 확인

```bash
vercel --version
```

실패 시 `npm i -g vercel` 설치 안내 후 중단.

## Step 2: 명령 실행

- `$ARGUMENTS` = `ls` 또는 빈값:

  ```bash
  vercel env ls
  ```

  결과를 테이블 형태로 정리하여 출력.

- `$ARGUMENTS` = `pull`:
  1. `.gitignore`에 `.env*` 패턴 포함 여부 확인:

     ```bash
     grep -r '\.env' .gitignore apps/web/.gitignore 2>/dev/null
     ```

     미포함이면 **경고** 후 계속 진행할지 확인.

  2. 환경변수 pull:

     ```bash
     vercel env pull
     ```

  3. 생성된 `.env` 파일 경로와 변수 수 요약 출력.

- 그 외: `ls` 또는 `pull` 중 선택 요청.
