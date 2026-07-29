import React from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, Github, Linkedin, Instagram, Facebook, MessageCircle, Heart, Eye } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundManager } from '../utils/audio';
import styles from './Footer.module.css';

const Footer = () => {
  const { soundEnabled, visitorCount } = usePortfolio();

  const scrollToTop = () => {
    if (soundEnabled) soundManager.playClickSound();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footerSection}>
      {/* Animated Wave SVG */}
      <div className={styles.waveWrapper}>
        <svg
          className={styles.waveSvg}
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="rgba(11, 15, 25, 0.8)"
          />
        </svg>
      </div>

      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.footerTop}>
          <div className={styles.brandInfo}>
            <span className={styles.footerLogo}>
              Subham<span className="text-gradient">.AI</span>
            </span>
            <p className={styles.footerTagline}>
              Engineering high-performance web applications, 3D interactive experiences, and AI solutions.
            </p>
          </div>

          {/* Social Links */}
          <div className={styles.socialRow}>
            <a
              href="https://github.com/subham-khandual"
              target="_blank"
              rel="noreferrer me"
              aria-label="GitHub"
              className={styles.socialBtn}
              onMouseEnter={() => {
                if (soundEnabled) soundManager.playHoverSound();
              }}
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/subham-khandual/"
              target="_blank"
              rel="noreferrer me"
              aria-label="LinkedIn"
              className={styles.socialBtn}
              onMouseEnter={() => {
                if (soundEnabled) soundManager.playHoverSound();
              }}
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://wa.me/917847959011"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className={styles.socialBtn}
              onMouseEnter={() => {
                if (soundEnabled) soundManager.playHoverSound();
              }}
            >
              <MessageCircle size={20} />
            </a>
            <a
              href="https://www.instagram.com/mr_subham7.0?igsh=MTFud3JibGhqbGw4bQ=="
              target="_blank"
              rel="noreferrer me"
              aria-label="Instagram"
              className={styles.socialBtn}
              onMouseEnter={() => {
                if (soundEnabled) soundManager.playHoverSound();
              }}
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://www.facebook.com/share/1LuEB32wPV/"
              target="_blank"
              rel="noreferrer me"
              aria-label="Facebook"
              className={styles.socialBtn}
              onMouseEnter={() => {
                if (soundEnabled) soundManager.playHoverSound();
              }}
            >
              <Facebook size={20} />
            </a>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Subham Khandual. Designed & Crafted with <Heart size={14} color="#ef4444" style={{ display: 'inline', margin: '0 2px' }} /> & Three.js.
          </p>

          <div className={styles.visitorBadge}>
            <Eye size={14} color="#00f0ff" />
            <span>Portfolio Visitors: {visitorCount.toLocaleString()}</span>
          </div>

          {/* Back to Top Button */}
          <button className={styles.backToTopBtn} onClick={scrollToTop} aria-label="Back to Top">
            <ChevronUp size={20} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
