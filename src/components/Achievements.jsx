import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { FolderGit2, GitBranch, Award, Trophy, Code2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundManager } from '../utils/audio';
import styles from './Achievements.module.css';

const statsData = [
  {
    id: 'projects',
    title: 'Projects Completed',
    target: 15,
    suffix: '+',
    icon: <FolderGit2 size={26} />,
    color: '#00f0ff',
  },
  {
    id: 'repos',
    title: 'GitHub Repositories',
    target: 25,
    suffix: '+',
    icon: <GitBranch size={26} />,
    color: '#8b5cf6',
  },
  {
    id: 'certifications',
    title: 'Certifications',
    target: 5,
    suffix: '+',
    icon: <Award size={26} />,
    color: '#ec4899',
  },
  {
    id: 'hackathons',
    title: 'Hackathons & Contests',
    target: 10,
    suffix: '+',
    icon: <Trophy size={26} />,
    color: '#f59e0b',
  },
  {
    id: 'problems',
    title: 'Coding Problems Solved',
    target: 500,
    suffix: '+',
    icon: <Code2 size={26} />,
    color: '#10b981',
  },
];

function CountUpCard({ stat }) {
  const { soundEnabled } = usePortfolio();
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000; // 2 sec
      const stepTime = Math.abs(Math.floor(duration / stat.target));

      const timer = setInterval(() => {
        start += Math.ceil(stat.target / 40);
        if (start >= stat.target) {
          setCount(stat.target);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, Math.max(stepTime, 30));

      return () => clearInterval(timer);
    }
  }, [isInView, stat.target]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`${styles.statCard} glass-card`}
      onMouseEnter={() => {
        if (soundEnabled) soundManager.playHoverSound();
      }}
    >
      <div
        className={styles.iconCircle}
        style={{
          backgroundColor: `rgba(${parseInt(stat.color.slice(1, 3), 16)}, ${parseInt(stat.color.slice(3, 5), 16)}, ${parseInt(stat.color.slice(5, 7), 16)}, 0.15)`,
          borderColor: stat.color,
          color: stat.color,
        }}
      >
        {stat.icon}
      </div>

      <div className={styles.countText} style={{ color: stat.color }}>
        {count}
        {stat.suffix}
      </div>

      <div className={styles.statTitle}>{stat.title}</div>
    </motion.div>
  );
}

const Achievements = () => {
  return (
    <section id="achievements" className={styles.achievementsSection}>
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className={styles.header}
        >
          <h2 className="section-title">
            Key <span className="text-gradient">Achievements & Metrics</span>
          </h2>
          <p className="section-subtitle">
            Quantitative milestones reflecting consistent practice, open-source building, and continuous learning.
          </p>
        </motion.div>

        {/* Counter Grid */}
        <div className={styles.statsGrid}>
          {statsData.map((stat) => (
            <CountUpCard key={stat.id} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
