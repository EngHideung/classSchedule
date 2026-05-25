import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import id from './locales/id.json'

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
] as const

export type LanguageCode = (typeof LANGUAGES)[number]['code']

const STORAGE_KEY = 'classflow_language'

function getStoredLanguage(): LanguageCode {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'id') return stored
  const browser = navigator.language.toLowerCase()
  if (browser.startsWith('id')) return 'id'
  return 'en'
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    id: { translation: id },
  },
  lng: getStoredLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export function setAppLanguage(code: LanguageCode) {
  localStorage.setItem(STORAGE_KEY, code)
  document.documentElement.lang = code
  return i18n.changeLanguage(code)
}

document.documentElement.lang = i18n.language

export default i18n
