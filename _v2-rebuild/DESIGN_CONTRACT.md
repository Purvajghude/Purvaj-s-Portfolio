# Design Contract

Single source of truth for this portfolio rebuild. Every component, page, and animation
must conform. If something here conflicts with your instinct, this file wins.

Violating any "LOCKED" rule means the work gets rejected and redone.

---

## 0. Design read

Creative-technologist portfolio for design-conscious recruiters and collaborators.
Kinetic / experimental visual language. Vite + React 19 + a persistent React Three Fiber
layer + GSAP ScrollTrigger for pinned scroll work + Motion for everything else.

**Dials:** `DESIGN_VARIANCE: 9` · `MOTION_INTENSITY: 8` · `VISUAL_DENSITY: 3`

## 0.1 CONTENT RULE (LOCKED, most important rule in this file)

The previous site was a scrape of another real person's portfolio. **Every biographical
fact in the old code belongs to someone else and must not survive.**

- Invent **zero** facts. No job titles, no employers, no years, no metrics, no awards,
  no client names, no testimonials, no locations, no phone numbers, no social handles.
- Where real copy is needed, write a **clearly marked placeholder slot**:
  ```jsx
  {/* TODO(content): one-line role statement, max 12 words */}
  <h2 className="…">Your positioning statement goes here</h2>
  ```
- Placeholder text must be **obviously placeholder**. Never write plausible-sounding
  fake biography. "Led design for a 40-person team" is banned even as filler.
- Numbers: never fake-precise. Use `--` or `00` as visible placeholders with a
  `{/* TODO(content) */}` marker next to them.
- Names of people: none. No testimonials with invented attribution.
- The only real given: the site belongs to **Purvaj Ghude**. That name may be used.
  Nothing else about them is known.

---

## 1. Color tokens (LOCKED)

One accent for the entire site. Vermilion. It is the only chromatic color on the page.
Everything else is a cool neutral. No second accent anywhere, including status,
error, success, and hover states.

Defined in `src/styles/tokens.css` on `:root` (light) and `[data-theme="dark"]` +
`@media (prefers-color-scheme: dark)`. **Never define a color only inside a media query.**

```
LIGHT (:root)
--ground        #E8E8E5   page background
--ground-2      #DEDEDA   recessed band
--ground-3      #F5F5F3   raised surface
--line          rgba(16,16,18,0.12)
--line-strong   rgba(16,16,18,0.26)
--text          #101012
--text-2        rgba(16,16,18,0.64)
--text-3        rgba(16,16,18,0.40)
--accent        #E63A0B   fills, graphics, rules
--accent-text   #B82D08   accent used AS TEXT (AA on --ground = 4.89:1)
--on-accent     #0B0B0D   text sitting ON an accent fill (4.6:1)

DARK ([data-theme="dark"])
--ground        #0B0B0D
--ground-2      #131316
--ground-3      #1C1C21
--line          rgba(255,255,255,0.10)
--line-strong   rgba(255,255,255,0.24)
--text          #F2F1EE
--text-2        rgba(242,241,238,0.62)
--text-3        rgba(242,241,238,0.38)
--accent        #FF4A1C   (5.8:1 on --ground)
--accent-text   #FF6A42   (6.87:1 on --ground)
--on-accent     #0B0B0D   (5.8:1)
```

**Button rule (LOCKED):** a filled CTA is always `background: var(--accent)` with
`color: var(--on-accent)`. Identical in both themes. Never white text on accent.

**Theme lock (LOCKED):** one theme for the whole page. Sections may move between
`--ground`, `--ground-2`, and `--ground-3` only. A section never flips to the opposite
theme's palette.

Default theme: follow `prefers-color-scheme`, with a manual toggle that persists to
`localStorage` (wrapped in try/catch). Dark is the design's primary expression.

---

## 2. Typography (LOCKED)

Self-hosted via fontsource. Already installed. Import in `src/styles/fonts.css`.

