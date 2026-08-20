import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Sparkles, Minus } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundManager } from '../utils/audio';

// ── Groq API Config ─────────────────────────────────────────────────
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// ── Sayraa System Prompt ─────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Sayraa, the personal AI assistant for Subham Khandual's portfolio website. You are friendly, warm, smart, and professional.

Your ONLY job is to answer questions about Subham Khandual's portfolio — his projects, skills, education, experience, certifications, and contact details. Do NOT answer off-topic questions (weather, jokes, sports, general knowledge, math, etc.). For off-topic questions, politely explain you are a portfolio assistant and redirect the user.

LANGUAGE RULE (VERY IMPORTANT): Detect the language of the user's message and ALWAYS respond in the SAME language. Supported:
- English → respond in English
- Hinglish (Hindi + English mix) → respond in Hinglish
- Odia → respond in Odia
- Hindi → respond in Hindi
- Any other language → mirror that language

Keep responses concise (3–6 sentences max), warm, and helpful. Use emojis occasionally for personality.

━━━ SUBHAM KHANDUAL — COMPLETE PORTFOLIO DATA ━━━

👤 PERSONAL INFO
- Full Name: Subham Khandual
- Location: Bhubaneswar, Odisha, India
- Email: subhamkhandual215@gmail.com
- Phone: +91 7894047169
- WhatsApp: +91 7894047169 (wa.me/917894047169)
- LinkedIn: linkedin.com/in/subham-khandual
- GitHub: github.com/subham-khandual
- Instagram: @subham_khandual

🎓 EDUCATION
- Degree: B.Tech in Computer Science & Engineering
- College: GIFT Autonomous, Bhubaneswar
- Batch: 2023 – 2027 (ongoing)

🚀 PROJECTS (4 Major)
1. Suraksha Setu — AI Smart Tourist Safety Platform
   - Real-time safety alerts, emergency SOS, AI route planning for tourists
   - Tech: React, Node.js, Express, MongoDB, AI/ML, REST APIs

2. Swasthya Setu — Comprehensive Healthcare Hub
   - Doctor consultations, health tracking, appointment booking
   - Tech: React, Firebase, Node.js, Tailwind CSS

3. Sayraa AI PPT Generator — Automated Presentation Platform
   - AI-powered slide generation from text prompts
   - Tech: Python, React, AI APIs, Firebase

4. Sayraa AI Health Care Assistant — Multilingual Voice AI Companion
   - Voice-enabled health advice in multiple Indian languages
   - Tech: React, NLP, AI APIs, Firebase, Tailwind CSS

🛠️ SKILLS & TECH STACK
- Frontend: React.js, Tailwind CSS, Three.js, HTML5, CSS3, JavaScript
- Backend: Node.js, Express.js
- Databases: MongoDB, MySQL, Firebase Firestore
- Languages: Java, Python, C, JavaScript
- Tools & Platforms: Git, GitHub, REST APIs, Firebase, Vercel

💼 WORK EXPERIENCE
- CTTC Bhubaneswar — Core Java Developer Intern (July 2024)
- CTTC Bhubaneswar — AI & Machine Learning Developer Intern (May–July 2025)

🏆 CERTIFICATIONS
- CTTC: Artificial Intelligence & Machine Learning
- CTTC: Core Java Programming
- NPTEL: Java Programming — Score: 55%
- NPTEL: Industrial IoT (IIoT) — Score: 67%
- NPTEL: Social Media & Security — Score: 54%

🎯 GOALS
- Build software that impacts millions of users
- Combine elegant UI/UX with robust backend engineering and AI integration
- Journey started with Core Java & algorithms, evolved into full-stack AI platforms

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

