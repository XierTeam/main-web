<script setup>
import { computed } from 'vue'
import { useAppI18n } from '../../composables/useI18n'
import { toPath, hexToRgba } from '../../utils/format'
import AppIcon from '../ui/AppIcon.vue'
import Badge from '../ui/Badge.vue'

const props = defineProps({
  site: { type: Object, required: true },
})

const { t, localize } = useAppI18n()
const link = computed(() => toPath(props.site))
</script>

<template>
  <a
    :href="link"
    :target="site.isExternal ? '_blank' : undefined"
    :rel="site.isExternal ? 'noopener noreferrer' : undefined"
    class="group relative flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/8"
    :style="{ '--site-color': site.color }"
  >
    <span v-if="site.badge && site.badgeText" class="absolute top-4 right-4">
      <Badge :type="site.badge" :text="localize(site.badgeText)" />
    </span>

    <div class="flex items-center gap-3 pr-8">
      <span
        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105"
        :style="{ backgroundColor: hexToRgba(site.color, 0.12), color: site.color }"
      >
        <AppIcon :name="site.icon || 'box'" :size="22" />
      </span>
      <div class="min-w-0">
        <h3
          class="truncate font-bold text-slate-900 transition-colors group-hover:text-[var(--site-color)]"
        >
          {{ localize(site.name) }}
        </h3>
        <p class="truncate text-xs text-slate-500">{{ localize(site.shortDesc) }}</p>
      </div>
    </div>

    <div
      class="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-sm font-semibold"
      :style="{ color: site.color }"
    >
      <span>{{ t('tools.open') }}</span>
      <AppIcon
        name="arrow-right"
        :size="16"
        class="transition-transform duration-200 group-hover:translate-x-1"
      />
    </div>
  </a>
</template>
