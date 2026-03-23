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
import type { RegisterResponse } from '~/types/auth'

const isLoading = ref(false)
const { fetch } = useUserSession()
const toast = useToast()

const emit = defineEmits(['success', 'close'])

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
    isLoading.value = true
    try {
        const response = await $fetch<RegisterResponse>('/api/auth/register', {
            method: 'POST',
            body: {
                email: event.data.email,
                password: event.data.password,
                confirmPassword: event.data.confirmPassword,
            },
        })
        await fetch()

        if (response.success) {
            toast.add({
                title: 'สมัครสมาชิกสำเร็จ',
                description: `ยินดีต้อนรับคุณ ${response.user?.name || ''}`,
                color: 'success',
            })
            emit('success')
            emit('close')
        } else {
            toast.add({
                title: 'สมัครสมาชิกไม่สำเร็จ',
                description: 'กรุณาลองใหม่อีกครั้ง',
                color: 'error',
            })
        }
    } catch (error: any) {
        const message = error.data?.statusMessage || 'สมัครสมาชิกไม่สำเร็จ'
        toast.add({
            title: 'เกิดข้อผิดพลาด',
            description: message,
            color: 'error',
        })
    } finally {
        isLoading.value = false
    }
}
</script>
