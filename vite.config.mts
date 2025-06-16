/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import * as path from 'path'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import Unocss from 'unocss/vite'
import VueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')

    const baseUrl = mode === 'development' ? '/' : '/vue-permission-manage/'

    return {
        base: baseUrl,
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
        build: {
            target: 'es2015',
            cssTarget: 'chrome80',
            rollupOptions: {
                output: {
                    entryFileNames: 'index.js',
                    manualChunks: {
                        vue: ['vue', 'pinia', 'vue-router'],
                        elementplus: [
                            'element-plus',
                            '@element-plus/icons-vue',
                        ],
                    },
                },
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "@/assets/styles/element/index.scss" as *;`,
                },
            },
        },
        plugins: [
            vue(),

            AutoImport({
                imports: [
                    'vue',
                    'vue-router',
                    'vue-i18n',
                    'vue/macros',
                    '@vueuse/head',
                    '@vueuse/core',
                ],
                resolvers: [ElementPlusResolver()],
                dts: 'auto-imports.d.ts',
                vueTemplate: true,
            }),

            Components({
                dts: 'components.d.ts',
                resolvers: [ElementPlusResolver()],
            }),

            Unocss(),

            VueI18n({
                runtimeOnly: true,
                compositionOnly: true,
                strictMessage: false,
                fullInstall: true,
                include: [path.resolve(__dirname, 'locales/*.{yaml,yml,json}')],
            }),

            VueDevTools(),
        ],
        server: {
            proxy: {
                '/api': {
                    target:
                        env.VITE_API_URL ||
                        'https://vue-perssion-api.onrender.com',
                    changeOrigin: true,
                    // rewrite: (path) => path.replace(/^\/api/, '/api'),
                },
            },
        },
        test: {
            globals: true,
            environment: 'jsdom',
        },
    }
})
