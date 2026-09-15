import { useCallback, useEffect, useState } from 'react';

const KEY = 'pg-theme';
const media = () => window.matchMedia('(prefers-color-scheme: dark)');

function readStored() {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    // Private mode, blocked site data, or a browser that throws on access.
    // Falling back to the system preference is always safe.
    return null;
  }
}

function writeStored(value) {
  try {
    if (value) localStorage.setItem(KEY, value);
    else localStorage.removeItem(KEY);
  } catch {
    // Persistence is a convenience, never a correctness requirement.
  }
}

function apply(choice) {
  const root = document.documentElement;
  if (choice) root.setAttribute('data-theme', choice);
  else root.removeAttribute('data-theme');
}

/**
 * Theme controller. `choice` is 'light' | 'dark' | null, where null means
 * follow the system. `resolved` is the theme actually on screen, which the
 * toggle icon reflects.
 *
 * The WebGL layer watches the data-theme attribute and the prefers-color-scheme
 * media query independently, so it stays in sync without a shared provider.
 */
export default function useTheme() {
  const [choice, setChoice] = useState(readStored);
  const [systemDark, setSystemDark] = useState(
    () => typeof window !== 'undefined' && media().matches
  );

  useEffect(() => {
    const mq = media();
    const onChange = (e) => setSystemDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    apply(choice);
  }, [choice]);

  const resolved = choice ?? (systemDark ? 'dark' : 'light');

  /**
   * Toggle with a circular wipe originating at the click point.
   * Justification (contract section 4): state transition. The wipe shows the
   * new theme arriving from where the user acted, instead of the page blinking.
   */
  const toggle = useCallback(
    (event) => {
      const next = resolved === 'dark' ? 'light' : 'dark';
      writeStored(next);

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce || !document.startViewTransition) {
        setChoice(next);
        return;
      }

      const x = event?.clientX ?? window.innerWidth / 2;
      const y = event?.clientY ?? 0;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = document.startViewTransition(() => setChoice(next));
      transition.ready.then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: 620,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      }).catch(() => {
        // A cancelled view transition is not an error worth surfacing.
      });
    },
    [resolved]
  );

  return { choice, resolved, toggle };
}
