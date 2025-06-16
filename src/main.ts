import { createApp } from 'vue'
import App from './App.vue'

import { store } from './store'
import { router } from './router'
import { i18n } from './i18n'
import { updateTheme } from './utils/theme'
import permission from './utils/permission'

import { getTokenA } from '@/utils/token'
import { generateRoutes } from '@/router/dynamic'

import 'virtual:uno.css'
import '@/assets/styles/index.scss'
import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/theme-chalk/src/message-box.scss'

async function bootstrap() {
    const app = createApp(App)

    app.use(store)
    app.use(i18n)
    app.directive('permission', permission)

    const token = getTokenA()
    if (token) {
        await generateRoutes()
    }

    app.use(router)
    app.mount('#app')

    updateTheme()
}

bootstrap()
