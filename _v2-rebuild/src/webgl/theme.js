/* ============================================================
   THEME BRIDGE
   The scene never hardcodes a palette. It reads the frozen
   tokens off :root and re-reads them when the theme flips.

   --webgl-ink     comma separated RGB triple. In both themes it
                   equals --ground, so the scene uses it as the
                   depth fade target: far points dissolve into
                   the page ground instead of stacking up into a
                   grey haze.
   --webgl-accent  the single accent hue. There is no second one.
   --webgl-opacity global opacity for the layer.
   --text          the neutral the near points are drawn in.
                   Read live so it stays in step with the tokens.
   ============================================================ */

/* Only used if getComputedStyle gives us nothing usable. Values
   mirror the dark column of the locked palette. */
const FALLBACK = {
  ink: [11, 11, 13],
  accent: [255, 74, 28],
  base: [242, 241, 238],
  opacity: 1,
};

const LIGHT_NEUTRAL = [16, 16, 18];
const DARK_NEUTRAL = [242, 241, 238];

function parseTriple(value) {
  if (!value) return null;
  const parts = value.trim().split(',');
  if (parts.length < 3) return null;
  const out = [0, 0, 0];
  for (let i = 0; i < 3; i += 1) {
    const n = parseFloat(parts[i]);
    if (!Number.isFinite(n)) return null;
    out[i] = n;
  }
  return out;
}

function parseCssColor(value) {
  if (!value) return null;
  const raw = value.trim();

  if (raw.charAt(0) === '#') {
    const hex = raw.slice(1);
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16),
        parseInt(hex[1] + hex[1], 16),
        parseInt(hex[2] + hex[2], 16),
      ];
    }
    if (hex.length === 6 || hex.length === 8) {
      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
      ];
    }
    return null;
  }

  const open = raw.indexOf('(');
  const close = raw.lastIndexOf(')');
  if (open === -1 || close === -1) return null;
  return parseTriple(raw.slice(open + 1, close).replace(/\//g, ',').replace(/\s+/g, ','));
}

function relativeLuminance(rgb) {
  return (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
}

/** Snapshot of every token the scene needs, as 0-255 triples. */
export function readSceneTheme() {
  if (typeof document === 'undefined' || typeof getComputedStyle !== 'function') {
    return FALLBACK;
  }

  const cs = getComputedStyle(document.documentElement);
  const ink = parseTriple(cs.getPropertyValue('--webgl-ink')) || FALLBACK.ink;
  const accent = parseTriple(cs.getPropertyValue('--webgl-accent')) || FALLBACK.accent;

  const rawOpacity = parseFloat(cs.getPropertyValue('--webgl-opacity'));
  const opacity = Number.isFinite(rawOpacity) ? rawOpacity : FALLBACK.opacity;

  // Ink equals the ground, so it cannot also be the point color.
  // Take the neutral from --text, and if that is unreadable fall
  // back to the polarity of the ground itself.
  const base =
    parseCssColor(cs.getPropertyValue('--text')) ||
    (relativeLuminance(ink) > 0.5 ? LIGHT_NEUTRAL : DARK_NEUTRAL);

  return { ink, accent, base, opacity };
}

/**
 * Calls onChange whenever the theme could have changed: the
 * manual toggle writes data-theme on :root, and the system
 * preference can flip underneath us. Returns a cleanup.
 */
export function observeSceneTheme(onChange) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  let observer = null;
  if (typeof MutationObserver !== 'undefined') {
    observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class', 'style'],
    });
  }

  let media = null;
  if (typeof window.matchMedia === 'function') {
    media = window.matchMedia('(prefers-color-scheme: dark)');
    if (media.addEventListener) media.addEventListener('change', onChange);
    else if (media.addListener) media.addListener(onChange);
  }

  return () => {
    if (observer) observer.disconnect();
    if (!media) return;
    if (media.removeEventListener) media.removeEventListener('change', onChange);
    else if (media.removeListener) media.removeListener(onChange);
  };
}
