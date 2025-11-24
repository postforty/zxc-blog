import { ReactNode, useEffect, useState } from 'react';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

// Detect initial language
const getInitialLanguage = (): string => {
  // 1. Check localStorage for user preference (only on client)
  if (typeof window !== 'undefined') {
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage && ['en', 'ko'].includes(savedLanguage)) {
      return savedLanguage;
    }
  }

  // 2. Detect browser language (client only)
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language || (navigator as any).userLanguage;
    if (browserLang) {
      const langCode = browserLang.split('-')[0];
      if (['en', 'ko'].includes(langCode)) {
        return langCode;
      }
    }
  }

  // 3. Fallback to Korean
  return 'ko';
};

// Initialize i18n
i18n
  .use(resourcesToBackend((language: string, namespace: string) => import(`../../public/locales/${language}/${namespace}.json`)))
  .use(initReactI18next)
  .init({
    debug: false,
    lng: getInitialLanguage(),
    fallbackLng: 'ko',
    supportedLngs: ['en', 'ko'],
    interpolation: {
      escapeValue: false,
    },
    ns: ['translation'],
    defaultNS: 'translation',
    react: {
      useSuspense: false,
    },
  });

// Save language preference to localStorage when it changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (i18n.isInitialized) {
      setIsInitialized(true);
    } else {
      i18n.on('initialized', () => setIsInitialized(true));
    }
    return () => {
      i18n.off('initialized', () => setIsInitialized(true));
    };
  }, []);

  if (!isInitialized) {
    return null; // Or a loading spinner
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
