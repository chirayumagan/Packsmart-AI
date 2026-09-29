import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Loader2, ArrowRight, X, Leaf, ShieldCheck, Clock } from 'lucide-react';

// Quick-select chips — popular Indian commodities
const QUICK_CHIPS = [
  { label: 'Fresh Tomatoes',    query: 'tomato',    icon: '🍅' },
  { label: 'Alphonso Mango',    query: 'mango',     icon: '🥭' },
  { label: 'Fresh Paneer',      query: 'paneer',    icon: '🥛' },
  { label: 'Namkeen / Bhujia',  query: 'namkeen',   icon: '🥨' },
  { label: 'Wheat Flour / Atta',query: 'wheat flour',icon: '🌾' },
];

export default function HeroSearch({ onSelectFood, onLaunchWizard }) {
  const { t } = useTranslation();
  const [query, setQuery]         = useState('');
  const [results, setResults]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [showDrop, setShowDrop]   = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef(null);
  const dropRef  = useRef(null);
  const timer    = useRef(null);

  // Debounced search
  useEffect(() => {
    clearTimeout(timer.current);
    if (query.trim().length < 2) { setResults([]); setShowDrop(false); return; }
    timer.current = setTimeout(doSearch, 400);
    return () => clearTimeout(timer.current);
  }, [query]);

  async function doSearch() {
    setLoading(true);
    try {
      const res  = await fetch('/api/identify-food', {
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

  function handleKey(e) {
    if (!showDrop || !results.length) return;
    if (e.key === 'ArrowDown')  { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')    { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)); }
    if (e.key === 'Enter' && activeIdx >= 0) { select(results[activeIdx]); }
    if (e.key === 'Escape')     { setShowDrop(false); }
  }

  function select(r) {
    setQuery(r.food_name);
    setShowDrop(false);
    onSelectFood(r.category, r.form);
  }

  function chipClick(chip) {
    setQuery(chip.label);
    inputRef.current?.focus();
    // trigger search immediately
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setQuery(chip.label);
    }, 0);
  }

  // confidence color
  function confColor(c) {
    if (c >= 0.9) return 'text-forest';
    if (c >= 0.7) return 'text-amber-600';
    return 'text-muted';
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-4 sm:gap-6 px-1">

      {/* Big search bar */}
      <div className="relative w-full" ref={dropRef}>
        <div className={`flex items-center gap-2.5 sm:gap-3 bg-white rounded-full border-2 px-4 sm:px-5 py-2.5 sm:py-4 shadow-lg transition-all duration-200 min-h-[44px] ${
          showDrop && results.length ? 'border-forest rounded-b-none rounded-t-2xl shadow-xl' : 'border-slate-200 hover:border-forest/40 animate-glow-pulse'
        }`}>
          <Search className="w-5 h-5 text-forest flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            onFocus={() => results.length && setShowDrop(true)}
            placeholder={t('searchPlaceholder')}
            className="flex-1 bg-transparent text-ink placeholder:text-muted text-sm sm:text-base outline-none font-hind min-h-[44px] py-1"
          />
          {loading && <Loader2 className="w-4 h-4 text-forest animate-spin flex-shrink-0" />}
          {query && !loading && (
            <button onClick={() => { setQuery(''); setResults([]); setShowDrop(false); }} className="text-muted hover:text-ink transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Autocomplete dropdown */}
        {showDrop && results.length > 0 && (
          <div className="absolute w-full bg-white border-2 border-t-0 border-forest rounded-b-2xl shadow-xl z-50 overflow-hidden">
            {results.map((r, i) => (
              <button
                key={i}
                onClick={() => select(r)}
                className={`w-full flex items-center justify-between px-4 sm:px-5 py-3.5 text-left transition-colors duration-150 group min-h-[44px] ${
                  i === activeIdx ? 'bg-forest/8' : 'hover:bg-slate-50'
                } ${i < results.length - 1 ? 'border-b border-slate-100' : ''}`}
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  {/* category badge */}
                  <span className="badge-green flex-shrink-0 capitalize text-[10px] sm:text-xs">{r.category}</span>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-semibold text-ink truncate">{r.food_name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] sm:text-xs text-muted">{r.form}</span>
                      <span className={`text-[10px] sm:text-xs font-bold ${confColor(r.confidence)}`}>{Math.round(r.confidence * 100)}% match</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-forest font-semibold text-xs flex-shrink-0 ml-2 sm:ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  Select <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No results */}
        {showDrop && !loading && results.length === 0 && query.length > 1 && (
          <div className="absolute w-full bg-white border-2 border-t-0 border-forest rounded-b-2xl shadow-xl z-50 px-4 sm:px-5 py-4 text-xs sm:text-sm text-muted text-center">
            {t('noMatchFound')}
          </div>
        )}
      </div>

      {/* Quick-select chips */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-semibold text-muted tracking-wide mr-1 uppercase">{t('try', 'Try')}:</span>
        {QUICK_CHIPS.map(chip => (
          <button
            key={chip.query}
            onClick={() => chipClick(chip)}
            className="flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] bg-white border border-slate-200 hover:border-forest/50 hover:bg-forest/5 rounded-full text-xs font-semibold text-ink transition-all duration-200 shadow-sm"
          >
            <span>{chip.icon}</span> {chip.label}
          </button>
        ))}
      </div>

      {/* Trust nodes row */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-1 sm:pt-2">
        {[
          { icon: <ShieldCheck className="w-3.5 h-3.5" />, labelKey: 'fssaiCompliant' },
          { icon: <Leaf className="w-3.5 h-3.5" />, labelKey: 'otrModelled' },
          { icon: <Clock className="w-3.5 h-3.5" />, labelKey: 'shelfLifeOptimised' },
        ].map((node, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted font-medium">
            <span className="text-forest flex-shrink-0">{node.icon}</span>
            <span>{t(node.labelKey, node.labelKey)}</span>
            {i < 2 && <span className="text-slate-300 ml-1.5 sm:ml-2">|</span>}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 w-full max-w-md my-1">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs font-semibold text-muted uppercase tracking-wider">or</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Launch wizard CTA */}
      <button onClick={onLaunchWizard} className="btn-outline group min-h-[44px] w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-bold flex items-center justify-center">
        {t('useVisualWizard', 'Use Visual Step Wizard')}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );

}
