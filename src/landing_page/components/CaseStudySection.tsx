import React from 'react';
import shieldImg from '../assets/images/shield_security_3d_1785527520265.jpg';

export function CaseStudySection() {
  return (
    <section id="architecture" className="w-full bg-transparent text-white border-t border-white/10 py-20 px-4 sm:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-[#8CB8FF] font-semibold text-xs sm:text-sm tracking-widest uppercase mb-3 block">
            Camera Integrity Intelligence
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white leading-[1.12] max-w-4xl">
            Protecting Surveillance Systems <span className="text-[#C9D7EA]">Beyond Traditional Video Analytics</span>
          </h2>
        </div>

        {/* 2-Column Card Layout matching reference */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Card: Cyber Shield Image (4 cols on lg) */}
          <div className="lg:col-span-4 w-full h-[380px] lg:h-auto min-h-[380px] bg-white/[0.07] border border-white/15 rounded-[22px] overflow-hidden shadow-2xl relative group">
            <img
              src={shieldImg}
              alt="SpectraGuard Camera Integrity Intelligence Shield"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            {/* Subtle Gradient overlay at bottom of photo card */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Right Card: Quote, Metrics & Signature with Blue Color Gradient (8 cols on lg) */}
          <div className="lg:col-span-8 w-full bg-white/[0.07] backdrop-blur-xl border border-white/15 rounded-[22px] p-8 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            {/* Blue Color Gradient Background replacing orange */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#0066FF]/35 via-[#003399]/15 to-transparent pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-[#0066FF]/20 rounded-full blur-[90px] pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
              {/* Top Quote in Uppercase */}
              <div>
                <p className="text-base sm:text-lg md:text-xl font-semibold tracking-tight text-white/95 uppercase leading-relaxed">
                  « SPECTRAGUARD REDEFINES SURVEILLANCE BY VERIFYING CAMERA INTEGRITY BEFORE VIDEO ANALYTICS. USING PHYSICS-INFORMED SPECTRAL ANALYSIS AND EXPLAINABLE AI, IT DETECTS CAMERA TAMPERING IN REAL TIME WHILE PROVIDING TRANSPARENT FORENSIC EVIDENCE FOR EVERY DECISION. »
                </p>
              </div>

              {/* Middle Metrics Row */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-4 pb-2 border-t border-b border-white/10">
                <div>
                  <span className="block text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
                    &lt;200ms
                  </span>
                  <span className="block text-[11px] sm:text-xs text-[#C9D7EA] uppercase tracking-wider mt-1.5 font-medium">
                    &lt;Benchmark&gt; Response Time
                  </span>
                </div>

                <div>
                  <span className="block text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
                    99.8%
                  </span>
                  <span className="block text-[11px] sm:text-xs text-[#C9D7EA] uppercase tracking-wider mt-1.5 font-medium">
                    &lt;Benchmark&gt; Detection Accuracy
                  </span>
                </div>

                <div>
                  <span className="block text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
                    12.5X
                  </span>
                  <span className="block text-[11px] sm:text-xs text-[#C9D7EA] uppercase tracking-wider mt-1.5 font-medium">
                    &lt;Benchmark&gt; Operational Impact
                  </span>
                </div>
              </div>

              {/* Bottom Author Signature */}
              <div>
                <span className="block text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  — SPECTRAGUARD
                </span>
                <span className="block text-xs sm:text-sm text-[#C9D7EA] mt-0.5">
                  AI-Powered Camera Integrity Intelligence Platform
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

