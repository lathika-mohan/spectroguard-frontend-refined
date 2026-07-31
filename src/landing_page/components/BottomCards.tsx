import { Shield, Cpu } from 'lucide-react';

export function BottomCards() {
  return (
    <div className="w-full relative z-10 flex flex-col md:flex-row items-stretch md:items-end justify-between gap-6 pb-2">
      {/* Card 1: Physics-Informed AI (Far Left end) */}
      <div className="w-full md:max-w-[350px] lg:max-w-[380px] bg-white/[0.07] backdrop-blur-xl border border-white/15 p-6 rounded-[22px] shadow-2xl transition-all duration-300 hover:border-white/25 hover:bg-white/10">
        {/* Icon Box */}
        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#0066FF] mb-3.5 shadow-md">
          <Shield className="w-4 h-4 fill-[#0066FF] stroke-[#0066FF]" />
        </div>

        <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight mb-2">
          Physics-Informed AI
        </h3>

        <p className="text-xs sm:text-sm text-white/70 font-normal leading-relaxed">
          Frequency-domain analysis that detects camera tampering beyond traditional pixel-based methods.
        </p>
      </div>

      {/* Card 2: Edge-Ready Intelligence (Far Right end) */}
      <div className="w-full md:max-w-[350px] lg:max-w-[380px] bg-white/[0.07] backdrop-blur-xl border border-white/15 p-6 rounded-[22px] shadow-2xl transition-all duration-300 hover:border-white/25 hover:bg-white/10">
        {/* Icon Box */}
        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#0066FF] mb-3.5 shadow-md">
          <Cpu className="w-4 h-4 fill-[#0066FF] stroke-[#0066FF]" />
        </div>

        <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight mb-2">
          Edge-Ready Intelligence
        </h3>

        <p className="text-xs sm:text-sm text-white/70 font-normal leading-relaxed">
          CPU-optimized inference with transparent forensic evidence for real-world surveillance environments.
        </p>
      </div>
    </div>
  );
}




