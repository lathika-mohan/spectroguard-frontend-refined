import React from 'react';
import { Activity, ShieldCheck, Cpu, Server, ArrowRight } from 'lucide-react';

interface FeaturesGridSectionProps {
  onLaunchClick?: () => void;
}

export function FeaturesGridSection({ onLaunchClick }: FeaturesGridSectionProps) {
  const leftCards = [
    {
      icon: Activity,
      title: 'Frequency Domain Analysis',
      description: 'Physics-informed spectral analysis identifies structural frequency changes caused by blur, occlusion, defocus, and camera tampering.',
    },
    {
      icon: ShieldCheck,
      title: 'AI-Powered Integrity Detection',
      description: 'Random Forest inference classifies camera integrity using extracted spectral features with explainable confidence scoring.',
    },
  ];

  const rightCards = [
    {
      icon: Cpu,
      title: 'Explainable Decision Intelligence',
      description: 'Interactive spectral visualizations and decision reasoning provide transparent evidence for every integrity assessment.',
    },
    {
      icon: Server,
      title: 'Production-Ready Integration',
      description: 'REST-based architecture enables integration with surveillance platforms while supporting scalable edge and server deployments.',
    },
  ];

  return (
    <section id="launch" className="w-full bg-transparent text-white border-t border-white/10 py-20 px-4 sm:px-8 relative overflow-hidden">
      {/* Background radial glow behind bottom CTA */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#0066FF]/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-[#8CB8FF] font-semibold text-xs sm:text-sm tracking-widest uppercase mb-3 block">
            Core Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white leading-[1.12] max-w-3xl">
            Complete Surveillance <span className="text-[#C9D7EA]">Integrity Matrix</span>
          </h2>
        </div>

        {/* 3-Column Layout: Left (2 cards), Center (Empty Space for visual), Right (2 cards) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column - 2 Cards */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {leftCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="w-full bg-white/[0.07] backdrop-blur-xl border border-white/15 p-6 rounded-[22px] shadow-2xl transition-all duration-300 hover:border-white/25 hover:bg-white/10"
                >
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#0066FF] mb-3.5 shadow-md">
                    <Icon className="w-4 h-4 text-[#0066FF]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#C9D7EA] font-normal leading-relaxed">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Center Column - Reserved Empty Space (Holds clean spatial balance) */}
          <div className="hidden lg:block lg:col-span-4 h-full min-h-[360px]" />

          {/* Right Column - 2 Cards */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {rightCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="w-full bg-white/[0.07] backdrop-blur-xl border border-white/15 p-6 rounded-[22px] shadow-2xl transition-all duration-300 hover:border-white/25 hover:bg-white/10"
                >
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#0066FF] mb-3.5 shadow-md">
                    <Icon className="w-4 h-4 text-[#0066FF]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#C9D7EA] font-normal leading-relaxed">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Final Bottom Center Launch CTA Button */}
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <button
            onClick={onLaunchClick}
            className="group relative inline-flex items-center space-x-3 bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-full font-semibold text-sm sm:text-base tracking-wide transition-all duration-200 cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] active:scale-95"
          >
            <span>Launch SpectraGuard</span>
            <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="mt-3 text-xs text-[#C9D7EA] font-medium tracking-wide">
            Real-time camera integrity console & forensic evaluation platform
          </p>
        </div>
      </div>
    </section>
  );
}

