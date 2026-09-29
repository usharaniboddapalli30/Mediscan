import React, { useState } from 'react';
import {
  X,
  Package,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  User,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  QrCode,
} from 'lucide-react';
import { MedicineItem, FamilyMember, MedicineCategory } from '../types';
import { SupportedLanguage, translations } from '../i18n/translations';

interface MedicineCabinetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenScanner?: () => void;
  medicines: MedicineItem[];
  familyMembers: FamilyMember[];
  onSelectMedicine: (medicine: MedicineItem) => void;
  isDark: boolean;
  currentLang: SupportedLanguage;
}

export const MedicineCabinetModal: React.FC<MedicineCabinetModalProps> = ({
  isOpen,
  onClose,
  onOpenScanner,
  medicines,
  familyMembers,
  onSelectMedicine,
  isDark,
  currentLang,
}) => {
  const t = translations[currentLang];

  const [activeCategory, setActiveCategory] = useState<MedicineCategory | 'All'>('All');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('All');
  const [cabinetSearch, setCabinetSearch] = useState<string>('');

  if (!isOpen) return null;

  // Filter logic
  const filteredMedicines = medicines.filter((med) => {
    // Category match
    if (activeCategory !== 'All' && med.category !== activeCategory) return false;
    // Family member match
    if (selectedMemberId !== 'All' && med.familyMemberId !== selectedMemberId) return false;
    // Search query match
    if (cabinetSearch) {
      const q = cabinetSearch.toLowerCase();
      const nameMatch = med.name.toLowerCase().includes(q);
      const genericMatch = med.genericName.toLowerCase().includes(q);
      const batchMatch = med.batchNumber.toLowerCase().includes(q);
      return nameMatch || genericMatch || batchMatch;
    }
    return true;
  });

  // Calculate days remaining helper
  const calculateDaysRemaining = (expiryStr: string) => {
    const expDate = new Date(expiryStr);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const categoryCounts = {
    All: medicines.length,
    Active: medicines.filter((m) => m.category === 'Active').length,
    'Expiring Soon': medicines.filter((m) => m.category === 'Expiring Soon').length,
    Expired: medicines.filter((m) => m.category === 'Expired').length,
    Completed: medicines.filter((m) => m.category === 'Completed').length,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-4xl max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-all ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-md">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {t.digitalCabinet}
              </h2>
              <p className="text-xs text-blue-100">
                Organized family prescription & OTC storage repository
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenScanner && (
              <button
                onClick={() => {
                  onClose();
                  onOpenScanner();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-blue-600" />
                <span className="hidden sm:inline">Scan New Medicine</span>
                <span className="sm:hidden">Scan</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Search Input */}
            <div className="flex-1 min-w-[200px] relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={cabinetSearch}
                onChange={(e) => setCabinetSearch(e.target.value)}
                placeholder="Search cabinet medicines..."
                className={`w-full pl-9 pr-4 py-1.5 rounded-xl text-xs border outline-none ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-blue-600'
                }`}
              />
            </div>

            {/* Member Filter Dropdown */}
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border outline-none cursor-pointer ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-slate-200'
                    : 'bg-white border-slate-300 text-slate-800'
                }`}
              >
                <option value="All">All Family Members</option>
                {familyMembers.map((fm) => (
                  <option key={fm.id} value={fm.id}>
                    {fm.name} ({fm.relation})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
            {(['All', 'Active', 'Expiring Soon', 'Expired', 'Completed'] as const).map(
              (cat) => {
                const count = categoryCounts[cat];
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : isDark
                        ? 'bg-slate-800 text-slate-400 hover:text-slate-200'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat === 'All' ? 'All Medicines' : cat}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Medicines List Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {filteredMedicines.length === 0 ? (
            <div className="text-center py-12 text-slate-500 flex flex-col items-center justify-center">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-400" />
              <p className="text-sm font-semibold">No medicines found in this cabinet view</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Try clearing search filters or scan and register new medicines to this profile.
              </p>
              {onOpenScanner && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenScanner();
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Scan Medicine Packaging</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMedicines.map((med) => {
                const daysLeft = calculateDaysRemaining(med.expiryDate);
                const assignedMember = familyMembers.find(
                  (m) => m.id === med.familyMemberId
                );

                return (
                  <div
                    key={med.id}
                    onClick={() => onSelectMedicine(med)}
                    className={`p-4 rounded-2xl border transition-all duration-200 hover:shadow-lg cursor-pointer flex flex-col justify-between ${
                      med.category === 'Expired'
                        ? isDark
                          ? 'bg-red-950/20 border-red-900/40 hover:border-red-500'
                          : 'bg-red-50/50 border-red-200 hover:border-red-400'
                        : med.category === 'Expiring Soon'
                        ? isDark
                          ? 'bg-amber-950/20 border-amber-900/40 hover:border-amber-500'
                          : 'bg-amber-50/50 border-amber-200 hover:border-amber-400'
                        : isDark
                        ? 'bg-slate-800/60 border-slate-800 hover:border-blue-500/50'
                        : 'bg-white border-slate-200 hover:border-blue-400'
                    }`}
                  >
                    <div>
                      {/* Top status bar */}
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            med.category === 'Active'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                              : med.category === 'Expiring Soon'
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                              : med.category === 'Expired'
                              ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                          }`}
                        >
                          {med.category}
                        </span>

                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <User className="w-3 h-3 text-blue-500" />
                          <span>{assignedMember?.name || 'Self'}</span>
                        </span>
                      </div>

                      {/* Title & Generic */}
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                        {med.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-3">
                        {med.genericName}
                      </p>
                    </div>

                    {/* Expiry Details Card Footer */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          Expiry Date
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {med.expiryDate}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-medium">
                          Remaining Days
                        </span>
                        <span
                          className={`font-bold ${
                            daysLeft < 0
                              ? 'text-red-600 dark:text-red-400'
                              : daysLeft <= 30
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {daysLeft < 0 ? `Expired (${Math.abs(daysLeft)}d ago)` : `${daysLeft} days`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
