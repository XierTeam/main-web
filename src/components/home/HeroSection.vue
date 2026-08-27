<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useSubSiteStore } from '../../stores/subSite'
import { useAppI18n } from '../../composables/useI18n'
import { useSearch } from '../../composables/useSearch'
import { useRevealOnScroll } from '../../composables/useReveal'
import SearchInput from './SearchInput.vue'
import AppIcon from '../ui/AppIcon.vue'

const store = useSubSiteStore()
const { t, localize } = useAppI18n()
const search = useSearch()
/** 顶层 ref（模板 v-model 需要顶层解包，不能写在普通对象上） */
const searchKeyword = search.keyword
const { container } = useRevealOnScroll()

/** 彩色关键词来自 homePage.heroKeywords（改 JSON 即换词换色） */
const keywords = computed(() =>
  (store.homePage.heroKeywords ?? []).map((k) => ({
    text: localize(k.text),
    color: k.color,
  })),
)

const active = ref(0)
let timer = null

function startRotation() {
  stopRotation()
  if (keywords.value.length > 1) {
    timer = setInterval(() => {
      active.value = (active.value + 1) % keywords.value.length
    }, 2600)
  }
}
function stopRotation() {
  if (timer) clearInterval(timer)
  timer = null
}

onMounted(() => {
  startRotation()
  document.addEventListener('visibilitychange', onVisibility)
})
onBeforeUnmount(() => {
  stopRotation()
  document.removeEventListener('visibilitychange', onVisibility)
})

function onVisibility() {
  if (document.hidden) stopRotation()
  else startRotation()
}

const current = computed(() => keywords.value[active.value] ?? { text: '', color: '#6366f1' })

function searchTag(kw) {
  search.setKeyword(kw)
  const tools = document.getElementById('tools')
  if (tools) tools.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section id="home" class="relative overflow-hidden">
    <!-- 装饰光斑 -->
    <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <div
        class="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-300/30 blur-3xl"
      ></div>
      <div class="absolute top-24 right-0 h-80 w-80 rounded-full bg-accent-300/25 blur-3xl"></div>
      <div class="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl"></div>
    </div>

    <div ref="container" class="container-page pt-14 pb-12 text-center sm:pt-24 sm:pb-16">
      <div data-reveal>
        <span
          class="chip border border-brand-200 bg-brand-50/80 px-3 py-1 text-xs font-semibold text-brand-600"
        >
          <AppIcon name="sparkles" :size="13" />
          {{ t('hero.pill') }}
        </span>
      </div>

      <h1
        data-reveal
        class="mx-auto mt-6 max-w-3xl text-4xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
        :style="{ '--reveal-delay': '90ms' }"
      >
        {{ t('hero.titlePrefix') }}
        <span class="relative inline-block whitespace-nowrap align-baseline">
          <transition name="kw" mode="out-in">
            <span :key="active" class="font-black" :style="{ color: current.color }">
              {{ current.text }}
            </span>
          </transition>
        </span>
        {{ t('hero.titleSuffix') }}
      </h1>

      <p
        data-reveal
        class="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg"
        :style="{ '--reveal-delay': '180ms' }"
      >
        {{ t('hero.subtitle') }}
      </p>

      <div data-reveal class="mx-auto mt-8 max-w-xl" :style="{ '--reveal-delay': '270ms' }">
        <SearchInput v-model="searchKeyword" :placeholder="t('hero.searchPlaceholder')" size="lg" />
      </div>

      <div
        data-reveal
        class="mt-5 flex flex-wrap items-center justify-center gap-2"
        :style="{ '--reveal-delay': '360ms' }"
      >
        <span class="text-xs text-slate-400">{{ t('hero.searchHint') }}</span>
        <button
          v-for="kw in keywords"
          :key="kw.text"
          class="chip border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition-all hover:-translate-y-0.5 hover:shadow-sm"
          @mouseenter="$event.currentTarget.style.color = kw.color"
          @mouseleave="$event.currentTarget.style.color = ''"
          @click="searchTag(kw.text)"
        >
          {{ kw.text }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.kw-enter-active,
.kw-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}
.kw-enter-from {
  opacity: 0;
  transform: translateY(14px);
}
.kw-leave-to {
  opacity: 0;
  transform: translateY(-14px);
}
</style>
