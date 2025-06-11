interface ImportMetaEnv {
    readonly VITE_NODE_ENV: 'development' | 'production'
    readonly VITE_API_BASE_URL?: string
    // 其他 VITE_ 开头的变量都可以加上
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
