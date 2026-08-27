<script setup>
import { computed } from 'vue'
import { useSubSiteStore } from '../../stores/subSite'
import { useAppI18n } from '../../composables/useI18n'

const props = defineProps({
  modelValue: { type: String, default: 'all' },
})
const emit = defineEmits(['update:modelValue'])

const store = useSubSiteStore()
const { t, localize } = useAppI18n()

/** 第一个 Tab 固定"全部"，后续完全由 visibleCategories 驱动 */
const tabs = computed(() => [
  { id: 'all', label: t('tools.all'), color: '#6366f1', bg: '#eef2ff' },
  ...store.visibleCategories.map((c) => ({
    id: c.id,
    label: localize(c.shortName) || localize(c.name),
    color: c.color,
    bg: c.bgColor || '#eef2ff',
  })),
])
</script>

<template>
  <div class="no-scrollbar flex gap-2 overflow-x-auto pb-1">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-150"
      :class="
        modelValue === tab.id
          ? 'shadow-sm'
          : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-700 hover:ring-slate-300'
      "
      :style="modelValue === tab.id ? { backgroundColor: tab.bg, color: tab.color } : {}"
      @click="emit('update:modelValue', tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
