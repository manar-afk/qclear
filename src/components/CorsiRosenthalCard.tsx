'use client';

import React from 'react';
import { usePreferences } from '@/context/PreferencesContext';
import { Box, Check, ExternalLink, ShieldCheck } from 'lucide-react';

export function CorsiRosenthalCard() {
  const { language, t } = usePreferences();

  const materialsEn = [
    '1 standard 20" domestic box fan',
    '4 or 5 MERV-13 furnace filters (20" x 20" x 2" or 1")',
    '1 roll of heavy-duty duct tape',
    'Cardboard box base + 10" circular cardboard shroud for fan face',
  ];

  const materialsHi = [
    '1 मानक 20-इंच घरेलू बॉक्स पंखा',
    '4 या 5 MERV-13 एयर फिल्टर (20" x 20")',
    '1 रोल मजबूत डक्ट टेप',
    'कार्डबोर्ड बेस और पंखे के चेहरे के लिए गोल कार्डबोर्ड श्राउड',
  ];

  const stepsEn = [
    'Assemble filters into a square cube with all airflow arrows pointing inwards toward the center.',
    'Seal all vertical corner seams tightly with duct tape to prevent dirty air bypass.',
    'Tape the cardboard bottom securely to create an airtight floor.',
    'Place the box fan on top facing upward (exhausting clean air into the room) and seal all perimeter edges with tape.',
    'Attach a circular cardboard shroud over the front face of the fan to eliminate blade-corner vortex backflow.',
  ];

  const stepsHi = [
    'चारों फिल्टरों को एक चौकोर बक्से के रूप में रखें, ध्यान दें कि हवा का तीर (Airflow arrow) अंदर की ओर हो।',
    'चारों कोनों को डक्ट टेप से कसकर सील करें ताकि गंदी हवा बिना फिल्टर के अंदर न जा सके।',
    'नीचे कार्डबोर्ड का तला लगाकर किनारों पर टेप लगाएं।',
    'ऊपर 20" पंखा रखें (हवा का बहाव ऊपर की ओर) और पंखे के किनारों को टेप से पूरी तरह सील करें।',
    'पंखे के सामने 10-इंच का गोल कार्डबोर्ड श्राउड लगाएं ताकि कोनों से हवा वापस न घूमे।',
  ];

  const materials = language === 'hi' ? materialsHi : materialsEn;
  const steps = language === 'hi' ? stepsHi : stepsEn;

  return (
    <section className="glass-panel rounded-2xl p-4 sm:p-6 shadow-sm border space-y-5" aria-label="DIY Corsi-Rosenthal Box Guide">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {t.corsiTitle}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t.corsiSubtitle}
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-bold self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>~₹1,800 ($22) vs ₹15,000+ commercial units</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Materials List */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
            {language === 'hi' ? 'आवश्यक सामग्री:' : 'Required Materials:'}
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {materials.map((m, i) => (
              <li key={i} className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Assembly Steps */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
            {language === 'hi' ? 'बनाने की चरणबद्ध विधि:' : 'Step-by-Step Construction:'}
          </h4>
          <ol className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {steps.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Note and Documentation Footnote */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span>
          {language === 'hi'
            ? 'वैज्ञानिक संदर्भ: यूएस ईपीए (EPA) वायु शोधन मार्गदर्शन के अनुसार MERV-13 फिल्टर 0.3-1.0 माइक्रोन कणों को 85% तक रोकते हैं।'
            : 'General Reference: US EPA "Air Cleaners in the Home" (2018). MERV-13 filters capture fine inhalable smoke particulates.'}
        </span>
        <a
          href="https://www.epa.gov/indoor-air-quality-iaq/air-cleaners-and-air-filters-home"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
        >
          <span>EPA Reference</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </section>
  );
}
