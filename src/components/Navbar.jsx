import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Terminal, MessageSquare, Sun, Moon, Volume2, VolumeX, Sparkles, Command } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundManager } from '../utils/audio';
import styles from './Navbar.module.css';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Achievements', href: '#achievements' },
  { name: 'GitHub', href: '#github' },
  { name: 'Certificates', href: '#certificates' },
  { name: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const {
    theme,
    toggleTheme,
    soundEnabled,
    setSoundEnabled,
    activeSection,
    setActiveSection,
    setIsCommandPaletteOpen,
    setIsTerminalOpen,
    setIsChatbotOpen
  } = usePortfolio();

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      // Section spy
      const sections = navItems.map((item) => item.href.substring(1));
      const current = sections.find((sec) => {
        const el = document.getElementById(sec);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 200 && rect.bottom >= 200;
        }
        return false;
      });
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setActiveSection]);

  const handleNavClick = (href) => {
    if (soundEnabled) soundManager.playClickSound();
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`container ${styles.navContainer}`}>
        {/* Logo */}
        <a
          href="#home"
          className={styles.logo}
          onClick={() => handleNavClick('#home')}
          onMouseEnter={() => {
            if (soundEnabled) soundManager.playHoverSound();
          }}
        >
          <span className={styles.logoBadge}>SK</span>
          <span className={styles.logoText}>
            Subham<span className="text-gradient">.AI</span>
          </span>
        </a>

        {/* Desktop Nav Items */}
        <nav className={styles.desktopNav}>
          {navItems.map((item) => {
            const isActive = activeSection === item.href.substring(1);
            return (
              <a
                key={item.name}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.activeLink : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                onMouseEnter={() => {
                  if (soundEnabled) soundManager.playHoverSound();
                }}
              >
                {item.name}
                {isActive && (
                  <motion.div
                    className={styles.activeIndicator}
                    layoutId="activeSectionIndicator"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className={styles.controls}>
          {/* Command Palette button */}
          <button
            className={styles.controlBtn}
            onClick={() => {
              if (soundEnabled) soundManager.playClickSound();
              setIsCommandPaletteOpen(true);
            }}
            title="Command Palette (Ctrl+K)"
          >
            <Command size={16} />
            <span className={styles.cmdKey}>Ctrl+K</span>
          </button>

          {/* Terminal Button */}
          <button
            className={styles.controlBtnIcon}
            onClick={() => {
              if (soundEnabled) soundManager.playClickSound();
              setIsTerminalOpen(true);
            }}
            title="Interactive CLI Terminal"
          >
            <Terminal size={18} />
          </button>

          {/* AI Chatbot Button */}
          <button
            className={styles.controlBtnIcon}
            onClick={() => {
              if (soundEnabled) soundManager.playClickSound();
              setIsChatbotOpen(true);
            }}
            title="AI Assistant Chatbot"
          >
            <MessageSquare size={18} />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`${styles.mobileDrawer} glass`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.mobileNavLinks}>
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={styles.mobileNavLink}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
