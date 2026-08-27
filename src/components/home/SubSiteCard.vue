<script setup>
import { computed } from 'vue'
import { useAppI18n } from '../../composables/useI18n'
import { toPath, hexToRgba, formatNumber } from '../../utils/format'
import AppIcon from '../ui/AppIcon.vue'
import Badge from '../ui/Badge.vue'

/**
 * 子站卡片，支持三种布局：
 * - full       大卡片（色块封面 + 描述 + 功能标签 + 统计）
 * - horizontal 横向卡片（图标 + 名称 + 描述）
 * - list       列表行（紧凑）
 */
const props = defineProps({
  site: { type: Object, required: true },
  layout: { type: String, default: 'full' },
  delay: { type: Number, default: 0 },
})

const { t, localize } = useAppI18n()
const link = computed(() => toPath(props.site))

const statsEntries = computed(() => Object.entries(props.site.stats ?? {}))

function statLabel(key) {
  return key === 'users' ? t('showcase.statUsers') : t('showcase.statFiles')
}
</script>

<template>
  <!-- ── full：大卡片 ── -->
  <a
    v-if="layout === 'full'"
    :href="link"
    :target="site.isExternal ? '_blank' : undefined"
    :rel="site.isExternal ? 'noopener noreferrer' : undefined"
    class="group card flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-900/10"
    :style="{ '--site-color': site.color }"
  >
    <!-- 封面区：优先 coverImage，缺失时降级为纯色渐变 -->
    <div
      class="relative h-36 overflow-hidden sm:h-40"
      :style="{
        background: `linear-gradient(135deg, ${hexToRgba(site.color, 0.92)}, ${hexToRgba(site.color, 0.68)})`,
      }"
    >
      <div
        v-if="site.coverImage"
        class="absolute inset-0 bg-cover bg-center opacity-45 transition-transform duration-500 group-hover:scale-105"
        :style="{ backgroundImage: `url(${site.coverImage})` }"
      ></div>
      <AppIcon
        :name="site.icon || 'box'"
        :size="76"
        class="absolute -right-3 -bottom-4 text-white/15 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
      />
      <div class="absolute top-4 left-4 flex items-center gap-2.5">
        <span
          class="flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 shadow-md"
          :style="{ color: site.color }"
        >
          <AppIcon :name="site.icon || 'box'" :size="22" />
        </span>
        <Badge v-if="site.badge && site.badgeText" :type="site.badge" :text="localize(site.badgeText)" />
      </div>
      <span
        class="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm transition-all duration-200 group-hover:bg-white group-hover:text-[var(--site-color)]"
      >
        <AppIcon
          name="arrow-up-right"
          :size="16"
          class="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </span>
    </div>

    <!-- 内容区 -->
    <div class="flex flex-1 flex-col p-5">
      <h3 class="text-lg font-bold tracking-tight text-slate-900">{{ localize(site.name) }}</h3>
      <p class="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-500">
        {{ localize(site.description) || localize(site.shortDesc) }}
      </p>

      <div v-if="site.features?.length" class="mt-3 flex flex-wrap gap-1.5">
        <span
          v-for="(f, i) in site.features"
          :key="i"
          class="chip bg-slate-100 text-slate-600"
        >
          {{ localize(f) }}
        </span>
      </div>

      <div
        v-if="statsEntries.length"
        class="mt-4 flex gap-6 border-t border-slate-100 pt-3.5"
      >
        <div v-for="[key, st] in statsEntries" :key="key">
          <div class="text-lg font-extrabold tabular-nums" :style="{ color: site.color }">
            {{ formatNumber(st.value) }}{{ localize(st.suffix) }}
          </div>
          <div class="text-xs text-slate-400">{{ statLabel(key) }}</div>
        </div>
      </div>

      <div
        class="mt-auto flex items-center gap-1.5 pt-4 text-sm font-bold"
        :style="{ color: site.color }"
      >
        {{ t('showcase.cta') }}
        <AppIcon
          name="arrow-right"
          :size="16"
          class="transition-transform duration-200 group-hover:translate-x-1"
        />
      </div>
    </div>
  </a>

  <!-- ── horizontal：横向卡片 ── -->
  <a
    v-else-if="layout === 'horizontal'"
    :href="link"
    :target="site.isExternal ? '_blank' : undefined"
    :rel="site.isExternal ? 'noopener noreferrer' : undefined"
    class="group card flex h-full items-center gap-4 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/8"
    :style="{ '--site-color': site.color }"
  >
    <span
      class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-105"
      :style="{ backgroundColor: hexToRgba(site.color, 0.12), color: site.color }"
    >
      <AppIcon :name="site.icon || 'box'" :size="26" />
    </span>
    <div class="min-w-0 flex-1">
      <div class="flex flex-wrap items-center gap-2">
        <h3 class="truncate font-bold text-slate-900">{{ localize(site.name) }}</h3>
        <Badge v-if="site.badge && site.badgeText" :type="site.badge" :text="localize(site.badgeText)" />
      </div>
      <p class="mt-0.5 line-clamp-2 text-sm text-slate-500">
        {{ localize(site.description) || localize(site.shortDesc) }}
      </p>
    </div>
    <AppIcon
      name="arrow-right"
      :size="20"
      class="shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[var(--site-color)]"
    />
  </a>

  <!-- ── list：列表行 ── -->
  <a
    v-else
    :href="link"
    :target="site.isExternal ? '_blank' : undefined"
    :rel="site.isExternal ? 'noopener noreferrer' : undefined"
    class="group flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-white px-4 py-3 transition-all duration-200 hover:border-[var(--site-color)] hover:shadow-md"
    :style="{ '--site-color': site.color }"
  >
    <span
      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
      :style="{ backgroundColor: hexToRgba(site.color, 0.12), color: site.color }"
    >
      <AppIcon :name="site.icon || 'box'" :size="19" />
    </span>
    <div class="min-w-0 flex-1">
      <div class="flex flex-wrap items-center gap-2">
        <h3 class="truncate font-semibold text-slate-900">{{ localize(site.name) }}</h3>
        <Badge v-if="site.badge && site.badgeText" :type="site.badge" :text="localize(site.badgeText)" />
      </div>
      <p class="truncate text-sm text-slate-500">{{ localize(site.shortDesc) }}</p>
    </div>
    <div v-if="site.features?.length" class="hidden items-center gap-2 lg:flex">
      <span
        v-for="(f, i) in site.features.slice(0, 2)"
        :key="i"
        class="chip bg-slate-100 text-slate-500"
      >
        {{ localize(f) }}
      </span>
    </div>
    <AppIcon
      name="arrow-right"
      :size="17"
      class="shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[var(--site-color)]"
    />
  </a>
</template>
