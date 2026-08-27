import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN.json'
import en from './locales/en.json'

export const STORAGE_KEY = 'toolbox-locale'

function detectLocale() {
  if (typeof localStorage === 'undefined') return 'zh-CN'
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved === 'en' ? 'en' : 'zh-CN'
}

const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    en,
  },
})

export default i18n
