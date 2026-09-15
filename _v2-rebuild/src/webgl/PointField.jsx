/* ============================================================
   THE POINT FIELD
   One geometry for the entire site. It mounts once and only
   ever morphs. Stage changes swap the target coordinate set,
   nothing is created or destroyed.

   Rules held here:
   - zero allocation inside useFrame
   - pointer values live in a ref, never in state
   - reduced motion draws one static hero frame and stops
   - geometry and material are disposed on unmount
   ============================================================ */

import { useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DynamicDrawUsage,
  NormalBlending,
  Points,
  ShaderMaterial,
  SRGBColorSpace,
} from 'three';

import { getStage, subscribe } from './stage.js';
import { createPointAttributes, createStageTargets, POINT_COUNT } from './targets.js';
import { observeSceneTheme, readSceneTheme } from './theme.js';

/* Per frame damping factors, expressed at 60fps and converted to
   a frame rate independent factor before use. */
const MORPH_DAMP = 0.035;
const COLOR_DAMP = 0.05;
const LOOK_DAMP = 0.04;
const POINTER_DAMP = 0.06;
const SPIN_SETTLE_DAMP = 0.02;

const SETTLED_EPSILON = 0.002;
const TWO_PI = Math.PI * 2;

/* Per stage character. spin is radians per second. A spin of 0
   means the field also unwinds to its nearest whole turn, so the
   flat stages always come to rest square to the camera. */
const STAGE_LOOK = {
  hero: { spin: 0.085, tilt: 0.2, parallax: 1, drift: 0.045, size: 2.35 },
  work: { spin: 0, tilt: 0.04, parallax: 0.55, drift: 0.03, size: 2.15 },
  process: { spin: 0.014, tilt: 0.1, parallax: 0.7, drift: 0.026, size: 2.2 },
  signals: { spin: 0.03, tilt: 0.08, parallax: 0.9, drift: 0.06, size: 2.05 },
  closing: { spin: 0.06, tilt: 0.14, parallax: 0.75, drift: 0.035, size: 2.6 },
};

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uDpr;
  uniform float uSize;
  uniform float uDrift;

  attribute float aSeed;
  attribute float aAccent;
  attribute float aSize;

  varying float vAccent;
  varying float vFade;

  void main() {
    vec3 p = position;

    // Idle breath. Runs on the GPU so a settled field still has
    // life without re-uploading the position buffer every frame.
    float s = aSeed * 6.2831853;
    p.x += sin(uTime * 0.35 + s) * uDrift;
    p.y += cos(uTime * 0.29 + s * 1.7) * uDrift;
    p.z += sin(uTime * 0.23 + s * 2.3) * uDrift;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float dist = max(-mv.z, 0.001);

    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aSize * uDpr * (8.0 / dist);

    vAccent = aAccent;
    vFade = clamp((dist - 6.0) / 15.0, 0.0, 1.0);
  }
`;

/* Square points, no falloff mask, no halo. Hard edges only. */
const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform vec3 uInk;
  uniform float uOpacity;

  varying float vAccent;
  varying float vFade;

  void main() {
    vec3 c = mix(uColor, uAccent, vAccent);
    c = mix(c, uInk, vFade * 0.7);
    float a = uOpacity * (1.0 - vFade * 0.55);
    gl_FragColor = vec4(c, a);
    #include <colorspace_fragment>
  }
`;

function applyTriple(color, triple) {
  color.setRGB(triple[0] / 255, triple[1] / 255, triple[2] / 255, SRGBColorSpace);
}

/* Frame rate independent form of "move factor f of the way each
   frame at 60fps". Cheap enough to call a handful of times. */
function damping(factor, dt) {
  return 1 - Math.pow(1 - factor, dt * 60);
}

