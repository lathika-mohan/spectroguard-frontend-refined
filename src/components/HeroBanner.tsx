import React from 'react';

interface HeroBannerProps {
  onExploreClick?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreClick }) => {
  return (
    <div 
      id="hero-banner-section"
      className="relative w-full rounded-2xl min-h-[220px] sm:min-h-[240px] px-6 sm:px-10 py-6 liquid-glass-hero overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-white/15 transition-all duration-300"
    >

      {/* Background Ambient Lights */}
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-blue-900/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 right-1/3 w-64 h-64 bg-blue-950/40 rounded-full blur-3xl pointer-events-none" />

      {/* Left Text Content */}
      <div className="relative z-10 max-w-xl space-y-3 py-2 text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight font-['SF_Pro_Display']">
          <span className="block">Surveillance Integrity</span>
          <span className="block text-blue-400/90">Command Center</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 font-medium font-['SF_Pro_Text'] tracking-wide opacity-90">
          Curated. Verified. Integrated
        </p>

        {onExploreClick && (
          <button
            onClick={() => {
              const elem = document.getElementById('on-demand-verification-card');
              if (elem) {
                elem.scrollIntoView({ behavior: 'smooth' });
              } else if (onExploreClick) {
                onExploreClick();
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-900/50 border border-blue-400/30 font-['SF_Pro_Text']"
          >
            Run Analysis
          </button>
        )}
      </div>

      {/* Right Visual: Properly Sized Globe within Card */}
      <div className="relative shrink-0 w-48 sm:w-56 md:w-64 h-48 sm:h-52 md:h-56 flex items-center justify-center pointer-events-none my-0">
        
        {/* Soft Ambient Dark Blue Radial Backlight */}
        <div className="absolute w-40 h-40 sm:w-48 sm:h-48 bg-blue-900/35 rounded-full blur-2xl animate-pulse-glow" />

        {/* Liquid Glass Sphere Container - Proper Balanced Size */}
        <div className="relative w-38 h-38 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full flex items-center justify-center backdrop-blur-md bg-gradient-to-br from-blue-950/40 via-slate-900/60 to-blue-900/60 border border-white/20 shadow-[inset_-6px_-6px_20px_rgba(0,0,0,0.7),inset_6px_6px_20px_rgba(255,255,255,0.15),0_0_30px_rgba(30,58,138,0.4)] overflow-hidden">
          
          {/* Glass Lens Specular Highlight Reflection */}
          <div className="absolute top-2 left-6 w-28 h-12 bg-gradient-to-b from-white/25 via-white/5 to-transparent rounded-full transform -rotate-45 blur-[1px] pointer-events-none" />

          {/* 3D Wireframe Globe SVG - Sized neatly inside card */}
          <svg viewBox="0 0 200 200" className="w-32 h-32 sm:w-38 sm:h-38 md:w-42 md:h-42 text-blue-400 fill-none stroke-current opacity-95">
            <defs>
              <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                <stop offset="70%" stopColor="#1e3a8a" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#030712" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#1d4ed8" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Inner Glow Field */}
            <circle cx="100" cy="100" r="70" fill="url(#globeGlow)" />

            {/* Main Outer Sphere Meridian */}
            <circle cx="100" cy="100" r="70" className="stroke-blue-400/50 stroke-[1.5]" />

            {/* Latitude Ellipses */}
            <ellipse cx="100" cy="100" rx="70" ry="25" className="stroke-blue-400/70 stroke-[1.2]" />
            <ellipse cx="100" cy="100" rx="70" ry="50" className="stroke-blue-400/60 stroke-[1.2]" />
            <ellipse cx="100" cy="65" rx="55" ry="18" className="stroke-indigo-400/50 stroke-[1]" />
            <ellipse cx="100" cy="135" rx="55" ry="18" className="stroke-indigo-400/50 stroke-[1]" />

            {/* Longitude Ellipses */}
            <ellipse cx="100" cy="100" rx="25" ry="70" className="stroke-blue-400/70 stroke-[1.2]" />
            <ellipse cx="100" cy="100" rx="50" ry="70" className="stroke-blue-400/60 stroke-[1.2]" />

            {/* Glowing Intersecting Nodes */}
            <circle cx="100" cy="75" r="3" className="fill-cyan-300 shadow-lg" />
            <circle cx="145" cy="100" r="2.5" className="fill-blue-300" />
            <circle cx="55" cy="100" r="2.5" className="fill-blue-300" />
            <circle cx="100" cy="125" r="3" className="fill-cyan-300" />
            <circle cx="125" cy="50" r="2" className="fill-indigo-300" />
            <circle cx="75" cy="150" r="2" className="fill-indigo-300" />

            {/* Floating Particle Stars */}
            <circle cx="35" cy="45" r="1.5" className="fill-white animate-pulse" />
            <circle cx="165" cy="155" r="1.5" className="fill-cyan-400 animate-pulse" />
            <circle cx="160" cy="40" r="1" className="fill-blue-300" />
            <circle cx="40" cy="160" r="1" className="fill-blue-300" />
          </svg>

          {/* Orbiting Ring 1 */}
          <div className="absolute inset-0 flex items-center justify-center animate-slow-rotate pointer-events-none">
            <svg viewBox="0 0 200 200" className="w-44 h-44 sm:w-50 sm:h-50 md:w-54 md:h-54 text-blue-400 fill-none">
              <ellipse cx="100" cy="100" rx="88" ry="32" transform="rotate(-25 100 100)" className="stroke-blue-400/85 stroke-[2] [stroke-dasharray:12_6]" />
              <circle cx="178" cy="62" r="3.5" className="fill-cyan-300 shadow-[0_0_10px_#38bdf8]" />
            </svg>
          </div>

          {/* Orbiting Ring 2 */}
          <div className="absolute inset-0 flex items-center justify-center animate-reverse-rotate pointer-events-none">
            <svg viewBox="0 0 200 200" className="w-44 h-44 sm:w-50 sm:h-50 md:w-54 md:h-54 text-indigo-400 fill-none">
              <ellipse cx="100" cy="100" rx="84" ry="28" transform="rotate(35 100 100)" className="stroke-indigo-400/75 stroke-[1.5] [stroke-dasharray:8_4]" />
              <circle cx="20" cy="130" r="3" className="fill-indigo-300 shadow-[0_0_10px_#818cf8]" />
            </svg>
          </div>

        </div>

      </div>

    </div>
  );
};



