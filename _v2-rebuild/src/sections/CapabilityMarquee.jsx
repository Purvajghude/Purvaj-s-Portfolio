import './CapabilityMarquee.css';

/**
 * Section 2 of 8. Layout family: marquee.
 * This spends the page's single marquee budget (contract 5). No eyebrow.
 * Pure CSS keyframe translate on a duplicated track. The duplicate is
 * aria-hidden so screen readers hear the list once. Paused under reduced motion.
 */

/* TODO(content): replace with real capability words, 5 to 9 items, 1 to 2 words each */
const CAPABILITIES = [
  'Capability one',
  'Capability two',
  'Capability three',
  'Capability four',
  'Capability five',
  'Capability six',
];

export default function CapabilityMarquee() {
  return (
    <section className="marquee" aria-label="Capabilities">
      <div className="marquee__viewport">
        <ul className="marquee__track">
          {CAPABILITIES.map((word) => (
            <li className="marquee__item" key={word}>
              {word}
            </li>
          ))}
        </ul>
        <ul className="marquee__track" aria-hidden="true">
          {CAPABILITIES.map((word) => (
            <li className="marquee__item" key={`echo:${word}`}>
              {word}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
