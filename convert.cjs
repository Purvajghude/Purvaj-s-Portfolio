const fs = require('fs');
let html = fs.readFileSync('../index.html', 'utf8');

let match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
let body = match[1];

body = body.replace(/<script[\s\S]*?<\/script>/gi, '');
body = body.replace(/<!--[\s\S]*?-->/gi, '');
body = body.replace(/class="/g, 'className="');
body = body.replace(/for="/g, 'htmlFor="');

const selfClosing = ['img', 'input', 'hr', 'br', 'source', 'circle', 'path', 'ellipse', 'rect', 'line', 'stop', 'feGaussianBlur', 'feComposite'];
for (const tag of selfClosing) {
  const regex = new RegExp(`<${tag}\\b([^>]*?)(?<!/)>`, 'gi');
  body = body.replace(regex, (match, p1) => {
    if (p1.trim().endsWith('/')) return match;
    return `<${tag}${p1} />`;
  });
  body = body.replace(new RegExp(`</${tag}>`, 'gi'), '');
}

body = body.replace(/style="([^"]*)"/g, (match, styles) => {
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

body = body.replace(/<motion.section([^>]*className="[^"]*reveal[^"]*"[^>]*)>/g, '<motion.section$1 initial={{opacity: 0, y: 50}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{duration: 0.6}}>');

const jsx = `
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';

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
    <div className="app-container">
      <motion.button 
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
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </motion.button>
      ${body}
    </div>
  );
}
`;

fs.writeFileSync('src/App.jsx', jsx);
console.log('App.jsx generated perfectly!');
