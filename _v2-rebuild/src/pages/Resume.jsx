import { Link } from 'react-router-dom';
import { Printer } from '@phosphor-icons/react';
import Container from '../components/Container';
import Reveal from '../components/Reveal';
import './page-shell.css';
import './resume.css';

/* TODO(content): structural placeholders only. Nothing about a real role,
   employer, school or date is known. Fill these in from the real resume.
   role: max 6 words. organisation: max 5 words. note: max 25 words. */
const EXPERIENCE = ['one', 'two', 'three'];
const EDUCATION = ['one', 'two'];

/* TODO(content): rename each cluster to a real grouping, max 3 words, and
   replace the five placeholder tags in each with real skills. */
const SKILL_CLUSTERS = [
  { id: 'cluster-one', label: 'Skill cluster one' },
  { id: 'cluster-two', label: 'Skill cluster two' },
  { id: 'cluster-three', label: 'Skill cluster three' },
];

const SKILL_SLOTS = ['one', 'two', 'three', 'four', 'five'];

export default function Resume() {
  return (
    <main className="pg-main rs-page">
      <Container as="section" className="pg-head">
        <h1 className="u-h1 pg-head__title">Resume</h1>
        {/* TODO(content): one line summary of what you do, max 20 words */}
        <p className="pg-slot pg-head__lede">
          Short summary line for the resume goes here.
        </p>
        <div className="rs-actions rs-print-hide">
          <button type="button" className="u-btn" onClick={() => window.print()}>
            <Printer size={14} weight="regular" aria-hidden="true" />
            Print resume
          </button>
        </div>
      </Container>

      <Container as="section" className="u-section rs-body">
        <section className="rs-section" aria-labelledby="rs-experience">
          <div className="rs-section__head">
            <h2 className="u-h2" id="rs-experience">Experience</h2>
          </div>
          <div className="rs-cards">
            {EXPERIENCE.map((item, i) => (
              <Reveal key={item} delay={0.04 * i}>
                <article className="rs-card">
                  {/* TODO(content): real dates. Never estimate a date. */}
                  <p className="rs-card__period">--</p>
                  {/* TODO(content): role title, max 6 words */}
                  <h3 className="u-h3">Role title {item}</h3>
                  {/* TODO(content): organisation name, max 5 words */}
                  <p className="rs-card__org">Organisation name goes here</p>
                  {/* TODO(content): what the role involved, max 25 words */}
                  <p className="pg-slot rs-card__note">
                    One line describing this role goes here.
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="rs-section" aria-labelledby="rs-education">
          <div className="rs-section__head">
            <h2 className="u-h2" id="rs-education">Education</h2>
          </div>
          <div className="rs-cards">
            {EDUCATION.map((item, i) => (
              <Reveal key={item} delay={0.04 * i}>
                <article className="rs-card">
                  {/* TODO(content): real dates. Never estimate a date. */}
                  <p className="rs-card__period">--</p>
                  {/* TODO(content): qualification, max 6 words */}
                  <h3 className="u-h3">Qualification {item}</h3>
                  {/* TODO(content): institution name, max 5 words */}
                  <p className="rs-card__org">Institution name goes here</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="rs-section" aria-labelledby="rs-skills">
          <div className="rs-section__head">
            <h2 className="u-h2" id="rs-skills">Skills</h2>
          </div>
          {SKILL_CLUSTERS.map((cluster) => (
            <div className="rs-cluster" key={cluster.id}>
              <div>
                {/* TODO(content): cluster name, max 3 words */}
                <h3 className="u-h3">{cluster.label}</h3>
              </div>
              <ul className="rs-tags">
                {SKILL_SLOTS.map((slot) => (
                  <li className="rs-tag" key={`${cluster.id}-${slot}`}>
                    {/* TODO(content): real skill, max 3 words */}
                    Skill {slot}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="rs-section rs-print-hide">
          <div className="rs-section__head">
            <h2 className="u-h3">Need this as a conversation instead?</h2>
          </div>
          <Link to="/contact" className="u-btn">
            Start a conversation
          </Link>
        </section>
      </Container>
    </main>
  );
}
