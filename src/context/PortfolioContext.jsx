import React, { createContext, useContext, useState, useEffect } from 'react';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [cursorMode, setCursorMode] = useState('default'); // default, hover, drag
  const [visitorCount, setVisitorCount] = useState(1348);

  useEffect(() => {
    // Visitor counter persistence simulation
    const storedVisits = localStorage.getItem('visitorCount');
    if (storedVisits) {
      setVisitorCount(parseInt(storedVisits, 10) + 1);
      localStorage.setItem('visitorCount', parseInt(storedVisits, 10) + 1);
    } else {
      localStorage.setItem('visitorCount', 1349);
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
