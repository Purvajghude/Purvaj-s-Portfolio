/* ============================================================
   src/scroll/StickyStack.jsx
   Each direct child becomes a card that pins at top top. As the NEXT
   card arrives, the current card scales back and fades, so the cards
   physically stack instead of replacing each other.

   Justification: the process reads as accumulation, so earlier steps
   stay on screen underneath the one being read.
   ============================================================ */

import { Children, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cx, refreshWhenFontsReady, useIsoLayoutEffect, usePrefersReducedMotion } from './env';
import './StickyStack.css';

gsap.registerPlugin(ScrollTrigger);

const SCALE_BACK = 0.92;
const FADE_BACK = 0.55;

export default function StickyStack({ children, className }) {
  const rootRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const cards = Children.toArray(children);

  /* A single card has nothing to stack against. */
  const isStatic = reduced || cards.length < 2;

  useIsoLayoutEffect(() => {
    if (isStatic) return undefined;

    const root = rootRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      const nodes = Array.from(root.querySelectorAll('.sstack__card'));
      if (nodes.length < 2) return;

      const last = nodes[nodes.length - 1];

      nodes.forEach((card, i) => {
        const next = nodes[i + 1];
        /* The last card is never pinned. */
        if (!next) return;

        ScrollTrigger.create({
          trigger: card,
          start: 'top top',
          endTrigger: last,
          end: 'top top',
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });

        /* Scale and fade are driven by the FOLLOWING card's trigger, so
           this card recedes exactly while the next one covers it. */
        const inner = card.querySelector('.sstack__inner');
        if (!inner) return;

        gsap.fromTo(
          inner,
          { scale: 1, opacity: 1 },
          {
            scale: SCALE_BACK,
            opacity: FADE_BACK,
            ease: 'none',
            scrollTrigger: {
              trigger: next,
              start: 'top bottom',
              end: 'top top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    }, rootRef);

    const cancelFontWatch = refreshWhenFontsReady(ScrollTrigger);

    return () => {
      cancelFontWatch();
      ctx.revert();
    };
  }, [isStatic, cards.length]);

  return (
    <div ref={rootRef} className={cx('sstack', isStatic && 'sstack--static', className)}>
      {cards.map((card, i) => (
        <div className="sstack__card" key={i}>
          <div className="sstack__inner">{card}</div>
        </div>
      ))}
    </div>
  );
}
