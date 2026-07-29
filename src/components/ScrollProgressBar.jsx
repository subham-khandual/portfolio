import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ScrollProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(to right, #00f0ff, #8b5cf6, #ec4899)',
        scaleX: scrollProgress / 100,
        transformOrigin: '0%',
        zIndex: 10000,
        boxShadow: '0 0 10px #00f0ff, 0 0 15px #8b5cf6',
      }}
    />
  );
};

export default ScrollProgressBar;
