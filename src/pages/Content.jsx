import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Content.css";
import { API_BASE_URL } from "../apiConfig";

export default function Content() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, sending, success, error
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsRevealed(true);
      },
      { threshold: 0 }
    );

    const el = document.getElementById('contact');
    if (el) observer.observe(el);

    const handleReTrigger = () => {
      setIsRevealed(false);
      setTimeout(() => setIsRevealed(true), 50);
    };

    window.addEventListener('re-trigger-contact-animation', handleReTrigger);
    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('re-trigger-contact-animation', handleReTrigger);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error(data.error || "Failed to send message");
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const contactInfo = [
    { label: "Address", value: "Tiruppur, Tamil Nadu, India", icon: "📍" },
    { label: "Contact Number", value: "+91 97893 54336", icon: "📞" },
    { label: "Email Address", value: "sivakumarbca2021@gmail.com", icon: "📧" },
    { label: "Website", value: "siva-portfolio.vercel.app", icon: "🌐" }
  ];

  return (
    <div className={`iris-reveal-wrapper ${isRevealed ? 'open' : ''}`}>
      <div className="mesh-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <section className={`contact-section snap-section page-wrap ${isRevealed ? 'reveal' : ''}`} id="contact">
        <div className="section-head">
          <span className="section-subtitle">Contact</span>
          <h2 className="section-title">Contact Me</h2>
        </div>

        <div className="contact-grid">
          <div className="contact-info-column">
            {contactInfo.map((info, i) => (
              <div key={i} className="info-box" style={{ "--i": i }}>
                <div className="info-icon">{info.icon}</div>
                <div className="info-content">
                  <h4 className="info-label">{info.label}</h4>
                  <p className="info-value">{info.value}</p>
                </div>
              </div>
            ))}

            <div className="social-links-section">
              <h4 className="social-title">Connect with me</h4>
              <div className="social-links">
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="social-icon-link">
                  <img src="/social/github.png" alt="GitHub" />
                </a>
                <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="social-icon-link">
                  <img src="/social/linkedin.png" alt="LinkedIn" />
                </a>
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="social-icon-link">
                  <img src="/social/twitter.png" alt="Twitter" />
                </a>
                <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="social-icon-link">
                  <img src="/social/instagram.png" alt="Instagram" />
                </a>
                <a href="mailto:sivakumarbca2021@gmail.com" className="social-icon-link">
                  <img src="/social/gmail.png" alt="Gmail" />
                </a>
              </div>
            </div>
          </div>

          <div className="contact-form-column">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  disabled={status === "sending"}
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={status === "sending"}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={status === "sending"}
                />
              </div>
              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Message"
                  rows="7"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  disabled={status === "sending"}
                ></textarea>
              </div>
              <button
                type="submit"
                className={`form-submit-btn ${status === "sending" ? "sending" : ""}`}
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending..." : "Send Message"}
              </button>

              {status === "success" && <p className="status-msg success">Message sent successfully!</p>}
              {status === "error" && <p className="status-msg error">Sent via Mail App (EmailJS not configured).</p>}
            </form>
          </div>
        </div>

        <Link to="/admin/login" className="admin-lock-link" aria-label="Admin Login">
          <span className="lock-icon">🔒</span>
        </Link>
      </section>
    </div>
  );
}
