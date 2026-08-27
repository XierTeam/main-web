<script setup>
import { useAppI18n } from '../../composables/useI18n'
import { useRevealOnScroll } from '../../composables/useReveal'
import ToolCard from './ToolCard.vue'
import AppIcon from '../ui/AppIcon.vue'

const props = defineProps({
  sites: { type: Array, default: () => [] },
})

const { t } = useAppI18n()
const { container } = useRevealOnScroll(() => props.sites)
</script>

<template>
  <div ref="container">
    <div
      v-if="sites.length"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <div v-for="(site, i) in sites" :key="site.id" class="h-full" data-reveal :style="{ '--reveal-delay': `${(i % 4) * 80}ms` }">
        <ToolCard :site="site" />
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="card flex flex-col items-center justify-center px-6 py-16 text-center">
      <div
        class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"
      >
        <AppIcon name="search" :size="26" />
      </div>
      <h3 class="mt-4 font-bold text-slate-700">{{ t('tools.empty') }}</h3>
      <p class="mt-1 text-sm text-slate-400">{{ t('tools.emptyHint') }}</p>
    </div>
  </div>
</template>
