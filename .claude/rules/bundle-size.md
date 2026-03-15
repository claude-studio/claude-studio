---
description: 번들 사이즈 최적화 규칙 — import 및 의존성 관리 시 적용
globs: ["apps/**/*.{ts,tsx}", "packages/**/*.{ts,tsx}"]
---

# 번들 사이즈 규칙

## Critical

- 아이콘 라이브러리(`lucide-react` 등)는 반드시 named import를 사용한다.
  - Bad: `import * as Icons from 'lucide-react'`
  - Good: `import { Clock, FolderOpen } from 'lucide-react'`
- barrel export(`index.ts`)에서 전체 re-export(`export *`)를 사용하지 않는다.

## Warning

- `lodash`를 전체 import하지 않는다. 개별 함수를 `lodash/함수명`으로 import한다.
- 동적 import(`import()`)를 활용하여 초기 번들 크기를 줄인다. 라우트 단위 코드 분할을 권장한다.
- 사용하지 않는 import를 남기지 않는다. unused import는 번들에 포함될 수 있다.

## Info

- 새 의존성 추가 시 번들 크기 영향을 확인한다. `bundlephobia.com`에서 패키지 크기를 사전 검토한다.
- devDependencies와 dependencies를 올바르게 구분한다.
