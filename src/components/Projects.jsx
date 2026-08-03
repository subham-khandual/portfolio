import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { ExternalLink, Github, Sparkles, CheckCircle2, X, Code2, Layers, Star } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { usePrefersReducedMotion, useDeviceType } from '../hooks/useTilt';
import { soundManager } from '../utils/audio';
import ProjectCard from './ProjectCard';
import styles from './Projects.module.css';

const projectsData = [
  {
    id: 'surakshasetu',
    title: 'Suraksha Setu',
    subtitle: 'AI Smart Tourist Safety Platform',
    description: 'A critical tourist security ecosystem with interactive real-time mapping, emergency SOS triggers, QR digital IDs, and centralized incident management.',
    image: '/surakshasetu.png',
    category: 'Full-Stack MERN',
    featured: true,
    tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'TypeScript', 'AI Chatbot'],
    github: 'https://github.com/subham-khandual/Suraksha-Setu',
    live: 'https://suraksha-setu-oxkw.vercel.app',
    features: [
      'One-tap Emergency SOS alert trigger to police & contacts',
      'Live Safe Route guidance & real-time hazard mapping',
      'Digital Tourist ID with secure QR Code verification',
      'Integrated AI Assistant chatbot for 24/7 tourist support',
      'Admin command dashboard for local authorities'
    ]
  },
  {
    id: 'swasthyasetu',
    title: 'Swasthya Setu',
    subtitle: 'Comprehensive Healthcare Platform',
    description: 'A complete medical service hub offering rapid first aid response, blood bank tracking, instant doctor video consultations, and AI healthcare chat.',
    image: '/swasthyasetu.png',
    category: 'Full-Stack MERN',
    featured: true,
    tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'AI Chatbot', 'Tailwind CSS'],
    github: 'https://github.com/subham-khandual/swasthyasetu',
    live: 'https://swasthyasetu-tsbt.vercel.app',
    features: [
      'Integrated Susri Healthcare Chatbot for instant diagnosis',
      'Real-time blood bank availability locator',
      'Instant doctor consultation booking system',
      'Emergency first-aid guidance & hospital finder'
    ]
  },
  {
    id: 'sayraaai',
    title: 'Sayraa AI PPT Generator',
    subtitle: 'Automated AI Presentation Platform',
    description: 'An intelligent presentation generator creating structured, beautifully designed PowerPoint slides from custom topics powered by Groq and Gemini AI models.',
    image: '/sayraaai.png',
    category: 'AI Tool',
    featured: false,
    tech: ['Python', 'Flask', 'Gemini AI', 'Groq AI', 'Bootstrap'],
    github: 'https://github.com/subham-khandual/ppt-generator',
    live: 'https://ppt-generator-seven-mu.vercel.app',
    features: [
      'Groq & Gemini AI high-speed slide content generation',
      'Automated formatting, headings, & speaker notes',
      'Instant PPTX file export download',
      'Custom theme selection & layout options'
    ]
  },
  {
    id: 'sayraahealth',
    title: 'SuuSri AI Health Assistant',
    subtitle: 'Multilingual Voice AI Health Companion',
    description: 'A voice-enabled healthcare assistant built with React and Groq LLM, providing accessible medical guidance in Odia, Hindi, and English with offline PWA support.',
    image: '/suusriai.png',
    category: 'AI Tool',
    featured: false,
    tech: ['React', 'Groq LLM', 'Firebase', 'PWA', 'Web Speech API', 'Tailwind CSS'],
    github: 'https://github.com/subham-khandual/sayraa-health-care-ai-assistant',
    live: 'https://sayraa-health-care-ai-assistant.vercel.app/',
    features: [
      'Multilingual voice recognition (Odia, Hindi, English)',
      'Groq LLM ultra-fast medical advice response',
      'Progressive Web App (PWA) installable on mobile',
      'Firebase cloud conversation history'
    ]
  }
];

// Theme-matched category colors (Orange x Blue theme)
const categoryColors = {
  'Full-Stack MERN': { bg: 'rgba(249, 115, 22, 0.08)', border: 'rgba(249, 115, 22, 0.35)', color: '#F97316' },
  'AI / ML':         { bg: 'rgba(59, 130, 246, 0.08)', border: 'rgba(59, 130, 246, 0.35)', color: '#3B82F6' },
  'AI Tool':         { bg: 'rgba(251, 146, 60, 0.08)', border: 'rgba(251, 146, 60, 0.35)', color: '#FB923C' },
};

