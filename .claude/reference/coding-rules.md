# 코딩 규칙

모든 패키지·앱에 공통 적용되는 규칙. 도메인별 세부 규칙은 각 레퍼런스 문서의 `## 코딩 규칙` 섹션 참조.

---

## TypeScript

- **`any` 사용 금지** — 타입을 알 수 없는 경우 `unknown` 사용 후 타입 가드로 좁힌다
- **`unknown` 지양** — 가능하면 정확한 타입으로 명시. 불가피한 경우에만 허용
- **타입 단언(`as`) 최소화** — 불가피한 경우 주석으로 이유 명시
- **외부 데이터 타입은 Zod 스키마 우선** — Zod 스키마 먼저 작성 후 `z.infer<>` 로 타입 추출

---

## ESLint

- **`eslint-disable` 주석 사용 금지** — 린트 오류는 코드를 수정해서 해결한다. 단, 아래 두 가지는 허용:
  - 자동 생성 파일(`routeTree.gen.ts` 등) — 빌드 도구가 생성하므로 수정 불가
  - 비정형 외부 데이터 파싱(`AnyMessage`, `readStatsCache` 등) — Zod 스키마 미적용 구간에서 `any` 불가피. 반드시 이유 주석 명시
- **`require()` 사용 금지** — ESM `import` 구문으로 대체. `@typescript-eslint/no-require-imports` 규칙으로 강제
- **빈 catch 블록 금지** — 설명 주석을 추가한다 (`catch {}`는 허용, 파라미터 불필요)
- **미사용 import 금지** — `unused-imports` 플러그인이 에러로 처리. import 정리 필수
- **import 순서** — `simple-import-sort` 규칙 준수. `pnpm run lint -- --fix`로 자동 수정

---

## 패키지 설정

- **`"type": "module"` 필수** — 모든 패키지·앱의 `package.json`에 명시. ESLint flat config(`eslint.config.js`)가 ESM으로 동작하려면 필요. 단, `packages/typescript-config`는 JSON 파일만 export하는 설정 패키지이므로 예외
- **Electron preload는 `.cjs` 출력** — `apps/studio`의 `"type": "module"` 환경에서 Node.js가 `.js`를 ESM으로 해석하므로, preload 번들은 반드시 `.cjs`로 출력해야 `require`가 동작한다. `electron.vite.config.ts`의 preload `build.rollupOptions.output`에 `format: 'cjs'`, `entryFileNames: '[name].cjs'` 설정, `main/index.ts`의 preload 경로도 `index.cjs`로 맞춰야 한다
- **eslint.config.js 필수** — 패키지 생성 시 `@repo/eslint-config/base` 또는 `@repo/eslint-config/react-internal` 상속하는 `eslint.config.js` 추가

---

## 의존성 관리

- 2개 이상의 패키지/앱에서 사용하는 의존성은 `pnpm-workspace.yaml`의 `catalog:`에 버전 등록
- 각 `package.json`에서는 `"catalog:"` 로 참조
- 단일 패키지 전용 의존성은 해당 `package.json`에 직접 버전 명시
- 루트 `package.json`은 최소화 — `turbo`, `husky`, `lint-staged` 등 레포 레벨 도구만 허용

---

## 패키지 격리

- **`packages/ui`에서 라우터 import 금지** — `@tanstack/react-router`의 `Link`, `useNavigate` 등 사용 불가
- **`packages/ui`는 프리미티브 전용** — shadcn 컴포넌트, 차트, 훅, 유틸만 export. Page 컴포넌트 export 금지
- **페이지 컴포넌트는 앱 내부에** — `apps/studio/src/renderer/src/pages/` 또는 `widgets/`에 작성

---

## Git / 커밋

- **커밋 메시지 형식**: `type(scope): 설명` — commitlint(`@commitlint/config-conventional`)로 강제
- **subject 대소문자**: subject(설명 부분)는 대문자로 시작하면 안 됨 (`subject-case` 규칙). 한글로 시작하거나 소문자 영어로 시작해야 함. 예: `feat: 새 기능 추가` ✅, `feat: ESM 전환` ❌ → `feat: esm 전환` ✅
- **pre-commit**: lint-staged 자동 실행 — 패키지별 `turbo run lint --filter` + typecheck + prettier
- **`eslint-disable` 포함 커밋 불가** — pre-commit lint에서 차단됨
