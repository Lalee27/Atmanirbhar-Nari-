import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AIChatPopup from './AIChatPopup';

// FadeIn component
const FadeIn = ({ children, delay = 0, duration = 1000, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-opacity ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
};

// AnimatedHeading component
const AnimatedHeading = ({ text, className = '' }) => {
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStartAnimation(true), 200); 
    return () => clearTimeout(timer);
  }, []);

  const lines = text.split('\n');
  let globalCharIndex = 0;
  const charDelay = 30; // ms

  return (
    <h1 className={className} style={{ letterSpacing: '-0.04em' }}>
      {lines.map((line, lineIndex) => {
        return (
          <div key={lineIndex} className="whitespace-nowrap">
            {line.split('').map((char, charIndex) => {
              const delay = globalCharIndex * charDelay;
              globalCharIndex++;
              
              const isSpace = char === ' ';
              const displayChar = isSpace ? '\u00A0' : char;

              return (
                <span
                  key={charIndex}
                  className="inline-block"
                  style={{
                    opacity: startAnimation ? 1 : 0,
                    transform: startAnimation ? 'translateX(0)' : 'translateX(-18px)',
                    transition: `opacity 500ms ease ${delay}ms, transform 500ms ease ${delay}ms`,
                  }}
                >
                  {displayChar}
                </span>
              );
            })}
          </div>
        );
      })}
    </h1>
  );
};

export default function Hero() {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <header className="relative w-full h-screen min-h-screen overflow-hidden bg-black flex flex-col font-sans -mt-28">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4"
      />
      
      {/* Gradient overlay to ensure text is readable if needed, though original spec requested no overlay, 
          the Aatmnirbhar Nari text might need slight contrast at the bottom */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      {/* Hero Content (Bottom) */}
      <div className="relative z-10 px-6 md:px-12 lg:px-16 flex-1 flex flex-col justify-end pb-24 md:pb-16 lg:pb-20 text-white">
        <div className="lg:grid lg:grid-cols-2 lg:items-end w-full">
          
          {/* Left Column */}
          <div className="flex flex-col mb-8 lg:mb-0">
            <AnimatedHeading 
              text={"Shaping tomorrow\nwith vision and action."} 
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal mb-4"
            />
            
            <FadeIn delay={800} duration={1000}>
              <p className="text-base md:text-lg text-gray-300 mb-5 max-w-lg">
                We back visionaries and craft ventures that define what comes next.
              </p>
            </FadeIn>
            
            <FadeIn delay={1200} duration={1000}>
              <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/register" 
              className="btn-bright px-8 py-4 rounded-full font-button-text text-button-text transition-all active:scale-95 text-center flex items-center justify-center"
            >
              Start Your Journey
            </Link>
                <button 
                  onClick={() => navigate('/learning')}
                  className="liquid-glass border border-black/10 text-black px-8 py-3 rounded-lg font-medium hover:bg-black hover:text-white transition-colors cursor-pointer"
                >
                  Explore Now
                </button>
              </div>
            </FadeIn>
          </div>

          {/* Right Column */}
          <div className="flex items-end justify-start lg:justify-end">
            <FadeIn delay={1400} duration={1000}>
              <div 
                onClick={() => setIsChatOpen(true)}
                className="liquid-glass border border-white/20 px-5 py-4 rounded-3xl flex items-center gap-4 hover:scale-105 transition-all cursor-pointer shadow-xl group"
              >
                <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">smart_toy</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2 mb-0.5">
                    Nari Shakti AI
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  </div>
                  <div className="text-xs text-white/90 font-medium">Click to chat with me!</div>
                </div>
              </div>
            </FadeIn>
          </div>

        </div>
      </div>
      <AIChatPopup isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </header>
  );
}
