import { logout as _logout } from '@/api/login'
import { resetRouter } from '@/router/dynamic'
import { useTabsStore } from '@/store/tabs'
import { useUserInfoStore } from '@/store/user'
import { handleTokenExpired } from '@/utils/handleTokenExpired'
import { clearAllTokens } from '@/utils/token'
import { ElMessage, ElMessageBox } from 'element-plus'

export function logout(auto: boolean) {
    if (!auto) {
        ElMessageBox.confirm(`确定要退出登录吗？`, '提示', {
            type: 'warning',
            cancelButtonText: '取消',
            confirmButtonText: '确认',
        })
            .then(() => {
                queryLogout()
            })
            .catch(() => {})
    } else {
        ElMessageBox.confirm(`权限已变更，请重新登录后生效`, '提示', {
            type: 'warning',
            cancelButtonText: '取消',
            confirmButtonText: '确认',
        })
            .then(() => {
                queryLogout()
            })
            .catch(() => {})
    }
}

async function queryLogout() {
    const tabStore = useTabsStore()
    const userInfoStore = useUserInfoStore()

    const res = await _logout({
        userId: userInfoStore?.userInfo?.id,
    })
    if (res.code === 200) {
        tabStore.$reset()
        resetRouter()
        clearAllTokens()
        handleTokenExpired()
        ElMessage.success(res.message)
    }
}
