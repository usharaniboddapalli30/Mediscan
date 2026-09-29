import React, { useState, useEffect, useRef } from 'react';
import { QrCode } from 'lucide-react';
import {
  MedicineItem,
  ScanHistoryRecord,
  Reminder,
  FamilyMember,
  FakeMedicineAlert,
  SafetyAlert,
  NavigationTab,
  ReminderStatus,
} from './types';
import { SupportedLanguage, translations } from './i18n/translations';
import {
  initialMedicines,
  initialScanHistory,
  initialReminders,
  initialFamilyMembers,
  initialFakeAlerts,
  initialSafetyAlerts,
} from './data/initialData';
import {
  playReminderChime,
  requestNotificationPermission,
  sendBrowserNotification,
} from './utils/notificationService';

import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { AuthScreen } from './components/AuthScreen';
import { ScannerModal } from './components/ScannerModal';
import { MedicineDetailsModal } from './components/MedicineDetailsModal';
import { MedicineCabinetModal } from './components/MedicineCabinetModal';
import { FamilyManagementModal } from './components/FamilyManagementModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { ReminderAlertToast } from './components/ReminderAlertToast';

import { DashboardView } from './views/DashboardView';
import { ScanHistoryView } from './views/ScanHistoryView';
import { RemindersView } from './views/RemindersView';
import { FakeAlertsView } from './views/FakeAlertsView';
import { AccountView } from './views/AccountView';

