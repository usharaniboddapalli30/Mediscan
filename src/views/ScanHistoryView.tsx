import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  CheckCircle2,
  ShieldAlert,
  Calendar,
  User,
  QrCode,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react';
import { ScanHistoryRecord, MedicineItem, FamilyMember } from '../types';
import { SupportedLanguage, translations } from '../i18n/translations';

interface ScanHistoryViewProps {
  scanHistory: ScanHistoryRecord[];
  familyMembers: FamilyMember[];
  onSelectRecord: (record: ScanHistoryRecord) => void;
  onOpenScanner: () => void;
  isDark: boolean;
  currentLang: SupportedLanguage;
}

export const ScanHistoryView: React.FC<ScanHistoryViewProps> = ({
  scanHistory,
  familyMembers,
  onSelectRecord,
  onOpenScanner,
  isDark,
  currentLang,
}) => {
  const t = translations[currentLang];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedMember, setSelectedMember] = useState<string>('All');

  const filteredHistory = scanHistory.filter((rec) => {
    if (selectedStatus !== 'All' && rec.verificationStatus !== selectedStatus) return false;
    if (selectedMember !== 'All' && rec.familyMemberId !== selectedMember) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const nameMatch = rec.medicineName.toLowerCase().includes(q);
      const batchMatch = rec.batchNumber.toLowerCase().includes(q);
      const memberMatch = rec.familyMemberName.toLowerCase().includes(q);
      return nameMatch || batchMatch || memberMatch;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <History className="w-7 h-7 text-blue-600" />
            <span>{t.navHistory}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete audit trail of all verified and scanned medicines for your family account
          </p>
        </div>

        <button
          onClick={onOpenScanner}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all"
        >
          <QrCode className="w-4 h-4" />
          <span>Scan New Medicine</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history by name, batch..."
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border outline-none ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
              }`}
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border outline-none cursor-pointer ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300'
              }`}
            >
              <option value="All">All Verification Statuses</option>
              <option value="Verified">Verified Authentic</option>
              <option value="Suspicious">Suspicious / Counterfeit</option>
              <option value="Unverified">Unverified</option>
            </select>
          </div>

          {/* Member Filter */}
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border outline-none cursor-pointer ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300'
              }`}
            >
              <option value="All">All Family Members</option>
              {familyMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.relation})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* History Records Table / List */}
      <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        {filteredHistory.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <History className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-400" />
            <p className="text-sm font-semibold">No scan history records match filters</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredHistory.map((record) => {
              const isSuspicious = record.verificationStatus === 'Suspicious' || record.verificationStatus === 'Unverified';

              return (
                <div
                  key={record.id}
                  onClick={() => onSelectRecord(record)}
                  className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex flex-wrap items-center justify-between gap-4 ${
                    isSuspicious ? 'bg-red-50/30 dark:bg-red-950/20' : ''
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {record.medicineName}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isSuspicious
                            ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 animate-pulse'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {record.verificationStatus}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span>Batch: <strong className="text-slate-700 dark:text-slate-300">{record.batchNumber}</strong></span>
                      <span>Expiry: <strong className="text-slate-700 dark:text-slate-300">{record.expiryDate}</strong></span>
                      <span>Member: <strong className="text-blue-600 dark:text-blue-400">{record.familyMemberName}</strong></span>
                    </div>
                  </div>

                  <div className="text-right text-xs text-slate-400">
                    <div className="flex items-center gap-1 justify-end font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{record.scannedAt}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Scanned by {record.scannedByName}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
