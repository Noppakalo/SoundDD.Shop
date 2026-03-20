<template>
    <UAuthForm
        :schema="schema"
        :fields="fields"
        :submit="{
            label: 'สมัครสมาชิก',
            loading: isLoading,
        }"
        @submit="onSubmit"
    />
</template>

<script setup lang="ts">
import { object, string, ref as yupRef, type InferType } from 'yup'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

const isLoading = ref(false)
const { showRegisterSuccess, showRegisterError } = useAuthToast()
const { register, login } = useWpAuthApi()

const emit = defineEmits(['success', 'close', 'existing-user'])

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

const schema = object({
    email: string().email('รูปแบบอีเมลไม่ถูกต้อง').required('กรุณากรอกอีเมลล์'),
    password: string()
        .min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัว')
        .required('กรุณากรอกรหัสผ่าน'),
    confirmPassword: string()
        .oneOf([yupRef('password')], 'รหัสผ่านไม่ตรงกัน')
        .required('กรุณายืนยันรหัสผ่าน'),
})

type Schema = InferType<typeof schema>

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    if (isLoading.value) return
    isLoading.value = true

    try {
        const result = await register({
            email: event.data.email,
            password: event.data.password,
        })

        if (result.success && result.jobId) {
            let attempts = 0
            const maxAttempts = 20

            const tryLogin = async () => {
                attempts++
                try {
                    const loginResult = await login({
                        email: event.data.email,
                        password: event.data.password,
                    })

                    if (loginResult.success) {
                        showRegisterSuccess()
                        emit('success')
                        emit('close')
                        isLoading.value = false
                        return
                    }
                } catch {}

                if (attempts < maxAttempts) {
                    setTimeout(tryLogin, 1500)
                } else {
                    isLoading.value = false
                    showRegisterError(
                        'การสมัครสมาชิกใช้เวลานานเกินไป กรุณาลองเข้าสู่ระบบด้วยอีเมลนี้'
                    )
                }
            }

            tryLogin()
        } else {
            isLoading.value = false
            showRegisterError(result.error || 'ไม่สามารถสมัครสมาชิกได้')
            if (result.statusCode === 409) emit('existing-user')
        }
    } catch (error: any) {
        isLoading.value = false
        showRegisterError(error.statusMessage || 'เกิดข้อผิดพลาดในการเชื่อมต่อ')
    }
}
</script>
