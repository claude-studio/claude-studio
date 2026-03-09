---
name: deploy
description: Vercel 배포 (production/preview). /deploy prod 또는 /deploy preview 로 호출. 빌드 검증 후 Vercel에 배포하고 URL을 반환한다.
---

`$ARGUMENTS`를 확인하여 `prod` 또는 `preview` 모드로 Vercel 배포를 실행한다.

## Step 1: 환경 확인

```bash
vercel --version
vercel whoami
```

실패 시 각각 `npm i -g vercel` 설치 안내 또는 `vercel login` 안내 후 중단.

## Step 2: Git 상태 확인

```bash
git status --short
```

uncommitted changes가 있으면 경고 출력 후 계속 진행.

## Step 3: 빌드 검증 (모노레포 루트에서 실행)

```bash
pnpm turbo run typecheck --filter=@repo/web
pnpm turbo run build --filter=@repo/web
```

실패 시 에러 원인 요약 후 **중단**.

## Step 4: 배포 (모노레포 루트에서 실행, cd 하지 않음)

- `$ARGUMENTS` = `prod` → `vercel --prod --yes`
- `$ARGUMENTS` = `preview` 또는 빈값 → `vercel --yes`
- 그 외 → 사용자에게 `prod` / `preview` 선택 요청

## Step 5: 결과 보고

- 배포 모드 (Production / Preview)
- 배포 URL
- 성공/실패 여부
- 소요 시간 (가능한 경우)
