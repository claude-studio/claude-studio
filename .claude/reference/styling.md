# 스타일링

## 코딩 규칙

- **JS config 없음** — `tailwind.config.js` 절대 생성하지 말 것
- 새 색상/토큰 추가 시 `globals.css`의 `@theme inline` 블록에 CSS 변수로 추가
- 다크 모드는 `dark:` prefix 사용 (`.dark` 클래스 기반, `@custom-variant dark` 정의됨)
- shadcn 컴포넌트 추가 시 `packages/ui/src/components/ui/`에 배치

---

## Tailwind CSS v4

JS config(`tailwind.config.js`) 없음. CSS-first 방식.

```css
/* packages/ui/src/globals.css */
@import 'tailwindcss';
@import 'tw-animate-css';

@source ".";

/* class 기반 다크 모드 */
@custom-variant dark (&:is(.dark *));

/* CSS 변수 → Tailwind 토큰 매핑 */
@theme inline {
  --color-background: var(--background);
  --color-primary: var(--primary);
  /* ... */
  --color-claude-orange: #d4764e;
  --color-claude-orange-light: #e8956e;
  --color-claude-cream: #faf9f6;
  --color-claude-warm: #f5f0eb;
}
```

소비자 앱에서 반드시 import:

```ts
import '@repo/ui/globals.css';
```

## 테마 색상

### Light 모드 (`:root`)

| 변수                 | 값                       | 용도          |
| -------------------- | ------------------------ | ------------- |
| `--background`       | `#F7F6F2`                | 배경          |
| `--foreground`       | `#0D0D0F`                | 텍스트        |
| `--primary`          | `#C4643A`                | Claude 오렌지 |
| `--card`             | `rgba(255,255,255,0.85)` | 카드 배경     |
| `--muted-foreground` | `#6E6B65`                | 보조 텍스트   |

### Dark 모드 (`.dark`)

| 변수           | 값                        | 용도                 |
| -------------- | ------------------------- | -------------------- |
| `--background` | `#07070A`                 | 배경                 |
| `--foreground` | `#EDEBE7`                 | 텍스트               |
| `--primary`    | `#E8834E`                 | Claude 오렌지 (밝게) |
| `--card`       | `rgba(255,255,255,0.035)` | 카드 배경            |

### 커스텀 색상

- `--color-claude-orange`: `#D4764E` → `bg-claude-orange`, `text-claude-orange`
- `--color-claude-orange-light`: `#E8956E`
- `--color-claude-cream`: `#FAF9F6`
- `--color-claude-warm`: `#F5F0EB`

## Glass Morphism

`.card-glass` 유틸리티 클래스:

```css
/* Light (기본) */
.card-glass {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  border-color: rgba(0, 0, 0, 0.07);
}

/* Dark */
.dark .card-glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border-color: rgba(255, 255, 255, 0.07);
}
```

사용 패턴:

```tsx
<div className="card-glass relative rounded-xl border overflow-hidden">
```

## 배경 앰비언트 글로우

`.dark body::before` — 다크 모드 전용, radial-gradient 2개 (오렌지 + 블루):

```css
.dark body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(ellipse 60% 45% at 12% 0%, rgba(232, 131, 78, 0.09) 0%, transparent 65%),
    radial-gradient(ellipse 40% 30% at 90% 100%, rgba(100, 160, 200, 0.05) 0%, transparent 60%);
}
```

## View Transition (테마 전환)

`useTheme()` → `toggle()` 에서 `document.startViewTransition()` 사용.

- 라이트→다크: `::view-transition-new(root)` 원형 확장
- 다크→라이트: `::view-transition-old(root)` 원형 수축
- duration: 680ms, easing: `cubic-bezier(0.25, 0, 0.3, 1)`
- 미지원 브라우저: 즉시 클래스 전환 fallback

## 자주 쓰는 패턴

```tsx
// 카드 타이틀
<p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
  제목
</p>

// StatCard featured (좌측 accent bar)
<StatCard featured className="bg-primary/10" />

// 미묘한 primary 강조
<div className="bg-primary/10 text-primary border-primary/20" />

// 사이드바 활성 상태
<NavItem className="bg-primary/10 text-primary" />

// 보조 텍스트
<span className="text-xs text-muted-foreground" />
```

## 스크롤바

```css
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--muted-foreground);
}
```

## 반응형

- 모바일 기준: 768px (`useIsMobile()` 훅에서 `matchMedia('(max-width: 767px)')`)
- Electron 앱은 반응형보다 고정 레이아웃 위주
