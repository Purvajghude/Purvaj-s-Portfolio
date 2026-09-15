/* ============================================================
   src/scroll/HorizontalPan.jsx
   Pins its own <section> and pans an inner track sideways while the
   user scrolls vertically. Each direct child is one full panel.

   Justification: the work index is a lateral sequence, so the scroll
   axis is rotated to match the reading axis.
   ============================================================ */

import { Children, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cx, refreshWhenFontsReady, useIsoLayoutEffect, useMediaQuery, usePrefersReducedMotion } from './env';
import './HorizontalPan.css';

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalPan({ children, className }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  const reduced = usePrefersReducedMotion();
  const isNarrow = useMediaQuery('(max-width: 767px)');
  const panels = Children.toArray(children);

  /* Below md, under reduced motion, or with a single panel there is
     nothing to pan: fall back to a native horizontal scroll-snap strip. */
  const isStatic = reduced || isNarrow || panels.length < 2;

  useIsoLayoutEffect(() => {
    if (isStatic) return undefined;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return undefined;

    /* Read fresh on every refresh so a resize or an orientation change
       recomputes both the travel and the pin length from the same number. */
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + distance(),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    const cancelFontWatch = refreshWhenFontsReady(ScrollTrigger);

    return () => {
      cancelFontWatch();
      ctx.revert();
    };
  }, [isStatic, panels.length]);

  return (
    <section ref={sectionRef} className={cx('hpan', isStatic && 'hpan--static', className)}>
      <div className="hpan__viewport" tabIndex={isStatic ? 0 : undefined}>
        <div ref={trackRef} className="hpan__track">
          {panels.map((panel, i) => (
            <div className="hpan__panel" key={i}>
              {panel}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