export default function PointField({ reduced }) {
  const stage = useSyncExternalStore(subscribe, getStage, getStage);

  const invalidate = useThree((state) => state.invalidate);
  const gl = useThree((state) => state.gl);

  const groupRef = useRef(null);

  /* --- one time construction ------------------------------- */

  const targets = useMemo(() => createStageTargets(POINT_COUNT), []);

  const geometry = useMemo(() => {
    const attrs = createPointAttributes(POINT_COUNT);
    const positions = new Float32Array(POINT_COUNT * 3);
    positions.set(targets.hero);

    const geo = new BufferGeometry();
    const positionAttribute = new BufferAttribute(positions, 3);
    positionAttribute.setUsage(DynamicDrawUsage);
    geo.setAttribute('position', positionAttribute);
    geo.setAttribute('aSeed', new BufferAttribute(attrs.seed, 1));
    geo.setAttribute('aAccent', new BufferAttribute(attrs.accent, 1));
    geo.setAttribute('aSize', new BufferAttribute(attrs.size, 1));
    return geo;
  }, [targets]);

  const material = useMemo(() => {
    const theme = readSceneTheme();
    const uColor = new Color();
    const uAccent = new Color();
    const uInk = new Color();
    applyTriple(uColor, theme.base);
    applyTriple(uAccent, theme.accent);
    applyTriple(uInk, theme.ink);

    return new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uDpr: { value: 1 },
        uSize: { value: STAGE_LOOK.hero.size },
        uDrift: { value: reduced ? 0 : STAGE_LOOK.hero.drift },
        uColor: { value: uColor },
        uAccent: { value: uAccent },
        uInk: { value: uInk },
        uOpacity: { value: theme.opacity },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      // Normal, never additive. Additive is the glow look this
      // site rejects, so it is ruled out explicitly.
      blending: NormalBlending,
    });
  }, [reduced]);

  const points = useMemo(() => {
    const p = new Points(geometry, material);
    p.frustumCulled = false;
    p.matrixAutoUpdate = false;
    p.updateMatrix();
    return p;
  }, [geometry, material]);

  /* --- mutable frame state, never rendered ----------------- */

  const stageRef = useRef(stage);
  const targetRef = useRef(targets.hero);
  const morphingRef = useRef(false);
  const timeRef = useRef(0);
  const spinRef = useRef(0);
  const tiltRef = useRef(STAGE_LOOK.hero.tilt);
  const pointerRef = useRef({ x: 0, y: 0 });
  const easedPointerRef = useRef({ x: 0, y: 0 });
  /* Seeded from the tokens at construction so the very first
     frame is already the right palette, never a black flash. */
  const colorTarget = useMemo(() => {
    const theme = readSceneTheme();
    const target = {
      base: new Color(),
      accent: new Color(),
      ink: new Color(),
      opacity: theme.opacity,
    };
    applyTriple(target.base, theme.base);
    applyTriple(target.accent, theme.accent);
    applyTriple(target.ink, theme.ink);
    return target;
  }, []);

  /* --- theme ------------------------------------------------ */

  useEffect(() => {
    const sync = () => {
      const theme = readSceneTheme();
      applyTriple(colorTarget.base, theme.base);
      applyTriple(colorTarget.accent, theme.accent);
      applyTriple(colorTarget.ink, theme.ink);
      colorTarget.opacity = theme.opacity;
      // While the loop is parked nothing renders unless we ask.
      invalidate();
    };

    sync();
    return observeSceneTheme(sync);
  }, [colorTarget, invalidate]);

  /* --- stage ------------------------------------------------ */

  useEffect(() => {
    stageRef.current = stage;
    if (reduced) return;
    targetRef.current = targets[stage] || targets.hero;
    morphingRef.current = true;
  }, [reduced, stage, targets]);

  /* --- pointer parallax, ref driven ------------------------- */

  useEffect(() => {
    if (reduced) return undefined;

    const onPointerMove = (event) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      pointerRef.current.x = (event.clientX / w) * 2 - 1;
      pointerRef.current.y = (event.clientY / h) * 2 - 1;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [reduced]);

  /* --- one static frame when motion is not wanted ----------- */

  useEffect(() => {
    if (!reduced) return;
    const group = groupRef.current;
    if (group) {
      group.rotation.set(STAGE_LOOK.hero.tilt, 0, 0);
      group.position.set(0, 0, 0);
    }
    material.uniforms.uTime.value = 0;
    material.uniforms.uDrift.value = 0;
    material.uniforms.uSize.value = STAGE_LOOK.hero.size;
    material.uniforms.uDpr.value = gl.getPixelRatio();
    invalidate();
  }, [gl, invalidate, material, reduced]);

  /* --- disposal --------------------------------------------- */

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  /* --- the loop --------------------------------------------- */

  useFrame((_state, delta) => {
    const uniforms = material.uniforms;
    uniforms.uDpr.value = gl.getPixelRatio();

    if (reduced) {
      // Snap, do not tween. In this mode the loop is parked and
      // this only runs on the single invalidated frame.
      uniforms.uColor.value.copy(colorTarget.base);
      uniforms.uAccent.value.copy(colorTarget.accent);
      uniforms.uInk.value.copy(colorTarget.ink);
      uniforms.uOpacity.value = colorTarget.opacity;
      return;
    }

    const dt = delta > 0.05 ? 0.05 : delta;
    const look = STAGE_LOOK[stageRef.current] || STAGE_LOOK.hero;

    timeRef.current += dt;
    uniforms.uTime.value = timeRef.current;

    /* theme tween, so the toggle reads as continuous */
    const cf = damping(COLOR_DAMP, dt);
    uniforms.uColor.value.lerp(colorTarget.base, cf);
    uniforms.uAccent.value.lerp(colorTarget.accent, cf);
    uniforms.uInk.value.lerp(colorTarget.ink, cf);
    uniforms.uOpacity.value += (colorTarget.opacity - uniforms.uOpacity.value) * cf;

    /* stage character tween */
    const lf = damping(LOOK_DAMP, dt);
    uniforms.uSize.value += (look.size - uniforms.uSize.value) * lf;
    uniforms.uDrift.value += (look.drift - uniforms.uDrift.value) * lf;
    tiltRef.current += (look.tilt - tiltRef.current) * lf;

    /* spin, or unwind to the nearest whole turn on flat stages */
    if (look.spin > 0) {
      spinRef.current += dt * look.spin;
    } else {
      const nearest = Math.round(spinRef.current / TWO_PI) * TWO_PI;
      spinRef.current += (nearest - spinRef.current) * damping(SPIN_SETTLE_DAMP, dt);
    }

    /* pointer parallax */
    const pf = damping(POINTER_DAMP, dt);
    const eased = easedPointerRef.current;
    eased.x += (pointerRef.current.x - eased.x) * pf;
    eased.y += (pointerRef.current.y - eased.y) * pf;

    const group = groupRef.current;
    if (group) {
      const p = look.parallax;
      group.rotation.y = spinRef.current + eased.x * 0.22 * p;
      group.rotation.x = tiltRef.current + eased.y * 0.14 * p;
      group.position.x = eased.x * -0.3 * p;
      group.position.y = eased.y * 0.2 * p;
    }

    /* morph toward the active stage target */
    if (!morphingRef.current) return;

    const positionAttribute = geometry.attributes.position;
    const live = positionAttribute.array;
    const target = targetRef.current;
    const mf = damping(MORPH_DAMP, dt);
    let maxDelta = 0;

    for (let i = 0; i < live.length; i += 1) {
      const d = target[i] - live[i];
      live[i] += d * mf;
      const ad = d < 0 ? -d : d;
      if (ad > maxDelta) maxDelta = ad;
    }

    if (maxDelta < SETTLED_EPSILON) {
      live.set(target);
      morphingRef.current = false;
    }

    positionAttribute.needsUpdate = true;
  });

  /* The group carries every transform. The Points object itself
     stays at identity with matrixAutoUpdate off. */
  return (
    <group ref={groupRef}>
      <primitive object={points} />
    </group>
  );
}
