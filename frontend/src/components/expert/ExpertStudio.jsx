import React, { useState, useEffect, useRef } from 'react';
import {
  FlaskConical, SlidersHorizontal, Layers, ChevronDown, ChevronUp,
  Sparkles, ShieldCheck, Package, ShoppingCart, IndianRupee, Clock,
  AlertTriangle, CheckCircle, Info
} from 'lucide-react';
import { usePersona } from '../../context/PersonaContext';
import { useTranslation } from 'react-i18next';
import { SupplierModal } from '../ResultCards';

// ─── Mock expert recommendations (multi-layer laminate data) ─────────────────
const EXPERT_MOCK_RESULTS = [
  {
    id: 'met-pet-evoh',
    rank: 1,
    name: 'Met-PET / EVOH / LDPE Tri-layer Laminate',
    structure: [
      { layer: '12 µm Biaxial PET', role: 'Structural / Print' },
      { layer: '3 µm EVOH Barrier', role: 'Oxygen Barrier Core' },
      { layer: '40 µm LDPE Sealant', role: 'Heat Seal / Food Contact' },
    ],
    otr: '< 0.5 cm³/m²·day·atm @ 23°C, 0% RH',
    wvtr: '1.2 g/m²·day @ 38°C, 90% RH',
    co2_tr: 'β = 3.8 (CO₂TR / OTR ratio)',
    tensile: '180 N/mm²',
    seal_temp: '110°C – 130°C',
    gauge: '55 µm total',
    cost_per_unit_inr: 5.40,
    shelf_life_days: 90,
    is_fssai_approved: true,
    score: 0.94,
    description: 'Tri-layer laminate with central EVOH barrier layer provides near-hermetic oxygen exclusion (< 0.5 cm³/m²·day). EVOH barrier performance maintained at 0% RH; monitor aw > 0.85 conditions for swelling effects on permeation.',
    rationale: 'Water activity (aw = 0.92) demands < 5% RH micro-environment maintenance. EVOH at 3µm provides OTR headroom of ~12× minimum required for the modeled respiration rate of 40 mg/kg·hr at 5°C storage. CO₂TR ratio (β = 3.8) matches equilibrium modified atmosphere requirements.',
    migration_status: 'IS 9845 Overall Migration: 4.2 mg/dm² (Limit: < 10 mg/dm²) ✓',
    migration_ok: true,
  },
  {
    id: 'bopp-map',
    rank: 2,
    name: 'BOPP / Nylon / LLDPE MAP-Ready Film',
    structure: [
      { layer: '20 µm BOPP Print', role: 'Structural / Stiffness' },
      { layer: '15 µm Biaxial Nylon (BOPA)', role: 'Puncture Resistance' },
      { layer: '40 µm LLDPE Sealant', role: 'Flex-Crack Resistant Seal' },
    ],
    otr: '15 – 25 cm³/m²·day·atm @ 23°C, 0% RH',
    wvtr: '4.5 g/m²·day @ 38°C, 90% RH',
    co2_tr: 'β = 5.2 (CO₂TR / OTR ratio)',
    tensile: '220 N/mm²',
    seal_temp: '120°C – 145°C',
    gauge: '75 µm total',
    cost_per_unit_inr: 3.80,
    shelf_life_days: 45,
    is_fssai_approved: true,
    score: 0.71,
    description: 'BOPA nylon middle layer delivers excellent puncture resistance (220 N/mm²) for rough-transit packaged goods. OTR suitable for high-respiration produce that benefits from semi-permeable modified atmosphere in the 5–15% O₂ range.',
    rationale: 'Moderate OTR (15–25 cm³/m²·day) aligned with the modeled respiration rate equilibrium at higher O₂ set-point. CO₂TR ratio (β = 5.2) allows slightly elevated CO₂ accumulation, beneficial for fungal growth suppression at aw > 0.90.',
    migration_status: 'IS 9845 Overall Migration: 7.8 mg/dm² (Limit: < 10 mg/dm²) ✓',
    migration_ok: true,
  },
  {
    id: 'pla-bio',
    rank: 3,
    name: 'PLA / PBAT Compostable Bio-Laminate',
    structure: [
      { layer: '25 µm PLA Rigid Layer', role: 'Structural / Clarity' },
      { layer: '20 µm PBAT Flex Layer', role: 'Flexibility / Flex-Crack Resistance' },
    ],
    otr: '400 – 600 cm³/m²·day·atm @ 23°C, 0% RH',
    wvtr: '180 g/m²·day @ 38°C, 90% RH',
    co2_tr: 'β = 7.1 (CO₂TR / OTR ratio)',
    tensile: '55 N/mm²',
    seal_temp: '125°C – 145°C',
    gauge: '45 µm total',
    cost_per_unit_inr: 6.20,
    shelf_life_days: 14,
    is_fssai_approved: true,
    score: 0.43,
    description: 'Bio-based compostable option meeting CPCB compostability standard. High OTR and WVTR limit utility to short shelf-life, eco-labeled products with a maximum 7–14 day distribution window. Not recommended for MAP applications.',
    rationale: 'OTR (400–600) far exceeds target equilibrium for the specified water activity and respiration rate. Included as eco-certification option only — a secondary CO₂ flush packaging solution for same-day or 24hr premium segments where compostable label commands price premium.',
    migration_status: 'IS 9845 Overall Migration: 2.1 mg/dm² (Limit: < 10 mg/dm²) ✓',
    migration_ok: true,
  },
];

