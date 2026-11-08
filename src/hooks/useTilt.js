import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const getDeviceType = () => {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

export function useDeviceType() {
  // Lazy initializer reads the viewport during render so the effect only
  // subscribes to changes (no synchronous setState in the effect body).
  const [device, setDevice] = useState(getDeviceType);

  useEffect(() => {
    const handleResize = () => {
      setDevice(getDeviceType());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return device;
}

export function usePrefersReducedMotion() {
  // Lazy initializer so the effect below only subscribes to changes.
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

export function useTilt(options = {}) {
  const { maxTilt = 18 } = options;
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Normalize coordinates (-0.5 to 0.5 center at 0)
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [0, 1], [maxTilt, -maxTilt]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-maxTilt, maxTilt]), springConfig);

  // Spotlight coordinates (0 to 100)
  const mouseXPercent = useSpring(useTransform(x, [0, 1], [0, 100]), springConfig);
  const mouseYPercent = useSpring(useTransform(y, [0, 1], [0, 100]), springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Mouse coordinates relative to card bounds
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Normalize coordinates to [0, 1]
    const normalizedX = mouseX / width;
    const normalizedY = mouseY / height;

    x.set(normalizedX);
    y.set(normalizedY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smoothly animate back to center
    x.set(0.5);
    y.set(0.5);
  };

  return {
    ref,
    x,
    y,
    rotateX,
    rotateY,
    mouseXPercent,
    mouseYPercent,
    isHovered,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  };
}
