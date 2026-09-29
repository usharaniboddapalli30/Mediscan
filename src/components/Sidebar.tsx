import React from 'react';
import {
  LayoutDashboard,
  History,
  Clock,
  ShieldAlert,
  User,
  Activity,
  QrCode,
} from 'lucide-react';
import { NavigationTab } from '../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenScanner: () => void;
  isDark: boolean;
  fakeAlertsCount: number;
  pendingRemindersCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenScanner,
  isDark,
  fakeAlertsCount,
  pendingRemindersCount,
}) => {
  // STRICT REQUIREMENT: Only these 5 navigation items in sidebar!
  const navItems = [
    {
      id: 'dashboard' as NavigationTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'history' as NavigationTab,
      label: 'Scan History',
      icon: History,
      badge: null,
    },
    {
      id: 'reminders' as NavigationTab,
      label: 'Reminders',
      icon: Clock,
      badge: pendingRemindersCount > 0 ? pendingRemindersCount : null,
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      id: 'fake-alerts' as NavigationTab,
      label: 'Fake Medicine Alerts',
      icon: ShieldAlert,
      badge: fakeAlertsCount > 0 ? fakeAlertsCount : null,
      badgeColor: 'bg-red-600 text-white animate-pulse',
    },
    {
      id: 'account' as NavigationTab,
      label: 'Account',
      icon: User,
      badge: null,
    },
  ];

  return (
    <aside
      className={`w-64 flex-shrink-0 flex flex-col border-r transition-colors duration-200 ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-blue-600 dark:text-blue-400">
              MediScan
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Family Health Vault
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Scan Button */}
      <div className="p-4">
        <button
          onClick={onOpenScanner}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          <QrCode className="w-5 h-5" />
          <span>Scan Medicine</span>
        </button>
      </div>

      {/* STRICT 5 Navigation Items */}
      <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-150 cursor-pointer ${
                isActive
                  ? isDark
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                  : isDark
                  ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && (
                <span
                  className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                    item.badgeColor || 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Security Status Box */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div
          className={`p-3 rounded-xl text-xs space-y-1 ${
            isDark ? 'bg-slate-800/80 text-slate-300' : 'bg-slate-50 text-slate-600'
          }`}
        >
          <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
            <span>Security Status</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Encrypted GS1 Traceability Engine Active
          </p>
        </div>
      </div>
    </aside>
  );
};
