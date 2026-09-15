import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Question } from '@phosphor-icons/react';
import Container from '../components/Container';
import Reveal from '../components/Reveal';
import './page-shell.css';
import './work-detail.css';

/* TODO(content): placeholder entries only. Keep these slugs in sync with
   src/pages/Work.jsx until both read from one shared data source.
   title: max 6 words. Nothing else about a project is known yet. */
const ENTRIES = [
  { slug: 'case-study-one', title: 'Case study title one', seed: 'pg-work-cover-one' },
  { slug: 'case-study-two', title: 'Case study title two', seed: 'pg-work-cover-two' },
  { slug: 'case-study-three', title: 'Case study title three', seed: 'pg-work-cover-three' },
  { slug: 'case-study-four', title: 'Case study title four', seed: 'pg-work-cover-four' },
  { slug: 'case-study-five', title: 'Case study title five', seed: 'pg-work-cover-five' },
];

/* Structural labels only. Values stay as visible placeholders until the real
   facts exist. Contract section 0.1: never fake-precise. */
const META_FIELDS = ['Role', 'Timeframe', 'Scope', 'Collaborators'];

const PROCESS_STEPS = ['one', 'two', 'three'];
const OUTCOME_FIGURES = ['Outcome label one', 'Outcome label two', 'Outcome label three'];

function NotFound({ slug }) {
  return (
    <main className="pg-main">
      <Container as="section" className="wd-notfound">
        <div className="pg-state">
          <Question size={28} weight="regular" className="pg-state__icon" aria-hidden="true" />
          <h1 className="u-h3">That case study is not here.</h1>
          <p className="pg-state__body">
            The link may be out of date, or the write up has not been published
            yet. Everything that is live sits on the work index.
          </p>
          {slug ? (
            <p className="pg-state__code">Requested: /work/{slug}</p>
          ) : null}
          <Link to="/work" className="u-btn">
            All work
          </Link>
        </div>
      </Container>
    </main>
  );
}

export default function WorkDetail() {
  const { slug } = useParams();
  const index = ENTRIES.findIndex((entry) => entry.slug === slug);

  if (index === -1) {
    return <NotFound slug={slug} />;
  }

  const entry = ENTRIES[index];
  const previous = ENTRIES[(index - 1 + ENTRIES.length) % ENTRIES.length];
  const next = ENTRIES[(index + 1) % ENTRIES.length];
  const hasSiblings = ENTRIES.length > 1;

  return (
    <main className="pg-main">
      <Container as="section" className="pg-head">
        <Link to="/work" className="wd-back">
          <ArrowLeft size={14} weight="regular" aria-hidden="true" />
          All work
        </Link>

        <div className="wd-title">
          {/* TODO(content): project title, max 6 words */}
          <h1 className="u-h1 wd-title__heading">{entry.title}</h1>
          {/* TODO(content): one paragraph positioning the project, max 30 words */}
          <p className="pg-slot wd-title__summary">
            Short paragraph framing what this project was and why it mattered
            goes here.
          </p>
        </div>

        <dl className="wd-meta">
          {META_FIELDS.map((field) => (
            <div key={field}>
              <dt className="pg-label">{field}</dt>
              {/* TODO(content): real value, max 4 words. Placeholder until known. */}
              <dd className="wd-meta__value">--</dd>
            </div>
          ))}
        </dl>

        <div className="wd-hero">
          {/* TODO(asset): replace with the real hero image for this case study
              and write alt text describing what it actually shows. */}
          <img
            src={`https://picsum.photos/seed/${entry.seed}-hero/1600/900`}
            alt="Placeholder hero image for this case study"
            width={1600}
            height={900}
            fetchPriority="high"
          />
        </div>
      </Container>

      <Container as="section" className="u-section wd-body">
        <Reveal>
          <div className="wd-block wd-block--lead">
            <div className="wd-block__inner--problem">
              <h2 className="u-h2 wd-block__heading">The problem</h2>
              {/* TODO(content): what was broken and who it affected, max 60 words */}
              <p className="pg-slot">
                Describe the situation before the work started here.
              </p>
              {/* TODO(content): the constraint that shaped the approach, max 40 words */}
              <p className="pg-slot">
                Describe the constraint that made this hard here.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="wd-block">
            <div className="wd-block__inner--process">
              <h2 className="u-h2 wd-block__heading">The process</h2>
              {PROCESS_STEPS.map((step) => (
                <div className="wd-step" key={step}>
                  <div>
                    {/* TODO(content): step heading, max 5 words */}
                    <h3 className="u-h3">Process step heading {step}</h3>
                  </div>
                  <div>
                    {/* TODO(content): what happened in this step, max 45 words */}
                    <p className="pg-slot">
                      Describe what was actually done in this step here.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="wd-block">
            <div className="wd-block__inner--outcome">
              <h2 className="u-h2 wd-block__heading">The outcome</h2>
              <div className="wd-outcome">
                <div className="wd-outcome__prose">
                  {/* TODO(content): what changed once it shipped, max 60 words */}
                  <p className="pg-slot">
                    Describe what changed once this shipped here.
                  </p>
                  {/* TODO(content): what you would do differently, max 40 words */}
                  <p className="pg-slot">
                    Describe what you would revisit next time here.
                  </p>
                </div>
                <div className="wd-outcome__figures">
                  {OUTCOME_FIGURES.map((label) => (
                    <div className="wd-figure" key={label}>
                      {/* TODO(content): real measured figure. Never estimate one. */}
                      <p className="wd-figure__value">00</p>
                      {/* TODO(content): what the figure measures, max 4 words */}
                      <p className="pg-label wd-figure__label">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {hasSiblings ? (
          <nav className="wd-nav" aria-label="Case study navigation">
            <Link to={`/work/${previous.slug}`} className="wd-nav__link">
              <span className="pg-label wd-nav__dir">
                <ArrowLeft size={14} weight="regular" aria-hidden="true" />
                Previous
              </span>
              {/* TODO(content): title comes from the entry list */}
              <span className="u-h3 wd-nav__title">{previous.title}</span>
            </Link>
            <Link to={`/work/${next.slug}`} className="wd-nav__link wd-nav__link--next">
              <span className="pg-label wd-nav__dir">
                Next
                <ArrowRight size={14} weight="regular" aria-hidden="true" />
              </span>
              {/* TODO(content): title comes from the entry list */}
              <span className="u-h3 wd-nav__title">{next.title}</span>
            </Link>
          </nav>
        ) : null}
      </Container>
    </main>
  );
}
