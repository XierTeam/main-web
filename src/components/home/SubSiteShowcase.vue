<script setup>
import { computed } from 'vue'
import { useSubSiteStore } from '../../stores/subSite'
import { useAppI18n } from '../../composables/useI18n'
import { useRevealOnScroll } from '../../composables/useReveal'
import SubSiteCard from './SubSiteCard.vue'
import AppIcon from '../ui/AppIcon.vue'

/**
 * 首页展示区块，完全由 featuredGroups 驱动：
 * 标题/副标题/布局（grid | horizontal | list）/列数/子站顺序均来自 JSON。
 */
const props = defineProps({
  group: { type: Object, required: true },
})

const store = useSubSiteStore()
const { t, localize } = useAppI18n()
const { container } = useRevealOnScroll()

const sites = computed(() => store.featuredSubSites(props.group))

/** 列数配置 → 响应式网格类（UnoCSS 静态扫描，需字面量类） */
const colClass = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
}
const gridClass = computed(
  () => colClass[Math.max(1, Math.min(4, props.group.columns ?? 4))] || colClass[4],
)
</script>

<template>
  <section v-if="sites.length" class="container-page py-10 sm:py-14">
    <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div data-reveal>
        <h2 class="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          {{ localize(group.title) }}
        </h2>
        <p v-if="group.subtitle" class="mt-1.5 text-slate-500">{{ localize(group.subtitle) }}</p>
      </div>
      <button
        data-reveal
        class="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
        @click="
          document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })
        "
      >
        {{ t('tools.viewAll') }}
        <AppIcon name="arrow-right" :size="14" />
      </button>
    </div>

    <div ref="container">
      <!-- grid 布局 -->
      <div v-if="group.layout === 'grid'" class="grid grid-cols-1 gap-5" :class="gridClass">
        <div
          v-for="(site, i) in sites"
          :key="site.id"
          data-reveal
          class="h-full"
          :style="{ '--reveal-delay': `${(i % 4) * 90}ms` }"
        >
          <SubSiteCard :site="site" layout="full" />
        </div>
      </div>

      <!-- horizontal 布局 -->
      <div
        v-else-if="group.layout === 'horizontal'"
        class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
      >
        <div
          v-for="(site, i) in sites"
          :key="site.id"
          data-reveal
          class="h-full"
          :style="{ '--reveal-delay': `${i * 90}ms` }"
        >
          <SubSiteCard :site="site" layout="horizontal" />
        </div>
      </div>

      <!-- list 布局 -->
      <div v-else class="space-y-3">
        <div
          v-for="(site, i) in sites"
          :key="site.id"
          data-reveal
          :style="{ '--reveal-delay': `${i * 60}ms` }"
        >
          <SubSiteCard :site="site" layout="list" />
        </div>
      </div>
    </div>
  </section>
</template>
