<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { formatNumber } from '../../utils/format'

/**
 * 数字滚动动画：进入视口后从 0 计数到目标值（easeOutCubic）。
 */
const props = defineProps({
  value: { type: Number, required: true },
  duration: { type: Number, default: 1600 },
  /** 小数位数；默认整数 0 位、小数 1 位 */
  decimals: { type: Number, default: null },
  prefix: { type: String, default: '' },
  suffix: { type: String, default: '' },
})

const el = ref(null)
const display = ref(0)
let raf = 0
let observer = null
let started = false

const decimals = computed(() =>
  props.decimals ?? (Number.isInteger(props.value) ? 0 : 1),
)

const text = computed(() => {
  const raw = decimals.value
    ? display.value.toFixed(decimals.value)
    : String(Math.round(display.value))
  return `${props.prefix}${formatNumber(Number(raw))}${props.suffix}`
})

function animate() {
  const target = props.value
  const t0 = performance.now()
  const step = (now) => {
    const p = Math.min(1, (now - t0) / props.duration)
    const eased = 1 - Math.pow(1 - p, 3)
    display.value = target * eased
    if (p < 1) raf = requestAnimationFrame(step)
    else display.value = target
  }
  raf = requestAnimationFrame(step)
}

onMounted(() => {
  if (!('IntersectionObserver' in window)) {
    display.value = props.value
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      if (!started && entries.some((e) => e.isIntersecting)) {
        started = true
        animate()
        observer?.disconnect()
      }
    },
    { threshold: 0.3 },
  )
  if (el.value) observer.observe(el.value)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  observer?.disconnect()
})
</script>

<template>
  <span ref="el" class="tabular-nums">{{ text }}</span>
</template>
