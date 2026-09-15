const fs = require('fs');
const path = require('path');

const rawHtmlDir = path.join(__dirname, '../raw_html');
const pagesDir = path.join(__dirname, 'src/pages');

if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

// Also include home page from the root
const pages = [
  { file: '../index.html', component: 'Home', route: '/' },
  { file: '../raw_html/about.html', component: 'About', route: '/about' },
  { file: '../raw_html/work.html', component: 'Work', route: '/work' },
  { file: '../raw_html/blog.html', component: 'Blog', route: '/blog' },
  { file: '../raw_html/resume.html', component: 'Resume', route: '/resume' },
  { file: '../raw_html/contact.html', component: 'Contact', route: '/contact' },
  { file: '../raw_html/mentoring.html', component: 'Mentoring', route: '/mentoring' },
  { file: '../raw_html/work_bolddesk.html', component: 'WorkBoldDesk', route: '/work/bolddesk' },
  { file: '../raw_html/work_ln_music_school.html', component: 'WorkLnMusicSchool', route: '/work/ln-music-school' },
  { file: '../raw_html/work_svg_sprite_compiler.html', component: 'WorkSvgSpriteCompiler', route: '/work/svg-sprite-compiler' }
];

function htmlToJsx(html) {
  let match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!match) return null;
  let body = match[1];

  body = body.replace(/<script[\s\S]*?<\/script>/gi, '');
  body = body.replace(/<!--[\s\S]*?-->/gi, '');
  body = body.replace(/class="/g, 'className="');
  body = body.replace(/for="/g, 'htmlFor="');

  const selfClosing = ['img', 'input', 'hr', 'br', 'source', 'circle', 'path', 'ellipse', 'rect', 'line', 'stop', 'feGaussianBlur', 'feComposite'];
  for (const tag of selfClosing) {
    const regex = new RegExp(`<${tag}\\b([^>]*?)(?<!/)>`, 'gi');
    body = body.replace(regex, (m, p1) => {
      if (p1.trim().endsWith('/')) return m;
      return `<${tag}${p1} />`;
    });
    body = body.replace(new RegExp(`</${tag}>`, 'gi'), '');
  }

  body = body.replace(/style="([^"]*)"/g, (m, styles) => {
    const styleObj = {};
    styles.split(';').forEach(s => {
      if (!s.trim()) return;
      const [key, ...values] = s.split(':');
      const value = values.join(':');
      if (key && value) {
        let formattedKey = key.trim();
        if (!formattedKey.startsWith('--')) {
          formattedKey = formattedKey.replace(/-([a-z])/g, g => g[1].toUpperCase());
        }
        styleObj[formattedKey] = value.trim();
      }
    });
    return `style={${JSON.stringify(styleObj)}}`;
  });

  const svgAttrs = [
    'stroke-width', 'stroke-linecap', 'stroke-linejoin', 
    'stop-color', 'fill-opacity', 'clip-path', 'stroke-miterlimit', 
    'stroke-dasharray', 'stroke-dashoffset'
  ];
  svgAttrs.forEach(attr => {
    const camel = attr.replace(/-([a-z])/g, g => g[1].toUpperCase());
    const regex = new RegExp(`\\s${attr}="`, 'g');
    body = body.replace(regex, ` ${camel}="`);
  });

  body = body.replace(/<section\b/g, '<motion.section');
  body = body.replace(/<\/section>/g, '</motion.section>');

  body = body.replace(/<motion.section([^>]*className="[^"]*reveal[^"]*"[^>]*)>/g, '<motion.section$1 initial={{opacity: 0, y: 30}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{type: "spring", stiffness: 120, damping: 14, mass: 0.8}}>');

  // Convert internal links to React Router Links
  body = body.replace(/<a([^>]*?)href="(\/[^"]*)"([^>]*)>([\s\S]*?)<\/a>/g, '<Link$1to="$2"$3>$4</Link>');

  // Fix assets
  body = body.replace(/"\/(assets\/[^"]*)"/g, '"https://ariharan.web.app/$1"');

  return body;
}

let routesJsx = '';
let importsJsx = '';

for (const p of pages) {
  const filePath = path.join(__dirname, p.file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${filePath}, not found.`);
    continue;
  }
  const html = fs.readFileSync(filePath, 'utf8');
  const jsxBody = htmlToJsx(html);
  if (!jsxBody) continue;

  const componentCode = `
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function ${p.component}() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }} 
      transition={{ type: 'spring', stiffness: 300, damping: 25, mass: 0.5 }}
    >
      ${jsxBody}
    </motion.div>
  );
}
`;
  fs.writeFileSync(path.join(pagesDir, `${p.component}.jsx`), componentCode);
  console.log(`Generated ${p.component}.jsx`);
  
  importsJsx += `import ${p.component} from './pages/${p.component}';\n`;
  routesJsx += `        <Route path="${p.route}" element={<${p.component} />} />\n`;
}

// Generate App.jsx
const appJsx = `
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';

${importsJsx}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
${routesJsx}
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <ScrollToTop />
      <div className="app-container">
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="dark-mode-toggle"
          style={{ 
            position: 'fixed', 
            bottom: 24, 
            right: 24, 
            zIndex: 9999, 
            padding: '12px 20px', 
            borderRadius: 30, 
            border: '1px solid var(--ink)', 
            background: 'var(--surface)', 
            color: 'var(--ink)',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: 'var(--shadow)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.2s ease'
          }}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
        
        <AnimatedRoutes />
      </div>
    </Router>
  );
}
`;

fs.writeFileSync('src/App.jsx', appJsx);
console.log('App.jsx with Router generated!');
