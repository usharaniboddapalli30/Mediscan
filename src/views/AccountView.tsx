import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Globe,
  Sun,
  Moon,
  Shield,
  Bell,
  Lock,
  LogOut,
  Users,
  CheckCircle2,
  ChevronRight,
  Key,
} from 'lucide-react';
import { SupportedLanguage, translations } from '../i18n/translations';
import { FamilyMember } from '../types';

interface AccountViewProps {
  user: { name: string; email: string; phone: string } | null;
  currentLang: SupportedLanguage;
  onSelectLang: (lang: SupportedLanguage) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  familyMembers: FamilyMember[];
  onOpenFamilyModal: () => void;
  onLogout: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  user,
  currentLang,
  onSelectLang,
  isDark,
  onToggleTheme,
  familyMembers,
  onOpenFamilyModal,
  onLogout,
}) => {
  const t = translations[currentLang];

  // Settings states
  const [notifyExpiry, setNotifyExpiry] = useState(true);
  const [notifyReminders, setNotifyReminders] = useState(true);
  const [notifySafety, setNotifySafety] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <User className="w-7 h-7 text-blue-600" />
          <span>{t.navAccount}</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Authorized primary account preferences, language selection, family profiles, and privacy settings
        </p>
      </div>

      {/* User Profile Card */}
      <div
        className={`p-6 rounded-3xl border shadow-sm transition-all ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{user?.name || 'Alex Miller'}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  Primary Authorized Account
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                  {user?.email || 'alex.miller@mediscan.health'}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-blue-500" />
                  {user?.phone || '+1 (555) 019-2834'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.logout}</span>
          </button>
        </div>
      </div>

      {/* LANGUAGE SELECTOR REQUIREMENT */}
      <div
        className={`p-6 rounded-3xl border space-y-3 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>{t.selectLanguageLabel}</span>
            </h3>
            <p className="text-xs text-slate-500">
              Select your preferred language (English, Telugu, or Hindi). Saved automatically.
            </p>
          </div>

          <select
            value={currentLang}
            onChange={(e) => onSelectLang(e.target.value as SupportedLanguage)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border outline-none cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-blue-400'
                : 'bg-slate-50 border-slate-300 text-blue-700'
            }`}
          >
            <option value="en">🌐 English</option>
            <option value="te">🌐 తెలుగు (Telugu)</option>
            <option value="hi">🌐 हिन्दी (Hindi)</option>
          </select>
        </div>
      </div>

      {/* FAMILY MEMBERS SUMMARY LINK */}
      <div
        className={`p-6 rounded-3xl border ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Managed Family Profiles ({familyMembers.length})</span>
            </h3>
            <p className="text-xs text-slate-500">
              One main account managing medicines for Mother, Father, Grandmother, Children
            </p>
          </div>

          <button
            onClick={onOpenFamilyModal}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md flex items-center gap-1 cursor-pointer hover:bg-indigo-700 transition-colors"
          >
            <span>Manage Profiles</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {familyMembers.map((m) => (
            <div
              key={m.id}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${m.avatarColor}`}></div>
              <span>{m.name} ({m.relation})</span>
            </div>
          ))}
        </div>
      </div>

      {/* DISPLAY & NOTIFICATION PREFERENCES */}
      <div
        className={`p-6 rounded-3xl border space-y-5 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Bell className="w-4 h-4 text-purple-600" />
          <span>Notification & Theme Preferences</span>
        </h3>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="font-semibold block">Theme Appearance</span>
            <span className="text-slate-500">Switch between Light and Dark interface mode</span>
          </div>

          <button
            onClick={onToggleTheme}
            className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-2 cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-amber-400'
                : 'bg-slate-100 border-slate-300 text-slate-700'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>

        {/* Expiry Alerts Toggle */}
        <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="font-semibold block">Medicine Expiry Alerts</span>
            <span className="text-slate-500">Alert 30 days, 15 days, and 7 days prior to expiry</span>
          </div>

          <input
            type="checkbox"
            checked={notifyExpiry}
            onChange={(e) => setNotifyExpiry(e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded cursor-pointer"
          />
        </div>

        {/* Reminder Alerts Toggle */}
        <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="font-semibold block">Dosage Schedule Reminders</span>
            <span className="text-slate-500">Pop-up notifications at scheduled dosage times</span>
          </div>

          <input
            type="checkbox"
            checked={notifyReminders}
            onChange={(e) => setNotifyReminders(e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded cursor-pointer"
          />
        </div>

        {/* Safety Recalls Toggle */}
        <div className="flex items-center justify-between text-xs py-2">
          <div>
            <span className="font-semibold block">FDA Safety Recalls & Counterfeit Warnings</span>
            <span className="text-slate-500">Immediate high-priority alert when a batch is flagged</span>
          </div>

          <input
            type="checkbox"
            checked={notifySafety}
            onChange={(e) => setNotifySafety(e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded cursor-pointer"
          />
        </div>

        {/* Save button */}
        <div className="pt-2 flex items-center justify-between">
          {saveSuccess && (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Settings updated successfully!
            </span>
          )}

          <button
            onClick={handleSaveSettings}
            className="ml-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
          >
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
};
