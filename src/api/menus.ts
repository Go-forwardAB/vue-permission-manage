import { service } from '@/utils/fetch'
import { MenuItem } from '@/types/menus'
import { Response } from '@/types/response'

interface menusListResponse extends Response {
    data: MenuItem[]
}

export function menusList() {
    return service<menusListResponse>(`/menusList`, {
        method: 'GET',
    })
}

export function addMenu(data: MenuItem) {
    return service<Response>(`/menuAdd`, {
        method: 'POST',
        body: data,
    })
}

export function deleteMenu(id: number) {
    return service<Response>(`/menuDelete/${id}`, {
        method: 'GET',
    })
}

export function updateMenu(data: MenuItem) {
    return service<Response>(`/menuUpdate`, {
        method: 'POST',
        body: data,
    })
}

export function setMenuVisible(data: { id: number; visible: boolean }) {
    return service<Response>(`/setMenuVisible`, {
        method: 'POST',
        body: data,
    })
}
