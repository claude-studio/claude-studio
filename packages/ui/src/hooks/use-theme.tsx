import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  toggleRef: React.RefObject<HTMLButtonElement | null>;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleRef: { current: null },
  toggle: () => {},
});

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove('dark', 'light');
  root.classList.add(theme);
  try {
    localStorage.setItem('theme', theme);
  } catch {}
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem('theme') as Theme) ?? 'dark';
    } catch {
      return 'dark';
    }
  });

  const toggleRef = useRef<HTMLButtonElement | null>(null);

  // 초기 테마 적용 (FOUC 방지 - index.html 인라인 스크립트가 이미 처리하지만 안전장치)
  useEffect(() => {
    applyTheme(theme);
  }, []);

  const toggle = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';

    // View Transition API 미지원 환경 fallback
    if (!document.startViewTransition) {
      applyTheme(next);
      setTheme(next);
      return;
    }

    // 토글 버튼의 화면 좌표 계산
    const btn = toggleRef.current;
    const rect = btn?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

    // 화면 모서리까지의 최대 반지름
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = document.startViewTransition(() => {
      applyTheme(next);
      setTheme(next);
    });

    const goingDark = next === 'dark';

    // 수축 모드 표시 (CSS z-index 제어용)
    if (!goingDark) {
      document.documentElement.setAttribute('data-theme-shrink', '');
    }

    transition.ready.then(() => {
      if (goingDark) {
        // 라이트 → 다크: 새 다크 뷰가 원형으로 확장
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 680,
            easing: 'cubic-bezier(0.25, 0, 0.3, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        );
      } else {
        // 다크 → 라이트: 기존 다크 뷰가 원형으로 수축하며 라이트 노출
        document.documentElement.animate(
          {
            clipPath: [
              `circle(${endRadius}px at ${x}px ${y}px)`,
              `circle(0px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 680,
            easing: 'cubic-bezier(0.25, 0, 0.3, 1)',
            pseudoElement: '::view-transition-old(root)',
          },
        );
      }
    });

    transition.finished.then(() => {
      document.documentElement.removeAttribute('data-theme-shrink');
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleRef, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
