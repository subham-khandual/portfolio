import React, { createContext, useContext, useState, useEffect } from 'react';
import { readStoredVisitorCount } from '../utils/visitorCount';

/* eslint-disable react-refresh/only-export-components -- provider + hook are
   intentionally co-located; standard React context pattern. */

const PortfolioContext = createContext();

// Visitor-count storage lives in its own module so this file only exports
// components (Vite fast-refresh requirement).
export const PortfolioProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [cursorMode, setCursorMode] = useState('default'); // default, hover, drag
  // Lazy initializer: count is derived during render, not via setState in an
  // effect, so there is no cascading re-render on mount.
  const [visitorCount] = useState(readStoredVisitorCount);

  useEffect(() => {
    // Persist the already-computed count once; keyboard shortcuts below.
    try {
      localStorage.setItem('visitorCount', String(visitorCount));
    } catch {
      // Private-mode storage can throw — the counter is decorative.
    }

    // Keyboard shortcut for Command Palette (Ctrl+K or Cmd+K)
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsTerminalOpen(false);
        setIsChatbotOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // visitorCount is intentionally read once on mount; no re-subscription.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTheme = () => {
    setTheme('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  };

  return (
    <PortfolioContext.Provider
      value={{
        theme,
        toggleTheme,
        soundEnabled,
        setSoundEnabled,
        musicEnabled,
        setMusicEnabled,
        activeSection,
        setActiveSection,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isTerminalOpen,
        setIsTerminalOpen,
        isChatbotOpen,
        setIsChatbotOpen,
        cursorMode,
        setCursorMode,
        visitorCount
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
