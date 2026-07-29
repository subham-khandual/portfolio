import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, Award, Eye, X } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundManager } from '../utils/audio';
import styles from './Certificates.module.css';

const certificatesData = [
  {
    id: 1,
    title: 'Artificial Intelligence & Machine Learning',
    org: 'Central Tool Room & Training Centre (CTTC), Bhubaneswar',
    date: '2025',
    image: 'https://drive.google.com/thumbnail?id=1S1H5dVqldlJWOVjcBYHotxZfsXd_jIak&sz=w1000',
    link: 'https://drive.google.com/file/d/1S1H5dVqldlJWOVjcBYHotxZfsXd_jIak/view?usp=sharing'
  },
  {
    id: 2,
    title: 'Core Java Application Development',
    org: 'Central Tool Room & Training Centre (CTTC), Bhubaneswar',
    date: '2024',
    image: 'https://drive.google.com/thumbnail?id=1iROJnRaemmaoR6Hs9LDEW-kcuGk_X2Od&sz=w1000',
    link: 'https://drive.google.com/file/d/1iROJnRaemmaoR6Hs9LDEW-kcuGk_X2Od/view?usp=sharing'
  },
  {
    id: 3,
    title: 'Programming in Java',
    org: 'NPTEL (IIT Kharagpur) - Score: 55%',
    date: '2024',
    image: '/java-certificate.png',
    link: 'https://drive.google.com/file/d/1bHwePdthZxv-TLBczLNetwMqFLSoQJQx/view?usp=sharing'
  },
  {
    id: 4,
    title: 'Industry 4.0 & Industrial Internet of Things',
    org: 'NPTEL (IIT Kharagpur) - Score: 67%',
    date: '2025',
    image: '/iiot.png',
    link: 'https://drive.google.com/file/d/1_0UBUT9-EZlX2F_JgBuF-_eSvMaS0uOQ/view?usp=sharing'
  },
  {
    id: 5,
    title: 'Privacy and Security in Online Social Media',
    org: 'NPTEL (IIIT Hyderabad) - Score: 54%',
    date: '2025',
    image: '/privacy.png',
    link: 'https://drive.google.com/file/d/1h5TgH-huiZN7Hr_x95uaiidFim28wSgz/view?usp=sharing'
  }
];

const Certificates = () => {
  const { soundEnabled } = usePortfolio();
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [previewCert, setPreviewCert] = useState(null);
  const timerRef = useRef(null);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % certificatesData.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + certificatesData.length) % certificatesData.length);
  };

  useEffect(() => {
    if (!isHovered && !previewCert) {
      timerRef.current = setInterval(nextSlide, 3500);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isHovered, previewCert]);

  return (
    <section id="certificates" className={styles.certSection}>
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.header}
        >
          <h2 className="section-title">
            3D Interactive <span className="text-gradient">Certifications Gallery</span>
          </h2>
          <p className="section-subtitle">
            A verified carousel of academic credentials, NPTEL scores, and CTTC technical certifications.
          </p>
        </motion.div>

        {/* Carousel Stage */}
        <div
          className={styles.carouselContainer}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={styles.carouselStage}>
            {certificatesData.map((cert, i) => {
              let offset = (i - index + certificatesData.length) % certificatesData.length;
              if (offset > certificatesData.length / 2) offset -= certificatesData.length;

              const isActive = offset === 0;
              const absOffset = Math.abs(offset);

              if (absOffset > 2) return null;

              return (
                <motion.div
                  key={cert.id}
                  className={`${styles.card} glass-card`}
                  initial={false}
                  animate={{
                    x: offset * 260,
                    scale: 1 - absOffset * 0.18,
                    zIndex: 10 - absOffset,
                    opacity: 1 - absOffset * 0.3,
                    rotateY: offset * -25,
                    filter: `blur(${absOffset * 1.5}px)`,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  onClick={() => {
                    if (isActive) {
                      if (soundEnabled) soundManager.playClickSound();
                      setPreviewCert(cert);
                    }
                  }}
                >
                  <div className={styles.cardImageWrapper}>
                    <Award size={48} className={styles.placeholderIcon} />
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className={styles.certImage}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.target.style.opacity = '0';
                      }}
                    />
                    <div className={styles.imageHoverOverlay}>
                      <Eye size={24} color="#00f0ff" />
                      <span>Click to Zoom</span>
                    </div>
                  </div>

                  <div className={styles.cardContent}>
                    <h3 className={styles.title}>{cert.title}</h3>
                    <p className={styles.org}>{cert.org}</p>
                    <span className="badge" style={{ marginTop: '0.5rem' }}>{cert.date}</span>
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`btn btn-primary ${styles.viewBtn}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Credential <ExternalLink size={14} />
                    </a>
                  </div>
                  {isActive && <div className={styles.activeGlow} />}
                </motion.div>
              );
            })}
          </div>

          {/* Nav Controls */}
          <button
            className={styles.navBtnLeft}
            onClick={() => {
              if (soundEnabled) soundManager.playClickSound();
              prevSlide();
            }}
            aria-label="Previous Certificate"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className={styles.navBtnRight}
            onClick={() => {
              if (soundEnabled) soundManager.playClickSound();
              nextSlide();
            }}
            aria-label="Next Certificate"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Indicators */}
        <div className={styles.indicators}>
          {certificatesData.map((_, i) => (
            <button
              key={i}
              className={`${styles.indicator} ${i === index ? styles.activeIndicator : ''}`}
              onClick={() => {
                if (soundEnabled) soundManager.playClickSound();
                setIndex(i);
              }}
            />
          ))}
        </div>
      </div>

      {/* Certificate Zoom Lightbox */}
      <AnimatePresence>
        {previewCert && (
          <div className={styles.lightboxOverlay} onClick={() => setPreviewCert(null)}>
            <motion.div
              className={`${styles.lightboxContent} glass`}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.closeLightbox} onClick={() => setPreviewCert(null)}>
                <X size={20} />
              </button>
              <img
                src={previewCert.image}
                alt={previewCert.title}
                className={styles.lightboxImg}
                referrerPolicy="no-referrer"
              />
              <div className={styles.lightboxDetails}>
                <h4>{previewCert.title}</h4>
                <p>{previewCert.org} - {previewCert.date}</p>
                <a
                  href={previewCert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ marginTop: '0.75rem' }}
                >
                  Open Official Credential Link <ExternalLink size={16} />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certificates;
