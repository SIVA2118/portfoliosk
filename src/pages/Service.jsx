import React, { useEffect, useState } from "react";
import "./Service.css";

import { API_BASE_URL } from "../apiConfig";

export default function Service() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/services`);
        const data = await response.json();
        if (data.success) {
          setServices(data.data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsRevealed(true);
      },
      { threshold: 0 }
    );

    const el = document.getElementById('service');
    if (el) observer.observe(el);

    const handleReTrigger = () => {
      setIsRevealed(false);
      setTimeout(() => setIsRevealed(true), 50);
    };

    window.addEventListener('re-trigger-service-animation', handleReTrigger);
    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('re-trigger-service-animation', handleReTrigger);
    };
  }, []);

  return (
    <div className={`iris-reveal-wrapper ${isRevealed ? 'open' : ''}`}>
      <div className="mesh-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <section className={`service-section snap-section page-wrap ${isRevealed ? 'reveal' : ''}`} id="service">
        <div className="section-head">
          <span className="section-subtitle">Service</span>
          <h2 className="section-title">What I Do</h2>
        </div>

        <div className="service-grid">
          {services.map((service, i) => (
            <div key={service._id || i} className="service-card" style={{ "--i": i }}>
              <div className="card-number">0{i + 1}</div>
              <div className="card-inner">
                <div className="service-icon-box">{service.icon}</div>
                <h3 className="card-title">{service.title}</h3>
                <p className="card-desc">{service.desc}</p>
                <div className="card-footer">
                  <span className="read-more">Learn More</span>
                  <div className="footer-line"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
