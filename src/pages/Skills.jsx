import React, { useEffect, useState } from "react";
import "./Skills.css";

import { API_BASE_URL } from "../apiConfig";

export default function Skills() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/skills`);
        const data = await response.json();
        if (data.success) {
          setSkills(data.data);
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    fetchSkills();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsRevealed(true);
      },
      { threshold: 0 }
    );

    const el = document.getElementById('skills');
    if (el) observer.observe(el);

    const handleReTrigger = () => {
      setIsRevealed(false);
      setTimeout(() => setIsRevealed(true), 50);
    };

    window.addEventListener('re-trigger-skills-animation', handleReTrigger);
    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('re-trigger-skills-animation', handleReTrigger);
    };
  }, []);

  return (
    <div className={`iris-reveal-wrapper ${isRevealed ? 'open' : ''}`}>
      <div className="mesh-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <section className={`skills-section snap-section page-wrap ${isRevealed ? 'reveal' : ''}`} id="skills">
        <div className="section-head">
          <span className="section-subtitle">Abilities</span>
          <h2 className="section-title">My Skills</h2>
        </div>

        <div className="marquee-container">
          <div className="marquee-track">
            {/* Double the list for seamless looping */}
            {[...skills, ...skills, ...skills].map((skill, i) => (
              <div className="skill-item marquee-item" key={skill._id || i} style={{ "--i": i }}>
                <div className="skill-content">
                  {skill.icon && <img src={skill.icon} alt={skill.name} className="skill-icon" />}
                  <span className="skill-name">{skill.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
