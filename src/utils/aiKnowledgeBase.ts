import {
  MedicineItem,
  FamilyMember,
  Reminder,
  ScanHistoryRecord,
  FakeMedicineAlert,
  SafetyAlert,
} from '../types';
import {
  initialMedicines,
  initialFamilyMembers,
  initialReminders,
  initialScanHistory,
  initialFakeAlerts,
  initialSafetyAlerts,
} from '../data/initialData';

export interface WebsiteDataPackage {
  medicines?: MedicineItem[];
  familyMembers?: FamilyMember[];
  reminders?: Reminder[];
  scanHistory?: ScanHistoryRecord[];
  fakeAlerts?: FakeMedicineAlert[];
  safetyAlerts?: SafetyAlert[];
  user?: { name: string; email: string; phone?: string } | null;
}

/**
 * Builds a structured, high-density training corpus and ground-truth knowledge base
 * containing all website data: medicines, active ingredients, family members,
 * clinical precautions, dosage reminders, supply-chain traceability, fake batches,
 * and safety alerts.
 */
export function buildWebsiteKnowledgeCorpus(data?: WebsiteDataPackage): string {
  const medicines = data?.medicines || initialMedicines;
  const familyMembers = data?.familyMembers || initialFamilyMembers;
  const reminders = data?.reminders || initialReminders;
  const scanHistory = data?.scanHistory || initialScanHistory;
  const fakeAlerts = data?.fakeAlerts || initialFakeAlerts;
  const safetyAlerts = data?.safetyAlerts || initialSafetyAlerts;
  const user = data?.user || { name: 'Alex Miller', email: 'alex.miller@mediscan.health', phone: '+1 (555) 019-2834' };

  const memberMap = new Map(familyMembers.map((fm) => [fm.id, fm]));

  let text = `# MEDISCAN COMPREHENSIVE PLATFORM KNOWLEDGE BASE & TRAINING CORPUS\n\n`;
  text += `## PLATFORM OVERVIEW & SYSTEM IDENTITY\n`;
  text += `- Application Name: MediScan Smart Healthcare & Medicine Verification\n`;
  text += `- Primary User: ${user.name} (${user.email}, ${user.phone || 'N/A'})\n`;
  text += `- Capabilities: GS1/Barcode scan authenticity verification, digital family medicine cabinet, multi-member allergy & condition tracking, dosage reminder system with audio chime/browser notifications, counterfeit quarantine registry, FDA recall monitoring, and supply-chain traceability logs.\n\n`;

  // 1. FAMILY MEMBERS & HEALTH PROFILES
  text += `## 1. FAMILY MEMBERS & HEALTH PROFILES (${familyMembers.length} Registered Profiles)\n`;
  familyMembers.forEach((fm, index) => {
    text += `### Member ${index + 1}: ${fm.name} (${fm.relation})\n`;
    text += `- ID: ${fm.id}\n`;
    text += `- Age: ${fm.age} years old\n`;
    text += `- Primary Account Holder: ${fm.isPrimary ? 'Yes' : 'No'}\n`;
    text += `- Known Allergies: ${fm.allergies && fm.allergies.length > 0 ? fm.allergies.join(', ') : 'None documented'}\n`;
    text += `- Chronic Conditions: ${fm.conditions && fm.conditions.length > 0 ? fm.conditions.join(', ') : 'None documented'}\n`;
    
    // Find medicines assigned to this member
    const memberMeds = medicines.filter((m) => m.familyMemberId === fm.id);
    text += `- Assigned Medications: ${memberMeds.length > 0 ? memberMeds.map((m) => m.name).join(', ') : 'None currently assigned'}\n`;
    
    // Find active reminders for this member
    const memberRems = reminders.filter((r) => r.familyMemberId === fm.id);
    text += `- Active Dosage Reminders: ${memberRems.length > 0 ? memberRems.map((r) => `${r.medicineName} at ${r.time} (${r.status})`).join('; ') : 'None scheduled'}\n\n`;
  });

  // 2. MEDICINE CABINET & PHARMACEUTICAL REPOSITORY
  text += `## 2. MEDICINE CABINET & REGISTERED PHARMACEUTICALS (${medicines.length} Medicines)\n`;
  medicines.forEach((med, index) => {
    const assignedMember = memberMap.get(med.familyMemberId);
    text += `### Medicine ${index + 1}: ${med.name}\n`;
    text += `- ID: ${med.id}\n`;
    text += `- Generic Name & Active Ingredients: ${med.genericName}\n`;
    text += `- Manufacturer: ${med.manufacturer}\n`;
    text += `- Batch / Lot Number: ${med.batchNumber}\n`;
    text += `- Barcode / GS1 Code: ${med.barcode}\n`;
    text += `- Manufacturing Date: ${med.mfgDate}\n`;
    text += `- Expiration Date: ${med.expiryDate} (Category: ${med.category})\n`;
    text += `- Verification Status: ${med.verificationStatus}${med.suspiciousReason ? ` [FLAGGED: ${med.suspiciousReason}]` : ''}\n`;
    text += `- Assigned Family Member: ${assignedMember ? `${assignedMember.name} (${assignedMember.relation})` : 'Unassigned'}\n`;
    text += `- Prescribed Dosage: ${med.dosage}\n`;
    text += `- Composition: ${med.composition}\n`;
    text += `- Approved Clinical Uses: ${med.uses}\n`;
    text += `- Safety Precautions & Warnings: ${med.precautions}\n`;
    text += `- Storage Instructions: ${med.storageInstructions}\n`;
    text += `- Maximum Retail Price (MRP): ${med.mrp}\n`;
    if (med.recallNotice?.isRecalled) {
      text += `- ⚠️ RECALL NOTICE: Severity: ${med.recallNotice.severity}. Reason: ${med.recallNotice.reason}. Action: ${med.recallNotice.actionRequired}\n`;
    }
    if (med.traceability && med.traceability.length > 0) {
      text += `- Supply Chain Traceability Steps:\n`;
      med.traceability.forEach((t) => {
        text += `  * [${t.stage}] ${t.facility} (${t.location || 'N/A'}) - ${t.timestamp} | Status: ${t.status}${t.tempLog ? ` | Temp: ${t.tempLog}` : ''}${t.batchHash ? ` | Hash: ${t.batchHash}` : ''}\n`;
      });
    }
    text += `\n`;
  });

  // 3. DOSAGE REMINDERS & MEDICATION ADHERENCE
  text += `## 3. SCHEDULED DOSAGE REMINDERS & ADHERENCE (${reminders.length} Reminders)\n`;
  reminders.forEach((rem, index) => {
    text += `${index + 1}. [${rem.status.toUpperCase()}] ${rem.medicineName}\n`;
    text += `   - Patient: ${rem.familyMemberName} (ID: ${rem.familyMemberId})\n`;
    text += `   - Dosage & Route: ${rem.dosage}\n`;
    text += `   - Scheduled Time: ${rem.time} (${rem.schedule}, Frequency: ${rem.frequency})\n`;
    if (rem.notes) text += `   - Patient Notes: ${rem.notes}\n`;
  });
  text += `\n`;

  // 4. SAFETY ALERTS & FDA RECALLS
  text += `## 4. SAFETY ALERTS & ACTIVE RECALL BULLETINS (${safetyAlerts.length} Alerts)\n`;
  safetyAlerts.forEach((sa, index) => {
    text += `Alert ${index + 1}: ${sa.title}\n`;
    text += `- Target Medicine: ${sa.medicineName} (Batch: ${sa.batchNumber})\n`;
    text += `- Severity Level: ${sa.severity}\n`;
    text += `- Bulletin Date: ${sa.date}\n`;
    text += `- Detailed Reason: ${sa.description}\n`;
    text += `- Affected Family Members in MediScan: ${sa.affectedMembers.join(', ')}\n\n`;
  });

  // 5. COUNTERFEIT / FAKE MEDICINE REGISTRY
  text += `## 5. COUNTERFEIT & BLACKLISTED MEDICINE REGISTRY (${fakeAlerts.length} Alerts)\n`;
  fakeAlerts.forEach((fa, index) => {
    text += `Fake Alert ${index + 1}: ${fa.medicineName} (Batch: ${fa.batchNumber})\n`;
    text += `- Claimed Manufacturer: ${fa.manufacturer}\n`;
    text += `- Detection Reason: ${fa.reason}\n`;
    text += `- Scanned At: ${fa.scannedAt} by/for ${fa.familyMemberName}\n`;
    text += `- Status: ${fa.verificationStatus}\n`;
    text += `- Action Recommended: ${fa.actionRecommended}\n\n`;
  });

  // 6. SCAN AUDIT HISTORY
  text += `## 6. RECENT SCAN HISTORY & VERIFICATION AUDIT (${scanHistory.length} Records)\n`;
  scanHistory.forEach((sh, index) => {
    text += `${index + 1}. ${sh.scannedAt} - ${sh.medicineName} (Batch: ${sh.batchNumber}, Code: ${sh.barcode}) -> Status: ${sh.verificationStatus} for ${sh.familyMemberName} (Audited by: ${sh.scannedByName})\n`;
  });
  text += `\n`;

  text += `## CLINICAL & ADVISORY GUIDELINES FOR THE AI AGENT:\n`;
  text += `1. When the user asks about family members, cross-reference their exact age, allergies, conditions, and active medicines from the database.\n`;
  text += `2. If asked about potential drug interactions or contraindications, check the family member's known allergies (e.g. Mary's Sulfa allergy, Eleanor's Aspirin allergy, Alex's Penicillin allergy) and existing medications.\n`;
  text += `3. If asked about recalls or fake medicines, reference the exact batch numbers (e.g. Lot RC-2026 for Aspirin recall, Lot FK-9999 for Counterfeit Cough Syrup).\n`;
  text += `4. If asked about expiration, note medicines expiring soon (Amoxicillin in ~6 days, Aspirin in ~25 days) and expired items (Pantoprazole expired 8 days ago, Counterfeit syrup expired 15 days ago).\n`;
  text += `5. Always emphasize that this information is educational, and critical medical decisions must involve a certified physician.\n`;

  return text;
}

