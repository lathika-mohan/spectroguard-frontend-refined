import React from 'react';

export function AboutSpectraSection() {
  const cards = [
    {
      badge: 'Analysis',
      title: 'Bold strategies that secure video frames',
      description: 'Physics-based frequency signatures defining tamper-proof surveillance across environments.',
      height: 'min-h-[300px] sm:min-h-[340px]',
    },
    {
      badge: 'Detection',
      title: 'Driving measurable impact through precision',
      description: 'Focused on accuracy, real-time alerts, and zero false-positive noise for security teams.',
      height: 'min-h-[260px] sm:min-h-[290px]',
    },
    {
      badge: 'Forensics',
      title: 'Explainable evidence with rapid delivery',
      description: 'Raw FFT domain signatures transformed into actionable, trustworthy forensic decisions.',
      height: 'min-h-[280px] sm:min-h-[320px]',
    },
    {
      badge: 'Integrity',
      title: 'A dedicated platform behind continuous trust',
      description: 'Enterprise-grade protection guiding modern surveillance infrastructure at scale.',
      height: 'min-h-[250px] sm:min-h-[270px]',
    },
  ];

  return (
    <section id="workflow" className="w-full bg-transparent text-white border-t border-white/10 py-20 px-4 sm:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        {/* Top Eyebrow */}
        <span className="text-gray-400 font-medium text-xs sm:text-sm tracking-wider uppercase mb-4 block">
          About SpectraGuard
        </span>

        {/* Main Headline styled with hero section's exact font */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white leading-[1.12] max-w-4xl mx-auto">
          Building the Next Generation of{' '}
          <span className="text-[#C9D7EA]">
            Intelligent Camera Integrity Monitoring
          </span>
        </h2>

        {/* Subtext */}
        <p className="mt-5 text-xs sm:text-sm md:text-base text-[#C9D7EA] font-normal leading-relaxed max-w-xl mx-auto">
          Physics-informed frequency domain reasoning engineered for critical infrastructure, smart cities, and high-security environments.
        </p>

        {/* 4 Cards Grid with text placed at bottom like reference */}
        <div className="w-full mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-end text-left">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`w-full bg-white/[0.07] backdrop-blur-xl border border-white/15 p-6 rounded-[22px] shadow-2xl flex flex-col justify-between transition-all duration-300 hover:border-white/25 hover:bg-white/10 ${card.height}`}
            >
              {/* Top Tag / Badge */}
              <div>
                <span className="inline-block bg-white/10 border border-white/20 px-3 py-1 rounded-full text-[11px] font-medium text-white/80 backdrop-blur-md">
                  {card.badge}
                </span>
              </div>

              {/* Bottom Text Content */}
              <div className="mt-8">
                {/* White/Gray Accent Dot */}
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300 mb-3" />

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight leading-snug mb-2">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#C9D7EA] font-normal leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

