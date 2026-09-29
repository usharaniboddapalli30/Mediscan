import React, { useState } from 'react';
import {
  X,
  Users,
  Plus,
  ShieldCheck,
  Heart,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lock,
  UserCheck,
  Pencil,
  Trash2,
  Activity,
  Eye,
  EyeOff,
} from 'lucide-react';
import { FamilyMember, MedicineItem, Reminder } from '../types';
import { SupportedLanguage, translations } from '../i18n/translations';

interface FamilyManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyMembers: FamilyMember[];
  onAddFamilyMember: (member: Omit<FamilyMember, 'id'>) => void;
  onDeleteFamilyMember: (id: string) => void;
  medicines: MedicineItem[];
  reminders: Reminder[];
  isDark: boolean;
  currentLang: SupportedLanguage;
}

export const FamilyManagementModal: React.FC<FamilyManagementModalProps> = ({
  isOpen,
  onClose,
  familyMembers,
  onAddFamilyMember,
  onDeleteFamilyMember,
  medicines,
  reminders,
  isDark,
  currentLang,
}) => {
  const t = translations[currentLang];

  const [activeTab, setActiveTab] = useState<'dashboard' | 'members' | 'add'>('dashboard');
  const [privacyEnabled, setPrivacyEnabled] = useState(true);

  // New Member Form State
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState<'Mother' | 'Father' | 'Grandmother' | 'Grandfather' | 'Sibling' | 'Child' | 'Spouse'>('Mother');
  const [newAge, setNewAge] = useState<number>(55);
  const [newAllergies, setNewAllergies] = useState('');
  const [newConditions, setNewConditions] = useState('');

  if (!isOpen) return null;

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const colors = ['bg-blue-600', 'bg-emerald-600', 'bg-indigo-600', 'bg-purple-600', 'bg-rose-600', 'bg-amber-600'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    onAddFamilyMember({
      name: newName,
      relation: newRelation,
      age: Number(newAge),
      avatarColor: randomColor,
      allergies: newAllergies ? newAllergies.split(',').map((s) => s.trim()) : [],
      conditions: newConditions ? newConditions.split(',').map((s) => s.trim()) : [],
    });

    setNewName('');
    setActiveTab('dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-4xl max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-all ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header Banner */}
        <div className="p-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-md">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {t.familyManagement}
              </h2>
              <p className="text-xs text-blue-100">
                Authorized primary account family medicine hub
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              📊 {t.familyReminderDashboardTitle}
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'members'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              👥 Member Profiles ({familyMembers.length})
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 cursor-pointer ${
                activeTab === 'add'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Member</span>
            </button>
          </div>

          {/* Privacy Toggle */}
          <button
            onClick={() => setPrivacyEnabled(!privacyEnabled)}
            className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            {privacyEnabled ? <Lock className="w-3.5 h-3.5 text-emerald-500" /> : <Eye className="w-3.5 h-3.5" />}
            <span>Privacy Mode: {privacyEnabled ? 'Authorized Only' : 'Shared View'}</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {/* 1. FAMILY REMINDER DASHBOARD REQUIREMENT #8 */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {t.familyReminderDashboardTitle}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.familyReminderDashboardSubtitle}
                </p>
              </div>

              {/* Family Members Matrix Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {familyMembers.map((member) => {
                  const memberReminders = reminders.filter(
                    (r) => r.familyMemberId === member.id
                  );
                  const takenCount = memberReminders.filter((r) => r.status === 'Taken').length;
                  const pendingCount = memberReminders.filter((r) => r.status === 'Pending').length;
                  const missedCount = memberReminders.filter((r) => r.status === 'Missed').length;

                  const memberMeds = medicines.filter(
                    (m) => m.familyMemberId === member.id
                  );
                  const expiringCount = memberMeds.filter(
                    (m) => m.category === 'Expiring Soon'
                  ).length;

                  return (
                    <div
                      key={member.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isDark ? 'bg-slate-800/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full ${member.avatarColor} text-white font-bold text-sm flex items-center justify-center shadow-md`}
                          >
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                              {member.name}
                            </h4>
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                              {member.relation} ({member.age} yrs)
                            </span>
                          </div>
                        </div>

                        {member.isPrimary && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                            Authorized Account
                          </span>
                        )}
                      </div>

                      {/* Reminder Stats Matrix */}
                      <div className="grid grid-cols-4 gap-2 text-center my-3">
                        <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40">
                          <span className="text-xs text-emerald-700 dark:text-emerald-400 block font-medium">
                            Taken
                          </span>
                          <span className="text-base font-bold text-emerald-800 dark:text-emerald-300">
                            {takenCount}
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40">
                          <span className="text-xs text-blue-700 dark:text-blue-400 block font-medium">
                            Pending
                          </span>
                          <span className="text-base font-bold text-blue-800 dark:text-blue-300">
                            {pendingCount}
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40">
                          <span className="text-xs text-rose-700 dark:text-rose-400 block font-medium">
                            Missed
                          </span>
                          <span className="text-base font-bold text-rose-800 dark:text-rose-300">
                            {missedCount}
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40">
                          <span className="text-xs text-amber-700 dark:text-amber-400 block font-medium">
                            Expiring
                          </span>
                          <span className="text-base font-bold text-amber-800 dark:text-amber-300">
                            {expiringCount}
                          </span>
                        </div>
                      </div>

                      {/* Health Profile Tags */}
                      <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                        <div>
                          <strong className="text-slate-700 dark:text-slate-300">Conditions: </strong>
                          {member.conditions.length > 0 ? member.conditions.join(', ') : 'None logged'}
                        </div>
                        <div>
                          <strong className="text-slate-700 dark:text-slate-300">Allergies: </strong>
                          {member.allergies.length > 0 ? member.allergies.join(', ') : 'No known drug allergies'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. MEMBER PROFILES LIST */}
          {activeTab === 'members' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm">Managed Family Profiles</h3>
                <button
                  onClick={() => setActiveTab('add')}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Member</span>
                </button>
              </div>

              <div className="space-y-3">
                {familyMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`p-4 rounded-xl border flex items-center justify-between ${
                      isDark ? 'bg-slate-800/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full ${member.avatarColor} text-white font-bold text-sm flex items-center justify-center shadow-sm`}
                      >
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{member.name}</h4>
                        <p className="text-xs text-slate-500">
                          Relation: {member.relation} • Age: {member.age}
                        </p>
                      </div>
                    </div>

                    {!member.isPrimary && (
                      <button
                        onClick={() => onDeleteFamilyMember(member.id)}
                        className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
                        title="Remove Profile"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. ADD NEW MEMBER FORM */}
          {activeTab === 'add' && (
            <form onSubmit={handleCreateMember} className="max-w-lg mx-auto space-y-4">
              <h3 className="font-bold text-base text-center">Add Family Member Profile</h3>

              <div>
                <label className="block text-xs font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Mary Miller"
                  className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Relation</label>
                  <select
                    value={newRelation}
                    onChange={(e: any) => setNewRelation(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs sm:text-sm border outline-none ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Grandmother">Grandmother</option>
                    <option value="Grandfather">Grandfather</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Child">Child</option>
                    <option value="Spouse">Spouse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Age</label>
                  <input
                    type="number"
                    value={newAge}
                    onChange={(e) => setNewAge(Number(e.target.value))}
                    className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border outline-none ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                    }`}
                    min={1}
                    max={120}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Known Allergies (comma separated)</label>
                <input
                  type="text"
                  value={newAllergies}
                  onChange={(e) => setNewAllergies(e.target.value)}
                  placeholder="e.g. Penicillin, Sulfa drugs"
                  className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Existing Conditions (comma separated)</label>
                <input
                  type="text"
                  value={newConditions}
                  onChange={(e) => setNewConditions(e.target.value)}
                  placeholder="e.g. Hypertension, Type-2 Diabetes"
                  className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs cursor-pointer shadow-md"
                >
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="px-4 py-2.5 border border-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
