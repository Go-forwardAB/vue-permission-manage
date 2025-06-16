<template>
    <el-button type="primary" :circle="true" @click="next()">
        <Icon
            v-if="state === 'dark'"
            :icon="carbonMoon"
            class="inline-block align-middle"
        />
        <Icon
            v-if="state === 'light'"
            :icon="carbonSun"
            class="inline-block align-middle"
        />
        <Icon
            v-if="state === 'cafe'"
            :icon="carbonCafe"
            class="inline-block align-middle"
        />
        <Icon
            v-if="state === 'auto'"
            :icon="carbonLaptop"
            class="inline-block align-middle"
        />
    </el-button>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'
import { useColorMode, useCycleList } from '@vueuse/core'

// 引入 Iconify Vue 组件和 Carbon 图标包里的图标
import { Icon } from '@iconify/vue'
import carbonMoon from '@iconify/icons-carbon/moon'
import carbonSun from '@iconify/icons-carbon/sun'
import carbonCafe from '@iconify/icons-carbon/cafe'
import carbonLaptop from '@iconify/icons-carbon/laptop'

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
