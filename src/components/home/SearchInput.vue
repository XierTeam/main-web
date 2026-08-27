<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import AppIcon from '../ui/AppIcon.vue'

/**
 * 搜索输入框
 * - Ctrl/Cmd + K 聚焦
 * - lg（Hero）/ md 两种尺寸
 */
const props = defineProps({
  size: { type: String, default: 'lg' },
  placeholder: { type: String, default: '' },
})

const model = defineModel({ type: String, default: '' })
const inputEl = ref(null)

function onKey(e) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    inputEl.value?.focus()
    inputEl.value?.select()
  }
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="group relative w-full">
    <AppIcon
      name="search"
      :size="size === 'lg' ? 20 : 16"
      class="pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400"
      :class="size === 'lg' ? 'left-4.5' : 'left-3.5'"
    />
    <input
      ref="inputEl"
      v-model="model"
      type="text"
      :placeholder="placeholder"
      class="w-full rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/15"
      :class="size === 'lg' ? 'py-4 pr-12 pl-12 text-base' : 'py-2.5 pr-10 pl-10 text-sm'"
    />
    <button
      v-if="model"
      class="absolute top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
      :class="size === 'lg' ? 'right-3' : 'right-2'"
      aria-label="clear"
      @click="model = ''"
    >
      <AppIcon name="x" :size="size === 'lg' ? 16 : 13" />
    </button>
    <kbd
      v-else
      class="pointer-events-none absolute top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] text-slate-400 sm:block"
      :class="size === 'lg' ? 'right-4' : 'right-3'"
    >
      Ctrl K
    </kbd>
  </div>
</template>
