import React from 'react';
import { useTranslation } from 'react-i18next';
import { Leaf, Droplets, Cookie, Beef } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'Fresh Produce',
    icon: <Leaf className="w-7 h-7" />,
    labelKey: 'categories.freshProduce',
    examplesKey: 'categories.freshProduceExamples',
    accent: 'text-emerald-600 bg-emerald-50',
  },
  {
    id: 'Dairy',
    icon: <Droplets className="w-7 h-7" />,
    labelKey: 'categories.dairy',
    examplesKey: 'categories.dairyExamples',
    accent: 'text-blue-600 bg-blue-50',
  },
  {
    id: 'Dry Snacks',
    icon: <Cookie className="w-7 h-7" />,
    labelKey: 'categories.drySnacks',
    examplesKey: 'categories.drySnacksExamples',
    accent: 'text-amber-600 bg-amber-50',
  },
  {
    id: 'Meat',
    icon: <Beef className="w-7 h-7" />,
    labelKey: 'categories.meat',
    examplesKey: 'categories.meatExamples',
    accent: 'text-rose-600 bg-rose-50',
  },
];

export default function FoodCategoryStep({ selected, onSelect }) {
  const { t } = useTranslation();

  return (
    <div className="animate-slide-up">
      <div className="mb-7">
        <p className="section-eyebrow mb-1.5">Step 1 of 3</p>
        <h2 className="text-2xl font-bold text-ink">{t('step1Title')}</h2>
        <p className="text-muted text-sm mt-1">{t('step1Subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`step-option text-left ${selected === cat.id ? 'selected' : ''}`}
          >
            {/* Selection ring */}
            {selected === cat.id && (
              <div className="absolute top-3 right-3 w-5 h-5 bg-forest rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${cat.accent}`}>
                {cat.icon}
              </div>
              <div>
                <h3 className="font-bold text-ink text-base">{t(cat.labelKey)}</h3>
                <p className="text-xs text-muted mt-0.5">{t(cat.examplesKey)}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
