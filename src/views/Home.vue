<script setup>
import { computed, ref } from 'vue'
import { useSubSiteStore } from '../stores/subSite'
import { useAppI18n } from '../composables/useI18n'
import { useSearch } from '../composables/useSearch'
import HeroSection from '../components/home/HeroSection.vue'
import StatsBar from '../components/home/StatsBar.vue'
import ToolCategoryTabs from '../components/home/ToolCategoryTabs.vue'
import ToolGrid from '../components/home/ToolGrid.vue'
import SubSiteShowcase from '../components/home/SubSiteShowcase.vue'
import AppIcon from '../components/ui/AppIcon.vue'

const store = useSubSiteStore()
const { t } = useAppI18n()
const search = useSearch()

const activeCategory = ref('all')

/** 分类筛选 + 关键词搜索，均由 Store 提供过滤逻辑 */
const filteredSites = computed(() => {
  let list = store.searchSubSites(search.keyword.value)
  if (activeCategory.value !== 'all') {
    list = list.filter((s) => s.category === activeCategory.value)
  }
  return list
})

function goTools() {
  document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div>
    <HeroSection />
    <StatsBar />

    <!-- 全部工具（分类筛选 + 搜索联动） -->
    <section id="tools" class="container-page scroll-mt-20 py-10 sm:py-14">
      <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 class="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {{ t('tools.sectionTitle') }}
          </h2>
          <p class="mt-1.5 text-slate-500">{{ t('tools.sectionSubtitle') }}</p>
        </div>
        <p
          v-if="search.keyword.value || activeCategory !== 'all'"
          class="text-sm font-medium text-slate-400"
        >
          {{ t('tools.resultCount', { n: filteredSites.length }) }}
        </p>
      </div>

      <ToolCategoryTabs v-model="activeCategory" />
      <div class="mt-6">
        <ToolGrid :sites="filteredSites" />
      </div>
    </section>

    <!-- 首页展示区块（featuredGroups 驱动） -->
    <SubSiteShowcase v-for="group in store.featuredGroups" :key="group.id" :group="group" />

    <!-- 底部 CTA -->
    <section class="container-page py-12 sm:py-16">
      <div
        class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500 px-6 py-14 text-center text-white shadow-xl shadow-brand-500/25 sm:px-12"
      >
        <div class="pointer-events-none absolute inset-0" aria-hidden="true">
          <div class="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"></div>
          <div class="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/10 blur-2xl"></div>
        </div>
        <h2 class="relative text-2xl font-extrabold tracking-tight sm:text-3xl">
          {{ t('cta.title') }}
        </h2>
        <p class="relative mx-auto mt-3 max-w-md text-sm text-white/80 sm:text-base">
          {{ t('cta.subtitle') }}
        </p>
        <button
          class="relative mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-600 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
          @click="goTools"
        >
          {{ t('cta.button') }}
          <AppIcon name="arrow-right" :size="16" />
        </button>
      </div>
    </section>
  </div>
</template>
