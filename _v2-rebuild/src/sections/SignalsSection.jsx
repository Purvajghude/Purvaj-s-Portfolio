import { useStageTrigger } from '../webgl/stage';
import Container from '../components/Container';
import Reveal from '../components/Reveal';
import './SignalsSection.css';

/**
 * Section 6 of 8. Layout family: bare-metrics.
 * No eyebrow, no card containers, no filled progress tracks.
 * Every number is a visible placeholder. Never invent a real looking metric.
 */

/* TODO(content): replace with four real metric labels, max 3 words each.
   Leave value as "--" until a true number exists. */
const SIGNALS = [
  { id: 'signal-one', label: 'Metric label one' },
  { id: 'signal-two', label: 'Metric label two' },
  { id: 'signal-three', label: 'Metric label three' },
  { id: 'signal-four', label: 'Metric label four' },
];

export default function SignalsSection() {
  const stageRef = useStageTrigger('signals');

  return (
    <section ref={stageRef} className="u-section signals" aria-label="Signals">
      <Container>
        <Reveal>
          <div className="signals__head">
            {/* TODO(content): section headline, max 6 words */}
            <h2 className="u-h2 signals__title">Section headline goes here</h2>
            {/* TODO(content): one supporting line, max 16 words */}
            <p className="u-body signals__sub">
              Supporting line placeholder, stacked under the headline rather than
              floated beside it.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <dl className="signals__grid">
            {SIGNALS.map((signal) => (
              <div className="signal" key={signal.id}>
                {/* TODO(content): metric label, max 3 words */}
                <dt className="signal__label">{signal.label}</dt>
                {/* TODO(content): no number exists yet, keep the placeholder until one does */}
                <dd className="signal__value">--</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
