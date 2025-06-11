import { service } from '@/utils/fetch'
import { Response } from '@/types/response'
import { User } from '@/types/user'

interface RoleResponse extends Response {
    total: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[]
}

export function usersList(page: number, pageSize: number, name: string) {
    return service<RoleResponse>(
        `/users?page=${page}&pageSize=${pageSize}&username=${name}`,
        {
            method: 'GET',
        },
    )
}

export function userSave(data: User) {
    return service<Response>(`/userSave`, {
        method: 'POST',
        body: data,
    })
}

export function userDelete(data: { id: number }) {
    return service<Response>(`/userDelete`, {
        method: 'POST',
        body: data,
    })
}

export function userEnabled(data: { id: number; enabled: boolean }) {
    return service<Response>(`/userEnabled`, {
        method: 'POST',
        body: data,
    })
}