| Role | Family | Package |
|---|---|---|
| Display | Bricolage Grotesque Variable | `@fontsource-variable/bricolage-grotesque` |
| Body | Geist Variable | `@fontsource-variable/geist` |
| Mono / labels | Geist Mono Variable | `@fontsource-variable/geist-mono` |

Bricolage exposes `opsz`, `wght`, and **`wdth` (75-100)**. The `wdth` axis is the
kinetic-typography material: animate it, do not fake it with `transform: scaleX`.

```
--font-display: 'Bricolage Grotesque Variable', 'Geist Variable', system-ui, sans-serif;
--font-body:    'Geist Variable', system-ui, -apple-system, sans-serif;
--font-mono:    'Geist Mono Variable', ui-monospace, monospace;
```

Fluid scale (define once, use everywhere):
```
--fs-display  clamp(3rem, 11vw, 9.5rem)     line-height 0.92
--fs-h1       clamp(2.5rem, 7vw, 6rem)      line-height 0.95
--fs-h2       clamp(2rem, 4.5vw, 3.75rem)   line-height 1.02
--fs-h3       clamp(1.25rem, 2vw, 1.75rem)  line-height 1.15
--fs-body     clamp(1rem, 1.05vw, 1.125rem) line-height 1.6
--fs-small    0.875rem                      line-height 1.5
--fs-micro    0.75rem                       line-height 1.4, mono, tracking 0.14em
```

- Body copy: `max-width: 62ch`.
- Display type: `letter-spacing: -0.03em`.
- **No serif anywhere.** Not for accents, not for emphasis, not for pull quotes.
- **Emphasis inside a headline uses italic or weight of the SAME family.** Never mix
  families for emphasis.
- **Italic descender clearance (LOCKED):** any italic display word containing
  `y g j p q` needs `line-height: 1.1` minimum plus `padding-bottom: 0.08em` on the
  wrapper. Audit before shipping.

---

## 3. Shape, spacing, layout (LOCKED)

- **Radius: `0` everywhere. No exceptions.** Buttons, cards, inputs, images, the theme
  toggle, everything is a hard rectangle. This is the aesthetic's spine.
- Container: `max-width: 1440px`, gutter `clamp(1.25rem, 4vw, 4rem)`.
- Section vertical rhythm: `padding-block: clamp(6rem, 12vw, 11rem)` (density 3, airy).
- Breakpoints: `sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536`.
- Full-height blocks use `min-height: 100dvh`. **Never `100vh`.**
- Multi-column layouts use CSS Grid. **Never flexbox percentage math.**
- **Every asymmetric layout above `md` must collapse to a single column below 768px,**
  declared explicitly in the same stylesheet block. No implicit assumptions.
- Shadows: none by default. Depth comes from the WebGL layer and from `--line` rules.
  If a shadow is genuinely needed it is tinted to the ground hue, never pure black.

### Z-index scale (LOCKED, do not invent values)
```
--z-webgl     0    fixed full-viewport canvas, pointer-events: none
--z-content   10   all page content
--z-header    40   sticky nav
--z-overlay   60   mobile menu, modals
--z-grain     80   fixed grain, pointer-events: none
```

---

## 4. Motion architecture (LOCKED)

Three animation systems. **They never appear in the same component tree.**

| System | Lives in | Owns |
|---|---|---|
| React Three Fiber | `src/webgl/**` | The persistent 3D layer, nothing else |
| GSAP + ScrollTrigger | `src/scroll/**` | Pinned / scrubbed sections only |
| Motion (`motion/react`) | everywhere else | Reveals, page transitions, hover, layout |

Rules:
- Import Motion as `import { motion } from 'motion/react'`. **Never `framer-motion`.**
- **`window.addEventListener('scroll')` is banned.** Use `useScroll()`, ScrollTrigger,
  or IntersectionObserver.
- **Never drive continuous pointer or scroll values through `useState`.** Use
  `useMotionValue` / `useTransform`, or a ref, or a GSAP quickTo.
- Every `useEffect` that starts an animation returns a cleanup. GSAP work is wrapped in
  `gsap.context(...)` and reverted.
