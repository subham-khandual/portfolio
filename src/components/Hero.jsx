import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { ArrowRight, Download, Github, Linkedin, Mail, MessageCircle, Instagram, ChevronDown } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundManager } from '../utils/audio';
import styles from './Hero.module.css';

const titles = [
  'Full Stack MERN Developer',
  'AI & ML Specialist',
  'Software Engineer',
  'Creative Problem Solver',
];

const HeroArtwork = () => (
  <div className={styles.heroArtwork} aria-label="Developer illustration">
    <div className={`${styles.floatCard} ${styles.cardAi}`}>
      <span>AI</span>
      <small>ML</small>
    </div>
    <div className={`${styles.floatCard} ${styles.cardReact}`}>
      <span>React</span>
    </div>
    <div className={`${styles.floatCard} ${styles.cardJs}`}>JS</div>
    <div className={`${styles.floatCard} ${styles.cardNode}`}>
      <span>node</span>
    </div>

    <div className={styles.laptopWrap}>
      <div className={styles.laptopScreen}>
        <div className={styles.displayCode}>
          <span className={styles.line}><span className={styles.pink}>&lt;h1&gt;</span> Build. Secure. <span className={styles.cyan}>/</span> ideas <span className={styles.pink}>&lt;/h1&gt;</span>
          <span className={styles.line}><span className={styles.cyan}>const</span> <span className={styles.yellow}>developer</span> = <span className={styles.orange}>{`{`}</span></span>
          <span className={styles.line}>  focus: <span className={styles.green}'security'</span>,</span>
          <span className={styles.line}>  passion: <span className={styles.green}'clean code'</span>,</span>
          <span className={styles.line}>  build: <span className={styles.green}'impact'</span></span>
          <span className={styles.line}><span className={styles.orange}>{`}`}</span>;</span>
        </div>
      </div>
      <div className={styles.laptopBase} />
      <div className={styles.keyboard} />
    </div>

    <div className={styles.plantWrap}>
      <div className={styles.plantLeaves}>
        <span className={styles.leaf} />
        <span className={styles.leaf} />
        <span className={styles.leaf} />
        <span className={styles.leaf} />
      </div>
      <div className={styles.pot} />
    </div>

    <div className={styles.mugWrap}>
      <div className={styles.mugHandle} />
      <div className={styles.mugBody} />
      <div className={styles.mugLogo}>&lt;/&gt;</div>
    </div>

    <div className={styles.noteCard}>
      <div className={styles.noteCheck}><span>✓</span></div>
      <div className={styles.noteText}>Build Create Grow</div>
    </div>
  </div>
);

const Hero = () => {
  const { soundEnabled } = usePortfolio();
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      setMousePos({
        x: (e.clientX / innerWidth - 0.5) * 30,
        y: (e.clientY / innerHeight - 0.5) * 30,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleTyping = () => {
      const current = titles[textIndex];
      if (!isDeleting) {
        setDisplayText(current.substring(0, displayText.length + 1));
        if (displayText === current) {
          setTimeout(() => setIsDeleting(true), 1800);
          setTypingSpeed(50);
        }
      } else {
        setDisplayText(current.substring(0, displayText.length - 1));
        if (displayText === '') {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % titles.length);
          setTypingSpeed(100);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, textIndex, typingSpeed]);

  return (
    <section id="home" className={styles.heroSection}>
      <div className={styles.canvasBackground}>
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 1.25]} performance={{ min: 0.5 }} gl={{ powerPreference: 'high-performance', antialias: false }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f0ff" />
          <Stars radius={100} depth={50} count={1200} factor={3.5} saturation={0} fade speed={1} />
        </Canvas>
      </div>

      <div className={styles.glowBlob1} />
      <div className={styles.glowBlob2} />

      <div className={`container ${styles.heroContainer}`}>
        <motion.div
          className={styles.textContent}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          style={{ transform: `translate3d(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px, 0)` }}
        >
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Hi, I'm <span className="text-gradient">Subham Khandual</span> <br />
            <span className={styles.typedContainer}>
              I am a <span className={styles.typedText}>{displayText}</span>
              <span className={styles.cursor}>|</span>
            </span>
          </motion.h1>

          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Final-year CS Student & Full-Stack Developer passionate about AI-driven innovation,
            building 60 FPS high-performance web applications, and delivering world-class digital experiences.
          </motion.p>

          <motion.div
            className={styles.actionBtns}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <a href="#projects" className="btn btn-primary" onMouseEnter={() => soundEnabled && soundManager.playHoverSound()} onClick={() => soundEnabled && soundManager.playClickSound()}>
              Explore Projects <ArrowRight size={18} />
            </a>
            <a href="#contact" className="btn btn-outline" onMouseEnter={() => soundEnabled && soundManager.playHoverSound()} onClick={() => soundEnabled && soundManager.playClickSound()}>
              Get In Touch
            </a>
            <a href="/latest_resume.pdf" target="_blank" rel="noreferrer" className="btn btn-outline" onMouseEnter={() => soundEnabled && soundManager.playHoverSound()}>
              Resume PDF <Download size={18} />
            </a>
          </motion.div>

          <motion.div className={styles.socials} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <a href="https://github.com/subham-khandual" target="_blank" rel="noreferrer me" aria-label="Subham's GitHub Profile" className={styles.socialIcon} onMouseEnter={() => soundEnabled && soundManager.playHoverSound()}>
              <Github size={20} />
            </a>
            <a href="https://www.linkedin.com/in/subham-khandual/" target="_blank" rel="noreferrer me" aria-label="Subham's LinkedIn Profile" className={styles.socialIcon} onMouseEnter={() => soundEnabled && soundManager.playHoverSound()}>
              <Linkedin size={20} />
            </a>
            <a href="mailto:subhamkhandual215@gmail.com" aria-label="Send Email to Subham" className={styles.socialIcon} onMouseEnter={() => soundEnabled && soundManager.playHoverSound()}>
              <Mail size={20} />
            </a>
            <a href="https://wa.me/917894047169" target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className={styles.socialIcon} onMouseEnter={() => soundEnabled && soundManager.playHoverSound()}>
              <MessageCircle size={20} />
            </a>
            <a href="https://www.instagram.com/mr_subham7.0?igsh=MTFud3JibGhqbGw4bQ==" target="_blank" rel="noreferrer me" aria-label="Subham's Instagram Profile" className={styles.socialIcon} onMouseEnter={() => soundEnabled && soundManager.playHoverSound()}>
              <Instagram size={20} />
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.hologramContent}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ transform: `translate3d(${mousePos.x * -0.4}px, ${mousePos.y * -0.4}px, 0)` }}
        >
          <HeroArtwork />
        </motion.div>
      </div>

      <a href="#about" className={styles.scrollIndicator} aria-label="Scroll Down">
        <span className={styles.scrollText}>Scroll Down</span>
        <ChevronDown size={20} className={styles.scrollIcon} />
      </a>
    </section>
  );
};

export default Hero;
