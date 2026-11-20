'use client';

import React from 'react';
import { usePreferences } from '@/context/PreferencesContext';
import { CITATIONS_REGISTRY } from '@/lib/impact/assumptions';
import { X, AlertTriangle, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DisclaimerModal({ isOpen, onClose }: DisclaimerModalProps) {
  const { language, t } = usePreferences();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="disclaimer-title"
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 id="disclaimer-title" className="text-lg font-bold text-slate-900 dark:text-white">
              {language === 'hi' ? 'चिकित्सा अस्वीकरण एवं वैज्ञानिक पद्धति' : 'Medical Disclaimer & Scientific Methodology'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Non-Medical Disclaimer */}
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{language === 'hi' ? 'गैर-चिकित्सीय अस्वीकरण' : 'Non-Clinical Medical Disclaimer'}</span>
          </div>
          <p className="leading-relaxed">
            {t.medicalDisclaimer}
          </p>
        </div>

        {/* Mathematical Engine & Assumptions */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{language === 'hi' ? 'दस्तावेजीकृत वैज्ञानिक मान्यताएं एवं सूत्र:' : 'Documented Mathematical Formulas & Citations:'}</span>
          </h4>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <strong className="text-slate-900 dark:text-white">1. Infiltration Factor (F = 0.55):</strong>
              <p>
                Represents the fraction of ambient outdoor PM2.5 that penetrates typical unsealed urban residences through structural gaps. Labelled explicitly as an [Illustrative Assumption] in the interface.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <strong className="text-slate-900 dark:text-white">2. Metric Separation Discipline:</strong>
              <p>
                Wearing an N95 respirator does not clean indoor room air; its benefit is quantified strictly as <em>Outdoor Commute Inhaled Dose Avoided</em> using an adult light exertion respiration rate (0.8 m³/hr) and an 80% consumer fit factor.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <strong className="text-slate-900 dark:text-white">3. Indoor Source Interventions:</strong>
              <p>
                Damp mopping and kitchen exhaust fan timing act as separate additive terms reducing indoor-generated baseline particulate matter (25 µg/m³), independent of outdoor ambient infiltration.
              </p>
            </div>
          </div>
        </div>

        {/* Citations Registry */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Literature & Standard Sources
          </h4>
          <div className="space-y-1.5">
            {Object.entries(CITATIONS_REGISTRY).map(([k, c]) => (
              <div key={k} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-2 text-xs">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{c.reference}</span>
                  <div className="text-[11px] text-slate-400">{c.notes}</div>
                </div>
                {c.url && (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex-shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 transition"
          >
            {language === 'hi' ? 'समझ गया' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
