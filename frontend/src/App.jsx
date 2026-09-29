import React from 'react';
import { PersonaProvider, usePersona } from './context/PersonaContext';
import PersonaGateway from './components/landing/PersonaGateway';
import FarmerStudio from './components/farmer/FarmerStudio';
import ExpertStudio from './components/expert/ExpertStudio';
import Header from './components/common/Header';
import { Package2 } from 'lucide-react';

function AppContent() {
  const { mode } = usePersona();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main key={mode} className="flex-1 animate-fade-in">
        {mode === 'landing' && <PersonaGateway />}
        {mode === 'farmer' && <FarmerStudio />}
        {mode === 'expert' && <ExpertStudio />}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-slate-200 bg-white relative z-10">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#1F5C3A] flex items-center justify-center">
              <Package2 className="w-3 h-3 text-[#D9F04A]" />
            </div>
            <span className="font-semibold text-[#0F172A]">PackSmart AI</span>
            <span>· SIH 2026 · Problem ID 26236</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Team Code YodhasX57</span>
            <span className="text-slate-300">|</span>
            <a href="https://www.fssai.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#1F5C3A] transition-colors">FSSAI Guidelines</a>
            <span className="text-slate-300">|</span>
            <a href="https://bis.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#1F5C3A] transition-colors">BIS Standards</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <PersonaProvider>
      <AppContent />
    </PersonaProvider>
  );
}
