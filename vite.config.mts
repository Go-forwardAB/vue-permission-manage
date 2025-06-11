/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import * as path from 'path'
import replace from '@rollup/plugin-replace'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import Unocss from 'unocss/vite'
import VueDevTools from 'vite-plugin-vue-devtools'

const reload = process.env.RELOAD_SW === 'true'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/vue-perssion-manage/', 
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
                    elementplus: ['element-plus', '@element-plus/icons-vue'],
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

        // https://github.com/antfu/unocss
        // see unocss.config.ts for config
        Unocss(),

        // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
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

        replace({
            preventAssignment: true,
            __DATE__: new Date().toISOString(),
            __RELOAD_SW__: reload ? 'true' : '',
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

    // https://github.com/vitest-dev/vitest
    test: {
        include: ['src/tests/**/*.test.ts'],
        environment: 'jsdom',
        server: {
            deps: {
                inline: ['@vue', '@vueuse', 'element-plus', 'pinia'],
            },
        },
    },
})
