<script setup>
import { onMounted } from 'vue'
import { useSubSiteStore } from './stores/subSite'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
import Home from './views/Home.vue'
import LoadingSkeleton from './components/ui/LoadingSkeleton.vue'
import ErrorPanel from './components/ui/ErrorPanel.vue'

const store = useSubSiteStore()

onMounted(() => {
  store.fetchConfig()
})
</script>

<template>
  <div class="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 antialiased">
    <Navbar v-if="store.config" />
    <main class="flex-1">
      <LoadingSkeleton v-if="store.loading" />
      <ErrorPanel v-else-if="store.error" @retry="store.fetchConfig()" />
      <Home v-else />
    </main>
    <Footer v-if="store.config" />
  </div>
</template>
