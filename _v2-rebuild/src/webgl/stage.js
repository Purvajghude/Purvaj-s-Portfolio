/* ============================================================
   STAGE STORE - see DESIGN_CONTRACT.md Appendix A.1
   A tiny external store (no Context, no provider) that tracks
   which page section owns the 3D scene right now.
   Sections attach the ref callback from useStageTrigger to
   their root element. An IntersectionObserver whose root box
   is collapsed to the viewport midline reports the crossing.
   Section 4 bans window scroll listeners, so there are none.
   ============================================================ */

import { useCallback, useRef } from 'react';

export const STAGES = ['hero', 'work', 'process', 'signals', 'closing'];

let currentStage = STAGES[0];
const listeners = new Set();

/** Current stage id. Stable string, safe as a useSyncExternalStore snapshot. */
export function getStage() {
  return currentStage;
}

/** Subscribe to stage changes. Returns an unsubscribe function. */
export function subscribe(fn) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function setStage(next) {
  if (next === currentStage) return;
  if (STAGES.indexOf(next) === -1) return;
  currentStage = next;
  listeners.forEach((fn) => fn());
}

/* Collapsing the root box to a zero height line at the viewport
   midpoint means "intersecting" is exactly "crossing the middle". */
const OBSERVER_OPTIONS = {
  rootMargin: '-50% 0px -50% 0px',
  threshold: 0,
};

/**
 * Returns a ref callback. Attach it to a section root:
 *   const stageRef = useStageTrigger('work');
 *   <section ref={stageRef}>
 * Handles a null node, disconnects on unmount, and is safe to
 * re-attach because it tears down the previous observer first.
 */
export function useStageTrigger(stage) {
  const observerRef = useRef(null);

  return useCallback(
    (node) => {
      const previous = observerRef.current;
      if (previous) {
        previous.disconnect();
        observerRef.current = null;
      }

      // React 18 style detach, SSR, or a browser without the API.
      if (!node || typeof IntersectionObserver === 'undefined') return undefined;

      const observer = new IntersectionObserver((entries) => {
        for (let i = 0; i < entries.length; i += 1) {
          if (entries[i].isIntersecting) setStage(stage);
        }
      }, OBSERVER_OPTIONS);

      observer.observe(node);
      observerRef.current = observer;

      // React 19 ref cleanup. Returning this means React never
      // calls us with null, so both teardown paths are covered.
      return () => {
        observer.disconnect();
        if (observerRef.current === observer) observerRef.current = null;
      };
    },
    [stage],
  );
}
