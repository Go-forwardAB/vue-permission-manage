<template>
    <el-card>
        <div class="flex justify-between items-center mb-4">
            <el-input
                v-model="searchKeyword"
                placeholder="请输入用户名称"
                clearable
                @keyup.enter="fetchRoles"
            />
            <el-button type="primary" @click="fetchRoles">搜索</el-button>
            <el-button type="primary" @click="onCreate">新增用户</el-button>
        </div>

        <el-table :data="userList" stripe border style="width: 100%">
            <el-table-column type="index" label="#" width="60" />
            <el-table-column prop="username" label="角色名称" />
            <el-table-column prop="password" label="角色密码" />
            <el-table-column prop="nickname" label="昵称" />
            <el-table-column label="拥有角色">
                <template #default="{ row }">
                    <el-tag
                        v-for="item in row.roleNames"
                        :key="item.role"
                        size="small"
                        :type="item.enabled ? 'primary' : 'info'"
                        class="mr-1"
                    >
                        {{ item.role }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="visible" label="是否启用" width="100">
                <template #default="{ row }">
                    <el-switch
                        v-model="row.enabled"
                        @change="setEnabled(row)"
                    />
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template #default="{ row }">
                    <el-button size="small" type="primary" @click="onEdit(row)"
                        >编辑</el-button
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
    <UserForm
        v-if="dialogVisible"
        v-model:visible="dialogVisible"
        :user="editingUser"
        @saved="fetchRoles"
    />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { usersList, userEnabled, userDelete } from '@/api/users'
import { User } from '@/types/user'
import UserForm from './components/UserForm.vue'

const userList = ref<User[]>([])
const searchKeyword = ref('')
const page = ref(1)
const pageSize = 10
const total = ref(0)
const dialogVisible = ref(false)
const editingUser = ref<User | null>(null)

const fetchRoles = async () => {
    const res = await usersList(page.value, pageSize, searchKeyword.value)
    userList.value = res.data
    total.value = res.total
}

const handlePageChange = (newPage: number) => {
    page.value = newPage
    fetchRoles()
}

const onCreate = () => {
    editingUser.value = null
    dialogVisible.value = true
}

const onEdit = (user: User) => {
    editingUser.value = { ...user }
    dialogVisible.value = true
}

const onDelete = (user: User) => {
    ElMessageBox.confirm(`确定删除用户 "${user.username}" 吗？`, '提示', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确认',
    })
        .then(async () => {
            const res = await userDelete({ id: user.id! })
            ElMessage.success(res.message)
            fetchRoles()
        })
        .catch(() => {})
}
async function setEnabled(row: User) {
    try {
        const res = await userEnabled({ id: row.id!, enabled: row.enabled! })
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
