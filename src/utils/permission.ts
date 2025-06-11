import { useMenusStore } from '@/store/menu'

export default {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mounted(el: HTMLElement, binding: any) {
        const { value } = binding
        const userStore = useMenusStore()
        const permissions = userStore.btns

        if (!permissions.includes(value)) {
            el?.parentNode && el?.parentNode.removeChild(el)
        }
    },
}
