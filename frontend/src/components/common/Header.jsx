import { Package2, Sparkles, Tractor, FlaskConical } from 'lucide-react';
import { usePersona } from '../../context/PersonaContext';
import LanguageSwitcher from '../LanguageSwitcher';

export default function Header() {
  const { mode, setMode } = usePersona();

  if (mode === 'landing') return null; // Don't show header on the gateway

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="flex items-center justify-between gap-3 sm:gap-5 px-4 py-2.5 rounded-full backdrop-blur-md bg-white/85 border border-slate-200/80 shadow-sm max-w-5xl w-full">
        
        {/* Logo */}
        <div 
          className="flex items-center gap-2 flex-shrink-0 cursor-pointer"
          onClick={() => setMode('landing')}
        >
          <div className="w-7 h-7 rounded-lg bg-[#1F5C3A] flex items-center justify-center">
            <Package2 className="w-4 h-4 text-[#D9F04A]" />
          </div>
          <div className="hidden sm:block">
            <span className="text-sm font-extrabold text-[#0F172A] tracking-tight">PackSmart</span>
            <span className="text-sm font-extrabold text-[#1F5C3A] ml-0.5">AI</span>
          </div>
        </div>

        {/* Persona Switcher (Segmented Control) */}
        <div className="flex-1 flex justify-center">
          <div className="flex bg-slate-100/80 p-1 rounded-full border border-slate-200 shadow-inner">
            <button
              onClick={() => setMode('farmer')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-200 ${
                mode === 'farmer' 
                  ? 'bg-white text-[#1F5C3A] shadow-sm' 
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Tractor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Farmer View</span>
              <span className="sm:hidden">Farmer</span>
            </button>
            <button
              onClick={() => setMode('expert')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-200 ${
                mode === 'expert' 
                  ? 'bg-white text-[#1F5C3A] shadow-sm' 
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">FoodTech View</span>
              <span className="sm:hidden">Expert</span>
            </button>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <LanguageSwitcher variant="light" />
        </div>
      </nav>
    </div>
  );
}
