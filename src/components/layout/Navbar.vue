<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useSubSiteStore } from '../../stores/subSite'
import { useAppI18n } from '../../composables/useI18n'
import { toPath } from '../../utils/format'
import AppIcon from '../ui/AppIcon.vue'

const store = useSubSiteStore()
const { t, locale, setLocale, localize } = useAppI18n()

const scrolled = ref(false)
const mobileOpen = ref(false)
const openDropdown = ref('') // '' | 'categories' | 'lang'
const mobileCatsOpen = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 8
}
function onDocClick(e) {
  if (!e.target.closest('[data-dropdown]')) openDropdown.value = ''
}
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', onDocClick)
  onScroll()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onDocClick)
})

const navLinks = computed(() => [
  { id: 'home', label: t('nav.home') },
  { id: 'popular', label: t('nav.popular') },
  { id: 'tools', label: t('nav.tools') },
])

/** 按分类分组渲染子站下拉（数据完全来自 JSON） */
const categoryMenu = computed(() =>
  store.visibleCategories.map((c) => ({
    ...c,
    sites: store.subSitesByCategory(c.id),
  })),
)

function goToAnchor(id) {
  mobileOpen.value = false
  openDropdown.value = ''
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function toggleDropdown(name) {
  openDropdown.value = openDropdown.value === name ? '' : name
}

function switchLocale(l) {
  setLocale(l)
  openDropdown.value = ''
}
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b transition-all duration-200"
    :class="
      scrolled
        ? 'border-slate-200/80 bg-white/85 shadow-sm backdrop-blur-lg'
        : 'border-transparent bg-white/60 backdrop-blur-md'
    "
  >
    <div class="container-page flex h-16 items-center justify-between gap-4">
      <!-- Logo -->
      <a
        href="#home"
        class="flex shrink-0 items-center gap-2.5"
        @click.prevent="goToAnchor('home')"
      >
        <span
          class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-md shadow-brand-500/30"
        >
          <AppIcon name="layout-grid" :size="18" />
        </span>
        <span class="text-lg font-extrabold tracking-tight text-slate-900">
          {{ t('brand.name') }}
          <span class="hidden text-xs font-medium text-slate-400 sm:inline">
            · {{ t('brand.tagline') }}
          </span>
        </span>
      </a>

      <!-- Desktop nav -->
      <nav class="hidden items-center gap-1 md:flex">
        <button
          v-for="link in navLinks"
          :key="link.id"
          class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          @click="goToAnchor(link.id)"
        >
          {{ link.label }}
        </button>

        <!-- 分类下拉（动态） -->
        <div v-if="categoryMenu.length" data-dropdown class="relative">
          <button
            class="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            :class="{ 'bg-slate-100 text-slate-900': openDropdown === 'categories' }"
            @click="toggleDropdown('categories')"
          >
            {{ t('nav.categories') }}
            <AppIcon
              name="chevron-down"
              :size="14"
              class="transition-transform duration-200"
              :class="{ 'rotate-180': openDropdown === 'categories' }"
            />
          </button>

          <transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 translate-y-1"
            leave-active-class="transition duration-100 ease-in"
            leave-to-class="opacity-0 translate-y-1"
          >
            <div
              v-if="openDropdown === 'categories'"
              class="absolute left-0 top-full mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/8"
            >
              <div v-for="cat in categoryMenu" :key="cat.id" class="mb-1 last:mb-0">
                <div class="flex items-center gap-2 px-2.5 py-1.5">
                  <AppIcon :name="cat.icon || 'box'" :size="14" :style="{ color: cat.color }" />
                  <span class="text-xs font-bold uppercase tracking-wide text-slate-400">
                    {{ localize(cat.name) }}
                  </span>
                </div>
                <a
                  v-for="site in cat.sites"
                  :key="site.id"
                  :href="toPath(site)"
                  :target="site.isExternal ? '_blank' : undefined"
                  :rel="site.isExternal ? 'noopener noreferrer' : undefined"
                  class="group flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  <span
                    class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    :style="{ backgroundColor: `${site.color}1f`, color: site.color }"
                  >
                    <AppIcon :name="site.icon || 'box'" :size="14" />
                  </span>
                  <span class="flex-1 truncate font-medium">{{ localize(site.name) }}</span>
                  <span v-if="site.badge" class="shrink-0">
                    <span
                      class="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                      :style="{ backgroundColor: `${site.color}1f`, color: site.color }"
                    >
                      {{ localize(site.badgeText) }}
                    </span>
                  </span>
                  <AppIcon
                    name="arrow-right"
                    :size="13"
                    class="shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5"
                  />
                </a>
              </div>
              <div class="mt-1 border-t border-slate-100 pt-1.5">
                <button
                  class="flex w-full items-center justify-center gap-1 rounded-xl px-2.5 py-2 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-50"
                  @click="goToAnchor('tools')"
                >
                  {{ t('nav.viewAll') }}
                  <AppIcon name="arrow-right" :size="14" />
                </button>
              </div>
            </div>
          </transition>
        </div>
      </nav>

      <!-- Right: language + mobile toggle -->
      <div class="flex items-center gap-2">
        <!-- Language dropdown -->
        <div data-dropdown class="relative">
          <button
            class="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
            :class="{ 'bg-slate-100': openDropdown === 'lang' }"
            @click="toggleDropdown('lang')"
          >
            <AppIcon name="globe" :size="16" class="text-slate-400" />
            <span class="hidden sm:inline">{{ locale === 'zh-CN' ? '中文' : 'EN' }}</span>
          </button>
          <transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 translate-y-1"
            leave-active-class="transition duration-100 ease-in"
            leave-to-class="opacity-0 translate-y-1"
          >
            <div
              v-if="openDropdown === 'lang'"
              class="absolute right-0 top-full mt-2 w-36 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/8"
            >
              <button
                class="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-50"
                :class="locale === 'zh-CN' ? 'text-brand-600' : 'text-slate-600'"
                @click="switchLocale('zh-CN')"
              >
                {{ t('nav.zh') }}
                <AppIcon v-if="locale === 'zh-CN'" name="circle-check" :size="15" />
              </button>
              <button
                class="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-50"
                :class="locale === 'en' ? 'text-brand-600' : 'text-slate-600'"
                @click="switchLocale('en')"
              >
                {{ t('nav.en') }}
                <AppIcon v-if="locale === 'en'" name="circle-check" :size="15" />
              </button>
            </div>
          </transition>
        </div>

        <button
          class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
          aria-label="menu"
          @click="mobileOpen = !mobileOpen"
        >
          <AppIcon :name="mobileOpen ? 'x' : 'menu'" :size="20" />
        </button>
      </div>
    </div>

    <!-- Mobile panel -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileOpen"
        class="border-t border-slate-200/70 bg-white px-4 pt-2 pb-4 md:hidden"
      >
        <div class="space-y-1">
          <button
            v-for="link in navLinks"
            :key="link.id"
            class="block w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
            @click="goToAnchor(link.id)"
          >
            {{ link.label }}
          </button>

          <button
            class="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            @click="mobileCatsOpen = !mobileCatsOpen"
          >
            {{ t('nav.categories') }}
            <AppIcon
              name="chevron-down"
              :size="16"
              class="transition-transform"
              :class="{ 'rotate-180': mobileCatsOpen }"
            />
          </button>
          <div v-if="mobileCatsOpen" class="space-y-3 border-l border-slate-100 pl-4">
            <div v-for="cat in categoryMenu" :key="cat.id">
              <div
                class="flex items-center gap-1.5 px-2 py-1 text-xs font-bold uppercase tracking-wide"
                :style="{ color: cat.color }"
              >
                <AppIcon :name="cat.icon || 'box'" :size="13" />
                {{ localize(cat.name) }}
              </div>
              <a
                v-for="site in cat.sites"
                :key="site.id"
                :href="toPath(site)"
                :target="site.isExternal ? '_blank' : undefined"
                :rel="site.isExternal ? 'noopener noreferrer' : undefined"
                class="block rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                {{ localize(site.name) }}
              </a>
            </div>
          </div>

          <div class="mt-2 flex gap-2 border-t border-slate-100 pt-3">
            <button
              class="flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors"
              :class="
                locale === 'zh-CN'
                  ? 'border-brand-300 bg-brand-50 text-brand-600'
                  : 'border-slate-200 text-slate-600'
              "
              @click="switchLocale('zh-CN')"
            >
              {{ t('nav.zh') }}
            </button>
            <button
              class="flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors"
              :class="
                locale === 'en'
                  ? 'border-brand-300 bg-brand-50 text-brand-600'
                  : 'border-slate-200 text-slate-600'
              "
              @click="switchLocale('en')"
            >
              {{ t('nav.en') }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>
