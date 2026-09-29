import React, { useState } from 'react';
import {
  Activity,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  Globe,
  Sparkles,
} from 'lucide-react';
import { SupportedLanguage, translations } from '../i18n/translations';

interface AuthScreenProps {
  onLoginSuccess: (userData: { name: string; email: string; phone: string }) => void;
  currentLang: SupportedLanguage;
  onSelectLang: (lang: SupportedLanguage) => void;
  isDark: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  currentLang,
  onSelectLang,
  isDark,
}) => {
  const t = translations[currentLang];

  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'otp'>('login');
  const [identifier, setIdentifier] = useState('alex.miller@mediscan.health');
  const [password, setPassword] = useState('●●●●●●●●');
  const [fullName, setFullName] = useState('Alex Miller');
  const [mobileNumber, setMobileNumber] = useState('+1 (555) 019-2834');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // OTP state
  const [otpCode, setOtpCode] = useState(['4', '8', '2', '9', '1', '0']);
  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!identifier) {
      setErrorMessage('Please enter your email or mobile number.');
      return;
    }

    if (identifier.includes('@') || password.length >= 6) {
      onLoginSuccess({
        name: fullName || 'Alex Miller',
        email: identifier.includes('@') ? identifier : 'alex.miller@mediscan.health',
        phone: mobileNumber,
      });
    } else {
      // Trigger OTP flow for phone login
      setOtpSent(true);
      setAuthMode('otp');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !identifier || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    // Proceed to phone OTP verification
    setOtpSent(true);
    setAuthMode('otp');
    setSuccessMessage('Verification code sent to your registered mobile number!');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpCode.join('');
    if (code.length < 6) {
      setErrorMessage('Please enter all 6 digits of the OTP code.');
      return;
    }
    onLoginSuccess({
      name: fullName || 'Alex Miller',
      email: identifier.includes('@') ? identifier : 'alex.miller@mediscan.health',
      phone: mobileNumber,
    });
  };

  const handleDemoLogin = (type: 'primary' | 'family') => {
    if (type === 'primary') {
      onLoginSuccess({
        name: 'Alex Miller',
        email: 'alex.miller@mediscan.health',
        phone: '+1 (555) 019-2834',
      });
    } else {
      onLoginSuccess({
        name: 'Dr. Sarah Miller (Caregiver)',
        email: 'sarah.care@mediscan.health',
        phone: '+1 (555) 987-6543',
      });
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      setErrorMessage('Please enter your email or mobile number to receive reset instructions.');
      return;
    }
    setSuccessMessage(`Password reset link and OTP sent to ${identifier}!`);
    setTimeout(() => {
      setAuthMode('login');
      setSuccessMessage('');
    }, 2500);
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Bar with Language Selector & Brand */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-blue-600 dark:text-blue-400">
              {t.appName}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              {t.appTagline}
            </p>
          </div>
        </div>

        {/* Language selector dropdown */}
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-slate-400" />
          <select
            value={currentLang}
            onChange={(e) => onSelectLang(e.target.value as SupportedLanguage)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-slate-200 focus:border-blue-500'
                : 'bg-white border-slate-300 text-slate-800 focus:border-blue-600'
            }`}
          >
            <option value="en">🌐 English</option>
            <option value="te">🌐 తెలుగు</option>
            <option value="hi">🌐 हिन्दी</option>
          </select>
        </div>
      </header>

      {/* Main Authentication Card Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md">
          {/* Card Frame */}
          <div
            className={`rounded-2xl p-6 sm:p-8 border shadow-xl transition-all duration-200 ${
              isDark
                ? 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-slate-950/50'
                : 'bg-white border-slate-200 text-slate-900 shadow-blue-950/5'
            }`}
          >
            {/* Header Badge & Title */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Authorized Family Portal</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                {authMode === 'login' && t.loginTitle}
                {authMode === 'register' && t.createAccount}
                {authMode === 'forgot' && t.resetPassword}
                {authMode === 'otp' && 'OTP Phone Verification'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {authMode === 'login' && t.loginSubtitle}
                {authMode === 'register' && 'Register your main family account to start scanning & managing medicines'}
                {authMode === 'forgot' && 'Enter your registered details to recover account password'}
                {authMode === 'otp' && 'We sent a 6-digit verification code to your phone'}
              </p>
            </div>

            {/* Notification banners */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.emailOrPhone}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. alex.miller@mediscan.health or +1 555-019-2834"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border transition-colors outline-none ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                      }`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t.password}
                    </label>
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      {t.forgotPassword}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border transition-colors outline-none ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <span>{t.rememberMe}</span>
                  </label>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span>{t.login}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.fullName}
                  </label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alex Miller"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border transition-colors outline-none ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                      }`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.emailOrPhone}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="alex.miller@mediscan.health"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border transition-colors outline-none ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                      }`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.mobileNumber}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border transition-colors outline-none ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                      }`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.password}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border transition-colors outline-none ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
                >
                  <span>{t.sendOtp}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* FORGOT PASSWORD FORM */}
            {authMode === 'forgot' && (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.emailOrPhone}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Enter registered email or mobile number"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border transition-colors outline-none ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                      }`}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{t.resetPassword}</span>
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:underline cursor-pointer"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )}

            {/* OTP VERIFICATION FORM */}
            {authMode === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Enter the 6-digit verification code sent to <br />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {mobileNumber || identifier}
                  </span>
                </p>

                <div className="flex justify-center gap-2 my-4">
                  {otpCode.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const newOtp = [...otpCode];
                        newOtp[index] = e.target.value;
                        setOtpCode(newOtp);
                      }}
                      className={`w-11 h-12 text-center text-lg font-bold rounded-xl border outline-none ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-blue-400 focus:border-blue-500'
                          : 'bg-slate-50 border-slate-300 text-blue-600 focus:border-blue-600'
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>{t.verifyOtp}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:underline block mx-auto cursor-pointer"
                >
                  Change Email or Mobile Number
                </button>
              </form>
            )}

            {/* Switch between Login and Register */}
            {authMode !== 'otp' && authMode !== 'forgot' && (
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
                {authMode === 'login' ? (
                  <>
                    Don't have a family account yet?{' '}
                    <button
                      onClick={() => {
                        setErrorMessage('');
                        setAuthMode('register');
                      }}
                      className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer ml-1"
                    >
                      {t.register}
                    </button>
                  </>
                ) : (
                  <>
                    Already registered?{' '}
                    <button
                      onClick={() => {
                        setErrorMessage('');
                        setAuthMode('login');
                      }}
                      className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer ml-1"
                    >
                      {t.login}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* DEMO QUICK LOGIN BUTTONS */}
            <div className="mt-6 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  {t.demoAccountQuickLogin}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('primary')}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors text-left truncate cursor-pointer shadow-sm"
                >
                  Alex Miller (Primary)
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('family')}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors text-left truncate cursor-pointer shadow-sm"
                >
                  Dr. Sarah (Caregiver)
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="py-4 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
        <p>© 2026 MediScan Platform • Encryption Protected GS1 Verification System</p>
      </footer>
    </div>
  );
};
