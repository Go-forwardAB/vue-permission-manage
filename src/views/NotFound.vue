<template>
    <div class="not-found">
        <el-result
            icon="warning"
            title="404"
            sub-title="抱歉，您访问的页面不存在。"
        >
            <template #extra>
                <el-button type="primary" @click="goHome">返回首页</el-button>
            </template>
        </el-result>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTabsStore } from '@/store/tabs'

const router = useRouter()
const useTabs = useTabsStore()
const goHome = () => {
    router.push('/dashboard')
    useTabs.activeTab = '/dashboard'
}
</script>

<style scoped>
.not-found {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
</style>
