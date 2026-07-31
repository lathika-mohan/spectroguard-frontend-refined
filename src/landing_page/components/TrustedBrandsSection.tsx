import { Building2, Landmark, Compass } from 'lucide-react';

export function TrustedBrandsSection() {
  return (
    <section id="technology" className="w-full bg-transparent text-white border-t border-white/10 py-20 px-4 sm:px-8 relative overflow-hidden">
      {/* Ambient neutral background glow behind headline */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-white/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
        {/* Main Headline */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium text-white tracking-tight leading-[1.12] max-w-4xl">
          Surveillance Is Only as Reliable <br className="hidden sm:block" />
          <span className="text-[#C9D7EA]">as Its Cameras</span>
        </h2>

        {/* Subtext */}
        <p className="mt-6 text-sm sm:text-base md:text-lg text-[#C9D7EA] font-normal leading-relaxed max-w-2xl mx-auto">
          Traditional vision systems analyze scenes. SpectraGuard first verifies whether the cameras themselves can still be trusted.
        </p>

        {/* Brand Logos Row Divider */}
        <div className="w-full border-t border-white/15 mt-16 pt-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center opacity-85 hover:opacity-100 transition-opacity">
            {/* Domain Logo 1 */}
            <div className="flex items-center space-x-2.5 text-white/80 hover:text-white transition-colors cursor-pointer group">
              <Building2 className="w-6 h-6 stroke-[1.5] group-hover:scale-105 transition-transform text-white" />
              <div className="text-left leading-tight">
                <span className="block text-xs font-bold tracking-widest uppercase text-white">SMART</span>
                <span className="block text-[10px] text-[#C9D7EA] tracking-wider">CITIES</span>
              </div>
            </div>

            {/* Domain Logo 2 */}
            <div className="flex items-center space-x-2.5 text-white/80 hover:text-white transition-colors cursor-pointer group">
              <div className="w-7 h-7 rounded-md border border-white/40 flex items-center justify-center font-bold text-xs text-white group-hover:border-white">
                C
              </div>
              <div className="text-left leading-tight">
                <span className="block text-xs font-bold tracking-widest uppercase text-white">CRITICAL</span>
                <span className="block text-[9px] text-[#C9D7EA] tracking-widest">INFRASTRUCTURE</span>
              </div>
            </div>

            {/* Domain Logo 3 */}
            <div className="flex items-center space-x-2.5 text-white/80 hover:text-white transition-colors cursor-pointer group">
              <div className="text-left leading-tight">
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-[#C9D7EA] inline-block"></span>
                  <span className="text-sm font-bold tracking-tight text-white">Public</span>
                </div>
                <span className="block text-[10px] text-[#C9D7EA] tracking-wider ml-3">Safety</span>
              </div>
            </div>

            {/* Domain Logo 4 */}
            <div className="flex items-center space-x-2.5 text-white/80 hover:text-white transition-colors cursor-pointer group">
              <Landmark className="w-6 h-6 stroke-[1.5] group-hover:scale-105 transition-transform text-white" />
              <div className="text-left leading-tight">
                <span className="block text-xs font-bold tracking-widest uppercase text-white">CAMPUS</span>
                <span className="block text-[9px] text-[#C9D7EA] tracking-widest">SECURITY</span>
              </div>
            </div>

            {/* Domain Logo 5 */}
            <div className="flex items-center space-x-2.5 text-white/80 hover:text-white transition-colors cursor-pointer group col-span-2 sm:col-span-1">
              <Compass className="w-6 h-6 stroke-[1.5] group-hover:scale-105 transition-transform text-white" />
              <div className="text-left leading-tight">
                <span className="block text-xs font-bold tracking-widest uppercase text-white">AXIS</span>
                <span className="block text-[9px] text-[#C9D7EA] tracking-widest">ARCHITECTURAL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

