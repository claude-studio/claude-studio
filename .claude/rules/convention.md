---
description: 코드 컨벤션 규칙 — 전체 코드베이스에 적용
globs: ["**/*.{ts,tsx}"]
---

# 코드 컨벤션 규칙

## Critical

- `console.log` / `console.debug` 등 디버그 코드를 커밋하지 않는다. 로깅이 필요하면 전용 logger를 사용한다.
- 전역 mutable state(모듈 스코프 `let`/`var` 변수)를 사용하지 않는다. 상태는 적절한 스토어 또는 컨텍스트로 관리한다.

## Warning

- React 컴포넌트에서 인라인 스타일(`style={{}}`)을 사용하지 않는다. Tailwind CSS 클래스를 사용한다.
- `useEffect` 내에서 타이머(`setInterval`, `setTimeout`)를 사용할 때 cleanup 함수를 반드시 반환한다.
- 동적 리스트의 `key` prop에 배열 인덱스를 사용하지 않는다. 고유 식별자를 사용한다.
- `Array.sort()`는 원본 배열을 변경(mutate)한다. `[...arr].sort()` 또는 `toSorted()`를 사용한다.
- 불필요한 중복 API 호출을 피한다. 동일 데이터를 여러 번 fetch하지 않는다.

## Info

- `useMemo` / `useCallback`을 적절히 사용하여 불필요한 재계산과 리렌더를 방지한다.
- 컴포넌트 파일 하나에 하나의 exported 컴포넌트만 선언한다 (헬퍼 컴포넌트는 예외).
