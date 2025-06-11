<template>
    <div class="flex justify-center items-center min-h-screen bg-[#f5f7fa]">
        <el-card
            class="w-[500px] rounded-[8px] shadow-[0_2px_12px_0_rgba(0,0,0,0.1)]"
        >
            <template #header>
                <div class="flex justify-between items-center">
                    <h2>{{ $t('login.title') }}</h2>
                    <div class="ml-auto">
                        <el-dropdown @command="changeLanguage">
                            <el-button link>
                                {{ $t(`language.${locale}`) }}
                                <el-icon class="el-icon--right"
                                    ><arrow-down
                                /></el-icon>
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item command="zh">{{
                                        $t('language.zh')
                                    }}</el-dropdown-item>
                                    <el-dropdown-item command="en">{{
                                        $t('language.en')
                                    }}</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </div>
            </template>

            <el-form
                ref="loginFormRef"
                :model="loginForm"
                :rules="loginRules"
                label-position="right"
                label-width="auto"
            >
                <el-form-item :label="$t('login.username')" prop="username">
                    <el-input
                        v-model="loginForm.username"
                        :placeholder="$t('login.rules.username')"
                        :prefix-icon="User"
                    />
                </el-form-item>

                <el-form-item :label="$t('login.password')" prop="password">
                    <el-input
                        v-model="loginForm.password"
                        type="password"
                        :placeholder="$t('login.rules.password')"
                        :prefix-icon="Lock"
                        show-password
                    />
                </el-form-item>

                <el-form-item :label="$t('login.captcha')" prop="captcha">
                    <div class="flex w-full gap-2">
                        <el-input
                            v-model="loginForm.captcha"
                            :placeholder="$t('login.rules.captcha')"
                            @blur="validateCaptcha"
                        />
                        <el-button @click="refreshCaptcha">{{
                            captcha
                        }}</el-button>
                    </div>
                </el-form-item>

                <el-form-item>
                    <el-checkbox v-model="loginForm.remember">{{
                        $t('login.remember')
                    }}</el-checkbox>
                    <el-link
                        type="primary"
                        class="float-right"
                        @click="updatePwdDialog"
                        >{{ $t('login.forgot') }}</el-link
                    >
                </el-form-item>

                <el-form-item>
                    <el-button
                        type="primary"
                        native-type="submit"
                        class="w-[100%] mt-[10px]"
                        :loading="loading"
                        @click.prevent="handleLogin(loginFormRef)"
                    >
                        {{ $t('login.button') }}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 修改密码对话框 -->
        <el-dialog v-model="showChangePwd" title="修改密码" width="500px">
            <el-form
                ref="pwdRef"
                :model="pwdForm"
                :rules="pwdRules"
                label-width="100px"
            >
                <el-form-item label="旧密码" prop="oldPwd">
                    <el-input
                        v-model="pwdForm.oldPwd"
                        type="password"
                        show-password
                    />
                </el-form-item>
                <el-form-item label="新密码" prop="newPwd">
                    <el-input
                        v-model="pwdForm.newPwd"
                        type="password"
                        show-password
                    />
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPwd">
                    <el-input
                        v-model="pwdForm.confirmPwd"
                        type="password"
                        show-password
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showChangePwd = false">取消</el-button>
                <el-button type="primary" @click="submitChangePwd(pwdRef)"
                    >提交</el-button
                >
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowDown, User, Lock } from '@element-plus/icons-vue'
import { ElMessage, FormInstance } from 'element-plus'
import { login, updatePassword } from '@/api/login'
import { useUserInfoStore } from '@/store/user'
import { setTokenA, setTokenR } from '@/utils/token'
import { generateRoutes } from '@/router/dynamic'

defineOptions({
    name: 'Login',
})
const router = useRouter()
const userInfo = useUserInfoStore()

const { locale, t } = useI18n()

const loginFormRef = ref<FormInstance>()
const loginForm = ref({
    username: '',
    password: '',
    captcha: '',
    remember: false,
})
const loading = ref(false)
// 验证码
const captcha = ref('1234')
const refreshCaptcha = () => {
    captcha.value = Math.floor(1000 + Math.random() * 9000).toString()
}
// 失焦验证
const validateCaptcha = () => {
    loginFormRef.value?.validateField('captcha')
}

