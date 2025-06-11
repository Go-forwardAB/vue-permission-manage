import { ref } from 'vue'
import { defineStore } from 'pinia'
import { menusList } from '@/api/menus'
import { MenuItem } from '@/types/menus'

function menuTree(menuList: MenuItem[], parentId: number = 0): MenuItem[] {
    return menuList
        .filter((item) => item.parentId === parentId)
        .map((item) => ({
            ...item,
            children:
                menuTree(menuList, item.id).length > 0
                    ? menuTree(menuList, item.id)
                    : null,
        })) as MenuItem[]
}

export const useMenusStore = defineStore(
    'menus',
    () => {
        const menus = ref<MenuItem[]>([])
        const init_menus = ref<MenuItem[]>([])
        const btns = ref<string[]>([])

        async function getMenuList() {
            try {
                const res = await menusList()
                btns.value = res.data
                    .filter((item) => item.type === 'button')
                    .map((item) => item.code)
                menus.value = menuTree(res.data, 0)
                init_menus.value = res.data
                return res.data
            } catch (err) {
                console.log(err)
            }
        }

        return {
            menus,
            init_menus,
            btns,
            getMenuList,
        }
    },
    {
        persist: {
            enabled: true,
            strategies: [
                {
                    key: 'app-menu',
                    paths: ['menus', 'init_menus', 'btns'],
                },
            ],
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
)
