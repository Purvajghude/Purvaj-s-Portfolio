
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';

import Home from './pages/Home';
import Work from './pages/Work';
import Resume from './pages/Resume';
import WorkLnMusicSchool from './pages/WorkLnMusicSchool';
import WorkSvgSpriteCompiler from './pages/WorkSvgSpriteCompiler';
import Header from './components/Header';


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
        <Route path="/" element={<Home />} />
        
        <Route path="/work" element={<Work />} />
        
        <Route path="/resume" element={<Resume />} />
        <Route path="/work/ln-music-school" element={<WorkLnMusicSchool />} />
        <Route path="/work/svg-sprite-compiler" element={<WorkSvgSpriteCompiler />} />

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
        <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode((current) => !current)} />
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
