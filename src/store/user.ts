import { defineStore } from 'pinia'

interface UserInfo {
    username: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [prop: string]: any
}

export const useUserInfoStore = defineStore(
    'userInfo',
    () => {
        const userInfo = ref<UserInfo>({
            username: '',
            password: '',
        })
        const $reset = () => {
            userInfo.value = {
                username: '',
                password: '',
            }
        }
        return { userInfo, $reset }
    },
    {
        persist: {
            enabled: true,
            strategies: [
                {
                    key: 'app-user',
                    paths: ['userInfo'],
                },
            ],
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
)
