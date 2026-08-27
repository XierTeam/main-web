import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import './assets/main.css'
import App from './App.vue'
import i18n from './i18n.js'

const app = createApp(App)
app.use(createPinia())
app.use(i18n)
app.mount('#app')
