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
    loadEnv(mode, process.cwd(), '')

    const baseUrl = mode === 'development' ? '' : '/vue-perssion-manage/'

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
                    // 入口文件名（不能变，否则所有打包的 js hash 值全变了）
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
                /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                // @ts-ignore
                strictMessage: false,
                fullInstall: true,
                // do not support ts extension
                include: [path.resolve(__dirname, 'locales/*.{yaml,yml,json}')],
            }),
            VueDevTools(),
        ],
        server: {
            proxy: {
                '/api': {
                    // target: 'http://localhost:3000',
                    target: 'https://vue-perssion-api.onrender.com',
                    changeOrigin: true,
                    // rewrite: (path) => path.replace(/^\/api/, '/api'),
                },
            },
        },
    }
})
