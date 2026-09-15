/* ============================================================
   src/scroll/KineticHeadline.jsx
   On enter, the real Bricolage Grotesque wdth axis widens from 75 to
   100 while each line unmasks from below.

   Justification: the headline is the page's first hierarchy signal,
   and the width axis is the one piece of motion only this typeface
   can perform, so it earns its place.

   GSAP cannot tween font-variation-settings as a string, so a plain
   object property is tweened and written to the element in onUpdate.
   No transform: scaleX, the actual axis moves.
   ============================================================ */

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cx, useIsoLayoutEffect, usePrefersReducedMotion } from './env';
import './KineticHeadline.css';

gsap.registerPlugin(ScrollTrigger);

const WDTH_FROM = 75;
const WDTH_TO = 100;

export default function KineticHeadline({ children, as = 'h1', className, delay = 0 }) {
  const Tag = as;
  const rootRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  const lines = (Array.isArray(children) ? children : [children]).filter(
    (line) => line !== null && line !== undefined && line !== false && line !== ''
  );

  useIsoLayoutEffect(() => {
    if (reduced || lines.length === 0) return undefined;

    const root = rootRef.current;
    if (!root) return undefined;

    /* The axis value lives on a plain object. onUpdate writes it out. */
    const axis = { wdth: WDTH_FROM };
    const writeAxis = () => {
      root.style.fontVariationSettings = "'wdth' " + axis.wdth;
    };
    writeAxis();

    const ctx = gsap.context(() => {
      const inners = Array.from(root.querySelectorAll('.kh__inner'));
      if (inners.length === 0) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top 85%',
          once: true,
          invalidateOnRefresh: true,
        },
      });

      /* Mask reveal and width expansion start together, at `delay`. */
      tl.fromTo(
        inners,
        { yPercent: 108, y: 0, x: 0 },
        { yPercent: 0, duration: 0.95, ease: 'power4.out', stagger: 0.09 },
        delay
      ).to(
        axis,
        { wdth: WDTH_TO, duration: 1.1, ease: 'power3.out', onUpdate: writeAxis },
        delay
      );
    }, rootRef);

    return () => {
      ctx.revert();
      /* fontVariationSettings is written by hand, so clear it by hand. */
      root.style.fontVariationSettings = '';
    };
  }, [reduced, delay, lines.length]);

  return (
    <Tag
      ref={rootRef}
      className={cx('kh', reduced ? 'kh--static' : 'kh--kinetic', className)}
    >
      {lines.map((line, i) => (
        <span className="kh__line" key={i}>
          <span className="kh__inner">{line}</span>
        </span>
      ))}
    </Tag>
  );
}
