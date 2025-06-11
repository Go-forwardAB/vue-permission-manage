import { createI18n } from 'vue-i18n'
import en from '@/locales/en'
import zh from '@/locales/zh'

const i18n = createI18n({
    legacy: false,
    locale: 'zh',
    messages: {
        en,
        zh,
    },
})

export { i18n }
