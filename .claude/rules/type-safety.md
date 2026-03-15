---
description: TypeScript 타입 안전성 규칙 — 모든 TS/TSX 파일에 적용
globs: ["**/*.{ts,tsx}"]
---

# 타입 안전성 규칙

## Critical

- `any` 타입 사용을 금지한다. 불가피한 경우 `unknown`을 사용하고 타입 가드로 좁힌다.
- `var` 키워드 사용을 금지한다. `const` 또는 `let`을 사용한다.
- `== null` 또는 `!= null` 대신 `=== null` 또는 `!== null`을 사용한다 (strict equality).
- `catch` 블록에서 에러를 무시(silent swallow)하지 않는다. 최소한 로깅하거나 재throw한다.

## Warning

- 함수 반환 타입을 명시적으로 선언한다. 특히 public API 함수는 반환 타입을 생략하지 않는다.
- 타입 단언(`as`)보다 타입 가드(`is`, `in`, `instanceof`)를 우선 사용한다.
- 제네릭 타입 파라미터에 의미 있는 이름을 부여한다 (`T` 대신 `TData`, `TError` 등).

## Info

- `@ts-ignore` 또는 `@ts-expect-error` 사용 시 사유를 주석으로 남긴다.
- 유틸리티 타입(`Partial`, `Pick`, `Omit` 등)을 적극 활용하여 타입 중복을 줄인다.
