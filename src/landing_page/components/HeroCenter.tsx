import { ArrowUpRight } from 'lucide-react';

interface HeroCenterProps {
  onCtaClick: () => void;
}

export function HeroCenter({ onCtaClick }: HeroCenterProps) {
  return (
    <div className="flex flex-col items-center text-center px-4 max-w-4xl mx-auto relative z-10">
      {/* Main Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-[56px] lg:text-[62px] font-medium tracking-tight text-white leading-[1.12] max-w-3xl">
        Trust Every Frame.
        <br />
        Protect Every Camera.
      </h1>

      {/* Subheading */}
      <p className="mt-5 text-sm sm:text-base text-white/80 font-normal leading-relaxed max-w-lg mx-auto">
        SpectraGuard is an AI-powered camera integrity platform that leverages physics-informed frequency-domain analysis to identify surveillance tampering, providing fast, explainable, and trustworthy decisions.
      </p>

      {/* CTA Button */}
      <div className="mt-7">
        <button
          onClick={onCtaClick}
          className="group bg-white hover:bg-white/95 text-black font-semibold rounded-full pl-6 pr-2 py-2 flex items-center space-x-3 text-sm sm:text-base transition-all duration-300 shadow-2xl hover:scale-[1.02] cursor-pointer"
        >
          <span>Launch SpectraGuard</span>
          <div className="w-8 h-8 rounded-full bg-[#0066FF] group-hover:bg-[#0052CC] text-white flex items-center justify-center transition-all duration-300 transform group-hover:rotate-45">
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </div>
        </button>
      </div>
    </div>
  );
}



