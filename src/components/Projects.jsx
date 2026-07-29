import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Eye, Sparkles, CheckCircle2, X, Code2, Layers, Star } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundManager } from '../utils/audio';
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

// Category color mapping
const categoryColors = {
  'Full-Stack MERN': { bg: 'rgba(0, 240, 255, 0.1)', border: 'rgba(0, 240, 255, 0.4)', color: '#00f0ff' },
  'AI / ML':         { bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.4)', color: '#a78bfa' },
  'AI Tool':         { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.4)', color: '#fbbf24' },
};

const Projects = () => {
  const { soundEnabled } = usePortfolio();
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Full-Stack MERN', 'AI / ML', 'AI Tool'];
  const filtered = activeFilter === 'All' ? projectsData : projectsData.filter(p => p.category === activeFilter);

  return (
    <section id="projects" className={styles.projectsSection}>
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className={styles.header}
        >
          <h2 className="section-title">
            Featured <span className="text-gradient">Projects Showcase</span>
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
            {filtered.map((project, idx) => {
              const catStyle = categoryColors[project.category] || categoryColors['AI Tool'];
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className={`${styles.projectCard} ${project.featured ? styles.featuredCard : ''} glass-card`}
                  onMouseEnter={() => {
                    if (soundEnabled) soundManager.playHoverSound();
                  }}
                >
                  {/* Futuristic Corner Accents */}
                  <div className={styles.cardCornerTL}></div>
                  <div className={styles.cardCornerTR}></div>
                  <div className={styles.cardCornerBL}></div>
                  <div className={styles.cardCornerBR}></div>

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

                  {/* Image Preview Container */}
                  <div className={styles.imageWrapper}>
                    <div className={styles.scanline}></div>
                    <img src={project.image} alt={project.title} className={styles.projectImg} />
                    <div className={styles.imageOverlay}>
                      <div className={styles.overlayBtns}>
                        <button
                          className={styles.actionCircleBtn}
                          onClick={() => {
                            if (soundEnabled) soundManager.playClickSound();
                            setSelectedProject(project);
                          }}
                          title="View Project Details"
                        >
                          <Eye size={18} />
                        </button>
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.actionCircleBtn}
                          title="View GitHub Repository"
                        >
                          <Github size={18} />
                        </a>
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.actionCircleBtn}
                          title="Open Live Preview"
                        >
                          <ExternalLink size={18} />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className={styles.cardContent}>
                    {/* Cyber Status Indicators */}
                    <div className={styles.cyberStatus}>
                      <span className={styles.statusDot}></span>
                      <span>SYS_ACTIVE // AI_COMPILED</span>
                    </div>

                    <div className={styles.titleRow}>
                      <Code2 size={20} color="#00f0ff" />
                      <h3 className={styles.title}>{project.title}</h3>
                    </div>
                    <span className={styles.subtitle}>{project.subtitle}</span>

                    <p className={styles.description}>{project.description}</p>

                    {/* Tech Stack Pills */}
                    <div className={styles.techStack}>
                      {project.tech.map((t, tIdx) => (
                        <span key={tIdx} className="badge">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Cyber Watermark */}
                    <div className={styles.cyberWatermark}>INTELLIGENT_AGENT_CORE_v2.0</div>

                    {/* Action Links */}
                    <div className={styles.cardFooter}>
                      <button
                        className={styles.detailsBtn}
                        onClick={() => {
                          if (soundEnabled) soundManager.playClickSound();
                          setSelectedProject(project);
                        }}
                      >
                        View Details & Features <Sparkles size={14} />
                      </button>
                      <div className={styles.footerLinks}>
                        <a href={project.github} target="_blank" rel="noreferrer" className={styles.footerIconLink} title="GitHub">
                          <Github size={18} />
                        </a>
                        <a href={project.live} target="_blank" rel="noreferrer" className={styles.footerIconLink} title="Live Demo">
                          <ExternalLink size={18} />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
            className="btn btn-outline"
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
                    <span style={{ background: cs.bg, border: `1px solid ${cs.border}`, color: cs.color, borderRadius: '20px', padding: '0.2rem 0.75rem', fontSize: '0.75rem', fontWeight: '600' }}>
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
                      className="btn btn-primary"
                    >
                      Live Demo <ExternalLink size={16} />
                    </a>
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline"
                    >
                      Source Code <Github size={16} />
                    </a>
                  </div>
                </div>

                <div className={styles.modalInfoSide}>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#ffffff' }}>
                    {selectedProject.title}
                  </h3>
                  <p style={{ color: '#00f0ff', fontWeight: '600', marginBottom: '1rem' }}>
                    {selectedProject.subtitle}
                  </p>

                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    {selectedProject.description}
                  </p>

                  <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={16} color="#00f0ff" /> Key Features & Capabilities:
                  </h4>
                  <ul className={styles.featuresList}>
                    {selectedProject.features.map((feat, fIdx) => (
                      <li key={fIdx}>
                        <CheckCircle2 size={16} color="#00f0ff" style={{ minWidth: '16px' }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <h4 style={{ color: '#ffffff', fontSize: '1rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
                    Technologies Used:
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedProject.tech.map((t, tIdx) => (
                      <span key={tIdx} className="badge">
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
