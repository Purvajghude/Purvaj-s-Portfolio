import { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { List, X, Sun, Moon } from '@phosphor-icons/react';
import useTheme from './useTheme';
import './Header.css';

const NAV = [
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/resume', label: 'Resume' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { resolved, toggle } = useTheme();
  const reduce = useReducedMotion();
  const { pathname } = useLocation();
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  // Close the overlay on navigation so a route change never leaves it stranded.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock scroll and wire Escape while the overlay owns the screen.
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isDark = resolved === 'dark';

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-header__mark">
          Purvaj Ghude
        </Link>

        <nav className="site-header__nav" aria-label="Primary">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'site-header__link is-active' : 'site-header__link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          <button
            type="button"
            className="site-header__icon-btn"
            onClick={toggle}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-pressed={isDark}
          >
            {isDark ? <Sun size={18} weight="regular" /> : <Moon size={18} weight="regular" />}
          </button>

          <button
            ref={triggerRef}
            type="button"
            className="site-header__icon-btn site-header__burger"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={18} weight="regular" /> : <List size={18} weight="regular" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            tabIndex={-1}
            className="mobile-menu"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav className="mobile-menu__nav" aria-label="Primary, mobile">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: reduce ? 0 : 0.05 + i * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <NavLink to={item.to} className="mobile-menu__link">
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
