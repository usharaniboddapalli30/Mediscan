import React from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Calendar,
  Building,
  Box,
  DollarSign,
  Info,
  Clock,
  Sparkles,
  ArrowRight,
  Truck,
  ShieldCheck,
  Plus,
  Bell,
  Thermometer,
} from 'lucide-react';
import { MedicineItem, FamilyMember } from '../types';
import { SupportedLanguage, translations } from '../i18n/translations';

interface MedicineDetailsModalProps {
  medicine: MedicineItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSetReminder: (medicine: MedicineItem) => void;
  onAskAi: (medicineName: string) => void;
  familyMembers: FamilyMember[];
  isDark: boolean;
  currentLang: SupportedLanguage;
}

export const MedicineDetailsModal: React.FC<MedicineDetailsModalProps> = ({
  medicine,
  isOpen,
  onClose,
  onSetReminder,
  onAskAi,
  familyMembers,
  isDark,
  currentLang,
}) => {
  const t = translations[currentLang];

  if (!isOpen || !medicine) return null;

  const assignedMember = familyMembers.find(
    (m) => m.id === medicine.familyMemberId
  );

  const isSuspicious = medicine.verificationStatus === 'Suspicious' || medicine.verificationStatus === 'Unverified';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-3xl max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-all ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header Banner */}
        <div
          className={`p-5 flex items-start justify-between border-b ${
            isSuspicious
              ? 'bg-red-600 text-white border-red-700'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-700'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              {medicine.verificationStatus === 'Verified' && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-100 border border-emerald-400/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t.verified}
                </span>
              )}
              {isSuspicious && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white border border-white/40 flex items-center gap-1 animate-pulse">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {medicine.verificationStatus}
                </span>
              )}
              <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded-full font-medium">
                Batch: {medicine.batchNumber}
              </span>
            </div>

            <h2 className="text-xl font-bold tracking-tight">{medicine.name}</h2>
            <p className="text-xs text-blue-100 dark:text-slate-300 font-medium">
              Generic: {medicine.genericName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* SUSPICIOUS WARNING BANNER REQUIREMENT #10 */}
          {isSuspicious && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/80 border-2 border-red-500 text-red-900 dark:text-red-200 flex items-start gap-3">
              <ShieldAlert className="w-7 h-7 text-red-600 flex-shrink-0 mt-0.5 animate-bounce" />
              <div>
                <h3 className="font-bold text-base text-red-700 dark:text-red-300">
                  {t.suspiciousWarningTitle}
                </h3>
                <p className="text-xs text-red-700 dark:text-red-300 mt-1 leading-relaxed">
                  {medicine.suspiciousReason ||
                    'This scanned medicine failed GS1 authenticity seal validation. It may be counterfeit, unverified, or expired. Do NOT administer.'}
                </p>
              </div>
            </div>
          )}

          {/* RECALL ALERT BANNER REQUIREMENT #9 */}
          {medicine.recallNotice?.isRecalled && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/80 border-2 border-amber-500 text-amber-900 dark:text-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-7 h-7 text-amber-600 flex-shrink-0 mt-0.5 animate-bounce" />
              <div>
                <h3 className="font-bold text-base text-amber-800 dark:text-amber-300">
                  🚨 OFFICIAL SAFETY RECALL NOTICE
                </h3>
                <p className="text-xs text-amber-800 dark:text-amber-200 mt-1 font-medium">
                  {medicine.recallNotice.reason}
                </p>
                <div className="mt-2 text-xs font-bold text-amber-900 dark:text-amber-100">
                  Required Action: {medicine.recallNotice.actionRequired}
                </div>
              </div>
            </div>
          )}

          {/* Quick Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                <Building className="w-3.5 h-3.5 text-blue-500" />
                <span>Manufacturer</span>
              </div>
              <p className="text-xs font-bold truncate">{medicine.manufacturer}</p>
            </div>

            <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                <span>Expiry Date</span>
              </div>
              <p className="text-xs font-bold">{medicine.expiryDate}</p>
            </div>

            <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                <DollarSign className="w-3.5 h-3.5 text-indigo-500" />
                <span>MRP</span>
              </div>
              <p className="text-xs font-bold">{medicine.mrp}</p>
            </div>

            <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                <Box className="w-3.5 h-3.5 text-purple-500" />
                <span>Assigned To</span>
              </div>
              <p className="text-xs font-bold truncate">
                {assignedMember?.name || 'Main Account'}
              </p>
            </div>
          </div>

          {/* Comprehensive Medicine Details Breakdown */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Full Clinical & Storage Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1">
                  Chemical Composition
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {medicine.composition}
                </p>
              </div>

              <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                  Recommended Uses
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {medicine.uses}
                </p>
              </div>

              <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">
                  Precautions & Warnings
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {medicine.precautions}
                </p>
              </div>

              <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="font-bold text-purple-600 dark:text-purple-400 block mb-1">
                  Storage Instructions
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {medicine.storageInstructions}
                </p>
              </div>
            </div>
          </div>

          {/* TRACEABILITY SUPPLY CHAIN REQUIREMENT #11 */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-600" />
              <span>Supply Chain Traceability (Manufacturer → Patient)</span>
            </h3>

            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="relative border-l-2 border-blue-500/40 ml-3 pl-4 space-y-4">
                {medicine.traceability && medicine.traceability.length > 0 ? (
                  medicine.traceability.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900"></div>
                      <div className="flex items-center justify-between font-bold text-xs">
                        <span className="text-blue-600 dark:text-blue-400">
                          {step.stage} • {step.facility}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {step.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        {step.location} — {step.status}
                      </p>
                      {step.tempLog && (
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                          <Thermometer className="w-3 h-3" />
                          <span>Temp Log: {step.tempLog}</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">Standard pharmacy distribution log recorded.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onAskAi(medicine.name)}
            className="px-4 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold flex items-center gap-2 hover:bg-purple-100 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Ask AI Assistant</span>
          </button>

          <div className="flex items-center gap-2 ml-auto">
            {!isSuspicious && (
              <button
                onClick={() => {
                  onSetReminder(medicine);
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span>Set Medicine Reminder</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
