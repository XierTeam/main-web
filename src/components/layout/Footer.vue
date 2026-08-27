<script setup>
import { computed } from 'vue'
import { useSubSiteStore } from '../../stores/subSite'
import { useAppI18n } from '../../composables/useI18n'
import { toPath } from '../../utils/format'
import AppIcon from '../ui/AppIcon.vue'

const store = useSubSiteStore()
const { t, localize } = useAppI18n()

const year = new Date().getFullYear()

const categoryMenu = computed(() =>
  store.visibleCategories.map((c) => ({
    ...c,
    sites: store.subSitesByCategory(c.id),
  })),
)

const quickLinks = computed(() => [
  { id: 'home', label: t('nav.home') },
  { id: 'popular', label: t('nav.popular') },
  { id: 'tools', label: t('nav.tools') },
])

function goToAnchor(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <footer class="mt-8 border-t border-slate-200 bg-white">
    <div class="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Brand -->
      <div>
        <div class="flex items-center gap-2.5">
          <span
            class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white"
          >
            <AppIcon name="layout-grid" :size="18" />
          </span>
          <span class="text-lg font-extrabold tracking-tight text-slate-900">
            {{ t('brand.name') }}
          </span>
        </div>
        <p class="mt-4 text-sm leading-relaxed text-slate-500">
          {{ t('footer.aboutText') }}
        </p>
        <div class="mt-4 flex items-center gap-2 text-slate-400">
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 hover:text-brand-500">
            <AppIcon name="github" :size="16" />
          </span>
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 hover:text-brand-500">
            <AppIcon name="mail" :size="16" />
          </span>
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 hover:text-brand-500">
            <AppIcon name="heart" :size="16" />
          </span>
        </div>
      </div>

      <!-- Products -->
      <div>
        <h3 class="text-sm font-bold uppercase tracking-wide text-slate-400">
          {{ t('footer.products') }}
        </h3>
        <ul class="mt-4 space-y-2.5">
          <li v-for="site in store.visibleSubSites" :key="site.id">
            <a
              :href="toPath(site)"
              :target="site.isExternal ? '_blank' : undefined"
              :rel="site.isExternal ? 'noopener noreferrer' : undefined"
              class="group inline-flex items-center gap-1.5 text-sm text-slate-600 transition-colors hover:text-brand-600"
            >
              <span class="h-1.5 w-1.5 rounded-full" :style="{ backgroundColor: site.color }"></span>
              {{ localize(site.name) }}
              <AppIcon
                v-if="site.isExternal"
                name="external-link"
                :size="11"
                class="text-slate-300 group-hover:text-brand-400"
              />
            </a>
          </li>
        </ul>
      </div>

      <!-- Categories -->
      <div>
        <h3 class="text-sm font-bold uppercase tracking-wide text-slate-400">
          {{ t('footer.categories') }}
        </h3>
        <ul class="mt-4 space-y-2.5">
          <li v-for="cat in categoryMenu" :key="cat.id">
            <button
              class="inline-flex items-center gap-1.5 text-sm text-slate-600 transition-colors hover:text-brand-600"
              @click="goToAnchor('tools')"
            >
              <AppIcon :name="cat.icon || 'box'" :size="14" :style="{ color: cat.color }" />
              {{ localize(cat.name) }}
              <span class="text-xs text-slate-300">({{ cat.sites.length }})</span>
            </button>
          </li>
        </ul>
      </div>

      <!-- Quick links -->
      <div>
        <h3 class="text-sm font-bold uppercase tracking-wide text-slate-400">
          {{ t('footer.quickLinks') }}
        </h3>
        <ul class="mt-4 space-y-2.5">
          <li v-for="link in quickLinks" :key="link.id">
            <button
              class="text-sm text-slate-600 transition-colors hover:text-brand-600"
              @click="goToAnchor(link.id)"
            >
              {{ link.label }}
            </button>
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-slate-100">
      <div
        class="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-slate-400 sm:flex-row"
      >
        <p>© {{ year }} {{ t('brand.name') }} · {{ t('footer.rights') }}</p>
        <div class="flex items-center gap-4">
          <a href="#" class="transition-colors hover:text-brand-600">{{ t('footer.privacy') }}</a>
          <a href="#" class="transition-colors hover:text-brand-600">{{ t('footer.terms') }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>
