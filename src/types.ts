export type VerificationStatus = 'Verified' | 'Unverified' | 'Suspicious';

export type MedicineCategory = 'Active' | 'Expiring Soon' | 'Expired' | 'Completed';

export type ReminderStatus = 'Taken' | 'Pending' | 'Missed' | 'Snoozed';

export type NavigationTab = 'dashboard' | 'history' | 'reminders' | 'fake-alerts' | 'account';

export interface TraceabilityStep {
  stage: 'Manufacturer' | 'Distributor' | 'Warehouse' | 'Pharmacy' | 'Patient';
  facility: string;
  location: string;
  timestamp: string;
  status: 'Passed Quality' | 'Dispatched' | 'Received' | 'Dispensed' | 'Verified';
  tempLog?: string;
  batchHash?: string;
}

export interface RecallNotice {
  isRecalled: boolean;
  severity: 'High' | 'Medium' | 'Low';
  reason: string;
  noticeDate: string;
  actionRequired: string;
}

export interface MedicineItem {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  batchNumber: string;
  mfgDate: string;
  expiryDate: string; // ISO format or YYYY-MM-DD
  composition: string;
  uses: string;
  precautions: string;
  storageInstructions: string;
  mrp: string;
  verificationStatus: VerificationStatus;
  suspiciousReason?: string;
  familyMemberId: string;
  category: MedicineCategory;
  dosage: string;
  barcode: string;
  scannedAt: string;
  traceability: TraceabilityStep[];
  recallNotice?: RecallNotice;
}

export interface ScanHistoryRecord {
  id: string;
  medicineId: string;
  medicineName: string;
  genericName: string;
  scannedAt: string;
  batchNumber: string;
  expiryDate: string;
  verificationStatus: VerificationStatus;
  familyMemberId: string;
  familyMemberName: string;
  scannedByName: string;
  barcode: string;
  suspiciousReason?: string;
}

export interface Reminder {
  id: string;
  medicineId: string;
  medicineName: string;
  familyMemberId: string;
  familyMemberName: string;
  time: string; // e.g., "08:00 AM"
  frequency: string; // e.g. "Once Daily"
  schedule: 'Morning' | 'Afternoon' | 'Night';
  dosage: string;
  status: ReminderStatus;
  notes?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: 'Self' | 'Mother' | 'Father' | 'Grandmother' | 'Grandfather' | 'Sibling' | 'Child' | string;
  age: number;
  avatarColor: string;
  allergies: string[];
  conditions: string[];
  isPrimary?: boolean;
}

export interface SafetyAlert {
  id: string;
  title: string;
  batchNumber: string;
  medicineName: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  date: string;
  affectedMembers: string[];
}

export interface FakeMedicineAlert {
  id: string;
  medicineName: string;
  batchNumber: string;
  manufacturer: string;
  reason: string;
  scannedAt: string;
  familyMemberName: string;
  location: string;
  actionRecommended: string;
  verificationStatus: 'Suspicious' | 'Unverified';
}

export interface ExpiryAlertNotification {
  id: string;
  medicineId: string;
  medicineName: string;
  familyMemberName: string;
  expiryDate: string;
  daysRemaining: number;
  alertType: '30_days' | '15_days' | '7_days' | 'expired';
  isRead: boolean;
  createdAt: string;
}
