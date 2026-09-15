import { Link } from 'react-router-dom';
import Container from '../components/Container';
import Reveal from '../components/Reveal';
import './page-shell.css';
import './about.css';

/* TODO(content): four belief slots. Each heading is max 6 words, each body is
   max 25 words. Write these in the first person. No career claims here. */
const BELIEFS = ['one', 'two', 'three', 'four'];

export default function About() {
  return (
    <main className="pg-main">
      <Container as="section" className="pg-head">
        <p className="pg-label">Purvaj Ghude</p>
        {/* TODO(content): one line positioning statement, max 12 words */}
        <h1 className="u-h1 pg-head__title pg-slot--head">
          Your positioning statement goes here
        </h1>
        {/* TODO(content): one paragraph introducing yourself, max 35 words */}
        <p className="pg-slot pg-head__lede">
          Short introduction paragraph goes here.
        </p>
      </Container>

      <Container as="section" className="u-section ab-body">
        <div className="ab-split">
          <div className="ab-portrait">
            <Reveal>
              <div className="ab-portrait__frame">
                {/* TODO(asset): replace with the real portrait of Purvaj Ghude
                    and write alt text that describes the actual photograph. */}
                <img
                  src="https://picsum.photos/seed/pg-about-portrait/960/1200"
                  alt="Placeholder portrait image"
                  width={960}
                  height={1200}
                  loading="lazy"
                />
              </div>
              {/* TODO(content): short caption for the portrait, max 10 words */}
              <p className="pg-label ab-portrait__note">Portrait caption goes here</p>
            </Reveal>
          </div>

          <div className="ab-bio">
            <Reveal delay={0.06}>
              {/* TODO(content): opening line of the bio, max 20 words */}
              <p className="u-h3 ab-bio__lede pg-slot">
                Opening line of the bio goes here.
              </p>
              {/* TODO(content): bio paragraph on how you work, max 60 words */}
              <p className="pg-slot">
                First bio paragraph goes here.
              </p>
              {/* TODO(content): bio paragraph on what you are drawn to, max 60 words */}
              <p className="pg-slot">
                Second bio paragraph goes here.
              </p>
              {/* TODO(content): bio paragraph on what you are working toward, max 60 words */}
              <p className="pg-slot">
                Third bio paragraph goes here.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="ab-beliefs">
          <Reveal>
            <h2 className="u-h2">What I believe</h2>
          </Reveal>
          <div className="ab-beliefs__grid">
            {BELIEFS.map((belief, i) => (
              <Reveal key={belief} delay={0.04 * i}>
                <div className="ab-belief">
                  {/* TODO(content): belief heading, max 6 words */}
                  <h3 className="u-h3">Belief heading {belief}</h3>
                  {/* TODO(content): why you hold it, max 25 words */}
                  <p className="pg-slot ab-belief__body">
                    Supporting sentence for this belief goes here.
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="ab-cta">
          <Reveal>
            <h2 className="u-h3">Want the longer version?</h2>
          </Reveal>
          <Reveal delay={0.06}>
            <Link to="/contact" className="u-btn">
              Start a conversation
            </Link>
          </Reveal>
        </div>
      </Container>
    </main>
  );
}
