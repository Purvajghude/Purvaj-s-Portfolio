/* ============================================================
   src/scroll/env.js
   Shared environment helpers for the GSAP scroll primitives.
   Local to src/scroll. GSAP only, no Motion, no scroll listeners.
   ============================================================ */

import { useCallback, useEffect, useLayoutEffect, useSyncExternalStore } from 'react';

/* useLayoutEffect is required so GSAP measures after the DOM is laid out
   but before paint. Fall back to useEffect if there is ever no window. */
export const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/* One MediaQueryList per query, reused across every consumer. */
const lists = new Map();

function listFor(query) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return null;
  }
  let mql = lists.get(query);
  if (!mql) {
    mql = window.matchMedia(query);
    lists.set(query, mql);
  }
  return mql;
}

/* Media queries through useSyncExternalStore, so the very first render
   already knows the answer and we never register a ScrollTrigger that
   we would immediately have to tear down. */
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (onStoreChange) => {
      const mql = listFor(query);
      if (!mql) return () => {};
      if (typeof mql.addEventListener === 'function') {
        mql.addEventListener('change', onStoreChange);
        return () => mql.removeEventListener('change', onStoreChange);
      }
      mql.addListener(onStoreChange);
      return () => mql.removeListener(onStoreChange);
    },
    [query]
  );

  const getSnapshot = useCallback(() => {
    const mql = listFor(query);
    return mql ? mql.matches : false;
  }, [query]);

  /* Without a window, assume the calm layout. */
  const getServerSnapshot = useCallback(() => true, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/* Late webfont metrics change every pinned distance. Ask ScrollTrigger to
   remeasure once the display face is actually on screen. */
export function refreshWhenFontsReady(ScrollTrigger) {
  if (typeof document === 'undefined' || !document.fonts || !document.fonts.ready) {
    return () => {};
  }
  let cancelled = false;
  document.fonts.ready.then(() => {
    if (!cancelled) ScrollTrigger.refresh();
  });
  return () => {
    cancelled = true;
  };
}

export function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}
