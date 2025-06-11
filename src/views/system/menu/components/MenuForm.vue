<template>
    <el-dialog
        v-model="visible"
        :title="isEdit ? '编辑菜单' : '新增菜单'"
        width="500px"
        @close="resetForm"
    >
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
            <el-form-item
                :label="`${form.type === 'button' ? '按钮' : form.type === 'menu' ? '菜单' : '目录'}名称`"
                prop="title"
            >
                <el-input
                    v-model="form.title"
                    :placeholder="`请输入${form.type === 'button' ? '按钮' : form.type === 'menu' ? '菜单' : '目录'}名称`"
                />
            </el-form-item>

            <el-form-item
                v-if="form.type === 'menu'"
                label="父级菜单"
                prop="parentId"
            >
                <el-cascader
                    v-model="form.parentId"
                    :options="menuTree"
                    :props="{
                        label: 'title',
                        value: 'id',
                        children: 'children',
                        emitPath: false,
                        checkStrictly: true,
                    }"
                    clearable
                    placeholder="请选择父级菜单"
                />
            </el-form-item>

            <el-form-item
                v-if="form.type === 'menu'"
                label="组件"
                prop="component"
            >
                <el-select
                    v-model="form.component"
                    filterable
                    placeholder="请选择组件"
                    @change="onComponentChange"
                >
                    <el-option
                        v-for="item in componentOptions"
                        :key="item.component"
                        :label="item.component"
                        :value="item.component"
                    />
                </el-select>
            </el-form-item>

            <el-form-item
                v-if="form.type === 'menu'"
                label="组件名称"
                prop="name"
            >
                <el-input v-model="form.name" readonly></el-input>
            </el-form-item>

            <el-form-item
                v-if="form.type !== 'button'"
                label="路由地址"
                prop="path"
            >
                <el-input
                    v-model="form.path"
                    :readonly="form.type === 'menu'"
                    placeholder="请输入路由地址"
                />
            </el-form-item>

            <el-form-item
                v-if="form.type !== 'button'"
                label="图标"
                prop="icon"
            >
                <el-select
                    v-model="form.icon"
                    clearable
                    placeholder="请选择图标"
                >
                    <el-option label="设置" value="Management">
                        <div class="flex items-center">
                            <el-icon>
                                <DynamicIcon :name="'Management'" />
                            </el-icon>
                            <span>设置</span>
                        </div>
                    </el-option>
                    <el-option label="菜单" value="Menu">
                        <div class="flex items-center">
                            <el-icon>
                                <DynamicIcon :name="'Menu'" />
                            </el-icon>
                            <span>菜单</span>
                        </div>
                    </el-option>
                    <el-option label="首页" value="House">
                        <div class="flex items-center">
                            <el-icon>
                                <DynamicIcon :name="'House'" />
                            </el-icon>
                            <span>首页</span>
                        </div>
                    </el-option>
                    <!-- 可以自己扩展图标列表 -->
                    <el-option label="记事本" value="Notebook">
                        <div class="flex items-center">
                            <el-icon>
                                <DynamicIcon :name="'Notebook'" />
                            </el-icon>
                            <span>记事本</span>
                        </div>
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item
                v-if="form.type === 'button'"
                label="按钮标识"
                prop="code"
            >
                <el-input
                    v-model="form.code"
                    placeholder="请输入按钮标识，如：user:add"
                />
            </el-form-item>

            <el-form-item label="类型" prop="type">
                <el-radio-group v-model="form.type">
                    <el-radio value="directory">目录</el-radio>
                    <el-radio value="menu">菜单</el-radio>
                    <el-radio value="button">按钮</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="排序" prop="order">
                <el-input-number v-model="form.order" :min="0" />
            </el-form-item>

            <el-form-item
                v-if="form.type !== 'button'"
                label="是否显示"
                prop="visible"
            >
                <el-switch v-model="form.visible" />
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineExpose, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import DynamicIcon from '@/components/DynamicIcon.vue'
import { MenuItem } from '@/types/menus'
import { getComponentList } from '@/utils/componentOptions'

defineProps<{
    menuTree: MenuItem[]
}>()

const emit = defineEmits<{
    (e: 'submitSuccess', form: MenuItem): void
}>()

const componentOptions = ref(getComponentList())
const visible = ref(false)
const isEdit = ref(false)

const form = ref<MenuItem>({
    id: 0,
    title: '',
    name: '',
    component: '',
    path: '',
    type: 'menu',
    icon: '',
    code: '',
    parentId: 0,
    order: 0,
    visible: true,
})

const formRef = ref<FormInstance>()

const rules: FormRules = {
    title: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
    parentId: [
        { required: true, message: '请选择父级菜单', trigger: 'change' },
    ],
    name: [{ required: true, message: '请选择组件名称', trigger: 'change' }],
    component: [{ required: true, message: '请输入组件目录', trigger: 'blur' }],
    path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
    icon: [{ required: true, message: '请选择菜单图标', trigger: 'change' }],
    code: [{ required: true, message: '请输入按钮标识', trigger: 'blur' }],
    type: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
}

watch(
    () => form.value.type,
    (newType) => (form.value.visible = newType !== 'button'),
)

function onComponentChange(path: string) {
    const comp = componentOptions.value.find((item) => item.component === path)
    if (comp) {
        form.value.component = comp.component
        form.value.name = comp.name
        form.value.path = comp.path
    }
}

// 提供给父组件调用
function open(data?: MenuItem) {
    visible.value = true
    if (data) {
        isEdit.value = true
        form.value = { ...data }
    } else {
        isEdit.value = false
        form.value = {
            id: 0,
            title: '',
            name: '',
            component: '',
            path: '',
            type: 'menu',
            icon: '',
            code: '',
            parentId: 0,
            order: 0,
            visible: true,
        }
    }
}

function closeDialog() {
    visible.value = false
}

defineExpose({ open, closeDialog })

function resetForm() {
    formRef.value?.resetFields()
}

function handleSubmit() {
    formRef.value?.validate((valid) => {
        if (!valid) return
        emit('submitSuccess', { ...form.value })
    })
}
</script>
