<template>
    <el-card>
        <div class="flex justify-between items-center mb-4">
            <el-input
                v-model="searchKeyword"
                placeholder="请输入角色名称"
                clearable
                @keyup.enter="fetchRoles"
            />
            <el-button type="primary" @click="fetchRoles">搜索</el-button>
            <el-button type="primary" @click="onCreate">新增角色</el-button>
        </div>

        <el-table :data="roleList" stripe border style="width: 100%">
            <el-table-column type="index" label="#" width="60" />
            <el-table-column prop="name" label="角色名称" />
            <el-table-column prop="code" label="角色编码" />
            <el-table-column prop="description" label="角色描述" />
            <el-table-column prop="visible" label="是否启用" width="100">
                <template #default="{ row }">
                    <el-switch
                        v-model="row.enabled"
                        @change="setEnabled(row)"
                    />
                </template>
            </el-table-column>
            <el-table-column label="操作" width="240">
                <template #default="{ row }">
                    <el-button size="small" type="primary" @click="onEdit(row)"
                        >编辑</el-button
                    >
                    <el-button size="small" @click="onAssignPermission(row.id)"
                        >分配权限</el-button
                    >
                    <el-button size="small" type="danger" @click="onDelete(row)"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>

        <div class="mt-4 flex justify-end">
            <el-pagination
                layout="prev, pager, next, jumper"
                :total="total"
                :page-size="pageSize"
                :current-page="page"
                @current-change="handlePageChange"
            />
        </div>
    </el-card>
    <RoleForm ref="roleFormRef" @success="onSubmitSuccess" />
    <Permission
        v-if="dialogVisible"
        v-model="dialogVisible"
        :role-id="selectedRoleId"
    />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { rolesList, roleDelete, roleEnabled } from '@/api/roles'
import RoleForm from './components/RoleForm.vue'
import Permission from './components/Permission.vue'
import { Role } from '@/types/role'

const roleList = ref<Role[]>([])
const searchKeyword = ref('')
const page = ref(1)
const pageSize = 10
const total = ref(0)
const roleFormRef = ref<InstanceType<typeof RoleForm>>()
const dialogVisible = ref(false)
const selectedRoleId = ref<number>(0)

const fetchRoles = async () => {
    const res = await rolesList(page.value, pageSize, searchKeyword.value)
    roleList.value = res.data
    total.value = res.total
}

const handlePageChange = (newPage: number) => {
    page.value = newPage
    fetchRoles()
}

const onCreate = () => {
    roleFormRef.value?.open()
}

const onEdit = (role: Role) => {
    roleFormRef.value?.open(role)
}

const onSubmitSuccess = () => {
    fetchRoles()
}

const onAssignPermission = (id: number) => {
    selectedRoleId.value = id
    dialogVisible.value = true
}

const onDelete = (role: Role) => {
    ElMessageBox.confirm(`确定删除角色 "${role.name}" 吗？`, '提示', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确认',
    })
        .then(async () => {
            const res = await roleDelete({ id: role.id! })
            ElMessage.success(res.message)
            fetchRoles()
        })
        .catch(() => {})
}
async function setEnabled(row: Role) {
    try {
        const res = await roleEnabled({ id: row.id!, enabled: row.enabled! })
        if (res.code === 200) {
            ElMessage.success(res.message)
        } else {
            ElMessage.error(res.error)
        }
    } catch (err) {
        console.log(err)
    }
}
onMounted(fetchRoles)
</script>
