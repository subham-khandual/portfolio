import React, { useRef } from 'react';
import { motion, useTransform } from 'framer-motion';
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

const ProjectCard = ({ project, idx, onViewDetails }) => {
  const { soundEnabled } = usePortfolio();
  const deviceType = useDeviceType();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Tilt settings based on responsive rules
  const maxTilt = prefersReducedMotion 
    ? 0 
    : deviceType === 'mobile' 
      ? 2 
      : deviceType === 'tablet' 
        ? 5 
        : 12;

  const {
    ref: tiltRef,
    rotateX,
    rotateY,
    mouseXPercent,
    mouseYPercent,
    isHovered,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  } = useTilt({ maxTilt });

  // Viewport entrance animation configuration (lightweight & hardware accelerated)
  const cardEntranceVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.96 
    },
    visible: (customIdx) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: customIdx * 0.08,
        duration: 0.5,
        ease: [0.25, 0.8, 0.25, 1],
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
      className={styles.cardOuter}
      variants={cardEntranceVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      custom={idx}
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
        style={{ perspective: "1200px" }}
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
            y: -6,
            boxShadow: "0 20px 45px rgba(0, 0, 0, 0.5), 0 0 25px rgba(249, 115, 22, 0.25)"
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
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

          {/* Layer 2: Image Container */}
          <div 
            className={styles.imageContainer}
            style={{ transform: "translateZ(20px)" }}
          >
            <div className={styles.scanline} />
            <img src={project.image} alt={project.title} className={styles.projectImg} loading="lazy" />
            <div className={styles.shine} />
            
            {/* Overlay Interactive Buttons */}
            <div className={styles.imageOverlay} onClick={(e) => e.stopPropagation()}>
              <div className={styles.overlayBtns}>
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
              </div>
            </div>
          </div>

          {/* Card Content Body */}
          <div className={styles.cardContent} style={{ transform: "translateZ(30px)" }}>
            
            {/* Title Row */}
            <div className={styles.titleRow}>
              <Code2 size={20} color="#F97316" />
              <h3 className={styles.title}>{project.title}</h3>
            </div>

            {/* Subtitle */}
            <span className={styles.subtitle}>
              {project.subtitle}
            </span>

            {/* Description */}
            <p className={styles.description}>
              {project.description}
            </p>

            {/* Tech Stack Badges */}
            <div className={styles.techStack}>
              {project.tech.map((t, tIdx) => {
                const badgeType = tIdx % 3 === 0 ? 'orange' : tIdx % 3 === 1 ? 'blue' : 'glass';
                const badgeClass = 
                  badgeType === 'orange' 
                    ? styles.techBadgeOrange 
                    : badgeType === 'blue' 
                      ? styles.techBadgeBlue 
                      : styles.techBadgeGlass;
                
                return (
                  <span 
                    key={tIdx} 
                    className={badgeClass}
                  >
                    {t}
                  </span>
                );
              })}
            </div>

            {/* Cyber Watermark */}
            <div className={styles.cyberWatermark}>INTELLIGENT_AGENT_CORE_v2.0</div>

            {/* Footer Links */}
            <div 
              className={styles.cardFooter}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.detailsBtn}
                onClick={handleCardClick}
                aria-label={`View Features and details for ${project.title}`}
              >
                View Details & Features <Sparkles size={13} style={{ marginLeft: '2px' }} />
              </button>

              <div className={styles.footerLinks}>
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
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default React.memo(ProjectCard);

