<template>
  <div class="animate-pulse">
    <div class="container-page pt-40 pb-24 sm:pt-48">
      <div class="mx-auto max-w-2xl space-y-5 text-center">
        <div class="mx-auto h-6 w-44 rounded-full bg-slate-200"></div>
        <div class="mx-auto h-12 w-3/4 rounded-2xl bg-slate-200 sm:h-14"></div>
        <div class="mx-auto h-4 w-1/2 rounded bg-slate-200"></div>
        <div class="mx-auto h-14 w-full max-w-xl rounded-2xl bg-slate-200"></div>
      </div>
      <div class="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div v-for="i in 4" :key="i" class="h-28 rounded-2xl bg-slate-200"></div>
      </div>
      <div class="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="i in 8" :key="i" class="h-64 rounded-2xl bg-slate-200"></div>
      </div>
    </div>
  </div>
</template>
