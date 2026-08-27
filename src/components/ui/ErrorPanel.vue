<script setup>
import { useAppI18n } from '../../composables/useI18n'
import AppIcon from './AppIcon.vue'

const { t } = useAppI18n()
</script>

<template>
  <div class="flex min-h-[60vh] items-center justify-center px-4">
    <div class="card w-full max-w-md p-8 text-center">
      <div
        class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500"
      >
        <AppIcon name="alert-triangle" :size="26" />
      </div>
      <h2 class="mt-4 text-lg font-bold text-slate-900">{{ t('misc.errorTitle') }}</h2>
      <p class="mt-1 text-sm text-slate-500">{{ t('misc.errorDesc') }}</p>
      <button class="btn-primary mt-6" @click="$emit('retry')">
        <AppIcon name="refresh-cw" :size="16" />
        {{ t('misc.retry') }}
      </button>
    </div>
  </div>
</template>
