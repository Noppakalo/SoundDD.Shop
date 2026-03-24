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
                aria-label="ไปที่หน้าลืมรหัสผ่าน"
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
                    aria-label="เข้าสู่ระบบด้วยบัญชี Google"
                    external
                >
                    เข้าสู่ระบบด้วย Google</UButton
                >
                <UButton
                    icon="i-custom-facebook"
                    block
                    class="text-primary border-primary hover:bg-primary border bg-white hover:text-white"
                    to="/api/auth/facebook"
                    aria-label="เข้าสู่ระบบด้วยบัญชี Facebook"
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
import type { LoginResponse } from '~/types/auth'

const isLoading = ref(false)
const toast = useAppToast()

const { fetch } = useUserSession()

const emit = defineEmits<{
    success: []
    close: []
    'forgot-password': []
}>()

const fields: AuthFormField[] = [
    {
        name: 'email',
        type: 'email',
        label: 'อีเมล์์์',
        placeholder: 'กรอกอีเมล์์ของคุณ',
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
            .email('รูปแบบอีเมล์์ไม่ถูกต้อง')
            .required('กรุณากรอกอีเมล์์์'),
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
        const response = await $fetch<LoginResponse>('/api/auth/login', {
            method: 'POST',
            body: {
                email: event.data.email,
                password: event.data.password,
                remember: event.data.remember,
            },
        })
        await fetch()
        if (response.success) {
            toast.success('เข้าสู่ระบบสำเร็จ')
            emit('success')
            emit('close')
        } else {
            toast.error('เข้าสู่ระบบไม่สำเร็จ', 'อีเมล์์หรือรหัสผ่านไม่ถูกต้อง')
        }
    } catch (error: any) {
        const errorMessage =
            error.data?.message ||
            error.statusMessage ||
            'อีเมลหรือรหัสผ่านไม่ถูกต้อง'

        toast.error('เข้าสู่ระบบไม่สำเร็จ', errorMessage)
    } finally {
        isLoading.value = false
    }
}
</script>