const EXPERT_PRESETS_DATA = [
  { 
    id: 'mango', name: 'Alphonso Mango (Fresh)', category: 'Fresh Produce',
    waterActivity: 0.98, fatContent: 0.5, o2Percent: 5.0, co2Percent: 10.0, 
    respirationRate: 45, rhMin: 85, rhMax: 95, tempMin: 12, tempMax: 15
  },
  { 
    id: 'paneer', name: 'Paneer (Cottage Cheese)', category: 'High-Fat Dairy',
    waterActivity: 0.99, fatContent: 20.0, o2Percent: 0.5, co2Percent: 30.0, 
    respirationRate: 0, rhMin: 90, rhMax: 95, tempMin: 2, tempMax: 8
  },
  { 
    id: 'namkeen', name: 'Namkeen / Bhujia', category: 'Crisp Snack',
    waterActivity: 0.25, fatContent: 35.0, o2Percent: 1.0, co2Percent: 0.0, 
    respirationRate: 0, rhMin: 10, rhMax: 40, tempMin: 15, tempMax: 35
  },
  { 
    id: 'tomato', name: 'Tomato (Whole)', category: 'Fresh Produce',
    waterActivity: 0.97, fatContent: 0.2, o2Percent: 4.0, co2Percent: 4.0, 
    respirationRate: 35, rhMin: 85, rhMax: 90, tempMin: 10, tempMax: 15
  },
  { 
    id: 'spice', name: 'Turmeric Powder', category: 'Spice Powder',
    waterActivity: 0.35, fatContent: 3.0, o2Percent: 2.0, co2Percent: 0.0, 
    respirationRate: 0, rhMin: 20, rhMax: 50, tempMin: 15, tempMax: 30
  }
];

