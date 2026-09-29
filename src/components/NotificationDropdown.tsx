import React, { useState } from 'react';
import {
  Bell,
  Clock,
  AlertTriangle,
  CheckCircle2,
  X,
  Volume2,
  Pill,
  ShieldAlert,
  Calendar,
  Check,
  RotateCcw,
} from 'lucide-react';
import { Reminder, ExpiryAlertNotification, FakeMedicineAlert } from '../types';
import { SupportedLanguage } from '../i18n/translations';

export interface NotificationItem {
  id: string;
  type: 'reminder' | 'expiry' | 'fake_alert';
  title: string;
  subtitle: string;
  time: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  data?: any;
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  reminders: Reminder[];
  expiryNotifications: ExpiryAlertNotification[];
  fakeAlerts: FakeMedicineAlert[];
  onTriggerTestReminder: () => void;
  onUpdateReminderStatus: (id: string, status: any) => void;
  onEnableBrowserNotifications?: () => void;
  hasBrowserPermission?: boolean;
  isDark: boolean;
  currentLang: SupportedLanguage;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  reminders = [],
  expiryNotifications = [],
  fakeAlerts = [],
  onTriggerTestReminder,
  onUpdateReminderStatus,
  onEnableBrowserNotifications,
  hasBrowserPermission = false,
  isDark,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'reminders' | 'expiry'>('all');

  if (!isOpen) return null;

  // Build combined notification feed
  const pendingReminders = reminders.filter((r) => r.status === 'Pending' || r.status === 'Snoozed');
  const missedReminders = reminders.filter((r) => r.status === 'Missed');

  const reminderNotifs: NotificationItem[] = [
    ...missedReminders.map((r) => ({
      id: `rem-missed-${r.id}`,
      type: 'reminder' as const,
      title: `Missed Dose: ${r.medicineName}`,
      subtitle: `${r.familyMemberName} • ${r.dosage} scheduled for ${r.time} (${r.schedule})`,
      time: 'Attention Required',
      isRead: false,
      priority: 'high' as const,
      data: r,
    })),
    ...pendingReminders.map((r) => ({
      id: `rem-pending-${r.id}`,
      type: 'reminder' as const,
      title: `Upcoming Dose: ${r.medicineName}`,
      subtitle: `${r.familyMemberName} • ${r.dosage} at ${r.time}`,
      time: r.status === 'Snoozed' ? 'Snoozed' : r.time,
      isRead: false,
      priority: 'medium' as const,
      data: r,
    })),
  ];

  const expiryNotifs: NotificationItem[] = expiryNotifications.map((ex) => ({
    id: ex.id,
    type: 'expiry' as const,
    title: ex.daysRemaining < 0 ? `Expired: ${ex.medicineName}` : `Expiring Soon: ${ex.medicineName}`,
    subtitle: `Member: ${ex.familyMemberName} • Expiry: ${ex.expiryDate}`,
    time: ex.daysRemaining < 0 ? `${Math.abs(ex.daysRemaining)}d ago` : `${ex.daysRemaining} days left`,
    isRead: ex.isRead,
    priority: ex.daysRemaining <= 7 ? ('high' as const) : ('medium' as const),
    data: ex,
  }));

  const allNotifs: NotificationItem[] = [
    ...reminderNotifs,
    ...expiryNotifs,
  ];

  const filteredNotifs =
    activeTab === 'all'
      ? allNotifs
      : activeTab === 'reminders'
      ? reminderNotifs
      : expiryNotifs;

  return (
    <div
      className={`absolute right-0 mt-2 w-80 sm:w-[420px] rounded-3xl border shadow-2xl z-50 overflow-hidden transition-all animate-fade-in ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-black/80' : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/60'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-600/10 via-blue-600/10 to-transparent flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Notifications & Reminders</h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {allNotifs.length} active alerts
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Test reminder trigger button for instant verification */}
          <button
            onClick={onTriggerTestReminder}
            className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold border border-indigo-200 dark:border-indigo-800 flex items-center gap-1 cursor-pointer transition-colors"
            title="Test an immediate audio & popup reminder notification"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Test Ring</span>
          </button>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All ({allNotifs.length})
        </button>
        <button
          onClick={() => setActiveTab('reminders')}
          className={`px-3 py-1 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'reminders'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Dosage Reminders ({reminderNotifs.length})
        </button>
        <button
          onClick={() => setActiveTab('expiry')}
          className={`px-3 py-1 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'expiry'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Expiry Alerts ({expiryNotifs.length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto p-3 space-y-2">
        {filteredNotifs.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-1.5 text-emerald-500 opacity-60" />
            <p className="text-xs font-semibold">All caught up!</p>
            <p className="text-[11px] text-slate-500">No active alerts for this category.</p>
          </div>
        ) : (
          filteredNotifs.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-2xl border transition-all text-xs space-y-1.5 ${
                item.priority === 'high'
                  ? isDark
                    ? 'bg-rose-950/20 border-rose-900/40 text-slate-200'
                    : 'bg-rose-50/70 border-rose-200 text-slate-900'
                  : isDark
                  ? 'bg-slate-800/60 border-slate-700/60 text-slate-200'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {item.type === 'reminder' ? (
                    <Clock
                      className={`w-4 h-4 ${
                        item.priority === 'high' ? 'text-rose-500' : 'text-indigo-500'
                      }`}
                    />
                  ) : (
                    <AlertTriangle
                      className={`w-4 h-4 ${
                        item.priority === 'high' ? 'text-red-500' : 'text-amber-500'
                      }`}
                    />
                  )}
                  <span className="font-bold text-xs">{item.title}</span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    item.priority === 'high'
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                      : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400'
                  }`}
                >
                  {item.time}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-6">
                {item.subtitle}
              </p>

              {/* Action buttons if it is a reminder */}
              {item.type === 'reminder' && item.data && (
                <div className="pt-1.5 pl-6 flex items-center gap-2">
                  <button
                    onClick={() => onUpdateReminderStatus(item.data.id, 'Taken')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
                  >
                    <Check className="w-3 h-3" />
                    <span>Take Now</span>
                  </button>

                  <button
                    onClick={() => onUpdateReminderStatus(item.data.id, 'Snoozed')}
                    className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3 text-amber-500" />
                    <span>Snooze</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Browser Notification Banner or Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between text-xs">
        {onEnableBrowserNotifications && !hasBrowserPermission ? (
          <button
            onClick={onEnableBrowserNotifications}
            className="w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Enable Push Desktop Notifications</span>
          </button>
        ) : (
          <div className="w-full flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Chime & Toast Alerts Active</span>
            </span>
            <button
              onClick={onClose}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
