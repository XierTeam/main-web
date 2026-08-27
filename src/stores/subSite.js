import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/**
 * 子站配置全局 Store
 * 数据源：public/config/sub-sites.json（构建后可经 /config/sub-sites.json 访问）
 * 所有组件只消费本 Store 的 getters，保证"改 JSON 即改全站"。
 */
export const useSubSiteStore = defineStore('subSite', () => {
  // ── state ──
  const config = ref(null)
  const loading = ref(false)
  const error = ref('')

  // ── actions ──
  async function fetchConfig() {
    loading.value = true
    error.value = ''
    try {
      const res = await fetch('/config/sub-sites.json', { cache: 'no-cache' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      config.value = await res.json()
    } catch (e) {
      error.value = e?.message || 'Failed to load configuration'
      config.value = null
    } finally {
      loading.value = false
    }
  }

  // ── getters ──
  /** 分类（未过滤，含隐藏项） */
  const categories = computed(() => config.value?.categories ?? [])
  /** 子站（未过滤） */
  const subSites = computed(() => config.value?.subSites ?? [])
  /** 首页展示区块 */
  const featuredGroups = computed(() => config.value?.featuredGroups ?? [])
  /** 首页其他配置（stats / heroKeywords） */
  const homePage = computed(() => config.value?.homePage ?? {})

  /** visible=true 且按 sort 升序的分类 */
  const visibleCategories = computed(() =>
    categories.value
      .filter((c) => c.visible !== false)
      .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)),
  )

  /** visible=true 且按 sort 升序的子站 */
  const visibleSubSites = computed(() =>
    subSites.value
      .filter((s) => s.visible !== false)
      .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)),
  )

  /** 按分类 id 取子站（同分类内按 sort 排序） */
  const subSitesByCategory = (categoryId) =>
    visibleSubSites.value.filter((s) => s.category === categoryId)

  /** 按 featuredGroup 的 siteIds 提取子站对象（保持 siteIds 顺序，缺失的 id 自动忽略） */
  const featuredSubSites = (group) => {
    const byId = new Map(visibleSubSites.value.map((s) => [s.id, s]))
    return (group?.siteIds ?? []).map((id) => byId.get(id)).filter(Boolean)
  }

  /** 按 id 查找单个子站 */
  const subSiteById = (id) => visibleSubSites.value.find((s) => s.id === id) ?? null

  /** 关键词搜索：匹配 name / shortDesc / description（中英文）/ tags / id / path */
  const searchSubSites = (keyword) => {
    const kw = (keyword ?? '').trim().toLowerCase()
    if (!kw) return visibleSubSites.value
    return visibleSubSites.value.filter((s) => {
      const haystack = [
        s.id,
        s.path,
        ...Object.values(s.name ?? {}),
        ...Object.values(s.shortDesc ?? {}),
        ...Object.values(s.description ?? {}),
        ...(s.tags ?? []),
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(kw)
    })
  }

  return {
    config,
    loading,
    error,
    fetchConfig,
    categories,
    subSites,
    featuredGroups,
    homePage,
    visibleCategories,
    visibleSubSites,
    subSitesByCategory,
    featuredSubSites,
    subSiteById,
    searchSubSites,
  }
})
