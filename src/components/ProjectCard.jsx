import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ExternalLink, Github, Eye, Sparkles, Code2, Star } from 'lucide-react';
import { useTilt, useDeviceType, usePrefersReducedMotion } from '../hooks/useTilt';
import { usePortfolio } from '../context/PortfolioContext';
import { soundManager } from '../utils/audio';
import styles from './ProjectCard.module.css';

// Category color mapping - matching Orange x Blue theme
const categoryColors = {
  'Full-Stack MERN': { bg: 'rgba(249, 115, 22, 0.08)', border: 'rgba(249, 115, 22, 0.35)', color: '#F97316' },
  'AI / ML':         { bg: 'rgba(59, 130, 246, 0.08)', border: 'rgba(59, 130, 246, 0.35)', color: '#3B82F6' },
  'AI Tool':         { bg: 'rgba(251, 146, 60, 0.08)', border: 'rgba(251, 146, 60, 0.35)', color: '#FB923C' },
};

// Magnetic Wrapper Component
const Magnetic = ({ children, disabled }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 12, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    const maxShift = 8;
    let shiftX = distanceX * 0.25;
    let shiftY = distanceY * 0.25;

    if (Math.abs(shiftX) > maxShift) shiftX = Math.sign(shiftX) * maxShift;
    if (Math.abs(shiftY) > maxShift) shiftY = Math.sign(shiftY) * maxShift;

    x.set(shiftX);
    y.set(shiftY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (disabled) return children;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
};

const ProjectCard = ({ project, idx, onViewDetails }) => {
  const { soundEnabled } = usePortfolio();
  const deviceType = useDeviceType();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Scroll depth parallax setup
  const outerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start end", "end start"]
  });

  const isEven = idx % 2 === 0;
  const scrollSpeed = isEven ? -25 : 25;
  const scrollY = useTransform(
    scrollYProgress, 
    [0, 1], 
    deviceType === 'desktop' && !prefersReducedMotion 
      ? [scrollSpeed, -scrollSpeed] 
      : [0, 0]
  );

  // Tilt settings based on responsive rules
  const maxTilt = prefersReducedMotion 
    ? 0 
    : deviceType === 'mobile' 
      ? 3 
      : deviceType === 'tablet' 
        ? 7 
        : 18;

  const {
    ref: tiltRef,
    x,
    y,
    rotateX,
    rotateY,
    mouseXPercent,
    mouseYPercent,
    isHovered,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  } = useTilt({ maxTilt });

  // Stagger scale factor for Z translations
  const zScale = prefersReducedMotion 
    ? 0 
    : deviceType === 'mobile' 
      ? 0.15 
      : deviceType === 'tablet' 
        ? 0.45 
        : 1.0;

  // Custom Layer translations (Multi-layer parallax)
  const imageX = useTransform(x, [0, 1], deviceType === 'desktop' ? [-5, 5] : [0, 0]);
  const imageY = useTransform(y, [0, 1], deviceType === 'desktop' ? [-5, 5] : [0, 0]);

  const titleX = useTransform(x, [0, 1], deviceType === 'desktop' ? [-8, 8] : [0, 0]);
  const titleY = useTransform(y, [0, 1], deviceType === 'desktop' ? [-8, 8] : [0, 0]);

  const descX = useTransform(x, [0, 1], deviceType === 'desktop' ? [-6, 6] : [0, 0]);
  const descY = useTransform(y, [0, 1], deviceType === 'desktop' ? [-6, 6] : [0, 0]);

  const techX = useTransform(x, [0, 1], deviceType === 'desktop' ? [-10, 10] : [0, 0]);
  const techY = useTransform(y, [0, 1], deviceType === 'desktop' ? [-10, 10] : [0, 0]);

  const footerX = useTransform(x, [0, 1], deviceType === 'desktop' ? [-12, 12] : [0, 0]);
  const footerY = useTransform(y, [0, 1], deviceType === 'desktop' ? [-12, 12] : [0, 0]);

  // Viewport entrance animation configuration
  const cardEntranceVariants = {
    hidden: { 
      opacity: 0, 
      y: 60, 
      filter: "blur(8px)", 
      rotateX: 12,
      scale: 0.93 
    },
    visible: (customIdx) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      rotateX: 0,
      scale: 1,
      transition: {
        delay: customIdx * 0.12,
        duration: 0.8,
        ease: [0.25, 0.8, 0.25, 1],
      }
    })
  };

  // Continuous floating animation
  const floatVariants = {
    float: (delay) => ({
      y: [0, -10, 0],
      rotate: [0, 0.8, -0.8, 0],
      scale: [1, 1.008, 0.992, 1],
      transition: {
        duration: 7,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
        delay: delay,
      }
    })
  };

  // Tech badge entrance animation
  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 15, rotate: -5 },
    visible: (badgeIdx) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      rotate: 0,
      transition: {
        delay: badgeIdx * 0.04 + (idx * 0.1),
        type: "spring",
        stiffness: 140,
        damping: 10
      }
    })
  };

  // Ripple click handler for buttons
  const handleRipple = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const rippleX = e.clientX - rect.left;
    const rippleY = e.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.className = styles.ripple;
    ripple.style.left = `${rippleX}px`;
    ripple.style.top = `${rippleY}px`;

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  const handleCardClick = () => {
    if (soundEnabled) soundManager.playClickSound();
    onViewDetails();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  const catStyle = categoryColors[project.category] || categoryColors['AI Tool'];

  return (
    <motion.div
      ref={outerRef}
      className={styles.cardOuter}
      variants={cardEntranceVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      custom={idx}
      style={{ y: scrollY }}
    >
      <motion.div
        className={styles.cardFloatingWrapper}
        variants={prefersReducedMotion ? {} : floatVariants}
        animate="float"
        custom={idx * 0.6}
      >
        <div
          ref={tiltRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => {
            handleMouseEnter();
            if (soundEnabled) soundManager.playHoverSound();
          }}
          onMouseLeave={handleMouseLeave}
          className={styles.cardPerspectiveContainer}
          style={{ perspective: "1800px" }}
        >
          <motion.div
            className={`${styles.cardInner} glass-card`}
            tabIndex={0}
            aria-label={`Project card for ${project.title}. Category: ${project.category}. Press Enter to view details.`}
            onKeyDown={handleKeyDown}
            onClick={handleCardClick}
            style={{
              rotateX: isHovered ? rotateX : 0,
              rotateY: isHovered ? rotateY : 0,
              transformStyle: "preserve-3d",
              '--mx': mouseXPercent ? useTransform(mouseXPercent, (v) => `${v}%`) : '50%',
              '--my': mouseYPercent ? useTransform(mouseYPercent, (v) => `${v}%`) : '50%',
            }}
            whileHover={prefersReducedMotion ? {} : {
              y: -10,
              scale: 1.025,
              boxShadow: "0 35px 80px rgba(0, 0, 0, 0.65), 0 0 45px rgba(249, 115, 22, 0.35), 0 0 45px rgba(59, 130, 246, 0.25)"
            }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
          >
            {/* Layer 1: Background Cyber Grid & Spotlight Overlay */}
            <div className={styles.cardBg} />
            <div className={styles.spotlight} />

            {/* Featured Badge */}
            {project.featured && (
              <div className={styles.featuredBadge}>
                <Star size={10} fill="currentColor" /> Featured
              </div>
            )}

            {/* Category Badge */}
            <div
              className={styles.categoryBadge}
              style={{ background: catStyle.bg, border: `1px solid ${catStyle.border}`, color: catStyle.color }}
            >
              {project.category}
            </div>

            {/* Layer 2: Image Container (z-translation: 25) */}
            <motion.div 
              className={styles.imageContainer}
              style={{
                x: imageX,
                y: imageY,
                z: 25 * zScale,
                transformStyle: "preserve-3d"
              }}
            >
              <div className={styles.scanline} />
              <img src={project.image} alt={project.title} className={styles.projectImg} loading="lazy" />
              <div className={styles.shine} />
              
              {/* Overlay Interactive Buttons */}
              <div className={styles.imageOverlay} onClick={(e) => e.stopPropagation()}>
                <div className={styles.overlayBtns}>
                  <Magnetic disabled={deviceType !== 'desktop'}>
                    <button
                      className={styles.btnGlass}
                      onClick={(e) => {
                        handleRipple(e);
                        handleCardClick();
                      }}
                      title={`View details of ${project.title}`}
                      aria-label={`View details of ${project.title}`}
                    >
                      <Eye size={16} />
                    </button>
                  </Magnetic>
                  
                  <Magnetic disabled={deviceType !== 'desktop'}>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.btnGithub}
                      onClick={(e) => {
                        handleRipple(e);
                        if (soundEnabled) soundManager.playClickSound();
                      }}
                      title="View GitHub Repository"
                      aria-label="View GitHub Repository"
                    >
                      <Github size={16} />
                    </a>
                  </Magnetic>

                  <Magnetic disabled={deviceType !== 'desktop'}>
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.btnLiveDemoMini}
                      onClick={(e) => {
                        handleRipple(e);
                        if (soundEnabled) soundManager.playClickSound();
                      }}
                      title="Open Live Demo"
                      aria-label="Open Live Demo"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </Magnetic>
                </div>
              </div>
            </motion.div>

            {/* Card Content Body */}
            <div className={styles.cardContent}>
              
              {/* Layer 3: Title Row (z-translation: 45) */}
              <motion.div 
                className={styles.titleRow}
                style={{
                  x: titleX,
                  y: titleY,
                  z: 45 * zScale
                }}
              >
                <Code2 size={20} color="#F97316" />
                <h3 className={styles.title}>{project.title}</h3>
              </motion.div>

              {/* Subtitle (inherits Layer 3/4 depth) */}
              <motion.span 
                className={styles.subtitle}
                style={{
                  x: titleX,
                  y: titleY,
                  z: 48 * zScale
                }}
              >
                {project.subtitle}
              </motion.span>

              {/* Layer 4: Description (z-translation: 60) */}
              <motion.p 
                className={styles.description}
                style={{
                  x: descX,
                  y: descY,
                  z: 60 * zScale
                }}
              >
                {project.description}
              </motion.p>

              {/* Layer 5: Tech Stack Badges (z-translation: 75) with alternating colors */}
              <motion.div 
                className={styles.techStack}
                style={{
                  x: techX,
                  y: techY,
                  z: 75 * zScale
                }}
              >
                {project.tech.map((t, tIdx) => {
                  const badgeType = tIdx % 3 === 0 ? 'orange' : tIdx % 3 === 1 ? 'blue' : 'glass';
                  const badgeClass = 
                    badgeType === 'orange' 
                      ? styles.techBadgeOrange 
                      : badgeType === 'blue' 
                        ? styles.techBadgeBlue 
                        : styles.techBadgeGlass;
                  
                  return (
                    <motion.span 
                      key={tIdx} 
                      className={badgeClass}
                      variants={badgeVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      custom={tIdx}
                    >
                      {t}
                    </motion.span>
                  );
                })}
              </motion.div>

              {/* Cyber Watermark */}
              <div className={styles.cyberWatermark}>INTELLIGENT_AGENT_CORE_v2.0</div>

              {/* Layer 6: Footer Links (z-translation: 90) */}
              <motion.div 
                className={styles.cardFooter}
                onClick={(e) => e.stopPropagation()}
                style={{
                  x: footerX,
                  y: footerY,
                  z: 90 * zScale
                }}
              >
                <Magnetic disabled={deviceType !== 'desktop'}>
                  <button
                    className={styles.detailsBtn}
                    onClick={handleCardClick}
                    aria-label={`View Features and details for ${project.title}`}
                  >
                    View Details & Features <Sparkles size={13} style={{ marginLeft: '2px' }} />
                  </button>
                </Magnetic>

                <div className={styles.footerLinks}>
                  <Magnetic disabled={deviceType !== 'desktop'}>
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noreferrer" 
                      className={styles.btnGithub}
                      onClick={(e) => {
                        handleRipple(e);
                        if (soundEnabled) soundManager.playClickSound();
                      }}
                      title="GitHub Repository"
                      aria-label="GitHub Repository"
                    >
                      <Github size={15} />
                    </a>
                  </Magnetic>

                  <Magnetic disabled={deviceType !== 'desktop'}>
                    <a 
                      href={project.live} 
                      target="_blank" 
                      rel="noreferrer" 
                      className={styles.btnLiveDemoMini}
                      onClick={(e) => {
                        handleRipple(e);
                        if (soundEnabled) soundManager.playClickSound();
                      }}
                      title="Live Demo"
                      aria-label="Live Demo"
                    >
                      <ExternalLink size={15} />
                    </a>
                  </Magnetic>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(ProjectCard);
