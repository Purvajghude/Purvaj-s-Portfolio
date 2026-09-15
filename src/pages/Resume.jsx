import React from 'react';
import { motion } from 'framer-motion';

const PROJECTS = [
  {
    title: 'TEJAS',
    meta: 'Python · Machine learning · Space science',
    year: '2026',
    url: 'https://github.com/Purvajghude/TEJAS',
    bullets: [
      'Co-developed an Aditya-L1 solar-flare detection and forecasting pipeline for the Bharatiya Antariksh Hackathon, combining SoLEXS and HEL1OS X-ray data.',
      'Processed roughly 24 months and 15,459 events; achieved 97% GOES class agreement and 0.847 ROC-AUC with a leakage-free TCN + LightGBM ensemble.',
    ],
  },
  {
    title: 'Project Prometheus',
    meta: 'Python · FastAPI · WebSockets · AI',
    year: '2026',
    url: 'https://github.com/Purvajghude/Prometheus',
    bullets: [
      'Built a persistent digital civilization of eight autonomous citizens with decisions, conversations, memories, relationships, and nightly reflection.',
      'Delivered a live Observer dashboard over FastAPI and WebSockets, with durable world state, catch-up simulation, model routing, and daily spend limits.',
    ],
  },
  {
    title: 'Mesh',
    meta: 'Flutter · Dart · Supabase',
    year: '2026',
    url: 'https://github.com/Purvajghude/Mesh',
    bullets: [
      'Created a cross-platform collaboration app that matches builders by complementary skills, then supports matching, profiles, chat, and a community feed.',
      'Structured the feature architecture, Supabase data layer, authentication, realtime flows, migrations, security plan, and branch-based team workflow for a hackathon team.',
    ],
  },
  {
    title: 'Hermes + Ledger',
    meta: 'Python · Docker · Data products',
    year: '2026',
    url: 'https://github.com/Purvajghude/Deal-Scraper',
    bullets: [
      'Built a self-hosted opportunity engine that discovers from seven sources every six hours, deduplicates, ranks, price-checks, and sends Telegram alerts.',
      'Added a privacy-first finance tracker for income, expenses, category budgets, and six-month cash flow; both apps run locally and ship through Docker.',
    ],
  },
  {
    title: 'Pixie Wixie',
    meta: 'TypeScript · Computer graphics',
    year: '2026',
    url: 'https://github.com/Purvajghude/Pixie-Wixie',
    bullets: [
      'Built an offline raster-to-vector studio and CLI that turns JPG/PNG files into editable SVG geometry without uploads, APIs, or telemetry.',
      'Implemented quantization, segmentation, contour tracing, Bézier fitting, and primitive recovery; reduced one mind-map from 29,431 paths to 6 paths and 17.4 KB.',
    ],
  },
  {
    title: 'Game of Growth',
    meta: 'React · FastAPI · MongoDB · Product systems',
    year: '2026',
    url: 'https://github.com/Purvajghude/Game-of-Growth',
    bullets: [
      'Created a creative-agency product experience with 12+ distinct visual sections plus a founder dashboard for leads, Kanban pipeline management, content planning, and analytics.',
      'Built the React 19, Tailwind, GSAP, and React Three Fiber frontend with a FastAPI/MongoDB backend; documented 17/17 passing API tests and end-to-end flows.',
    ],
  },
  {
    title: 'Gesture-Controlled Particles',
    meta: 'JavaScript · Computer vision · Creative coding',
    year: '2025',
    url: 'https://github.com/Purvajghude/Gesture-controlled-Particles',
    bullets: [
      'Built an interactive browser experiment that maps hand gestures to real-time particle behavior, turning computer vision input into a visual instrument.',
      'Explored low-latency interaction design, canvas rendering, gesture state, and expressive motion in a compact, shareable web experience.',
    ],
  },
];

const MOTION = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { type: 'spring', stiffness: 120, damping: 14, mass: 0.8 },
};

