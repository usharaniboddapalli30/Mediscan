import React, { useState } from 'react';
import {
  Clock,
  Plus,
  CheckCircle2,
  AlertCircle,
  BellOff,
  Bell,
  Volume2,
  Sun,
  Sunset,
  Moon,
  Calendar,
  User,
  Check,
  X,
  RotateCcw,
  QrCode,
} from 'lucide-react';
import { Reminder, ReminderStatus, MedicineItem, FamilyMember } from '../types';
import { SupportedLanguage, translations } from '../i18n/translations';

interface RemindersViewProps {
  reminders: Reminder[];
  medicines: MedicineItem[];
  familyMembers: FamilyMember[];
  onUpdateStatus: (id: string, status: ReminderStatus) => void;
  onAddReminder: (reminder: Omit<Reminder, 'id'>) => void;
  onOpenScanner?: () => void;
  onTriggerTestReminder?: (reminder?: Reminder) => void;
  onEnableBrowserNotifications?: () => void;
  hasBrowserPermission?: boolean;
  isDark: boolean;
  currentLang: SupportedLanguage;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  reminders,
  medicines,
  familyMembers,
  onUpdateStatus,
  onAddReminder,
  onOpenScanner,
  onTriggerTestReminder,
  onEnableBrowserNotifications,
  hasBrowserPermission = false,
  isDark,
  currentLang,
}) => {
  const t = translations[currentLang];

  const [activeTab, setActiveTab] = useState<'All' | 'Morning' | 'Afternoon' | 'Night'>('All');
  const [selectedMember, setSelectedMember] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Reminder Form state
  const [selectedMedId, setSelectedMedId] = useState(medicines[0]?.id || '');
  const [selectedMemberId, setSelectedMemberId] = useState(familyMembers[0]?.id || 'fm-1');
  const [reminderTime, setReminderTime] = useState('08:00 AM');
  const [reminderFrequency, setReminderFrequency] = useState('Once Daily');
  const [reminderSchedule, setReminderSchedule] = useState<'Morning' | 'Afternoon' | 'Night'>('Morning');
  const [reminderDosage, setReminderDosage] = useState('1 Tablet after meals');

  const filteredReminders = reminders.filter((rem) => {
    if (activeTab !== 'All' && rem.schedule !== activeTab) return false;
    if (selectedMember !== 'All' && rem.familyMemberId !== selectedMember) return false;
    return true;
  });

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    const med = medicines.find((m) => m.id === selectedMedId);
    const member = familyMembers.find((fm) => fm.id === selectedMemberId);

    onAddReminder({
      medicineId: selectedMedId,
      medicineName: med ? med.name : 'Prescription Medicine',
      familyMemberId: selectedMemberId,
      familyMemberName: member ? `${member.name} (${member.relation})` : 'Self',
      time: reminderTime,
      frequency: reminderFrequency,
      schedule: reminderSchedule,
      dosage: reminderDosage,
      status: 'Pending',
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Clock className="w-7 h-7 text-indigo-600" />
            <span>{t.navReminders}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track daily dosages for all family members with audio chimes, browser push, and popup notifications.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onTriggerTestReminder && (
            <button
              onClick={() => onTriggerTestReminder()}
              className="px-3.5 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Test the audio chime and instant pop-up dosage notification"
            >
              <Volume2 className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span>Test Notification Ring</span>
            </button>
          )}

          {onOpenScanner && (
            <button
              onClick={onOpenScanner}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <QrCode className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span>Scan Medicine</span>
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Reminder</span>
          </button>
        </div>
      </div>

      {/* Browser Notification Permission Banner */}
      {onEnableBrowserNotifications && !hasBrowserPermission && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-transparent border border-indigo-200 dark:border-indigo-900/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">
                Enable Live System & Desktop Notifications
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Receive instant sound alerts and notifications when medication is due even if the tab is in the background.
              </p>
            </div>
          </div>
          <button
            onClick={onEnableBrowserNotifications}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-xl shadow-md cursor-pointer transition-all shrink-0"
          >
            Enable Live Notifications
          </button>
        </div>
      )}

      {/* Tabs & Member Filter */}
      <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Schedule Tiers */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
            {(['All', 'Morning', 'Afternoon', 'Night'] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : isDark
                      ? 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab === 'Morning' && <Sun className="w-3.5 h-3.5" />}
                  {tab === 'Afternoon' && <Sunset className="w-3.5 h-3.5" />}
                  {tab === 'Night' && <Moon className="w-3.5 h-3.5" />}
                  <span>{tab === 'All' ? 'All Schedules' : tab}</span>
                </button>
              );
            })}
          </div>

          {/* Member Dropdown Filter */}
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border outline-none cursor-pointer ${
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

      {/* Reminders List */}
      <div className="space-y-4">
        {filteredReminders.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-400" />
            <p className="text-sm font-semibold">No reminders found for selected schedule</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReminders.map((rem) => (
              <div
                key={rem.id}
                className={`p-5 rounded-2xl border transition-all ${
                  rem.status === 'Taken'
                    ? isDark
                      ? 'bg-emerald-950/20 border-emerald-900/40'
                      : 'bg-emerald-50/50 border-emerald-200'
                    : rem.status === 'Missed'
                    ? isDark
                      ? 'bg-rose-950/20 border-rose-900/40'
                      : 'bg-rose-50/50 border-rose-200'
                    : isDark
                    ? 'bg-slate-900 border-slate-800'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 block">
                      {rem.familyMemberName}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                      {rem.medicineName}
                    </h3>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      rem.status === 'Taken'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : rem.status === 'Pending'
                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                        : rem.status === 'Missed'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {rem.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
                  <div className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{rem.time}</span>
                  </div>
                  <span>•</span>
                  <span>{rem.schedule} ({rem.frequency})</span>
                  <span>•</span>
                  <span>Dosage: {rem.dosage}</span>
                </div>

                {/* Status Control Buttons (Taken / Pending / Missed / Snoozed) REQUIREMENT #6 */}
                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-1 text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">Update Status:</span>

                  <div className="flex items-center gap-1.5">
                    {onTriggerTestReminder && (
                      <button
                        onClick={() => onTriggerTestReminder(rem)}
                        className="px-2 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                        title="Play audio chime & notification for this dose"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Ring</span>
                      </button>
                    )}

                    <button
                      onClick={() => onUpdateStatus(rem.id, 'Taken')}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer ${
                        rem.status === 'Taken'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-950'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>{t.taken}</span>
                    </button>

                    <button
                      onClick={() => onUpdateStatus(rem.id, 'Pending')}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                        rem.status === 'Pending'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-100'
                      }`}
                    >
                      <span>{t.pending}</span>
                    </button>

                    <button
                      onClick={() => onUpdateStatus(rem.id, 'Missed')}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer ${
                        rem.status === 'Missed'
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-100'
                      }`}
                    >
                      <X className="w-3 h-3" />
                      <span>{t.missed}</span>
                    </button>

                    <button
                      onClick={() => onUpdateStatus(rem.id, 'Snoozed')}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer ${
                        rem.status === 'Snoozed'
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-100'
                      }`}
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{t.snoozed}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE REMINDER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 space-y-4 ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base">Create Medicine Reminder</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Select Medicine</label>
                <select
                  value={selectedMedId}
                  onChange={(e) => setSelectedMedId(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'
                  }`}
                  required
                >
                  {medicines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Family Member</label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'
                  }`}
                >
                  {familyMembers.map((fm) => (
                    <option key={fm.id} value={fm.id}>
                      {fm.name} ({fm.relation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Time</label>
                  <input
                    type="text"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    placeholder="08:00 AM"
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Schedule</label>
                  <select
                    value={reminderSchedule}
                    onChange={(e: any) => setReminderSchedule(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Frequency</label>
                <input
                  type="text"
                  value={reminderFrequency}
                  onChange={(e) => setReminderFrequency(e.target.value)}
                  placeholder="e.g. Once Daily / Twice Daily"
                  className={`w-full p-2.5 rounded-xl border outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Dosage Instructions</label>
                <input
                  type="text"
                  value={reminderDosage}
                  onChange={(e) => setReminderDosage(e.target.value)}
                  placeholder="e.g. 1 Tablet after breakfast"
                  className={`w-full p-2.5 rounded-xl border outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl cursor-pointer"
                >
                  Save Reminder
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