onMounted(() => {
    const savedUsername = localStorage.getItem('rememberedUser')
    if (savedUsername) {
        loginForm.value.username = savedUsername
        loginForm.value.remember = true
    }
    refreshCaptcha()
})

const loginRules = {
    username: [
        { required: true, message: t('login.rules.username'), trigger: 'blur' },
        {
            min: 5,
            max: 15,
            message: t('login.rules.usernameLen'),
            trigger: 'blur',
        },
    ],
    password: [
        { required: true, message: t('login.rules.password'), trigger: 'blur' },
        {
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/,
            message: '密码需为6-18位，包含字母和数字',
            trigger: 'blur',
        },
    ],
    captcha: [
        { required: true, message: t('login.rules.captcha'), trigger: 'blur' },
        {
            pattern: /^\d{4}$/,
            message: t('login.rules.captchaLen'),
            trigger: 'blur',
        },
        {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            asyncValidator: (_: any, value: string) => {
                return value !== captcha.value
                    ? Promise.reject(t('login.rules.captchaAuth'))
                    : Promise.resolve()
            },
            trigger: 'blur',
        },
    ],
}

const changeLanguage = (lang: string) => {
    locale.value = lang
    localStorage.setItem('lang', lang)
}

const handleLogin = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            if (loginForm.value.captcha !== captcha.value) {
                validateCaptcha()
            }
            loading.value = true
            try {
                const res = await login({ ...loginForm.value })
                if (!res.data.user.enabled) {
                    ElMessage.warning('该用户已被禁用')
                    loading.value = false
                    return
                }
                if (res.code === 200) {
                    ElMessage.success(res.message)
                    loading.value = false
                    if (loginForm.value.remember) {
                        localStorage.setItem(
                            'rememberedUser',
                            loginForm.value.username,
                        )
                    } else {
                        localStorage.removeItem('rememberedUser')
                    }
                    userInfo.userInfo = res.data.user
                    setTokenA(res.data.accessToken)
                    setTokenR(res.data.refreshToken)
                    await generateRoutes()
                    router.replace('/')
                } else {
                    ElMessage.error(res.message)
                    loading.value = false
                }
            } catch (err) {
                loading.value = false
                ElMessage.error('登录异常')
            }
        } else {
            console.log('error submit!', fields)
        }
    })
}

const showChangePwd = ref(false)
const pwdRef = ref<FormInstance>()
const pwdForm = ref({
    oldPwd: '',
    newPwd: '',
    confirmPwd: '',
})
const pwdRules = {
    oldPwd: [
        { required: true, message: '请输入旧密码', trigger: 'blur' },
        {
            min: 5,
            max: 15,
            message: '密码需为6-18位，包含字母和数字',
            trigger: 'blur',
        },
    ],
    newPwd: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        {
            min: 5,
            max: 15,
            message: '密码需为6-18位，包含字母和数字',
            trigger: 'blur',
        },
        {
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/,
            message: '新密码需为6-18位，包含字母和数字',
            trigger: 'blur',
        },
        {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            asyncValidator: (_: any, value: string) => {
                return value !== pwdForm.value.confirmPwd &&
                    pwdForm.value.confirmPwd
                    ? Promise.reject('两次输入密码不一致')
                    : Promise.resolve()
            },
            trigger: 'blur',
        },
    ],
    confirmPwd: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            asyncValidator: (_: any, value: string) => {
                return value !== pwdForm.value.newPwd
                    ? Promise.reject('两次输入密码不一致')
                    : Promise.resolve()
            },
            trigger: 'blur',
        },
    ],
}

const updatePwdDialog = () => {
    showChangePwd.value = true
}

const submitChangePwd = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid, fields) => {
        if (valid) {
            try {
                const res = await updatePassword({ ...pwdForm.value })
                if (res.code === 200) {
                    ElMessage.success(res.message)
                    formEl.resetFields()
                    showChangePwd.value = false
                } else {
                    ElMessage.error(res.message)
                }
            } catch (err) {}
        } else {
            console.log('error submit!', fields)
        }
    })
}
</script>

<style scoped></style>