// ─── Searchable Commodity Preset Component ──────────────────────────────────
function CommodityPresetSearch({ currentPreset, onSelect }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDrop, setShowDrop] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const dropRef = useRef(null);
  const timer = useRef(null);

  // Debounced search to backend just like Farmer View
  useEffect(() => {
    clearTimeout(timer.current);
    if (query.trim().length < 2) { setResults([]); setShowDrop(false); return; }
    timer.current = setTimeout(doSearch, 400);
    return () => clearTimeout(timer.current);
  }, [query]);

  async function doSearch() {
    setLoading(true);
    try {
      const res = await fetch('/api/identify-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });
      const data = await res.json();
      setResults(data.matches || []);
      setShowDrop(true);
      setActiveIdx(-1);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setShowDrop(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!showDrop || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0) handleSelect(results[activeIdx]);
    } else if (e.key === 'Escape') {
      setShowDrop(false);
    }
  };

  const handleSelect = (r) => {
    // Map category to baseline parameters dynamically
    let waterActivity = 0.98, fatContent = 1.0, o2Percent = 5.0, co2Percent = 10.0, respirationRate = 40;
    const cat = r.category.toLowerCase();
    
    if (cat.includes('dairy')) { waterActivity = 0.99; fatContent = 20; respirationRate = 0; o2Percent = 0.5; co2Percent = 30; }
    else if (cat.includes('snack') || cat.includes('crisp')) { waterActivity = 0.25; fatContent = 35; respirationRate = 0; o2Percent = 1; }
    else if (cat.includes('spice')) { waterActivity = 0.35; fatContent = 3; respirationRate = 0; o2Percent = 2; }
    else if (cat.includes('meat')) { waterActivity = 0.99; fatContent = 15; respirationRate = 0; o2Percent = 0; co2Percent = 30; }

    onSelect({
      name: r.food_name,
      category: r.category,
      waterActivity, fatContent, o2Percent, co2Percent, respirationRate,
      rhMin: 80, rhMax: 95, tempMin: 5, tempMax: 15
    });
    setQuery(r.food_name);
    setShowDrop(false);
    setActiveIdx(-1);
  };

  return (
    <div className="relative mb-6" ref={dropRef}>
      <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wide mb-1.5">
        {t('expert.commoditySearch', 'Commodity Baseline Search')}
      </label>
      
      <div className="relative">
        <input 
          type="text" 
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActiveIdx(-1); }}
          onFocus={() => { if (query.length >= 2) setShowDrop(true); }}
          onKeyDown={handleKeyDown}
          placeholder={t('expert.searchPlaceholder', 'e.g., Alphonso Mango, Paneer...')}
          className="w-full border-2 border-[#1F5C3A] rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-4 focus:ring-[#1F5C3A]/10 transition-all shadow-sm" 
        />
        
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1F5C3A]">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          </div>
        )}

        {showDrop && results.length > 0 && (
          <div className="absolute z-50 top-full mt-1 w-full bg-white border-2 border-t-0 border-[#1F5C3A] rounded-b-2xl shadow-xl max-h-80 overflow-y-auto overflow-hidden">
            {results.map((r, i) => (
              <button 
                key={i} 
                className={`w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors duration-150 group ${
                  i === activeIdx ? 'bg-[#1F5C3A]/8' : 'hover:bg-slate-50'
                } ${i < results.length - 1 ? 'border-b border-slate-100' : ''}`}
                onMouseDown={() => handleSelect(r)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="inline-flex items-center gap-2 text-xs font-bold bg-green-100 text-green-800 rounded-lg px-2.5 py-1 uppercase tracking-wide flex-shrink-0">
                    {r.category}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#0F172A] truncate">{r.food_name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-[#64748B]">{r.form}</span>
                      <span className={`text-xs font-bold text-[#1F5C3A]`}>{Math.round(r.confidence * 100)}% match</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No results */}
        {showDrop && !loading && results.length === 0 && query.length > 1 && (
          <div className="absolute w-full bg-white border-2 border-t-0 border-[#1F5C3A] rounded-b-2xl shadow-xl z-50 px-5 py-4 text-sm text-[#64748B] text-center">
            {t('noMatchFound', 'No match found. Please use the visual wizard.')}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function StructureStack({ layers }) {
  return (
    <div className="space-y-1 mt-3">
      {layers.map((l, i) => (
        <div key={i} className="flex items-center gap-2.5">
          <div className={`h-5 rounded-sm flex items-center justify-center px-2 text-[9px] font-black uppercase tracking-wider text-white flex-shrink-0 ${
            i === 0 ? 'bg-slate-600 w-20' : i === layers.length - 1 ? 'bg-[#1F5C3A] w-20' : 'bg-[#2D7A4E] w-24'
          }`}>
            {l.layer.split(' ')[0]}
          </div>
          <div className="flex-1 text-[10px]">
            <span className="font-bold text-[#0F172A]">{l.layer}</span>
            <span className="text-[#64748B] ml-1">— {l.role}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ExpertMetricsGrid({ rec }) {
  const { t } = useTranslation();
  const metrics = [
    { label: 'OTR', value: rec.otr, tooltip: t('expert.otr', 'Oxygen Transmission Rate') },
    { label: 'WVTR', value: rec.wvtr, tooltip: t('expert.wvtr', 'Water Vapour Transmission Rate') },
    { label: 'CO₂ TR (β)', value: rec.co2_tr, tooltip: t('expert.co2tr', 'Carbon Dioxide / Oxygen permeability ratio') },
    { label: 'Tensile Strength', value: rec.tensile, tooltip: t('expert.punctureStress', 'Puncture & Tensile Rating') },
  ];
  return (
    <div className="grid grid-cols-1 gap-2 mt-3">
      {metrics.map(m => (
        <div key={m.label} className="flex items-start justify-between py-2 border-b border-slate-100 last:border-0" title={m.tooltip}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] flex-shrink-0 w-28">{m.label}</span>
          <span className="text-xs font-semibold text-[#0F172A] text-right leading-tight">{m.value}</span>
        </div>
      ))}
    </div>
  );
}

function ExpertCard({ rec, idx, onSupplierClick }) {
  const [open, setOpen] = useState(idx === 0);
  const [showRationale, setShowRationale] = useState(false);
  const { t } = useTranslation();

  const rankLabels = ['🥇 Best Laminate Match', '🥈 Alternative Structure', '🥉 Eco-Certified Option'];
  const scorePercent = Math.round(rec.score * 100);

  return (
    <div className={`bg-white rounded-2xl border shadow-sm flex flex-col transition-all duration-200 ${
      idx === 0 ? 'border-[#1F5C3A]/40 ring-1 ring-[#1F5C3A]/20' : 'border-slate-200'
    }`}>
      {/* Card Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <span className={`inline-block text-[10px] font-bold rounded-full px-2.5 py-1 mb-2 ${
              idx === 0 ? 'bg-[#D9F04A] text-[#17452C]' : 'bg-slate-100 text-slate-600'
            }`}>{rankLabels[idx] || rankLabels[2]}</span>
            <h3 className="font-extrabold text-[#0F172A] text-sm leading-tight">{rec.name}</h3>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-xl font-black text-[#0F172A]">{scorePercent}<span className="text-xs font-normal text-[#64748B]">/100</span></div>
            <div className="text-[9px] text-[#64748B] uppercase tracking-wider">AI Score</div>
          </div>
        </div>

        {/* Score bar */}
        <div className="h-1 bg-slate-100 rounded-full overflow-hidden mb-4">
          <div className={`h-full rounded-full ${idx === 0 ? 'bg-[#D9F04A]' : 'bg-slate-300'}`} style={{ width: `${scorePercent}%` }} />
        </div>

        {/* Quick metrics row */}
        <div className="flex gap-2 flex-wrap mb-3">
          <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 text-xs font-semibold text-[#0F172A]">
            <Clock className="w-3 h-3 text-[#1F5C3A]" /> {rec.shelf_life_days}d shelf life
          </span>
          <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 text-xs font-semibold text-[#0F172A]">
            <IndianRupee className="w-3 h-3 text-[#1F5C3A]" /> ₹{rec.cost_per_unit_inr}/unit
          </span>
          <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 text-xs font-semibold text-[#0F172A]">
            <Layers className="w-3 h-3 text-[#1F5C3A]" /> {rec.gauge}
          </span>
          {rec.is_fssai_approved && (
            <span className="flex items-center gap-1 bg-blue-50 border border-blue-100 rounded-lg px-2 py-1 text-[10px] font-bold text-blue-700">
              <ShieldCheck className="w-3 h-3" /> {t('expert.fssai', 'FSSAI')}
            </span>
          )}
        </div>

        <p className="text-xs text-[#64748B] leading-relaxed">
          {t(`expert.desc_${rec.id}`, rec.description)}
        </p>


      </div>

      {/* Expandable engineering detail */}
      <div className="border-t border-slate-100">
        <button
          onClick={() => setOpen(v => !v)}
          className="w-full flex items-center justify-between px-5 py-3 text-xs font-bold text-[#64748B] hover:text-[#1F5C3A] transition-colors"
        >
          <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Layer Structure & Barrier Metrics</span>
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {open && (
          <div className="px-5 pb-5">
            {/* Multi-layer structure visual */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4">
              <div className="text-[9px] font-bold uppercase tracking-widest text-[#64748B] mb-2">Polymer Stack (outer → inner)</div>
              <StructureStack layers={rec.structure} />
            </div>

            {/* Granular metrics */}
            <div className="mb-4">
              <div className="text-[9px] font-bold uppercase tracking-widest text-[#64748B] mb-1">Barrier Performance Matrix</div>
              <ExpertMetricsGrid rec={rec} />
            </div>

            {/* Migration compliance */}
            <div className={`flex items-start gap-2 rounded-xl p-3 text-xs ${rec.migration_ok ? 'bg-green-50 border border-green-100 text-green-800' : 'bg-red-50 border border-red-100 text-red-800'}`}>
              {rec.migration_ok ? <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
              <div>
                <div className="font-bold text-[10px] uppercase tracking-wide mb-0.5">FSSAI Migration Compliance</div>
                <div className="font-medium">{rec.migration_status}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Rationale (collapsible) */}
      <div className="border-t border-slate-100">
        <button onClick={() => setShowRationale(v => !v)}
          className="w-full flex items-center justify-between px-5 py-3 text-xs font-bold text-[#64748B] hover:text-[#1F5C3A] transition-colors">
          <span className="flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> AI Scientific Rationale</span>
          {showRationale ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showRationale && (
          <div className="px-5 pb-5">
            <div className="bg-[#1F5C3A]/5 border border-[#1F5C3A]/15 rounded-xl p-4 text-xs text-[#0F172A] leading-relaxed font-mono">
              {t(`expert.rationale_${rec.id}`, rec.rationale)}
            </div>
          </div>
        )}
      </div>

      {/* Supplier CTA */}
      <div className="border-t border-slate-100 p-4">
        <button 
          onClick={() => onSupplierClick && onSupplierClick(rec.id)}
          className="w-full group inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 border border-slate-200 text-sm font-semibold text-slate-800 hover:bg-[#D9F04A] hover:border-[#cbe33e] hover:text-slate-950 transition-colors duration-200"
        >
          <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
          {t('marketplace.findSuppliers')}
        </button>
      </div>
    </div>
  );
}

// ─── Slider Input helper ───────────────────────────────────────────────────
function SliderInput({ label, value, min, max, step = 0.01, unit, onChange }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">{label}</label>
        <span className="text-xs font-bold text-[#0F172A] bg-slate-100 rounded-md px-2 py-0.5">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#1F5C3A]" />
      <div className="flex justify-between text-[10px] text-[#64748B] mt-0.5">
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );
}

// ─── Main ExpertStudio ─────────────────────────────────────────────────────
export default function ExpertStudio() {
  const { t } = useTranslation();
  const { expertInputs, setExpertInputs, expertResults, setExpertResults } = usePersona();
  const [activeTab, setActiveTab] = useState('chemistry');
  const [loading, setLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  
  // Supplier Marketplace Modal state
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [activeMaterialId, setActiveMaterialId] = useState(null);

  const updateInput = (key, val) => setExpertInputs(s => ({ ...s, [key]: val }));

  async function handleAnalyze() {
    setLoading(true);
    try {
      await fetch('/api/expert-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expertInputs)
      });
      // Add artificial delay for the complex calculation effect
      await new Promise(r => setTimeout(r, 1200));
    } catch (err) {
      console.warn("Expert API unreachable, falling back to mock");
      await new Promise(r => setTimeout(r, 1200));
    }
    
    setExpertResults(EXPERT_MOCK_RESULTS);
    setHasResults(true);
    setLoading(false);
  }

  const openSupplierModal = (id) => {
    setActiveMaterialId(id);
    setSupplierModalOpen(true);
  };

  const tabs = [
    { id: 'chemistry', label: 'Food Chemistry', icon: <FlaskConical className="w-3.5 h-3.5" /> },
    { id: 'environment', label: 'Environment & Logistics', icon: <SlidersHorizontal className="w-3.5 h-3.5" /> },
    { id: 'machinery', label: 'Machinery & Converting', icon: <Layers className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F2] font-sans pt-24 pb-16 px-4">
      
      {/* B2B Marketplace Modal overlay */}
      <SupplierModal 
        isOpen={supplierModalOpen} 
        onClose={() => setSupplierModalOpen(false)} 
        t={t} 
        materialId={activeMaterialId} 
      />

      <div className="max-w-6xl mx-auto">

        {/* Expert Studio header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-[#1F5C3A] rounded-lg flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-[#D9F04A]" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">FoodTech Precision Studio</div>
              <h1 className="text-xl font-extrabold text-[#0F172A] leading-tight">Multi-layer Laminate Engineering Workspace</h1>
            </div>
          </div>
          <p className="text-sm text-[#64748B] max-w-2xl">
            Configure granular biochemical, environmental, and mechanical parameters to receive precision-engineered packaging recommendations with full barrier performance modeling.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Left: Input Panel (2/5 width) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm sticky top-24">

              {/* Tab navigation */}
              <div className="border-b border-slate-100 px-4 pt-4">
                <div className="flex gap-1">
                  {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold rounded-t-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-[#1F5C3A] text-white'
                          : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50'
                      }`}>
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-5 space-y-5">

                {/* Tab A: Food Chemistry */}
                {activeTab === 'chemistry' && (
                  <>
                    <CommodityPresetSearch 
                      currentPreset={expertInputs.commodityPreset} 
                      onSelect={(preset) => {
                        setExpertInputs(s => ({
                          ...s,
                          commodityPreset: preset.name,
                          waterActivity: preset.waterActivity,
                          fatContent: preset.fatContent,
                          o2Percent: preset.o2Percent,
                          co2Percent: preset.co2Percent,
                          respirationRate: preset.respirationRate,
                          rhMin: preset.rhMin,
                          rhMax: preset.rhMax,
                          tempMin: preset.tempMin,
                          tempMax: preset.tempMax
                        }));
                      }}
                    />

                    <SliderInput label={t('expert.waterActivity', 'Water Activity (aw)')} value={expertInputs.waterActivity} min={0.20} max={0.99} step={0.01} unit=""
                      onChange={v => updateInput('waterActivity', v)} />

                    <SliderInput label={t('expert.lipidContent', 'Lipid / Fat Content')} value={expertInputs.fatContent} min={0} max={60} step={0.5} unit="%"
                      onChange={v => updateInput('fatContent', v)} />

                    <div>
                      <div className="text-xs font-bold text-[#64748B] uppercase tracking-wide mb-3">{t('expert.mapGas', 'Target Headspace Gas (MAP)')}</div>
                      <div className="space-y-3">
                        <SliderInput label="O₂ %" value={expertInputs.o2Percent} min={0} max={21} step={0.5} unit="%" onChange={v => updateInput('o2Percent', v)} />
                        <SliderInput label="CO₂ %" value={expertInputs.co2Percent} min={0} max={60} step={0.5} unit="%" onChange={v => updateInput('co2Percent', v)} />
                        <div className="bg-slate-50 rounded-lg px-3 py-2 text-xs text-[#64748B] flex justify-between">
                          <span>{t('expert.n2Balance', 'N₂ Balance')}</span>
                          <span className="font-bold text-[#0F172A]">{Math.max(0, 100 - expertInputs.o2Percent - expertInputs.co2Percent).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">{t('expert.respirationRate', 'Respiration Rate (RO₂)')}</label>
                        <span className="text-xs font-bold text-[#0F172A] bg-slate-100 rounded-md px-2 py-0.5">{expertInputs.respirationRate} mg/kg·hr</span>
                      </div>
                      <input type="number" value={expertInputs.respirationRate} min={0} max={500}
                        onChange={e => updateInput('respirationRate', +e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1F5C3A] bg-white" />
                    </div>
                  </>
                )}

                {/* Tab B: Environment & Logistics */}
                {activeTab === 'environment' && (
                  <>
                    <div>
                      <div className="text-xs font-bold text-[#64748B] uppercase tracking-wide mb-3">{t('expert.dynamicTemp', 'Dynamic Temperature Range')}</div>
                      <div className="grid grid-cols-2 gap-3">
                        {[['Min Temp', 'tempMin', -20, 30, '°C'], ['Max Temp', 'tempMax', 0, 50, '°C']].map(([label, key, min, max, unit]) => (
                          <div key={key}>
                            <label className="block text-[10px] font-bold text-[#64748B] mb-1">{label}</label>
                            <input type="number" value={expertInputs[key]} min={min} max={max}
                              onChange={e => updateInput(key, +e.target.value)}
                              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1F5C3A] bg-white" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[#64748B] uppercase tracking-wide mb-3">{t('expert.relativeHumidity', 'Relative Humidity Range (%)')}</div>
                      <div className="grid grid-cols-2 gap-3">
                        <SliderInput label="Min RH" value={expertInputs.rhMin} min={10} max={80} step={1} unit="%" onChange={v => updateInput('rhMin', v)} />
                        <SliderInput label="Max RH" value={expertInputs.rhMax} min={30} max={100} step={1} unit="%" onChange={v => updateInput('rhMax', v)} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wide mb-2">{t('expert.punctureStress', 'Puncture & Tensile Stress Rating')}</label>
                      <div className="flex flex-col gap-2">
                        {['Standard Handling', 'Rough Transit', 'Heavy Stacking'].map(opt => (
                          <button key={opt} onClick={() => updateInput('punctureRating', opt)}
                            className={`text-left px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                              expertInputs.punctureRating === opt
                                ? 'bg-[#1F5C3A]/10 border-[#1F5C3A] text-[#1F5C3A]'
                                : 'bg-white border-slate-200 text-[#64748B] hover:border-slate-300'
                            }`}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Tab C: Machinery & Converting */}
                {activeTab === 'machinery' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wide mb-1.5">{t('expert.packagingEquipment', 'Packaging Equipment')}</label>
                      <select value={expertInputs.equipment} onChange={e => updateInput('equipment', e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1F5C3A] bg-white">
                        {['VFFS', 'HFFS / Flow Wrap', 'Tray Sealer + MAP', 'Vacuum Chamber Sealer', 'Thermoformer'].map(eq => (
                          <option key={eq}>{eq}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[#64748B] uppercase tracking-wide mb-3">{t('expert.targetGauge', 'Target Gauge / Thickness Window')}</div>
                      <div className="grid grid-cols-2 gap-3">
                        {[['Min Gauge', 'gaugeMin', 10, 80, ' µm'], ['Max Gauge', 'gaugeMax', 20, 200, ' µm']].map(([label, key, min, max, unit]) => (
                          <div key={key}>
                            <label className="block text-[10px] font-bold text-[#64748B] mb-1">{label}</label>
                            <div className="flex items-center">
                              <input type="number" value={expertInputs[key]} min={min} max={max}
                                onChange={e => updateInput(key, +e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1F5C3A] bg-white" />
                            </div>
                            <div className="text-[10px] text-[#64748B] mt-0.5">{unit.trim()}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[#64748B] uppercase tracking-wide mb-3">{t('expert.thermalSealing', 'Thermal Sealing Window')}</div>
                      <div className="grid grid-cols-2 gap-3">
                        {[['Seal Temp Min', 'sealTempMin', 70, 160, '°C'], ['Seal Temp Max', 'sealTempMax', 90, 200, '°C']].map(([label, key, min, max, unit]) => (
                          <div key={key}>
                            <label className="block text-[10px] font-bold text-[#64748B] mb-1">{label}</label>
                            <input type="number" value={expertInputs[key]} min={min} max={max}
                              onChange={e => updateInput(key, +e.target.value)}
                              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1F5C3A] bg-white" />
                            <div className="text-[10px] text-[#64748B] mt-0.5">{unit}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Analyze button */}
              <div className="border-t border-slate-100 p-4">
                <button onClick={handleAnalyze} disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#D9F04A] text-[#17452C] font-extrabold text-sm rounded-full py-3 hover:brightness-105 transition-all disabled:opacity-60">
                  {loading ? (
                    <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> {t('expert.computing', 'Computing Barrier Matrix…')}</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> {t('expert.runAnalysis', 'Run Precision Analysis')}</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ── Right: Results Panel (3/5 width) */}
          <div className="lg:col-span-3">
            {!hasResults && !loading && (
              <div className="h-full min-h-96 bg-white rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center p-10">
                <div className="w-14 h-14 bg-[#1F5C3A]/8 rounded-2xl flex items-center justify-center mb-4">
                  <FlaskConical className="w-7 h-7 text-[#1F5C3A]" />
                </div>
                <h3 className="font-bold text-[#0F172A] mb-2">Configure & Run Analysis</h3>
                <p className="text-sm text-[#64748B] max-w-xs leading-relaxed">
                  Set your food chemistry parameters, environmental constraints, and machinery specs, then click <strong>Run Precision Analysis</strong>.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-[#64748B] w-full max-w-sm">
                  {['OTR / WVTR Modeling', 'Multi-layer Structure', 'CO₂ Permeability β'].map(f => (
                    <div key={f} className="bg-slate-50 rounded-xl p-2.5 text-center">
                      <div className="font-bold text-[#1F5C3A] text-[10px] uppercase tracking-wide">{f}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="h-full min-h-96 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center p-10">
                <div className="w-14 h-14 bg-[#D9F04A]/20 rounded-2xl flex items-center justify-center mb-5">
                  <svg className="animate-spin w-7 h-7 text-[#1F5C3A]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                </div>
                <h3 className="font-bold text-[#0F172A] mb-2">Computing Barrier Matrix…</h3>
                <p className="text-xs text-[#64748B]">Solving gas equilibrium equations and water activity migration curves</p>
              </div>
            )}

            {hasResults && !loading && expertResults && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-lg font-extrabold text-[#0F172A]">Expert Laminate Recommendations</h2>
                    <p className="text-xs text-[#64748B]">Ranked by barrier fit score for aw={expertInputs.waterActivity}, RO₂={expertInputs.respirationRate} mg/kg·hr</p>
                  </div>
                  <button onClick={() => setHasResults(false)}
                    className="text-xs text-[#64748B] hover:text-[#0F172A] border border-slate-200 rounded-full px-3 py-1.5 hover:bg-slate-50 transition-colors">
                    ← Reset
                  </button>
                </div>
                {expertResults.map((rec, idx) => (
                  <ExpertCard key={rec.id} rec={rec} idx={idx} onSupplierClick={openSupplierModal} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
