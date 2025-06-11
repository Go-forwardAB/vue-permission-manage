<template>
    <div class="menu-manage">
        <el-card>
            <!-- 工具栏 -->
            <div class="m-b-[16px] flex justify-between">
                <el-input
                    v-model="searchKeyword"
                    placeholder="请输入菜单名称或路径"
                    clearable
                    style="width: 240px"
                />
                <el-button type="primary" @click="openAddDialog"
                    >新增菜单</el-button
                >
            </div>

            <!-- 表格 -->
            <el-table
                :data="filteredMenus"
                row-key="id"
                border
                default-expand-all
                style="width: 100%"
                :tree-props="{ children: 'children' }"
            >
                <el-table-column
                    prop="title"
                    label="菜单名称"
                    min-width="180"
                />
                <el-table-column label="路径/按钮标识">
                    <template #default="{ row }">
                        {{ row.type === 'button' ? row.code : row.path }}
                    </template>
                </el-table-column>
                <el-table-column label="图标" width="100">
                    <template #default="{ row }">
                        <el-icon v-if="row.icon">
                            <DynamicIcon :name="row.icon" />
                        </el-icon>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="类型" width="100">
                    <template #default="{ row }">
                        <el-tag :type="typeMap[row.type].tag">{{
                            typeMap[row.type].label
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="order" label="排序" width="80" />
                <el-table-column prop="visible" label="显示" width="100">
                    <template #default="{ row }">
                        <el-switch
                            v-model="row.visible"
                            :disabled="
                                row.type === 'button' || row.disabled === false
                            "
                            @change="setVisible(row)"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" fixed="right">
                    <template #default="{ row }">
                        <el-button
                            type="primary"
                            size="small"
                            @click="editMenu(row)"
                            >编辑</el-button
                        >
                        <el-button
                            type="danger"
                            size="small"
                            @click="deleteMenu(row.id)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <MenuForm
            ref="formRef"
            :menu-tree="menuList"
            @submit-success="handleSubmitSuccess"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import MenuForm from './components/MenuForm.vue'
import DynamicIcon from '@/components/DynamicIcon.vue'
import {
    addMenu,
    deleteMenu as _deleteMenu,
    updateMenu,
    setMenuVisible,
} from '@/api/menus'
import { MenuItem } from '@/types/menus'
import { useMenusStore } from '@/store/menu'
defineOptions({
    name: 'SystemMenu',
})

const useMenus = useMenusStore()
// 类型映射用于显示标签
const typeMap = {
    directory: { label: '目录', tag: 'info' },
    menu: { label: '菜单', tag: 'success' },
    button: { label: '按钮', tag: 'warning' },
}
const menuList = computed(() => useMenus.menus)
console.log(menuList)
const searchKeyword = ref('')

// 搜索过滤逻辑
const filteredMenus = computed(() => {
    const keyword = searchKeyword.value.toLowerCase().trim()
    if (!keyword) return menuList.value

    const filterRecursive = (items: MenuItem[]): MenuItem[] =>
        items
            .map((item) => {
                const matched =
                    item.title.toLowerCase().includes(keyword) ||
                    (item.path && item.path.toLowerCase().includes(keyword))
                const children = item.children
                    ? filterRecursive(item.children)
                    : []
                if (matched || children.length > 0) {
                    return { ...item, children }
                }
                return null
            })
            .filter(Boolean) as MenuItem[]

    return filterRecursive(menuList.value)
})

function openAddDialog() {
    formRef.value?.open()
}

function editMenu(menu: MenuItem) {
    formRef.value?.open(menu)
}

function deleteMenu(id: number) {
    ElMessageBox.confirm('确认删除该菜单？', '提示', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确认',
    })
        .then(async () => {
            const res = await _deleteMenu(id)
            ElMessage.success(res.message)
            useMenus.getMenuList()
        })
        .catch(() => {})
}

const formRef = ref<InstanceType<typeof MenuForm>>()

async function handleSubmitSuccess(data: MenuItem) {
    if (data.id) {
        try {
            const res = await updateMenu(data)
            if (res.code === 200) {
                ElMessage.success(res.message)
                formRef.value?.closeDialog()
                useMenus.getMenuList()
            }
        } catch (err) {}
    } else {
        try {
            const res = await addMenu(data)
            if (res.code === 200) {
                ElMessage.success(res.message)
                formRef.value?.closeDialog()
                useMenus.getMenuList()
            } else {
                ElMessage.error(res.error)
            }
        } catch (err) {
            console.log(err)
        }
    }
}

async function setVisible(row: MenuItem) {
    try {
        const res = await setMenuVisible({ id: row.id, visible: row.visible! })
        if (res.code === 200) {
            ElMessage.success(res.message)
            useMenus.getMenuList()
        } else {
            ElMessage.error(res.error)
        }
    } catch (err) {
        console.log(err)
    }
}
</script>
