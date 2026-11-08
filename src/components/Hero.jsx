import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowRight, Code2, Users, Trophy } from 'lucide-react';
import { SiReact, SiNodedotjs, SiPython, SiDocker } from 'react-icons/si';
import { FaLinkedin } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';
import { soundManager } from '../utils/audio';
import styles from './Hero.module.css';

const titles = [
  'Full Stack Developer',
  'AI & ML Specialist',
  'DevOps & Cloud Enthusiast',
  'Software Engineer',
];

/**
 * Rotating typewriter roles.
 */
const TypedRoles = () => {
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = titles[textIndex];
    let delay = isDeleting ? 40 : 85;
    if (!isDeleting && displayText === current) delay = 1600;
    else if (isDeleting && displayText === '') delay = 300;

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
    <span className={styles.roleLine}>
      I am a <span className={styles.roleGradient}>{displayText}</span>
      <span className={styles.cursor}>|</span>
    </span>
  );
};

const Hero = () => {
  const { soundEnabled } = usePortfolio();
  const heroRef = useRef(null);

  // Mouse parallax driven by Framer Motion values
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const smoothX = useSpring(rawX, { stiffness: 50, damping: 20, mass: 0.4 });
  const smoothY = useSpring(rawY, { stiffness: 50, damping: 20, mass: 0.4 });

  const textParallax = useTransform(
    [smoothX, smoothY],
    ([x, y]) => `translate3d(${x * 0.25}px, ${y * 0.25}px, 0)`
  );
  const visualParallax = useTransform(
    [smoothX, smoothY],
    ([x, y]) => `translate3d(${x * -0.35}px, ${y * -0.35}px, 0)`
  );

  // GSAP Entrance Timeline
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(`.${styles.statusBadge}`, {
        opacity: 0,
        y: -15,
        duration: 0.6,
      })
        .from(
          `.${styles.title}`,
          {
            opacity: 0,
            y: 30,
            duration: 0.8,
          },
          '-=0.3'
        )
        .from(
          `.${styles.roleLine}`,
          {
            opacity: 0,
            y: 20,
            duration: 0.7,
          },
          '-=0.4'
        )
        .from(
          `.${styles.subtitle}`,
          {
            opacity: 0,
            y: 20,
            duration: 0.7,
          },
          '-=0.4'
        )
        .from(
          `.${styles.actionGroup} a`,
          {
            opacity: 0,
            y: 20,
            scale: 0.95,
            stagger: 0.12,
            duration: 0.55,
            ease: 'back.out(1.5)',
          },
          '-=0.3'
        )
        .from(
          `.${styles.statsBar}`,
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
          },
          '-=0.2'
        )
        .from(
          `.${styles.showcaseStage}`,
          {
            opacity: 0,
            scale: 0.88,
            duration: 0.9,
            ease: 'power2.out',
          },
          '-=0.8'
        )
        .from(
          `.${styles.floatingCard}`,
          {
            opacity: 0,
            scale: 0.5,
            stagger: 0.1,
            duration: 0.6,
            ease: 'back.out(1.8)',
          },
          '-=0.4'
        );
    },
    { scope: heroRef }
  );

  // Magnetic button hover effect
  const handleMagneticMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(target, {
      x: x * 0.25,
      y: y * 0.25,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMagneticLeave = (e) => {
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.4)',
    });
  };

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
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
      {/* Background Ambience & Lighting */}
      <div className={styles.starfield} aria-hidden="true" />
      <div className={styles.glowBlob1} aria-hidden="true" />
      <div className={styles.glowBlob2} aria-hidden="true" />

      <div className={`container ${styles.heroContainer}`}>
        {/* ── Left Side Text Content ───────────────────────────────────────── */}
        <motion.div className={styles.textContent} style={{ transform: textParallax }}>
          {/* Status Badge */}
          <div className={styles.statusBadge}>
            <span className={styles.greenDot} />
            <span>Available for Opportunities</span>
          </div>

          {/* Main Title with Blue Gradient & Underline Accent */}
          <h1 className={styles.title}>
            Hi, I'm <br />
            <span className={styles.nameHighlight}>
              Subham <span className={styles.gradientName}>Khandual</span>
              {/* Hand-drawn purple brush underline matching the mockup */}
              <svg
                className={styles.brushUnderline}
                viewBox="0 0 240 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M4 14C55 5 155 4 236 12C185 8 85 10 32 17"
                  stroke="#8b5cf6"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </h1>

          {/* Rotating Role Line */}
          <TypedRoles />

          {/* Subtitle */}
          <p className={styles.subtitle}>
            Engineering intelligent web platforms, AI-powered systems, and scalable cloud solutions.
            Obsessed with clean architecture, DevOps automation, and ultra-smooth user experiences.
          </p>

          {/* CTA Action Buttons */}
          <div className={styles.actionGroup}>
            <a
              href="#projects"
              className={styles.viewProjectsBtn}
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
              onMouseEnter={() => {
                if (soundEnabled) soundManager.playHoverSound();
              }}
              onClick={() => {
                if (soundEnabled) soundManager.playClickSound();
              }}
            >
              <span>View My Projects</span>
              <ArrowRight size={17} />
            </a>

            <a
              href="https://www.linkedin.com/in/subham-khandual/"
              target="_blank"
              rel="noreferrer me"
              className={styles.connectBtn}
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
              onMouseEnter={() => {
                if (soundEnabled) soundManager.playHoverSound();
              }}
              onClick={() => {
                if (soundEnabled) soundManager.playClickSound();
              }}
            >
              <span>Let's Connect</span>
              <FaLinkedin size={18} className={styles.linkedinIcon} />
            </a>
          </div>

          {/* Bottom Stats Row */}
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <div className={styles.statIconWrapper}>
                <Code2 size={20} color="#00f0ff" />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>5+</span>
                <span className={styles.statLabel}>Projects</span>
              </div>
            </div>

            <div className={styles.statDivider} />

            <div className={styles.statItem}>
              <div className={styles.statIconWrapper}>
                <Users size={20} color="#8b5cf6" />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>1+</span>
                <span className={styles.statLabel}>Years Exp.</span>
              </div>
            </div>

            <div className={styles.statDivider} />

            <div className={styles.statItem}>
              <div className={styles.statIconWrapper}>
                <Trophy size={20} color="#fbbf24" />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>Always</span>
                <span className={styles.statLabel}>Learning</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Right Side Developer Visual Showcase ─────────────────────────── */}
        <motion.div className={styles.showcaseStage} style={{ transform: visualParallax }}>
          {/* Background Warm Neon Sign */}
          <div className={styles.neonSign} aria-hidden="true">
            Dream <br /> Build <br /> Grow
          </div>

          {/* 3D Glowing Orbital Neon Rings */}
          <div className={styles.orbitRingOuter} aria-hidden="true" />
          <div className={styles.orbitRingInner} aria-hidden="true" />

          {/* Center Developer Photo Frame */}
          <div className={styles.photoContainer}>
            <div className={styles.backlightAura} aria-hidden="true" />
            <img
              src="/subham-photo.webp"
              alt="Subham Khandual Full-Stack Developer"
              width="512"
              height="512"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className={styles.developerPhoto}
            />
          </div>

          {/* Floating Glass Tech Badge 1: React */}
          <motion.div
            className={`${styles.floatingCard} ${styles.cardReact}`}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <SiReact size={34} color="#00d8ff" className={styles.reactGlowIcon} />
          </motion.div>

          {/* Floating Glass Tech Badge 2: Python */}
          <motion.div
            className={`${styles.floatingCard} ${styles.cardPython}`}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <SiPython size={34} color="#ffd43b" className={styles.pythonGlowIcon} />
          </motion.div>

          {/* Floating Glass Tech Badge 3: Node.js */}
          <motion.div
            className={`${styles.floatingCard} ${styles.cardNode}`}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          >
            <SiNodedotjs size={34} color="#68a063" className={styles.nodeGlowIcon} />
          </motion.div>

          {/* Floating Glass Tech Badge 4: Docker */}
          <motion.div
            className={`${styles.floatingCard} ${styles.cardDocker}`}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          >
            <SiDocker size={34} color="#0db7ed" className={styles.dockerGlowIcon} />
          </motion.div>

          {/* Foreground Desk Accessories */}
          <div className={styles.deskAccessories}>
            {/* Developer Mug */}
            <div className={styles.devMug} title="Fueling code">
              <span className={styles.mugCode}>&lt;/&gt;</span>
            </div>

            {/* Stack of Tech Books */}
            <div className={styles.bookStack}>
              <div className={styles.bookOne}>React</div>
              <div className={styles.bookTwo}>Node.js</div>
              <div className={styles.bookThree}>System Design</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Centered Scroll Down Mouse Indicator ──────────────────────────── */}
      <a href="#about" className={styles.scrollDownIndicator} aria-label="Scroll Down to About">
        <div className={styles.mousePill}>
          <div className={styles.mouseWheelDot} />
        </div>
        <span className={styles.scrollDownText}>Scroll Down &darr;</span>
      </a>
    </section>
  );
};

export default Hero;
