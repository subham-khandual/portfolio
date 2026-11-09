import React, { useState, useRef, Suspense, lazy } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, MapPin, Send, MessageCircle, CheckCircle2, ExternalLink } from 'lucide-react';
import emailjs from '@emailjs/browser';
import confetti from 'canvas-confetti';
import { usePortfolio } from '../context/PortfolioContext';
import { soundManager } from '../utils/audio';
import styles from './Contact.module.css';

// Heavy WebGL bundle — only fetched once the globe is scrolled into view.
const EarthGlobe = lazy(() => import('./EarthGlobe'));

const Contact = () => {
  const { soundEnabled } = usePortfolio();
  const globeRef = useRef(null);
  // Mount the WebGL globe only once the section is reached; pause it when off-screen.
  const globeVisible = useInView(globeRef, { margin: '0px 0px -15% 0px' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);

  const validate = (data = formData) => {
    let newErrors = {};
    if (!data.name.trim() || data.name.trim().length < 2) {
      newErrors.name = 'Please enter your name (at least 2 characters)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim() || !emailRegex.test(data.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!data.message.trim() || data.message.trim().length < 8) {
      newErrors.message = 'Please enter a message (at least 8 characters)';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    const updated = { ...formData, [id]: value };
    setFormData(updated);

    const currentErrors = validate(updated);
    setErrors(currentErrors);
    if (fallbackMode) setFallbackMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentErrors = validate();

    if (Object.keys(currentErrors).length === 0) {
      setIsSubmitting(true);
      setFallbackMode(false);

      const web3Key = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
      const emailjsService = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const emailjsTemplate = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const emailjsKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      const apiUrl = import.meta.env.VITE_API_URL;

      let delivered = false;

      // 1. Web3Forms Dispatcher (Direct Gmail Notification)
      if (web3Key) {
        try {
          const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
              access_key: web3Key,
              name: formData.name,
              email: formData.email,
              message: formData.message,
              subject: `New Portfolio Message from ${formData.name}`,
              from_name: 'Subham Portfolio Website',
            }),
          });
          const data = await res.json();
          if (data.success) delivered = true;
        } catch (err) {
          console.warn('Web3Forms dispatch failed:', err);
        }
      }

      // 2. EmailJS Dispatcher if configured in .env with valid non-dummy keys
      if (
        !delivered &&
        emailjsService &&
        emailjsTemplate &&
        emailjsKey &&
        emailjsService !== 'YOUR_SERVICE_ID'
      ) {
        try {
          const res = await emailjs.send(
            emailjsService,
            emailjsTemplate,
            {
              from_name: formData.name,
              from_email: formData.email,
              message: formData.message,
              to_name: 'Subham Khandual',
            },
            emailjsKey
          );
          if (res.status === 200) delivered = true;
        } catch (err) {
          console.warn('EmailJS failed:', err);
        }
      }

      // 3. Backend API (MongoDB) Archive in parallel if server is configured and reachable
      if (apiUrl) {
        try {
          await fetch(`${apiUrl}/api/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });
        } catch {
          // Backend offline or unreachable
        }
      }

      setIsSubmitting(false);

      if (delivered) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        if (soundEnabled) soundManager.playSuccessSound();
        setTimeout(() => setSubmitted(false), 7000);
      } else {
        // Multi-tier Fallback: Enable 1-click direct delivery to Gmail or WhatsApp
        setFallbackMode(true);
        if (soundEnabled) soundManager.playClickSound();
      }
    } else {
      setErrors(currentErrors);
    }
  };

  return (
    <section id="contact" className={styles.contactSection}>
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className={styles.header}
        >
          <h2 className="section-title">
            Let's <span className="text-gradient">Connect & Build Together</span>
          </h2>
          <p className="section-subtitle">
            Open for full-time opportunities, engineering roles, freelance projects, or innovative collaborations.
          </p>
        </motion.div>

        <div className={styles.contactMainGrid}>
          {/* Left Column: 3D Earth Globe Canvas & Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={styles.globeSide}
          >
            <div className={styles.globeCanvasWrapper} ref={globeRef}>
              <Suspense fallback={null}>
                {globeVisible && <EarthGlobe active={globeVisible} />}
              </Suspense>
              <div className={styles.globeLabel}>📍 Location: Bhubaneswar, Odisha, India</div>
            </div>

            <div className={styles.infoCardsGrid}>
              <a
                href="mailto:subhamkhandual215@gmail.com"
                className={`${styles.infoCard} glass-card`}
                onMouseEnter={() => {
                  if (soundEnabled) soundManager.playHoverSound();
                }}
              >
                <div className={styles.iconCircle}>
                  <Mail size={20} />
                </div>
                <div>
                  <h3>Email Direct</h3>
                  <p>subhamkhandual215@gmail.com</p>
                </div>
              </a>

              <a
                href="https://wa.me/917894047169"
                target="_blank"
                rel="noreferrer"
                className={`${styles.infoCard} glass-card`}
                onMouseEnter={() => {
                  if (soundEnabled) soundManager.playHoverSound();
                }}
              >
                <div className={styles.iconCircle} style={{ borderColor: '#10b981', color: '#10b981' }}>
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3>WhatsApp Chat</h3>
                  <p>+91 7894047169</p>
                </div>
              </a>

              <a
                href="tel:+917894047169"
                className={`${styles.infoCard} glass-card`}
                onMouseEnter={() => {
                  if (soundEnabled) soundManager.playHoverSound();
                }}
              >
                <div className={styles.iconCircle} style={{ borderColor: '#f59e0b', color: '#f59e0b' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 5.94 5.94l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <div>
                  <h3>Phone Call</h3>
                  <p>+91 7894047169</p>
                </div>
              </a>

              <div className={`${styles.infoCard} glass-card`}>
                <div className={styles.iconCircle} style={{ borderColor: '#8b5cf6', color: '#8b5cf6' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <h3>Primary Base</h3>
                  <p>Bhubaneswar, Odisha, India</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Modern Glass Form */}
          <motion.form
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`${styles.contactForm} glass-card`}
            onSubmit={handleSubmit}
          >
            <h3 className={styles.formTitle}>Send a Direct Message</h3>

            <div className={styles.inputGroup}>
              <label htmlFor="name">Your Full Name</label>
              <input
                type="text"
                id="name"
                placeholder="Subham Khandual"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? styles.inputError : ''}
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">Your Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? styles.inputError : ''}
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                rows="5"
                placeholder="Hello Subham, I'd like to discuss a project..."
                value={formData.message}
                onChange={handleChange}
                className={errors.message ? styles.inputError : ''}
              />
              {errors.message && <span className={styles.errorText}>{errors.message}</span>}
            </div>

            <button
              type="submit"
              className={`btn btn-primary ${styles.submitBtn}`}
              disabled={isSubmitting}
              onMouseEnter={() => {
                if (soundEnabled) soundManager.playHoverSound();
              }}
            >
              {isSubmitting ? 'Transmitting Message...' : submitted ? 'Message Sent! 🎉' : 'Send Message'}
              {!isSubmitting && !submitted && <Send size={18} />}
            </button>

            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.successBox}
              >
                <CheckCircle2 size={18} color="#10b981" />
                <span>Thank you! Your message has been transmitted successfully. Subham will reply shortly.</span>
              </motion.div>
            )}

            {fallbackMode && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.fallbackBox}
              >
                <div className={styles.fallbackHeader}>
                  <ExternalLink size={16} color="#00f0ff" />
                  <span>Direct Delivery Ready: Click to send your pre-filled message instantly:</span>
                </div>
                <div className={styles.fallbackActions}>
                  <a
                    href={`mailto:subhamkhandual215@gmail.com?subject=${encodeURIComponent(
                      `Portfolio Inquiry from ${formData.name}`
                    )}&body=${encodeURIComponent(
                      `Hi Subham,\n\n${formData.message}\n\nFrom: ${formData.name}\nEmail: ${formData.email}`
                    )}`}
                    className={styles.fallbackBtnEmail}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      if (soundEnabled) soundManager.playClickSound();
                    }}
                  >
                    <Mail size={16} />
                    <span>Open in Gmail</span>
                  </a>

                  <a
                    href={`https://wa.me/917894047169?text=${encodeURIComponent(
                      `Hi Subham, I am ${formData.name} (${formData.email}).\n\n${formData.message}`
                    )}`}
                    className={styles.fallbackBtnWhatsapp}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      if (soundEnabled) soundManager.playClickSound();
                    }}
                  >
                    <MessageCircle size={16} />
                    <span>Send via WhatsApp</span>
                  </a>
                </div>
              </motion.div>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
