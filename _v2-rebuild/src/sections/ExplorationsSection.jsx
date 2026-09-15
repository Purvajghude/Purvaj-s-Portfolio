import Container from '../components/Container';
import Reveal from '../components/Reveal';
import './ExplorationsSection.css';

/**
 * Section 7 of 8. Layout family: bento.
 * Carries eyebrow 3 of 3. Genuinely asymmetric grid, never three equal cards.
 * Five cells of content and exactly five cells of grid, no empty cells.
 * Three of the five carry real visual variation: two images and one accent fill.
 */

/* TODO(content): replace all five entries.
   title max 4 words, line max 14 words, nothing biographical. */
const CELLS = [
  {
    area: 'a',
    kind: 'image',
    seed: 'pg-exploration-tall-01',
    title: 'Exploration one',
    line: 'One line about the first exploration goes here.',
  },
  {
    area: 'b',
    kind: 'accent',
    title: 'Exploration two',
    line: 'One line about the second exploration goes here.',
  },
  {
    area: 'c',
    kind: 'text',
    title: 'Exploration three',
    line: 'One line about the third exploration goes here.',
  },
  {
    area: 'd',
    kind: 'text',
    title: 'Exploration four',
    line: 'One line about the fourth exploration goes here.',
  },
  {
    area: 'e',
    kind: 'image',
    seed: 'pg-exploration-wide-01',
    title: 'Exploration five',
    line: 'One line about the fifth exploration goes here.',
  },
];

export default function ExplorationsSection() {
  return (
    <section className="u-section explorations" aria-label="Explorations">
      <Container>
        <Reveal>
          <div className="explorations__head">
            {/* Eyebrow 3 of 3 on Home. */}
            <p className="u-eyebrow">Explorations</p>
            {/* TODO(content): section headline, max 6 words */}
            <h2 className="u-h2 explorations__title">Section headline goes here</h2>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="bento">
            {CELLS.map((cell) => (
              <article
                className={`bento__cell bento__cell--${cell.area} bento__cell--${cell.kind}`}
                key={cell.area}
              >
                {cell.kind === 'image' ? (
                  <div className="bento__media">
                    {/* TODO(asset): replace with a real exploration image, and rewrite the alt text */}
                    <img
                      className="bento__img"
                      src={`https://picsum.photos/seed/${cell.seed}/1200/900`}
                      alt={`Placeholder image for ${cell.title}`}
                      width="1200"
                      height="900"
                      loading="lazy"
                    />
                  </div>
                ) : null}

                <div className="bento__body">
                  {/* TODO(content): cell title, max 4 words */}
                  <h3 className="u-h3 bento__title">{cell.title}</h3>
                  {/* TODO(content): one line, max 14 words */}
                  <p className="bento__line">{cell.line}</p>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
