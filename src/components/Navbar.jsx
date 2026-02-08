import React, { useState, useEffect } from 'react';
import './Navbar.css';

const navLinks = [
  { name: 'Home', id: 'home' },
  { name: 'About', id: 'about' },
  { name: 'Education', id: 'education' },
  { name: 'Skills', id: 'skills' },
  { name: 'My Work', id: 'my-work' },
  { name: 'YouTube', id: 'youtube' },
  { name: 'Services', id: 'service' },
  { name: 'Contact', id: 'contact' },
];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');



  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScrollState = (s) => {
      const scrollY = typeof s === 'number' ? s : window.scrollY;
      setScrolled(scrollY > 20);
    };

    window.addEventListener('scroll', handleScrollState);

    // Sync with Lenis
    let lenisUnsubscribe;
    const checkLenis = setInterval(() => {
      if (window.lenis) {
        lenisUnsubscribe = window.lenis.on('scroll', (e) => {
          handleScrollState(e.scroll);
        });
        clearInterval(checkLenis);
      }
    }, 100);

    const sections = navLinks.map(link => document.getElementById(link.id));
    const observerOptions = {
      root: null,
      threshold: 0.2,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      window.removeEventListener('scroll', handleScrollState);
      if (lenisUnsubscribe) lenisUnsubscribe();
      clearInterval(checkLenis);
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const handleClick = (id) => {
    if (window.lenis) {
      setOpen(false);
      setActiveSection(id);
      window.lenis.scrollTo(`#${id}`, {
        offset: -70,
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    } else {
      const element = document.getElementById(id);
      if (element) {
        setOpen(false);
        setActiveSection(id);
        const offset = 70;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }

    // Re-trigger animations
    const eventName = `re-trigger-${id}-animation`;
    window.dispatchEvent(new CustomEvent(eventName));
  };

  const leftLinks = navLinks.slice(0, 4);
  const rightLinks = navLinks.slice(4);

  const isHomeTop = activeSection === 'home' && !scrolled;

  return (
    <header className={`navbar ${open ? 'open' : ''} ${scrolled ? 'scrolled' : ''} ${isHomeTop ? 'hidden' : ''}`}>
      <div className="nav-inner">
        {/* Desktop Left Links */}
        <nav className="nav-links desktop-only">
          {leftLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={activeSection === link.id ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleClick(link.id);
              }}
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="brand">
          <a href="#home" onClick={(e) => { e.preventDefault(); handleClick('home'); }}>SIVAKUMAR<span>.</span></a>
        </div>

        {/* Desktop Right Links */}
        <nav className="nav-links desktop-only">
          {rightLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={activeSection === link.id ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleClick(link.id);
              }}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Mobile Menu (Hidden on Desktop) */}
        <nav className={`mobile-nav ${open ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <a
              key={`mobile-${link.id}`}
              href={`#${link.id}`}
              className={activeSection === link.id ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleClick(link.id);
              }}
            >
              {link.name}
            </a>
          ))}
        </nav>

        <button className="nav-toggle" onClick={() => setOpen(v => !v)} aria-label="Toggle navigation">
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
