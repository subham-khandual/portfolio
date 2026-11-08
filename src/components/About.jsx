import React, { useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { User, Code, BookOpen, GraduationCap, Award, Rocket, CheckCircle } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundManager } from '../utils/audio';
import styles from './About.module.css';

// Procedural in-memory badge textures (no external fonts, zero network latency, zero WebGL context crash)
function createFaceTexture(name, accentColor) {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Deep dark cyberpunk container background
  ctx.fillStyle = '#060d19';
  ctx.fillRect(0, 0, 512, 512);

  // Outer neon frame
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 14;
  ctx.strokeRect(12, 12, 488, 488);

  // Inner border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 3;
  ctx.strokeRect(28, 28, 456, 456);

  // Corner tech notches
  ctx.fillStyle = accentColor;
  ctx.fillRect(12, 12, 36, 10);
  ctx.fillRect(12, 12, 10, 36);
  ctx.fillRect(464, 12, 36, 10);
  ctx.fillRect(490, 12, 10, 36);
  ctx.fillRect(12, 490, 36, 10);
  ctx.fillRect(12, 464, 10, 36);
  ctx.fillRect(464, 490, 36, 10);
  ctx.fillRect(490, 464, 10, 36);

  // Tech category header
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('• CORE STACK •', 256, 180);

  // Main Tech Title
  ctx.fillStyle = accentColor;
  ctx.font = '900 52px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(name, 256, 265);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// 3D Rotating Tech Cube Component
function TechCube() {
  const meshRef = useRef();
  const coreRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.4;
      meshRef.current.rotation.y += delta * 0.6;
    }
    if (coreRef.current) {
      coreRef.current.rotation.x -= delta * 0.5;
      coreRef.current.rotation.y += delta * 0.8;
    }
  });

  const materials = useMemo(() => {
    const faces = [
      { text: 'AI / ML', color: '#ec4899' },
      { text: 'MONGODB', color: '#10b981' },
      { text: 'DEVOPS', color: '#f59e0b' },
      { text: 'PYTHON', color: '#00f0ff' },
      { text: 'REACT.JS', color: '#00f0ff' },
      { text: 'NODE.JS', color: '#8b5cf6' },
    ];
    return faces.map((f) => {
      const tex = createFaceTexture(f.text, f.color);
      return new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.3,
        metalness: 0.1,
        emissive: new THREE.Color(f.color),
        emissiveIntensity: 0.25,
      });
    });
  }, []);

  const edgesGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(new THREE.BoxGeometry(2.21, 2.21, 2.21));
  }, []);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.6}>
      <group ref={meshRef}>
        {/* 6-Faced Cyber Tech Box */}
        <mesh material={materials}>
          <boxGeometry args={[2.2, 2.2, 2.2]} />
        </mesh>

        {/* Outer Neon Glow Edges */}
        <lineSegments geometry={edgesGeometry}>
          <lineBasicMaterial color="#00f0ff" linewidth={2} />
        </lineSegments>

        {/* Inner Glowing Spinning Purple Core */}
        <mesh ref={coreRef}>
          <octahedronGeometry args={[0.9, 0]} />
          <meshBasicMaterial color="#8b5cf6" wireframe />
        </mesh>
      </group>
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
              <Canvas
                camera={{ position: [0, 0, 4.5] }}
                dpr={[1, 1.5]}
                gl={{ powerPreference: 'high-performance', antialias: true, alpha: false }}
                style={{ width: '100%', height: '100%', background: '#070d1a' }}
              >
                <color attach="background" args={['#070d1a']} />
                <ambientLight intensity={0.7} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f0ff" />
                <pointLight position={[-10, -10, -10]} intensity={1.2} color="#8b5cf6" />
                <Suspense fallback={null}>
                  <TechCube />
                </Suspense>
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} />
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
