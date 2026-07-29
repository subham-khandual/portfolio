import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { PortfolioProvider } from './context/PortfolioContext';

// Utilities & Global Features
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';
import ScrollProgressBar from './components/ScrollProgressBar';
import CommandPalette from './components/CommandPalette';
import TerminalModal from './components/TerminalModal';
import AiChatbot from './components/AiChatbot';

// Portfolio Page Sections
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Achievements from './components/Achievements';
import GithubSection from './components/GithubSection';
import Certificates from './components/Certificates';
import Contact from './components/Contact';
import Footer from './components/Footer';

function AppContent() {
  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="portfolio-app">
      <CustomCursor />
      <LoadingScreen />
      <ScrollProgressBar />
      <CommandPalette />
      <TerminalModal />
      <AiChatbot />

      <Navbar />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Achievements />
        <GithubSection />
        <Certificates />
        <Contact />
      </main>

      <Footer />
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
