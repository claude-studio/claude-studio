---
description: 접근성(Accessibility) 규칙 — UI 컴포넌트 및 페이지 작성 시 적용
globs: ["apps/studio/src/renderer/**/*.tsx", "packages/ui/**/*.tsx"]
---

# 접근성 (Accessibility) 규칙

## Critical

- 모든 인터랙티브 요소(`<button>`, `<a>`, `<input>`)에는 접근 가능한 레이블이 있어야 한다.
  - 텍스트 콘텐츠가 없는 경우 `aria-label` 또는 `aria-labelledby`를 반드시 제공한다.
- 이미지(`<img>`)에는 `alt` 속성을 반드시 포함한다. 장식용 이미지는 `alt=""`로 표시한다.
- `dangerouslySetInnerHTML` 사용을 금지한다. XSS 취약점뿐 아니라 스크린 리더 호환성 문제가 발생한다.

## Warning

- 색상만으로 정보를 전달하지 않는다. 아이콘·텍스트 등 보조 수단을 함께 사용한다.
- 키보드 내비게이션을 지원한다. `tabIndex`, `onKeyDown` 핸들러를 적절히 설정한다.
- `role` 속성을 올바르게 사용한다. 커스텀 컴포넌트에 의미 있는 ARIA role을 부여한다.

## Info

- Heading 레벨(`h1`–`h6`)을 순서대로 사용한다. 레벨을 건너뛰지 않는다.
- 포커스 표시(focus ring)를 제거하지 않는다. `outline: none` 단독 사용을 지양한다.
