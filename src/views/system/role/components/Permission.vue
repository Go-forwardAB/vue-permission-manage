<template>
    <el-dialog
        v-model="visible"
        title="分配权限"
        width="600px"
        :close-on-click-modal="false"
    >
        <el-tabs v-model="activeTab">
            <el-tab-pane label="菜单权限" name="menu">
                <el-tree
                    ref="treeRef"
                    :data="menuTree"
                    show-checkbox
                    node-key="id"
                    highlight-current
                    :default-checked-keys="checkedMenuIds"
                    :props="treeProps"
                    class="permission-tree"
                />
            </el-tab-pane>
            <el-tab-pane label="按钮权限" name="button">
                <div
                    v-for="menu in menuWithButtons"
                    :key="menu.id"
                    class="menu-button-group"
                >
                    <div class="menu-title">{{ menu.title }}</div>
                    <el-checkbox-group v-model="checkedButtonIds">
                        <el-checkbox
                            v-for="btn in menu.buttons"
                            :key="btn.id"
                            :value="btn.id"
                        >
                            {{ btn.title }}
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
            </el-tab-pane>
        </el-tabs>

        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleSave">保存</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { roleMenu, roleMenuUpdate } from '@/api/roles'
import { useMenusStore } from '@/store/menu'
import { attachButtonsToMenus, filterVisibleMenus } from './utils'
import { useUserInfoStore } from '@/store/user'
import { logout } from '@/composables/logout'

const userInfoStore = useUserInfoStore()

const props = defineProps<{ modelValue: boolean; roleId: number }>()
const emit = defineEmits(['update:modelValue', 'saved'])

const visible = ref(props.modelValue)
const activeTab = ref('menu')

watch(
    () => props.modelValue,
    (val) => (visible.value = val),
)
watch(
    () => visible.value,
    (val) => emit('update:modelValue', val),
)

const useMenus = useMenusStore()

// 过滤出可见的菜单树结构（不含按钮）
const menuTree = computed(() => filterVisibleMenus(useMenus.init_menus, 0))

// 为菜单附加按钮列表（扁平数组转树后，按钮在对应菜单下）
const menuWithButtons = computed(() =>
    attachButtonsToMenus(useMenus.init_menus),
)

const checkedMenuIds = ref<number[]>([])
const checkedButtonIds = ref<number[]>([])

const treeRef = ref()

const treeProps = {
    label: 'title',
    children: 'children',
}

async function loadMenus() {
    const res = await roleMenu(props.roleId)
    const allCheckedIds: number[] = res.data || []
    // 菜单权限（排除按钮）
    checkedMenuIds.value = allCheckedIds.filter((id) =>
        useMenus.init_menus.some((m) => m.id === id && m.type !== 'button'),
    )
    // 按钮权限
    checkedButtonIds.value = allCheckedIds.filter((id) =>
        useMenus.init_menus.some((m) => m.id === id && m.type === 'button'),
    )
}

async function handleSave() {
    const checkedMenusFromTree: number[] = treeRef.value?.getCheckedKeys() || []
    const finalMenuIds = Array.from(
        new Set([...checkedMenusFromTree, ...checkedButtonIds.value]),
    )

    try {
        const isSelf =
            userInfoStore.userInfo.roleIds.indexOf(props.roleId) !== -1
        const res = await roleMenuUpdate({
            roleId: props.roleId,
            menuIds: finalMenuIds,
        })
        if (res.code === 200) {
            ElMessage.success(res.message)
            visible.value = false
            if (isSelf) {
                logout(true)
            }
        } else {
            ElMessage.error(res.error)
        }
    } catch (err) {
        console.error(err)
    }
}

function handleClose() {
    visible.value = false
}

onMounted(loadMenus)
</script>

<style scoped>
.permission-tree {
    max-height: 600px;
    overflow-y: auto;
    padding: 10px;
    border: 1px solid #ebeef5;
    border-radius: 6px;
}

.menu-button-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    padding: 10px;
}
</style>
