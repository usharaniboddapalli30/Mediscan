export type SupportedLanguage = 'en' | 'te' | 'hi';

export interface TranslationSchema {
  // Brand & General
  appName: string;
  appTagline: string;
  searchPlaceholder: string;
  logout: string;
  login: string;
  register: string;
  save: string;
  cancel: string;
  close: string;
  delete: string;
  edit: string;
  confirm: string;
  status: string;

  // Sidebar Menu (Strict 5 items)
  navDashboard: string;
  navHistory: string;
  navReminders: string;
  navFakeAlerts: string;
  navAccount: string;

  // Dashboard Cards & Buttons
  scanMedicine: string;
  digitalCabinet: string;
  familyManagement: string;
  expiringSoon: string;
  todaysReminders: string;
  recentScanHistory: string;
  aiAssistant: string;
  safetyAlerts: string;

  // Stats Labels
  totalMedicines: string;
  medicinesExpiringSoon: string;
  todayRemindersCount: string;
  missedRemindersCount: string;
  familyMembersCount: string;

  // Family Reminder Dashboard
  familyReminderDashboardTitle: string;
  familyReminderDashboardSubtitle: string;
  taken: string;
  pending: string;
  missed: string;
  snoozed: string;

  // Verification Badges
  verified: string;
  unverified: string;
  suspicious: string;
  suspiciousWarningTitle: string;

  // Categories
  categoryActive: string;
  categoryExpiringSoon: string;
  categoryExpired: string;
  categoryCompleted: string;

  // Auth & Login
  loginTitle: string;
  loginSubtitle: string;
  emailOrPhone: string;
  password: string;
  showPassword: string;
  hidePassword: string;
  rememberMe: string;
  forgotPassword: string;
  resetPassword: string;
  createAccount: string;
  fullName: string;
  mobileNumber: string;
  enterOtp: string;
  verifyOtp: string;
  sendOtp: string;
  demoAccountQuickLogin: string;

  // Languages
  languageEnglish: string;
  languageTelugu: string;
  languageHindi: string;
  selectLanguageLabel: string;
}

