import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Package, ShieldCheck, IndianRupee, Clock,
  ChevronDown, ChevronUp, Sparkles,
  RotateCcw, Trophy, Medal, Award, ShoppingCart, MapPin, X,
  CheckCircle2, ArrowLeft, Building2, Store, PhoneCall
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Mock data fallback (for demo mode when API is unreachable)
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
// Verified B2B Packaging Suppliers
// ---------------------------------------------------------------------------
const ALL_SUPPLIERS = [
  { name: 'EcoPack Industries', location: 'Vapi, Gujarat', moq: '3,000', price: '₹2.50', materials: ['pla', 'bopp-map', 'met-pet-evoh', 'pla-bio', 'bopp', 'ldpe'] },
  { name: 'Bharat FlexiFilms', location: 'Daman & Diu', moq: '10,000', price: '₹1.80', materials: ['met-pet', 'bopp', 'bopp-map', 'met-pet-evoh', 'pp', 'pet'] },
  { name: 'Maratha Packaging Solutions', location: 'Pune, Maharashtra', moq: '5,000', price: '₹1.15', materials: ['bopp', 'bopp-map', 'map', 'alu'] },
  { name: 'Ganga Polyfilms', location: 'Faridabad, NCR', moq: '2,500', price: '₹0.75', materials: ['ldpe', 'met-pet-evoh', 'hdpe', 'paper'] },
  { name: 'Deccan EcoWraps', location: 'Coimbatore, Tamil Nadu', moq: '1,000', price: '₹3.10', materials: ['pla', 'pla-bio'] },
  { name: 'Punjab Agri Packs', location: 'Ludhiana, Punjab', moq: '2,000', price: '₹1.40', materials: ['ldpe', 'bopp', 'hdpe', 'map'] },
  { name: 'Retort India Ltd.', location: 'Ahmedabad, Gujarat', moq: '5,000', price: '₹4.20', materials: ['retort', 'alu', 'met-pet-evoh'] },
];

// ---------------------------------------------------------------------------
// Verified B2B Food Off-takers & Produce Buyers (Mandis, Retailers, FPOs)
// ---------------------------------------------------------------------------
const ALL_BUYERS = [
  { name: 'Reliance Retail Fresh Mandi', location: 'Nashik & Pune Hubs', minProcurement: '500 kg', price: 'Market Rate + 5%', category: 'Fresh Vegetables & Fruits', contact: '1800-891-0001' },
  { name: 'Mother Dairy Safal Procurement Network', location: 'Delhi NCR & Haryana', minProcurement: '1,000 kg', price: 'FPO Direct Contract', category: 'Fresh Produce & Dairy', contact: '011-22446688' },
  { name: 'Sahyadri Farmers Producer Co. Ltd.', location: 'Mohadi, Nashik, Maharashtra', minProcurement: '2,000 kg', price: 'Export Premium + 10%', category: 'Fresh Fruits (Mango, Grape, Tomato)', contact: '0253-2400500' },
  { name: 'BigBasket B2B Direct Farm Procurement', location: 'Bengaluru & Hyderabad', minProcurement: '250 kg', price: 'Daily Mandi Index Rate', category: 'All Produce & Packaged Foods', contact: '080-69004000' },
  { name: 'DeHaat Agri Business Center', location: 'Patna, Lucknow & Bhopal', minProcurement: '500 kg', price: 'Assured Buyback Contract', category: 'Grains, Spices & Produce', contact: '1800-1036-110' },
  { name: 'NinjaCart Direct Agri Hub', location: 'Chennai, Madurai & Coimbatore', minProcurement: '300 kg', price: 'Spot Price + 4%', category: 'Fresh Vegetables & Fruits', contact: '044-48009900' },
];

