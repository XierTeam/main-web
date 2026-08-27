<script setup>
import { useSubSiteStore } from '../../stores/subSite'
import { useAppI18n } from '../../composables/useI18n'
import { useRevealOnScroll } from '../../composables/useReveal'
import AnimatedNumber from '../ui/AnimatedNumber.vue'
import AppIcon from '../ui/AppIcon.vue'

const store = useSubSiteStore()
const { localize } = useAppI18n()
const { container } = useRevealOnScroll()

/** 数据完全来自 homePage.stats（改 JSON 即增删改统计项） */
const stats = store.homePage.stats ?? []
</script>

<template>
  <section class="container-page pb-14 sm:pb-16">
    <div ref="container" class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div
        v-for="(s, i) in stats"
        :key="s.id"
        data-reveal
        class="card group p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6"
        :style="{ '--reveal-delay': `${i * 100}ms` }"
      >
        <div
          class="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500 transition-transform duration-200 group-hover:scale-110"
        >
          <AppIcon :name="s.icon || 'box'" :size="22" />
        </div>
        <div class="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          <AnimatedNumber :value="s.value" :suffix="localize(s.suffix)" />
        </div>
        <div class="mt-1 text-sm text-slate-500">{{ localize(s.label) }}</div>
      </div>
    </div>
  </section>
</template>
