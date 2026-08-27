<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** hot | new | beta | premium */
  type: { type: String, default: 'new' },
  text: { type: String, default: '' },
})

const palette = {
  hot: { cls: 'bg-rose-50 text-rose-600 ring-rose-200', dot: 'bg-rose-500' },
  new: { cls: 'bg-cyan-50 text-cyan-600 ring-cyan-200', dot: 'bg-cyan-500' },
  beta: { cls: 'bg-amber-50 text-amber-600 ring-amber-200', dot: 'bg-amber-500' },
  premium: { cls: 'bg-indigo-50 text-indigo-600 ring-indigo-200', dot: 'bg-indigo-500' },
}

const style = computed(() => palette[props.type] || palette.new)
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset"
    :class="style.cls"
  >
    <span class="h-1.5 w-1.5 rounded-full" :class="style.dot"></span>
    {{ text }}
  </span>
</template>
