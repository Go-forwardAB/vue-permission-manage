import { ref } from 'vue'
import { defineStore } from 'pinia'
import { rolesList, roleMenu } from '@/api/roles'
import { Role } from '@/types/role'

export const useRoleStore = defineStore('roles', () => {
    const role = ref<Role[]>([])

    async function getRoleList() {
        try {
            const res = await rolesList(1, 9999, '')
            role.value = res.data
            return res.data
        } catch (err) {
            console.log(err)
        }
    }

    async function getRoleMenu() {
        try {
            const res = await roleMenu()
            return res.data
        } catch (err) {
            console.log(err)
        }
    }

    return {
        role,
        getRoleList,
        getRoleMenu,
    }
})
