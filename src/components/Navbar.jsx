import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download, Terminal, Command } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundManager } from '../utils/audio';
import styles from './Navbar.module.css';

// Main navigation items for the floating capsule
const mainNavItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Certificates', href: '#certificates' },
  { name: 'Achievements', href: '#achievements' },
  { name: 'Connect', href: '#contact' },
];

// All sections for in-page spy & mobile drawer
const allNavItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Certificates', href: '#certificates' },
  { name: 'Achievements', href: '#achievements' },
  { name: 'GitHub', href: '#github' },
  { name: 'Connect', href: '#contact' },
];

const Navbar = () => {
  const {
    soundEnabled,
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
      setScrolled(window.scrollY > 25);

      // Section spy
      const sections = allNavItems.map((item) => item.href.substring(1));
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

    window.addEventListener('scroll', handleScroll, { passive: true });
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
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className={`container ${styles.navContainer}`}>
        {/* Left: SK Brand Logo */}
        <a
          href="#home"
          className={styles.logo}
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#home');
          }}
          onMouseEnter={() => {
            if (soundEnabled) soundManager.playHoverSound();
          }}
        >
          <span className={styles.logoBadge}>SK</span>
          <span className={styles.logoText}>Subham Khandual</span>
        </a>

        {/* Center: Floating Capsule Navigation */}
        <nav className={styles.centerCapsule} aria-label="Main Navigation">
          {mainNavItems.map((item) => {
            const isActive = activeSection === item.href.substring(1) || (item.name === 'Home' && !activeSection);
            return (
              <a
                key={item.name}
                href={item.href}
                className={`${styles.capsuleLink} ${isActive ? styles.activeCapsuleLink : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                onMouseEnter={() => {
                  if (soundEnabled) soundManager.playHoverSound();
                }}
              >
                {isActive && (
                  <motion.div
                    className={styles.activePillBg}
                    layoutId="activeNavPill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={styles.capsuleText}>{item.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Right: Actions & Download Resume */}
        <div className={styles.rightActions}>
          <a
            href="/latest_resume.pdf"
            download="Subham_Khandual_Resume.pdf"
            className={styles.resumePillBtn}
            onMouseEnter={() => {
              if (soundEnabled) soundManager.playHoverSound();
            }}
            onClick={() => {
              if (soundEnabled) soundManager.playClickSound();
            }}
          >
            <span>Download Resume</span>
            <Download size={14} className={styles.downloadIcon} />
          </a>

          {/* Quick Tools Icons */}
          <button
            className={styles.iconBtn}
            onClick={() => {
              if (soundEnabled) soundManager.playClickSound();
              setIsCommandPaletteOpen(true);
            }}
            title="Command Palette (Ctrl+K)"
            aria-label="Open Command Palette"
          >
            <Command size={16} />
          </button>

          <button
            className={styles.iconBtn}
            onClick={() => {
              if (soundEnabled) soundManager.playClickSound();
              setIsTerminalOpen(true);
            }}
            title="Terminal CLI"
            aria-label="Open Interactive CLI Terminal"
          >
            <Terminal size={16} />
          </button>

          <button
            className={styles.iconBtn}
            onClick={() => {
              if (soundEnabled) soundManager.playClickSound();
              setIsChatbotOpen(true);
            }}
            title="Sayraa AI Assistant"
            aria-label="Open Sayraa AI Assistant Chatbot"
            style={{ padding: '3px' }}
          >
            <img
              src="/chatbot_avatar.webp"
              alt="Sayraa AI Avatar"
              style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
            />
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
              {allNavItems.map((item) => (
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
              <a
                href="/latest_resume.pdf"
                download="Subham_Khandual_Resume.pdf"
                className={styles.mobileResumeBtn}
              >
                Download Resume <Download size={14} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
