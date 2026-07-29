import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false);
            if (onFinish) onFinish();
          }, 300);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 4;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -100, transition: { duration: 0.8, ease: 'easeInOut' } }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#030712',
            zIndex: 999999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          {/* Glowing Ring */}
          <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '2rem' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '3px solid transparent',
                borderTopColor: '#00f0ff',
                borderRightColor: '#8b5cf6',
                boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00f0ff',
                fontWeight: 'bold',
                fontSize: '1.25rem',
                fontFamily: "'Fira Code', monospace",
              }}
            >
              {progress}%
            </div>
          </div>

          {/* Subham Khandual Hologram branding */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center' }}
          >
            <h2
              style={{
                fontSize: '1.75rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #00f0ff, #8b5cf6, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '2px',
                marginBottom: '0.5rem',
              }}
            >
              SUBHAM KHANDUAL
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', letterSpacing: '3px' }}>
              INITIALIZING PORTFOLIO 3D...
            </p>
          </motion.div>

          {/* Bottom Progress Bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '4px',
              backgroundColor: 'rgba(255,255,255,0.05)',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(to right, #00f0ff, #8b5cf6)',
                transition: 'width 0.1s ease',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
