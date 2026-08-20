import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Float, Text } from '@react-three/drei';
import { User, Code, BookOpen, GraduationCap, Award, Rocket, CheckCircle } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundManager } from '../utils/audio';
import styles from './About.module.css';

// 3D Rotating Tech Cube Component
function TechCube() {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.7;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <Box ref={meshRef} args={[2.2, 2.2, 2.2]}>
        <meshStandardMaterial
          color="#06b6d4"
          roughness={0.1}
          metalness={0.9}
          wireframe={true}
          emissive="#8b5cf6"
          emissiveIntensity={0.5}
        />
        {/* Cube Face Text Labels */}
        <Text position={[0, 0, 1.15]} fontSize={0.35} color="#00f0ff" anchorX="center" anchorY="middle">
          REACT.JS
        </Text>
        <Text position={[0, 0, -1.15]} rotation={[0, Math.PI, 0]} fontSize={0.35} color="#8b5cf6" anchorX="center" anchorY="middle">
          NODE.JS
        </Text>
        <Text position={[1.15, 0, 0]} rotation={[0, Math.PI / 2, 0]} fontSize={0.35} color="#ec4899" anchorX="center" anchorY="middle">
          AI / ML
        </Text>
        <Text position={[-1.15, 0, 0]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.35} color="#10b981" anchorX="center" anchorY="middle">
          MONGODB
        </Text>
        <Text position={[0, 1.15, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.35} color="#f59e0b" anchorX="center" anchorY="middle">
          JAVA
        </Text>
        <Text position={[0, -1.15, 0]} rotation={[Math.PI / 2, 0, 0]} fontSize={0.35} color="#00f0ff" anchorX="center" anchorY="middle">
          PYTHON
        </Text>
      </Box>
    </Float>
  );
}

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
              <Canvas camera={{ position: [0, 0, 4.5] }} dpr={[1, 1.25]} gl={{ powerPreference: 'high-performance', antialias: false }}>
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f0ff" />
                <TechCube />
              </Canvas>
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
                <div className={styles.eduHeader}>
                  <h4 style={{ color: '#00f0ff' }}>Bachelor of Technology - Computer Science & Engineering</h4>
                  <span className="badge">2023 – 2027</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                  GIFT Autonomous College, Bhubaneswar, Odisha.
                </p>
                <ul className={styles.eduList}>
                  <li><CheckCircle size={14} color="#00f0ff" /> Coursework: Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks.</li>
                  <li><CheckCircle size={14} color="#00f0ff" /> Hands-on projects in Machine Learning, Full-Stack Web Development, & PWA.</li>
                </ul>
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
                My journey began with learning Core Java and algorithms, evolving into building production-ready platforms 
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
