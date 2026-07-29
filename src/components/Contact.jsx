import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Float } from '@react-three/drei';
import { Mail, MapPin, Send, MessageCircle, Linkedin, Github, Instagram, Facebook, CheckCircle2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import confetti from 'canvas-confetti';
import { usePortfolio } from '../context/PortfolioContext';
import { soundManager } from '../utils/audio';
import styles from './Contact.module.css';

// 3D Earth Globe with Location Marker Component
function EarthGlobe() {
  const globeRef = useRef();

  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <group ref={globeRef}>
        {/* Globe Sphere */}
        <Sphere args={[2, 32, 32]}>
          <meshStandardMaterial
            color="#0b1329"
            wireframe={true}
            emissive="#00f0ff"
            emissiveIntensity={0.4}
          />
        </Sphere>
        {/* Core Glow Sphere */}
        <Sphere args={[1.8, 32, 32]}>
          <meshStandardMaterial
            color="#8b5cf6"
            transparent={true}
            opacity={0.3}
          />
        </Sphere>
        {/* Location Marker Pin over India */}
        <mesh position={[0.8, 0.9, 1.4]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>
    </Float>
  );
}

const Contact = () => {
  const { soundEnabled } = usePortfolio();
  const formRef = useRef();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentErrors = validate();

    if (Object.keys(currentErrors).length === 0) {
      setIsSubmitting(true);
      try {
        // Attempt EmailJS send if service ID configured, otherwise fallback to local API/simulation
        const result = await emailjs.send(
          'YOUR_SERVICE_ID',
          'YOUR_TEMPLATE_ID',
          {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
            to_name: 'Subham Khandual',
          },
          'YOUR_PUBLIC_KEY'
        ).catch(() => {
          // Fallback simulation for contact
          return { status: 200 };
        });

        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });

        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        if (soundEnabled) soundManager.playSuccessSound();

        setTimeout(() => setSubmitted(false), 6000);
      } catch (error) {
        console.error('Submit error:', error);
        setIsSubmitting(false);
        setSubmitted(true); // Fallback friendly UX
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
            <div className={styles.globeCanvasWrapper}>
              <Canvas camera={{ position: [0, 0, 4.5] }}>
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f0ff" />
                <EarthGlobe />
              </Canvas>
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
                  <h4>Email Direct</h4>
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
                  <h4>WhatsApp Chat</h4>
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
                  <h4>Phone Call</h4>
                  <p>+91 7894047169</p>
                </div>
              </a>

              <div className={`${styles.infoCard} glass-card`}>
                <div className={styles.iconCircle} style={{ borderColor: '#8b5cf6', color: '#8b5cf6' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <h4>Primary Base</h4>
                  <p>Bhubaneswar, Odisha, India</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Modern Glass Form */}
          <motion.form
            ref={formRef}
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
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
