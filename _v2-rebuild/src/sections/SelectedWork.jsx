import { Link } from 'react-router-dom';
import { ArrowUpRight } from '@phosphor-icons/react';
import HorizontalPan from '../scroll/HorizontalPan';
import { useStageTrigger } from '../webgl/stage';
import Container from '../components/Container';
import Reveal from '../components/Reveal';
import './SelectedWork.css';

/**
 * Section 4 of 8. Layout family: horizontal-pan (GSAP pinned, owned by HorizontalPan).
 * Carries eyebrow 2 of 3.
 */

/* TODO(content): replace all four entries with real projects.
   title max 4 words, line max 12 words, slug must match the /work/:slug route. */
const PROJECTS = [
  {
    slug: 'project-one',
    seed: 'pg-work-panel-01',
    title: 'Project one title',
    line: 'One line describing project one goes here.',
  },
  {
    slug: 'project-two',
    seed: 'pg-work-panel-02',
    title: 'Project two title',
    line: 'One line describing project two goes here.',
  },
  {
    slug: 'project-three',
    seed: 'pg-work-panel-03',
    title: 'Project three title',
    line: 'One line describing project three goes here.',
  },
  {
    slug: 'project-four',
    seed: 'pg-work-panel-04',
    title: 'Project four title',
    line: 'One line describing project four goes here.',
  },
];

export default function SelectedWork() {
  const stageRef = useStageTrigger('work');

  return (
    <section ref={stageRef} className="work" aria-label="Selected work">
      <div className="work__head">
        <Container>
          <Reveal>
            {/* Eyebrow 2 of 3 on Home. */}
            <p className="u-eyebrow work__eyebrow">Selected work</p>
            {/* TODO(content): section headline, max 6 words */}
            <h2 className="u-h2 work__title">Section headline goes here</h2>
          </Reveal>
        </Container>
      </div>

      <HorizontalPan className="work__pan">
        {PROJECTS.map((project) => (
          <article className="panel" key={project.slug}>
            <div className="panel__inner">
              <div className="panel__media">
                {/* TODO(asset): replace with the real cover image for this project, and rewrite the alt text */}
                <img
                  className="panel__img"
                  src={`https://picsum.photos/seed/${project.seed}/1200/900`}
                  alt={`Placeholder cover image for ${project.title}`}
                  width="1200"
                  height="900"
                  loading="lazy"
                />
              </div>

              <div className="panel__meta">
                {/* TODO(content): project title, max 4 words */}
                <h3 className="u-h3 panel__title">
                  <Link className="panel__link" to={`/work/${project.slug}`}>
                    <span>{project.title}</span>
                    <ArrowUpRight size={20} weight="regular" aria-hidden="true" />
                  </Link>
                </h3>
                {/* TODO(content): one line about the project, max 12 words, no client names */}
                <p className="panel__line">{project.line}</p>
              </div>
            </div>
          </article>
        ))}
      </HorizontalPan>
    </section>
  );
}
