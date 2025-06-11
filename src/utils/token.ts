import { useCookies } from '@vueuse/integrations/useCookies'

const cookies = useCookies()

const TOKEN_KEY_A = 'A_token'
const TOKEN_KEY_R = 'R_token'

export function setTokenA(val: string) {
    cookies.set(TOKEN_KEY_A, val, {
        maxAge: 3600,
    })
}

export function setTokenR(val: string) {
    cookies.set(TOKEN_KEY_R, val, {
        maxAge: 3600,
    })
}

export function getTokenA() {
    return cookies.get(TOKEN_KEY_A)
}

export function getTokenR() {
    return cookies.get(TOKEN_KEY_R)
}

export function removeTokenA() {
    cookies.remove(TOKEN_KEY_A)
}

export function removeTokenR() {
    cookies.remove(TOKEN_KEY_R)
}

export function clearAllTokens() {
    removeTokenA()
    removeTokenR()
}