- Animate `transform` and `opacity` only. Never `top/left/width/height`.
- Springs, not linear easing, for UI. Reference spring: `{ type: 'spring', stiffness: 120, damping: 18, mass: 0.8 }`.
  Reference ease for tweens: `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Reduced motion is mandatory.** `useReducedMotion()` in React trees; the WebGL layer
  drops to a single static frame; GSAP ScrollTriggers do not register at all.
- **Every animation must be justifiable in one sentence** (hierarchy, storytelling,
  feedback, or state transition). "It looked cool" is not a reason. Delete it.

### GSAP canonical settings
Pinned sections: `start: 'top top'`, `pin: true`, explicit `end`, `invalidateOnRefresh: true`.
Horizontal pan: `end: () => '+=' + distance`, `scrub: 1`.

---

## 5. Home section registry (LOCKED)

Eight sections, eight distinct layout families, no family reused. Build exactly these.

| # | Section | Layout family | Eyebrow? |
|---|---|---|---|
| 1 | Hero | `hero-asymmetric` | yes (1 of 3) |
| 2 | Capability marquee | `marquee` | no |
| 3 | Statement | `full-bleed-statement` | no |
| 4 | Selected work | `horizontal-pan` (GSAP pinned) | yes (2 of 3) |
| 5 | Process | `sticky-stack` (GSAP pinned) | no |
| 6 | Signals | `bare-metrics` (no cards) | no |
| 7 | Explorations | `bento` | yes (3 of 3) |
| 8 | Closing | `closing-manifesto` | no |

- **Eyebrow budget: 3 total on Home.** An eyebrow is a small uppercase wide-tracking
  mono label above a headline. Sections 2, 3, 5, 6, 8 get none. Do not add any.
- **Marquee budget: 1 on the entire page.** Section 2 spends it.
- Zigzag image+text splits: **zero** on Home.
- Bento (7) must have exactly as many cells as there is content, and at least 2 cells
  carry real visual variation (image or accent fill), not white-on-white text.

### Hero discipline (LOCKED)
Max **4** text elements total: eyebrow, headline (max 2 lines), subtext (max 20 words,
max 4 lines), CTA row (1 primary + max 1 secondary). Nothing else.
`padding-top` max `6rem` at desktop. No trust strip, no tagline under the CTAs, no
version badge, no decoration text strip, and **no scroll cue of any kind.**

---

## 6. Banned patterns (LOCKED, mechanical fail list)

Presence of any of these means the work is not done.

**Typography / characters**
- The em-dash `—` and the en-dash `–`. **Zero occurrences in any user-visible string:**
  headlines, body, labels, buttons, alt text, captions, `aria-label`, page titles.
  Use a regular hyphen `-`, a comma, a period, a colon, or parentheses.
- Serif fonts. Fraunces and Instrument Serif especially.
- Inter as a display or body face.
- Gradient text on large headings.

**Layout / decoration**
- Section-number eyebrows: `01 / INDEX`, `002 · Capabilities`, `Evidence 03`.
- Pagination labels on tiles or images: `01 / 4`.
- Scroll cues: `Scroll`, `Scroll to explore`, animated mouse icons.
- Locale / time / weather strips: `Mumbai 14:23 · 24°C`.
- Version badges and build footers: `v1.4.2`, `BETA`, `Build 0048`.
- Decorative colored status dots before nav items, list rows, or badges. Zero by default.
- The middle dot `·` as a general separator. Max one per metadata line.
- Decorative crosshairs and hairline grids that organize nothing.
- Vertical rotated text.
- "Left big headline + right small floating explainer paragraph" as a section header.
  Stack them instead.
- `border-top` **and** `border-bottom` on every row of a list. Pick one, use it sparsely.
- Filled background progress tracks as comparison visuals.
- Pills or tags overlaid on top of images.
- Photo-credit captions as decoration.
- Three equal feature cards in a row.
- Custom mouse cursors.
- Pure `#000` and pure `#fff`.

