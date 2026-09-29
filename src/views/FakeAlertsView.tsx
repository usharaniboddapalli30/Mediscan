import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  FileWarning,
  CheckCircle2,
  PhoneCall,
  ExternalLink,
  Search,
  MapPin,
  Calendar,
  Building,
  QrCode,
} from 'lucide-react';
import { FakeMedicineAlert } from '../types';
import { SupportedLanguage, translations } from '../i18n/translations';

interface FakeAlertsViewProps {
  fakeAlerts: FakeMedicineAlert[];
  onOpenScanner?: () => void;
  isDark: boolean;
  currentLang: SupportedLanguage;
}

export const FakeAlertsView: React.FC<FakeAlertsViewProps> = ({
  fakeAlerts,
  onOpenScanner,
  isDark,
  currentLang,
}) => {
  const t = translations[currentLang];
  const [reportedIds, setReportedIds] = useState<string[]>([]);

  const handleReportToAuthority = (id: string) => {
    setReportedIds((prev) => [...prev, id]);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-red-600 animate-pulse" />
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              {t.navFakeAlerts}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Vault of flagged, counterfeit, or unverified medicines detected during QR/barcode verification
          </p>
        </div>

        {onOpenScanner && (
          <button
            onClick={onOpenScanner}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan & Verify Medicine</span>
          </button>
        )}
      </div>

      {/* Prominent Safety Banner REQUIREMENT #10 */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-xl shadow-red-600/10 flex items-start gap-4">
        <AlertTriangle className="w-8 h-8 text-amber-300 flex-shrink-0 mt-1 animate-bounce" />
        <div className="space-y-1">
          <h2 className="font-extrabold text-lg">
            {t.suspiciousWarningTitle}
          </h2>
          <p className="text-xs text-red-100 leading-relaxed">
            If a medicine in your cabinet displays a suspicious or counterfeit seal alert, do NOT ingest or administer it. Quarantine the box immediately and consult your prescribing physician.
          </p>
        </div>
      </div>

      {/* Alerts Cards List */}
      <div className="space-y-4">
        {fakeAlerts.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-emerald-600">No suspicious or counterfeit medicines flagged in your cabinet.</p>
          </div>
        ) : (
          fakeAlerts.map((alert) => {
            const isReported = reportedIds.includes(alert.id);

            return (
              <div
                key={alert.id}
                className={`p-6 rounded-3xl border-2 transition-all ${
                  isDark
                    ? 'bg-red-950/20 border-red-900/60 text-slate-100'
                    : 'bg-red-50/40 border-red-200 text-slate-900'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white inline-block mb-2">
                      ⚠️ {alert.verificationStatus.toUpperCase()}
                    </span>
                    <h3 className="text-lg font-bold text-red-700 dark:text-red-400">
                      {alert.medicineName}
                    </h3>
                  </div>

                  <div className="text-right text-xs text-slate-500">
                    <span className="block font-medium">Flagged on: {alert.scannedAt}</span>
                    <span className="block font-bold text-slate-800 dark:text-slate-200">
                      Member: {alert.familyMemberName}
                    </span>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4 text-xs">
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <span className="text-slate-400 block font-medium">Batch Number</span>
                    <strong className="text-slate-800 dark:text-slate-200 text-sm">{alert.batchNumber}</strong>
                  </div>

                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <span className="text-slate-400 block font-medium">Manufacturer Label</span>
                    <strong className="text-slate-800 dark:text-slate-200 text-sm">{alert.manufacturer}</strong>
                  </div>

                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <span className="text-slate-400 block font-medium">Location</span>
                    <strong className="text-slate-800 dark:text-slate-200 text-sm">{alert.location}</strong>
                  </div>
                </div>

                {/* Failure Reason */}
                <div className="p-3.5 rounded-xl bg-red-100/60 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-xs space-y-1 mb-4">
                  <span className="font-bold text-red-800 dark:text-red-300 block">
                    Security Seal Verification Failure Reason:
                  </span>
                  <p className="text-red-900 dark:text-red-200 leading-relaxed font-medium">
                    {alert.reason}
                  </p>
                </div>

                {/* Recommended Action & Authority Report */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-red-200 dark:border-red-900/60 text-xs">
                  <div className="font-bold text-red-700 dark:text-red-400">
                    Action Required: {alert.actionRecommended}
                  </div>

                  <button
                    onClick={() => handleReportToAuthority(alert.id)}
                    disabled={isReported}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      isReported
                        ? 'bg-emerald-600 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white shadow-md'
                    }`}
                  >
                    {isReported ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Reported to Drug Regulatory Authority</span>
                      </>
                    ) : (
                      <>
                        <PhoneCall className="w-4 h-4" />
                        <span>Report Counterfeit Vendor</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
