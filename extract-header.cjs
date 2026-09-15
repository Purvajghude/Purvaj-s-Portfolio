const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const componentsDir = path.join(__dirname, 'src', 'components');

if (!fs.existsSync(componentsDir)) {
  fs.mkdirSync(componentsDir, { recursive: true });
}

// 1. Create Header.jsx
const headerJSX = `import React from 'react';
import { Link } from 'react-router-dom';

export default function Header({ darkMode, toggleDarkMode }) {
  return (
    <header className="site-header">
      <Link className="brand route-link bound" to="/" aria-label="Ariharan S, home">
        <span className="brand-mark"><img src="https://ariharan.web.app/assets/logo.jpg?v=20260614-white" alt="Ariharan Sivakumar Logo" className="brand-logo-img" /></span>
        <span className="brand-copy">Ariharan S<small>User Experience Designer</small></span>
      </Link>
      <div className="mobile-actions">
        <button onClick={toggleDarkMode} className="mobile-dark-toggle" aria-label="Toggle Dark Mode" style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', padding: '0 10px' }}>
          {darkMode ? '☀️' : '🌙'}
        </button>
        <Link className="route-link mobile-resume bound" to="/resume" aria-label="Resume">Resume</Link>
        <button className="menu-button" aria-expanded="false" aria-controls="site-nav" aria-label="Menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
      <nav className="site-nav" id="site-nav" aria-label="Main navigation">
        <Link className="route-link bound" to="/">Discover</Link>
        <Link className="route-link bound" to="/about">Define</Link>
        <Link className="route-link bound" to="/work">Works</Link>
        <Link className="route-link bound" to="/blog">Notes</Link>
        <Link className="route-link nav-resume bound" to="/resume">Resume</Link>
        <Link className="route-link nav-contact bound" to="/contact">Discuss ↗</Link>
        
        <button 
          onClick={toggleDarkMode}
          className="dark-mode-nav-toggle"
          style={{ 
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginLeft: 12,
            boxShadow: 'var(--shadow)',
            transition: 'all 0.2s'
          }}
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </nav>
    </header>
  );
}
`;

fs.writeFileSync(path.join(componentsDir, 'Header.jsx'), headerJSX);

// 2. Remove header from all pages
const files = fs.readdirSync(pagesDir);
files.forEach(file => {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(pagesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Use regex to remove <header className="site-header"> ... </header>
    // Since it spans multiple lines, we use [\s\S]*?
    const headerRegex = /<header className="site-header">[\s\S]*?<\/header>/i;
    content = content.replace(headerRegex, '');
    
    fs.writeFileSync(filePath, content);
  }
});

console.log("Header extracted and removed from pages!");