**Content voice**
- Filler verbs: elevate, seamless, unleash, next-gen, revolutionize, empower, leverage.
- Poetic section labels: "Field notes", "From the desk", "Loose plates", "On the bench".
- "Quietly trusted by", "Quietly in use at".
- Generic step labels: "Stage 1 / Stage 2", "Phase 01".
- Micro-meta sentences under an eyebrow explaining the section's own existence.

**Implementation**
- Hand-rolled decorative SVG illustrations, and hand-drawn SVG icon paths.
  Icons come from `@phosphor-icons/react` only, `weight="regular"` globally.
- Fake product UI built out of styled `<div>` rectangles.
- `<link>` to Google Fonts. Fonts are self-hosted through fontsource imports.

---

## 7. Imagery

No image-generation tool is available in this environment, so:

- Use `https://picsum.photos/seed/{descriptive-seed}/{w}/{h}` for photographic
  placeholders. Seeds must be descriptive, for example `pg-work-terminal-01`.
- Every such image gets a `{/* TODO(asset): replace with real … */}` comment above it,
  and `loading="lazy"` plus explicit `width`/`height` to protect CLS.
- The hero image, if any, gets `fetchpriority="high"` and no lazy loading.
- Reserve aspect ratio with `aspect-ratio` so nothing shifts.
- The WebGL layer counts as a real generated visual. Text-only sections are still
  not acceptable as a substitute for imagery.

---

## 8. Required states

Every interactive surface ships all of these, not just the happy path:

- **Focus:** visible `:focus-visible` ring using `--accent`, 2px, offset 2px. Never
  `outline: none` without a replacement.
- **Active:** `transform: translateY(1px)` or `scale(0.985)` for physical feedback.
- **Loading:** skeletons shaped like the final content. No circular spinners.
- **Empty:** composed, with a clear next action.
- **Error:** inline and adjacent to the field, never a toast for validation.
- Forms: label **above** input, helper text present in markup, error **below**.
  Placeholder is never the label. All of it passes AA against its section ground.

---

## 9. File layout

```
src/
  styles/
    tokens.css        colors, type scale, spacing, z-index
    fonts.css         fontsource imports + family vars
    base.css          reset, ground, focus, grain, container, utilities
  webgl/              React Three Fiber only
  scroll/             GSAP ScrollTrigger leaf components only
  components/         shared UI (Motion allowed)
  sections/           Home page sections
  pages/              route components
```

Component files are `.jsx`. Styles are plain CSS with tokens, co-located per area,
imported from the component that owns them. No CSS-in-JS, no Tailwind (this project
has no Tailwind pipeline configured).

---

## 10. Routes

```
/                       Home
/work                   Work index
/work/:slug             Work detail template
/about                  About
/resume                 Resume
/contact                Contact
```

Nav shows: Work, About, Resume, Contact, plus the theme toggle. **One line at desktop,
header height 72px, hard cap 80px.** Below `md` it becomes a full-screen overlay menu.

---

## 11. Performance budget

- LCP under 2.5s, INP under 200ms, CLS under 0.1.
- The WebGL layer lazy-mounts, caps `dpr` at `[1, 2]`, pauses its loop when the tab is
  hidden or the canvas is off-screen, and disposes geometries and materials on unmount.
- Under 768px, or when `prefers-reduced-motion: reduce`, or when WebGL is unavailable,
  the 3D layer renders a static CSS fallback instead of a live canvas.
- Grain overlay is a single `position: fixed`, `pointer-events: none` element. **Never
  attached to a scrolling container.**

---

## 12. Pre-flight before you report done

Run these mechanically against your own output:

1. `grep -n '—\|–'` over your files. Must return nothing in user-visible strings.
2. Count eyebrows on Home. Must be exactly 3.
3. Count marquees on Home. Must be exactly 1.
4. Every CTA label fits one line at desktop and is 3 words or fewer.
5. No two CTAs share an intent. One label per intent across the whole site.
6. Every `useEffect` with an animation has a cleanup.
7. No `framer-motion` imports. No `window.addEventListener('scroll')`.
8. No invented biographical facts. Every content slot is a marked TODO.
9. Both themes checked. Both mobile and desktop checked.
10. `npm run build` passes.

---

# Appendix A: Cross-agent interfaces (LOCKED)

