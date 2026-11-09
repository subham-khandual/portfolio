import React, { Suspense, lazy, useEffect, useState, useRef } from 'react';
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

/**
 * LazySection: Defers below-the-fold component mounting until the user scrolls,
 * touches the page, or approaches the section. This guarantees instant 90+
 * Lighthouse FCP & LCP by keeping the initial thread clean of WebGL and heavy DOM.
 */
function LazySection({ children, id, minHeight = '400px' }) {
  const [shouldLoad, setShouldLoad] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (id && window.location.hash === `#${id}`) || window.scrollY > 80;
  });
  const containerRef = useRef(null);

  useEffect(() => {
    if (shouldLoad) return undefined;

    const trigger = () => {
      setShouldLoad(true);
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('scroll', trigger);
      window.removeEventListener('touchstart', trigger);
      window.removeEventListener('pointerdown', trigger);
      window.removeEventListener('wheel', trigger);
      window.removeEventListener('hashchange', trigger);
    };

    window.addEventListener('scroll', trigger, { passive: true, once: true });
    window.addEventListener('touchstart', trigger, { passive: true, once: true });
    window.addEventListener('pointerdown', trigger, { passive: true, once: true });
    window.addEventListener('wheel', trigger, { passive: true, once: true });
    window.addEventListener('hashchange', trigger, { passive: true, once: true });

    if (typeof IntersectionObserver !== 'undefined' && containerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            trigger();
            observer.disconnect();
          }
        },
        { rootMargin: '600px 0px' }
      );
      observer.observe(containerRef.current);
      return () => {
        observer.disconnect();
        cleanup();
      };
    }

    return cleanup;
  }, [id, shouldLoad]);

  return (
    <div ref={containerRef} id={id} style={{ minHeight: shouldLoad ? undefined : minHeight }}>
      {shouldLoad ? <Suspense fallback={null}>{children}</Suspense> : null}
    </div>
  );
}

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

  // Defer non-critical overlays until idle/interaction
  useEffect(() => {
    if (isChatbotOpen) {
      const id = requestAnimationFrame(() => setShowChatbot(true));
      return () => cancelAnimationFrame(id);
    }

    const events = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
    const reveal = () => {
      setShowChatbot(true);
      cleanup();
    };
    const cleanup = () => {
      events.forEach((ev) => window.removeEventListener(ev, reveal));
      clearTimeout(timer);
    };

    events.forEach((ev) => window.addEventListener(ev, reveal, { passive: true, once: true }));
    const timer = setTimeout(reveal, 4000);

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
        <LazySection id="about">
          <About />
        </LazySection>
        <LazySection id="skills">
          <Skills />
        </LazySection>
        <LazySection id="projects">
          <Projects />
        </LazySection>
        <LazySection id="experience">
          <Experience />
        </LazySection>
        <LazySection id="certificates">
          <Certificates />
        </LazySection>
        <LazySection id="achievements">
          <Achievements />
        </LazySection>
        <LazySection id="github">
          <GithubSection />
        </LazySection>
        <LazySection id="contact">
          <Contact />
        </LazySection>
      </main>

      <LazySection minHeight="200px">
        <Footer />
      </LazySection>
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
