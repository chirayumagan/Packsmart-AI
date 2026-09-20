import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, ChevronRight, ArrowLeft, ShieldCheck, Cpu, BookOpenCheck, Package2 } from 'lucide-react';
import { usePersona } from '../../context/PersonaContext';
import HeroSearch from '../HeroSearch';
import StepIndicator from '../StepIndicator';
import FoodCategoryStep from '../FoodCategoryStep';
import FoodFormStep from '../FoodFormStep';
import TransitRouteStep from '../TransitRouteStep';
import ResultCards from '../ResultCards';

const API_BASE = '/api';

export default function FarmerStudio() {
  const { t } = useTranslation();
  const { farmerSelections, setFarmerSelections, farmerResults, setFarmerResults } = usePersona();

  const [view, setView] = useState('hero');
  const [wizardStep, setWizardStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function reset() {
    setView('hero');
    setWizardStep(1);
    setFarmerSelections({ category: null, form: null, transitRoute: null });
    setFarmerResults(null);
    setError(null);
  }

  function handleSearchSelect(category, form) {
    setFarmerSelections(s => ({ ...s, category, form }));
    setWizardStep(3);
    setView('wizard');
  }

  function wizardBack() {
    if (wizardStep === 1) { setView('hero'); return; }
    setWizardStep(s => s - 1);
    setError(null);
  }

  async function wizardNext() {
    if (wizardStep < 3) {
      if (wizardStep === 1) setFarmerSelections(s => ({ ...s, form: null }));
      setWizardStep(s => s + 1);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: farmerSelections.category,
          form: farmerSelections.form,
          transit_route: farmerSelections.transitRoute,
        }),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      setFarmerResults(data);
      setView('results');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const canNext =
    (wizardStep === 1 && farmerSelections.category) ||
    (wizardStep === 2 && farmerSelections.form) ||
    (wizardStep === 3 && farmerSelections.transitRoute);

  return (
    <div className="min-h-screen bg-[#F8F7F2] font-sans">

      {/* Hero */}
      {view === 'hero' && (
        <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-28 pb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-[#1F5C3A]/10 text-[#1F5C3A] border border-[#1F5C3A]/20 rounded-full px-3 py-1.5 text-xs font-bold tracking-widest uppercase mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Packaging Intelligence for Indian Farmers & FPOs
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.1] mb-5">
              The right packaging<br />
              <span className="text-[#1F5C3A]">starts with your product.</span>
            </h1>
            <p className="text-[#64748B] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Complex food-barrier science (OTR, WVTR, shelf-life physics) happens automatically in the background.
              You only answer 3 plain-language questions.
            </p>
          </div>
          <HeroSearch onSelectFood={handleSearchSelect} onLaunchWizard={() => { setView('wizard'); setWizardStep(1); }} />
        </section>
      )}

      {/* Wizard */}
      {view === 'wizard' && (
        <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-28 pb-20">
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 sm:p-9">
              <StepIndicator currentStep={wizardStep} />
              {wizardStep === 1 && (
                <FoodCategoryStep selected={farmerSelections.category} onSelect={v => setFarmerSelections(s => ({ ...s, category: v }))} />
              )}
              {wizardStep === 2 && (
                <FoodFormStep category={farmerSelections.category} selected={farmerSelections.form} onSelect={v => setFarmerSelections(s => ({ ...s, form: v }))} />
              )}
              {wizardStep === 3 && (
                <TransitRouteStep selected={farmerSelections.transitRoute} onSelect={v => setFarmerSelections(s => ({ ...s, transitRoute: v }))} />
              )}
              {error && (
                <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                  ⚠️ {error}
                </div>
              )}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                <button onClick={wizardBack} className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-transparent font-semibold text-sm rounded-full border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all">
                  <ArrowLeft className="w-4 h-4" /> {t('backButton')}
                </button>
                <button onClick={wizardNext} disabled={!canNext || loading}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#D9F04A] text-[#17452C] font-bold text-sm rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-105">
                  {loading ? (
                    <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> {t('analysing')}</>
                  ) : wizardStep === 3 ? (
                    <><Sparkles className="w-4 h-4" /> {t('getRecommendations')}</>
                  ) : (
                    <>{t('nextButton')} <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      {view === 'results' && (
        <section className="min-h-screen px-4 pt-28 pb-20">
          <div className="max-w-5xl mx-auto">
            <ResultCards data={farmerResults} onReset={reset} />
          </div>
        </section>
      )}
    </div>
  );
}
