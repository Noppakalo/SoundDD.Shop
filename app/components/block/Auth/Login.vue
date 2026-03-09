<template>
    <UAuthForm
        :schema="schema"
        :fields="fields"
        :submit="{
            label: 'เข้าสู่ระบบ',
        }"
        @submit="onSubmit"
    >
        <template #password-hint>
            <ULink
                to="#"
                class="text-primary font-medium"
                tabindex="-1"
                @click.prevent="emit('forgot-password')"
                >ลืมรหัสผ่าน?</ULink
            >
        </template>
        <template #header>
            <div class="grid grid-cols-2 gap-3">
                <UButton
                    icon="i-custom-google"
                    block
                    class="text-primary border-primary hover:bg-primary border bg-white hover:text-white"
                    to="/api/auth/google"
                    external
                >
                    เข้าสู่ระบบด้วย Google</UButton
                >
                <UButton
                    icon="i-custom-facebook"
                    block
                    class="text-primary border-primary hover:bg-primary border bg-white hover:text-white"
                    to="/api/auth/facebook"
                    external
                    >เข้าสู่ระบบด้วย Facebook</UButton
                >
            </div>
        </template>
        <template #providers>
            <USeparator label="หรือ" />
        </template>
    </UAuthForm>
</template>

<script setup lang="ts">
import { object, string, boolean, type InferType } from 'yup'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

const isLoading = ref(false)
const { showAuthSuccess, showAuthError } = useAuthToast()
const { login } = useWpAuthApi()

const emit = defineEmits<{
    success: []
    close: []
    'forgot-password': []
}>()

const fields: AuthFormField[] = [
    {
        name: 'email',
        type: 'email',
        label: 'อีเมล์',
        placeholder: 'กรอกอีเมลของคุณ',
        required: true,
    },
    {
        name: 'password',
        type: 'password',
        label: 'รหัสผ่าน',
        placeholder: 'กรอกรหัสผ่านของคุณ',
        required: true,
    },
    {
        name: 'remember',
        label: 'จดจำฉันไว้',
        type: 'checkbox',
    },
]

const schema = ref(
    object({
        email: string()
            .email('รูปแบบอีเมลไม่ถูกต้อง')
            .required('กรุณากรอกอีเมลล์'),
        password: string()
            .min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัว')
            .required('กรุณากรอกรหัสผ่าน'),
        remember: boolean().optional(),
    })
)

type Schema = InferType<typeof schema.value>

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    isLoading.value = true
    try {
        const result = await login({
            email: event.data.email,
            password: event.data.password,
        })

        if (result.success) {
            showAuthSuccess(`ยินดีต้อนรับคุณ ${result.user?.name || ''}`)
            emit('success')
            emit('close')
        } else {
            showAuthError(result.error)
        }
    } catch (error) {
        showAuthError()
    } finally {
        isLoading.value = false
    }
}
</script>
