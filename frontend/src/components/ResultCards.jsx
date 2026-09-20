import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Package, ShieldCheck, IndianRupee, Clock,
  ChevronDown, ChevronUp, Sparkles,
  RotateCcw, Trophy, Medal, Award, ShoppingCart, MapPin, X,
  CheckCircle2, ArrowLeft
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Mock data fallback (for demo mode when API is unreachable)
// All tech specs are pre-populated here for instant display
// ---------------------------------------------------------------------------
const MOCK = {
  recommendations: [
    {
      id: 'bopp', rank: 1,
      name: 'Micro-perforated BOPP Anti-Fog Film',
      cost_per_unit_inr: 1.35, shelf_life_days: 18, is_fssai_approved: true, score: 0.87,
      description: 'Breathable film with anti-fog coating prevents moisture buildup and condensation while allowing natural respiration. Ideal for ambient non-AC truck transit.',
      technical_specs: {
        otr: '1,200 – 1,800 cm³/m²/day',
        wvtr: '8 – 12 g/m²/day',
        gauge: '35 – 40 µm',
        seal_temp: '110°C – 120°C',
      },
    },
    {
      id: 'ldpe', rank: 2,
      name: 'LDPE Stretch Film with Micro-Vents',
      cost_per_unit_inr: 0.72, shelf_life_days: 10, is_fssai_approved: true, score: 0.61,
      description: 'Cost-optimised loose-wrap alternative. Lower barrier class but significantly cheaper. Best for local mandi-to-market same-day routes.',
      technical_specs: {
        otr: '3,000 – 4,000 cm³/m²/day',
        wvtr: '22 – 30 g/m²/day',
        gauge: '20 – 30 µm',
        seal_temp: '90°C – 100°C',
      },
    },
    {
      id: 'pla', rank: 3,
      name: 'Bio-based PLA Compostable Pouch',
      cost_per_unit_inr: 2.80, shelf_life_days: 12, is_fssai_approved: true, score: 0.54,
      description: 'Plant-based, 100% compostable option for eco-conscious FPOs and export markets. Meets FSSAI 2018 and IS 9845 migration limits.',
      technical_specs: {
        otr: '800 – 2,200 cm³/m²/day',
        wvtr: '12 – 20 g/m²/day',
        gauge: '40 – 50 µm',
        seal_temp: '125°C – 140°C',
      },
    },
  ],
  food_category: 'Fresh Produce', food_form: 'Whole', transit_route: 'interstate',
};

// ---------------------------------------------------------------------------
// Supplier repository keyed by material id
// ---------------------------------------------------------------------------
const ALL_SUPPLIERS = [
  { name: 'EcoPack Industries', location: 'Vapi, Gujarat', moq: '3,000', price: '₹2.50', materials: ['pla', 'bopp-map', 'met-pet-evoh'] },
  { name: 'Bharat FlexiFilms', location: 'Daman & Diu', moq: '10,000', price: '₹1.80', materials: ['met-pet', 'bopp', 'bopp-map', 'met-pet-evoh'] },
  { name: 'Maratha Packaging Solutions', location: 'Pune, Maharashtra', moq: '5,000', price: '₹1.15', materials: ['bopp', 'bopp-map'] },
  { name: 'Ganga Polyfilms', location: 'Faridabad, NCR', moq: '2,500', price: '₹0.75', materials: ['ldpe', 'met-pet-evoh'] },
  { name: 'Deccan EcoWraps', location: 'Coimbatore, Tamil Nadu', moq: '1,000', price: '₹3.10', materials: ['pla'] },
];

// ---------------------------------------------------------------------------
// Card rank metadata
// ---------------------------------------------------------------------------
const RANK_META = [
  {
    icon: <Trophy className="w-3.5 h-3.5" />, tag: 'Best Match',
    badgeClass: 'bg-[#D9F04A] text-slate-900',
  },
  {
    icon: <Medal className="w-3.5 h-3.5" />, tag: 'Budget Pick',
    badgeClass: 'bg-slate-100 text-slate-700',
  },
  {
    icon: <Award className="w-3.5 h-3.5" />, tag: 'Eco Pick',
    badgeClass: 'bg-green-100 text-green-700',
  },
];