// Cinematic floating particles (Sparks, Orange and Blue dust, blurred bokeh circles)
const StarBackground = React.memo(() => {
  const stars = React.useMemo(() => {
    return Array.from({ length: 45 }, (_, i) => {
      const type = i % 4;
      let color = '#ffffff';
      let size = Math.random() * 1.5 + 0.5;
      let blur = 0;
      let opacity = Math.random() * 0.4 + 0.15;
      
      if (type === 1) {
        color = '#FF6B00';
        size = Math.random() * 2.5 + 1.2;
        opacity = Math.random() * 0.45 + 0.2;
      } else if (type === 2) {
        color = '#38BDF8';
        size = Math.random() * 2.5 + 1.2;
        opacity = Math.random() * 0.45 + 0.2;
      } else if (type === 3) {
        color = i % 2 === 0 ? '#FF8A1F' : '#2563EB';
        size = Math.random() * 22 + 10;
        blur = Math.random() * 4 + 3;
        opacity = Math.random() * 0.08 + 0.03;
      }
      
      return {
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size,
        color,
        blur,
        opacity,
        delay: Math.random() * 6,
        duration: Math.random() * 12 + 6,
      };
    });
  }, []);

  return (
    <div className={styles.starContainer}>
      {stars.map((star) => (
        <div
          key={star.id}
          className={styles.star}
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            filter: star.blur ? `blur(${star.blur}px)` : 'none',
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
});

StarBackground.displayName = 'StarBackground';

const Projects = () => {
  const { soundEnabled } = usePortfolio();
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Full-Stack MERN', 'AI / ML', 'AI Tool'];
  const filtered = activeFilter === 'All' ? projectsData : projectsData.filter(p => p.category === activeFilter);

  // Parallax Depth Configuration
  const sectionRef = useRef(null);
  const deviceType = useDeviceType();
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const disableParallax = prefersReducedMotion || deviceType !== 'desktop';

  // Raw coordinate transforms for 5 depth layers
  const yBase = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const yOrangeGlowVal = useTransform(scrollYProgress, [0, 1], disableParallax ? [0, 0] : [-60, 60]);
  const yBlueGlowVal = useTransform(scrollYProgress, [0, 1], disableParallax ? [0, 0] : [60, -60]);
  const yParticlesVal = useTransform(scrollYProgress, [0, 1], disableParallax ? [0, 0] : [-90, 90]);
  const yFogGridVal = useTransform(scrollYProgress, [0, 1], disableParallax ? [0, 0] : [-30, 30]);

  // Spring physics config to smooth out scroll parallax updates
  const springConfig = { stiffness: 80, damping: 22, mass: 0.4 };
  const yOrangeGlow = useSpring(yOrangeGlowVal, springConfig);
  const yBlueGlow = useSpring(yBlueGlowVal, springConfig);
  const yParticles = useSpring(yParticlesVal, springConfig);
  const yFogGrid = useSpring(yFogGridVal, springConfig);

  return (
    <section ref={sectionRef} id="projects" className={styles.projectsSection}>
      {/* ───── Parallax Background Layers ───── */}
      
      {/* Layer 1: Dark Base (Static) */}
      <motion.div style={{ y: yBase }} className={styles.gradientMesh} />
      <motion.div style={{ y: yBase }} className={styles.noiseOverlay} />

      {/* Layer 5: Cyber Grid & Aurora Flow & Volumetric Fog (Slow Parallax) */}
      <motion.div style={{ y: yFogGrid }} className={styles.cyberGrid} />
      <motion.div style={{ y: yFogGrid }} className={styles.auroraWave} />
      <motion.div style={{ y: yFogGrid }} className={styles.volumetricFog} />

      {/* Layer 2: Orange Glow - Left (Medium Parallax) */}
      <motion.div style={{ y: yOrangeGlow }} className={styles.glowBlobOrange} />

      {/* Layer 3: Blue Glow - Right (Medium Parallax) */}
      <motion.div style={{ y: yBlueGlow }} className={styles.glowBlobBlue} />

      {/* Layer 4: Floating Particles & Bokeh Circles (Fast Parallax) */}
      <motion.div style={{ y: yParticles }} className={styles.starContainerWrapper}>
        <StarBackground />
      </motion.div>

      {/* Main Content Layout */}
      <div className="container" style={{ position: 'relative', zIndex: 6 }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className={styles.header}
        >
          <h2 className="section-title">
            Featured <span className={styles.textGradientOB}>Projects Showcase</span>
          </h2>
          <p className="section-subtitle">
            A curated collection of full-stack MERN platforms, AI tools, machine learning classifiers, and web applications.
          </p>

          {/* Stats Row */}
          <div className={styles.statsRow}>
            <div className={styles.statBadge}>
              <Layers size={14} />
              <span>{projectsData.length} Projects</span>
            </div>
            <div className={styles.statBadge}>
              <Star size={14} />
              <span>{projectsData.filter(p => p.featured).length} Featured</span>
            </div>
            <div className={styles.statBadge}>
              <Code2 size={14} />
              <span>Live Deployments</span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className={styles.filterRow}>
            {filters.map(f => (
              <button
                key={f}
                className={`${styles.filterBtn} ${activeFilter === f ? styles.filterActive : ''}`}
                onClick={() => {
                  if (soundEnabled) soundManager.playClickSound();
                  setActiveFilter(f);
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            className={styles.grid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filtered.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                idx={idx}
                onViewDetails={() => setSelectedProject(project)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.githubCta}
        >
          <p className={styles.ctaText}>
            Explore more open-source projects, contributions, and experiments on my GitHub.
          </p>
          <a
            href="https://github.com/subham-khandual"
            target="_blank"
            rel="noreferrer"
            className={styles.btnOrangeBlueOutline}
            onClick={() => { if (soundEnabled) soundManager.playClickSound(); }}
          >
            <Github size={18} /> View All Projects on GitHub
          </a>
        </motion.div>
      </div>

      {/* Project Lightbox Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div
            className={styles.modalOverlay}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className={`${styles.modalContent} glass`}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.closeBtn}
                onClick={() => setSelectedProject(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              {/* Modal Category Tag */}
              <div className={styles.modalCategoryTag}>
                {(() => {
                  const cs = categoryColors[selectedProject.category] || categoryColors['AI Tool'];
                  return (
                    <span style={{ 
                      background: cs.bg, 
                      border: `1px solid ${cs.border}`, 
                      color: cs.color, 
                      borderRadius: '20px', 
                      padding: '0.25rem 0.85rem', 
                      fontSize: '0.75rem', 
                      fontWeight: '700',
                      boxShadow: `0 0 12px ${cs.color}44`
                    }}>
                      {selectedProject.category}
                    </span>
                  );
                })()}
              </div>

              <div className={styles.modalGrid}>
                <div className={styles.modalImageSide}>
                  <img src={selectedProject.image} alt={selectedProject.title} className={styles.modalImg} />
                  <div className={styles.modalActionRow}>
                    <a
                      href={selectedProject.live}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.btnOrangeBlue}
                    >
                      Live Demo <ExternalLink size={16} />
                    </a>
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.btnOrangeBlueOutline}
                    >
                      Source Code <Github size={16} />
                    </a>
                  </div>
                </div>

                <div className={styles.modalInfoSide}>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#ffffff' }}>
                    {selectedProject.title}
                  </h3>
                  <p style={{ color: '#FB923C', fontWeight: '600', marginBottom: '1rem' }}>
                    {selectedProject.subtitle}
                  </p>

                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.65', marginBottom: '1.5rem', fontSize: '0.92rem' }}>
                    {selectedProject.description}
                  </p>

                  <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={16} color="#F97316" /> Key Features & Capabilities:
                  </h4>
                  <ul className={styles.featuresList}>
                    {selectedProject.features.map((feat, fIdx) => (
                      <li key={fIdx}>
                        <CheckCircle2 size={16} color="#3B82F6" style={{ minWidth: '16px', marginTop: '2px' }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <h4 style={{ color: '#ffffff', fontSize: '1rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
                    Technologies Used:
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedProject.tech.map((t, tIdx) => (
                      <span key={tIdx} className="badge" style={{ 
                        borderRadius: '12px',
                        background: 'rgba(59, 130, 246, 0.08)',
                        borderColor: 'rgba(59, 130, 246, 0.25)',
                        color: '#60A5FA'
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
