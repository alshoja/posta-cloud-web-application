import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import vuetify from './plugins/vuetify'
import '@/scss/style.scss'
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar'
import VueApexCharts from 'vue3-apexcharts'
import VueTablerIcons from 'vue-tabler-icons'

import { fakeBackend } from '@/utils/helpers/fake-backend'

// print
import print from 'vue3-print-nb'
import axiosInstance from './axiosInstance.interceptor'
const app = createApp(App)
app.config.globalProperties.$axios = axiosInstance;
fakeBackend()
app.use(router)
app.use(PerfectScrollbarPlugin)
app.use(createPinia())
app.use(VueTablerIcons)
app.use(print)
// Removed the object literal with the unknown property 'iconfont'
app.use(VueApexCharts)
app.use(vuetify).mount('#app')