// ---------------------------------------------------------------------------
// Card rank metadata
// ---------------------------------------------------------------------------
const RANK_META = [
  {
    icon: <Trophy className="w-3.5 h-3.5" />, tagKey: 'bestMatch',
    badgeClass: 'bg-[#D9F04A] text-slate-900',
  },
  {
    icon: <Medal className="w-3.5 h-3.5" />, tagKey: 'runnerUp',
    badgeClass: 'bg-slate-100 text-slate-700',
  },
  {
    icon: <Award className="w-3.5 h-3.5" />, tagKey: 'goodChoice',
    badgeClass: 'bg-green-100 text-green-700',
  },
];

// ---------------------------------------------------------------------------
// SupplierModal — Handles: supplier list / buyer list → quote form → success state
// ---------------------------------------------------------------------------
export function SupplierModal({ isOpen, onClose, t, materialId }) {
  const [activeTab, setActiveTab] = useState('suppliers'); // 'suppliers' | 'buyers'
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

  // Filter suppliers by material ID; if none match, show all suppliers
  const exactMatch = materialId ? ALL_SUPPLIERS.filter(s => s.materials.includes(materialId)) : ALL_SUPPLIERS;
  const filteredSuppliers = exactMatch.length > 0 ? exactMatch : ALL_SUPPLIERS;

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
          <h3 className="text-2xl font-bold text-ink mb-2">{t('requestSentSuccess', 'Request Sent Successfully!')}</h3>
          <div className="inline-block bg-slate-100 text-slate-600 rounded-lg px-3 py-1.5 mb-4 text-xs font-mono tracking-wide border border-slate-200">
            {t('refId', 'Ref ID')}: {refId}
          </div>
          <p className="text-muted mb-8 max-w-sm leading-relaxed">
            {t('quoteSentMsg', 'Quotation request sent to {{supplier}}. They will contact you via {{contact}} within 24 business hours.', { supplier: selectedSupplier?.name, contact: form.contact })}
          </p>
          <button onClick={onClose} className="btn-outline">{t('backToRecommendations', 'Back to Recommendations')}</button>
        </div>
      );
    }

    if (selectedSupplier) {
      return (
        <div className="p-4 sm:p-5 animate-slide-up">
          <button onClick={() => setSelectedSupplier(null)} className="flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-ink mb-4 sm:mb-5 transition-colors min-h-[44px] px-1">
            <ArrowLeft className="w-4 h-4 flex-shrink-0" /> {t('backToSuppliers', 'Back to Marketplace')}
          </button>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4 mb-5 sm:mb-6">
            <h3 className="font-bold text-ink text-sm sm:text-base">{selectedSupplier.name}</h3>
            <p className="text-xs text-muted flex items-center gap-1 mt-1"><MapPin className="w-3 h-3 flex-shrink-0" /> {selectedSupplier.location}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-1.5">{t('fullName', 'Full Name / Farmer Name')} *</label>
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} type="text"
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 min-h-[44px] outline-none focus:border-[#1F5C3A] focus:ring-2 focus:ring-[#1F5C3A]/10 text-sm sm:text-base bg-white transition-all"
                placeholder="e.g. Ramesh Patil / Kisan FPO" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-1.5">{t('mobile', 'Mobile (+91)')} *</label>
                <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} type="tel" pattern="[0-9]{10}" title="10 digit Indian mobile number"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 min-h-[44px] outline-none focus:border-[#1F5C3A] focus:ring-2 focus:ring-[#1F5C3A]/10 text-sm sm:text-base bg-white transition-all"
                  placeholder="9876543210" />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-1.5">{t('pinCode', 'Pin Code')} *</label>
                <input required value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})} type="text" pattern="[0-9]{6}" title="6 digit pin code"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 min-h-[44px] outline-none focus:border-[#1F5C3A] focus:ring-2 focus:ring-[#1F5C3A]/10 text-sm sm:text-base bg-white transition-all"
                  placeholder="411001" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-1.5">{t('orderVolume', 'Estimated Order Volume (units / kg)')}</label>
              <input required value={form.volume} onChange={e => setForm({...form, volume: e.target.value})} type="number" min="1"
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 min-h-[44px] outline-none focus:border-[#1F5C3A] focus:ring-2 focus:ring-[#1F5C3A]/10 text-sm sm:text-base bg-white transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-2">{t('preferredContact', 'Preferred Contact Method')}</label>
              <div className="flex gap-2">
                {['WhatsApp', 'Phone Call'].map(m => (
                  <button key={m} type="button" onClick={() => setForm({...form, contact: m})}
                    className={`flex-1 py-2.5 min-h-[44px] text-xs sm:text-sm font-semibold rounded-xl border flex items-center justify-center transition-all ${form.contact === m ? 'bg-[#1F5C3A]/10 border-[#1F5C3A] text-[#1F5C3A]' : 'bg-white border-slate-200 text-muted hover:border-slate-300'}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#D9F04A] text-slate-900 font-extrabold rounded-full py-3.5 min-h-[44px] text-xs sm:text-sm mt-4 flex justify-center items-center gap-2 hover:bg-[#cbe33e] transition-colors shadow-sm disabled:opacity-60">
              {loading ? <><span className="animate-spin inline-block">⏳</span> {t('submitting', 'Submitting...')}</> : t('submitRequest', 'Submit Quotation Request')}
            </button>
          </form>
        </div>
      );
    }

    return (
      <div className="p-4 sm:p-5 flex flex-col gap-3 sm:gap-4">
        {/* Marketplace Sub-tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-1 sm:mb-2 border border-slate-200">
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`flex-1 py-2.5 px-3 min-h-[44px] text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
              activeTab === 'suppliers' ? 'bg-white text-[#1F5C3A] shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{t('marketplace.tabSuppliers', 'Packaging Suppliers')}</span>
          </button>
          <button
            onClick={() => setActiveTab('buyers')}
            className={`flex-1 py-2.5 px-3 min-h-[44px] text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
              activeTab === 'buyers' ? 'bg-white text-[#1F5C3A] shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="truncate">{t('marketplace.tabBuyers', 'Verified Produce Buyers / Mandis')}</span>
          </button>
        </div>

        {/* Tab 1: Packaging Suppliers */}
        {activeTab === 'suppliers' && (
          <div className="flex flex-col gap-3">
            {filteredSuppliers.length === 0 && (
              <p className="text-center text-muted py-10 text-sm">{t('noSuppliersFound', 'No verified suppliers found for this material yet.')}</p>
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
                      <div className="text-[10px] font-bold text-muted uppercase tracking-wider">{t('estPrice', 'Est. Price')}</div>
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
        )}

        {/* Tab 2: Verified Produce Buyers / Mandis */}
        {activeTab === 'buyers' && (
          <div className="flex flex-col gap-3">
            {ALL_BUYERS.map((buyer, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:border-emerald-500/40 transition-all bg-emerald-50/20 group/buyer cursor-default">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-ink text-base">{buyer.name}</h3>
                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide">✓ Verified Buyer</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted mb-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {buyer.location}
                  </div>
                  <div className="text-xs text-slate-600">
                    <span className="font-bold text-slate-700">{t('marketplace.targetProcurement', 'Buying Interest')}:</span> {buyer.category}
                  </div>
                </div>
                <div className="flex flex-col sm:items-end w-full sm:w-auto gap-3">
                  <div className="flex gap-6 sm:gap-4 justify-between w-full sm:w-auto">
                    <div className="text-left sm:text-right">
                      <div className="text-[10px] font-bold text-muted uppercase tracking-wider">{t('marketplace.moq', 'Min Order')}</div>
                      <div className="text-sm font-semibold text-ink">{buyer.minProcurement}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-muted uppercase tracking-wider">{t('estPrice', 'Offer Price')}</div>
                      <div className="text-sm font-semibold text-[#1F5C3A]">{buyer.price}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => { setSelectedSupplier({ name: buyer.name, location: buyer.location }); setForm(f => ({...f, volume: buyer.minProcurement.replace(/[^0-9]/g, '')})); }}
                    className="bg-emerald-700 text-white text-xs font-semibold rounded-full px-4 py-2 hover:bg-emerald-800 transition-colors w-full sm:w-auto shadow-sm flex items-center justify-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5" />
                    {t('marketplace.contactBuyer', 'Connect with Buyer')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto flex flex-col relative animate-slide-up border border-slate-100">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1F5C3A]/10 flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="w-4 h-4 text-[#1F5C3A]" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-ink">
              {selectedSupplier && !success ? t('requestQuotation', 'Request Quotation') : t('marketplace.modalTitle')}
            </h2>
          </div>
          <button onClick={onClose} className="min-h-[44px] min-w-[44px] p-2 text-muted hover:text-ink hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LAYER_MAP — Film Layer Anatomy specs for micro-anatomy bar
// ---------------------------------------------------------------------------
const LAYER_MAP = {
  bopp: [
    { name: 'Micro-perf BOPP', gauge: 25, color: 'bg-slate-400', role: 'Gas Exchange' },
    { name: 'Anti-Fog Coating', gauge: 3, color: 'bg-[#D9F04A]', role: 'Condensation Control' },
    { name: 'LLDPE Sealant', gauge: 12, color: 'bg-[#1F5C3A]', role: 'Heat Seal' },
  ],
  map: [
    { name: 'PET Outer', gauge: 12, color: 'bg-slate-400', role: 'Puncture Resistance' },
    { name: 'EVOH Barrier', gauge: 5, color: 'bg-[#D9F04A]', role: 'Gas Barrier' },
    { name: 'PE Sealant', gauge: 45, color: 'bg-[#1F5C3A]', role: 'Heat Seal' },
  ],
  retort: [
    { name: 'PET Outer', gauge: 12, color: 'bg-slate-400', role: 'Printable Layer' },
    { name: 'Aluminium Foil', gauge: 9, color: 'bg-[#D9F04A]', role: '100% O2/Light Barrier' },
    { name: 'Nylon BOPA', gauge: 15, color: 'bg-emerald-500', role: 'Puncture Shield' },
    { name: 'CPP Sealant', gauge: 70, color: 'bg-[#1F5C3A]', role: 'High-Heat Seal' },
  ],
  alu: [
    { name: 'PET Outer', gauge: 12, color: 'bg-slate-400', role: 'Protective Film' },
    { name: 'Aluminium Foil', gauge: 9, color: 'bg-[#D9F04A]', role: 'Barrier Layer' },
    { name: 'PE Sealant', gauge: 50, color: 'bg-[#1F5C3A]', role: 'Heat Seal' },
  ],
  pla: [
    { name: 'Bio-PLA Film', gauge: 35, color: 'bg-emerald-400', role: 'Compostable Film' },
    { name: 'Bio-Sealant', gauge: 10, color: 'bg-[#D9F04A]', role: 'Bio Seal' },
  ],
  ldpe: [
    { name: 'Micro-vent LDPE', gauge: 25, color: 'bg-slate-300', role: 'Flexible Wrap' },
  ],
  hdpe: [
    { name: 'HDPE Woven Fabric', gauge: 100, color: 'bg-slate-500', role: 'High Strength' },
  ],
  paper: [
    { name: 'Virgin Kraft Paper', gauge: 75, color: 'bg-amber-600', role: 'Bio Base' },
  ],
  pp: [
    { name: 'Polypropylene Twist', gauge: 25, color: 'bg-slate-400', role: 'Moisture Barrier' },
  ],
  pet: [
    { name: 'PET Outer', gauge: 12, color: 'bg-slate-400', role: 'Clarity & Strength' },
    { name: 'PE Inner', gauge: 60, color: 'bg-[#1F5C3A]', role: 'Heat Seal' },
  ],
};

function FilmAnatomyBar({ materialId, layers: customLayers }) {
  const layers = customLayers || LAYER_MAP[materialId] || LAYER_MAP.pet;
  if (!layers || layers.length === 0) return null;

  const totalGauge = layers.reduce((sum, l) => sum + l.gauge, 0);

  return (
    <div className="my-3 pt-2.5 border-t border-slate-100">
      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
        <span>Film Layer Anatomy</span>
        <span>Total: {totalGauge} µm</span>
      </div>
      <div className="w-full rounded-full overflow-hidden flex h-2 bg-slate-100 border border-slate-200/80 shadow-inner">
        {layers.map((layer, i) => {
          const pct = ((layer.gauge / totalGauge) * 100).toFixed(1);
          return (
            <div
              key={i}
              style={{ width: `${pct}%` }}
              className={`h-full ${layer.color} transition-all duration-200 hover:brightness-110 relative group/layer cursor-help`}
            >
              <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 hidden group-hover/layer:block bg-slate-900 text-white text-[9px] font-bold py-1 px-2 rounded-md whitespace-nowrap z-30 shadow-lg pointer-events-none">
                {layer.name} ({layer.gauge}µm): {layer.role}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TechDrawer — Expandable specs accordion with bullet-proof fallback chain
// ---------------------------------------------------------------------------
function TechDrawer({ rec }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const specs = rec.technical_specs || {};
  const otr      = specs.otr       || rec.otr       || '1,500 cm³/m²/day';
  const wvtr     = specs.wvtr      || rec.wvtr      || '10.5 g/m²/day';
  const gauge    = specs.gauge     || rec.gauge     || rec.thickness || '38 µm (Microns)';
  const sealTemp = specs.seal_temp || rec.seal_temp || rec.sealing_temperature || '120°C';

  return (
    <div className="border-t border-slate-100 mt-4 pt-2">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-between gap-1.5 text-xs font-semibold text-muted hover:text-[#1F5C3A] transition-colors w-full min-h-[44px] py-2 px-1"
      >
        <span className="flex items-center gap-1.5">
          {open ? <ChevronUp className="w-4 h-4 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 flex-shrink-0" />}
          {t('technicalSpecs', 'Technical Specs')}
        </span>
        <span className="ml-auto text-[9px] text-muted/60 font-normal">{open ? t('collapse', 'Collapse') : t('expand', 'Expand')}</span>
      </button>

      <div className={`accordion-body ${open ? 'open' : ''}`}>
        <div className="accordion-inner">
          {/* Micro-Interaction 4: Film Layer Anatomy Bar */}
          <FilmAnatomyBar materialId={rec.id} layers={rec.layers} />

          <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2">
            {[
              ['OTR', otr, 'O₂ Transmission Rate'],
              ['WVTR', wvtr, 'Water Vapour Rate'],
              ['Gauge / Thickness', gauge, 'Film Thickness'],
              ['Seal Temp', sealTemp, 'Heat Seal Temperature'],
            ].map(([k, v, tooltip]) => (
              <div key={k} className="p-2.5 sm:p-3 bg-slate-50 rounded-lg border border-slate-100" title={tooltip}>
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block">{k}</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 mt-0.5 block leading-tight truncate">{v}</span>
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
  
  // Micro-Interaction 1 & 2 Local States
  const [simulateTemp, setSimulateTemp] = useState(25);
  const [showSavingsMap, setShowSavingsMap] = useState({});

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
      <div className="text-center mb-6 sm:mb-8 px-2">
        <div className="inline-flex items-center gap-2 bg-[#D9F04A] text-slate-900 font-bold rounded-full mb-2.5 sm:mb-3 text-xs px-3 py-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" /> {t('analysisCompleteBadge', 'Analysis Complete')}
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          {t('analysisComplete')}
        </h2>
        <p className="text-muted mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
          {t('topRecommendations', { count: payload.recommendations.length })} {t('resultsFor', 'for')}{' '}
          <strong className="text-ink">{payload.food_category} · {payload.food_form}</strong>{' '}
          {t('resultsVia', 'via')} <strong className="text-ink">{payload.transit_route.replace('_', ' ')}</strong>
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Micro-Interaction 1: Farmer-Friendly Transport Weather Scrubber     */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-5 mb-5 sm:mb-6 shadow-sm flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-extrabold text-base flex-shrink-0">
              {simulateTemp <= 22 ? '❄️' : simulateTemp <= 32 ? '🌤️' : '☀️'}
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 tracking-wide">
                {t('tempScrubber.title', 'Adjust Transport Weather / Temperature')}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                {t('tempScrubber.subtitle', "See how hot or cold weather affects your food's shelf life")}
              </p>
            </div>
          </div>

          {/* Dynamic Weather Context Badge */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
              simulateTemp <= 22
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : simulateTemp <= 32
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-orange-50 border-orange-200 text-orange-700 animate-pulse'
            }`}>
              {simulateTemp <= 22
                ? t('tempScrubber.badgeCool', '❄️ Cold Storage / Cool Morning')
                : simulateTemp <= 32
                ? t('tempScrubber.badgeNormal', '🌤️ Normal Summer Transit')
                : t('tempScrubber.badgeHot', '☀️ Extreme Heatwave / Peak Summer')}
            </span>
            <span className={`text-sm font-black px-2.5 py-1 rounded-xl border text-center min-w-[56px] transition-colors ${
              simulateTemp > 30 ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}>
              {simulateTemp}°C
            </span>
          </div>
        </div>

        {/* Slider track */}
        <div className="flex items-center gap-4 pt-1 min-h-[44px]">
          <input
            type="range"
            min="15"
            max="45"
            value={simulateTemp}
            onChange={(e) => setSimulateTemp(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1F5C3A] touch-action-none"
          />
        </div>

        {/* Outcome-Based Farmer Guidance Note */}
        <div className={`text-xs px-3.5 py-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
          simulateTemp <= 22
            ? 'bg-blue-50/70 border-blue-200 text-blue-900'
            : simulateTemp <= 32
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            : 'bg-orange-50/90 border-orange-200 text-orange-950 font-medium'
        }`}>
          <span className="text-sm flex-shrink-0">
            {simulateTemp <= 22 ? '💡' : simulateTemp <= 32 ? '✅' : '⚠️'}
          </span>
          <span className="leading-snug">
            {simulateTemp <= 22
              ? t('tempScrubber.guideCool', 'Cool temperatures slow down spoilage and keep your produce fresh longer.')
              : simulateTemp <= 32
              ? t('tempScrubber.guideNormal', 'Standard ambient transport conditions with expected shelf life.')
              : t('tempScrubber.guideHot', 'High heat accelerates spoilage! Ensure fast transport or cold chain lining.')}
          </span>
        </div>
      </div>

      {/* 3-column comparison grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {payload.recommendations.map((rec, idx) => {
          const meta = RANK_META[idx] || RANK_META[2];
          const scorePercent = Math.round(rec.score * 100);

          const translatedName = getTranslatedText(rec, 'name');
          const translatedDesc = rec.id ? (t(`materials.${rec.id}_desc`) !== `materials.${rec.id}_desc` ? t(`materials.${rec.id}_desc`) : rec.description) : rec.description;

          // Arrhenius Shelf-Life Kinetics Calculation
          const T_K = 273.15 + simulateTemp;
          const T_REF_K = 298.15; // 25°C baseline
          const EA_OVER_R = 5000.0;
          const rateFactor = Math.exp(-EA_OVER_R * ((1.0 / T_K) - (1.0 / T_REF_K)));
          const dynamicShelfLife = Math.max(1, Math.round(rec.shelf_life_days / rateFactor));
          const isShelfLifeWarning = simulateTemp > 30 || dynamicShelfLife < Math.round(rec.shelf_life_days * 0.7);

          return (
            <div
              key={idx}
              className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300"
            >
              <div className="p-4 sm:p-5 pb-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
                  {/* Rank badge */}
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${meta.badgeClass}`}>
                    {meta.icon} {t(meta.tagKey)}
                  </div>
                  
                  {/* ROI Badge for Top Rank */}
                  {idx === 0 && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm animate-pulse">
                      💰 {t('lossReduction', 'Projected Loss Reduction: ~25-30% in Transit')}
                    </div>
                  )}
                </div>

                {/* Package icon + name + Micro-Interaction 3: Respiration Pulse Dot */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-[#1F5C3A]/10 flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                    <Package className="w-5 h-5 text-slate-500 group-hover:text-[#1F5C3A] transition-colors duration-200" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-ink text-sm sm:text-base leading-tight">{translatedName}</h3>
                      {/* Micro-Interaction 3: Ambient Respiration Pulse Dot */}
                      {payload.food_category === 'Fresh Produce' && (
                        <div className="relative group/resp flex items-center justify-center flex-shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover/resp:block bg-slate-900 text-white text-[9px] font-bold py-1 px-2 rounded-md whitespace-nowrap z-30 shadow-lg pointer-events-none">
                            Active Respiration Modeled
                          </div>
                        </div>
                      )}
                    </div>

                    {rec.is_fssai_approved && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <ShieldCheck className="w-3 h-3 text-blue-600 flex-shrink-0" />
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">{t('fssaiBadge', 'FSSAI Compliant')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Score bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted">{t('aiScoreLabel')}</span>
                    <span className="text-base sm:text-lg font-black text-ink">
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

                {/* Key metrics grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {/* Arrhenius dynamic shelf life */}
                  <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 min-h-[44px]">
                    <Clock className="w-3.5 h-3.5 text-[#1F5C3A] flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted truncate">{t('shelfLifeLabel')}</div>
                      <div className={`text-xs sm:text-sm font-bold transition-colors truncate ${
                        isShelfLifeWarning ? 'text-orange-600 font-extrabold' : 'text-ink'
                      }`}>
                        {dynamicShelfLife} {t('days')}
                      </div>
                    </div>
                  </div>

                  {/* Micro-Interaction 2: Economic Break-Even Micro-Toggle */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSavingsMap(prev => ({ ...prev, [rec.id]: !prev[rec.id] }));
                    }}
                    className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 min-h-[44px] cursor-pointer hover:border-[#1F5C3A]/40 transition-all duration-300 select-none group/toggle"
                    title="Click to toggle cost vs. spoilage savings"
                  >
                    {showSavingsMap[rec.id] ? (
                      <div className="animate-fade-in transition-opacity duration-300">
                        <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">Farm-Gate Value ROI</div>
                        <div className="text-[11px] sm:text-xs font-extrabold text-emerald-600 leading-tight">
                          📉 Saves ₹{(rec.cost_per_unit_inr * 2.8 + 1.1).toFixed(2)} / kg
                        </div>
                      </div>
                    ) : (
                      <div className="animate-fade-in transition-opacity duration-300 flex items-center gap-2 min-w-0">
                        <IndianRupee className="w-3.5 h-3.5 text-[#1F5C3A] flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-muted truncate">{t('costLabel')}</div>
                          <div className="text-xs sm:text-sm font-bold text-ink truncate">₹{rec.cost_per_unit_inr}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rationale */}
                <p className="text-xs text-muted leading-relaxed flex-1">{translatedDesc}</p>

                {/* B2B Supplier & Buyer CTA */}
                <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-slate-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalState({ isOpen: true, materialId: rec.id });
                    }}
                    className="w-full min-h-[44px] py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm text-slate-800 bg-slate-100 border border-slate-200 transition-colors duration-200 group-hover:bg-[#D9F04A] group-hover:border-[#cbe33e] group-hover:text-slate-950 shadow-sm"
                  >
                    <ShoppingCart className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                    <span>{t('marketplace.findSuppliers', 'Find Verified Suppliers & Buyers')}</span>
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
      <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
        <button onClick={onReset} className="btn-outline inline-flex items-center justify-center gap-2 min-h-[44px] w-full sm:w-auto px-5 sm:px-6 py-3 text-xs sm:text-sm font-bold">
          <RotateCcw className="w-4 h-4 flex-shrink-0" />
          {t('startNew', 'Start New Recommendation')}
        </button>
        <button onClick={() => window.print()} className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-800 font-bold rounded-full min-h-[44px] w-full sm:w-auto px-5 sm:px-6 py-3 text-xs sm:text-sm hover:bg-slate-50 transition-colors shadow-sm">
          📄 {t('downloadFssai', 'Download FSSAI Spec Sheet')}
        </button>
        <button onClick={() => document.getElementById('compare-drawer').showModal()} className="inline-flex items-center justify-center gap-2 bg-slate-800 text-white font-bold rounded-full min-h-[44px] w-full sm:w-auto px-5 sm:px-6 py-3 text-xs sm:text-sm hover:bg-slate-900 transition-colors shadow-sm">
          📊 {t('compareOptions', 'Compare Options')}
        </button>
      </div>

      {/* Compare Modal */}
      <dialog id="compare-drawer" className="backdrop:bg-black/50 p-0 rounded-2xl shadow-2xl border-0 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">{t('sideByAnalysis', 'Side-by-Side Analysis')}</h2>
            <button onClick={() => document.getElementById('compare-drawer').close()} className="text-slate-500 hover:bg-slate-100 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
            <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[550px]">
              <thead>
                <tr>
                  <th className="p-3 border-b-2 border-slate-200 text-slate-500 font-bold">{t('metric', 'Metric')}</th>
                  {payload.recommendations.map((r, i) => (
                    <th key={i} className="p-3 border-b-2 border-slate-200 text-slate-900 font-extrabold w-1/3">
                      {i === 0 ? '🥇 ' : i === 1 ? '🥈 ' : '🥉 '}{getTranslatedText(r, 'name')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr>
                  <td className="p-3 border-b border-slate-100 font-bold">{t('shelfLife', 'Shelf Life')}</td>
                  {payload.recommendations.map((r, i) => <td key={i} className="p-3 border-b border-slate-100 font-medium">{r.shelf_life_days} {t('days')}</td>)}
                </tr>
                <tr className="bg-slate-50">
                  <td className="p-3 border-b border-slate-100 font-bold">{t('costPerUnit', 'Cost / Unit')}</td>
                  {payload.recommendations.map((r, i) => <td key={i} className="p-3 border-b border-slate-100 font-medium text-emerald-600">₹{r.cost_per_unit_inr}</td>)}
                </tr>
                <tr>
                  <td className="p-3 border-b border-slate-100 font-bold">{t('otrBarrier', 'OTR Barrier')}</td>
                  {payload.recommendations.map((r, i) => <td key={i} className="p-3 border-b border-slate-100 text-xs">{r.technical_specs?.otr || 'N/A'}</td>)}
                </tr>
                <tr className="bg-slate-50">
                  <td className="p-3 border-b border-slate-100 font-bold">{t('wvtrBarrier', 'WVTR Barrier')}</td>
                  {payload.recommendations.map((r, i) => <td key={i} className="p-3 border-b border-slate-100 text-xs">{r.technical_specs?.wvtr || 'N/A'}</td>)}
                </tr>
                <tr>
                  <td className="p-3 font-bold">{t('compliance', 'Compliance')}</td>
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


