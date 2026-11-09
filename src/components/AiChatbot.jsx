import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Sparkles, Minus, Mic, Volume2, VolumeX } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { soundManager } from '../utils/audio';
import {
  speakSayraa,
  stopSayraaSpeaking,
  playListenChime,
  createHinglishRecognizer,
  isVoiceInputSupported,
  onSayraaSpeakingChange,
} from '../utils/sayraaVoice';

// ── Gemini API Config (Primary) ──────────────────────────────────────
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
// Fastest-first fallback chain — if one model fails (rate limit / empty reply),
// the next one is tried automatically (same strategy as the EduSkill Sayraa).
const GEMINI_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash',
  'gemini-2.5-flash',
  'gemini-1.5-flash',
];

// ── Groq API Config (Secondary Fallback) ─────────────────────────────
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'mixtral-8x7b-32768',
];

// ── Sayraa System Prompt ─────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Sayraa, the personal AI assistant for Subham Khandual's portfolio website. You are friendly, warm, intelligent, and concise.

CRITICAL GUARDRAIL 1 — STRICT SUBHAM-ONLY SCOPE (MANDATORY RULE):
- You ONLY answer questions directly related to Subham Khandual (his projects, skills, tech stack, education, CTTC internships, achievements, resume, and contact details).
- If the user asks ANY question outside Subham (e.g. general knowledge, world capitals, news, politics, weather, recipes, solving coding problems/algorithms unrelated to Subham's projects, general trivia, math equations, or other people):
  YOU MUST IMMEDIATELY AND STRICTLY REFUSE and reply with ONLY this line:
  "Main Sayraa, Subham ki AI assistant hun. Subham ke bare mein jo puchhna hai puchho! 😊"
- Never answer any general knowledge or third-party query even if the user insists.

CRITICAL GUARDRAIL 2 — MAXIMUM 5 LINES LENGTH LIMIT (MANDATORY RULE):
- Every single answer you provide must NEVER exceed 5 lines. Maximum 1 to 5 short lines only.
- Be crisp, direct, and conversational. Never write long essays or huge paragraphs.
- Keep technical terms in English (e.g. React, Node.js, AI/ML, MongoDB, Express).

CRITICAL GUARDRAIL 3 — LANGUAGE IN HINGLISH:
- Sayraa ALWAYS replies in HINGLISH (Hindi written in Roman/English alphabet mixed with natural English words).
- NEVER use Devanagari (हिंदी) script. Always Roman letters (e.g., "Main Sayraa, Subham ki AI assistant hun").
- Friendly tone with emojis.

━━━ SUBHAM KHANDUAL — COMPLETE RESUME & PORTFOLIO KNOWLEDGE BASE ━━━

📄 RESUME SUMMARY / OVERVIEW
Subham Khandual is a Full-Stack MERN & AI Developer based in Bhubaneswar, Odisha, India. Currently pursuing B.Tech in Computer Science & Engineering (2023–2027) at GIFT Autonomous. He specializes in engineering high-impact web platforms, real-time safety & healthcare hubs, multilingual voice AI tools, and scalable backend architectures.

👤 PERSONAL & CONTACT INFO
- Full Name: Subham Khandual
- Current Role: Full-Stack Developer & AI Systems Engineer (Student)
- Location: Bhubaneswar, Odisha, India
- Email: subhamkhandual215@gmail.com
- Phone / WhatsApp: +91 7894047169 (wa.me/917894047169)
- LinkedIn: https://linkedin.com/in/subham-khandual
- GitHub: https://github.com/subham-khandual
- Instagram: @subham_khandual

🎓 EDUCATION & ACADEMIC FOUNDATION
1. Bachelor of Technology (B.Tech) in Computer Science & Engineering
   - Institution: Gandhi Institute for Technology (GIFT Autonomous), Bhubaneswar, Odisha
   - Timeline: 2023 – 2027 (Ongoing)
   - Core Subjects: Data Structures & Algorithms (DSA), DBMS, Operating Systems, Computer Networks, AI/ML.

2. Higher Secondary Education (+2 Science / Intermediate)
   - Institution: Swadhin Residential Higher Secondary School (College), Nimapada, Puri
   - Timeline: 2021 – 2023
   - Core Subjects: Physics, Chemistry, Mathematics, Computer Science.

3. Secondary School Education (Matriculation / 10th)
   - Institution: Saraswati Shishu Vidya Mandir, Astaranga, Puri
   - Timeline: 2010 – 2021
   - Highlights: Strong foundation in Mathematics, Sciences, and Academic Excellence.

💼 PROFESSIONAL EXPERIENCE & INTERNSHIPS
1. AI / ML Developer Intern — Central Tool Room & Training Centre (CTTC), Bhubaneswar
   - Timeline: May 2025 – July 2025
   - Key Work: Built end-to-end Machine Learning pipelines using Python, Scikit-learn, and Pandas. Worked on data preprocessing, feature engineering, model evaluation, and computer vision / predictive analytics models for healthcare & agriculture.

2. Core Java Developer Intern — Central Tool Room & Training Centre (CTTC), Bhubaneswar
   - Timeline: July 2024
   - Key Work: Mastered Object-Oriented Programming (OOP), multi-threading, collection framework, and exception handling in Java. Built database-driven desktop applications using JDBC and MySQL.

🛠️ SKILLS, TOOLS & TECH STACK
- Frontend Development: React.js (95%), HTML5 (95%), CSS3 (90%), JavaScript ES6+ (92%), Tailwind CSS (90%), Three.js, Vite.
- Backend & APIs: Node.js (88%), Express.js (90%), Python (85%), Flask, RESTful APIs.
- Database & Cloud: MongoDB (85%), MySQL (82%), Firebase Firestore (85%).
- Programming Languages: Java (88%), Python (85%), C Language (80%), JavaScript (92%).
- Developer Tools & Platforms: Git (90%), GitHub (92%), VS Code (95%), Postman (88%), Vercel, Progressive Web Apps (PWA).

🚀 FEATURED PROJECTS (5 Major Applications)
1. Suraksha Setu (AI Smart Tourist Safety Platform) [Full-Stack MERN + AI]
   - Description: Tourist security ecosystem with real-time safety alerts, emergency SOS, QR digital IDs, and centralized command dashboard.
   - Key Capabilities: 1-tap SOS alerts to police & contacts, live hazard mapping, digital QR tourist ID, integrated AI assistant.
   - Tech Tools: React, Node.js, Express.js, MongoDB, TypeScript, AI Chatbot.

2. Swasthya Setu (Comprehensive Healthcare Platform) [Full-Stack MERN + AI]
   - Description: Complete medical service hub offering rapid first aid response, blood bank tracking, instant doctor consultations, and AI chat.
   - Key Capabilities: Integrated Sayraa Healthcare Chatbot for instant diagnosis, real-time blood bank locator, instant doctor consultation booking, emergency first-aid & hospital finder.
   - Tech Tools: React, Node.js, Express.js, MongoDB, Sayraa AI Chatbot, Tailwind CSS.

3. Sayraa AI PPT Generator (Automated AI Presentation Platform) [AI Tool]
   - Description: AI-powered presentation tool creating structured PowerPoint slides from topic prompts using Gemini & Groq models.
   - Key Capabilities: Fast slide generation, automated formatting & speaker notes, custom layout themes, instant .pptx file export.
   - Tech Tools: Python, Flask, Gemini AI, Groq AI, Bootstrap.

4. Sayraa AI Health Care Assistant (Multilingual Voice AI Health Companion) [AI Tool]
   - Description: Voice-enabled healthcare companion providing accessible medical guidance in Odia, Hindi, and English.
   - Key Capabilities: Multilingual voice recognition (Odia, Hindi, English), Groq LLM fast medical advice, PWA installable mobile support, cloud chat sync.
   - Tech Tools: React, Groq LLM, Firebase, PWA, Web Speech API, Tailwind CSS.

5. Envistream Eduskill Chatbot (AI-Powered Educational Chatbot) [AI Tool]
   - Description: Interactive education chatbot with conversational AI for Q&A, study resource discovery, and guided learning support.
   - Key Capabilities: Conversational AI interface for instant educational Q&A, study resource discovery and guided learning support, responsive UI with smooth conversational flow.
   - Tech Tools: React, Node.js, Express.js, MongoDB, AI Chatbot, JavaScript.

🏆 CERTIFICATIONS & ACADEMIC CREDENTIALS
1. AI & Machine Learning Certification — CTTC Bhubaneswar (2025)
2. Core Java Application Development Certification — CTTC Bhubaneswar (2024)
3. NPTEL Certification: Programming in Java — IIT Kharagpur (Score: 55%) (2024)
4. NPTEL Certification: Industry 4.0 & Industrial Internet of Things (IIoT) — IIT Kharagpur (Score: 67%) (2025)
5. NPTEL Certification: Privacy and Security in Online Social Media — IIIT Hyderabad (Score: 54%) (2025)

🌟 KEY ACHIEVEMENTS & METRICS
- 15+ Full-Stack Web & AI Projects Completed
- 25+ Open-Source Repositories on GitHub
- 5+ Industry & NPTEL Certifications
- 10+ Hackathons & Coding Competitions
- 500+ Solved Algorithmic & DSA Problems (LeetCode, CodeChef, NPTEL)

🔗 PROJECT LINKS (share ONLY when the user asks for the link / live demo / code / repo / GitHub / website):
- Suraksha Setu → Live: https://suraksha-setu-oxkw.vercel.app | Code: https://github.com/subham-khandual/Suraksha-Setu
- Swasthya Setu → Live: https://frontend-five-khaki-22.vercel.app | Code: https://github.com/subham-khandual/swasthya-setu
- Sayraa AI PPT Generator → Live: https://ppt-generator-seven-mu.vercel.app | Code: https://github.com/subham-khandual/ppt-generator
- Sayraa AI Health Care Assistant → Live: https://sayraa-health-care-ai-assistant.vercel.app | Code: https://github.com/subham-khandual/sayraa-health-care-ai-assistant
- Envistream Eduskill Chatbot → Live: https://envistream-chatbot.vercel.app/ | Code: https://github.com/subham-khandual/Envistream-chatbot

🎙️ VOICE RULES (CRITICAL — Sayraa's answers are also SPOKEN aloud via TTS in a sweet female Hinglish voice):
- Keep every answer short and conversational (2-4 short lines max) — long paragraphs sound bad as speech.
- NEVER use markdown symbols (asterisks, hashes, backticks) or raw URLs in answers — they sound broken when spoken. Describe links in words; give the raw URL only when explicitly asked.
- Emojis are fine on screen (they are removed from speech automatically).
- VOICE INPUT: user messages often come from a speech recognizer and contain PHONETIC spelling mistakes (e.g. "surakchha setu" = Suraksha Setu, "swastya setu" = Swasthya Setu, "subhaam khandwal" = Subham Khandual, "prorescts dikhao" = projects dikhao). Silently understand the intended meaning and answer normally — never correct the user.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

// ── Sayraa's short Hinglish welcome line (shown + SPOKEN sweetly on open) ──
const WELCOME_TEXT =
  "Namaste! 🙏 Main Sayraa hun, Subham ki AI assistant. Subham ke projects, skills ya contact ke bare mein jo poochna hai, poochho! 😊";

// ── Fallback Rule-Based (if Gemini/Groq API fails or is offline) ───────────
const getFallbackResponse = (rawQ) => {
  const q = (rawQ || '').toLowerCase();

  if (q.includes('resume') || q.includes('cv') || q.includes('summary') || q.includes('overview') || q.includes('profile'))
    return "📄 **Subham's Profile:**\n• Final-year B.Tech CS Student at GIFT Autonomous, Bhubaneswar.\n• Full-Stack MERN & AI Developer with 2 CTTC internships.\n• Built 15+ live web/AI projects like Suraksha Setu & Swasthya Setu.\n• Tech: React, Node.js, MongoDB, Python, Java, Tailwind.";

  if (q.includes('experience') || q.includes('intern') || q.includes('cttc') || q.includes('work') || q.includes('job'))
    return "💼 **Subham's Experience:**\n1. AI / ML Intern at CTTC (2025): Machine Learning pipelines & Computer Vision.\n2. Core Java Intern at CTTC (2024): Desktop systems with Java OOP & JDBC.\n1+ years of building production-ready scalable applications!";

  if (q.includes('education') || q.includes('college') || q.includes('school') || q.includes('intermediate') || q.includes('btech') || q.includes('gift') || q.includes('degree') || q.includes('study'))
    return "🎓 **Subham's Education:**\n1. B.Tech in CSE (2023 - 2027) - GIFT Autonomous College, Bhubaneswar\n2. +2 Science (2021 - 2023) - Swadhin Residential College, Nimapada\n3. 10th Schooling (2010 - 2021) - Saraswati Shishu Vidya Mandir, Astaranga";

  if (q.includes('skill') || q.includes('tool') || q.includes('stack') || q.includes('tech') || q.includes('react') || q.includes('node') || q.includes('java') || q.includes('python'))
    return "🛠️ **Subham's Tech Stack:**\n• Frontend: React.js, Tailwind CSS, JavaScript, Three.js, Vite\n• Backend & Database: Node.js, Express, Python, MongoDB, MySQL\n• Tools & Cloud: Git, GitHub, VS Code, Postman, Vercel, PWA";

  if (q.includes('project') || q.includes('swasthya') || q.includes('suraksha') || q.includes('sayraa') || q.includes('ppt') || q.includes('health') || q.includes('envistream'))
    return "🚀 **Subham's Major Projects:**\n1. Suraksha Setu: AI Tourist Safety & SOS platform\n2. Swasthya Setu: Smart Healthcare platform with AI assistant\n3. Sayraa AI PPT Generator & Multilingual Voice Companion\nKisi project ka live link ya GitHub repo chahiye toh batao! 😊";

  if (q.includes('achievement') || q.includes('metric') || q.includes('stats') || q.includes('hackathon') || q.includes('problem'))
    return "🏆 **Key Achievements:**\n• 15+ Completed Web & AI Projects | 25+ GitHub Repositories\n• 500+ Solved Algorithmic Problems (DSA)\n• 10+ Hackathons & Coding Contests | 5+ Verified Certifications";

  if (q.includes('certificate') || q.includes('nptel') || q.includes('score'))
    return "📜 **Certifications:**\n• CTTC AI & Machine Learning (2025) & Core Java (2024)\n• NPTEL Programming in Java - IIT Kharagpur (55%)\n• NPTEL Industry 4.0 & IIoT - IIT Kharagpur (67%)\n• NPTEL Social Media Security - IIIT Hyderabad (54%)";

  if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('phone') || q.includes('whatsapp') || q.includes('linkedin') || q.includes('github') || q.includes('message'))
    return "📧 **Contact Subham:**\n• Email: subhamkhandual215@gmail.com\n• Phone / WhatsApp: +91 7894047169\n• LinkedIn: linkedin.com/in/subham-khandual\n• GitHub: github.com/subham-khandual";

  if (q.includes('who is subham') || q.includes('who are you') || q.includes('sayraa') || q.includes('about subham') || q.includes('subham'))
    return "Namaste! 🙏 Main Sayraa hun, Subham Khandual ki AI Assistant.\nSubham ek passionate Full-Stack MERN & AI Developer hain.\nUnke projects, skills, education ya contact ke bare mein jo poochna hai poochho! 😊";

  // Strict outside query guardrail
  return "Main Sayraa, Subham ki AI assistant hun. Subham ke bare mein jo puchhna hai puchho! 😊";
};

// ── Component ─────────────────────────────────────────────────────────
const AiChatbot = () => {
  const { isChatbotOpen, setIsChatbotOpen, soundEnabled } = usePortfolio();
  const [messages, setMessages] = useState([{ sender: 'bot', text: WELCOME_TEXT }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  // ── 🎙️ Voice assistant state ────────────────────────────────────────
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [voiceOn, setVoiceOn] = useState(() => {
    try { return localStorage.getItem('sayraaVoiceOn') !== 'off'; } catch { return true; }
  });
  // 🎬 "Video-style" avatar: true while Sayraa's voice is actually playing
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatEndRef = useRef(null);
  const isListeningRef = useRef(false);
  const recognizerRef = useRef(null);
  const greetedRef = useRef(false);
  const voiceOnRef = useRef(voiceOn);

  // Speak a bot reply aloud with Sayraa's sweet female Hinglish voice.
  // Sayraa ALWAYS replies in Hinglish — English, Hindi ya mix, sabmein Hinglish!
  // voiceOnRef keeps the latest mute state visible inside stable callbacks.
  const speakBotReply = (text, opts = {}) => {
    if (!voiceOnRef.current || !text) return;
    speakSayraa(text, {
      lang: 'hinglish',
      append: opts.append === true,
      sweet: opts.sweet === true,
    });
  };

  // Drive the animated avatar from the real speech engine state
  useEffect(() => onSayraaSpeakingChange(setIsSpeaking), []);

  // ── Open / close lifecycle ─────────────────────────────────────────
  useEffect(() => {
    if (isChatbotOpen) {
      setMessages([{ sender: 'bot', text: WELCOME_TEXT }]);
      setInput('');
      setIsTyping(false);
      // 🎙️ Greet with Sayraa's sweet voice ONCE per open (guarded so React
      // StrictMode's double effect pass in dev never says hello twice).
      if (!greetedRef.current) {
        greetedRef.current = true;
        // 🎙️💗 Sweet female Hinglish greeting voice (extra-sweet delivery)
        speakBotReply(WELCOME_TEXT, { sweet: true });
      }
    } else {
      // Minimized / closed → stop talking, release the mic, reset the guard
      greetedRef.current = false;
      stopSayraaSpeaking();
      if (recognizerRef.current) {
        recognizerRef.current.abort();
        recognizerRef.current = null;
      }
      isListeningRef.current = false;
      setIsListening(false);
      setInterimText('');
    }
  }, [isChatbotOpen]);

  // Unmount safety: never leave TTS or the mic running
  useEffect(() => () => {
    stopSayraaSpeaking();
    if (recognizerRef.current) recognizerRef.current.abort();
  }, []);

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
          src="/chatbot_avatar.webp"
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

  // ── Gemini API Call (SSE streaming + model fallback chain) ──────────
  // Sayraa always answers in HINGLISH. Each finished sentence is spoken aloud
  // while the rest is still streaming (progressive speech), so she starts
  // talking almost immediately instead of waiting for the full answer.
  const callGeminiAPI = async (userMessage, historyMessages, { onChunk } = {}) => {
    if (!GEMINI_API_KEY) throw new Error('VITE_GEMINI_API_KEY missing from .env');

    // Build Gemini `contents` from the chat history. The greeting (first bot
    // message) is skipped so the conversation always starts with a user turn.
    // Keep only the last 8 messages — latency grows with prompt size.
    const contents = [
      ...historyMessages
        .filter((m, i) => !(m.sender === 'bot' && i === 0))
        .slice(-8)
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        })),
      {
        role: 'user',
        parts: [{
          text: `${userMessage}\n\n(IMPORTANT: Apna pura jawab SIRF HINGLISH mein do — Hindi words Roman letters mein. Devanagari ya pure English bilkul nahi.)`,
        }],
      },
    ];

    const body = {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
    };

    const apiUrl = (model, method) =>
      `${GEMINI_API_URL}/${encodeURIComponent(model)}:${method}?key=${encodeURIComponent(GEMINI_API_KEY)}`;

    // Thinking models also emit hidden "thought" parts — never show/speak those.
    const partsToText = (candidate) =>
      (candidate?.content?.parts ?? [])
        .filter((p) => p.text && !p.thought)
        .map((p) => p.text)
        .join('');

    let lastError = '';

    for (const model of GEMINI_MODELS) {
      try {
        // ---- Streaming first: first words appear + speak almost instantly ----
        const res = await fetch(`${apiUrl(model, 'streamGenerateContent')}&alt=sse`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          lastError = `${model} → HTTP ${res.status}`;
          continue;
        }
        if (res.body && typeof res.body.getReader === 'function') {
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          let text = '';

          for (;;) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            let nl;
            while ((nl = buffer.indexOf('\n')) !== -1) {
              const line = buffer.slice(0, nl).trim();
              buffer = buffer.slice(nl + 1);
              if (!line.startsWith('data:')) continue;
              const payload = line.slice(5).trim();
              if (!payload || payload === '[DONE]') continue;
              try {
                const json = JSON.parse(payload);
                const chunk = partsToText(json.candidates?.[0]);
                if (chunk) {
                  text += chunk;
                  if (onChunk) onChunk(text);
                }
              } catch {
                // Ignore a partial JSON line — the rest arrives in the next chunk.
              }
            }
          }
          if (text.trim()) return text.trim();
          lastError = `${model} → empty stream`;
          continue;
        }

        // ---- No ReadableStream support → plain (non-streaming) call ----------
        const res2 = await fetch(apiUrl(model, 'generateContent'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res2.ok) {
          lastError = `${model} → HTTP ${res2.status}`;
          continue;
        }
        const data = await res2.json();
        const text = partsToText(data.candidates?.[0]).trim();
        if (text) return text;
        lastError = `${model} → empty reply`;
      } catch (err) {
        lastError = `${model} → ${err?.message || String(err)}`;
      }
    }
    throw new Error(`All Gemini models failed — ${lastError}`);
  };

  // ── Groq API Call (Secondary Fallback with streaming) ──────────────
  const callGroqAPI = async (userMessage, historyMessages, { onChunk } = {}) => {
    if (!GROQ_API_KEY) throw new Error('VITE_GROQ_API_KEY missing from .env');

    const messagesPayload = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...historyMessages
        .filter((m, i) => !(m.sender === 'bot' && i === 0))
        .slice(-8)
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text,
        })),
      {
        role: 'user',
        content: `${userMessage}\n\n(IMPORTANT: Apna pura jawab SIRF HINGLISH mein do — maximum 5 lines. Devanagari ya pure English bilkul nahi.)`,
      },
    ];

    let lastError = '';

    for (const model of GROQ_MODELS) {
      try {
        const res = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model,
            messages: messagesPayload,
            temperature: 0.6,
            max_tokens: 350,
            stream: true,
          }),
        });

        if (!res.ok) {
          lastError = `${model} → HTTP ${res.status}`;
          continue;
        }

        if (res.body && typeof res.body.getReader === 'function') {
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          let text = '';

          for (;;) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            let nl;
            while ((nl = buffer.indexOf('\n')) !== -1) {
              const line = buffer.slice(0, nl).trim();
              buffer = buffer.slice(nl + 1);
              if (!line.startsWith('data:')) continue;
              const payload = line.slice(5).trim();
              if (!payload || payload === '[DONE]') continue;
              try {
                const json = JSON.parse(payload);
                const delta = json.choices?.[0]?.delta?.content || '';
                if (delta) {
                  text += delta;
                  if (onChunk) onChunk(text);
                }
              } catch {
                // Ignore partial JSON chunks
              }
            }
          }
          if (text.trim()) return text.trim();
          lastError = `${model} → empty stream`;
          continue;
        }

        // Non-streaming fallback for Groq
        const res2 = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model,
            messages: messagesPayload,
            temperature: 0.6,
            max_tokens: 350,
            stream: false,
          }),
        });
        if (!res2.ok) {
          lastError = `${model} → HTTP ${res2.status}`;
          continue;
        }
        const data = await res2.json();
        const text = data.choices?.[0]?.message?.content?.trim();
        if (text) return text;
        lastError = `${model} → empty reply`;
      } catch (err) {
        lastError = `${model} → ${err?.message || String(err)}`;
      }
    }
    throw new Error(`All Groq models failed — ${lastError}`);
  };

  // ── Core send (used by BOTH typed input and 🎙️ voice input) ────────
  const sendUserMessage = async (rawText) => {
    const userText = (rawText || '').trim();
    if (!userText || isTyping) return;

    if (soundEnabled) soundManager.playClickSound();

    // Sayraa ALWAYS replies in Hinglish — text and voice both.
    const updatedMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    // ---- Progressive display + progressive speech ----
    // The reply bubble appears as soon as the first words stream in, and each
    // finished sentence is SPOKEN while the rest is still being generated.
    const aiMsgId = `ai-${Date.now()}`;
    let streamingStarted = false;
    let spokenUpTo = 0; // chars of the reply already given to the voice
    let spokenAny = false;
    const MIN_SPEAK_CHUNK = 24; // never speak tiny fragments like "Hi."

    // Index just past the LAST sentence terminator followed by space/end (-1
    // when no sentence has finished yet).
    const lastSentenceCut = (s) => {
      const re = /[.?!।]/g;
      let cut = -1;
      let m;
      while ((m = re.exec(s)) !== null) {
        const next = s[m.index + 1];
        if (next === undefined || /\s/.test(next)) cut = m.index + 1;
      }
      return cut;
    };

    const speakCompletedSentences = (fullText) => {
      // Drain every sentence that has completed (one chunk can contain many).
      for (;;) {
        const rest = fullText.slice(spokenUpTo);
        const cut = lastSentenceCut(rest);
        if (cut === -1) return;
        const piece = rest.slice(0, cut).trim();
        // Hold short fragments back so the next sentence joins them.
        if (piece.length < MIN_SPEAK_CHUNK) return;
        spokenUpTo += cut;
        // The first sentence replaces previous speech; later ones queue behind.
        speakBotReply(piece, { append: spokenAny });
        spokenAny = true;
      }
    };

    const showStreamed = (txt) => {
      try {
        speakCompletedSentences(txt);
      } catch {
        /* speech must never break the reply */
      }
      if (!streamingStarted) {
        streamingStarted = true;
        setIsTyping(false);
        setMessages((prev) => [...prev, { id: aiMsgId, sender: 'bot', text: txt }]);
        return;
      }
      setMessages((prev) =>
        prev.map((msg) => (msg.id === aiMsgId ? { ...msg, text: txt } : msg))
      );
    };

    try {
      let fullText = '';

      // 1. Primary: Try Gemini API
      try {
        fullText = await callGeminiAPI(userText, updatedMessages, { onChunk: showStreamed });
      } catch (apiErr) {
        console.warn('Sayraa Gemini (Primary) failed, switching to Groq fallback:', apiErr?.message || apiErr);
      }

      // 2. Secondary: If Gemini failed, try Groq Cloud API
      if (!fullText) {
        try {
          fullText = await callGroqAPI(userText, updatedMessages, { onChunk: showStreamed });
        } catch (groqErr) {
          console.warn('Sayraa Groq (Secondary) failed, switching to local fallback:', groqErr?.message || groqErr);
        }
      }

      if (fullText) {
        // Enforce hard 5-lines limit defense on final response
        const lines = fullText.split('\n');
        const cappedText = lines.length > 5 ? lines.slice(0, 5).join('\n') : fullText;

        if (streamingStarted) {
          // Bubble already exists — finalise it with the complete trimmed text
          setMessages((prev) =>
            prev.map((msg) => (msg.id === aiMsgId ? { ...msg, text: cappedText } : msg))
          );
        } else {
          setMessages((prev) => [...prev, { sender: 'bot', text: cappedText }]);
        }
        // Speak whatever progressive speech did not already speak
        const leftover = cappedText.slice(spokenUpTo).trim();
        if (leftover) {
          speakBotReply(leftover, { append: spokenAny });
        } else if (!spokenAny) {
          speakBotReply(cappedText);
        }
      } else {
        // Gemini totally failed → graceful rule-based fallback
        const fallback = getFallbackResponse(userText.toLowerCase());
        setMessages((prev) => [...prev, { sender: 'bot', text: fallback }]);
        speakBotReply(fallback);
      }
      if (soundEnabled) soundManager.playHoverSound();
    } finally {
      setIsTyping(false);
    }
  };

  // ── Typed input submit ─────────────────────────────────────────────
  const handleSend = (e) => {
    e.preventDefault();
    sendUserMessage(input);
  };

  // ── 🎙️ Voice input (Hinglish speech → text → answer) ───────────────
  const resetListeningUI = () => {
    isListeningRef.current = false;
    setIsListening(false);
    setInterimText('');
  };

  const startListening = () => {
    // Pressing the mic AGAIN while listening stops early & sends what was heard
    if (isListeningRef.current) {
      if (recognizerRef.current) recognizerRef.current.stop();
      return;
    }
    if (!isVoiceInputSupported()) {
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: "Is browser mein voice input supported nahi hai! Chrome ya Edge browser use karo. 🎙️",
      }]);
      return;
    }
    // Sayraa's own voice must never feed the mic — stop TTS first
    stopSayraaSpeaking();
    recognizerRef.current = createHinglishRecognizer({
      onInterim: (t) => setInterimText(t),
      onFinal: (text) => {
        recognizerRef.current = null;
        resetListeningUI();
        if (text) sendUserMessage(text);
      },
      onError: (msg) => {
        recognizerRef.current = null;
        resetListeningUI();
        if (msg) {
          setMessages(prev => [...prev, { sender: 'bot', text: msg }]);
        }
      },
    });
    if (!recognizerRef.current) {
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: "Is browser mein voice input supported nahi hai! Chrome ya Edge browser use karo. 🎙️",
      }]);
      return;
    }
    isListeningRef.current = true;
    setIsListening(true);
    setInterimText('');
    playListenChime();
  };

  // ── 🔊 Mute / unmute Sayraa's voice (persisted) ────────────────────
  const toggleVoice = () => {
    setVoiceOn(prev => {
      const next = !prev;
      voiceOnRef.current = next;
      try { localStorage.setItem('sayraaVoiceOn', next ? 'on' : 'off'); } catch { /* storage unavailable */ }
      if (!next) stopSayraaSpeaking();
      return next;
    });
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
          backgroundImage: 'linear-gradient(rgba(7, 11, 20, 0.82), rgba(7, 11, 20, 0.88)), url("/chat_bg.webp")',
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
          fontFamily: "'Inter', -apple-system, sans-serif",
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
            <motion.div
              animate={
                isSpeaking
                  ? {
                      boxShadow: ['0 0 10px rgba(0,240,255,0.4)', '0 0 22px rgba(0,240,255,0.9)', '0 0 10px rgba(0,240,255,0.4)'],
                      scale: [1, 1.07, 1],
                    }
                  : { boxShadow: '0 0 12px rgba(0, 240, 255, 0.35)', scale: 1 }
              }
              transition={isSpeaking ? { repeat: Infinity, duration: 1.1 } : { duration: 0.3 }}
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
                src="/chatbot_avatar.webp"
                alt="Sayraa AI Avatar"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top center',
                }}
              />
            </motion.div>
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '0.98rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem', margin: 0 }}>
                Sayraa <Sparkles size={13} color="#00f0ff" />
                {/* 🎬 Live voice bars — the "video avatar" talking effect */}
                {isSpeaking && (
                  <span style={{ display: 'inline-flex', alignItems: 'flex-end', gap: '2px', height: '12px', marginLeft: '2px' }}>
                    {[0, 1, 2].map((bar) => (
                      <motion.span
                        key={bar}
                        animate={{ height: ['4px', '12px', '4px'] }}
                        transition={{ repeat: Infinity, duration: 0.7, delay: bar * 0.15 }}
                        style={{ width: '3px', borderRadius: '2px', background: '#00f0ff', display: 'inline-block' }}
                      />
                    ))}
                  </span>
                )}
              </h4>
              <span style={{ color: isSpeaking ? '#00f0ff' : '#10b981', fontSize: '0.72rem' }}>
                {isSpeaking ? '🔊 Bol rahi hoon...' : "● Online — Subham's AI Assistant"}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={toggleVoice}
              title={voiceOn ? "Sayraa ki voice band karo (mute)" : "Sayraa ki voice chalu karo"}
              aria-label={voiceOn ? "Mute Sayraa's voice" : "Unmute Sayraa's voice"}
              style={{
                background: 'none',
                border: 'none',
                color: voiceOn ? '#00f0ff' : '#9ca3af',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {voiceOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
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
                    src="/chatbot_avatar.webp"
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
                  src="/chatbot_avatar.webp"
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

          {/* 🎙️ Live voice-input indicator — interim transcript while listening */}
          {isListening && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.6rem', color: '#00f0ff', fontSize: '0.82rem' }}
            >
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.1 }}
                style={{ fontSize: '1.1rem' }}
              >
                🎙️
              </motion.span>
              <span style={{ fontStyle: 'italic', opacity: 0.95 }}>
                {interimText || 'sun rahi hoon, bolte jao...'}
              </span>
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
                  fontFamily: "'Inter', -apple-system, sans-serif",
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
            aria-label="Message Sayraa AI assistant"
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
              fontFamily: "'Inter', -apple-system, sans-serif",
              opacity: isTyping ? 0.6 : 1,
            }}
          />
          {input.trim() ? (
            <button
              type="submit"
              disabled={isTyping}
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
          ) : (
            <motion.button
              type="button"
              onClick={startListening}
              whileTap={{ scale: 0.9 }}
              title={
                isListening
                  ? 'Bolna band karo aur turant send karo — dobara dabao 🎙️'
                  : 'Bolkar poocho — Hinglish voice input 🎤'
              }
              aria-label="Voice input"
              animate={
                isListening
                  ? { boxShadow: ['0 0 0 0 rgba(0,240,255,0.55)', '0 0 0 10px rgba(0,240,255,0)'] }
                  : { boxShadow: 'none' }
              }
              transition={isListening ? { repeat: Infinity, duration: 1.2 } : {}}
              style={{
                background: isListening ? '#00f0ff' : 'rgba(0,240,255,0.12)',
                border: '1.5px solid #00f0ff',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isListening ? '#030712' : '#00f0ff',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <Mic size={16} />
            </motion.button>
          )}
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default AiChatbot;

