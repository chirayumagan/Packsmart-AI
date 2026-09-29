import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, ChevronRight, ArrowLeft, ShieldCheck, Cpu, BookOpenCheck, Package2, Store, ShoppingCart } from 'lucide-react';
import { usePersona } from '../../context/PersonaContext';
import HeroSearch from '../HeroSearch';
import StepIndicator from '../StepIndicator';
import FoodCategoryStep from '../FoodCategoryStep';
import FoodFormStep from '../FoodFormStep';
import TransitRouteStep from '../TransitRouteStep';
import ResultCards, { SupplierModal } from '../ResultCards';

import { generateClientRecommendations } from '../../utils/foodSearchClient';

const API_BASE = '/api';

export default function FarmerStudio() {
  const { t } = useTranslation();
  const { farmerSelections, setFarmerSelections, farmerResults, setFarmerResults } = usePersona();

  const [view, setView] = useState('hero');
  const [wizardStep, setWizardStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [marketplaceOpen, setMarketplaceOpen] = useState(false);

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
      if (res.ok) {
        const data = await res.json();
        if (data.recommendations && data.recommendations.length > 0) {
          setFarmerResults(data);
          setView('results');
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      // Fallback below
    }

    // Client-side recommendation fallback
    const fallbackResults = generateClientRecommendations(
      farmerSelections.category,
      farmerSelections.form,
      farmerSelections.transitRoute
    );
    setFarmerResults(fallbackResults);
    setView('results');
    setLoading(false);
  }

  const canNext =
    (wizardStep === 1 && farmerSelections.category) ||
    (wizardStep === 2 && farmerSelections.form) ||
    (wizardStep === 3 && farmerSelections.transitRoute);

  return (
    <div className="min-h-screen bg-[#F8F7F2] font-sans">
      <SupplierModal
        isOpen={marketplaceOpen}
        onClose={() => setMarketplaceOpen(false)}
        t={t}
      />

      {/* Hero */}
      {view === 'hero' && (
        <section className="min-h-screen flex flex-col items-center justify-center px-3 sm:px-4 pt-24 sm:pt-28 pb-16 sm:pb-20">
          {/* Direct B2B Buyers & Suppliers CTA Banner */}
          <div className="mb-6 animate-fade-in w-full text-center">
            <button
              onClick={() => setMarketplaceOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-full px-4 sm:px-5 py-2.5 min-h-[44px] text-xs shadow-md transition-all hover:scale-105 max-w-full"
            >
              <Store className="w-4 h-4 text-[#D9F04A] flex-shrink-0" />
              <span className="truncate">🛒 {t('marketplace.findSuppliers', 'Find Verified Suppliers & Buyers')}</span>
              <span className="hidden sm:inline bg-white/20 text-white rounded-full px-2 py-0.5 text-[10px] flex-shrink-0">7 Buyers & Suppliers Active</span>
            </button>
          </div>

          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 px-1">
            <div className="inline-flex items-center gap-2 bg-[#1F5C3A]/10 text-[#1F5C3A] border border-[#1F5C3A]/20 rounded-full px-3 py-1.5 text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-4 sm:mb-5 max-w-full">
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{t('farmerBadge', 'AI-Powered Packaging Intelligence for Indian Farmers & FPOs')}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.15] sm:leading-[1.1] mb-4 sm:mb-5">
              {t('farmerHeroTitle', 'The right packaging')}<br />
              <span className="text-[#1F5C3A]">{t('farmerHeroSubtitle', 'starts with your product.')}</span>
            </h1>
            <p className="text-[#64748B] text-sm sm:text-lg max-w-xl mx-auto leading-relaxed px-2">
              {t('farmerHeroDesc', 'Complex food-barrier science (OTR, WVTR, shelf-life physics) happens automatically in the background. You only answer 3 plain-language questions.')}
            </p>
          </div>
          <HeroSearch onSelectFood={handleSearchSelect} onLaunchWizard={() => { setView('wizard'); setWizardStep(1); }} />
        </section>
      )}

      {/* Wizard */}
      {view === 'wizard' && (
        <section className="min-h-screen flex flex-col items-center justify-center px-3 sm:px-4 pt-24 sm:pt-28 pb-16 sm:pb-20">
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-7 md:p-9">
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
              <div className="flex items-center justify-between mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-100 gap-3">
                <button onClick={wizardBack} className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 sm:py-3 min-h-[44px] bg-transparent font-semibold text-xs sm:text-sm rounded-full border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all">
                  <ArrowLeft className="w-4 h-4" /> {t('backButton')}
                </button>
                <button onClick={wizardNext} disabled={!canNext || loading}
                  className="inline-flex items-center justify-center gap-1.5 px-5 sm:px-6 py-2.5 sm:py-3 min-h-[44px] bg-[#D9F04A] text-[#17452C] font-bold text-xs sm:text-sm rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-105 shadow-sm">
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
        <section className="min-h-screen px-3 sm:px-4 pt-24 sm:pt-28 pb-16 sm:pb-20">
          <div className="max-w-5xl mx-auto">
            <ResultCards data={farmerResults} onReset={reset} />
          </div>
        </section>
      )}
    </div>
  );

}
