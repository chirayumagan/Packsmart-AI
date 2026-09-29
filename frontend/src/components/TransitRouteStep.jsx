import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBasket, Truck, Snowflake } from 'lucide-react';

const ROUTES = [
  {
    id: 'local',
    icon: <ShoppingBasket className="w-7 h-7" />,
    labelKey:    'transit.local',
    subtitleKey: 'transit.localDistance',
    timeKey:     'transit.localTime',
    descKey:     'transit.localDesc',
    accent: 'bg-green-50 text-green-700',
  },
  {
    id: 'interstate',
    icon: <Truck className="w-7 h-7" />,
    labelKey:    'transit.interstate',
    subtitleKey: 'transit.interstateDistance',
    timeKey:     'transit.interstateTime',
    descKey:     'transit.interstateDesc',
    accent: 'bg-amber-50 text-amber-700',
  },
  {
    id: 'cold_chain',
    icon: <Snowflake className="w-7 h-7" />,
    labelKey:    'transit.coldChain',
    subtitleKey: 'transit.coldChainDistance',
    timeKey:     'transit.coldChainTime',
    descKey:     'transit.coldChainDesc',
    accent: 'bg-blue-50 text-blue-700',
  },
];

export default function TransitRouteStep({ selected, onSelect }) {
  const { t } = useTranslation();

  return (
    <div className="animate-slide-up">
      <div className="mb-5 sm:mb-7">
        <p className="section-eyebrow mb-1">Step 3 of 3</p>
        <h2 className="text-xl sm:text-2xl font-bold text-ink">{t('step3Title')}</h2>
        <p className="text-muted text-xs sm:text-sm mt-0.5 sm:mt-1">{t('step3Subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {ROUTES.map(route => (
          <button
            key={route.id}
            onClick={() => onSelect(route.id)}
            className={`step-option flex flex-col items-center text-center min-h-[44px] p-4 sm:p-5 ${selected === route.id ? 'selected' : ''}`}
          >
            {selected === route.id && (
              <div className="absolute top-3 right-3 w-5 h-5 bg-forest rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            <div className={`w-12 sm:w-14 h-12 sm:h-14 rounded-2xl flex items-center justify-center mb-3 flex-shrink-0 ${route.accent}`}>
              {route.icon}
            </div>
            <h3 className="font-bold text-ink text-sm sm:text-base leading-snug">{t(route.labelKey)}</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="badge-green text-[10px]">{t(route.subtitleKey)}</span>
              <span className="text-[10px] text-muted font-medium">{t(route.timeKey)}</span>
            </div>
            <p className="text-xs text-muted mt-2.5 leading-relaxed">{t(route.descKey)}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

