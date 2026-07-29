import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Trophy, Rocket, CheckCircle2, Award, Calendar } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundManager } from '../utils/audio';
import styles from './Experience.module.css';

const timelineEvents = [
  {
    type: 'internship',
    title: 'AI / ML Intern',
    organization: 'Central Tool Room & Training Centre (CTTC), Bhubaneswar',
    period: 'May 2025 – July 2025',
    icon: <Rocket size={20} />,
    color: '#00f0ff',
    details: [
      'Developed end-to-end Machine Learning pipelines using Python, Scikit-learn, and Pandas.',
      'Gained practical experience in data preprocessing, feature engineering, and model evaluation.',
      'Explored real-world computer vision & predictive analytics applications for healthcare and agriculture.',
      'Collaborated on innovative projects and learned industry-grade agile development workflows.'
    ]
  },
  {
    type: 'certification',
    title: 'NPTEL Academic Certifications',
    organization: 'IIT Kharagpur & IIIT Hyderabad',
    period: '2024 – 2025',
    icon: <Trophy size={20} />,
    color: '#8b5cf6',
    details: [
      'NPTEL Certification in Programming in Java - IIT Kharagpur (Score: 55%)',
      'NPTEL Certification in Industry 4.0 & IIoT - IIT Kharagpur (Score: 67%)',
      'NPTEL Certification in Privacy & Security in Social Media - IIIT Hyderabad (Score: 54%)'
    ]
  },
  {
    type: 'internship',
    title: 'Core Java Intern',
    organization: 'Central Tool Room & Training Centre (CTTC), Bhubaneswar',
    period: 'July 2024',
    icon: <Briefcase size={20} />,
    color: '#ec4899',
    details: [
      'Mastered Object-Oriented Programming (OOP) concepts, multi-threading, and exception handling in Java.',
      'Improved algorithmic problem-solving and debugging skills through practical Java tasks.',
      'Built console and desktop database applications connected via JDBC and MySQL.'
    ]
  }
];

const Experience = () => {
  const { soundEnabled } = usePortfolio();

  return (
    <section id="experience" className={styles.expSection}>
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className={styles.header}
        >
          <h2 className="section-title">
            Professional <span className="text-gradient">Experience & Journey</span>
          </h2>
          <p className="section-subtitle">
            An animated timeline documenting my technical internships, domain specialization, and academic certifications.
          </p>
        </motion.div>

        {/* Timeline Wrapper */}
        <div className={styles.timeline}>
          <div className={styles.timelineLine} />

          {timelineEvents.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className={`${styles.timelineItem} ${idx % 2 === 0 ? styles.leftItem : styles.rightItem}`}
            >
              {/* Icon Circle */}
              <div
                className={styles.iconCircle}
                style={{
                  backgroundColor: event.color,
                  boxShadow: `0 0 20px ${event.color}`,
                }}
              >
                {event.icon}
              </div>

              {/* Glass Card */}
              <div
                className={`${styles.eventCard} glass-card`}
                onMouseEnter={() => {
                  if (soundEnabled) soundManager.playHoverSound();
                }}
              >
                <div className={styles.cardTop}>
                  <span className={styles.periodBadge}>
                    <Calendar size={14} /> {event.period}
                  </span>
                  <span className={styles.typeBadge} style={{ borderColor: event.color, color: event.color }}>
                    {event.type.toUpperCase()}
                  </span>
                </div>

                <h3 className={styles.eventTitle}>{event.title}</h3>
                <h4 className={styles.eventOrg}>{event.organization}</h4>

                <ul className={styles.detailsList}>
                  {event.details.map((detail, dIdx) => (
                    <li key={dIdx}>
                      <CheckCircle2 size={16} color={event.color} style={{ minWidth: '16px' }} />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
