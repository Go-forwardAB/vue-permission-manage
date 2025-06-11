import { getTokenA, getTokenR } from '@/utils/token'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { handleTokenExpired } from '@/utils/handleTokenExpired'
import Layout from '@/components/layout/index.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
        },
        component: () => import('@/views/Login.vue'),
    },
    {
        path: '/',
        name: 'Layout',
        component: Layout,
        children: [
            //     {
            //         path: '',
            //         name: 'Home',
            //         meta: {
            //             title: '首页',
            //         },
            //         component: () => import('@/views/Home.vue'),
            //     },
            //     {
            //         path: '/system',
            //         meta: {
            //             title: '系统管理',
            //         },
            //         children: [
            //             {
            //                 path: 'menu',
            //                 name: 'SystemMenu',
            //                 meta: {
            //                     title: '菜单管理',
            //                     keepAlive: true,
            //                     requireAuth: true,
            //                 },
            //                 component: () =>
            //                     import('@/views/system/menu/index.vue'),
            //             },
            //             {
            //                 path: 'role',
            //                 name: 'SystemRole',
            //                 meta: {
            //                     title: '角色管理',
            //                     keepAlive: true,
            //                     requireAuth: true,
            //                 },
            //                 component: () =>
            //                     import('@/views/system/role/index.vue'),
            //             },
            //             {
            //                 path: 'user',
            //                 name: 'SystemUser',
            //                 meta: {
            //                     title: '用户管理',
            //                     keepAlive: true,
            //                     requireAuth: true,
            //                 },
            //                 component: () =>
            //                     import('@/views/system/user/index.vue'),
            //             },
            //         ],
            //     },
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

function sleep(ms: number) {
    return new Promise((resolve) =>
        queueMicrotask(() =>
            requestAnimationFrame(() => setTimeout(resolve, ms)),
        ),
    )
}

router.beforeEach(async (to, from, next) => {
    const tokenA = getTokenA()
    const tokenR = getTokenR()

    if (!tokenA && !tokenR && to.name !== 'Login') {
        ElMessage.warning('登录已失效，请重新登录')
        await sleep(1000)
        handleTokenExpired()
        return next({ name: 'Login' })
    }

    return next()
})

export { router }
