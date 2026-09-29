import React from 'react';
import { useTranslation } from 'react-i18next';
import { Scissors, Apple, Beaker, Zap } from 'lucide-react';

const FORM_DEFS = {
  'Fresh Produce': [
    { id: 'Whole',         icon: <Apple className="w-5 h-5" />, labelKey: 'forms.whole', descKey: 'forms.wholeDesc' },
    { id: 'Cut/Processed', icon: <Scissors className="w-5 h-5" />, labelKey: 'forms.cut', descKey: 'forms.cutDesc' },
  ],
  'Dairy': [
    { id: 'Whole',  icon: <Apple className="w-5 h-5" />, labelKey: 'forms.solid', descKey: 'forms.solidDesc' },
    { id: 'Liquid', icon: <Beaker className="w-5 h-5" />, labelKey: 'forms.liquid', descKey: 'forms.liquidDesc' },
  ],
  'Dry Snacks': [
    { id: 'Whole',  icon: <Apple className="w-5 h-5" />, labelKey: 'forms.wholeDry', descKey: 'forms.wholeDryDesc' },
    { id: 'Powder', icon: <Zap className="w-5 h-5" />, labelKey: 'forms.powder', descKey: 'forms.powderDesc' },
  ],
  'Meat': [
    { id: 'Whole',         icon: <Apple className="w-5 h-5" />, labelKey: 'forms.wholeMeat', descKey: 'forms.wholeMeatDesc' },
    { id: 'Cut/Processed', icon: <Scissors className="w-5 h-5" />, labelKey: 'forms.cutMeat', descKey: 'forms.cutMeatDesc' },
  ],
};

const CAT_LABEL = {
  'Fresh Produce': 'categories.freshProduce',
  'Dairy':         'categories.dairy',
  'Dry Snacks':    'categories.drySnacks',
  'Meat':          'categories.meat',
};

export default function FoodFormStep({ category, selected, onSelect }) {
  const { t } = useTranslation();
  const forms  = FORM_DEFS[category] || [];

  return (
    <div className="animate-slide-up">
      <div className="mb-5 sm:mb-7">
        <p className="section-eyebrow mb-1">Step 2 of 3</p>
        <h2 className="text-xl sm:text-2xl font-bold text-ink">{t('step2Title')}</h2>
        <p className="text-muted text-xs sm:text-sm mt-0.5 sm:mt-1">
          {t('step2Subtitle')}{' '}
          <span className="font-semibold text-forest">{t(CAT_LABEL[category] || '')}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {forms.map(form => (
          <button
            key={form.id}
            onClick={() => onSelect(form.id)}
            className={`step-option text-left min-h-[44px] p-4 sm:p-5 ${selected === form.id ? 'selected' : ''}`}
          >
            {selected === form.id && (
              <div className="absolute top-3 right-3 w-5 h-5 bg-forest rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-forest/8 text-forest flex-shrink-0">
                {form.icon}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-ink text-sm sm:text-base leading-snug">{t(form.labelKey)}</h3>
                <p className="text-xs text-muted mt-0.5">{t(form.descKey)}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

