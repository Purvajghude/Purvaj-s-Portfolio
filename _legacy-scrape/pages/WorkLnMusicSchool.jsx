
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function WorkLnMusicSchool() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }} 
      transition={{ type: 'spring', stiffness: 300, damping: 25, mass: 0.5 }}
    >
      
    <div className="noise" aria-hidden="true"></div>
    

    <main id="app" tabindex="-1"></main>

    <footer className="site-footer">
      <div>
        <p className="eyebrow">Still curious?</p>
        <Link className="footer-cta route-link" to="/contact">Let’s make the complex feel clear.</Link>
      </div>
      <div className="footer-meta">
        <nav className="footer-socials" aria-label="Social links">
          <a href="https://www.instagram.com/ari_haran_ux/" target="_blank" rel="noreferrer" aria-label="Instagram, opens in a new tab">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7.03.084C5.753.144 4.881.348 4.119.647c-.789.308-1.458.72-2.123 1.388C1.331 2.703.921 3.372.616 4.162.321 4.926.121 5.798.065 7.076c-.056 1.278-.069 1.688-.063 4.947.006 3.259.021 3.667.083 4.947.061 1.277.264 2.148.563 2.911.308.789.72 1.457 1.388 2.123.668.665 1.337 1.074 2.129 1.38.763.295 1.636.496 2.913.552 1.277.056 1.688.069 4.946.063 3.258-.006 3.668-.021 4.948-.081 1.28-.061 2.147-.265 2.91-.564.789-.308 1.458-.72 2.123-1.388.665-.668 1.074-1.338 1.379-2.128.296-.764.497-1.636.552-2.913.056-1.281.069-1.69.063-4.948-.006-3.258-.021-3.667-.082-4.946-.061-1.28-.264-2.149-.563-2.912-.308-.789-.72-1.457-1.388-2.123C21.298 1.33 20.628.921 19.838.617 19.074.321 18.202.12 16.924.065 15.647.009 15.236-.005 11.977.001 8.718.008 8.31.022 7.03.084m.14 21.693c-1.17-.051-1.805-.245-2.228-.408-.561-.216-.96-.477-1.382-.895-.422-.418-.681-.819-.9-1.378-.164-.423-.362-1.058-.417-2.228-.059-1.265-.072-1.644-.079-4.848-.007-3.204.005-3.583.061-4.848.05-1.169.245-1.805.408-2.228.216-.561.476-.96.895-1.382.419-.421.818-.681 1.378-.9.423-.165 1.058-.361 2.227-.417 1.266-.06 1.645-.072 4.848-.079 3.203-.007 3.584.005 4.85.061 1.169.051 1.805.244 2.228.408.561.216.96.475 1.382.895.422.419.682.818.901 1.379.165.422.362 1.056.417 2.226.06 1.266.074 1.645.08 4.848.006 3.203-.006 3.583-.061 4.848-.051 1.17-.245 1.806-.408 2.229-.216.56-.476.96-.895 1.381-.419.422-.818.682-1.378.9-.423.165-1.058.362-2.227.418-1.265.059-1.645.072-4.849.079-3.204.007-3.582-.006-4.848-.061M16.953 5.586a1.44 1.44 0 1 0 2.88-.004 1.44 1.44 0 0 0-2.88.004M5.839 12.012c.006 3.403 2.77 6.156 6.173 6.149 3.403-.006 6.157-2.77 6.15-6.173-.006-3.403-2.771-6.157-6.174-6.15-3.403.007-6.156 2.771-6.149 6.174M8 12.008a4 4 0 1 1 4.008 3.992A4 4 0 0 1 8 12.008" />
            </svg>
            <span>Instagram</span>
          </a>
          <a href="https://wa.me/919944343587" target="_blank" rel="noreferrer" aria-label="WhatsApp, opens in a new tab">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
            <span>WhatsApp</span>
          </a>
          <a href="https://www.linkedin.com/in/ari-haran-793966222/" target="_blank" rel="noreferrer" aria-label="LinkedIn, opens in a new tab">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            <span>LinkedIn</span>
          </a>
        </nav>
        <span>Sivakasi, Tamil Nadu</span>
        <span className="footer-views">Views: <strong id="visitor-count" style={{"color":"var(--accent)","fontWeight":"600"}}>1,137</strong></span>
        <span>© <span id="year">2026</span> Purvaj Ghude</span>
      </div>
    </footer>

    
    <div className="mascot-widget" id="mascot-widget" aria-label="UX Mascot Assistant">
      <div className="mascot-bubble" id="mascot-bubble">
        <span className="mascot-bubble-mute" id="mascot-bubble-mute" role="button" title="Mute speech" aria-label="Mute speech">🔊</span>
        <span className="mascot-bubble-close" id="mascot-bubble-close" aria-label="Close bubble">×</span>
        <small className="mascot-bubble-label">HAPY - PURVAJ'S ASSISTANT</small>
        <p id="mascot-bubble-text">Hi, I'm Hapy! Let's explore Purvaj's site together.</p>
      </div>
      <button className="mascot-sleep-btn" id="mascot-sleep-btn" title="Send mascot to sleep">Take a break 💤</button>
      <div className="mascot-body-wrapper">
        <svg className="mascot-svg" viewBox="0 0 200 240" width="120" height="144">
          <defs>
            <linearGradient id="holographic-body" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#f5eef7" />
              <stop offset="70%" stopColor="#e6f2f7" />
              <stop offset="100%" stopColor="#d0edf5" />
            </linearGradient>
            <linearGradient id="visor-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2c2826" />
              <stop offset="100%" stopColor="#141211" />
            </linearGradient>
            <linearGradient id="halo-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f8bbd0" />
              <stop offset="50%" stopColor="#b3e5fc" />
              <stop offset="100%" stopColor="#fff6a8" />
            </linearGradient>
            <linearGradient id="cyan-neon" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="100%" stopColor="#00ffcc" />
            </linearGradient>
            <filter id="eye-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="jet-fire" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          
          <ellipse className="mascot-jet-glow" cx="100" cy="215" rx="22" ry="7" fill="url(#cyan-neon)" opacity="0.8" filter="url(#jet-fire)" />
          
          
          <g className="mascot-body-group">
            
            <path className="mascot-body" d="M 78 145 C 90 141, 110 141, 122 145 C 137 155, 131 185, 118 198 C 108 208, 92 208, 82 198 C 69 185, 63 155, 78 145 Z" fill="url(#holographic-body)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
            
            <circle cx="100" cy="172" r="11" fill="url(#cyan-neon)" stroke="var(--ink)" strokeWidth="2" filter="url(#eye-glow)" />
            <circle cx="100" cy="172" r="4" fill="#ffffff" />
            
            
            <path className="mascot-left-arm" d="M 68 153 C 50 148, 44 132, 47 121 C 49 116, 56 116, 58 122 C 56 131, 62 142, 69 146 Z" fill="url(#holographic-body)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
            
            
            <path className="mascot-right-arm" d="M 132 153 C 150 148, 156 132, 153 121 C 151 116, 144 116, 142 122 C 144 131, 138 142, 131 146 Z" fill="url(#holographic-body)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
          </g>
          
          
          <g className="mascot-head-group">
            
            <rect className="mascot-ear-l" x="43" y="88" width="10" height="20" rx="5" fill="url(#holographic-body)" stroke="var(--ink)" strokeWidth="2" />
            <rect className="mascot-ear-r" x="147" y="88" width="10" height="20" rx="5" fill="url(#holographic-body)" stroke="var(--ink)" strokeWidth="2" />
            
            
            <rect className="mascot-head" x="52" y="60" width="96" height="80" rx="38" fill="url(#holographic-body)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
            
            
            <path className="mascot-visor" d="M 68 76 C 68 76, 100 70, 132 76 C 138 78, 140 84, 138 94 C 134 112, 120 116, 100 116 C 80 116, 66 112, 62 94 C 60 84, 62 78, 68 76 Z" fill="url(#visor-grad)" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
            
            
            <path d="M 72 80 C 72 80, 100 75, 128 80 C 130 84, 131 89, 128 92 C 114 87, 86 87, 72 92 Z" fill="#ffffff" opacity="0.15" />
            
            
            <g className="mascot-eyes">
              
              <path className="eye eye-left" d="M 76 96 C 76 89, 88 89, 88 96" fill="none" stroke="url(#cyan-neon)" strokeWidth="6.5" strokeLinecap="round" filter="url(#eye-glow)" />
              
              
              <path className="eye eye-right" d="M 112 96 C 112 89, 124 89, 124 96" fill="none" stroke="url(#cyan-neon)" strokeWidth="6.5" strokeLinecap="round" filter="url(#eye-glow)" />
            </g>
          </g>
          
          
          <g className="mascot-halo-group">
            
            <ellipse cx="100" cy="30" rx="36" ry="10" fill="none" stroke="var(--ink)" strokeWidth="2.5" />
            
            <ellipse cx="100" cy="30" rx="42" ry="12" fill="none" stroke="url(#halo-grad)" strokeWidth="4.5" />
            
            <path d="M 72 26 C 80 23, 120 23, 128 26" fill="none" stroke="url(#cyan-neon)" strokeWidth="2.5" strokeLinecap="round" filter="url(#eye-glow)" />
          </g>
        </svg>
      </div>
    </div>

    
    
  


    </motion.div>
  );
}
