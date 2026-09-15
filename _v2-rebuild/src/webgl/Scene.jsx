/* ============================================================
   CANVAS HOST
   This module is the lazy chunk. Three and the fiber reconciler
   only load once WebGLLayer has decided a live canvas is worth
   mounting, so nothing here can block LCP.
   ============================================================ */

import { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';

import PointField from './PointField.jsx';

const DPR = [1, 2];

const GL_BASE = {
  antialias: false,
  powerPreference: 'high-performance',
  alpha: true,
  stencil: false,
  depth: true,
};

const GL_PROPS = { ...GL_BASE, preserveDrawingBuffer: false };

const CAMERA_PROPS = {
  fov: 42,
  near: 0.1,
  far: 60,
  position: [0, 0, 10],
};

/* R3F sizes its own wrapper with position:relative and width/height 100%,
   then measures it to size the drawing buffer. Overriding that with
   position:absolute and no width/height left the canvas at its intrinsic
   300x150 forever, so the layer rendered into a tiny box in the corner.
   .webgl-layer already supplies the fixed inset-0 box and pointer-events:none,
   so the only thing worth setting here is the display mode. */
const CANVAS_STYLE = { display: 'block' };

/**
 * R3F sizes its drawing buffer from a ResizeObserver on its wrapper. Some
 * environments never deliver that callback (embedded webviews, some headless
 * and preview browsers), and the canvas is then stranded at its intrinsic
 * 300x150 and upscaled, which looks like the 3D layer is simply missing.
 *
 * This layer is always exactly the viewport, so its size does not need to be
 * measured at all. Setting it directly is both cheaper and more reliable.
 * Listening to 'resize' is fine here; only 'scroll' listeners are banned.
 */
function ViewportSize() {
  const setSize = useThree((s) => s.setSize);
  const invalidate = useThree((s) => s.invalidate);
  const size = useThree((s) => s.size);

  useEffect(() => {
    const apply = () => {
      setSize(window.innerWidth, window.innerHeight);
      // Under frameloop 'demand' a resize alone never repaints, so the
      // reduced motion path would keep showing its first, wrongly sized frame.
      invalidate();
    };
    apply();
    window.addEventListener('resize', apply, { passive: true });
    return () => window.removeEventListener('resize', apply);
  }, [setSize, invalidate]);

  // Correct a stale or missing measurement that settled after mount.
  useEffect(() => {
    if (size.width !== window.innerWidth || size.height !== window.innerHeight) {
      setSize(window.innerWidth, window.innerHeight);
      invalidate();
    }
  }, [size.width, size.height, setSize, invalidate]);

  return null;
}

function onCreated(state) {
  state.gl.setClearAlpha(0);
}

/**
 * running false parks the render loop: tab hidden, layer off
 * screen, or reduced motion. "demand" means nothing renders until
 * something asks, which is how the reduced motion path draws its
 * single hero frame and then stops.
 */
export default function Scene({ running, reduced }) {
  return (
    <Canvas
      dpr={DPR}
      frameloop={running ? 'always' : 'demand'}
      gl={GL_PROPS}
      camera={CAMERA_PROPS}
      style={CANVAS_STYLE}
      onCreated={onCreated}
    >
      <ViewportSize />
      <PointField reduced={reduced} />
    </Canvas>
  );
}
