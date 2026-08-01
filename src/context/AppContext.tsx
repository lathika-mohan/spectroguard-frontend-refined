import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type ThemeMode = 'dark' | 'light';
export type AccentColor = 'blue' | 'purple' | 'teal' | 'amber' | 'rose';
export type Language = 'en' | 'hi';

interface AppContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  accentColor: AccentColor;
  setAccentColor: (accent: AccentColor) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  // Accent color helper classes
  accentClasses: {
    bg: string;
    bgHover: string;
    text: string;
    border: string;
    ring: string;
    glow: string;
    badgeBg: string;
    gradient: string;
  };
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    'nav.dashboard': 'Dashboard',
    'nav.cameras': 'Cameras',
    'nav.predictions': 'Prediction',
    'nav.vault': 'Vault',
    'nav.settings': 'Settings',
    'nav.search': 'Search tools, cameras, models...',

    // Settings Headers
    'settings.title': 'Settings',
    'settings.subtitle': 'Manage system preferences, account credentials, and display themes',
    'settings.operatorProfile': 'Operator Profile',
    'settings.appearance': 'Appearance',
    'settings.account': 'Account',
    'settings.preferences': 'Preferences',
    'settings.security': 'Security',
    'settings.about': 'About SpectraGuard',

    // Operator Profile
    'settings.editProfile': 'Edit Profile',
    'settings.operatorRole': 'Security Operator',

    // Appearance
    'settings.theme': 'Theme',
    'settings.themeDark': 'Dark',
    'settings.themeLight': 'Light',
    'settings.accentColor': 'Accent Color',

    // Account
    'settings.operatorId': 'Operator ID',
    'settings.email': 'Email',
    'settings.role': 'Role',
    'settings.changePassword': 'Change Password',

    // Preferences
    'settings.language': 'Language',
    'settings.timeZone': 'Time Zone',
    'settings.dateFormat': 'Date Format',

    // Security
    'settings.twoFactor': 'Two-Factor Authentication',
    'settings.sessionTimeout': 'Session Timeout',
    'settings.lastLogin': 'Last Login',
    'settings.manageSecurity': 'Manage Security',
    'settings.enabled': 'Enabled',
    'settings.disabled': 'Disabled',

    // About
    'settings.version': 'Version',
    'settings.build': 'Build',
    'settings.documentation': 'Documentation',
    'settings.privacyPolicy': 'Privacy Policy',

    // Actions & Buttons
    'btn.save': 'Save Changes',
    'btn.cancel': 'Cancel',
    'btn.close': 'Close',
    'btn.updatePassword': 'Update Password',
    'btn.acknowledge': 'Acknowledge Policy',

    // Common labels
    'status.online': 'Online',
    'status.nominal': 'Nominal',
    'status.tampered': 'Tampering Detected',
    'status.investigating': 'Investigating',
  },
  hi: {
    // Nav
    'nav.dashboard': 'डैशबोर्ड',
    'nav.cameras': 'कैमरे',
    'nav.predictions': 'पूर्वानुमान',
    'nav.vault': 'वॉल्ट',
    'nav.settings': 'सेटिंग्स',
    'nav.search': 'उपकरण, कैमरे, मॉडल खोजें...',

    // Settings Headers
    'settings.title': 'सेटिंग्स',
    'settings.subtitle': 'सिस्टम प्राथमिकताएं, ऑपरेटर क्रेडेंशियल्स और डिस्प्ले थीम प्रबंधित करें',
    'settings.operatorProfile': 'ऑपरेटर प्रोफ़ाइल',
    'settings.appearance': 'उपस्थिति (रंग और थीम)',
    'settings.account': 'खाता विवरण',
    'settings.preferences': 'प्राथमिकताएं',
    'settings.security': 'सुरक्षा सेटिंग्स',
    'settings.about': 'स्पेक्ट्रागार्ड के बारे में',

    // Operator Profile
    'settings.editProfile': 'प्रोफ़ाइल संपादित करें',
    'settings.operatorRole': 'सुरक्षा ऑपरेटर',

    // Appearance
    'settings.theme': 'थीम',
    'settings.themeDark': 'डार्क (गहरा)',
    'settings.themeLight': 'लाइट (हल्का)',
    'settings.accentColor': 'एक्सीेंट रंग',

    // Account
    'settings.operatorId': 'ऑपरेटर आईडी',
    'settings.email': 'ईमेल',
    'settings.role': 'भूमिका',
    'settings.changePassword': 'पासवर्ड बदलें',

    // Preferences
    'settings.language': 'भाषा (Language)',
    'settings.timeZone': 'समय क्षेत्र',
    'settings.dateFormat': 'दिनांक प्रारूप',

    // Security
    'settings.twoFactor': 'दो-कारक प्रमाणीकरण (2FA)',
    'settings.sessionTimeout': 'सत्र समय समाप्ति',
    'settings.lastLogin': 'अंतिम लॉगिन',
    'settings.manageSecurity': 'सुरक्षा प्रबंधित करें',
    'settings.enabled': 'सक्षम (Enabled)',
    'settings.disabled': 'अक्षम (Disabled)',

    // About
    'settings.version': 'संस्करण',
    'settings.build': 'निर्माण संस्करण',
    'settings.documentation': 'दस्तावेज़ (Docs)',
    'settings.privacyPolicy': 'गोपनीयता नीति',

    // Actions & Buttons
    'btn.save': 'सहेजें',
    'btn.cancel': 'रद्द करें',
    'btn.close': 'बंद करें',
    'btn.updatePassword': 'पासवर्ड अपडेट करें',
    'btn.acknowledge': 'स्वीकार करें',

    // Common labels
    'status.online': 'ऑनलाइन',
    'status.nominal': 'सामान्य',
    'status.tampered': 'छेडछाड़ पाई गई',
    'status.investigating': 'जांच जारी',
  }
};

