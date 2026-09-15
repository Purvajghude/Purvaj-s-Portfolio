import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import WebGLLayer from './webgl/WebGLLayer';
import Header from './components/Header';
import Footer from './components/Footer';
import NotFound from './components/NotFound';

import Home from './pages/Home';
import Work from './pages/Work';
import WorkDetail from './pages/WorkDetail';
import About from './pages/About';
import Resume from './pages/Resume';
import Contact from './pages/Contact';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

/**
 * Page transition. Justification (contract section 4): state transition.
 * It marks that the route changed without competing with the section-level
 * choreography, so it stays short and small.
 */
function AnimatedRoutes() {
  const location = useLocation();
  const reduce = useReducedMotion();

  const variants = reduce
    ? undefined
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
      };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={variants}
        initial={variants ? 'initial' : false}
        animate={variants ? 'animate' : false}
        exit={variants ? 'exit' : undefined}
        transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<WorkDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />

      {/* Persistent 3D through-line. Fixed, behind everything, never remounts
          on navigation because it sits outside the routed subtree. */}
      <WebGLLayer />

      <div className="u-grain" aria-hidden="true" />

      <a className="u-skip" href="#main">
        Skip to content
      </a>

      <Header />
      <AnimatedRoutes />
      <Footer />
    </Router>
  );
}