// ── Fallback Rule-Based (if Groq API fails) ──────────────────────────
const getFallbackResponse = (q) => {
  if (q.includes('project') || q.includes('work') || q.includes('swasthya') || q.includes('suraksha') || q.includes('sayraa') || q.includes('suusri') || q.includes('health'))
    return "Subham has built 4 major projects: Suraksha Setu (AI Tourist Safety), Swasthya Setu (Healthcare Hub), Sayraa AI PPT Generator, and Sayraa AI Health Care Assistant! 🚀";
  if (q.includes('skill') || q.includes('stack') || q.includes('technology'))
    return "Subham's tech stack: React, Node.js, Express, MongoDB, Java, Python, Tailwind CSS, Three.js, Firebase, Git. 🛠️";
  if (q.includes('contact') || q.includes('email') || q.includes('hire'))
    return "Reach Subham at subhamkhandual215@gmail.com or connect on LinkedIn (linkedin.com/in/subham-khandual) and GitHub (github.com/subham-khandual). 📧";
  if (q.includes('who') || q.includes('about') || q.includes('bio'))
    return "Subham Khandual is a Full-Stack Developer & AI Enthusiast from Bhubaneswar, Odisha, pursuing B.Tech CSE (2023–2027) at GIFT Autonomous. 👨‍💻";
  return "I'm Sayraa, Subham's portfolio assistant! Ask me about his projects, skills, education, or contact info. 😊";
};

