import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { ArrowRight, Download, Github, Linkedin, Mail, Sparkles, MessageCircle, Instagram, ChevronDown } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundManager } from '../utils/audio';
import styles from './Hero.module.css';

const titles = [
  'Full Stack MERN Developer',
  'AI & ML Specialist',
  'Software Engineer',
  'Creative Problem Solver',
];

const Hero = () => {
  const { soundEnabled } = usePortfolio();
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  // Mouse Parallax
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      setMousePos({
        x: (e.clientX / innerWidth - 0.5) * 30,
        y: (e.clientY / innerHeight - 0.5) * 30,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Typing effect
  useEffect(() => {
    const handleTyping = () => {
      const current = titles[textIndex];
      if (!isDeleting) {
        setDisplayText(current.substring(0, displayText.length + 1));
        if (displayText === current) {
          setTimeout(() => setIsDeleting(true), 1800);
          setTypingSpeed(50);
        }
      } else {
        setDisplayText(current.substring(0, displayText.length - 1));
        if (displayText === '') {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % titles.length);
          setTypingSpeed(100);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, textIndex, typingSpeed]);

  return (
    <section id="home" className={styles.heroSection}>
      {/* Background Starfield & Floating Glow Orbs */}
      <div className={styles.canvasBackground}>
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f0ff" />
          <Stars radius={100} depth={50} count={3500} factor={4} saturation={0} fade speed={1.5} />
        </Canvas>
      </div>

      <div className={styles.glowBlob1} />
      <div className={styles.glowBlob2} />

      <div className={`container ${styles.heroContainer}`}>
        {/* Left Side Text Content */}
        <motion.div
          className={styles.textContent}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            transform: `translate3d(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px, 0)`,
          }}
        >


          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Hi, I'm <span className="text-gradient">Subham Khandual</span> <br />
            <span className={styles.typedContainer}>
              I am a <span className={styles.typedText}>{displayText}</span>
              <span className={styles.cursor}>|</span>
            </span>
          </motion.h1>

          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Final-year CS Student & Full-Stack Developer passionate about AI-driven innovation, 
            building 60 FPS high-performance web applications, and delivering world-class digital experiences.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            className={styles.actionBtns}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <a
              href="#projects"
              className="btn btn-primary"
              onMouseEnter={() => {
                if (soundEnabled) soundManager.playHoverSound();
              }}
              onClick={() => {
                if (soundEnabled) soundManager.playClickSound();
              }}
            >
              Explore Projects <ArrowRight size={18} />
            </a>
            <a
              href="#contact"
              className="btn btn-outline"
              onMouseEnter={() => {
                if (soundEnabled) soundManager.playHoverSound();
              }}
              onClick={() => {
                if (soundEnabled) soundManager.playClickSound();
              }}
            >
              Get In Touch
            </a>
            <a
              href="/latest_resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
              onMouseEnter={() => {
                if (soundEnabled) soundManager.playHoverSound();
              }}
            >
              Resume PDF <Download size={18} />
            </a>
          </motion.div>

          {/* Social Icons */}
          <motion.div
            className={styles.socials}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <a
              href="https://github.com/subham-khandual"
              target="_blank"
              rel="noreferrer me"
              aria-label="GitHub"
              className={styles.socialIcon}
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
              className={styles.socialIcon}
              onMouseEnter={() => {
                if (soundEnabled) soundManager.playHoverSound();
              }}
            >
              <Linkedin size={20} />
            </a>
            <a
              href="mailto:subhamkhandual215@gmail.com"
              aria-label="Email"
              className={styles.socialIcon}
              onMouseEnter={() => {
                if (soundEnabled) soundManager.playHoverSound();
              }}
            >
              <Mail size={20} />
            </a>
            <a
              href="https://wa.me/917847959011"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className={styles.socialIcon}
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
              className={styles.socialIcon}
              onMouseEnter={() => {
                if (soundEnabled) soundManager.playHoverSound();
              }}
            >
              <Instagram size={20} />
            </a>
          </motion.div>
        </motion.div>

        {/* Right Side 3D Interactive Avatar */}
        <motion.div
          className={styles.hologramContent}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            transform: `translate3d(${mousePos.x * -0.4}px, ${mousePos.y * -0.4}px, 0)`,
          }}
        >
          <div className={styles.avatarWrapper}>
            <div className={styles.avatarGlow} />
            <img src="/profile.png" alt="Subham Khandual" className={styles.profileImg} />
          </div>
        </motion.div>
      </div>

      {/* Animated Scroll Down Indicator */}
      <a href="#about" className={styles.scrollIndicator} aria-label="Scroll Down">
        <span className={styles.scrollText}>Scroll Down</span>
        <ChevronDown size={20} className={styles.scrollIcon} />
      </a>
    </section>
  );
};

export default Hero;
