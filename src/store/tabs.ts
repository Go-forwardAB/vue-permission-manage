import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useMenusStore } from './menu'
import { MenuItem } from '@/types/menus'

const STORAGE_KEY_TABS = 'persisted_tabs'
const STORAGE_KEY_ACTIVE = 'persisted_active_tab'

const storedTabs = localStorage.getItem(STORAGE_KEY_TABS)
const storedActive = localStorage.getItem(STORAGE_KEY_ACTIVE)

export const useTabsStore = defineStore('tabs', () => {
    const tabs = ref<{ name?: string; title: string; path: string }[]>(
        storedTabs
            ? JSON.parse(storedTabs)
            : [{ title: '首页', name: 'Home', path: '/dashboard' }],
    )
    const activeTab = ref(storedActive || '')
    const useMenus = useMenusStore()
    function addTab(path: string) {
        if (!tabs.value.find((tab) => tab.path === path)) {
            const activeMenuObj = findMenu(useMenus.menus, path)
            if (activeMenuObj) {
                tabs.value.push({
                    title: activeMenuObj.title,
                    name: activeMenuObj.name,
                    path: activeMenuObj.path!,
                })
            }
        }
        activeTab.value = path
    }

    const findMenu = (
        menus: MenuItem[],
        path: string,
    ): MenuItem | undefined => {
        for (const item of menus) {
            if (item.path === path) return item
            if (item.children) {
                const found = findMenu(item.children, path)
                if (found) return found
            }
        }
        return undefined
    }

    function removeTab(path: string) {
        tabs.value = tabs.value.filter((tab) => tab.path !== path)
        if (activeTab.value === path && tabs.value.length > 0) {
            activeTab.value = tabs.value[tabs.value.length - 1].path
        } else if (tabs.value.length === 0) {
            activeTab.value = ''
        }
    }

    // 持久化：监听 tabs 和 activeTab
    watch(
        tabs,
        (val) => {
            localStorage.setItem(STORAGE_KEY_TABS, JSON.stringify(val))
        },
        { deep: true },
    )

    watch(activeTab, (val) => {
        localStorage.setItem(STORAGE_KEY_ACTIVE, val)
    })

    function $reset() {
        activeTab.value = ''
        tabs.value = [{ title: '首页', name: 'Home', path: '/dashboard' }]
    }

    return {
        tabs: computed(() => tabs.value),
        activeTab,
        addTab,
        removeTab,
        $reset,
    }
})
