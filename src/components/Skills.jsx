import React, { useState, useRef, Suspense, lazy } from 'react';
import { motion, useInView } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { soundManager } from '../utils/audio';
import styles from './Skills.module.css';

// Heavy WebGL bundle — only fetched once the sphere is scrolled into view.
const SkillsSphere = lazy(() => import('./SkillsSphere'));

const allSkillsList = [
  { name: 'HTML5', category: 'Frontend', level: '95%', color: '#e34f26' },
  { name: 'CSS3', category: 'Frontend', level: '90%', color: '#1572b6' },
  { name: 'JavaScript', category: 'Frontend', level: '92%', color: '#f7df1e' },
  { name: 'React', category: 'Frontend', level: '95%', color: '#61dafb' },
  { name: 'Tailwind', category: 'Frontend', level: '90%', color: '#38bdf8' },
  { name: 'Node.js', category: 'Backend', level: '88%', color: '#68a063' },
  { name: 'Express.js', category: 'Backend', level: '90%', color: '#ffffff' },
  { name: 'MongoDB', category: 'Database', level: '85%', color: '#47a248' },
  { name: 'MySQL', category: 'Database', level: '82%', color: '#00758f' },
  { name: 'Java', category: 'Languages', level: '88%', color: '#f89820' },
  { name: 'Python', category: 'Languages', level: '85%', color: '#3776ab' },
  { name: 'C Language', category: 'Languages', level: '80%', color: '#a8b9cc' },
  { name: 'Git', category: 'AI & Tools', level: '90%', color: '#f05032' },
  { name: 'GitHub', category: 'AI & Tools', level: '92%', color: '#ffffff' },
  { name: 'Firebase', category: 'AI & Tools', level: '85%', color: '#ffca28' },
  { name: 'VS Code', category: 'AI & Tools', level: '95%', color: '#007acc' },
  { name: 'Postman', category: 'AI & Tools', level: '88%', color: '#ff6c37' },
  { name: 'AI & ML', category: 'AI & Tools', level: '84%', color: '#8b5cf6' },
];

const categories = ['All', 'Frontend', 'Backend', 'Database', 'Languages', 'AI & Tools'];

const Skills = () => {
  const { soundEnabled } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const sphereRef = useRef(null);
  // Mount the canvas only once it has been reached, and pause the render loop
  // whenever the sphere scrolls back out of the viewport.
  const sphereVisible = useInView(sphereRef, { margin: '0px 0px -15% 0px' });

  const filteredSkills =
    selectedCategory === 'All'
      ? allSkillsList
      : allSkillsList.filter((s) => s.category === selectedCategory);

  return (
    <section id="skills" className={styles.skillsSection}>
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className={styles.header}
        >
          <h2 className="section-title">
            Interactive <span className="text-gradient">3D Skills Sphere</span>
          </h2>
          <p className="section-subtitle">
            A dynamic representation of my engineering arsenal across full-stack web, machine learning, and developer tooling.
          </p>
        </motion.div>

        {/* Category Filter Pills */}
        <div className={styles.filterBar}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${selectedCategory === cat ? styles.activeFilter : ''}`}
              onClick={() => {
                if (soundEnabled) soundManager.playClickSound();
                setSelectedCategory(cat);
              }}
              onMouseEnter={() => {
                if (soundEnabled) soundManager.playHoverSound();
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.skillsMainGrid}>
          {/* Left Column: 3D Interactive Tag Cloud Sphere Canvas */}
          <motion.div
            ref={sphereRef}
            className={styles.sphereWrapper}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Suspense fallback={<div className={styles.spherePlaceholder} />}>
              {sphereVisible && <SkillsSphere skills={filteredSkills} active={sphereVisible} />}
            </Suspense>
            <div className={styles.sphereHint}>Interactive 3D Sphere - Auto Rotating</div>
          </motion.div>

          {/* Right Column: Skill Progress Cards */}
          <div className={styles.skillsCardsGrid}>
            {filteredSkills.map((skill, idx) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.04 }}
                className={`${styles.skillCard} glass-card`}
                onMouseEnter={() => {
                  if (soundEnabled) soundManager.playHoverSound();
                }}
              >
                <div className={styles.skillTop}>
                  <div className={styles.skillNameRow}>
                    <span className={styles.skillDot} style={{ backgroundColor: skill.color }} />
                    <span className={styles.skillName}>{skill.name}</span>
                  </div>
                  <span className={styles.skillCategoryBadge}>{skill.category}</span>
                </div>

                <div className={styles.progressTrack}>
                  <motion.div
                    className={styles.progressBar}
                    initial={{ width: 0 }}
                    whileInView={{ width: skill.level }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                    style={{
                      background: `linear-gradient(to right, ${skill.color}, #00f0ff)`,
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
