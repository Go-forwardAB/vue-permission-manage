<template>
    <el-dialog
        v-model="visible"
        :title="isEdit ? '编辑角色' : '新增角色'"
        width="500px"
        @close="handleClose"
    >
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="角色名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入角色名称" />
            </el-form-item>

            <el-form-item label="角色编码" prop="code">
                <el-input
                    v-model="form.code"
                    placeholder="请输入角色编码，如：admin"
                />
            </el-form-item>

            <el-form-item label="描述" prop="description">
                <el-input
                    v-model="form.description"
                    type="textarea"
                    :rows="3"
                />
            </el-form-item>
            <el-form-item label="是否启用" prop="enabled">
                <el-switch v-model="form.enabled" />
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">保存</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Role } from '@/types/role'
import { roleSave } from '@/api/roles'

const visible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const form = reactive<Role>({
    name: '',
    code: '',
    description: '',
    enabled: true,
})

const rules: FormRules = {
    name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
    code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
}

const emit = defineEmits<{
    (e: 'success'): void
}>()

function open(role?: Role) {
    if (role) {
        isEdit.value = true
        Object.assign(form, role)
    } else {
        isEdit.value = false
        Object.assign(form, {
            name: '',
            code: '',
            description: '',
            enabled: true,
        })
        delete form.id
    }
    visible.value = true
}

function handleClose() {
    formRef.value?.resetFields()
    visible.value = false
}

async function handleSubmit() {
    try {
        await formRef.value?.validate()
        const res = await roleSave(form)
        if (res.code === 200) {
            ElMessage.success(res.message)
            visible.value = false
            emit('success')
        } else {
            ElMessage.error(res.error)
        }
    } catch (err) {
        console.log(err)
    }
}

defineExpose({ open })
</script>