export default function App() {
  // 1. Authentication State
  const [user, setUser] = useState<{ name: string; email: string; phone: string } | null>(() => {
    const saved = localStorage.getItem('mediscan_user');
    return saved ? JSON.parse(saved) : { name: 'Alex Miller', email: 'alex.miller@mediscan.health', phone: '+1 (555) 019-2834' };
  });

  // 2. Navigation & Theme State
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 3. Application Domain Data States
  const [medicines, setMedicines] = useState<MedicineItem[]>(() => {
    try {
      const saved = localStorage.getItem('mediscan_medicines');
      if (saved && saved !== 'undefined') {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return initialMedicines;
  });

  const [scanHistory, setScanHistory] = useState<ScanHistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem('mediscan_history');
      if (saved && saved !== 'undefined') {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return initialScanHistory;
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    try {
      const saved = localStorage.getItem('mediscan_reminders');
      if (saved && saved !== 'undefined') {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return initialReminders;
  });

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    try {
      const saved = localStorage.getItem('mediscan_family');
      if (saved && saved !== 'undefined') {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return initialFamilyMembers;
  });

  const [fakeAlerts, setFakeAlerts] = useState<FakeMedicineAlert[]>(initialFakeAlerts);
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>(initialSafetyAlerts);

  // Active Reminder Notification Alert Toast State
  const [activeAlertReminder, setActiveAlertReminder] = useState<{
    reminder: Reminder;
    timestamp: string;
  } | null>(null);

  const [hasBrowserNotificationPermission, setHasBrowserNotificationPermission] = useState<boolean>(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  });

  // Compute active expiry notifications dynamically
  const expiryNotifications = (medicines || [])
    .filter((m) => m.category === 'Expiring Soon' || m.category === 'Expired')
    .map((m) => {
      const expDate = new Date(m.expiryDate);
      const today = new Date();
      const diffTime = expDate.getTime() - today.getTime();
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const member = (familyMembers || []).find((f) => f.id === m.familyMemberId);
      return {
        id: 'ex-' + m.id,
        medicineId: m.id,
        medicineName: m.name,
        familyMemberName: member?.name || 'Self',
        expiryDate: m.expiryDate,
        daysRemaining,
        alertType: (daysRemaining < 0 ? 'expired' : '30_days') as 'expired' | '30_days',
        isRead: false,
        createdAt: new Date().toISOString(),
      };
    });

  // 4. Modal Visibility & Selection States
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isCabinetOpen, setIsCabinetOpen] = useState(false);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState<string | undefined>(undefined);

  const [selectedMedicine, setSelectedMedicine] = useState<MedicineItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('mediscan_medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('mediscan_history', JSON.stringify(scanHistory));
  }, [scanHistory]);

  useEffect(() => {
    localStorage.setItem('mediscan_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('mediscan_family', JSON.stringify(familyMembers));
  }, [familyMembers]);

  // Request browser notification permission helper
  const handleEnableBrowserNotifications = async () => {
    const granted = await requestNotificationPermission();
    setHasBrowserNotificationPermission(granted);
    if (granted) {
      sendBrowserNotification('MediScan Notifications Enabled', {
        body: 'You will receive reminders when medication dosages are due.',
      });
    }
  };

  // Trigger test or live reminder notification
  const triggerReminderNotification = (targetReminder?: Reminder) => {
    const rem = targetReminder || reminders.find((r) => r.status === 'Pending') || reminders[0];
    if (!rem) return;

    // 1. Play pleasant audio chime
    playReminderChime();

    // 2. Trigger browser notification if permitted
    sendBrowserNotification(`Medication Due: ${rem.medicineName} (${rem.dosage})`, {
      body: `Dosage for ${rem.familyMemberName} scheduled for ${rem.time}. Click to mark as taken.`,
    });

    // 3. Trigger In-App visual Alert Toast Banner
    setActiveAlertReminder({
      reminder: rem,
      timestamp: new Date().toISOString(),
    });
  };

  // Initial welcome reminder chime after 3 seconds for demonstration
  const hasTriggeredInitialReminder = useRef(false);
  useEffect(() => {
    if (!hasTriggeredInitialReminder.current && reminders.length > 0) {
      hasTriggeredInitialReminder.current = true;
      const timer = setTimeout(() => {
        const firstPending = reminders.find((r) => r.status === 'Pending');
        if (firstPending) {
          triggerReminderNotification(firstPending);
        }
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [reminders]);

  // Auth Handlers
  const handleLoginSuccess = (userData: { name: string; email: string; phone: string }) => {
    setUser(userData);
    localStorage.setItem('mediscan_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('mediscan_user');
  };

  // Scanner Scan Success Handler
  const handleScanSuccess = (med: MedicineItem) => {
    // 1. Add to Medicines list if not present
    setMedicines((prev) => {
      const exists = prev.some((m) => m.id === med.id);
      return exists ? prev : [med, ...prev];
    });

    // 2. Add automatic Scan History record
    const newRecord: ScanHistoryRecord = {
      id: 'sh-' + Date.now(),
      medicineId: med.id,
      medicineName: med.name,
      genericName: med.genericName,
      batchNumber: med.batchNumber,
      expiryDate: med.expiryDate,
      barcode: med.barcode,
      scannedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      scannedByName: user?.name || 'Alex Miller',
      familyMemberId: med.familyMemberId,
      familyMemberName: familyMembers.find((f) => f.id === med.familyMemberId)?.name || 'Self',
      verificationStatus: med.verificationStatus,
    };
    setScanHistory((prev) => [newRecord, ...prev]);

    // 3. If suspicious, add to Fake Alerts
    if (med.verificationStatus === 'Suspicious' || med.verificationStatus === 'Unverified') {
      const newFakeAlert: FakeMedicineAlert = {
        id: 'fa-' + Date.now(),
        medicineName: med.name,
        batchNumber: med.batchNumber,
        manufacturer: med.manufacturer,
        scannedAt: newRecord.scannedAt,
        familyMemberName: newRecord.familyMemberName,
        reason: med.suspiciousReason || 'QR code mismatch in GS1 pharmaceutical tracking database.',
        verificationStatus: med.verificationStatus,
        location: 'Scanned via Mobile Camera',
        actionRecommended: 'Quarantine medicine package immediately. Do not administer.',
      };
      setFakeAlerts((prev) => [newFakeAlert, ...prev]);
    }

    // 4. Open Medicine Details Modal
    setSelectedMedicine(med);
    setIsDetailsModalOpen(true);
  };

  // Reminder Status Update Handler
  const handleUpdateReminderStatus = (id: string, status: ReminderStatus) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  // Add Reminder Handler
  const handleAddReminder = (newRem: Omit<Reminder, 'id'>) => {
    const created: Reminder = {
      ...newRem,
      id: 'rem-' + Date.now(),
    };
    setReminders((prev) => [created, ...prev]);

    // Trigger confirmation chime
    playReminderChime();
  };

  // Family Member Management
  const handleAddFamilyMember = (newMem: Omit<FamilyMember, 'id'>) => {
    const created: FamilyMember = {
      ...newMem,
      id: 'fm-' + Date.now(),
    };
    setFamilyMembers((prev) => [...prev, created]);
  };

  const handleDeleteFamilyMember = (id: string) => {
    setFamilyMembers((prev) => prev.filter((fm) => fm.id !== id));
  };

  // Open Details Modal for any medicine
  const handleSelectMedicine = (med: MedicineItem) => {
    setSelectedMedicine(med);
    setIsDetailsModalOpen(true);
  };

  // Render Login page if unauthenticated
  if (!user) {
    return (
      <AuthScreen
        onLoginSuccess={handleLoginSuccess}
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
      />
    );
  }

  return (
    <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-200 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Sidebar Navigation (Exact 5 items) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentLang={currentLang}
        isDark={isDark}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar
          currentLang={currentLang}
          onSelectLang={setCurrentLang}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
          user={user}
          onLogout={handleLogout}
          onOpenScanner={() => setIsScannerOpen(true)}
          onOpenCabinet={() => setIsCabinetOpen(true)}
          safetyAlertsCount={safetyAlerts.length}
          expiryNotifications={expiryNotifications}
          reminders={reminders}
          fakeAlerts={fakeAlerts}
          onTriggerTestReminder={triggerReminderNotification}
          onUpdateReminderStatus={handleUpdateReminderStatus}
          onEnableBrowserNotifications={handleEnableBrowserNotifications}
          hasBrowserPermission={hasBrowserNotificationPermission}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Live Reminder Alert Toast */}
        <ReminderAlertToast
          activeAlert={activeAlertReminder}
          onTake={(id) => handleUpdateReminderStatus(id, 'Taken')}
          onSnooze={(id) => handleUpdateReminderStatus(id, 'Snoozed')}
          onDismiss={() => setActiveAlertReminder(null)}
          isDark={isDark}
          currentLang={currentLang}
        />

        {/* View Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              onNavigateTab={setCurrentTab}
              onOpenScanner={() => setIsScannerOpen(true)}
              onOpenCabinet={() => setIsCabinetOpen(true)}
              onOpenFamilyModal={() => setIsFamilyModalOpen(true)}
              onOpenAiModal={(q) => {
                setAiQuery(q);
                setIsAiModalOpen(true);
              }}
              onSelectMedicine={handleSelectMedicine}
              medicines={medicines}
              scanHistory={scanHistory}
              reminders={reminders}
              familyMembers={familyMembers}
              safetyAlerts={safetyAlerts}
              isDark={isDark}
              currentLang={currentLang}
            />
          )}

          {currentTab === 'history' && (
            <ScanHistoryView
              scanHistory={scanHistory}
              familyMembers={familyMembers}
              onSelectRecord={(rec) => {
                const med = medicines.find((m) => m.id === rec.medicineId);
                if (med) handleSelectMedicine(med);
              }}
              onOpenScanner={() => setIsScannerOpen(true)}
              isDark={isDark}
              currentLang={currentLang}
            />
          )}

          {currentTab === 'reminders' && (
            <RemindersView
              reminders={reminders}
              medicines={medicines}
              familyMembers={familyMembers}
              onUpdateStatus={handleUpdateReminderStatus}
              onAddReminder={handleAddReminder}
              onOpenScanner={() => setIsScannerOpen(true)}
              onTriggerTestReminder={triggerReminderNotification}
              onEnableBrowserNotifications={handleEnableBrowserNotifications}
              hasBrowserPermission={hasBrowserNotificationPermission}
              isDark={isDark}
              currentLang={currentLang}
            />
          )}

          {currentTab === 'fake-alerts' && (
            <FakeAlertsView
              fakeAlerts={fakeAlerts}
              onOpenScanner={() => setIsScannerOpen(true)}
              isDark={isDark}
              currentLang={currentLang}
            />
          )}

          {currentTab === 'account' && (
            <AccountView
              user={user}
              currentLang={currentLang}
              onSelectLang={setCurrentLang}
              isDark={isDark}
              onToggleTheme={() => setIsDark(!isDark)}
              familyMembers={familyMembers}
              onOpenFamilyModal={() => setIsFamilyModalOpen(true)}
              onLogout={handleLogout}
            />
          )}
        </main>

        {/* Global Floating Action Button for Quick Scanning anywhere */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsScannerOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-xl shadow-blue-600/30 border border-blue-400/30 transition-all cursor-pointer group"
            title="Quick Scan Medicine Barcode / QR"
          >
            <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
              <QrCode className="w-4 h-4 text-white" />
            </div>
            <span className="tracking-wide">Scan Medicine</span>
          </button>
        </div>
      </div>

      {/* GLOBAL MODALS */}
      {/* 1. Scanner Modal */}
      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        familyMembers={familyMembers}
        onScanSuccess={handleScanSuccess}
        onScanComplete={handleScanSuccess}
        isDark={isDark}
        currentLang={currentLang}
      />

      {/* 2. Medicine Details Modal */}
      <MedicineDetailsModal
        medicine={selectedMedicine}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onSetReminder={(med) => {
          handleAddReminder({
            medicineId: med.id,
            medicineName: med.name,
            familyMemberId: med.familyMemberId,
            familyMemberName: familyMembers.find((f) => f.id === med.familyMemberId)?.name || 'Self',
            time: '08:00 AM',
            frequency: 'Once Daily',
            schedule: 'Morning',
            dosage: '1 Tablet after meals',
            status: 'Pending',
          });
          setCurrentTab('reminders');
        }}
        onAskAi={(medName) => {
          setIsDetailsModalOpen(false);
          setAiQuery(medName);
          setIsAiModalOpen(true);
        }}
        familyMembers={familyMembers}
        isDark={isDark}
        currentLang={currentLang}
      />

      {/* 3. Digital Medicine Cabinet Modal */}
      <MedicineCabinetModal
        isOpen={isCabinetOpen}
        onClose={() => setIsCabinetOpen(false)}
        onOpenScanner={() => setIsScannerOpen(true)}
        medicines={medicines}
        familyMembers={familyMembers}
        onSelectMedicine={(med) => {
          setIsCabinetOpen(false);
          handleSelectMedicine(med);
        }}
        isDark={isDark}
        currentLang={currentLang}
      />

      {/* 4. Family Management Modal */}
      <FamilyManagementModal
        isOpen={isFamilyModalOpen}
        onClose={() => setIsFamilyModalOpen(false)}
        familyMembers={familyMembers}
        onAddFamilyMember={handleAddFamilyMember}
        onDeleteFamilyMember={handleDeleteFamilyMember}
        medicines={medicines}
        reminders={reminders}
        isDark={isDark}
        currentLang={currentLang}
      />

      {/* 5. AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => {
          setIsAiModalOpen(false);
          setAiQuery(undefined);
        }}
        initialQuery={aiQuery}
        isDark={isDark}
        currentLang={currentLang}
      />
    </div>
  );
}