const getAccentClasses = (accent: AccentColor) => {
  switch (accent) {
    case 'purple':
      return {
        bg: 'bg-purple-600',
        bgHover: 'hover:bg-purple-500',
        text: 'text-purple-400',
        border: 'border-purple-500/50',
        ring: 'ring-purple-500',
        glow: 'drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]',
        badgeBg: 'bg-purple-950/80 border-purple-500/40 text-purple-300',
        gradient: 'from-purple-600 to-indigo-600',
      };
    case 'teal':
      return {
        bg: 'bg-teal-600',
        bgHover: 'hover:bg-teal-500',
        text: 'text-teal-400',
        border: 'border-teal-500/50',
        ring: 'ring-teal-500',
        glow: 'drop-shadow-[0_0_8px_rgba(20,184,166,0.8)]',
        badgeBg: 'bg-teal-950/80 border-teal-500/40 text-teal-300',
        gradient: 'from-teal-600 to-cyan-600',
      };
    case 'amber':
      return {
        bg: 'bg-amber-600',
        bgHover: 'hover:bg-amber-500',
        text: 'text-amber-400',
        border: 'border-amber-500/50',
        ring: 'ring-amber-500',
        glow: 'drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]',
        badgeBg: 'bg-amber-950/80 border-amber-500/40 text-amber-300',
        gradient: 'from-amber-600 to-orange-600',
      };
    case 'rose':
      return {
        bg: 'bg-rose-600',
        bgHover: 'hover:bg-rose-500',
        text: 'text-rose-400',
        border: 'border-rose-500/50',
        ring: 'ring-rose-500',
        glow: 'drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]',
        badgeBg: 'bg-rose-950/80 border-rose-500/40 text-rose-300',
        gradient: 'from-rose-600 to-pink-600',
      };
    case 'blue':
    default:
      return {
        bg: 'bg-blue-600',
        bgHover: 'hover:bg-blue-500',
        text: 'text-cyan-300',
        border: 'border-blue-500/50',
        ring: 'ring-blue-500',
        glow: 'drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]',
        badgeBg: 'bg-blue-950/80 border-blue-500/40 text-cyan-300',
        gradient: 'from-blue-600 to-cyan-600',
      };
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [accentColor, setAccentColor] = useState<AccentColor>('blue');
  const [language, setLanguage] = useState<Language>('en');

  // Apply theme class to root html/body
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-mode');
      root.classList.remove('dark-mode');
    } else {
      root.classList.add('dark-mode');
      root.classList.remove('light-mode');
    }
  }, [theme]);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  const accentClasses = getAccentClasses(accentColor);

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        accentColor,
        setAccentColor,
        language,
        setLanguage,
        t,
        accentClasses,
      }}
    >
      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'light' 
          ? 'bg-[#eef2f6] text-slate-900' 
          : 'bg-transparent text-white'
      }`}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
