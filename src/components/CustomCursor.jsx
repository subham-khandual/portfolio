import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Use motion values to prevent React re-renders on every mousemove event
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  const dotX = useSpring(rawX, { stiffness: 1200, damping: 50, mass: 0.1 });
  const dotY = useSpring(rawY, { stiffness: 1200, damping: 50, mass: 0.1 });

  const ringX = useSpring(rawX, { stiffness: 300, damping: 28, mass: 0.2 });
  const ringY = useSpring(rawY, { stiffness: 300, damping: 28, mass: 0.2 });

  useEffect(() => {
    // Only show custom cursor on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    setIsVisible(true);

    const onMouseMove = (e) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };

    const onMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.getAttribute('role') === 'button'
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, [rawX, rawY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Inner Dot */}
      <motion.div
        className="custom-cursor-dot"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#00f0ff',
          pointerEvents: 'none',
          zIndex: 99999,
          boxShadow: '0 0 10px #00f0ff',
          transformOrigin: 'center center',
        }}
        animate={{
          scale: isHovered ? 2.2 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      />

      {/* Outer Ring */}
      <motion.div
        className="custom-cursor-ring"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '1.5px solid rgba(0, 240, 255, 0.4)',
          pointerEvents: 'none',
          zIndex: 99998,
          transformOrigin: 'center center',
        }}
        animate={{
          scale: isHovered ? 1.4 : 1,
          borderColor: isHovered ? '#8b5cf6' : 'rgba(0, 240, 255, 0.4)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      />
    </>
  );
};

export default React.memo(CustomCursor);

