<template>
    <el-dialog
        :title="form.id ? '编辑用户' : '新增用户'"
        :model-value="visible"
        width="500px"
        destroy-on-close
        @update:model-value="emit('update:visible', $event)"
    >
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username" placeholder="请输入用户名" />
            </el-form-item>

            <el-form-item label="密码" prop="password">
                <el-input v-model="form.password" placeholder="请输入密码" />
            </el-form-item>

            <el-form-item label="昵称" prop="nickname">
                <el-input v-model="form.nickname" placeholder="请输入昵称" />
            </el-form-item>

            <el-form-item label="分配角色" prop="roleIds">
                <el-select
                    v-model="form.roleIds"
                    multiple
                    filterable
                    placeholder="请选择角色"
                >
                    <el-option
                        v-for="role in roleList"
                        :key="role.id"
                        :label="role.name"
                        :value="role.id!"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="是否启用" prop="enabled">
                <el-switch v-model="form.enabled" />
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="emit('update:visible', false)">取消</el-button>
            <el-button type="primary" @click="onSubmit">保存</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { userSave } from '@/api/users'
import { rolesList } from '@/api/roles'
import type { User } from '@/types/user'
import type { Role } from '@/types/role'
import { useUserInfoStore } from '@/store/user'
import { logout } from '@/composables/logout'

const userInfoStore = useUserInfoStore()

const props = defineProps<{
    visible: boolean
    user?: User | null
}>()

const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
    (e: 'saved'): void
}>()

const formRef = ref<FormInstance>()
const form = reactive<User>({
    username: '',
    password: '',
    nickname: '',
    enabled: true,
    roleIds: [],
})

const rules = reactive<FormRules>({
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
})

const roleList = ref<Role[]>([])

watch(
    () => props.visible,
    (val) => {
        if (val) {
            loadRoles()
            if (props.user) {
                Object.assign(form, props.user)
            } else {
                Object.assign(form, {
                    username: '',
                    password: '',
                    nickname: '',
                    enabled: true,
                    roleIds: [],
                })
            }
        }
    },
    { immediate: true },
)

async function loadRoles() {
    const res = await rolesList(1, 9999, '')
    roleList.value = res.data
}

async function onSubmit() {
    try {
        const isSelf = userInfoStore.userInfo.id === form.id
        await formRef.value?.validate()
        const res = await userSave(form)
        if (res.code === 200) {
            ElMessage.success(res.message)
            emit('update:visible', false)
            emit('saved')
            if (isSelf) {
                logout(true)
            }
        } else {
            ElMessage.error(res.message || '保存失败')
        }
    } catch (err) {
        console.log(err)
    }
}
</script>
