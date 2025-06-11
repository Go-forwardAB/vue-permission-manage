import { service } from '@/utils/fetch'
import { Response } from '@/types/response'

interface LoginParams {
    username: string
    password: string
}

interface updatePasswordParams {
    oldPwd: string
    newPwd: string
    confirmPwd: string
}

interface LoginResponse extends Response {
    message: string
    data: {
        accessToken: string
        refreshToken: string
        user: {
            username: string
            enabled: boolean
        }
    }
}
interface updatePasswordResponse extends Response {
    message: string
}

export function login(data: LoginParams) {
    return service<LoginResponse>('/login', {
        method: 'POST',
        body: data,
    })
}

export function updatePassword(data: updatePasswordParams) {
    return service<updatePasswordResponse>('/updatePassword', {
        method: 'POST',
        body: data,
    })
}

export function logout(data: { userId: number }) {
    return service<Response>('/logout', {
        method: 'POST',
        body: data,
    })
}
