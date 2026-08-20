import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Minimize2, Maximize2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { usePortfolio } from '../context/PortfolioContext';
import { soundManager } from '../utils/audio';

const TerminalModal = () => {
  const { isTerminalOpen, setIsTerminalOpen, toggleTheme, soundEnabled } = usePortfolio();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { text: 'Subham OS [Version 10.0.2027] - Subham Khandual Interactive Terminal', type: 'system' },
    { text: 'Type "help" to view available terminal commands.', type: 'info' },
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  if (!isTerminalOpen) return null;

  const handleCommand = (e) => {
    e.preventDefault();
    const rawInput = input.trim();
    if (!rawInput) return;

    const cmd = rawInput.toLowerCase();

    if (soundEnabled) soundManager.playClickSound();

    const newHistory = [...history, { text: `visitor@subham-portfolio:~$ ${rawInput}`, type: 'user' }];

    // Smart keyword matching for natural queries
    let resolvedCmd = cmd;
    if (cmd.includes('help') || cmd.includes('command')) {
      resolvedCmd = 'help';
    } else if (cmd.includes('about') || cmd.includes('who') || cmd.includes('bio') || cmd.includes('studies') || cmd.includes('student') || cmd.includes('education')) {
      resolvedCmd = 'about';
    } else if (cmd.includes('skill') || cmd.includes('stack') || cmd.includes('tech') || cmd.includes('language') || cmd.includes('program')) {
      resolvedCmd = 'skills';
    } else if (cmd.includes('project') || cmd.includes('work') || cmd.includes('build') || cmd.includes('app')) {
      resolvedCmd = 'projects';
    } else if (cmd.includes('contact') || cmd.includes('email') || cmd.includes('reach') || cmd.includes('social') || cmd.includes('linkedin') || cmd.includes('github') || cmd.includes('address') || cmd.includes('phone') || cmd.includes('whatsapp') || cmd.includes('mail')) {
      resolvedCmd = 'contact';
    } else if (cmd.includes('hire') || cmd.includes('recruit') || cmd.includes('job')) {
      resolvedCmd = 'sudo hire';
    } else if (cmd.includes('theme') || cmd.includes('mode') || cmd.includes('dark') || cmd.includes('light')) {
      resolvedCmd = 'theme';
    } else if (cmd.includes('hi') || cmd.includes('hello') || cmd.includes('hey') || cmd.includes('hlw') || cmd.includes('hii')) {
      resolvedCmd = 'hi';
    } else if (cmd.includes('subham')) {
      resolvedCmd = 'subham';
    }

    switch (resolvedCmd) {
      case 'help':
        newHistory.push({
          text: `Available commands:\n  help        - Show available commands\n  about       - Subham's background & Bio\n  skills      - Full tech stack breakdown\n  projects    - Highlighted AI & Web projects\n  contact     - Email & Social profiles\n  clear       - Clear terminal output\n  sudo hire   - Recruit Subham! 🎉\n  theme       - Show current active theme\n  exit        - Close terminal`,
          type: 'response',
        });
        break;

      case 'hi':
        newHistory.push({
          text: `👋 Hello there! Welcome to Subham's interactive terminal.\nType "help" to see a list of valid commands.`,
          type: 'response',
        });
        break;

      case 'subham':
        newHistory.push({
          text: `😎 Yes, Subham is the creator of this portfolio website! Glad you're here.\nTry running "about" or "sudo hire" to see more details.`,
          type: 'response',
        });
        break;

      case 'about':
        newHistory.push({
          text: `Subham Khandual is a final-year B.Tech CS student at GIFT Autonomous, Bhubaneswar.\nSpecializes in Full-Stack Web Development (MERN), AI/ML integration, and scalable software architecture.`,
          type: 'response',
        });
        break;

      case 'skills':
        newHistory.push({
          text: `Frontend: React, JavaScript, HTML5, CSS3, Tailwind CSS, Vite, Three.js\nBackend: Node.js, Express.js, REST APIs, Python, Flask\nDatabase: MongoDB, MySQL\nLanguages: Java, Python, C, JavaScript\nTools: Git, GitHub, Firebase, VS Code, Postman`,
          type: 'response',
        });
        break;

      case 'projects':
        newHistory.push({
          text: `Featured Projects:\n1. Suraksha Setu - AI Smart Tourist Safety Platform\n2. Swasthya Setu - Comprehensive Healthcare Platform\n3. Sayraa AI PPT Generator - Automated AI Presentation Platform\n4. Sayraa AI Health Care Assistant - Multilingual Voice AI Health Companion`,
          type: 'response',
        });
        break;

      case 'contact':
        newHistory.push({
          text: `Email: subhamkhandual215@gmail.com\nPhone / WhatsApp: +91 7894047169\nLinkedIn: linkedin.com/in/subham-khandual/\nGitHub: github.com/subham-khandual\nLocation: Bhubaneswar, Odisha, India`,
          type: 'response',
        });
        break;

      case 'sudo hire':
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
        if (soundEnabled) soundManager.playSuccessSound();
        newHistory.push({
          text: `🚀 ACCESS GRANTED! Thank you for considering Subham Khandual! Please reach out directly via subhamkhandual215@gmail.com to discuss full-time roles or projects!`,
          type: 'success',
        });
        break;

      case 'theme':
        newHistory.push({ text: `Theme: Dark Mode (Locked for cyber-visual aesthetics & AI engine performance).`, type: 'response' });
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'exit':
        setIsTerminalOpen(false);
        return;

      default:
        newHistory.push({
          text: `Command not found: "${rawInput}".\n💡 Tip: Try typing keywords like "skills", "projects", "about", "contact", or "help".\n🤖 Or use our AI Assistant Chatbot (message icon in top-right) for full natural chat responses!`,
          type: 'error',
        });
        break;
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(3, 7, 18, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}
        onClick={() => setIsTerminalOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          style={{
            width: '100%',
            maxWidth: '750px',
            height: '480px',
            backgroundColor: '#050b14',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: '1rem',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 0 35px rgba(0, 240, 255, 0.25)',
            fontFamily: "'Fira Code', monospace",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Terminal Title Bar */}
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#0b1329',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              <span style={{ fontSize: '0.85rem', color: '#00f0ff', marginLeft: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Terminal size={14} /> visitor@subham-portfolio:~
              </span>
            </div>
            <button
              onClick={() => setIsTerminalOpen(false)}
              style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Terminal Body */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', fontSize: '0.9rem', lineHeight: '1.6' }}>
            {history.map((item, idx) => (
              <div key={idx} style={{ marginBottom: '0.5rem', whiteSpace: 'pre-wrap' }}>
                {item.type === 'user' && <span style={{ color: '#00f0ff' }}>{item.text}</span>}
                {item.type === 'system' && <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>{item.text}</span>}
                {item.type === 'info' && <span style={{ color: '#9ca3af' }}>{item.text}</span>}
                {item.type === 'response' && <span style={{ color: '#d1d5db' }}>{item.text}</span>}
                {item.type === 'success' && <span style={{ color: '#10b981', fontWeight: 'bold' }}>{item.text}</span>}
                {item.type === 'error' && <span style={{ color: '#ef4444' }}>{item.text}</span>}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Command Prompt Form */}
          <form
            onSubmit={handleCommand}
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#0b1329',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span style={{ color: '#00f0ff', fontWeight: 'bold' }}>visitor@subham:~$</span>
            <input
              type="text"
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="type command..."
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontFamily: "'Fira Code', monospace",
                fontSize: '0.9rem',
              }}
            />
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TerminalModal;
