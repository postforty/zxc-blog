import { ReactNode, useEffect, useState } from 'react'; // Added useEffect, useState
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

// Initialize i18n
i18n
  .use(resourcesToBackend((language: string, namespace: string) => import(`../../public/locales/${language}/${namespace}.json`)))
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: 'en',
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
