import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  QrCode,
  LogOut,
  Globe,
  AlertTriangle,
  CheckCircle,
  UserCheck,
  ChevronDown,
} from 'lucide-react';
import { SupportedLanguage, translations } from '../i18n/translations';
import { ExpiryAlertNotification, Reminder, FakeMedicineAlert } from '../types';
import { NotificationDropdown } from './NotificationDropdown';

interface NavbarProps {
  currentLang: SupportedLanguage;
  onSelectLang: (lang: SupportedLanguage) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  user: { name: string; email: string; phone: string } | null;
  onLogout: () => void;
  onOpenScanner: () => void;
  onOpenCabinet?: () => void;
  safetyAlertsCount?: number;
  expiryNotifications?: ExpiryAlertNotification[];
  reminders?: Reminder[];
  fakeAlerts?: FakeMedicineAlert[];
  onTriggerTestReminder?: () => void;
  onUpdateReminderStatus?: (id: string, status: any) => void;
  onEnableBrowserNotifications?: () => void;
  hasBrowserPermission?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onSelectLang,
  isDark,
  onToggleTheme,
  user,
  onLogout,
  onOpenScanner,
  onOpenCabinet,
  safetyAlertsCount = 0,
  expiryNotifications = [],
  reminders = [],
  fakeAlerts = [],
  onTriggerTestReminder = () => {},
  onUpdateReminderStatus = () => {},
  onEnableBrowserNotifications,
  hasBrowserPermission = false,
  searchQuery = '',
  onSearchChange = (_query: string) => {},
}) => {
  const t = translations[currentLang];
  const [showNotifications, setShowNotifications] = useState(false);
  const safeNotifications = expiryNotifications || [];
  const safeReminders = reminders || [];

  // Calculate total pending/missed reminders and expiry notifications
  const pendingRemindersCount = safeReminders.filter(
    (r) => r && (r.status === 'Pending' || r.status === 'Missed' || r.status === 'Snoozed')
  ).length;
  const unreadExpiryCount = safeNotifications.filter((n) => !n.isRead).length;
  const totalAlertsCount = pendingRemindersCount + unreadExpiryCount;

  return (
    <header
      className={`h-16 px-6 border-b flex items-center justify-between sticky top-0 z-30 transition-colors duration-200 ${
        isDark ? 'bg-slate-900/95 border-slate-800 text-slate-100 backdrop-blur-md' : 'bg-white/95 border-slate-200 text-slate-800 backdrop-blur-md'
      }`}
    >
      {/* Global Search Bar */}
      <div className="flex-1 max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.searchPlaceholder}
          className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border transition-all outline-none ${
            isDark
              ? 'bg-slate-800/80 border-slate-700 text-slate-100 focus:border-blue-500 focus:bg-slate-800'
              : 'bg-slate-100/80 border-slate-200 text-slate-900 focus:border-blue-600 focus:bg-white'
          }`}
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 ml-4">
        {/* Quick Scan Action Button - Accessible on all screens */}
        <button
          onClick={onOpenScanner}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all active:scale-95 cursor-pointer shrink-0"
          title="Open Medicine Scanner"
        >
          <QrCode className="w-4 h-4" />
          <span className="hidden xs:inline sm:inline">{t.scanMedicine}</span>
        </button>

        {/* Notifications & Dose Reminder Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-xl border transition-colors relative cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
            title="Dosage Reminders & Alerts"
          >
            <Bell className="w-4 h-4" />
            {totalAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-extrabold flex items-center justify-center animate-bounce shadow-sm">
                {totalAlertsCount}
              </span>
            )}
          </button>

          {/* Unified Notification & Reminder Dropdown */}
          <NotificationDropdown
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            reminders={safeReminders}
            expiryNotifications={safeNotifications}
            fakeAlerts={fakeAlerts}
            onTriggerTestReminder={onTriggerTestReminder}
            onUpdateReminderStatus={onUpdateReminderStatus}
            onEnableBrowserNotifications={onEnableBrowserNotifications}
            hasBrowserPermission={hasBrowserPermission}
            isDark={isDark}
            currentLang={currentLang}
          />
        </div>

        {/* Language Selector Dropdown */}
        <div className="flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={currentLang}
            onChange={(e) => onSelectLang(e.target.value as SupportedLanguage)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-200 focus:border-blue-500'
                : 'bg-slate-100 border-slate-200 text-slate-800 focus:border-blue-600'
            }`}
          >
            <option value="en">🌐 EN</option>
            <option value="te">🌐 తెలుగు</option>
            <option value="hi">🌐 हिन्दी</option>
          </select>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
            isDark
              ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
              : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
          }`}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Account Profile Chip */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold leading-tight truncate max-w-[120px]">
              {user?.name || 'Alex Miller'}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Authorized Account
            </p>
          </div>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
            title={t.logout}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
