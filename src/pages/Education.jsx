import React, { useEffect, useState } from "react";
import "./Education.css";

import { API_BASE_URL } from "../apiConfig";

export default function Education() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [eduData, setEduData] = useState([]);
  const [expData, setExpData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/education`);
        const data = await response.json();
        if (data.success) {
          setEduData(data.data.filter(item => item.type === 'education'));
          setExpData(data.data.filter(item => item.type === 'experience'));
        }
      } catch (error) {
        console.error('Error fetching education data:', error);
      }
    };

    fetchData();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsRevealed(true);
      },
      { threshold: 0 }
    );

    const el = document.getElementById('education');
    if (el) observer.observe(el);

    const handleReTrigger = () => {
      setIsRevealed(false);
      setTimeout(() => setIsRevealed(true), 50);
    };

    window.addEventListener('re-trigger-education-animation', handleReTrigger);
    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('re-trigger-education-animation', handleReTrigger);
    };
  }, []);

  const education = eduData.length > 0 ? eduData : [];
  const experience = expData.length > 0 ? expData : [];

  return (
    <div className={`iris-reveal-wrapper ${isRevealed ? 'open' : ''}`}>
      <div className="mesh-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <section className={`education-section snap-section page-wrap ${isRevealed ? 'reveal' : ''}`} id="education">
        <div className="section-head">
          <span className="section-subtitle">Quality</span>
          <h2 className="section-title">Summary</h2>
        </div>

        <div className="quality-grid">
          <div className="quality-column">
            <h3 className="column-title">Education</h3>
            <div className="timeline-container">
              {education.map((item, i) => (
                <div key={i} className="timeline-card" style={{ "--i": i }}>
                  <div className="timeline-dot"></div>
                  <h4 className="card-title">{item.title}</h4>
                  <p className="card-meta">{item.institution} | {item.year}</p>
                  <p className="card-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="quality-column">
            <h3 className="column-title">Experience</h3>
            <div className="timeline-container">
              {experience.map((item, i) => (
                <div key={i} className="timeline-card" style={{ "--i": i + 2 }}>
                  <div className="timeline-dot"></div>
                  <h4 className="card-title">{item.title}</h4>
                  <p className="card-meta">{item.institution} | {item.year}</p>
                  <p className="card-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
