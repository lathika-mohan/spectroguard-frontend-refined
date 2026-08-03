import React, { useState } from 'react';
import { GlassPressCard } from './GlassPressCard';
import { useApp } from '../context/AppContext';
import type { AccentColor, ThemeMode, Language } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { 
  User, 
  Palette, 
  Shield, 
  Sliders, 
  Lock, 
  Info, 
  Edit3, 
  Globe, 
  Clock, 
  Calendar, 
  ChevronRight, 
  Check, 
  BookOpen, 
  ShieldCheck, 
  Sparkles,
  X,
  LogOut
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { theme, setTheme, accentColor, setAccentColor, language, setLanguage, t, accentClasses } = useApp();
  const { logout } = useAuth();

  // Local state for interactive settings
  const [opCode, setOpCode] = useState('OP-2047');
  const [operatorRole, setOperatorRole] = useState(language === 'hi' ? 'सुरक्षा ऑपरेटर' : 'Security Operator');
  const [email, setEmail] = useState('op-2047@spectraguard.ai');
  
  const [timeZone, setTimeZone] = useState('Asia/Kolkata (UTC +05:30)');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30 Minutes');

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isManageSecurityOpen, setIsManageSecurityOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const accentColorsList: { id: AccentColor; name: string; colorBg: string; ringColor: string }[] = [
    { id: 'blue', name: 'Blue', colorBg: 'bg-blue-600', ringColor: 'ring-blue-500' },
    { id: 'purple', name: 'Purple', colorBg: 'bg-purple-600', ringColor: 'ring-purple-500' },
    { id: 'teal', name: 'Teal', colorBg: 'bg-teal-500', ringColor: 'ring-teal-400' },
    { id: 'amber', name: 'Amber', colorBg: 'bg-amber-500', ringColor: 'ring-amber-400' },
    { id: 'rose', name: 'Rose', colorBg: 'bg-rose-600', ringColor: 'ring-rose-500' },
  ];

  return (
    <div className={`space-y-8 animate-fadeIn font-['SF_Pro_Text'] max-w-[1600px] mx-auto pb-16 ${
      theme === 'light' ? 'text-slate-900' : 'text-white'
    }`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-fadeIn backdrop-blur-md">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Grid Layout: 2 Rows x 3 Columns matching reference UI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* CARD 1: Operator Profile */}
        <GlassPressCard className={`p-6 space-y-6 h-full flex flex-col justify-between ${
          theme === 'light' ? 'bg-white/80 border-slate-200 shadow-lg text-slate-900' : ''
        }`}>
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className={`p-2.5 rounded-xl border ${accentClasses.badgeBg}`}>
              <User className={`w-5 h-5 ${accentClasses.text}`} />
            </div>
            <h2 className="text-sm font-bold font-['SF_Pro_Display'] uppercase tracking-wider">
              {t('settings.operatorProfile')}
            </h2>
          </div>

          <div className="flex items-center gap-4 my-auto">
            {/* Operator Avatar with Tactical Glow */}
            <div className="relative shrink-0">
              <div className={`w-16 h-16 rounded-2xl overflow-hidden border-2 p-0.5 shadow-lg ${
                theme === 'light' ? 'bg-slate-200 border-blue-400' : 'bg-slate-900 border-purple-500/40'
              }`}>
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" 
                  alt="Operator Avatar" 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#090d16]" title={t('status.online')} />
            </div>

            {/* OP-CODE as Primary Name */}
            <div className="space-y-1 min-w-0">
              <h3 className="text-xl font-extrabold font-['SF_Pro_Display'] tracking-tight truncate">
                {opCode}
              </h3>
              <p className={`text-xs font-semibold truncate ${accentClasses.text}`}>
                {operatorRole}
              </p>
              <p className={`text-xs font-mono truncate ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                {email}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditProfileOpen(true)}
            className={`w-full py-2.5 px-4 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold font-['SF_Pro_Text'] transition-all cursor-pointer shadow-sm active:scale-95 ${
              theme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/15'
            }`}
          >
            <Edit3 className={`w-3.5 h-3.5 ${accentClasses.text}`} />
            <span>{t('settings.editProfile')}</span>
          </button>
        </GlassPressCard>

        {/* CARD 2: Appearance */}
        <GlassPressCard className={`p-6 space-y-6 h-full flex flex-col justify-between ${
          theme === 'light' ? 'bg-white/80 border-slate-200 shadow-lg text-slate-900' : ''
        }`}>
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className={`p-2.5 rounded-xl border ${accentClasses.badgeBg}`}>
              <Palette className={`w-5 h-5 ${accentClasses.text}`} />
            </div>
            <h2 className="text-sm font-bold font-['SF_Pro_Display'] uppercase tracking-wider">
              {t('settings.appearance')}
            </h2>
          </div>

          <div className="space-y-5 my-auto">
            {/* Theme Toggle */}
            <div className="space-y-2">
              <span className={`text-xs font-medium block ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                {t('settings.theme')}
              </span>
              <div className={`grid grid-cols-2 gap-3 p-1.5 rounded-2xl border ${
                theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-black/40 border-white/10'
              }`}>
                <button
                  onClick={() => {
                    setTheme('dark');
                    showToast(language === 'hi' ? 'गहरा (डार्क) मोड लागू किया गया' : 'Applied Dark Mode');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    theme === 'dark'
                      ? `${accentClasses.bg} text-white shadow-md`
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-white' : 'bg-slate-400'}`} />
                  <span>{t('settings.themeDark')}</span>
                </button>

                <button
                  onClick={() => {
                    setTheme('light');
                    showToast(language === 'hi' ? 'हल्का (लाइट) मोड लागू किया गया' : 'Applied Light Mode');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    theme === 'light'
                      ? `${accentClasses.bg} text-white shadow-md`
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${theme === 'light' ? 'bg-white' : 'bg-slate-500'}`} />
                  <span>{t('settings.themeLight')}</span>
                </button>
              </div>
            </div>

            {/* Accent Color Selection */}
            <div className="space-y-2">
              <span className={`text-xs font-medium block ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                {t('settings.accentColor')}
              </span>
              <div className="flex items-center gap-3 pt-1">
                {accentColorsList.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setAccentColor(item.id);
                      showToast(language === 'hi' ? `रंग बदला गया: ${item.name}` : `Accent color updated to ${item.name}`);
                    }}
                    title={`Set accent color to ${item.name}`}
                    className={`w-8 h-8 rounded-full ${item.colorBg} transition-all cursor-pointer relative flex items-center justify-center ${
                      accentColor === item.id 
                        ? `ring-4 ${item.ringColor} ring-offset-2 ${theme === 'light' ? 'ring-offset-white' : 'ring-offset-[#0b0f19]'} scale-110 shadow-lg` 
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    {accentColor === item.id && <Check className="w-4 h-4 text-white stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </GlassPressCard>

        {/* CARD 3: Account */}
        <GlassPressCard className={`p-6 space-y-6 h-full flex flex-col justify-between ${
          theme === 'light' ? 'bg-white/80 border-slate-200 shadow-lg text-slate-900' : ''
        }`}>
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className={`p-2.5 rounded-xl border ${accentClasses.badgeBg}`}>
              <User className={`w-5 h-5 ${accentClasses.text}`} />
            </div>
            <h2 className="text-sm font-bold font-['SF_Pro_Display'] uppercase tracking-wider">
              {t('settings.account')}
            </h2>
          </div>

          <div className="space-y-3.5 my-auto text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-white/5">
              <span className={theme === 'light' ? 'text-slate-600' : 'text-slate-400'}>{t('settings.operatorId')}</span>
              <span className={`font-mono font-bold px-2.5 py-1 rounded-lg border ${
                theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-white/5 border-white/10 text-white'
              }`}>
                {opCode}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-white/5">
              <span className={theme === 'light' ? 'text-slate-600' : 'text-slate-400'}>{t('settings.email')}</span>
              <span className={`font-mono truncate max-w-[180px] ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
                {email}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className={theme === 'light' ? 'text-slate-600' : 'text-slate-400'}>{t('settings.role')}</span>
              <span className={`font-semibold ${accentClasses.text}`}>
                {operatorRole}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsChangePasswordOpen(true)}
            className={`w-full py-2.5 px-4 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold font-['SF_Pro_Text'] transition-all cursor-pointer shadow-sm active:scale-95 ${
              theme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/15'
            }`}
          >
            <Lock className={`w-3.5 h-3.5 ${accentClasses.text}`} />
            <span>{t('settings.changePassword')}</span>
          </button>
        </GlassPressCard>

        {/* CARD 4: Preferences */}
        <GlassPressCard className={`p-6 space-y-6 h-full flex flex-col justify-between ${
          theme === 'light' ? 'bg-white/80 border-slate-200 shadow-lg text-slate-900' : ''
        }`}>
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className={`p-2.5 rounded-xl border ${accentClasses.badgeBg}`}>
              <Sliders className={`w-5 h-5 ${accentClasses.text}`} />
            </div>
            <h2 className="text-sm font-bold font-['SF_Pro_Display'] uppercase tracking-wider">
              {t('settings.preferences')}
            </h2>
          </div>

          <div className="space-y-4 my-auto text-xs">
            {/* Language */}
            <div className="space-y-1.5">
              <label className={`font-medium block ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                {t('settings.language')}
              </label>
              <div className="relative">
                <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={language}
                  onChange={(e) => {
                    const newLang = e.target.value as Language;
                    setLanguage(newLang);
                    if (newLang === 'hi') {
                      setOperatorRole('सुरक्षा ऑपरेटर');
                      showToast('भाषा बदलकर हिंदी कर दी गई है');
                    } else {
                      setOperatorRole('Security Operator');
                      showToast('Language changed to English');
                    }
                  }}
                  className={`w-full border rounded-2xl pl-9 pr-8 py-2.5 text-xs focus:outline-none appearance-none cursor-pointer ${
                    theme === 'light'
                      ? 'bg-slate-100 border-slate-300 text-slate-900 focus:border-blue-500'
                      : 'bg-black/40 border-white/15 text-white focus:border-teal-400'
                  }`}
                >
                  <option value="en" className="bg-slate-900 text-white">English (US)</option>
                  <option value="hi" className="bg-slate-900 text-white">हिंदी (Hindi)</option>
                </select>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
              </div>
            </div>

            {/* Time Zone */}
            <div className="space-y-1.5">
              <label className={`font-medium block ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                {t('settings.timeZone')}
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={timeZone}
                  onChange={(e) => {
                    setTimeZone(e.target.value);
                    showToast('Time Zone updated');
                  }}
                  className={`w-full border rounded-2xl pl-9 pr-8 py-2.5 text-xs focus:outline-none appearance-none cursor-pointer ${
                    theme === 'light'
                      ? 'bg-slate-100 border-slate-300 text-slate-900 focus:border-blue-500'
                      : 'bg-black/40 border-white/15 text-white focus:border-teal-400'
                  }`}
                >
                  <option value="Asia/Kolkata (UTC +05:30)" className="bg-slate-900 text-white">Asia/Kolkata (UTC +05:30)</option>
                  <option value="UTC (UTC +00:00)" className="bg-slate-900 text-white">UTC (UTC +00:00)</option>
                  <option value="America/New_York (UTC -05:00)" className="bg-slate-900 text-white">America/New_York (UTC -05:00)</option>
                  <option value="Europe/London (UTC +00:00)" className="bg-slate-900 text-white">Europe/London (UTC +00:00)</option>
                </select>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
              </div>
            </div>

            {/* Date Format */}
            <div className="space-y-1.5">
              <label className={`font-medium block ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                {t('settings.dateFormat')}
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={dateFormat}
                  onChange={(e) => {
                    setDateFormat(e.target.value);
                    showToast(`Date format set to ${e.target.value}`);
                  }}
                  className={`w-full border rounded-2xl pl-9 pr-8 py-2.5 text-xs focus:outline-none appearance-none cursor-pointer font-mono ${
                    theme === 'light'
                      ? 'bg-slate-100 border-slate-300 text-slate-900 focus:border-blue-500'
                      : 'bg-black/40 border-white/15 text-white focus:border-teal-400'
                  }`}
                >
                  <option value="DD/MM/YYYY" className="bg-slate-900 text-white">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY" className="bg-slate-900 text-white">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD" className="bg-slate-900 text-white">YYYY-MM-DD</option>
                </select>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
              </div>
            </div>
          </div>
        </GlassPressCard>

        {/* CARD 5: Security */}
        <GlassPressCard className={`p-6 space-y-6 h-full flex flex-col justify-between ${
          theme === 'light' ? 'bg-white/80 border-slate-200 shadow-lg text-slate-900' : ''
        }`}>
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className={`p-2.5 rounded-xl border ${accentClasses.badgeBg}`}>
              <ShieldCheck className={`w-5 h-5 ${accentClasses.text}`} />
            </div>
            <h2 className="text-sm font-bold font-['SF_Pro_Display'] uppercase tracking-wider">
              {t('settings.security')}
            </h2>
          </div>

          <div className="space-y-3.5 my-auto text-xs">
            {/* 2FA */}
            <div 
              onClick={() => {
                setTwoFactorEnabled(!twoFactorEnabled);
                showToast(`${t('settings.twoFactor')} ${!twoFactorEnabled ? t('settings.enabled') : t('settings.disabled')}`);
              }}
              className="flex items-center justify-between py-2 border-b border-white/5 cursor-pointer hover:bg-white/[0.02] px-1 rounded-xl transition-colors group"
            >
              <span className={theme === 'light' ? 'text-slate-700' : 'text-slate-300'}>{t('settings.twoFactor')}</span>
              <div className="flex items-center gap-1.5">
                <span className={`font-semibold ${twoFactorEnabled ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {twoFactorEnabled ? t('settings.enabled') : t('settings.disabled')}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* Session Timeout */}
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className={theme === 'light' ? 'text-slate-700' : 'text-slate-300'}>{t('settings.sessionTimeout')}</span>
              <div className="flex items-center gap-1.5">
                <span className={`font-semibold ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>{sessionTimeout}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </div>
            </div>

            {/* Last Login */}
            <div className="flex items-center justify-between py-2">
              <span className={theme === 'light' ? 'text-slate-700' : 'text-slate-300'}>{t('settings.lastLogin')}</span>
              <span className="font-mono text-slate-400">
                {language === 'hi' ? 'आज, शाम 07:41 बजे' : 'Today, 07:41 PM'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsManageSecurityOpen(true)}
            className={`w-full py-2.5 px-4 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold font-['SF_Pro_Text'] transition-all cursor-pointer shadow-sm active:scale-95 ${
              theme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/15'
            }`}
          >
            <Shield className={`w-3.5 h-3.5 ${accentClasses.text}`} />
            <span>{t('settings.manageSecurity')}</span>
          </button>
        </GlassPressCard>

        {/* CARD 6: About SpectraGuard */}
        <GlassPressCard className={`p-6 space-y-6 h-full flex flex-col justify-between ${
          theme === 'light' ? 'bg-white/80 border-slate-200 shadow-lg text-slate-900' : ''
        }`}>
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className={`p-2.5 rounded-xl border ${accentClasses.badgeBg}`}>
              <Info className={`w-5 h-5 ${accentClasses.text}`} />
            </div>
            <h2 className="text-sm font-bold font-['SF_Pro_Display'] uppercase tracking-wider">
              {t('settings.about')}
            </h2>
          </div>

          <div className="space-y-3.5 my-auto text-xs">
            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className={theme === 'light' ? 'text-slate-600' : 'text-slate-400'}>{t('settings.version')}</span>
              <span className={`font-mono font-bold px-2.5 py-0.5 rounded-md border ${accentClasses.badgeBg}`}>
                v1.0.0
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className={theme === 'light' ? 'text-slate-600' : 'text-slate-400'}>{t('settings.build')}</span>
              <span className={`font-semibold ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
                {language === 'hi' ? 'हैकाथॉन संस्करण' : 'Hackathon Edition'}
              </span>
            </div>

            <p className={`text-[11px] leading-relaxed pt-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
              {language === 'hi' 
                ? 'कैमरा अखंडता इंटेलिजेंस के लिए भौतिकी-आधारित फ़्रीक्वेंसी डोमेन एआई।'
                : 'Physics-Informed Frequency Domain AI for Camera Integrity Intelligence.'
              }
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setIsDocsModalOpen(true)}
              className={`py-2.5 px-3 rounded-2xl border flex items-center justify-center gap-1.5 text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95 ${
                theme === 'light'
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/15'
              }`}
            >
              <BookOpen className={`w-3.5 h-3.5 ${accentClasses.text}`} />
              <span>{t('settings.documentation')}</span>
            </button>

            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className={`py-2.5 px-3 rounded-2xl border flex items-center justify-center gap-1.5 text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95 ${
                theme === 'light'
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/15'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('settings.privacyPolicy')}</span>
            </button>
          </div>
        </GlassPressCard>

      </div>

      {/* Logout Action Bar */}
      <div className="flex justify-center pt-2">
        <GlassPressCard className={`p-6 max-w-md w-full text-center space-y-4 border ${
          theme === 'light' 
            ? 'bg-white/80 border-slate-200 shadow-lg text-slate-900' 
            : 'border-rose-500/20 bg-rose-950/10 text-white'
        }`}>
          <div className="space-y-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400 font-['SF_Pro_Display']">
              {language === 'hi' ? 'सत्र नियंत्रण' : 'Session Control'}
            </h3>
            <p className={`text-xs font-['SF_Pro_Text'] ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
              {language === 'hi'
                ? 'अपने सक्रिय सुरक्षा ऑपरेटर सत्र को समाप्त करें और लैंडिंग पृष्ठ पर वापस लौटें।'
                : 'End your active security operator session and return to the main landing page.'}
            </p>
          </div>
          <button
            onClick={() => logout()}
            className={`w-full py-3 px-4 rounded-2xl border font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 font-['SF_Pro_Text'] ${
              theme === 'light'
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-300 shadow-sm shadow-rose-100/50'
                : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/25'
            }`}
          >
            <LogOut className={`w-4 h-4 ${theme === 'light' ? 'text-rose-600' : 'text-rose-400'}`} />
            <span>{language === 'hi' ? 'सत्र समाप्त करें (लॉग आउट)' : 'End Session (Log Out)'}</span>
          </button>
        </GlassPressCard>
      </div>

      {/* Footer Branding */}
      <div className={`pt-8 text-center border-t text-xs font-mono ${
        theme === 'light' ? 'border-slate-300 text-slate-600' : 'border-white/10 text-slate-500'
      }`}>
        <p>© 2026 SpectraGuard. All rights reserved.</p>
      </div>

      {/* MODAL 1: Edit Profile */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className={`w-full max-w-md rounded-3xl border p-6 space-y-5 shadow-2xl relative ${
            theme === 'light' ? 'bg-white text-slate-900 border-slate-200' : 'bg-[#0b0e1b] border-white/20 text-white'
          }`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold font-['SF_Pro_Display'] flex items-center gap-2">
                <User className={`w-4 h-4 ${accentClasses.text}`} />
                <span>{language === 'hi' ? 'ऑपरेटर प्रोफ़ाइल संपादित करें' : 'Edit Operator Profile'}</span>
              </h3>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-medium block">{t('settings.operatorId')}</label>
                <input
                  type="text"
                  value={opCode}
                  onChange={(e) => setOpCode(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 font-mono ${
                    theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-black/50 border-white/15 text-white'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium block">{t('settings.role')}</label>
                <input
                  type="text"
                  value={operatorRole}
                  onChange={(e) => setOperatorRole(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 ${
                    theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-black/50 border-white/15 text-white'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium block">{t('settings.email')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 font-mono ${
                    theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-black/50 border-white/15 text-white'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold"
              >
                {t('btn.cancel')}
              </button>
              <button
                onClick={() => {
                  setIsEditProfileOpen(false);
                  showToast(language === 'hi' ? 'ऑपरेटर प्रोफ़ाइल अपडेट की गई' : 'Operator Profile Updated');
                }}
                className={`px-4 py-2 rounded-xl ${accentClasses.bg} text-white text-xs font-bold shadow-lg`}
              >
                {t('btn.save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Change Password */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className={`w-full max-w-md rounded-3xl border p-6 space-y-5 shadow-2xl relative ${
            theme === 'light' ? 'bg-white text-slate-900 border-slate-200' : 'bg-[#0b0e1b] border-white/20 text-white'
          }`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold font-['SF_Pro_Display'] flex items-center gap-2">
                <Lock className={`w-4 h-4 ${accentClasses.text}`} />
                <span>{language === 'hi' ? 'ऑपरेटर पासवर्ड बदलें' : 'Change Operator Password'}</span>
              </h3>
              <button
                onClick={() => setIsChangePasswordOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-medium block">{language === 'hi' ? 'वर्तमान पासवर्ड' : 'Current Password'}</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className={`w-full border rounded-xl px-3 py-2 ${
                    theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-black/50 border-white/15 text-white'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium block">{language === 'hi' ? 'नया पासवर्ड' : 'New Password'}</label>
                <input
                  type="password"
                  placeholder="New password"
                  className={`w-full border rounded-xl px-3 py-2 ${
                    theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-black/50 border-white/15 text-white'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setIsChangePasswordOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold"
              >
                {t('btn.cancel')}
              </button>
              <button
                onClick={() => {
                  setIsChangePasswordOpen(false);
                  showToast(language === 'hi' ? 'पासवर्ड सफलतापूर्वक अपडेट किया गया' : 'Password Updated Successfully');
                }}
                className={`px-4 py-2 rounded-xl ${accentClasses.bg} text-white text-xs font-bold shadow-lg`}
              >
                {t('btn.updatePassword')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Manage Security */}
      {isManageSecurityOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className={`w-full max-w-md rounded-3xl border p-6 space-y-5 shadow-2xl relative ${
            theme === 'light' ? 'bg-white text-slate-900 border-slate-200' : 'bg-[#0b0e1b] border-white/20 text-white'
          }`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold font-['SF_Pro_Display'] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{t('settings.security')}</span>
              </h3>
              <button
                onClick={() => setIsManageSecurityOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className={`flex items-center justify-between p-3 rounded-2xl border ${
                theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-black/40 border-white/10'
              }`}>
                <div>
                  <span className="font-bold block">{t('settings.twoFactor')}</span>
                  <span className="text-[11px] text-slate-400">
                    {language === 'hi' ? 'लॉगिन पर प्रमाणीकरण कोड आवश्यक' : 'Require authenticator code on login'}
                  </span>
                </div>
                <button
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors ${twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="font-medium block">{t('settings.sessionTimeout')}</label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 ${
                    theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-black/50 border-white/15 text-white'
                  }`}
                >
                  <option value="15 Minutes">15 Minutes</option>
                  <option value="30 Minutes">30 Minutes</option>
                  <option value="1 Hour">1 Hour</option>
                  <option value="4 Hours">4 Hours</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  setIsManageSecurityOpen(false);
                  showToast(language === 'hi' ? 'सुरक्षा विन्यास सहेजे गए' : 'Security Configurations Saved');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg"
              >
                {t('btn.save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: SpectraGuard Documentation Popup */}
      {isDocsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className={`w-full max-w-2xl rounded-3xl border p-6 space-y-5 shadow-2xl relative max-h-[85vh] flex flex-col ${
            theme === 'light' ? 'bg-white text-slate-900 border-slate-200' : 'bg-[#0b0e1b] border-white/20 text-white'
          }`}>
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${accentClasses.badgeBg}`}>
                  <BookOpen className={`w-5 h-5 ${accentClasses.text}`} />
                </div>
                <div>
                  <h3 className="text-base font-bold font-['SF_Pro_Display']">
                    {language === 'hi' ? 'स्पेक्ट्रागार्ड दस्तावेज़' : 'SpectraGuard Documentation'}
                  </h3>
                  <p className="text-xs text-slate-400">Physics-Informed Frequency Domain AI Architecture</p>
                </div>
              </div>
              <button
                onClick={() => setIsDocsModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="overflow-y-auto space-y-4 pr-2 text-xs leading-relaxed font-['SF_Pro_Text'] custom-scrollbar">
              <div className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                theme === 'light' ? 'bg-blue-50 border-blue-200 text-slate-800' : 'bg-blue-950/20 border-blue-500/30 text-blue-200'
              }`}>
                <Sparkles className={`w-4 h-4 shrink-0 mt-0.5 ${accentClasses.text}`} />
                <p>
                  {language === 'hi'
                    ? 'स्पेक्ट्रागार्ड ऑप्टिकल लेंस की छेड़छाड़, डीफोकसिंग और डिजिटल एनोमली का पता लगाने के लिए 2D फास्ट फूरियर ट्रांसफॉर्म (FFT) और स्पेक्ट्रल रेसिड्यू भौतिकी का उपयोग करता है।'
                    : 'SpectraGuard utilizes advanced 2D Fast Fourier Transform (FFT) and high-frequency spectral residue physics to detect optical lens tampering, defocusing, and digital injection anomalies in real time.'
                  }
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold font-['SF_Pro_Display'] border-b border-white/10 pb-1">
                  {language === 'hi' ? '1. मुख्य आर्किटेक्चर' : '1. Core Architecture'}
                </h4>
                <p className={theme === 'light' ? 'text-slate-700' : 'text-slate-300'}>
                  {language === 'hi'
                    ? 'सीसीटीवी फ़ीड का फ़्रीक्वेंसी विघटन किया जाता है। उच्च-आवृत्ति ऊर्जा अनुपात का विश्लेषण करके वास्तविक समय में किसी भी भौतिक रुकावट या डिजिटल छेड़छाड़ का पता लगाया जाता है।'
                    : 'CCTV feed streams undergo spatial-frequency decomposition. By calculating the high-frequency energy ratio across spatial dimensions, the engine measures high-frequency degradation indicative of physical occlusion or digital alteration.'
                  }
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold font-['SF_Pro_Display'] border-b border-white/10 pb-1">
                  {language === 'hi' ? '2. विसंगति श्रेणियां' : '2. Anomaly Classification Categories'}
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong className="text-rose-400">{t('status.tampered')}:</strong> {language === 'hi' ? 'उच्च-आवृत्ति में 45% से अधिक की गिरावट तथा लेंस धुंधला होना।' : 'High-frequency drop >45% combined with optical blurring.'}</li>
                  <li><strong className="text-emerald-400">{t('status.nominal')}:</strong> {language === 'hi' ? 'सामान्य स्पेक्ट्रल प्रतिक्रिया (>85% गुणवत्ता)।' : 'Frequency distribution matches baseline response (>85%).'}</li>
                  <li><strong className="text-amber-400">{t('status.investigating')}:</strong> {language === 'hi' ? 'संदेहास्पद स्पेक्ट्रल गड़बड़ी जो समीक्षा के लिए चिन्हित है।' : 'Mid-tier spectral disturbance flagged for review.'}</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10 shrink-0">
              <span className="text-[11px] font-mono text-slate-400">Version 1.0.0 • SpectraGuard AI</span>
              <button
                onClick={() => setIsDocsModalOpen(false)}
                className={`px-5 py-2 rounded-xl ${accentClasses.bg} text-white text-xs font-bold transition-all shadow-lg`}
              >
                {t('btn.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Privacy Policy Popup */}
      {isPrivacyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className={`w-full max-w-2xl rounded-3xl border p-6 space-y-5 shadow-2xl relative max-h-[85vh] flex flex-col ${
            theme === 'light' ? 'bg-white text-slate-900 border-slate-200' : 'bg-[#0b0e1b] border-white/20 text-white'
          }`}>
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-['SF_Pro_Display']">
                    {language === 'hi' ? 'स्पेक्ट्रागार्ड गोपनीयता नीति' : 'SpectraGuard Privacy & Security Policy'}
                  </h3>
                  <p className="text-xs text-slate-400">Zero-Trust Enterprise Surveillance Framework</p>
                </div>
              </div>
              <button
                onClick={() => setIsPrivacyModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="overflow-y-auto space-y-4 pr-2 text-xs leading-relaxed font-['SF_Pro_Text'] custom-scrollbar">
              <div className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                theme === 'light' ? 'bg-emerald-50 border-emerald-200 text-slate-800' : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
              }`}>
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  {language === 'hi'
                    ? 'स्पेक्ट्रागार्ड स्थानीयकृत इन-मेमोरी मॉडल पर काम करता है। विश्लेषण के बाद वीडियो फ़्रेम तुरंत हटा दिए जाते हैं।'
                    : 'SpectraGuard operates on a localized, zero-retention edge computing model. Video stream frames are processed in-memory and immediately discarded following spectral analysis.'
                  }
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold font-['SF_Pro_Display'] border-b border-white/10 pb-1">
                  {language === 'hi' ? '1. डेटा संग्रहण और सुरक्षा' : '1. Data Collection & Processing'}
                </h4>
                <p className={theme === 'light' ? 'text-slate-700' : 'text-slate-300'}>
                  {language === 'hi'
                    ? 'केवल गणितीय फ़्रीक्वेंसी मेट्रिक्स सुरक्षित रूप से सहेजे जाते हैं। कोई भी कच्चा वीडियो डेटा क्लाउड में संग्रहीत नहीं किया जाता है।'
                    : 'Only mathematical spectral features (e.g., FFT coefficients and spatial metrics) are persisted into forensic audit logs. Raw video frames are never stored or transmitted to third-party cloud servers.'
                  }
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10 shrink-0">
              <span className="text-[11px] font-mono text-slate-400">Effective: August 2026 • Security Division</span>
              <button
                onClick={() => setIsPrivacyModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg"
              >
                {t('btn.acknowledge')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
