import { Tractor, FlaskConical, Sparkles, ChevronRight, Layers, Fingerprint } from 'lucide-react';
import { usePersona } from '../../context/PersonaContext';

export default function PersonaGateway() {
  const { setMode } = usePersona();

  // Helper to trigger view switch with state-driven transition handled by App.jsx wrapper
  const handleModeSwitch = (mode) => {
    setMode(mode);
  };

  return (
    <div className="min-h-screen bg-[#0A1C12] font-sans relative overflow-hidden animate-fade-in">
      {/* Ambient radial glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#D9F04A]/[0.03] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#34D399]/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20 pb-16">

        {/* Hero copy */}
        <div className="text-center max-w-2xl mx-auto mb-14 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-[#132E20] border border-[#34D399]/20 text-[#34D399] rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-6">
            <Fingerprint className="w-3.5 h-3.5" />
            SIH 2026 • AI Packaging Decision Engine
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#F8F7F2] tracking-tight leading-[1.15] mb-5">
            Precision food packaging,<br />
            <span className="text-[#34D399]">tailored to your workflow.</span>
          </h1>

          <p className="text-[#94A3B8] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Select your operational profile to access customized recommendation tools.
          </p>
        </div>

        {/* Persona selection cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl mx-auto mb-16 px-2 animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>

          {/* Card A: Farmer */}
          <div 
            className="group relative bg-[#132E20] rounded-2xl border border-[rgba(217,240,74,0.1)] p-8 flex flex-col hover:border-[#D9F04A]/40 hover:bg-[#153424] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={() => handleModeSwitch('farmer')}
          >
            {/* Subtle hover gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#D9F04A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-14 h-14 bg-[#0A1C12] border border-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:border-[#D9F04A]/30 transition-colors">
                <Tractor className="w-7 h-7 text-[#F8F7F2]" />
              </div>

              <h2 className="text-2xl font-extrabold text-[#F8F7F2] mb-2">Farmer / SME Portal</h2>
              <div className="text-[#34D399] text-xs font-bold uppercase tracking-wider mb-4">Simple Visual Packaging Finder</div>
              
              <p className="text-[#94A3B8] text-sm leading-relaxed flex-1 mb-8">
                Quick, visual recommendations tailored for crop preservation, road transport, and local market distribution without complex chemistry terms.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                <span className="text-[10px] font-bold text-[#F8F7F2]/80 bg-white/5 border border-white/10 rounded-md px-2 py-1">Zero Jargon</span>
                <span className="text-[10px] font-bold text-[#F8F7F2]/80 bg-white/5 border border-white/10 rounded-md px-2 py-1">FSSAI Compliant</span>
                <span className="text-[10px] font-bold text-[#F8F7F2]/80 bg-white/5 border border-white/10 rounded-md px-2 py-1">Instant Supplier Connect</span>
              </div>

              <button className="w-full inline-flex items-center justify-center gap-2 bg-white/5 text-[#F8F7F2] border border-white/10 font-bold text-sm rounded-xl px-5 py-3.5 group-hover:bg-[#D9F04A] group-hover:text-[#0A1C12] group-hover:border-[#cbe33e] group-hover:shadow-[0_0_20px_rgba(217,240,74,0.3)] transition-all duration-300">
                Launch Farmer Wizard
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card B: Expert */}
          <div 
            className="group relative bg-[#132E20] rounded-2xl border border-[rgba(217,240,74,0.1)] p-8 flex flex-col hover:border-[#D9F04A]/40 hover:bg-[#153424] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={() => handleModeSwitch('expert')}
          >
            {/* Subtle hover gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#D9F04A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-[#0A1C12] border border-white/5 rounded-2xl flex items-center justify-center group-hover:border-[#D9F04A]/30 transition-colors">
                  <FlaskConical className="w-7 h-7 text-[#D9F04A]" />
                </div>
                <span className="inline-flex items-center gap-1.5 bg-[#D9F04A]/10 text-[#D9F04A] border border-[#D9F04A]/20 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(217,240,74,0.1)]">
                  <Layers className="w-3.5 h-3.5" /> Advanced
                </span>
              </div>

              <h2 className="text-2xl font-extrabold text-[#F8F7F2] mb-2">FoodTech & R&D Portal</h2>
              <div className="text-[#34D399] text-xs font-bold uppercase tracking-wider mb-4">Advanced Barrier & MAP Engine</div>
              
              <p className="text-[#94A3B8] text-sm leading-relaxed flex-1 mb-8">
                Granular barrier modeling, water activity dynamics, respiration rate equilibrium, multi-layer polymer selection, and FSSAI migration limits.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                <span className="text-[10px] font-bold text-[#F8F7F2]/80 bg-white/5 border border-white/10 rounded-md px-2 py-1">Custom OTR/WVTR</span>
                <span className="text-[10px] font-bold text-[#F8F7F2]/80 bg-white/5 border border-white/10 rounded-md px-2 py-1">Gas Flush Ratios</span>
                <span className="text-[10px] font-bold text-[#F8F7F2]/80 bg-white/5 border border-white/10 rounded-md px-2 py-1">Shelf-Life Curves</span>
              </div>

              <button className="w-full inline-flex items-center justify-center gap-2 bg-white/5 text-[#F8F7F2] border border-white/10 font-bold text-sm rounded-xl px-5 py-3.5 group-hover:bg-[#D9F04A] group-hover:text-[#0A1C12] group-hover:border-[#cbe33e] group-hover:shadow-[0_0_20px_rgba(217,240,74,0.3)] transition-all duration-300">
                Enter FoodTech Studio
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
