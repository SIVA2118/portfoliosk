import React, { useEffect, useState, useRef, useMemo } from "react";
import "./Home.css";
import { API_BASE_URL } from "../apiConfig";

export default function Home() {
  const heroRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [roleText, setRoleText] = useState("");
  const [aboutData, setAboutData] = useState(null);
  const roles = useMemo(() => (aboutData && aboutData.roles && aboutData.roles.length > 0)
    ? aboutData.roles
    : ["Full Stack Developer", "MCA Student", "UI/UX Designer"], [aboutData]);
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [delta, setDelta] = useState(150);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/about`);
        const data = await response.json();
        if (data.success && data.data) {
          setAboutData(data.data);
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      }
    };

    fetchHome();

    // Initial reveal
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 100);

    const handleScrollReveal = () => {
      if (window.scrollY > 10) {
        setIsRevealed(true);
      }
    };

    const handleReTrigger = () => {
      setIsRevealed(false);
      setTimeout(() => setIsRevealed(true), 50);
    };

    window.addEventListener('scroll', handleScrollReveal);
    window.addEventListener('re-trigger-home-animation', handleReTrigger);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScrollReveal);
      window.removeEventListener('re-trigger-home-animation', handleReTrigger);
    };
  }, []);

  useEffect(() => {
    const tick = () => {
      let i = roleIndex % roles.length;
      let fullText = roles[i];
      let updatedText = isDeleting
        ? fullText.substring(0, roleText.length - 1)
        : fullText.substring(0, roleText.length + 1);

      setRoleText(updatedText);

      if (isDeleting) {
        setDelta(prevDelta => prevDelta / 2);
      }

      if (!isDeleting && updatedText === fullText) {
        setIsDeleting(true);
        setDelta(2000); // Wait before deleting
      } else if (isDeleting && updatedText === "") {
        setIsDeleting(false);
        setRoleIndex(roleIndex + 1);
        setDelta(200);
      }
    };

    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => clearInterval(ticker);
  }, [roleText, delta, isDeleting, roleIndex, roles]);

  return (
    <div className={`iris-reveal-wrapper ${isRevealed ? 'open' : ''}`}>
      <div className="mesh-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <section className={`home-hero snap-section page-wrap ${isRevealed ? 'reveal' : ''}`} id="home" ref={heroRef}>
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-intro">
              <span className="greeting">Welcome to my Portfolio</span>
              <h1 className="name">
                I'm <span className="highlight">Sivakumar</span>
              </h1>
              <h2 className="role-typing">
                I am a <span className="typewriter-text">{roleText}<span className="cursor">|</span></span>
              </h2>
              <p className="description">
                {(aboutData && aboutData.homeDescription)
                  ? aboutData.homeDescription
                  : "I am a passionate MCA student and Full Stack Developer specialized in building modern, scalable, and user-centric web applications."}
              </p>
              <div className="cta-group">
                <button className="btn primary" onClick={() => window.lenis.scrollTo('#my-work')}>Hire Me</button>
                <button className="btn ghost" onClick={() => window.lenis.scrollTo('#contact')}>Contact Me</button>
              </div>

            </div>
          </div>

          <div className="hero-right">
            <div className="image-container">
              <div className="image-backdrop"></div>
              <img
                src="/images/profile.png"
                alt="Sivakumar"
                className="main-profile-img"
              />
              <div className="stats-box">
                <div className="stats-inner">
                  <span className="number">2+</span>
                  <span className="label">Years of<br />Learning</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-divider"></div>
      </section >
    </div >
  );
}
