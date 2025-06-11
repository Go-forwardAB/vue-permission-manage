<template>
    <el-aside width="200px">
        <el-menu
            :default-active="activeMenu"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            @select="handleSelect"
        >
            <template v-for="item in menuList" :key="item.title">
                <AsideMenuItem :item="item" />
            </template>
        </el-menu>
    </el-aside>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTabsStore } from '@/store/tabs'
import { useMenusStore } from '@/store/menu'
import AsideMenuItem from './AsideMenuItem.vue'
import { filterVisibleMenus } from '@/composables/filterVisibleMenus'

const router = useRouter()
const useTabs = useTabsStore()
const useMenus = useMenusStore()

const activeMenu = computed({
    get: () => useTabs.activeTab || '/',
    set: (val) => (useTabs.activeTab = val),
})

const menuList = computed(() => filterVisibleMenus(useMenus.init_menus))

onMounted(() => {
    if (activeMenu.value) {
        router.push(activeMenu.value)
    }
})

function handleSelect(index: string) {
    activeMenu.value = index
    router.push(index)
    useTabs.addTab(index)
}
</script>

<style scoped lang="scss">
.el-menu {
    height: calc(100vh - 60px);
    background: linear-gradient(135deg, #001529 0%, #000c17 100%);
    .el-menu-item {
        background-color: inherit;
    }
    .el-menu-item,
    .el-sub-menu {
        border-bottom: 2px solid #0a1d35;
    }
}
</style>
