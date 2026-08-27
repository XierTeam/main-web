<script setup>
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'
import { hexToRgba } from '../../utils/format'

const props = defineProps({
  name: { type: String, default: 'box' },
  /** 主题色（图标颜色） */
  color: { type: String, default: '#6366f1' },
  /** 背景色；为空时用 color 的 12% 透明度 */
  bg: { type: String, default: '' },
  size: { type: [Number, String], default: 22 },
  boxSize: { type: [Number, String], default: 44 },
  /** sm | md | lg */
  rounded: { type: String, default: 'md' },
})

const radius = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
}

const bgStyle = computed(() =>
  props.bg ? { backgroundColor: props.bg } : { backgroundColor: hexToRgba(props.color, 0.12) },
)
const iconStyle = computed(() => ({ color: props.color }))
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center justify-center"
    :class="radius[rounded] || radius.md"
    :style="[{ width: `${boxSize}px`, height: `${boxSize}px` }, bgStyle]"
  >
    <AppIcon :name="name" :size="size" :style="iconStyle" />
  </span>
</template>