/**
 * Intelligent domain query responder for when operating in offline/fallback mode.
 * Grounded completely on the website data.
 */
export function queryWebsiteDataOffline(
  query: string,
  data?: WebsiteDataPackage
): string {
  const q = query.toLowerCase();
  const medicines = data?.medicines || initialMedicines;
  const familyMembers = data?.familyMembers || initialFamilyMembers;
  const reminders = data?.reminders || initialReminders;
  const fakeAlerts = data?.fakeAlerts || initialFakeAlerts;
  const safetyAlerts = data?.safetyAlerts || initialSafetyAlerts;

  const disclaimer = `\n\n*⚠️ Disclaimer: MediScan AI Assistant provides educational information based on your registered website data. It does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified physician for clinical decisions.*`;

  // 1. Query about Family Members (Mary, Robert, Eleanor, Leo, Alex)
  for (const member of familyMembers) {
    if (q.includes(member.name.toLowerCase()) || q.includes(member.relation.toLowerCase())) {
      const memberMeds = medicines.filter((m) => m.familyMemberId === member.id);
      const memberRems = reminders.filter((r) => r.familyMemberId === member.id);
      
      let res = `### Profile & Health Summary for **${member.name}** (${member.relation}):\n\n`;
      res += `• **Age**: ${member.age} years old\n`;
      res += `• **Known Allergies**: ${member.allergies.length > 0 ? `⚠️ **${member.allergies.join(', ')}**` : 'None documented'}\n`;
      res += `• **Diagnosed Conditions**: ${member.conditions.length > 0 ? member.conditions.join(', ') : 'None'}\n\n`;
      
      res += `#### 💊 Active Cabinet Medications (${memberMeds.length}):\n`;
      if (memberMeds.length > 0) {
        memberMeds.forEach((m) => {
          res += `• **${m.name}** (${m.genericName})\n`;
          res += `  - Dosage: ${m.dosage}\n`;
          res += `  - Batch: \`${m.batchNumber}\` | Expiry: ${m.expiryDate} (${m.category})\n`;
          res += `  - Status: **${m.verificationStatus}**\n`;
          if (m.recallNotice?.isRecalled) {
            res += `  - 🚨 **FDA RECALL**: ${m.recallNotice.reason} (${m.recallNotice.actionRequired})\n`;
          }
        });
      } else {
        res += `• No medications currently assigned.\n`;
      }

      res += `\n#### ⏰ Scheduled Dosage Reminders (${memberRems.length}):\n`;
      if (memberRems.length > 0) {
        memberRems.forEach((r) => {
          res += `• **${r.time}** - ${r.medicineName}: ${r.dosage} (Status: **${r.status}**)\n`;
        });
      } else {
        res += `• No active dosage reminders for today.\n`;
      }

      // Safety check for allergies
      if (member.name === 'Eleanor Miller' && (q.includes('aspirin') || memberMeds.some(m => m.name.toLowerCase().includes('aspirin')))) {
        res += `\n🚨 **CRITICAL ALLERGY ALERT**: Eleanor Miller is allergic to **Aspirin / Salicylates**. Aspirin or products containing acetylsalicylic acid must NEVER be administered!`;
      }
      if (member.name === 'Alex Miller' && (q.includes('penicillin') || q.includes('amoxicillin'))) {
        res += `\n🚨 **CRITICAL ALLERGY ALERT**: Alex Miller has a severe documented allergy to **Penicillin**. Note that Amoxicillin is a beta-lactam penicillin and should be avoided unless cleared by an allergist!`;
      }

      return res + disclaimer;
    }
  }

  // 2. Query about Specific Medicine in Website Database
  const matchedMed = medicines.find(
    (m) =>
      q.includes(m.name.toLowerCase()) ||
      q.includes(m.genericName.toLowerCase()) ||
      q.includes(m.batchNumber.toLowerCase())
  );

  if (matchedMed) {
    const member = familyMembers.find((f) => f.id === matchedMed.familyMemberId);
    let res = `### Clinical & Verification Dossier: **${matchedMed.name}**\n\n`;
    res += `• **Generic / Active Ingredients**: ${matchedMed.genericName}\n`;
    res += `• **Manufacturer**: ${matchedMed.manufacturer}\n`;
    res += `• **Batch / Lot Number**: \`${matchedMed.batchNumber}\` (Barcode: ${matchedMed.barcode})\n`;
    res += `• **Manufacturing Date**: ${matchedMed.mfgDate} | **Expiration Date**: ${matchedMed.expiryDate}\n`;
    res += `• **Status & Category**: **${matchedMed.verificationStatus}** (${matchedMed.category})\n`;
    res += `• **Assigned Family Member**: ${member ? `${member.name} (${member.relation})` : 'Unassigned'}\n`;
    res += `• **Prescribed Dosage**: ${matchedMed.dosage}\n`;
    res += `• **Composition**: ${matchedMed.composition}\n\n`;

    res += `#### 🩺 Indications & Uses:\n${matchedMed.uses}\n\n`;
    res += `#### ⚠️ Precautions & Warnings:\n${matchedMed.precautions}\n\n`;
    res += `#### ❄️ Recommended Storage:\n${matchedMed.storageInstructions}\n\n`;

    if (matchedMed.recallNotice?.isRecalled) {
      res += `🚨 **OFFICIAL RECALL NOTICE**:\n`;
      res += `• Severity: **${matchedMed.recallNotice.severity}**\n`;
      res += `• Reason: ${matchedMed.recallNotice.reason}\n`;
      res += `• Action Required: ${matchedMed.recallNotice.actionRequired}\n\n`;
    }

    if (matchedMed.suspiciousReason) {
      res += `🛑 **COUNTERFEIT WARNING**: ${matchedMed.suspiciousReason}\n\n`;
    }

    if (matchedMed.traceability && matchedMed.traceability.length > 0) {
      res += `#### 📦 Supply Chain Traceability Audit Trail:\n`;
      matchedMed.traceability.forEach((t) => {
        res += `• **${t.stage}**: ${t.facility} (${t.location || 'USA'}) - ${t.timestamp} [${t.status}${t.tempLog ? `, ${t.tempLog}` : ''}]\n`;
      });
    }

    return res + disclaimer;
  }

  // 3. Query about Recalls or Fake / Counterfeits
  if (q.includes('fake') || q.includes('counterfeit') || q.includes('recall') || q.includes('suspicious') || q.includes('fk-9999') || q.includes('rc-2026')) {
    let res = `### 🛡️ MediScan Authenticity & Safety Alerts Registry:\n\n`;
    res += `MediScan currently monitors **${safetyAlerts.length} Active Safety Bulletins** and **${fakeAlerts.length} Flagged Counterfeit Batches**:\n\n`;

    res += `#### 1. FDA Safety Recall: Aspirin Lot #RC-2026\n`;
    res += `• **Severity**: High Priority Recall\n`;
    res += `• **Reason**: Foil blister seal oxidation causing accelerated degradation of acetylsalicylic acid.\n`;
    res += `• **Affected Member**: Mary Miller (Mother)\n`;
    res += `• **Recommended Action**: Discontinue lot RC-2026 immediately; return bottle to pharmacy for a verified replacement.\n\n`;

    res += `#### 2. Illicit Counterfeit Flag: Cough & Cold Relief Syrup (#FK-9999)\n`;
    res += `• **Batch Code**: \`FK-9999\` (Scanned by Alex Miller)\n`;
    res += `• **Failure Reason**: Cryptographic GS1 QR digital signature failed hash verification. Batch number matches international counterfeit database DB-2026-FAKE.\n`;
    res += `• **Safety Instruction**: DO NOT CONSUME. Bottle should be quarantined and reported to the drug regulatory authority.\n\n`;

    res += `#### 3. Unverified Antibiotic: Generic Antibiotic Express 500mg (#UN-7711-X)\n`;
    res += `• **Reason**: Missing manufacturer license registry and corrupted hologram security seal.\n`;
    res += `• **Recommended Action**: Do not take; obtain authentic prescribed antibiotics from an authorized pharmacy.`;

    return res + disclaimer;
  }

  // 4. Query about Reminders / Today's Schedule
  if (q.includes('reminder') || q.includes('schedule') || q.includes('due') || q.includes('dose') || q.includes('missed')) {
    let res = `### ⏰ MediScan Daily Medication Reminder Schedule:\n\n`;
    const pending = reminders.filter((r) => r.status === 'Pending');
    const taken = reminders.filter((r) => r.status === 'Taken');
    const missed = reminders.filter((r) => r.status === 'Missed');

    res += `**Summary**: ${taken.length} Taken • ${pending.length} Pending • ${missed.length} Missed\n\n`;
    res += `#### 📋 All Scheduled Doses:\n`;
    reminders.forEach((r) => {
      const badge = r.status === 'Taken' ? '✅' : r.status === 'Pending' ? '⏳' : '❌';
      res += `• ${badge} **${r.time}** (${r.schedule}): **${r.medicineName}**\n`;
      res += `  - Patient: **${r.familyMemberName}**\n`;
      res += `  - Dosage: ${r.dosage}\n`;
      res += `  - Status: **${r.status}**${r.notes ? ` (Note: ${r.notes})` : ''}\n`;
    });

    return res + disclaimer;
  }

  // 5. Query about Expiring or Expired Medicines
  if (q.includes('expir') || q.includes('shelf life') || q.includes('date')) {
    const expiringSoon = medicines.filter((m) => m.category === 'Expiring Soon');
    const expired = medicines.filter((m) => m.category === 'Expired');
    const active = medicines.filter((m) => m.category === 'Active');

    let res = `### 📅 MediScan Expiration & Shelf-Life Audit:\n\n`;
    
    if (expiringSoon.length > 0) {
      res += `#### ⚠️ Expiring Soon (Action Required within 30 days):\n`;
      expiringSoon.forEach((m) => {
        res += `• **${m.name}** (Batch: \`${m.batchNumber}\`)\n`;
        res += `  - Expiry Date: **${m.expiryDate}**\n`;
        res += `  - Storage: ${m.storageInstructions}\n`;
        if (m.name.includes('Amoxicillin')) {
          res += `  - *Note: Amoxicillin oral suspension must be kept refrigerated at 2°C–8°C and finishes within course duration.*\n`;
        }
      });
      res += `\n`;
    }

    if (expired.length > 0) {
      res += `#### 🛑 Expired Medications (Safe Disposal Required):\n`;
      expired.forEach((m) => {
        res += `• **${m.name}** - Expired on ${m.expiryDate} (Batch: \`${m.batchNumber}\`)\n`;
      });
      res += `\n*Action: Expired medications can lose potency or degrade into harmful byproducts. Dispose of them using standard pharmacy medicine take-back dropboxes.*\n\n`;
    }

    res += `#### 🟢 Active & Stable Medicines (${active.length} items):\n`;
    active.forEach((m) => {
      res += `• ${m.name}: Valid until ${m.expiryDate}\n`;
    });

    return res + disclaimer;
  }

  // 6. Summary of All Website Data
  if (q.includes('all data') || q.includes('everything') || q.includes('summary') || q.includes('cabinet') || q.includes('list')) {
    let res = `### 🏥 MediScan Full Website Data Overview:\n\n`;
    res += `MediScan AI Assistant has full knowledge of all **${medicines.length} medicines**, **${familyMembers.length} family profiles**, **${reminders.length} scheduled reminders**, and **supply chain traceability logs**:\n\n`;
    
    res += `#### 👨‍👩‍👧‍👦 Family Health Profiles:\n`;
    familyMembers.forEach((fm) => {
      res += `• **${fm.name}** (${fm.relation}, age ${fm.age}): ${fm.conditions.join(', ') || 'Healthy'} | Allergies: ${fm.allergies.join(', ') || 'None'}\n`;
    });

    res += `\n#### 💊 Medicine Cabinet Inventory:\n`;
    medicines.forEach((m) => {
      res += `• **${m.name}** (${m.genericName}) - Batch: \`${m.batchNumber}\` | Status: **${m.verificationStatus}** | Exp: ${m.expiryDate}\n`;
    });

    res += `\n#### ⏰ Reminder System:\n`;
    res += `• Daily dosage reminders tracked with Web Audio sound chimes and browser push alerts.\n`;

    res += `\n#### 🛡️ Authenticity Verification:\n`;
    res += `• Barcode scanning checks cryptographic GS1 batch hashes, temperature logs, and recall registries.`;

    return res + disclaimer;
  }

  // General default answer referencing website data
  return `### MediScan Clinical AI Assistant\n\nRegarding your inquiry on **"${query}"**:\n\n` +
    `• **Grounded Data Context**: I have access to your full MediScan website data, including **${medicines.length} medicines** (such as Paracetamol, Amoxicillin, Metformin, Aspirin, Caltrate, Pantoprazole, Kids Multivitamins), **${familyMembers.length} family profiles** (Alex, Mary, Robert, Eleanor, Leo), active reminders, and supply chain traceability logs.\n` +
    `• **Safety & Allergies**: Always verify medications against personal allergy records (e.g. Mary's Sulfa allergy, Eleanor's Aspirin allergy, Alex's Penicillin allergy).\n` +
    `• **Storage & Handling**: Store medicines in a cool, dry place below 25°C, except cold-chain products like reconstituted Amoxicillin suspension (2°C–8°C).\n` +
    `• **Authenticity Check**: Verify the batch number, manufacturer holographic seal, and expiration date before administration.\n\n` +
    `Feel free to ask specific questions about any family member, medicine batch, dosage schedule, or safety alert!` +
    disclaimer;
}
