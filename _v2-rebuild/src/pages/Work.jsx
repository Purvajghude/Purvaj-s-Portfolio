import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, FolderOpen } from '@phosphor-icons/react';
import Container from '../components/Container';
import Reveal from '../components/Reveal';
import './page-shell.css';
import './work.css';

/* TODO(content): every field below is a placeholder. Replace with real case
   studies before launch. `slug` must stay in sync with the slug list in
   WorkDetail.jsx until both read from one shared data source.
   title:      max 6 words
   summary:    max 16 words
   discipline: max 3 words
   Invent nothing here. No client names, no dates, no metrics. */
const ENTRIES = [
  {
    slug: 'case-study-one',
    title: 'Case study title one',
    summary: 'One line summary of this project goes here',
    discipline: 'Discipline label',
    seed: 'pg-work-cover-one',
    cell: 'lead',
  },
  {
    slug: 'case-study-two',
    title: 'Case study title two',
    summary: 'One line summary of this project goes here',
    discipline: 'Discipline label',
    seed: 'pg-work-cover-two',
    cell: 'a',
  },
  {
    slug: 'case-study-three',
    title: 'Case study title three',
    summary: 'One line summary of this project goes here',
    discipline: 'Discipline label',
    seed: 'pg-work-cover-three',
    cell: 'b',
  },
  {
    slug: 'case-study-four',
    title: 'Case study title four',
    summary: 'One line summary of this project goes here',
    discipline: 'Discipline label',
    seed: 'pg-work-cover-four',
    cell: 'c',
  },
  {
    slug: 'case-study-five',
    title: 'Case study title five',
    summary: 'One line summary of this project goes here',
    discipline: 'Discipline label',
    seed: 'pg-work-cover-five',
    cell: 'd',
  },
];

const MEDIA = {
  lead: { w: 1600, h: 900 },
  a: { w: 1200, h: 900 },
  b: { w: 900, h: 1200 },
  c: { w: 900, h: 900 },
  d: { w: 1280, h: 800 },
};

function EntryCard({ entry, headingClass }) {
  const size = MEDIA[entry.cell];
  return (
    <Link to={`/work/${entry.slug}`} className="wk-entry">
      <div className="wk-media">
        {/* TODO(asset): replace with the real cover image, and write alt text
            that describes the actual work rather than the placeholder. */}
        <img
          src={`https://picsum.photos/seed/${entry.seed}/${size.w}/${size.h}`}
          alt="Placeholder cover image for a case study"
          width={size.w}
          height={size.h}
          loading="lazy"
        />
      </div>
      {/* TODO(content): project title, max 6 words */}
      <h3 className={`${headingClass} wk-entry__title`}>{entry.title}</h3>
      {/* TODO(content): discipline label, max 3 words */}
      <p className="pg-label wk-entry__meta">{entry.discipline}</p>
      {/* TODO(content): one line summary, max 16 words */}
      <p className="pg-slot wk-entry__summary">{entry.summary}</p>
      <span className="wk-cta">
        View case study
        <ArrowUpRight size={14} weight="regular" aria-hidden="true" />
      </span>
    </Link>
  );
}

function IndexSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="pg-skel wk-skeleton__lead" />
      <div className="pg-skel wk-skeleton__bar" />
      <div className="pg-skel wk-skeleton__bar wk-skeleton__bar--short" />
      <div className="wk-grid">
        {['a', 'b', 'c', 'd'].map((cell) => (
          <div key={cell} className={`wk-cell--${cell}`}>
            <div className="wk-media pg-skel" />
            <div className="pg-skel wk-skeleton__bar" />
            <div className="pg-skel wk-skeleton__bar wk-skeleton__bar--short" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyIndex() {
  return (
    <div className="pg-state wk-empty">
      <FolderOpen size={28} weight="regular" className="pg-state__icon" aria-hidden="true" />
      <h2 className="u-h3">No case studies are published yet.</h2>
      <p className="pg-state__body">
        The index is empty on purpose. New work appears here as soon as it is
        written up. Until then the fastest route is a direct conversation.
      </p>
      <Link to="/contact" className="u-btn">
        Start a conversation
      </Link>
    </div>
  );
}

export default function Work() {
  const reduced = useReducedMotion();

  /* TODO(content): entries are hard coded for now. When they move to a data
     source, fetch here and keep the three branches below intact. */
  const entries = ENTRIES;
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      if (!cancelled) setStatus(entries.length > 0 ? 'ready' : 'empty');
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [entries.length]);

  const [lead, ...rest] = entries;
  const fade = reduced
    ? { duration: 0 }
    : { duration: 0.32, ease: [0.16, 1, 0.3, 1] };

  return (
    <main className="pg-main">
      <Container as="section" className="pg-head">
        <h1 className="u-h1 pg-head__title">Selected work</h1>
        {/* TODO(content): one line framing the index, max 20 words */}
        <p className="pg-slot pg-head__lede">
          Short framing sentence for the work index goes here.
        </p>
        <p className="wk-count">
          <span className="pg-label">Case studies</span>
          {/* TODO(content): count is derived, no placeholder needed once real */}
          <span className="pg-dash">{status === 'ready' ? entries.length : '--'}</span>
        </p>
      </Container>

      <Container as="section" className="u-section wk-body">
        <p className="u-visually-hidden" role="status">
          {status === 'loading' ? 'Loading the work index.' : 'Work index loaded.'}
        </p>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={status}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fade}
          >
            {status === 'loading' && <IndexSkeleton />}
            {status === 'empty' && <EmptyIndex />}
            {status === 'ready' && (
              <>
                <Reveal>
                  <Link to={`/work/${lead.slug}`} className="wk-entry wk-lead">
                    <div className="wk-media">
                      {/* TODO(asset): replace with the real lead cover image and
                          write alt text describing the actual work. */}
                      <img
                        src={`https://picsum.photos/seed/${lead.seed}/${MEDIA.lead.w}/${MEDIA.lead.h}`}
                        alt="Placeholder cover image for the lead case study"
                        width={MEDIA.lead.w}
                        height={MEDIA.lead.h}
                        fetchPriority="high"
                      />
                    </div>
                    <div className="wk-lead__body">
                      <div className="wk-lead__headline">
                        {/* TODO(content): lead project title, max 6 words */}
                        <h2 className="u-h2 wk-entry__title">{lead.title}</h2>
                        {/* TODO(content): discipline label, max 3 words */}
                        <p className="pg-label wk-entry__meta">{lead.discipline}</p>
                      </div>
                      <div className="wk-lead__aside">
                        {/* TODO(content): one line summary, max 16 words */}
                        <p className="pg-slot">{lead.summary}</p>
                        <span className="wk-cta">
                          View case study
                          <ArrowUpRight size={14} weight="regular" aria-hidden="true" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>

                <div className="wk-grid">
                  {rest.map((entry, i) => (
                    <div key={entry.slug} className={`wk-cell--${entry.cell}`}>
                      <Reveal delay={0.04 * i}>
                        <EntryCard entry={entry} headingClass="u-h3" />
                      </Reveal>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </Container>
    </main>
  );
}
