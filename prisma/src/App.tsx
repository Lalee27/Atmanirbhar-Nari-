import React, { useState, useEffect } from 'react';

// FadeIn component
const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}> = ({ children, delay = 0, duration = 1000, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
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
const AnimatedHeading: React.FC<{
  text: string;
  className?: string;
}> = ({ text, className = '' }) => {
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartAnimation(true);
    }, 200); // initial delay
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
              // The exact spec says: (lineIndex * lineLength * charDelay) + (charIndex * charDelay)
              // but standardizing to global index is usually what is intended for a smooth flow.
              // I will stick to global index for simplicity and a perfect sequential stagger.
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

export default function App() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black flex flex-col font-sans">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4"
      />

      {/* Navbar Content (z-10 to stay above video) */}
      <div className="relative z-10 px-6 md:px-12 lg:px-16 pt-6">
        <nav className="liquid-glass rounded-xl px-4 py-2 flex items-center justify-between">
          <div className="text-2xl font-semibold tracking-tight">VEX</div>
          
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#" className="hover:text-gray-300 transition-colors">Story</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Investing</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Building</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Advisory</a>
          </div>

          <button className="bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
            Start a Chat
          </button>
        </nav>
      </div>

      {/* Hero Content (Bottom) */}
      <div className="relative z-10 px-6 md:px-12 lg:px-16 flex-1 flex flex-col justify-end pb-12 lg:pb-16">
        <div className="lg:grid lg:grid-cols-2 lg:items-end w-full">
          
          {/* Left Column */}
          <div className="flex flex-col mb-8 lg:mb-0">
            <AnimatedHeading 
              text={"Shaping tomorrow\nwith vision and action."} 
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal mb-4"
            />
            
            <FadeIn delay={800} duration={1000}>
              <p className="text-base md:text-lg text-gray-300 mb-5">
                We back visionaries and craft ventures that define what comes next.
              </p>
            </FadeIn>
            
            <FadeIn delay={1200} duration={1000}>
              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  Start a Chat
                </button>
                <button className="liquid-glass border border-white/20 text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition-colors">
                  Explore Now
                </button>
              </div>
            </FadeIn>
          </div>

          {/* Right Column */}
          <div className="flex items-end justify-start lg:justify-end">
            <FadeIn delay={1400} duration={1000}>
              <div className="liquid-glass border border-white/20 px-6 py-3 rounded-xl">
                <span className="text-lg md:text-xl lg:text-2xl font-light">
                  Investing. Building. Advisory.
                </span>
              </div>
            </FadeIn>
          </div>

        </div>
      </div>
    </div>
  );
}
