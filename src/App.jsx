import React, { Suspense, lazy, useEffect, useState } from 'react';
import Lenis from 'lenis';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';

// ── Critical above-the-fold UI (kept in the initial bundle) ──────────────
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';
import ScrollProgressBar from './components/ScrollProgressBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

// ── Below-the-fold sections + on-demand overlays (code-split) ────────────
const About = lazy(() => import('./components/About'));
const Skills = lazy(() => import('./components/Skills'));
const Projects = lazy(() => import('./components/Projects'));
const Experience = lazy(() => import('./components/Experience'));
const Achievements = lazy(() => import('./components/Achievements'));
const GithubSection = lazy(() => import('./components/GithubSection'));
const Certificates = lazy(() => import('./components/Certificates'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

const AiChatbot = lazy(() => import('./components/AiChatbot'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));
const TerminalModal = lazy(() => import('./components/TerminalModal'));

const loadSections = () => [
  import('./components/About'),
  import('./components/Skills'),
  import('./components/Projects'),
  import('./components/Experience'),
  import('./components/Achievements'),
  import('./components/GithubSection'),
  import('./components/Certificates'),
  import('./components/Contact'),
  import('./components/Footer'),
];

function AppContent() {
  const { isCommandPaletteOpen, isTerminalOpen, isChatbotOpen } = usePortfolio();
  const [showChatbot, setShowChatbot] = useState(false);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Warm up the split section chunks once the browser is idle so in-page
  // navigation (and the section spy) always finds its target immediately.
  useEffect(() => {
    const warmUp = () => {
      loadSections().forEach((p) => { if (p && p.catch) p.catch(() => {}); });
    };

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(warmUp, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }

    const timer = setTimeout(warmUp, 1500);
    return () => clearTimeout(timer);
  }, []);

  // The chat widget is decorative until the visitor interacts: mount it on the
  // first interaction (or shortly after load) instead of competing with the LCP.
  useEffect(() => {
    if (isChatbotOpen) {
      // Opened programmatically (palette/terminal/navbar) — reveal on next
      // paint instead of a synchronous setState in the effect body.
      const id = requestAnimationFrame(() => setShowChatbot(true));
      return () => cancelAnimationFrame(id);
    }

    const events = ['pointerdown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    const reveal = () => {
      setShowChatbot(true);
      cleanup();
    };
    const cleanup = () => {
      events.forEach((ev) => window.removeEventListener(ev, reveal));
      clearTimeout(timer);
    };

    events.forEach((ev) => window.addEventListener(ev, reveal, { passive: true }));
    const timer = setTimeout(reveal, 2500);

    return cleanup;
  }, [isChatbotOpen]);

  return (
    <div className="portfolio-app">
      <CustomCursor />
      <LoadingScreen />
      <ScrollProgressBar />

      {isCommandPaletteOpen && (
        <Suspense fallback={null}>
          <CommandPalette />
        </Suspense>
      )}

      {isTerminalOpen && (
        <Suspense fallback={null}>
          <TerminalModal />
        </Suspense>
      )}

      {(showChatbot || isChatbotOpen) && (
        <Suspense fallback={null}>
          <AiChatbot />
        </Suspense>
      )}

      <Navbar />

      <main>
        <Hero />
        <Suspense fallback={null}>
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Achievements />
          <GithubSection />
          <Certificates />
          <Contact />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <AppContent />
    </PortfolioProvider>
  );
}
