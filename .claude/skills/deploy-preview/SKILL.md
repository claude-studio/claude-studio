---
name: deploy-preview
description: Vercel preview 배포. 빌드 검증 후 preview 환경에 배포하고 URL을 반환한다. /deploy-preview 로 호출.
---

빌드 검증 후 Vercel preview 환경에 배포한다.

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

## Step 4: Preview 배포 (모노레포 루트에서 실행, cd 하지 않음)

```bash
vercel --yes
```

## Step 5: 결과 보고

- 배포 모드: Preview
- 배포 URL
- 성공/실패 여부
