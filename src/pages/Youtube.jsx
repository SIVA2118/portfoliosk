import React, { useEffect, useState } from "react";
import "./Youtube.css";

import { API_BASE_URL } from "../apiConfig";

export default function Youtube() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [ytData, setYtData] = useState([]);

  useEffect(() => {
    const fetchYoutube = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/youtube`);
        const data = await response.json();
        if (data.success) {
          setYtData(data.data);
        }
      } catch (error) {
        console.error('Error fetching youtube data:', error);
      }
    };

    fetchYoutube();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsRevealed(true);
      },
      { threshold: 0 }
    );

    const el = document.getElementById('youtube');
    if (el) observer.observe(el);

    const handleReTrigger = () => {
      setIsRevealed(false);
      setTimeout(() => setIsRevealed(true), 50);
    };

    window.addEventListener('re-trigger-youtube-animation', handleReTrigger);
    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('re-trigger-youtube-animation', handleReTrigger);
    };
  }, []);

  return (
    <div className={`iris-reveal-wrapper ${isRevealed ? 'open' : ''}`}>
      <div className="mesh-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <section className={`youtube-section snap-section page-wrap ${isRevealed ? 'reveal' : ''}`} id="youtube">
        <div className="section-head">
          <span className="section-subtitle">Channel</span>
          <h2 className="section-title">YouTube</h2>
        </div>

        <div className="youtube-grid">
          {ytData.map((video, i) => (
            <a
              key={i}
              href={video.link}
              target="_blank"
              rel="noreferrer"
              className="youtube-card"
              style={{ "--i": i }}
            >
              <div className="youtube-thumb" style={{ backgroundImage: `url(${video.thumbnail || ''})` }}>
                <div className="play-btn-box">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"></path>
                  </svg>
                </div>
              </div>

              <div className="youtube-info">
                <h3 className="yt-card-title">{video.title}</h3>
                <p className="yt-card-desc">{video.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
