<template>
    <nav class="header-nav flex flex-row items-center">
        <h3
            class="title text-3xl font-medium text-primary-dark dark:text-ternary-light hidden sm:block"
        >
            管理系统
        </h3>
        <div class="nav-right flex flex-row justify-between items-center">
            <VueUse class="switch-icon" />
            <el-button type="primary" :circle="true" @click="logout(false)">
                <el-icon><SwitchButton /></el-icon>
            </el-button>
        </div>
    </nav>
</template>

<script setup lang="ts">
import VueUse from '../VueUse.vue'
import { SwitchButton } from '@element-plus/icons-vue'
import { logout } from '@/composables/logout'
</script>

<style lang="scss" scoped>
.header-nav {
    width: 100%;
    height: 100%;
}

.nav-left {
    position: absolute;
    top: 12px;
    left: 20px;
}

.logo {
    width: 30px;
    height: 30px;
}

.nav-items {
    margin-left: 10px;
}

.nav-right {
    position: absolute;
    top: 12px;
    right: 20px;
}

.title {
    font-weight: bold;
    line-height: 60px;

    &.title-sm {
        font-size: 12px;
    }
}

.switch-icon {
    margin-left: 20px;
}
</style>
