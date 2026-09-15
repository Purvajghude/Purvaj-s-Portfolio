import { Link } from 'react-router-dom';
import './Footer.css';

/**
 * Deliberately has no call to action. ClosingSection already spends the
 * "contact" intent with the canonical label, and the contract forbids two
 * CTAs sharing one intent. This is navigation and attribution only.
 */

const NAV = [
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/resume', label: 'Resume' },
  { to: '/contact', label: 'Contact' },
];

/* TODO(content): replace href="#" with real profile URLs, or delete
   any row that does not apply. Do not ship placeholder links live. */
const SOCIAL = [
  { label: 'LinkedIn', href: '#' },
  { label: 'GitHub', href: '#' },
  { label: 'Email', href: '#' },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__mark">
          <span className="site-footer__name">Purvaj Ghude</span>
          {/* TODO(content): one short line describing what you do, max 10 words. */}
          <p className="site-footer__line">Short descriptor line goes here</p>
        </div>

        <nav className="site-footer__col" aria-label="Footer">
          <h2 className="site-footer__heading">Pages</h2>
          {NAV.map((item) => (
            <Link key={item.to} to={item.to} className="site-footer__link">
              {item.label}
            </Link>
          ))}
        </nav>

        <nav className="site-footer__col" aria-label="Elsewhere">
          <h2 className="site-footer__heading">Elsewhere</h2>
          {SOCIAL.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="site-footer__link"
              target="_blank"
              rel="noreferrer"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="site-footer__base">
        <span>&copy; {new Date().getFullYear()} Purvaj Ghude</span>
      </div>
    </footer>
  );
}
