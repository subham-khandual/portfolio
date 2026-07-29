import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Terminal, MessageSquare, Download, Sun, Moon, Volume2, VolumeX, Sparkles, FolderGit2, X } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundManager } from '../utils/audio';

const CommandPalette = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    theme,
    toggleTheme,
    soundEnabled,
    setSoundEnabled,
    setIsTerminalOpen,
    setIsChatbotOpen
  } = usePortfolio();

  const [query, setQuery] = useState('');

  if (!isCommandPaletteOpen) return null;

  const actions = [
    {
      id: 'projects',
      label: 'Navigate to Projects',
      icon: <FolderGit2 size={18} />,
      perform: () => {
        const el = document.getElementById('projects');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'about',
      label: 'Navigate to About Me',
      icon: <Sparkles size={18} />,
      perform: () => {
        const el = document.getElementById('about');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'skills',
      label: 'View 3D Skills Sphere',
      icon: <Sparkles size={18} />,
      perform: () => {
        const el = document.getElementById('skills');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'contact',
      label: 'Get in Touch (Contact)',
      icon: <MessageSquare size={18} />,
      perform: () => {
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'terminal',
      label: 'Launch Interactive Terminal',
      icon: <Terminal size={18} />,
      perform: () => {
        setIsTerminalOpen(true);
      }
    },
    {
      id: 'chatbot',
      label: 'Ask Subham AI Assistant',
      icon: <MessageSquare size={18} />,
      perform: () => {
        setIsChatbotOpen(true);
      }
    },
    {
      id: 'resume',
      label: 'Download Resume PDF',
      icon: <Download size={18} />,
      perform: () => {
        window.open('/resume.pdf', '_blank');
      }
    }
  ];

  const filtered = actions.filter((act) =>
    act.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (action) => {
    if (soundEnabled) soundManager.playClickSound();
    action.perform();
    setIsCommandPaletteOpen(false);
    setQuery('');
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(3, 7, 18, 0.8)',
          backdropFilter: 'blur(12px)',
          zIndex: 999999,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '15vh',
        }}
        onClick={() => setIsCommandPaletteOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          style={{
            width: '90%',
            maxWidth: '640px',
            backgroundColor: '#0b0f19',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: '1.25rem',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0, 240, 255, 0.25)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1rem 1.25rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              gap: '0.75rem',
            }}
          >
            <Search size={20} color="#00f0ff" />
            <input
              type="text"
              autoFocus
              placeholder="Type a command or search section (Ctrl+K)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#f9fafb',
                fontSize: '1rem',
                fontFamily: "'Outfit', sans-serif",
              }}
            />
            <button
              onClick={() => setIsCommandPaletteOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Action List */}
          <div style={{ maxHeight: '350px', overflowY: 'auto', padding: '0.5rem' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
                No command found for "{query}"
              </div>
            ) : (
              filtered.map((action) => (
                <div
                  key={action.id}
                  onClick={() => handleSelect(action)}
                  onMouseEnter={() => {
                    if (soundEnabled) soundManager.playHoverSound();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '0.85rem 1rem',
                    borderRadius: '0.75rem',
                    color: '#e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 240, 255, 0.12)';
                    e.currentTarget.style.color = '#00f0ff';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#e5e7eb';
                  }}
                >
                  <span style={{ color: '#00f0ff', display: 'flex', alignItems: 'center' }}>
                    {action.icon}
                  </span>
                  <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{action.label}</span>
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          <div
            style={{
              padding: '0.65rem 1.25rem',
              backgroundColor: '#030712',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              fontSize: '0.8rem',
              color: '#6b7280',
            }}
          >
            <span>Subham Khandual Portfolio Command Center</span>
            <span>ESC to close</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CommandPalette;
