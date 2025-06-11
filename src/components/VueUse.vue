<template>
    <el-button type="primary" :circle="true" @click="next()">
        <i
            v-if="state === 'dark'"
            i-carbon-moon
            inline-block
            align-middle
            class="align-middle"
        />
        <i
            v-if="state === 'light'"
            i-carbon-sun
            inline-block
            align-middle
            class="align-middle"
        />
        <i
            v-if="state === 'cafe'"
            i-carbon-cafe
            inline-block
            align-middle
            class="align-middle"
        />
        <i
            v-if="state === 'auto'"
            i-carbon-laptop
            inline-block
            align-middle
            class="align-middle"
        />
    </el-button>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'
import { useColorMode, useCycleList } from '@vueuse/core'

const mode = useColorMode({
    modes: {
        contrast: 'dark contrast',
        cafe: 'cafe',
    },
})
const { next, state } = useCycleList(['dark', 'light', 'cafe', 'auto'], {
    initialValue: mode,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
watchEffect(() => (mode.value = state.value as any))
</script>

<style lang="scss">
.vueuse-box {
    margin: 20px auto;
}

html.cafe {
    filter: sepia(0.9) hue-rotate(315deg) brightness(0.9);
}
/* 自动主题（跟随系统） */
@media (prefers-color-scheme: dark) {
    html.auto {
        filter: contrast(1.1) brightness(0.9);
    }
}
@media (prefers-color-scheme: light) {
    html.auto {
        filter: none;
    }
}
</style>
