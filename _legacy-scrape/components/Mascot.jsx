import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function Mascot() {
  const location = useLocation();

  const [isMuted, setIsMuted] = useState(() => localStorage.getItem("mascotMuted") === "true");
  const [isSleeping, setIsSleeping] = useState(false);
  const [bubbleText, setBubbleText] = useState("");
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [showLabel, setShowLabel] = useState(true);
  const [showBtn, setShowBtn] = useState(false);
  const [zzzs, setZzzs] = useState([]);

  const widgetRef = useRef(null);
  const headRef = useRef(null);
  const eyesRef = useRef(null);
  const bubbleTimeoutRef = useRef(null);
  const buttonHideTimeoutRef = useRef(null);
  const zzzCounterRef = useRef(0);
  const zzzIntervalRef = useRef(null);

  const isSpeechUnlockedRef = useRef(false);
  const greetingSpokenRef = useRef(false);
  const pendingGreetingTextRef = useRef("");
  const mousePosRef = useRef({ x: 0, y: 0 });
  const tickingRef = useRef(false);

  const uxTips = [
    "Clarity is one of the kindest things a product can offer.",
    "As a UX Manager, Purvaj doesn't just design screens; he designs workflows and team trust.",
    "Good design isn't about having the cleverest answer. It's about asking the right questions.",
    "Need to untangle a product problem? Let's discuss it with Purvaj! Click the discuss button above.",
    "Try dragging the sticky notes on the homepage to clear your path!",
    "At Syncfusion, Purvaj designed BoldDesk to make complex support simple.",
    "For BoldAgent, Purvaj focused on creating predictable AI assistant patterns.",
    "My eyes follow your cursor, just like Purvaj always keeps the user in sight!",
    "Design is the conditions that make the right answer obvious."
  ];

  const getMascotGreeting = (path) => {
    const cleanPath = path.replace(/\/+$/, "") || "/";
    if (cleanPath === "/") {
      return "Hi, I'm Hapy! Let's explore Purvaj's site together!";
    }
    if (cleanPath === "/about") {
      return "Purvaj's perspective. Let's look at the person behind the process!";
    }
    if (cleanPath === "/work") {
      return "Designing the system. Let's review Purvaj's case studies and product work!";
    }
    if (cleanPath === "/blog") {
      return "Reflecting on the craft. Let's read some notes from the messy middle!";
    }
    if (cleanPath === "/resume") {
      return "Reviewing Purvaj's journey. Let's review Purvaj's experience, skills, and impact!";
    }
    if (cleanPath === "/playground") {
      return "Exploring experiments. A small room for big curiosity. Please touch things!";
    }
    if (cleanPath === "/contact") {
      return "Delivering the outcome. Let's discuss what you're trying to untangle!";
    }
    if (cleanPath.startsWith("/work/")) {
      return "Let's investigate this project case study together!";
    }
    if (cleanPath.startsWith("/blog/")) {
      return "Let's read this article from Purvaj's reflect notes!";
    }
    return "Hi, I'm Hapy! Let's explore Purvaj's site together.";
  };

  // --- Voice Synthesis Helpers ---
  const getFriendlyVoice = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    const englishVoices = voices.filter(v => v.lang.startsWith("en"));

    const topTierNames = [
      "google uk english male",
      "daniel",             // macOS/iOS British Male
      "arthur",             // macOS Premium Male
      "microsoft george",   // Windows British Male
      "google us english male",
      "microsoft mark",     // Windows US Male
      "microsoft david",    // Windows Default Male
      "alex"                // macOS Fallback
    ];

    for (const name of topTierNames) {
      const found = englishVoices.find(v => v.name.toLowerCase().includes(name));
      if (found) return found;
    }

    const maleFallback = englishVoices.find(v => {
      const n = v.name.toLowerCase();
      if (n.includes("female") || n.includes("samantha") || n.includes("zira") || n.includes("victoria")) return false;
      return n.includes("male") || n.includes("boy");
    });

    return maleFallback || englishVoices[0] || null;
  };

  const speakText = (text) => {
    if (isMuted || typeof window === "undefined" || !window.speechSynthesis) return;

    const cleanedText = text.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.volume = 0.3;  // Soft tone
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voice = getFriendlyVoice();
    if (voice) {
      utterance.voice = voice;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 50);
    } else {
      window.speechSynthesis.speak(utterance);
    }
  };

  const unlockSpeech = (skipGreeting = false) => {
    if (isSpeechUnlockedRef.current) return;
    try {
      if (window.speechSynthesis.pending || window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      window.speechSynthesis.resume();
      isSpeechUnlockedRef.current = true;
    } catch (e) {
      console.warn("Speech synthesis unlock failed:", e);
    }

    if (!skipGreeting && !greetingSpokenRef.current && pendingGreetingTextRef.current) {
      showBubble(pendingGreetingTextRef.current, false);
      greetingSpokenRef.current = true;
    }
  };

  const showBubble = (text, displayLabel = true) => {
    if (bubbleTimeoutRef.current) {
      clearTimeout(bubbleTimeoutRef.current);
    }

    setBubbleText(text);
    setShowLabel(displayLabel);
    setBubbleVisible(true);

    if (isSpeechUnlockedRef.current) {
      speakText(text);
    }

    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const duration = Math.max(5000, Math.min(8500, wordCount * 400 + 1500));
    bubbleTimeoutRef.current = setTimeout(hideBubble, duration);
  };

  const hideBubble = () => {
    if (bubbleTimeoutRef.current) {
      clearTimeout(bubbleTimeoutRef.current);
      bubbleTimeoutRef.current = null;
    }
    setBubbleVisible(false);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  // --- Interaction Triggers ---
  const triggerMobileButtonVisible = () => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (!isTouch) return;
    setShowBtn(true);
    if (buttonHideTimeoutRef.current) clearTimeout(buttonHideTimeoutRef.current);
    buttonHideTimeoutRef.current = setTimeout(() => {
      setShowBtn(false);
    }, 3000);
  };

  const handleMuteClick = (e) => {
    e.stopPropagation();
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem("mascotMuted", String(newMuted));

    if (newMuted) {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } else {
      unlockSpeech(true);
      if (bubbleVisible && bubbleText) {
        speakText(bubbleText);
        greetingSpokenRef.current = true;
      }
    }
    triggerMobileButtonVisible();
  };

  const handleCloseClick = (e) => {
    e.stopPropagation();
    unlockSpeech(true);
    hideBubble();
    triggerMobileButtonVisible();
  };

  const handleMascotClick = (e) => {
    e.stopPropagation();
    unlockSpeech(true);
    triggerMobileButtonVisible();

    if (isSleeping) {
      wakeUpMascot();
    } else {
      const nextTip = uxTips[Math.floor(Math.random() * uxTips.length)];
      showBubble(nextTip, true);
    }
  };

  const handleSleepToggle = (e) => {
    e.stopPropagation();
    triggerMobileButtonVisible();
    if (isSleeping) {
      wakeUpMascot();
    } else {
      goToSleepMascot();
    }
  };

  const goToSleepMascot = () => {
    setIsSleeping(true);
    hideBubble();
  };

  const wakeUpMascot = () => {
    setIsSleeping(false);
    setTimeout(() => {
      showBubble("Yawn... I'm awake! Let's get back to work.", false);
    }, 500);
  };

  // --- Footer Overlap Adjustment ---
  useEffect(() => {
    const adjustMascotForFooter = () => {
      const footer = document.querySelector(".site-footer");
      const widget = widgetRef.current;
      if (!footer || !widget) return;

      const footerRect = footer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const footerVisible = footerRect.top < viewportHeight;
      const MASCOT_BOTTOM_GAP = 24;

      if (footerVisible) {
        const overlap = viewportHeight - footerRect.top + MASCOT_BOTTOM_GAP;
        widget.style.bottom = `${overlap}px`;
      } else {
        widget.style.bottom = `${MASCOT_BOTTOM_GAP}px`;
      }
    };

    window.addEventListener("scroll", adjustMascotForFooter, { passive: true });
    window.addEventListener("resize", adjustMascotForFooter, { passive: true });
    adjustMascotForFooter();

    return () => {
      window.removeEventListener("scroll", adjustMascotForFooter);
      window.removeEventListener("resize", adjustMascotForFooter);
    };
  }, []);

  // --- Eye Cursor Tracking ---
  useEffect(() => {
    const handleMouseMove = (event) => {
      mousePosRef.current = { x: event.clientX, y: event.clientY };
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          updateEyes();
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    const updateEyes = () => {
      const eyes = eyesRef.current;
      const head = headRef.current;
      if (!eyes || !head || isSleeping) return;

      const rect = head.getBoundingClientRect();
      const headCenterX = rect.left + rect.width / 2;
      const headCenterY = rect.top + rect.height / 2;

      const dx = mousePosRef.current.x - headCenterX;
      const dy = mousePosRef.current.y - headCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const maxEyeDist = 6;
      const maxHeadDist = 2.5;

      if (dist === 0) {
        eyes.style.transform = "translate(0px, 0px)";
        head.style.transform = "translate(0px, 0px)";
        return;
      }

      const nx = dx / dist;
      const ny = dy / dist;

      const eyeTransX = Math.min(dist * 0.04, maxEyeDist) * nx;
      const eyeTransY = Math.min(dist * 0.04, maxEyeDist) * ny;

      const headTransX = Math.min(dist * 0.015, maxHeadDist) * nx;
      const headTransY = Math.min(dist * 0.015, maxHeadDist) * ny;

      eyes.style.transform = `translate(${eyeTransX.toFixed(2)}px, ${eyeTransY.toFixed(2)}px)`;
      head.style.transform = `translate(${headTransX.toFixed(2)}px, ${headTransY.toFixed(2)}px)`;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isSleeping]);

  // --- Speech Unlock Click listener ---
  useEffect(() => {
    const handleUnlockClick = () => {
      unlockSpeech(false);
    };
    document.addEventListener("click", handleUnlockClick, { passive: true });
    document.addEventListener("touchstart", handleUnlockClick, { passive: true });
    document.addEventListener("keydown", handleUnlockClick, { passive: true });
    return () => {
      document.removeEventListener("click", handleUnlockClick);
      document.removeEventListener("touchstart", handleUnlockClick);
      document.removeEventListener("keydown", handleUnlockClick);
    };
  }, []);

  // --- Route Change voice trigger ---
  useEffect(() => {
    if (bubbleTimeoutRef.current) {
      clearTimeout(bubbleTimeoutRef.current);
    }

    pendingGreetingTextRef.current = getMascotGreeting(location.pathname);
    greetingSpokenRef.current = false;

    const delay = setTimeout(() => {
      showBubble(pendingGreetingTextRef.current, false);
      if (isSpeechUnlockedRef.current) {
        greetingSpokenRef.current = true;
      }
    }, 1500);

    return () => {
      clearTimeout(delay);
    };
  }, [location.pathname]);

  // --- Sleep Mode ZZZ Spawner ---
  useEffect(() => {
    if (!isSleeping) {
      setZzzs([]);
      if (zzzIntervalRef.current) {
        clearInterval(zzzIntervalRef.current);
        zzzIntervalRef.current = null;
      }
      return;
    }

    const spawnZ = () => {
      const id = ++zzzCounterRef.current;
      const size = Math.floor(Math.random() * 8) + 10;
      const leftOffset = Math.floor(Math.random() * 20) - 10;
      const topOffset = Math.floor(Math.random() * 10) - 5;
      const char = Math.random() > 0.5 ? "Z" : "z";

      const newZ = {
        id,
        char,
        style: {
          fontSize: `${size}px`,
          left: `calc(50% + ${leftOffset}px)`,
          top: `calc(30% + ${topOffset}px)`,
          animationDelay: `${Math.random() * 0.2}s`
        }
      };

      setZzzs(prev => [...prev, newZ]);
      setTimeout(() => {
        setZzzs(prev => prev.filter(item => item.id !== id));
      }, 2000);
    };

    spawnZ();
    zzzIntervalRef.current = setInterval(spawnZ, 1400);

    return () => {
      if (zzzIntervalRef.current) {
        clearInterval(zzzIntervalRef.current);
      }
    };
  }, [isSleeping]);

  // Voice pre-loading
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        getFriendlyVoice();
      };
    }
  }, []);

  return (
    <div
      ref={widgetRef}
      className={`mascot-widget ${isSleeping ? 'sleeping' : ''} ${showBtn ? 'show-btn' : ''}`}
      id="mascot-widget"
      aria-label="UX Mascot Assistant"
      style={{ bottom: "24px" }}
    >
      <div className={`mascot-bubble ${bubbleVisible ? 'visible' : ''}`} id="mascot-bubble">
        <span
          className="mascot-bubble-mute"
          id="mascot-bubble-mute"
          role="button"
          onClick={handleMuteClick}
          title={isMuted ? "Unmute speech" : "Mute speech"}
          aria-label={isMuted ? "Unmute speech" : "Mute speech"}
        >
          {isMuted ? "🔇" : "🔊"}
        </span>
        <span className="mascot-bubble-close" id="mascot-bubble-close" aria-label="Close bubble" onClick={handleCloseClick}>×</span>
        {showLabel && <small className="mascot-bubble-label">HAPY - PURVAJ'S ASSISTANT</small>}
        <p id="mascot-bubble-text">{bubbleText}</p>
      </div>

      <button className="mascot-sleep-btn" id="mascot-sleep-btn" title={isSleeping ? "Wake mascot up" : "Send mascot to sleep"} onClick={handleSleepToggle}>
        {isSleeping ? 'Wake up ☀️' : 'Take a break 💤'}
      </button>

      <div className="mascot-body-wrapper" onClick={handleMascotClick}>
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

          {/* Jet flame / glow */}
          {!isSleeping && (
            <ellipse className="mascot-jet-glow" cx="100" cy="215" rx="22" ry="7" fill="url(#cyan-neon)" opacity="0.8" filter="url(#jet-fire)" />
          )}

          {/* Body components (fades when sleeping) */}
          <g className="mascot-body-group" style={{ opacity: isSleeping ? 0 : 1, transition: 'opacity 0.8s' }}>
            <path className="mascot-body" d="M 78 145 C 90 141, 110 141, 122 145 C 137 155, 131 185, 118 198 C 108 208, 92 208, 82 198 C 69 185, 63 155, 78 145 Z" fill="url(#holographic-body)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
            <circle cx="100" cy="172" r="11" fill="url(#cyan-neon)" stroke="var(--ink)" strokeWidth="2" filter="url(#eye-glow)" />
            <circle cx="100" cy="172" r="4" fill="#ffffff" />
            <path className="mascot-left-arm" d="M 68 153 C 50 148, 44 132, 47 121 C 49 116, 56 116, 58 122 C 56 131, 62 142, 69 146 Z" fill="url(#holographic-body)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
            <path className="mascot-right-arm" d="M 132 153 C 150 148, 156 132, 153 121 C 151 116, 144 116, 142 122 C 144 131, 138 142, 131 146 Z" fill="url(#holographic-body)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
          </g>

          {/* Head group (rotates/moves parallax) */}
          <g className="mascot-head-group" ref={headRef} style={{ transition: isSleeping ? 'transform 0.5s ease-out' : 'none' }}>
            <rect className="mascot-ear-l" x="43" y="88" width="10" height="20" rx="5" fill="url(#holographic-body)" stroke="var(--ink)" strokeWidth="2" />
            <rect className="mascot-ear-r" x="147" y="88" width="10" height="20" rx="5" fill="url(#holographic-body)" stroke="var(--ink)" strokeWidth="2" />
            <rect className="mascot-head" x="52" y="60" width="96" height="80" rx="38" fill="url(#holographic-body)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
            <path className="mascot-visor" d="M 68 76 C 68 76, 100 70, 132 76 C 138 78, 140 84, 138 94 C 134 112, 120 116, 100 116 C 80 116, 66 112, 62 94 C 60 84, 62 78, 68 76 Z" fill="url(#visor-grad)" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
            <path d="M 72 80 C 72 80, 100 75, 128 80 C 130 84, 131 89, 128 92 C 114 87, 86 87, 72 92 Z" fill="#ffffff" opacity="0.15" />

            {/* Eyes (follow cursor or morph when sleeping) */}
            <g className="mascot-eyes" ref={eyesRef}>
              <path
                className="eye eye-left"
                d={isSleeping ? "M 76 96 C 76 101, 88 101, 88 96" : "M 76 96 C 76 89, 88 89, 88 96"}
                fill="none"
                stroke="url(#cyan-neon)"
                strokeWidth="6.5"
                strokeLinecap="round"
                filter="url(#eye-glow)"
              />
              <path
                className="eye eye-right"
                d={isSleeping ? "M 112 96 C 112 101, 124 101, 124 96" : "M 112 96 C 112 89, 124 89, 124 96"}
                fill="none"
                stroke="url(#cyan-neon)"
                strokeWidth="6.5"
                strokeLinecap="round"
                filter="url(#eye-glow)"
              />
            </g>
          </g>

          {/* Halo group */}
          <g className="mascot-halo-group">
            <ellipse cx="100" cy="30" rx="36" ry="10" fill="none" stroke="var(--ink)" strokeWidth="2.5" />
            <ellipse cx="100" cy="30" rx="42" ry="12" fill="none" stroke="url(#halo-grad)" strokeWidth="4.5" />
            <path d="M 72 26 C 80 23, 120 23, 128 26" fill="none" stroke="url(#cyan-neon)" strokeWidth="2.5" strokeLinecap="round" filter="url(#eye-glow)" />
          </g>
        </svg>
      </div>

      {/* Floating ZZZs when sleeping */}
      {zzzs.map(z => (
        <span key={z.id} className="sleeping-z" style={z.style}>
          {z.char}
        </span>
      ))}
    </div>
  );
}
