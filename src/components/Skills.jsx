import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import { Code2, Server, Database, Terminal, Wrench, Sparkles } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundManager } from '../utils/audio';
import styles from './Skills.module.css';

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

// 3D Interactive Sphere Tag Cloud Component
function SkillsSphere({ skills }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
      groupRef.current.rotation.x += delta * 0.15;
    }
  });

  const count = skills.length;
  const radius = 2.4;

  return (
    <group ref={groupRef}>
      {skills.map((skill, i) => {
        // Sphere point distribution using Golden Ratio
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);

        return (
          <Float key={skill.name} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Text
              position={[x, y, z]}
              fontSize={0.28}
              color={skill.color || '#00f0ff'}
              anchorX="center"
              anchorY="middle"
            >
              {skill.name}
            </Text>
          </Float>
        );
      })}
    </group>
  );
}

const categories = ['All', 'Frontend', 'Backend', 'Database', 'Languages', 'AI & Tools'];

const Skills = () => {
  const { soundEnabled } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState('All');

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
            className={styles.sphereWrapper}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
              <ambientLight intensity={1} />
              <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f0ff" />
              <SkillsSphere skills={filteredSkills} />
            </Canvas>
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
