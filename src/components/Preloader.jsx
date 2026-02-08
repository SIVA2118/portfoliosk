import React, { useEffect, useState } from 'react';
import './Preloader.css';
import profileImg from '../assets/profile.jpg'; // Using the source image for best quality

export default function Preloader({ onComplete }) {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Show the animation for 3 seconds total
        const timer = setTimeout(() => {
            setIsExiting(true);
            // Wait for exit animation to finish
            setTimeout(() => {
                if (onComplete) onComplete();
            }, 800);
        }, 2800);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className={`preloader-overlay ${isExiting ? 'exit' : ''}`}>
            <div className="bubbles-container">
                <div className="big-blob big-blob-1"></div>
                <div className="big-blob big-blob-2"></div>
                <div className="big-blob big-blob-3"></div>
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className={`mini-bubble bubble-${i + 1}`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`
                        }}
                    ></div>
                ))}
            </div>
            <div className="preloader-content">
                <div className="framed-image-container">
                    <div className="frame-border"></div>
                    <div className="image-wrapper">
                        <img src={profileImg} alt="Sivakumar" className="preloader-img" />
                    </div>
                </div>
                <div className="loading-bar-container">
                    <div className="loading-progress"></div>
                </div>
                <div className="preloader-text">
                    <span className="char">S</span>
                    <span className="char">I</span>
                    <span className="char">V</span>
                    <span className="char">A</span>
                    <span className="char">K</span>
                    <span className="char">U</span>
                    <span className="char">M</span>
                    <span className="char">A</span>
                    <span className="char">R</span>
                </div>
            </div>
        </div>
    );
}
