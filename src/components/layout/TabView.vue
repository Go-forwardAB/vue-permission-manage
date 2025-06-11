<template>
    <el-tabs
        v-model="activeTab"
        type="card"
        @tab-remove="removeTab"
        @tab-click="onTabClick"
    >
        <el-tab-pane
            v-for="tab in tabs"
            :key="tab.title"
            :label="tab.title"
            :name="tab.path"
            :closable="tab.path === '/' ? false : true"
        >
        </el-tab-pane>
    </el-tabs>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTabsStore } from '@/store/tabs'
import { ElMessage, TabPaneName, TabsPaneContext } from 'element-plus'

const router = useRouter()
const useTabs = useTabsStore()
const tabs = computed(() => useTabs.tabs)
const activeTab = computed({
    get: () => useTabs.activeTab,
    set: (val) => (useTabs.activeTab = val),
})

onMounted(() => {
    if (activeTab.value) {
        router.push(activeTab.value)
    }
})

function removeTab(name: TabPaneName) {
    if (name === '/') return ElMessage.warning('改Tab禁止删除')
    useTabs.removeTab(name as string)
    const path = activeTab.value
    router.push(path)
}

function onTabClick(tab: TabsPaneContext) {
    router.push(tab.paneName as string)
}
</script>
