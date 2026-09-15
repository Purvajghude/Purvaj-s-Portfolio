/* ============================================================
   STAGE TARGETS
   One point field for the whole site. It never unmounts and it
   never changes count. Each stage is nothing but a different
   set of destination coordinates that the live positions are
   damped toward.

   Everything here runs exactly once, at init. Nothing in this
   file is allowed to be called from useFrame.
   ============================================================ */

import { Vector3 } from 'three';

import { STAGES } from './stage.js';

/* Inside the 9k to 14k budget from the brief. */
export const POINT_COUNT = 11000;

/* Camera sits at z 10 with a 42 degree fov, so the visible half
   height at the origin is about 3.84 units. Extents below are
   tuned against that: hero fits, signals deliberately bleeds. */
const KNOT_RADIUS = 2.4;
const KNOT_TUBE = 0.5;
const KNOT_P = 2;
const KNOT_Q = 3;

const PROCESS_LAYERS = 5;
const PROCESS_GAP = 1.35;

const ACCENT_SHARE = 0.11;

/* Deterministic PRNG so the field is identical on every load
   and between the static reduced motion frame and the live one. */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Cheap approximate normal distribution, std around 0.35. */
function gaussian(rand) {
  return (rand() + rand() + rand() + rand() - 2) * 0.6;
}

/* Matches the parametric curve THREE.TorusKnotGeometry uses. */
function knotPoint(u, out) {
  const cu = Math.cos(u);
  const su = Math.sin(u);
  const quOverP = (KNOT_Q / KNOT_P) * u;
  const cs = Math.cos(quOverP);
  return out.set(
    KNOT_RADIUS * (2 + cs) * 0.5 * cu,
    KNOT_RADIUS * (2 + cs) * 0.5 * su,
    KNOT_RADIUS * Math.sin(quOverP) * 0.5,
  );
}

function buildHero(arr, count, rand) {
  const point = new Vector3();
  const ahead = new Vector3();
  const tangent = new Vector3();
  const normal = new Vector3();
  const binormal = new Vector3();
  const up = new Vector3(0, 0, 1);
  const span = Math.PI * 2 * KNOT_P;

  for (let i = 0; i < count; i += 1) {
    const u = (i / count) * span + rand() * 0.0006;
    knotPoint(u, point);
    knotPoint(u + 0.01, ahead);

    tangent.subVectors(ahead, point).normalize();
    normal.crossVectors(tangent, up);
    if (normal.lengthSq() < 1e-6) normal.set(1, 0, 0);
    normal.normalize();
    binormal.crossVectors(tangent, normal).normalize();

    // sqrt keeps the tube solid rather than hollow at the rim.
    const r = KNOT_TUBE * Math.sqrt(rand());
    const a = rand() * Math.PI * 2;
    const ca = Math.cos(a) * r;
    const sa = Math.sin(a) * r;

    const o = i * 3;
    arr[o] = point.x + normal.x * ca + binormal.x * sa;
    arr[o + 1] = point.y + normal.y * ca + binormal.y * sa;
    arr[o + 2] = point.z + normal.z * ca + binormal.z * sa;
  }
}

/* A wide horizontal slab that echoes the horizontal pan. Long in
   x, very thin in y, some depth in z so it still reads as solid. */
function buildWork(arr, count, rand) {
  for (let i = 0; i < count; i += 1) {
    const o = i * 3;
    const t = i / count;
    // Slight density ripple along the band so it is not a flat wash.
    const ripple = Math.sin(t * Math.PI * 7) * 0.18;
    arr[o] = (rand() * 2 - 1) * 6.6;
    arr[o + 1] = gaussian(rand) * 0.62 + ripple;
    arr[o + 2] = (rand() * 2 - 1) * 2.2;
  }
}

/* Compressed into stacked horizontal planes. */
function buildProcess(arr, count, rand) {
  const half = (PROCESS_LAYERS - 1) / 2;
  for (let i = 0; i < count; i += 1) {
    const o = i * 3;
    const layer = i % PROCESS_LAYERS;
    arr[o] = (rand() * 2 - 1) * 5.2;
    arr[o + 1] = (layer - half) * PROCESS_GAP + gaussian(rand) * 0.07;
    arr[o + 2] = (rand() * 2 - 1) * 3.0;
  }
}

/* Dispersed. Sparse, wide, and allowed to run off the frame. */
function buildSignals(arr, count, rand) {
  for (let i = 0; i < count; i += 1) {
    const o = i * 3;
    arr[o] = (rand() * 2 - 1) * 9.0;
    arr[o + 1] = (rand() * 2 - 1) * 5.0;
    arr[o + 2] = (rand() * 2 - 1) * 5.6;
  }
}

/* Converged. One tight sphere, denser toward the core. */
function buildClosing(arr, count, rand) {
  for (let i = 0; i < count; i += 1) {
    const o = i * 3;
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(rand() * 2 - 1);
    const r = 1.5 * Math.pow(rand(), 0.55);
    const sp = Math.sin(phi);
    arr[o] = r * sp * Math.cos(theta);
    arr[o + 1] = r * sp * Math.sin(theta);
    arr[o + 2] = r * Math.cos(phi);
  }
}

const BUILDERS = {
  hero: buildHero,
  work: buildWork,
  process: buildProcess,
  signals: buildSignals,
  closing: buildClosing,
};

/** One Float32Array of xyz targets per stage id. */
export function createStageTargets(count) {
  const targets = {};
  for (let i = 0; i < STAGES.length; i += 1) {
    const stage = STAGES[i];
    const arr = new Float32Array(count * 3);
    // Per stage seed so stages do not correlate with each other.
    BUILDERS[stage](arr, count, mulberry32(0x9e3779b9 + i * 7919));
    targets[stage] = arr;
  }
  return targets;
}

/**
 * Static per point attributes.
 *  seed   drives the shader side idle drift so a settled field
 *         still breathes without any CPU upload.
 *  accent 1 for the accent minority, 0 for the neutral majority.
 *  size   small multiplier so the field has grain.
 */
export function createPointAttributes(count) {
  const rand = mulberry32(0x1f123bb5);
  const seed = new Float32Array(count);
  const accent = new Float32Array(count);
  const size = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    seed[i] = rand();
    accent[i] = rand() < ACCENT_SHARE ? 1 : 0;
    size[i] = 0.7 + rand() * 0.62;
  }

  return { seed, accent, size };
}
