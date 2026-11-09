import React, { useEffect, useRef, useState } from 'react';

/**
 * Lightweight boot overlay.
 *
 * Performance notes (Lighthouse):
 * - No `setInterval` progress ticker (the previous version re-rendered every 40 ms).
 * - No JS-driven infinite rotation: the ring spin is a compositor friendly CSS animation.
 * - Dismisses on `window.load` (with a safety timeout) so it never blocks the page.
 * - `aria-hidden` because it is purely decorative.
 */
const LoadingScreen = () => {
  const [progress, setProgress] = useState(10);
  const [fading, setFading] = useState(false);
  const [hidden, setHidden] = useState(false);
  const dismissed = useRef(false);

  useEffect(() => {
    const timers = [34, 68, 100].map((value, i) =>
      setTimeout(() => setProgress(value), 45 * (i + 1))
    );

    const dismiss = () => {
      if (dismissed.current) return;
      dismissed.current = true;
      setProgress(100);
      setFading(true);
      timers.push(setTimeout(() => setHidden(true), 240));
    };

    if (document.readyState === 'complete') {
      timers.push(setTimeout(dismiss, 60));
    } else {
      window.addEventListener('load', () => setTimeout(dismiss, 60), { once: true });
    }

    // Safety valve: never keep the overlay on screen longer than ~380ms.
    const safety = setTimeout(dismiss, 380);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(safety);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#030712',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', -apple-system, sans-serif",
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.24s ease',
        pointerEvents: fading ? 'none' : 'auto',
        willChange: 'opacity',
      }}
    >
      {/* Glowing Ring (CSS spin keeps it off the main thread) */}
      <div className="loader-ring" style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '2rem' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
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

      <div style={{ textAlign: 'center' }}>
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
      </div>

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
            transition: 'width 0.25s ease',
          }}
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
