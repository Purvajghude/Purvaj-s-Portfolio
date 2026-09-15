/* ============================================================
   WEBGL LAYER - see DESIGN_CONTRACT.md Appendix A.1, section 11
   Mounts once in App.jsx. No props, self contained: it reads the
   theme and the stage on its own.

   It decides whether a live canvas is appropriate at all:
     under 768px          static CSS fallback
     no WebGL context     static CSS fallback
     reduced motion       canvas, one frame, then stopped
     tab hidden           render loop parked
     layer off screen     render loop parked
   ============================================================ */

import { lazy, Suspense, useEffect, useRef, useState } from 'react';

import './webgl-layer.css';

const Scene = lazy(() => import('./Scene.jsx'));

const DESKTOP_QUERY = '(min-width: 768px)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

/* Probed once, lazily, and cached. Creating a throwaway context is
   the only honest way to know. The context is released straight
   after so it never counts against the browser context limit. */
let webglSupport = null;

function supportsWebGL() {
  if (webglSupport !== null) return webglSupport;
  if (typeof document === 'undefined') return false;

  try {
    const probe = document.createElement('canvas');
    const context =
      probe.getContext('webgl2') ||
      probe.getContext('webgl') ||
      probe.getContext('experimental-webgl');

    if (!context) {
      webglSupport = false;
      return false;
    }

    const lose = context.getExtension('WEBGL_lose_context');
    if (lose) lose.loseContext();
    webglSupport = true;
  } catch {
    webglSupport = false;
  }

  return webglSupport;
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const media = window.matchMedia(query);
    const sync = () => setMatches(media.matches);
    sync();

    if (media.addEventListener) {
      media.addEventListener('change', sync);
      return () => media.removeEventListener('change', sync);
    }

    media.addListener(sync);
    return () => media.removeListener(sync);
  }, [query]);

  return matches;
}

export default function WebGLLayer() {
  const hostRef = useRef(null);

  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const prefersReduced = useMediaQuery(REDUCED_QUERY);

  const [deferred, setDeferred] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [onScreen, setOnScreen] = useState(true);

  /* Hold the heavy chunk back until the main thread is quiet, so
     the 3D layer can never be on the critical path for LCP. */
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    if (typeof window.requestIdleCallback === 'function') {
      const handle = window.requestIdleCallback(() => setDeferred(true), { timeout: 1500 });
      return () => window.cancelIdleCallback(handle);
    }

    const handle = window.setTimeout(() => setDeferred(true), 600);
    return () => window.clearTimeout(handle);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    const sync = () => setDocumentVisible(!document.hidden);
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  useEffect(() => {
    const node = hostRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (let i = 0; i < entries.length; i += 1) {
          setOnScreen(entries[i].isIntersecting);
        }
      },
      { threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const canRender = deferred && isDesktop && supportsWebGL();
  /* Reduced motion does NOT park the loop. PointField's reduced branch snaps
     its uniforms and returns without advancing time, tweening positions, or
     applying pointer parallax, so the rendered image is completely static and
     honours the preference. Parking the loop instead meant the one drawn frame
     was discarded by the compositor and the layer silently went blank, which
     is how reduced motion users lost the visual entirely. */
  const running = canRender && documentVisible && onScreen;

  return (
    <div className="webgl-layer" ref={hostRef} aria-hidden="true">
      {canRender ? (
        <Suspense fallback={null}>
          <Scene running={running} reduced={prefersReduced} />
        </Suspense>
      ) : (
        <div className="webgl-layer__fallback" />
      )}
    </div>
  );
}
