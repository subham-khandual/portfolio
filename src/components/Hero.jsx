import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowRight, Download, Github, Linkedin, Mail, MessageCircle, Instagram, ChevronDown } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundManager } from '../utils/audio';
import HeroCanvas3D from './HeroCanvas3D';
import styles from './Hero.module.css';

const titles = [
  'Full Stack MERN Developer',
  'AI & ML Specialist',
  'DevOps & Cloud Enthusiast',
  'Software Engineer',
  'Creative Problem Solver',
];

/**
 * Rotating typewriter roles.
 *
 * Isolated in its own component on purpose: the previous implementation kept the
 * typing state inside `Hero`, so every keystroke (~every 100 ms) re-rendered the
 * whole hero, including the WebGL canvas. Now only this small subtree updates.
 */
const TypedRoles = () => {
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = titles[textIndex];
    let delay = isDeleting ? 45 : 95;
    if (!isDeleting && displayText === current) delay = 1600;
    else if (isDeleting && displayText === '') delay = 320;

    const timer = setTimeout(() => {
      if (!isDeleting && displayText === current) {
        setIsDeleting(true);
        return;
      }
      if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % titles.length);
        return;
      }
      setDisplayText(current.substring(0, displayText.length + (isDeleting ? -1 : 1)));
    }, delay);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, textIndex]);

  return (
    <span className={styles.typedContainer}>
      I am a <span className={styles.typedText}>{displayText}</span>
      <span className={styles.cursor}>|</span>
    </span>
  );
};

const Hero = () => {
  const { soundEnabled } = usePortfolio();
  const heroRef = useRef(null);

  // GSAP Entrance Timeline
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(`.${styles.title}`, {
        opacity: 0,
        y: 35,
        duration: 0.9,
      })
        .from(
          `.${styles.subtitle}`,
          {
            opacity: 0,
            y: 25,
            duration: 0.8,
          },
          '-=0.4'
        )
        .from(
          `.${styles.actionBtns} a`,
          {
            opacity: 0,
            y: 20,
            scale: 0.95,
            stagger: 0.12,
            duration: 0.6,
            ease: 'back.out(1.5)',
          },
          '-=0.3'
        )
        .from(
          `.${styles.socialIcon}`,
          {
            opacity: 0,
            scale: 0.6,
            stagger: 0.08,
            duration: 0.5,
            ease: 'back.out(2)',
          },
          '-=0.3'
        )
        .from(
          `.${styles.avatarWrapper}`,
          {
            opacity: 0,
            scale: 0.85,
            duration: 1,
            ease: 'power2.out',
          },
          '-=0.8'
        );
    },
    { scope: heroRef }
  );

  // GSAP Magnetic button hover effect
  const handleMagneticMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(target, {
      x: x * 0.28,
      y: y * 0.28,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMagneticLeave = (e) => {
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
    });
  };

  // Mouse parallax driven by motion values: no React re-render on pointer move.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const smoothX = useSpring(rawX, { stiffness: 60, damping: 20, mass: 0.4 });
  const smoothY = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.4 });
  const textParallax = useTransform(
    [smoothX, smoothY],
    ([x, y]) => `translate3d(${x * 0.3}px, ${y * 0.3}px, 0)`
  );
  const hologramParallax = useTransform(
    [smoothX, smoothY],
    ([x, y]) => `translate3d(${x * -0.4}px, ${y * -0.4}px, 0)`
  );

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    // Skip pointer work on touch devices and when reduced motion is requested.
    if (window.matchMedia('(pointer: coarse)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let frame = null;
    const handleMouseMove = (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        rawX.set((e.clientX / window.innerWidth - 0.5) * 30);
        rawY.set((e.clientY / window.innerHeight - 0.5) * 30);
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [rawX, rawY]);

  return (
    <section id="home" ref={heroRef} className={styles.heroSection}>
      {/* Background starfield (GPU animated CSS — no WebGL, no extra JS) */}
      <div className={styles.starfield} aria-hidden="true" />

      <div className={styles.glowBlob1} aria-hidden="true" />
      <div className={styles.glowBlob2} aria-hidden="true" />

      <div className={`container ${styles.heroContainer}`}>
        {/* Left Side Text Content */}
        <motion.div className={styles.textContent} style={{ transform: textParallax }}>
          <h1 className={styles.title}>
            Hi, I'm <span className="text-gradient">Subham Khandual</span> <br />
            <TypedRoles />
          </h1>

          <p className={styles.subtitle}>
            Engineering intelligent web platforms, AI-powered systems, and scalable cloud solutions.
            Obsessed with clean architecture, DevOps automation, and ultra-smooth 60 FPS digital experiences.
          </p>

          {/* Action CTAs */}
          <div className={styles.actionBtns}>
            <a
              href="#projects"
              className="btn btn-primary"
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
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
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
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
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
              onMouseEnter={() => {
                if (soundEnabled) soundManager.playHoverSound();
              }}
            >
              Resume PDF <Download size={18} />
            </a>
          </div>

          {/* Social Icons */}
          <div className={styles.socials}>
            <a
              href="https://github.com/subham-khandual"
              target="_blank"
              rel="noreferrer me"
              aria-label="Subham's GitHub Profile"
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
              aria-label="Subham's LinkedIn Profile"
              className={styles.socialIcon}
              onMouseEnter={() => {
                if (soundEnabled) soundManager.playHoverSound();
              }}
            >
              <Linkedin size={20} />
            </a>
            <a
              href="mailto:subhamkhandual215@gmail.com"
              aria-label="Send Email to Subham"
              className={styles.socialIcon}
              onMouseEnter={() => {
                if (soundEnabled) soundManager.playHoverSound();
              }}
            >
              <Mail size={20} />
            </a>
            <a
              href="https://wa.me/917894047169"
              target="_blank"
              rel="noreferrer"
              aria-label="Chat on WhatsApp"
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
              aria-label="Subham's Instagram Profile"
              className={styles.socialIcon}
              onMouseEnter={() => {
                if (soundEnabled) soundManager.playHoverSound();
              }}
            >
              <Instagram size={20} />
            </a>
          </div>
        </motion.div>

        {/* Right Side Profile Hologram */}
        <motion.div className={styles.hologramContent} style={{ transform: hologramParallax }}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatarGlow} aria-hidden="true" />
            <HeroCanvas3D />
            <img
              src="/profile.webp"
              alt="Subham Khandual Full-Stack Developer Profile"
              width="512"
              height="512"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className={styles.profileImg}
            />
          </div>
        </motion.div>
      </div>

      {/* Animated Scroll Down Indicator */}
      <a href="#about" className={styles.scrollIndicator} aria-label="Scroll Down">
        <span className={styles.scrollText}>Scroll Down</span>
        <ChevronDown size={20} className={styles.scrollIcon} aria-hidden="true" />
      </a>
    </section>
  );
};

export default Hero;