export const translations: Record<SupportedLanguage, TranslationSchema> = {
  en: {
    appName: 'MediScan',
    appTagline: 'Smart Medicine Verification & Family Management',
    searchPlaceholder: 'Search medicines, batches, family members...',
    logout: 'Logout',
    login: 'Log In',
    register: 'Create Account',
    save: 'Save Changes',
    cancel: 'Cancel',
    close: 'Close',
    delete: 'Delete',
    edit: 'Edit',
    confirm: 'Confirm',
    status: 'Status',

    navDashboard: 'Dashboard',
    navHistory: 'Scan History',
    navReminders: 'Reminders',
    navFakeAlerts: 'Fake Medicine Alerts',
    navAccount: 'Account',

    scanMedicine: 'Scan Medicine',
    digitalCabinet: 'Digital Medicine Cabinet',
    familyManagement: 'Family Management',
    expiringSoon: 'Expiring Soon',
    todaysReminders: "Today's Reminders",
    recentScanHistory: 'Recent Scan History',
    aiAssistant: 'AI Medicine Assistant',
    safetyAlerts: 'Safety & Recall Alerts',

    totalMedicines: 'Total Medicines',
    medicinesExpiringSoon: 'Expiring Soon',
    todayRemindersCount: "Today's Reminders",
    missedRemindersCount: 'Missed Reminders',
    familyMembersCount: 'Family Members',

    familyReminderDashboardTitle: 'Family Reminder Dashboard',
    familyReminderDashboardSubtitle: 'Real-time daily medication adherence overview for all family members',
    taken: 'Taken',
    pending: 'Pending',
    missed: 'Missed',
    snoozed: 'Snoozed',

    verified: 'Verified Authentic',
    unverified: 'Unverified Medicine',
    suspicious: 'Suspicious / Counterfeit',
    suspiciousWarningTitle: '⚠️ Suspicious or Unverified Medicine',

    categoryActive: 'Active Medicines',
    categoryExpiringSoon: 'Expiring Soon',
    categoryExpired: 'Expired Medicines',
    categoryCompleted: 'Completed Medicines',

    loginTitle: 'Welcome back to MediScan',
    loginSubtitle: 'Secure access to your family health & verification portal',
    emailOrPhone: 'Email Address or Mobile Number',
    password: 'Password',
    showPassword: 'Show',
    hidePassword: 'Hide',
    rememberMe: 'Remember me on this device',
    forgotPassword: 'Forgot Password?',
    resetPassword: 'Reset Password',
    createAccount: 'Create New Account',
    fullName: 'Full Name',
    mobileNumber: 'Mobile Phone Number',
    enterOtp: 'Enter 6-digit OTP',
    verifyOtp: 'Verify OTP & Continue',
    sendOtp: 'Send OTP Code',
    demoAccountQuickLogin: 'Quick Demo Access',

    languageEnglish: 'English',
    languageTelugu: 'తెలుగు',
    languageHindi: 'हिन्दी',
    selectLanguageLabel: 'Language / భాష / भाषा',
  },

  te: {
    appName: 'మెడిస్కాన్ (MediScan)',
    appTagline: 'స్మార్ట్ ఔషధ ధృవీకరణ మరియు కుటుంబ ఆరోగ్య నిర్వహణ',
    searchPlaceholder: 'మందులు, బ్యాచ్ సంఖ్యలు, కుటుంబ సభ్యులను వెతకండి...',
    logout: 'లాగ్ అవుట్',
    login: 'లాగిన్',
    register: 'కొత్త ఖాతా తెరవండి',
    save: 'మార్పులను సేవ్ చేయండి',
    cancel: 'రద్దు చేయండి',
    close: 'మూసివేయి',
    delete: 'తొలగించు',
    edit: 'సవరించు',
    confirm: 'ధృవీకరించు',
    status: 'స్థితి',

    navDashboard: 'డాష్‌బోర్డ్',
    navHistory: 'స్కాన్ హిస్టరీ',
    navReminders: 'రిమైండర్లు',
    navFakeAlerts: 'నకిలీ మందుల హెచ్చరికలు',
    navAccount: 'ఖాతా',

    scanMedicine: 'మందులను స్కాన్ చేయండి',
    digitalCabinet: 'డిజిటల్ మెడిసిన్ క్యాబినెట్',
    familyManagement: 'కుటుంబ సభ్యుల నిర్వహణ',
    expiringSoon: 'త్వరలో గడువు ముగిసేవి',
    todaysReminders: 'ఈనాటి రిమైండర్లు',
    recentScanHistory: 'ఇటీవలి స్కాన్ చరిత్ర',
    aiAssistant: 'AI మెడిసిన్ అసిస్టెంట్',
    safetyAlerts: 'భద్రత మరియు రీకాల్ హెచ్చరికలు',

    totalMedicines: 'మొత్తం మందులు',
    medicinesExpiringSoon: 'త్వరలో గడువు ముగిసేవి',
    todayRemindersCount: 'ఈనాటి రిమైండర్లు',
    missedRemindersCount: 'తప్పిపోయిన రిమైండర్లు',
    familyMembersCount: 'కుటుంబ సభ్యులు',

    familyReminderDashboardTitle: 'కుటుంబ రిమైండర్ డాష్‌బోర్డ్',
    familyReminderDashboardSubtitle: 'కుటుంబ సభ్యులందరి రోజువారీ మందుల వాడకం సమాచారం',
    taken: 'వాడారు',
    pending: 'బాకీ ఉంది',
    missed: 'తప్పిపోయింది',
    snoozed: 'వాయిదా పడింది',

    verified: 'నిజమైనదిగా ధృవీకరించబడింది',
    unverified: 'ధృవీకరించబడని మందు',
    suspicious: 'అనుమానాస్పద / నకిలీ మందు',
    suspiciousWarningTitle: '⚠️ అనుమానాస్పద లేదా ధృవీకరించబడని మందు',

    categoryActive: 'ప్రస్తుతం వాడుతున్న మందులు',
    categoryExpiringSoon: 'త్వరలో గడువు ముగిసేవి',
    categoryExpired: 'గడువు ముగిసిన మందులు',
    categoryCompleted: 'పూర్తయిన మందులు',

    loginTitle: 'మెడిస్కాన్‌కు స్వాగతం',
    loginSubtitle: 'మీ కుటుంబ ఆరోగ్య మరియు ధృవీకరణ పోర్టల్‌లోకి సురక్షిత ప్రవేశం',
    emailOrPhone: 'ఈమెయిల్ లేదా మొబైల్ నంబర్',
    password: 'పాస్‌వర్డ్',
    showPassword: 'చూపించు',
    hidePassword: 'దాచు',
    rememberMe: 'నన్ను గుర్తుంచుకో',
    forgotPassword: 'పాస్‌వర్డ్ మరిచిపోయారా?',
    resetPassword: 'పాస్‌వర్డ్ రీసెట్ చేయండి',
    createAccount: 'కొత్త ఖాతాను సృష్టించండి',
    fullName: 'పూర్తి పేరు',
    mobileNumber: 'మొబైల్ నంబర్',
    enterOtp: '6 అంకెల OTP నమోదు చేయండి',
    verifyOtp: 'OTP ధృవీకరించి కొనసాగండి',
    sendOtp: 'OTP కోడ్ పంపండి',
    demoAccountQuickLogin: 'డెమో ఖాతా లాగిన్',

    languageEnglish: 'English',
    languageTelugu: 'తెలుగు',
    languageHindi: 'हिन्दी',
    selectLanguageLabel: 'భాష ఎంచుకోండి',
  },

  hi: {
    appName: 'मेडिसकैन (MediScan)',
    appTagline: 'स्मार्ट दवा सत्यापन एवं परिवार दवा प्रबंधन',
    searchPlaceholder: 'दवाएं, बैच नंबर, परिवार के सदस्य खोजें...',
    logout: 'लॉग आउट',
    login: 'लॉग इन',
    register: 'नया खाता बनाएं',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    close: 'बंद करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    confirm: 'पुष्टि करें',
    status: 'स्थिति',

    navDashboard: 'डैशबोर्ड',
    navHistory: 'स्कैन इतिहास',
    navReminders: 'रिमाइंडर',
    navFakeAlerts: 'नकली दवा अलर्ट',
    navAccount: 'खाता',

    scanMedicine: 'दवा स्कैन करें',
    digitalCabinet: 'डिजिटल मेडिसिन कैबिनेट',
    familyManagement: 'परिवार प्रबंधन',
    expiringSoon: 'शीघ्र समाप्त होने वाली',
    todaysReminders: 'आज के रिमाइंडर',
    recentScanHistory: 'हाल का स्कैन इतिहास',
    aiAssistant: 'AI मेडिसिन असिस्टेंट',
    safetyAlerts: 'सुरक्षा और रीकॉल अलर्ट',

    totalMedicines: 'कुल दवाएं',
    medicinesExpiringSoon: 'शीघ्र समाप्त होने वाली',
    todayRemindersCount: 'आज के रिमाइंडर',
    missedRemindersCount: 'छूटे हुए रिमाइंडर',
    familyMembersCount: 'परिवार के सदस्य',

    familyReminderDashboardTitle: 'परिवार रिमाइंडर डैशबोर्ड',
    familyReminderDashboardSubtitle: 'सभी परिजनों की दैनिक दवा स्थिति की वास्तविक समय जानकारी',
    taken: 'ली गई',
    pending: 'लंबित',
    missed: 'छूट गई',
    snoozed: 'स्थगित',

    verified: 'सत्यापित प्रामाणिक',
    unverified: 'असत्यापित दवा',
    suspicious: 'संदिग्ध / नकली दवा',
    suspiciousWarningTitle: '⚠️ संदिग्ध या असत्यापित दवा',

    categoryActive: 'सक्रिय दवाएं',
    categoryExpiringSoon: 'शीघ्र समाप्त होने वाली',
    categoryExpired: 'समाप्त हो चुकी दवाएं',
    categoryCompleted: 'पूर्ण दवाएं',

    loginTitle: 'मेडिसकैन में आपका स्वागत है',
    loginSubtitle: 'अपने पारिवारिक स्वास्थ्य पोर्टल में सुरक्षित प्रवेश करें',
    emailOrPhone: 'ईमेल पता या मोबाइल नंबर',
    password: 'पासवर्ड',
    showPassword: 'दिखाएं',
    hidePassword: 'छिपाएं',
    rememberMe: 'इस डिवाइस पर याद रखें',
    forgotPassword: 'पासवर्ड भूल गए?',
    resetPassword: 'पासवर्ड रीसेट करें',
    createAccount: 'नया खाता बनाएं',
    fullName: 'पूरा नाम',
    mobileNumber: 'मोबाइल नंबर',
    enterOtp: '6 अंकों का OTP दर्ज करें',
    verifyOtp: 'OTP सत्यापित करें',
    sendOtp: 'OTP कोड भेजें',
    demoAccountQuickLogin: 'डेमो खाता त्वरित पहुंच',

    languageEnglish: 'English',
    languageTelugu: 'తెలుగు',
    languageHindi: 'हिन्दी',
    selectLanguageLabel: 'भाषा चुनें',
  },
};
