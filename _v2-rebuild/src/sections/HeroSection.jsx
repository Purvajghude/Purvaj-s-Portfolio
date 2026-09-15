import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import KineticHeadline from '../scroll/KineticHeadline';
import { useStageTrigger } from '../webgl/stage';
import Container from '../components/Container';
import './HeroSection.css';

/**
 * Section 1 of 8. Layout family: hero-asymmetric.
 * Hard limit of FOUR text elements (contract 5, Hero discipline):
 *   1 eyebrow, 1 headline (max 2 lines), 1 subtext line, 1 CTA row.
 * No scroll cue, no trust strip, no version badge, no decoration strip.
 */
export default function HeroSection() {
  const stageRef = useStageTrigger('hero');

  return (
    <section ref={stageRef} className="hero" aria-label="Introduction">
      <Container>
        <div className="hero__grid">
          {/* Text 1 of 4. */}
          {/* TODO(content): short discipline label, 2 to 4 words. Do not repeat
              the wordmark in the header directly above it. */}
          <p className="u-eyebrow hero__eyebrow">Discipline label here</p>

          {/* Text 2 of 4. */}
          {/* TODO(content): 2 line headline, max 5 words per line, no biography */}
          <KineticHeadline as="h1" className="u-display hero__headline">
            {['Two short lines', 'go right here']}
          </KineticHeadline>

          {/* Text 3 of 4. */}
          {/* TODO(content): one supporting line, max 20 words, no role or employer */}
          <p className="u-body hero__sub">
            Supporting line placeholder. Replace with one sentence about the work,
            written later, kept under twenty words.
          </p>

          {/* Text 4 of 4: one primary CTA plus one secondary. Nothing after it. */}
          <div className="hero__ctas">
            <Link className="u-btn" to="/work">
              View work
              <ArrowRight size={15} weight="regular" aria-hidden="true" />
            </Link>
            <Link className="u-btn u-btn--ghost" to="/resume">
              Read resume
              <ArrowUpRight size={15} weight="regular" aria-hidden="true" />
            </Link>
          </div>

          {/* Non-text compositional counterweight. Carries no copy. */}
          <div className="hero__mark" aria-hidden="true" />
        </div>
      </Container>
    </section>
  );
}
