import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Loader2, ChevronRight, X } from 'lucide-react';

export default function FoodSearchStep({ onSelectFood, onSkip }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 1) {
        performSearch();
      } else {
        setResults([]);
        setHasSearched(false);
        setError('');
      }
    }, 500); // debounce

    return () => clearTimeout(timer);
  }, [query]);

  const performSearch = async () => {
    setIsSearching(true);
    setError('');
    try {
      const response = await fetch('/api/identify-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data.matches || []);
      setHasSearched(true);
    } catch (err) {
      setError(err.message || 'An error occurred during search.');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">{t('searchLabel')}</h2>
        <p className="text-gray-500">{t('searchSubtitle')}</p>
      </div>

      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition-all text-lg"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-4 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {isSearching && (
          <div className="absolute right-14 top-1/2 -translate-y-1/2">
            <Loader2 className="w-5 h-5 text-green-500 animate-spin" />
          </div>
        )}
      </div>

      {hasSearched && !isSearching && results.length === 0 && (
        <div className="text-center p-6 bg-red-50 text-red-600 rounded-xl border border-red-100">
          {t('noMatchFound')}
        </div>
      )}

      {results.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <span className="font-medium text-gray-700">{t('suggestionsTitle')}</span>
          </div>
          <div className="divide-y divide-gray-100">
            {results.map((result, idx) => (
              <button
                key={idx}
                onClick={() => onSelectFood(result.category, result.form)}
                className="w-full text-left px-4 py-4 flex items-center justify-between hover:bg-green-50 transition-colors group"
              >
                <div>
                  <div className="font-semibold text-gray-900 text-lg">
                    {result.food_name}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {t(`categories.${Object.keys(t('categories', {returnObjects:true})).find(k => t(`categories.${k}`) === result.category) || 'freshProduce'}`)} • {t(`forms.${Object.keys(t('forms', {returnObjects:true})).find(k => t(`forms.${k}`) === result.form) || 'whole'}`)}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="hidden sm:block text-right">
                    <div className="text-xs text-gray-400 uppercase tracking-wider">{t('confidence')}</div>
                    <div className="text-sm font-medium text-green-600">
                      {Math.round(result.confidence * 100)}%
                    </div>
                  </div>
                  <div className="flex items-center text-green-600 font-medium group-hover:translate-x-1 transition-transform">
                    {t('selectThis')} <ChevronRight className="w-5 h-5 ml-1" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-50 px-4 text-sm text-gray-500">{t('orDivider')}</span>
        </div>
      </div>

      <div className="text-center">
        <button onClick={onSkip} className="btn-secondary">
          {t('skipSearch')}
        </button>
      </div>
    </div>
  );
}
