'use client';

import React, { useState } from 'react';
import { HouseholdProfile, DEMO_PRESETS } from '@/constants/presets';
import { usePreferences } from '@/context/PreferencesContext';
import { Users, Baby, HeartPulse, Bike, ShieldCheck, Flame, Sliders, X } from 'lucide-react';

interface HouseholdPresetBarProps {
  activeProfile: HouseholdProfile;
  onSelectPreset: (preset: HouseholdProfile) => void;
  onUpdateCustomProfile: (profile: HouseholdProfile) => void;
}

export function HouseholdPresetBar({
  activeProfile,
  onSelectPreset,
  onUpdateCustomProfile,
}: HouseholdPresetBarProps) {
  const { language, t } = usePreferences();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<HouseholdProfile>(activeProfile);

  const handleOpenEdit = () => {
    setEditForm(activeProfile);
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCustomProfile(editForm);
    setIsEditing(false);
  };

  return (
    <section className="glass-panel rounded-2xl p-4 sm:p-6 shadow-sm border space-y-4" aria-label="Household Profile Tailoring">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t.demoHouseholdsTitle}
          </h3>
        </div>
        <button
          type="button"
          onClick={handleOpenEdit}
          className="min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition self-start sm:self-auto"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'प्रोफाइल बदलें' : 'Customize Profile'}</span>
        </button>
      </div>

      {/* Active Custom Profile Card when customized */}
      {activeProfile.id === 'custom_household_profile' && (
        <div className="p-4 rounded-xl border-2 border-blue-600 bg-blue-50/90 dark:bg-blue-950/50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-blue-600 text-white">
                Active Custom Profile
              </span>
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                {activeProfile.locationName || 'Custom Location'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1 text-xs text-slate-600 dark:text-slate-300">
              {activeProfile.members.hasToddler && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700">
                  <Baby className="w-3 h-3" /> Toddler
                </span>
              )}
              {activeProfile.members.hasElderly && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700">
                  <HeartPulse className="w-3 h-3" /> Elderly
                </span>
              )}
              {activeProfile.members.hasRespiratorySensitivity && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                  <Flame className="w-3 h-3" /> Respiratory Sensitivity
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700">
                <Bike className="w-3 h-3" /> {activeProfile.commuteMode}
              </span>
              {activeProfile.homeSetup.hasPurifier ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <ShieldCheck className="w-3 h-3" /> Purifier
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  No Purifier
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleOpenEdit}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline self-start sm:self-auto"
          >
            {language === 'hi' ? 'सेटिंग्स बदलें' : 'Edit Settings'}
          </button>
        </div>
      )}

      {/* Preset Selector Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {DEMO_PRESETS.map((preset) => {
          const isActive = activeProfile.id === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`p-4 rounded-xl text-left transition border-2 flex flex-col justify-between space-y-2 ${
                isActive
                  ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 shadow-sm'
                  : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {language === 'hi' ? preset.nameHi : preset.nameEn}
                  </span>
                  {isActive && (
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-blue-600 text-white">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {preset.locationName}
                </p>
              </div>

              {/* Badges for profile highlights */}
              <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-slate-600 dark:text-slate-300">
                {preset.members.hasToddler && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700">
                    <Baby className="w-3 h-3" /> Toddler
                  </span>
                )}
                {preset.members.hasElderly && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700">
                    <HeartPulse className="w-3 h-3" /> Elderly
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700">
                  <Bike className="w-3 h-3" /> {preset.commuteMode}
                </span>
                {preset.homeSetup.hasPurifier ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <ShieldCheck className="w-3 h-3" /> HEPA Purifier
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    No Purifier
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Profile Edit Modal */}
      {isEditing && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsEditing(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {language === 'hi' ? 'परिवार प्रोफाइल अनुकूलित करें' : 'Customize Household Profile'}
              </h4>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                aria-label={language === 'hi' ? 'बंद करें' : 'Close'}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Profile Name / Location
                </label>
                <input
                  type="text"
                  value={editForm.locationName}
                  onChange={(e) => setEditForm({ ...editForm, locationName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* Members */}
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Vulnerable Members
                </span>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.members.hasToddler}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          members: { ...editForm.members, hasToddler: e.target.checked },
                        })
                      }
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span>Toddler / Infants</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.members.hasElderly}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          members: { ...editForm.members, hasElderly: e.target.checked },
                        })
                      }
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span>Elderly (65+)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.members.hasRespiratorySensitivity}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          members: { ...editForm.members, hasRespiratorySensitivity: e.target.checked },
                        })
                      }
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span>Asthma / Respiratory Sensitivity</span>
                  </label>
                </div>
              </div>

              {/* Commute Mode */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Commute Mode
                </label>
                <select
                  value={editForm.commuteMode}
                  onChange={(e) => setEditForm({ ...editForm, commuteMode: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="two_wheeler">Motorized Two-Wheeler / Scooter</option>
                  <option value="car">Car (AC Recirculate)</option>
                  <option value="transit">Metro / Public Bus</option>
                  <option value="remote">Work from Home / Remote</option>
                </select>
              </div>

              {/* Home Purifier */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hasPurifier"
                  checked={editForm.homeSetup.hasPurifier}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      homeSetup: { ...editForm.homeSetup, hasPurifier: e.target.checked },
                    })
                  }
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <label htmlFor="hasPurifier" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Equipped with HEPA Air Purifier
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  Apply Tailoring
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
