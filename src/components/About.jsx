import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { User, Code, BookOpen, GraduationCap, Award, Rocket, CheckCircle } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundManager } from '../utils/audio';
import styles from './About.module.css';

// Heavy WebGL 3D canvas is code-split so three.js is only loaded on-demand
const TechCubeCanvas = lazy(() => import('./TechCubeCanvas'));

const quickFacts = [
  { label: 'Degree', value: 'B.Tech in Computer Science' },
  { label: 'College', value: 'GIFT Autonomous, Bhubaneswar' },
  { label: 'Focus Area', value: 'Full Stack MERN & AI/ML' },
  { label: 'Location', value: 'Odisha, India' },
];

const About = () => {
  const { soundEnabled } = usePortfolio();

  return (
    <section id="about" className={styles.aboutSection}>
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className={styles.header}
        >
          <h2 className="section-title">
            About <span className="text-gradient">Subham Khandual</span>
          </h2>
          <p className="section-subtitle">
            Crafting futuristic software, solving algorithmic challenges, and engineering AI-driven solutions.
          </p>
        </motion.div>

        {/* 3D Tech Cube & Bio Main Grid */}
        <div className={styles.mainGrid}>
          {/* Left Column: Interactive 3D Cube Canvas & Quick Facts */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className={styles.cubeSide}
          >
            <div className={styles.cubeCanvasWrapper}>
              <Suspense fallback={<div style={{ width: '100%', height: '100%', background: '#070d1a' }} />}>
                <TechCubeCanvas />
              </Suspense>
              <div className={styles.cubeLabel}>Drag / Rotate 3D Tech Core</div>
            </div>

            {/* Quick Facts */}
            <div className={styles.quickFactsGrid}>
              {quickFacts.map((fact, idx) => (
                <div key={idx} className={`${styles.factCard} glass`}>
                  <span className={styles.factLabel}>{fact.label}</span>
                  <span className={styles.factValue}>{fact.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Detailed Stories & Education */}
          <div className={styles.cardsSide}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              className={`${styles.card} glass-card`}
              onMouseEnter={() => {
                if (soundEnabled) soundManager.playHoverSound();
              }}
            >
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                  <User size={22} />
                </div>
                <h3>Background & Personal Philosophy</h3>
              </div>
              <p className={styles.cardBody}>
                I am a final-year Computer Science student at Gandhi Institute for Technology (GIFT Autonomous), Bhubaneswar. 
                Driven by a deep passion for building scalable web platforms and intelligent systems, I specialize in the 
                MERN stack, Python AI development, and algorithm optimization.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.1 }}
              className={`${styles.card} glass-card`}
              onMouseEnter={() => {
                if (soundEnabled) soundManager.playHoverSound();
              }}
            >
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                  <GraduationCap size={22} />
                </div>
                <h3>Education & Academic Foundation</h3>
              </div>
              <div className={styles.educationDetails}>
                {/* 1. B.Tech (Current) */}
                <div className={styles.eduItem}>
                  <div className={styles.eduHeader}>
                    <h4 style={{ color: '#00f0ff' }}>B.Tech in Computer Science & Engineering</h4>
                    <span className="badge">2023 – 2027</span>
                  </div>
                  <p className={styles.eduInstitution}>
                    GIFT Autonomous College, Bhubaneswar, Odisha
                  </p>
                  <ul className={styles.eduList}>
                    <li><CheckCircle size={14} color="#00f0ff" /> Coursework: Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks.</li>
                    <li><CheckCircle size={14} color="#00f0ff" /> Hands-on engineering in Full-Stack Web Development, AI/ML, & Cloud Solutions.</li>
                  </ul>
                </div>

                {/* 2. Intermediate */}
                <div className={styles.eduItem}>
                  <div className={styles.eduHeader}>
                    <h4 style={{ color: '#a78bfa' }}>Higher Secondary Education (+2 Science)</h4>
                    <span className="badge">2021 – 2023</span>
                  </div>
                  <p className={styles.eduInstitution}>
                    Swadhin Residential Higher Secondary School, Nimapada, Puri
                  </p>
                  <ul className={styles.eduList}>
                    <li><CheckCircle size={14} color="#a78bfa" /> Core Subjects: Physics, Chemistry, Mathematics, & Computer Science.</li>
                  </ul>
                </div>

                {/* 3. Schooling */}
                <div className={styles.eduItem}>
                  <div className={styles.eduHeader}>
                    <h4 style={{ color: '#38bdf8' }}>Secondary School Education (Matriculation)</h4>
                    <span className="badge">2010 – 2021</span>
                  </div>
                  <p className={styles.eduInstitution}>
                    Saraswati Shishu Vidya Mandir, Astaranga, Puri
                  </p>
                  <ul className={styles.eduList}>
                    <li><CheckCircle size={14} color="#38bdf8" /> Strong foundation in Mathematics, Sciences, and Academic Excellence.</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.2 }}
              className={`${styles.card} glass-card`}
              onMouseEnter={() => {
                if (soundEnabled) soundManager.playHoverSound();
              }}
            >
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                  <Rocket size={22} />
                </div>
                <h3>Coding Journey & Future Vision</h3>
              </div>
              <p className={styles.cardBody}>
                My journey began with learning the MERN Stack and algorithms, evolving into building production-ready platforms 
                like <strong>Swasthya Setu</strong> and <strong>Suraksha Setu</strong>. My goal is to build software that impacts 
                millions of users, combining elegant UI/UX design with robust backend engineering and AI integration.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