// ── Component ─────────────────────────────────────────────────────────
const AiChatbot = () => {
  const { isChatbotOpen, setIsChatbotOpen, soundEnabled } = usePortfolio();
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Namaste! 🙏 Mein hun Sayraa, Subham ki AI assistant. Mein aapki kya madad kar sakti hun? Aap mujhse Subham ke projects, skills, education ya contact ke baare mein pooch sakte hain — English, Hinglish ya Odia (ଓଡ଼ିଆ) mein!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isChatbotOpen) {
      setMessages([
        {
          sender: 'bot',
          text: "Namaste! 🙏 Mein hun Sayraa, Subham ki AI assistant. Mein aapki kya madad kar sakti hun? Aap mujhse Subham ke projects, skills, education ya contact ke baare mein pooch sakte hain — English, Hinglish ya Odia (ଓଡ଼ିଆ) mein!",
        },
      ]);
      setInput('');
      setIsTyping(false);
    }
  }, [isChatbotOpen]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Floating Launcher Button when chatbot is closed
  if (!isChatbotOpen) {
    return (
      <motion.button
        onClick={() => {
          if (soundEnabled) soundManager.playClickSound();
          setIsChatbotOpen(true);
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Open Sayraa AI Assistant"
        title="Chat with Sayraa AI"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          backgroundColor: '#0b0f19',
          border: '2px solid #00f0ff',
          boxShadow: '0 0 25px rgba(0, 240, 255, 0.45), 0 10px 30px rgba(0,0,0,0.6)',
          cursor: 'pointer',
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          overflow: 'hidden',
        }}
      >
        <img
          src="/chatbot_avatar.png"
          alt="Sayraa AI Avatar"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top center',
          }}
        />
        {/* Glowing online pulse indicator */}
        <span
          style={{
            position: 'absolute',
            bottom: '2px',
            right: '2px',
            width: '13px',
            height: '13px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            border: '2px solid #0b0f19',
            boxShadow: '0 0 8px #10b981',
          }}
        />
      </motion.button>
    );
  }

  // ── Groq API Call ──────────────────────────────────────────────────
  const callGroqAPI = async (userMessage, conversationHistory) => {
    const groqMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory
        .filter(m => m.sender !== 'bot' || conversationHistory.indexOf(m) > 0)
        .slice(-8) // last 8 messages for context window
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text,
        })),
      { role: 'user', content: userMessage },
    ];

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: groqMessages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  };

  // ── Handle Send ────────────────────────────────────────────────────
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    if (soundEnabled) soundManager.playClickSound();

    const userText = input.trim();
    const updatedMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      const reply = await callGroqAPI(userText, updatedMessages);
      setMessages(prev => [...prev, { sender: 'bot', text: reply || getFallbackResponse(userText.toLowerCase()) }]);
      if (soundEnabled) soundManager.playHoverSound();
    } catch (err) {
      console.error('Sayraa Groq API error:', err);
      // Graceful fallback to rule-based
      const fallback = getFallbackResponse(userText.toLowerCase());
      setMessages(prev => [...prev, { sender: 'bot', text: fallback }]);
    } finally {
      setIsTyping(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.25 }}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '90%',
          maxWidth: '390px',
          height: '540px',
          backgroundColor: '#0b0f19',
          backgroundImage: 'linear-gradient(rgba(7, 11, 20, 0.82), rgba(7, 11, 20, 0.88)), url("/chat_bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          border: '1px solid rgba(0, 240, 255, 0.4)',
          borderRadius: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 999999,
          boxShadow: '0 15px 40px rgba(0, 240, 255, 0.25), 0 0 0 1px rgba(0,240,255,0.1)',
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '0.85rem 1rem',
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(139, 92, 246, 0.15))',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(0,240,255,0.3), rgba(139,92,246,0.3))',
                border: '1.5px solid #00f0ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0,
                boxShadow: '0 0 12px rgba(0, 240, 255, 0.35)',
              }}
            >
              <img
                src="/chatbot_avatar.png"
                alt="Sayraa AI Avatar"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top center',
                }}
              />
            </div>
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '0.98rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem', margin: 0 }}>
                Sayraa <Sparkles size={13} color="#00f0ff" />
              </h4>
              <span style={{ color: '#10b981', fontSize: '0.72rem' }}>● Online — Subham's AI Assistant</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => setIsChatbotOpen(false)}
              title="Minimize Chat"
              style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
            >
              <Minus size={18} />
            </button>
            <button
              onClick={() => setIsChatbotOpen(false)}
              title="Close Chat"
              style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          onWheel={(e) => e.stopPropagation()}
          style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-start' }}
            >
              {msg.sender === 'bot' && (
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: '1px solid #00f0ff',
                    overflow: 'hidden',
                    flexShrink: 0,
                    marginRight: '8px',
                    marginTop: '2px',
                    boxShadow: '0 0 6px rgba(0, 240, 255, 0.3)',
                  }}
                >
                  <img
                    src="/chatbot_avatar.png"
                    alt="Sayraa AI"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'top center',
                    }}
                  />
                </div>
              )}
              <div
                style={{
                  maxWidth: '84%',
                  padding: '0.75rem 1rem',
                  borderRadius: msg.sender === 'user' ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                  background: msg.sender === 'user'
                    ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                    : 'rgba(17, 24, 39, 0.85)',
                  border: msg.sender === 'user' ? 'none' : '1px solid rgba(0, 240, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.6rem', color: '#00f0ff', fontSize: '0.82rem' }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: '1px solid #00f0ff',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                <img
                  src="/chatbot_avatar.png"
                  alt="Sayraa AI"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                  }}
                />
              </div>
              <span>Sayraa soch rahi hai</span>
              <span style={{ letterSpacing: '2px' }}>...</span>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggested Questions (shown only on first message) */}
        {messages.length === 1 && (
          <div style={{ padding: '0 1rem 0.5rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {["Projects dikhao", "Skills kya hai?", "Contact karo"].map((q) => (
              <button
                key={q}
                onClick={() => {
                  setInput(q);
                }}
                style={{
                  background: 'rgba(0,240,255,0.07)',
                  border: '1px solid rgba(0,240,255,0.25)',
                  borderRadius: '20px',
                  color: '#00f0ff',
                  fontSize: '0.72rem',
                  padding: '0.3rem 0.7rem',
                  cursor: 'pointer',
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={handleSend}
          style={{
            padding: '0.75rem',
            backgroundColor: '#030712',
            borderTop: '1px solid rgba(255, 255, 255, 0.07)',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
          }}
        >
          <input
            type="text"
            placeholder="Sayraa se kuch bhi poocho..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            style={{
              flex: 1,
              backgroundColor: '#0b0f19',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              padding: '0.6rem 1rem',
              color: '#ffffff',
              fontSize: '0.85rem',
              outline: 'none',
              fontFamily: "'Outfit', sans-serif",
              opacity: isTyping ? 0.6 : 1,
            }}
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            style={{
              background: isTyping ? 'rgba(0,240,255,0.3)' : '#00f0ff',
              border: 'none',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#030712',
              cursor: isTyping ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              flexShrink: 0,
            }}
          >
            <Send size={15} />
          </button>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default AiChatbot;

