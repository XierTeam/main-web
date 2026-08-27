import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { STORAGE_KEY } from '../i18n.js'

function applyLocale(locale) {
  document.documentElement.lang = locale === 'zh-CN' ? 'zh-CN' : 'en'
  document.title =
    locale === 'zh-CN' ? 'ToolBox · 一站式在线工具平台' : 'ToolBox · All-in-one Online Tools'
}

/**
 * 语言切换 + JSON 多语言字段解析
 *
 * localize(obj) 按当前语言读取 {zh, en} 对象：
 *   obj[当前语言] ?? obj.zh ?? obj.en ?? fallback
 */
export function useAppI18n() {
  const { locale, t } = useI18n()

  const setLocale = (l) => {
    const next = l === 'en' ? 'en' : 'zh-CN'
    locale.value = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore private mode */
    }
    applyLocale(next)
  }

  const localize = (obj, fallback = '') =>
    obj?.[locale.value] ?? obj?.zh ?? obj?.en ?? fallback

  const isEn = computed(() => locale.value === 'en')

  return { locale, isEn, t, setLocale, localize }
}
