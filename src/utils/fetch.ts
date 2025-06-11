import { setTokenA, getTokenA, getTokenR, removeTokenA } from './token'
import { handleTokenExpired } from './handleTokenExpired'

let isRefreshing = false
let refreshTokenPromise: Promise<string> | null = null

const baseUrl = import.meta.env.VITE_API_BASE_URL

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function service<T = any>(
    url: string,
    options: Omit<RequestInit, 'body'> & { body?: unknown } = {},
): Promise<T> {
    let accessToken = getTokenA()

    if (isRefreshing && refreshTokenPromise) {
        try {
            // 等待 refreshToken 完成后拿到新的 token
            accessToken = await refreshTokenPromise
        } catch {
            // 刷新失败：终止
            return Promise.reject('refreshToken failed')
        }
    }

    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
    }

    const response = await fetch(baseUrl + url, {
        ...options,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
    })

    if (response.status === 401 && getTokenR()) {
        if (!isRefreshing) {
            isRefreshing = true
            refreshTokenPromise = fetch('/api/refreshToken', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: getTokenR() }),
            })
                .then(async (res) => {
                    if (!res.ok) throw new Error('refreshToken 失效')
                    const data = await res.json()
                    const newToken = data.data.accessToken
                    removeTokenA()
                    setTokenA(newToken)
                    return newToken
                })
                .catch((err) => {
                    handleTokenExpired()
                    throw err
                })
                .finally(() => {
                    isRefreshing = false
                })
        }

        try {
            // 等待刷新完成
            await refreshTokenPromise
            // 使用新 token 重新发起原请求
            return service<T>(url, options)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    return response.json()
}
