import HeroSection from '../sections/HeroSection';
import CapabilityMarquee from '../sections/CapabilityMarquee';
import StatementSection from '../sections/StatementSection';
import SelectedWork from '../sections/SelectedWork';
import ProcessSection from '../sections/ProcessSection';
import SignalsSection from '../sections/SignalsSection';
import ExplorationsSection from '../sections/ExplorationsSection';
import ClosingSection from '../sections/ClosingSection';

/**
 * Home composition. Eight sections, eight distinct layout families, in the
 * order fixed by DESIGN_CONTRACT.md section 5. Do not reorder or duplicate a
 * family here; the no-repeat rule is enforced at this level.
 *
 * Sections 1, 4, 5, 6 and 8 each drive the persistent WebGL layer to a
 * different stage as they enter view.
 */
export default function Home() {
  return (
    <main id="main">
      <HeroSection />
      <CapabilityMarquee />
      <StatementSection />
      <SelectedWork />
      <ProcessSection />
      <SignalsSection />
      <ExplorationsSection />
      <ClosingSection />
    </main>
  );
}
