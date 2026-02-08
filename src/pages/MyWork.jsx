import React, { useEffect, useState } from "react";
import "./MyWork.css";
import { API_BASE_URL } from "../apiConfig";



export default function MyWork() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [filter, setFilter] = useState("All");
  const [projects, setProjects] = useState([]);


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        const data = await response.json();
        if (data.success) {
          setProjects(data.data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsRevealed(true);
      },
      { threshold: 0 }
    );

    const el = document.getElementById('my-work');
    if (el) observer.observe(el);

    const handleReTrigger = () => {
      setIsRevealed(false);
      setTimeout(() => setIsRevealed(true), 50);
    };

    window.addEventListener('re-trigger-my-work-animation', handleReTrigger);
    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('re-trigger-my-work-animation', handleReTrigger);
    };
  }, []);

  const filteredProjects = filter === "All"
    ? projects
    : projects.filter(p => p.category === filter);

  const categories = ["All", "Design", "Development"];


  return (
    <div className={`iris-reveal-wrapper ${isRevealed ? 'open' : ''}`}>
      <div className="mesh-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <section className={`portfolio-section snap-section page-wrap ${isRevealed ? 'reveal' : ''}`} id="my-work">
        <div className="section-head">
          <span className="section-subtitle">Portfolio</span>
          <h2 className="section-title">My Projects</h2>
        </div>

        <div className="filter-tabs">
          {categories.map((cat, i) => (
            <button
              key={i}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="portfolio-grid">
          {filteredProjects.map((p, i) => (
            <div className="portfolio-item" key={p._id || i} style={{ "--i": i }}>
              <div className="item-inner">
                <img src={p.image} alt={p.title} className="item-img" />
                <div className="item-overlay">
                  <div className="overlay-content">
                    <h3 className="item-title">{p.title}</h3>
                    <p className="item-cat">{p.category}</p>
                    <a href={p.link} target="_blank" rel="noreferrer" className="view-btn">
                      <i className="plus-icon">+</i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
