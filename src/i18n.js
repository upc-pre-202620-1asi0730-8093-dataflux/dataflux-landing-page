import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import es from './locales/es.json'

let locale = 'en'
try {
  const saved = localStorage.getItem('rentbuild-language')
  if (saved === 'en' || saved === 'es') locale = saved
} catch {
  // Language selection still works when browser storage is unavailable.
}
document.documentElement.lang = locale

export default createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'en',
  messages: { en, es },
})
