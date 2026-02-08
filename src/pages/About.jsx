import React, { useEffect, useState } from "react";
import "./About.css";
import profileImg from "../assets/profile.jpg";
import { API_BASE_URL } from "../apiConfig";

export default function About() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/about`);
        const data = await response.json();
        if (data.success && data.data) {
          setAboutData(data.data);
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    };

    fetchAbout();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsRevealed(true);
      },
      { threshold: 0 }
    );

    const el = document.getElementById('about');
    if (el) observer.observe(el);

    const handleReTrigger = () => {
      setIsRevealed(false);
      setTimeout(() => setIsRevealed(true), 50);
    };

    window.addEventListener('re-trigger-about-animation', handleReTrigger);
    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('re-trigger-about-animation', handleReTrigger);
    };
  }, []);

  const details = aboutData ? [
    { label: "Name", value: aboutData.name },
    { label: "Degree", value: aboutData.degree },
    { label: "Phone", value: aboutData.phone },
    { label: "Email", value: aboutData.email },
    { label: "Address", value: aboutData.address },
    { label: "Freelance", value: aboutData.freelance }
  ] : [];

  const bio = aboutData ? aboutData.bio : (isRevealed ? "Failed to load biography. Please try again later." : "Loading...");

  return (
    <div className={`iris-reveal-wrapper ${isRevealed ? 'open' : ''}`}>
      <div className="mesh-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <section className={`about-section snap-section page-wrap ${isRevealed ? 'reveal' : ''}`} id="about">
        <div className="about-grid">
          <div className="about-left">
            <div className="img-wrapper">
              <img src={(aboutData && aboutData.profileImage) ? aboutData.profileImage : profileImg} alt="Sivakumar" className="about-img" />
              <div className="img-border"></div>
            </div>
          </div>

          <div className="about-right">
            <div className="about-content">
              <span className="section-subtitle">About Me</span>
              <h2 className="section-title">Professional Profile</h2>
              <p className="bio-text">
                {bio}
              </p>

              <div className="details-list">
                {details.map((item, i) => (
                  <div key={i} className="detail-item" style={{ "--i": i }}>
                    <span className="label">{item.label}:</span>
                    <span className="value">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="about-ctas">
                <a href={(aboutData && aboutData.resumeLink) ? aboutData.resumeLink : "/resume.pdf"} className="btn primary" target="_blank" rel="noreferrer">Resume</a>
                <button className="btn ghost" onClick={() => window.lenis.scrollTo('#service')}>My Services</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
