import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';

const STEPS = [
  { num: 1, labelKey: 'stepLabels.foodType' },
  { num: 2, labelKey: 'stepLabels.formState' },
  { num: 3, labelKey: 'stepLabels.transitRoute' },
];

export default function StepIndicator({ currentStep }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-0 mb-8 max-w-sm mx-auto">
      {STEPS.map((step, i) => {
        const done   = currentStep > step.num;
        const active = currentStep === step.num;

        return (
          <React.Fragment key={step.num}>
            {/* Step bubble */}
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                done   ? 'bg-forest text-white shadow-sm' :
                active ? 'bg-lime text-deep ring-4 ring-lime/25' :
                         'bg-slate-100 text-muted'
              }`}>
                {done ? <Check className="w-4 h-4" /> : step.num}
              </div>
              <span className={`text-[10px] font-semibold tracking-wide uppercase whitespace-nowrap ${
                active ? 'text-forest' : 'text-muted'
              }`}>
                {t(step.labelKey)}
              </span>
            </div>

            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-5 rounded-full transition-all duration-300 ${
                currentStep > step.num ? 'bg-forest' : 'bg-slate-200'
              }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
