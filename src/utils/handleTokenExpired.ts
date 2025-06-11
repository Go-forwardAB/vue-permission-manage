import { router } from '@/router'
import { clearAllTokens } from '@/utils/token'

export function handleTokenExpired() {
    const rememberedUser = localStorage.getItem('rememberedUser')
    if (rememberedUser) {
        const temp = rememberedUser
        localStorage.clear()
        clearAllTokens()
        localStorage.setItem('rememberedUser', temp)
    } else {
        localStorage.clear()
    }
    router.replace('/login')
}
