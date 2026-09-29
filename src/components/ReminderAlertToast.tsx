import React, { useState, useEffect } from 'react';
import { Bell, Clock, Check, RotateCcw, X, Volume2, Pill } from 'lucide-react';
import { Reminder } from '../types';
import { SupportedLanguage } from '../i18n/translations';

interface ReminderAlertToastProps {
  activeAlert: {
    reminder: Reminder;
    timestamp: string;
  } | null;
  onTake: (reminderId: string) => void;
  onSnooze: (reminderId: string) => void;
  onDismiss: () => void;
  isDark: boolean;
  currentLang: SupportedLanguage;
}

export const ReminderAlertToast: React.FC<ReminderAlertToastProps> = ({
  activeAlert,
  onTake,
  onSnooze,
  onDismiss,
  isDark,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (activeAlert) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [activeAlert]);

  if (!activeAlert || !visible) return null;

  const { reminder } = activeAlert;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-md w-full animate-bounce-short">
      <div
        className={`p-4 sm:p-5 rounded-2xl border shadow-2xl backdrop-blur-md relative overflow-hidden ${
          isDark
            ? 'bg-slate-900/95 border-indigo-500/50 text-white shadow-indigo-950/50'
            : 'bg-white/95 border-indigo-200 text-slate-900 shadow-indigo-500/15'
        }`}
      >
        {/* Top Glowing Pulse Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500 animate-pulse" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-pulse shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md">
                  Dose Reminder
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Just now</span>
              </div>
              <h4 className="text-base font-bold mt-0.5 flex items-center gap-1.5">
                <span>{reminder.medicineName}</span>
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">({reminder.dosage})</span>
              </h4>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Family Member:</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">{reminder.familyMemberName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Scheduled Time:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {reminder.time} ({reminder.schedule})
            </span>
          </div>
          {reminder.notes && (
            <div className="pt-1 text-[11px] text-slate-500 italic">
              Note: {reminder.notes}
            </div>
          )}
        </div>

        {/* Interactive Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => {
              onTake(reminder.id);
              setVisible(false);
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Mark as Taken</span>
          </button>

          <button
            onClick={() => {
              onSnooze(reminder.id);
              setVisible(false);
            }}
            className="py-2 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
            <span>Snooze (10m)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