export default function Resume() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25, mass: 0.5 }}
    >
      <div className="noise" aria-hidden="true" />

      <main id="app" tabIndex="-1">
        <div className="page resume-page">
          <motion.section className="page-hero grid-paper reveal revealed" {...MOTION}>
            <div className="phase-chip"><span>CV</span> Built from evidence</div>
            <h1>I build, test<br />&amp; explain.</h1>
            <p>
              A project-led resume covering my engineering work, measurable results,
              education, technical range, and the subjects I keep exploring.
            </p>
            <span className="scribble" aria-hidden="true">look closer ↓</span>
          </motion.section>

          <motion.section className="resume-wrap reveal revealed" {...MOTION}>
            <div className="resume-actions">
              <a className="button" href="/Purvaj-Ghude-Resume.pdf" download="Purvaj-Ghude-Resume.pdf">
                Print / Save PDF
              </a>
              <a
                className="button button-ink"
                href="https://github.com/Purvajghude"
                target="_blank"
                rel="noreferrer"
              >
                View GitHub
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
              </a>
            </div>

            <article className="resume-paper">
              <div className="coffee-ring" aria-hidden="true" />

              <header className="resume-header">
                <div className="resume-identity">
                  <span className="resume-kicker">Full-stack engineering · Applied ML · Creative tools</span>
                  <h2>Purvaj Ghude</h2>
                  <p>Information Technology Undergraduate &amp; Software Builder</p>
                  <address className="resume-contact" aria-label="Contact details">
                    <a href="mailto:purvajascends@gmail.com" className="resume-contact-link">
                      purvajascends@gmail.com
                    </a>
                    <span className="resume-contact-dot" aria-hidden="true">•</span>
                    <a href="https://github.com/Purvajghude" target="_blank" rel="noreferrer" className="resume-contact-link">
                      github.com/Purvajghude
                    </a>
                    <span className="resume-contact-dot" aria-hidden="true">•</span>
                    <a href="https://www.linkedin.com/in/purvaj-ghude-45b5271bb" target="_blank" rel="noreferrer" className="resume-contact-link">
                      LinkedIn
                    </a>
                    <span className="resume-contact-dot" aria-hidden="true">•</span>
                    <span className="resume-contact-static">Shahapur, Maharashtra, India</span>
                  </address>
                </div>
              </header>

              <motion.section className="resume-summary reveal" {...MOTION}>
                <h3>Profile</h3>
                <p>
                  Information Technology undergraduate building measurable software across
                  computer graphics, applied machine learning, AI systems, and mobile products.
                  I turn ambitious ideas into documented, tested tools that expose how they work,
                  where they perform well, and where they do not.
                </p>
              </motion.section>

              <motion.section className="resume-impact-strip reveal" {...MOTION}>
                <article><strong>21</strong><span>public GitHub repositories</span></article>
                <article><strong>123</strong><span>contributions in the last year</span></article>
                <article><strong>99</strong><span>automated Pixie tests</span></article>
                <article><strong>5</strong><span>languages across my profile</span></article>
              </motion.section>

              <div className="resume-columns">
                <main>
                  <h3>Selected Engineering Projects</h3>
                  {PROJECTS.map((project) => (
                    <article key={project.title}>
                      <div>
                        <a className="resume-project-link" href={project.url} target="_blank" rel="noreferrer">
                          <strong>{project.title} ↗</strong>
                        </a>
                        <span>{project.meta}</span>
                      </div>
                      <time>{project.year}</time>
                      <ul>
                        {project.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                      </ul>
                    </article>
                  ))}

                  <h3>Engineering Highlights</h3>
                  <ul className="resume-achievements">
                    <li>Published TEJAS models and held-out predictions so its reported forecasting results can be independently verified.</li>
                    <li>Designed Pixie Wixie around real intermediate algorithm state, making every transformation inspectable in its process view.</li>
                  <li>Built across browser, CLI, mobile, backend, database, realtime, AI, and machine-learning layers—not just interface prototypes.</li>
                    <li>Documented setup, architecture, testing, limitations, and contribution workflows so other builders can reproduce and extend the work.</li>
                  </ul>
                </main>

                <aside>
                  <h3>Languages</h3>
                  <p>TypeScript<br />Python<br />Dart<br />JavaScript<br />HTML &amp; CSS<br />SQL<br />Java</p>

                  <h3>Frameworks &amp; Platforms</h3>
                  <p>React<br />Vite<br />Flutter<br />FastAPI<br />Supabase<br />Firebase<br />MongoDB<br />Node.js<br />Streamlit</p>

                  <h3>Engineering</h3>
                  <p>Algorithms<br />Computer graphics<br />Machine learning<br />AI product design<br />API design<br />WebSockets<br />Data pipelines<br />Automated testing<br />Benchmarking<br />Docker<br />Git &amp; GitHub</p>

                  <h3>Education</h3>
                  <p>
                    <strong>B.E. Information Technology</strong><br />
                    University of Mumbai<br />
                    Mahatma Gandhi Missions College of Engineering and Technology<br />
                    2025—2029
                  </p>

                  <h3>Hackathons</h3>
                  <p>
                    <strong>Bharatiya Antariksh Hackathon</strong><br />
                    Aditya-L1 solar-flare challenge · 2026<br /><br />
                    <strong>RedRob Ideathon</strong><br />
                    Mesh collaboration app · 2026
                  </p>

                  <h3>Interests &amp; Hobbies</h3>
                  <p>
                    Computer graphics<br />
                    Algorithm visualization<br />
                    Space science<br />
                    AI simulations<br />
                    Technical writing<br />
                    Learning in public
                  </p>
                </aside>
              </div>
            </article>
          </motion.section>
        </div>
      </main>

      <footer className="site-footer">
        <div>
          <p className="eyebrow">Want to build something difficult?</p>
          <a className="footer-cta route-link bound" href="mailto:purvajascends@gmail.com">
            Let’s turn the idea into working software.
          </a>
        </div>
        <div className="footer-meta">
          <nav className="footer-socials" aria-label="Social links">
            <a href="https://github.com/Purvajghude" target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href="https://www.linkedin.com/in/purvaj-ghude-45b5271bb" target="_blank" rel="noreferrer">LinkedIn ↗</a>
          </nav>
          <span>Shahapur, Maharashtra</span>
          <span>© {new Date().getFullYear()} Purvaj Ghude</span>
        </div>
      </footer>
    </motion.div>
  );
}
