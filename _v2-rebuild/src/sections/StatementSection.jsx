import ScrubStatement from '../scroll/ScrubStatement';
import './StatementSection.css';

/**
 * Section 3 of 8. Layout family: full-bleed-statement.
 * No eyebrow, no supporting paragraph, no CTA. One sentence, full bleed,
 * scrubbed word by word from --text-3 to --text by the scroll agent.
 */
export default function StatementSection() {
  return (
    <section className="statement" aria-label="Statement">
      <div className="statement__bleed">
        {/* TODO(content): one statement sentence, 14 to 22 words, no biography, no metrics */}
        <ScrubStatement
          as="p"
          className="statement__text"
          text="Statement placeholder. One sustained thought about how the work gets made belongs on this line, written later."
        />
      </div>
    </section>
  );
}
