<template>
    <UAuthForm
        :schema="schema"
        :fields="fields"
        :submit="{
            label: 'สมัครสมาชิก',
            loading: isLoading,
        }"
        @submit="onSubmit"
    >
        <template #header>
            <div class="grid grid-cols-2 gap-3">
                <UButton
                    icon="i-custom-google"
                    block
                    class="text-primary border-primary hover:bg-primary border bg-white hover:text-white"
                    to="/api/auth/google"
                    external
                >
                    สมัครสมาชิกด้วย Google</UButton
                >
                <UButton
                    icon="i-custom-facebook"
                    block
                    class="text-primary border-primary hover:bg-primary border bg-white hover:text-white"
                    to="/api/auth/facebook"
                    external
                    >สมัครสมาชิกด้วย Facebook</UButton
                >
            </div>
        </template>
        <template #providers>
            <USeparator label="หรือ" />
        </template>
    </UAuthForm>
</template>

<script setup lang="ts">
import { object, string, ref as yupRef, type InferType } from 'yup'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

const isLoading = ref(false)
const { showRegisterSuccess, showRegisterError } = useAuthToast()
const { register } = useWpAuthApi()

const emit = defineEmits<{
    success: []
    'existing-user': []
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
        placeholder: 'ตั้งรหัสผ่าน 8 ตัวขึ้นไป',
        required: true,
    },
    {
        name: 'confirmPassword',
        type: 'password',
        label: 'ยืนยันรหัสผ่าน',
        placeholder: 'กรอกรหัสผ่านอีกครั้ง',
        required: true,
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
        confirmPassword: string()
            .oneOf([yupRef('password')], 'รหัสผ่านไม่ตรงกัน')
            .required('กรุณายืนยันรหัสผ่าน'),
    })
)

type Schema = InferType<typeof schema.value>

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    isLoading.value = true

    try {
        const result = await register({
            email: event.data.email,
            password: event.data.password,
        })
        if (result.success) {
            showRegisterSuccess()
            emit('success')
        } else {
            showRegisterError(result.error)

            if (result.statusCode === 409) {
                emit('existing-user')
            }
        }
    } catch (error: any) {
        showRegisterError(error.statusMessage || 'เกิดข้อผิดพลาดในการสมัครสมาชิก')
    } finally {
        isLoading.value = false
    }
}
</script>
