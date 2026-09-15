import { Link } from 'react-router-dom';
import { ArrowUpRight } from '@phosphor-icons/react';
import { useStageTrigger } from '../webgl/stage';
import Container from '../components/Container';
import Reveal from '../components/Reveal';
import './ClosingSection.css';

/**
 * Section 8 of 8. Layout family: closing-manifesto.
 * No eyebrow. One large line, one call to action, nothing after it.
 */
export default function ClosingSection() {
  const stageRef = useStageTrigger('closing');

  return (
    <section ref={stageRef} className="u-section closing" aria-label="Closing">
      <Container>
        <div className="closing__grid">
          <Reveal>
            {/* TODO(content): closing line, max 8 words, no biography and no metrics */}
            <h2 className="u-display closing__line">
              Closing line goes{' '}
              <span className="u-italic-clear">right here</span>
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="closing__cta">
              <Link className="u-btn" to="/contact">
                Contact
                <ArrowUpRight size={15} weight="regular" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
