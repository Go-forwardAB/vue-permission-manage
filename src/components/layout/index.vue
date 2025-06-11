<template>
    <el-container>
        <el-header>
            <Header />
        </el-header>
        <el-container>
            <Aside />
            <el-main class="main">
                <TabView />
                <RouterView />
            </el-main>
        </el-container>
    </el-container>
</template>

<script lang="ts" setup>
import Header from './Header.vue'
import Aside from './Aside.vue'
import TabView from './TabView.vue'
</script>

<style lang="scss">
.el-header {
    background-color: #a0cfff;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 150%;
    text-align: center;
}

.main {
    min-height: 500px;
    padding: 0;
}

.sw-msg {
    margin-top: 20px;
}
</style>
