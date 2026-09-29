import React from 'react';
import {
  QrCode,
  Package,
  Users,
  Clock,
  History,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Bell,
  Activity,
  User,
  Plus,
} from 'lucide-react';
import {
  MedicineItem,
  ScanHistoryRecord,
  Reminder,
  FamilyMember,
  SafetyAlert,
  NavigationTab,
} from '../types';
import { SupportedLanguage, translations } from '../i18n/translations';

interface DashboardViewProps {
  onNavigateTab: (tab: NavigationTab) => void;
  onOpenScanner: () => void;
  onOpenCabinet: () => void;
  onOpenFamilyModal: () => void;
  onOpenAiModal: (query?: string) => void;
  onSelectMedicine: (medicine: MedicineItem) => void;
  medicines: MedicineItem[];
  scanHistory: ScanHistoryRecord[];
  reminders: Reminder[];
  familyMembers: FamilyMember[];
  safetyAlerts: SafetyAlert[];
  isDark: boolean;
  currentLang: SupportedLanguage;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
  onOpenScanner,
  onOpenCabinet,
  onOpenFamilyModal,
  onOpenAiModal,
  onSelectMedicine,
  medicines = [],
  scanHistory = [],
  reminders = [],
  familyMembers = [],
  safetyAlerts = [],
  isDark,
  currentLang,
}) => {
  const t = translations[currentLang];

  // Calculated Stats
  const safeMeds = medicines || [];
  const safeHistory = scanHistory || [];
  const safeReminders = reminders || [];
  const safeFamily = familyMembers || [];
  const safeAlerts = safetyAlerts || [];

  const totalMeds = safeMeds.length;
  const expiringSoonCount = safeMeds.filter((m) => m && m.category === 'Expiring Soon').length;
  const todayRemindersCount = safeReminders.length;
  const missedRemindersCount = safeReminders.filter((r) => r && r.status === 'Missed').length;
  const familyCount = safeFamily.length;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 shadow-xl shadow-blue-600/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30 backdrop-blur-md mb-3">
            <Activity className="w-3.5 h-3.5" />
            <span>Authorized Family Health Management Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome to {t.appName}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-2 leading-relaxed">
            {t.appTagline}. Scan medicine packaging, track expiry dates, manage family reminders, and verify authentic pharmaceutical supply chains.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={onOpenScanner}
              className="px-5 py-3 rounded-2xl bg-white text-blue-700 font-bold text-xs sm:text-sm hover:bg-blue-50 transition-all shadow-lg active:scale-[0.98] cursor-pointer flex items-center gap-2"
            >
              <QrCode className="w-4 h-4 text-blue-600" />
              <span>{t.scanMedicine}</span>
            </button>

            <button
              onClick={onOpenCabinet}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              <span>{t.digitalCabinet}</span>
            </button>

            <button
              onClick={onOpenFamilyModal}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>{t.familyManagement}</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none transform translate-x-20 translate-y-20"></div>
      </div>

      {/* SUMMARY STATISTICS CARDS REQUIREMENT */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div
          onClick={onOpenCabinet}
          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold">{t.totalMedicines}</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight">{totalMeds}</div>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            Stored in Cabinet
          </p>
        </div>

        <div
          onClick={onOpenCabinet}
          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold">{t.medicinesExpiringSoon}</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
            {expiringSoonCount}
          </div>
          <p className="text-[10px] text-amber-600 font-medium mt-1">Monitored Alerts</p>
        </div>

        <div
          onClick={() => onNavigateTab('reminders')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold">{t.todayRemindersCount}</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight">{todayRemindersCount}</div>
          <p className="text-[10px] text-indigo-600 font-medium mt-1">Daily Schedules</p>
        </div>

        <div
          onClick={() => onNavigateTab('reminders')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold">{t.missedRemindersCount}</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
            {missedRemindersCount}
          </div>
          <p className="text-[10px] text-rose-600 font-medium mt-1">Requires Attention</p>
        </div>

        <div
          onClick={onOpenFamilyModal}
          className={`col-span-2 lg:col-span-1 p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold">{t.familyMembersCount}</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight">{familyCount}</div>
          <p className="text-[10px] text-purple-600 font-medium mt-1">Managed Profiles</p>
        </div>
      </div>

      {/* QUICK ACCESS ACTION CARDS REQUIREMENT */}
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <span>Quick Access Dashboard Features</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={onOpenScanner}
            className={`p-5 rounded-2xl border text-left transition-all hover:shadow-xl hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between ${
              isDark
                ? 'bg-gradient-to-br from-slate-900 to-blue-950/40 border-blue-900/50'
                : 'bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border-blue-200'
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 mb-3">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {t.scanMedicine}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Scan QR or Barcode camera
              </p>
            </div>
          </button>

          <button
            onClick={onOpenCabinet}
            className={`p-5 rounded-2xl border text-left transition-all hover:shadow-xl hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between ${
              isDark
                ? 'bg-gradient-to-br from-slate-900 to-indigo-950/40 border-indigo-900/50'
                : 'bg-gradient-to-br from-indigo-50/80 to-purple-50/80 border-indigo-200'
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-3">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {t.digitalCabinet}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                4 Organized medicine tiers
              </p>
            </div>
          </button>

          <button
            onClick={onOpenFamilyModal}
            className={`p-5 rounded-2xl border text-left transition-all hover:shadow-xl hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between ${
              isDark
                ? 'bg-gradient-to-br from-slate-900 to-purple-950/40 border-purple-900/50'
                : 'bg-gradient-to-br from-purple-50/80 to-rose-50/80 border-purple-200'
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/20 mb-3">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {t.familyManagement}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Multi-member adherence matrix
              </p>
            </div>
          </button>

          <button
            onClick={() => onOpenAiModal()}
            className={`p-5 rounded-2xl border text-left transition-all hover:shadow-xl hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between ${
              isDark
                ? 'bg-gradient-to-br from-slate-900 to-emerald-950/40 border-emerald-900/50'
                : 'bg-gradient-to-br from-emerald-50/80 to-teal-50/80 border-emerald-200'
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>{t.aiAssistant}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  Trained
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Trained on website data & cabinet
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* FAMILY REMINDER DASHBOARD PREVIEW MATRIX REQUIREMENT #8 */}
      <div
        className={`p-6 rounded-3xl border transition-all ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {t.familyReminderDashboardTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.familyReminderDashboardSubtitle}
            </p>
          </div>

          <button
            onClick={onOpenFamilyModal}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {safeFamily.slice(0, 3).map((member) => {
            const memberReminders = safeReminders.filter((r) => r && r.familyMemberId === member.id);
            const taken = memberReminders.filter((r) => r.status === 'Taken').length;
            const pending = memberReminders.filter((r) => r.status === 'Pending').length;
            const missed = memberReminders.filter((r) => r.status === 'Missed').length;

            const memberMeds = safeMeds.filter((m) => m && m.familyMemberId === member.id);
            const expiring = memberMeds.filter((m) => m.category === 'Expiring Soon').length;

            return (
              <div
                key={member.id}
                className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className={`w-8 h-8 rounded-full ${member.avatarColor} text-white font-bold text-xs flex items-center justify-center`}
                  >
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                      {member.name}
                    </h3>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400">
                      {member.relation}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">{t.taken}:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{taken}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">{t.pending}:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{pending}</span>
                  </div>
                  {missed > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">{t.missed}:</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400">{missed}</span>
                    </div>
                  )}
                  {expiring > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">{t.expiringSoon}:</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">{expiring}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RECENT SCAN HISTORY & SAFETY ALERTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Scan History */}
        <div
          className={`p-6 rounded-3xl border transition-all ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              <span>{t.recentScanHistory}</span>
            </h2>

            <button
              onClick={() => onNavigateTab('history')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {safeHistory.slice(0, 4).map((rec) => (
              <div
                key={rec.id}
                className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                  rec.verificationStatus === 'Suspicious'
                    ? 'border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20'
                    : isDark
                    ? 'border-slate-800 bg-slate-800/40'
                    : 'border-slate-200 bg-slate-50/60'
                }`}
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    {rec.medicineName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Batch: {rec.batchNumber} • Scanned for {rec.familyMemberName}
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    rec.verificationStatus === 'Verified'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                  }`}
                >
                  {rec.verificationStatus}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Safety & Recall Alerts */}
        <div
          className={`p-6 rounded-3xl border transition-all ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>{t.safetyAlerts}</span>
            </h2>

            <button
              onClick={() => onNavigateTab('fake-alerts')}
              className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Fake Medicine Alerts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {safeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between font-bold text-amber-900 dark:text-amber-200">
                  <span>{alert.title}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-600 text-white">
                    {alert.severity} Priority
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                  {alert.description}
                </p>
                <div className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                  Affected: {(alert.affectedMembers || []).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
