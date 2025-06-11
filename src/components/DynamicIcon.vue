<!-- components/DynamicIcon.vue -->
<template>
    <el-icon>
        <component :is="icons[name]" />
    </el-icon>
</template>

<script setup lang="ts">
import { icons, type IconName } from '@/types/icons'
defineProps<{ name: IconName }>()
</script>
