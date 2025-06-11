<template>
    <el-button v-permission="'table:add'" type="primary">新增</el-button>
    <el-button v-permission="'table:del'" type="danger">删除</el-button>
    <el-button v-permission="'table:edit'">修改</el-button>
</template>

<script lang="ts" setup>
defineOptions({
    name: 'PackTable',
})
</script>

<style lang="scss"></style>
