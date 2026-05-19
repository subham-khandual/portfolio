import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Code } from 'lucide-react';
import styles from './Projects.module.css';

const projects = [
  {
    title: "Swasthya Setu",
    description: "A comprehensive healthcare platform designed to alert emergency responders, provide rapid first aid guidance, track blood availability, and facilitate instant doctor consultations, featuring the integrated Susri Healthcare Chatbot for instant assistance.",
    image: "/swasthyasetu.png",
    tech: ["React", "Node.js", "Express.js", "MongoDB", "AI Chatbot"],
    github: "https://github.com/SubhamKhandual007/swasthyasetu",
    live: "https://swasthyasetu-tsbt.vercel.app"
  },
  {
    title: "Suraksha Setu",
    description: "An advanced tourist safety platform featuring interactive maps, emergency SOS triggers, digital identification, a centralized command center for real-time incident tracking, and the Suraksha Chatbot for instant traveler assistance.",
    image: "/surakshasetu.png",
    tech: ["React", "Node.js", "Express.js", "MongoDB", "TypeScript", "AI Chatbot"],
    github: "https://github.com/SubhamKhandual007/Suraksha-Setu",
    live: "https://suraksha-setu-oxkw.vercel.app"
  },
  {
    title: "SuuSri AI PPT Generator",
    description: "An intelligent, automated presentation platform that generates professional, highly optimized PowerPoint slides from custom topics and prompts, powered by high-speed Groq and Gemini models.",
    image: "/suusriai.png",
    tech: ["Python", "Flask", "Gemini AI", "Groq AI", "Bootstrap"],
    github: "https://github.com/SubhamKhandual007/ppt-generator",
    live: "https://ppt-generator-seven-mu.vercel.app"
  }
];

const Projects = () => {
  return (
    <section id="projects" className={styles.projectsSection}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className={styles.header}
        >
          <h2 className="section-title">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className={styles.subtitle}>
            A selection of my recent full-stack and backend engineering work.
          </p>
        </motion.div>

        <div className={styles.grid}>
          {projects.map((project, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: idx * 0.1 }}
              className={`${styles.card} glass`}
            >
              <div className={styles.imageContainer}>
                <img src={project.image} alt={project.title} className={styles.image} />
                <div className={styles.overlay}>
                  <div className={styles.links}>
                    <a href={project.github} className={styles.iconLink}><Code size={20} /></a>
                    <a href={project.live} className={styles.iconLink}><ExternalLink size={20} /></a>
                  </div>
                </div>
              </div>

              <div className={styles.content}>
                <div className={styles.titleRow}>
                  <Code className={styles.projectIcon} />
                  <h3>{project.title}</h3>
                </div>
                
                <p className={styles.description}>{project.description}</p>
                
                <div className={styles.techStack}>
                  {project.tech.map((tech, tIdx) => (
                    <span key={tIdx} className="badge">{tech}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