Four agents build in parallel. These signatures are frozen. Build against them exactly,
even if the other side does not exist on disk yet. Do not rename, do not add required
props, do not change default exports to named or vice versa.

## A.1 `src/webgl/` (owned by the WebGL agent)

```jsx
// src/webgl/WebGLLayer.jsx
export default function WebGLLayer(): JSX.Element
```
Renders a `position: fixed`, `inset: 0`, `pointer-events: none` canvas at
`z-index: var(--z-webgl)`. Mounts once in `App.jsx`, above `<Router>` content in the
DOM but visually behind it. Self-contained: it reads theme and stage on its own.

```jsx
// src/webgl/stage.js
export const STAGES = ['hero', 'work', 'process', 'signals', 'closing'];
export function useStageTrigger(stage: string): (node: HTMLElement | null) => void
export function getStage(): string
export function subscribe(fn: () => void): () => void
```
`useStageTrigger` returns a **ref callback**. A section attaches it to its root element;
when that element crosses the viewport midpoint the scene morphs to that stage.
Implemented with IntersectionObserver and an external store
(`useSyncExternalStore`). No React Context, no provider, no `window` scroll listener.

Usage from a section:
```jsx
const stageRef = useStageTrigger('work');
return <section ref={stageRef} className="u-section">…</section>;
```

## A.2 `src/scroll/` (owned by the Scroll agent)

All four are `'use client'`-style leaf components: GSAP only, **no Motion imports**.

```jsx
// src/scroll/HorizontalPan.jsx
export default function HorizontalPan({ children, className })
```
Pins its own `<section>` and pans the inner track horizontally as the user scrolls
vertically. Each direct child is one full panel. Canonical settings:
`start: 'top top'`, `pin: true`, `end: () => '+=' + distance`, `scrub: 1`,
`invalidateOnRefresh: true`. Under 768px or reduced motion it degrades to a native
horizontal scroll-snap strip with no pinning.

```jsx
// src/scroll/StickyStack.jsx
export default function StickyStack({ children, className })
```
Each direct child becomes a card that pins at `top top` and is scaled and faded down
as the next card arrives. Last card is not pinned. Under reduced motion the cards
render as a plain vertical stack.

```jsx
// src/scroll/ScrubStatement.jsx
export default function ScrubStatement({ text, className, as = 'p' })
```
Splits `text` on whitespace, wraps each word, and scrubs each word from `--text-3`
to `--text` as the block passes through the viewport. Under reduced motion every word
renders at final state immediately. `text` is a plain string.

```jsx
// src/scroll/KineticHeadline.jsx
export default function KineticHeadline({ children, as = 'h1', className, delay = 0 })
```
On enter, animates `font-variation-settings: 'wdth' 75 -> 100` together with a per-line
mask reveal. This is the signature kinetic move and the reason Bricolage was chosen.
`children` is a string or an array of strings (one per line). Under reduced motion it
renders static at `wdth 100`.

## A.3 `src/sections/` (owned by the Sections agent)

One file per Home section, default export, no props:
```
HeroSection.jsx  CapabilityMarquee.jsx  StatementSection.jsx  SelectedWork.jsx
ProcessSection.jsx  SignalsSection.jsx  ExplorationsSection.jsx  ClosingSection.jsx
```
`SelectedWork` uses `HorizontalPan`. `ProcessSection` uses `StickyStack`.
`StatementSection` uses `ScrubStatement`. `HeroSection` uses `KineticHeadline`.
Sections 1, 4, 5, 6, 8 attach `useStageTrigger` with stages
`hero`, `work`, `process`, `signals`, `closing` respectively.

## A.4 `src/components/` (owned by the integrator, do not edit)

Available for import by any agent:
```jsx
import Container from '../components/Container';   // <Container as="div">…</Container>
import Reveal from '../components/Reveal';         // <Reveal delay={0.06}>…</Reveal>  Motion-based
```
`Reveal` wraps children in a `whileInView` fade-and-rise with `viewport={{ once: true }}`
and respects `useReducedMotion()`. Use it for ordinary scroll reveals so sections do not
each reinvent one.

