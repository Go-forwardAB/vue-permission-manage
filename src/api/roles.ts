import { service } from '@/utils/fetch'
import { Response } from '@/types/response'
import { Role } from '@/types/role'

interface RoleResponse extends Response {
    total: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[]
}

export function rolesList(page: number, pageSize: number, name: string) {
    return service<RoleResponse>(
        `/roles?page=${page}&pageSize=${pageSize}&name=${name}`,
        {
            method: 'GET',
        },
    )
}

export function roleSave(data: Role) {
    return service<Response>(`/roleSave`, {
        method: 'POST',
        body: data,
    })
}

export function roleDelete(data: { id: number }) {
    return service<Response>(`/roleDelete`, {
        method: 'POST',
        body: data,
    })
}

// 重载声明
export function roleMenu(roleId: number): Promise<Response & { data: number[] }>
export function roleMenu(): Promise<
    Response & { data: { id: number; roleId: number; menuIds: number[] }[] }
>
export function roleMenu(roleId?: number) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return service<any>(`/roleMenu?roleId=${roleId}`, {
        method: 'GET',
    })
}

export function roleMenuUpdate(data: { roleId: number; menuIds: number[] }) {
    return service<Response>(`/roleMenuUpdate`, {
        method: 'POST',
        body: data,
    })
}

export function roleEnabled(data: { id: number; enabled: boolean }) {
    return service<Response>(`/roleEnabled`, {
        method: 'POST',
        body: data,
    })
}
