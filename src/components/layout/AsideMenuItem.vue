<template>
    <el-sub-menu v-if="item.children" :index="item.path">
        <template #title>
            <DynamicIcon :name="item.icon" />
            <span>{{ item.title }}</span>
        </template>
        <template v-for="child in item.children" :key="child.title">
            <MenuItems :item="child" />
        </template>
    </el-sub-menu>
    <el-menu-item v-else :index="item.path">
        <DynamicIcon :name="item.icon" />
        <span>{{ item.title }}</span>
    </el-menu-item>
</template>

<script setup lang="ts">
import DynamicIcon from '../DynamicIcon.vue'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
defineProps<{ item: any }>()
import MenuItems from './AsideMenuItem.vue'
</script>