## A.5 Ownership map (do not write outside your lane)

| Agent | Writes | Never touches |
|---|---|---|
| WebGL | `src/webgl/**` | anything else |
| Scroll | `src/scroll/**` | anything else |
| Sections | `src/sections/**` | `src/scroll`, `src/webgl`, `src/pages`, `src/components` |
| Pages | `src/pages/About.jsx`, `Resume.jsx`, `Contact.jsx`, `Work.jsx`, `WorkDetail.jsx` | `src/pages/Home.jsx`, `src/sections`, `src/App.jsx` |
| Integrator | `src/components/**`, `src/pages/Home.jsx`, `src/App.jsx`, `src/main.jsx`, `src/styles/**` | agent lanes |

Each agent may create a co-located `.css` file inside its own lane and import it from
its own component. Never edit `src/styles/*.css`; those tokens are frozen input.

---

# Appendix B: Corrections found during integration (LOCKED)

Three rules the original contract got wrong or failed to reconcile. They were found
by testing the built site in a browser, not by reading code. Do not regress them.

## B.1 Sections must not occlude the WebGL layer

The original contract said sections may move between `--ground`, `--ground-2` and
`--ground-3` (theme lock, section 1), and separately that a persistent 3D layer sits
behind the page at `--z-webgl`. Those two rules contradict each other: every Home
section painted an opaque `background: var(--ground)`, which hid the 3D layer
completely. The feature was invisible on the entire home page.

The resolution:

- **Airy sections are transparent.** `HeroSection`, `StatementSection`,
  `SignalsSection` and `ClosingSection` set `background: transparent` and let the
  field read through. The page ground is painted once, on `body`.
- **Dense sections are translucent, not opaque.** `SelectedWork`, `ProcessSection`
  and `ExplorationsSection` use
  `background: color-mix(in srgb, var(--ground) 86%, transparent)` so the field stays
  faintly continuous behind them without costing text contrast.
- **`CapabilityMarquee` stays opaque** (`--ground-2`). It is a thin band and the
  break in the field gives the page rhythm.
- Cards and tiles inside a section may still be fully opaque. Only the section
  surface itself is constrained.

Any new section must decide, explicitly, which of those three it is.

## B.2 `--text-3` is decoration only, never a text color

Measured contrast against its own ground:

```
LIGHT --text-3 (0.40 alpha)   2.54:1   fails AA body AND AA large
DARK  --text-3 (0.38 alpha)   3.24:1   fails AA body, passes AA large only
```

There is no room for a third *passing* contrast tier below `--text-2` (0.64), which
itself sits at 5.28:1 light and 6.98:1 dark. So tertiary hierarchy is expressed with
**size, case and letter-spacing** (see `.u-eyebrow`), never by lowering contrast.
Every text use of `--text-3` was moved to `--text-2`, including the eyebrow style,
the footer meta, the signals labels, and the `ScrubStatement` start color.

## B.3 Reduced motion must not park the render loop

The original rule said the WebGL layer "drops to a single static frame" and the
implementation parked the loop with `frameloop="demand"`. In practice the compositor
discards that single frame, and the layer then goes blank permanently. Reduced motion
users lost the visual entirely, intermittently and unreproducibly.

The correct behaviour: keep `frameloop="always"` while the layer is visible and
on screen, and make the **content** static instead. `PointField`'s reduced branch
snaps its uniforms and returns without advancing time, tweening positions, or applying
pointer parallax, so the rendered image never changes. That honours
`prefers-reduced-motion` (which constrains visible motion, not GPU work) and is
deterministic. The loop still parks when the tab is hidden or the layer is off screen.

### Testing note

`ResizeObserver` delivery and `requestAnimationFrame` are both suspended in a tab that
is not being rendered. R3F sizes its drawing buffer from a `ResizeObserver`, so in a
hidden or backgrounded tab the canvas is stranded at its intrinsic 300x150 and the
layer looks broken when it is not. Always verify the 3D layer in a foregrounded,
visible window before concluding anything about it.
