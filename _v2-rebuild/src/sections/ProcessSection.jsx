import StickyStack from '../scroll/StickyStack';
import { useStageTrigger } from '../webgl/stage';
import Container from '../components/Container';
import Reveal from '../components/Reveal';
import './ProcessSection.css';

/**
 * Section 5 of 8. Layout family: sticky-stack (GSAP pinned, owned by StickyStack).
 * No eyebrow. No step numbers and no "Stage 1 / Phase 01" labels: the verb on
 * each card is the only label it gets (contract 6).
 */

/* TODO(content): replace with the real four steps.
   verb is a single word, line is max 16 words and describes nothing biographical. */
const STEPS = [
  { verb: 'Frame', line: 'Placeholder line about the first move, replaced once the real process is written.' },
  { verb: 'Sketch', line: 'Placeholder line about the second move, replaced once the real process is written.' },
  { verb: 'Build', line: 'Placeholder line about the third move, replaced once the real process is written.' },
  { verb: 'Refine', line: 'Placeholder line about the fourth move, replaced once the real process is written.' },
];

export default function ProcessSection() {
  const stageRef = useStageTrigger('process');

  return (
    <section ref={stageRef} className="process" aria-label="Process">
      <div className="process__head">
        <Container>
          <Reveal>
            {/* TODO(content): section headline, max 6 words */}
            <h2 className="u-h2 process__title">Section headline goes here</h2>
          </Reveal>
        </Container>
      </div>

      <StickyStack className="process__stack">
        {STEPS.map((step) => (
          <article className="pcard" key={step.verb}>
            <div className="pcard__inner">
              {/* TODO(content): one verb, one word */}
              <h3 className="u-display pcard__verb">{step.verb}</h3>
              {/* TODO(content): one line, max 16 words */}
              <p className="pcard__line">{step.line}</p>
            </div>
          </article>
        ))}
      </StickyStack>
    </section>
  );
}
