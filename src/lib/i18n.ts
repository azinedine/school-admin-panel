import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '@/locales/en.json'
import fr from '@/locales/fr.json'
import ar from '@/locales/ar.json'

// Get initial language from localStorage (zustand persisted state)
const getInitialLanguage = (): string => {
  try {
    const stored = localStorage.getItem('app-settings')
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed?.state?.language || 'en'
    }
  } catch {
    // Fallback to default
  }
  return 'en'
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    ar: { translation: ar },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes values
  },
})

// Update HTML dir attribute for RTL support
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = lng
})

// Set initial direction
document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
document.documentElement.lang = i18n.language

export default i18n