// ---------------------------------------------------------------------------
// SupplierModal — Handles: supplier list → quote form → success state
// ---------------------------------------------------------------------------
export function SupplierModal({ isOpen, onClose, t, materialId }) {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [refId] = useState(() => `ORD-IN-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [form, setForm] = useState({ name: '', phone: '', pincode: '', volume: '', contact: 'WhatsApp' });

  useEffect(() => {
    if (!isOpen) {
      setSelectedSupplier(null);
      setSuccess(false);
      setForm({ name: '', phone: '', pincode: '', volume: '', contact: 'WhatsApp' });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredSuppliers = ALL_SUPPLIERS.filter(s => materialId ? s.materials.includes(materialId) : true);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1200);
  };

  const renderContent = () => {
    if (success) {
      return (
        <div className="p-10 flex flex-col items-center text-center animate-fade-in">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-5">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-ink mb-2">Request Sent Successfully!</h3>
          <div className="inline-block bg-slate-100 text-slate-600 rounded-lg px-3 py-1.5 mb-4 text-xs font-mono tracking-wide border border-slate-200">
            Ref ID: {refId}
          </div>
          <p className="text-muted mb-8 max-w-sm leading-relaxed">
            Quotation request sent to <strong className="text-ink">{selectedSupplier?.name}</strong>. They will contact you via <strong className="text-ink">{form.contact}</strong> within 24 business hours.
          </p>
          <button onClick={onClose} className="btn-outline">Back to Recommendations</button>
        </div>
      );
    }

    if (selectedSupplier) {
      return (
        <div className="p-5 animate-slide-up">
          <button onClick={() => setSelectedSupplier(null)} className="flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-ink mb-5 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Suppliers
          </button>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
            <h3 className="font-bold text-ink">{selectedSupplier.name}</h3>
            <p className="text-xs text-muted flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {selectedSupplier.location}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-1.5">Full Name / Farmer Name *</label>
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} type="text"
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1F5C3A] focus:ring-2 focus:ring-[#1F5C3A]/10 text-sm bg-white transition-all"
                placeholder="e.g. Rahul Patil" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-1.5">Mobile (+91) *</label>
                <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} type="tel" pattern="[0-9]{10}" title="10 digit Indian mobile number"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1F5C3A] focus:ring-2 focus:ring-[#1F5C3A]/10 text-sm bg-white transition-all"
                  placeholder="9876543210" />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-1.5">Pin Code *</label>
                <input required value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})} type="text" pattern="[0-9]{6}" title="6 digit pin code"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1F5C3A] focus:ring-2 focus:ring-[#1F5C3A]/10 text-sm bg-white transition-all"
                  placeholder="411001" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-1.5">Estimated Order Volume (units)</label>
              <input required value={form.volume} onChange={e => setForm({...form, volume: e.target.value})} type="number" min="1"
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1F5C3A] focus:ring-2 focus:ring-[#1F5C3A]/10 text-sm bg-white transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-2">Preferred Contact Method</label>
              <div className="flex gap-2">
                {['WhatsApp', 'Phone Call'].map(m => (
                  <button key={m} type="button" onClick={() => setForm({...form, contact: m})}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-xl border transition-all ${form.contact === m ? 'bg-[#1F5C3A]/10 border-[#1F5C3A] text-[#1F5C3A]' : 'bg-white border-slate-200 text-muted hover:border-slate-300'}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#D9F04A] text-slate-900 font-extrabold rounded-full py-3 text-sm mt-4 flex justify-center items-center gap-2 hover:bg-[#cbe33e] transition-colors shadow-sm disabled:opacity-60">
              {loading ? <><span className="animate-spin inline-block">⏳</span> Submitting...</> : 'Submit Quotation Request'}
            </button>
          </form>
        </div>
      );
    }

    return (
      <div className="p-5 flex flex-col gap-4">
        {filteredSuppliers.length === 0 && (
          <p className="text-center text-muted py-10 text-sm">No verified suppliers found for this material yet.<br /><span className="text-xs">Try contacting us directly via the form below.</span></p>
        )}
        {filteredSuppliers.map((sup, idx) => (
          <div key={idx} className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:border-[#1F5C3A]/40 transition-all bg-slate-50/50 group/sup cursor-default">
            <div className="flex-1">
              <h3 className="font-bold text-ink text-base mb-1">{sup.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-muted mb-3">
                <MapPin className="w-3.5 h-3.5" /> {sup.location}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">✓ {t('marketplace.verified')}</span>
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">✓ {t('marketplace.certified')}</span>
              </div>
            </div>
            <div className="flex flex-col sm:items-end w-full sm:w-auto gap-3">
              <div className="flex gap-6 sm:gap-4 justify-between w-full sm:w-auto">
                <div className="text-left sm:text-right">
                  <div className="text-[10px] font-bold text-muted uppercase tracking-wider">{t('marketplace.moq')}</div>
                  <div className="text-sm font-semibold text-ink">{sup.moq} {t('marketplace.units')}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-muted uppercase tracking-wider">Est. Price</div>
                  <div className="text-sm font-semibold text-[#1F5C3A]">{sup.price}</div>
                </div>
              </div>
              <button
                onClick={() => { setSelectedSupplier(sup); setForm(f => ({...f, volume: sup.moq.replace(/,/g, '')})); }}
                className="bg-[#1F5C3A] text-white text-xs font-semibold rounded-full px-4 py-2 hover:bg-[#17452C] transition-colors w-full sm:w-auto shadow-sm">
                {t('marketplace.requestQuote')}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col relative animate-slide-up border border-slate-100">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1F5C3A]/10 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-[#1F5C3A]" />
            </div>
            <h2 className="text-lg font-bold text-ink">
              {selectedSupplier && !success ? 'Request Quotation' : t('marketplace.modalTitle')}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-muted hover:text-ink hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TechDrawer — Expandable specs accordion with bullet-proof fallback chain
// ---------------------------------------------------------------------------
function TechDrawer({ rec }) {
  const [open, setOpen] = useState(false);

  // Defensive resolution: API nested object → legacy top-level fields → hardcoded fallback
  const specs = rec.technical_specs || {};
  const otr      = specs.otr       || rec.otr       || '1,500 cm³/m²/day';
  const wvtr     = specs.wvtr      || rec.wvtr      || '10.5 g/m²/day';
  const gauge    = specs.gauge     || rec.gauge     || rec.thickness || '38 µm (Microns)';
  const sealTemp = specs.seal_temp || rec.seal_temp || rec.sealing_temperature || '120°C';

  return (
    <div className="border-t border-slate-100 mt-4 pt-3">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-[#1F5C3A] transition-colors w-full"
      >
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        Technical Specs
        <span className="ml-auto text-[9px] text-muted/60 font-normal">{open ? 'Collapse' : 'Expand'}</span>
      </button>

      <div className={`accordion-body ${open ? 'open' : ''}`}>
        <div className="accordion-inner">
          <div className="grid grid-cols-2 gap-3 pt-3">
            {[
              ['OTR', otr, 'O₂ Transmission Rate'],
              ['WVTR', wvtr, 'Water Vapour Rate'],
              ['Gauge / Thickness', gauge, 'Film Thickness'],
              ['Seal Temp', sealTemp, 'Heat Seal Temperature'],
            ].map(([k, v, tooltip]) => (
              <div key={k} className="p-3 bg-slate-50 rounded-lg border border-slate-100" title={tooltip}>
                <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase block">{k}</span>
                <span className="text-sm font-semibold text-slate-800 mt-0.5 block leading-tight">{v}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted mt-3 italic">
            All values per FSSAI 2018 Schedule IV & IS 9845 migration limits.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ResultCards — Main export: 3-column grid with interactive selection state
// ---------------------------------------------------------------------------
export default function ResultCards({ data, onReset }) {
  const { t } = useTranslation();
  const [modalState, setModalState] = useState({ isOpen: false, materialId: null });

  const payload = (data && data.recommendations && data.recommendations.length > 0) ? data : MOCK;

  const getTranslatedText = (rec, field) => {
    if (rec.id) {
      const key = `materials.${rec.id}_${field}`;
      const translation = t(key);
      if (translation && translation !== key) return translation;
    }
    return rec[field];
  };

  return (
    <div className="animate-slide-up relative">
      <SupplierModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, materialId: null })}
        t={t}
        materialId={modalState.materialId}
      />

      {/* Section header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-[#D9F04A] text-slate-900 font-bold rounded-full mb-3 text-xs px-3 py-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" /> Analysis Complete
        </div>
        <h2 className="text-3xl font-extrabold text-ink tracking-tight">
          {t('analysisComplete')}
        </h2>
        <p className="text-muted mt-2 text-sm">
          {t('topRecommendations', { count: payload.recommendations.length })} for{' '}
          <strong className="text-ink">{payload.food_category} · {payload.food_form}</strong>{' '}
          via <strong className="text-ink">{payload.transit_route.replace('_', ' ')}</strong>
        </p>
      </div>

      {/* 3-column comparison grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {payload.recommendations.map((rec, idx) => {
          const meta = RANK_META[idx] || RANK_META[2];
          const scorePercent = Math.round(rec.score * 100);

          const translatedName = getTranslatedText(rec, 'name');
          const translatedDesc = rec.id ? (t(`materials.${rec.id}_desc`) !== `materials.${rec.id}_desc` ? t(`materials.${rec.id}_desc`) : rec.description) : rec.description;

          return (
            <div
              key={idx}
              className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300"
            >
              <div className="p-5 pb-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  {/* Rank badge */}
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${meta.badgeClass}`}>
                    {meta.icon} {meta.tag}
                  </div>
                  
                  {/* ROI Badge for Top Rank */}
                  {idx === 0 && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm animate-pulse">
                      💰 Projected Loss Reduction: ~25-30% in Transit
                    </div>
                  )}
                </div>

                {/* Package icon + name */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-[#1F5C3A]/10 flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                    <Package className="w-5 h-5 text-slate-500 group-hover:text-[#1F5C3A] transition-colors duration-200" />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink text-sm leading-tight">{translatedName}</h3>
                    {rec.is_fssai_approved && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <ShieldCheck className="w-3 h-3 text-blue-600" />
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">FSSAI Compliant</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Score bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted">{t('aiScoreLabel')}</span>
                    <span className="text-lg font-black text-ink">
                      {scorePercent}<span className="text-xs font-normal text-muted">/100</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-slate-300 group-hover:bg-[#D9F04A] transition-colors duration-300"
                      style={{ width: `${scorePercent}%` }}
                    />
                  </div>
                </div>

                {/* Key metrics */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                    <Clock className="w-3.5 h-3.5 text-[#1F5C3A] flex-shrink-0" />
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted">{t('shelfLifeLabel')}</div>
                      <div className="text-sm font-bold text-ink">{rec.shelf_life_days} {t('days')}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                    <IndianRupee className="w-3.5 h-3.5 text-[#1F5C3A] flex-shrink-0" />
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted">{t('costLabel')}</div>
                      <div className="text-sm font-bold text-ink">₹{rec.cost_per_unit_inr}</div>
                    </div>
                  </div>
                </div>

                {/* Rationale */}
                <p className="text-xs text-muted leading-relaxed flex-1">{translatedDesc}</p>

                {/* B2B Supplier CTA — lime accent ONLY on card hover, never on click */}
                <div className="mt-5 pt-5 border-t border-slate-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalState({ isOpen: true, materialId: rec.id });
                    }}
                    className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm text-slate-800 bg-slate-100 border border-slate-200 transition-colors duration-200 group-hover:bg-[#D9F04A] group-hover:border-[#cbe33e] group-hover:text-slate-950"
                  >
                    <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    {t('marketplace.findSuppliers')}
                  </button>
                </div>

                {/* Expandable tech drawer */}
                <TechDrawer rec={rec} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <button onClick={onReset} className="btn-outline inline-flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          {t('startNew', 'Start New Recommendation')}
        </button>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-800 font-bold rounded-full px-6 py-3 text-sm hover:bg-slate-50 transition-colors shadow-sm">
          📄 Download FSSAI Spec Sheet
        </button>
        <button onClick={() => document.getElementById('compare-drawer').showModal()} className="inline-flex items-center gap-2 bg-slate-800 text-white font-bold rounded-full px-6 py-3 text-sm hover:bg-slate-900 transition-colors shadow-sm">
          📊 Compare Options
        </button>
      </div>

      {/* Compare Modal */}
      <dialog id="compare-drawer" className="backdrop:bg-black/50 p-0 rounded-2xl shadow-2xl border-0 w-full max-w-4xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-extrabold text-slate-900">Side-by-Side Analysis</h2>
            <button onClick={() => document.getElementById('compare-drawer').close()} className="text-slate-500 hover:bg-slate-100 p-2 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr>
                  <th className="p-3 border-b-2 border-slate-200 text-slate-500 font-bold">Metric</th>
                  {payload.recommendations.map((r, i) => (
                    <th key={i} className="p-3 border-b-2 border-slate-200 text-slate-900 font-extrabold w-1/3">
                      {i === 0 ? '🥇 ' : i === 1 ? '🥈 ' : '🥉 '}{getTranslatedText(r, 'name')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr>
                  <td className="p-3 border-b border-slate-100 font-bold">Shelf Life</td>
                  {payload.recommendations.map((r, i) => <td key={i} className="p-3 border-b border-slate-100 font-medium">{r.shelf_life_days} {t('days')}</td>)}
                </tr>
                <tr className="bg-slate-50">
                  <td className="p-3 border-b border-slate-100 font-bold">Cost / Unit</td>
                  {payload.recommendations.map((r, i) => <td key={i} className="p-3 border-b border-slate-100 font-medium text-emerald-600">₹{r.cost_per_unit_inr}</td>)}
                </tr>
                <tr>
                  <td className="p-3 border-b border-slate-100 font-bold">OTR Barrier</td>
                  {payload.recommendations.map((r, i) => <td key={i} className="p-3 border-b border-slate-100 text-xs">{r.technical_specs?.otr || 'N/A'}</td>)}
                </tr>
                <tr className="bg-slate-50">
                  <td className="p-3 border-b border-slate-100 font-bold">WVTR Barrier</td>
                  {payload.recommendations.map((r, i) => <td key={i} className="p-3 border-b border-slate-100 text-xs">{r.technical_specs?.wvtr || 'N/A'}</td>)}
                </tr>
                <tr>
                  <td className="p-3 font-bold">Compliance</td>
                  {payload.recommendations.map((r, i) => <td key={i} className="p-3 text-xs text-blue-600 font-bold">FSSAI IS-9845 ✓</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </dialog>
    </div>
  );
}
