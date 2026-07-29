import React from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, BookOpen, Code } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundManager } from '../utils/audio';
import styles from './GithubSection.module.css';

const repos = [
  {
    name: 'Suraksha-Setu',
    description: 'AI Tourist Safety Platform with Emergency SOS, live safe route guidance, QR Tourist ID, & command center.',
    stars: 8,
    forks: 3,
    language: 'TypeScript',
    url: 'https://github.com/subham-khandual/Suraksha-Setu',
  },
  {
    name: 'swasthyasetu',
    description: 'Comprehensive healthcare platform featuring Susri Healthcare Chatbot, doctor booking, & blood availability tracking.',
    stars: 6,
    forks: 2,
    language: 'JavaScript',
    url: 'https://github.com/subham-khandual/swasthyasetu',
  },
  {
    name: 'ppt-generator',
    description: 'Intelligent AI presentation platform generating custom PowerPoint slides powered by Groq & Gemini AI.',
    stars: 7,
    forks: 2,
    language: 'Python',
    url: 'https://github.com/subham-khandual/ppt-generator',
  },
  {
    name: 'sayraa-health-care-ai-assistant',
    description: 'Multilingual voice-enabled healthcare assistant built with React and Groq LLM, providing accessible medical guidance in Odia, Hindi, and English.',
    stars: 5,
    forks: 1,
    language: 'JavaScript',
    url: 'https://github.com/subham-khandual/sayraa-health-care-ai-assistant',
  },
];

const GithubSection = () => {
  const { soundEnabled } = usePortfolio();

  return (
    <section id="github" className={styles.githubSection}>
      <div className="container">
        {/* GitHub Stats Card */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3.5rem' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`${styles.statBannerCard} glass-card`}
            style={{ maxWidth: '600px', width: '100%' }}
          >
            <img
              src="https://github-readme-stats.vercel.app/api?username=subham-khandual&show_icons=true&theme=dark&bg_color=0b0f19&title_color=00f0ff&icon_color=8b5cf6&text_color=d1d5db&border_color=00f0ff33"
              alt="Subham's GitHub Stats"
              className={styles.bannerImg}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </motion.div>
        </div>

        {/* Top Repositories Grid */}
        <h3 className={styles.subTitle}>Top Open Source Repositories</h3>
        <div className={styles.reposGrid}>
          {repos.map((repo, idx) => (
            <motion.a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className={`${styles.repoCard} glass-card`}
              onMouseEnter={() => {
                if (soundEnabled) soundManager.playHoverSound();
              }}
            >
              <div className={styles.repoHeader}>
                <BookOpen size={18} color="#00f0ff" />
                <h4 className={styles.repoName}>{repo.name}</h4>
              </div>
              <p className={styles.repoDesc}>{repo.description}</p>
              <div className={styles.repoMeta}>
                <span className={styles.metaBadge}>
                  <Code size={14} /> {repo.language}
                </span>
                <span className={styles.metaBadge}>
                  <Star size={14} color="#f59e0b" /> {repo.stars}
                </span>
                <span className={styles.metaBadge}>
                  <GitFork size={14} color="#8b5cf6" /> {repo.forks}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GithubSection;
