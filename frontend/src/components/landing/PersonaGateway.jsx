import React from 'react';
import { Tractor, FlaskConical, ChevronRight, Layers, Fingerprint, Package2, ShieldCheck, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePersona } from '../../context/PersonaContext';
import LanguageSwitcher from '../LanguageSwitcher';

const MARQUEE_ITEMS = [
  'FSSAI 2018 Compliant',
  'Arrhenius Physics Engine',
  '40+ Commodities Mapped',
  'Multi-Objective Pareto Optimization',
  'IS 9845 Migration Limits',
  'Real-Time OTR & WVTR Permeation Kinetics',
  'Verified B2B Supplier Directory',
  'ICAR & NHB Packaging Standards',
];

export default function PersonaGateway() {
  const { setMode } = usePersona();
  const { t } = useTranslation();
  const [pulseActive, setPulseActive] = React.useState(false);

  const handleModeSwitch = (mode) => {
    setMode(mode);
  };

  const triggerAuroraPulse = () => {
    setPulseActive(true);
    setTimeout(() => setPulseActive(false), 1000);
  };

  return (
    <div className="min-h-screen bg-[#06140C] font-sans relative overflow-hidden flex flex-col justify-between animate-fade-in">
      
      {/* ------------------------------------------------------------------- */}
      {/* 1. FLOATING BRAND ANCHOR NAVBAR                                      */}
      {/* ------------------------------------------------------------------- */}
      <header className="fixed top-2 sm:top-4 left-0 right-0 z-50 flex justify-center px-2 sm:px-4">
        <nav className="flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 py-2 sm:py-3 rounded-full backdrop-blur-xl bg-[#0A1C12]/80 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] max-w-5xl w-full transition-all min-h-[44px]">
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-[#1F5C3A] border border-[#D9F04A]/30 flex items-center justify-center shadow-[0_0_12px_rgba(217,240,74,0.2)] flex-shrink-0">
              <Package2 className="w-4 h-4 text-[#D9F04A]" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-black text-[#F8F7F2] tracking-tight">PackSmart</span>
              <span className="text-sm sm:text-base font-black text-[#D9F04A] ml-1">AI</span>
            </div>
          </div>

          {/* AI Engine Status Readiness Badge */}
          <button
            onClick={triggerAuroraPulse}
            title="Click to test AI engine readiness"
            className="group relative inline-flex items-center gap-2 bg-[#132E20]/90 hover:bg-[#1A422D] border border-[#34D399]/40 hover:border-[#D9F04A]/70 text-[#34D399] hover:text-[#D9F04A] rounded-full px-3.5 py-1 text-xs font-bold tracking-wide transition-all duration-300 shadow-[0_0_15px_rgba(52,211,153,0.15)] hover:shadow-[0_0_25px_rgba(217,240,74,0.3)] hover:scale-105 active:scale-95 cursor-pointer select-none"
          >
            <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#34D399] animate-pulse shadow-[0_0_8px_#34D399]" />
            </span>
            <Sparkles className={`w-3.5 h-3.5 text-[#D9F04A] transition-transform duration-500 ${pulseActive ? 'rotate-180 scale-125' : 'group-hover:rotate-45'}`} />
            <span className="text-slate-200 group-hover:text-white font-extrabold tracking-tight">
              {t('landing.engineStatus', 'AI Engine Online')}
            </span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <LanguageSwitcher variant="dark" />
          </div>
        </nav>
      </header>

      {/* ------------------------------------------------------------------- */}
      {/* 2. MAIN HERO & AURORA GLOW CONTAINER                                 */}
      {/* ------------------------------------------------------------------- */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-3 sm:px-4 pt-24 sm:pt-28 pb-10 sm:pb-12 max-w-6xl mx-auto w-full">
        
        {/* "Linear" Aurora Radial Glow Background */}
        <div className={`absolute top-16 left-1/2 -translate-x-1/2 w-[300px] sm:w-[750px] h-[250px] sm:h-[380px] bg-gradient-to-r from-[#D9F04A]/20 via-[#34D399]/25 to-[#10B981]/15 rounded-full blur-[90px] sm:blur-[130px] pointer-events-none transition-all duration-700 ${pulseActive ? 'scale-125 opacity-100 blur-[70px] brightness-150' : 'animate-aurora'}`} />
        
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-3xl mx-auto mb-10 sm:mb-14 animate-slide-up">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#F8F7F2] tracking-tight leading-[1.15] sm:leading-[1.1] mb-4 sm:mb-6">
            {t('landing.titleLine1')}<br />
            <span className="bg-gradient-to-r from-[#D9F04A] via-[#34D399] to-[#6EE7B7] bg-clip-text text-transparent">
              {t('landing.titleLine2')}
            </span>
          </h1>

          <p className="text-[#94A3B8] text-sm sm:text-base lg:text-lg max-w-xl mx-auto leading-relaxed px-2">
            {t('landing.subtitle')}
          </p>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* 3. ARCHITECTURAL PORTAL CARDS                                       */}
        {/* ------------------------------------------------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full max-w-4xl mx-auto mb-12 sm:mb-16 px-1 sm:px-2 animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>

          {/* Portal Card A: Farmer / SME */}
          <div 
            className="group relative bg-[#0E2216]/90 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/10 p-6 sm:p-8 flex flex-col hover:border-[#D9F04A]/60 hover:shadow-[0_0_40px_rgba(217,240,74,0.15)] hover:-translate-y-1.5 transition-all duration-500 cursor-pointer overflow-hidden"
            onClick={() => handleModeSwitch('farmer')}
          >
            {/* Interactive SVG Grid Overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <svg className="w-full h-full text-[#D9F04A]/[0.08]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid-farmer" width="32" height="32" patternUnits="userSpaceOnUse">
                    <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-farmer)" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E2216] via-transparent to-transparent" />
            </div>

            {/* Glowing Accent Corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#D9F04A]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex flex-col h-full">
              <div className="w-12 sm:w-14 h-12 sm:h-14 bg-[#06140C] border border-white/10 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 group-hover:border-[#D9F04A]/40 group-hover:scale-110 transition-all duration-300 shadow-inner flex-shrink-0">
                <Tractor className="w-6 sm:w-7 h-6 sm:h-7 text-[#D9F04A]" />
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-[#F8F7F2] mb-2 group-hover:text-white transition-colors">{t('landing.farmerPortalTitle')}</h2>
              <div className="text-[#34D399] text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D9F04A] flex-shrink-0" />
                {t('landing.farmerPortalSub')}
              </div>
              
              <p className="text-[#94A3B8] text-xs sm:text-sm leading-relaxed flex-1 mb-6 sm:mb-8">
                {t('landing.farmerPortalDesc')}
              </p>

              <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                <span className="text-[10px] font-bold text-[#F8F7F2]/80 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1">{t('landing.zeroJargon')}</span>
                <span className="text-[10px] font-bold text-[#F8F7F2]/80 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1">{t('landing.fssaiCompliant')}</span>
                <span className="text-[10px] font-bold text-[#F8F7F2]/80 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1">{t('landing.instantB2bQuotes')}</span>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#F8F7F2] group-hover:text-[#D9F04A] transition-colors">
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold tracking-wide">
                  {t('landing.launchFarmerWizard')}
                </span>
                <div className="w-9 h-9 rounded-full bg-white/10 group-hover:bg-[#D9F04A] group-hover:text-[#06140C] flex items-center justify-center transition-all duration-300 shadow-md group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(217,240,74,0.4)]">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* Portal Card B: FoodTech & R&D */}
          <div 
            className="group relative bg-[#0E2216]/90 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/10 p-6 sm:p-8 flex flex-col hover:border-[#D9F04A]/60 hover:shadow-[0_0_40px_rgba(217,240,74,0.15)] hover:-translate-y-1.5 transition-all duration-500 cursor-pointer overflow-hidden"
            onClick={() => handleModeSwitch('expert')}
          >
            {/* Interactive SVG Grid Overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <svg className="w-full h-full text-[#34D399]/[0.08]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid-expert" width="32" height="32" patternUnits="userSpaceOnUse">
                    <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-expert)" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E2216] via-transparent to-transparent" />
            </div>

            {/* Glowing Accent Corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#34D399]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-start justify-between mb-5 sm:mb-6">
                <div className="w-12 sm:w-14 h-12 sm:h-14 bg-[#06140C] border border-white/10 rounded-2xl flex items-center justify-center group-hover:border-[#D9F04A]/40 group-hover:scale-110 transition-all duration-300 shadow-inner flex-shrink-0">
                  <FlaskConical className="w-6 sm:w-7 h-6 sm:h-7 text-[#34D399]" />
                </div>
                <span className="inline-flex items-center gap-1.5 bg-[#D9F04A]/10 text-[#D9F04A] border border-[#D9F04A]/20 rounded-full px-2.5 sm:px-3 py-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(217,240,74,0.1)]">
                  <Layers className="w-3.5 h-3.5 flex-shrink-0" /> {t('landing.advanced')}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-[#F8F7F2] mb-2 group-hover:text-white transition-colors">{t('landing.expertPortalTitle')}</h2>
              <div className="text-[#34D399] text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#34D399] flex-shrink-0" />
                {t('landing.expertPortalSub')}
              </div>
              
              <p className="text-[#94A3B8] text-xs sm:text-sm leading-relaxed flex-1 mb-6 sm:mb-8">
                {t('landing.expertPortalDesc')}
              </p>

              <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                <span className="text-[10px] font-bold text-[#F8F7F2]/80 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1">{t('landing.customOtrWvtr')}</span>
                <span className="text-[10px] font-bold text-[#F8F7F2]/80 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1">{t('landing.gasFlushRatios')}</span>
                <span className="text-[10px] font-bold text-[#F8F7F2]/80 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1">{t('landing.shelfLifeCurves')}</span>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#F8F7F2] group-hover:text-[#D9F04A] transition-colors">
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold tracking-wide">
                  {t('landing.enterFoodtechStudio')}
                </span>
                <div className="w-9 h-9 rounded-full bg-white/10 group-hover:bg-[#D9F04A] group-hover:text-[#06140C] flex items-center justify-center transition-all duration-300 shadow-md group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(217,240,74,0.4)]">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 4. CREDIBILITY MARQUEE (Infinite Ticker Banner)                      */}
      {/* ------------------------------------------------------------------- */}
      <div className="relative z-10 border-t border-white/10 bg-[#040E08]/90 backdrop-blur-md overflow-hidden py-4 w-full">
        <div className="animate-marquee flex items-center whitespace-nowrap gap-8">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9F04A]" />
              <span className="hover:text-[#F8F7F2] transition-colors">{item}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

