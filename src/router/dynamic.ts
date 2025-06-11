import { useUserInfoStore } from '@/store/user'
import { useMenusStore } from '@/store/menu'
import { useRoleStore } from '@/store/role'
import { RoleMenu } from '@/types/roleMenu'
import { MenuItem } from '@/types/menus'
import { RouteRecordRaw, RouterView } from 'vue-router'
import { router } from '.'
export const filterMenu = ref<MenuItem[]>()
const addedRouteNames: string[] = []

export async function generateRoutes() {
    const userStore = useUserInfoStore()
    const roleStore = useRoleStore()
    const menuStore = useMenusStore()

    const allRoles = await roleStore.getRoleList()
    const userRoles = allRoles?.filter(
        (r) => userStore.userInfo.roleIds.includes(r.id) && r.enabled,
    )

    // 获取角色菜单
    const allRoleMenus = await roleStore.getRoleMenu()
    const menuIdSet = new Set<number>()
    userRoles?.forEach((role) => {
        const roleMenu = allRoleMenus?.find(
            (rm: RoleMenu) => rm.roleId === role.id,
        )
        roleMenu?.menuIds.forEach((id: number) => menuIdSet.add(id))
    })

    // 获取菜单详情并过滤 type !== 'button'
    const allMenus = await menuStore.getMenuList()
    const accessMenus = allMenus?.filter(
        (m) => menuIdSet.has(m.id) && m.type !== 'button' && m.visible,
    )
    filterMenu.value = accessMenus

    // 裁剪 path
    const processedMenus = preprocessMenuPaths(accessMenus!)

    // 构建菜单树（作为动态路由）
    const routes = buildRoutesTree(processedMenus)
    routes.forEach((r) => {
        router.addRoute('Layout', r)
        if (r.name) addedRouteNames.push(r.name as string)
    })
    return routes
}

function preprocessMenuPaths(menus: MenuItem[]): MenuItem[] {
    return menus.map((menu) => {
        const parts = menu.path?.split('/').filter(Boolean) ?? []
        return {
            ...menu,
            path: parts[parts.length - 1] || '',
        }
    })
}

export function buildRoutesTree(menus: MenuItem[]): RouteRecordRaw[] {
    const modules = import.meta.glob('@/views/**/*.vue')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const map = new Map<number, any>()
    const roots: RouteRecordRaw[] = []

    menus.forEach((menu) => {
        const route: RouteRecordRaw = {
            path: menu.path!,
            name: menu.name,
            component: modules[`/src/views/${menu.component}`],
            meta: { title: menu.title, icon: menu.icon },
            children: [],
        }

        if (!menus.some((m) => m.parentId === menu.id)) {
            route.component = modules[`/src/views/${menu.component}`]
        } else {
            route.component = RouterView
        }

        map.set(menu.id, route)

        if (menu.parentId && map.has(menu.parentId)) {
            map.get(menu.parentId)!.children.push(route)
        } else {
            roots.push(route)
        }
    })
    function addRedirects(routes: RouteRecordRaw[], basePath = '') {
        routes.forEach((route) => {
            const fullPath = basePath
                ? `${basePath}/${route.path}`.replace(/\/+/g, '/')
                : `/${route.path}`

            if (route.children && route.children.length > 0) {
                const firstChildPath =
                    `${fullPath}/${route.children[0].path}`.replace(/\/+/g, '/')
                route.redirect = firstChildPath
                addRedirects(route.children, fullPath)
            }
        })
    }
    addRedirects(roots)

    return roots
}

export function resetRouter() {
    addedRouteNames.forEach((name) => {
        if (router.hasRoute(name)) {
            router.removeRoute(name)
        }
    })
    addedRouteNames.length = 0
}
