import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  Upload,
  QrCode,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  Search,
  RefreshCw,
  Zap,
  Flashlight,
  Sliders,
  Volume2,
} from 'lucide-react';
import { MedicineItem, FamilyMember } from '../types';
import { SupportedLanguage, translations } from '../i18n/translations';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete?: (scannedMedicine: MedicineItem, targetFamilyMemberId: string) => void;
  onScanSuccess?: (scannedMedicine: MedicineItem, targetFamilyMemberId?: string) => void;
  familyMembers: FamilyMember[];
  isDark: boolean;
  currentLang: SupportedLanguage;
}

// Sound chime helper
const playScanChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.12); // A6 note
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {
    // Ignore audio context errors if blocked
  }
};

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  onScanComplete,
  onScanSuccess,
  familyMembers,
  isDark,
  currentLang,
}) => {
  const t = translations[currentLang];
  const [scanMode, setScanMode] = useState<'camera' | 'upload' | 'manual'>('camera');
  const [selectedFamilyMemberId, setSelectedFamilyMemberId] = useState(
    familyMembers[0]?.id || 'fm-1'
  );
  const [manualCode, setManualCode] = useState('');
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isScanningActive, setIsScanningActive] = useState(true);
  const [isDecoding, setIsDecoding] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Initialize camera preview if supported
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isOpen && scanMode === 'camera') {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
          setCameraError(null);
        })
        .catch(() => {
          setCameraError(
            'Camera access unavailable or declined in this window. You can click "Capture & Verify", upload an image, or pick an instant preset below!'
          );
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, scanMode]);

  if (!isOpen) return null;

  // Preset Medicines for instant scan verification demo
  const presetScanResults: Record<string, MedicineItem> = {
    paracetamol: {
      id: 'scanned-' + Date.now(),
      name: 'Paracetamol 500mg (Calpol)',
      genericName: 'Paracetamol / Acetaminophen',
      manufacturer: 'GSK Pharmaceuticals Ltd',
      batchNumber: 'GSK-98214-A',
      mfgDate: '2025-01-10',
      expiryDate: '2027-01-10',
      composition: 'Paracetamol 500 mg per tablet',
      uses: 'Relief of mild to moderate pain including headache, fever, and toothache.',
      precautions: 'Do not exceed 4000mg in 24 hours. Avoid alcohol while taking.',
      storageInstructions: 'Store below 25°C in a dry place.',
      mrp: '$12.50 / pack of 20',
      verificationStatus: 'Verified',
      familyMemberId: selectedFamilyMemberId,
      category: 'Active',
      dosage: '1 Tablet twice daily after meals',
      barcode: '8901234567890',
      scannedAt: new Date().toLocaleString(),
      traceability: [
        {
          stage: 'Manufacturer',
          facility: 'GSK Plant 4',
          location: 'Mumbai, India',
          timestamp: '2025-01-12 08:30 AM',
          status: 'Passed Quality',
          tempLog: '21.4°C',
          batchHash: '0x8f2a91b2c4',
        },
        {
          stage: 'Distributor',
          facility: 'Apex Pharma Logistics',
          location: 'Chicago, IL',
          timestamp: '2025-02-01 02:45 PM',
          status: 'Dispatched',
          tempLog: '20.1°C',
          batchHash: '0x8f2a91b2c4',
        },
        {
          stage: 'Pharmacy',
          facility: 'MediCare Care Pharmacy',
          location: 'Springfield',
          timestamp: '2026-07-28 11:20 AM',
          status: 'Dispensed',
          tempLog: '22.0°C',
          batchHash: '0x8f2a91b2c4',
        },
        {
          stage: 'Patient',
          facility: 'MediScan Camera Scan',
          location: 'Verified Device',
          timestamp: new Date().toLocaleString(),
          status: 'Verified',
          batchHash: '0x8f2a91b2c4',
        },
      ],
    },

    amoxicillin: {
      id: 'scanned-' + Date.now(),
      name: 'Amoxicillin 250mg Suspension',
      genericName: 'Amoxicillin Trihydrate',
      manufacturer: 'Pfizer Global Health',
      batchNumber: 'PF-AMX-771',
      mfgDate: '2025-09-01',
      expiryDate: '2026-08-18', // ~6 days away
      composition: 'Amoxicillin 250mg / 5ml liquid',
      uses: 'Bacterial infections including ear, chest, and sinus infections.',
      precautions: 'Complete entire prescribed course. Stop if skin rash appears.',
      storageInstructions: 'Keep refrigerated between 2°C and 8°C after opening.',
      mrp: '$18.00 / bottle 100ml',
      verificationStatus: 'Verified',
      familyMemberId: selectedFamilyMemberId,
      category: 'Expiring Soon',
      dosage: '5ml thrice daily for 7 days',
      barcode: '8909876543210',
      scannedAt: new Date().toLocaleString(),
      traceability: [
        {
          stage: 'Manufacturer',
          facility: 'Pfizer BioMed',
          location: 'Kalamazoo, MI',
          timestamp: '2025-09-02',
          status: 'Passed Quality',
          tempLog: '4.2°C',
        },
        {
          stage: 'Patient',
          facility: 'MediScan Scan',
          location: 'Home',
          timestamp: new Date().toLocaleString(),
          status: 'Verified',
        },
      ],
    },

    recalledAspirin: {
      id: 'scanned-' + Date.now(),
      name: 'Aspirin 81mg Low Dose (Lot #RC-2026 RECALLED)',
      genericName: 'Acetylsalicylic Acid',
      manufacturer: 'Bayer Healthcare',
      batchNumber: 'RC-2026',
      mfgDate: '2025-03-01',
      expiryDate: '2026-09-05',
      composition: 'Aspirin 81mg enteric coated',
      uses: 'Cardiovascular protection under medical supervision.',
      precautions: 'Stop use immediately! Lot #RC-2026 is under voluntary recall.',
      storageInstructions: 'Store in cool place.',
      mrp: '$9.99',
      verificationStatus: 'Verified',
      familyMemberId: selectedFamilyMemberId,
      category: 'Expiring Soon',
      dosage: 'Do not take (Lot Recalled)',
      barcode: '8901112223334',
      scannedAt: new Date().toLocaleString(),
      recallNotice: {
        isRecalled: true,
        severity: 'High',
        reason: 'FDA Official Notice: Package seal oxidation detected affecting chemical stability.',
        noticeDate: '2026-08-10',
        actionRequired: 'Discontinue use immediately and return to pharmacy for replacement.',
      },
      traceability: [
        {
          stage: 'Manufacturer',
          facility: 'Bayer Leverkusen',
          location: 'Germany',
          timestamp: '2025-03-02',
          status: 'Passed Quality',
        },
        {
          stage: 'Patient',
          facility: 'MediScan Safety Engine',
          location: 'Flagged Recall Lot',
          timestamp: new Date().toLocaleString(),
          status: 'Verified',
        },
      ],
    },

    fakeSyrup: {
      id: 'scanned-' + Date.now(),
      name: 'Cough & Cold Relief Syrup (COUNTERFEIT / FAKE)',
      genericName: 'Unverified Dextromethorphan Blend',
      manufacturer: 'Unknown Counterfeit Facility',
      batchNumber: 'FK-9999',
      mfgDate: '2023-01-01',
      expiryDate: '2026-07-28', // Expired
      composition: 'Mismatched chemical formula / Failed GS1 signature',
      uses: 'Unsafe cough mixture',
      precautions: '⚠️ DO NOT CONSUME. Failed cryptographic verification check.',
      storageInstructions: 'Quarantine bottle immediately.',
      mrp: '$5.00',
      verificationStatus: 'Suspicious',
      suspiciousReason: 'Failed GS1 QR digital signature check. Serial number blacklisted in global counterfeit database DB-2026-FAKE.',
      familyMemberId: selectedFamilyMemberId,
      category: 'Expired',
      dosage: 'DO NOT TAKE',
      barcode: '9998887776665',
      scannedAt: new Date().toLocaleString(),
      traceability: [
        {
          stage: 'Manufacturer',
          facility: 'Unverified Facility',
          location: 'Unknown Source',
          timestamp: '2023-01-01',
          status: 'Passed Quality',
          batchHash: 'FAILED_HASH',
        },
        {
          stage: 'Patient',
          facility: 'MediScan Scan',
          location: 'Flagged Suspicious',
          timestamp: new Date().toLocaleString(),
          status: 'Verified',
        },
      ],
    },
  };

  const handleTriggerPreset = (presetKey: string) => {
    playScanChime();
    setIsDecoding(true);
    setTimeout(() => {
      setIsDecoding(false);
      const med = presetScanResults[presetKey];
      if (med) {
        med.familyMemberId = selectedFamilyMemberId;
        if (onScanComplete) {
          onScanComplete(med, selectedFamilyMemberId);
        }
        if (onScanSuccess) {
          onScanSuccess(med, selectedFamilyMemberId);
        }
        onClose();
      }
    }, 400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsDecoding(true);
      setTimeout(() => {
        setIsDecoding(false);
        handleTriggerPreset('paracetamol');
      }, 600);
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode) return;

    if (manualCode.toLowerCase().includes('fk') || manualCode.includes('999')) {
      handleTriggerPreset('fakeSyrup');
    } else if (manualCode.toLowerCase().includes('rc') || manualCode.includes('2026')) {
      handleTriggerPreset('recalledAspirin');
    } else if (manualCode.toLowerCase().includes('amx') || manualCode.includes('250')) {
      handleTriggerPreset('amoxicillin');
    } else {
      handleTriggerPreset('paracetamol');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-xl rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-all ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Medicine Scanner</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Scan QR or Barcode to verify authenticity & expiry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Member Selector Bar */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Scanning for Family Member:
          </label>
          <select
            value={selectedFamilyMemberId}
            onChange={(e) => setSelectedFamilyMemberId(e.target.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors outline-none ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-blue-400 focus:border-blue-500'
                : 'bg-white border-slate-300 text-blue-700 focus:border-blue-600'
            }`}
          >
            {familyMembers.map((member) => (
              <option key={member.id} value={member.id}>
                👤 {member.name} ({member.relation})
              </option>
            ))}
          </select>
        </div>

        {/* Mode Tabs */}
        <div className="p-4 space-y-4">
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            <button
              onClick={() => setScanMode('camera')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                scanMode === 'camera'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Camera Scan</span>
            </button>
            <button
              onClick={() => setScanMode('upload')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                scanMode === 'upload'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Image</span>
            </button>
            <button
              onClick={() => setScanMode('manual')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                scanMode === 'manual'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Manual Code</span>
            </button>
          </div>

          {/* Mode Contents */}
          {scanMode === 'camera' && (
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center border border-slate-800">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover transition-opacity ${
                    isTorchOn ? 'brightness-125 contrast-110 opacity-95' : 'opacity-85'
                  }`}
                />

                {/* Torch Glow Effect if active */}
                {isTorchOn && (
                  <div className="absolute inset-0 bg-yellow-100/10 pointer-events-none mix-blend-overlay"></div>
                )}

                {/* Laser Scanning Overlay Target Box */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-56 h-40 border-2 border-dashed border-blue-400 rounded-2xl relative flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500"></div>
                    {/* Laser line animation */}
                    <div className="w-full h-0.5 bg-red-500/80 shadow-lg shadow-red-500 animate-pulse"></div>
                  </div>
                </div>

                {/* Decoding feedback spinner */}
                {isDecoding && (
                  <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20">
                    <RefreshCw className="w-8 h-8 animate-spin mb-2" />
                    <span className="text-xs font-bold tracking-wider uppercase">Decoding GS1 Cryptographic Barcode...</span>
                  </div>
                )}

                {/* Flashlight toggle overlay button */}
                <div className="absolute top-3 right-3 z-10">
                  <button
                    onClick={() => setIsTorchOn(!isTorchOn)}
                    className={`p-2 rounded-xl text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 transition-all cursor-pointer ${
                      isTorchOn
                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                        : 'bg-black/50 text-white/80 hover:text-white'
                    }`}
                    title="Toggle Flashlight"
                  >
                    <Flashlight className="w-4 h-4" />
                    <span className="text-[10px]">{isTorchOn ? 'Torch On' : 'Torch'}</span>
                  </button>
                </div>

                {cameraError && (
                  <div className="absolute inset-0 bg-slate-900/90 p-4 flex flex-col items-center justify-center text-center">
                    <Camera className="w-8 h-8 text-amber-500 mb-2" />
                    <p className="text-xs text-slate-300 max-w-xs">{cameraError}</p>
                  </div>
                )}
              </div>

              {/* Instant Camera Capture Button */}
              <button
                onClick={() => handleTriggerPreset('paracetamol')}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
              >
                <Camera className="w-4 h-4" />
                <span>Capture & Verify Barcode in Viewfinder</span>
              </button>
            </div>
          )}

          {scanMode === 'upload' && (
            <div className="space-y-3">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center bg-slate-50 dark:bg-slate-800/40 relative hover:border-blue-500 transition-colors">
                <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-xs sm:text-sm font-semibold mb-1">
                  Drag & Drop or Choose Image of Barcode/QR
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                  Supports JPG, PNG, WEBP, or photo receipts
                </p>
                <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md inline-block">
                  Browse Files
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Quick sample upload buttons */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Or Test Sample Packaging Images:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => handleTriggerPreset('paracetamol')}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 bg-white dark:bg-slate-800 text-left flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold text-xs">
                      QR
                    </div>
                    <div>
                      <div className="font-semibold text-[11px]">Calpol 500mg Strip</div>
                      <div className="text-[10px] text-emerald-600">Authentic GS1 QR</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleTriggerPreset('fakeSyrup')}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-red-400 bg-white dark:bg-slate-800 text-left flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 flex items-center justify-center font-bold text-xs">
                      ⚠️
                    </div>
                    <div>
                      <div className="font-semibold text-[11px]">Syrup Bottle Photo</div>
                      <div className="text-[10px] text-red-600">Counterfeit Batch</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {scanMode === 'manual' && (
            <form onSubmit={handleManualSearch} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Enter GS1 Barcode, Batch #, or Serial Code
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="e.g. 8901234567890 or GSK-98214-A or FK-9999"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm border transition-colors outline-none ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                    }`}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md cursor-pointer"
              >
                Verify Barcode Record
              </button>
            </form>
          )}

          {/* DEMO PRESET BUTTONS FOR INSTANT VERIFICATION TESTING */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Instant Test Scans (Click to Verify)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleTriggerPreset('paracetamol')}
                className="p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition-colors text-left flex items-start gap-2 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Scan Genuine Medicine</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                    Paracetamol 500mg
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleTriggerPreset('amoxicillin')}
                className="p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 hover:bg-amber-100 transition-colors text-left flex items-start gap-2 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Scan Expiring Soon</div>
                  <div className="text-[10px] text-amber-600 dark:text-amber-400">
                    Amoxicillin Suspension
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleTriggerPreset('recalledAspirin')}
                className="p-2.5 rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/20 text-purple-800 dark:text-purple-300 hover:bg-purple-100 transition-colors text-left flex items-start gap-2 cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Scan FDA Recall Lot</div>
                  <div className="text-[10px] text-purple-600 dark:text-purple-400">
                    Aspirin #RC-2026
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleTriggerPreset('fakeSyrup')}
                className="p-2.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 text-red-800 dark:text-red-300 hover:bg-red-100 transition-colors text-left flex items-start gap-2 cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Scan Fake / Counterfeit</div>
                  <div className="text-[10px] text-red-600 dark:text-red-400">
                    Cough Syrup #FK-9999
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
