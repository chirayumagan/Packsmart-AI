import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'mr', label: 'मराठी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  { code: 'or', label: 'ଓଡ଼ିଆ' },
];

export default function LanguageSwitcher({ variant = 'dark' }) {
  const { i18n } = useTranslation();
  const current = i18n.resolvedLanguage || 'en';

  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-1.5 px-3 py-2 rounded-full border transition-all duration-200 ${
      isDark
        ? 'bg-white/10 border-white/20 text-white hover:bg-white/15'
        : 'bg-white border-slate-200 text-ink hover:border-slate-300'
    }`}>
      <Globe className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
      <select
        value={current}
        onChange={e => i18n.changeLanguage(e.target.value)}
        className={`bg-transparent text-xs font-semibold outline-none cursor-pointer [&>option]:text-ink [&>option]:bg-white ${
          isDark ? 'text-white' : 'text-ink'
        }`}
      >
        {LANGUAGES.map(l => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    </div>
  );
}
