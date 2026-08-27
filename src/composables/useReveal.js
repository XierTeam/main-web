import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

/**
 * 滚动进入视口时给容器内 [data-reveal] 元素添加 .in 触发淡入上行动画。
 * 支持 stagger：元素上用 --reveal-delay 自定义延迟。
 * scanSource 变化时重新扫描（用于列表过滤后新增元素）。
 */
export function useRevealOnScroll(scanSource) {
  const container = ref(null)
  let observer = null

  const scan = () => {
    observer?.disconnect()
    observer = null
    const els = container.value
      ? [...container.value.querySelectorAll('[data-reveal]')]
      : []
    if (!els.length) return
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'))
      return
    }
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in')
            observer?.unobserve(en.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' },
    )
    els.forEach((el) => observer.observe(el))
  }

  onMounted(() => {
    scan()
    if (scanSource) {
      watch(scanSource, () => nextTick(scan))
    }
  })

  onBeforeUnmount(() => observer?.disconnect())

  return { container, scan }
}
