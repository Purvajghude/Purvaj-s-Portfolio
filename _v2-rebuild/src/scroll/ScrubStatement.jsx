/* ============================================================
   src/scroll/ScrubStatement.jsx
   Splits a plain string on whitespace, wraps each word, and scrubs
   each word from --text-3 to --text as the block crosses the viewport.

   Justification: the statement is the page's thesis, so reading it is
   paced by the scroll rather than dumped all at once.

   Colour is carried by a per word custom property (--w) fed into
   color-mix, so both tokens stay live and the theme toggle keeps
   working mid tween. Only paint changes, never layout.
   ============================================================ */

import { Fragment, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cx, useIsoLayoutEffect, usePrefersReducedMotion } from './env';
import './ScrubStatement.css';

gsap.registerPlugin(ScrollTrigger);

export default function ScrubStatement({ text, className, as = 'p' }) {
  const Tag = as;
  const rootRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  const words = String(text == null ? '' : text)
    .split(/\s+/)
    .filter(Boolean);

  useIsoLayoutEffect(() => {
    if (reduced || words.length === 0) return undefined;

    const root = rootRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      const spans = Array.from(root.querySelectorAll('.sstmt__word'));
      if (spans.length === 0) return;

      gsap.to(spans, {
        '--w': 1,
        ease: 'none',
        duration: 0.3,
        stagger: { amount: 1, from: 'start' },
        scrollTrigger: {
          trigger: root,
          start: 'top 85%',
          end: 'bottom 45%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reduced, words.length]);

  return (
    <Tag
      ref={rootRef}
      className={cx('sstmt', reduced ? 'sstmt--static' : 'sstmt--kinetic', className)}
    >
      {words.map((word, i) => (
        <Fragment key={i}>
          {i > 0 ? ' ' : null}
          <span className="sstmt__word">{word}</span>
        </Fragment>
      ))}
    </Tag>
  );
}
